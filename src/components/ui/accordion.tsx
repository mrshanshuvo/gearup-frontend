"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-3", className)} {...props} />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-slate-200 bg-white px-5 py-2 shadow-xs transition-all dark:border-slate-800 dark:bg-slate-900",
      className
    )}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, isOpen, onToggle, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onToggle}
    className={cn(
      "hover:text-primary flex w-full cursor-pointer items-center justify-between py-3 text-left font-bold text-slate-900 transition-all outline-none dark:text-slate-100",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDownIcon
      className={cn(
        "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
        isOpen && "text-primary rotate-180"
      )}
    />
  </button>
));
AccordionTrigger.displayName = "AccordionTrigger";

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, isOpen, ...props }, ref) => {
  if (!isOpen) return null;
  return (
    <div
      ref={ref}
      className={cn(
        "animate-in fade-in-50 pt-1 pb-4 text-sm leading-relaxed text-slate-600 transition-all dark:text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
