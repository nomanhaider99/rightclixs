"use client";

import { useRef, type ReactNode } from "react";

import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/**
 * Where the element travels in from:
 * - `bottom`    — text default: rises from below.
 * - `left`/`right` — cards on a split layout slide in from that edge.
 * - `alternate` — with `stagger`, children come in from alternating sides
 *   (odd index from the right, even from the left) for grid card decks.
 */
export type RevealFrom = "bottom" | "left" | "right" | "alternate";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Distance (px) the element travels up as it fades in. */
  y?: number;
  /** Distance (px) the element travels sideways for the horizontal directions. */
  x?: number;
  /** Direction the element enters from. Defaults to `bottom`. */
  from?: RevealFrom;
  /** Delay before the reveal starts (s). */
  delay?: number;
  /** If set, animate direct children with this stagger (s) instead of the wrapper. */
  stagger?: number;
};

/** Horizontal travel is trimmed on phones so nothing swings in from far off-canvas. */
function travelX(x: number) {
  if (typeof window === "undefined") return x;
  return window.innerWidth < 640 ? Math.min(x, 34) : x;
}

/**
 * Shared scroll-into-view reveal used across all homepage sections.
 * GSAP + ScrollTrigger, fires once. Honors prefers-reduced-motion by
 * showing content instantly (opacity only, no movement).
 */
export function Reveal({
  children,
  className,
  y = 24,
  x = 72,
  from = "bottom",
  delay = 0,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets: Element[] =
      stagger != null ? Array.from(el.children) : [el];

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(targets, { opacity: 1, x: 0, y: 0 });
        return;
      }

      const dx = travelX(x);
      const fromX =
        from === "left"
          ? () => -dx
          : from === "right"
            ? () => dx
            : from === "alternate"
              ? (i: number) => (i % 2 === 0 ? -dx : dx)
              : () => 0;
      const horizontal = from !== "bottom";

      gsap.from(targets, {
        opacity: 0,
        x: fromX,
        y: horizontal ? 0 : y,
        duration: horizontal ? 0.75 : 0.6,
        ease: horizontal ? "power3.out" : "power2.out",
        delay,
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start: "top 82%", once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [reduced, y, x, from, delay, stagger]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
