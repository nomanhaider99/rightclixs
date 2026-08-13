"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PricingTabs } from "@/components/site/pricing-tabs";
import { Reveal } from "@/components/site/reveal";
import { Em, SectionHeading } from "@/components/site/section";
import { Button } from "@/components/ui/button";

// Homepage shows a trimmed set; the rest live on /pricing.
const HOMEPAGE_CATEGORY_IDS = ["web-design", "ecommerce", "seo", "branding", "smm"];

export function PricingSection() {
  return (
    <section className="border-t border-border bg-background px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            subtext="Transparent packages for every stage of growth — no hidden fees, and a money-back guarantee."
          >
            Pricing That Fits Your <Em>Project</Em>
          </SectionHeading>
        </Reveal>

        <div className="mt-14">
          <PricingTabs categoryIds={HOMEPAGE_CATEGORY_IDS} />
        </div>

        <div className="mt-14 flex justify-center">
          <Button asChild variant="soft" size="pillLg">
            <Link href="/pricing">
              <span className="grid size-8 place-items-center rounded-full bg-white/60">
                <ArrowRight className="size-4" />
              </span>
              View All Pricing
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
