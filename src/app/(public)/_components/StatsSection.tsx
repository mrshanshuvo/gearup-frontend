import React from "react";
import { Award, Users, TrendingUp, Clock } from "lucide-react";

export function StatsSection() {
  return (
    <section className="relative z-20 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-md md:grid-cols-4 dark:border-slate-800 dark:bg-slate-900/95">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              500+
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified Equipment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              2,400+
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Happy Adventure Renters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              99.2%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              5-Star Review Rating
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              Instant
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stripe Protected Checkout
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
