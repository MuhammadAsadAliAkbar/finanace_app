
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getCategories,
} from "@/lib/api";
import {
  Plus,
  Trash2,
  Filter,
  X,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";

export default function TransactionsPage() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState("");

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
  });

  const fetchData = async () => {
    try {
      const params: any = { limit: 50 };

      if (filterType) {
        params.type = filterType;
      }

      const [txRes, catRes] = await Promise.all([
        getTransactions(params),
        getCategories(),
      ]);

      setTransactions(txRes.data.data);
      setCategories(catRes.data.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const formatMoney = (n: number) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: user?.currency || "PKR",
      maximumFractionDigits: 0,
    }).format(n);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createTransaction({
        ...form,
        amount: parseFloat(form.amount),
      });

      toast.success("Transaction added!");
      setShowModal(false);

      setForm({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "cash",
      });

      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this transaction?")) return;

    try {
      await deleteTransaction(id);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filteredCategories = categories.filter(
    (c) => c.type === form.type
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
              <Receipt className="h-4 w-4 text-primary-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Financial Activity
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Transactions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track your income and expenses.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          {/* Filter */}
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <select
              className="input w-full appearance-none pl-9 pr-9 sm:w-auto"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Add Button */}
          <button
            className="btn-primary flex items-center justify-center gap-2 rounded-xl px-5 shadow-md shadow-primary-600/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => setShowModal(true)}
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Transactions */}
      {loading ? (
        <div className="card flex min-h-[380px] items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600" />
            <p className="mt-4 text-sm text-gray-500">
              Loading transactions...
            </p>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="card rounded-2xl border border-gray-100 py-20 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
            <Receipt className="h-7 w-7 text-primary-600" />
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-900">
            No transactions found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Add your first transaction to start tracking your
            financial activity.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mt-6 inline-flex items-center gap-2 rounded-xl px-5 shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Transaction
          </button>
        </div>
      ) : (
        <div className="card overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-sm">

          {/* Table Top */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Transaction History
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Your latest financial records
              </p>
            </div>

            <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
              {transactions.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70 text-left">
                  <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Date
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Description
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Category
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Type
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Amount
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="group border-b border-gray-50 transition-colors last:border-0 hover:bg-gray-50/70"
                  >
                    {/* Date */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />

                        <span className="font-medium text-gray-600">
                          {format(
                            new Date(tx.date),
                            "dd MMM yyyy"
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="max-w-[240px] px-5 py-4">
                      <p className="truncate font-medium text-gray-800">
                        {tx.description || "No description"}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-600">
                        <span>{tx.category?.icon}</span>
                        {tx.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          tx.type === "income"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {tx.type === "income" ? (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5" />
                        )}

                        {tx.type}
                      </span>
                    </td>

                    {/* Amount */}
                    <td
                      className={`whitespace-nowrap px-5 py-4 text-right font-bold ${
                        tx.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatMoney(tx.amount)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleDelete(tx._id)}
                        title="Delete transaction"
                        className="rounded-lg p-2 text-gray-400 opacity-70 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

          <div className="relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/60 bg-white p-6 shadow-2xl">

            {/* Modal Header */}
            <div className="mb-6 flex items-start justify-between">

              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Plus className="h-5 w-5 text-primary-600" />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  Add Transaction
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add a new income or expense record.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Type */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Type
                </label>

                <select
                  className="input"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                      category: "",
                    })
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Amount
                </label>

                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  required
                  min="0.01"
                  placeholder="0.00"
                />
              </div>

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

                  {filteredCategories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <input
                  type="text"
                  className="input"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Optional"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Date
                </label>

                <input
                  type="date"
                  className="input"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Payment Method
                </label>

                <select
                  className="input"
                  value={form.paymentMethod}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentMethod: e.target.value,
                    })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="upi">
                    UPI / JazzCash / EasyPaisa
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 border-t border-gray-100 pt-4">

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
                  Add Transaction
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

