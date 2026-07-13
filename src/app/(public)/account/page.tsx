import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SectionHeading, SectionKicker, Tag } from "@/components/ui";
import { formatDateRange, formatDateTime } from "@/lib/utils";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  const [{ data: profile }, { data: registrations }, { data: comments }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      supabase
        .from("event_registrations")
        .select("id, created_at, events(id, slug, title, starts_at, ends_at, venue, category)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("proposal_comments")
        .select("id, body, approved, created_at, proposals(slug, title)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

  return (
    <div className="container-site max-w-4xl py-12">
      <SectionKicker>My account</SectionKicker>
      <SectionHeading as="h1">
        {profile?.full_name ?? user.email}
      </SectionHeading>
      <p className="mt-1 text-sm text-slate-500">
        {user.email} · Member since {formatDateTime(user.created_at)}
      </p>

      <section className="mt-10" aria-labelledby="my-events">
        <h2 id="my-events" className="display-heading flex items-center gap-2 text-lg text-navy">
          <CalendarDays className="h-5 w-5 text-orange" /> My event registrations
        </h2>
        <div className="mt-4 space-y-3">
          {registrations && registrations.length > 0 ? (
            registrations.map((r) => {
              const e = r.events as unknown as {
                slug: string; title: string; starts_at: string;
                ends_at: string | null; venue: string | null; category: string;
              } | null;
              if (!e) return null;
              return (
                <Link key={r.id} href={`/youth/events/${e.slug}`} className="card block p-4 hover:shadow-lift">
                  <Tag colorKey={e.category}>{e.category}</Tag>
                  <p className="mt-1 font-bold text-navy">{e.title}</p>
                  <p className="text-sm text-slate-600">
                    {formatDateRange(e.starts_at, e.ends_at)}
                    {e.venue ? ` · ${e.venue}` : ""}
                  </p>
                </Link>
              );
            })
          ) : (
            <p className="card p-5 text-sm text-slate-500">
              You haven't registered for any events yet.{" "}
              <Link href="/youth" className="font-bold text-azure hover:text-royal">
                Browse the Youth Hub →
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="my-comments">
        <h2 id="my-comments" className="display-heading flex items-center gap-2 text-lg text-navy">
          <MessageSquare className="h-5 w-5 text-orange" /> My comments
        </h2>
        <div className="mt-4 space-y-3">
          {comments && comments.length > 0 ? (
            comments.map((c) => {
              const p = c.proposals as unknown as { slug: string; title: string } | null;
              return (
                <div key={c.id} className="card p-4">
                  {p && (
                    <Link
                      href={`/youth/get-involved/${p.slug}`}
                      className="text-sm font-bold text-azure hover:text-royal"
                    >
                      {p.title}
                    </Link>
                  )}
                  <p className="mt-1 text-sm text-slate-700">{c.body}</p>
                  <p className="mt-1.5 text-xs text-slate-500">
                    {formatDateTime(c.created_at)} ·{" "}
                    {c.approved ? (
                      <span className="font-semibold text-green-700">Approved</span>
                    ) : (
                      <span className="font-semibold text-orange">Pending moderation</span>
                    )}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="card p-5 text-sm text-slate-500">
              You haven't commented on any proposals yet.{" "}
              <Link href="/youth/get-involved" className="font-bold text-azure hover:text-royal">
                See open proposals →
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
