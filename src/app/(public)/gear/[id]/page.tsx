"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Tag,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { differenceInDays, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGearDetail } from "@/hooks/useGear";
import useAuthStore from "@/stores/authStore";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export default function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const gearId = resolvedParams.id;
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: gearResponse, isLoading, isError } = useGearDetail(gearId);
  const gear = gearResponse?.data;

  // Date selection states (Default 3 days starting tomorrow)
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const defaultEnd = addDays(tomorrow, 3);

  const [startDateStr, setStartDateStr] = useState(
    tomorrow.toISOString().split("T")[0]
  );
  const [endDateStr, setEndDateStr] = useState(
    defaultEnd.toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate rental day duration & total cost
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const rentalDays = differenceInDays(end, start);
  const totalCost = gear && rentalDays > 0 ? rentalDays * gear.pricePerDay : 0;

  const handleRentNow = async () => {
    if (!accessToken || !user) {
      toast.info("Please log in to place a rental order");
      router.push(`/auth/login?redirect=/gear/${gearId}`);
      return;
    }

    if (user.role !== "Customer") {
      toast.error("Only Customer accounts can rent sports gear");
      return;
    }

    if (rentalDays <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        gearItemId: gearId,
        startDate: new Date(startDateStr).toISOString(),
        endDate: new Date(endDateStr).toISOString(),
      };

      const res = await axiosInstance.post("/rentals", payload);
      if (res.data.success) {
        toast.success("Rental order placed successfully!");
        router.push("/dashboard/customer/orders");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(
        error.response?.data?.message || "Failed to create rental order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (isError || !gear) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-16 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="text-2xl font-bold">Gear Not Found</h1>
        <p className="text-slate-500">
          The requested equipment item does not exist or has been removed.
        </p>
        <Button onClick={() => router.push("/gear")}>Back to Inventory</Button>
      </div>
    );
  }

  const isAvailable = gear.stock > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 xl:max-w-350 2xl:max-w-[1600px]">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-600 dark:text-slate-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Gear Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {gear.imageUrl ? (
            <Image
              src={gear.imageUrl}
              alt={gear.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              No Image Available
            </div>
          )}
        </div>

        {/* Right: Details & Rent Action Box */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className="flex items-center gap-1 border-rose-500 font-bold text-rose-600"
              >
                <Tag className="h-3.5 w-3.5" />{" "}
                {gear.category?.name || "General"}
              </Badge>
              <Badge
                className={
                  isAvailable
                    ? "bg-rose-500 font-bold text-white"
                    : "bg-red-500 font-bold text-white"
                }
              >
                {isAvailable ? `${gear.stock} Units In Stock` : "Out of Stock"}
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {gear.name}
            </h1>
            <p className="text-sm font-semibold text-slate-500">
              Brand: {gear.brand}
            </p>

            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-primary text-4xl font-black">
                ${gear.pricePerDay}
              </span>
              <span className="text-sm text-slate-500">/ day</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-200 pt-4 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Description
            </h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {gear.description}
            </p>
          </div>

          {/* Provider Chip */}
          {gear.provider && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-100 p-3 dark:border-slate-800 dark:bg-slate-900">
              <ShieldCheck className="text-primary h-6 w-6" />
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Provided by {gear.provider.name}
                </p>
                <p className="text-[11px] text-slate-500">
                  Verified Gear Vendor
                </p>
              </div>
            </div>
          )}

          {/* Interactive Date Range & Rent Booking Card */}
          <Card className="border-slate-200 bg-slate-50/50 shadow-md dark:border-slate-800 dark:bg-slate-900/50">
            <CardContent className="space-y-4 p-6">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <Calendar className="text-primary h-5 w-5" /> Select Rental
                Duration
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    min={tomorrow.toISOString().split("T")[0]}
                    value={startDateStr}
                    onChange={(e) => setStartDateStr(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    End Date
                  </label>
                  <Input
                    type="date"
                    min={startDateStr}
                    value={endDateStr}
                    onChange={(e) => setEndDateStr(e.target.value)}
                  />
                </div>
              </div>

              {/* Total Calculation Display */}
              {rentalDays > 0 ? (
                <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900 dark:bg-rose-950/40">
                  <div>
                    <p className="text-xs text-rose-800 dark:text-rose-300">
                      Duration:{" "}
                      <strong>
                        {rentalDays} day{rentalDays > 1 ? "s" : ""}
                      </strong>
                    </p>
                    <p className="text-[11px] text-rose-600 dark:text-rose-400">
                      ${gear.pricePerDay} × {rentalDays} days
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                      Total Estimated Cost
                    </p>
                    <p className="text-2xl font-black text-rose-700 dark:text-rose-300">
                      ${totalCost}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs font-medium text-red-500">
                  Please select a valid end date after start date.
                </p>
              )}

              <Button
                onClick={handleRentNow}
                disabled={!isAvailable || rentalDays <= 0 || isSubmitting}
                className="bg-primary text-primary-foreground w-full py-6 text-base font-bold shadow-lg hover:bg-rose-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Placing
                    Order...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" /> Rent Now ($
                    {totalCost})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Customer Reviews & Feedback Section */}
      <div className="space-y-6 border-t border-slate-200 pt-12 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Customer Reviews & Ratings
            </h2>
            <p className="text-sm text-slate-500">
              Verified renter feedback for this equipment
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold dark:border-slate-800 dark:bg-slate-900">
            <span className="text-base font-extrabold text-amber-500">
              4.9 ★
            </span>
            <span className="text-xs font-normal text-slate-400">
              (Verified Reviews)
            </span>
          </div>
        </div>

        {(
          gear as {
            reviews?: Array<{
              id?: string;
              rating?: number;
              createdAt?: string;
              user?: { name?: string };
              comment?: string;
            }>;
          }
        ).reviews &&
        (
          gear as {
            reviews?: Array<{
              id?: string;
              rating?: number;
              createdAt?: string;
              user?: { name?: string };
              comment?: string;
            }>;
          }
        ).reviews!.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {(
              gear as {
                reviews?: Array<{
                  id?: string;
                  rating?: number;
                  createdAt?: string;
                  user?: { name?: string };
                  comment?: string;
                }>;
              }
            ).reviews!.map((rev, idx: number) => (
              <Card
                key={rev.id || idx}
                className="border-slate-200 dark:border-slate-800"
              >
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <span key={i} className="text-sm">
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString()
                        : "Verified Renter"}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    &ldquo;
                    {rev.comment ||
                      "Great equipment! Exactly as described and in excellent working condition."}
                    &rdquo;
                  </p>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    — {rev.user?.name || "Verified Renter"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
            <CardContent className="space-y-2 p-8 text-center">
              <div className="flex justify-center text-lg text-amber-400">
                ★★★★★
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                100% Quality Satisfaction Guaranteed
              </p>
              <p className="mx-auto max-w-md text-xs text-slate-500">
                Be the first to leave a review after completing your rental
                order! All items undergo provider quality verification prior to
                pickup.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
