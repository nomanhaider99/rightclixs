"use client";

import { CountUp } from "@/components/site/count-up";
import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

/**
 * Row of animated proof stats. Numbers count up on scroll-into-view via the
 * shared CountUp (which already honours prefers-reduced-motion), wrapped in the
 * site-wide Reveal so the band enters like every other section.
 *
 * `tone="dark"` is for placing the band on the ink/gradient surfaces.
 */
export function StatBand({
  stats,
  tone = "light",
  className,
}: {
  stats: Stat[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <Reveal
      stagger={0.08}
      from="alternate"
      className={cn(
        "grid gap-px overflow-hidden rounded-3xl sm:grid-cols-3",
        dark ? "bg-white/10" : "bg-border",
        className,
      )}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className={cn("px-7 py-8 text-center sm:px-6", dark ? "bg-ink-surface" : "bg-neutral-soft")}
        >
          <p
            className={cn(
              "text-4xl font-semibold tracking-tight sm:text-5xl",
              dark ? "text-white" : "text-indigo",
            )}
          >
            <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
          </p>
          <p
            className={cn(
              "mx-auto mt-3 max-w-[18rem] text-sm leading-relaxed",
              dark ? "text-white/60" : "text-heading/60",
            )}
          >
            {s.label}
          </p>
        </div>
      ))}
    </Reveal>
  );
}
