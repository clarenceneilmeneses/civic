import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BatteryFull,
  CalendarDays,
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
  Wifi,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import StreetPattern from "@/components/StreetPattern";
import SectionMotif from "@/components/SectionMotif";
import { Reveal, Parallax } from "@/components/motion";
import WeatherWidget from "@/components/WeatherWidget";
import HotlinesStrip from "@/components/HotlinesStrip";
import { PostCard, EventCard } from "@/components/cards";
import { SectionHeading, SectionKicker, EmptyState } from "@/components/ui";
import { formatDate } from "@/lib/utils";

const QUICK_ACTIONS = [
  {
    title: "Find an Event",
    desc: "Youth activities & scholarships",
    href: "/youth",
    icon: CalendarDays,
  },
  {
    title: "Get a Form",
    desc: "Downloadable application forms",
    href: "/transparency/documents?category=Forms",
    icon: FileText,
  },
  {
    title: "Read Ordinances",
    desc: "City legislation & issuances",
    href: "/transparency",
    icon: Scale,
  },
  {
    title: "Emergency Hotlines",
    desc: "Police, fire, medical, disaster",
    href: "/contact/hotlines",
    icon: PhoneCall,
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

  const [{ data: news }, { data: announcements }, { data: events }] =
    await Promise.all([
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
  ]);

  return (
    <>
      {/* HERO — clean map-poster style: white canvas + faint street lines */}
      <section className="relative overflow-hidden bg-white">
        <StreetPattern opacity={0.35} />
        <div className="container-site relative grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            {/* Official partnership badge. Never wraps: the seals stay beside
                the text and the text wraps inside its own column, so the badge
                keeps one coherent shape. Squared off below sm — once the text
                needs a third line, rounded-full resolves to a ~46px radius that
                cuts into the copy. */}
            <div className="inline-flex items-center gap-3 rounded-2xl border border-navy/10 bg-white py-1.5 pl-1.5 pr-4 sm:rounded-full sm:pr-5">
              <span className="flex shrink-0 -space-x-1.5">
                <Image
                  src="/assets/batangas-seal.png"
                  alt="Official Seal of Batangas City"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border-2 border-white bg-white object-contain"
                />
                <Image
                  src="/assets/ub-logo.webp"
                  alt="University of Batangas seal"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border-2 border-white bg-white object-contain"
                />
              </span>
              <span className="min-w-0 text-xs font-semibold leading-tight text-navy">
                City Government of Batangas
                <span className="block text-xs font-medium text-slate-500">
                  in partnership with the University of Batangas
                </span>
              </span>
            </div>

            <h1 className="mt-6 max-w-2xl font-display font-bold tracking-tight text-navy">
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

          </div>

          {/* Device duo — live captures of the Youth Hub feed. Desktop only. */}
          <div className="relative hidden pb-10 pr-3 lg:block">
            {/* laptop */}
            <div className="relative">
              <div className="mx-[6%] rounded-[1rem] bg-gradient-to-b from-slate-700 to-slate-950 p-[2px] shadow-lift">
                <div className="relative rounded-[0.9rem] bg-slate-900 px-[5px] pb-[5px] pt-3">
                  {/* camera */}
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-[4px] h-1 w-1 -translate-x-1/2 rounded-full bg-slate-600 ring-1 ring-slate-700"
                  />
                  <div className="overflow-hidden rounded-md bg-white">
                    <Image
                      src="/assets/preview-laptop.png"
                      alt="Youth Hub event listings shown on a laptop"
                      width={1440}
                      height={900}
                      priority
                      className="block w-full"
                    />
                  </div>
                </div>
              </div>
              {/* aluminum deck */}
              <div className="relative h-[11px] rounded-b-[0.9rem] bg-gradient-to-b from-slate-100 via-slate-300 to-slate-400 shadow-md">
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-[5px] w-[13%] -translate-x-1/2 rounded-b-md bg-slate-400/80"
                />
              </div>
            </div>

            {/* iphone */}
            <div className="absolute -bottom-9 -right-2 z-10 w-[26%] min-w-[112px] rotate-2">
              <div className="rounded-[1.9rem] bg-gradient-to-b from-slate-700 to-slate-950 p-[2px] shadow-lift">
                <div className="rounded-[1.8rem] bg-slate-900 p-[3px]">
                  <div className="overflow-hidden rounded-[1.6rem] bg-white">
                    {/* status bar */}
                    <div className="relative flex items-center justify-between px-3 pb-0.5 pt-1.5 text-navy">
                      <span className="text-[8px] font-bold leading-none">
                        9:41
                      </span>
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-1.5 h-2.5 w-9 -translate-x-1/2 rounded-full bg-slate-900"
                      />
                      <span className="flex items-center gap-0.5">
                        <Wifi className="h-2 w-2" />
                        <BatteryFull className="h-2.5 w-2.5" />
                      </span>
                    </div>
                    <Image
                      src="/assets/preview-phone.png"
                      alt="Youth Hub event listings shown on a phone"
                      width={1082}
                      height={2202}
                      className="block w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="container-site relative pb-14">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_ACTIONS.map((a, i) => (
              <Reveal as="li" key={a.title} delay={i * 70}>
                <Link
                  href={a.href}
                  className="card group flex h-full items-start gap-4 p-5 transition-shadow hover:shadow-lift"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-white transition-colors group-hover:bg-orange">
                    <a.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-bold text-navy group-hover:text-royal">
                      {a.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-slate-600">
                      {a.desc}
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* THE CITY BOARD — announcements as pinned bulletin notes */}
      <section
        className="relative overflow-hidden bg-cream/70"
        aria-labelledby="whats-new"
      >
        <SectionMotif name="board" opacity={0.5} />
        <div className="container-site relative py-16">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionKicker>Latest from City Hall</SectionKicker>
              <SectionHeading>
                <span id="whats-new">The City Board</span>
              </SectionHeading>
            </div>
            <Link href="/news?type=announcement" className="btn-outline">
              All announcements <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* The board */}
          <div className="rounded-3xl border-2 border-dashed border-navy/15 bg-sand/50 p-5 sm:p-8">
            <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {(announcements ?? []).map((p, i) => {
                const tilt = ["-rotate-1", "rotate-1", "rotate-2", "-rotate-2"][i % 4];
                const paper = ["bg-white", "bg-sky/40", "bg-marigold/25", "bg-white"][i % 4];
                return (
                  // Reveal owns the rise; the note keeps its own tilt, so the
                  // two transforms never fight over one element.
                  <Reveal key={p.id} delay={i * 80}>
                    <Link
                      href={`/news/${p.slug}`}
                      className={`group relative flex h-full flex-col rounded-xl p-5 pt-7 shadow-card transition-all duration-200 hover:rotate-0 hover:shadow-lift ${tilt} ${paper}`}
                    >
                      {/* push pin */}
                      <span
                        aria-hidden="true"
                        className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-brick shadow-md ring-2 ring-white/70"
                      >
                        <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/60" />
                      </span>
                      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange">
                        <Megaphone className="h-3.5 w-3.5" /> Advisory
                      </p>
                      <p className="mt-2 font-bold leading-snug text-navy group-hover:text-royal">
                        {p.title}
                      </p>
                      <p className="mt-auto pt-3 text-xs font-medium text-slate-500">
                        {formatDate(p.published_at ?? p.created_at)}
                      </p>
                    </Link>
                  </Reveal>
                );
              })}

              {/* quick-links note */}
              <Reveal delay={(announcements?.length ?? 0) * 80}>
                <div className="group relative flex h-full flex-col rounded-xl bg-navy p-5 pt-7 text-white shadow-card rotate-1 transition-all duration-200 hover:rotate-0 hover:shadow-lift">
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-marigold shadow-md ring-2 ring-white/70"
                  >
                    <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wider text-marigold">
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
              </Reveal>

              {/* weather note */}
              <Reveal delay={((announcements?.length ?? 0) + 1) * 80}>
                <div className="relative -rotate-1 transition-all duration-200 hover:rotate-0">
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-azure shadow-md ring-2 ring-white/70"
                  >
                    <span className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full bg-white/70" />
                  </span>
                  <WeatherWidget />
                </div>
              </Reveal>

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
      <section
        id="find-your-thing"
        className="relative overflow-hidden bg-white"
      >
        <SectionMotif name="calendar" opacity={0.45} />
        <div className="container-site relative py-16">
          <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionKicker>Youth Hub</SectionKicker>
              <SectionHeading>Find Your Thing</SectionHeading>
            </div>
            <Link href="/youth" className="btn-secondary">
              All events <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* Category chips */}
          <Reveal className="mb-8 flex flex-wrap gap-2" delay={80}>
            {EVENT_CATEGORY_CHIPS.map((c) => (
              <Link
                key={c.label}
                href={`/youth?category=${encodeURIComponent(c.label)}`}
                className="tag gap-1.5 border border-navy/10 bg-white px-4 py-2 text-sm text-navy transition-colors hover:border-orange"
              >
                <c.icon className="h-4 w-4 text-royal" />
                {c.label}
              </Link>
            ))}
          </Reveal>

          {events && events.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e, i) => (
                <Reveal key={e.id} className="h-full" delay={i * 90}>
                  <EventCard event={e} />
                </Reveal>
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

      {/* SHOWCASE — real Batangas photography under a navy duotone.
          The photo drifts against the scroll while the copy holds nearly still,
          which pushes the city back behind the message. The image layer is
          overscanned by 12% top and bottom (~70px on a 46vh section) so the
          ±56px drift never exposes an edge. */}
      <section
        className="relative overflow-hidden bg-navy"
        aria-labelledby="get-involved-heading"
      >
        <Parallax
          amount={56}
          className="pointer-events-none absolute inset-x-0 -top-[12%] h-[124%]"
        >
          <Image
            src="/assets/showcase-batangas.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-navy/60 mix-blend-multiply"
        />
        {/* scrim — guarantees the white copy stays readable over the sky */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/40 to-transparent"
        />
        <div className="container-site relative flex min-h-[46vh] flex-col items-start justify-center py-20">
          {/* Counter-drift: a small lift the other way sells the depth without
              detaching the copy from the section. */}
          <Parallax amount={-14}>
            <Reveal>
              <p className="text-[13px] font-semibold text-marigold">
                Para sa kabataang Batangueño
              </p>
              <h2
                id="get-involved-heading"
                className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Your voice belongs in city hall
              </h2>
              <p className="mt-4 max-w-xl text-sky">
                Proposed ordinances are open for public comment right now. Read
                them, react, and help shape the city you live in.
              </p>
              <Link
                href="/youth/get-involved"
                className="btn-primary mt-7 px-7 py-3"
              >
                Comment on proposals <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </Parallax>
        </div>
      </section>

      {/* FEATURED NEWS */}
      <section className="relative overflow-hidden bg-white">
        <SectionMotif name="news" opacity={0.7} />
        <div className="container-site relative py-16">
          <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionKicker>Stories</SectionKicker>
              <SectionHeading>Featured City News</SectionHeading>
            </div>
            <Link href="/news" className="btn-outline">
              All news <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
          {news && news.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((p, i) => (
                <Reveal key={p.id} className="h-full" delay={i * 90}>
                  <PostCard post={p} />
                </Reveal>
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
