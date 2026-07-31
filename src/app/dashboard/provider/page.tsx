"use client";

import React from "react";
import {
  Package,
  ShoppingBag,
  Clock,
  ArrowRight,
  PlusCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useProviderGearList,
  useProviderOrders,
} from "@/hooks/useProviderGear";
import useAuthStore from "@/stores/authStore";
import { StatCard } from "@/components/ui/StatCard";
import { RentalStatusBadge } from "@/components/ui/RentalStatusBadge";

export default function ProviderDashboardHome() {
  const user = useAuthStore((state) => state.user);

  const { data: gearData, isLoading: gearLoading } = useProviderGearList(
    user?.id
  );
  const { data: ordersData, isLoading: ordersLoading } = useProviderOrders();

  const gearItems = gearData?.data || [];
  const orders = ordersData?.data || [];

  const totalGear = gearItems.length;
  const pendingConfirmations = orders.filter(
    (o) => o.status === "PLACED"
  ).length;
  const activeRentals = orders.filter(
    (o) =>
      o.status === "CONFIRMED" ||
      o.status === "PAID" ||
      o.status === "PICKED_UP"
  ).length;

  const totalEarnings = orders
    .filter((o) => o.status === "PAID" || o.status === "RETURNED")
    .reduce((sum, o) => sum + (o.totalCost || 0), 0);

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-md shadow-blue-500/20">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <TrendingUp className="h-3.5 w-3.5" /> Vendor Dashboard
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Welcome back, {user?.name}! 🛠️
          </h1>
          <p className="max-w-xl text-sm font-medium text-white/80">
            Manage your sports equipment inventory, review incoming rental
            orders, and monitor your earnings.
          </p>
        </div>
      </div>

      {/* KPI Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          label="Listed Equipment"
          value={gearLoading ? "-" : totalGear}
          icon={Package}
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
        />

        <StatCard
          label="Pending Action"
          value={ordersLoading ? "-" : pendingConfirmations}
          icon={ShoppingBag}
          iconBg="bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          highlight={pendingConfirmations > 0}
        />

        <StatCard
          label="Active Rentals"
          value={ordersLoading ? "-" : activeRentals}
          icon={Clock}
          iconBg="bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400"
        />
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-lg font-extrabold">
            Recent Incoming Orders
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              (window.location.href = "/dashboard/provider/orders")
            }
            className="text-primary font-bold hover:text-rose-700"
          >
            Manage All Orders <ArrowRight className="ml-1 inline h-4 w-4" />
          </Button>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="border-border bg-card rounded-3xl border py-12 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              No incoming rental orders yet.
            </p>
          </div>
        ) : (
          <div className="border-border bg-card overflow-hidden rounded-3xl border shadow-xs">
            <div className="divide-border divide-y">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="hover:bg-secondary/40 flex flex-col justify-between gap-4 p-5 transition-colors sm:flex-row sm:items-center"
                >
                  <div className="space-y-1">
                    <p className="text-foreground text-sm font-bold">
                      {order.gearItem?.name || "Rental Order"}
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
