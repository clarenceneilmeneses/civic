import StreetPattern from "./StreetPattern";
import { SectionKicker } from "./ui";
import { cn } from "@/lib/utils";

// Compact page header. `tone` differentiates the main tabs while keeping the
// same structure — presentation only, no behavioral difference.
type Tone = "neutral" | "youth" | "transparency" | "services" | "contact";

const TONE_SECTION: Record<Tone, string> = {
  neutral: "border-b border-navy/10 bg-white",
  youth: "border-b border-navy/10 bg-sky/25",
  transparency: "border-t-2 border-t-navy border-b border-b-navy/10 bg-white",
  services: "border-b border-navy/10 bg-cream",
  contact: "border-t-2 border-t-brick border-b border-b-navy/10 bg-white",
};

const TONE_TITLE: Record<Tone, string> = {
  neutral: "font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl",
  // Playful, oversized display title
  youth:
    "font-display text-5xl font-extrabold tracking-tight text-navy sm:text-6xl",
  // Restrained, lighter weight
  transparency:
    "font-display text-4xl font-medium tracking-tight text-navy sm:text-5xl",
  services: "font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl",
  contact: "font-display text-4xl font-bold tracking-tight text-navy sm:text-5xl",
};

export default function PageHeader({
  kicker,
  title,
  lede,
  tone = "neutral",
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  tone?: Tone;
  children?: React.ReactNode;
}) {
  const showPattern = tone === "neutral" || tone === "youth" || tone === "services";
  return (
    <section className={cn("relative overflow-hidden", TONE_SECTION[tone])}>
      {showPattern && <StreetPattern opacity={0.35} />}
      <div className="container-site relative py-10 sm:py-12">
        <SectionKicker className={tone === "transparency" ? "text-navy" : undefined}>
          {kicker}
        </SectionKicker>
        <h1 className={TONE_TITLE[tone]}>{title}</h1>
        {lede && <p className="mt-3 max-w-2xl text-slate-600">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
