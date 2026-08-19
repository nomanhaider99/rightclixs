import type { Metadata } from "next";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { CtaPanel } from "@/components/site/cta-panel";
import { FaqSection } from "@/components/site/faq-section";
import { SiteFooter } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { ProcessSection } from "@/components/site/process-section";
import { Reveal } from "@/components/site/reveal";
import { CtaBand, Em } from "@/components/site/section";
import { ServiceCard } from "@/components/site/service-card";
import { StatBand } from "@/components/site/stat-band";
import { TrustBand } from "@/components/site/trust-band";
import { agencyFaqs, agencyStats } from "@/data/agency";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Services — Web Design, Development, SEO & Branding | Rightclixs",
  description:
    "End-to-end digital services from Rightclixs: branding, web design, web portals, e-commerce, maintenance, mobile apps, SEO, social media marketing, ORM and video animation.",
  openGraph: {
    title: "Rightclixs Services — End-to-End Digital Delivery",
    description:
      "Branding, web design, portals, e-commerce, apps, SEO, social media, ORM and animation.",
  },
};

export default function ServicesPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Our Services"
        title={
          <>
            End-to-end digital design &amp; <Em>development.</Em>
          </>
        }
        subtitle="An award-winning team of strategists, designers and developers acting as your dedicated end-to-end partner."
      >
        <ContactCtaButton variant="onDark">Book a free consultation</ContactCtaButton>
      </PageHero>

      <section className="px-5">
        <div className="mx-auto -mt-12 max-w-7xl">
          <StatBand stats={agencyStats.slice(0, 3)} />
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="section-label">Everything under one roof</p>
              <h2 className="mt-3 text-3xl leading-[1.15] font-medium text-heading sm:text-4xl">
                Eleven services, one <Em>accountable team.</Em>
              </h2>
              <p className="mt-4 text-heading/60">
                Pick a single service or combine several — every one is delivered by the same
                in-house team, so nothing falls between two agencies.
              </p>
            </div>
          </Reveal>

          <Reveal
            stagger={0.05}
            from="alternate"
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </Reveal>
        </div>
      </section>

      <CtaPanel
        title={
          <>
            Not sure which service you <Em>actually need?</Em>
          </>
        }
        body="Tell us the problem rather than the solution. We'll tell you what would fix it — even when the answer is less work than you expected."
        primaryLabel="Talk to a strategist"
        secondary={{ label: "View pricing", href: "/pricing" }}
      />

      <div className="border-t border-border">
        <ProcessSection />
      </div>

      <TrustBand />

      <FaqSection
        faqs={agencyFaqs}
        eyebrow="FAQ"
        heading={
          <>
            Before you <Em>get in touch.</Em>
          </>
        }
        subtext="The things most people want to know before starting a conversation."
      />

      <CtaBand />
      <SiteFooter />
    </div>
  );
}
