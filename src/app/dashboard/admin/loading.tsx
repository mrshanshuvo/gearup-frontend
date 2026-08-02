import React from "react";

export default function AdminDashboardLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-44 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-28 rounded-3xl bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="h-64 w-full rounded-3xl bg-slate-200 dark:bg-slate-800" />
    </div>
  );
}
