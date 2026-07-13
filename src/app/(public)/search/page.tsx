import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, FileText, Newspaper, Scale } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading, SectionKicker, EmptyState, Tag } from "@/components/ui";
import { formatDate, LEGISLATION_KIND_LABELS } from "@/lib/utils";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const supabase = createClient();

  const like = `%${q}%`;
  const [posts, events, legislation, documents] = q
    ? await Promise.all([
        supabase
          .from("posts")
          .select("id, slug, title, excerpt, published_at, created_at, type")
          .eq("status", "published")
          .or(`title.ilike.${like},excerpt.ilike.${like}`)
          .limit(10)
          .then((r) => r.data ?? []),
        supabase
          .from("events")
          .select("id, slug, title, summary, starts_at, category")
          .eq("status", "published")
          .or(`title.ilike.${like},summary.ilike.${like}`)
          .limit(10)
          .then((r) => r.data ?? []),
        supabase
          .from("legislation")
          .select("id, kind, number, title, summary, date_approved")
          .eq("status", "published")
          .or(`title.ilike.${like},number.ilike.${like},summary.ilike.${like}`)
          .limit(10)
          .then((r) => r.data ?? []),
        supabase
          .from("documents")
          .select("id, title, description, category, year, file_url")
          .eq("status", "published")
          .or(`title.ilike.${like},description.ilike.${like}`)
          .limit(10)
          .then((r) => r.data ?? []),
      ])
    : [[], [], [], []];

  const total = posts.length + events.length + legislation.length + documents.length;

  return (
    <div className="container-site py-12">
      <SectionKicker>Search</SectionKicker>
      <SectionHeading as="h1">
        {q ? `Results for “${q}”` : "Search the hub"}
      </SectionHeading>

      <form action="/search" method="get" className="card mt-6 flex max-w-2xl gap-3 p-4">
        <label htmlFor="search-q" className="sr-only">Search</label>
        <input
          id="search-q"
          name="q"
          defaultValue={q}
          placeholder="Search news, events, ordinances, documents…"
          className="input flex-1"
        />
        <button className="btn-secondary">Search</button>
      </form>

      {q && total === 0 && (
        <div className="mt-8 max-w-2xl">
          <EmptyState
            title={`Nothing found for “${q}”`}
            hint="Try fewer or different keywords — e.g. “scholarship”, “ordinance”, “basketball”."
          />
        </div>
      )}

      <div className="mt-8 space-y-10">
        {events.length > 0 && (
          <section>
            <h2 className="display-heading mb-4 flex items-center gap-2 text-lg text-navy">
              <CalendarDays className="h-5 w-5 text-orange" /> Events
            </h2>
            <ul className="space-y-3">
              {events.map((e) => (
                <li key={e.id}>
                  <Link href={`/youth/events/${e.slug}`} className="card block p-4 hover:shadow-lift">
                    <div className="flex items-center gap-2">
                      <Tag colorKey={e.category}>{e.category}</Tag>
                      <span className="text-xs text-slate-500">{formatDate(e.starts_at)}</span>
                    </div>
                    <p className="mt-1 font-bold text-navy">{e.title}</p>
                    {e.summary && <p className="text-sm text-slate-600">{e.summary}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {posts.length > 0 && (
          <section>
            <h2 className="display-heading mb-4 flex items-center gap-2 text-lg text-navy">
              <Newspaper className="h-5 w-5 text-orange" /> News &amp; Announcements
            </h2>
            <ul className="space-y-3">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link href={`/news/${p.slug}`} className="card block p-4 hover:shadow-lift">
                    <div className="flex items-center gap-2">
                      <Tag colorKey={p.type}>{p.type === "announcement" ? "Announcement" : "News"}</Tag>
                      <span className="text-xs text-slate-500">{formatDate(p.published_at ?? p.created_at)}</span>
                    </div>
                    <p className="mt-1 font-bold text-navy">{p.title}</p>
                    {p.excerpt && <p className="text-sm text-slate-600">{p.excerpt}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {legislation.length > 0 && (
          <section>
            <h2 className="display-heading mb-4 flex items-center gap-2 text-lg text-navy">
              <Scale className="h-5 w-5 text-orange" /> Legislation
            </h2>
            <ul className="space-y-3">
              {legislation.map((l) => (
                <li key={l.id} className="card p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="bg-sky text-navy">{LEGISLATION_KIND_LABELS[l.kind]}</Tag>
                    <span className="text-xs font-bold text-slate-500">{l.number}</span>
                  </div>
                  <p className="mt-1 font-bold text-navy">{l.title}</p>
                  {l.summary && <p className="text-sm text-slate-600">{l.summary}</p>}
                </li>
              ))}
            </ul>
            <Link href="/transparency" className="mt-3 inline-block text-sm font-bold text-azure hover:text-royal">
              Browse all legislation →
            </Link>
          </section>
        )}

        {documents.length > 0 && (
          <section>
            <h2 className="display-heading mb-4 flex items-center gap-2 text-lg text-navy">
              <FileText className="h-5 w-5 text-orange" /> Documents
            </h2>
            <ul className="space-y-3">
              {documents.map((d) => (
                <li key={d.id} className="card p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="bg-sky text-navy">{d.category}</Tag>
                    {d.year && <span className="text-xs font-bold text-slate-500">{d.year}</span>}
                  </div>
                  <p className="mt-1 font-bold text-navy">{d.title}</p>
                  {d.description && <p className="text-sm text-slate-600">{d.description}</p>}
                  {d.file_url && (
                    <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-bold text-azure hover:text-royal">
                      Download PDF →
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
