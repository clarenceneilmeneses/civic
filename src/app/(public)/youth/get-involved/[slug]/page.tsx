import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import CommentSection from "@/components/CommentSection";
import { Tag } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data } = await supabase
    .from("proposals")
    .select("title, summary")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();
  if (!data) return { title: "Proposal not found" };
  return { title: data.title, description: data.summary ?? undefined };
}

export default async function ProposalPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!proposal) notFound();

  const commentsOpen =
    proposal.proposal_status === "open" &&
    (!proposal.comments_close_at ||
      new Date(proposal.comments_close_at) > new Date());

  return (
    <article className="container-site max-w-4xl py-12">
      <Link
        href="/youth/get-involved"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-azure hover:text-royal"
      >
        <ArrowLeft className="h-4 w-4" /> All proposals
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Tag
          className={
            commentsOpen
              ? "bg-marigold/80 text-navy"
              : "bg-slate-200 text-slate-600"
          }
        >
          {commentsOpen ? "Open for comments" : "Comments closed"}
        </Tag>
        {proposal.comments_close_at && commentsOpen && (
          <span className="text-sm font-medium text-slate-500">
            Comment period ends {formatDate(proposal.comments_close_at)}
          </span>
        )}
      </div>

      <h1 className="mt-3 font-display text-3xl font-semibold uppercase leading-tight tracking-wide text-navy sm:text-4xl">
        {proposal.title}
      </h1>
      {proposal.summary && (
        <p className="mt-3 border-l-4 border-marigold pl-4 text-lg font-medium text-slate-700">
          {proposal.summary}
        </p>
      )}

      {proposal.pdf_url && (
        <a
          href={proposal.pdf_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline mt-5"
        >
          <FileText className="h-4 w-4" /> Read the full draft (PDF)
        </a>
      )}

      {proposal.body && (
        <div
          className="prose-civic mt-6"
          dangerouslySetInnerHTML={{ __html: proposal.body }}
        />
      )}

      <CommentSection proposalId={proposal.id} commentsOpen={commentsOpen} />
    </article>
  );
}
