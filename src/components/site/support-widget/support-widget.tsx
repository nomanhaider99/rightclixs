"use client";

import Image from "next/image";
import { Headset, MessageSquareText, Minus, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { AiAgentTab } from "./ai-agent-tab";
import { RealAssistantTab } from "./real-assistant-tab";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

type TabId = "ai" | "human";

/** Delay before the first-visit teaser bubble appears. */
const TEASER_DELAY_MS = 3200;
/** sessionStorage key — one teaser per browsing session, not per page view. */
const TEASER_SEEN_KEY = "rcx-support-teaser-seen";

const TABS: { id: TabId; label: string; icon: typeof Sparkles }[] = [
  { id: "ai", label: "AI Agent", icon: Sparkles },
  { id: "human", label: "Real Assistant", icon: Headset },
];

/**
 * Floating support widget mounted site-wide from the root layout.
 *
 * Two channels behind one launcher:
 *   AI Agent      — Gemini-backed assistant grounded in data/services + data/pricing
 *   Real Assistant — availability, lead capture and direct phone/email/WhatsApp
 *
 * Deliberately non-modal: the panel floats above the page but never traps focus
 * or blocks scrolling, so a visitor can keep reading a service page while they
 * chat. Escape closes it, and every animation is gated on prefers-reduced-motion.
 */
export function SupportWidget() {
  const [open, setOpen] = useState(false);
  /** Kept true through the close animation so the panel can animate out. */
  const [rendered, setRendered] = useState(false);
  const [tab, setTab] = useState<TabId>("ai");
  const [teaser, setTeaser] = useState(false);
  /** Drives the launcher's attention dot — cleared once the panel is opened. */
  const [unseen, setUnseen] = useState(true);

  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  const dismissTeaser = useCallback(() => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_SEEN_KEY, "1");
    } catch {
      // Private-browsing / storage disabled — the teaser simply shows again.
    }
  }, []);

  const openPanel = useCallback(() => {
    setUnseen(false);
    dismissTeaser();
    setRendered(true);
    setOpen(true);
  }, [dismissTeaser]);

  const closePanel = useCallback(() => setOpen(false), []);

  // First-visit nudge. Skipped entirely under reduced motion — an element that
  // pops in unprompted is exactly what that setting asks us not to do.
  useEffect(() => {
    if (reduced) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_SEEN_KEY) === "1";
    } catch {
      // Ignore — treat as not seen.
    }
    if (seen) return;
    const t = window.setTimeout(() => setTeaser(true), TEASER_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [reduced]);

  // Escape closes from anywhere on the page.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closePanel]);

  // Panel enter / exit.
  useIsomorphicLayoutEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (reduced) {
      // No motion: just mirror the state instantly.
      gsap.set(el, { opacity: open ? 1 : 0, y: 0, scale: 1 });
      if (!open) setRendered(false);
      return;
    }

    const ctx = gsap.context(() => {
      if (open) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            ease: "power3.out",
            transformOrigin: "bottom right",
          },
        );
      } else {
        gsap.to(el, {
          opacity: 0,
          y: 16,
          scale: 0.96,
          duration: 0.22,
          ease: "power2.in",
          transformOrigin: "bottom right",
          onComplete: () => setRendered(false),
        });
      }
    }, el);

    return () => ctx.revert();
  }, [open, reduced, rendered]);

  // Slow halo on the closed launcher — a hint that it's interactive, not a
  // flashing attention-grab. Stops entirely once the panel has been opened.
  useIsomorphicLayoutEffect(() => {
    const el = pulseRef.current;
    if (!el || reduced || open || !unseen) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 0.9, opacity: 0.55 },
        {
          scale: 1.75,
          opacity: 0,
          duration: 2.2,
          ease: "power2.out",
          repeat: -1,
          repeatDelay: 0.9,
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, open, unseen]);

  return (
    <>
      {/* ---------------------------------------------------------------- *
       * Panel
       * ---------------------------------------------------------------- */}
      {rendered && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Rightclixs support"
          id="rcx-support-panel"
          className={cn(
            "fixed z-[70] flex flex-col overflow-hidden bg-background",
            "inset-x-3 bottom-3 top-3 rounded-3xl",
            "sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-24 sm:h-[min(78vh,650px)] sm:w-[400px]",
            "border border-border shadow-[0_50px_110px_-32px_rgba(38,37,77,0.55)]",
          )}
        >
          <PanelHeader tab={tab} onTabChange={setTab} onClose={closePanel} />

          {/* Both tabs stay mounted: switching to the Real Assistant and back
              must not wipe the conversation or a half-typed form. */}
          <div className="relative min-h-0 flex-1">
            <TabPanel active={tab === "ai"} id="ai">
              <AiAgentTab active={tab === "ai"} onRequestHuman={() => setTab("human")} />
            </TabPanel>
            <TabPanel active={tab === "human"} id="human">
              <RealAssistantTab />
            </TabPanel>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- *
       * Teaser + launcher
       * ---------------------------------------------------------------- */}
      {teaser && !open && (
        <div className="fixed right-6 bottom-24 z-[65] hidden max-w-[268px] sm:block">
          <div className="relative rounded-2xl rounded-br-md border border-border bg-background p-4 pr-9 shadow-[0_24px_60px_-24px_rgba(38,37,77,0.45)]">
            <button
              type="button"
              onClick={dismissTeaser}
              aria-label="Dismiss message"
              className="absolute top-2.5 right-2.5 grid size-6 cursor-pointer place-items-center rounded-full text-heading/40 transition-colors hover:bg-neutral-soft hover:text-heading"
            >
              <X className="size-3.5" />
            </button>
            <p className="text-sm leading-relaxed text-heading">
              Hi there — need help choosing a package?{" "}
              <button
                type="button"
                onClick={openPanel}
                className="cursor-pointer font-semibold text-indigo underline-offset-2 hover:underline"
              >
                Ask our AI agent
              </button>
              .
            </p>
          </div>
        </div>
      )}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => (open ? closePanel() : openPanel())}
        aria-label={open ? "Close support chat" : "Open support chat"}
        aria-expanded={open}
        aria-controls="rcx-support-panel"
        className={cn(
          "group fixed right-5 bottom-5 z-[70] grid size-14 cursor-pointer place-items-center rounded-full sm:right-6 sm:bottom-6",
          "bg-[linear-gradient(140deg,#7472ff_0%,#6260ff_45%,#4340d8_100%)] text-white",
          "shadow-[0_20px_45px_-14px_rgba(98,96,255,0.85)] transition-transform duration-200",
          "hover:scale-105 focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:outline-none",
          // The panel covers the whole viewport on mobile, so the launcher
          // would otherwise sit on top of the conversation.
          open && "max-sm:hidden",
        )}
      >
        <span
          ref={pulseRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-indigo/45"
        />
        <span className="relative">
          {open ? (
            <X className="size-6" />
          ) : (
            <MessageSquareText className="size-6" strokeWidth={2.1} />
          )}
        </span>
        {!open && unseen && (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 size-4 rounded-full border-2 border-white bg-cta"
          />
        )}
      </button>
    </>
  );
}

