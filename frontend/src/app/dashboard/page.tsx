"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSummary, getByCategory, getTransactions } from "@/lib/api";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back, {user?.name}!</h1>
      <p className="text-gray-500 mb-6">Here&apos;s your financial overview for this month</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{formatMoney(summary.income)}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Expense</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{formatMoney(summary.expense)}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className={`text-2xl font-bold mt-1 ${summary.balance >= 0 ? "text-primary-600" : "text-red-600"}`}>
                {formatMoney(summary.balance)}
              </p>
            </div>
            <div className="p-3 bg-primary-50 rounded-full">
              <Wallet className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Expense by Category</h2>
          {byCategory.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No expenses yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={byCategory}
                  dataKey="total"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {byCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatMoney(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Recent Transactions</h2>
          {recent.length === 0 ? (
            <p className="text-gray-500 text-center py-12">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recent.map((tx) => (
                <div key={tx._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        tx.type === "income" ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description || tx.category?.name}</p>
                      <p className="text-xs text-gray-500">
                        {tx.category?.icon} {tx.category?.name} •{" "}
                        {format(new Date(tx.date), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold text-sm ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
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
