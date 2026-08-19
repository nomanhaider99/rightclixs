"use client";

import { BadgeCheck, Clock, Headphones, ShieldCheck, type LucideIcon } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

type Guarantee = { icon: LucideIcon; title: string; desc: string };

/** Applies to every engagement, so it lives here rather than per-service. */
export const guarantees: Guarantee[] = [
  {
    icon: ShieldCheck,
    title: "100% money-back guarantee",
    desc: "If we don't deliver what was scoped, you don't pay for it. In writing, on every project.",
  },
  {
    icon: BadgeCheck,
    title: "You own everything",
    desc: "Designs, code and accounts transfer to you. No licences to keep renewing, nothing held back.",
  },
  {
    icon: Clock,
    title: "One business day replies",
    desc: "A named strategist answers you — not a ticket queue and not a chatbot.",
  },
  {
    icon: Headphones,
    title: "Dedicated team",
    desc: "The same designers and developers stay on your account from kickoff through launch.",
  },
];

/** Reassurance strip used near the closing CTA on the inner pages. */
export function TrustBand({ className }: { className?: string }) {
  return (
    <section className={cn("border-t border-border bg-background px-5 py-16 sm:py-20", className)}>
      <div className="mx-auto max-w-7xl">
        <Reveal
          stagger={0.07}
          from="alternate"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {guarantees.map((g) => (
            <div key={g.title} className="rounded-3xl bg-neutral-soft p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-lavender text-indigo">
                <g.icon className="size-5" />
              </span>
              <h3 className="mt-5 font-medium text-heading">{g.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-heading/60">{g.desc}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
