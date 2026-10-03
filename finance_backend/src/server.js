const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));

// Proxy to Python analytics service
app.get('/api/analytics/insights', async (req, res, next) => {
  try {
    const axios = require('axios');
    // For simplicity without extra dep, use fetch (Node 18+)
    const pythonUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';
    const response = await fetch(`${pythonUrl}/insights?user_id=${req.query.user_id || ''}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Python analytics service unavailable',
      data: {
        tip: 'Start the Python service on port 8000 for AI insights',
        sample: {
          savings_rate: 25,
          top_expense: 'Food & Dining',
          recommendation: 'Try reducing dining out by 20% to save more.',
        },
      },
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Finance Management API is running', timestamp: new Date() });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
