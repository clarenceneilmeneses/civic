import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ShareButton from "@/components/ShareButton";
import { Tag } from "@/components/ui";
import { formatDate, stripHtml, truncate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, body, cover_image")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt ?? truncate(stripHtml(post.body), 160),
    openGraph: post.cover_image ? { images: [post.cover_image] } : undefined,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  const { data: related } = await supabase
    .from("posts")
    .select("id, slug, title, published_at, created_at")
    .eq("status", "published")
    .neq("id", post.id)
    .order("published_at", { ascending: false })
    .limit(4);

  return (
    <article className="container-site max-w-4xl py-12">
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-royal hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to news
      </Link>
      <div className="flex items-center gap-2">
        <Tag colorKey={post.type}>
          {post.type === "announcement" ? "Announcement" : "News"}
        </Tag>
        {post.category && <Tag>{post.category}</Tag>}
      </div>
      <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">
          Published {formatDate(post.published_at ?? post.created_at)} · City
          Government of Batangas
        </p>
        <ShareButton
          title={post.title}
          text={post.excerpt ?? undefined}
          className="px-3.5 py-1.5 text-xs"
        />
      </div>
      {post.cover_image && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-sky/30">
          <Image
            src={post.cover_image}
            alt=""
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}
      {post.excerpt && (
        <p className="mt-6 border-l-4 border-marigold pl-4 text-lg font-medium text-slate-700">
          {post.excerpt}
        </p>
      )}
      <div
        className="prose-civic mt-6"
        dangerouslySetInnerHTML={{ __html: post.body ?? "" }}
      />

      {related && related.length > 0 && (
        <aside className="mt-12 border-t border-slate-200 pt-8">
          <h2 className="mb-4 font-display text-lg font-bold tracking-tight text-navy">
            More from the newsroom
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/news/${r.slug}`}
                  className="card block p-4 hover:shadow-lift"
                >
                  <p className="text-sm font-semibold text-navy">{r.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(r.published_at ?? r.created_at)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}
