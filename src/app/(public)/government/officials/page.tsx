import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import { EmptyState, InitialsAvatar } from "@/components/ui";
import type { Official } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "City Officials",
  description: "Elected officials of the City Government of Batangas.",
};

function OfficialCard({ o }: { o: Official }) {
  return (
    <li className="card flex flex-col items-center p-6 text-center">
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
  );
}

export default async function OfficialsPage() {
  const supabase = createClient();
  const { data: officials, error } = await supabase
    .from("officials")
    .select("*")
    .order("sort_order");

  const groups = new Map<string, Official[]>();
  (officials ?? []).forEach((o) => {
    if (!groups.has(o.grouping)) groups.set(o.grouping, []);
    groups.get(o.grouping)!.push(o);
  });

  return (
    <>
      <PageHeader
        kicker="Government"
        title="City Officials"
        lede="The elected leadership of Batangas City."
      />
      <div className="container-site py-10">
      <div className="space-y-12">
        {error || groups.size === 0 ? (
          <EmptyState title="Officials directory coming soon" />
        ) : (
          Array.from(groups.entries()).map(([group, list]) => (
            <section key={group} aria-label={group}>
              <h2 className="border-b-2 border-marigold pb-2 font-display text-lg font-bold tracking-tight text-navy">
                {group}
              </h2>
              <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {list.map((o) => (
                  <OfficialCard key={o.id} o={o} />
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
      </div>
    </>
  );
}
