import Image from "next/image";
import Link from "next/link";
import { Facebook, Linkedin, Mail, MapPin, Phone } from "lucide-react";

const services = [
  "Branding",
  "Web Design",
  "Web Portal",
  "E-commerce",
  "Web Maintenance",
  "Mobile App Development",
  "Search Engine Optimization",
  "Social Media Marketing",
  "ORM",
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-md">
            {/* Full lockup — the wordmark is white, so it only reads on the
                ink surface. See the header for the light-background variant. */}
            <Link href="/" aria-label="Rightclixs — home">
              <Image
                src="/logo-full.png"
                alt="Rightclixs — design, development, marketing"
                width={1518}
                height={467}
                priority={false}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              We are the perfect partner of digital businesses, facilitating web development &amp;
              design, branding, animation, web hosting &amp; maintenance services.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://www.facebook.com/rightclixs/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors hover:bg-indigo"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/rightclixs-llc"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid size-10 place-items-center rounded-full border border-white/15 transition-colors hover:bg-indigo"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90">Our Services</h3>
            <ul className="mt-5 space-y-2.5 text-sm text-white/60">
              {services.map((s) => (
                <li key={s}>
                  <Link href="/services" className="transition-colors hover:text-lavender">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/90">Contact Info</h3>
            <ul className="mt-5 space-y-4 text-sm text-white/60">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-indigo" />
                <a href="tel:+18339455567" className="hover:text-lavender">
                  +1 (833) 945-5567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-indigo" />
                <a href="mailto:support@rightclixs.com" className="hover:text-lavender">
                  support@rightclixs.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-indigo" />
                <span>539 W Commerce St #5348, Dallas, TX 75208, United States</span>
              </li>
            </ul>
            <div className="mt-6 flex flex-col gap-2 text-sm text-white/60">
              <Link href="/pricing" className="hover:text-lavender">
                Pricing
              </Link>
              <Link href="/contact" className="hover:text-lavender">
                Request a Quote
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-xs text-white/40">
          Rightclixs {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
