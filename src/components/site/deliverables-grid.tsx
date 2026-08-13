"use client";

import { useRef } from "react";

import { Reveal } from "@/components/site/reveal";
import type { ServiceDeliverable } from "@/data/services";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Numbered "what you actually get" cards. Each card lifts on hover via a GSAP
 * quickTo (cheap — one interpolator per card, reused across events) rather than
 * a CSS transition, to stay consistent with the site's other hover motion.
 */
export function DeliverablesGrid({ items }: { items: ServiceDeliverable[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || reduced) return;

    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-deliverable]", wrap).forEach((card) => {
        const yTo = gsap.quickTo(card, "y", { duration: 0.3, ease: "power2.out" });
        const enter = () => yTo(-6);
        const leave = () => yTo(0);
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
        card.addEventListener("focusin", enter);
        card.addEventListener("focusout", leave);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
          card.removeEventListener("focusin", enter);
          card.removeEventListener("focusout", leave);
        });
      });
    }, wrap);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [reduced, items]);

  return (
    <div ref={wrapRef}>
      <Reveal stagger={0.07} className="grid gap-5 sm:grid-cols-2">
        {items.map((d, i) => (
          <div
            key={d.title}
            data-deliverable
            className="group relative overflow-hidden rounded-3xl border border-border bg-neutral-soft p-7 will-change-transform"
          >
            <span
              aria-hidden
              className="absolute right-6 top-5 text-5xl font-semibold text-indigo/10 transition-colors duration-300 group-hover:text-indigo/20"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="relative text-lg font-medium text-heading">{d.title}</h3>
            <p className="relative mt-3 text-sm leading-relaxed text-heading/60">{d.desc}</p>
          </div>
        ))}
      </Reveal>
    </div>
  );
}
