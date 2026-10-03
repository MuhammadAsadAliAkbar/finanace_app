
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getSummary,
  getByCategory,
  getTransactions,
} from "@/lib/api";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Receipt,
  CalendarDays,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#14b8a6",
];

export default function DashboardPage() {
  const { user } = useAuth();

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [byCategory, setByCategory] = useState<any[]>([]);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, catRes, txRes] = await Promise.all([
          getSummary(),
          getByCategory({ type: "expense" }),
          getTransactions({ limit: 5 }),
        ]);

        setSummary(sumRes.data.data);
        setByCategory(catRes.data.data);
        setRecent(txRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: user?.currency || "PKR",
      maximumFractionDigits: 0,
    }).format(n);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative flex h-14 w-14 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-100 border-t-primary-600" />
            <Wallet className="h-5 w-5 text-primary-600" />
          </div>

          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-violet-600 p-6 shadow-xl shadow-primary-600/15 sm:p-8">

        {/* Background decoration */}
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div>
            <div className="mb-2 flex items-center gap-2 text-white/80">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Financial Overview
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Welcome back, {user?.name}!
            </h1>

            <p className="mt-2 max-w-xl text-sm text-white/75">
              Keep track of your income, expenses and overall financial health.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <CalendarDays className="h-5 w-5 text-white/80" />

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-white/60">
                Current Period
              </p>
              <p className="text-sm font-semibold text-white">
                {format(new Date(), "MMMM yyyy")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Income */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-100/50">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-50 transition-transform duration-300 group-hover:scale-150" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Income
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                {formatMoney(summary.income)}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-green-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Money received</span>
              </div>
            </div>

            <div className="rounded-2xl bg-green-50 p-3.5">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Expense */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-100/50">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-50 transition-transform duration-300 group-hover:scale-150" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Expense
              </p>

              <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                {formatMoney(summary.expense)}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>Money spent</span>
              </div>
            </div>

            <div className="rounded-2xl bg-red-50 p-3.5">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/50">

          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-50 transition-transform duration-300 group-hover:scale-150" />

          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Current Balance
              </p>

              <p
                className={`mt-2 text-2xl font-bold tracking-tight ${
                  summary.balance >= 0
                    ? "text-gray-900"
                    : "text-red-600"
                }`}
              >
                {formatMoney(summary.balance)}
              </p>

              <div
                className={`mt-2 flex items-center gap-1.5 text-xs font-medium ${
                  summary.balance >= 0
                    ? "text-primary-600"
                    : "text-red-600"
                }`}
              >
                <Wallet className="h-3.5 w-3.5" />
                <span>
                  {summary.balance >= 0
                    ? "Available balance"
                    : "Negative balance"}
                </span>
              </div>
            </div>

            <div className="rounded-2xl bg-primary-50 p-3.5">
              <Wallet className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CHART + TRANSACTIONS
      ===================================================== */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Expense Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Expense by Category
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                See where your money is going
              </p>
            </div>

            <div className="rounded-xl bg-primary-50 p-2.5">
              <TrendingDown className="h-5 w-5 text-primary-600" />
            </div>
          </div>

          {byCategory.length === 0 ? (
            <div className="flex h-[280px] flex-col items-center justify-center">
              <div className="mb-3 rounded-2xl bg-gray-50 p-4">
                <Receipt className="h-7 w-7 text-gray-400" />
              </div>

              <p className="font-medium text-gray-700">
                No expenses yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Your expense breakdown will appear here
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={92}
                  innerRadius={55}
                  paddingAngle={3}
                  stroke="none"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {byCategory.map((entry, i) => (
                    <Cell
                      key={entry._id || entry.name || i}
                      fill={
                        entry.color ||
                        CHART_COLORS[i % CHART_COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number) => formatMoney(value)}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #f1f5f9",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your latest financial activity
              </p>
            </div>

            <div className="rounded-xl bg-indigo-50 p-2.5">
              <Receipt className="h-5 w-5 text-indigo-600" />
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="flex h-[280px] flex-col items-center justify-center">
              <div className="mb-3 rounded-2xl bg-gray-50 p-4">
                <Receipt className="h-7 w-7 text-gray-400" />
              </div>

              <p className="font-medium text-gray-700">
                No transactions yet
              </p>

              <p className="mt-1 text-sm text-gray-400">
                Your recent transactions will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((tx) => (
                <div
                  key={tx._id}
                  className="group flex items-center justify-between rounded-xl border border-transparent px-2 py-3 transition-all duration-200 hover:border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        tx.type === "income"
                          ? "bg-green-50"
                          : "bg-red-50"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {tx.description || tx.category?.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-400">
                        {tx.category?.icon}{" "}
                        {tx.category?.name || "Uncategorized"}{" "}
                        <span className="mx-1">•</span>
                        {format(
                          new Date(tx.date),
                          "dd MMM yyyy"
                        )}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`ml-3 shrink-0 text-sm font-bold ${
                      tx.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatMoney(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

