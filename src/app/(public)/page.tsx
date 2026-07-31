"use client";

import React from "react";
import { useGearList } from "@/hooks/useGear";
import { HeroSection } from "./_components/HeroSection";
import { FeaturedGearSection } from "./_components/FeaturedGearSection";
import { ProviderCtaSection } from "./_components/ProviderCtaSection";
import { HowItWorksSection } from "./_components/HowItWorksSection";
import { TestimonialsSection } from "./_components/TestimonialsSection";
import { FaqSection } from "./_components/FaqSection";
import { BottomCtaSection } from "./_components/BottomCtaSection";

export default function HomePage() {
  const { data: gearData, isLoading: gearLoading } = useGearList({
    availableOnly: true,
    limit: 8,
  });

  const gearItems = gearData?.data || [];

  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <FeaturedGearSection gearItems={gearItems} gearLoading={gearLoading} />
      <ProviderCtaSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <BottomCtaSection />
    </div>
  );
}
