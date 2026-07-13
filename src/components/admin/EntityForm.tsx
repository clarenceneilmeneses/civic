"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cacheGet } from "@/lib/adminCache";
import { slugify } from "@/lib/utils";
import RichTextEditor from "./RichTextEditor";
import UploadField from "./UploadField";

export type FieldDef = {
  name: string;
  label: string;
  type:
    | "text"
    | "textarea"
    | "richtext"
    | "select"
    | "checkbox"
    | "number"
    | "date"
    | "datetime"
    | "image"
    | "file"
    | "lines"; // string[] edited one per line
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  help?: string;
  full?: boolean; // span both columns
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Values = Record<string, any>;

function toInputDatetime(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function EntityForm({
  table,
  id,
  title,
  fields,
  defaults,
  listHref,
  slugFrom,
  hasPublishedAt = false,
}: {
  table: string;
  id: string; // "new" for create
  title: string;
  fields: FieldDef[];
  defaults: Values;
  listHref: string;
  /** When set, auto-fills the `slug` field from this field while the slug is empty/untouched. */
  slugFrom?: string;
  /** Stamp published_at the first time status flips to published. */
  hasPublishedAt?: boolean;
}) {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const isNew = id === "new";
  // Opening an edit form from a list we just fetched: hydrate instantly from
  // the cached list row instead of a fresh round-trip.
  const cachedRow = useMemo(() => {
    if (isNew) return undefined;
    return cacheGet<Values[]>(`list:${table}`)?.find((r) => r.id === id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, table]);
  const [values, setValues] = useState<Values>(cachedRow ?? defaults);
  const [loading, setLoading] = useState(!isNew && !cachedRow);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(!isNew);

  useEffect(() => {
    if (isNew || cachedRow) return;
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
      if (!mounted) return;
      if (error || !data) {
        setError("Couldn't load this record. It may have been deleted.");
      } else {
        setValues(data as Values);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, table]);

  function set(name: string, value: unknown) {
    setValues((v) => {
      const next = { ...v, [name]: value };
      if (slugFrom && name === slugFrom && !slugTouched) {
        next.slug = slugify(String(value ?? ""));
      }
      return next;
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload: Values = {};
    for (const f of fields) {
      let v = values[f.name];
      if (f.type === "number") v = v === "" || v === null || v === undefined ? null : Number(v);
      if (f.type === "date" || f.type === "datetime")
        v = v ? new Date(v).toISOString() : null;
      if (f.type === "lines")
        v = Array.isArray(v)
          ? v
          : String(v ?? "")
              .split("\n")
              .map((s: string) => s.trim())
              .filter(Boolean);
      if (typeof v === "string") v = v.trim() || null;
      if (f.required && (v === null || v === undefined || v === "")) {
        setError(`"${f.label}" is required.`);
        setSaving(false);
        return;
      }
      payload[f.name] = v;
    }
    if (hasPublishedAt && payload.status === "published" && !values.published_at) {
      payload.published_at = new Date().toISOString();
    }

    // Dynamic table name — the typed schema can't resolve it, so untype here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase.from(table) as any;
    const result = isNew
      ? await db.insert(payload).select("id").single()
      : await db.update(payload).eq("id", id).select("id").single();

    setSaving(false);
    if (result.error) {
      const msg = result.error.message.includes("row-level security")
        ? "Not allowed: editors can only save drafts — ask an admin to publish."
        : result.error.code === "23505"
          ? "That slug (or another unique value) is already in use."
          : result.error.message;
      setError(msg);
      return;
    }
    router.push(listHref);
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this record permanently? This cannot be undone.")) return;
    setDeleting(true);
    const { error } = await supabase.from(table).delete().eq("id", id);
    setDeleting(false);
    if (error) {
      setError(
        error.message.includes("row-level security")
          ? "Not allowed: only admins can delete."
          : error.message
      );
      return;
    }
    router.push(listHref);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href={listHref} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-azure hover:text-royal">
        <ArrowLeft className="h-4 w-4" /> Back to list
      </Link>
      <h1 className="display-heading text-2xl text-navy">
        {isNew ? `New ${title}` : `Edit ${title}`}
      </h1>

      <form onSubmit={save} className="card mt-6 grid gap-5 p-6 sm:grid-cols-2">
        {fields.map((f) => {
          const v = values[f.name];
          const wrap = f.full || ["textarea", "richtext", "image", "file", "lines"].includes(f.type)
            ? "sm:col-span-2"
            : "";
          const inputId = `field-${f.name}`;
          return (
            <div key={f.name} className={wrap}>
              {f.type !== "checkbox" && (
                <label htmlFor={inputId} className="label">
                  {f.label}
                  {f.required && <span className="text-brick"> *</span>}
                </label>
              )}
              {f.type === "text" && (
                <input
                  id={inputId}
                  className="input"
                  value={v ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => {
                    if (f.name === "slug") setSlugTouched(true);
                    set(f.name, e.target.value);
                  }}
                />
              )}
              {f.type === "number" && (
                <input
                  id={inputId}
                  type="number"
                  className="input"
                  value={v ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {f.type === "date" && (
                <input
                  id={inputId}
                  type="date"
                  className="input"
                  value={v ? String(v).slice(0, 10) : ""}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {f.type === "datetime" && (
                <input
                  id={inputId}
                  type="datetime-local"
                  className="input"
                  value={typeof v === "string" && v.includes("T") && v.length <= 16 ? v : toInputDatetime(v)}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {f.type === "textarea" && (
                <textarea
                  id={inputId}
                  className="input resize-y"
                  rows={3}
                  value={v ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {f.type === "lines" && (
                <textarea
                  id={inputId}
                  className="input resize-y font-mono text-xs"
                  rows={6}
                  value={Array.isArray(v) ? v.join("\n") : (v ?? "")}
                  placeholder={f.placeholder}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              )}
              {f.type === "select" && (
                <select
                  id={inputId}
                  className="input"
                  value={v ?? ""}
                  onChange={(e) => set(f.name, e.target.value)}
                >
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              )}
              {f.type === "checkbox" && (
                <label className="flex items-center gap-2.5 pt-7 text-sm font-semibold text-navy">
                  <input
                    type="checkbox"
                    checked={Boolean(v)}
                    onChange={(e) => set(f.name, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-royal focus:ring-azure"
                  />
                  {f.label}
                </label>
              )}
              {f.type === "richtext" && (
                <RichTextEditor value={v ?? ""} onChange={(html) => set(f.name, html)} />
              )}
              {f.type === "image" && (
                <UploadField
                  value={v ?? null}
                  onChange={(url) => set(f.name, url)}
                  bucket="images"
                  accept="image/*"
                  label="Upload an image (JPG, PNG, WebP)"
                />
              )}
              {f.type === "file" && (
                <UploadField
                  value={v ?? null}
                  onChange={(url) => set(f.name, url)}
                  bucket="documents"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  label="Upload a file (PDF preferred)"
                />
              )}
              {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
            </div>
          );
        })}

        {error && (
          <p className="rounded-lg bg-brick/10 px-4 py-2.5 text-sm font-medium text-brick sm:col-span-2">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5 sm:col-span-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isNew ? "Create" : "Save changes"}
          </button>
          {!isNew && (
            <button
              type="button"
              onClick={remove}
              disabled={deleting}
              className="btn text-brick hover:bg-brick/10"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
