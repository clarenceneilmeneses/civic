"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    const supabase = createClient();
    const { error } = await supabase
      .from("subscribers")
      .insert({ email: email.trim().toLowerCase() });
    if (error) {
      if (error.code === "23505") {
        setState("done");
        setMessage("You're already subscribed — thank you!");
      } else {
        setState("error");
        setMessage("Something went wrong. Please try again.");
      }
      return;
    }
    setState("done");
    setMessage("Subscribed! You'll hear from the city soon.");
    setEmail("");
  }

  if (state === "done") {
    return <p className="text-sm font-medium text-marigold">{message}</p>;
  }

  return (
    <form onSubmit={subscribe} className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="subscribe-email" className="sr-only">
        Email address
      </label>
      <input
        id="subscribe-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="input flex-1 border-navy/40 bg-white/10 text-white placeholder:text-sky/70"
      />
      <button
        disabled={state === "loading"}
        className="btn bg-marigold font-bold text-navy hover:bg-orange hover:text-white"
      >
        {state === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {state === "error" && (
        <p className="text-sm text-red-300 sm:w-full">{message}</p>
      )}
    </form>
  );
}
