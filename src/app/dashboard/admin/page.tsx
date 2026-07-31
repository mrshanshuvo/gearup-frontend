"use client";

import React from "react";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  Clock,
  DollarSign,
  Loader2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useAllUsers } from "@/hooks/useAdminUser";
import { useAdminGearList, useAllRentalsAdmin } from "@/hooks/useAdminGear";
import { StatCard } from "@/components/ui/StatCard";
import { RentalStatusBadge } from "@/components/ui/RentalStatusBadge";

export default function AdminDashboardHome() {
  const { data: usersData, isLoading: usersLoading } = useAllUsers();
  const { data: gearData, isLoading: gearLoading } = useAdminGearList();
  const { data: rentalsData, isLoading: rentalsLoading } = useAllRentalsAdmin();

  const users = usersData?.data || [];
  const gearItems = gearData?.data || [];
  const rentals = rentalsData?.data || [];

  const totalUsers = users.length;
  const totalProviders = users.filter((u) => u.role === "Provider").length;
  const totalGear = gearItems.length;
  const totalRentals = rentals.length;

  const activeRentals = rentals.filter(
    (r) =>
      r.status === "CONFIRMED" ||
      r.status === "PAID" ||
      r.status === "PICKED_UP"
  ).length;

  const totalRevenue = rentals
    .filter((r) => r.status === "PAID" || r.status === "RETURNED")
    .reduce((sum, r) => sum + (r.totalCost || 0), 0);

  const recentRentals = rentals.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-foreground flex items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
            <ShieldCheck className="h-7 w-7 text-amber-500" /> Platform Overview
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Global metrics, rental stats, and system performance overview.
          </p>
        </div>

        <div className="border-border bg-card flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-bold shadow-xs">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-muted-foreground">System Health:</span>
          <span className="text-emerald-600 dark:text-emerald-400">
            100% Operational
          </span>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={rentalsLoading ? "-" : `$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconBg="bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
          trend={{ value: 12.4, label: "vs previous month" }}
          highlight
        />

        <StatCard
          label="Active Rentals"
          value={rentalsLoading ? "-" : activeRentals}
          icon={Clock}
          iconBg="bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400"
          trend={{ value: 8.1, label: "current active" }}
        />

        <StatCard
          label="Total Registered Users"
          value={usersLoading ? "-" : totalUsers}
          icon={Users}
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
        />

        <StatCard
          label="Gear Vendors / Providers"
          value={usersLoading ? "-" : totalProviders}
          icon={Store}
          iconBg="bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400"
        />

        <StatCard
          label="Global Gear Inventory"
          value={gearLoading ? "-" : totalGear}
          icon={Package}
          iconBg="bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
        />

        <StatCard
          label="Total Rental Orders"
          value={rentalsLoading ? "-" : totalRentals}
          icon={ShoppingBag}
          iconBg="bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <h2 className="text-foreground text-lg font-extrabold">
          System Recent Rental Activity
        </h2>

        {rentalsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : recentRentals.length === 0 ? (
          <div className="border-border bg-card rounded-3xl border py-12 text-center">
            <p className="text-muted-foreground text-sm">
              No rental activity recorded yet.
            </p>
          </div>
        ) : (
          <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-xs">
            <div className="divide-border divide-y">
              {recentRentals.map((order) => (
                <div
                  key={order.id}
                  className="hover:bg-secondary/40 flex flex-col justify-between gap-4 p-5 transition-colors sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <p className="text-foreground text-sm font-bold">
                      {order.gearItem?.name || "Equipment Rental"}
                    </p>
                    <p className="text-muted-foreground text-xs font-medium">
                      Customer: {order.customer?.name} ({order.customer?.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <RentalStatusBadge status={order.status} />
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                      ${order.totalCost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
