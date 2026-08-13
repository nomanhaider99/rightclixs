"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef, useState } from "react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { OptionWheel } from "@/components/site/option-wheel";
import { Reveal } from "@/components/site/reveal";
import { Em, SectionHeading } from "@/components/site/section";
import { services } from "@/data/services";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const wheelItems = services.map((s) => ({ id: s.slug, label: s.name }));

export function ServicesSection() {
  const [active, setActive] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const svc = services[active]!;
  const Icon = svc.icon;

  // Animate the detail panel content in whenever the active service changes:
  // staggered icon → index → heading → description → CTA.
  useIsomorphicLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const targets = el.querySelectorAll("[data-panel-item]");
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        targets,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.32, ease: "power2.out", stagger: 0.05, overwrite: true },
      );
    }, el);
    return () => ctx.revert();
  }, [active, reduced]);

  return (
    <section className="bg-background px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Our Services"
            subtext="From first click to final launch — everything your brand needs online."
          >
            Check Out Services <Em>We Offer</Em>
          </SectionHeading>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left — Option Wheel */}
          <Reveal y={32}>
            <OptionWheel items={wheelItems} onChange={setActive} />
          </Reveal>

          {/* Right — active service detail */}
          <div
            ref={panelRef}
            aria-live="polite"
            className="lg:border-l lg:border-border lg:pl-12"
          >
            <span
              data-panel-item
              className="inline-grid size-14 place-items-center rounded-2xl bg-lavender text-indigo"
            >
              <Icon className="size-7" />
            </span>

            <p data-panel-item className="mt-6 text-sm text-heading/45">
              {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
            </p>

            <h3 data-panel-item className="mt-2 text-3xl font-medium text-heading sm:text-4xl">
              {svc.name}
            </h3>

            <p data-panel-item className="mt-4 max-w-lg leading-relaxed text-heading/65">
              {svc.description}
            </p>

            <div data-panel-item className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <ContactCtaButton preset={{ service: svc.name }}>Get started</ContactCtaButton>
              <Link
                href={`/services/${svc.slug}`}
                className="group inline-flex items-center gap-1 text-sm font-medium text-indigo transition-colors hover:text-indigo/80"
              >
                Learn more
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
