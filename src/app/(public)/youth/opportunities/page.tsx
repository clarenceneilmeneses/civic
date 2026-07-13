import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EventCard } from "@/components/cards";
import { SectionHeading, SectionKicker, EmptyState } from "@/components/ui";

export const metadata: Metadata = {
  title: "Scholarships & Opportunities",
  description:
    "Scholarship programs, grants, and opportunities for the youth of Batangas City.",
};

export default async function OpportunitiesPage() {
  const supabase = createClient();

  const [{ data: scholarshipEvents }, { data: forms }] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .eq("category", "Scholarships")
      .order("starts_at"),
    supabase
      .from("documents")
      .select("*")
      .eq("status", "published")
      .eq("category", "Forms")
      .order("title"),
  ]);

  return (
    <div className="container-site py-12">
      <Link
        href="/youth"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Youth Hub
      </Link>
      <SectionKicker>Youth Hub</SectionKicker>
      <SectionHeading as="h1">Scholarships &amp; Opportunities</SectionHeading>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        Orientation schedules, application windows, and downloadable forms for
        city scholarship programs and youth opportunities.
      </p>

      <h2 className="mt-10 font-display text-lg font-bold tracking-tight text-navy">
        Scholarship events &amp; deadlines
      </h2>
      <div className="mt-4">
        {scholarshipEvents && scholarshipEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarshipEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No scholarship activities posted"
            hint="Application periods and orientations will appear here."
          />
        )}
      </div>

      <h2 className="mt-12 font-display text-lg font-bold tracking-tight text-navy">
        Application forms
      </h2>
      {forms && forms.length > 0 ? (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {forms.map((f) => (
            <li key={f.id} className="card flex items-start gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky/30 text-royal">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-navy">{f.title}</p>
                {f.description && (
                  <p className="mt-0.5 text-sm text-slate-600">{f.description}</p>
                )}
                <p className="mt-0.5 text-xs text-slate-500">{f.office}</p>
                {f.file_url ? (
                  <a
                    href={f.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-bold text-royal hover:text-navy"
                  >
                    Download PDF →
                  </a>
                ) : (
                  <p className="mt-2 text-sm font-medium text-slate-400">
                    PDF coming soon — available at the office counter
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <EmptyState title="No forms posted yet" />
        </div>
      )}
    </div>
  );
}
