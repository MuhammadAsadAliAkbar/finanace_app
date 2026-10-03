import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const register = (data: { name: string; email: string; password: string; currency?: string }) =>
  api.post("/auth/register", data);

export const login = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const getMe = () => api.get("/auth/me");

// Transactions
export const getTransactions = (params?: any) => api.get("/transactions", { params });
export const createTransaction = (data: any) => api.post("/transactions", data);
export const updateTransaction = (id: string, data: any) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id: string) => api.delete(`/transactions/${id}`);
export const getSummary = (params?: any) => api.get("/transactions/stats/summary", { params });
export const getByCategory = (params?: any) => api.get("/transactions/stats/by-category", { params });

// Categories
export const getCategories = (params?: any) => api.get("/categories", { params });
export const createCategory = (data: any) => api.post("/categories", data);
export const updateCategory = (id: string, data: any) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);

// Budgets
export const getBudgets = () => api.get("/budgets");
export const createBudget = (data: any) => api.post("/budgets", data);
export const updateBudget = (id: string, data: any) => api.put(`/budgets/${id}`, data);
export const deleteBudget = (id: string) => api.delete(`/budgets/${id}`);

// Analytics (Python)
export const getInsights = (userId?: string) =>
  api.get("/analytics/insights", { params: { user_id: userId } });
