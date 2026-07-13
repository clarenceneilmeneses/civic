import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Download, FileText, Scale, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import { EmptyState, Pagination, Tag } from "@/components/ui";
import { formatDate, LEGISLATION_KIND_LABELS } from "@/lib/utils";
import type { LegislationKind } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Transparency & Good Governance",
  description:
    "Ordinances, resolutions, executive issuances, and full disclosure documents of the City Government of Batangas.",
};

const PAGE_SIZE = 10;
const KINDS = Object.keys(LEGISLATION_KIND_LABELS) as LegislationKind[];

export default async function TransparencyPage({
  searchParams,
}: {
  searchParams: { kind?: string; q?: string; page?: string };
}) {
  const supabase = createClient();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const kind = KINDS.find((k) => k === searchParams.kind);
  const q = (searchParams.q ?? "").trim();

  let query = supabase
    .from("legislation")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("date_approved", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (kind) query = query.eq("kind", kind);
  if (q) query = query.or(`title.ilike.%${q}%,number.ilike.%${q}%,summary.ilike.%${q}%`);

  const { data: items, count, error } = await query;
  const pageCount = Math.ceil((count ?? 0) / PAGE_SIZE);

  const makeHref = (p: number, k?: LegislationKind | null) => {
    const params = new URLSearchParams();
    const kk = k === undefined ? kind : k;
    if (kk) params.set("kind", kk);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `/transparency${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        kicker="Open government"
        title="Transparency & Good Governance"
        tone="transparency"
        lede="Every ordinance, resolution, and peso — public, searchable, and in plain sight."
      >
        <form
          action="/transparency"
          method="get"
          className="mt-6 flex w-full max-w-xl gap-2"
          role="search"
        >
          <label className="sr-only" htmlFor="q">
            Search legislation
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q}
            placeholder="Search by title, number, or keyword…"
            className="input flex-1 py-3"
          />
          <button className="btn-secondary px-5">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/transparency/documents"
            className="inline-flex items-center gap-2 text-sm font-bold text-royal hover:text-navy"
          >
            <FileText className="h-4 w-4" /> Full Disclosure Documents
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/transparency/documents?category=Forms"
            className="inline-flex items-center gap-2 text-sm font-bold text-royal hover:text-navy"
          >
            <Download className="h-4 w-4" /> Downloadable Forms
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </PageHeader>

      {/* LEGISLATION BROWSER */}
      <section className="bg-white">
        <div className="container-site py-10 pb-16">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
            <Link
              href={makeHref(1, null)}
              className={`tag px-4 py-1.5 text-sm ${!kind ? "bg-royal text-white" : "border border-navy/10 bg-white text-navy hover:border-orange"}`}
            >
              All
            </Link>
            {KINDS.map((k) => (
              <Link
                key={k}
                href={makeHref(1, k)}
                className={`tag px-4 py-1.5 text-sm ${kind === k ? "bg-royal text-white" : "border border-navy/10 bg-white text-navy hover:border-orange"}`}
              >
                {LEGISLATION_KIND_LABELS[k]}s
              </Link>
            ))}
          </div>
          {q && (
            <p className="mt-4 text-sm text-slate-600">
              Results for <strong>“{q}”</strong>
              {count !== null && ` — ${count} found`} ·{" "}
              <Link href={makeHref(1, kind ?? null).split("?")[0]} className="font-semibold text-royal hover:text-navy">
                clear search
              </Link>
            </p>
          )}

          <div className="mt-6">
            {error ? (
              <EmptyState title="Couldn't load legislation" hint="Please refresh the page." />
            ) : items && items.length > 0 ? (
              <ul className="divide-y divide-slate-100 rounded-2xl border border-navy/10 bg-white">
                {items.map((l) => (
                  <li
                    key={l.id}
                    className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <Tag>{LEGISLATION_KIND_LABELS[l.kind]}</Tag>
                        <span className="font-bold text-slate-500">{l.number}</span>
                        <span className="text-slate-400">
                          {formatDate(l.date_approved)}
                        </span>
                      </div>
                      <h2 className="mt-1 font-bold text-navy">{l.title}</h2>
                      {l.summary && (
                        <p className="mt-0.5 text-sm text-slate-600">{l.summary}</p>
                      )}
                    </div>
                    {l.pdf_url ? (
                      <a
                        href={l.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline shrink-0 self-start px-4 py-2 sm:self-center"
                      >
                        <FileText className="h-4 w-4" /> PDF
                      </a>
                    ) : (
                      <span className="shrink-0 text-xs font-medium text-slate-400 sm:self-center">
                        Full text at the City Secretary&apos;s Office
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No results"
                hint={
                  q
                    ? `Nothing matched “${q}”. Try different keywords.`
                    : "Legislation will be listed here once published."
                }
              />
            )}
          </div>
          <Pagination page={page} pageCount={pageCount} makeHref={(p) => makeHref(p)} />
        </div>
      </section>

      {/* CLOSING BAND — quiet CTA instead of another card */}
      <section className="bg-cream">
        <div className="container-site flex flex-col items-center gap-4 py-14 text-center">
          <Scale className="h-8 w-8 text-royal" />
          <h2 className="font-display text-2xl font-bold tracking-tight text-navy">
            Can&apos;t find a document?
          </h2>
          <p className="max-w-md text-slate-600">
            Request it through the city&apos;s public assistance desk — we&apos;ll
            point you to the right office.
          </p>
          <Link href="/contact" className="btn-secondary">
            Contact the city <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
