"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GearCard } from "@/components/gear/GearCard";
import { GearSkeleton } from "@/components/gear/GearSkeleton";
import { useCategories, useGearList } from "@/hooks/useGear";

export default function HomePage() {
  const { data: gearData, isLoading: gearLoading } = useGearList({
    availableOnly: true,
    limit: 8,
  });
  const { data: categoryData } = useCategories();

  const gearItems = gearData?.data || [];
  const categories = categoryData?.data || [];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Rent Sports & Outdoor Gear <br />
            <span className="text-rose-400">
              Instantly & Effortlessly
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-rose-100/90 sm:text-xl">
            Browse top-quality outdoor, camping, and athletic equipment from
            trusted providers near you.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary px-8 font-bold text-white shadow-lg shadow-rose-500/30 hover:bg-rose-700"
              onClick={() => (window.location.href = "/gear")}
            >
              Browse Gear Inventory{" "}
              <ArrowRight className="ml-2 inline h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 px-8 font-bold text-white hover:bg-white hover:text-slate-900 transition-all backdrop-blur-sm"
              onClick={() => (window.location.href = "/auth/register?role=Provider")}
            >
              Become a Gear Provider
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Filter Pills Section */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Explore by Category
          </h2>
          <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/gear?categoryId=${cat.id}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-slate-700 shadow-sm transition-all hover:border-rose-500 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-rose-400"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Gear Section */}
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Featured Gear Available Now
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Top rated equipment ready for instant booking
            </p>
          </div>

          <Button
            variant="ghost"
            className="text-primary hover:text-rose-700 font-bold"
            onClick={() => (window.location.href = "/gear")}
          >
            View All <ArrowRight className="ml-1 inline h-4 w-4" />
          </Button>
        </div>

        {gearLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <GearSkeleton key={i} />
            ))}
          </div>
        ) : gearItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
            <p className="text-slate-500">No equipment currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {gearItems.map((gear) => (
              <GearCard key={gear.id} gear={gear} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works Section */}
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
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">1. Browse & Select</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Filter by category, brand, price, and availability dates to find
                exactly what you need.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">2. Book Rental Dates</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Choose start and end dates with our interactive calendar picker
                and confirm total cost.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
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
    </div>
  );
}
