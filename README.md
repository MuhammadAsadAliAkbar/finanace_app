# 💰 Finance Management System

Complete full-stack Finance Management Application built with:

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Frontend     | **Next.js 14** + TypeScript + Tailwind CSS + Recharts |
| Backend API  | **Node.js** + **Express.js** + **MongoDB** (Mongoose) |
| Analytics    | **Python** (FastAPI)                |

## Features

- ✅ User Authentication (JWT)
- ✅ Income & Expense Tracking
- ✅ Categories Management (default categories on signup)
- ✅ Budget Setting & Progress Tracking
- ✅ Dashboard with Charts (Pie + Bar)
- ✅ Monthly Summary (Income / Expense / Balance)
- ✅ Category-wise breakdown
- ✅ Python-powered AI Insights & Recommendations
- ✅ Responsive modern UI

## Project Structure

```
finance-management-system/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/                # Next.js App
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── context/
│   │   └── lib/
│   └── package.json
├── python-service/          # FastAPI Analytics
│   ├── app/main.py
│   ├── requirements.txt
│   └── run.py
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.10+
- npm / pip

## Setup & Run

### 1. MongoDB
Make sure MongoDB is running:
```bash
# Local
mongod
# Or use MongoDB Atlas connection string in backend/.env
```

### 2. Backend (Port 5000)
```bash
cd backend
cp .env.example .env          # edit JWT_SECRET & MONGODB_URI if needed
npm install
npm run dev
```

### 3. Python Analytics Service (Port 8000)
```bash
cd python-service
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
python run.py
# or: uvicorn app.main:app --reload --port 8000
```

### 4. Frontend (Port 3000)
```bash
cd frontend
npm install
# Create .env.local if needed:
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

Open **http://localhost:3000**

## Default Flow

1. Register a new account → default categories are created automatically
2. Add Income / Expense transactions
3. Set Budgets for expense categories
4. View Dashboard charts & Analytics insights

## API Endpoints (Backend)

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | /api/auth/register              | Register                 |
| POST   | /api/auth/login                 | Login                    |
| GET    | /api/auth/me                    | Current user             |
| GET    | /api/transactions               | List transactions        |
| POST   | /api/transactions               | Create transaction       |
| GET    | /api/transactions/stats/summary | Monthly summary          |
| GET    | /api/categories                 | List categories          |
| GET    | /api/budgets                    | List budgets             |
| GET    | /api/analytics/insights         | Proxy to Python service  |

## Python Service Endpoints

| Method | Endpoint              | Description                |
|--------|-----------------------|----------------------------|
| GET    | /insights             | Random smart insights      |
| POST   | /insights/analyze     | Analyze given transactions |
| GET    | /forecast             | Simple forecast            |

## Environment Variables

**backend/.env**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/finance_management
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PYTHON_SERVICE_URL=http://localhost:8000
```

**frontend/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Tech Stack Summary

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Recharts, Lucide Icons, Axios, React Hot Toast
- **Backend**: Express.js, Mongoose, JWT, bcryptjs, Helmet, Morgan, express-validator
- **Database**: MongoDB
- **Analytics**: Python FastAPI + Pydantic

---

Made with ❤️ for learning full-stack development.
# finanace_app
