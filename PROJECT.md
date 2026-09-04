# SD MEDIA — Portfolio Rebuild

**Status:** v1 built. Read this file first if resuming.
**Owner:** sports photographer / videographer, Cary–Apex NC.
**Stack:** Next.js (App Router) + Cloudinary (photos) + YouTube (video) → Vercel. £0/mo.

---

## 1. Brief (from client)

- Rebuild of `sd-media.vercel.app`, same categories, different and better.
- Theme colour = the warm orange of the uploaded self-portrait (`football-42.jpg`).
  That photo must appear on the site as the self-portrait.
- **Photos and videos must appear automatically when uploaded.** No code edits per photo.
  30+ assets per category, constantly growing.
- Must not look "vibecoded." Must have unique, engaging, professional features.
- Must be fast worldwide and genuinely good on phones.
- Everything free. Vercel is fine. Nothing paid, ever.

Categories (from the existing site's metadata): **lacrosse, soccer, basketball,
volleyball, football** — plus video/highlights, plus room to add more.

---

## 2. Research: what "vibecoded" looks like, and what we do instead

Sources: The Fountain Institute "7 Signs a UI Has Been Vibe Coded"; Sinton Agency
"How to Spot a Vibe Coded Website"; the "Is That Vibe Coded" detector's fingerprint
list; TechCrunch/Yahoo interviews with Paul Bakaus, Shin, Das and Samant; a dev.to
audit of 100 vibecoded sites.

| Tell | Our rule |
|---|---|
| Purple→blue / indigo gradient | Palette is sampled pixel-by-pixel from the client's own photo. No purple anywhere. |
| Neon-on-dark, 5 competing accents | One dominant, one accent, one neutral, per surface. Nothing else. |
| Decorative glow / aurora bloom behind hero | No radial blooms. Depth comes from type scale and surface levels. |
| Emojis as icons, bullets, nav | Zero emoji in the entire codebase. Hand-written hairline SVG icons only. |
| Everything in a card; cards nested in cards | **No cards at all.** Photos sit directly on the page. No border-radius on any image, no box-shadow anywhere in the stylesheet. |
| Multicoloured left border tabs on blocks | None. |
| Status dots that mean nothing | None. |
| Inconsistent spacing between sections | Single 4px-based spacing scale, tokenised. Every section uses the same rhythm variables. |
| Weak contrast (grey on white) | Every text/background pair checked against WCAG. Lowest ratio on the site is 4.95:1. |
| Default fonts, no type scale | One family (Archivo variable), used across three optical *widths* as a hierarchy device. |
| ALL-CAPS tracked eyebrow labels | None. |
| "→" glued to every link/button | None. |
| Hover states that suggest interactivity but do nothing | Every hover target navigates or changes state. |
| No empty / error / loading states | Written by hand for every gallery: empty, failed-to-load, offline, and a real skeleton. |
| Missing OpenGraph, missing alt text | Per-category OG images generated at the edge; alt text derived from asset metadata with a sane fallback. |
| Outdated copyright year, generic testimonials | Year is computed. No fake testimonials. |
| 80 dependencies for a small site | **Three** runtime dependencies: `next`, `react`, `react-dom`. Nothing else. No UI kit, no icon package, no animation library. |

### Also avoided — the *current* generation of AI-design defaults

Anthropic's own design guidance flags a newer cluster that a detector in 2026 will
catch: cream `#F4F1EA` background + high-contrast serif display + terracotta
`#D97757` accent. That is the exact shape a warm-orange photography brief would
default into, so it is explicitly ruled out:

- Background is a **saturated apricot** (`#FBEAD8`, H30 S82 L91) taken from the sky
  in the client's photo, not a desaturated greige.
- Display face is a **wide grotesque**, not a serif.
- Accent is a **burnt amber** (`#A8481A`), not terracotta.

---

## 3. Research: what good photography portfolios actually do

- The work is the interface. Chrome is minimal and gets out of the way on scroll.
- Full-bleed or near-full-bleed imagery; generous margins; no visual containers.
- Galleries are dense. A photographer with 30+ frames per sport needs a *contact
  sheet*, not a 3-column card grid with captions.
- Fast first paint matters more than cleverness — visitors are often on phones on
  the sideline, on cellular.
- The photographer's own face/story appears once, early, and is not a separate
  "About" afterthought.

---

## 4. Design system

### Concept — "The page is the sky. The work is the silhouette."

The self-portrait is a black silhouette against a glowing golden-hour sky. That
image *is* the design system. Two surfaces, one horizon between them:

- **Sky** — the landing and index pages. Apricot ground, ink-black type. This is
  the world outside the camera.
- **Darkroom** — every gallery and the lightbox. Deep warm black, so the photographs
  carry all the colour on the page. This is what the photographer sees.

The transition between them is a hard horizon, never a fade. Golden hour is the
product a sports photographer sells, so the palette is subject matter, not decoration.

### Colour (all values sampled from `football-42.jpg`)

Sky surface
| Token | Value | Role | Contrast |
|---|---|---|---|
| `--sky` | `#FBEAD8` | page ground | — |
| `--ink` | `#141210` | primary type | 15.90:1 |
| `--muted` | `#5A4A3E` | secondary type | 7.19:1 |
| `--ember` | `#A8481A` | links, active state | 4.95:1 |

Darkroom surface
| Token | Value | Role | Contrast |
|---|---|---|---|
| `--pitch` | `#0E0B0A` | gallery ground | — |
| `--riser` | `#141210` | raised surface | — |
| `--warm` | `#F4DFC6` | primary type | 15.14:1 |
| `--dust` | `#C89A72` | secondary type | 7.40:1 |
| `--flare` | `#E8873C` | links, active state | 7.09:1 |

Dominant colours in the source photo, for reference:
`#110B0A` 28% · `#D9AC89` 21% · `#DDA771` 19% · `#FBC68E` 12% · `#B28873` 7%

### Type — one family, three widths

**Archivo** (variable: weight 100–900, width 62–125). A grotesque drawn from
American newspaper and signage gothics — the right vernacular for sport, and not a
serif. Width is used as a hierarchy axis, which is a real typographic decision
rather than a default:

- `wdth 118, wght 800` — wordmark and sport names, set very large
- `wdth 100, wght 400` — body
- `wdth 84,  wght 500` — dense captions and frame data

Numerals are tabular so frame counters don't jitter. No monospace face anywhere.

### Layout

Asymmetric. A 12-column grid with a deliberate left bias; nothing is centred except
the lightbox. Photos bleed off the right edge on the landing page.

```
LANDING (sky)
┌──────────────────────────────────────────────┐
│ SD MEDIA              lacrosse soccer ... ≡  │
│                                              │
│  SPORTS              ┌───────────────────────┤  ← self-portrait bleeds
│  AT THE              │                       │    off the right edge,
│  LAST                │   football-42.jpg     │    wordmark overlaps it
│  LIGHT               │                       │
│                      └───────────────────────┤
│  Cary, North Carolina                        │
└──────────────────────────────────────────────┘

INDEX (sky) — desktop
┌──────────────────────────────────────────────┐
│  lacrosse      ─────┐                        │
│  soccer             │   ┌─────────────────┐  │  ← hovering a name swaps
│  basketball    ─────┼──▶│  preview image  │  │    the preview. Fixed slot,
│  volleyball         │   └─────────────────┘  │    not cursor-following.
│  football      ─────┘        47 frames       │
└──────────────────────────────────────────────┘

GALLERY (darkroom)
┌──────────────────────────────────────────────┐
│ ← football                    ▦ sheet │ ▤ set│  ← view toggle
│                                              │
│ ┌────────┐ ┌──────────────┐ ┌────────┐       │
│ │        │ │              │ │        │       │  masonry, no gutters
│ └────────┘ └──────────────┘ └────────┘       │  beyond one rhythm unit
│                                       014/047│  ← frame counter, scroll-linked
└──────────────────────────────────────────────┘
```

### The four features that carry the site

1. **Contact sheet / Set** — one toggle switches a gallery between an editorial
   masonry (varied sizes, the photographer's edit) and a darkroom contact sheet
   (uniform dense grid, every frame equal). This is the correct answer to "30+
   images per category" and it's borrowed from actual darkroom practice, not from
   a UI kit. The choice persists across the session.
2. **Frame counter** — a scroll-linked `014/047` in the corner of every gallery,
   the way a film camera counts. It is wayfinding, not decoration: it tells you how
   deep you are in a long set.
3. **Real capture data in the lightbox** — camera, lens, focal length, aperture,
   shutter, ISO, pulled from each file's actual EXIF via Cloudinary. Other
   photographers and coaches read this. It cannot be faked by a template because
   it comes from the files themselves.
4. **Light that tracks the visitor's clock** — the accent shifts along the amber
   range between dawn, midday, golden hour and night, in the viewer's own timezone.
   Four discrete steps, no animation, ~6% hue movement. Subtle enough that most
   people never consciously notice; ties the brand to its own subject.

Motion budget: one orchestrated page-load reveal on the landing, plus motion that
answers a click (lightbox open, view toggle). No scroll-triggered fade-ups on
sections. `prefers-reduced-motion` disables all of it.

---

## 5. Architecture — how uploads become pages

The hard requirement is that the client never edits code to publish work.

```
                 ┌─────────────────────────────────────┐
  drag photos →  │ Cloudinary  media library (free)     │
                 │   sd-media/football/…                │
                 │   sd-media/lacrosse/…                │
                 └───────────────┬─────────────────────┘
                                 │  Admin API, server-side
                                 ▼
  add to        ┌─────────────────────────────────────┐
  playlist   →  │ Next.js on Vercel                    │ → static HTML at the edge
                │  ISR: revalidate every 5 min         │
  ┌─────────┐   │  + /api/revalidate for instant push  │
  │ YouTube │──▶└─────────────────────────────────────┘
  │playlists│      YouTube Data API v3 (free, 10k/day)
  └─────────┘
```

**Photos → Cloudinary.** Folder name = category slug. Upload through the Cloudinary
web UI, their phone app, or by dropping files in; the site picks them up on the next
revalidation. Free tier is 25 credits/month (1 credit = 1GB storage *or* 1GB
delivered bandwidth *or* 1,000 transformations), which is comfortable for a
portfolio once images are served as AVIF/WebP at responsive widths.

**Videos → YouTube playlists.** Deliberate: Cloudinary's free tier caps *video*
bandwidth at 1GB/month, which one visitor could exhaust. YouTube is unmetered,
adaptively streamed, and works on every phone. One unlisted-or-public playlist per
category; adding a video to the playlist publishes it. The site renders a
click-to-play facade (poster image + play control) so no YouTube JavaScript loads
until the visitor actually asks for a video — this is worth roughly 500KB and a
second of load time on the gallery pages.

**Ordering.** Cloudinary returns newest-first by default. To pin a hero frame,
tag it `featured` in Cloudinary; to hide one, tag it `hidden`. Both are read by the
data layer. No code change either way.

**Fallback.** `lib/media/` is an adapter. If Cloudinary credentials are absent the
site falls back to `content/manifest.json` + `/public/photos/<slug>/`, so the site
builds and runs before any account exists, and is not hostage to one vendor.

### Performance decisions

- Server components; zero data fetching on the client. Galleries arrive as HTML.
- ISR (`revalidate = 300`) means every visitor worldwide hits Vercel's edge cache.
- Cloudinary `f_auto,q_auto` → AVIF where supported; explicit `srcset` at
  400/800/1200/1600/2400 so phones never download a desktop-sized frame.
- Each image ships with its aspect ratio and its dominant colour inline, so the
  grid reserves exact space and fills it with the photo's own colour while loading.
  Zero layout shift, no grey skeleton flash, no extra placeholder request.
- First six frames `fetchpriority=high`; everything after is `loading=lazy`.
- Fonts self-hosted, one variable file, `font-display: swap`, subset to latin.
- Total client JS budget: under 30KB gzipped. No framer-motion, no icon library.

---

## 6. Repository map

```
sd-media/
├── app/
│   ├── layout.tsx              root shell, fonts, metadata
│   ├── page.tsx                landing (sky)
│   ├── work/page.tsx           category index (sky)
│   ├── work/[slug]/page.tsx    gallery (darkroom)
│   ├── film/page.tsx           video index (darkroom)
│   ├── about/page.tsx          the self-portrait + story (sky)
│   ├── contact/page.tsx        booking (sky)
│   ├── api/revalidate/route.ts instant publish webhook
│   └── opengraph-image.tsx     per-route social cards
├── components/                 no card component exists, by design
├── lib/
│   ├── media/cloudinary.ts     photo adapter
│   ├── media/youtube.ts        video adapter
│   ├── media/local.ts          zero-credential fallback
│   └── exif.ts                 capture-data normaliser
├── content/site.config.ts      categories: order, name, blurb. Edit to add a sport.
├── content/manifest.json       fallback photo list
└── public/photos/…             fallback images
```

**To add a sport:** three lines in `content/site.config.ts`, then a matching
Cloudinary folder. **To add photos:** upload. Nothing else.

---

## 7. Build log — what the visual review changed

Screenshots at 1440px and 390px, reviewed against the plan. Five things were
wrong; all five are fixed and re-verified in the browser.

1. **Hero type collided with the subject.** At `--step-5` inside an 11ch
   column, "Shot at the last light" set one word per line, ran over the camera
   and the photographer's face, and overflowed the hero into the section below.
   Capped at `clamp(2.2rem, 4.4vw, 4.1rem)` in a `min(38%, 26rem)` column, which
   holds it inside the clear sky in the upper left. Both caps are load-bearing —
   loosening either puts letterforms back on his face.

2. **CSS columns broke reading order.** Multi-column fills top-to-bottom, one
   column at a time, so frame 11 sat at the top of column two. The frame counter
   read `022/030` at the top of the page, and the lightbox's next/previous
   jumped around the screen. Replaced with **justified rows** — flex-basis and
   flex-grow both proportional to each frame's aspect ratio, so every frame in a
   row lands on a common height. Pure CSS, no measuring pass, and it is the
   layout real photo galleries use. Order now reads left to right, like a
   contact sheet.

3. **The frame counter counted DOM order, not screen position.** Even with rows
   this would drift. Rewritten to count frames above the viewport midline from
   their real `getBoundingClientRect`, batched into one `requestAnimationFrame`
   per scroll. Immune to whatever the grid does, in either view, at any width.

4. **Rows sat a few pixels ragged.** Flexbox distributes fractional pixels.
   Cells stretch to the row height and the frame fills with `object-fit: cover`,
   absorbing the rounding into a sub-pixel crop.

5. **The lightbox buried its own capture data.** A 1200x1800 portrait rendered
   at its full 1800px and covered the EXIF panel. Two separate causes, found by
   measuring computed geometry in the browser rather than guessing:
   a percentage `max-height` has no definite containing block to resolve against
   inside a grid area; and on a *replaced* element, `width: auto` with both
   `left` and `right` set falls back to the intrinsic width instead of
   stretching, so insets alone do not constrain it either. Fixed by giving the
   frame real dimensions and letting `object-fit: contain` letterbox inside.
   Verified as fitting in portrait and landscape, on desktop and mobile.

Things that came out right first time and should not be re-litigated: the two
surfaces and the horizon between them, the contact sheet, the mobile hero
inversion (type above photo), the "coming" state on empty categories, and the
apricot placeholder tone behind loading frames.

## 8. Open items / next passes

- [ ] Client to create Cloudinary account + paste 3 env vars (SETUP.md step 2)
- [ ] Client to create one YouTube playlist per category
- [ ] Swap placeholder copy on /about for the client's own words
- [ ] Consider a `?p=<public_id>` deep link so a single frame can be shared
- [ ] Revisit if any category exceeds 1,000 assets (Cloudinary list cap; paginate)
