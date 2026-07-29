"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyProfile, useUpdateProfile } from "@/hooks/useUser";
import {
  updateProfileSchema,
  UpdateProfileInput,
} from "@/validations/profile.schema";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: userResponse, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const user = userResponse?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: user?.name || "",
      bio: user?.bio || "",
      profile_image: user?.profile_image || "",
    },
  });

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          My Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your personal information and public display options.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Account Overview Card */}
        <Card className="h-fit border-slate-200 dark:border-slate-800">
          <CardContent className="space-y-4 p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl font-bold text-emerald-600 shadow-inner dark:bg-emerald-950">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {user?.name}
              </h2>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <Badge
              variant="outline"
              className="border-emerald-600 text-emerald-600"
            >
              <Shield className="mr-1 h-3 w-3" /> {user?.role} Account
            </Badge>

            {user?.bio && (
              <p className="border-t border-slate-100 pt-3 text-xs text-slate-600 italic dark:border-slate-800 dark:text-slate-400">
                "{user.bio}"
              </p>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Edit Profile Form (2 Cols) */}
        <div className="md:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="space-y-6 p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Edit Profile Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <Input {...register("name")} placeholder="Your Name" />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email (Read only) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address (Read-only)
                  </label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-slate-100 dark:bg-slate-900"
                  />
                </div>

                {/* Profile Image URL */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Profile Avatar Image URL (Optional)
                  </label>
                  <Input
                    {...register("profile_image")}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  {errors.profile_image && (
                    <p className="text-xs text-red-500">
                      {errors.profile_image.message}
                    </p>
                  )}
                </div>

                {/* Bio / Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Bio / Short Intro (Optional)
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    placeholder="Tell sports equipment providers a bit about yourself..."
                    className="w-full rounded-md border border-slate-200 p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  />
                  {errors.bio && (
                    <p className="text-xs text-red-500">{errors.bio.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="bg-emerald-600 px-6 font-bold text-white hover:bg-emerald-700"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                      Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Save Profile
                      Updates
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
