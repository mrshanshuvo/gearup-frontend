import React from "react";
import { Metadata } from "next";
import { Scale, ShieldCheck, AlertCircle, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | GearUp",
  description:
    "Terms and conditions governing the use of GearUp equipment rental platform.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <Scale className="h-5 w-5" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Legal Agreement
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Last Updated: August 2, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <FileCheck className="h-5 w-5 text-rose-600" /> 1. Acceptance of
            Terms
          </h2>
          <p>
            By accessing or using the GearUp platform as a Renter or Equipment
            Provider, you agree to comply with and be bound by these Terms of
            Service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <ShieldCheck className="h-5 w-5 text-rose-600" /> 2. Renter &
            Provider Responsibilities
          </h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Equipment Condition:</strong> Providers warrant that all
              listed sports and outdoor gear is inspected, safe, and fully
              operational before handing over to renters.
            </li>
            <li>
              <strong>Care & Return:</strong> Renters agree to return equipment
              in the same condition received at the agreed date and time.
            </li>
            <li>
              <strong>Security Deposit:</strong> GearUp reserves the right to
              charge security holds or late fees in cases of damaged or
              unreturned equipment.
            </li>
          </ul>
        </section>

        <section id="cookies" className="space-y-3 pt-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <AlertCircle className="h-5 w-5 text-rose-600" /> 3. Cookie Policy &
            Analytics
          </h2>
          <p>
            GearUp uses essential session cookies to maintain your login
            authentication and rental basket preferences. By continuing to use
            the platform, you consent to functional session storage.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Support & Dispute Resolution
          </h2>
          <p>
            If you encounter issues during an active booking or rental return,
            please contact GearUp Support immediately at{" "}
            <a
              href="mailto:support@gearup.app"
              className="font-bold text-rose-600 hover:underline"
            >
              support@gearup.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
