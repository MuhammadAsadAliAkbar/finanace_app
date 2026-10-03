
"use client";

import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "@/lib/api";
import {
  Plus,
  Trash2,
  X,
  Tags,
  ArrowUpRight,
  ArrowDownRight,
  Palette,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "expense",
    icon: "📦",
    color: "#3B82F6",
  });

  const fetchData = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCategory(form);

      toast.success("Category created");
      setShowModal(false);

      setForm({
        name: "",
        type: "expense",
        icon: "📦",
        color: "#3B82F6",
      });

      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      toast.success("Deleted");
      fetchData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const incomeCats = categories.filter(
    (c) => c.type === "income"
  );

  const expenseCats = categories.filter(
    (c) => c.type === "expense"
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="mb-1 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50">
              <Tags className="h-4 w-4 text-primary-600" />
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Organization
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Organize your income and expenses with custom categories.
          </p>
        </div>

        <button
          className="btn-primary flex items-center justify-center gap-2 rounded-xl px-5 shadow-md shadow-primary-600/15 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          onClick={() => setShowModal(true)}
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="card flex min-h-[360px] items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary-600" />

            <p className="mt-4 text-sm text-gray-500">
              Loading categories...
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">

          {/* Income Categories */}
          <div className="card overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-sm">

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Income Categories
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Money coming in
                  </p>
                </div>
              </div>

              <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                {incomeCats.length}
              </span>
            </div>

            {/* List */}
            <div className="p-4">
              {incomeCats.length > 0 ? (
                <div className="space-y-1">
                  {incomeCats.map((c) => (
                    <div
                      key={c._id}
                      className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-3 transition-all duration-200 hover:border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                          style={{
                            backgroundColor: `${c.color || "#22C55E"}15`,
                          }}
                        >
                          {c.icon}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800">
                            {c.name}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor:
                                  c.color || "#22C55E",
                              }}
                            />

                            <span className="text-[11px] text-gray-400">
                              Income
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(c._id)}
                        title="Delete category"
                        className="ml-3 rounded-lg p-2 text-gray-300 opacity-70 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                    <ArrowUpRight className="h-5 w-5 text-gray-300" />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-500">
                    No income categories
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Add one to organize your income.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Expense Categories */}
          <div className="card overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-sm">

            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <ArrowDownRight className="h-5 w-5 text-red-600" />
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Expense Categories
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    Money going out
                  </p>
                </div>
              </div>

              <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                {expenseCats.length}
              </span>
            </div>

            {/* List */}
            <div className="p-4">
              {expenseCats.length > 0 ? (
                <div className="space-y-1">
                  {expenseCats.map((c) => (
                    <div
                      key={c._id}
                      className="group flex items-center justify-between rounded-xl border border-transparent px-3 py-3 transition-all duration-200 hover:border-gray-100 hover:bg-gray-50"
                    >
                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
                          style={{
                            backgroundColor: `${c.color || "#EF4444"}15`,
                          }}
                        >
                          {c.icon}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-800">
                            {c.name}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5">
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{
                                backgroundColor:
                                  c.color || "#EF4444",
                              }}
                            />

                            <span className="text-[11px] text-gray-400">
                              Expense
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(c._id)}
                        title="Delete category"
                        className="ml-3 rounded-lg p-2 text-gray-300 opacity-70 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                    <ArrowDownRight className="h-5 w-5 text-gray-300" />
                  </div>

                  <p className="mt-3 text-sm font-medium text-gray-500">
                    No expense categories
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Add one to organize your expenses.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
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
                  <Tags className="h-5 w-5 text-primary-600" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Add Category
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Create a custom income or expense category.
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

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Name
                </label>

                <input
                  className="input"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g. Groceries"
                  required
                />
              </div>

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
                    })
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Icon */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Icon
                </label>

                <div className="relative">
                  <input
                    className="input pr-12"
                    value={form.icon}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        icon: e.target.value,
                      })
                    }
                    placeholder="📦"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xl">
                    {form.icon || "📦"}
                  </span>
                </div>

                <p className="mt-1.5 text-xs text-gray-400">
                  Use an emoji such as 🍔, 💰, 🏠 or 🚗.
                </p>
              </div>

              {/* Color */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                  Color
                </label>

                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200"
                    style={{
                      backgroundColor: `${form.color}18`,
                    }}
                  >
                    <Palette
                      className="h-4 w-4"
                      style={{
                        color: form.color,
                      }}
                    />
                  </div>

                  <input
                    type="color"
                    className="h-10 w-full cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
                    value={form.color}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        color: e.target.value,
                      })
                    }
                  />

                  <span className="w-20 text-right font-mono text-xs text-gray-400">
                    {form.color}
                  </span>
                </div>
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
                    Add Category
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

