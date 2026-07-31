"use client";

import React from "react";
import {
  ShoppingBag,
  CreditCard,
  Clock,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCustomerRentals } from "@/hooks/useRental";
import useAuthStore from "@/stores/authStore";
import { StatCard } from "@/components/ui/StatCard";
import { RentalStatusBadge } from "@/components/ui/RentalStatusBadge";

export default function CustomerDashboardHome() {
  const user = useAuthStore((state) => state.user);
  const { data: rentalsData, isLoading } = useCustomerRentals();
  const rentals = rentalsData?.data || [];

  const totalOrders = rentals.length;
  const pendingPayment = rentals.filter((r) => r.status === "PLACED").length;
  const activeRentals = rentals.filter(
    (r) =>
      r.status === "CONFIRMED" ||
      r.status === "PAID" ||
      r.status === "PICKED_UP"
  ).length;

  const recentOrders = rentals.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-md shadow-blue-500/20">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" /> Customer Dashboard
          </div>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="max-w-xl text-sm font-medium text-white/80">
            Track your sports & outdoor equipment rentals, make payments, and
            manage your bookings easily.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          label="Total Orders"
          value={isLoading ? "-" : totalOrders}
          icon={ShoppingBag}
          iconBg="bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
        />

        <StatCard
          label="Pending Payment"
          value={isLoading ? "-" : pendingPayment}
          icon={CreditCard}
          iconBg="bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
          highlight={pendingPayment > 0}
        />

        <StatCard
          label="Active Rentals"
          value={isLoading ? "-" : activeRentals}
          icon={Clock}
          iconBg="bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-lg font-extrabold">
            Recent Rental Orders
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              (window.location.href = "/dashboard/customer/orders")
            }
            className="text-primary font-bold hover:text-rose-700"
          >
            View All Orders <ArrowRight className="ml-1 inline h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="border-border bg-card space-y-4 rounded-3xl border p-12 text-center">
            <p className="text-muted-foreground text-sm font-medium">
              You haven't placed any rental orders yet.
            </p>
            <Button
              onClick={() => (window.location.href = "/gear")}
              className="bg-primary text-primary-foreground font-bold hover:bg-rose-700"
            >
              Browse Available Gear
            </Button>
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
                      {order.gearItem?.name || "Equipment Rental"}
                    </p>
                    <p className="text-muted-foreground text-xs font-medium">
                      Dates: {new Date(order.startDate).toLocaleDateString()} -{" "}
                      {new Date(order.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <RentalStatusBadge status={order.status} />
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                      ${order.totalCost}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `/dashboard/customer/orders/${order.id}`)
                      }
                      className="rounded-xl font-bold"
                    >
                      Details
                    </Button>
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
