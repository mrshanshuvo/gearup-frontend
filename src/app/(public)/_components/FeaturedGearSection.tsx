import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GearCard } from "@/components/gear/GearCard";
import { GearSkeleton } from "@/components/gear/GearSkeleton";

interface FeaturedGearSectionProps {
  gearItems: any[];
  gearLoading: boolean;
}

export function FeaturedGearSection({
  gearItems,
  gearLoading,
}: FeaturedGearSectionProps) {
  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Featured Gear Available Now
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Top rated equipment ready for instant booking
          </p>
        </div>

        <Button
          variant="ghost"
          className="text-primary font-bold hover:text-rose-700 cursor-pointer"
          onClick={() => (window.location.href = "/gear")}
        >
          View All <ArrowRight className="ml-1 inline h-4 w-4" />
        </Button>
      </div>

      {gearLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <GearSkeleton key={i} />
          ))}
        </div>
      ) : gearItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
          <p className="text-slate-500">No equipment currently available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {gearItems.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      )}
    </section>
  );
}
