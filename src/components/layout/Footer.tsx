import React from "react";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2 text-lg font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
              GearUp
            </span>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} GearUp Rental Services. All rights
            reserved.
          </p>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <Link href="/" className="transition-colors hover:text-emerald-600">
              Home
            </Link>
            <Link
              href="/gear"
              className="transition-colors hover:text-emerald-600"
            >
              Browse Gear
            </Link>
            <Link
              href="/auth/login"
              className="transition-colors hover:text-emerald-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
