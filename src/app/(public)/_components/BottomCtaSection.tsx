import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BottomCtaSection() {
  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-6 py-16 text-center text-white shadow-2xl">
      <div className="absolute inset-0 z-0 opacity-30">
        <Image
          src="/hero/pranab-debnath-cp8D7oWxsOE-unsplash.jpg"
          alt="GearUp Adventure"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
          Ready to Start Your Next Adventure?
        </h2>
        <p className="mx-auto max-w-xl text-base text-slate-300">
          Join thousands of outdoor enthusiasts renting top-quality sports
          equipment at fractions of retail price.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-rose-600 px-8 font-bold text-white shadow-lg hover:bg-rose-700 cursor-pointer"
            onClick={() => (window.location.href = "/gear")}
          >
            Browse Gear Catalog <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white/30 bg-white/10 px-8 font-bold text-white backdrop-blur-md hover:bg-white hover:text-slate-900 cursor-pointer"
            onClick={() =>
              (window.location.href = "/auth/register?role=Provider")
            }
          >
            List Your Gear Free
          </Button>
        </div>
      </div>
    </section>
  );
}
