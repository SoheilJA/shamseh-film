/**
 * articleDetail.js — full editorial article page: headline, date, hero image,
 * complete original content, share links, related news, prev/next.
 */
import { news, bySlug } from "../data/news.js";
import { esc, toFaDigits, faDate, renderIcons } from "../js/utils.js";
import { reveal, sectionHeaderIn, parallax, gsap, prefersReduced } from "../js/animator.js";
import notFoundPage from "./404.js";
import { withBase } from "../js/base.js";

export default async function articleDetailPage(app, params) {
  const n = bySlug(params.slug);
  if (!n) return notFoundPage(app, params);

  const idx = news.findIndex((x) => x.id === n.id);
  const prev = news[(idx - 1 + news.length) % news.length];
  const next = news[(idx + 1) % news.length];
  const related = news.filter((x) => x.id !== n.id).slice(0, 2);

  const shareUrl = encodeURIComponent(`https://shamsehfilm.ir/news/${n.id}`);
  const shareTitle = encodeURIComponent(n.title);

  app.innerHTML = `
  <main id="main" class="grain">

    <!-- headline block -->
    <section class="pt-28 md:pt-40 pb-10 md:pb-14 px-[var(--spacing-gutter)]">
      <div class="max-w-3xl mx-auto text-center">
        <p class="mb-6 flex items-center gap-3 flex-wrap" data-art-kicker><span class="text-crimson text-[.85rem]">${faDate(n.date)} — ${toFaDigits(idx + 1)} از ${toFaDigits(news.length)}</span><span class="tc tc-crimson" style="font-size:.55rem">NEWS</span></p>
        <h1 class="text-h1 font-black leading-[1.2]" data-art-title>${esc(n.title)}</h1>
      </div>
    </section>

    <!-- hero image -->
    ${
      n.image
        ? `<div class="px-[var(--spacing-gutter)] pb-4">
      <div class="relative overflow-hidden frame-marks max-w-5xl mx-auto" data-art-hero>
        <img src="${n.image.lg}" alt="${esc(n.title)}" decoding="async" fetchpriority="high"
             class="img-cine w-full aspect-[16/9] object-cover" data-parallax="6" />
      </div>
    </div>`
        : ""
    }

    <!-- body -->
    <div class="px-[var(--spacing-gutter)] py-12 md:py-20">
      <article class="max-w-[42rem] mx-auto article-body text-[1.02rem] md:text-[1.14rem]">
        ${n.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
      </article>

      <!-- share -->
      <div class="max-w-[42rem] mx-auto mt-14 pt-8 border-t border-line flex flex-wrap items-center justify-between gap-5">
        <p class="tc">SHARE · اشتراک این مطلب</p>
        <div class="flex items-center gap-2.5">
          <a href="https://t.me/share/url?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer" data-external
             aria-label="اشتراک در تلگرام" class="grid place-items-center w-10 h-10 border border-line text-ash hover:text-bone hover:border-crimson transition-colors">
            <i data-lucide="send" data-size="16"></i>
          </a>
          <a href="https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}" target="_blank" rel="noopener noreferrer" data-external
             aria-label="اشتراک در واتس‌اپ" class="grid place-items-center w-10 h-10 border border-line text-ash hover:text-bone hover:border-crimson transition-colors">
            <i data-lucide="message-circle" data-size="16"></i>
          </a>
          <a href="https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}" target="_blank" rel="noopener noreferrer" data-external
             aria-label="اشتراک در توییتر" class="grid place-items-center w-10 h-10 border border-line text-ash hover:text-bone hover:border-crimson transition-colors">
            <i data-lucide="twitter" data-size="16"></i>
          </a>
          <a href="mailto:?subject=${shareTitle}&body=${shareUrl}" data-external
             aria-label="اشتراک با ایمیل" class="grid place-items-center w-10 h-10 border border-line text-ash hover:text-bone hover:border-crimson transition-colors">
            <i data-lucide="mail" data-size="16"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- related -->
    ${
      related.length
        ? `
    <section class="bg-coal border-t border-line py-16 md:py-24" aria-label="اخبار مرتبط">
      <div class="px-[var(--spacing-gutter)]">
        <p class="kicker mb-10" data-kicker>اخبار دیگر <span class="tc">MORE</span></p>
        <div class="grid gap-5 md:gap-6 sm:grid-cols-2">
          ${related
            .map(
              (r) => `
          <a href="${withBase(`/news/${r.id}`)}" class="group grid grid-cols-[160px_1fr] gap-4 items-center border border-line hover:border-crimson/60 bg-soot/30 transition-colors duration-500 p-3">
            <div class="relative overflow-hidden aspect-[4/3] bg-soot">
              ${
                r.image
                  ? `<img src="${r.image.sm}" alt="${esc(r.title)}" loading="lazy" decoding="async"
                       class="img-cine absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms]" />`
                  : ""
              }
            </div>
            <div class="min-w-0">
              <p class="tfa mb-2">${faDate(r.date)}</p>
              <p class="font-bold leading-snug line-clamp-2 text-ash group-hover:text-bone transition-colors">${esc(r.title)}</p>
            </div>
          </a>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    <!-- prev/next -->
    <nav class="border-t border-line grid grid-cols-2" aria-label="پیمایش بین اخبار">
      <a href="${withBase(`/news/${prev.id}`)}" class="group py-8 md:py-12 px-[var(--spacing-gutter)] border-l border-line hover:bg-soot transition-colors duration-500">
        <p class="tc tc-crimson mb-2 flex items-center gap-2"><i data-lucide="arrow-right" data-size="14"></i> PREV</p>
        <p class="font-bold text-ash group-hover:text-bone transition-colors line-clamp-1">${esc(prev.title)}</p>
      </a>
      <a href="${withBase(`/news/${next.id}`)}" class="group py-8 md:py-12 px-[var(--spacing-gutter)] hover:bg-soot transition-colors duration-500 text-end">
        <p class="tc tc-crimson mb-2 flex items-center gap-2 justify-end">NEXT <i data-lucide="arrow-left" data-size="14"></i></p>
        <p class="font-bold text-ash group-hover:text-bone transition-colors line-clamp-1">${esc(next.title)}</p>
      </a>
    </nav>
  </main>`;

  renderIcons(app);
  document.title = `${n.title} | گروه سینمایی شمسه فیلم`;

  if (!prefersReduced()) {
    gsap
      .timeline({ delay: 0.15 })
      .from("[data-art-kicker]", { opacity: 0, y: 14, duration: 0.6 })
      .from("[data-art-title]", { opacity: 0, y: 40, duration: 1, ease: "power4.out" }, "-=0.35");
    const hero = app.querySelector("[data-art-hero]");
    if (hero) {
      gsap.from(hero, { opacity: 0, y: 30, duration: 1, ease: "power3.out", delay: 0.4 });
    }
  }

  sectionHeaderIn(app);
  reveal(app);
  parallax(app);
}
