"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getCategories,
} from "@/lib/api";
import { Plus, Trash2, Filter } from "lucide-react";
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
      if (filterType) params.type = filterType;
      const [txRes, catRes] = await Promise.all([getTransactions(params), getCategories()]);
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

  const filteredCategories = categories.filter((c) => c.type === form.type);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <div className="flex gap-3">
          <select
            className="input w-auto"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" /> Add Transaction
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="card text-center py-16 text-gray-500">
          No transactions found. Add your first one!
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3">{format(new Date(tx.date), "dd MMM yyyy")}</td>
                  <td className="py-3">{tx.description || "—"}</td>
                  <td className="py-3">
                    {tx.category?.icon} {tx.category?.name}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td
                    className={`py-3 text-right font-semibold ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatMoney(tx.amount)}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDelete(tx._id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  className="input mt-1"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value, category: "" })}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  className="input mt-1"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                  min="0.01"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  className="input mt-1"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
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
              <div>
                <label className="text-sm font-medium">Description</label>
                <input
                  type="text"
                  className="input mt-1"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="input mt-1"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Payment Method</label>
                <select
                  className="input mt-1"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI / JazzCash / EasyPaisa</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn-secondary flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
