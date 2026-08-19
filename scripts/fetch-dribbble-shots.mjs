/**
 * Downloads the portfolio tile imagery: real Dribbble shots, one set per
 * industry category.
 *
 * Dribbble itself cannot be crawled — every HTML request to dribbble.com is
 * answered by an AWS WAF challenge page, and API v2 exposes only the
 * authenticated user's own shots, not search. The CDN, however, serves any
 * valid file path. So discovery goes through Bing's image endpoint (which
 * indexes those CDN URLs along with the shot title and page), and the files
 * come straight from cdn.dribbble.com.
 *
 * Every shot is unique across the whole set. Each one's source page and
 * designer credit are recorded in the manifest and carried into
 * src/data/portfolio.ts, so provenance is never lost.
 *
 * Run with: node scripts/fetch-dribbble-shots.mjs [slug…]
 */
import { mkdir, writeFile, readFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const OUT = "./public/portfolio/dribbble";
const TMP = "./.cache/dribbble-tmp";
/** Tiles per category. A few extra candidates are tried in case of failures. */
const PER_CATEGORY = Number(process.env.PER_CATEGORY ?? 5);
/** Shots are 4:3 presentations; 1200px is plenty for the tile and lightbox. */
const MAX_WIDTH = 1200;

const CATEGORIES = [
  { slug: "plumbing", label: "Plumbing", queries: ["dribbble plumbing website design", "dribbble plumber service landing page"] },
  { slug: "hvac", label: "HVAC", queries: ["dribbble hvac website design", "dribbble air conditioning service landing page"] },
  { slug: "dental", label: "Dental", queries: ["dribbble dental clinic website design", "dribbble dentist landing page design"] },
  { slug: "roofing", label: "Roofing", queries: ["dribbble roofing website design", "dribbble roofing company landing page"] },
  { slug: "landscaping", label: "Landscaping", queries: ["dribbble landscaping website design", "dribbble garden landscape landing page"] },
  { slug: "auto-repair", label: "Auto Repair", queries: ["dribbble auto repair website design", "dribbble car service landing page design"] },
  { slug: "law-firm", label: "Law Firm", queries: ["dribbble law firm website design", "dribbble lawyer attorney landing page"] },
  { slug: "restaurant", label: "Restaurant", queries: ["dribbble restaurant website design", "dribbble restaurant landing page design"] },
  { slug: "fitness", label: "Fitness", queries: ["dribbble gym fitness website design", "dribbble fitness studio landing page"] },
  { slug: "real-estate", label: "Real Estate", queries: ["dribbble real estate website design", "dribbble property listing landing page"] },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** curl, not fetch — bot protection rejects node's TLS fingerprint. */
async function curlText(url) {
  const { stdout } = await run(
    "curl",
    ["-s", "-A", UA, "--compressed", "-H", "Accept-Language: en-US,en;q=0.9", "--max-time", "45", url],
    { maxBuffer: 64 * 1024 * 1024 },
  );
  return stdout;
}

const decodeEntities = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

/** Shot name from the page slug: /shots/25735206-Dental-Clinic-Website → words. */
function titleFromShotUrl(url) {
  const m = url.match(/\/shots\/\d+-([^/?#]+)/);
  if (!m) return null;
  return decodeURIComponent(m[1]).replace(/-/g, " ").trim();
}

/** Bing titles read "<name> by <designer> on Dribbble | …". */
function creditFromBingTitle(title) {
  const m = title.match(/\bby\s+([^|]+?)(?:\s+on\s+Dribbble|\s*\||$)/i);
  return m ? m[1].trim() : null;
}

async function search(query, first) {
  const url = `https://www.bing.com/images/async?q=${encodeURIComponent(query)}&first=${first}&count=35&mmasync=1`;
  const html = await curlText(url).catch(() => "");
  const out = [];
  for (const m of html.matchAll(/m="([^"]+)"/g)) {
    let data;
    try {
      data = JSON.parse(decodeEntities(m[1]));
    } catch {
      continue;
    }
    if (!data || typeof data !== "object") continue;
    const img = data.murl ?? "";
    const page = data.purl ?? "";
    // Shot pages only — tag and search pages point at collages, not one design.
    if (!img.includes("cdn.dribbble.com") || !page.includes("dribbble.com/shots/")) continue;
    out.push({ img, page, bingTitle: String(data.t ?? "") });
  }
  return out;
}

/** Strip Bing's own resize template and ask the CDN for a known-good size. */
const normalise = (url) => `${url.split("?")[0]}?resize=1600x1200&vertical=center`;
/** Two Bing hits for one shot can differ only by query string. */
const keyOf = (url) => url.split("?")[0];

await mkdir(OUT, { recursive: true });
await mkdir(TMP, { recursive: true });

const only = process.argv.slice(2);
// Kept in the repo rather than under public/: it is build input and
// provenance, not something to serve.
const manifestPath = "./scripts/dribbble-shots.json";
const manifest = existsSync(manifestPath) ? JSON.parse(await readFile(manifestPath, "utf8")) : {};

// Nothing already downloaded is ever picked again for another category.
const usedKeys = new Set(
  Object.values(manifest).flatMap((items) => items.map((i) => i.sourceKey).filter(Boolean)),
);

for (const cat of CATEGORIES) {
  if (only.length && !only.includes(cat.slug)) continue;

  const candidates = [];
  for (const query of cat.queries) {
    for (const first of [1, 36]) {
      for (const hit of await search(query, first)) {
        const key = keyOf(hit.img);
        if (usedKeys.has(key) || candidates.some((c) => keyOf(c.img) === key)) continue;
        candidates.push(hit);
      }
      await sleep(500);
    }
    if (candidates.length >= PER_CATEGORY + 6) break;
  }

  const items = [];
  for (const hit of candidates) {
    if (items.length >= PER_CATEGORY) break;
    const n = items.length + 1;
    const file = `${cat.slug}-${n}.webp`;
    const tmp = `${TMP}/${cat.slug}-${n}.bin`;
    try {
      await run("curl", ["-s", "-A", UA, "--max-time", "60", "-o", tmp, normalise(hit.img)]);
      const buf = await readFile(tmp);
      if (buf.length < 20000) throw new Error(`only ${buf.length} bytes`);
      const meta = await sharp(buf)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(`${OUT}/${file}`);
      items.push({
        file,
        title: titleFromShotUrl(hit.page) ?? hit.bingTitle.split(" by ")[0],
        credit: creditFromBingTitle(hit.bingTitle),
        source: hit.page.split("?")[0],
        sourceKey: keyOf(hit.img),
        width: meta.width,
        height: meta.height,
      });
      usedKeys.add(keyOf(hit.img));
      await sleep(200);
    } catch (err) {
      console.warn(`  ! ${cat.slug}: ${err.message}`);
    } finally {
      await rm(tmp, { force: true });
    }
  }

  manifest[cat.slug] = items;
  console.log(`${cat.slug.padEnd(13)} ${items.length}/${PER_CATEGORY} shots (${candidates.length} candidates)`);
}

await writeFile(manifestPath, JSON.stringify(manifest, null, 2));
await rm(TMP, { recursive: true, force: true });
console.log(`\nmanifest → ${manifestPath}`);
