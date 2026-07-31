"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Loader2, CheckCircle2, Camera } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMyProfile, useUpdateProfile } from "@/hooks/useUser";
import { useUploadImage } from "@/hooks/useUpload";
import {
  updateProfileSchema,
  UpdateProfileInput,
} from "@/validations/profile.schema";
import { toast } from "sonner";

export default function ProfileForm() {
  const { data: userResponse, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();
  const uploadImage = useUploadImage();
  const user = userResponse?.data;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: user?.name || "",
      bio: user?.bio || "",
      profile_image: user?.profile_image || "",
    },
  });

  useEffect(() => {
    if (user?.profile_image) {
      setProfileImageUrl(user.profile_image);
    }
  }, [user?.profile_image]);

  const displayImage = avatarPreview || profileImageUrl || null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show instant local preview while uploading
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    try {
      const result = await uploadImage.mutateAsync(file);
      setValue("profile_image", result.data.url);
      setProfileImageUrl(result.data.url);
      setAvatarPreview(null); // use the real CDN URL now
      toast.success("Photo updated!");
    } catch {
      setAvatarPreview(null);
    }
  };

  const onSubmit = async (data: UpdateProfileInput) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success("Profile saved successfully!");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to save profile");
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
          My Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your personal information and display options.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left column — avatar card */}
        <Card className="h-fit border-slate-200 dark:border-slate-800">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            {/* Clickable avatar */}
            <div className="group relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadImage.isPending}
                className="relative block h-28 w-28 cursor-pointer rounded-full focus:ring-4 focus:ring-blue-500/30 focus:outline-none disabled:cursor-not-allowed"
                title="Change profile photo"
              >
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt="Profile photo"
                    width={112}
                    height={112}
                    className={`h-28 w-28 rounded-full object-cover ring-4 ring-slate-100 transition-opacity duration-300 dark:ring-slate-800 ${uploadImage.isPending ? "opacity-40" : "opacity-100"}`}
                  />
                ) : (
                  <span
                    className={`flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white ring-4 ring-slate-100 transition-opacity duration-300 dark:ring-slate-800 ${uploadImage.isPending ? "opacity-40" : "opacity-100"}`}
                  >
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}

                {/* Always-visible loading overlay when uploading */}
                {uploadImage.isPending && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40">
                    {/* Spinning SVG ring */}
                    <svg
                      className="h-10 w-10 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </span>
                )}

                {/* Hover overlay — only when NOT uploading */}
                {!uploadImage.isPending && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 opacity-0 transition-all duration-200 group-hover:opacity-100">
                    <Camera className="h-6 w-6 text-white" />
                    <span className="mt-1 text-[11px] font-semibold text-white">
                      Change
                    </span>
                  </span>
                )}
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Upload status text */}
            {uploadImage.isPending && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading photo...
              </p>
            )}

            <div className="text-center">
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <Badge
              variant="outline"
              className="border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
            >
              <Shield className="mr-1 h-3 w-3" />
              {user?.role}
            </Badge>

            {user?.bio && (
              <p className="border-t border-slate-100 pt-3 text-center text-xs text-slate-500 italic dark:border-slate-800">
                &quot;{user.bio}&quot;
              </p>
            )}

            <p className="text-[11px] text-slate-400">Click photo to change</p>
          </CardContent>
        </Card>

        {/* Right column — edit form */}
        <div className="md:col-span-2">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <h2 className="mb-6 text-base font-bold text-slate-900 dark:text-slate-100">
                Edit Details
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* profile_image is tracked silently — no URL field shown */}
                <input type="hidden" {...register("profile_image")} />

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <Input
                    {...register("name")}
                    placeholder="Your full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email — read-only */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="cursor-not-allowed bg-slate-50 text-slate-500 dark:bg-slate-900"
                  />
                  <p className="text-[11px] text-slate-400">
                    Email cannot be changed
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Bio
                    <span className="ml-1 font-normal text-slate-400">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    placeholder="Tell others a bit about yourself..."
                    className="w-full resize-none rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm transition-colors outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
                  />
                  {errors.bio && (
                    <p className="text-xs text-red-500">{errors.bio.message}</p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updateProfile.isPending || uploadImage.isPending}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
