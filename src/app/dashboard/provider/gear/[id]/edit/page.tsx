"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories, useGearDetail } from "@/hooks/useGear";
import { useUpdateGear } from "@/hooks/useProviderGear";
import { updateGearSchema, UpdateGearInput } from "@/validations/gear.schema";
import { toast } from "sonner";

export default function EditGearPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const gearId = resolvedParams.id;
  const router = useRouter();

  const { data: gearResponse, isLoading } = useGearDetail(gearId);
  const { data: categoryData } = useCategories();
  const gear = gearResponse?.data;
  const categories = categoryData?.data || [];

  const updateGear = useUpdateGear();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateGearInput>({
    resolver: zodResolver(updateGearSchema),
    values: {
      name: gear?.name || "",
      brand: gear?.brand || "",
      categoryId: gear?.categoryId || "",
      pricePerDay: gear?.pricePerDay || 0,
      stock: gear?.stock || 0,
      imageUrl: gear?.imageUrl || "",
      description: gear?.description || "",
    },
  });

  const onSubmit = async (data: UpdateGearInput) => {
    try {
      await updateGear.mutateAsync({ id: gearId, payload: data });
      toast.success("Equipment listing updated successfully!");
      router.push("/dashboard/provider/gear");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Failed to update gear listing"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

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
              Edit Equipment Listing
            </h1>
            <p className="text-xs text-slate-500">
              Update pricing, stock availability, or description for{" "}
              {gear?.name}.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Gear Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Equipment Name
              </label>
              <Input {...register("name")} placeholder="Equipment Name" />
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
                <Input {...register("brand")} placeholder="Brand" />
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
                  <option value="">Select Category</option>
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
                  {...register("pricePerDay", { valueAsNumber: true })}
                />
                {errors.pricePerDay && (
                  <p className="text-xs text-red-500">
                    {errors.pricePerDay.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && (
                  <p className="text-xs text-red-500">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Image URL
              </label>
              <Input {...register("imageUrl")} placeholder="Image URL" />
              {errors.imageUrl && (
                <p className="text-xs text-red-500">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
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
              disabled={updateGear.isPending}
              className="w-full bg-emerald-600 py-6 font-bold text-white"
            >
              {updateGear.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving
                  Changes...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
