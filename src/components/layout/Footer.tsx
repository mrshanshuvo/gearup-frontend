import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-slate-200 bg-slate-900 text-slate-400 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 xl:max-w-350 2xl:max-w-[1600px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/main_logo.svg"
                alt="GearUp Logo"
                width={140}
                height={44}
                className="h-10 w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              GearUp is the leading sports and outdoor equipment rental
              marketplace. Connecting outdoor adventurers with verified
              equipment providers nationwide.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-rose-400">
              <span className="flex items-center gap-1.5 rounded-full border border-rose-800/40 bg-rose-950/60 px-3 py-1">
                <ShieldCheck className="h-4 w-4 text-rose-500" /> Stripe
                Security Guaranteed
              </span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              Explore Platform
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/gear"
                  className="transition-colors hover:text-white"
                >
                  Browse Gear Inventory
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="transition-colors hover:text-white"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/gear"
                  className="transition-colors hover:text-white"
                >
                  Popular Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Account & Providers */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              Account & Providers
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link
                  href="/auth/login"
                  className="transition-colors hover:text-white"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="transition-colors hover:text-white"
                >
                  Create Renter Account
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register?role=Provider"
                  className="transition-colors hover:text-white"
                >
                  Become a Gear Provider
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customer"
                  className="transition-colors hover:text-white"
                >
                  My Orders Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              Support & Contact
            </h3>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <a
                  href="mailto:support@gearup.app"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 text-rose-500" />{" "}
                  support@gearup.app
                </a>
              </li>
              <li>
                <a
                  href="tel:18005554327"
                  className="flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 text-rose-500" /> +1 (800)
                  555-GEAR
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />{" "}
                San Francisco, CA
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-xs text-slate-500 md:flex-row">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} GearUp Rental Inc.
          </p>
          <div className="flex items-center gap-6 font-medium">
            <Link
              href="/privacy"
              className="transition-colors hover:text-slate-300"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-slate-300"
            >
              Terms of Service
            </Link>
            <Link
              href="/terms#cookies"
              className="transition-colors hover:text-slate-300"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
