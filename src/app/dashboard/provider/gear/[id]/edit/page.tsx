"use client";

import React, { use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories, useGearDetail } from "@/hooks/useGear";
import { useUpdateGear } from "@/hooks/useProviderGear";
import { useUploadImage } from "@/hooks/useUpload";
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
  const uploadImage = useUploadImage();

  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  const currentImageUrl = useWatch({ control, name: "imageUrl" });
  const currentCategoryId = useWatch({ control, name: "categoryId" });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview while uploading
    const localPreview = URL.createObjectURL(file);
    setValue("imageUrl", localPreview);

    try {
      const res = await uploadImage.mutateAsync(file);
      setValue("imageUrl", res.data.url);
      toast.success("Image uploaded successfully!");
    } catch {
      setValue("imageUrl", gear?.imageUrl || "");
    }
  };

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
                <Select
                  value={currentCategoryId || ""}
                  onValueChange={(val) => {
                    if (val) setValue("categoryId", val);
                  }}
                >
                  <SelectTrigger className="w-full font-medium">
                    <SelectValue placeholder="Select Category">
                      {categories.find((c) => c.id === currentCategoryId)
                        ?.name || "Select Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent align="start">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            {/* Equipment Image Dropzone & Preview */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Equipment Image
              </label>

              {currentImageUrl ? (
                <div className="group relative flex h-52 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 dark:border-slate-800">
                  <Image
                    src={currentImageUrl}
                    alt="Gear Preview"
                    fill
                    className={`object-cover transition-all ${
                      uploadImage.isPending
                        ? "opacity-40"
                        : "group-hover:opacity-75"
                    }`}
                  />
                  {uploadImage.isPending ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                      <p className="mt-2 text-xs font-bold text-white">
                        Uploading to Cloud Storage...
                      </p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setValue("imageUrl", "")}
                        className="font-bold"
                      >
                        Remove & Upload Different Image
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-emerald-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-emerald-500 dark:hover:bg-slate-900">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="mb-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                      Click to upload equipment image
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      PNG, JPG, WEBP (Uploaded directly to Cloudinary)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
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
