import React from "react";
import { Badge } from "@/components/ui/badge";

interface RentalStatusBadgeProps {
  status: string;
}

export function RentalStatusBadge({ status }: RentalStatusBadgeProps) {
  switch (status) {
    case "PLACED":
      return (
        <Badge className="bg-amber-500 font-bold text-white hover:bg-amber-600">
          Payment Pending
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge className="bg-blue-600 font-bold text-white hover:bg-blue-700">
          Confirmed
        </Badge>
      );
    case "PAID":
      return (
        <Badge className="bg-purple-600 font-bold text-white hover:bg-purple-700">
          Paid
        </Badge>
      );
    case "PICKED_UP":
      return (
        <Badge className="bg-emerald-600 font-bold text-white hover:bg-emerald-700">
          Picked Up
        </Badge>
      );
    case "RETURNED":
      return (
        <Badge
          variant="outline"
          className="border-slate-300 font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300"
        >
          Returned
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="destructive" className="font-bold">
          Cancelled
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="font-bold">
          {status}
        </Badge>
      );
  }
}
