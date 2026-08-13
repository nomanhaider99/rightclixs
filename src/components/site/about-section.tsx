"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

import case2 from "@/assets/case-2.jpg";
import { CountUp } from "@/components/site/count-up";
import { Em, SectionHeading } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { services, type Service } from "@/data/services";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const FEATURED_SLUGS = ["web-design", "ecommerce", "seo", "branding"];
const featured: Service[] = FEATURED_SLUGS.map((slug) => services.find((s) => s.slug === slug)).filter(
  (s): s is Service => Boolean(s),
);

export function AboutSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-about-item]");
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(items, {
        opacity: 0,
        y: 28,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section className="bg-background px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="About Us"
            subtext="A full-service digital partner — strategy, design, development and growth, all under one roof."
          >
            Everything Your Brand Needs to <Em>Win Online</Em>
          </SectionHeading>
        </Reveal>

        <div ref={gridRef} className="mt-14 grid gap-5 lg:grid-cols-4">
          {/* Intro card */}
          <div
            data-about-item
            className="flex min-h-[16rem] flex-col justify-between rounded-3xl bg-[linear-gradient(150deg,#6260ff_0%,#8a89ff_45%,#e4e4ff_100%)] p-8 lg:col-span-2"
          >
            <p className="max-w-md text-xl leading-snug font-medium text-white sm:text-2xl">
              From first click to final launch, we design, build and grow digital products
              engineered to convert.
            </p>
            <div className="mt-6">
              <Button asChild variant="onDark" size="pill">
                <Link href="/services">
                  Explore all services
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats card */}
          <div
            data-about-item
            className="relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-3xl bg-ink p-8 lg:col-span-2"
          >
            <Image
              src={case2}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-30"
            />
            <div className="relative">
              <CountUp
                value={65}
                prefix="+"
                suffix="%"
                className="text-5xl font-semibold tracking-tight text-white"
              />
              <p className="mt-1 text-white/70">average client growth</p>
            </div>
            <div className="relative flex gap-8">
              <div>
                <CountUp value={100} suffix="+" className="text-2xl font-semibold text-white" />
                <p className="text-sm text-white/60">Brands served</p>
              </div>
              <div>
                <CountUp value={500} suffix="+" className="text-2xl font-semibold text-white" />
                <p className="text-sm text-white/60">Projects delivered</p>
              </div>
            </div>
          </div>

          {/* Service highlight cards */}
          {featured.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.slug}
                data-about-item
                href={`/services/${s.slug}`}
                className="group flex flex-col rounded-3xl border border-border bg-neutral-soft p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo/30 hover:bg-lavender hover:shadow-[0_24px_50px_-30px_rgba(98,96,255,0.6)]"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-white text-indigo transition-colors group-hover:bg-indigo group-hover:text-white">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-medium text-heading">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-heading/60">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo">
                  Learn more
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
