import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { FaqSection } from "@/components/site/faq-section";
import { SiteFooter } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { PricingTabs } from "@/components/site/pricing-tabs";
import { Reveal } from "@/components/site/reveal";
import { CtaBand, Em } from "@/components/site/section";
import { StatBand } from "@/components/site/stat-band";
import { TrustBand } from "@/components/site/trust-band";
import { Button } from "@/components/ui/button";
import { pricingFaqs } from "@/data/agency";

export const metadata: Metadata = {
  title: "Pricing & Packages — Rightclixs Web Design and Marketing",
  description:
    "Transparent Rightclixs packages for website design, e-commerce, web portals, maintenance, branding, video, SEO, social media and ORM. Starting at $79.",
  openGraph: {
    title: "Rightclixs Packages — Web, E-commerce, SEO & More",
    description: "Every Rightclixs package and price in one place, starting at $79.",
  },
};

const priceStats = [
  { value: 79, prefix: "$", label: "Entry price — real work, not a trial" },
  { value: 0, prefix: "$", label: "Setup fees, ever, on any package" },
  { value: 100, suffix: "%", label: "Money-back guarantee on scoped work" },
];

export default function PricingPage() {
  return (
    <div className="bg-background">
      <PageHero
        eyebrow="Our Packages"
        title={
          <>
            Cost-competitive packages for <Em>every stage of growth.</Em>
          </>
        }
        subtitle="No hidden fees. Every plan includes dedicated designers and developers, unlimited revisions where stated, and our money back guarantee."
      >
        <ContactCtaButton variant="onDark">Get a custom quote</ContactCtaButton>
      </PageHero>

      <section className="px-5">
        <div className="mx-auto -mt-12 max-w-7xl">
          <StatBand stats={priceStats} />
        </div>
      </section>

      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <PricingTabs />

          <Reveal className="mt-16">
            <div className="rounded-3xl bg-lavender p-8 sm:p-12">
              <h2 className="max-w-2xl text-2xl leading-tight font-medium text-heading sm:text-3xl">
                Need something custom? Let&apos;s build a package around <Em>your exact scope.</Em>
              </h2>
              <p className="mt-4 max-w-xl text-sm text-heading/70">
                Mobile apps, enterprise portals and multi-service combos are quoted individually — a
                consultation is 100% free with zero obligation.
              </p>
              <Button asChild variant="cta" size="pillLg" className="mt-7">
                <Link href="/contact">
                  <span className="grid size-8 place-items-center rounded-full bg-white/25">
                    <ArrowRight className="size-4" />
                  </span>
                  Get a quote
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <TrustBand />

      <FaqSection
        faqs={pricingFaqs}
        eyebrow="Pricing FAQ"
        heading={
          <>
            No surprises, <Em>in writing.</Em>
          </>
        }
        subtext="What you pay, when you pay it, and what happens if something changes."
      />

      <CtaBand />
      <SiteFooter />
    </div>
  );
}
