import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading, SectionKicker, EmptyState, Tag } from "@/components/ui";
import { DOCUMENT_CATEGORIES, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Full Disclosure Documents",
  description:
    "Annual budgets, bids and projects, financial reports, and downloadable forms of the City Government of Batangas.",
};

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  const category = DOCUMENT_CATEGORIES.find((c) => c === searchParams.category);

  let query = supabase
    .from("documents")
    .select("*")
    .eq("status", "published")
    .order("year", { ascending: false })
    .order("created_at", { ascending: false });
  if (category) query = query.eq("category", category);
  const { data: docs, error } = await query;

  return (
    <div className="container-site py-12">
      <Link
        href="/transparency"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Transparency
      </Link>
      <SectionKicker>Full disclosure policy</SectionKicker>
      <SectionHeading as="h1">Documents &amp; Forms</SectionHeading>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <Link
          href="/transparency/documents"
          className={`tag px-4 py-1.5 text-sm ${!category ? "bg-royal text-white" : "border border-navy/10 bg-white text-navy hover:border-orange"}`}
        >
          All
        </Link>
        {DOCUMENT_CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/transparency/documents?category=${encodeURIComponent(c)}`}
            className={`tag px-4 py-1.5 text-sm ${category === c ? "bg-royal text-white" : "border border-navy/10 bg-white text-navy hover:border-orange"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {error ? (
          <EmptyState title="Couldn't load documents" hint="Please refresh the page." />
        ) : docs && docs.length > 0 ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {docs.map((d) => (
              <li key={d.id} className="card flex items-start gap-4 p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky/30 text-royal">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag>{d.category}</Tag>
                    {d.year && (
                      <span className="text-xs font-bold text-slate-500">{d.year}</span>
                    )}
                  </div>
                  <h2 className="mt-1.5 font-bold text-navy">{d.title}</h2>
                  {d.description && (
                    <p className="mt-0.5 text-sm text-slate-600">{d.description}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {d.office} · Posted {formatDate(d.created_at)}
                  </p>
                  {d.file_url ? (
                    <a
                      href={d.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm font-bold text-royal hover:text-navy"
                    >
                      Download PDF →
                    </a>
                  ) : (
                    <p className="mt-2 text-sm font-medium text-slate-400">
                      PDF coming soon
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title={category ? `No ${category} documents yet` : "No documents yet"}
            hint="Published documents will appear here."
          />
        )}
      </div>
    </div>
  );
}
