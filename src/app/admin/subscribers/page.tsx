"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Subscriber } from "@/lib/database.types";
import { formatDateTime } from "@/lib/utils";

export default function AdminSubscribersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error)
      setError(
        error.message.includes("row-level security") || (data ?? []).length === 0
          ? "Only admins can view subscribers."
          : error.message
      );
    else setRows(data ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    const { error } = await supabase.from("subscribers").delete().eq("id", id);
    if (error) setError(error.message);
    else load();
  }

  function exportCsv() {
    if (!rows) return;
    const csv = ["email,subscribed_at", ...rows.map((r) => `${r.email},${r.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-navy">Subscribers</h1>
          <p className="mt-1 text-sm text-slate-500">
            Emails collected from the footer subscribe form.
          </p>
        </div>
        <button onClick={exportCsv} disabled={!rows || rows.length === 0} className="btn-outline">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-brick/10 px-4 py-2.5 text-sm font-medium text-brick">{error}</p>
      )}

      <div className="card mt-5 overflow-x-auto">
        {rows === null ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No subscribers yet.</p>
        ) : (
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-4 py-3 font-bold text-navy">Email</th>
                <th className="px-4 py-3 font-bold text-navy">Subscribed</th>
                <th className="w-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-700">{r.email}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDateTime(r.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove(r.id)}
                      aria-label={`Remove ${r.email}`}
                      className="inline-flex rounded-md p-1.5 text-brick hover:bg-brick/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
