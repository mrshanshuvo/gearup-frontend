"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Store,
  ShieldCheck,
  ChevronDown,
  Tag,
  Sparkles,
  PlusCircle,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCategories } from "@/hooks/useGear";
import useAuthStore from "@/stores/authStore";
import { useLogout } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleCategoryMouseEnter = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
      categoryTimeoutRef.current = null;
    }
    setIsCategoryOpen(true);
  };

  const handleCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 200);
  };

  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const { data: categoryData } = useCategories();
  const categories = categoryData?.data || [];

  const getDashboardLink = () => {
    if (!user) return "/auth/login";
    switch (user.role) {
      case "Admin":
        return "/dashboard/admin";
      case "Provider":
        return "/dashboard/provider";
      default:
        return "/dashboard/customer";
    }
  };

  const getRoleIcon = () => {
    if (!user) return null;
    switch (user.role) {
      case "Admin":
        return <ShieldCheck className="h-4 w-4 text-amber-500" />;
      case "Provider":
        return <Store className="h-4 w-4 text-blue-500" />;
      default:
        return <UserIcon className="h-4 w-4 text-rose-500" />;
    }
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case "Admin":
        return "bg-amber-500 text-white font-bold";
      case "Provider":
        return "bg-blue-600 text-white font-bold";
      default:
        return "bg-rose-500 text-white font-bold";
    }
  };

  return (
    <header className="border-border/80 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 xl:max-w-350 2xl:max-w-[1600px]">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/main_logo.svg"
            alt="GearUp Logo"
            width={140}
            height={44}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-7 md:flex">
          <Link
            href="/"
            className={`hover:text-primary text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }`}
          >
            Home
          </Link>

          <Link
            href="/gear"
            className={`hover:text-primary flex items-center gap-1 text-sm font-medium transition-colors ${
              pathname.startsWith("/gear") && !pathname.includes("categoryId")
                ? "text-primary font-bold"
                : "text-muted-foreground"
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Browse Gear
          </Link>

          {/* shadcn DropdownMenu for Categories (Hover Triggered with Intent Delay) */}
          <DropdownMenu open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
            <div
              onMouseEnter={handleCategoryMouseEnter}
              onMouseLeave={handleCategoryMouseLeave}
            >
              <DropdownMenuTrigger className="text-muted-foreground hover:text-primary flex cursor-pointer items-center gap-1.5 text-sm font-medium transition-colors outline-none">
                <Tag className="text-primary h-4 w-4" /> Categories{" "}
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                sideOffset={0}
                onMouseEnter={handleCategoryMouseEnter}
                onMouseLeave={handleCategoryMouseLeave}
                className="w-56"
              >
                <DropdownMenuLabel className="text-muted-foreground flex items-center gap-1.5 text-xs">
                  <Sparkles className="text-primary h-3.5 w-3.5" /> Popular
                  Equipment
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.length === 0 ? (
                  <div className="text-muted-foreground p-2 text-center text-xs">
                    Loading categories...
                  </div>
                ) : (
                  categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() =>
                        (window.location.href = `/gear?categoryId=${cat.id}`)
                      }
                      className="flex cursor-pointer items-center justify-between font-medium"
                    >
                      <span>{cat.name}</span>
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase"
                      >
                        Gear
                      </Badge>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/gear")}
                  className="text-primary flex cursor-pointer items-center justify-center font-bold"
                >
                  View All Categories →
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>

          {/* How It Works Link */}
          <Link
            href="/#how-it-works"
            className="text-muted-foreground hover:text-primary flex items-center gap-1 text-sm font-medium transition-colors"
          >
            <HelpCircle className="h-4 w-4" /> How It Works
          </Link>

          {/* List Your Gear CTA pill for Providers */}
          <Link
            href={
              user?.role === "Provider"
                ? "/dashboard/provider/gear/new"
                : "/auth/register?role=Provider"
            }
            className="flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700 transition-all hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50"
          >
            <PlusCircle className="text-primary h-3.5 w-3.5" /> List Your Gear
          </Link>
        </nav>

        {/* Actions (Theme Toggle + Auth) */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-foreground rounded-full"
          >
            <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Auth state using shadcn DropdownMenu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="border-border hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium outline-none">
                {getRoleIcon()}
                <span className="max-w-30 truncate text-sm font-bold">
                  {user.name}
                </span>
                <Badge className={getRoleBadgeColor()}>{user.role}</Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="font-bold">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => (window.location.href = getDashboardLink())}
                  className="flex cursor-pointer items-center gap-2 font-semibold"
                >
                  <LayoutDashboard className="text-primary h-4 w-4" /> My
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="flex cursor-pointer items-center gap-2 font-bold text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => (window.location.href = "/auth/login")}
              >
                Sign In
              </Button>
              <Button
                className="bg-primary text-primary-foreground font-bold hover:bg-rose-700"
                onClick={() => (window.location.href = "/auth/register")}
              >
                Get Started
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground rounded-full"
          >
            <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-border bg-background space-y-4 border-b px-4 pt-2 pb-6 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary px-2 py-1.5 text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/gear"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary px-2 py-1.5 text-sm font-medium"
            >
              Browse Gear
            </Link>
            <div className="border-primary/30 space-y-1 border-l-2 pl-2">
              <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Categories
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/gear?categoryId=${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-foreground hover:text-primary block py-1 text-xs"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-primary px-2 py-1.5 text-sm font-medium"
            >
              How It Works
            </Link>
            <Link
              href={
                user?.role === "Provider"
                  ? "/dashboard/provider/gear/new"
                  : "/auth/register?role=Provider"
              }
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-rose-50 p-2 text-xs font-bold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
            >
              <PlusCircle className="text-primary h-4 w-4" /> List Your Gear
            </Link>
          </nav>

          <div className="border-border flex flex-col gap-2 border-t pt-2">
            {user ? (
              <>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = getDashboardLink();
                  }}
                  className="bg-primary text-primary-foreground w-full justify-start font-bold"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard (
                  {user.role})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full justify-start border-red-200 text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/auth/login";
                  }}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-primary text-primary-foreground font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/auth/register";
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
