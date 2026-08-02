import React from "react";

export default function CustomerDashboardLoading() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Banner Skeleton */}
      <div className="h-44 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>

      {/* Table Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
