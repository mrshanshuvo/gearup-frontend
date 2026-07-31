"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RentalStatusBadge } from "@/components/ui/RentalStatusBadge";
import { useRentalDetail, useCancelRental } from "@/hooks/useRental";
import { useCreatePaymentIntent } from "@/hooks/usePayment";
import { StripePaymentModal } from "./_components/StripePaymentModal";
import { toast } from "sonner";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const { data: orderResponse, isLoading, isError, refetch } = useRentalDetail(orderId);
  const cancelRental = useCancelRental();
  const createPaymentIntent = useCreatePaymentIntent();

  const order = orderResponse?.data;

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activeTransactionId, setActiveTransactionId] = useState("");

  const handlePayNow = async () => {
    if (!order) return;
    try {
      const res = await createPaymentIntent.mutateAsync(order.id);
      const transactionId =
        (res.data as any)?.transactionId ||
        (res.data as any)?.paymentIntentId ||
        `mock_tx_${Date.now()}`;
      setActiveTransactionId(transactionId);
      setShowPaymentModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    }
  };

  const handleCancel = async () => {
    if (!order) return;
    try {
      await cancelRental.mutateAsync(order.id);
      toast.success("Order cancelled successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <p className="text-slate-500">
          The requested rental order could not be located or you don't have
          access.
        </p>
        <Button onClick={() => router.push("/dashboard/customer/orders")}>
          Back to Orders List
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/customer/orders")}
        className="flex cursor-pointer items-center gap-2 text-slate-600 dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Orders
      </Button>

      {/* Header Summary Box */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Order #{order.id.substring(0, 8)}
            </h1>
            <RentalStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-slate-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {order.status === "PLACED" && (
            <>
              <Button
                variant="outline"
                disabled={cancelRental.isPending}
                onClick={handleCancel}
                className="cursor-pointer border-red-200 font-bold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/50"
              >
                Cancel Order
              </Button>
              <Button
                disabled={createPaymentIntent.isPending}
                onClick={handlePayNow}
                className="cursor-pointer bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
              >
                {createPaymentIntent.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-4 w-4" />
                )}
                Pay ${order.totalCost} Now
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Equipment Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="space-y-6 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Rented Equipment Details
              </h2>

              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
                  {order.gearItem?.imageUrl ? (
                    <Image
                      src={order.gearItem.imageUrl}
                      alt={order.gearItem.name || "Equipment"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Badge
                    variant="outline"
                    className="border-rose-200 text-xs font-bold text-rose-600"
                  >
                    <Tag className="mr-1 h-3 w-3" />{" "}
                    {order.gearItem?.category?.name || "Equipment"}
                  </Badge>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {order.gearItem?.name}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Brand: <strong>{order.gearItem?.brand}</strong> | Daily
                    Rate: <strong>${order.gearItem?.pricePerDay}/day</strong>
                  </p>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {order.gearItem?.description}
                  </p>
                </div>
              </div>

              {/* Vendor Info Box */}
              {order.gearItem?.provider && (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Provided by {order.gearItem.provider.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Contact: {order.gearItem.provider.email}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Cost Breakdown & Dates */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="space-y-6 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Rental Duration
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 font-medium text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" /> Start
                    Date
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {new Date(order.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                  <span className="flex items-center gap-1.5 font-medium text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" /> End Date
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {new Date(order.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-300">
                  Total Order Amount
                </p>
                <p className="text-3xl font-black text-blue-700 dark:text-blue-400">
                  ${order.totalCost}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stripe Payment Modal Component */}
      {showPaymentModal && (
        <StripePaymentModal
          orderId={order.id}
          totalCost={order.totalCost}
          transactionId={activeTransactionId}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
