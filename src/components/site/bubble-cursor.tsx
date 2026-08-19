"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/** Resting diameter (px), and what it grows to over something clickable. */
const SIZE_IDLE = 116;
const SIZE_HOVER = 168;
const SIZE_PRESS = 88;

/**
 * Refraction is dropped to nothing over anything clickable — a blurred button
 * label is a legibility problem, and the rim, tint and highlights carry the
 * glass on their own. Elsewhere the blur is what makes it read as glass.
 */
const BLUR_IDLE = 4;
const BLUR_HOVER = 0;
/** The fill thins out over interactive elements so the label reads through. */
const FILL_IDLE = 1;
const FILL_HOVER = 0.5;

const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor="grow"]';

/**
 * Bubble cursor: one large glass sphere that trails the pointer, refracting
 * whatever sits underneath it.
 *
 * DOM rather than canvas — the glass reads as glass only because
 * `backdrop-filter` actually samples the page behind it, which a canvas
 * overlay cannot do. It's a single element on a rAF loop, so there's no
 * per-frame layout beyond its own transform.
 *
 * The body squashes along its direction of travel (liquid, not a rigid disc)
 * while the specular highlights sit in a sibling that never rotates, so the
 * light always falls from the same place. The native cursor stays visible —
 * hiding it costs more in usability than the effect is worth — and the whole
 * thing sits out for `prefers-reduced-motion` and on coarse pointers.
 */
export function BubbleCursor() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const glossRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const wrap = wrapRef.current;
    const body = bodyRef.current;
    const gloss = glossRef.current;
    if (!wrap || !body || !gloss) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let size = SIZE_IDLE;
    let sizeTarget = SIZE_IDLE;
    let alpha = 0;
    let alphaTarget = 0;
    let blur = BLUR_IDLE;
    let blurTarget = BLUR_IDLE;
    let fill = FILL_IDLE;
    let fillTarget = FILL_IDLE;
    let pressed = false;
    // Last values written to style, so we only touch the DOM on real change.
    let blurWritten = -1;
    let fillWritten = -1;

    const onMove = (e: PointerEvent) => {
      if (alphaTarget === 0) {
        // First sighting: drop it straight onto the pointer, don't fly in.
        pos.x = e.clientX;
        pos.y = e.clientY;
      }
      target.x = e.clientX;
      target.y = e.clientY;
      alphaTarget = 1;

      const el = e.target;
      const over = el instanceof Element && el.closest(INTERACTIVE) !== null;
      sizeTarget = pressed ? SIZE_PRESS : over ? SIZE_HOVER : SIZE_IDLE;
      blurTarget = over ? BLUR_HOVER : BLUR_IDLE;
      fillTarget = over ? FILL_HOVER : FILL_IDLE;
    };

    const onDown = () => {
      pressed = true;
      sizeTarget = SIZE_PRESS;
    };
    const onUp = () => {
      pressed = false;
      sizeTarget = SIZE_IDLE;
    };
    const onLeave = () => {
      alphaTarget = 0;
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      // Clamped so a backgrounded tab doesn't snap the bubble across the page.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Framerate-independent smoothing — the bubble lags the pointer, which is
      // what sells the weight of it.
      const followK = 1 - Math.pow(0.0009, dt);
      const dx = (target.x - pos.x) * followK;
      const dy = (target.y - pos.y) * followK;
      pos.x += dx;
      pos.y += dy;

      const easeK = 1 - Math.pow(0.0001, dt);
      size += (sizeTarget - size) * easeK;
      alpha += (alphaTarget - alpha) * easeK;
      blur += (blurTarget - blur) * easeK;
      fill += (fillTarget - fill) * easeK;

      // Rounded before comparing — sub-pixel blur changes aren't visible, and
      // rewriting backdrop-filter every frame forces a needless repaint.
      const b = Math.round(blur * 10) / 10;
      if (b !== blurWritten) {
        blurWritten = b;
        const filter = `blur(${b}px) saturate(${140 + b * 10}%) brightness(1.06)`;
        body.style.backdropFilter = filter;
        body.style.setProperty("-webkit-backdrop-filter", filter);
      }
      const f = Math.round(fill * 20) / 20;
      if (f !== fillWritten) {
        fillWritten = f;
        body.style.backgroundColor = `rgba(255, 255, 255, ${0.06 * f})`;
        body.style.backgroundImage = `radial-gradient(circle at 50% 50%, rgba(255,255,255,${0.06 * f}) 0%, rgba(98,96,255,${0.1 * f}) 62%, rgba(255,255,255,${0.3 * f}) 100%)`;
        body.style.boxShadow = `inset 0 0 22px rgba(255,255,255,${0.45 * f}), inset -10px -14px 26px rgba(98,96,255,${0.28 * f}), inset 8px 10px 22px rgba(255,255,255,${0.3 * f}), 0 14px 34px -14px rgba(38,37,77,${0.45 * f})`;
        gloss.style.opacity = String(0.35 + 0.65 * f);
      }

      // Squash along the travel vector, conserving area so it reads as liquid.
      const speed = Math.hypot(dx, dy) / Math.max(dt, 0.001);
      const stretch = Math.min(speed / 2600, 0.3);
      const angle = speed > 8 ? (Math.atan2(dy, dx) * 180) / Math.PI : 0;

      gsap.set(wrap, { x: pos.x, y: pos.y, opacity: alpha });
      gsap.set([body, gloss], { width: size, height: size });
      gsap.set(body, { rotate: angle, scaleX: 1 + stretch, scaleY: 1 - stretch * 0.75 });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] hidden opacity-0 [@media(pointer:fine)]:block"
    >
      {/* Glass body — refraction, rim light and shadow. Rotates/squashes. */}
      <div
        ref={bodyRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/55"
        style={{
          width: SIZE_IDLE,
          height: SIZE_IDLE,
          backdropFilter: "blur(4px) saturate(180%) brightness(1.06)",
          WebkitBackdropFilter: "blur(4px) saturate(180%) brightness(1.06)",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(98,96,255,0.10) 62%, rgba(255,255,255,0.30) 100%)",
          boxShadow:
            "inset 0 0 22px rgba(255,255,255,0.45), inset -10px -14px 26px rgba(98,96,255,0.28), inset 8px 10px 22px rgba(255,255,255,0.30), 0 14px 34px -14px rgba(38,37,77,0.45)",
        }}
      />

      {/* Specular highlights — kept out of the rotation so the light stays put. */}
      <div
        ref={glossRef}
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: SIZE_IDLE,
          height: SIZE_IDLE,
          background:
            "radial-gradient(34% 30% at 30% 26%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%), radial-gradient(18% 14% at 70% 76%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 75%)",
        }}
      />
    </div>
  );
}
