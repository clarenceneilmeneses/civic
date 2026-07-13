import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  Landmark,
  MapPin,
  MessageSquarePlus,
  Palette,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import { EventCard } from "@/components/cards";
import { EmptyState, Tag } from "@/components/ui";
import { formatDateRange } from "@/lib/utils";
import type { CityEvent } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Youth Hub",
  description:
    "Upcoming youth activities, scholarships, and ways for young Batangueños to get involved in local government.",
};

const CATEGORIES = [
  { icon: Trophy, label: "Sports" },
  { icon: Palette, label: "Arts" },
  { icon: Sparkles, label: "Leadership" },
  { icon: HeartHandshake, label: "Volunteering" },
  { icon: GraduationCap, label: "Scholarships" },
  { icon: Landmark, label: "SK Programs" },
] as const;

function FeaturedEvent({ event }: { event: CityEvent }) {
  return (
    <Link
      href={`/youth/events/${event.slug}`}
      className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl transition-shadow hover:shadow-lift sm:col-span-2 lg:row-span-2 lg:min-h-full"
    >
      {event.cover_image ? (
        <Image
          src={event.cover_image}
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
        <div className="flex flex-wrap items-center gap-2">
          <Tag className="bg-marigold text-navy">Up next</Tag>
          <Tag className="bg-white/20 text-white">{event.category}</Tag>
        </div>
        <h2 className="mt-3 max-w-lg font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">
          {event.title}
        </h2>
        <div className="mt-3 space-y-1 text-sm text-sky">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0" />
            {formatDateRange(event.starts_at, event.ends_at)}
          </p>
          {event.venue && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" /> {event.venue}
            </p>
          )}
        </div>
        <span className="btn-primary mt-5 inline-flex">
          View &amp; RSVP <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default async function YouthHubPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const supabase = createClient();
  const category = CATEGORIES.map((c) => c.label).find(
    (c) => c === searchParams.category
  );

  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("starts_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString())
    .order("starts_at");
  if (category) query = query.eq("category", category);
  const { data: events, error } = await query;

  const { count: openProposals } = await supabase
    .from("proposals")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .eq("proposal_status", "open");

  const [featured, ...rest] = events ?? [];

  return (
    <>
      <PageHeader
        kicker="For young Batangueños"
        title="Youth Hub"
        tone="youth"
        lede="Find your next activity, chase a scholarship, or speak up on a city proposal."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/youth/opportunities" className="btn-secondary">
            <GraduationCap className="h-4 w-4" /> Scholarships &amp; Opportunities
          </Link>
          <Link href="/youth/get-involved" className="btn-primary">
            <MessageSquarePlus className="h-4 w-4" /> Get Involved
            {openProposals ? (
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-xs font-bold">
                {openProposals} open
              </span>
            ) : null}
          </Link>
        </div>
      </PageHeader>

      <section className="bg-white">
        <div className="container-site py-10">
          {/* Category pills — swipeable on mobile */}
          <div
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
            role="group"
            aria-label="Filter events by category"
          >
            <Link
              href="/youth"
              className={`tag shrink-0 px-4 py-2 text-sm ${!category ? "bg-royal text-white" : "border border-navy/10 bg-white text-navy hover:border-orange"}`}
            >
              All
            </Link>
            {CATEGORIES.map((c) => {
              const active = category === c.label;
              return (
                <Link
                  key={c.label}
                  href={`/youth?category=${encodeURIComponent(c.label)}`}
                  className={`tag shrink-0 gap-1.5 px-4 py-2 text-sm ${active ? "bg-royal text-white" : "border border-navy/10 bg-white text-navy hover:border-orange"}`}
                >
                  <c.icon className={`h-4 w-4 ${active ? "text-marigold" : "text-royal"}`} />
                  {c.label}
                </Link>
              );
            })}
          </div>

          {/* Bento grid: next event big, the rest compact */}
          <div className="mt-8">
            {error ? (
              <EmptyState title="Couldn't load events" hint="Please refresh the page." />
            ) : featured ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <FeaturedEvent event={featured} />
                {rest.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </div>
            ) : (
              <EmptyState
                title={category ? `No upcoming ${category} events` : "No upcoming events"}
                hint="New activities are posted here as soon as they're scheduled — check back soon."
              />
            )}
          </div>
        </div>
      </section>

      {/* CLOSING BAND */}
      <section className="bg-cream">
        <div className="container-site flex flex-col items-center gap-4 py-14 text-center">
          <Users className="h-8 w-8 text-royal" />
          <h2 className="font-display text-2xl font-bold tracking-tight text-navy">
            Running a youth org?
          </h2>
          <p className="max-w-md text-slate-600">
            Get accredited by the city to unlock grants and free use of the
            Youth Innovation Center — it takes about 10 working days.
          </p>
          <Link href="/services" className="btn-secondary">
            See accreditation steps <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
