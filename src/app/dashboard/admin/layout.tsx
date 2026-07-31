"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  Tag,
  ClipboardList,
  Package,
  UserCircle,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function AdminDashboardLayout({
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
    } else if (user.role !== "Admin") {
      if (user.role === "Provider") router.push("/dashboard/provider");
      else router.push("/dashboard/customer");
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
      href: "/dashboard/admin",
      icon: BarChart3,
      exact: true,
    },
    {
      label: "User Management",
      href: "/dashboard/admin/users",
      icon: Users,
      exact: false,
    },
    {
      label: "Categories",
      href: "/dashboard/admin/categories",
      icon: Tag,
      exact: false,
    },
    {
      label: "All Rentals",
      href: "/dashboard/admin/rentals",
      icon: ClipboardList,
      exact: false,
    },
    {
      label: "Global Gear",
      href: "/dashboard/admin/gear",
      icon: Package,
      exact: false,
    },
    {
      label: "My Profile",
      href: "/dashboard/admin/profile",
      icon: UserCircle,
      exact: false,
    },
  ];

  return (
    <DashboardShell
      user={user}
      navItems={navItems}
      roleBadgeText="System Admin"
      roleBadgeColor="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
    >
      {children}
    </DashboardShell>
  );
}
