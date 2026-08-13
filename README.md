# Rightclixs — Next.js

Rightclixs marketing site, migrated from TanStack Start (Vite) to **Next.js 15 (App Router)**.
The design, content and Tailwind v4 design system are unchanged — only the framework/routing
layer was converted.

## Stack

- Next.js 15 (App Router, React 19)
- `next/image` for optimized images, `next/font` for self-hosted Google Fonts
- Tailwind CSS v4 (`@tailwindcss/postcss`)
- shadcn/ui (Radix primitives), lucide-react, sonner

## Scripts

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run start
```

## Structure

```
public/
  robots.txt
src/
  app/
    favicon.ico           # App Router icon convention
    layout.tsx            # root layout (next/font, metadata, Toaster) — was routes/__root.tsx
    globals.css           # design system — was src/styles.css
    page.tsx              # Home            — was routes/index.tsx
    services/page.tsx     # Services        — was routes/services.tsx
    pricing/page.tsx      # Pricing         — was routes/pricing.tsx
    contact/page.tsx      # Contact (server component — exports metadata)
    contact/contact-content.tsx  # Contact form (client) — was routes/contact.tsx
    not-found.tsx         # 404
    error.tsx             # error boundary
  assets/                # images — statically imported by next/image
  components/site/        # header, footer, section, pricing-card
  components/ui/          # shadcn/ui primitives
  data/                  # content.ts, pricing.ts
  hooks/                 # use-mobile
  lib/utils.ts           # cn()
```

## Migration notes

- `@tanstack/react-router` `<Link to>` → `next/link` `<Link href>`.
- Active nav state (`activeProps`) → `usePathname()` comparison in the header.
- Per-route `head()` meta → Next `metadata` / `viewport` exports.
- `<img>` + asset imports → `next/image` with static imports from `src/assets`
  (`fill` for background-style images, `sizes` for responsive ones).
- External Google Fonts `<link>` → `next/font/google` (self-hosted, wired to the
  `--font-jakarta` / `--font-instrument` CSS variables used by the design system).
- `favicon.ico` moved into `src/app/` (App Router icon convention).
- `cn()` moved from `src/hooks/utils.ts` to `src/lib/utils.ts` to match the `@/lib/utils` imports.
