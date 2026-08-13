export type PortfolioItem = {
  id: string;
  /** category slug — tabs are derived from the distinct values here */
  category: string;
  categoryLabel: string;
  /** Project/site name, used as the tile caption and in the alt text */
  title: string;
  /** What the work actually was, shown in the lightbox */
  kind: string;
  image: string;
  /** Intrinsic pixel size of the source screenshot (drives the lightbox) */
  width: number;
  height: number;
  /**
   * Aspect ratio for the grid tile. The website screenshots are full-page
   * captures up to 6749px tall — at natural proportions a single tile would be
   * taller than the viewport, so tiles crop to a window anchored at the top
   * (the recognisable part) and vary the ratio to keep the masonry rhythm.
   */
  aspect: string;
};

export type PortfolioCategory = { slug: string; label: string };

/**
 * Real delivered work, captured from the live rightclixs.com portfolio
 * (assets/images/portfolio/<category>/inner/N.png). Titles were read from the
 * screenshots themselves — the source markup's alt text is boilerplate and
 * describes the wrong projects, so it wasn't reusable.
 *
 * The upstream site groups everything under two headings, so these are the only
 * two genuine categories. Per the section spec, we don't invent extra tabs that
 * would have to be filled with stock imagery.
 */

/** Repeating tile ratios so a column of website captures isn't uniform. */
const WEB_ASPECTS = ["3/4", "4/5", "2/3"];

type Seed = { title: string; kind: string; w: number; h: number };

const WEBSITES: Seed[] = [
  { title: "Simply 2 Move", kind: "Moving & removals website", w: 960, h: 4115 },
  { title: "Exotic Stays", kind: "Hotel booking platform", w: 960, h: 4855 },
  { title: "HomeGuide Realty", kind: "Real estate listings portal", w: 960, h: 3065 },
  { title: "Tictock Watches", kind: "Luxury watch storefront", w: 960, h: 3014 },
  { title: "360 Collection", kind: "Watch e-commerce store", w: 960, h: 6749 },
  { title: "Tictock Watches — Categories", kind: "Multi-category watch store", w: 960, h: 3082 },
  { title: "Excellence Timepieces", kind: "Watch brand showcase", w: 960, h: 3653 },
  { title: "Tictock Watches — Storefront", kind: "Watch store homepage", w: 960, h: 2912 },
  { title: "Daily Eats London", kind: "Food delivery website", w: 960, h: 2740 },
  { title: "Euphoriumx", kind: "CBD oil e-commerce store", w: 960, h: 3414 },
  { title: "Euphorium Beauty", kind: "Cosmetics e-commerce store", w: 960, h: 2720 },
  { title: "VR Virtual Shop", kind: "VR hardware store", w: 960, h: 5400 },
];

const APPS: Seed[] = [
  { title: "Newsstand", kind: "News reader app", w: 960, h: 720 },
  { title: "Subscriptions Manager", kind: "Finance & subscriptions app", w: 960, h: 720 },
  { title: "Enjoy The World", kind: "Travel & experiences app", w: 960, h: 720 },
  { title: "Foodyland", kind: "Grocery delivery app", w: 960, h: 720 },
  { title: "Designer Inspiration", kind: "Colour & design discovery app", w: 960, h: 720 },
  { title: "Screen Summary", kind: "Screen-time tracking app", w: 960, h: 720 },
  { title: "My Mediateka", kind: "Music streaming app", w: 960, h: 607 },
  { title: "Total Payment", kind: "Payments & wallet app", w: 960, h: 733 },
  { title: "Smart Kitchen", kind: "Smart home control app", w: 960, h: 720 },
  { title: "Personal Trainers", kind: "Fitness coaching app", w: 960, h: 720 },
  { title: "Real Lamp", kind: "Lighting retail app", w: 960, h: 720 },
  { title: "Find Your Route", kind: "Cycling route planner app", w: 960, h: 720 },
];

const build = (
  seeds: Seed[],
  slug: string,
  label: string,
  file: string,
  aspectFor: (seed: Seed, i: number) => string,
): PortfolioItem[] =>
  seeds.map((s, i) => ({
    id: `${slug}-${i + 1}`,
    category: slug,
    categoryLabel: label,
    title: s.title,
    kind: s.kind,
    image: `/portfolio/${file}-${i + 1}.png`,
    width: s.w,
    height: s.h,
    aspect: aspectFor(s, i),
  }));

export const portfolioItems: PortfolioItem[] = [
  // Full-page captures: crop to a top-anchored window, ratio rotating for rhythm.
  ...build(
    WEBSITES,
    "websites",
    "Websites",
    "ecommerce",
    (_s, i) => WEB_ASPECTS[i % WEB_ASPECTS.length]!,
  ),
  // App showcases are already composed at display proportions, so each tile
  // takes the image's own ratio — nothing gets cropped.
  ...build(APPS, "mobile-apps", "Mobile Apps", "mobile-app", (s) => `${s.w}/${s.h}`),
];

/** Tabs are derived from the data — adding a category is adding items. */
export const portfolioCategories: PortfolioCategory[] = portfolioItems.reduce<PortfolioCategory[]>(
  (acc, item) => {
    if (!acc.some((c) => c.slug === item.category)) {
      acc.push({ slug: item.category, label: item.categoryLabel });
    }
    return acc;
  },
  [],
);

export const itemsByCategory = (slug: string): PortfolioItem[] =>
  portfolioItems.filter((i) => i.category === slug);
