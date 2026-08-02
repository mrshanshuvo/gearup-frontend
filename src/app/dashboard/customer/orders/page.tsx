"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Calendar,
  ShoppingBag,
  ArrowRight,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RentalStatusBadge } from "@/components/ui/RentalStatusBadge";
import { useCustomerRentals, useCancelRental } from "@/hooks/useRental";
import { useCreatePaymentIntent } from "@/hooks/usePayment";
import { StripePaymentModal } from "./[id]/_components/StripePaymentModal";
import { ReviewModal } from "./_components/ReviewModal";
import { Pagination } from "@/components/ui/Pagination";
import { toast } from "sonner";

export default function MyOrdersPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { data: rentalsData, isLoading, refetch } = useCustomerRentals();
  const cancelRental = useCancelRental();
  const createPaymentIntent = useCreatePaymentIntent();
  const rentals = rentalsData?.data || [];

  const [activePaymentOrder, setActivePaymentOrder] = useState<{
    id: string;
    totalCost: number;
    transactionId: string;
  } | null>(null);

  const [activeReviewOrder, setActiveReviewOrder] = useState<{
    gearItemId: string;
    gearName?: string;
  } | null>(null);

  const [processingPaymentOrderId, setProcessingPaymentOrderId] = useState<
    string | null
  >(null);
  const [processingCancelOrderId, setProcessingCancelOrderId] = useState<
    string | null
  >(null);

  const handlePayNow = async (orderId: string, totalCost: number) => {
    setProcessingPaymentOrderId(orderId);
    try {
      const res = await createPaymentIntent.mutateAsync(orderId);
      const transactionId =
        res.data?.transactionId ||
        res.data?.paymentIntentId ||
        "mock_tx_pending";
      setActivePaymentOrder({ id: orderId, totalCost, transactionId });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    } finally {
      setProcessingPaymentOrderId(null);
    }
  };

  const handleCancelOrder = async (id: string) => {
    setProcessingCancelOrderId(id);
    try {
      await cancelRental.mutateAsync(id);
      toast.success("Rental order cancelled successfully");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to cancel order");
    } finally {
      setProcessingCancelOrderId(null);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredRentals =
    statusFilter === "ALL"
      ? rentals
      : rentals.filter((r) => r.status === statusFilter);

  const totalPages = Math.ceil(filteredRentals.length / ITEMS_PER_PAGE);
  const paginatedRentals = filteredRentals.slice(
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
            onClick={() => {
              setStatusFilter(tab.value);
              setCurrentPage(1);
            }}
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
            You don&apos;t have any orders under the selected filter tab.
          </p>
          <Button
            onClick={() => (window.location.href = "/gear")}
            className="bg-blue-600 font-bold text-white hover:bg-blue-700"
          >
            Browse Gear Catalog
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {paginatedRentals.map((order) => (
            <div
              key={order.id}
              className="w-full space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
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

                  <div className="flex items-center gap-2">
                    {(order.status === "PLACED" ||
                      order.status === "CONFIRMED") && (
                      <Button
                        size="sm"
                        disabled={createPaymentIntent.isPending}
                        onClick={() => handlePayNow(order.id, order.totalCost)}
                        className="cursor-pointer bg-blue-600 font-bold text-white shadow-sm hover:bg-blue-700"
                      >
                        {createPaymentIntent.isPending &&
                        processingPaymentOrderId === order.id ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                        )}
                        Pay Now
                      </Button>
                    )}
                    {order.status === "PLACED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={cancelRental.isPending}
                        onClick={() => handleCancelOrder(order.id)}
                        className="cursor-pointer border-red-200 font-bold text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/50"
                      >
                        {cancelRental.isPending &&
                        processingCancelOrderId === order.id ? (
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        ) : null}
                        Cancel Order
                      </Button>
                    )}
                    <Button
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/customer/orders/${order.id}`)
                      }
                      className="cursor-pointer bg-slate-900 font-bold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                    >
                      View Details{" "}
                      <ArrowRight className="ml-1 inline h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Step Progress Timeline Tracker */}
              <div className="border-t border-slate-100 pt-4 dark:border-slate-800/80">
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { step: "PLACED", label: "Order Placed" },
                    { step: "PAID", label: "Payment Confirmed" },
                    { step: "PICKED_UP", label: "Gear Picked Up" },
                    { step: "RETURNED", label: "Completed" },
                  ].map((st, idx) => {
                    const statusOrder = [
                      "PLACED",
                      "CONFIRMED",
                      "PAID",
                      "PICKED_UP",
                      "RETURNED",
                    ];
                    const currentIdx = statusOrder.indexOf(order.status);
                    const stepIdx = statusOrder.indexOf(st.step);
                    const isComplete =
                      currentIdx >= stepIdx && order.status !== "CANCELLED";
                    const isCurrent = order.status === st.step;

                    return (
                      <div
                        key={st.step}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                            order.status === "CANCELLED"
                              ? "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400"
                              : isComplete
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                          }`}
                        >
                          {isComplete ? "✓" : idx + 1}
                        </div>
                        <span
                          className={`text-[10px] font-semibold ${
                            isCurrent
                              ? "font-bold text-blue-600 dark:text-blue-400"
                              : isComplete
                                ? "text-slate-700 dark:text-slate-300"
                                : "text-slate-400"
                          }`}
                        >
                          {st.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
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

      {/* Stripe Card Payment Modal */}
      {activePaymentOrder && (
        <StripePaymentModal
          orderId={activePaymentOrder.id}
          totalCost={activePaymentOrder.totalCost}
          transactionId={activePaymentOrder.transactionId}
          onClose={() => setActivePaymentOrder(null)}
          onSuccess={() => {
            setActivePaymentOrder(null);
            refetch();
          }}
        />
      )}

      {/* Review Submission Modal */}
      {activeReviewOrder && (
        <ReviewModal
          gearItemId={activeReviewOrder.gearItemId}
          gearName={activeReviewOrder.gearName}
          onClose={() => setActiveReviewOrder(null)}
          onSuccess={() => {
            setActiveReviewOrder(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
