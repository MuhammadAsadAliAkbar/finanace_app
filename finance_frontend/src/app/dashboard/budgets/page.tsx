
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getBudgets,
  createBudget,
  deleteBudget,
  getCategories,
} from "@/lib/api";
import {
  Plus,
  Trash2,
  Target,
  X,
  WalletCards,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

export default function BudgetsPage() {
  const { user } = useAuth();

  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    category: "",
    amount: "",
    period: "monthly",
  });

  const fetchData = async () => {
    try {
      const [bRes, cRes] = await Promise.all([
        getBudgets(),
        getCategories({ type: "expense" }),
      ]);

      setBudgets(bRes.data.data);
      setCategories(cRes.data.data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: user?.currency || "PKR",
      maximumFractionDigits: 0,
    }).format(n);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createBudget({
        ...form,
        amount: parseFloat(form.amount),
      });

      toast.success("Budget created");
      setShowModal(false);

      setForm({
        category: "",
        amount: "",
        period: "monthly",
      });

      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this budget?")) return;

    try {
      await deleteBudget(id);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
              <Target className="h-4 w-4 text-primary-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Financial Planning
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Budgets
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Set spending limits and keep your expenses under control.
          </p>
        </div>

        <button
          className="btn-primary flex items-center justify-center gap-2 rounded-xl px-5 shadow-md shadow-primary-600/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus className="h-4 w-4" />
          Set Budget
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="card flex min-h-[360px] items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading budgets...
            </p>
          </div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="card rounded-2xl border border-gray-100 py-20 text-center shadow-sm">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
            <Target className="h-7 w-7 text-primary-600" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-900">
            No budgets set yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Create a budget to track your spending and stay within
            your financial limits.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 shadow-md"
          >
            <Plus className="h-4 w-4" />
            Create Your First Budget
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {budgets.map((b) => {
            const pct =
              b.amount > 0
                ? Math.min(100, (b.spent / b.amount) * 100)
                : 0;

            const over = b.spent > b.amount;
            const warning = !over && pct > 80;

            return (
              <div
                key={b._id}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
              >

                {/* Top Accent */}
                <div
                  className={`absolute left-0 right-0 top-0 h-1 ${
                    over
                      ? "bg-red-500"
                      : warning
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />

                {/* Card Header */}
                <div className="flex items-start justify-between">

                  <div className="flex min-w-0 items-center gap-3">

                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl"
                      style={{
                        backgroundColor: `${b.category?.color || "#3B82F6"}15`,
                      }}
                    >
                      {b.category?.icon || "📦"}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {b.category?.name || "Category"}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-gray-400" />

                        <span className="text-xs capitalize text-gray-400">
                          {b.period} budget
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(b._id)}
                    title="Delete budget"
                    className="rounded-lg p-2 text-gray-300 opacity-70 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Amount */}
                <div className="mt-6 flex items-end justify-between">

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Spent
                    </p>

                    <p
                      className={`mt-1 text-xl font-bold ${
                        over ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {formatMoney(b.spent)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Budget
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-600">
                      {formatMoney(b.amount)}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5">

                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Budget usage
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        over
                          ? "text-red-600"
                          : warning
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {pct.toFixed(0)}%
                    </span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        over
                          ? "bg-red-500"
                          : warning
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(100, pct)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 ${
                    over
                      ? "bg-red-50"
                      : warning
                      ? "bg-yellow-50"
                      : "bg-green-50"
                  }`}
                >
                  {over ? (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  ) : warning ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}

                  <span
                    className={`text-xs font-medium ${
                      over
                        ? "text-red-700"
                        : warning
                        ? "text-yellow-700"
                        : "text-green-700"
                    }`}
                  >
                    {over
                      ? `Over budget by ${formatMoney(
                          b.spent - b.amount
                        )}`
                      : warning
                      ? "Approaching budget limit"
                      : `${formatMoney(
                          b.amount - b.spent
                        )} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">

          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close modal"
            className="absolute inset-0 cursor-default"
            onClick={() => setShowModal(false)}
          />

          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">

              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <WalletCards className="h-5 w-5 text-primary-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Set Budget
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Create a spending limit for a category.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 p-6"
            >

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Category
                </label>

                <select
                  className="input"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Select category</option>

                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Budget Amount
                </label>

                <input
                  type="number"
                  className="input"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  required
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              {/* Period */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Period
                </label>

                <select
                  className="input"
                  value={form.period}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      period: e.target.value,
                    })
                  }
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 border-t border-gray-100 pt-5">

                <button
                  type="button"
                  className="btn-secondary flex-1 rounded-xl"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary flex-1 rounded-xl shadow-md shadow-primary-600/15 transition-all hover:-translate-y-0.5"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Budget
                  </span>
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

