"use client";

import Image from "next/image";
import { useState } from "react";

import { CategoryTabs } from "@/components/site/category-tabs";
import { ContactCtaButton } from "@/components/site/contact-dialog";
import { Masonry } from "@/components/site/masonry";
import { Reveal } from "@/components/site/reveal";
import { Em, SectionHeading } from "@/components/site/section";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { itemsByCategory, portfolioCategories, type PortfolioItem } from "@/data/portfolio";

const tabItems = portfolioCategories.map((c) => ({ value: c.slug, label: c.label }));

export function PortfolioSection() {
  const [active, setActive] = useState(portfolioCategories[0]!.slug);
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  return (
    <section className="bg-neutral-soft px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Our Work"
            subtext="Websites and apps we've designed, built and shipped — click any project to view the full page design."
          >
            See the Work Behind the <Em>Results</Em>
          </SectionHeading>
        </Reveal>

        <div className="mt-14">
          <CategoryTabs
            categories={tabItems}
            value={active}
            onValueChange={setActive}
            renderPanel={(slug) => (
              <Masonry items={itemsByCategory(slug)} onOpen={setLightbox} />
            )}
          />
        </div>

        <div className="mt-14 flex justify-center">
          <ContactCtaButton>Start Your Project</ContactCtaButton>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightbox !== null} onOpenChange={(open) => !open && setLightbox(null)}>
        <DialogContent className="max-w-4xl gap-0 overflow-hidden p-0">
          {lightbox && (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>{lightbox.title}</DialogTitle>
                <DialogDescription>{lightbox.kind} — full page preview</DialogDescription>
              </DialogHeader>

              {/* Full-page captures: scroll the whole design rather than
                  squashing a 6749px-tall screenshot into the viewport. */}
              <div className="max-h-[70vh] overflow-y-auto bg-ink">
                <Image
                  src={lightbox.image}
                  alt={`${lightbox.title} — full page design by Rightclixs`}
                  width={lightbox.width}
                  height={lightbox.height}
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="h-auto w-full"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
                <div className="min-w-0">
                  <p className="font-medium text-heading">{lightbox.title}</p>
                  <p className="text-sm text-heading/55">
                    {lightbox.kind} · scroll to see the full page
                  </p>
                </div>
                <ContactCtaButton size="pill" preset={{ service: "Custom Website Design" }}>
                  Get a site like this
                </ContactCtaButton>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
