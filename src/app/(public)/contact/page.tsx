import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark, Mail, MapPin, Phone, PhoneCall } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ContactForm from "@/components/ContactForm";
import PageHeader from "@/components/PageHeader";
import { SectionHeading, SectionKicker } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach the City Government of Batangas — office directory, contact form, and emergency hotlines.",
};

export default async function ContactPage() {
  const supabase = createClient();
  const { data: departments } = await supabase
    .from("departments")
    .select("name, location, phone, email")
    .order("sort_order");

  return (
    <>
      <PageHeader
        kicker="We're listening"
        title="Contact the City"
        tone="contact"
        lede="Messages go straight to the city's public assistance desk — expect a reply within 3 working days."
      />

      <section className="bg-white">
        <div className="container-site pt-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/contact/hotlines"
              className="card group flex items-center gap-4 border-brick/20 p-5 transition-shadow hover:shadow-lift"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brick text-white">
                <PhoneCall className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block font-bold text-brick">
                  Emergency Hotlines
                </span>
                <span className="text-sm text-slate-500">
                  Police, fire, medical &amp; disaster response
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-brick" />
            </Link>
            <div className="card flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky/30 text-royal">
                <Landmark className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-bold text-navy">City Hall</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-slate-500">
                  <MapPin className="h-3.5 w-3.5 shrink-0" /> Brgy. 10, Batangas City
                </p>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-slate-500">
                  <a href="tel:0437232311" className="inline-flex items-center gap-1.5 hover:text-royal">
                    <Phone className="h-3.5 w-3.5 shrink-0" /> (043) 723-2311
                  </a>
                  <a href="mailto:info@batangascity.gov.ph" className="inline-flex items-center gap-1.5 hover:text-royal">
                    <Mail className="h-3.5 w-3.5 shrink-0" /> info@batangascity.gov.ph
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM + DIRECTORY */}
      <section className="bg-white">
        <div className="container-site grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionKicker>Send a message</SectionKicker>
            <SectionHeading className="mb-6">How can we help?</SectionHeading>
            <ContactForm />
          </div>
          <div>
            <SectionKicker>Find an office</SectionKicker>
            <SectionHeading className="mb-6">Office Directory</SectionHeading>
            <ul className="card divide-y divide-slate-100 p-2">
              {(departments ?? []).map((d) => (
                <li key={d.name} className="p-4">
                  <p className="text-sm font-bold text-navy">{d.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {[d.location, d.phone, d.email].filter(Boolean).join(" · ")}
                  </p>
                </li>
              ))}
              {(!departments || departments.length === 0) && (
                <li className="p-4 text-sm text-slate-500">
                  Directory will be posted here.
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
