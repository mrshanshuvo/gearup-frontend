import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GearItem } from "@/types";

interface GearCardProps {
  gear: GearItem;
}

export function GearCard({ gear }: GearCardProps) {
  const isAvailable = gear.stock > 0;

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border-slate-200 transition-all duration-300 hover:shadow-xl dark:border-slate-800">
      <div>
        {/* Gear Image Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          {gear.imageUrl ? (
            <Image
              src={gear.imageUrl}
              alt={gear.name}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              No Image Available
            </div>
          )}

          {/* Availability Badge Overlay */}
          <div className="absolute top-3 right-3">
            <Badge
              className={
                isAvailable
                  ? "bg-rose-500/90 font-bold text-white hover:bg-rose-600"
                  : "bg-red-500/90 font-bold text-white hover:bg-red-600"
              }
            >
              {isAvailable ? `${gear.stock} Available` : "Out of Stock"}
            </Badge>
          </div>
        </div>

        {/* Card Content */}
        <CardContent className="space-y-3 p-5">
          {/* Category & Brand */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Tag className="text-primary h-3.5 w-3.5" />
              {gear.category?.name || "General"}
            </span>
            <span>{gear.brand}</span>
          </div>

          {/* Gear Name */}
          <h3 className="group-hover:text-primary line-clamp-1 text-lg font-bold text-slate-900 transition-colors dark:text-slate-100">
            {gear.name}
          </h3>

          {/* Description snippet */}
          <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
            {gear.description}
          </p>
        </CardContent>
      </div>

      {/* Card Footer Price & Action */}
      <CardFooter className="mt-4 flex items-center justify-between border-t border-slate-100 p-5 pt-0 dark:border-slate-900">
        <div>
          <span className="text-primary text-2xl font-black">
            ${gear.pricePerDay}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            /day
          </span>
        </div>

        <Button
          size="sm"
          className="bg-primary text-primary-foreground font-bold hover:bg-rose-700"
        >
          <Link href={`/gear/${gear.id}`} className="flex items-center gap-1">
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
