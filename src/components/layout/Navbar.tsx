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
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/"
                ? "font-bold text-primary"
                : "text-muted-foreground"
            }`}
          >
            Home
          </Link>

          <Link
            href="/gear"
            className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
              pathname.startsWith("/gear") && !pathname.includes("categoryId")
                ? "font-bold text-primary"
                : "text-muted-foreground"
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Browse Gear
          </Link>

          {/* shadcn DropdownMenu for Categories (Hover Triggered) */}
          <DropdownMenu open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
            <div
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary outline-none cursor-pointer">
                <Tag className="h-4 w-4 text-primary" /> Categories{" "}
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Popular Equipment
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.length === 0 ? (
                  <div className="p-2 text-center text-xs text-muted-foreground">
                    Loading categories...
                  </div>
                ) : (
                  categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() => (window.location.href = `/gear?categoryId=${cat.id}`)}
                      className="flex cursor-pointer items-center justify-between font-medium"
                    >
                      <span>{cat.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">
                        Gear
                      </Badge>
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/gear")}
                  className="flex cursor-pointer items-center justify-center font-bold text-primary"
                >
                  View All Categories →
                </DropdownMenuItem>
              </DropdownMenuContent>
            </div>
          </DropdownMenu>

          {/* How It Works Link */}
          <Link
            href="/#how-it-works"
            className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
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
            <PlusCircle className="h-3.5 w-3.5 text-primary" /> List Your Gear
          </Link>
        </nav>

        {/* Actions (Theme Toggle + Auth) */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full text-muted-foreground hover:text-foreground"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Auth state using shadcn DropdownMenu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="border-border hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium outline-none cursor-pointer">
                {getRoleIcon()}
                <span className="max-w-[120px] truncate font-bold text-sm">
                  {user.name}
                </span>
                <Badge className={getRoleBadgeColor()}>{user.role}</Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="font-bold">{user.name}</span>
                  <span className="truncate text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => (window.location.href = getDashboardLink())}
                  className="flex cursor-pointer items-center gap-2 font-semibold"
                >
                  <LayoutDashboard className="h-4 w-4 text-primary" /> My Dashboard
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
              <Button variant="ghost" onClick={() => (window.location.href = "/auth/login")}>
                Sign In
              </Button>
              <Button
                className="bg-primary font-bold text-primary-foreground hover:bg-rose-700"
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
            className="rounded-full text-muted-foreground"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 pt-2 pb-6 space-y-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/gear"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium hover:text-primary"
            >
              Browse Gear
            </Link>
            <div className="space-y-1 pl-2 border-l-2 border-primary/30">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Categories
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/gear?categoryId=${cat.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 text-xs text-foreground hover:text-primary"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-sm font-medium hover:text-primary"
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
              <PlusCircle className="h-4 w-4 text-primary" /> List Your Gear
            </Link>
          </nav>

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            {user ? (
              <>
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = getDashboardLink();
                  }}
                  className="w-full justify-start bg-primary text-primary-foreground font-bold"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard ({user.role})
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full justify-start text-red-600 border-red-200"
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
                  className="bg-primary font-bold text-primary-foreground"
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
