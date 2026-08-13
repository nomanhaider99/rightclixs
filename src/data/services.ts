import {
  Palette,
  PenTool,
  LayoutDashboard,
  ShoppingCart,
  Wrench,
  Smartphone,
  Search,
  Share2,
  ShieldCheck,
  Clapperboard,
  Target,
  type LucideIcon,
} from "lucide-react";

/** An animated proof stat shown on the service page. */
export type ServiceOutcome = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

/** A concrete artefact the client actually receives. */
export type ServiceDeliverable = { title: string; desc: string };

export type ServiceFaq = { q: string; a: string };

export type Service = {
  /** URL-safe id used by app/services/[slug] and as a React key */
  slug: string;
  /** Display name shown in the wheel + detail panel + service page */
  name: string;
  /** Short, 1–3 sentence summary used by the wheel detail panel */
  description: string;
  /** Longer copy used on the individual service page */
  longDescription: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** "What's included" bullets shown on the individual service page */
  highlights: string[];
  /** Headline price, mirrored from the matching category in data/pricing.ts */
  startingAt: string;
  /** Matching category id in data/pricing.ts — drives the "see packages" link.
   *  Omitted for services that are always scoped and quoted individually. */
  pricingCategory?: string;
  /** Typical delivery window, shown as a hero chip */
  timeline: string;
  /** Three animated proof stats. See the accuracy note above `services`. */
  outcomes: ServiceOutcome[];
  /** What lands in the client's hands, beyond the headline deliverable */
  deliverables: ServiceDeliverable[];
  /** Self-qualifying "this is for you if…" lines */
  whoFor: string[];
  /** Objection-handling FAQ shown above the closing CTA */
  faqs: ServiceFaq[];
};

/**
 * Single source of truth for services. Powers:
 *  - the homepage Services "Option Wheel" + detail panel
 *  - app/services/[slug] dynamic pages (generateStaticParams)
 *  - the /services index cards
 * Keep this the only services list — do not fork a separate array elsewhere.
 *
 * NOTE ON `outcomes`: these figures are illustrative placeholders written to
 * demonstrate the layout. They are performance claims shown to prospective
 * customers, so replace them with numbers Rightclixs can actually evidence
 * before this goes live.
 */
