"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, Tag, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminGearList } from "@/hooks/useAdminGear";
import { useCategories } from "@/hooks/useGear";
import { Pagination } from "@/components/ui/Pagination";

export default function GlobalGearInventoryPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const { data: gearData, isLoading } = useAdminGearList();
  const { data: categoryData } = useCategories();

  const gearItems = gearData?.data || [];
  const categories = categoryData?.data || [];

  const filteredGear = gearItems.filter((gear) => {
    const matchesSearch =
      gear.name.toLowerCase().includes(search.toLowerCase()) ||
      gear.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory && selectedCategory !== "all"
        ? gear.categoryId === selectedCategory
        : true;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredGear.length / ITEMS_PER_PAGE);
  const paginatedGear = filteredGear.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Global Gear Inventory Overview
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View all equipment listings submitted across all gear vendors.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Input
            placeholder="Search by gear name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute top-2.5 right-2.5 h-4 w-4 text-slate-400" />
        </div>

        <div className="w-full sm:w-56">
          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val || "all");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full font-bold">
              <SelectValue>
                {selectedCategory === "all"
                  ? "All Categories"
                  : categories.find((c) => c.id === selectedCategory)?.name ||
                    "All Categories"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Global Inventory Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : filteredGear.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Package className="mx-auto mb-2 h-12 w-12 text-slate-400" />
          <p className="text-sm text-slate-500">No equipment items found.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950">
                  <th className="p-4">Equipment Item</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Vendor / Provider</th>
                  <th className="p-4">Price / Day</th>
                  <th className="p-4 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {paginatedGear.map((gear) => (
                  <tr
                    key={gear.id}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="flex items-center gap-3 p-4">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-900">
                        {gear.imageUrl ? (
                          <Image
                            src={gear.imageUrl}
                            alt={gear.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">
                            No Img
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {gear.name}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {gear.brand}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant="outline"
                        className="border-slate-300 dark:border-slate-700"
                      >
                        <Tag className="mr-1 h-3 w-3 text-amber-500" />
                        {gear.category?.name || "General"}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                      {gear.provider?.name || "Provider"}
                    </td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      ${gear.pricePerDay}
                    </td>
                    <td className="p-4 text-right">
                      <Badge
                        className={
                          gear.stock > 0
                            ? "bg-emerald-500 text-white"
                            : "bg-red-500 text-white"
                        }
                      >
                        {gear.stock} units
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
