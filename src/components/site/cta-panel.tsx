"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";

/**
 * Mid-page CTA panel on the indigo gradient. Lighter than the closing CtaBand
 * so a page can carry both without the ending feeling repeated — this one
 * catches people who are convinced before they reach the bottom.
 */
export function CtaPanel({
  eyebrow = "Ready when you are",
  title,
  body,
  primaryLabel = "Book a free consultation",
  presetService,
  secondary,
}: {
  eyebrow?: string;
  title: ReactNode;
  body?: string;
  primaryLabel?: string;
  presetService?: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="px-5 py-4">
      <Reveal>
        <div className="hero-gradient mx-auto max-w-7xl overflow-hidden rounded-3xl px-8 py-14 text-white sm:px-14 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="text-lavender">{eyebrow}</p>
              <h2 className="mt-4 max-w-2xl text-3xl leading-[1.1] font-medium sm:text-4xl">
                {title}
              </h2>
              {body && <p className="mt-5 max-w-xl text-white/70">{body}</p>}
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <ContactCtaButton
                preset={presetService ? { service: presetService } : undefined}
                variant="onDark"
              >
                {primaryLabel}
              </ContactCtaButton>
              {secondary && (
                <Button asChild variant="outlineDark" size="pillLg">
                  <Link href={secondary.href}>
                    <span className="grid size-8 place-items-center rounded-full bg-white/10">
                      <ArrowRight className="size-4" />
                    </span>
                    {secondary.label}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
