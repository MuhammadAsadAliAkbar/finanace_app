"use client";

import { useEffect, useState } from "react";
import { getCategories, createCategory, deleteCategory } from "@/lib/api";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", type: "expense", icon: "📦", color: "#3B82F6" });

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
      setForm({ name: "", type: "expense", icon: "📦", color: "#3B82F6" });
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

  const incomeCats = categories.filter((c) => c.type === "income");
  const expenseCats = categories.filter((c) => c.type === "expense");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="font-semibold text-green-700 mb-4">Income Categories</h2>
            <div className="space-y-2">
              {incomeCats.map((c) => (
                <div key={c._id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.icon}</span>
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {incomeCats.length === 0 && <p className="text-gray-400 text-sm">No income categories</p>}
            </div>
          </div>
          <div className="card">
            <h2 className="font-semibold text-red-700 mb-4">Expense Categories</h2>
            <div className="space-y-2">
              {expenseCats.map((c) => (
                <div key={c._id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{c.icon}</span>
                    <span className="font-medium">{c.name}</span>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></span>
                  </div>
                  <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {expenseCats.length === 0 && <p className="text-gray-400 text-sm">No expense categories</p>}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Add Category</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select className="input mt-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Icon (emoji)</label>
                <input className="input mt-1" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Color</label>
                <input type="color" className="input mt-1 h-10" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" className="btn-secondary flex-1" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary flex-1">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
