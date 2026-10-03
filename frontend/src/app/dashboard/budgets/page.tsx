"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getBudgets, createBudget, deleteBudget, getCategories } from "@/lib/api";
import { Plus, Trash2, Target } from "lucide-react";
import toast from "react-hot-toast";

export default function BudgetsPage() {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ category: "", amount: "", period: "monthly" });

  const fetchData = async () => {
    try {
      const [bRes, cRes] = await Promise.all([getBudgets(), getCategories({ type: "expense" })]);
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
      await createBudget({ ...form, amount: parseFloat(form.amount) });
      toast.success("Budget created");
      setShowModal(false);
      setForm({ category: "", amount: "", period: "monthly" });
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Set Budget
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="card text-center py-16 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          No budgets set yet. Create one to track spending!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((b) => {
            const pct = b.amount > 0 ? Math.min(100, (b.spent / b.amount) * 100) : 0;
            const over = b.spent > b.amount;
            return (
              <div key={b._id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{b.category?.icon}</span>
                    <span className="font-semibold">{b.category?.name}</span>
                  </div>
                  <button onClick={() => handleDelete(b._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 capitalize mb-2">{b.period} budget</p>
                <div className="flex justify-between text-sm mb-1">
                  <span className={over ? "text-red-600 font-medium" : "text-gray-600"}>
                    {formatMoney(b.spent)} spent
                  </span>
                  <span className="text-gray-500">of {formatMoney(b.amount)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${over ? "bg-red-500" : pct > 80 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
                <p className="text-xs mt-2 text-gray-500">{pct.toFixed(0)}% used</p>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Set Budget</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select className="input mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount</label>
                <input type="number" className="input mt-1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required min="1" />
              </div>
              <div>
                <label className="text-sm font-medium">Period</label>
                <select className="input mt-1" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn-secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
