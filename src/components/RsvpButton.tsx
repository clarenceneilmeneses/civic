"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { CalendarCheck, CalendarPlus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RsvpButton({
  eventId,
  registrationOpen,
}: {
  eventId: string;
  registrationOpen: boolean;
}) {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<
    "loading" | "anonymous" | "registered" | "unregistered" | "working"
  >("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!mounted) return;
      if (!user) {
        setStatus("anonymous");
        return;
      }
      const { data } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (mounted) setStatus(data ? "registered" : "unregistered");
    }
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function toggle() {
    setError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const prev = status;
    setStatus("working");
    if (prev === "registered") {
      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user.id);
      if (error) {
        setError("Couldn't cancel your registration. Please try again.");
        setStatus("registered");
      } else {
        setStatus("unregistered");
      }
    } else {
      const { error } = await supabase
        .from("event_registrations")
        .insert({ event_id: eventId, user_id: user.id });
      if (error && error.code !== "23505") {
        setError("Couldn't register. Please try again.");
        setStatus("unregistered");
      } else {
        setStatus("registered");
      }
    }
  }

  if (!registrationOpen) {
    return (
      <button disabled className="btn-outline w-full sm:w-auto">
        Registration closed
      </button>
    );
  }

  if (status === "loading") {
    return (
      <button disabled className="btn-primary w-full sm:w-auto">
        <Loader2 className="h-4 w-4 animate-spin" /> Checking…
      </button>
    );
  }

  if (status === "anonymous") {
    return (
      <button onClick={toggle} className="btn-primary w-full sm:w-auto">
        <CalendarPlus className="h-4 w-4" /> Sign in to RSVP
      </button>
    );
  }

  return (
    <div className="w-full sm:w-auto">
      {status === "registered" ? (
        <button
          onClick={toggle}
          className="btn w-full bg-navy text-white hover:bg-brick sm:w-auto"
          title="Click to cancel your registration"
        >
          <CalendarCheck className="h-4 w-4" /> You&apos;re registered — cancel?
        </button>
      ) : (
        <button
          onClick={toggle}
          disabled={status === "working"}
          className="btn-primary w-full sm:w-auto"
        >
          {status === "working" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CalendarPlus className="h-4 w-4" />
          )}
          RSVP for this event
        </button>
      )}
      {error && <p className="mt-2 text-sm font-medium text-brick">{error}</p>}
    </div>
  );
}
