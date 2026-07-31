"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, Calendar, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RentalStatusBadge } from "@/components/ui/RentalStatusBadge";
import { useCustomerRentals } from "@/hooks/useRental";

export default function MyOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { data: rentalsData, isLoading } = useCustomerRentals();
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          My Rental Orders
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track and manage all your sports equipment rental bookings.
        </p>
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

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : filteredRentals.length === 0 ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Rental Orders Found
          </p>
          <p className="mx-auto max-w-sm text-xs text-slate-500">
            You don't have any orders under the selected filter tab.
          </p>
          <Button
            onClick={() => (window.location.href = "/gear")}
            className="bg-blue-600 text-white font-bold hover:bg-blue-700"
          >
            Browse Gear Catalog
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRentals.map((order) => (
            <div
              key={order.id}
              className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {order.gearItem?.name || "Equipment Item"}
                  </h3>
                  <RentalStatusBadge status={order.status} />
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    {new Date(order.startDate).toLocaleDateString()} -{" "}
                    {new Date(order.endDate).toLocaleDateString()}
                  </span>
                  <span>Brand: {order.gearItem?.brand}</span>
                </div>
              </div>

              <div className="flex w-full items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500">Total Rental Cost</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                    ${order.totalCost}
                  </p>
                </div>

                <Button
                  onClick={() =>
                    (window.location.href = `/dashboard/customer/orders/${order.id}`)
                  }
                  className="bg-slate-900 text-white font-bold hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                >
                  View Details <ArrowRight className="ml-1 inline h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
