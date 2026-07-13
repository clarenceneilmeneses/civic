import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import { EventCard } from "@/components/cards";
import { EmptyState, InitialsAvatar } from "@/components/ui";

export const metadata: Metadata = {
  title: "SK Federation / Youth Council",
  description:
    "The Sangguniang Kabataan Federation of Batangas City — youth leaders, programs, and how to take part.",
};

export default async function SkPage() {
  const supabase = createClient();
  const [{ data: skOfficials }, { data: skEvents }] = await Promise.all([
    supabase
      .from("officials")
      .select("*")
      .eq("grouping", "SK Federation")
      .order("sort_order"),
    supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .eq("category", "SK Programs")
      .gte("starts_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString())
      .order("starts_at")
      .limit(3),
  ]);

  return (
    <>
      <PageHeader
        kicker="Sangguniang Kabataan"
        title="SK Federation / Youth Council"
        lede="The SK Federation unites the youth councils of all 105 barangays — planning and funding youth programs and representing young people in the Sangguniang Panlungsod."
      />

      <div className="container-site py-10">
        <h2 className="display-heading border-b-2 border-marigold pb-2 text-lg text-navy">
          Federation Leadership
        </h2>
        {skOfficials && skOfficials.length > 0 ? (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skOfficials.map((o) => (
              <li key={o.id} className="card flex flex-col items-center p-6 text-center">
                {o.photo_url ? (
                  <Image
                    src={o.photo_url}
                    alt={`Photo of ${o.name}`}
                    width={112}
                    height={112}
                    className="h-28 w-28 rounded-full object-cover"
                  />
                ) : (
                  <InitialsAvatar name={o.name} className="h-28 w-28 text-3xl" />
                )}
                <p className="mt-4 font-bold text-navy">{o.name}</p>
                <p className="mt-0.5 text-sm text-slate-600">{o.position}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5">
            <EmptyState title="SK leadership roster coming soon" />
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
          <h2 className="display-heading border-b-2 border-marigold pb-2 text-lg text-navy">
            SK Programs
          </h2>
          <Link href="/youth?category=SK%20Programs" className="btn-outline">
            All SK events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {skEvents && skEvents.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {skEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="mt-5">
            <EmptyState title="No upcoming SK programs" hint="New programs appear here once scheduled." />
          </div>
        )}

        <div className="card mt-12 border border-marigold/60 bg-gradient-to-br from-sand/50 to-white p-7">
          <h2 className="font-display text-xl uppercase tracking-wide text-navy">
            Want your org recognized?
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Accredited youth organizations can use the Youth Innovation Center
            for free and apply for city grants. Accreditation takes about 10
            working days.
          </p>
          <Link href="/services" className="btn-primary mt-4">
            See accreditation steps
          </Link>
        </div>
      </div>
    </>
  );
}
