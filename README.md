# گروه سینمایی شمسه فیلم — Shamseh Film

A complete frontend redesign and rebuild of [shamsehfilm.ir](https://shamsehfilm.ir/) — a cinematic, Persian-first (RTL) digital experience for the Mashhad-based film production studio.

**Not a template.** Every production, news article, credit list, gallery image and Aparat video from the original site was researched, extracted and preserved — 43 productions, 11 news articles, 8 photo galleries, 92 video embeds.

---

## Stack

| Tool | Role |
| --- | --- |
| **Vite 8** | dev server + build (Rolldown) |
| **Tailwind CSS 4** | design system (`@theme` tokens, no config file) |
| **GSAP 3 + ScrollTrigger** | cinematic motion, reveals, parallax, page transitions |
| **Lenis** | smooth scrolling (disabled under `prefers-reduced-motion`) |
| **SplitType** | headline line-split entrances |
| **Lucide** | icon set (rendered as inline SVG) |
| **Vazirmatn Variable + JetBrains Mono** | Persian display type + Latin timecode meta |

No React / Vue / Angular / Next — semantic HTML5 + ES modules only. No backend; all content lives in structured data modules under `src/data/`.

## Install & run

```bash
npm install
npm run dev        # → http://localhost:5173
npm run build      # → dist/
npm run preview    # serve the production build (SPA fallback included)
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Cinematic homepage — hero (3 slides from the original site), selected works, about, categories, news, gallery, closing |
| `/productions` | Film archive — 43 works, category filters (مستند / داستانی / نماهنگ / برنامه تلویزیونی), live title search |
| `/productions/:slug` | Production detail — hero, full original description, Aparat video previews, complete credits, stills, related works, prev/next |
| `/news` | News & events archive with search |
| `/news/:slug` | Article — full original text, share links, related, prev/next |
| `/about` | Studio identity, four production lines, directors of the archive, location |
| `/gallery` | All 46 production photographs, filterable by set, lightbox with keyboard/touch |
| `/contact` | Address, click-to-call phones, map, related organizations |

## Structure

```
shamseh-film/
├── public/
│   ├── assets/images/        # optimized WebP (sm/md/lg) from shamsehfilm.ir
│   └── favicon.svg
├── src/
│   ├── components/           # Header, MobileMenu, Footer, SearchOverlay,
│   │                         # ProductionCard, Lightbox, VideoModal
│   ├── data/                 # productions.js · news.js · gallery.js · company.js
│   │                         # (auto-generated from the original site's content)
│   ├── init/                 # one-time global animation setup
│   ├── js/                   # router.js · animator.js · utils.js
│   ├── pages/                # home · productions · productionDetail · news ·
│   │                         # articleDetail · about · gallery · contact · 404
│   ├── styles/main.css       # Tailwind 4 theme + cinematic utilities
│   └── main.js               # bootstrap: chrome, routes, icons
├── index.html                # lang="fa" dir="rtl", SEO + JSON-LD
├── package.json
└── vite.config.js
```

## Design system

- **Palette** — ink `#090909` / coal `#111` / soot `#1919`, bone `#F4F0E9` / ash `#A7A29B` / smoke `#77736E`, single crimson accent `#C52B32`
- **Type** — Vazirmatn Variable for Persian; JetBrains Mono for Latin meta labels (`.tc`), Persian meta uses `.tfa` (no letter-spacing — protects glyph joining)
- **Motion** — one easing vocabulary (`cubic-bezier(.16,1,.3,1)`), transform/opacity only, `prefers-reduced-motion` fully respected, mobile gets lighter effects
- **Cinema language** — film grain overlay, frame corner marks, `SC. NN` scene markers, timecode meta, curtain page transitions

## Content provenance

All textual content (descriptions, synopses, credit lists, news articles, contact details, related links) originates from shamsehfilm.ir and is preserved in full. Missing items on the source site were not fabricated:

- مستند «چشم به راه» has no still on the source — rendered as a typographic archive card
- 5 productions have no video preview on the source
- 3 productions have no description text on the source
- The original Telegram/Instagram links are placeholders (`#`) on the source and remain so

## Notes

- Video previews embed **Aparat** iframes exactly as the original site does.
- The `/productions?cat=…` query pre-selects a category filter (used by the header dropdown and category cards).
- Search supports production titles, tags and credit names, plus news headlines (`/` hotkey opens it).
