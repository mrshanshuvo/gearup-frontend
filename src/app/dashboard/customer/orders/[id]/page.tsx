"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
  ShieldCheck,
  Ban,
} from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useRentalDetail, useCancelRental } from "@/hooks/useRental";
import { useCreatePaymentIntent, useConfirmPayment } from "@/hooks/usePayment";
import { useCreateReview } from "@/hooks/useReview";
import { toast } from "sonner";

// Initialize Stripe publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RgumWQK4g5kgamz..." // Fallback
);

// Inner Stripe Payment Card Component
function StripePaymentForm({
  rentalOrderId,
  totalCost,
}: {
  rentalOrderId: string;
  totalCost: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const createIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      setIsProcessing(true);

      // Step 1: Create payment intent via backend
      const intentRes = await createIntent.mutateAsync(rentalOrderId);
      const clientSecret = intentRes.data?.clientSecret;

      if (!clientSecret) {
        toast.error("Failed to initialize Stripe payment");
        return;
      }

      // Step 2: Confirm card payment with Stripe SDK
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: cardElement },
        }
      );

      if (error) {
        toast.error(error.message || "Payment confirmation failed");
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        // Step 3: Call backend to confirm payment & update order status to PAID
        await confirmPayment.mutateAsync({
          paymentIntentId: paymentIntent.id,
          rentalOrderId,
        });
        toast.success("Payment completed successfully!");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Payment process failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Card Information
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "14px",
                color: "#0f172a",
                "::placeholder": { color: "#94a3b8" },
              },
              invalid: { color: "#ef4444" },
            },
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-emerald-600 py-6 font-bold text-white hover:bg-emerald-700"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing
            Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" /> Pay Now (${totalCost})
          </>
        )}
      </Button>
    </form>
  );
}

// Main Component
export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const { data: orderResponse, isLoading } = useRentalDetail(orderId);
  const cancelRental = useCancelRental();
  const createReview = useCreateReview();

  const order = orderResponse?.data;

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this rental order?")) return;
    try {
      await cancelRental.mutateAsync(orderId);
      toast.success("Order cancelled successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order?.gearItemId) return;
    try {
      setIsSubmittingReview(true);
      await createReview.mutateAsync({
        gearItemId: order.gearItemId,
        rating,
        comment,
      });
      toast.success("Thank you! Review submitted successfully.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Order Not Found</h1>
        <Button onClick={() => router.push("/dashboard/customer/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard/customer/orders")}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to My Orders
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Order Summary (2 Cols) */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Rental Order #{order.id.slice(-6)}
                  </h1>
                  <p className="text-xs text-slate-500">
                    Booked on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-600 font-bold text-emerald-600"
                >
                  {order.status}
                </Badge>
              </div>

              {/* Gear Spec Thumbnail */}
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900">
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
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {order.gearItem?.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Brand: {order.gearItem?.brand}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    ${order.gearItem?.pricePerDay} / day
                  </p>
                </div>
              </div>

              {/* Rental Dates Summary */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Start Date
                  </p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {new Date(order.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">End Date</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {new Date(order.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Total Rental Amount
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ${order.totalCost}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Dynamic Action Box (1 Col) */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-slate-50/50 shadow-md dark:border-slate-800 dark:bg-slate-900/50">
            <CardContent className="space-y-6 p-6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Order Action & Status
              </h2>

              {/* Status: PLACED → Stripe Payment Form */}
              {order.status === "PLACED" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    Your order is placed! Complete payment to confirm your
                    booking.
                  </div>

                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      rentalOrderId={order.id}
                      totalCost={order.totalCost}
                    />
                  </Elements>

                  <Button
                    variant="outline"
                    onClick={handleCancelOrder}
                    disabled={cancelRental.isPending}
                    className="w-full border-red-200 text-xs text-red-600 hover:bg-red-50"
                  >
                    <Ban className="mr-1.5 h-3.5 w-3.5" /> Cancel Order
                  </Button>
                </div>
              )}

              {/* Status: PAID / CONFIRMED / PICKED_UP */}
              {(order.status === "PAID" ||
                order.status === "CONFIRMED" ||
                order.status === "PICKED_UP") && (
                <div className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:bg-emerald-950/40">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                    {order.status === "PAID"
                      ? "Payment Received!"
                      : order.status === "CONFIRMED"
                        ? "Booking Confirmed!"
                        : "Equipment Picked Up"}
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Enjoy your adventure! Remember to return equipment by{" "}
                    {new Date(order.endDate).toLocaleDateString()}.
                  </p>
                </div>
              )}

              {/* Status: RETURNED → Leave Review Form */}
              {order.status === "RETURNED" && (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40">
                    Gear returned! Please leave a review for the provider.
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">
                      Rating (1-5)
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold">Comments</label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How was the equipment condition?"
                      className="w-full rounded-md border border-slate-200 p-2 text-sm dark:border-slate-800 dark:bg-slate-950"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full bg-emerald-600 text-white"
                  >
                    Submit Review
                  </Button>
                </form>
              )}

              {/* Status: CANCELLED */}
              {order.status === "CANCELLED" && (
                <div className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-4 text-center dark:bg-red-950/40">
                  <AlertCircle className="mx-auto h-8 w-8 text-red-600" />
                  <p className="text-sm font-bold text-red-900 dark:text-red-300">
                    Order Cancelled
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-400">
                    This rental order was cancelled and is no longer active.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
