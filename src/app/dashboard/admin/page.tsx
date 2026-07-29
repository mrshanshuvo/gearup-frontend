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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAllUsers } from "@/hooks/useAdminUser";
import { useAdminGearList, useAllRentalsAdmin } from "@/hooks/useAdminGear";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PLACED":
        return <Badge className="bg-amber-500 text-white">Placed</Badge>;
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
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          <ShieldCheck className="h-6 w-6 text-amber-500" /> Platform Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Global metrics and system-wide rental activity overview.
        </p>
      </div>

      {/* 6 KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Total Registered Users
              </p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {usersLoading ? "-" : totalUsers}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Gear Vendors / Providers
              </p>
              <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                {usersLoading ? "-" : totalProviders}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950">
              <Store className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Global Gear Inventory
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {gearLoading ? "-" : totalGear}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
              <Package className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Total Rental Orders
              </p>
              <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                {rentalsLoading ? "-" : totalRentals}
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
              <p className="text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                {rentalsLoading ? "-" : activeRentals}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 dark:bg-teal-950">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="flex items-center justify-between p-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">
                Completed Volume
              </p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${rentalsLoading ? "-" : totalRevenue}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          System Recent Rental Activity
        </h2>

        {rentalsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          </div>
        ) : recentRentals.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500">
              No rental activity recorded yet.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentRentals.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col justify-between gap-4 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center dark:hover:bg-slate-800/50"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {order.gearItem?.name || "Equipment Rental"}
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
