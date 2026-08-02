import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
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
          <span className="inline-block rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold tracking-wider text-rose-600 uppercase dark:bg-rose-950 dark:text-rose-400">
            404 — Page Not Found
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Off the Trail!
          </h1>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Sorry, the page or equipment listing you are looking for has been
            moved, removed, or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-rose-700 sm:w-auto"
          >
            <Home className="h-4 w-4" /> Return Home
          </Link>
          <Link
            href="/gear"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Compass className="h-4 w-4" /> Browse Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
