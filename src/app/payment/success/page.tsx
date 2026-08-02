"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("order_id");

  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl dark:border-emerald-950 dark:bg-slate-900">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        <CheckCircle2 className="h-10 w-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          Payment Confirmed
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Thank You for Your Order!
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Your equipment rental payment has been successfully processed and
          verified.
        </p>
      </div>

      {orderId && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-950">
          <span className="text-slate-500">Order Reference: </span>
          <strong className="font-mono font-bold text-slate-900 dark:text-white">
            #{orderId.substring(0, 12)}
          </strong>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
        <ShieldCheck className="h-4 w-4 text-emerald-500" />
        <span>Transaction secured via Stripe SSL Payment Gateway</span>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
        {orderId ? (
          <Link href={`/dashboard/customer/orders/${orderId}`}>
            <Button className="w-full bg-emerald-600 font-bold text-white hover:bg-emerald-700 sm:w-auto">
              <ShoppingBag className="mr-2 h-4 w-4" /> View Booking Details
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/customer/orders">
            <Button className="w-full bg-emerald-600 font-bold text-white hover:bg-emerald-700 sm:w-auto">
              <ShoppingBag className="mr-2 h-4 w-4" /> Go to My Orders
            </Button>
          </Link>
        )}
        <Link href="/gear">
          <Button variant="outline" className="w-full sm:w-auto">
            Browse Gear <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <Suspense fallback={<div>Loading payment status...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
