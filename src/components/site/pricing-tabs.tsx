"use client";

import { useRef, useState } from "react";

import { CategoryTabs } from "@/components/site/category-tabs";
import { PricingGlowCard } from "@/components/site/pricing-glow-card";
import { pricing, type PkgCategory } from "@/data/pricing";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

function PricingGrid({ category }: { category: PkgCategory }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-card]");
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        return;
      }
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power2.out", stagger: 0.06, overwrite: true },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, category]);

  return (
    <>
      <p className="mx-auto max-w-2xl text-center text-heading/65">{category.blurb}</p>
      <div ref={ref} className="mt-8 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {category.packages.map((p) => (
          <PricingGlowCard key={p.name} pkg={p} />
        ))}
      </div>
    </>
  );
}

/** Shared pricing tabs + animated card grid. Pass `categoryIds` to limit the
 *  set (homepage), or omit to show every category (pricing page). */
export function PricingTabs({ categoryIds }: { categoryIds?: string[] }) {
  const categories: PkgCategory[] = categoryIds
    ? categoryIds
        .map((id) => pricing.find((c) => c.id === id))
        .filter((c): c is PkgCategory => Boolean(c))
    : pricing;

  const tabItems = categories.map((c) => ({ value: c.id, label: c.label }));
  const [active, setActive] = useState(categories[0]!.id);

  return (
    <CategoryTabs
      categories={tabItems}
      value={active}
      onValueChange={setActive}
      fadeFrom="from-background"
      renderPanel={(id) => {
        const cat = categories.find((c) => c.id === id);
        return cat ? <PricingGrid category={cat} /> : null;
      }}
    />
  );
}
