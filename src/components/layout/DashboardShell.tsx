"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  LucideIcon,
  Bell,
  Home,
  ChevronRight,
  ArrowLeft,
  Dumbbell,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useLogout } from "@/hooks/useAuth";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export interface QuickAction {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: "Admin" | "Provider" | "Customer";
  } | null;
  navItems: NavItem[];
  quickAction?: QuickAction;
  roleBadgeText: string;
  roleBadgeColor: string;
}

export function DashboardShell({
  children,
  user,
  navItems,
  quickAction,
  roleBadgeText,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useLogout();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  if (!user) return null;

  // Generate dynamic breadcrumbs based on pathname
  const pathSegments = pathname.split("/").filter(Boolean);

  // Format segment name (e.g., "customer" -> "Customer", "orders" -> "Orders")
  const formatSegment = (seg: string) => {
    return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
  };

  const currentTitle =
    pathSegments.length > 0
      ? formatSegment(pathSegments[pathSegments.length - 1])
      : "Dashboard";

  return (
    <div className="flex min-h-screen bg-[#F8F9FC] font-sans text-slate-900 antialiased dark:bg-[#0B0C10] dark:text-slate-100">
      {/* 1. Left Vertical Fixed Sidebar */}
      <aside
        className={`sticky top-0 z-30 flex h-screen shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white p-5 transition-all duration-300 dark:border-slate-800/80 dark:bg-[#121318] ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="space-y-8">
          {/* Top Logo & Toggle */}
          <div className="flex items-center justify-between px-2">
            {!sidebarCollapsed && (
              <Link href="/" className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                  <Dumbbell className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  GearUp
                </span>
              </Link>
            )}
            {sidebarCollapsed && (
              <Link
                href="/"
                className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20"
              >
                <Dumbbell className="h-5 w-5" />
              </Link>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:flex dark:hover:bg-slate-800"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Quick Action Button if provided */}
          {quickAction && !sidebarCollapsed && (
            <Link
              href={quickAction.href}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-700"
            >
              <quickAction.icon className="h-4 w-4" /> {quickAction.label}
            </Link>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200"
                  } ${sidebarCollapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-400"
                    }`}
                  />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Logout Button */}
        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            onClick={logout}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-500 transition-all hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950/40 dark:hover:text-red-400 ${
              sidebarCollapsed ? "justify-center px-0" : ""
            }`}
            title={sidebarCollapsed ? "Log Out" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar Header */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/90 px-8 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#121318]/90">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>

            <nav className="flex items-center gap-2 rounded-xl bg-blue-50/60 px-3 py-1.5 text-xs font-medium dark:bg-blue-950/30">
              <Home className="h-3.5 w-3.5 text-slate-400" />
              {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const path = "/" + pathSegments.slice(0, index + 1).join("/");

                return (
                  <React.Fragment key={path}>
                    <ChevronRight className="h-3 w-3 text-slate-300 dark:text-slate-600" />
                    {isLast ? (
                      <span className="rounded-lg bg-blue-600 px-2 py-0.5 font-bold text-white">
                        {formatSegment(segment)}
                      </span>
                    ) : (
                      <Link
                        href={path}
                        className="text-slate-600 hover:text-blue-600 dark:text-slate-400"
                      >
                        {formatSegment(segment)}
                      </Link>
                    )}
                  </React.Fragment>
                );
              })}
            </nav>
          </div>

          {/* Right User & Notification Controls */}
          <div className="flex items-center gap-4">
            {/* Notification Bell Icon */}
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 text-slate-600 transition-all hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-blue-600"></span>
            </button>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 font-bold text-white shadow-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm leading-tight font-bold text-slate-900 dark:text-slate-100">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Inner Page Area */}
        <div className="flex-1 p-8">
          {/* Child Page Content */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
