"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import BrandMark from "@/components/BrandMark";
import StreetPattern from "@/components/StreetPattern";
import { cn } from "@/lib/utils";

const PERKS = [
  "RSVP for events and scholarship orientations in one tap",
  "Comment on city proposals while they're open",
  "Get event updates without chasing group chats",
];

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function switchMode(m: "signin" | "signup") {
    setMode(m);
    setError(null);
    setNotice(null);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (mode === "signup") {
      const fullName = String(data.get("full_name") ?? "").trim();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setNotice(
        "Account created! Check your email for a confirmation link, then sign in."
      );
      setMode("signin");
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Wrong email or password."
            : error.message
        );
        return;
      }
      // Staff go straight to the CMS; the role cookie lets the middleware
      // route them without a database lookup on every request.
      let dest = next;
      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        const role = profile?.role ?? "citizen";
        document.cookie = `civic-role=${role}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        if (role !== "citizen") dest = "/admin";
      }
      router.push(dest);
      router.refresh();
    }
  }

  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-lift lg:grid-cols-[0.85fr_1fr]">
      {/* Brand panel — desktop only */}
      <div className="relative hidden flex-col overflow-hidden bg-navy p-10 text-white lg:flex">
        <StreetPattern opacity={0.12} />
        <div className="relative">
          <BrandMark className="h-12 w-12" />
          <p className="mt-8 font-display text-[1.7rem] font-bold leading-snug tracking-tight">
            One account for everything youth in Batangas City.
          </p>
        </div>
        <ul className="relative mt-8 space-y-3.5 text-sm leading-relaxed text-sky">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-start gap-2.5">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-marigold" />
              {perk}
            </li>
          ))}
        </ul>
        <p className="relative mt-auto pt-10 text-xs text-sky/70">
          Free for every young Batangueño · City Government of Batangas
        </p>
      </div>

      {/* Form panel */}
      <div className="p-6 sm:p-10">
        {/* Compact brand row — mobile only */}
        <div className="mb-6 flex items-center gap-2.5 lg:hidden">
          <BrandMark className="h-10 w-10" />
          <span className="font-display text-sm font-semibold leading-tight text-navy">
            Batangas Youth
            <span className="block">Civic Hub</span>
          </span>
        </div>

        {/* Mode toggle */}
        <div
          className="grid grid-cols-2 rounded-full bg-navy/5 p-1 text-sm font-semibold"
          role="tablist"
          aria-label="Sign in or create an account"
        >
          {(
            [
              ["signin", "Sign in"],
              ["signup", "Create account"],
            ] as const
          ).map(([m, label]) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchMode(m)}
              className={cn(
                "rounded-full py-2 transition-colors",
                mode === m
                  ? "bg-white text-navy shadow-sm"
                  : "text-slate-500 hover:text-navy"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <h1 className="mt-7 font-display text-2xl font-bold tracking-tight text-navy">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "signin"
            ? "Sign in to RSVP for events and comment on proposals."
            : "Takes under a minute — all you need is an email."}
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="full_name" className="label">
                Full name
              </label>
              <input
                id="full_name"
                name="full_name"
                required
                maxLength={120}
                autoComplete="name"
                placeholder="Juan Dela Cruz"
                className="input"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className="input"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                className="input pr-11"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 hover:text-navy"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {mode === "signup" && (
              <p className="mt-1.5 text-xs text-slate-500">
                At least 8 characters.
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-lg border border-brick/20 bg-brick/5 px-3.5 py-2.5 text-sm font-medium text-brick"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {notice && (
            <div
              role="status"
              className="flex items-start gap-2.5 rounded-lg border border-royal/15 bg-sky/30 px-3.5 py-2.5 text-sm font-medium text-navy"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
              {notice}
            </div>
          )}

          <button disabled={loading} className="btn-primary w-full py-3">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {mode === "signin" ? (
            <>
              New here?{" "}
              <button
                onClick={() => switchMode("signup")}
                className="font-bold text-royal hover:text-navy"
              >
                Create a free account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode("signin")}
                className="font-bold text-royal hover:text-navy"
              >
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="mt-3 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 hover:text-royal"
          >
            ← Back to the hub
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-cream/50 px-4 py-10 sm:py-14">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
