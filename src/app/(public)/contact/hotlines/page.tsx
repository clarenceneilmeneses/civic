import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PhoneCall } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui";
import type { Hotline } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Emergency Hotlines",
  description:
    "Emergency and city service hotline numbers for Batangas City — police, fire, medical, and disaster response.",
};

export default async function HotlinesPage() {
  const supabase = createClient();
  const { data: hotlines, error } = await supabase
    .from("hotlines")
    .select("*")
    .order("sort_order");

  const groups = new Map<string, Hotline[]>();
  (hotlines ?? []).forEach((h) => {
    if (!groups.has(h.category)) groups.set(h.category, []);
    groups.get(h.category)!.push(h);
  });

  return (
    <>
      <section className="bg-brick text-white">
        <div className="container-site py-14">
          <Link
            href="/contact"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Contact
          </Link>
          <h1 className="display-heading text-3xl sm:text-4xl">Emergency Hotlines</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/90">
            Save these numbers. In a life-threatening emergency, call{" "}
            <a href="tel:911" className="font-bold underline">911</a> first.
          </p>
        </div>
      </section>

      <div className="container-site py-12">
        {error || groups.size === 0 ? (
          <EmptyState title="Hotlines will be posted here" hint="In an emergency, call 911." />
        ) : (
          <div className="space-y-10">
            {Array.from(groups.entries()).map(([category, list]) => (
              <section key={category} aria-label={category}>
                <h2 className="display-heading border-b-2 border-brick pb-2 text-lg text-navy">
                  {category}
                </h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((h) => (
                    <li key={h.id} className="card p-5">
                      <p className="flex items-start gap-2 font-bold text-navy">
                        <PhoneCall className="mt-1 h-4 w-4 shrink-0 text-brick" />
                        {h.name}
                      </p>
                      <div className="mt-2 space-y-1">
                        {h.numbers.map((n) => (
                          <a
                            key={n}
                            href={`tel:${n.replace(/[^\d+]/g, "")}`}
                            className="block text-xl font-bold tracking-wide text-brick hover:underline"
                          >
                            {n}
                          </a>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
