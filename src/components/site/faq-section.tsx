"use client";

import { HelpCircle } from "lucide-react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { Reveal } from "@/components/site/reveal";
import { Em, SectionHeading } from "@/components/site/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type Faq = { q: string; a: string };

/**
 * Objection-handling FAQ. Radix Accordion gives the disclosure semantics
 * (aria-expanded / aria-controls, arrow-key roving) for free; the open/close
 * height animation is the existing CSS keyframe pair, which sits out under
 * prefers-reduced-motion via the global media query in globals.css.
 *
 * The trailing "still have a question" card is deliberate — an FAQ is the last
 * place a hesitant visitor sits before leaving, so it gets a CTA.
 */
export function FaqSection({
  faqs,
  eyebrow = "FAQ",
  heading,
  subtext,
  presetService,
}: {
  faqs: Faq[];
  eyebrow?: string;
  heading?: React.ReactNode;
  subtext?: string;
  /** Pre-selects this service in the ContactDialog opened from the CTA. */
  presetService?: string;
}) {
  return (
    <section className="bg-background px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} subtext={subtext}>
            {heading ?? (
              <>
                Questions, <Em>answered honestly.</Em>
              </>
            )}
          </SectionHeading>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <Reveal from="left">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f) => (
                <AccordionItem
                  key={f.q}
                  value={f.q}
                  className="border-border border-b last:border-b-0"
                >
                  <AccordionTrigger className="py-5 text-left text-base font-medium text-heading hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="pr-6 pb-5 text-sm leading-relaxed text-heading/65">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal from="right">
            <div className="rounded-3xl border border-border bg-neutral-soft p-7">
              <span className="grid size-11 place-items-center rounded-xl bg-lavender text-indigo">
                <HelpCircle className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-medium text-heading">Still not sure?</h3>
              <p className="mt-2 text-sm leading-relaxed text-heading/60">
                Ask us anything — a 30-minute call ends with a written scope and a transparent
                quote. No pressure, no obligation.
              </p>
              <div className="mt-6">
                <ContactCtaButton
                  preset={presetService ? { service: presetService } : undefined}
                  size="pill"
                >
                  Ask a question
                </ContactCtaButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
