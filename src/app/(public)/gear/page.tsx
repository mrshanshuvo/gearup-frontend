"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GearCard } from "@/components/gear/GearCard";
import { GearSkeleton } from "@/components/gear/GearSkeleton";
import { useCategories, useGearList } from "@/hooks/useGear";
import { GearItem } from "@/types";

export default function BrowseGearPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
        </div>
      }
    >
      <GearCatalogContent />
    </React.Suspense>
  );
}

function GearCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state
  const categoryIdParam = searchParams.get("categoryId") || "";
  const brandParam = searchParams.get("brand") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const availableOnlyParam = searchParams.get("availableOnly") === "true";

  // Form local state
  const [selectedCategory, setSelectedCategory] = useState(categoryIdParam);
  const [brandSearch, setBrandSearch] = useState(brandParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [availableOnly, setAvailableOnly] = useState(availableOnlyParam);

  // Queries
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];
  const { data: gearData, isLoading: gearLoading } = useGearList({
    categoryId: selectedCategory || undefined,
    brand: brandSearch || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    availableOnly: availableOnly || undefined,
  });

  const gearItems = React.useMemo(() => gearData?.data || [], [gearData?.data]);

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
    setAvailableOnly(false);
    router.push("/gear");
  };

  // Client-side sorting state
  const [sortOption, setSortOption] = useState<string>("featured");

  // Filter and sort items
  const sortedGearItems = React.useMemo(() => {
    const items = [...gearItems];
    if (sortOption === "price-low") {
      items.sort((a: GearItem, b: GearItem) => a.pricePerDay - b.pricePerDay);
    } else if (sortOption === "price-high") {
      items.sort((a: GearItem, b: GearItem) => b.pricePerDay - a.pricePerDay);
    } else if (sortOption === "name-asc") {
      items.sort((a: GearItem, b: GearItem) => a.name.localeCompare(b.name));
    } else if (sortOption === "newest") {
      items.sort(
        (a: GearItem, b: GearItem) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }
    return items;
  }, [gearItems, sortOption]);

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 xl:max-w-350 2xl:max-w-[1600px]">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Browse Equipment Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Find available outdoor and sports gear for your next adventure.
          </p>
        </div>

        {/* Live Active Results & Sort Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold whitespace-nowrap text-slate-500">
            Showing{" "}
            <strong className="text-slate-900 dark:text-white">
              {sortedGearItems.length}
            </strong>{" "}
            items
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-xs outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest Listed</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <aside className="h-fit space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <SlidersHorizontal className="text-primary h-5 w-5" /> Filters
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="cursor-pointer gap-1 text-xs text-slate-500 hover:text-red-500"
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
                placeholder="e.g. Black Diamond, Trek"
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
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="text-slate-400">-</span>
              <Input
                type="number"
                placeholder="Max $"
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
              className="h-4 w-4 cursor-pointer rounded accent-rose-600"
            />
          </div>

          <Button
            onClick={applyFilters}
            className="bg-primary text-primary-foreground w-full cursor-pointer font-bold hover:bg-rose-700"
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
          ) : sortedGearItems.length === 0 ? (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white px-4 py-20 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950 dark:text-rose-400">
                <Filter className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  No Equipment Matches Your Filters
                </p>
                <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  We couldn&apos;t find any gear matching your current search
                  parameters. Try expanding your price range or clearing keyword
                  filters.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="font-bold"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Reset All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedGearItems.map((gear) => (
                <GearCard key={gear.id} gear={gear} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
