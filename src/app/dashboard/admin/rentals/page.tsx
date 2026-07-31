"use client";

import React, { useState } from "react";
import { ClipboardList, Loader2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RentalStatusBadge } from "@/components/ui/RentalStatusBadge";
import { useAllRentalsAdmin } from "@/hooks/useAdminGear";

export default function AllRentalsAdminPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { data: rentalsData, isLoading } = useAllRentalsAdmin();

  const rentals = rentalsData?.data || [];

  const filteredRentals =
    statusFilter === "ALL"
      ? rentals
      : rentals.filter((r) => r.status === statusFilter);

  const filterTabs = [
    { label: "All Orders", value: "ALL" },
    { label: "Placed", value: "PLACED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Paid", value: "PAID" },
    { label: "Picked Up", value: "PICKED_UP" },
    { label: "Returned", value: "RETURNED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const totalFilteredValue = filteredRentals.reduce(
    (acc, r) => acc + (r.totalCost || 0),
    0
  );

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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Global Rental Orders Oversight
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monitor all customer bookings and provider rental fulfillments.
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-right dark:border-blue-900 dark:bg-blue-950/40">
          <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-400">
            Total Filtered Value
          </p>
          <p className="text-xl font-black text-blue-600 dark:text-blue-300">
            ${totalFilteredValue}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 dark:border-slate-800">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              statusFilter === tab.value
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rentals Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <ClipboardList className="mx-auto mb-2 h-12 w-12 text-slate-400" />
          <p className="text-sm text-slate-500">
            No rental orders match the selected filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Gear Item</th>
                  <th className="p-4">Rental Dates</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {filteredRentals.map((order) => (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="p-4 font-mono text-xs text-slate-500">
                      #{order.id.slice(-6)}
                    </td>
                    <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                      {order.customer?.name}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {order.gearItem?.name}
                    </td>
                    <td className="flex items-center gap-1 p-4 text-xs text-slate-500 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" />
                      {new Date(order.startDate).toLocaleDateString()} -{" "}
                      {new Date(order.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-black text-blue-600 dark:text-blue-400">
                      ${order.totalCost}
                    </td>
                    <td className="p-4 text-right">
                      <RentalStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
