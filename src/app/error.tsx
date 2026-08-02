"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mx-auto max-w-md space-y-6">
        <Link href="/" className="inline-block">
          <Image
            src="/main_logo.svg"
            alt="GearUp Logo"
            width={160}
            height={50}
            className="mx-auto h-12 w-auto object-contain"
            priority
          />
        </Link>

        <div className="space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Something went wrong!
          </h1>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            An unexpected error occurred while loading this page. Our team has
            been notified.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
          <Button
            className="bg-primary w-full font-bold text-white hover:bg-rose-700 sm:w-auto"
            onClick={() => reset()}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full font-medium sm:w-auto"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
