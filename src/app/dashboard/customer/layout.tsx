"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  UserCircle,
  User,
  ShieldCheck,
  Store,
  LogOut,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { useLogout } from "@/hooks/useAuth";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  // Route guard
  React.useEffect(() => {
    if (!user) {
      router.push("/auth/login?redirect=/dashboard/customer");
    } else if (user.role !== "Customer") {
      if (user.role === "Admin") router.push("/dashboard/admin");
      else if (user.role === "Provider") router.push("/dashboard/provider");
    }
  }, [user, router]);

  if (!user) return null;

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard/customer",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Orders",
      href: "/dashboard/customer/orders",
      icon: ShoppingBag,
      exact: false,
    },
    {
      label: "My Profile",
      href: "/dashboard/customer/profile",
      icon: UserCircle,
      exact: false,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* User Info Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600 dark:bg-emerald-950">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                  {user.name}
                </p>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Customer Dashboard
                </p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-emerald-50 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <LogOut className="h-4 w-4" /> Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Dashboard Main Content Area */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
