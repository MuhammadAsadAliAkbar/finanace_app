"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Wallet, TrendingUp, PieChart, Shield } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-indigo-50">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 text-2xl font-bold text-primary-700">
          <Wallet className="w-8 h-8" />
          FinanceManager
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary">
            Login
          </Link>
          <Link href="/register" className="btn-primary">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Take Control of Your
          <span className="text-primary-600"> Finances</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Track income & expenses, set budgets, get AI-powered insights powered by Python,
          and manage your money smarter with our complete Finance Management System.
        </p>
        <Link href="/register" className="btn-primary text-lg px-8 py-3 inline-block">
          Start Free →
        </Link>

        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
          <div className="card text-left">
            <TrendingUp className="w-10 h-10 text-green-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Track Everything</h3>
            <p className="text-gray-600 text-sm">
              Record income and expenses with categories, payment methods, and tags.
            </p>
          </div>
          <div className="card text-left">
            <PieChart className="w-10 h-10 text-blue-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Smart Budgets</h3>
            <p className="text-gray-600 text-sm">
              Set monthly budgets and get alerts when you are close to limits.
            </p>
          </div>
          <div className="card text-left">
            <Shield className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">AI Insights</h3>
            <p className="text-gray-600 text-sm">
              Python-powered analytics give you personalized financial tips.
            </p>
          </div>
        </div>

        <p className="mt-16 text-sm text-gray-500">
          Built with Next.js • Node.js + Express • MongoDB • Python FastAPI
        </p>
      </main>
    </div>
  );
}
