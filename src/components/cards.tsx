import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, Users } from "lucide-react";
import type { CityEvent, Post } from "@/lib/database.types";
import { formatDate, formatDateRange } from "@/lib/utils";
import { Tag } from "./ui";
import BrandMark from "./BrandMark";
import StreetPattern from "./StreetPattern";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link href={`/news/${post.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-sky/20">
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="relative flex h-full items-center justify-center">
              <StreetPattern opacity={0.4} />
              <BrandMark className="relative h-12 w-12" title="" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div className="flex items-center gap-2">
            <Tag colorKey={post.type}>
              {post.type === "announcement" ? "Announcement" : "News"}
            </Tag>
            {post.category && <Tag>{post.category}</Tag>}
          </div>
          <h3 className="font-bold leading-snug text-navy group-hover:text-royal">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
          )}
          <p className="mt-auto pt-2 text-xs font-medium text-slate-500">
            {formatDate(post.published_at ?? post.created_at)}
          </p>
        </div>
      </Link>
    </article>
  );
}

export function EventCard({ event }: { event: CityEvent }) {
  const d = new Date(event.starts_at);
  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lift">
      <Link href={`/youth/events/${event.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-sky/20">
          {event.cover_image ? (
            <Image
              src={event.cover_image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-navy/40">
              <CalendarDays className="h-10 w-10" />
            </div>
          )}
          <div className="absolute left-3 top-3 rounded-lg border border-navy/10 bg-white/95 px-3 py-1.5 text-center">
            <p className="text-xs font-semibold text-royal">
              {d.toLocaleDateString("en-PH", { month: "short" })}
            </p>
            <p className="-mt-0.5 font-display text-xl font-bold text-navy">
              {d.getDate()}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <div>
            <Tag colorKey={event.category}>{event.category}</Tag>
          </div>
          <h3 className="font-bold leading-snug text-navy group-hover:text-royal">
            {event.title}
          </h3>
          {event.summary && (
            <p className="line-clamp-2 text-sm text-slate-600">{event.summary}</p>
          )}
          <div className="mt-auto space-y-1 pt-2 text-xs font-medium text-slate-500">
            <p className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" />
              {formatDateRange(event.starts_at, event.ends_at)}
            </p>
            {event.venue && (
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {event.venue}
              </p>
            )}
            {event.capacity && (
              <p className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 shrink-0" /> {event.capacity} slots
              </p>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
