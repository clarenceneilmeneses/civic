import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  Building2,
  ChevronDown,
  Clock,
  Download,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import { EmptyState } from "@/components/ui";
import { slugify } from "@/lib/utils";
import type { Department, Service } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "City Services",
  description:
    "Directory of Batangas City government services with plain-language steps, fees, and downloadable forms.",
};

function shortDeptName(name: string) {
  return (
    name
      .replace(/City |Office|and Management|\(.*\)/g, "")
      .replace(/\s+/g, " ")
      .trim() || name
  );
}

export default async function ServicesPage() {
  const supabase = createClient();
  const [{ data: services, error }, { data: departments }] = await Promise.all([
    supabase.from("services").select("*").order("sort_order"),
    supabase.from("departments").select("*").order("sort_order"),
  ]);

  const byDept = new Map<string, { dept: Department | null; items: Service[] }>();
  (services ?? []).forEach((s) => {
    const dept = (departments ?? []).find((d) => d.id === s.department_id) ?? null;
    const key = dept?.id ?? "other";
    if (!byDept.has(key)) byDept.set(key, { dept, items: [] });
    byDept.get(key)!.items.push(s);
  });
  const groups = Array.from(byDept.values());

  return (
    <>
      <PageHeader
        kicker="How can we help?"
        title="City Services"
        lede="Tap a service to see the exact steps, fees, and forms — no run-around, no jargon."
      >
        {groups.length > 0 && (
          <nav
            className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0"
            aria-label="Jump to an office"
          >
            {groups.map(({ dept }) => {
              const name = dept?.name ?? "Other Services";
              return (
                <a
                  key={name}
                  href={`#${slugify(name)}`}
                  className="tag shrink-0 gap-1.5 bg-cream px-4 py-2 text-sm text-navy hover:bg-sand"
                >
                  <Building2 className="h-4 w-4 text-orange" />
                  {shortDeptName(name)}
                </a>
              );
            })}
          </nav>
        )}
      </PageHeader>

      <section className="bg-white">
        <div className="container-site py-10">
          {error ? (
            <EmptyState title="Couldn't load services" hint="Please refresh the page." />
          ) : groups.length === 0 ? (
            <EmptyState title="Services directory coming soon" />
          ) : (
            <div className="space-y-12">
              {groups.map(({ dept, items }) => {
                const name = dept?.name ?? "Other Services";
                return (
                  <section
                    key={dept?.id ?? "other"}
                    id={slugify(name)}
                    aria-label={name}
                    className="scroll-mt-24"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal text-white">
                        <Building2 className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="font-display text-lg uppercase tracking-wide text-navy">
                          {name}
                        </h2>
                        {dept?.location && (
                          <p className="text-xs text-slate-500">
                            {dept.location}
                            {dept.phone ? ` · ${dept.phone}` : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {items.map((s) => (
                        <details key={s.id} className="card group overflow-hidden">
                          <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-navy">{s.title}</h3>
                              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                                {s.fee && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Banknote className="h-3.5 w-3.5 text-orange" /> {s.fee}
                                  </span>
                                )}
                                {s.processing_time && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5 text-orange" /> {s.processing_time}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronDown className="h-5 w-5 shrink-0 text-azure transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                            {s.summary && (
                              <p className="text-sm text-slate-600">{s.summary}</p>
                            )}
                            {s.steps.length > 0 && (
                              <ol className="mt-4 space-y-2.5">
                                {s.steps.map((step, i) => (
                                  <li key={i} className="flex gap-3 text-sm text-slate-700">
                                    <span
                                      aria-hidden="true"
                                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-royal font-display text-xs font-semibold text-white"
                                    >
                                      {i + 1}
                                    </span>
                                    <span className="pt-0.5">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            )}
                            {s.form_url && (
                              <a
                                href={s.form_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline mt-4"
                              >
                                <Download className="h-4 w-4" /> Download the form
                              </a>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CLOSING BAND */}
      <section className="bg-cream/70">
        <div className="container-site flex flex-col items-center gap-4 py-14 text-center">
          <h2 className="display-heading text-2xl text-navy">
            Need a service that isn&apos;t listed?
          </h2>
          <p className="max-w-md text-slate-600">
            Message the public assistance desk and we&apos;ll route you to the
            right office.
          </p>
          <Link href="/contact" className="btn-secondary">
            Contact the city <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
