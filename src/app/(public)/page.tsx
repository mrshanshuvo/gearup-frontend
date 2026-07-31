"use client";

import React from "react";
import { useCategories, useGearList } from "@/hooks/useGear";
import { HeroSection } from "./_components/HeroSection";
import { CategoryPillsSection } from "./_components/CategoryPillsSection";
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
  const { data: categoryData } = useCategories();

  const gearItems = gearData?.data || [];
  const categories = categoryData?.data || [];

  return (
    <div className="space-y-16 pb-16">
      <HeroSection />
      <CategoryPillsSection categories={categories} />
      <FeaturedGearSection gearItems={gearItems} gearLoading={gearLoading} />
      <ProviderCtaSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FaqSection />
      <BottomCtaSection />
    </div>
  );
}
