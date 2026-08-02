import React from "react";
import { MessageSquareQuote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Alex R.",
      role: "Outdoor Enthusiast",
      city: "Denver, CO",
      comment:
        "Rented top-tier camping gear for a weekend trip to Rocky Mountain NP. Saved over $600 compared to buying new equipment!",
      stars: 5,
    },
    {
      name: "Sarah M.",
      role: "Gear Provider",
      city: "Seattle, WA",
      comment:
        "Listing my unused kayaks and mountain bikes has earned me $1,200/month. The Provider Dashboard makes managing orders effortless.",
      stars: 5,
    },
    {
      name: "David K.",
      role: "Frequent Cyclist",
      city: "Austin, TX",
      comment:
        "Fast pickup, verified clean equipment, and seamless Stripe checkout. GearUp is my go-to for weekend adventure trips.",
      stars: 5,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8 xl:max-w-350 2xl:max-w-[1600px]">
      <div className="space-y-2 text-center">
        <Badge
          variant="outline"
          className="border-rose-200 text-xs font-bold text-rose-600"
        >
          <MessageSquareQuote className="mr-1 h-3.5 w-3.5" /> Renter Feedback
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Loved by Outdoor Adventurers
        </h2>
        <p className="mx-auto max-w-xl text-sm text-slate-500 dark:text-slate-400">
          Here is what verified customers and equipment providers have to say
          about GearUp.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <Card
            key={idx}
            className="border-slate-200 shadow-xs dark:border-slate-800"
          >
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-slate-600 italic dark:text-slate-300">
                &ldquo;{t.comment}&rdquo;
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{t.city}</p>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {t.role}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
