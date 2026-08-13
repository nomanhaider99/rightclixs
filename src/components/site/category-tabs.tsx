"use client";

import type { ReactNode } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type TabItem = { value: string; label: string };

type CategoryTabsProps = {
  categories: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  /** Renders the panel content for a given category value (active tab only). */
  renderPanel: (value: string) => ReactNode;
  className?: string;
  /** Tailwind `from-*` colour for the mobile edge fades — must match the
   *  surrounding section background, or the fade shows as a grey smear. */
  fadeFrom?: string;
};

/**
 * Shared category tab UI: Radix Tabs (accessible tablist / roving arrow-key
 * focus / tab↔tabpanel wiring) styled as pills in the site theme, with a
 * horizontally-scrollable strip + edge fades on mobile. Reused by the
 * Portfolio (masonry) and Pricing (cards) sections — same component, different
 * data + panel content.
 */
export function CategoryTabs({
  categories,
  value,
  onValueChange,
  renderPanel,
  className,
  fadeFrom = "from-neutral-soft",
}: CategoryTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <div className="relative">
        <TabsList className="no-scrollbar -mx-5 flex h-auto w-auto items-center justify-start gap-2 overflow-x-auto overflow-y-hidden bg-transparent px-5 py-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {categories.map((c) => (
            <TabsTrigger
              key={c.value}
              value={c.value}
              className={cn(
                "shrink-0 rounded-full border border-border bg-neutral-soft px-5 py-2.5 text-sm text-heading/70 transition-colors",
                "data-[state=active]:border-indigo data-[state=active]:bg-indigo data-[state=active]:text-white data-[state=active]:shadow-none",
              )}
            >
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {/* mobile edge fades hinting more tabs off-screen */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r to-transparent sm:hidden",
            fadeFrom,
          )}
        />
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l to-transparent sm:hidden",
            fadeFrom,
          )}
        />
      </div>

      {categories.map((c) => (
        <TabsContent key={c.value} value={c.value} className="mt-10 focus-visible:outline-none">
          {renderPanel(c.value)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
