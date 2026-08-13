"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export type OptionWheelItem = { id: string; label: string };

type OptionWheelProps = {
  items: OptionWheelItem[];
  onChange?: (index: number) => void;
  initial?: number;
  className?: string;
};

/** Vertical row pitch in px (visual spacing between items). */
const ROW_H = 60;
/** Wheel delta that must accumulate before advancing one item. */
const WHEEL_STEP = 90;

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/**
 * Internally-scrollable "focus falloff" wheel. The item nearest center is
 * crisp/bold/full-opacity; neighbours progressively blur, fade and shrink.
 * Scroll (wheel/trackpad), drag (touch/mouse), click, and Up/Down keys all
 * snap the nearest item to center with a single GSAP tween that drives
 * position + blur + scale + opacity in sync. Hard-stops at both ends.
 */
export function OptionWheel({ items, onChange, initial = 0, className }: OptionWheelProps) {
  const n = items.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const posRef = useRef(initial); // fractional live position (item units)
  const targetRef = useRef(initial); // integer snap target
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const reduced = usePrefersReducedMotion();

  const [active, setActive] = useState(initial);

  // Write transforms for the current fractional position.
  const applyPositions = useCallback(
    (pos: number) => {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = i - pos;
        const ad = Math.abs(d);
        const opacity = Math.max(0.14, 1 - ad * 0.26);
        const blur = Math.min(ad * 1.3, 6);
        const scale = Math.max(0.82, 1 - ad * 0.055);
        el.style.transform = `translateY(${d * ROW_H}px) translateY(-50%) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = ad < 0.04 ? "none" : `blur(${blur}px)`;
        el.style.zIndex = String(100 - Math.round(ad));
        el.style.fontWeight = ad < 0.5 ? "600" : "400";
      });
    },
    [],
  );

  const setActiveIndex = useCallback(
    (i: number) => {
      setActive((prev) => {
        if (prev !== i) onChange?.(i);
        return i;
      });
    },
    [onChange],
  );

  // Animate to an integer index, snapping position + falloff in sync.
  const goTo = useCallback(
    (index: number, duration = 0.5) => {
      const target = clamp(index, 0, n - 1);
      targetRef.current = target;
      setActiveIndex(target);
      tweenRef.current?.kill();
      if (reduced) {
        posRef.current = target;
        applyPositions(target);
        return;
      }
      tweenRef.current = gsap.to(posRef, {
        current: target,
        duration,
        ease: "power3.out",
        overwrite: true,
        onUpdate: () => applyPositions(posRef.current),
      });
    },
    [n, reduced, applyPositions, setActiveIndex],
  );

  // Initial layout before paint (no flash).
  useIsomorphicLayoutEffect(() => {
    posRef.current = initial;
    targetRef.current = initial;
    applyPositions(initial);
  }, [applyPositions, initial]);

  // Wheel: accumulate delta, advance items; release to the page at the ends.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let acc = 0;

    const onWheel = (e: WheelEvent) => {
      const dir = Math.sign(e.deltaY);
      const atStart = targetRef.current <= 0 && dir < 0;
      const atEnd = targetRef.current >= n - 1 && dir > 0;
      if (atStart || atEnd) return; // let the page scroll past the wheel
      e.preventDefault();
      acc += e.deltaY;
      let steps = 0;
      while (Math.abs(acc) >= WHEEL_STEP) {
        steps += Math.sign(acc);
        acc -= Math.sign(acc) * WHEEL_STEP;
      }
      if (steps !== 0) goTo(targetRef.current + steps, 0.45);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [n, goTo]);

  // Pointer drag (touch + mouse).
  const drag = useRef<{ active: boolean; startY: number; startPos: number; moved: boolean }>({
    active: false,
    startY: 0,
    startPos: initial,
    moved: false,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    tweenRef.current?.kill();
    drag.current = { active: true, startY: e.clientY, startPos: posRef.current, moved: false };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dy = e.clientY - drag.current.startY;
    if (Math.abs(dy) > 4) drag.current.moved = true;
    const pos = clamp(drag.current.startPos - dy / ROW_H, 0, n - 1);
    posRef.current = pos;
    applyPositions(pos);
  };
  const endDrag = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (drag.current.moved) goTo(Math.round(posRef.current), 0.35);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        goTo(targetRef.current + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        goTo(targetRef.current - 1);
        break;
      case "Home":
        e.preventDefault();
        goTo(0);
        break;
      case "End":
        e.preventDefault();
        goTo(n - 1);
        break;
    }
  };

  return (
    <div className={cn("flex items-stretch gap-4", className)}>
      {/* Progress rail */}
      <div className="hidden flex-col justify-center gap-2 py-2 sm:flex" aria-hidden="true">
        {items.map((it, i) => (
          <span
            key={it.id}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-all duration-300",
              i === active ? "h-4 bg-indigo" : "bg-heading/20",
            )}
          />
        ))}
      </div>

      {/* Wheel viewport */}
      <div
        ref={containerRef}
        role="listbox"
        aria-label="Services"
        aria-activedescendant={`svc-opt-${items[active]?.id}`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-[300px] flex-1 cursor-grab touch-none overflow-hidden rounded-2xl outline-none select-none focus-visible:ring-2 focus-visible:ring-indigo/40 active:cursor-grabbing sm:h-[380px] lg:h-[440px]"
      >
        {/* focus band + edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[200] h-20 bg-gradient-to-b from-background to-transparent sm:h-28"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[200] h-20 bg-gradient-to-t from-background to-transparent sm:h-28"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2">
          <div className="mx-auto h-14 max-w-[92%] rounded-xl bg-lavender/40" />
        </div>

        <div className="absolute inset-x-0 top-1/2 z-10">
          {items.map((it, i) => (
            <button
              key={it.id}
              id={`svc-opt-${it.id}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role="option"
              aria-selected={i === active}
              tabIndex={-1}
              onClick={() => {
                if (!drag.current.moved) goTo(i);
              }}
              style={{ position: "absolute", left: 0, right: 0, top: 0, willChange: "transform, opacity, filter" }}
              className="mx-auto block w-full px-4 text-center text-2xl leading-tight text-heading sm:text-3xl"
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
