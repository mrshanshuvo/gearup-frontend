"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, ShoppingBag, UserCircle } from "lucide-react";
import useAuthStore from "@/stores/authStore";
import { DashboardShell } from "@/components/layout/DashboardShell";

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

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
