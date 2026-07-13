"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, MailOpen, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { ContactMessage } from "@/lib/database.types";
import { formatDateTime } from "@/lib/utils";

export default function AdminMessagesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) setError(error.message);
    else setRows(data ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function open(m: ContactMessage) {
    setOpenId(openId === m.id ? null : m.id);
    if (!m.is_read) {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", m.id);
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this message permanently?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) {
      setError(error.message.includes("row-level security") ? "Only admins can delete messages." : error.message);
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-navy">Contact Messages</h1>
      <p className="mt-1 text-sm text-slate-500">
        Submissions from the public contact form. Click a message to read it.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-brick/10 px-4 py-2.5 text-sm font-medium text-brick">{error}</p>
      )}

      <div className="card mt-5 divide-y divide-slate-100">
        {rows === null ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No messages yet.</p>
        ) : (
          rows.map((m) => (
            <div key={m.id}>
              <button
                onClick={() => open(m)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-slate-50"
                aria-expanded={openId === m.id}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${m.is_read ? "bg-slate-200" : "bg-orange"}`}
                  aria-label={m.is_read ? "Read" : "Unread"}
                />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm ${m.is_read ? "font-medium text-slate-700" : "font-bold text-navy"}`}>
                    {m.subject || "(no subject)"}
                  </span>
                  <span className="block truncate text-xs text-slate-500">
                    {m.name} &lt;{m.email}&gt; · {formatDateTime(m.created_at)}
                  </span>
                </span>
                <MailOpen className="h-4 w-4 shrink-0 text-slate-400" />
              </button>
              {openId === m.id && (
                <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                  <p className="whitespace-pre-line text-sm text-slate-700">{m.body}</p>
                  <div className="mt-4 flex gap-2">
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject ?? "your message to Batangas City")}`} className="btn-secondary px-3 py-1.5 text-xs">
                      Reply by email
                    </a>
                    <button onClick={() => remove(m.id)} className="btn px-3 py-1.5 text-xs text-brick hover:bg-brick/10">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
