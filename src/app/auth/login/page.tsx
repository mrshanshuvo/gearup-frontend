"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
import { useLogin } from "@/hooks/useAuth";
import { loginSchema, LoginInput } from "@/validations/auth.schema";

import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}

function LoginFormContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const registerHref = roleParam
    ? `/auth/register?role=${roleParam}`
    : "/auth/register";
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-14 w-auto items-center justify-center">
            <Link
              href="/"
              className="inline-block transition-opacity hover:opacity-90"
            >
              <Image
                src="/main_logo.svg"
                alt="GearUp Logo"
                width={160}
                height={50}
                className="h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back to GearUp
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging
                  in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href={registerHref}
                className="text-primary font-bold hover:underline"
              >
                Register
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
