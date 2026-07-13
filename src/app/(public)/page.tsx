import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  Check,
  FileText,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Megaphone,
  Palette,
  PhoneCall,
  Scale,
  Sparkles,
  Trophy,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BrandMark from "@/components/BrandMark";
import StreetPattern from "@/components/StreetPattern";
import WeatherWidget from "@/components/WeatherWidget";
import HotlinesStrip from "@/components/HotlinesStrip";
import { PostCard, EventCard } from "@/components/cards";
import { SectionHeading, SectionKicker, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";

// Placeholder showcase photo — swap for real Batangas City photography by
// dropping a file in public/assets and changing this URL.
const SHOWCASE_IMAGE = "https://picsum.photos/seed/batangasyouth/1920/1080";

const QUICK_ACTIONS = [
  {
    title: "Find an Event",
    desc: "Youth activities & scholarships",
    href: "/youth",
    icon: CalendarDays,
    color: "bg-azure",
  },
  {
    title: "Get a Form",
    desc: "Downloadable application forms",
    href: "/transparency/documents?category=Forms",
    icon: FileText,
    color: "bg-orange",
  },
  {
    title: "Read Ordinances",
    desc: "City legislation & issuances",
    href: "/transparency",
    icon: Scale,
    color: "bg-royal",
  },
  {
    title: "Emergency Hotlines",
    desc: "Police, fire, medical, disaster",
    href: "/contact/hotlines",
    icon: PhoneCall,
    color: "bg-brick",
  },
];

const EVENT_CATEGORY_CHIPS = [
  { icon: Trophy, label: "Sports" },
  { icon: Palette, label: "Arts" },
  { icon: Sparkles, label: "Leadership" },
  { icon: HeartHandshake, label: "Volunteering" },
  { icon: GraduationCap, label: "Scholarships" },
  { icon: Landmark, label: "SK Programs" },
];

export default async function HomePage() {
  const supabase = createClient();
  const nowIso = new Date().toISOString();

  const [
    { data: news },
    { data: announcements },
    { data: events },
    { count: upcomingCount },
    { count: openProposals },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .eq("type", "news")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase
      .from("posts")
      .select("id, slug, title, published_at, created_at")
      .eq("status", "published")
      .eq("type", "announcement")
      .order("published_at", { ascending: false })
      .limit(4),
    supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .gte("starts_at", nowIso)
      .order("starts_at")
      .limit(3),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .gte("starts_at", nowIso),
    supabase
      .from("proposals")
      .select("*", { count: "exact", head: true })
      .eq("status", "published")
      .eq("proposal_status", "open"),
  ]);

  const stats = [
    { value: String(upcomingCount ?? 0), label: "upcoming events" },
    { value: String(openProposals ?? 0), label: "proposals open for comment" },
    { value: "105", label: "barangays, one city" },
    { value: "24/7", label: "emergency hotlines" },
  ];

  return (
    <>
      {/* HERO — clean map-poster style: white canvas + faint street lines */}
      <section className="relative overflow-hidden bg-white">
        <StreetPattern opacity={0.5} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-sky/50 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 rounded-full bg-marigold/30 blur-3xl"
        />
        <div className="container-site relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            {/* Official partnership badge */}
            <div className="inline-flex flex-wrap items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 shadow-card">
              <span className="flex -space-x-1.5">
                <Image
                  src="/assets/batangas-seal.png"
                  alt="Official Seal of Batangas City"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border-2 border-white bg-white object-contain"
                />
                <Image
                  src="/assets/ub-logo.png"
                  alt="University of Batangas seal"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border-2 border-white bg-white object-contain"
                />
              </span>
              <span className="text-xs font-semibold leading-tight text-navy">
                City Government of Batangas
                <span className="block text-[10px] font-medium text-slate-500">
                  in partnership with the University of Batangas
                </span>
              </span>
            </div>

            <h1 className="display-heading mt-6 max-w-2xl text-4xl leading-tight text-navy sm:text-5xl lg:text-6xl">
              Your city, made{" "}
              <span className="relative inline-block text-orange">
                simple
                <svg
                  aria-hidden="true"
                  viewBox="0 0 120 12"
                  className="absolute -bottom-2 left-0 w-full text-marigold"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C30 3 60 2 118 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              for the youth
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Events, scholarships, services, and transparency — everything
              young Batangueños need from their local government, in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/youth" className="btn-primary px-7 py-3">
                Explore the Youth Hub <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="btn-outline px-7 py-3">
                Browse city services
              </Link>
            </div>

            {/* Live stats */}
            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col border-l-2 border-marigold pl-3"
                >
                  <dt className="order-2 text-xs font-medium text-slate-500">
                    {s.label}
                  </dt>
                  <dd className="order-1 font-display text-4xl font-semibold text-navy">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Brand pin with floating activity chips — decorative, desktop only */}
          <div className="relative hidden items-center justify-center lg:flex">
            <BrandMark
              className="animate-float h-80 w-80 drop-shadow-xl"
              title=""
            />
            <div aria-hidden="true">
              <div
                className="animate-float absolute -left-6 top-6 flex -rotate-3 items-center gap-2.5 rounded-xl bg-white px-4 py-3 shadow-lift"
                style={{ animationDelay: "-1.5s" }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-azure text-white">
                  <CalendarDays className="h-4 w-4" />
                </span>
                <span className="max-w-[180px]">
                  <span className="block truncate text-xs font-bold text-navy">
                    {events?.[0]?.title ?? "Youth Leaders Bootcamp"}
                  </span>
                  <span className="block text-[10px] font-medium text-slate-500">
                    {events?.[0]
                      ? formatDate(events[0].starts_at)
                      : "Happening soon"}
                  </span>
                </span>
              </div>
              <div
                className="animate-float absolute -right-2 top-1/3 flex rotate-2 items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lift"
                style={{ animationDelay: "-3s" }}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-4 w-4" />
                </span>
                <span className="text-xs font-bold text-navy">
                  You&apos;re registered!
                </span>
              </div>
              <div
                className="animate-float absolute -left-2 bottom-8 flex rotate-1 items-center gap-2.5 rounded-xl bg-navy px-4 py-3 text-white shadow-lift"
                style={{ animationDelay: "-4.5s" }}
              >
                <GraduationCap className="h-5 w-5 text-marigold" />
                <span className="text-xs font-bold">
                  Scholarship applications open
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="container-site relative pb-14">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((a) => (
              <li key={a.title}>
                <Link
                  href={a.href}
                  className="card group flex h-full items-start gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <span
                    className={`${a.color} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white`}
                  >
                    <a.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-navy group-hover:text-royal">
                      {a.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-500">
                      {a.desc}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* THE CITY BOARD — announcements as pinned bulletin notes */}
      <section className="bg-cream/70" aria-labelledby="whats-new">
        <div className="container-site py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionKicker>Latest from City Hall</SectionKicker>
              <SectionHeading>
                <span id="whats-new">The City Board</span>
              </SectionHeading>
            </div>
            <Link href="/news?type=announcement" className="btn-outline">
              All announcements <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* The board */}
          <div className="rounded-3xl border-2 border-dashed border-navy/15 bg-sand/50 p-5 sm:p-8">
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {(announcements ?? []).map((p, i) => {
                const tilt = ["-rotate-1", "rotate-1", "rotate-2", "-rotate-2"][i % 4];
                const paper = ["bg-white", "bg-sky/40", "bg-marigold/25", "bg-white"][i % 4];
                return (
                  <Link
                    key={p.id}
                    href={`/news/${p.slug}`}
                    className={`group relative flex flex-col rounded-xl p-5 pt-7 shadow-card transition-all duration-200 hover:rotate-0 hover:shadow-lift ${tilt} ${paper}`}
                  >
                    {/* push pin */}
                    <span
                      aria-hidden="true"
                      className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-brick shadow-md ring-2 ring-white/70"
                    >
                      <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                    </span>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange">
                      <Megaphone className="h-3.5 w-3.5" /> Advisory
                    </p>
                    <p className="mt-2 font-bold leading-snug text-navy group-hover:text-royal">
                      {p.title}
                    </p>
                    <p className="mt-auto pt-3 text-xs font-medium text-slate-500">
                      {formatDate(p.published_at ?? p.created_at)}
                    </p>
                  </Link>
                );
              })}

              {/* quick-links note */}
              <div className="group relative flex flex-col rounded-xl bg-navy p-5 pt-7 text-white shadow-card rotate-1 transition-all duration-200 hover:rotate-0 hover:shadow-lift">
                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-marigold shadow-md ring-2 ring-white/70"
                >
                  <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                </span>
                <p className="text-[11px] font-bold uppercase tracking-wider text-marigold">
                  Looking for something?
                </p>
                <div className="mt-3 flex flex-col gap-2.5">
                  <Link
                    href="/transparency/documents?category=Bids+%26+Projects"
                    className="inline-flex items-center gap-2 text-sm font-bold text-sky hover:text-white"
                  >
                    <FileText className="h-4 w-4" /> Bids &amp; Projects
                  </Link>
                  <Link
                    href="/transparency"
                    className="inline-flex items-center gap-2 text-sm font-bold text-sky hover:text-white"
                  >
                    <Scale className="h-4 w-4" /> Ordinances &amp; Issuances
                  </Link>
                  <Link
                    href="/transparency/documents?category=Forms"
                    className="inline-flex items-center gap-2 text-sm font-bold text-sky hover:text-white"
                  >
                    <FileText className="h-4 w-4" /> Downloadable Forms
                  </Link>
                </div>
              </div>

              {/* weather note */}
              <div className="relative -rotate-1 transition-all duration-200 hover:rotate-0">
                <span
                  aria-hidden="true"
                  className="absolute -top-2.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-azure shadow-md ring-2 ring-white/70"
                >
                  <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                </span>
                <WeatherWidget />
              </div>

              {(!announcements || announcements.length === 0) && (
                <p className="rounded-xl bg-white p-5 text-sm text-slate-500 shadow-card sm:col-span-2">
                  Nothing pinned yet — announcements from City Hall will show up
                  on this board.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="bg-white">
        <div className="container-site py-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionKicker>Youth Hub</SectionKicker>
              <SectionHeading>Find Your Thing</SectionHeading>
            </div>
            <Link href="/youth" className="btn-secondary">
              All events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Category chips */}
          <div className="mb-8 flex flex-wrap gap-2">
            {EVENT_CATEGORY_CHIPS.map((c) => (
              <Link
                key={c.label}
                href={`/youth?category=${encodeURIComponent(c.label)}`}
                className="tag gap-1.5 bg-cream px-4 py-2 text-sm text-navy transition-all hover:-translate-y-0.5 hover:bg-sand hover:shadow-card"
              >
                <c.icon className="h-4 w-4 text-orange" />
                {c.label}
              </Link>
            ))}
          </div>

          {events && events.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming events yet"
              hint="New youth activities are posted here as soon as they're scheduled."
            />
          )}
        </div>
      </section>

      {/* SHOWCASE — parallax band with a single call to action */}
      <section
        className="parallax relative"
        style={{ backgroundImage: `url(${SHOWCASE_IMAGE})` }}
        aria-labelledby="get-involved-heading"
      >
        <div className="absolute inset-0 bg-navy/75" />
        <div className="container-site relative flex min-h-[46vh] flex-col items-center justify-center py-20 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-marigold">
            Para sa kabataang Batangueño
          </p>
          <h2
            id="get-involved-heading"
            className="display-heading mt-3 max-w-2xl text-3xl sm:text-4xl"
          >
            Your voice belongs in city hall
          </h2>
          <p className="mt-4 max-w-xl text-sky">
            Proposed ordinances are open for public comment right now. Read
            them, react, and help shape the city you live in.
          </p>
          <Link href="/youth/get-involved" className="btn-primary mt-7 px-7 py-3">
            Comment on proposals <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* FEATURED NEWS */}
      <section className="bg-white">
        <div className="container-site py-16">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionKicker>Stories</SectionKicker>
              <SectionHeading>Featured City News</SectionHeading>
            </div>
            <Link href="/news" className="btn-outline">
              All news <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {news && news.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No news yet"
              hint="City news and feature stories will appear here."
            />
          )}
        </div>
      </section>

      <HotlinesStrip />
    </>
  );
}
