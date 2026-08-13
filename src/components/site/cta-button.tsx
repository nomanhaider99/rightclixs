"use client";

import { ArrowRight, type LucideIcon } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

type CtaButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
  type?: "button" | "submit";
};

/**
 * Shared animated CTA button reused by every homepage section.
 * GSAP micro-interaction: subtle scale + a trailing icon nudge on
 * hover/focus. Falls back to the plain button (CSS only) under
 * prefers-reduced-motion.
 */
export function CtaButton({
  children,
  onClick,
  icon: Icon = ArrowRight,
  variant = "brand",
  size = "pillLg",
  className,
  type = "button",
}: CtaButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const btn = btnRef.current;
    const icon = iconRef.current;
    if (!btn || !icon || reduced) return;

    const scaleTo = gsap.quickTo(btn, "scale", { duration: 0.25, ease: "power2.out" });
    const nudgeTo = gsap.quickTo(icon, "x", { duration: 0.25, ease: "power2.out" });

    const enter = () => {
      scaleTo(1.03);
      nudgeTo(4);
    };
    const leave = () => {
      scaleTo(1);
      nudgeTo(0);
    };

    btn.addEventListener("mouseenter", enter);
    btn.addEventListener("mouseleave", leave);
    btn.addEventListener("focus", enter);
    btn.addEventListener("blur", leave);
    return () => {
      btn.removeEventListener("mouseenter", enter);
      btn.removeEventListener("mouseleave", leave);
      btn.removeEventListener("focus", enter);
      btn.removeEventListener("blur", leave);
      gsap.set([btn, icon], { clearProps: "transform" });
    };
  }, [reduced]);

  return (
    <Button ref={btnRef} type={type} onClick={onClick} variant={variant} size={size} className={className}>
      <span
        ref={iconRef}
        className="grid size-8 place-items-center rounded-full bg-white/20"
      >
        <Icon className="size-4" />
      </span>
      {children}
    </Button>
  );
}
