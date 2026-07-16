"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cacheGet, cacheSet } from "@/lib/adminCache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export type ColumnDef = {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
  className?: string;
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`tag ${status === "published" ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"}`}
    >
      {status}
    </span>
  );
}

// Summary tiles derived from the already-fetched rows — no extra queries.
// "Total" caps at the 200-row fetch limit, hence the "+".
function deriveStats(rows: Row[]) {
  const atCap = rows.length >= 200;
  const stats: { label: string; value: string }[] = [
    { label: "Total", value: atCap ? "200+" : String(rows.length) },
  ];
  if (rows.length > 0 && "status" in rows[0]) {
    const published = rows.filter((r) => r.status === "published").length;
    stats.push(
      { label: "Published", value: String(published) },
      { label: "Drafts", value: String(rows.length - published) }
    );
  }
  if (rows.length > 0 && "created_at" in rows[0]) {
    const monthAgo = Date.now() - 30 * 24 * 3600 * 1000;
    stats.push({
      label: "Added last 30 days",
      value: String(
        rows.filter((r) => new Date(r.created_at).getTime() >= monthAgo).length
      ),
    });
  }
  return stats;
}

export default function EntityList({
  table,
  title,
  columns,
  basePath,
  searchColumns = [],
  orderBy = "created_at",
  ascending = false,
  description,
}: {
  table: string;
  title: string;
  columns: ColumnDef[];
  basePath: string;
  searchColumns?: string[];
  orderBy?: string;
  ascending?: boolean;
  description?: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  // Show the cached list instantly on revisit; a fresh fetch still replaces
  // it in the background.
  const [rows, setRows] = useState<Row[] | null>(
    () => cacheGet<Row[]>(`list:${table}`) ?? null
  );
  // Unfiltered snapshot backing the summary tiles, so searching doesn't
  // make the totals jump around.
  const [baseRows, setBaseRows] = useState<Row[] | null>(
    () => cacheGet<Row[]>(`list:${table}`) ?? null
  );
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const t = setTimeout(async () => {
      let query = supabase
        .from(table)
        .select("*")
        .order(orderBy, { ascending })
        .limit(200);
      if (q.trim() && searchColumns.length > 0) {
        query = query.or(
          searchColumns.map((c) => `${c}.ilike.%${q.trim()}%`).join(",")
        );
      }
      const { data, error } = await query;
      if (!mounted) return;
      if (error) setError(error.message);
      else {
        setError(null);
        setRows(data ?? []);
        if (!q.trim()) {
          setBaseRows(data ?? []);
          cacheSet(`list:${table}`, data ?? []);
        }
      }
    }, q ? 250 : 0);
    return () => {
      mounted = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, table]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-navy">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        <Link href={`${basePath}/new`} className="btn-primary">
          <Plus className="h-4 w-4" /> New
        </Link>
      </div>

      {baseRows !== null && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {deriveStats(baseRows).map((s) => (
            <div key={s.label} className="card px-4 py-3">
              <p className="font-display text-xl font-semibold text-navy">
                {s.value}
              </p>
              <p className="text-xs font-medium text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {searchColumns.length > 0 && (
        <div className="relative mt-5 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="input pl-9"
            aria-label={`Search ${title}`}
          />
        </div>
      )}

      <div className="card mt-5 overflow-x-auto">
        {rows === null ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <p className="p-6 text-sm font-medium text-brick">{error}</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No records yet. Click <strong>New</strong> to create the first one.
          </p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                {columns.map((c) => (
                  <th key={c.key} className={`px-4 py-3 font-bold text-navy ${c.className ?? ""}`}>
                    {c.label}
                  </th>
                ))}
                <th className="w-16 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  {columns.map((c) => (
                    <td key={c.key} className={`px-4 py-3 align-top ${c.className ?? ""}`}>
                      {c.render ? c.render(row) : (row[c.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Link
                      href={`${basePath}/${row.id}`}
                      aria-label="Edit"
                      className="inline-flex rounded-md p-1.5 text-royal hover:bg-royal/10"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {rows && rows.length >= 200 && (
        <p className="mt-2 text-xs text-slate-500">
          Showing the first 200 records — use search to narrow down.
        </p>
      )}
    </div>
  );
}
