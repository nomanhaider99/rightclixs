"use client";

import { useRef, type ReactNode } from "react";

import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Distance (px) the element travels up as it fades in. */
  y?: number;
  /** Delay before the reveal starts (s). */
  delay?: number;
  /** If set, animate direct children with this stagger (s) instead of the wrapper. */
  stagger?: number;
};

/**
 * Shared scroll-into-view reveal used across all homepage sections.
 * GSAP + ScrollTrigger, fires once. Honors prefers-reduced-motion by
 * showing content instantly (opacity only, no movement).
 */
export function Reveal({ children, className, y = 24, delay = 0, stagger }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets: Element[] =
      stagger != null ? Array.from(el.children) : [el];

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(targets, { opacity: 1, y: 0 });
        return;
      }
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.6,
        ease: "power2.out",
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, y, delay, stagger]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
