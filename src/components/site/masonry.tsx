"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import type { PortfolioItem } from "@/data/portfolio";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

type MasonryProps = {
  items: PortfolioItem[];
  onOpen: (item: PortfolioItem) => void;
};

/**
 * Variable-height masonry (CSS columns) of real project screenshots. Mounts
 * fresh per category (Radix TabsContent), so tiles animate in — staggered,
 * roughly top-left → bottom-right — on every tab switch.
 *
 * Tiles render inside a fixed aspect-ratio window with the image anchored to
 * the top, because the source captures are whole-page and run to 6749px tall.
 * The ratio comes from the data and reserves layout space up front, so the
 * masonry never reflows as images decode.
 */
export function Masonry({ items, onOpen }: MasonryProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const tiles = el.querySelectorAll("[data-tile]");
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(tiles, { opacity: 1, scale: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        tiles,
        { opacity: 0, scale: 0.96, y: 16 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          stagger: 0.05,
          overwrite: true,
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduced, items]);

  return (
    <div ref={gridRef} className="gap-5 sm:columns-2 lg:columns-3">
      {items.map((item) => (
        <button
          key={item.id}
          data-tile
          type="button"
          onClick={() => onOpen(item)}
          aria-label={`View ${item.title} — ${item.kind}`}
          className="group relative mb-5 block w-full overflow-hidden rounded-2xl border border-border bg-neutral-soft break-inside-avoid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo/50"
        >
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: item.aspect }}>
            <Image
              src={item.image}
              alt={`${item.title} — ${item.kind} designed by Rightclixs`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
            />
          </div>

          {/* caption: always visible on touch, hover-revealed from sm up */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent p-4 text-left opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-white">{item.title}</span>
              <span className="block truncate text-xs text-white/70">{item.kind}</span>
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm">
              <ArrowUpRight className="size-4" />
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
