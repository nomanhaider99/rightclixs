import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Pkg } from "@/data/pricing";
import { cn } from "@/lib/utils";

export function PricingCard({ pkg }: { pkg: Pkg }) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl border p-7 transition-shadow",
        pkg.popular
          ? "border-indigo/40 bg-lavender shadow-[0_24px_60px_-30px_rgba(98,96,255,0.6)]"
          : "border-border bg-neutral-soft",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-heading">{pkg.name}</h3>
        {pkg.popular && (
          <span className="rounded-full bg-indigo px-3 py-1 text-xs font-medium text-white">
            Popular
          </span>
        )}
      </div>

      <div className="mt-5 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight text-indigo">{pkg.price}</span>
        {pkg.was && <span className="pb-1 text-sm line-through opacity-50">{pkg.was}</span>}
      </div>

      <Button asChild variant="brand" size="pill" className="mt-6 w-full justify-center">
        <Link href="/contact">Launch Instantly</Link>
      </Button>

      <ul className="mt-7 space-y-2.5 text-sm text-heading/75">
        {pkg.features.map((f) => (
          <li key={f} className="flex gap-2.5">
            <Check className="mt-0.5 size-4 shrink-0 text-indigo" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {pkg.note && <p className="mt-6 text-xs font-medium text-cta">{pkg.note}</p>}
    </div>
  );
}
