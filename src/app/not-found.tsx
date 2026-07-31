import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Compass, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
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
          <span className="inline-block rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
            404 — Page Not Found
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Off the Trail!
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed dark:text-slate-400">
            Sorry, the page or equipment listing you are looking for has been moved, removed, or doesn't exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            className="w-full sm:w-auto bg-primary font-bold text-white hover:bg-rose-700"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="mr-2 h-4 w-4" /> Return Home
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto font-medium"
            onClick={() => (window.location.href = "/gear")}
          >
            <Compass className="mr-2 h-4 w-4" /> Browse Inventory
          </Button>
        </div>
      </div>
    </div>
  );
}
