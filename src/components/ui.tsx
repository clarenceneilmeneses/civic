import Link from "next/link";
import { cn } from "@/lib/utils";
import BrandMark from "./BrandMark";

export function SectionHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-display text-2xl font-bold tracking-tight text-navy sm:text-3xl",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionKicker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mb-2 text-[13px] font-semibold text-royal", className)}>
      {children}
    </p>
  );
}

// One neutral tag style everywhere; accents are opted into per-usage via
// className (e.g. "bg-marigold/50 text-navy" for highlights).
export function Tag({
  children,
  colorKey: _colorKey,
  className,
}: {
  children: React.ReactNode;
  colorKey?: string;
  className?: string;
}) {
  // Only apply the neutral surface when the caller doesn't bring its own —
  // cn() is plain clsx, so conflicting bg-* utilities would be unpredictable.
  const hasOwnSurface = /(^|\s)bg-/.test(className ?? "");
  return (
    <span
      className={cn("tag", !hasOwnSurface && "bg-navy/5 text-navy", className)}
    >
      {children}
    </span>
  );
}

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <BrandMark className="h-14 w-14 opacity-60" title="" />
      <p className="font-semibold text-navy">{title}</p>
      {hint && <p className="max-w-md text-sm text-slate-500">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message }: { message?: string }) {
  return (
    <div className="card border border-brick/20 bg-brick/5 px-6 py-10 text-center">
      <p className="font-semibold text-brick">Something went wrong</p>
      <p className="mt-1 text-sm text-slate-600">
        {message ?? "We couldn't load this content. Please refresh the page."}
      </p>
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  makeHref,
}: {
  page: number;
  pageCount: number;
  makeHref: (page: number) => string;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 && (
        <Link href={makeHref(page - 1)} className="btn-outline px-4 py-2">
          ← Previous
        </Link>
      )}
      <span className="px-3 text-sm font-medium text-slate-600">
        Page {page} of {pageCount}
      </span>
      {page < pageCount && (
        <Link href={makeHref(page + 1)} className="btn-outline px-4 py-2">
          Next →
        </Link>
      )}
    </nav>
  );
}

export function InitialsAvatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .replace(/^(Hon|Dr|Engr|Mr|Ms|Mrs|Atty)\.?\s+/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-royal font-display text-white",
        className
      )}
      aria-hidden="true"
    >
      {initials || "•"}
    </div>
  );
}
