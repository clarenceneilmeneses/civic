import StreetPattern from "./StreetPattern";
import { SectionKicker } from "./ui";

// Compact, colorful page header: white map-poster canvas with soft color
// blobs — content starts almost immediately, no giant banner to scroll past.
export default function PageHeader({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-slate-100 bg-white">
      <StreetPattern opacity={0.4} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-marigold/40 blur-3xl"
      />
      <div className="container-site relative py-10 sm:py-12">
        <SectionKicker>{kicker}</SectionKicker>
        <h1 className="display-heading text-3xl text-navy sm:text-4xl">
          {title}
        </h1>
        {lede && <p className="mt-3 max-w-2xl text-slate-600">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
