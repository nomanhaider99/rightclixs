"use client";

import { useRef, type ReactNode } from "react";

import { SiteHeader } from "@/components/site/header";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/** Animated gradient header shared by the inner pages (Services, Pricing,
 *  Contact, and each service page). */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-ph]", { opacity: 1, y: 0 });
        return;
      }
      gsap.from("[data-ph]", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.05,
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div className="hero-gradient">
      <SiteHeader variant="onDark" />
      <div ref={ref} className="mx-auto max-w-7xl px-5 pt-10 pb-20">
        <p data-ph className="text-lavender">
          {eyebrow}
        </p>
        <h1
          data-ph
          className="mt-4 max-w-3xl text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.05] font-semibold text-white"
        >
          {title}
        </h1>
        {subtitle && (
          <p data-ph className="mt-5 max-w-xl text-white/70">
            {subtitle}
          </p>
        )}
        {children && (
          <div data-ph className="mt-8">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
