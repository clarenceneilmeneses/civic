import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import { PostCard } from "@/components/cards";
import { EmptyState, Pagination, Tag } from "@/components/ui";
import SubscribeForm from "@/components/SubscribeForm";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "News & Announcements",
  description:
    "Latest news, feature stories, and public advisories from the City Government of Batangas.",
};

const PAGE_SIZE = 9;

function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift sm:col-span-2"
    >
      {post.cover_image ? (
        <Image
          src={post.cover_image}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-royal to-navy" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/40 to-transparent" />
      <div className="relative p-6 text-white sm:p-8">
        <div className="flex items-center gap-2">
          <Tag className="bg-marigold text-navy">Top story</Tag>
          {post.category && <Tag className="bg-white/20 text-white">{post.category}</Tag>}
        </div>
        <h2 className="mt-3 max-w-xl font-display text-2xl font-semibold uppercase leading-tight tracking-wide sm:text-3xl">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 max-w-xl text-sm text-sky">{post.excerpt}</p>
        )}
        <p className="mt-3 text-xs font-medium text-sky/80">
          {formatDate(post.published_at ?? post.created_at)}
        </p>
      </div>
    </Link>
  );
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { page?: string; type?: string };
}) {
  const supabase = createClient();
  const page = Math.max(1, Number(searchParams.page) || 1);
  const type =
    searchParams.type === "announcement"
      ? "announcement"
      : searchParams.type === "news"
        ? "news"
        : null;

  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (type) query = query.eq("type", type);

  const { data: posts, count, error } = await query;
  const pageCount = Math.ceil((count ?? 0) / PAGE_SIZE);

  const filters = [
    { label: "All", value: null },
    { label: "News", value: "news" },
    { label: "Announcements", value: "announcement" },
  ];

  // Feature the newest story on the first page only.
  const showFeatured = page === 1 && (posts?.length ?? 0) > 0;
  const [featured, ...rest] = posts ?? [];

  return (
    <>
      <PageHeader
        kicker="Newsroom"
        title="News & Announcements"
        lede="Stories, advisories, and updates from the City Government of Batangas."
      >
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {filters.map((f) => {
            const active = type === f.value;
            return (
              <Link
                key={f.label}
                href={f.value ? `/news?type=${f.value}` : "/news"}
                className={`tag px-4 py-2 text-sm ${active ? "bg-royal text-white" : "bg-cream text-navy hover:bg-sand"}`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </PageHeader>

      <section className="bg-white">
        <div className="container-site py-10">
          {error ? (
            <EmptyState title="Couldn't load news" hint="Please refresh the page." />
          ) : posts && posts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {showFeatured ? (
                <>
                  <FeaturedPost post={featured} />
                  {rest.map((p) => (
                    <PostCard key={p.id} post={p} />
                  ))}
                </>
              ) : (
                posts.map((p) => <PostCard key={p.id} post={p} />)
              )}
            </div>
          ) : (
            <EmptyState
              title="Nothing here yet"
              hint="News and announcements will appear here once published."
            />
          )}
          <Pagination
            page={page}
            pageCount={pageCount}
            makeHref={(p) => `/news?${type ? `type=${type}&` : ""}page=${p}`}
          />
        </div>
      </section>

      {/* CLOSING BAND — subscribe */}
      <section className="bg-navy text-white">
        <div className="container-site flex flex-col items-center gap-4 py-14 text-center">
          <h2 className="display-heading text-2xl">Never miss an update</h2>
          <p className="max-w-md text-sky">
            Get announcements, events, and opportunities straight to your inbox.
          </p>
          <div className="w-full max-w-md">
            <SubscribeForm />
          </div>
        </div>
      </section>
    </>
  );
}
