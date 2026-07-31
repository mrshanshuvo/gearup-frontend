"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  const heroImages = [
    "/hero/astrid-schaffner-bi_amI3F4co-unsplash.jpg",
    "/hero/munbaik-cycling-clothing-Ln9uvGy5Yio-unsplash.jpg",
    "/hero/ricardo-iv-tamayo-AFlecBlcr8M-unsplash.jpg",
    "/hero/kari-ham-ToHKwi1KXtc-unsplash.jpg",
    "/hero/nader-saremi-Qm_ddQ-0Ps4-unsplash.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
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
            className="bg-primary cursor-pointer px-8 font-bold text-white shadow-xl shadow-rose-500/30 hover:bg-rose-700"
            onClick={() => (window.location.href = "/gear")}
          >
            Browse Gear Inventory <ArrowRight className="ml-2 inline h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="cursor-pointer border-white/30 bg-white/10 px-8 font-bold text-white backdrop-blur-md transition-all hover:bg-white hover:text-slate-900"
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
              className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
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
  );
}
