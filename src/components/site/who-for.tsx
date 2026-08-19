"use client";

import { Check, X } from "lucide-react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { Reveal } from "@/components/site/reveal";
import { Em } from "@/components/site/section";

/**
 * Self-qualifying "this is for you if…" block. Deliberately paired with an
 * honest "not the right fit" note — saying who you're *not* for reads as
 * confidence and filters out enquiries nobody wants to have.
 */
export function WhoFor({
  points,
  notFor,
  serviceName,
}: {
  points: string[];
  notFor?: string;
  serviceName: string;
}) {
  return (
    <section className="bg-neutral-soft px-5 py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <Reveal from="left">
          <div>
            <p className="section-label">Is this you?</p>
            <h2 className="mt-3 text-3xl leading-[1.15] font-medium text-heading sm:text-4xl">
              {serviceName} is a fit <Em>if…</Em>
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-heading/60">
              If more than one of these sounds familiar, a 30-minute call will tell you quickly
              whether we can help — and we&apos;ll say so if we can&apos;t.
            </p>
            <div className="mt-8">
              <ContactCtaButton preset={{ service: serviceName }}>
                Book a free consultation
              </ContactCtaButton>
            </div>
          </div>
        </Reveal>

        <Reveal from="right">
          <div>
            <ul className="space-y-4">
              {points.map((p) => (
                <li
                  key={p}
                  className="flex gap-4 rounded-2xl border border-border bg-background p-5"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-indigo text-white">
                    <Check className="size-3.5" />
                  </span>
                  <span className="leading-relaxed text-heading/80">{p}</span>
                </li>
              ))}
            </ul>

            {notFor && (
              <div className="mt-4 flex gap-4 rounded-2xl border border-dashed border-border p-5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-heading/10 text-heading/50">
                  <X className="size-3.5" />
                </span>
                <span className="text-sm leading-relaxed text-heading/55">{notFor}</span>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
