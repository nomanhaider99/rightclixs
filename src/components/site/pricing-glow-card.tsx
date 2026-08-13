"use client";

import { Check, ChevronDown } from "lucide-react";
import { useState, type CSSProperties, type MouseEvent } from "react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import type { Pkg } from "@/data/pricing";
import { cn } from "@/lib/utils";

const PREVIEW_COUNT = 7;

// Gradient-border glow that tracks the pointer. Masked to the 1.5px ring so
// only the border glows (GPU-friendly — no animated box-shadow blur).
const glowStyle: CSSProperties = {
  background:
    "radial-gradient(180px circle at var(--mx, 50%) var(--my, 50%), var(--indigo), transparent 65%)",
  padding: "1.5px",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  maskComposite: "exclude",
} as CSSProperties;

export function PricingGlowCard({ pkg }: { pkg: Pkg }) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = pkg.features.length > PREVIEW_COUNT;
  const shown = expanded ? pkg.features : pkg.features.slice(0, PREVIEW_COUNT);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      data-card
      onMouseMove={onMove}
      className="group relative h-full rounded-3xl"
    >
      {/* pointer-tracking glow border */}
      <div
        aria-hidden
        style={glowStyle}
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 group-hover:opacity-100",
          // desktop: hidden until hover; featured: persistent-subtle; touch: gentle always-on
          pkg.popular ? "opacity-50" : "opacity-0 [@media(hover:none)]:opacity-40",
        )}
      />

      <div
        className={cn(
          "relative flex h-full flex-col rounded-[inherit] border p-7",
          pkg.popular ? "border-indigo/40 bg-lavender" : "border-border bg-neutral-soft",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-heading">{pkg.name}</h3>
          {pkg.popular && (
            <span className="shrink-0 rounded-full bg-indigo px-3 py-1 text-xs font-medium text-white">
              Popular
            </span>
          )}
        </div>

        <div className="mt-5 flex items-end gap-2">
          <span className="text-4xl font-semibold tracking-tight text-indigo">{pkg.price}</span>
          {pkg.was && <span className="pb-1 text-sm text-heading/40 line-through">{pkg.was}</span>}
        </div>

        <div className="mt-6">
          <ContactCtaButton
            preset={{ packageName: pkg.name }}
            variant={pkg.popular ? "brand" : "soft"}
            size="pill"
            className="w-full justify-center"
          >
            Get Started
          </ContactCtaButton>
        </div>

        <ul className="mt-7 space-y-2.5 text-sm text-heading/75">
          {shown.map((f) => (
            <li key={f} className="flex gap-2.5">
              <Check className="mt-0.5 size-4 shrink-0 text-indigo" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo transition-colors hover:text-indigo/80"
          >
            {expanded ? "Show less" : `+${pkg.features.length - PREVIEW_COUNT} more`}
            <ChevronDown
              className={cn("size-4 transition-transform", expanded && "rotate-180")}
            />
          </button>
        )}

        {pkg.note && <p className="mt-6 text-xs font-medium text-cta">{pkg.note}</p>}
      </div>
    </div>
  );
}
