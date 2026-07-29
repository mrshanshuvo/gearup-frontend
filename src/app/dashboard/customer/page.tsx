"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  CreditCard,
  Clock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomerRentals } from "@/hooks/useRental";
import useAuthStore from "@/stores/authStore";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return (
          <Badge className="bg-amber-500 text-white">Payment Pending</Badge>
        );
      case "CONFIRMED":
        return <Badge className="bg-blue-500 text-white">Confirmed</Badge>;
      case "PAID":
        return <Badge className="bg-purple-500 text-white">Paid</Badge>;
      case "PICKED_UP":
        return <Badge className="bg-emerald-600 text-white">Picked Up</Badge>;
      case "RETURNED":
        return (
          <Badge
            variant="outline"
            className="border-emerald-600 text-emerald-600"
          >
            Returned
          </Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Here is a quick overview of your equipment rentals.
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Total Rental Orders
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {isLoading ? "-" : totalOrders}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Pending Payment
              </p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {isLoading ? "-" : pendingPayment}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950">
              <CreditCard className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Active Rentals
              </p>
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {isLoading ? "-" : activeRentals}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Recent Rental Orders
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              (window.location.href = "/dashboard/customer/orders")
            }
          >
            View All Orders <ArrowRight className="ml-1 inline h-4 w-4" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">
              You haven't placed any rental orders yet.
            </p>
            <Button
              onClick={() => (window.location.href = "/gear")}
              className="bg-emerald-600 text-white"
            >
              Browse Available Gear
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center dark:hover:bg-slate-800/50"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {order.gearItem?.name || "Equipment Rental"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Dates: {new Date(order.startDate).toLocaleDateString()} -{" "}
                      {new Date(order.endDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      ${order.totalCost}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `/dashboard/customer/orders/${order.id}`)
                      }
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
