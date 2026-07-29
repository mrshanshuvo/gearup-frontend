"use client";

import React from "react";
import Image from "next/image";
import { PlusCircle, Edit3, Trash2, Tag, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProviderGearList, useDeleteGear } from "@/hooks/useProviderGear";
import useAuthStore from "@/stores/authStore";
import { toast } from "sonner";

export default function MyGearInventoryPage() {
  const user = useAuthStore((state) => state.user);
  const { data: gearData, isLoading } = useProviderGearList(user?.id);
  const deleteGear = useDeleteGear();

  const gearItems = gearData?.data || [];

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from inventory?`))
      return;

    try {
      await deleteGear.mutateAsync(id);
      toast.success(`"${name}" deleted successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete gear");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            My Gear Inventory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your sports and outdoor equipment listings.
          </p>
        </div>

        <Button
          onClick={() =>
            (window.location.href = "/dashboard/provider/gear/new")
          }
          className="bg-emerald-600 font-bold text-white hover:bg-emerald-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Gear
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : gearItems.length === 0 ? (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white py-16 text-center dark:border-slate-800 dark:bg-slate-900">
          <Package className="mx-auto h-12 w-12 text-slate-400" />
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">
            No Equipment Listed Yet
          </p>
          <p className="mx-auto max-w-sm text-xs text-slate-500">
            Start earning by listing your sports & outdoor gear for customer
            rental.
          </p>
          <Button
            onClick={() =>
              (window.location.href = "/dashboard/provider/gear/new")
            }
            className="bg-emerald-600 font-bold text-white"
          >
            Create First Listing
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950">
                  <th className="p-4">Item</th>
                  <th className="p-4">Brand</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price / Day</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {gearItems.map((gear) => (
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
                      <span className="line-clamp-1 font-bold text-slate-900 dark:text-slate-100">
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
                        <Tag className="mr-1 h-3 w-3 text-emerald-600" />
                        {gear.category?.name || "General"}
                      </Badge>
                    </td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">
                      ${gear.pricePerDay}
                    </td>
                    <td className="p-4">
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
                    <td className="space-x-2 p-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          (window.location.href = `/dashboard/provider/gear/${gear.id}/edit`)
                        }
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => handleDelete(gear.id, gear.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
