import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import RsvpButton from "@/components/RsvpButton";
import { Tag } from "@/components/ui";
import { formatDateRange, stripHtml, truncate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = createClient();
  const { data: event } = await supabase
    .from("events")
    .select("title, summary, cover_image")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: event.summary ?? undefined,
    openGraph: event.cover_image ? { images: [event.cover_image] } : undefined,
  };
}

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!event) notFound();

  const isPast = new Date(event.starts_at) < new Date(Date.now() - 24 * 3600 * 1000);

  return (
    <article className="container-site max-w-4xl py-12">
      <Link
        href="/youth"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-azure hover:text-royal"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Youth Hub
      </Link>

      {event.cover_image && (
        <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-sky/30">
          <Image
            src={event.cover_image}
            alt=""
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <Tag colorKey={event.category}>{event.category}</Tag>
        {isPast && <Tag className="bg-slate-200 text-slate-600">Past event</Tag>}
      </div>
      <h1 className="mt-3 font-display text-3xl font-semibold uppercase leading-tight tracking-wide text-navy sm:text-4xl">
        {event.title}
      </h1>
      {event.summary && (
        <p className="mt-3 text-lg text-slate-600">{event.summary}</p>
      )}

      <div className="card mt-6 grid gap-4 border border-sky/50 p-5 sm:grid-cols-2">
        <p className="flex items-start gap-2.5 text-sm">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
          <span>
            <span className="block font-bold text-navy">When</span>
            {formatDateRange(event.starts_at, event.ends_at)}
          </span>
        </p>
        {event.venue && (
          <p className="flex items-start gap-2.5 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
            <span>
              <span className="block font-bold text-navy">Where</span>
              {event.venue}
            </span>
          </p>
        )}
        {event.organizer && (
          <p className="flex items-start gap-2.5 text-sm">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
            <span>
              <span className="block font-bold text-navy">Organizer</span>
              {event.organizer}
            </span>
          </p>
        )}
        {event.capacity && (
          <p className="flex items-start gap-2.5 text-sm">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-royal" />
            <span>
              <span className="block font-bold text-navy">Capacity</span>
              {event.capacity} participants
            </span>
          </p>
        )}
      </div>

      <div className="mt-6">
        <RsvpButton
          eventId={event.id}
          registrationOpen={event.registration_open && !isPast}
        />
        <p className="mt-2 text-xs text-slate-500">
          RSVPs need a free account — signing up takes under a minute.
        </p>
      </div>

      {event.body && (
        <div
          className="prose-civic mt-8"
          dangerouslySetInnerHTML={{ __html: event.body }}
        />
      )}
    </article>
  );
}
