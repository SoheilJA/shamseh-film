/**
 * SearchOverlay.js — full-screen cinematic search across productions + news.
 */
import { productions } from "../data/productions.js";
import { news } from "../data/news.js";
import { esc, faDate } from "../js/utils.js";

const norm = (s) =>
  String(s).replace(/[\u200c\u200f]/g, " ").replace(/\s+/g, " ").trim();

export function searchOverlayHTML() {
  return `
  <div id="search-overlay" class="fixed inset-0 z-[160] invisible" role="dialog" aria-modal="true" aria-label="جستجو" aria-hidden="true">
    <div class="so-veil absolute inset-0 bg-[#050505]/85 backdrop-blur-md opacity-0"></div>
    <div class="relative h-full flex flex-col items-center px-[var(--spacing-gutter)] pt-24 md:pt-32 pb-10">
      <div class="so-box w-full max-w-3xl">
        <div class="flex items-center gap-4 border-b border-line pb-4 so-inner opacity-0">
          <i data-lucide="search" data-size="22" class="text-smoke"></i>
          <input id="search-input" type="search" autocomplete="off"
            placeholder="جستجوی تولیدات، اخبار…"
            class="flex-1 bg-transparent outline-none text-xl md:text-2xl text-bone placeholder:text-smoke" />
          <button type="button" data-search-close aria-label="بستن جستجو"
            class="tc hover:text-bone transition-colors flex items-center gap-2">
            ESC <span class="inline-block w-8 h-8 border border-line grid place-items-center"><i data-lucide="x" data-size="15"></i></span>
          </button>
        </div>
        <p class="tc mt-4 so-inner opacity-0">SEARCH THE ARCHIVE · ${productions.length} PRODUCTIONS · ${news.length} NEWS</p>
        <div id="search-results" class="mt-8 overflow-y-auto max-h-[52vh] so-results"></div>
      </div>
    </div>
  </div>`;
}

function resultItem({ href, kicker, title, meta }) {
  return `
  <a href="${href}" class="group flex items-center justify-between gap-4 py-4 border-b border-line/60 hover:border-crimson/50 transition-colors">
    <span class="flex items-baseline gap-4 min-w-0">
      <span class="tc tc-crimson flex-none">${kicker}</span>
      <span class="truncate text-lg text-ash group-hover:text-bone transition-colors">${esc(title)}</span>
    </span>
    <span class="tfa flex-none">${esc(meta)}</span>
  </a>`;
}

export function initSearchOverlay() {
  const overlay = document.getElementById("search-overlay");
  if (!overlay) return;
  const veil = overlay.querySelector(".so-veil");
  const input = overlay.querySelector("#search-input");
  const results = overlay.querySelector("#search-results");
  const inners = overlay.querySelectorAll(".so-inner");
  let open = false;

  const setOpen = (state) => {
    open = state;
    overlay.style.visibility = state ? "visible" : "hidden";
    overlay.setAttribute("aria-hidden", String(!state));
    document.documentElement.style.overflow = state ? "hidden" : "";
    if (state) {
      veil.style.transition = "opacity .35s ease";
      requestAnimationFrame(() => {
        veil.style.opacity = "1";
        inners.forEach((n, i) => {
          n.style.transition = `opacity .45s ease ${0.08 + i * 0.06}s, transform .45s ease ${0.08 + i * 0.06}s`;
          n.style.opacity = "1";
          n.style.transform = "translateY(0)";
        });
        setTimeout(() => input?.focus(), 120);
      });
    } else {
      veil.style.opacity = "0";
      inners.forEach((n) => {
        n.style.opacity = "0";
        n.style.transform = "translateY(14px)";
      });
    }
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-search-open]")) setOpen(true);
    if (e.target.closest("[data-search-close]")) setOpen(false);
  });
  overlay.querySelector(".so-veil").addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setOpen(false);
    // "/" opens search like a pro tool
    if (e.key === "/" && !open && !/input|textarea/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      setOpen(true);
    }
  });
  inners.forEach((n) => (n.style.transform = "translateY(14px)"));

  const emptyState = `<p class="text-smoke text-sm py-8 text-center">جستجو کنید…</p>`;
  results.innerHTML = emptyState;

  let t;
  input?.addEventListener("input", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const q = norm(input.value).toLowerCase();
      if (q.length < 2) {
        results.innerHTML = emptyState;
        return;
      }
      const prodHits = productions
        .filter(
          (p) =>
            norm(p.title).toLowerCase().includes(q) ||
            p.tags.some((tag) => norm(tag).toLowerCase().includes(q)) ||
            p.credits.some((c) => c.people.some((n) => norm(n).toLowerCase().includes(q)))
        )
        .slice(0, 8);
      const newsHits = news.filter((n) => norm(n.title).toLowerCase().includes(q)).slice(0, 5);

      let html = "";
      if (prodHits.length) {
        html += `<p class="mb-2 mt-4 flex items-center gap-2.5"><span class="tfa">تولیدات</span><span class="tc" style="font-size:.55rem">PRODUCTIONS</span></p>`;
        html += prodHits
          .map((p) =>
            resultItem({
              href: `/productions/${p.id}`,
              kicker: "FILM",
              title: p.title,
              meta: p.categoryFa,
            })
          )
          .join("");
      }
      if (newsHits.length) {
        html += `<p class="mb-2 mt-6 flex items-center gap-2.5"><span class="tfa">اخبار</span><span class="tc" style="font-size:.55rem">NEWS</span></p>`;
        html += newsHits
          .map((n) =>
            resultItem({
              href: `/news/${n.id}`,
              kicker: "NEWS",
              title: n.title,
              meta: faDate(n.date),
            })
          )
          .join("");
      }
      results.innerHTML =
        html || `<p class="text-smoke py-8 text-center">نتیجه‌ای یافت نشد — عبارت دیگری را امتحان کنید.</p>`;
    }, 180);
  });
}
