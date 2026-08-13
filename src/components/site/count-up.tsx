"use client";

import { useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/** Counts up to `value` when scrolled into view. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const write = (n: number) => {
      el.textContent = `${prefix}${Math.round(n)}${suffix}`;
    };
    if (reduced) {
      write(value);
      return;
    }
    const c = { v: 0 };
    write(0);
    const ctx = gsap.context(() => {
      gsap.to(c, {
        v: value,
        duration: 1.6,
        ease: "power2.out",
        onUpdate: () => write(c.v),
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, [value, prefix, suffix, reduced]);

  return <span ref={ref} className={className}>{`${prefix}${value}${suffix}`}</span>;
}
