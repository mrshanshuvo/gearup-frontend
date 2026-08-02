"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirmPayment } from "@/hooks/usePayment";
import {
  stripeCardPaymentSchema,
  StripeCardPaymentInput,
} from "@/validations/payment.schema";
import { toast } from "sonner";

interface StripePaymentModalProps {
  orderId: string;
  totalCost: number;
  transactionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function StripePaymentModal({
  orderId,
  totalCost,
  transactionId,
  onClose,
  onSuccess,
}: StripePaymentModalProps) {
  const router = useRouter();
  const [showCvc, setShowCvc] = React.useState(false);
  const confirmPayment = useConfirmPayment();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<StripeCardPaymentInput>({
    resolver: zodResolver(stripeCardPaymentSchema),
  });

  const onSubmit = async (data: StripeCardPaymentInput) => {
    try {
      await confirmPayment.mutateAsync({
        paymentIntentId: transactionId,
        rentalOrderId: orderId,
      });
      toast.success(
        "Payment completed successfully! Redirecting to confirmation page..."
      );
      onSuccess();
      router.push(`/payment/success?orderId=${orderId}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Payment processing failed");
    }
  };

  const handleCancelClick = () => {
    onClose();
    router.push(`/payment/cancel?orderId=${orderId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Stripe Card Checkout
              </h3>
              <p className="text-[11px] text-slate-500">
                Order #{orderId.substring(0, 8)} • ${totalCost}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelClick}
            className="cursor-pointer text-slate-400 hover:text-slate-600"
          >
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Card Number */}
          <div className="space-y-1 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Card Number
            </label>
            <Input
              type="text"
              maxLength={19}
              inputMode="numeric"
              autoComplete="off"
              placeholder="1234 5678 9101 1121"
              {...register("cardNumber", {
                onChange: (e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                  const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
                  e.target.value = formatted;
                },
              })}
              className={`font-mono text-sm ${errors.cardNumber ? "border-red-500" : ""}`}
            />
            {errors.cardNumber && (
              <p className="text-[11px] text-red-500">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Expiry Date */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Expiry Date
              </label>
              <Input
                type="text"
                maxLength={5}
                autoComplete="off"
                placeholder="MM / YY"
                {...register("cardExpiry", {
                  onChange: (e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                    if (raw.length >= 2) {
                      let month = parseInt(raw.slice(0, 2), 10);
                      if (month > 12) month = 12;
                      if (month === 0) month = 1;
                      const monthStr = month < 10 ? `0${month}` : `${month}`;
                      const yearStr = raw.slice(2);
                      e.target.value = yearStr
                        ? `${monthStr}/${yearStr}`
                        : `${monthStr}/`;
                    } else {
                      e.target.value = raw;
                    }
                  },
                })}
                className={`font-mono text-sm ${errors.cardExpiry ? "border-red-500" : ""}`}
              />
              {errors.cardExpiry && (
                <p className="text-[11px] text-red-500">
                  {errors.cardExpiry.message}
                </p>
              )}
            </div>

            {/* CVC */}
            <div className="space-y-1 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                CVC / CVV
              </label>
              <div className="relative">
                <Input
                  type={showCvc ? "text" : "password"}
                  maxLength={4}
                  autoComplete="off"
                  placeholder="CVC"
                  {...register("cardCvc")}
                  className={`pr-9 font-mono text-sm ${errors.cardCvc ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCvc(!showCvc)}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showCvc ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.cardCvc && (
                <p className="text-[11px] text-red-500">
                  {errors.cardCvc.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-[11px] text-slate-500 dark:bg-slate-950">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>256-Bit SSL Encrypted & PCI-DSS Compliant via Stripe</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelClick}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || confirmPayment.isPending}
              className="cursor-pointer bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
            >
              {isSubmitting || confirmPayment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Processing...
                </>
              ) : (
                `Pay $${totalCost}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