/** Absolutely-positioned tab layer — inactive tabs stay mounted but inert. */
function TabPanel({
  active,
  id,
  children,
}: {
  active: boolean;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tabpanel"
      id={`rcx-tabpanel-${id}`}
      aria-labelledby={`rcx-tab-${id}`}
      hidden={!active}
      className="absolute inset-0 flex flex-col"
    >
      {children}
    </div>
  );
}

function PanelHeader({
  tab,
  onTabChange,
  onClose,
}: {
  tab: TabId;
  onTabChange: (t: TabId) => void;
  onClose: () => void;
}) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  /** Roving arrow-key focus across the two tabs, per WAI-ARIA tablist. */
  const onTabKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.id === tab);
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
    if (!next) return;
    onTabChange(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <div className="relative shrink-0 overflow-hidden bg-[linear-gradient(135deg,#6d6bff_0%,#5654ec_48%,#3634b4_100%)] px-4 pt-4 pb-3 text-white">
      {/* Soft highlight so the flat gradient reads as lit, matching the hero. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-10 size-48 rounded-full bg-white/18 blur-3xl"
      />

      <div className="relative flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
          <Image
            src="/logo-mark.png"
            alt=""
            width={128}
            height={128}
            className="size-6 w-auto object-contain"
          />
        </span>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[15px] leading-tight font-semibold">Rightclixs Support</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-white/75">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            Online — typically replies in a minute
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Minimise support chat"
          className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          <Minus className="size-4 max-sm:hidden" />
          <X className="size-4 sm:hidden" />
        </button>
      </div>

      {/* Segmented tab switcher. Two equal columns, so the active pill is just
          a half-width layer translated 0% or 100% — no measuring required. */}
      <div
        role="tablist"
        aria-label="Support channel"
        onKeyDown={onTabKeyDown}
        className="relative mt-4 grid grid-cols-2 gap-1 rounded-full bg-black/18 p-1 ring-1 ring-white/12"
      >
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-sm",
            "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none",
            tab === "human" && "translate-x-[calc(100%+0.25rem)]",
          )}
        />
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[t.id] = el;
              }}
              type="button"
              role="tab"
              id={`rcx-tab-${t.id}`}
              aria-selected={active}
              aria-controls={`rcx-tabpanel-${t.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onTabChange(t.id)}
              className={cn(
                "relative z-10 flex cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 text-[13px] font-medium",
                "transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none",
                active ? "text-indigo" : "text-white/80 hover:text-white",
              )}
            >
              <Icon className="size-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
