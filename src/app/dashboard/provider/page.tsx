"use client";

import React from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Clock,
  ArrowRight,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useProviderGearList,
  useProviderOrders,
} from "@/hooks/useProviderGear";
import useAuthStore from "@/stores/authStore";

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

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return (
          <Badge className="bg-amber-500 text-white">Pending Action</Badge>
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Vendor Dashboard: {user?.name} 🛠️
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your equipment catalog and fulfill customer rental bookings.
          </p>
        </div>

        <Button
          onClick={() =>
            (window.location.href = "/dashboard/provider/gear/new")
          }
          className="bg-emerald-600 font-bold text-white hover:bg-emerald-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Gear
        </Button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Listed Equipment
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {gearLoading ? "-" : totalGear}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Pending Orders
              </p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {ordersLoading ? "-" : pendingConfirmations}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950">
              <ShoppingBag className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Active Rentals
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {ordersLoading ? "-" : activeRentals}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Recent Incoming Orders
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              (window.location.href = "/dashboard/provider/orders")
            }
          >
            Manage All Orders <ArrowRight className="ml-1 inline h-4 w-4" />
          </Button>
        </div>

        {ordersLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">
              No incoming rental orders yet.
            </p>
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
                      {order.gearItem?.name || "Rental Order"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Customer: {order.customer?.name} ({order.customer?.email})
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
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
