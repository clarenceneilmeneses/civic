"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("loading");
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      subject: String(data.get("subject") ?? "").trim() || null,
      body: String(data.get("body") ?? "").trim(),
    });
    if (error) {
      setState("error");
      return;
    }
    form.reset();
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="card border border-azure/40 bg-sky/20 p-8 text-center">
        <p className="text-lg font-bold text-navy">Message sent — salamat!</p>
        <p className="mt-1 text-sm text-slate-600">
          Your message has been received by the city. Expect a reply at the
          email you provided within 3 working days.
        </p>
        <button onClick={() => setState("idle")} className="btn-outline mt-4">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="label">Your name *</label>
          <input id="cf-name" name="name" required maxLength={120} className="input" />
        </div>
        <div>
          <label htmlFor="cf-email" className="label">Email address *</label>
          <input id="cf-email" name="email" type="email" required maxLength={200} className="input" />
        </div>
      </div>
      <div>
        <label htmlFor="cf-subject" className="label">Subject</label>
        <input id="cf-subject" name="subject" maxLength={200} className="input" placeholder="e.g. Question about the scholarship program" />
      </div>
      <div>
        <label htmlFor="cf-body" className="label">Message *</label>
        <textarea id="cf-body" name="body" required rows={6} maxLength={4000} className="input resize-y" />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={state === "loading"} className="btn-primary">
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send message
        </button>
        {state === "error" && (
          <p className="text-sm font-medium text-brick">
            Couldn't send your message. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}
