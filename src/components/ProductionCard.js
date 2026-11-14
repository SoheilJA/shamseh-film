/**
 * ProductionCard.js — art-directed production tiles.
 * Two variants: portrait (poster) and landscape (still).
 * Typographic fallback for productions without imagery.
 */
import { esc, toFaDigits } from "../js/utils.js";

export function productionCard(p, { variant = "portrait", index = 0, ratio = "3/4" } = {}) {
  const num = String(index + 1).padStart(2, "0");
  const image = variant === "portrait" ? p.poster || p.hero : p.hero || p.poster;

  return `
  <a href="/productions/${p.id}" data-card class="group relative block" aria-label="${esc(p.title)}">
    <div class="relative overflow-hidden bg-soot frame-marks" style="aspect-ratio:${ratio}">

      <!-- SC label inside the frame, no collisions -->
      <span class="absolute top-3 right-3 z-10 px-2 py-1 bg-ink/70 backdrop-blur-sm">
        <span class="tc tc-crimson" style="font-size:.55rem; letter-spacing:.2em">SC. ${num}</span>
      </span>

      ${
        image
          ? `<img src="${image}" alt="${esc(p.title)}" loading="lazy" decoding="async"
               class="img-cine absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.05]" />`
          : `<div class="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center bg-[radial-gradient(ellipse_at_center,#151515,#0b0b0b)]">
              <i data-lucide="clapperboard" data-size="26" class="text-smoke"></i>
              <span class="text-bone/80 font-bold text-lg md:text-xl leading-snug">${esc(p.title)}</span>
              <span class="tc" style="font-size:.5rem">ARCHIVE · NO STILL AVAILABLE</span>
            </div>`
      }
      <span class="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></span>
      <span class="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 to-transparent"></span>

      <!-- play mark when video exists -->
      ${
        p.videos?.length
          ? `<span class="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 border border-bone/25 bg-ink/50 backdrop-blur-sm">
              <i data-lucide="play" data-size="10" class="text-bone"></i>
              <span class="tc tc-bone" style="font-size:.5rem">PREVIEW</span>
            </span>`
          : ""
      }

      <!-- caption bar -->
      <span class="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5 flex items-end justify-between gap-3">
        <span class="min-w-0">
          <span class="block tfa !text-ash mb-1.5 transition-colors group-hover:text-crimson">
            ${esc(p.categoryFa)} · ${toFaDigits(p.jy)}
          </span>
          <span class="block font-bold text-base md:text-xl leading-tight text-bone">${esc(p.title)}</span>
        </span>
        <span class="hidden sm:grid flex-none w-10 h-10 md:w-11 md:h-11 place-items-center border border-bone/30 text-bone
                     transition-all duration-500 group-hover:border-crimson group-hover:bg-crimson">
          <i data-lucide="arrow-left" data-size="16" class="transition-transform duration-500 group-hover:-translate-x-0.5"></i>
        </span>
      </span>
    </div>
  </a>`;
}
