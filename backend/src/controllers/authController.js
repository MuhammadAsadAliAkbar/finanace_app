const User = require('../models/User');
const Category = require('../models/Category');
const generateToken = require('../utils/generateToken');

const defaultCategories = [
  { name: 'Salary', type: 'income', icon: '💼', color: '#10B981' },
  { name: 'Freelance', type: 'income', icon: '💻', color: '#059669' },
  { name: 'Investment', type: 'income', icon: '📈', color: '#047857' },
  { name: 'Other Income', type: 'income', icon: '💰', color: '#065F46' },
  { name: 'Food & Dining', type: 'expense', icon: '🍔', color: '#EF4444' },
  { name: 'Transport', type: 'expense', icon: '🚗', color: '#F97316' },
  { name: 'Shopping', type: 'expense', icon: '🛍️', color: '#EC4899' },
  { name: 'Bills & Utilities', type: 'expense', icon: '💡', color: '#8B5CF6' },
  { name: 'Entertainment', type: 'expense', icon: '🎬', color: '#6366F1' },
  { name: 'Health', type: 'expense', icon: '🏥', color: '#14B8A6' },
  { name: 'Education', type: 'expense', icon: '📚', color: '#3B82F6' },
  { name: 'Rent', type: 'expense', icon: '🏠', color: '#F59E0B' },
  { name: 'Other Expense', type: 'expense', icon: '📦', color: '#6B7280' },
];

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      currency: currency || 'PKR',
    });

    // Create default categories
    const categories = defaultCategories.map((cat) => ({
      ...cat,
      user: user._id,
    }));
    await Category.insertMany(categories);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, currency } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, currency },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
