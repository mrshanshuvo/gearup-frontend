import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Dumbbell } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-border bg-card mt-auto w-full border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <Link href="/" className="flex items-center">
            <Image
              src="/main_logo.svg"
              alt="GearUp Logo"
              width={130}
              height={40}
              className="h-9 w-auto object-contain"
            />
          </Link>

          <p className="text-muted-foreground text-center text-xs">
            &copy; {new Date().getFullYear()} GearUp Rental Services. All rights
            reserved.
          </p>

          <div className="text-muted-foreground flex items-center gap-4 text-xs font-medium">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/gear" className="hover:text-primary transition-colors">
              Browse Gear
            </Link>
            <Link
              href="/auth/login"
              className="hover:text-primary transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
