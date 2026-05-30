"use client";

import * as React from "react";

import { cn } from "@/lib/cn";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className={cn("min-h-screen bg-zinc-50", className)}>
      <div className="flex min-h-screen">
        <div className="hidden md:block">
          <Sidebar
            collapsed={collapsed}
            onToggleCollapsed={() => setCollapsed((v) => !v)}
          />
        </div>

        <div className="flex min-h-screen flex-1 flex-col">
          <Topbar onMobileMenuOpen={() => setMobileOpen(true)} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-sm">
            <Sidebar
              collapsed={false}
              onToggleCollapsed={() => setCollapsed((v) => !v)}
              onNavigate={() => setMobileOpen(false)}
              className="h-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}
