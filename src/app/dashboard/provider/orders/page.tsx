"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Loader2,
  Calendar,
  CheckCircle2,
  PackageCheck,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RentalStatusBadge } from "@/components/ui/RentalStatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import {
  useProviderOrders,
  useUpdateOrderStatus,
} from "@/hooks/useProviderGear";
import { toast } from "sonner";

export default function IncomingOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const { data: ordersData, isLoading } = useProviderOrders();
  const updateStatus = useUpdateOrderStatus();

  const orders = ordersData?.data || [];

  const filteredOrders =
    statusFilter === "ALL"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filterTabs = [
    { label: "All Orders", value: "ALL" },
    { label: "Placed", value: "PLACED" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Paid", value: "PAID" },
    { label: "Picked Up", value: "PICKED_UP" },
    { label: "Returned", value: "RETURNED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  const handleStatusTransition = async (id: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Incoming Rental Orders
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Review customer rental requests and update order progress.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 dark:border-slate-800">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
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
      ) : filteredOrders.length === 0 ? (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <ShoppingBag className="mx-auto h-12 w-12 text-slate-400" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Orders Under Selected Filter
          </p>
          <p className="mx-auto max-w-sm text-xs text-slate-500">
            When customers rent your gear, incoming orders will appear here for
            confirmation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
                  {order.gearItem?.imageUrl ? (
                    <Image
                      src={order.gearItem.imageUrl}
                      alt={order.gearItem.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      {order.gearItem?.name}
                    </h3>
                    <RentalStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Customer: <strong>{order.customer?.name}</strong> (
                    {order.customer?.email})
                  </p>
                  <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    {new Date(order.startDate).toLocaleDateString()} -{" "}
                    {new Date(order.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="flex w-full items-center justify-between gap-4 border-t border-slate-100 pt-4 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-slate-500">Order Cost</p>
                  <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                    ${order.totalCost}
                  </p>
                </div>

                {/* Status transition action controls */}
                {order.status === "PLACED" && (
                  <Button
                    size="sm"
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      handleStatusTransition(order.id, "CONFIRMED")
                    }
                    className="bg-blue-600 font-bold text-white hover:bg-blue-700"
                  >
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Confirm Booking
                  </Button>
                )}

                {(order.status === "CONFIRMED" || order.status === "PAID") && (
                  <Button
                    size="sm"
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      handleStatusTransition(order.id, "PICKED_UP")
                    }
                    className="bg-purple-600 font-bold text-white hover:bg-purple-700"
                  >
                    <PackageCheck className="mr-1.5 h-4 w-4" /> Mark Picked Up
                  </Button>
                )}

                {order.status === "PICKED_UP" && (
                  <Button
                    size="sm"
                    disabled={updateStatus.isPending}
                    onClick={() => handleStatusTransition(order.id, "RETURNED")}
                    className="bg-emerald-600 font-bold text-white hover:bg-emerald-700"
                  >
                    <RotateCcw className="mr-1.5 h-4 w-4" /> Mark Returned
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
