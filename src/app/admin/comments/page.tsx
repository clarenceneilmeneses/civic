"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { InitialsAvatar } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

type Row = {
  id: string;
  body: string;
  approved: boolean;
  created_at: string;
  profiles: { full_name: string | null } | null;
  proposals: { slug: string; title: string } | null;
};

export default function AdminCommentsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [filter, setFilter] = useState<"pending" | "approved" | "all">("pending");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    let q = supabase
      .from("proposal_comments")
      .select("id, body, approved, created_at, profiles(full_name), proposals(slug, title)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("approved", filter === "approved");
    const { data, error } = await q;
    if (error) setError(error.message);
    else {
      setError(null);
      setRows((data as unknown as Row[]) ?? []);
    }
  }, [filter, supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function setApproved(id: string, approved: boolean) {
    setBusy(id);
    const { error } = await supabase
      .from("proposal_comments")
      .update({ approved })
      .eq("id", id);
    setBusy(null);
    if (error) {
      setError(
        error.message.includes("row-level security")
          ? "Only admins can moderate comments."
          : error.message
      );
      return;
    }
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment permanently?")) return;
    setBusy(id);
    const { error } = await supabase.from("proposal_comments").delete().eq("id", id);
    setBusy(null);
    if (error) {
      setError(error.message.includes("row-level security") ? "Only admins can delete comments." : error.message);
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="display-heading text-2xl text-navy">Comments Queue</h1>
      <p className="mt-1 text-sm text-slate-500">
        Citizen comments on proposals are hidden until approved here.
      </p>

      <div className="mt-5 flex gap-2">
        {(["pending", "approved", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`tag px-4 py-1.5 text-sm capitalize ${filter === f ? "bg-royal text-white" : "bg-cream text-navy hover:bg-sand"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-brick/10 px-4 py-2.5 text-sm font-medium text-brick">
          {error}
        </p>
      )}

      <div className="mt-5 space-y-4">
        {rows === null ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : rows.length === 0 ? (
          <p className="card p-8 text-center text-sm text-slate-500">
            No {filter === "all" ? "" : filter} comments.
          </p>
        ) : (
          rows.map((c) => {
            const name = c.profiles?.full_name ?? "Citizen";
            return (
              <article key={c.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <InitialsAvatar name={name} className="h-9 w-9 text-sm" />
                    <div>
                      <p className="text-sm font-bold text-navy">{name}</p>
                      <p className="text-xs text-slate-500">{formatDateTime(c.created_at)}</p>
                    </div>
                  </div>
                  <span className={`tag ${c.approved ? "bg-green-100 text-green-800" : "bg-orange/15 text-orange"}`}>
                    {c.approved ? "approved" : "pending"}
                  </span>
                </div>
                {c.proposals && (
                  <p className="mt-3 text-xs text-slate-500">
                    On:{" "}
                    <Link
                      href={`/youth/get-involved/${c.proposals.slug}`}
                      className="font-semibold text-azure hover:text-royal"
                    >
                      {c.proposals.title}
                    </Link>
                  </p>
                )}
                <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{c.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.approved ? (
                    <button
                      onClick={() => setApproved(c.id, false)}
                      disabled={busy === c.id}
                      className="btn-outline px-3 py-1.5 text-xs"
                    >
                      <X className="h-3.5 w-3.5" /> Unapprove
                    </button>
                  ) : (
                    <button
                      onClick={() => setApproved(c.id, true)}
                      disabled={busy === c.id}
                      className="btn bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => remove(c.id)}
                    disabled={busy === c.id}
                    className="btn px-3 py-1.5 text-xs text-brick hover:bg-brick/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
