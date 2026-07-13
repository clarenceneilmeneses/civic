import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading, SectionKicker, EmptyState, Tag } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Get Involved — Public Comments",
  description:
    "Proposed ordinances of Batangas City open for public comment. Read, react, and be heard.",
};

export default async function GetInvolvedPage() {
  const supabase = createClient();
  const { data: proposals, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("status", "published")
    .order("proposal_status", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="container-site py-12">
      <Link
        href="/youth"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-azure hover:text-royal"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Youth Hub
      </Link>
      <SectionKicker>People participation</SectionKicker>
      <SectionHeading as="h1">Get Involved</SectionHeading>
      <p className="mt-3 max-w-2xl text-lg text-slate-600">
        These proposed ordinances are open for public comment before the
        Sangguniang Panlungsod votes on them. Sign in with a free account to
        leave a comment — comments are reviewed before they're shown publicly.
      </p>

      <div className="mt-8 space-y-4">
        {error ? (
          <EmptyState title="Couldn't load proposals" hint="Please refresh the page." />
        ) : proposals && proposals.length > 0 ? (
          proposals.map((p) => (
            <Link
              key={p.id}
              href={`/youth/get-involved/${p.slug}`}
              className="card group block p-6 transition-shadow hover:shadow-lift"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Tag
                  className={
                    p.proposal_status === "open"
                      ? "bg-marigold/80 text-navy"
                      : "bg-slate-200 text-slate-600"
                  }
                >
                  {p.proposal_status === "open"
                    ? "Open for comments"
                    : "Comments closed"}
                </Tag>
                {p.comments_close_at && p.proposal_status === "open" && (
                  <span className="text-xs font-medium text-slate-500">
                    until {formatDate(p.comments_close_at)}
                  </span>
                )}
              </div>
              <h2 className="mt-2 text-lg font-bold text-navy group-hover:text-royal">
                {p.title}
              </h2>
              {p.summary && (
                <p className="mt-1 text-sm text-slate-600">{p.summary}</p>
              )}
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-orange">
                <MessageSquare className="h-4 w-4" /> Read &amp; comment{" "}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))
        ) : (
          <EmptyState
            title="No proposals open right now"
            hint="Proposed ordinances open for public comment will be listed here."
          />
        )}
      </div>
    </div>
  );
}
