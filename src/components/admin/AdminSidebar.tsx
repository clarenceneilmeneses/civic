"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  CalendarDays,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  PanelLeftClose,
  PanelLeftOpen,
  PhoneCall,
  Scale,
  Users,
  UserCog,
  Vote,
  Wrench,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import BrandMark from "@/components/BrandMark";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/database.types";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/news", label: "News & Announcements", icon: Newspaper },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/legislation", label: "Legislation", icon: Scale },
  { href: "/admin/documents", label: "Documents & Forms", icon: FileText },
  { href: "/admin/proposals", label: "Proposals", icon: Vote },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/officials", label: "Officials", icon: Users },
  { href: "/admin/departments", label: "Departments", icon: Building2 },
  { href: "/admin/hotlines", label: "Hotlines", icon: PhoneCall },
  { href: "/admin/comments", label: "Comments Queue", icon: MessageSquare },
  { href: "/admin/messages", label: "Contact Messages", icon: Inbox },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/users", label: "Users", icon: UserCog, adminOnly: true },
];

export default function AdminSidebar({
  role,
  name,
}: {
  role: UserRole;
  name: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Desktop: collapses to an icon-only rail; remembered locally.
  // Mobile drawer always shows full labels.
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem("admin-sidebar-collapsed") === "1");
  }, []);

  function toggleCollapsed() {
    setCollapsed((v) => {
      localStorage.setItem("admin-sidebar-collapsed", v ? "0" : "1");
      return !v;
    });
  }

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "civic-role=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 bg-navy px-4 text-white lg:hidden">
        <button aria-label="Toggle admin menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <BrandMark className="h-8 w-8" />
        <span className="font-display text-sm font-semibold">Admin</span>
      </div>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={cn(
          // Mobile: slide-in drawer. Desktop: detached floating card,
          // collapsible to an icon-only rail.
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col overflow-hidden rounded-r-2xl bg-navy pt-14 text-white shadow-lift transition-all",
          "lg:sticky lg:top-4 lg:my-4 lg:ml-4 lg:h-[calc(100vh-2rem)] lg:translate-x-0 lg:rounded-2xl lg:pt-0",
          collapsed ? "lg:w-[4.75rem]" : "lg:w-64",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Desktop header */}
        <div
          className={cn(
            "hidden items-center gap-2.5 border-b border-white/10 py-4 lg:flex",
            collapsed ? "flex-col px-2" : "px-5"
          )}
        >
          <BrandMark className="h-9 w-9 shrink-0" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold leading-tight">Civic Hub CMS</p>
              <p className="text-xs text-sky">Batangas City</p>
            </div>
          )}
          <button
            onClick={toggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-lg p-1.5 text-sky hover:bg-white/10 hover:text-white"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav
          className={cn(
            "no-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto py-4",
            collapsed ? "px-3 lg:px-2.5" : "px-3"
          )}
          aria-label="Admin"
        >
          {LINKS.filter((l) => !l.adminOnly || role === "admin").map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                title={collapsed ? l.label : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                  collapsed && "lg:justify-center lg:px-0 lg:py-2.5",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <l.icon className="h-4 w-4 shrink-0" />
                <span className={cn(collapsed && "lg:hidden")}>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={cn("border-t border-white/10 p-4", collapsed && "lg:p-2.5")}>
          {!collapsed ? (
            <>
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="text-xs capitalize text-sky">{role}</p>
            </>
          ) : (
            <p
              className="hidden text-center text-xs font-bold uppercase text-sky lg:block"
              title={`${name} (${role})`}
            >
              {name
                .split(/\s+/)
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </p>
          )}
          {/* Mobile always shows the full footer */}
          {collapsed && (
            <div className="lg:hidden">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="text-xs capitalize text-sky">{role}</p>
            </div>
          )}
          <div className="mt-3">
            <button
              onClick={signOut}
              title="Sign out"
              className={cn(
                "btn w-full border border-white/30 px-2 py-1.5 text-xs text-white hover:bg-white/10",
                collapsed && "lg:px-0"
              )}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className={cn(collapsed && "lg:hidden")}>Sign out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
