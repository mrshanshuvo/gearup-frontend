import React from "react";
import { Search, CalendarCheck, ShieldCheck } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section className="border-y border-slate-200 bg-slate-100 px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mx-auto max-w-7xl space-y-12 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            How GearUp Works
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Rent quality gear in 3 simple steps with verified providers and
            secure payments.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">1. Browse & Select</h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Filter by category, brand, price, and availability dates to find
              exactly what you need.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">2. Book Rental Dates</h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Choose start and end dates with our interactive calendar picker and
              confirm total cost.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold">3. Pay & Pick Up</h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Complete secure Stripe checkout, track order status updates, and
              pick up your gear!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
