"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2, Dumbbell, UserCheck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRegister } from "@/hooks/useAuth";
import { registerSchema, RegisterInput } from "@/validations/auth.schema";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerUser, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "Customer",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: RegisterInput) => {
    registerUser(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-auto items-center justify-center">
            <Image
              src="/main_logo.svg"
              alt="GearUp Logo"
              width={160}
              height={50}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create a GearUp Account
          </CardTitle>
          <CardDescription>
            Join as a Customer to rent gear or a Provider to list equipment
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Role Selector Tabs */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Select Account Role
              </label>
              <Tabs
                value={selectedRole}
                onValueChange={(val) =>
                  setValue("role", val as "Customer" | "Provider")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="Customer"
                    className="flex items-center gap-2"
                  >
                    <UserCheck className="h-4 w-4" /> Customer
                  </TabsTrigger>
                  <TabsTrigger
                    value="Provider"
                    className="flex items-center gap-2"
                  >
                    <Store className="h-4 w-4" /> Provider
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <Input
                type="text"
                placeholder="John Doe"
                {...register("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground w-full font-bold hover:bg-rose-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Registering...
                </>
              ) : (
                `Register as ${selectedRole}`
              )}
            </Button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-primary font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
