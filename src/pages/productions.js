/**
 * productions.js — the film archive: editorial intro, category filters,
 * live search, responsive art-directed grid, progressive reveal.
 */
import { productions, CATEGORIES, byCategory } from "../data/productions.js";
import { toFaDigits, renderIcons, debounce } from "../js/utils.js";
import { reveal, sectionHeaderIn, gsap, prefersReduced } from "../js/animator.js";
import { productionCard } from "../components/ProductionCard.js";

const TC_OF = {
  all: "ALL WORKS",
  documentary: "DOCUMENTARY",
  fiction: "FICTION",
  "music-video": "MUSIC VIDEO",
  tv: "TELEVISION",
};

export default async function productionsPage(app, params, query = new URLSearchParams(location.search)) {
  const initialCat = query.get("cat") || "all";
  let activeCat = CATEGORIES.some((c) => c.key === initialCat) ? initialCat : "all";
  let searchTerm = "";

  app.innerHTML = `
  <main id="main" class="grain pt-28 md:pt-36">

    <!-- archive masthead -->
    <section class="px-[var(--spacing-gutter)] pb-12 md:pb-16">
      <p class="mb-5 flex items-center gap-2.5"><span class="tfa !text-crimson">آرشیو — ${toFaDigits(productions.length)} اثر</span><span class="tc tc-crimson" style="font-size:.55rem">FILM ARCHIVE</span></p>
      <h1 class="text-display font-black leading-[1.02] mb-6" data-section-title>آرشیو تولیدات</h1>
      <p class="text-ash max-w-2xl leading-loose md:text-lg">
        مجموعه کامل تولیدات گروه سینمایی شمسه فیلم؛ مستند، داستانی، نماهنگ و برنامه تلویزیونی.
        برای یافتن اثر، جستجو کنید یا دسته را انتخاب کنید.
      </p>
      <div data-section-rule class="h-px w-full bg-line mt-10 md:mt-14"></div>
    </section>

    <!-- filter bar: sticky -->
    <section class="sticky top-16 md:top-20 z-40 bg-ink/90 backdrop-blur-md border-y border-line"
             aria-label="فیلتر و جستجوی تولیدات">
      <div class="px-[var(--spacing-gutter)] py-3.5 md:py-4 flex items-center gap-4">
        <div class="flex-1 flex items-center gap-2.5 min-w-0">
          <i data-lucide="search" data-size="17" class="text-smoke flex-none"></i>
          <input id="prod-search" type="search" autocomplete="off" value=""
            placeholder="جستجوی عنوان…" aria-label="جستجوی تولیدات"
            class="w-full bg-transparent outline-none text-sm md:text-base text-bone placeholder:text-smoke min-w-0" />
        </div>
        <div class="hidden md:flex items-center gap-1.5" role="tablist" aria-label="دسته‌بندی">
          ${CATEGORIES.map(
            (c) => `
          <button type="button" data-filter="${c.key}" role="tab" aria-selected="${c.key === activeCat}"
            class="filter-btn px-4 py-2 text-sm transition-colors duration-300 ${c.key === activeCat ? "text-bone bg-soot border-crimson" : "text-smoke hover:text-ash border-transparent"} border">
            ${c.fa}
          </button>`
          ).join("")}
        </div>
      </div>
      <!-- mobile filter row (scrollable) -->
      <div class="md:hidden px-[var(--spacing-gutter)] pb-3.5 -mt-1">
        <div class="snap-row gap-2" role="tablist" aria-label="دسته‌بندی">
          ${CATEGORIES.map(
            (c) => `
          <button type="button" data-filter="${c.key}" role="tab" aria-selected="${c.key === activeCat}"
            class="filter-btn px-4 py-2 text-sm border transition-colors ${c.key === activeCat ? "text-bone bg-soot border-crimson" : "text-smoke border-line"}">
            ${c.fa}
          </button>`
          ).join("")}
        </div>
      </div>
    </section>

    <!-- active state line -->
    <div class="px-[var(--spacing-gutter)] pt-8">
      <p class="flex items-center gap-2.5 flex-wrap" id="archive-status" aria-live="polite"></p>
    </div>

    <!-- grid -->
    <section class="px-[var(--spacing-gutter)] py-8 md:py-12" aria-label="فهرست تولیدات">
      <div id="prod-grid" class="grid gap-x-5 gap-y-12 md:gap-x-6 md:gap-y-16 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"></div>
      <div id="archive-empty" class="hidden py-24 text-center">
        <i data-lucide="film" data-size="36" class="text-smoke mx-auto mb-5"></i>
        <p class="text-ash text-lg mb-2">اثری با این مشخصات در آرشیو یافت نشد.</p>
        <p class="text-smoke text-sm">عبارت جستجو را تغییر دهید یا دسته دیگری را انتخاب کنید.</p>
      </div>
    </section>
  </main>`;

  renderIcons(app);
  sectionHeaderIn(app);

  const grid = app.querySelector("#prod-grid");
  const status = app.querySelector("#archive-status");
  const empty = app.querySelector("#archive-empty");
  const searchInput = app.querySelector("#prod-search");
  const filterBtns = app.querySelectorAll(".filter-btn");

  const norm = (s) => String(s).replace(/[\u200c]/g, " ").replace(/\s+/g, " ").trim();

  function currentList() {
    let list = byCategory(activeCat);
    if (searchTerm.length >= 2) {
      const q = norm(searchTerm).toLowerCase();
      list = list.filter((p) => norm(p.title).toLowerCase().includes(q));
    }
    return list;
  }

  function renderList() {
    const list = currentList();
    const catFa = CATEGORIES.find((c) => c.key === activeCat)?.fa || "";
    status.innerHTML = `<span class="tfa">${catFa} — ${toFaDigits(list.length)} اثر</span><span class="tc" style="font-size:.55rem">${TC_OF[activeCat]}</span>`;

    if (!list.length) {
      grid.innerHTML = "";
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");

    // art-directed rhythm: every 5th item spans wide (landscape)
    grid.innerHTML = list
      .map((p, i) => {
        const wide = i % 7 === 3;
        const variant = p.hero && wide ? "landscape" : "portrait";
        const ratio = variant === "landscape" ? "16/10" : "3/4";
        return `<div class="${wide ? "col-span-2" : ""}">${productionCard(p, { variant, index: i, ratio })}</div>`;
      })
      .join("");
    renderIcons(grid);

    if (!prefersReduced()) {
      gsap.from(grid.children, {
        opacity: 0,
        y: 26,
        duration: 0.7,
        ease: "power3.out",
        stagger: { each: 0.05, from: "start" },
      });
    }
  }

  function setFilter(key) {
    activeCat = key;
    filterBtns.forEach((b) => {
      const on = b.dataset.filter === key;
      b.setAttribute("aria-selected", String(on));
      b.className = `filter-btn px-4 py-2 text-sm border transition-colors ${
        on ? "text-bone bg-soot border-crimson" : "text-smoke hover:text-ash border-transparent md:border-line"
      }`;
    });
    renderList();
  }

  filterBtns.forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.filter)));
  searchInput?.addEventListener(
    "input",
    debounce(() => {
      searchTerm = searchInput.value;
      renderList();
    }, 220)
  );

  renderList();
  reveal(app);
}
