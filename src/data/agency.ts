import type { Stat } from "@/components/site/stat-band";
import type { Faq } from "@/components/site/faq-section";

/**
 * Agency-wide content for the inner pages. Per-service equivalents live on each
 * entry in data/services.ts.
 *
 * NOTE: like `outcomes` in data/services.ts, these figures are illustrative.
 * They are claims shown to prospective customers — verify each one against real
 * numbers before launch.
 */
export const agencyStats: Stat[] = [
  { value: 500, suffix: "+", label: "Projects delivered across 200+ industries" },
  { value: 100, suffix: "+", label: "Brands served since we opened our doors" },
  { value: 15, suffix: "+", label: "Strategists, designers and developers on the team" },
  { value: 1, suffix: " day", label: "Average first response to a new enquiry" },
];

export const agencyFaqs: Faq[] = [
  {
    q: "How do we start working together?",
    a: "Send us a note or book a call. A strategist replies within one business day, we spend 30 minutes on your goals, and you get a written scope and fixed quote before committing to anything.",
  },
  {
    q: "Do you work with businesses our size?",
    a: "Our clients run from single-location trades to multi-site operators. Packages start at $79 precisely so smaller businesses can start somewhere real, and scale up when the work pays for itself.",
  },
  {
    q: "Who actually does the work?",
    a: "An in-house team of designers, developers and strategists. You get named people on your account who stay with it from kickoff to launch, not a rotating pool of subcontractors.",
  },
  {
    q: "What if we already have a website or brand?",
    a: "Most clients do. We'll audit what exists and tell you honestly what's worth keeping — rebuilding something that already works is a waste of your budget and our time.",
  },
  {
    q: "How do you handle revisions and changes?",
    a: "Revisions are included as stated in each package, and we agree direction before detailed work starts so rounds stay productive. Anything genuinely new gets quoted before it's started.",
  },
];

export const pricingFaqs: Faq[] = [
  {
    q: "Are these prices really final?",
    a: "The package prices are what you pay for that scope — no setup fees and no surprise line items. If your project needs something outside a package, we quote it before starting, never after.",
  },
  {
    q: "What's included in every package?",
    a: "Dedicated designers and developers, revisions as stated on the package, W3C-validated build, mobile responsiveness, and our 100% money-back guarantee.",
  },
  {
    q: "Do I pay everything up front?",
    a: "No. Projects are split across milestones — a deposit to begin, then payments tied to agreed stages. Monthly services like SEO, social and maintenance are billed monthly.",
  },
  {
    q: "What does the money-back guarantee actually cover?",
    a: "If we fail to deliver the scope we agreed in writing, you get your money back for that work. It doesn't cover changing your mind about a direction you already signed off on.",
  },
  {
    q: "Can I combine services across categories?",
    a: "Yes — combo packages exist for exactly that, and they're cheaper than buying each service separately. Tell us what you need and we'll put the numbers side by side.",
  },
  {
    q: "What if I outgrow my package?",
    a: "You move up and we credit what you've already paid in that cycle. Most clients start smaller than they expect to end up, which is the sensible way round.",
  },
];

export const contactFaqs: Faq[] = [
  {
    q: "What happens after I submit the form?",
    a: "A strategist — a person, not an autoresponder — replies within one business day to learn about your goals and book a convenient time to talk.",
  },
  {
    q: "Is the consultation really free?",
    a: "Completely. Thirty minutes, no obligation, and you leave with a written scope and quote whether or not you decide to work with us.",
  },
  {
    q: "Do I need to know my budget already?",
    a: "It helps, but no. If you're unsure, we'll walk you through what similar projects cost so you can decide with real numbers rather than guesswork.",
  },
  {
    q: "Can we talk by phone instead?",
    a: "Of course — call +1 (833) 945-5567 during business hours, or leave a message and we'll call you back.",
  },
];
