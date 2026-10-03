const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

// @desc    Get all transactions
// @route   GET /api/transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 20, search } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const transactions = await Transaction.find(query)
      .populate('category', 'name icon color type')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
exports.getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('category', 'name icon color type');

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Create transaction
// @route   POST /api/transactions
exports.createTransaction = async (req, res, next) => {
  try {
    const { type, amount, category, description, date, paymentMethod, tags, isRecurring } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
      paymentMethod,
      tags,
      isRecurring,
    });

    // Update budget spent if expense
    if (type === 'expense') {
      const budget = await Budget.findOne({
        user: req.user._id,
        category,
        period: 'monthly',
      });
      if (budget) {
        budget.spent += amount;
        await budget.save();
      }
    }

    const populated = await transaction.populate('category', 'name icon color type');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
exports.updateTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name icon color type');

    res.json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Adjust budget
    if (transaction.type === 'expense') {
      const budget = await Budget.findOne({
        user: req.user._id,
        category: transaction.category,
        period: 'monthly',
      });
      if (budget) {
        budget.spent = Math.max(0, budget.spent - transaction.amount);
        await budget.save();
      }
    }

    await transaction.deleteOne();
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get summary stats
// @route   GET /api/transactions/stats/summary
exports.getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { user: req.user._id };

    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    } else {
      // Current month by default
      const now = new Date();
      match.date = {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
        $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      };
    }

    const stats = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    const income = stats.find((s) => s._id === 'income') || { total: 0, count: 0 };
    const expense = stats.find((s) => s._id === 'expense') || { total: 0, count: 0 };

    res.json({
      success: true,
      data: {
        income: income.total,
        expense: expense.total,
        balance: income.total - expense.total,
        incomeCount: income.count,
        expenseCount: expense.count,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category-wise breakdown
// @route   GET /api/transactions/stats/by-category
exports.getByCategory = async (req, res, next) => {
  try {
    const { type = 'expense', startDate, endDate } = req.query;
    const match = { user: req.user._id, type };

    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const result = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 1,
          total: 1,
          count: 1,
          name: '$category.name',
          icon: '$category.icon',
          color: '$category.color',
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
