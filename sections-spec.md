# Rightclixs — Homepage "Services" Section Spec

> This is a revamp of rightclixs.com. Handoff doc for Claude Code. Sections
> will be added one at a time as they're designed. This is Section 1:
> **Services (Option Wheel)**.

**Stack context:** Next.js 15 App Router, GSAP, Tailwind, Playfair Display
(headings) / Inter (body), magenta/blush-pink palette, existing
`app/services/[slug]/page.tsx` dynamic routes driven by an 11-item service
data file, all CTAs open the shared `ContactDialog`.

---

*(Note: this doc previously referred to this project as "Xeno Web Agency" —
it has been corrected below. The site being revamped is **Rightclixs**.)*

## 1. Section: Services ("Option Wheel")

### 1.1 Section Heading

- Follows the same heading treatment used in other homepage sections (same
  eyebrow label + Playfair Display headline pattern — reuse the existing
  `SectionHeading` component if one exists, don't invent a new heading style).
- Eyebrow (small uppercase label above headline): `Our Services`
- Headline: **"Check Out Services We Offer"**
- Optional one-line subtext under the headline, in Inter, muted color:
  short line reinforcing breadth of services (e.g. "From first click to final
  launch — everything your brand needs online.") — copy to be finalized,
  keep it brief and punchy per existing site voice.
- Centered, standard section top-padding matching other sections.

### 1.2 Layout — Two Columns, Connected

Desktop (≥1024px): **50/50 split**, single row, vertically centered as a
unit within the section.

```
┌───────────────────────────────┬─────────────────────────────────┐
│                                │                                 │
│      LEFT: Option Wheel        │      RIGHT: Active Service      │
│      (scrollable list of       │      Detail Panel               │
│       service names)           │      (heading + description     │
│                                 │       + CTA, changes on scroll) │
│                                │                                 │
└───────────────────────────────┴─────────────────────────────────┘
```

- The two columns are visually/behaviorally **connected**: scrolling or
  interacting with the wheel on the left drives what renders on the right.
  There is no independent scroll on the right panel — it's reactive state,
  not its own scroll container.
- A thin vertical divider (1px, low-opacity border color from theme) between
  columns is acceptable if it matches other split-layout sections on the
  site; omit if no precedent exists elsewhere.
- Section as a whole should be pinned/sticky while the wheel scrolls through
  all services, similar in spirit to reactbits' Option Wheel demo — i.e. the
  right panel content updates in place rather than the page scrolling past
  it, unless GSAP ScrollTrigger pinning proves janky on mobile, in which case
  fall back to normal in-flow scroll on mobile only (see §1.6).

### 1.3 Left Column — Option Wheel Component

Base reference: https://reactbits.dev/components/option-wheel — adapt, don't
copy verbatim; must match Rightclixs' theme and use GSAP (already in the
stack) rather than introducing a new animation library if the ReactBits
version depends on one the project doesn't already use.

**Data source:** the existing services data file (the same one powering
`app/services/[slug]/page.tsx`) — do not hardcode a separate list. Pull
`name`, `slug`, short `description`, and `icon` (if present) from there so
the wheel and the detail panel and the service pages all stay in sync.

**Visual behavior (from the reference image):**
- Vertical list of all service names, one per row, generous line-height.
- The item nearest the vertical center of the wheel's viewport is rendered
  **full opacity, full size, bold weight** (the "active" item).
- Items further from center progressively:
  - lose opacity (fade toward the background color, not to pure transparent
    — should still be legible as "upcoming" options)
  - blur (small `filter: blur()` increasing with distance from center)
  - optionally scale down slightly (subtle, not cartoonish)
- Effect should read as a "focus falloff" — like the reference screenshot's
  blurred surrounding genre names around a crisp "Jazz" in the center.

**Interaction:**
- Primary interaction is scroll (mouse wheel / trackpad / touch drag) within
  the wheel's bounds — scrolling advances which service is centered/active.
- Each service name in the wheel is also directly **clickable/tappable** —
  clicking a name (even a blurred, off-center one) snaps the wheel to center
  that item and updates the right panel. This must work for keyboard/tap
  users, not just scroll — accessibility requirement, not optional polish.
- Snapping: after a scroll gesture ends, the wheel eases (GSAP, not CSS
  scroll-snap alone — needs the blur/scale/opacity to animate in sync) to
  center the nearest item. No item should ever sit "between" two centered
  states at rest.
- Looping: decide whether the wheel loops infinitely (last item scrolls back
  to first) or hard-stops at both ends. Recommend **hard stop** for an 11
  item list — infinite loop adds complexity with little UX benefit at this
  count.
- Keyboard support: when the wheel (or its container) has focus, Up/Down
  arrow keys move the active item by one, same easing as scroll-driven
  snapping.

**Progress indicator (nice-to-have, include if time allows):** a subtle
side rail of small dots/ticks (one per service) next to the wheel, with the
active one highlighted, so users have a sense of position in the list beyond
the text itself.

### 1.4 Right Column — Active Service Detail Panel

Renders the currently-active service from the wheel. Content, top to
bottom:

1. **Small icon or number/index** (e.g. "02" or the service's icon) — quiet,
   secondary to the heading.
2. **Service name as heading** — Playfair Display, matches the weight/size
   used for sub-headings elsewhere on the site (not as large as the main
   section headline).
3. **Short description** — 1–3 sentences, Inter, from the service data file.
   Card-like treatment is fine (subtle background surface, rounded corners,
   padding) if it matches other content cards on the site — otherwise plain
   text block is acceptable; prioritize consistency with existing components
   over inventing a new card style.
4. **CTA button** — routes to `app/services/[slug]` for that service (primary
   action), OR opens `ContactDialog` (secondary action) — confirm which
   pattern the rest of the site uses for service-level CTAs and match it
   exactly. If both exist elsewhere (e.g. "Learn More" → service page, "Get
   Started" → ContactDialog), include both here too.

**Transition between services:** when the wheel's active item changes, the
right panel content must animate out and the new content in — not an
instant swap. Suggested GSAP treatment: outgoing content fades + shifts up
~12–16px while incoming content fades + shifts up from ~12–16px below,
staggered slightly (icon → heading → description → CTA) so it doesn't feel
like a flat crossfade. Keep transitions fast (200–350ms range) since this
fires on every scroll step — anything slower will feel laggy against rapid
scrolling.

### 1.5 Motion / Animation Requirements

- All motion via GSAP (already in stack) — no separate animation library.
- Section should animate in on scroll-into-view the first time (heading +
  wheel + panel entrance), consistent with how other sections on the
  homepage reveal themselves (reuse existing ScrollTrigger reveal pattern if
  one exists site-wide, don't create a bespoke entrance just for this
  section).
- Respect `prefers-reduced-motion`: fall back to instant/near-instant
  opacity-only transitions for both the entrance animation and the
  wheel-to-panel sync when the user has reduced motion enabled.
- No motion should block interaction — user must be able to rapidly scroll
  through all 11 items without animation queuing/backing up. Kill/overwrite
  in-flight tweens on new input rather than queuing them.

### 1.6 Responsive Behavior

- **Desktop (≥1024px):** side-by-side as described above, pinned section
  while scrolling through the wheel.
- **Tablet (768–1023px):** side-by-side may compress (e.g. 40/60 or stacked
  if the wheel feels cramped) — use judgment, but keep both columns visible
  simultaneously if possible.
- **Mobile (<768px):** stack vertically — wheel on top (shorter viewport
  height, e.g. 3–4 visible rows instead of desktop's larger list), detail
  panel below it, updating live as the user scrolls the wheel. Do not pin
  the whole section on mobile if it fights the page's natural scroll (see
  §1.2 fallback note) — a self-contained scrollable wheel component (fixed
  height, internal scroll) is preferable to a full-page pin on small
  screens.
- Touch: wheel must support touch-drag scrolling with the same
  snap-to-center behavior as desktop wheel/trackpad scroll.

### 1.7 Accessibility

- Wheel items are real focusable, clickable elements (buttons or links with
  `role`/`aria` as appropriate) — not divs with only a click handler.
- Active item should be announced via `aria-current` or equivalent so
  screen reader users know which service is selected.
- Right panel content changes should not require the screen reader user to
  re-navigate the whole page — consider an `aria-live="polite"` region
  around the panel, or ensure focus management doesn't trap/jump unexpectedly.
- Color contrast for the "active" (full-opacity) wheel item must meet AA
  against the background; blurred/faded items are decorative/secondary and
  exempt, but should still be readable enough to convey "there's more here."

### 1.8 Open Questions for Noman (resolve before/while building)

1. Does the site currently have a shared `SectionHeading` component and a
   shared scroll-reveal pattern? If yes, reuse both rather than rebuilding.
2. Confirm the exact CTA pattern used elsewhere for services ("Learn More"
   → service page vs. "Get Started" → `ContactDialog`, or both).
3. Should the section pin on desktop (reactbits-style scroll-jacking) or
   scroll normally with the wheel just being an internally-scrollable
   component? Pinning is closer to the reference but has more failure modes
   (trackpad speed, browser zoom, nested scroll containers) — flag as a
   decision point, not an assumption.
4. Final subtext copy under the headline (draft provided above, not final).

---

---

## 2. Section: Portfolio (Tabs + Masonry)

### 2.1 Section Heading

- Same heading treatment as the Services section (§1.1) and the rest of the
  site — reuse the shared `SectionHeading` component, don't create a new
  style.
- Eyebrow: `Our Work` (or similar — match the short, punchy eyebrow pattern
  used elsewhere).
- Headline: something like **"See the Work Behind the Results"** — copy to
  be finalized, keep consistent with the site's voice.
- Optional short subtext under the headline, same treatment as §1.1.

### 2.2 Layout

Single column, full-width within the section container:

```
┌───────────────────────────────────────────────────────────────┐
│                         Section Heading                        │
├───────────────────────────────────────────────────────────────┤
│   [ Ecommerce ] [ Dentist ] [ Fashion ] [ Food ] [ Restaurant ] …│  ← Tabs
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│                     Masonry Grid of Screenshots                │
│                     (content swaps per active tab)             │
│                                                                 │
├───────────────────────────────────────────────────────────────┤
│                      [ Animated CTA Button ]                    │
└───────────────────────────────────────────────────────────────┘
```

- Tabs row sits directly under the heading, horizontally centered (or
  left-aligned if that's the site's existing tab convention elsewhere —
  check before assuming centered).
- Below the tabs: the masonry grid for whichever category tab is active.
- Below the grid: a single animated CTA button, centered.

### 2.3 Tabs — Category Selector

**Categories** (examples given by Noman — finalize the full list against
actual portfolio work available): Ecommerce, Dentist, Fashion, Food,
Restaurant, and any other verticals with real screenshots to show (e.g.
Plumbing, HVAC, Real Estate, Law — cross-reference against the "200+
Industries Transformed" list already on the site and Noman's actual
delivered projects; don't show a category tab with zero or placeholder
images behind it).

**Data source:** a portfolio data file (new, or extend an existing one if
the site already has a projects/portfolio array) shaped roughly as:

```ts
interface PortfolioItem {
  id: string;
  category: string; // e.g. "ecommerce", "dentist", "fashion"
  title: string; // project/site name
  image: string; // high-res screenshot path
  url?: string; // live site link, if shareable
}
```

Tabs are derived from the distinct `category` values present in this data —
not hardcoded separately from the data, so adding a new category is just
adding items to the array.

**Interaction:**
- Click/tap a tab to switch the active category.
- Active tab gets clear visual distinction (matches whatever tab/pill style
  convention already exists on the site — underline, filled pill, color
  change, etc. — reuse it rather than inventing a new tab style).
- Keyboard accessible: tabs are a proper tab list (`role="tablist"` /
  `role="tab"` / `role="tabpanel"`, arrow-key navigation between tabs per
  the standard ARIA tabs pattern) — not just styled buttons with no
  semantics.
- Switching tabs must animate the grid content change (see §2.5) — no
  instant hard swap.

### 2.4 Content — Masonry Grid (per reactbits.dev/components/masonry)

- Base reference: https://reactbits.dev/components/masonry — adapt to
  Xeno/Rightclixs' theme (colors, radius, shadow style matching other cards
  on the site) and GSAP for entrance/transition animation, same rule as the
  Option Wheel: don't pull in a new animation dependency if the reference
  implementation uses one the project doesn't already have.
- Grid shows **high-quality screenshots** of real delivered work for the
  active category — full-page or above-the-fold screenshots of the actual
  sites/dashboards built (e.g. a dentist site's homepage, an ecommerce
  store's product page, a dashboard UI, etc.).
- Masonry (variable-height) layout, not a fixed-aspect grid — let each
  screenshot's natural proportions determine its column span/height per the
  reactbits pattern.
- Each grid item on hover (desktop) should reveal a light overlay with the
  project title (and category, if useful) — subtle, consistent with any
  existing hover-card treatment on the site. On touch devices, no hover
  state is available, so title captions should be visible by default or on
  tap.
- Clicking an item: either opens the live project URL (if shareable and
  Noman is fine linking out) or opens a lightbox/larger preview — confirm
  which behavior is wanted (see §2.7 open questions). Default assumption
  unless told otherwise: click opens the live site in a new tab.
- Images: use Next.js `<Image>` with proper `sizes`, lazy loading below the
  fold, and compressed/optimized screenshot assets — this grid will be
  image-heavy, so performance (CLS, LCP) matters more here than almost
  anywhere else on the page. Reserve layout space (explicit width/height or
  aspect-ratio) so images don't shift the masonry layout as they load.

### 2.5 Motion / Animation Requirements

- Tab switch → grid content change should animate, not hard-swap:
  outgoing images fade + scale down slightly and exit (staggered, fast),
  incoming images for the new category fade + scale up and enter
  (staggered by grid position — e.g. top-left to bottom-right cascade).
  Keep the whole transition short (300–500ms range) so switching between 5+
  tabs in a row still feels responsive.
- Initial entrance: when the Portfolio section scrolls into view, tabs and
  the first category's grid animate in once, consistent with the site's
  existing scroll-reveal pattern (same one reused in §1.5).
- Respect `prefers-reduced-motion` — fall back to opacity-only, near-instant
  transitions for both tab switching and scroll-entrance.
- Kill/overwrite in-flight tweens if a user rapidly clicks through tabs —
  never let animations queue up and lag behind clicks.

### 2.6 CTA Button (Below Grid)

- Single centered button under the masonry grid, present regardless of
  which tab is active (not per-category).
- Copy: something like **"See Full Portfolio"** or **"Start Your Project"**
  — confirm intent: does it link to a dedicated `/portfolio` page, or open
  `ContactDialog` like other CTAs on the site? (See §2.7.)
- "Animated" per Noman's request — should match whatever CTA button motion
  convention already exists elsewhere on the site (hover fill/slide effect,
  icon micro-interaction, etc.) rather than introducing a new one-off button
  style just for this section. If no existing animated-button pattern
  exists yet, keep it simple: hover scale/color shift + a subtle
  arrow-nudge on hover, GSAP-driven.

### 2.7 Responsive Behavior

- **Desktop (≥1024px):** tabs in a single horizontal row; masonry grid at
  full column count (e.g. 3–4 columns depending on image sizing).
- **Tablet (768–1023px):** tabs may wrap to two rows if there are enough
  categories; masonry drops to 2–3 columns.
- **Mobile (<768px):** tabs become a horizontally scrollable strip
  (swipeable, with a subtle edge-fade to hint more tabs exist off-screen)
  rather than wrapping into a cramped multi-row block; masonry drops to a
  single column (still masonry-style variable height, just stacked).

### 2.8 Accessibility

- Tabs follow the standard ARIA tabs pattern (see §2.3) — screen reader
  users get proper role/state announcements when switching categories.
- Grid images need descriptive `alt` text (e.g. "Homepage screenshot —
  [Client/Project name] dentist website"), not generic "portfolio image"
  alt text.
- Color contrast for active vs. inactive tab states must meet AA.
- If clicking a grid item opens a new tab to a live client site, indicate
  this to assistive tech (e.g. visually-hidden "opens in new tab" text).

### 2.9 Open Questions for Noman (resolve before/while building)

1. Final category list — which verticals actually have real, high-quality
   screenshots ready to use? Don't launch a tab with placeholder or stock
   images.
2. Clicking a grid item: open the live site in a new tab, or open a
   lightbox/modal with a larger preview (and no outbound link)?
3. CTA button destination: dedicated `/portfolio` page, or `ContactDialog`?
4. Do you have an existing tab-list component/style anywhere on the current
   Rightclixs site (old or new build) to match, or is this the first tabs
   UI on the site?
5. Screenshot sourcing: are these client site screenshots being captured
   fresh (and at what resolution/device viewport), or do assets already
   exist from prior portfolio pages (the site's existing `portfolio.php` had
   category galleries — reuse those images if quality is high enough)?

---

---

## 3. Section: Process (Cycle Steps)

### 3.1 Section Heading

- Same heading treatment as §1.1 / §2.1 — reuse the shared `SectionHeading`
  component.
- Eyebrow: `Our Process` (or similar, matching the site's short eyebrow
  pattern).
- Headline: something like **"How We Bring Your Project to Life"** — copy to
  be finalized, keep consistent with the site's voice.
- Optional short subtext under the headline, same treatment as prior
  sections.

### 3.2 Layout — The Cycle

Five steps, shown **in order, one after another**, framed as a cycle/loop
rather than a flat linear list:

```
Discuss → Ideas → Design → Dev → Launch
   ↑                                │
   └────────────── (loop) ──────────┘
```

- "Cycle" here means the visual treatment should communicate an ongoing
  process (e.g. connected by a continuous path/line, or the last step
  visually gesturing back toward the first — a curved connector, an arrow
  looping back, or a circular/orbit layout) rather than five disconnected
  boxes in a row. Doesn't need to be a literal closed circle if that fights
  a horizontal section layout — a connecting line/path threading through
  all five steps left-to-right, with a subtle "repeats" visual cue at the
  end (e.g. a looping arrow back to step 1, or a "the process starts again
  at launch" microcopy note) satisfies the "cycle" framing.
- **Desktop:** horizontal step sequence, steps connected by a line/path
  running underneath or through them (progress-line style). Each step is a
  node on that path: icon or number, step name, one-line description.
- **Mobile:** vertical step sequence, same connecting line running down the
  left side, steps stacked top to bottom.

### 3.3 The Five Steps

| # | Step | One-line description (draft — finalize copy) |
|---|--------|----|
| 1 | Discuss | Understanding your business, goals, and what success looks like. |
| 2 | Ideas | Brainstorming concepts and strategy before anything gets built. |
| 3 | Design | Crafting the look, feel, and user experience. |
| 4 | Dev | Building it out — clean, fast, and functional. |
| 5 | Launch | Shipping it live and handing over a site that works. |

- Each step: small icon (per step, distinct), step number, step name
  (short, bold), one-line description (muted, smaller text).
- Data-driven from a small array (not hardcoded JSX per step) so copy/order
  can be edited without touching layout code:

```ts
interface ProcessStep {
  id: string;
  step: number;
  name: string; // "Discuss"
  description: string; // one-liner
  icon: string; // icon name/path
}
```

### 3.4 Animation — "Show Cycle One by One"

This is the core interaction Noman asked for: steps reveal **in sequence**,
not all at once.

- On scroll-into-view (ScrollTrigger), steps animate in **one at a time**,
  left to right (or top to bottom on mobile) — each step's icon, name, and
  description fade/scale in, and the connecting line segment leading into
  that step **draws in** (stroke-dashoffset animation or similar) just
  before/as the step appears, so it reads as the path progressively
  extending through each stage rather than a static line that was always
  there.
- Suggested sequencing: line segment draws → step icon pops in → step name
  fades up → description fades up, per step, then move to the next step's
  line segment. Keep each step's reveal fast (~150–250ms per step) so five
  steps completing feels snappy, not like a 3-second wait to see the whole
  section.
- After all five steps have revealed, a subtle looping cue animates once
  (e.g. a small dot/arrow travels from Launch back toward Discuss along a
  return path, or the connecting line pulses) to reinforce "this is a cycle,
  not a one-time flow" — keep this understated, not a repeating/looping
  animation that runs forever and distracts from content below.
- If ScrollTrigger pinning is used to hold the section in place while steps
  reveal (similar to how §1 handles the Option Wheel), apply the same
  caution from §1.2/§1.6 — prefer a non-pinned, natural-scroll reveal here
  unless pinning is already proven to work well on mobile for the Services
  section, since pinning multiple sections on one page compounds scroll
  jank risk.
- Respect `prefers-reduced-motion`: skip the sequential draw-in and looping
  cue, show all five steps at once with a simple opacity fade only.

### 3.5 CTA Button (End of Section)

- Single centered animated CTA button after the five steps, same
  requirement as §2.6 — reuse whatever animated-button convention already
  exists on the site rather than a new one-off style.
- Copy: something like **"Start the Process"** or **"Let's Get Started"** —
  confirm destination: opens `ContactDialog`, or scrolls/links to a contact
  section/page. Match whatever pattern process/services CTAs use elsewhere.

### 3.6 Responsive Behavior

- **Desktop (≥1024px):** horizontal 5-step path, full width of the section
  container, evenly spaced.
- **Tablet (768–1023px):** horizontal path may compress step spacing/hide
  descriptions until the step is active/hovered if 5 full steps don't fit
  comfortably — use judgment; wrapping to a 3+2 grid is also acceptable if
  a horizontal path gets too cramped.
- **Mobile (<768px):** vertical stacked path, connecting line runs down the
  left edge, same one-at-a-time scroll-reveal behavior per step as it
  enters the viewport.

### 3.7 Accessibility

- Steps are in a real ordered list (`<ol>`) semantically, even though
  styled as a custom path/graphic — screen readers should get "step 1 of 5:
  Discuss" style context.
- Decorative connecting-line/path SVGs marked `aria-hidden="true"`; the
  actual step content (name + description) is what's exposed to assistive
  tech.
- Motion must respect `prefers-reduced-motion` per §3.4 — no exceptions,
  since this section is animation-heavy by design.

### 3.8 Open Questions for Noman (resolve before/while building)

1. Final copy for each step's one-line description (draft provided in
   §3.3, not final).
2. Should the "cycle" visual be a literal loop shape (circular/orbit layout)
   or a horizontal path with a "return to start" cue at the end? Literal
   circles are harder to make readable at 5 steps + descriptions — flagging
   as a decision point.
3. CTA destination and copy — same question as other sections: which
   existing CTA pattern does this map to?
4. Icon set — using an existing icon library already in the project (e.g.
   Lucide, since it's common in this stack) or custom icons per step?

---

---

## 4. Section: Pricing (Tabs + Glowing Cards)

### 4.1 Section Heading

- Same heading treatment as prior sections — reuse `SectionHeading`.
- Eyebrow: `Pricing` (or similar).
- Headline: something like **"Pricing That Fits Your Project"** — copy to
  be finalized, consistent voice with other sections.
- Optional short subtext, same treatment as prior sections.

### 4.2 Layout

Same overall shape as the Portfolio section (§2.2) — heading, then tabs,
then tab-driven content, then... but here each tab's content is a **row of
pricing cards** instead of a masonry grid:

```
┌───────────────────────────────────────────────────────────────┐
│                         Section Heading                        │
├───────────────────────────────────────────────────────────────┤
│  [ Web Design ] [ E-commerce ] [ SEO ] [ Branding ] [ Video ] …│  ← Tabs
├───────────────────────────────────────────────────────────────┤
│    ┌──────────┐   ┌──────────┐   ┌──────────┐                  │
│    │  Card 1  │   │  Card 2  │   │  Card 3  │   ...            │
│    │ (glow)   │   │ (glow)   │   │ (glow)   │                  │
│    └──────────┘   └──────────┘   └──────────┘                  │
└───────────────────────────────────────────────────────────────┘
```

### 4.3 Tabs — Pricing Category Selector

- Reuses the exact same tab component/pattern built for Portfolio (§2.3) —
  same ARIA tabs semantics, same active-state styling, same
  scrollable-strip behavior on mobile. Don't build a second tab component;
  the Pricing tabs and Portfolio tabs should be the same underlying
  component with different data fed in.
- **Categories:** map to the site's actual service/pricing groups already
  scraped into the pricing data (Web Design, E-commerce, Web Portal, Web
  Maintenance, SEO, Social Media Marketing, ORM, Branding, Video Animation,
  Combo Packages). That's 10 categories, which may be too many tabs to show
  well at once — see §4.9 open question on whether to trim to the most
  commonly requested categories for the homepage (with a "View All Pricing"
  link to a full `/pricing` page for the rest) or show all 10 in a
  scrollable strip.
- Switching tabs swaps which set of pricing cards is shown below — same
  animated swap requirement as Portfolio (§4.5).

### 4.4 Pricing Cards

**Data source:** the pricing data already structured (see the
`PricingPackage` / `allPricing` arrays already built) — cards render
directly from that, keyed by the active tab's category. Each card:

1. **Package name** (e.g. "Gold Package", "Professional E-Commerce
   Package") — bold, prominent.
2. **Price** — large, prominent. If the package has an `originalPrice`
   (struck-through "was" price), show both: original struck through in
   muted color, current price large and bold next to/below it.
3. **Billing basis label** if relevant (one-time / monthly / per-term) —
   small, muted, next to the price.
4. **Feature list** — bullet/checkmark list of included features. Given how
   long some of these lists are (Titanium package has 30+ items), cards
   should **not** dump the entire raw list — show a curated top 6–8
   features per card with a "+X more" expandable toggle, or truncate
   visually with a "See full details" link/CTA that routes to a dedicated
   package detail view. Don't let a single feature-heavy card visually
   dominate/break the row height relative to its neighbors.
5. **CTA button** — e.g. "Get Started" or "Choose Plan" — opens
   `ContactDialog` pre-filled/aware of which package was selected, if that
   pattern exists elsewhere (e.g. the multi-step contact form wizard
   mentioned in project notes); otherwise routes to a general contact
   action. Confirm which.
6. **"Most Popular" / featured badge** on one card per category (optional,
   recommend using it — helps guide decision-making) — subtle ribbon or
   label, doesn't need to be present on every category if there's no clear
   "recommended" tier for that category.

**Card sizing/row behavior:**
- 3–4 cards per row on desktop depending on category size (some categories
  like Web Maintenance only have 2 packages, others like Web Design have 5)
  — grid should gracefully handle variable card counts per category, not
  assume a fixed 3-up layout always.
- Equal-height cards within a row regardless of feature-list length
  (enforced by the truncation rule in point 4 above) so the row doesn't
  look uneven.

### 4.5 Card Visual Treatment — Border Glow

- Base reference: https://reactbits.dev/components/border-glow — adapt to
  Rightclixs' theme; the glow color should use the site's accent/brand
  color (confirm exact hex/token — magenta/blush-pink per prior notes,
  unless Rightclixs' own brand palette differs from Xeno's and should be
  used instead — flag as open question, see §4.9).
- Glow should activate on **hover** (desktop) as the primary trigger,
  consistent with how a glow border typically works — animated gradient
  border that appears/intensifies on hover, not a static always-on glow on
  every card (that would be visually noisy across a full row of cards).
- The "Most Popular"/featured card, if used, may have a **persistent
  subtle** glow (lower intensity, always-on) to draw the eye even without
  hover, with the hover state intensifying it further — this differentiates
  the featured card from the rest without needing a redesign.
- On touch devices (no hover), consider a light one-time entrance glow
  pulse per card as it scrolls into view instead of relying on a hover state
  that touch users will never trigger.
- Glow animation should be GPU-friendly (avoid animating box-shadow blur
  radius directly if performance is a concern with many cards on screen at
  once — prefer the reactbits approach of an animated gradient/mask layer
  if that's how their implementation handles it).

### 4.6 Motion / Animation Requirements

- **Tab switch:** same staggered card-swap pattern as Portfolio's grid swap
  (§2.5) — outgoing cards fade/scale out, incoming cards for the new
  category fade/scale in, staggered left to right, fast (300–500ms range).
- **Scroll entrance:** cards animate in once when the section first scrolls
  into view, consistent with the site's existing reveal pattern.
- **Hover glow:** smooth transition in/out (not an abrupt on/off), GSAP or
  CSS transition depending on what reactbits' implementation uses and
  what's cheapest to adapt.
- Respect `prefers-reduced-motion`: disable the hover glow animation's
  movement (a static subtle border highlight is fine as the reduced-motion
  fallback) and skip staggered entrance/swap animations in favor of a
  simple opacity fade.

### 4.7 Responsive Behavior

- **Desktop (≥1024px):** 3–4 cards per row depending on category package
  count.
- **Tablet (768–1023px):** 2 cards per row, wrapping.
- **Mobile (<768px):** single column, cards stacked; tabs become the same
  horizontally scrollable strip pattern as Portfolio (§2.7).
- Glow effect should remain performant on mobile — if hover-glow doesn't
  apply (no hover), don't run any continuous glow animation on every
  visible card simultaneously on scroll; keep it to the one-time entrance
  pulse mentioned in §4.5.

### 4.8 Accessibility

- Tabs: same ARIA requirements as §2.8 (shared component).
- Price and package name must be in real text (not baked into an image),
  so screen readers and text search both work.
- Feature list truncation (§4.4 point 4) needs an accessible
  expand/collapse control (`aria-expanded` on the "+X more" toggle), not a
  purely visual CSS truncation that hides content from assistive tech.
- Glow border is decorative — must not interfere with focus-visible
  outlines on the CTA button or card itself; keyboard focus state should
  remain clearly visible independent of the glow effect.

### 4.9 Open Questions for Noman (resolve before/while building)

1. All 10 pricing categories on the homepage, or a trimmed set (most
   commonly requested: Web Design, E-commerce, SEO, Branding?) with a "View
   All Pricing" link to a dedicated `/pricing` page for the rest?
2. Confirm brand/accent color for the glow — same magenta/blush-pink used
   elsewhere on the existing build, or a distinct Rightclixs brand color if
   one exists separately from that palette?
3. CTA behavior: does selecting a package need to pass which package was
   chosen into `ContactDialog` (so the form pre-fills/knows context), or is
   it a generic "Get Started" with no package context carried over?
4. Should discounted packages' original/current price both display, or just
   the current price, to keep cards visually cleaner?
5. Feature list truncation — expand-in-place ("+X more" reveals inline) or
   link out to a full package detail page/section? Given several packages
   have 20–40 features, an inline expand could get long — a detail
   page/modal may be cleaner.

---

---

## 5. Section: Testimonials (Circular Gallery)

### 5.1 Section Heading

- Same heading treatment as prior sections — reuse `SectionHeading`.
- Eyebrow: `Testimonials` (or similar).
- Headline: something like **"What Our Clients Are Saying"** — copy to be
  finalized, consistent voice with other sections.
- Optional short subtext, same treatment as prior sections.

### 5.2 Layout

Single column, full-width within the section container:

```
┌───────────────────────────────────────────────────────────────┐
│                         Section Heading                        │
├───────────────────────────────────────────────────────────────┤
│                                                                 │
│                 Circular Gallery of Testimonials                │
│                  (draggable/scrollable carousel)                │
│                                                                 │
├───────────────────────────────────────────────────────────────┤
│                      [ Animated CTA Button ]                    │
└───────────────────────────────────────────────────────────────┘
```

### 5.3 Testimonial Cards — Circular Gallery

- Base reference: https://reactbits.dev/components/circular-gallery —
  adapt to Rightclixs' theme; this is a WebGL/canvas-driven curved carousel
  in the reactbits reference implementation (built on OGL), which is a new
  dependency the project likely doesn't already have — flag this explicitly
  rather than silently adding a WebGL library (see §5.8 open question on
  whether a lighter DOM/CSS-based "curved carousel" approximation is
  preferred instead, given the rest of the site's animation is GSAP-based,
  not WebGL-based).
- **Data source:** a testimonials data array, not hardcoded per card:

```ts
interface Testimonial {
  id: string;
  name: string;
  role?: string; // e.g. "Owner, [Business Name]" — omit if not available
  quote: string;
  avatar?: string; // client photo, if available; fallback to initials
  rating?: number; // 1–5, if collected
}
```

- Each item in the gallery renders: quote text, name, role (if present),
  avatar/initials, and optionally a star rating.
- Real client testimonials only — the existing site has a handful of
  testimonials (Sally B., Tom H., Charlotte H., Paul P., Mark B.) already
  live; carry those over as the seed data rather than inventing new ones,
  and note this is a small set (5) so the gallery should still feel full
  and intentional even without dozens of entries — don't stretch content
  thin or pad with filler.

**Interaction:**
- Draggable/scrollable horizontally (mouse drag, touch swipe, or scroll),
  per the reactbits reference behavior — items curve/arc as they move
  through the gallery rather than sitting in a flat straight row.
- Autoplay: a slow continuous drift is acceptable as an idle state (matches
  the reactbits demo's typical behavior) but must **pause on
  hover/interaction** and **pause when the section scrolls out of view**
  (don't run WebGL/canvas animation loops for an off-screen section — wasted
  GPU/battery).
- Clicking/tapping a testimonial card can bring it to center focus
  (optional nicety) — not required, but a nice touch matching how curved
  carousels usually behave.

### 5.4 Motion / Animation Requirements

- Scroll-entrance: gallery fades/scales in once when the section enters
  view, consistent with the site's existing reveal pattern.
- Idle drift (if implemented) should be slow and subtle — this is ambient
  motion, not something demanding attention away from reading the CTA below
  it.
- Respect `prefers-reduced-motion`: disable idle autoplay/drift entirely
  (gallery becomes drag/click-navigate only) and use a simple fade for
  scroll-entrance instead of scale/curve-in motion.
- If a WebGL approach is used, ensure the canvas context is properly torn
  down/paused when off-screen (via IntersectionObserver) to avoid
  unnecessary GPU usage elsewhere on the page.

### 5.5 CTA Button (End of Section)

- Single centered animated CTA button after the gallery, same requirement
  as §2.6/§3.5 — reuse the site's existing animated-button convention.
- Copy: something like **"Join Our Happy Clients"** or **"Start Your
  Project"** — confirm destination (`ContactDialog` vs. a link elsewhere),
  matching the pattern used by other section-ending CTAs.

### 5.6 Responsive Behavior

- **Desktop (≥1024px):** full curved gallery, multiple testimonials
  visible/partially visible at once per the reactbits arc layout.
- **Tablet (768–1023px):** gallery may show fewer simultaneous
  items/tighter arc — use judgment based on how the chosen implementation
  scales.
- **Mobile (<768px):** if the WebGL circular gallery proves heavy or
  awkward on small touch screens, a simpler horizontally swipeable flat
  card carousel is an acceptable mobile fallback (same data, simpler
  presentation) — flag this as a pragmatic option rather than forcing the
  full curved effect into a cramped viewport (see §5.8).

### 5.7 Accessibility

- Testimonial text/name/role must be real text, not baked into images.
- Gallery needs keyboard navigation (arrow keys or tab-through to move
  between testimonials) in addition to drag/swipe — a WebGL canvas
  implementation especially needs this considered up front, since canvas
  content isn't natively accessible the way DOM elements are; may require
  a visually-hidden parallel list of testimonials for screen readers if the
  canvas approach can't expose individual items to assistive tech directly.
- Respect `prefers-reduced-motion` per §5.4 — no exceptions.

### 5.8 Open Questions for Noman (resolve before/while building)

1. reactbits' Circular Gallery reference is WebGL/OGL-based — are you fine
   adding that as a new dependency, or would a CSS/GSAP-based curved
   carousel that visually approximates the effect (without full WebGL) be
   preferred, given the rest of the site is GSAP-driven? This affects
   accessibility complexity too (see §5.7).
2. Are there more than the 5 existing testimonials to seed this with, or
   should new ones be collected before launch? 5 is workable but thin for a
   "gallery" framing.
3. Mobile fallback: full curved gallery squeezed into a small viewport, or
   a simpler flat swipeable carousel on mobile only?
4. CTA destination/copy — same recurring question as other sections.

---

*(Next sections to be added as they're designed — this file will grow.)*
