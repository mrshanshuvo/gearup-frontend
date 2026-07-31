import React from "react";
import Link from "next/link";
import { Category } from "@/types";

interface CategoryPillsSectionProps {
  categories: Category[];
}

export function CategoryPillsSection({
  categories,
}: CategoryPillsSectionProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Explore by Category
      </h2>
      <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/gear?categoryId=${cat.id}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-slate-700 shadow-xs transition-all hover:border-rose-500 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-rose-400"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
