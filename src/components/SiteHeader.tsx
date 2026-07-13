"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Home,
  LogOut,
  Menu,
  Search,
  Shield,
  User,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/database.types";
import BrandMark from "./BrandMark";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Youth Hub", href: "/youth" },
  { label: "Services", href: "/services" },
  { label: "Transparency", href: "/transparency" },
  { label: "News", href: "/news" },
  {
    label: "City",
    href: "/government/officials",
    activePrefixes: ["/government", "/contact"],
    children: [
      { label: "City Officials", href: "/government/officials" },
      { label: "Departments", href: "/government/departments" },
      { label: "SK / Youth Council", href: "/government/sk" },
      { label: "Contact Us", href: "/contact" },
      { label: "Emergency Hotlines", href: "/contact/hotlines" },
    ],
  },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      setUserEmail(user?.email ?? null);
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (mounted) setRole(data?.role ?? "citizen");
      } else {
        setRole(null);
      }
    }
    load();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function signOut() {
    await supabase.auth.signOut();
    document.cookie = "civic-role=; path=/; max-age=0";
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-white text-navy">
      <div className="container-site flex h-16 items-center gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <BrandMark className="h-10 w-10 shrink-0" />
          <span className="hidden flex-col leading-tight min-[380px]:flex">
            <span className="font-display text-sm font-semibold">
              Batangas Youth Civic Hub
            </span>
            <span className="hidden text-xs text-slate-500 lg:block">
              City Government of Batangas
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Main">
          <Link
            href="/"
            aria-label="Home"
            title="Home"
            className={cn(
              "rounded-lg p-2.5 hover:bg-sky/20",
              pathname === "/" && "bg-sky/25"
            )}
          >
            <Home className="h-4 w-4" />
          </Link>
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="relative" ref={dropdownRef}>
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sky/20",
                    item.activePrefixes?.some((p) => pathname.startsWith(p)) &&
                      "underline decoration-orange decoration-2 underline-offset-8"
                  )}
                  aria-expanded={dropdownOpen}
                  onClick={() => setDropdownOpen((v) => !v)}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 overflow-hidden rounded-2xl border border-navy/10 bg-white py-1 text-navy shadow-lift">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="block px-4 py-2.5 text-sm font-medium hover:bg-sky/20"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium hover:bg-sky/20",
                  (item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)) &&
                    "underline decoration-orange decoration-2 underline-offset-8"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Search + auth */}
        <div className="ml-auto flex items-center gap-1 lg:ml-2">
          <button
            aria-label="Search"
            className="rounded-lg p-2 hover:bg-sky/20"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <Search className="h-5 w-5" />
          </button>
          {userEmail ? (
            <div className="hidden items-center gap-1 sm:flex">
              {(role === "admin" || role === "editor") && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sky/20"
                >
                  <Shield className="h-4 w-4" /> Admin
                </Link>
              )}
              <Link
                href="/account"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sky/20"
                title={userEmail}
              >
                <User className="h-4 w-4" /> Account
              </Link>
              <button
                onClick={signOut}
                aria-label="Sign out"
                className="rounded-lg p-2 hover:bg-sky/20"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg bg-royal px-4 py-2 text-sm font-semibold text-white hover:bg-navy sm:block"
            >
              Sign in
            </Link>
          )}
          <button
            aria-label="Open menu"
            className="rounded-lg p-2 hover:bg-sky/20 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-navy/10 bg-white">
          <form onSubmit={submitSearch} className="container-site flex gap-2 py-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news, events, ordinances, documents…"
              className="input flex-1"
              aria-label="Search the site"
            />
            <button className="btn-secondary">Search</button>
          </form>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-navy/10 bg-white lg:hidden" aria-label="Mobile">
          <div className="container-site flex flex-col py-2">
            <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium hover:bg-sky/20">
              <Home className="h-4 w-4" /> Home
            </Link>
            {NAV.flatMap((item) =>
              item.children
                ? [
                    <span key={item.label} className="px-3 pb-1 pt-3 text-xs font-semibold text-royal">
                      {item.label}
                    </span>,
                    ...item.children.map((c) => (
                      <Link key={c.href} href={c.href} className="rounded-lg px-3 py-2.5 font-medium hover:bg-sky/20">
                        {c.label}
                      </Link>
                    )),
                  ]
                : [
                    <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2.5 font-medium hover:bg-sky/20">
                      {item.label}
                    </Link>,
                  ]
            )}
            <div className="mt-2 border-t border-navy/10 pt-2 pb-3">
              {userEmail ? (
                <div className="flex flex-col">
                  {(role === "admin" || role === "editor") && (
                    <Link href="/admin" className="rounded-lg px-3 py-2.5 font-medium hover:bg-sky/20">
                      Admin dashboard
                    </Link>
                  )}
                  <Link href="/account" className="rounded-lg px-3 py-2.5 font-medium hover:bg-sky/20">
                    My account
                  </Link>
                  <button onClick={signOut} className="rounded-lg px-3 py-2.5 text-left font-medium hover:bg-sky/20">
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="mx-3 block rounded-lg bg-royal px-4 py-2.5 text-center font-semibold text-white"
                >
                  Sign in / Register
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
