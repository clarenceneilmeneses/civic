import Link from "next/link";
import { ArrowRight, BellRing, Phone, PhoneCall } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SignalRings } from "./SectionMotif";
import { Reveal, Parallax } from "./motion";

export default async function HotlinesStrip() {
  const supabase = createClient();
  const { data: hotlines } = await supabase
    .from("hotlines")
    .select("*")
    .eq("category", "Emergency")
    .order("sort_order")
    .limit(7);

  const nineOneOne =
    (hotlines ?? []).find((h) => h.numbers.includes("911")) ?? null;
  const others = (hotlines ?? []).filter((h) => h.id !== nineOneOne?.id).slice(0, 4);

  return (
    <section
      aria-labelledby="hotlines-heading"
      className="relative overflow-hidden bg-navy text-white"
    >
      {/* The rings drift slowly behind the cards — the call going out. */}
      <Parallax amount={28} className="pointer-events-none absolute inset-0">
        <SignalRings className="-left-40 top-1/2 h-[760px] w-[760px] -translate-y-1/2 text-sky/50" />
      </Parallax>

      <div className="container-site relative py-16">
        <Reveal className="flex flex-col items-start gap-2">
          <p className="inline-flex items-center gap-2 text-[13px] font-semibold text-marigold">
            <BellRing className="h-4 w-4" /> Keep these close
          </p>
          <h2
            id="hotlines-heading"
            className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            In an emergency, seconds matter
          </h2>
          <p className="max-w-xl text-sky">
            Save these numbers to your phone <em>now</em> — future you will be
            glad you did.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          {/* 911 mega card */}
          <Reveal className="h-full">
            <a
              href="tel:911"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-brick p-7 transition-shadow hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="animate-pulse-ring flex h-14 w-14 items-center justify-center rounded-full bg-white/15">
                  <PhoneCall className="h-7 w-7" />
                </span>
                <span className="tag bg-white/15 text-white">
                  24/7 nationwide
                </span>
              </div>
              <div className="mt-8">
                <p className="font-display text-7xl font-extrabold leading-none tracking-tight sm:text-8xl">
                  911
                </p>
                <p className="mt-2 text-sm font-semibold text-white/85">
                  {nineOneOne?.name ?? "National Emergency Hotline"} — tap to
                  call
                </p>
              </div>
            </a>
          </Reveal>

          {/* Other emergency lines — strict 2x2 grid, equal-height cards */}
          <div className="flex flex-col gap-4">
            <div className="grid flex-1 gap-4 sm:grid-cols-2 sm:auto-rows-fr">
              {others.map((h, i) => (
                <Reveal key={h.id} className="h-full" delay={100 + i * 80}>
                  <div className="flex h-full flex-col rounded-2xl bg-white/[0.07] p-5 transition-colors hover:bg-white/[0.12]">
                    <p className="text-sm font-bold">{h.name}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-3">
                      {h.numbers.map((n) => (
                        <a
                          key={n}
                          href={`tel:${n.replace(/[^\d+]/g, "")}`}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-bold tracking-wide text-marigold transition-colors hover:bg-marigold hover:text-navy"
                        >
                          <Phone className="h-3.5 w-3.5" /> {n}
                        </a>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
              {others.length === 0 && (
                <p className="rounded-2xl bg-white/[0.07] p-5 text-sm text-sky sm:col-span-2">
                  City hotline numbers will be posted here.
                </p>
              )}
            </div>
            <Reveal delay={100 + others.length * 80}>
              <Link
                href="/contact/hotlines"
                className="group flex items-center justify-between rounded-2xl border border-white/15 p-5 text-sm font-bold transition-colors hover:bg-white/[0.07]"
              >
                Health &amp; city service hotlines
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
