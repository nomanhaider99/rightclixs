"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { services } from "@/data/services";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

/** Scroll distance (px) after which the header promotes to the glass bar. */
const FLOAT_AFTER = 32;

const nav = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services", mega: true },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
] as const;

function ServicesMega({ onDark, active }: { onDark: boolean; active: boolean }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const openNow = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    timer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div onMouseEnter={openNow} onMouseLeave={closeSoon} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <Link
        href="/services"
        aria-haspopup="true"
        aria-expanded={open}
        onFocus={openNow}
        className={cn(
          "flex items-center gap-1 transition-opacity hover:opacity-100",
          active ? (onDark ? "text-white" : "text-indigo") : onDark ? "text-white/75" : "text-heading/70",
        )}
      >
        Services
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </Link>

      {open && (
        <div
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          className="absolute left-1/2 top-full z-40 w-[min(92vw,780px)] -translate-x-1/2 pt-3"
        >
          <div className="rounded-3xl border border-border bg-background p-5 text-left shadow-[0_40px_80px_-30px_rgba(38,37,77,0.4)]">
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-lavender"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-lavender text-indigo transition-colors group-hover:bg-indigo group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-heading">{s.name}</span>
                      <span className="block truncate text-xs text-heading/55">{s.description}</span>
                    </span>
                  </Link>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-neutral-soft px-4 py-3">
              <span className="text-sm text-heading/70">Not sure what you need?</span>
              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo hover:text-indigo/80"
              >
                View all services
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ variant = "light" }: { variant?: "light" | "onDark" }) {
  const [open, setOpen] = useState(false);
  const [floating, setFloating] = useState(false);
  const [slotHeight, setSlotHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  // Past the threshold the header detaches into a glass bar; at the very top it
  // stays exactly as it was — in flow, transparent, over the hero gradient.
  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > FLOAT_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reserve the in-flow height so promoting to `fixed` doesn't jump the page.
  // Only measured while docked — the floating bar is denser and out of flow.
  useIsomorphicLayoutEffect(() => {
    const el = headerRef.current;
    if (!el || floating) return;
    const measure = () => setSlotHeight(el.offsetHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [floating]);

  // Drop the glass bar in rather than having it pop.
  useIsomorphicLayoutEffect(() => {
    const el = headerRef.current;
    if (!el || !floating) return;
    if (reduced) return;
    const tween = gsap.fromTo(
      el,
      { y: -14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.3, ease: "power2.out", overwrite: true },
    );
    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "transform,opacity" });
    };
  }, [floating, reduced]);

  // Glass sits over light page content, so the on-dark treatment is dropped.
  const onDark = variant === "onDark" && !floating;

  return (
    <>
      {floating && <div aria-hidden style={{ height: slotHeight }} />}
      <header
        ref={headerRef}
        className={cn(
          "mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between",
          floating
            ? // z-40 keeps it above page content but under Radix overlays (z-50)
              "fixed inset-x-0 top-3 z-40 w-[calc(100%-1.5rem)] max-w-7xl rounded-2xl border border-white/50 bg-white/70 px-5 py-3 shadow-[0_20px_50px_-25px_rgba(38,37,77,0.45)] backdrop-blur-xl backdrop-saturate-150 sm:top-4 sm:w-[calc(100%-2rem)]"
            : "relative z-30 w-full max-w-7xl px-5 py-5",
          onDark ? "text-white" : "text-heading",
        )}
      >
      {/* The supplied lockup's wordmark is white, so it disappears on the glass
          header. The mark reads on both, so it pairs with a themed wordmark —
          which also keeps the logo the same width when the header changes state. */}
      <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Rightclixs — home">
        <Image
          src="/logo-mark.png"
          alt=""
          width={436}
          height={423}
          priority
          className="size-9 shrink-0"
        />
        <span className="truncate text-lg font-bold tracking-tight">Rightclixs</span>
      </Link>

      <nav className="hidden items-center gap-7 text-sm sm:flex">
        {nav.map((item) => {
          const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          if ("mega" in item && item.mega) {
            return <ServicesMega key={item.to} onDark={onDark} active={isActive} />;
          }
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "transition-opacity hover:opacity-100",
                isActive ? (onDark ? "text-white" : "text-indigo") : onDark ? "text-white/75" : "text-heading/70",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <a
          href="tel:+18339455567"
          className={cn(
            "hidden items-center gap-2 text-sm lg:flex",
            onDark ? "text-white/80" : "text-heading/70",
          )}
        >
          <Phone className="size-4" />
          +1 (833) 945-5567
        </a>
        <Button asChild variant={onDark ? "onDark" : "brand"} size="pill" className="hidden sm:inline-flex">
          <Link href="/contact">
            <span
              className={cn(
                "grid size-7 place-items-center rounded-full",
                onDark ? "bg-indigo text-white" : "bg-white/20",
              )}
            >
              <ArrowRight className="size-3.5" />
            </span>
            Get started
          </Link>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-full border sm:hidden",
                onDark ? "border-white/25 text-white" : "border-border text-heading",
              )}
            >
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <nav className="mt-10 flex flex-col gap-1 px-5">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-heading hover:bg-lavender"
              >
                Home
              </Link>

              <p className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wide text-heading/45">
                Services
              </p>
              <div className="grid gap-0.5">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-heading/80 hover:bg-lavender"
                  >
                    <s.icon className="size-4 text-indigo" />
                    {s.name}
                  </Link>
                ))}
              </div>

              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg px-3 py-3 text-base font-medium text-heading hover:bg-lavender"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-heading hover:bg-lavender"
              >
                Contact
              </Link>

              <Button asChild variant="brand" size="pill" className="mt-4">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      </header>
    </>
  );
}
