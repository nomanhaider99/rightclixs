"use client";

import { RotateCcw } from "lucide-react";
import { useRef } from "react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { Reveal } from "@/components/site/reveal";
import { Em, SectionHeading } from "@/components/site/section";
import { processSteps } from "@/data/process";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathWrapRef = useRef<HTMLDivElement>(null);
  const lineHRef = useRef<HTMLDivElement>(null);
  const lineVWrapRef = useRef<HTMLDivElement>(null);
  const lineVRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = sectionRef.current;
    const wrap = pathWrapRef.current;
    if (!el || !wrap) return;

    // Position the mobile vertical line to span first→last icon centers.
    const layoutVerticalLine = () => {
      const vwrap = lineVWrapRef.current;
      if (!vwrap) return;
      const icons = gsap.utils.toArray<HTMLElement>("[data-icon]", wrap);
      if (icons.length < 2) return;
      const wrapTop = wrap.getBoundingClientRect().top;
      const a = icons[0]!.getBoundingClientRect();
      const b = icons[icons.length - 1]!.getBoundingClientRect();
      const topY = a.top + a.height / 2 - wrapTop;
      const botY = b.top + b.height / 2 - wrapTop;
      vwrap.style.top = `${topY}px`;
      vwrap.style.height = `${Math.max(0, botY - topY)}px`;
    };
    layoutVerticalLine();
    window.addEventListener("resize", layoutVerticalLine);

    const lis = gsap.utils.toArray<HTMLElement>("li[data-step]", wrap);
    const n = lis.length;
    const anims = lis.flatMap((li) => gsap.utils.toArray<HTMLElement>("[data-anim]", li));

    const ctx = gsap.context(() => {
      gsap.set(lineHRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(lineVRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(anims, { opacity: 0, y: 14 });
      gsap.set([dotRef.current, noteRef.current], { opacity: 0 });

      if (reduced) {
        gsap.set(lineHRef.current, { scaleX: 1 });
        gsap.set(lineVRef.current, { scaleY: 1 });
        gsap.set(anims, { opacity: 1, y: 0 });
        gsap.set(noteRef.current, { opacity: 1 });
        return;
      }

      // Scrubbed rather than fire-once, so the path draws forward on the way
      // down and retracts on the way up instead of staying stuck at complete.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom 60%",
          scrub: 0.5,
        },
        defaults: { ease: "power2.out" },
      });

      // The travelling dot rides the leading edge of the line, so it doubles as
      // a scroll-progress head that reverses with the user.
      gsap.set(dotRef.current, { left: "0%", opacity: 0 });
      tl.to(dotRef.current, { opacity: 1, duration: 0.1 }, 0);

      lis.forEach((li, i) => {
        const frac = n > 1 ? i / (n - 1) : 1;
        const label = `s${i}`;
        tl.add(label, i === 0 ? 0 : ">-0.05");
        tl.to(lineHRef.current, { scaleX: frac, duration: 0.2 }, label);
        tl.to(lineVRef.current, { scaleY: frac, duration: 0.2 }, label);
        // Dot sits exactly where the line currently ends.
        tl.to(dotRef.current, { left: `${frac * 100}%`, duration: 0.2 }, label);
        tl.to(
          gsap.utils.toArray<HTMLElement>("[data-anim]", li),
          { opacity: 1, y: 0, duration: 0.24, stagger: 0.05 },
          `${label}+=0.08`,
        );
      });

      // "This repeats" note lands once the path is fully drawn.
      tl.to(noteRef.current, { opacity: 1, duration: 0.25 }, ">-0.1");
    }, el);

    return () => {
      window.removeEventListener("resize", layoutVerticalLine);
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="bg-background px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Our Process"
            subtext="A proven five-stage cycle that turns your idea into a site that ships — and keeps improving."
          >
            How We Bring Your Project <Em>to Life</Em>
          </SectionHeading>
        </Reveal>

        <div className="mt-16">
          <div ref={pathWrapRef} className="relative">
            {/* Desktop horizontal path */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-7 left-[10%] right-[10%] hidden h-0.5 bg-indigo/20 lg:block"
            >
              <div ref={lineHRef} className="h-full w-full origin-left bg-indigo" />
              <span
                ref={dotRef}
                style={{ left: "0%" }}
                className="absolute -top-[3px] size-2 -translate-x-1/2 rounded-full bg-cta opacity-0 shadow-[0_0_0_4px_rgba(255,122,89,0.25)]"
              />
            </div>

            {/* Mobile vertical path (top/height set in effect) */}
            <div
              ref={lineVWrapRef}
              aria-hidden
              className="pointer-events-none absolute left-7 w-0.5 -translate-x-1/2 bg-indigo/20 lg:hidden"
            >
              <div ref={lineVRef} className="h-full w-full origin-top bg-indigo" />
            </div>

            <ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6">
              {processSteps.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.id} data-step className="relative flex gap-5 lg:block lg:text-center">
                    <div
                      data-anim
                      data-icon
                      className="relative z-10 grid size-14 shrink-0 place-items-center rounded-2xl bg-lavender text-indigo ring-4 ring-background lg:mx-auto"
                    >
                      <Icon className="size-6" />
                    </div>
                    <div className="min-w-0 lg:mt-5">
                      <span
                        data-anim
                        className="block text-xs font-semibold uppercase tracking-wide text-indigo"
                      >
                        Step {s.step}
                      </span>
                      <h3 data-anim className="mt-1 text-lg font-medium text-heading">
                        {s.name}
                      </h3>
                      <p
                        data-anim
                        className="mt-2 text-sm leading-relaxed text-heading/60 lg:mx-auto lg:max-w-[15rem]"
                      >
                        {s.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <p
            ref={noteRef}
            className="mt-12 flex items-center justify-center gap-2 text-sm text-heading/50"
          >
            <RotateCcw className="size-4 text-indigo" />
            An ongoing cycle — we keep iterating and growing with you after launch.
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <ContactCtaButton>Start the Process</ContactCtaButton>
        </div>
      </div>
    </section>
  );
}
