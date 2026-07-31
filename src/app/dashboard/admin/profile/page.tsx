"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Loader2 } from "lucide-react";
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
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
          Manage your personal information and account display options.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Account Overview Card */}
        <Card className="h-fit border-slate-200 dark:border-slate-800">
          <CardContent className="space-y-4 p-6 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-600 shadow-inner dark:bg-blue-950">
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
              className="border-blue-600 font-bold text-blue-600"
            >
              <Shield className="mr-1 h-3 w-3" /> {user?.role} Account
            </Badge>

            {user?.bio && (
              <p className="border-t border-slate-100 pt-3 text-xs italic text-slate-600 dark:border-slate-800 dark:text-slate-400">
                &quot;{user.bio}&quot;
              </p>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="Your Full Name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Bio / Description
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    placeholder="Tell us a little bit about yourself..."
                    className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-800"
                  />
                  {errors.bio && (
                    <p className="text-xs text-red-500">{errors.bio.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Profile Image URL
                  </label>
                  <Input
                    {...register("profile_image")}
                    placeholder="https://example.com/avatar.jpg"
                    className={errors.profile_image ? "border-red-500" : ""}
                  />
                  {errors.profile_image && (
                    <p className="text-xs text-red-500">
                      {errors.profile_image.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="cursor-pointer bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Saving...
                      </>
                    ) : (
                      "Save Profile Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
