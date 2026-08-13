import { agencyFaqs, pricingFaqs } from "@/data/agency";
import { pricing } from "@/data/pricing";
import { services } from "@/data/services";

import { CONTACT } from "./knowledge";

/**
 * Offline responder — the answer of last resort.
 *
 * Runs when Gemini is unconfigured, rate-limited or erroring. It is a retrieval
 * engine, not a generator: every reply is assembled from `data/*`, so a visitor
 * still gets a true, useful answer instead of "sorry, something went wrong".
 * Deliberately keyword-based and dependency-free — this path has to work when
 * the network doesn't.
 */

/** Words too common to carry meaning in a scoring match. */
const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "is", "are", "was", "were", "be", "been",
  "do", "does", "did", "have", "has", "had", "i", "you", "we", "they", "it",
  "my", "our", "your", "for", "to", "of", "in", "on", "at", "with", "about",
  "what", "how", "can", "could", "would", "should", "much", "many", "me", "us",
  "need", "want", "get", "please", "hi", "hello", "hey", "there", "that", "this",
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s$]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/** Overlap score between a query and a body of text, 0..n. */
function score(queryWords: string[], target: string): number {
  const hay = target.toLowerCase();
  return queryWords.reduce((n, w) => (hay.includes(w) ? n + 1 : n), 0);
}

function bestService(queryWords: string[]) {
  let best: { svc: (typeof services)[number]; score: number } | null = null;
  for (const svc of services) {
    // Weight the name heavily — "seo" matching the name beats "seo" appearing
    // in some other service's prose.
    const s =
      score(queryWords, svc.name) * 3 +
      score(queryWords, svc.slug.replace(/-/g, " ")) * 3 +
      score(queryWords, svc.description);
    if (s > 0 && (!best || s > best.score)) best = { svc, score: s };
  }
  return best;
}

function bestFaq(queryWords: string[]) {
  let best: { q: string; a: string; score: number } | null = null;
  for (const faq of [...agencyFaqs, ...pricingFaqs]) {
    const s = score(queryWords, faq.q) * 2 + score(queryWords, faq.a);
    if (s >= 2 && (!best || s > best.score)) best = { ...faq, score: s };
  }
  return best;
}

/**
 * Lowercases the first character so a sentence-case data string reads correctly
 * when embedded mid-sentence — "typically First results in 3–6 months" becomes
 * "typically first results in 3–6 months". Safe for every current `timeline`
 * value; revisit if one ever starts with an acronym.
 */
function inline(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

/** Cheapest headline price across all packages, used for "how much" answers. */
function cheapestPrice(): string {
  const numbers = pricing
    .flatMap((c) => c.packages)
    .map((p) => Number(p.price.replace(/[^0-9.]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  return numbers.length ? `$${Math.min(...numbers)}` : "$79";
}

/**
 * Produce a grounded reply for `message`.
 * Always returns something — the final branch is a catch-all handoff.
 */
export function offlineReply(message: string): string {
  const q = message.toLowerCase();
  const words = tokens(message);

  // Greeting with no substance behind it.
  if (/^\s*(hi|hey|hello|yo|good (morning|afternoon|evening))\b/.test(q) && words.length === 0) {
    return `Hello. I can help you compare services, walk through package pricing, or point you to the right starting place. What are you working on?`;
  }

  if (/\b(human|person|agent|representative|someone real|talk to|speak to)\b/.test(q)) {
    return `Switch to the "Real Assistant" tab at the top of this chat and a strategist will pick it up — we reply within one business day, usually much sooner. You can also call ${CONTACT.phone} or email ${CONTACT.email}.`;
  }

  const svc = bestService(words);

  // Pricing intent — answer against the matched service where possible.
  if (/\b(price|pricing|cost|costs|package|packages|quote|budget|afford|cheap|expensive|\$)\b/.test(q)) {
    if (svc?.svc.pricingCategory) {
      const cat = pricing.find((c) => c.id === svc.svc.pricingCategory);
      if (cat) {
        const lines = cat.packages
          .map((p) => `- ${p.name}: ${p.price}${p.popular ? " (most popular)" : ""}`)
          .join("\n");
        return `${cat.label} starts at ${svc.svc.startingAt}. The packages are:\n${lines}\nTypical timeline is ${inline(svc.svc.timeline)}. Full feature lists are on the pricing page — or tell me your page count and I'll point you at the right tier.`;
      }
    }
    return `Packages start at ${cheapestPrice()} and scale with scope — there are no setup fees and no surprise line items. Pricing is grouped by category (website design, e-commerce, SEO, branding and more), each with a few tiers. Tell me which service you're after and I'll give you that category's tiers.`;
  }

  // Timeline intent.
  if (/\b(how long|timeline|turnaround|deadline|when|fast|quick|urgent|delivery)\b/.test(q)) {
    if (svc) {
      return `For ${svc.svc.name}, the typical timeline is ${inline(svc.svc.timeline)}. That assumes content and feedback come back promptly — the schedule is confirmed in writing before work starts. Expedited delivery is available on most packages.`;
    }
    return `Timelines depend on the service: smaller website packages turn around in 24–48 hours, while full custom builds and ongoing programmes run longer. Tell me what you need and I'll give you the typical window.`;
  }

  // A specific service was named.
  if (svc && svc.score >= 3) {
    const s = svc.svc;
    // `inline` per item rather than a blanket toLowerCase, which would flatten
    // acronyms — "Technical SEO audits" must not become "technical seo audits".
    const includes = s.highlights.slice(0, 3).map(inline).join(", ");
    return `${s.name}: ${s.description}\nStarting at ${s.startingAt}, typically ${inline(s.timeline)}. It includes ${includes} and more. Want the package tiers for this, or shall I connect you to a strategist?`;
  }

  // What do you do / catalogue overview.
  if (/\b(service|services|offer|do you|provide|help with|capabilit)\b/.test(q)) {
    const names = services.slice(0, 6).map((s) => s.name).join(", ");
    return `We cover ${names.toLowerCase()} and more — ${services.length} services in total, all delivered by an in-house team. Which one is closest to what you need?`;
  }

  // Fall back to the closest FAQ before giving up.
  const faq = bestFaq(words);
  if (faq) return faq.a;

  return `I don't have a confident answer to that one. A strategist will — switch to the "Real Assistant" tab, call ${CONTACT.phone}, or email ${CONTACT.email}. Consultations are free and take about 30 minutes.`;
}
