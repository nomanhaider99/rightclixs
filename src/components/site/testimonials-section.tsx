"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import {
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { ContactCtaButton } from "@/components/site/contact-dialog";
import { Reveal } from "@/components/site/reveal";
import { Em, SectionHeading } from "@/components/site/section";
import { initials, testimonials, type Testimonial } from "@/data/testimonials";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-3xl border border-border bg-background p-7 shadow-[0_24px_60px_-40px_rgba(38,37,77,0.4)]">
      <Quote className="size-8 shrink-0 text-indigo/30" />
      <blockquote className="mt-4 flex-1 leading-relaxed text-heading/80">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-lavender text-sm font-semibold text-indigo">
          {initials(t.name)}
        </span>
        <div>
          <p className="font-medium text-indigo">{t.name}</p>
          {t.role && <p className="text-xs text-heading/55">{t.role}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

const N = testimonials.length;
const SPACING = 320;
const DEPTH = 160;
const TILT = 34;

/** Curved 3D coverflow (desktop). GSAP-driven — no WebGL. Drag, auto-drift,
 *  keyboard, and off-screen pause; loops infinitely via wrapped offsets. */
function CurvedGallery() {
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const drag = useRef({ active: false, startX: 0, startPos: 0, moved: false });
  const paused = useRef({ hover: false, visible: true, dragging: false });
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  const wrapD = (raw: number) => {
    let d = ((raw % N) + N) % N;
    if (d > N / 2) d -= N;
    return d;
  };

  const apply = (pos: number) => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = wrapD(i - pos);
      const ad = Math.abs(d);
      el.style.transform = `translate(-50%, -50%) translateX(${d * SPACING}px) translateZ(${-ad * DEPTH}px) rotateY(${-d * TILT}deg) scale(${Math.max(0.72, 1 - ad * 0.12)})`;
      el.style.opacity = String(Math.max(0.12, 1 - ad * 0.4));
      el.style.zIndex = String(100 - Math.round(ad * 10));
      el.style.pointerEvents = ad < 0.5 ? "auto" : "none";
    });
  };

  const activeIndex = () => ((Math.round(posRef.current) % N) + N) % N;

  const goTo = (index: number, duration = 0.6) => {
    targetRef.current = index;
    tweenRef.current?.kill();
    if (reduced) {
      posRef.current = index;
      apply(index);
      setActive(activeIndex());
      return;
    }
    tweenRef.current = gsap.to(posRef, {
      current: index,
      duration,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => apply(posRef.current),
      onComplete: () => setActive(activeIndex()),
    });
  };

  // Center the card whose slot is `i`, via the shortest wrapped path.
  const centerCard = (i: number) => {
    const base = Math.round(posRef.current);
    goTo(base + wrapD(i - base));
  };

  useIsomorphicLayoutEffect(() => {
    apply(0);
    const stage = stageRef.current;
    if (!stage) return;

    const io = new IntersectionObserver(
      ([e]) => {
        paused.current.visible = e?.isIntersecting ?? true;
      },
      { threshold: 0.2 },
    );
    io.observe(stage);

    let interval: number | undefined;
    if (!reduced) {
      interval = window.setInterval(() => {
        const p = paused.current;
        if (p.hover || p.dragging || !p.visible) return;
        goTo(targetRef.current + 1);
      }, 3800);
    }

    return () => {
      io.disconnect();
      if (interval) clearInterval(interval);
      tweenRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const onPointerDown = (e: ReactPointerEvent) => {
    tweenRef.current?.kill();
    drag.current = { active: true, startX: e.clientX, startPos: posRef.current, moved: false };
    paused.current.dragging = true;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    posRef.current = drag.current.startPos - dx / SPACING;
    apply(posRef.current);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    paused.current.dragging = false;
    goTo(Math.round(posRef.current), 0.4);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(targetRef.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(targetRef.current - 1);
    }
  };

  return (
    <div>
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => (paused.current.hover = true)}
        onMouseLeave={() => (paused.current.hover = false)}
        className="relative h-[420px] w-full cursor-grab touch-none select-none outline-none [perspective:1200px] focus-visible:ring-2 focus-visible:ring-indigo/40 active:cursor-grabbing"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onClick={() => {
                if (!drag.current.moved) centerCard(i);
              }}
              aria-hidden={i !== active}
              className="absolute left-1/2 top-1/2 w-[340px] will-change-transform"
            >
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>

      <Controls active={active} onPrev={() => goTo(targetRef.current - 1)} onNext={() => goTo(targetRef.current + 1)} onDot={centerCard} />
    </div>
  );
}

function Controls({
  active,
  onPrev,
  onNext,
  onDot,
}: {
  active: number;
  onPrev: () => void;
  onNext: () => void;
  onDot: (i: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <button
        type="button"
        aria-label="Previous testimonial"
        onClick={onPrev}
        className="grid size-10 place-items-center rounded-full border border-border text-heading transition-colors hover:bg-lavender"
      >
        <ChevronLeft className="size-5" />
      </button>
      <div className="flex items-center gap-2">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            aria-current={i === active}
            onClick={() => onDot(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === active ? "w-6 bg-indigo" : "w-2 bg-heading/20 hover:bg-heading/40",
            )}
          />
        ))}
      </div>
      <button
        type="button"
        aria-label="Next testimonial"
        onClick={onNext}
        className="grid size-10 place-items-center rounded-full border border-border text-heading transition-colors hover:bg-lavender"
      >
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

/** Flat swipeable carousel (mobile fallback). */
function FlatCarousel() {
  return (
    <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2">
      {testimonials.map((t) => (
        <div key={t.id} className="w-[85%] shrink-0 snap-center">
          <TestimonialCard t={t} />
        </div>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden bg-neutral-soft px-5 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            subtext="Real words from the brands we've helped design, build and grow."
          >
            What Our Clients Are <Em>Saying</Em>
          </SectionHeading>
        </Reveal>

        <div className="mt-14">
          <div className="hidden lg:block">
            <CurvedGallery />
          </div>
          <div className="lg:hidden">
            <FlatCarousel />
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <ContactCtaButton>Join Our Happy Clients</ContactCtaButton>
        </div>
      </div>
    </section>
  );
}
