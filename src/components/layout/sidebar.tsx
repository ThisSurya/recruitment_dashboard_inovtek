"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { NAV_ITEMS } from "./nav-items";

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  className,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-zinc-200 bg-white",
        collapsed ? "w-16" : "w-64",
        className,
      )}
    >
      <div
        className={cn("flex items-center gap-3 px-4 py-4", collapsed && "px-3")}
      >
        <BrandMark className={cn(collapsed && "h-9 w-9 rounded-lg")} />
        {!collapsed && (
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900">Recruitment</div>
            <div className="text-sm text-zinc-500">ATS Dashboard</div>
          </div>
        )}
      </div>

      <nav className={cn("flex-1 space-y-1 px-2", collapsed && "px-2")}>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={cn("p-2", collapsed && "p-2")}>
        <Button
          variant="ghost"
          className={cn("w-full justify-start", collapsed && "justify-center")}
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
