import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = {
  title: "Departments",
  description: "Offices and departments of the City Government of Batangas.",
};

export default async function DepartmentsPage() {
  const supabase = createClient();
  const { data: departments, error } = await supabase
    .from("departments")
    .select("*")
    .order("sort_order");

  return (
    <>
      <PageHeader
        kicker="Government"
        title="City Departments"
        lede="The offices that keep the city running — and how to reach them."
      />
      <div className="container-site py-10">
      <div>
        {error || !departments || departments.length === 0 ? (
          <EmptyState title="Departments directory coming soon" />
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {departments.map((d) => (
              <li key={d.id} className="card p-6">
                <h2 className="text-lg font-bold text-navy">{d.name}</h2>
                {d.head_name && (
                  <p className="mt-0.5 text-sm font-semibold text-royal">
                    {d.head_name}
                  </p>
                )}
                {d.description && (
                  <p className="mt-2 text-sm text-slate-600">{d.description}</p>
                )}
                <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                  {d.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 shrink-0 text-royal" /> {d.location}
                    </p>
                  )}
                  {d.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 shrink-0 text-royal" />
                      <a href={`tel:${d.phone.replace(/[^\d+]/g, "")}`} className="hover:text-royal">
                        {d.phone}
                      </a>
                    </p>
                  )}
                  {d.email && (
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 shrink-0 text-royal" />
                      <a href={`mailto:${d.email}`} className="hover:text-royal">
                        {d.email}
                      </a>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </>
  );
}
