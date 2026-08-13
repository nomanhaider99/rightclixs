import { Sparkles } from "lucide-react";

import { Reveal } from "@/components/site/reveal";

const brands = ["Logoipsum", "logoipsum", "Logoipsum University", "logoipsum", "Logoipsum"];

export function BrandStrip() {
  return (
    <section className="bg-background px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-center text-sm text-heading/60">Trusted by fast-growing brands</p>
        </Reveal>
        <Reveal
          stagger={0.06}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-12 gap-y-6"
        >
          {brands.map((b, i) => (
            <span key={i} className="flex items-center gap-2 text-lg font-semibold text-heading/40">
              <Sparkles className="size-5 text-indigo/50" />
              {b}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
