import { services } from "@/data/services";

import type { ChatAction } from "./types";

/**
 * Picks up to two "next step" links to render as chips under an assistant
 * reply, based on what was actually discussed.
 *
 * Lives apart from `knowledge.ts` on purpose: the widget calls this in the
 * browser, and importing it from `knowledge.ts` would drag the whole system
 * prompt (every package, every FAQ) into the client bundle.
 *
 * Purely additive — the answer reads fine with no chips at all, so a miss here
 * costs nothing.
 */
export function suggestActions(userText: string, replyText: string): ChatAction[] {
  const haystack = `${userText} ${replyText}`.toLowerCase();
  const actions: ChatAction[] = [];

  const service = services.find(
    (s) =>
      haystack.includes(s.name.toLowerCase()) ||
      haystack.includes(s.slug.replace(/-/g, " ")),
  );
  if (service) {
    actions.push({ label: service.name, href: `/services/${service.slug}` });
  }

  if (/price|pricing|package|cost|budget|\$|quote|tier/.test(haystack)) {
    actions.push({ label: "See all packages", href: "/pricing" });
  } else if (!service && /service|what do you do|offer/.test(haystack)) {
    actions.push({ label: "Browse services", href: "/services" });
  }

  if (/call|phone|speak|talk|human|consult|book|contact/.test(haystack)) {
    actions.push({ label: "Book a free consult", href: "/contact" });
  }

  // De-dupe by href, then cap at two so the chip row never wraps awkwardly.
  return actions
    .filter((a, i, all) => all.findIndex((b) => b.href === a.href) === i)
    .slice(0, 2);
}
