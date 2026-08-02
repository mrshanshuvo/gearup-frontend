"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, UserCircle } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  React.useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (user.role !== "Customer") {
      if (user.role === "Admin") router.push("/dashboard/admin");
      else if (user.role === "Provider") router.push("/dashboard/provider");
    }
  }, [user, router, hasHydrated, pathname]);

  if (!hasHydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

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
    <DashboardShell
      user={user}
      navItems={navItems}
      roleBadgeText="Customer"
      roleBadgeColor="bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
    >
      {children}
    </DashboardShell>
  );
}
