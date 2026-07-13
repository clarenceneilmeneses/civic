"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import BrandMark from "@/components/BrandMark";

function LoginForm() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
    <div className="card w-full max-w-md p-8">
      <div className="flex flex-col items-center text-center">
        <BrandMark className="h-16 w-16" />
        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-navy">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {mode === "signin"
            ? "Sign in to RSVP for events and comment on proposals."
            : "A free account for young Batangueños — RSVP, comment, participate."}
        </p>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "signup" && (
          <div>
            <label htmlFor="full_name" className="label">Full name</label>
            <input id="full_name" name="full_name" required maxLength={120} className="input" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" name="email" type="email" required className="input" />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="input"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />
        </div>
        {error && <p className="text-sm font-medium text-brick">{error}</p>}
        {notice && (
          <p className="rounded-lg bg-sky/40 px-4 py-2 text-sm font-medium text-navy">
            {notice}
          </p>
        )}
        <button disabled={loading} className="btn-primary w-full">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        {mode === "signin" ? (
          <>
            New here?{" "}
            <button onClick={() => { setMode("signup"); setError(null); }} className="font-bold text-royal hover:text-navy">
              Create a free account
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button onClick={() => { setMode("signin"); setError(null); }} className="font-bold text-royal hover:text-navy">
              Sign in
            </button>
          </>
        )}
      </p>
      <p className="mt-3 text-center">
        <Link href="/" className="text-xs font-medium text-slate-400 hover:text-royal">
          ← Back to the hub
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-cream/50 px-4 py-14">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
