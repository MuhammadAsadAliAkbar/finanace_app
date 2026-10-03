from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random
from datetime import datetime, timedelta

app = FastAPI(
    title="Finance Analytics Service",
    description="Python-based analytics and insights for Finance Management System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TransactionInput(BaseModel):
    amount: float
    type: str  # income / expense
    category: str
    date: Optional[str] = None


class InsightRequest(BaseModel):
    transactions: List[TransactionInput]
    currency: str = "PKR"


@app.get("/")
def root():
    return {
        "service": "Finance Analytics (Python)",
        "status": "running",
        "endpoints": ["/insights", "/forecast", "/health"],
    }


@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/insights")
def get_insights(user_id: Optional[str] = Query(None)):
    """
    Generate sample financial insights.
    In production this would pull real data from MongoDB or receive transactions.
    """
    tips = [
        "You spent 35% more on Food this month compared to last month. Consider meal planning.",
        "Great job! Your savings rate improved by 8% this month.",
        "Transport costs are high. Try carpooling or public transport 2 days a week.",
        "You have 3 subscriptions that you haven't used recently. Review them.",
        "Your largest expense category is Bills. Look for cheaper plans.",
        "Setting a weekly budget for Entertainment can help you save more.",
    ]

    recommendations = [
        "Aim to save at least 20% of your income every month.",
        "Build an emergency fund covering 3-6 months of expenses.",
        "Track every small expense for 30 days to find hidden leaks.",
        "Automate savings transfers on salary day.",
        "Review and cancel unused subscriptions.",
    ]

    return {
        "success": True,
        "data": {
            "savings_rate": round(random.uniform(15, 40), 1),
            "top_expense_category": random.choice(
                ["Food & Dining", "Transport", "Shopping", "Bills & Utilities", "Entertainment"]
            ),
            "monthly_trend": random.choice(["increasing", "decreasing", "stable"]),
            "tip": random.choice(tips),
            "recommendation": random.choice(recommendations),
            "score": random.randint(55, 95),
            "generated_at": datetime.utcnow().isoformat(),
            "user_id": user_id,
        },
    }


@app.post("/insights/analyze")
def analyze_transactions(payload: InsightRequest):
    """Analyze provided transactions and return insights."""
    incomes = [t.amount for t in payload.transactions if t.type == "income"]
    expenses = [t.amount for t in payload.transactions if t.type == "expense"]

    total_income = sum(incomes) if incomes else 0
    total_expense = sum(expenses) if expenses else 0
    balance = total_income - total_expense
    savings_rate = (balance / total_income * 100) if total_income > 0 else 0

    # Category breakdown
    from collections import defaultdict
    cat_totals = defaultdict(float)
    for t in payload.transactions:
        if t.type == "expense":
            cat_totals[t.category] += t.amount

    top_expense = max(cat_totals.items(), key=lambda x: x[1]) if cat_totals else ("N/A", 0)

    tip = "Keep tracking your expenses regularly."
    if savings_rate < 10:
        tip = "Your savings rate is low. Try the 50/30/20 rule (Needs/Wants/Savings)."
    elif savings_rate > 30:
        tip = "Excellent savings rate! Consider investing the surplus."

    return {
        "success": True,
        "data": {
            "total_income": total_income,
            "total_expense": total_expense,
            "balance": balance,
            "savings_rate": round(savings_rate, 2),
            "top_expense_category": top_expense[0],
            "top_expense_amount": top_expense[1],
            "transaction_count": len(payload.transactions),
            "currency": payload.currency,
            "tip": tip,
            "recommendation": "Review your top spending category and set a monthly limit.",
            "score": min(100, max(0, int(savings_rate * 2 + 30))),
        },
    }


@app.get("/forecast")
def simple_forecast(months: int = Query(3, ge=1, le=12)):
    """Simple linear forecast based on random baseline (demo)."""
    base_income = 80000
    base_expense = 55000
    forecasts = []
    for i in range(1, months + 1):
        income = base_income * (1 + random.uniform(-0.05, 0.08))
        expense = base_expense * (1 + random.uniform(-0.03, 0.1))
        forecasts.append(
            {
                "month": i,
                "predicted_income": round(income, 2),
                "predicted_expense": round(expense, 2),
                "predicted_balance": round(income - expense, 2),
            }
        )
    return {"success": True, "data": forecasts}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
