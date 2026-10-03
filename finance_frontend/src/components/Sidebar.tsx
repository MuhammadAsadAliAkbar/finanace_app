"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
LayoutDashboard,
ArrowLeftRight,
Tags,
Target,
BarChart3,
LogOut,
Wallet,
ChevronRight,
} from "lucide-react";
import clsx from "clsx";

const links = [
{
href: "/dashboard",
label: "Dashboard",
icon: LayoutDashboard,
},
{
href: "/dashboard/transactions",
label: "Transactions",
icon: ArrowLeftRight,
},
{
href: "/dashboard/categories",
label: "Categories",
icon: Tags,
},
{
href: "/dashboard/budgets",
label: "Budgets",
icon: Target,
},
{
href: "/dashboard/analytics",
label: "Analytics",
icon: BarChart3,
},
];

export default function Sidebar() {
const pathname = usePathname();
const { user, logout } = useAuth();

const getInitials = () => {
if (!user?.name) return "U";


return user.name
  .split(" ")
  .map((word) => word[0])
  .join("")
  .slice(0, 2)
  .toUpperCase();


};

return ( <aside className="w-64 min-h-screen bg-white border-r border-gray-200/80 flex flex-col shadow-[4px_0_24px_rgba(15,23,42,0.03)]">
{/* Logo */} <div className="px-5 py-5 border-b border-gray-100"> <Link
       href="/dashboard"
       className="flex items-center gap-3 group"
     > <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-600/20 transition-transform duration-300 group-hover:scale-105"> <Wallet className="w-5 h-5" strokeWidth={2.3} />


        <div className="absolute inset-0 rounded-xl bg-white/10" />
      </div>

      <div>
        <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
          FinanceManager
        </h1>
        <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400 font-semibold">
          Personal Finance
        </p>
      </div>
    </Link>
  </div>

  {/* Navigation */}
  <nav className="flex-1 px-3 py-5">
    <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
      Overview
    </p>

    <div className="space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary-50 text-primary-700 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {/* Active indicator */}
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary-600" />
            )}

            <span
              className={clsx(
                "flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200",
                active
                  ? "bg-white text-primary-600 shadow-sm"
                  : "bg-transparent text-gray-500 group-hover:bg-white group-hover:text-gray-700 group-hover:shadow-sm"
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
            </span>

            <span className="flex-1">{link.label}</span>

            <ChevronRight
              className={clsx(
                "w-4 h-4 transition-all duration-200",
                active
                  ? "opacity-100 translate-x-0 text-primary-500"
                  : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-gray-400"
              )}
            />
          </Link>
        );
      })}
    </div>
  </nav>

  {/* Bottom Section */}
  <div className="p-3 border-t border-gray-100">
    {/* User Card */}
    <div className="mb-2 p-3 rounded-xl bg-gray-50 border border-gray-100">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-bold shadow-sm">
          {getInitials()}
        </div>

        {/* User info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {user?.name || "User"}
          </p>

          <p className="text-[11px] text-gray-500 truncate mt-0.5">
            {user?.email || "No email"}
          </p>
        </div>

        {/* Online indicator */}
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
      </div>
    </div>

    {/* Logout */}
    <button
      onClick={logout}
      className="group flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
    >
      <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-50 group-hover:bg-white group-hover:text-red-500 transition-colors">
        <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
      </span>

      <span>Logout</span>
    </button>
  </div>
</aside>


);
}
