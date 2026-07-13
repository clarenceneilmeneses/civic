import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Facebook, Mail, MapPin, Phone } from "lucide-react";
import BrandMark from "./BrandMark";
import StreetPattern from "./StreetPattern";
import SubscribeForm from "./SubscribeForm";

const EXPLORE_LINKS = [
  { label: "Youth Hub", href: "/youth" },
  { label: "City Services", href: "/services" },
  { label: "Transparency", href: "/transparency" },
  { label: "News & Updates", href: "/news" },
  { label: "Get Involved", href: "/youth/get-involved" },
  { label: "Scholarships", href: "/youth/opportunities" },
];

const CITY_LINKS = [
  { label: "City Officials", href: "/government/officials" },
  { label: "Departments", href: "/government/departments" },
  { label: "SK / Youth Council", href: "/government/sk" },
  { label: "Contact Us", href: "/contact" },
  { label: "Emergency Hotlines", href: "/contact/hotlines" },
];

const GOVPH_LINKS = [
  { label: "Official Gazette", href: "https://www.gov.ph" },
  { label: "Freedom of Information", href: "https://www.foi.gov.ph" },
  { label: "Province of Batangas", href: "https://www.batangas.gov.ph" },
  { label: "DILG", href: "https://dilg.gov.ph" },
];

export default function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-navy text-sky">
      <StreetPattern opacity={0.07} />

      <div className="container-site relative py-14">
        {/* Top row: brand + subscribe */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <BrandMark className="h-14 w-14" />
              <div>
                <p className="display-heading text-lg leading-tight text-white">
                  Batangas Youth
                  <span className="block">Civic Hub</span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              The official youth e-civic hub of the City Government of Batangas
              — making local government easy to reach for every young
              Batangueño.
            </p>
            <div className="mt-5 flex gap-2.5">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="City Facebook page"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-marigold hover:text-navy"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@batangascity.gov.ph"
                aria-label="Email the city"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-marigold hover:text-navy"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="w-full max-w-md rounded-2xl bg-white/5 p-6">
            <h3 className="display-heading text-sm text-white">Stay Updated</h3>
            <p className="mb-4 mt-1 text-sm">
              Announcements, events, and opportunities — straight to your inbox.
            </p>
            <SubscribeForm />
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="display-heading mb-4 text-sm text-white">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {EXPLORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    className="transition-colors hover:text-marigold"
                    href={l.href}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="display-heading mb-4 text-sm text-white">The City</h3>
            <ul className="space-y-2.5 text-sm">
              {CITY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    className="transition-colors hover:text-marigold"
                    href={l.href}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="display-heading mb-4 text-sm text-white">GOVPH</h3>
            <ul className="space-y-2.5 text-sm">
              {GOVPH_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    className="inline-flex items-center gap-1 transition-colors hover:text-marigold"
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="display-heading mb-4 text-sm text-white">Visit Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-marigold" />
                City Hall Compound, Brgy. 10, Batangas City, 4200 Batangas
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-marigold" />
                <a href="tel:0437232311" className="hover:text-marigold">
                  (043) 723-2311
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-marigold" />
                <a
                  href="mailto:info@batangascity.gov.ph"
                  className="hover:text-marigold"
                >
                  info@batangascity.gov.ph
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Partnership strip */}
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl bg-white/5 p-5 text-center sm:flex-row sm:text-left">
          <span className="flex shrink-0 -space-x-2">
            <Image
              src="/assets/batangas-seal.png"
              alt="Official Seal of Batangas City"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-navy bg-white object-contain"
            />
            <Image
              src="/assets/ub-logo.png"
              alt="University of Batangas seal"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border-2 border-navy bg-white object-contain"
            />
          </span>
          <p className="text-xs leading-relaxed">
            An official initiative of the{" "}
            <span className="font-semibold text-white">
              City Government of Batangas
            </span>
            , developed in research partnership with the{" "}
            <span className="font-semibold text-white">
              University of Batangas
            </span>
            .
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-4 text-xs sm:flex-row">
          <p>
            © {new Date().getFullYear()} City Government of Batangas. All
            rights reserved.
          </p>
          <p>Batangas Youth Civic Hub · Republic of the Philippines</p>
        </div>
      </div>
    </footer>
  );
}
