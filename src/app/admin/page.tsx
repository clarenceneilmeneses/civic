import Link from "next/link";
import {
  CalendarDays,
  FileText,
  Inbox,
  Mail,
  MessageSquare,
  Newspaper,
  Scale,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

async function count(
  supabase: ReturnType<typeof createClient>,
  table:
    | "posts"
    | "events"
    | "legislation"
    | "documents"
    | "proposal_comments"
    | "contact_messages"
    | "subscribers"
    | "event_registrations",
  filter?: (q: any) => any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count: c } = await q;
  return c ?? 0;
}

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    posts,
    events,
    legislation,
    documents,
    pendingComments,
    unreadMessages,
    subscribers,
    rsvps,
    { data: recentMessages },
    { data: recentComments },
  ] = await Promise.all([
    count(supabase, "posts"),
    count(supabase, "events"),
    count(supabase, "legislation"),
    count(supabase, "documents"),
    count(supabase, "proposal_comments", (q) => q.eq("approved", false)),
    count(supabase, "contact_messages", (q) => q.eq("is_read", false)),
    count(supabase, "subscribers"),
    count(supabase, "event_registrations"),
    supabase
      .from("contact_messages")
      .select("id, name, subject, created_at, is_read")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("proposal_comments")
      .select("id, body, approved, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    { label: "News & announcements", value: posts, href: "/admin/news", icon: Newspaper },
    { label: "Events", value: events, href: "/admin/events", icon: CalendarDays },
    { label: "Legislation", value: legislation, href: "/admin/legislation", icon: Scale },
    { label: "Documents", value: documents, href: "/admin/documents", icon: FileText },
    { label: "Event RSVPs", value: rsvps, href: "/admin/events", icon: Users },
    { label: "Subscribers", value: subscribers, href: "/admin/subscribers", icon: Mail },
    { label: "Pending comments", value: pendingComments, href: "/admin/comments", icon: MessageSquare, alert: pendingComments > 0 },
    { label: "Unread messages", value: unreadMessages, href: "/admin/messages", icon: Inbox, alert: unreadMessages > 0 },
  ];

  return (
    <div>
      <h1 className="display-heading text-2xl text-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Content and activity across the Batangas Youth Civic Hub.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`card flex items-center gap-4 p-5 transition-shadow hover:shadow-lift ${s.alert ? "border border-orange/50" : ""}`}
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.alert ? "bg-orange text-white" : "bg-royal/10 text-royal"}`}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-display text-2xl font-semibold text-navy">
                {s.value}
              </span>
              <span className="text-xs font-medium text-slate-500">{s.label}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-navy">
            Latest contact messages
          </h2>
          <ul className="divide-y divide-slate-100">
            {(recentMessages ?? []).map((m) => (
              <li key={m.id} className="py-3">
                <Link href="/admin/messages" className="group block">
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-royal">
                    {m.subject || "(no subject)"}
                    {!m.is_read && (
                      <span className="ml-2 tag bg-orange/15 text-orange">new</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {m.name} · {formatDateTime(m.created_at)}
                  </p>
                </Link>
              </li>
            ))}
            {(!recentMessages || recentMessages.length === 0) && (
              <li className="py-3 text-sm text-slate-500">No messages yet.</li>
            )}
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="mb-3 font-display text-lg uppercase tracking-wide text-navy">
            Latest proposal comments
          </h2>
          <ul className="divide-y divide-slate-100">
            {(recentComments ?? []).map((c) => {
              const name =
                (c.profiles as unknown as { full_name: string | null } | null)
                  ?.full_name ?? "Citizen";
              return (
                <li key={c.id} className="py-3">
                  <Link href="/admin/comments" className="group block">
                    <p className="line-clamp-2 text-sm text-slate-800 group-hover:text-royal">
                      {c.body}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {name} · {formatDateTime(c.created_at)} ·{" "}
                      {c.approved ? (
                        <span className="font-semibold text-green-700">approved</span>
                      ) : (
                        <span className="font-semibold text-orange">pending</span>
                      )}
                    </p>
                  </Link>
                </li>
              );
            })}
            {(!recentComments || recentComments.length === 0) && (
              <li className="py-3 text-sm text-slate-500">No comments yet.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
