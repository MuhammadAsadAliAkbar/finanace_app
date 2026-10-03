"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
Wallet,
TrendingUp,
PieChart,
Shield,
ArrowRight,
Sparkles,
CheckCircle2,
} from "lucide-react";

export default function Home() {
const { user, loading } = useAuth();
const router = useRouter();

useEffect(() => {
if (!loading && user) router.push("/dashboard");
}, [user, loading, router]);

if (loading) {
return ( <div className="min-h-screen bg-white flex items-center justify-center"> <div className="relative"> <div className="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin" /> <Wallet className="absolute inset-0 m-auto w-5 h-5 text-primary-600" /> </div> </div>
);
}

return ( <div className="min-h-screen bg-white text-gray-900 overflow-hidden">
{/* Background decoration */} <div className="pointer-events-none fixed inset-0 -z-10"> <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary-100/50 blur-3xl" /> <div className="absolute top-20 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-3xl" /> <div className="absolute top-[650px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-primary-50 blur-3xl" /> </div>


  {/* Navbar */}
  <nav className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/75 backdrop-blur-xl">
    <div className="container mx-auto px-5 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 group"
      >
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/20 transition-transform duration-300 group-hover:scale-105">
          <Wallet className="w-5 h-5" strokeWidth={2.3} />
        </div>

        <div>
          <div className="text-[17px] font-bold tracking-tight text-gray-900">
            FinanceManager
          </div>
          <div className="text-[9px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
            Smart Finance
          </div>
        </div>
      </Link>

      {/* Auth buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/login"
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all"
        >
          Login
        </Link>

        <Link
          href="/register"
          className="group flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-lg shadow-gray-900/10 hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
        >
          Get Started
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  </nav>

  {/* Hero */}
  <main>
    <section className="container mx-auto px-5 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-16">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 mb-7 rounded-full border border-primary-100 bg-primary-50/80 text-primary-700 text-xs sm:text-sm font-semibold shadow-sm">
          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 text-white">
            <Sparkles className="w-3 h-3" />
          </span>
          Smart & AI-Powered Finance Management
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-gray-950">
          Take Control of
          <br />
          Your{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 bg-clip-text text-transparent">
              Finances
            </span>

            <span className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 opacity-20" />
          </span>
        </h1>

        {/* Description */}
        <p className="mt-7 max-w-2xl mx-auto text-base sm:text-lg leading-8 text-gray-600">
          Track income & expenses, set budgets, get AI-powered insights
          powered by Python, and manage your money smarter with our
          complete Finance Management System.
        </p>

        {/* CTA */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-base font-bold shadow-xl shadow-primary-600/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-600/25 transition-all"
          >
            Start Free
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl border border-gray-200 bg-white/80 text-gray-700 text-base font-semibold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Already have an account?
          </Link>
        </div>

        {/* Trust points */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Easy to use
          </div>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Smart analytics
          </div>

          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Secure platform
          </div>
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="max-w-5xl mx-auto mt-16 sm:mt-20">
        <div className="relative">
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-200/40 via-indigo-200/30 to-primary-200/40 blur-2xl rounded-[2rem]" />

          {/* Preview */}
          <div className="relative rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-900/10 overflow-hidden">
            {/* Browser bar */}
            <div className="h-11 border-b border-gray-100 bg-gray-50/80 flex items-center px-4 gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-300" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-300" />

              <div className="hidden sm:flex mx-auto w-1/2 h-6 rounded-md bg-white border border-gray-200 items-center justify-center">
                <span className="text-[10px] text-gray-400">
                  app.finance-manager.com/dashboard
                </span>
              </div>
            </div>

            {/* Mock dashboard */}
            <div className="p-4 sm:p-7 bg-gray-50/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Balance */}
                <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Total Balance
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Wallet className="w-4 h-4 text-primary-600" />
                    </div>
                  </div>

                  <div className="mt-4 text-2xl font-bold text-gray-900">
                    $24,580
                  </div>

                  <div className="mt-2 text-xs text-emerald-600 font-semibold">
                    +12.8% this month
                  </div>
                </div>

                {/* Income */}
                <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Income
                    </span>

                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>

                  <div className="mt-4 text-2xl font-bold text-gray-900">
                    $8,420
                  </div>

                  <div className="mt-2 text-xs text-emerald-600 font-semibold">
                    +8.4% this month
                  </div>
                </div>

                {/* Expenses */}
                <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">
                      Expenses
                    </span>

                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <PieChart className="w-4 h-4 text-indigo-600" />
                    </div>
                  </div>

                  <div className="mt-4 text-2xl font-bold text-gray-900">
                    $3,240
                  </div>

                  <div className="mt-2 text-xs text-gray-500 font-semibold">
                    Within your budget
                  </div>
                </div>
              </div>

              {/* Chart placeholder */}
              <div className="mt-4 rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Financial Overview
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Your monthly spending activity
                    </p>
                  </div>

                  <div className="px-3 py-1.5 rounded-lg bg-gray-50 text-[10px] font-semibold text-gray-500">
                    Last 6 months
                  </div>
                </div>

                <div className="h-32 flex items-end gap-2 sm:gap-4">
                  {[35, 52, 42, 72, 58, 88, 67, 94, 76, 82, 68, 96].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex-1 flex items-end h-full"
                      >
                        <div
                          style={{ height: `${height}%` }}
                          className="w-full rounded-t-md bg-gradient-to-t from-primary-600 to-primary-400 opacity-80"
                        />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="border-y border-gray-100 bg-gray-50/60">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-bold mb-3">
            <Sparkles className="w-4 h-4" />
            Powerful Features
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Everything you need to manage money
          </h2>

          <p className="mt-4 text-gray-500">
            Simple tools and intelligent insights designed to make
            financial management easier.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Track */}
          <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 mb-5 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Track Everything
            </h3>

            <p className="text-sm leading-6 text-gray-500">
              Record income and expenses with categories, payment methods,
              and tags.
            </p>

            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              Complete transaction tracking
            </div>
          </div>

          {/* Budgets */}
          <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-5 group-hover:scale-105 transition-transform">
              <PieChart className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2">
              Smart Budgets
            </h3>

            <p className="text-sm leading-6 text-gray-500">
              Set monthly budgets and get alerts when you are close to
              limits.
            </p>

            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
              Stay within your limits
            </div>
          </div>

          {/* AI */}
          <div className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mb-5 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>

            <h3 className="font-bold text-lg text-gray-900 mb-2">
              AI Insights
            </h3>

            <p className="text-sm leading-6 text-gray-500">
              Python-powered analytics give you personalized financial
              tips.
            </p>

            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
              Intelligent financial insights
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="container mx-auto px-5 sm:px-6 lg:px-8 py-14">
      <div className="flex flex-col items-center text-center">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400 mb-4">
          Built with modern technology
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {[
            "Next.js",
            "Node.js",
            "Express",
            "MongoDB",
            "Python",
            "FastAPI",
          ].map((tech) => (
            <span
              key={tech}
              className="px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-600 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-gray-100">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Wallet className="w-4 h-4 text-primary-600" />
          FinanceManager
        </div>

        <p className="text-xs text-gray-400">
          Smart financial management made simple.
        </p>
      </div>
    </footer>
  </main>
</div>


);
}
