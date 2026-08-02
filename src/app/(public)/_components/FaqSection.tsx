"use client";

import React, { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  return (
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
  );
}
