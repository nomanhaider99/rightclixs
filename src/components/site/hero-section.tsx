"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bot, Check, Sparkles, Workflow } from "lucide-react";
import { useRef, type ComponentType } from "react";

import case1 from "@/assets/case-1.jpg";
import case2 from "@/assets/case-2.jpg";
import case3 from "@/assets/case-3.jpg";
import { SiteHeader } from "@/components/site/header";
import { Em } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

// three.js is ~150KB gzipped and touches `window` at module scope, so the scene
// is client-only and split into its own chunk: the hero copy paints first and
// the WebGL layer fades in over the CSS glow behind it.
const AiAgentScene = dynamic(
  () => import("@/components/site/ai-agent-scene").then((m) => m.AiAgentScene),
  { ssr: false },
);

function Chip({
  icon: Icon,
  label,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  className?: string;
}) {
  return (
    <div
      data-hv
      data-float
      className={cn(
        "glass-card absolute flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white shadow-lg",
        className,
      )}
    >
      <span className="grid size-6 place-items-center rounded-full bg-indigo text-white">
        <Icon className="size-3.5" />
      </span>
      {label}
    </div>
  );
}

function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    if (!root || !scene) return;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hv]", { opacity: 1, scale: 1 });
        return;
      }

      // Depth + continuous float per card/chip.
      const zByIndex = [30, 85, 70, 95];
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.set(el, { z: zByIndex[i] ?? 40 });
        gsap.to(el, {
          y: i % 2 ? -16 : 16,
          rotateX: i % 2 ? 5 : -5,
          rotateY: i % 2 ? -7 : 7,
          duration: 3 + i * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });

      // Slow drifting background blobs.
      gsap.to("[data-blob]", {
        scale: 1.15,
        x: 20,
        y: -16,
        duration: 6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 1.2,
      });

      // Entrance. Delayed past the chunk-load of the WebGL scene so the overlay
      // cards don't animate in against an empty canvas.
      gsap.from("[data-hv]", {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.35,
      });
    }, root);

    if (reduced) return () => ctx.revert();

    // Mouse parallax
    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(scene, { rotateY: px * 26, rotateX: -py * 26, duration: 0.5, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(scene, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power2.out" });
    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);

    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      ctx.revert();
    };
  }, [reduced]);

  return (
    // No intrinsic height: this is the flexible row of the 100svh hero, so it
    // absorbs whatever vertical space the copy and wordmark leave behind. The
    // scene inside is absolutely positioned, so it re-centres at any height.
    // Scaled down on phones, where that leftover space is ~170px and the
    // composition would otherwise overrun into the copy and the wordmark.
    <div
      ref={rootRef}
      className="relative h-full w-full [perspective:1400px] max-sm:scale-[0.82]"
    >
      <div data-blob className="pointer-events-none absolute -left-6 top-8 size-40 rounded-full bg-indigo/40 blur-3xl" />
      <div data-blob className="pointer-events-none absolute bottom-4 right-2 size-52 rounded-full bg-lavender/30 blur-3xl" />

      {/* Glass cards, layered over the section-wide WebGL background. They tilt
          with the cursor so they read as a nearer plane than the agent behind. */}
      <div
        ref={sceneRef}
        className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
      >
        {/* Positioned as a percentage of the scene box. On phones the 100svh hero
            leaves that box wide-and-short, which would collapse these onto the
            agent — so phones show the 3D scene alone. Tablets up get the lot. */}
        <div data-hv data-float className="absolute bottom-[6%] left-[1%] w-44 max-sm:hidden">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex -space-x-2">
              {[case1, case2, case3].map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  sizes="32px"
                  className="size-8 rounded-full border-2 border-white/40 object-cover"
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-white/75">Trusted by 100+ brands</p>
          </div>
        </div>

        {/* floating capability chips (kept minimal) */}
        <Chip icon={Bot} label="AI Agents" className="right-[2%] top-[6%] max-sm:hidden" />
        <Chip icon={Workflow} label="Automation" className="bottom-[14%] right-[6%] max-sm:hidden" />
        <Chip icon={Sparkles} label="LLM Apps" className="left-[1%] top-[26%] max-lg:hidden" />
      </div>
    </div>
  );
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const bigTextRef = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero]", { opacity: 1, y: 0 });
        return;
      }
      gsap.from("[data-hero]", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.1,
      });
      if (bigTextRef.current) {
        gsap.to(bigTextRef.current, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
      }
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    // Exactly one viewport tall, laid out as three flex rows: header, content,
    // wordmark. `svh` not `vh` so mobile browser chrome can't push the wordmark
    // off-screen. The `min-h-*` floors are an escape hatch — below them the hero
    // grows a little rather than crushing the visual into the copy.
    <section
      ref={heroRef}
      className="hero-gradient relative flex h-svh min-h-[780px] flex-col overflow-hidden lg:min-h-[720px]"
    >
      {/* Static CSS core behind the canvas: it holds the space while the three.js
          chunk loads, and is the whole visual if WebGL is unavailable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[62%] size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(98,96,255,0.45)_0%,rgba(98,96,255,0.1)_45%,transparent_70%)] lg:left-[71%] lg:top-1/2 lg:size-[30rem]"
      />

      {/* The agent + neural field, spanning the whole section as its background.
          It sits below every content layer, which is why each one below carries
          an explicit `relative z-10`. */}
      <AiAgentScene className="absolute inset-0 z-0" />

      {/* Legibility scrim. The neural mesh is bright enough to fight the copy for
          attention, so the side the copy lives on gets darkened — downward on
          phones, where the copy sits above the agent, and leftward from `lg`,
          where it sits beside it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(9,9,22,0.55)_0%,rgba(9,9,22,0.28)_30%,rgba(9,9,22,0)_55%)] lg:bg-[linear-gradient(97deg,rgba(9,9,22,0.45)_0%,rgba(9,9,22,0.16)_38%,rgba(9,9,22,0)_62%)]"
      />

      {/* Already carries its own z-30 docked / z-40 floating, so it needs no
          wrapper to clear the canvas. */}
      <SiteHeader variant="onDark" />

      {/* Copy row is content-sized; the visual row takes the remainder. */}
      <div className="relative z-10 mx-auto grid w-full max-w-7xl min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-8 px-5 pt-6 pb-4 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-1 lg:gap-12 lg:pt-8">
        <div className="flex flex-col justify-center">
          <h1
            data-hero
            className="max-w-2xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.03] font-semibold text-white"
          >
            Built For Serious
            <br />
            Business <Em>Growth</Em>
          </h1>
          <p data-hero className="mt-4 max-w-lg text-white/70 lg:mt-6">
            We craft custom web design and development solutions that elevate brands, boost
            business, and enhance lives. Prices begin at $149.
          </p>
          <div data-hero className="mt-6 flex flex-wrap gap-3 lg:mt-8">
            <Button asChild variant="onDark" size="pillLg">
              <Link href="/contact">
                <span className="grid size-8 place-items-center rounded-full bg-indigo text-white">
                  <ArrowRight className="size-4" />
                </span>
                Get started
              </Link>
            </Button>
            <Button asChild variant="outlineDark" size="pillLg">
              <Link href="/pricing">
                <span className="grid size-8 place-items-center rounded-full bg-white/10">
                  <ArrowUpRight className="size-4" />
                </span>
                See packages
              </Link>
            </Button>
          </div>

          <ul data-hero className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/65 lg:mt-9">
            {["Distinctive Digital Designs", "W3C-Validated Development", "Cost-Competitive Packages"].map(
              (f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 text-lavender" />
                  {f}
                </li>
              ),
            )}
          </ul>
        </div>

        <HeroVisual />
      </div>

      <p
        ref={bigTextRef}
        aria-hidden
        className="pointer-events-none relative z-10 w-full shrink-0 px-2 text-center text-[clamp(3.5rem,17vw,14rem)] leading-[0.85] font-extrabold tracking-tighter text-white select-none"
      >
        RIGHTCLIXS
      </p>
    </section>
  );
}
