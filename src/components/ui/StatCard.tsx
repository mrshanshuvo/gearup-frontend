import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg?: string; // e.g. "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
  trend?: {
    value: number; // percentage e.g. 7.9 or -2.4
    label?: string; // e.g. "vs last month"
  };
  highlight?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg = "bg-primary/10 text-primary",
  trend,
  highlight = false,
}: StatCardProps) {
  const isPositive = trend && trend.value >= 0;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-200 hover:shadow-md ${
        highlight
          ? "border-primary/30 bg-rose-50 dark:bg-rose-950/20"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl">
              {value}
            </h3>
            {trend && (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  isPositive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {isPositive ? `+${trend.value}%` : `${trend.value}%`}
              </span>
            )}
          </div>
          {trend?.label && (
            <p className="text-muted-foreground text-xs">{trend.label}</p>
          )}
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xs ${iconBg}`}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
