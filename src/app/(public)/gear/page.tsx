"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GearCard } from "@/components/gear/GearCard";
import { GearSkeleton } from "@/components/gear/GearSkeleton";
import { useCategories, useGearList } from "@/hooks/useGear";

export default function BrowseGearPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <BrowseGearContent />
    </React.Suspense>
  );
}

function BrowseGearContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state extraction
  const categoryIdParam = searchParams.get("categoryId") || "";
  const brandParam = searchParams.get("brand") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const availableOnlyParam = searchParams.get("availableOnly") !== "false";

  // Local filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryIdParam);
  const [brandSearch, setBrandSearch] = useState(brandParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [availableOnly, setAvailableOnly] = useState(availableOnlyParam);

  const { data: categoryData } = useCategories();
  const categories = categoryData?.data || [];

  // Query hook with active filters
  const { data: gearData, isLoading: gearLoading } = useGearList({
    categoryId: selectedCategory || undefined,
    brand: brandSearch || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    availableOnly: availableOnly || undefined,
  });

  const gearItems = gearData?.data || [];

  // Update URL params on filter submit/change
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("categoryId", selectedCategory);
    if (brandSearch) params.set("brand", brandSearch);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("availableOnly", String(availableOnly));

    router.push(`/gear?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setBrandSearch("");
    setMinPrice("");
    setMaxPrice("");
    setAvailableOnly(true);
    router.push("/gear");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Browse Equipment Inventory
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Find available outdoor and sports gear for your next adventure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <aside className="h-fit space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <SlidersHorizontal className="h-5 w-5 text-primary" />{" "}
              Filters
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1 text-xs text-slate-500 hover:text-red-500"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </Button>
          </div>

          {/* Brand Search Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Brand / Keyword
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="e.g. Black Diamond"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="pr-8"
              />
              <Search className="absolute top-2.5 right-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Category Dropdown/Radio Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Price Range ($ / day)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-slate-400">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Available Only Toggle */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Available Stock Only
            </span>
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="h-4 w-4 rounded accent-rose-600"
            />
          </div>

          <Button
            onClick={applyFilters}
            className="w-full bg-primary text-primary-foreground hover:bg-rose-700 font-bold"
          >
            Apply Filters
          </Button>
        </aside>

        {/* Main Gear Grid */}
        <main className="space-y-6 lg:col-span-3">
          {gearLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <GearSkeleton key={i} />
              ))}
            </div>
          ) : gearItems.length === 0 ? (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                No Gear Found
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Try adjusting your search filters or clear them to see all
                equipment.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gearItems.map((gear) => (
                <GearCard key={gear.id} gear={gear} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
