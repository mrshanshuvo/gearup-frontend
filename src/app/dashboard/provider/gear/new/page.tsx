"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/useGear";
import { useCreateGear } from "@/hooks/useProviderGear";
import { createGearSchema, CreateGearInput } from "@/validations/gear.schema";
import { toast } from "sonner";

export default function AddGearPage() {
  const router = useRouter();
  const { data: categoryData } = useCategories();
  const categories = categoryData?.data || [];

  const createGear = useCreateGear();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGearInput>({
    resolver: zodResolver(createGearSchema),
    defaultValues: {
      stock: 1,
      pricePerDay: 10,
    },
  });

  const onSubmit = async (data: CreateGearInput) => {
    try {
      await createGear.mutateAsync(data);
      toast.success("Equipment item listed successfully!");
      router.push("/dashboard/provider/gear");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to create gear listing"
      );
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Inventory
      </Button>

      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="space-y-6 p-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Add New Sports Equipment
            </h1>
            <p className="text-xs text-slate-500">
              List your sports or outdoor gear for customer rental bookings.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Gear Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Equipment Name
              </label>
              <Input
                {...register("name")}
                placeholder="e.g. Mountain Bike Helmet"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Brand & Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Brand Name
                </label>
                <Input {...register("brand")} placeholder="e.g. Giro" />
                {errors.brand && (
                  <p className="text-xs text-red-500">{errors.brand.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  {...register("categoryId")}
                  className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Price per Day ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("pricePerDay")}
                  placeholder="25.00"
                />
                {errors.pricePerDay && (
                  <p className="text-xs text-red-500">
                    {errors.pricePerDay.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Available Stock Quantity
                </label>
                <Input type="number" {...register("stock")} placeholder="1" />
                {errors.stock && (
                  <p className="text-xs text-red-500">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Image URL (Optional)
              </label>
              <Input
                {...register("imageUrl")}
                placeholder="https://images.unsplash.com/photo-..."
              />
              {errors.imageUrl && (
                <p className="text-xs text-red-500">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe equipment condition, size, features, etc."
                className="w-full rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              />
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={createGear.isPending}
              className="w-full bg-emerald-600 py-6 font-bold text-white"
            >
              {createGear.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                  Publishing...
                </>
              ) : (
                <>
                  <PlusCircle className="mr-2 h-5 w-5" /> Publish Gear Listing
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
