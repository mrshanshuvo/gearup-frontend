"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || searchParams.get("order_id");

  return (
    <div className="mx-auto max-w-lg space-y-6 rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-xl dark:border-rose-950 dark:bg-slate-900">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
        <XCircle className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
          Payment Cancelled
        </span>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Payment Process Was Not Completed
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          You cancelled the checkout or your session timed out. No funds were
          charged to your account.
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

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <HelpCircle className="h-4 w-4" />
        <span>
          Need assistance? Contact support or try completing payment again.
        </span>
      </div>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
        {orderId ? (
          <Link href={`/dashboard/customer/orders/${orderId}`}>
            <Button className="w-full bg-rose-600 font-bold text-white hover:bg-rose-700 sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Payment Again
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/customer/orders">
            <Button className="w-full bg-rose-600 font-bold text-white hover:bg-rose-700 sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" /> Return to Orders List
            </Button>
          </Link>
        )}
        <Link href="/contact">
          <Button variant="outline" className="w-full sm:w-auto">
            Contact Support
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <Suspense fallback={<div>Loading payment state...</div>}>
        <PaymentCancelContent />
      </Suspense>
    </div>
  );
}
