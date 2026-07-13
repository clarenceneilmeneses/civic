"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/lib/database.types";
import { InitialsAvatar } from "@/components/ui";
import { formatDate } from "@/lib/utils";

const ROLES: UserRole[] = ["citizen", "editor", "admin"];

export default function AdminUsersPage() {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Profile[] | null>(null);
  const [me, setMe] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setMe(user?.id ?? null);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) setError(error.message);
    else setRows(data ?? []);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  async function setRole(id: string, role: UserRole) {
    setBusy(id);
    setError(null);
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    setBusy(null);
    if (error) {
      setError(
        error.message.includes("Only admins")
          ? "Only admins can change roles."
          : error.message
      );
      return;
    }
    load();
  }

  return (
    <div>
      <h1 className="display-heading text-2xl text-navy">Users</h1>
      <p className="mt-1 text-sm text-slate-500">
        Registered accounts. <strong>Citizens</strong> can RSVP and comment,{" "}
        <strong>editors</strong> can create draft content, <strong>admins</strong>{" "}
        can publish, delete, moderate, and manage roles.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-brick/10 px-4 py-2.5 text-sm font-medium text-brick">{error}</p>
      )}

      <div className="card mt-5 overflow-x-auto">
        {rows === null ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No users yet.</p>
        ) : (
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="px-4 py-3 font-bold text-navy">Name</th>
                <th className="px-4 py-3 font-bold text-navy">Joined</th>
                <th className="px-4 py-3 font-bold text-navy">Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <InitialsAvatar name={p.full_name ?? "?"} className="h-9 w-9 text-xs" />
                      <span className="font-semibold text-navy">
                        {p.full_name ?? "(no name)"}
                        {p.id === me && (
                          <span className="ml-2 tag bg-sky text-navy">you</span>
                        )}
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={p.role}
                      disabled={busy === p.id || p.id === me}
                      onChange={(e) => setRole(p.id, e.target.value as UserRole)}
                      className="input w-36 py-1.5"
                      aria-label={`Role for ${p.full_name ?? "user"}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {p.id === me && (
                      <p className="mt-1 text-[11px] text-slate-400">
                        You can't change your own role.
                      </p>
                    )}
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
