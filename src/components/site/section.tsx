import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shared heading for the new homepage sections (Services, Portfolio, Process,
 * Pricing, Testimonials): eyebrow label above a headline, optional subtext.
 * Centered by default. Use <Em> inside the headline for the serif accent.
 */
export function SectionHeading({
  eyebrow,
  children,
  subtext,
  align = "center",
  className,
}: {
  eyebrow: string;
  children: ReactNode;
  subtext?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <p className="section-label">{eyebrow}</p>
      <h2 className="mt-3 text-3xl leading-[1.1] font-medium text-heading sm:text-4xl md:text-5xl">
        {children}
      </h2>
      {subtext && <p className="mt-4 text-base text-heading/60">{subtext}</p>}
    </div>
  );
}

export function SectionHead({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:gap-16">
      <p className="section-label">{label}</p>
      <h2 className="max-w-3xl text-3xl leading-[1.1] font-medium text-heading sm:text-4xl md:text-5xl">
        {children}
      </h2>
    </div>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return <span className="serif-accent">{children}</span>;
}

export function CtaBand() {
  return (
    <section className="bg-ink px-5 py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-3xl bg-[#18181f] p-8 sm:p-14 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="text-indigo">Book your free consultation</p>
            <h2 className="mt-5 max-w-2xl text-3xl leading-[1.1] font-medium sm:text-4xl md:text-5xl">
              Amplifying your vision, <Em>elevating your brand.</Em>
            </h2>
            <p className="mt-5 max-w-xl text-white/60">
              We solve your toughest branding challenges — from digital marketing to website
              development — with tailored solutions designed for your success. 100% free, zero
              obligation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button asChild variant="brand" size="pillLg">
              <Link href="/contact">
                <span className="grid size-8 place-items-center rounded-full bg-white/20">
                  <ArrowRight className="size-4" />
                </span>
                Launch Instantly
              </Link>
            </Button>
            <Button asChild variant="outlineDark" size="pillLg">
              <a href="tel:+18339455567">
                <span className="grid size-8 place-items-center rounded-full bg-white/10">
                  <ArrowUpRight className="size-4" />
                </span>
                Call Us
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
