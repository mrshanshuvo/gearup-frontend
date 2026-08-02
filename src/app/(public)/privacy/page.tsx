import React from "react";
import { Metadata } from "next";
import { ShieldCheck, Lock, FileText, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | GearUp",
  description:
    "Learn how GearUp collects, protects, and handles your personal data and security.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-8 dark:border-slate-800">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-bold tracking-wider uppercase">
            Trust & Transparency
          </span>
        </div>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Last Updated: August 2, 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Lock className="h-5 w-5 text-rose-600" /> 1. Information We Collect
          </h2>
          <p>
            When you register for a GearUp account as a Customer or Provider, we
            collect personal information necessary to facilitate sports
            equipment rentals securely:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <strong>Account Profile Data:</strong> Full name, email address,
              phone number, and password.
            </li>
            <li>
              <strong>Verification Data:</strong> Identity verification details
              required for equipment safety and fraud prevention.
            </li>
            <li>
              <strong>Listing & Rental Data:</strong> Product descriptions,
              rental dates, addresses, and customer communications.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <FileText className="h-5 w-5 text-rose-600" /> 2. Payment & Stripe
            Security
          </h2>
          <p>
            GearUp processes all financial transactions through{" "}
            <strong>Stripe Connect</strong>. We do not store or process payment
            card numbers or bank credentials on our local servers. Stripe
            independently manages payment credentials according to strict
            PCI-DSS Level 1 compliance standards.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <RefreshCw className="h-5 w-5 text-rose-600" /> 3. Data Usage &
            Protection
          </h2>
          <p>
            Your personal information is strictly used to operate the GearUp
            marketplace platform. We do not sell or rent your personal data to
            third parties. We employ SSL/TLS encryption, secure session cookies,
            and database access controls to safeguard your data.
          </p>
        </section>

        <section className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. Contact Us About Your Privacy
          </h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to
            exercise your data privacy rights, please contact our Data
            Protection Officer at{" "}
            <a
              href="mailto:privacy@gearup.app"
              className="font-bold text-rose-600 hover:underline"
            >
              privacy@gearup.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
