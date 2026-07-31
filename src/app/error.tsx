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
      <div className="space-y-6 max-w-md mx-auto">
        <Link href="/" className="inline-block">
          <Image
            src="/main_logo.svg"
            alt="GearUp Logo"
            width={160}
            height={50}
            className="h-12 w-auto object-contain mx-auto"
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
          <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
            An unexpected error occurred while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            className="w-full sm:w-auto bg-primary font-bold text-white hover:bg-rose-700"
            onClick={() => reset()}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto font-medium"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
