"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  UserCircle,
  PlusCircle,
} from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function ProviderDashboardLayout({
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
    } else if (user.role !== "Provider") {
      if (user.role === "Admin") router.push("/dashboard/admin");
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
      href: "/dashboard/provider",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Gear Inventory",
      href: "/dashboard/provider/gear",
      icon: Package,
      exact: false,
    },
    {
      label: "Incoming Orders",
      href: "/dashboard/provider/orders",
      icon: ShoppingBag,
      exact: false,
    },
    {
      label: "My Profile",
      href: "/dashboard/provider/profile",
      icon: UserCircle,
      exact: false,
    },
  ];

  return (
    <DashboardShell
      user={user}
      navItems={navItems}
      quickAction={{
        label: "Add New Gear",
        href: "/dashboard/provider/gear/new",
        icon: PlusCircle,
      }}
      roleBadgeText="Equipment Vendor"
      roleBadgeColor="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
    >
      {children}
    </DashboardShell>
  );
}
