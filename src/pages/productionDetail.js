/**
 * productionDetail.js — cinematic editorial page for a single production:
 * hero → meta → description → videos (Aparat) → credits → gallery → related → prev/next
 */
import { productions, bySlug, byCategory } from "../data/productions.js";
import { esc, toFaDigits, faDate, renderIcons } from "../js/utils.js";
import { reveal, imageReveals, parallax, sectionHeaderIn, titleIn, gsap, prefersReduced } from "../js/animator.js";
import { productionCard } from "../components/ProductionCard.js";
import { openVideoModal } from "../components/VideoModal.js";
import { openLightbox } from "../components/Lightbox.js";
import notFoundPage from "./404.js";

export default async function productionDetailPage(app, params) {
  const p = bySlug(params.slug);
  if (!p) return notFoundPage(app, params);

  const idx = productions.findIndex((x) => x.id === p.id);
  const prev = productions[(idx - 1 + productions.length) % productions.length];
  const next = productions[(idx + 1) % productions.length];
  const related = byCategory(p.category)
    .filter((x) => x.id !== p.id)
    .slice(0, 3);
  const heroImage = p.hero || p.poster;

  app.innerHTML = `
  <main id="main" class="grain">

    <!-- ============ CINEMATIC HERO ============ -->
    <section class="relative h-[72svh] min-h-[460px] md:h-[86svh] overflow-hidden" aria-label="${esc(p.title)}">
      ${
        heroImage
          ? `<img src="${heroImage}" alt="${esc(p.title)}" decoding="async" fetchpriority="high"
               class="img-cine absolute inset-0 w-full h-full object-cover" style="transform:scale(1.06)" data-hero-img />`
          : `<div class="absolute inset-0 bg-coal"></div>`
      }
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/45"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(9,9,9,.7)_100%)]"></div>
      <div class="absolute inset-3 md:inset-5 border border-bone/10 pointer-events-none z-[5]"></div>

      <div class="relative z-10 h-full flex flex-col justify-end px-[var(--spacing-gutter)] pb-10 md:pb-14">
        <div class="max-w-4xl">
          <p class="mb-4 md:mb-5 flex items-center gap-3 flex-wrap" data-pd-kicker>
            <span class="text-crimson text-[.85rem]">${esc(p.categoryFa)} · ${toFaDigits(p.jy)}</span>
            <span class="tc tc-crimson" style="font-size:.55rem">CATEGORY</span>
          </p>
          <h1 class="text-display font-black leading-[1.03]" data-pd-title>${esc(p.title)}</h1>
          ${
            p.contentTitle && p.contentTitle !== p.title
              ? `<p class="text-ash mt-4 md:text-lg">${esc(p.contentTitle)}</p>`
              : ""
          }
        </div>
      </div>
    </section>

    <!-- ============ META STRIP ============ -->
    <div class="border-y border-line bg-coal">
      <div class="px-[var(--spacing-gutter)] py-4 flex flex-wrap items-center gap-x-8 gap-y-2 justify-between">
        <p class="tc">SCENE ${String(idx + 1).padStart(2, "0")} / ${String(productions.length).padStart(2, "0")}</p>
        <p class="tfa">${faDate(p.date)}</p>
        <p class="tfa">${p.videos.length ? `${toFaDigits(p.videos.length)} پیش‌نمایش` : "ثبت آرشیوی"}</p>
        <p class="tfa hidden sm:block">${esc(p.categoryFa)}</p>
      </div>
    </div>

    <!-- ============ BODY ============ -->
    <div class="px-[var(--spacing-gutter)] py-16 md:py-24 grid gap-14 lg:grid-cols-12">

      <!-- description column -->
      <article class="lg:col-span-7 xl:col-span-8">
        <p class="kicker mb-8" data-kicker>درباره اثر <span class="tc">SYNOPSIS</span></p>

        ${
          p.description.length
            ? `<div class="article-body text-[1.02rem] md:text-[1.12rem]">
                ${p.description.map((d) => `<p>${esc(d)}</p>`).join("")}
              </div>`
            : `<p class="text-smoke leading-loose">
                 برای این اثر، متن توضیحی در منبع اصلی ثبت نشده است؛ مشخصات و عوامل آن در بخش «عوامل» کامل حفظ شده‌اند.
               </p>`
        }

        ${
          p.tags.length
            ? `<div class="mt-12 pt-8 border-t border-line">
                <p class="tc mb-4">TAGS · برچسب‌ها</p>
                <div class="flex flex-wrap gap-2">
                  ${p.tags.map((t) => `<span class="border border-line px-3.5 py-1.5 text-sm text-smoke">${esc(t)}</span>`).join("")}
                </div>
              </div>`
            : ""
        }
      </article>

      <!-- credits column -->
      <aside class="lg:col-span-5 xl:col-span-4" aria-label="عوامل تولید">
        <p class="kicker mb-8" data-kicker>عوامل <span class="tc">CREDITS</span></p>
        ${
          p.credits.length
            ? `<dl class="border-t border-line">
                ${p.credits
                  .map(
                    (c) => `
                <div class="border-b border-line py-4 grid grid-cols-[1fr] sm:grid-cols-[10rem_1fr] gap-1 sm:gap-4 credit-row" data-credit>
                  <dt class="tfa !text-ash pt-1 text-[.8rem]">${esc(c.role)}</dt>
                  <dd class="text-bone/90 leading-relaxed">${c.people.map((n) => esc(n)).join(" · ")}</dd>
                </div>`
                  )
                  .join("")}
              </dl>`
            : `<p class="text-smoke leading-loose">فهرست عوامل برای این اثر در منبع اصلی ثبت نشده است.</p>`
        }
      </aside>
    </div>

    <!-- ============ PREVIEW (APARAT) ============ -->
    ${
      p.videos.length
        ? `
    <section class="bg-coal border-y border-line py-16 md:py-24" aria-label="پیش‌نمایش ویدیویی">
      <div class="px-[var(--spacing-gutter)]">
        <p class="kicker mb-8" data-kicker>پیش‌نمایش <span class="tc">PREVIEW</span></p>
        <div class="grid gap-5 md:gap-6 ${p.videos.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "max-w-3xl"}">
          ${p.videos
            .map(
              (v, i) => `
          <button type="button" data-video="${v.hash}" data-video-title="${esc(p.title)}${v.label ? " — " + esc(v.label) : ""}"
            class="group relative w-full border border-line bg-soot overflow-hidden" style="aspect-ratio:16/9">
            ${heroImage ? `<img src="${heroImage}" alt="" aria-hidden="true" loading="lazy" class="img-cine absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />` : ""}
            <span class="absolute inset-0 bg-ink/40"></span>
            <span class="absolute inset-0 grid place-items-center">
              <span class="relative grid place-items-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-bone/40 bg-ink/60 backdrop-blur-sm transition-all duration-500 group-hover:border-crimson group-hover:bg-crimson/90 group-hover:scale-110">
                <i data-lucide="play" data-size="24" class="text-bone translate-x-[1px]"></i>
              </span>
            </span>
            <span class="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
              <span class="tfa !text-bone">${v.label ? esc(v.label) : "پخش تیزر"}</span>
              <span class="tc" style="font-size:.55rem">${String(i + 1).padStart(2, "0")}</span>
            </span>
          </button>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    <!-- ============ GALLERY ============ -->
    ${
      p.gallery.length
        ? `
    <section class="py-16 md:py-24" aria-label="گالری تصاویر اثر">
      <div class="px-[var(--spacing-gutter)]">
        <p class="kicker mb-8" data-kicker>تصاویر اثر <span class="tc">STILLS</span></p>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4" data-pgal>
          ${p.gallery
            .map(
              (g, i) => `
          <button type="button" data-lb="${i}" class="group relative overflow-hidden ${i === 0 ? "col-span-2 md:col-span-2 row-span-2 aspect-[3/2] md:aspect-auto md:min-h-[320px]" : "aspect-[4/3]"}">
            <img src="${g.md}" alt="تصویر ${esc(p.title)} ${toFaDigits(i + 1)}" loading="lazy" decoding="async"
                 class="img-cine absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms]" />
            <span class="absolute inset-0 bg-ink/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          </button>`
            )
            .join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    <!-- ============ RELATED ============ -->
    ${
      related.length
        ? `
    <section class="bg-coal border-t border-line py-16 md:py-24" aria-label="آثار مرتبط">
      <div class="px-[var(--spacing-gutter)]">
        <div class="flex items-end justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p class="kicker mb-5" data-kicker>آثار مرتبط <span class="tc">RELATED</span></p>
            <h2 class="text-h2 font-black" data-section-title>از همان دسته</h2>
          </div>
          <a href="/productions?cat=${p.category}" class="u-link tc tc-bone hover:text-crimson transition-colors pb-2">MORE →</a>
        </div>
        <div class="grid gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          ${related.map((r, i) => productionCard(r, { variant: "portrait", index: i })).join("")}
        </div>
      </div>
    </section>`
        : ""
    }

    <!-- ============ PREV / NEXT ============ -->
    <nav class="border-t border-line grid grid-cols-2" aria-label="پیمایش بین آثار">
      <a href="/productions/${prev.id}" class="group relative py-10 md:py-16 px-[var(--spacing-gutter)] border-l border-line hover:bg-soot transition-colors duration-500">
        <p class="tc tc-crimson mb-3 flex items-center gap-2"><i data-lucide="arrow-right" data-size="14"></i> PREV · اثر پیشین</p>
        <p class="font-bold text-lg md:text-2xl text-ash group-hover:text-bone transition-colors">${esc(prev.title)}</p>
      </a>
      <a href="/productions/${next.id}" class="group relative py-10 md:py-16 px-[var(--spacing-gutter)] hover:bg-soot transition-colors duration-500">
        <p class="tc tc-crimson mb-3 flex items-center gap-2 justify-end">NEXT · اثر بعدی <i data-lucide="arrow-left" data-size="14"></i></p>
        <p class="font-bold text-lg md:text-2xl text-ash group-hover:text-bone transition-colors text-end">${esc(next.title)}</p>
      </a>
    </nav>
  </main>`;

  renderIcons(app);

  // document title for SEO-ish routing
  document.title = `${p.title} | گروه سینمایی شمسه فیلم`;

  /* ---------- behavior ---------- */

  // hero entrance
  if (!prefersReduced()) {
    const heroImg = app.querySelector("[data-hero-img]");
    if (heroImg) {
      gsap.fromTo(heroImg, { scale: 1.14, opacity: 0.6 }, { scale: 1.06, opacity: 1, duration: 1.8, ease: "power2.out" });
    }
    gsap
      .timeline({ delay: 0.2 })
      .from("[data-pd-kicker]", { opacity: 0, x: 20, duration: 0.7 })
      .from("[data-pd-title]", { opacity: 0, y: 50, duration: 1.1, ease: "power4.out" }, "-=0.4");
    gsap.from(app.querySelectorAll("[data-credit]"), {
      opacity: 0,
      y: 16,
      duration: 0.6,
      stagger: 0.045,
      ease: "power2.out",
      scrollTrigger: { trigger: "aside[aria-label='عوامل تولید']", start: "top 80%", once: true },
    });
  }

  // video modal
  app.querySelectorAll("[data-video]").forEach((btn) =>
    btn.addEventListener("click", () =>
      openVideoModal(btn.dataset.video, btn.dataset.videoTitle)
    )
  );

  // gallery lightbox
  app.querySelector("[data-pgal]")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lb]");
    if (!btn) return;
    openLightbox(p.gallery.map((g) => ({ src: g.lg, caption: p.title })), Number(btn.dataset.lb));
  });

  app.querySelectorAll("section").forEach((s) => sectionHeaderIn(s));
  reveal(app);
  imageReveals(app);
  parallax(app);
}
