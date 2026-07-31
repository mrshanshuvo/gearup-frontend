"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Search,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
  HelpCircle,
  MessageSquareQuote,
  TrendingUp,
  Award,
  Users,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { GearCard } from "@/components/gear/GearCard";
import { GearSkeleton } from "@/components/gear/GearSkeleton";
import { useCategories, useGearList } from "@/hooks/useGear";

export default function HomePage() {
  const { data: gearData, isLoading: gearLoading } = useGearList({
    availableOnly: true,
    limit: 8,
  });
  const { data: categoryData } = useCategories();

  const gearItems = gearData?.data || [];
  const categories = categoryData?.data || [];

  // Hero background image carousel images from assets
  const heroImages = [
    "/hero/astrid-schaffner-bi_amI3F4co-unsplash.jpg",
    "/hero/munbaik-cycling-clothing-Ln9uvGy5Yio-unsplash.jpg",
    "/hero/ricardo-iv-tamayo-AFlecBlcr8M-unsplash.jpg",
    "/hero/kari-ham-ToHKwi1KXtc-unsplash.jpg",
    "/hero/nader-saremi-Qm_ddQ-0Ps4-unsplash.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const faqs = [
    {
      q: "How does renting sports & outdoor gear work on GearUp?",
      a: "Simply browse available equipment by category or location, pick your rental start and end dates, and complete secure checkout via Stripe. Once confirmed, coordinate pickup directly with the verified provider.",
    },
    {
      q: "What if equipment is damaged or returned late?",
      a: "All rentals are protected under our Provider Safety Policy. Providers inspect equipment at pickup and return. Minor wear-and-tear is covered, while significant damage or late returns are resolved through secure deposit claims.",
    },
    {
      q: "Is there a security deposit required for high-value gear?",
      a: "Certain premium equipment (such as pro mountain bikes or specialized camping kits) may hold a temporary security deposit via Stripe. The hold is fully released within 24 hours of safe item return.",
    },
    {
      q: "How do I become a Gear Provider and earn money?",
      a: "Click 'Become a Gear Provider' to register a free Provider account. You can create listings for your unused sports equipment in under 2 minutes, set your custom daily rates, and manage bookings from your Provider Dashboard.",
    },
    {
      q: "What payment methods are supported?",
      a: "We support all major credit/debit cards, Apple Pay, and Google Pay through our PCI-DSS compliant Stripe checkout integration.",
    },
    {
      q: "Can I cancel or reschedule my rental booking?",
      a: "Yes! Full refunds are available for cancellations made at least 48 hours before the scheduled rental start date directly from your Customer Orders Dashboard.",
    },
  ];

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
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 px-4 py-28 text-white sm:px-6 lg:px-8">
        {/* Background Image Carousel Layer */}
        {heroImages.map((src, idx) => (
          <div
            key={src}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentImageIndex
                ? "scale-105 opacity-80"
                : "scale-100 opacity-0"
            }`}
            style={{ transitionProperty: "opacity, transform" }}
          >
            <Image
              src={src}
              alt="Sports & Outdoor Adventure"
              fill
              priority={idx === 0}
              className="object-cover object-center brightness-100 filter transition-transform duration-7000 ease-linear"
            />
          </div>
        ))}

        {/* Lighter Vignette Overlay for Crisp Text & Visible Imagery */}
        <div className="absolute inset-0 z-1 bg-linear-to-b from-slate-950/70 via-slate-950/50 to-slate-950/85" />

        {/* Centered Hero Content Container */}
        <div className="relative z-10 mx-auto max-w-4xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 text-xs font-bold text-rose-400 backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-rose-400" /> Rent Top Sports &
            Outdoor Equipment
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Rent Sports & Outdoor Gear <br />
            <span className="font-black text-rose-500">
              Instantly & Effortlessly
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-200/90 sm:text-xl">
            Browse top-quality outdoor, camping, cycling, and athletic equipment
            from trusted providers near you.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary px-8 font-bold text-white shadow-xl shadow-rose-500/30 hover:bg-rose-700"
              onClick={() => (window.location.href = "/gear")}
            >
              Browse Gear Inventory{" "}
              <ArrowRight className="ml-2 inline h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 px-8 font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-slate-900"
              onClick={() =>
                (window.location.href = "/auth/register?role=Provider")
              }
            >
              Become a Gear Provider
            </Button>
          </div>

          {/* Carousel Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 pt-6">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentImageIndex
                    ? "w-8 bg-rose-500"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. STATS & TRUST METRICS BAR (NEW) */}
      <section className="relative z-20 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl backdrop-blur-md md:grid-cols-4 dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                500+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified Equipment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                2,400+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Happy Adventure Renters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                99.2%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                5-Star Review Rating
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                Instant
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stripe Protected Checkout
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES FILTER PILLS */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Explore by Category
          </h2>
          <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/gear?categoryId=${cat.id}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-slate-700 shadow-sm transition-all hover:border-rose-500 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-rose-400"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 4. FEATURED GEAR CATALOG */}
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
            className="text-primary font-bold hover:text-rose-700"
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

      {/* 5. PROVIDER SPLIT-SCREEN CTA (NEW) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
              Turn your bikes, tents, kayaks, and athletic equipment into
              passive income. Set custom rates, approve booking requests, and
              get paid securely.
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
              className="bg-rose-600 font-bold text-white shadow-lg hover:bg-rose-700"
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

      {/* 6. HOW IT WORKS SECTION */}
      <section className="border-y border-slate-200 bg-slate-100 px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl space-y-12 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              How GearUp Works
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-400">
              Rent quality gear in 3 simple steps with verified providers and
              secure payments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">1. Browse & Select</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Filter by category, brand, price, and availability dates to find
                exactly what you need.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">2. Book Rental Dates</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Choose start and end dates with our interactive calendar picker
                and confirm total cost.
              </p>
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">3. Pay & Pick Up</h3>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Complete secure Stripe checkout, track order status updates, and
                pick up your gear!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS & REVIEWS SECTION (NEW) */}
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
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
              className="border-slate-200 shadow-sm dark:border-slate-800"
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

      {/* 8. FAQ ACCORDION SECTION (NEW) */}
      <section className="border-t border-slate-200 bg-slate-50/80 px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-2 text-center">
            <Badge
              variant="outline"
              className="text-primary border-rose-200 text-xs font-bold"
            >
              <HelpCircle className="mr-1 h-3.5 w-3.5" /> FAQs
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Everything you need to know about renting and listing equipment on
              GearUp.
            </p>
          </div>

          <Accordion>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <AccordionItem key={idx}>
                  <AccordionTrigger
                    isOpen={isOpen}
                    onToggle={() => setOpenFaq(isOpen ? null : idx)}
                  >
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent isOpen={isOpen}>{faq.a}</AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* 9. BOTTOM CTA BANNER (NEW) */}
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
              className="bg-rose-600 px-8 font-bold text-white shadow-lg hover:bg-rose-700"
              onClick={() => (window.location.href = "/gear")}
            >
              Browse Gear Catalog <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 px-8 font-bold text-white backdrop-blur-md hover:bg-white hover:text-slate-900"
              onClick={() =>
                (window.location.href = "/auth/register?role=Provider")
              }
            >
              List Your Gear Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
