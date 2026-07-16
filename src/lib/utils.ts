import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateRange(start: string, end: string | null): string {
  const s = new Date(start);
  if (!end) return formatDateTime(start);
  const e = new Date(end);
  const sameDay = s.toDateString() === e.toDateString();
  if (sameDay) {
    return `${s.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })} · ${s.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" })}–${e.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" })}`;
  }
  return `${s.toLocaleDateString("en-PH", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}`;
}

// "Today" / "Tomorrow" / "In n days" for events within a week, else null.
export function eventCountdown(startsAt: string): string | null {
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round(
    (startOfDay(new Date(startsAt)) - startOfDay(new Date())) / 86_400_000
  );
  if (days < 0 || days > 7) return null;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncate(text: string, length = 160): string {
  if (text.length <= length) return text;
  return text.slice(0, length).replace(/\s+\S*$/, "") + "…";
}

export const LEGISLATION_KIND_LABELS: Record<string, string> = {
  ordinance: "Ordinance",
  resolution: "Resolution",
  executive_order: "Executive Order",
  administrative_order: "Administrative Order",
  proclamation: "Proclamation",
};

export const EVENT_CATEGORIES = [
  "Sports",
  "Arts",
  "Leadership",
  "Volunteering",
  "Scholarships",
  "SK Programs",
] as const;

export const DOCUMENT_CATEGORIES = [
  "Annual Budget",
  "Bids & Projects",
  "Financial Reports",
  "Programs & Projects",
  "Annual Investment Plans",
  "Forms",
] as const;
