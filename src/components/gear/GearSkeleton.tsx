import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function GearSkeleton() {
  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="space-y-3 p-5">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="mt-4 flex items-center justify-between border-t border-slate-100 p-5 pt-0 dark:border-slate-900">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}