export const services: Service[] = [
  {
    slug: "digital-marketing",
    name: "Digital Marketing Strategy",
    description:
      "Data-driven planning that aligns channels, goals and budgets for predictable, scalable business growth.",
    longDescription:
      "We build measurable growth systems — auditing your funnel, aligning paid, organic and owned channels to clear goals, and reporting on the numbers that actually move revenue. Every strategy is grounded in data, not guesswork.",
    icon: Target,
    highlights: [
      "Channel & budget strategy",
      "Funnel & conversion audits",
      "Performance dashboards",
      "Monthly growth reporting",
    ],
    startingAt: "Custom quote",
    timeline: "Roadmap in 2–3 weeks",
    outcomes: [
      { value: 182, prefix: "+", suffix: "%", label: "Average lead growth in year one" },
      { value: 34, suffix: "%", label: "Typical reduction in cost per acquisition" },
      { value: 30, suffix: " days", label: "To your first reported results" },
    ],
    deliverables: [
      {
        title: "Growth audit",
        desc: "A full read of your funnel, channels and spend — what's working, what's leaking, and what to stop doing.",
      },
      {
        title: "Channel & budget map",
        desc: "Where every dollar goes across paid, organic, social and email, tied to a target you agreed to.",
      },
      {
        title: "Live dashboard",
        desc: "One link showing traffic, leads, cost per acquisition and revenue — no waiting for a monthly PDF.",
      },
      {
        title: "Monthly strategy call",
        desc: "A working session with your strategist to review the numbers and reset priorities for the month.",
      },
    ],
    whoFor: [
      "You're spending on ads but can't tell which channel actually produces customers",
      "Traffic is fine, enquiries aren't — and nobody can explain the gap",
      "You want one plan across paid, organic and email instead of three disconnected ones",
    ],
    faqs: [
      {
        q: "How soon will we see results?",
        a: "You'll have the audit and roadmap inside three weeks. Paid channels can move within the first month; organic and content compound over three to six. We report on both from day one so you're never guessing.",
      },
      {
        q: "Do you need access to our ad accounts?",
        a: "Yes — read access to your ad platforms and analytics is enough to start. You keep ownership of every account and can revoke access at any point.",
      },
      {
        q: "Is there a minimum commitment?",
        a: "Strategy engagements run month to month after the initial roadmap. We'd rather earn the next month than lock you into a year.",
      },
    ],
  },
  {
    slug: "web-design",
    name: "Custom Website Design",
    description:
      "Distinctive, W3C-validated websites designed around your brand and engineered to convert visitors into customers.",
    longDescription:
      "Conceptual, conversion-focused design from 3-page starters to unlimited-page custom builds. Every layout is crafted around your brand, validated to W3C standards, and engineered to turn attention into enquiries.",
    icon: PenTool,
    highlights: [
      "Conversion-focused UX",
      "W3C-validated markup",
      "Responsive on every device",
      "Unlimited design revisions",
    ],
    startingAt: "$149",
    pricingCategory: "web-design",
    timeline: "Live in 2–4 weeks",
    outcomes: [
      { value: 2, suffix: "x", label: "Typical lift in enquiry rate after redesign" },
      { value: 98, suffix: "/100", label: "Average Lighthouse performance score" },
      { value: 100, suffix: "%", label: "W3C-validated markup on every build" },
    ],
    deliverables: [
      {
        title: "Custom design concepts",
        desc: "Real layouts built around your brand and content — never a recoloured template you'll recognise on someone else's site.",
      },
      {
        title: "Responsive build",
        desc: "Hand-checked on phones, tablets and desktop, so the layout holds up wherever your customers actually are.",
      },
      {
        title: "CMS handover",
        desc: "You can edit your own copy and images after launch, with a short walkthrough so nobody's afraid to touch it.",
      },
      {
        title: "Launch checklist",
        desc: "Analytics, search console, redirects, SSL and speed pass — all done before you go live, not after.",
      },
    ],
    whoFor: [
      "Your current site looks dated next to the competitors you're losing to",
      "You're embarrassed to send people to your own homepage",
      "You need to update your own content without emailing a developer",
    ],
    faqs: [
      {
        q: "What do you need from us to start?",
        a: "Your logo, any brand assets you have, and a rough idea of the pages you need. If you don't have copy yet, we'll work from a structure we propose and refine it with you.",
      },
      {
        q: "How many revisions do I get?",
        a: "Unlimited design revisions on the packages that state it. In practice most projects settle within two or three rounds because we agree direction before pixels.",
      },
      {
        q: "Do I own the site when it's finished?",
        a: "Completely. You own the design, the code and every account. There's no licence to keep paying and nothing held hostage if you leave.",
      },
    ],
  },
  {
    slug: "web-portal",
    name: "Web Portal Development",
    description:
      "Dating, job, social, real estate, medical and enterprise portals built with clean, module-wise architecture.",
    longDescription:
      "Complex, multi-role platforms — dating, job boards, social networks, media, real estate, medical and enterprise portals — delivered with a module-wise architecture that stays fast and maintainable as you scale.",
    icon: LayoutDashboard,
    highlights: [
      "Module-wise architecture",
      "Role-based access control",
      "Scalable data models",
      "Third-party integrations",
    ],
    startingAt: "$4,999",
    pricingCategory: "web-portal",
    timeline: "8–16 weeks",
    outcomes: [
      { value: 6, suffix: " roles", label: "Typical permission tiers modelled per portal" },
      { value: 99, suffix: ".9%", label: "Uptime target on managed hosting" },
      { value: 50, prefix: "", suffix: "k+", label: "Records handled without redesign" },
    ],
    deliverables: [
      {
        title: "Architecture blueprint",
        desc: "Data model, module boundaries and permission tiers agreed in writing before a line of code is written.",
      },
      {
        title: "Role-based admin",
        desc: "An admin area that matches how your team actually works, with each role seeing only what it should.",
      },
      {
        title: "Integration layer",
        desc: "Payments, messaging, maps, CRM or whatever your workflow depends on, wired in and documented.",
      },
      {
        title: "Staged releases",
        desc: "You review working software on a staging URL every two weeks, so nothing is a surprise at handover.",
      },
    ],
    whoFor: [
      "Your business logic is too specific for an off-the-shelf platform",
      "Different user types need genuinely different experiences and permissions",
      "You've outgrown spreadsheets and a patchwork of disconnected tools",
    ],
    faqs: [
      {
        q: "Can you take over a portal someone else started?",
        a: "Often yes. We start with a paid technical audit of the existing codebase and give you an honest read on whether it's cheaper to continue it or rebuild the weak modules.",
      },
      {
        q: "How do you handle scope on a project this size?",
        a: "The blueprint fixes the modules and the price. Anything new that comes up mid-build is quoted separately before it's started, so the budget never drifts quietly.",
      },
      {
        q: "What happens after launch?",
        a: "You can take the code and run, or keep us on a maintenance plan for hosting, monitoring, updates and a monthly pool of development hours.",
      },
    ],
  },
  {
    slug: "ecommerce",
    name: "E-commerce Solutions",
    description:
      "Carts, payment and shipping modules, inventory, multi-currency and secure customer login areas.",
    longDescription:
      "Full storefronts with carts, payment and shipping modules, inventory management, multi-currency support and secure customer accounts — built to sell around the clock and grow with your catalogue.",
    icon: ShoppingCart,
    highlights: [
      "Secure checkout & payments",
      "Inventory & order management",
      "Multi-currency support",
      "Customer account areas",
    ],
    startingAt: "$794",
    pricingCategory: "ecommerce",
    timeline: "Live in 4–8 weeks",
    outcomes: [
      { value: 27, suffix: "%", label: "Typical drop in cart abandonment" },
      { value: 3, suffix: "s", label: "Target page load on product pages" },
      { value: 24, suffix: "/7", label: "Storefront uptime monitoring" },
    ],
    deliverables: [
      {
        title: "Storefront build",
        desc: "Category, product and checkout pages designed around how people actually buy, not how catalogues are organised.",
      },
      {
        title: "Payments & shipping",
        desc: "Gateways, tax and shipping rules configured and test-ordered end to end before launch.",
      },
      {
        title: "Inventory workflow",
        desc: "Stock, variants and order statuses set up so your team can run the shop without calling us.",
      },
      {
        title: "Abandoned-cart recovery",
        desc: "Automated follow-up emails wired in from day one, because that's the cheapest revenue you'll ever recover.",
      },
    ],
    whoFor: [
      "You're selling through social DMs and manual invoices and it doesn't scale",
      "Your current store loses people somewhere between cart and payment",
      "You need multi-currency or multi-warehouse and your platform can't do it",
    ],
    faqs: [
      {
        q: "Which platform do you build on?",
        a: "We recommend based on your catalogue size, margins and team — usually WooCommerce or Shopify for most stores, custom when your logic genuinely warrants it. We'll tell you if custom is overkill.",
      },
      {
        q: "Can you migrate my existing products and customers?",
        a: "Yes. Products, variants, customers and order history migrate across, and we reconcile the counts with you before switching the domain over.",
      },
      {
        q: "Do you handle payment security?",
        a: "Checkout runs through PCI-compliant gateways, so card data never touches your server. SSL, secure headers and update policy are part of every build.",
      },
    ],
  },
  {
    slug: "web-maintenance",
    name: "Web Maintenance",
    description:
      "Hosting, SSL, backups, plugin updates, technical optimisation and ongoing strategic assistance.",
    longDescription:
      "Keep your site fast, secure and current. We handle hosting, SSL, backups, plugin and platform updates, technical optimisation and the strategic tweaks that keep your site performing month after month.",
    icon: Wrench,
    highlights: [
      "Hosting, SSL & backups",
      "Plugin & platform updates",
      "Security monitoring",
      "Priority support",
    ],
    startingAt: "$99",
    pricingCategory: "maintenance",
    timeline: "Onboarding in 48 hours",
    outcomes: [
      { value: 99, suffix: ".9%", label: "Uptime target, monitored around the clock" },
      { value: 4, suffix: "h", label: "Response time on priority issues" },
      { value: 30, suffix: " days", label: "Of restorable daily backups" },
    ],
    deliverables: [
      {
        title: "Managed hosting & SSL",
        desc: "Fast hosting, certificates renewed automatically, and someone who notices when something breaks before you do.",
      },
      {
        title: "Daily backups",
        desc: "Thirty days of restore points, tested — a backup nobody has ever restored isn't a backup.",
      },
      {
        title: "Update & security pass",
        desc: "Plugins, themes and core updated on a schedule, on staging first, so an update never takes your site down.",
      },
      {
        title: "Monthly health report",
        desc: "Uptime, speed, security events and what we changed — in plain English, not server logs.",
      },
    ],
    whoFor: [
      "Nobody at your company is sure who'd fix the site if it went down tonight",
      "Your site is running plugin versions from two years ago",
      "You want small content changes handled without hiring in-house",
    ],
    faqs: [
      {
        q: "Do you maintain sites you didn't build?",
        a: "Yes, after a short technical review. If the site has problems we won't be able to support, we'll tell you up front rather than take the retainer and hope.",
      },
      {
        q: "What counts as a small change?",
        a: "Copy edits, image swaps, new pages from existing templates and plugin troubleshooting. Larger design or feature work is quoted separately so your plan price stays predictable.",
      },
      {
        q: "Can I cancel?",
        a: "Any month, and you leave with your site, your hosting account and your backups. No exit fee and no hostage-taking.",
      },
    ],
  },
  {
    slug: "mobile-apps",
    name: "Mobile App Development",
    description:
      "iOS and Android products handled by a skilled team with care, professionalism and creativity.",
    longDescription:
      "Native and cross-platform iOS and Android apps designed and built for conversions and retention — handled end to end by a skilled team that treats your product with care, professionalism and creativity.",
    icon: Smartphone,
    highlights: [
      "iOS & Android builds",
      "Native-grade performance",
      "App store deployment",
      "Ongoing updates & support",
    ],
    startingAt: "Custom quote",
    timeline: "12–20 weeks",
    outcomes: [
      { value: 2, suffix: " stores", label: "iOS and Android from one codebase" },
      { value: 60, suffix: "fps", label: "Target interaction smoothness" },
      { value: 100, suffix: "%", label: "Submission support until you're approved" },
    ],
    deliverables: [
      {
        title: "Product definition",
        desc: "Screens, flows and a scoped v1 feature list — the fastest route to something real in users' hands.",
      },
      {
        title: "Design system",
        desc: "A reusable component set so version two doesn't mean redesigning everything from scratch.",
      },
      {
        title: "iOS & Android builds",
        desc: "One codebase, both stores, with platform conventions respected rather than a web page in a wrapper.",
      },
      {
        title: "Store submission",
        desc: "Listings, screenshots, privacy declarations and review responses handled until you're live.",
      },
    ],
    whoFor: [
      "Your customers are asking for an app and a mobile site isn't cutting it",
      "You need push notifications, offline use or device hardware",
      "You have a validated web product and want it in the app stores",
    ],
    faqs: [
      {
        q: "Native or cross-platform?",
        a: "Cross-platform for most products — one codebase, both stores, materially lower cost. We recommend native when you're leaning hard on device hardware or need absolute performance.",
      },
      {
        q: "What does app store approval involve?",
        a: "We prepare the listing, assets and privacy declarations, submit on your behalf and handle reviewer feedback. Approval usually takes a few days per store.",
      },
      {
        q: "What happens after launch?",
        a: "Apps need upkeep — OS releases break things. Ongoing plans cover compatibility updates, crash monitoring and a monthly pool of development hours.",
      },
    ],
  },
  {
    slug: "seo",
    name: "Search Engine Optimization",
    description:
      "Technical audits, keyword programmes, content and link acquisition with transparent monthly reporting.",
    longDescription:
      "Rank higher and attract qualified traffic through technical audits, keyword programmes, content optimisation and ethical link acquisition — all backed by transparent monthly reporting on the metrics that matter.",
    icon: Search,
    highlights: [
      "Technical SEO audits",
      "Keyword & content strategy",
      "Ethical link building",
      "Transparent monthly reports",
    ],
    startingAt: "$399",
    pricingCategory: "seo",
    timeline: "First results in 3–6 months",
    outcomes: [
      { value: 147, prefix: "+", suffix: "%", label: "Average organic traffic growth in year one" },
      { value: 40, suffix: "+", label: "Keywords tracked and reported monthly" },
      { value: 0, suffix: "", label: "Black-hat tactics that risk a penalty" },
    ],
    deliverables: [
      {
        title: "Technical audit",
        desc: "Crawlability, speed, structure and indexing problems found and prioritised by what actually costs you traffic.",
      },
      {
        title: "Keyword programme",
        desc: "The terms your buyers use — with intent and difficulty mapped, not just whatever has the biggest volume.",
      },
      {
        title: "On-page & content work",
        desc: "Titles, structure and content improved or written against the keywords we agreed to target.",
      },
      {
        title: "Monthly reporting",
        desc: "Rankings, traffic and enquiries in one report, with what we did last month and what's next.",
      },
    ],
    whoFor: [
      "Competitors outrank you for terms your customers actually search",
      "You've been burned by an agency that reported rankings but never leads",
      "You're paying for every click and want a channel that compounds",
    ],
    faqs: [
      {
        q: "How long until I rank?",
        a: "Technical fixes can show inside weeks. Competitive terms take three to six months of consistent work. Anyone promising page one in 30 days is either lucky or about to get you penalised.",
      },
      {
        q: "Do you guarantee first place?",
        a: "No, and neither can anyone else — nobody controls Google's ranking. We guarantee the work, the reporting and measurable movement on agreed metrics.",
      },
      {
        q: "Is the content written by AI?",
        a: "Content is written and edited by people against a brief you approve. We'd rather publish fewer pages that rank than volume that gets filtered out.",
      },
    ],
  },
  {
    slug: "social-media",
    name: "Social Media Marketing",
    description:
      "Account setup, editorial calendars, community management and paid boosting across platforms.",
    longDescription:
      "Grow your audience and build trust with account setup, editorial calendars, community management and paid boosting — social content engineered to drive real engagement across every platform that matters to you.",
    icon: Share2,
    highlights: [
      "Editorial calendars",
      "Community management",
      "Paid campaign boosting",
      "Creative content design",
    ],
    startingAt: "$249",
    pricingCategory: "smm",
    timeline: "Posting within 2 weeks",
    outcomes: [
      { value: 3, suffix: "x", label: "Typical lift in engagement rate" },
      { value: 20, suffix: "+", label: "Designed posts per month" },
      { value: 1, suffix: " day", label: "Response time on community messages" },
    ],
    deliverables: [
      {
        title: "Content calendar",
        desc: "A month of posts planned and approved in advance, so nothing gets published in a panic on a Friday.",
      },
      {
        title: "Designed creative",
        desc: "On-brand graphics and short-form video cut for each platform's format, not one image reposted everywhere.",
      },
      {
        title: "Community management",
        desc: "Comments and DMs answered in your voice, with anything that smells like a sales lead routed to you fast.",
      },
      {
        title: "Paid boosting",
        desc: "Budget put behind the posts that are already working, with reporting on what it returned.",
      },
    ],
    whoFor: [
      "Your accounts have gone quiet and it's starting to look abandoned",
      "You post consistently but it never turns into enquiries",
      "Nobody internally has time to answer comments and DMs properly",
    ],
    faqs: [
      {
        q: "Which platforms should we be on?",
        a: "Only the ones your buyers use. For most clients that's two done properly rather than five done badly — we'll recommend after looking at your audience.",
      },
      {
        q: "Do you write the captions too?",
        a: "Yes — copy, hashtags and creative are all included. You approve the calendar before anything is scheduled.",
      },
      {
        q: "Is ad spend included in the price?",
        a: "No, ad budget is paid directly to the platform so you keep control and full visibility. Our fee covers strategy, creative and management.",
      },
    ],
  },
  {
    slug: "orm",
    name: "Online Reputation Management",
    description:
      "Brand audits, review management, listings and search-term monitoring across platforms.",
    longDescription:
      "Protect and strengthen how your brand shows up online. We run brand audits, manage reviews and listings, and monitor search terms across platforms so the story people find is the one you want them to.",
    icon: ShieldCheck,
    highlights: [
      "Brand & review audits",
      "Review management",
      "Listings & citations",
      "Search-term monitoring",
    ],
    startingAt: "$150",
    pricingCategory: "orm",
    timeline: "First audit in 5 days",
    outcomes: [
      { value: 5, suffix: " days", label: "To your first full reputation audit" },
      { value: 40, suffix: "+", label: "Directories and listings kept consistent" },
      { value: 24, suffix: "/7", label: "Monitoring on your brand terms" },
    ],
    deliverables: [
      {
        title: "Reputation audit",
        desc: "Exactly what a customer finds when they search your name — reviews, listings, mentions and the gaps.",
      },
      {
        title: "Review programme",
        desc: "A simple system that asks happy customers at the right moment, so good reviews stop being accidental.",
      },
      {
        title: "Listings cleanup",
        desc: "Name, address, phone and hours made consistent everywhere, which helps local search as much as trust.",
      },
      {
        title: "Alerts & monitoring",
        desc: "You hear about a bad review or a new mention from us, not from a customer three weeks later.",
      },
    ],
    whoFor: [
      "One bad review is sitting near the top of your search results",
      "Your business details are wrong or contradictory across directories",
      "You get great feedback in person but almost none of it online",
    ],
    faqs: [
      {
        q: "Can you remove a negative review?",
        a: "Only if it genuinely violates a platform's policy, and we'll pursue that where it applies. Otherwise the effective route is responding well and outweighing it with real recent reviews.",
      },
      {
        q: "Do you write fake reviews?",
        a: "Never. It's against every platform's terms, it's illegal in many places, and it's the fastest way to lose the listing entirely. We build genuine review volume instead.",
      },
      {
        q: "How fast does this work?",
        a: "Listings and responses can be fixed in the first month. Shifting what ranks on page one for your brand name typically takes three to six months of consistent activity.",
      },
    ],
  },
  {
    slug: "video-animation",
    name: "Video Animation",
    description:
      "30 to 120 second explainers with script, storyboard, VFX, foley and professional voice over.",
    longDescription:
      "Explainers and brand films from 30 to 120 seconds — script, storyboard, animation, VFX, foley and professional voice over — crafted to communicate your value in the few seconds you have someone's attention.",
    icon: Clapperboard,
    highlights: [
      "Script & storyboard",
      "2D / 3D animation",
      "VFX & sound design",
      "Professional voice over",
    ],
    startingAt: "$399",
    pricingCategory: "video",
    timeline: "3–5 weeks",
    outcomes: [
      { value: 120, suffix: "s", label: "Maximum runtime — long enough to explain, short enough to watch" },
      { value: 4, suffix: " formats", label: "Cut for web, social, vertical and presentations" },
      { value: 100, suffix: "%", label: "Ownership of the finished master files" },
    ],
    deliverables: [
      {
        title: "Script & storyboard",
        desc: "The story locked and signed off in cheap form, before expensive animation hours are spent on it.",
      },
      {
        title: "Animation",
        desc: "2D or 3D in your brand's colours and type, at the length that suits the message rather than the package.",
      },
      {
        title: "Voice & sound",
        desc: "Professional voice over, music and foley mixed so it sounds finished, not like a slideshow with a backing track.",
      },
      {
        title: "Multi-format delivery",
        desc: "Widescreen, square and vertical cuts plus source files, so one video works everywhere you need it.",
      },
    ],
    whoFor: [
      "Your product takes five minutes to explain and people don't give you five minutes",
      "Your homepage needs something that holds attention above the fold",
      "You're pitching investors or buyers and slides aren't landing it",
    ],
    faqs: [
      {
        q: "Who writes the script?",
        a: "We do, from a briefing call and your existing material. You approve the script and storyboard before animation starts — that's where changes are cheap.",
      },
      {
        q: "Can we choose the voice?",
        a: "Yes. We'll send a shortlist of voice artists matched to your brand and territory, and you pick before recording.",
      },
      {
        q: "What if we need changes after delivery?",
        a: "Revision rounds are included per package. Beyond those, edits are quoted hourly — and because you own the source files, you're never locked to us for future changes.",
      },
    ],
  },
  {
    slug: "branding",
    name: "Branding & Identity",
    description:
      "Logo systems, stationery, print collateral and brand guidelines with full ownership rights.",
    longDescription:
      "A memorable identity that builds lasting trust — logo systems, stationery, print collateral and complete brand guidelines, all delivered with full ownership rights so your brand is unmistakably yours.",
    icon: Palette,
    highlights: [
      "Logo & identity systems",
      "Brand guidelines",
      "Print & stationery",
      "Full ownership rights",
    ],
    startingAt: "$79",
    pricingCategory: "branding",
    timeline: "2–4 weeks",
    outcomes: [
      { value: 100, suffix: "%", label: "Ownership and copyright transferred to you" },
      { value: 3, suffix: "+", label: "Distinct concepts, not variations of one idea" },
      { value: 12, suffix: "+", label: "File formats for print, web and signage" },
    ],
    deliverables: [
      {
        title: "Logo system",
        desc: "Primary, stacked, icon and single-colour versions — because one logo file never survives real-world use.",
      },
      {
        title: "Brand guidelines",
        desc: "Colour, type, spacing and usage rules so your brand still looks like itself when someone else designs for it.",
      },
      {
        title: "Stationery & collateral",
        desc: "Cards, letterheads and the print pieces you actually hand to customers, set up correctly for press.",
      },
      {
        title: "Full file handover",
        desc: "Vector source, print and web exports, plus written confirmation that the copyright is yours.",
      },
    ],
    whoFor: [
      "Your logo was made quickly years ago and it's held together with goodwill",
      "Every document from your team looks like it came from a different company",
      "You're about to launch and want to look established from day one",
    ],
    faqs: [
      {
        q: "How many concepts will we see?",
        a: "At least three genuinely different directions, not one idea in three colours. You'll give feedback on all of them before we refine the one you choose.",
      },
      {
        q: "Do we own the logo outright?",
        a: "Yes — full copyright and ownership transfer on final payment, with the vector source files. There's no ongoing licence.",
      },
      {
        q: "Can you match an existing brand?",
        a: "Absolutely. Plenty of clients come for collateral and guidelines around a logo they already have and want to keep.",
      },
    ],
  },
];

export const getService = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
