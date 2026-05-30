"use client";

import * as React from "react";
import { Bell, ChevronDown, Menu, Search, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function Topbar({
  onMobileMenuOpen,
  className,
}: {
  onMobileMenuOpen: () => void;
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!menuRef.current) return;
      if (e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-zinc-200 bg-white px-4",
        className,
      )}
    >
      <Button
        variant="ghost"
        className="md:hidden"
        onClick={onMobileMenuOpen}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Button variant="ghost" aria-label="Notifications" className="ml-auto">
        <Bell className="h-5 w-5" />
      </Button>

      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            A
          </span>
          <span className="hidden sm:inline">Admin</span>
          <ChevronDown className="h-4 w-4 text-zinc-500" />
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
