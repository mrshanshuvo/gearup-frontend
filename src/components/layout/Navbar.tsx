"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dumbbell,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Store,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "@/stores/authStore";
import { useLogout } from "@/hooks/useAuth";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

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

  return (
    <header className="border-border/80 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md shadow-rose-500/20">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="text-primary">
            GearUp
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className={`hover:text-primary text-sm font-medium transition-colors ${
              pathname === "/"
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/gear"
            className={`hover:text-primary text-sm font-medium transition-colors ${
              pathname.startsWith("/gear")
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            Browse Gear
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

          {/* User Auth state */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="border-border hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium outline-none">
                {getRoleIcon()}
                <span className="max-w-30 truncate text-sm font-medium">
                  {user.name}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs font-normal">
                    {user.email} ({user.role})
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => (window.location.href = getDashboardLink())}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" /> My Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-2 text-red-600 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" /> Log Out
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
                className="bg-primary text-primary-foreground hover:bg-rose-700"
                onClick={() => (window.location.href = "/auth/register")}
              >
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-border bg-background space-y-3 border-b px-4 pt-2 pb-4 md:hidden">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-foreground block py-2 text-sm font-medium"
          >
            Home
          </Link>
          <Link
            href="/gear"
            onClick={() => setMobileMenuOpen(false)}
            className="text-foreground block py-2 text-sm font-medium"
          >
            Browse Gear
          </Link>

          <div className="border-border border-t pt-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary flex items-center gap-2 py-2 text-sm font-medium"
                >
                  <LayoutDashboard className="h-4 w-4" /> My Dashboard (
                  {user.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 py-2 text-sm font-medium text-red-600 dark:text-red-400"
                >
                  <LogOut className="h-4 w-4" /> Log Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/auth/login";
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  className="bg-primary text-primary-foreground w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/auth/register";
                  }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
