import React from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProviderCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:max-w-350 2xl:max-w-[1600px]">
      <div className="grid grid-cols-1 items-center gap-12 overflow-hidden rounded-3xl border border-rose-100 bg-rose-50/70 p-8 lg:grid-cols-12 lg:p-12 dark:border-rose-950/50 dark:bg-rose-950/20">
        <div className="space-y-6 lg:col-span-7">
          <Badge className="bg-rose-600 font-bold text-white">
            Earn Extra Income
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Have Unused Sports Gear? <br />
            <span className="text-rose-600 dark:text-rose-400">
              List it & start earning today.
            </span>
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Turn your bikes, tents, kayaks, and athletic equipment into passive
            income. Set custom rates, approve booking requests, and get paid
            securely.
          </p>
          <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />{" "}
              Keep 100% control over rental dates & prices
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />{" "}
              Verified customer profiles & secure Stripe deposits
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />{" "}
              Dedicated Provider Dashboard analytics
            </li>
          </ul>
          <Button
            size="lg"
            className="cursor-pointer bg-rose-600 font-bold text-white shadow-lg hover:bg-rose-700"
            onClick={() =>
              (window.location.href = "/auth/register?role=Provider")
            }
          >
            Start Listing Free <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-white/20 shadow-xl lg:col-span-5">
          <Image
            src="/hero/kari-ham-ToHKwi1KXtc-unsplash.jpg"
            alt="Equipment Provider"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
