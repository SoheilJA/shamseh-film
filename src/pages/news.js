/**
 * news.js — editorial news archive with search.
 */
import { news } from "../data/news.js";
import { esc, toFaDigits, faDate, renderIcons, debounce } from "../js/utils.js";
import { reveal, sectionHeaderIn, gsap, prefersReduced } from "../js/animator.js";

export default async function newsPage(app) {
  let searchTerm = "";

  app.innerHTML = `
  <main id="main" class="grain pt-28 md:pt-36 pb-20 md:pb-32">
    <section class="px-[var(--spacing-gutter)] pb-10 md:pb-14">
      <p class="mb-5 flex items-center gap-2.5"><span class="tfa !text-crimson">اخبار — ${toFaDigits(news.length)} مورد</span><span class="tc tc-crimson" style="font-size:.55rem">NEWS & EVENTS</span></p>
      <h1 class="text-display font-black leading-[1.02] mb-6" data-section-title>اخبار و رویدادها</h1>
      <p class="text-ash max-w-2xl leading-loose md:text-lg">
        گزارش‌هایی از پشت صحنه تولیدات؛ از آغاز فیلم‌برداری و تدوین تا حضور آثار شمسه فیلم در جشنواره‌ها.
      </p>
      <div data-section-rule class="h-px w-full bg-line mt-10 md:mt-14"></div>
    </section>

    <section class="px-[var(--spacing-gutter)]">
      <div class="flex items-center gap-2.5 border border-line px-4 py-3 max-w-md mb-10 md:mb-14">
        <i data-lucide="search" data-size="17" class="text-smoke flex-none"></i>
        <input id="news-search" type="search" autocomplete="off"
          placeholder="جستجو در اخبار…" aria-label="جستجو در اخبار"
          class="w-full bg-transparent outline-none text-sm md:text-base text-bone placeholder:text-smoke" />
      </div>

      <div id="news-list" class="border-t border-line"></div>
      <div id="news-empty" class="hidden py-20 text-center">
        <p class="text-ash text-lg">خبری با این عبارت یافت نشد.</p>
      </div>
    </section>
  </main>`;

  renderIcons(app);
  sectionHeaderIn(app);

  const list = app.querySelector("#news-list");
  const empty = app.querySelector("#news-empty");
  const input = app.querySelector("#news-search");

  const norm = (s) => String(s).replace(/[\u200c]/g, " ").replace(/\s+/g, " ").trim();

  function renderList() {
    let items = news;
    if (searchTerm.length >= 2) {
      const q = norm(searchTerm).toLowerCase();
      items = items.filter(
        (n) => norm(n.title).toLowerCase().includes(q) || n.paragraphs.some((p) => norm(p).toLowerCase().includes(q))
      );
    }
    empty.classList.toggle("hidden", items.length > 0);

    list.innerHTML = items
      .map((n, i) => {
        const lead = i === 0 && !searchTerm;
        return `
      <a href="/news/${n.id}" class="group grid grid-cols-1 ${lead ? "md:grid-cols-12" : "sm:grid-cols-[220px_1fr] md:grid-cols-[280px_1fr]"} gap-5 md:gap-8 py-7 md:py-9 border-b border-line hover:bg-soot/40 transition-colors duration-500 px-2 md:px-4 -mx-2 md:-mx-4">
        <div class="relative overflow-hidden ${lead ? "md:col-span-5 aspect-[16/9]" : "aspect-[16/10]"} bg-soot">
          ${
            n.image
              ? `<img src="${n.image.md}" alt="${esc(n.title)}" loading="lazy" decoding="async"
                   class="img-cine absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]" />`
              : `<div class="absolute inset-0 grid place-items-center"><i data-lucide="newspaper" data-size="26" class="text-smoke"></i></div>`
          }
          <span class="tc absolute top-3 left-3 bg-ink/70 backdrop-blur-sm px-2 py-1" style="font-size:.55rem">NEWS</span>
        </div>
        <div class="flex flex-col justify-center ${lead ? "md:col-span-7" : ""}">
          <p class="tfa !text-crimson mb-3">${faDate(n.date)}</p>
          <h2 class="font-bold leading-snug mb-3 ${lead ? "text-h3 md:text-h2" : "text-lg md:text-xl"} group-hover:text-bone transition-colors">${esc(n.title)}</h2>
          ${
            n.excerpt && lead
              ? `<p class="text-smoke text-sm md:text-base leading-relaxed line-clamp-2 mb-4">${esc(n.excerpt)}</p>`
              : ""
          }
          <span class="tc flex items-center gap-2 group-hover:text-bone transition-colors">
            READ ARTICLE <i data-lucide="arrow-left" data-size="13" class="transition-transform duration-500 group-hover:-translate-x-1"></i>
          </span>
        </div>
      </a>`;
      })
      .join("");
    renderIcons(list);

    if (!prefersReduced()) {
      gsap.from(list.children, { opacity: 0, y: 24, duration: 0.7, stagger: 0.06, ease: "power3.out" });
    }
  }

  input?.addEventListener(
    "input",
    debounce(() => {
      searchTerm = input.value;
      renderList();
    }, 220)
  );

  renderList();
  reveal(app);
}
