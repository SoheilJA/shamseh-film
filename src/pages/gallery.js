/**
 * gallery.js — production photography: filterable editorial grid + lightbox.
 */
import { gallerySets, allImages } from "../data/gallery.js";
import { toFaDigits, renderIcons, esc } from "../js/utils.js";
import { reveal, sectionHeaderIn, gsap, prefersReduced } from "../js/animator.js";
import { openLightbox } from "../components/Lightbox.js";

export default async function galleryPage(app) {
  let activeSet = "all";

  app.innerHTML = `
  <main id="main" class="grain pt-28 md:pt-36 pb-20 md:pb-32">
    <section class="px-[var(--spacing-gutter)] pb-10 md:pb-14">
      <p class="mb-5 flex items-center gap-2.5"><span class="tfa !text-crimson">آرشیو تصاویر — ${toFaDigits(allImages.length)} قاب</span><span class="tc tc-crimson" style="font-size:.55rem">STILLS ARCHIVE</span></p>
      <h1 class="text-display font-black leading-[1.02] mb-6" data-section-title>گالری تصاویر</h1>
      <p class="text-ash max-w-2xl leading-loose md:text-lg">
        قاب‌هایی از پشت صحنه و روی پرده تولیدات شمسه فیلم؛ تصاویر هر مجموعه با همان دسته‌بندی منبع اصلی حفظ شده‌اند.
      </p>
      <div data-section-rule class="h-px w-full bg-line mt-10 md:mt-14"></div>
    </section>

    <!-- filters -->
    <section class="px-[var(--spacing-gutter)] mb-8 md:mb-12" aria-label="فیلتر گالری">
      <div class="snap-row gap-2 pb-1">
        <button type="button" data-set="all" aria-pressed="true"
          class="gfilter px-4 py-2 text-sm border border-crimson bg-soot text-bone transition-colors flex-none">
          همه (${toFaDigits(allImages.length)})
        </button>
        ${gallerySets
          .map(
            (g) => `
        <button type="button" data-set="${esc(g.title)}" aria-pressed="false"
          class="gfilter px-4 py-2 text-sm border border-line text-smoke hover:text-ash transition-colors flex-none">
          ${esc(g.title)} (${toFaDigits(g.images.length)})
        </button>`
          )
          .join("")}
      </div>
    </section>

    <!-- masonry-ish editorial grid -->
    <section class="px-[var(--spacing-gutter)]">
      <div id="gal-grid" class="columns-2 md:columns-3 xl:columns-4 gap-4 [column-fill:balance]"></div>
      <p class="tc mt-10 text-center" id="gal-status" aria-live="polite"></p>
    </section>
  </main>`;

  renderIcons(app);
  sectionHeaderIn(app);

  const grid = app.querySelector("#gal-grid");
  const statusEl = app.querySelector("#gal-status");
  const filters = app.querySelectorAll(".gfilter");

  function render() {
    const items = activeSet === "all" ? allImages : allImages.filter((i) => i.set === activeSet);
    statusEl.innerHTML = `<span class="tfa">نمایش ${toFaDigits(items.length)} تصویر — ${activeSet === "all" ? "همه مجموعه‌ها" : activeSet}</span>`;

    grid.innerHTML = items
      .map((img, i) => {
        // mixed aspect rhythm by position
        const ratioClass = i % 7 === 0 ? "aspect-[3/4]" : i % 5 === 3 ? "aspect-square" : "aspect-[4/3]";
        return `
      <button type="button" data-lb="${i}" class="group relative block w-full mb-4 overflow-hidden break-inside-avoid">
        <div class="relative overflow-hidden ${ratioClass} bg-soot">
          <img src="${img.md}" alt="تصویر ${esc(img.set)} ${toFaDigits(i + 1)}" loading="lazy" decoding="async"
               class="img-cine absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]" />
          <span class="absolute inset-0 bg-ink/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <span class="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <i data-lucide="maximize-2" data-size="13" class="text-bone"></i>
          </span>
        </div>
        <span class="tfa block mt-2.5 mb-1 truncate">${esc(img.set)}</span>
      </button>`;
      })
      .join("");
    renderIcons(grid);

    grid.querySelectorAll("[data-lb]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.lb);
        openLightbox(
          items.map((im) => ({ src: im.lg, caption: im.set })),
          idx
        );
      })
    );

    if (!prefersReduced()) {
      gsap.from(grid.children, { opacity: 0, y: 22, duration: 0.6, stagger: 0.03, ease: "power2.out" });
    }
  }

  filters.forEach((f) =>
    f.addEventListener("click", () => {
      activeSet = f.dataset.set;
      filters.forEach((b) => {
        const on = b === f;
        b.setAttribute("aria-pressed", String(on));
        b.className = `gfilter px-4 py-2 text-sm border transition-colors flex-none ${
          on ? "border-crimson bg-soot text-bone" : "border-line text-smoke hover:text-ash"
        }`;
      });
      render();
    })
  );

  render();
  reveal(app);
}
