
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getInsights, getSummary, getByCategory } from "@/lib/api";
import {
  Lightbulb,
  TrendingUp,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  Wallet,
  Target,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  const { user } = useAuth();

  const [insights, setInsights] = useState<any>(null);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
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

    if (user) fetchData();
  }, [user]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: user?.currency || "PKR",
      maximumFractionDigits: 0,
    }).format(n);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-4 h-4 text-primary-600" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Preparing your financial insights...
          </p>
        </div>
      </div>
    );
  }

  const score = insights?.score ?? 0;
  const savingsRate = insights?.savings_rate ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              AI Powered Analytics
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Analytics & Insights
            </h1>

            <p className="text-gray-500 mt-2 max-w-2xl">
              Understand your financial health, spending patterns and savings
              performance with intelligent insights.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-gray-700">
              Analytics Service
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-600 font-semibold">
              Active
            </span>
          </div>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

          {/* Financial Score */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-600 via-indigo-600 to-violet-700 p-5 text-white shadow-lg shadow-primary-200/50">
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-white/10" />
            <div className="absolute -right-12 bottom-[-40px] w-32 h-32 rounded-full bg-white/5" />

            <div className="relative">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-white/15 backdrop-blur-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white/80">
                    Financial Score
                  </span>
                </div>

                <ArrowUpRight className="w-5 h-5 text-white/60" />
              </div>

              <div className="flex items-end gap-2">
                <p className="text-4xl font-bold tracking-tight">
                  {score}
                </p>
                <span className="text-sm text-white/60 mb-1">
                  / 100
                </span>
              </div>

              <div className="mt-4 h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${Math.min(score, 100)}%` }}
                />
              </div>

              <p className="text-xs text-white/70 mt-2">
                Overall financial health
              </p>
            </div>
          </div>

          {/* Savings Rate */}
          <div className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="p-2.5 rounded-xl bg-emerald-50">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                Healthy
              </span>
            </div>

            <p className="text-sm font-medium text-gray-500">
              Savings Rate
            </p>

            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-bold text-gray-900">
                {savingsRate}%
              </p>
              <span className="text-xs text-gray-400 mb-1">
                monthly
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.min(Math.max(savingsRate, 0), 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Top Expense */}
          <div className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="p-2.5 rounded-xl bg-orange-50">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>

              <Target className="w-4 h-4 text-gray-300" />
            </div>

            <p className="text-sm font-medium text-gray-500">
              Top Expense
            </p>

            <p className="text-xl font-bold text-gray-900 mt-2 truncate">
              {insights?.top_expense_category || "—"}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Highest spending category
            </p>
          </div>

          {/* Balance */}
          <div className="group bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="flex items-center justify-between mb-5">
              <div className="p-2.5 rounded-xl bg-blue-50">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>

              <span className="text-xs font-semibold text-gray-400">
                Current
              </span>
            </div>

            <p className="text-sm font-medium text-gray-500">
              Available Balance
            </p>

            <p className="text-2xl font-bold text-gray-900 mt-2 truncate">
              {formatMoney(summary?.balance || 0)}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Based on your tracked transactions
            </p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid lg:grid-cols-2 gap-5 mb-6">

          {/* Smart Tip */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-2xl opacity-70" />

            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-yellow-50 border border-yellow-100 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">
                    Smart Tip
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                    AI
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {insights?.tip ||
                    "Keep tracking regularly for better insights."}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-2xl opacity-70" />

            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-600" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">
                    Recommendation
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                    AI
                  </span>
                </div>

                <p className="text-sm leading-6 text-gray-600">
                  {insights?.recommendation ||
                    "Set budgets for your top spending categories."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 pt-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary-600" />
                </div>

                <h2 className="font-bold text-lg text-gray-900">
                  Expense Breakdown
                </h2>
              </div>

              <p className="text-sm text-gray-400 mt-2 ml-11">
                Your highest spending categories
              </p>
            </div>

            {byCategory.length > 0 && (
              <div className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-xs font-medium text-gray-500">
                Top {byCategory.length} categories
              </div>
            )}
          </div>

          <div className="px-4 sm:px-6 pb-6 pt-4">
            {byCategory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-gray-300" />
                </div>

                <p className="font-semibold text-gray-700">
                  No expense data yet
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Add some expenses to see your spending breakdown.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={byCategory}
                  margin={{
                    top: 15,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                  barCategoryGap="25%"
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="#f1f5f9"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#64748b",
                    }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#94a3b8",
                    }}
                    tickFormatter={(value) =>
                      `${user?.currency === "PKR" ? "₨" : ""}${value}`
                    }
                  />

                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e5e7eb",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                      padding: "10px 14px",
                    }}
                    labelStyle={{
                      color: "#111827",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                    formatter={(v: number) => formatMoney(v)}
                  />

                  <Bar
                    dataKey="total"
                    radius={[8, 8, 2, 2]}
                    maxBarSize={55}
                  >
                    {byCategory.map((entry, i) => (
                      <Cell
                        key={i}
                        fill={entry.color || "#6366F1"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Analytics generated by Python FastAPI service
            </span>
          </div>

          <span className="hidden sm:block">•</span>

          <code className="px-2 py-1 rounded-md bg-gray-100 text-gray-500">
            cd python-service && uvicorn app.main:app --reload
          </code>
        </div>
      </div>
    </div>
  );
}

