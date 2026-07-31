"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Loader2, CheckCircle2, Camera, ImageOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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

    // Preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    try {
      const result = await uploadImage.mutateAsync(file);
      setValue("profile_image", result.data.url);
      setProfileImageUrl(result.data.url);
      toast.success("Image uploaded successfully!");
    } catch {
      setAvatarPreview(null);
    }
  };

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
          My Profile &amp; Preferences
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your personal information and public display options.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column: Avatar Card */}
        <Card className="h-fit border-slate-200 dark:border-slate-800">
          <CardContent className="space-y-4 p-6 text-center">
            {/* Avatar with click-to-upload */}
            <div className="group relative mx-auto h-24 w-24">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt="Profile avatar"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover shadow-md ring-2 ring-blue-100 dark:ring-blue-900"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-600 shadow-inner dark:bg-blue-950">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}

              {/* Upload overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadImage.isPending}
                className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
              >
                {uploadImage.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                ) : (
                  <>
                    <Camera className="h-5 w-5 text-white" />
                    <span className="mt-1 text-[10px] font-semibold text-white">
                      Change
                    </span>
                  </>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
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

            <p className="text-[11px] text-slate-400">
              Click avatar to upload image
            </p>
          </CardContent>
        </Card>

        {/* Right Column: Edit Profile Form */}
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
                  <Input {...register("name")} placeholder="Your Full Name" />
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

                {/* Profile Image URL + Cloudinary Upload */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Profile Image
                  </label>
                  <div className="flex gap-2">
                    <Input
                      {...register("profile_image")}
                      placeholder="https://... or upload via avatar"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadImage.isPending}
                      className="shrink-0"
                    >
                      {uploadImage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ImageOff className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.profile_image && (
                    <p className="text-xs text-red-500">
                      {errors.profile_image.message}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Bio / Short Intro (Optional)
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    placeholder="Tell others a bit about yourself..."
                    className="w-full rounded-md border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-600 dark:border-slate-800 dark:bg-slate-950"
                  />
                  {errors.bio && (
                    <p className="text-xs text-red-500">{errors.bio.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={updateProfile.isPending || uploadImage.isPending}
                  className="bg-blue-600 px-6 font-bold text-white hover:bg-blue-700"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Save Profile
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
