"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getInsights, getSummary, getByCategory } from "@/lib/api";
import { Lightbulb, TrendingUp, BarChart3, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<any>(null);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [byCategory, setByCategory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insRes, sumRes, catRes] = await Promise.all([
          getInsights(user?._id),
          getSummary(),
          getByCategory({ type: "expense" }),
        ]);
        setInsights(insRes.data.data || insRes.data);
        setSummary(sumRes.data.data);
        setByCategory(catRes.data.data.slice(0, 6));
      } catch (err) {
        console.error(err);
        // Fallback sample insights
        setInsights({
          savings_rate: 22,
          top_expense_category: "Food & Dining",
          tip: "Start the Python service for live AI insights. Meanwhile, try reducing discretionary spending.",
          recommendation: "Aim for a 20%+ savings rate every month.",
          score: 68,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: user?.currency || "PKR",
      maximumFractionDigits: 0,
    }).format(n);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Analytics & Insights</h1>
      <p className="text-gray-500 mb-6">Powered by Python FastAPI analytics service</p>

      {/* Score + Insights */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="card bg-gradient-to-br from-primary-600 to-indigo-600 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Financial Score</span>
          </div>
          <p className="text-4xl font-bold">{insights?.score ?? "—"}</p>
          <p className="text-sm opacity-80 mt-1">out of 100</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Savings Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{insights?.savings_rate ?? 0}%</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">Top Expense</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{insights?.top_expense_category || "—"}</p>
        </div>
      </div>

      {/* Tips */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="card border-l-4 border-yellow-400">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Smart Tip</h3>
              <p className="text-gray-600 text-sm">{insights?.tip || "Keep tracking regularly for better insights."}</p>
            </div>
          </div>
        </div>
        <div className="card border-l-4 border-primary-500">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-primary-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-1">Recommendation</h3>
              <p className="text-gray-600 text-sm">{insights?.recommendation || "Set budgets for your top spending categories."}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card">
        <h2 className="font-semibold text-lg mb-4">Expense Breakdown</h2>
        {byCategory.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Add some expenses to see charts</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={byCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => formatMoney(v)} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {byCategory.map((entry, i) => (
                  <Cell key={i} fill={entry.color || "#3B82F6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <p className="text-xs text-gray-400 mt-6 text-center">
        Analytics generated by Python FastAPI service • Start it with:{" "}
        <code className="bg-gray-100 px-1 rounded">cd python-service && uvicorn app.main:app --reload</code>
      </p>
    </div>
  );
}
