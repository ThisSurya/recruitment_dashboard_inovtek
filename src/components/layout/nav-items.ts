import type { LucideIcon } from "lucide-react";
import { Briefcase, Kanban, LayoutDashboard } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", href: "/jobs", icon: Briefcase },
  { title: "Candidates Pipeline", href: "/pipeline", icon: Kanban },
];
