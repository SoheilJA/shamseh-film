/**
 * home.js — the cinematic opening:
 * hero → selected works → about → categories → news → gallery → closing
 */
import { company } from "../data/company.js";
import { productions, featured, CATEGORIES, byCategory } from "../data/productions.js";
import { news } from "../data/news.js";
import { gallerySets, allImages } from "../data/gallery.js";
import { esc, toFaDigits, faDate, renderIcons } from "../js/utils.js";
import { reveal, imageReveals, parallax, titleIn, sectionHeaderIn, gsap, prefersReduced } from "../js/animator.js";
import { productionCard } from "../components/ProductionCard.js";
import { openLightbox } from "../components/Lightbox.js";

const CATEGORY_META = [
  {
    key: "documentary",
    fa: "مستند",
    en: "DOCUMENTARY",
    desc: "روایت واقعیت؛ از حسینیه‌های قدیمی مشهد تا قاب‌های اجتماعی و تاریخی.",
    img: "ali-madad",
  },
  {
    key: "fiction",
    fa: "داستانی",
    en: "FICTION",
    desc: "فیلم‌های کوتاه داستانی؛ از «چاله» و «ماهی پرنده» تا «کودک و گربه».",
    img: "mahi-parande",
  },
  {
    key: "music-video",
    fa: "نماهنگ",
    en: "MUSIC VIDEO",
    desc: "تلاقی تصویر و موسیقی؛ «قرعه»، «تار و پود»، «عاشق السلطان» و «شمیم».",
    img: "namahang-ghoreh",
  },
  {
    key: "tv",
    fa: "برنامه تلویزیونی",
    en: "TELEVISION",
    desc: "برنامه‌های ویژه تلویزیون؛ «ملت شهر»، «ماه نشان» و «زیر گنبد طلا».",
    img: "melat-shahr",
  },
];

export default async function homePage(app) {
  const slides = company.heroSlides;
  const latestNews = [...news].slice(0, 4);
  const heroStill = featured.find((p) => p.hero)?.hero || slides[0].image;

  app.innerHTML = `
  <main id="main" class="grain">

    <!-- ============ SECTION 01 · CINEMATIC HERO ============ -->
    <section class="relative h-[100svh] min-h-[560px] overflow-hidden" aria-label="معرفی شمسه فیلم">
      <div id="hero-slides" class="absolute inset-0">
        ${slides
          .map(
            (s, i) => `
        <div class="hero-slide absolute inset-0 ${i === 0 ? "" : "opacity-0"}" data-slide="${i}">
          <img src="${s.image}" alt="${esc(s.title)}" ${i > 0 ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async"
               class="img-cine w-full h-full object-cover scale-[1.08]" />
        </div>`
          )
          .join("")}
      </div>

      <!-- cinematic overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/65 md:via-ink/35 md:to-ink/55"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(9,9,9,.75)_100%)]"></div>

      <!-- frame edges -->
      <div class="absolute inset-3 md:inset-5 border border-bone/10 pointer-events-none z-[5]"></div>

      <div class="relative z-10 h-full flex flex-col justify-between px-[var(--spacing-gutter)] pt-24 md:pt-28 pb-8 md:pb-12">
        <div class="flex items-start justify-between">
          <p class="tc tc-bone" data-hero-meta>SHAMSEH FILM — EST. MASHHAD</p>
          <p class="tc hidden md:block" data-hero-meta>35MM · DIGITAL CINEMA</p>
        </div>

        <div class="max-w-4xl">
          <p class="mb-6 md:mb-9 text-crimson text-[.82rem] leading-relaxed" data-hero-kicker>فیلم‌سازی · مستند · داستانی <span class="tc tc-crimson" style="font-size:.56rem">PRODUCTION STUDIO</span></p>
          <h1 class="text-display font-black leading-[1.02]" data-hero-title>
            هر روایت،<br />پرده‌ای از نور است.
          </h1>
          <p class="mt-6 md:mt-8 text-ash text-base md:text-xl leading-relaxed max-w-2xl" data-hero-sub>
            گروه سینمایی شمسه فیلم؛ استودیوی تولید فیلم مستند، داستانی، نماهنگ و برنامه تلویزیونی در مشهد.
          </p>
          <div class="mt-8 md:mt-10 flex flex-wrap items-center gap-4" data-hero-cta>
            <a href="/productions" class="btn-cine">
              ورود به آرشیو تولیدات
              <i data-lucide="arrow-left" data-size="17"></i>
            </a>
            <a href="/about" class="btn-ghost">آشنایی با شمسه فیلم</a>
          </div>
        </div>

        <div class="flex items-end justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="scroll-line" aria-hidden="true"></div>
            <span class="tc">SCROLL · اسکرول</span>
          </div>
          <div class="flex items-center gap-3" role="tablist" aria-label="اسلایدهای معرفی">
            ${slides
              .map(
                (s, i) => `
            <button type="button" data-hero-dot="${i}" role="tab" aria-selected="${i === 0}"
              aria-label="${esc(s.title)}"
              class="group text-right">
              <span class="hero-dot-label hidden sm:block text-[.7rem] md:text-xs mb-1.5 transition-colors ${i === 0 ? "text-bone" : "text-smoke"}">${esc(s.title)}</span>
              <span class="block h-px w-8 sm:w-16 md:w-24 transition-colors duration-500 ${i === 0 ? "bg-crimson" : "bg-bone/20 group-hover:bg-bone/50"}"></span>
            </button>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>

    <!-- ============ SECTION 02 · SELECTED WORKS ============ -->
    <section class="relative py-20 md:py-32" aria-label="تولیدات برگزیده">
      <div class="px-[var(--spacing-gutter)]">
        <div class="flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-20">
          <div>
            <p class="kicker mb-5" data-kicker>تولیدات برگزیده <span class="tc">SELECTED WORKS</span></p>
            <h2 class="text-h1 font-black" data-section-title>آثار انتخابی</h2>
          </div>
          <a href="/productions" class="u-link tc tc-bone hover:text-crimson transition-colors pb-2">
            VIEW FULL ARCHIVE (${toFaDigits(productions.length)} اثر)
          </a>
        </div>
        <div data-section-rule class="h-px w-full bg-line mb-12 md:mb-16"></div>

        <!-- featured large + editorial grid -->
        <div class="grid gap-5 md:gap-6 lg:grid-cols-12">
          <div class="lg:col-span-7">
            ${productionCard(featured[0], { variant: "landscape", index: 0, ratio: "16/10" })}
          </div>
          <div class="lg:col-span-5 grid gap-5 md:gap-6">
            ${productionCard(featured[1], { variant: "portrait", index: 1, ratio: "4/5" })}
            ${productionCard(featured[2], { variant: "portrait", index: 2, ratio: "4/5" })}
          </div>
          <div class="lg:col-span-4">
            ${productionCard(featured[3], { variant: "portrait", index: 3, ratio: "3/4" })}
          </div>
          <div class="lg:col-span-4">
            ${productionCard(featured[4], { variant: "portrait", index: 4, ratio: "3/4" })}
          </div>
          <div class="lg:col-span-4">
            ${productionCard(featured[5], { variant: "portrait", index: 5, ratio: "3/4" })}
          </div>
          <div class="lg:col-span-6">
            ${productionCard(featured[6], { variant: "landscape", index: 6, ratio: "16/10" })}
          </div>
          <div class="lg:col-span-6">
            ${productionCard(featured[7], { variant: "landscape", index: 7, ratio: "16/10" })}
          </div>
        </div>

        <div class="mt-10 md:mt-14 text-center">
          <a href="/productions" class="btn-cine">
            مشاهده همه ${toFaDigits(productions.length)} اثر
            <i data-lucide="arrow-left" data-size="17"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- ============ SECTION 03 · ABOUT ============ -->
    <section class="relative py-20 md:py-32 bg-coal border-y border-line" aria-label="درباره شمسه فیلم">
      <div class="px-[var(--spacing-gutter)] grid gap-12 lg:grid-cols-12 items-center">
        <div class="lg:col-span-5 relative">
          <div class="relative overflow-hidden frame-marks" data-img-reveal>
            <img src="${heroStill}" alt="تصویری از پشت صحنه تولیدات شمسه فیلم" loading="lazy" decoding="async"
                 class="img-cine w-full aspect-[4/5] object-cover" data-parallax="8" />
          </div>
          <div class="absolute -bottom-5 -left-3 md:-left-8 bg-crimson px-5 py-4">
            <p class="tc tc-bone" style="font-size:.6rem">SINCE ${toFaDigits(1399)}</p>
            <p class="text-bone text-sm font-bold mt-1">مشهد، ایران</p>
          </div>
        </div>
        <div class="lg:col-span-6 lg:col-start-7">
          <p class="kicker mb-6" data-kicker>معرفی <span class="tc">ABOUT</span></p>
          <h2 class="text-h2 font-black leading-snug mb-8" data-section-title>
            شمسه فیلم؛ جایی که قاب، به روایت تبدیل می‌شود.
          </h2>
          <div class="space-y-5 text-ash leading-loose text-[.98rem] md:text-lg">
            <p>
              گروه سینمایی شمسه فیلم یک مجموعه تولید فیلم و محتوای سینمایی در مشهد است که فعالیت خود را با
              ساخت مستندهایی برای شبکه‌های سیما آغاز کرد و امروز آرشیوی از تولیدات مستند، داستانی، نماهنگ و
              برنامه‌های تلویزیونی را در کارنامه دارد.
            </p>
            <p>
              از مجموعه مستند «خانه‌های نورانی» و مستندهای اجتماعی-مذهبی مانند «علی مدد» و «عاشوراییان» تا
              فیلم‌های کوتاه داستانی مانند «ماهی پرنده» و «کودک و گربه»؛ تمرکز استودیو بر روایت‌هایی است
              که از دل فضای فرهنگی و اجتماعی خراسان بیرون می‌آیند.
            </p>
          </div>
          <div class="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            ${[
              [toFaDigits(productions.length), "اثر تولیدشده"],
              [toFaDigits(4), "دسته تولید"],
              [toFaDigits(news.length + "+"), "رویداد و خبر"],
            ]
              .map(
                ([n, l]) => `
            <div>
              <p class="text-h3 font-black text-bone">${n}</p>
              <p class="tfa mt-2">${l}</p>
            </div>`
              )
              .join("")}
          </div>
          <a href="/about" class="btn-ghost mt-10 !px-0 hover:!border-transparent">
            متن کامل معرفی
            <i data-lucide="arrow-left" data-size="16"></i>
          </a>
        </div>
      </div>
    </section>

    <!-- ============ SECTION 04 · CATEGORIES ============ -->
    <section class="relative py-20 md:py-32" aria-label="دسته‌بندی تولیدات">
      <div class="px-[var(--spacing-gutter)]">
        <div class="mb-14 md:mb-20">
          <p class="kicker mb-5" data-kicker>دسته‌های تولید <span class="tc">CATEGORIES</span></p>
          <h2 class="text-h1 font-black" data-section-title>چهار قلمرو روایت</h2>
        </div>

        <div class="grid gap-5 md:gap-6 md:grid-cols-2 xl:grid-cols-4">
          ${CATEGORY_META.map((c, i) => {
            const sample = productions.find((p) => p.id === c.img);
            const count = byCategory(c.key).length;
            return `
          <a href="/productions?cat=${c.key}" class="group relative overflow-hidden bg-soot border border-line" data-cat-card>
            <div class="relative aspect-[3/4] overflow-hidden">
              ${
                sample?.hero
                  ? `<img src="${sample.hero}" alt="${esc(c.fa)}" loading="lazy" decoding="async"
                       class="img-cine absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]" />`
                  : ""
              }
              <span class="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent"></span>
            </div>
            <div class="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <p class="mb-2 flex items-center gap-2 flex-wrap"><span class="tfa !text-crimson">${toFaDigits(count)} اثر</span><span class="tc" style="font-size:.5rem">${c.en}</span></p>
              <h3 class="text-h3 font-black mb-2">${c.fa}</h3>
              <p class="text-smoke text-sm leading-relaxed mb-4 max-h-0 md:max-h-none overflow-hidden group-hover:text-ash transition-all duration-500">${c.desc}</p>
              <span class="tc tc-bone flex items-center gap-2">
                EXPLORE
                <i data-lucide="arrow-left" data-size="13" class="transition-transform duration-500 group-hover:-translate-x-1"></i>
              </span>
            </div>
          </a>`;
          }).join("")}
        </div>
      </div>
    </section>

    <!-- ============ SECTION 05 · NEWS ============ -->
    <section class="relative py-20 md:py-32 bg-coal border-y border-line" aria-label="اخبار و رویدادها">
      <div class="px-[var(--spacing-gutter)]">
        <div class="flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-20">
          <div>
            <p class="kicker mb-5" data-kicker>اخبار و رویدادها <span class="tc">NEWS & EVENTS</span></p>
            <h2 class="text-h1 font-black" data-section-title>از پشت صحنه</h2>
          </div>
          <a href="/news" class="u-link tc tc-bone hover:text-crimson transition-colors pb-2">
            ALL NEWS (${toFaDigits(news.length)})
          </a>
        </div>

        <div class="grid gap-px bg-line md:grid-cols-2">
          ${latestNews
            .map((n, i) => {
              const isLead = i === 0;
              return `
          <a href="/news/${n.id}" class="group relative bg-coal hover:bg-soot transition-colors duration-500 ${isLead ? "md:col-span-2" : ""}">
            <div class="flex flex-col ${isLead ? "md:flex-row" : ""} gap-0">
              ${
                n.image
                  ? `<div class="relative overflow-hidden ${isLead ? "md:w-1/2 aspect-[16/10] md:aspect-auto md:min-h-[340px]" : "aspect-[16/9]"}">
                    <img src="${n.image.md}" alt="${esc(n.title)}" loading="lazy" decoding="async"
                         class="img-cine absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)]" />
                  </div>`
                  : ""
              }
              <div class="flex-1 p-6 md:p-9 flex flex-col justify-between gap-6 ${isLead && n.image ? "md:w-1/2" : ""}">
                <div>
                  <p class="mb-4 flex items-center gap-2.5"><span class="tfa !text-crimson">${faDate(n.date)}</span><span class="tc" style="font-size:.55rem">NEWS</span></p>
                  <h3 class="font-bold leading-snug ${isLead ? "text-h3" : "text-lg"} group-hover:text-bone transition-colors">${esc(n.title)}</h3>
                </div>
                <span class="tc flex items-center gap-2 group-hover:text-bone transition-colors">
                  READ <i data-lucide="arrow-left" data-size="13"></i>
                </span>
              </div>
            </div>
          </a>`;
            })
            .join("")}
        </div>
      </div>
    </section>

    <!-- ============ SECTION 06 · GALLERY ============ -->
    <section class="relative py-20 md:py-32" aria-label="گالری تصاویر">
      <div class="px-[var(--spacing-gutter)]">
        <div class="flex flex-wrap items-end justify-between gap-6 mb-14 md:mb-20">
          <div>
            <p class="kicker mb-5" data-kicker>گالری تصاویر <span class="tc">STILLS</span></p>
            <h2 class="text-h1 font-black" data-section-title>قاب‌های روی پرده</h2>
          </div>
          <a href="/gallery" class="u-link tc tc-bone hover:text-crimson transition-colors pb-2">
            OPEN GALLERY (${toFaDigits(allImages.length)} FRAME)
          </a>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" id="home-gallery">
          ${allImages
            .slice(0, 8)
            .map(
              (img, i) => `
          <button type="button" data-lb-item="${i}" class="group relative overflow-hidden ${i % 5 === 0 ? "row-span-2 aspect-[3/4] md:aspect-[3/4]" : "aspect-[4/3]"}">
            <img src="${img.md}" alt="تصویر ${esc(img.set)}" loading="lazy" decoding="async"
                 class="img-cine absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-[900ms]" />
            <span class="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span class="absolute bottom-3 right-3 tfa !text-bone opacity-0 group-hover:opacity-100 transition-opacity duration-500">${esc(img.set)}</span>
          </button>`
            )
            .join("")}
        </div>
      </div>
    </section>

    <!-- ============ SECTION 07 · CLOSING ============ -->
    <section class="relative py-24 md:py-40 overflow-hidden border-t border-line" aria-label="ارتباط با شمسه فیلم">
      <div class="absolute inset-0 -z-10">
        <img src="${slides[2].image}" alt="" aria-hidden="true" loading="lazy"
             class="w-full h-full object-cover opacity-[0.14]" data-parallax="10" />
      </div>
      <div class="px-[var(--spacing-gutter)] text-center">
        <p class="tc tc-crimson mb-6">FINAL SCENE · پرسش پایانی</p>
        <h2 class="text-display font-black leading-[1.05] mb-8" data-section-title>
          روایت شما،<br />کدام پرده را روشن می‌کند؟
        </h2>
        <p class="text-ash max-w-xl mx-auto leading-loose mb-10">
          برای همکاری، سفارش تولید یا هر پرسش دیگری با گروه سینمایی شمسه فیلم در تماس باشید.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-4">
          <a href="/contact" class="btn-cine">
            ارتباط با ما
            <i data-lucide="arrow-left" data-size="17"></i>
          </a>
          <a href="${company.phoneHref}" class="btn-ghost" dir="ltr">
            <i data-lucide="phone" data-size="16"></i>
            ${company.phone}
          </a>
        </div>
      </div>
    </section>
  </main>`;

  renderIcons(app);

  /* ---------- behavior ---------- */

  // hero: crossfade slides + ken burns + entrance
  const slideEls = app.querySelectorAll(".hero-slide");
  const dots = app.querySelectorAll("[data-hero-dot]");
  let current = 0;
  const DURATION = 6500;

  if (!prefersReduced() && slideEls.length > 1) {
    let paused = false;
    const next = () => {
      if (paused) return;
      const prev = current;
      current = (current + 1) % slideEls.length;
      gsap.to(slideEls[prev], { opacity: 0, duration: 1.4, ease: "power2.inOut" });
      gsap.fromTo(
        slideEls[current],
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 1.4, ease: "power2.inOut" }
      );
      gsap.fromTo(
        slideEls[current].querySelector("img"),
        { scale: 1.08 },
        { scale: 1.14, duration: DURATION / 1000 + 1.4, ease: "none" }
      );
      dots.forEach((d, i) => {
        d.setAttribute("aria-selected", String(i === current));
        const label = d.querySelector(".hero-dot-label");
        const bar = d.querySelectorAll("span")[1];
        label.className = `hero-dot-label hidden sm:block text-[.7rem] md:text-xs mb-1.5 transition-colors ${i === current ? "text-bone" : "text-smoke"}`;
        bar.className = `block h-px w-8 sm:w-16 md:w-24 transition-colors duration-500 ${i === current ? "bg-crimson" : "bg-bone/20"}`;
      });
    };
    const timer = setInterval(next, DURATION);
    dots.forEach((d, i) =>
      d.addEventListener("click", () => {
        clearInterval(timer);
        if (i === current) return;
        gsap.to(slideEls[current], { opacity: 0, duration: 0.8 });
        gsap.fromTo(slideEls[i], { opacity: 0 }, { opacity: 1, duration: 0.8 });
        current = i;
        dots.forEach((dd, ii) => dd.setAttribute("aria-selected", String(ii === current)));
      })
    );
    // pause on tab blur
    document.addEventListener("visibilitychange", () => (paused = document.hidden));
  }

  // hero entrance
  if (!prefersReduced()) {
    const tl = gsap.timeline({ delay: 0.15 });
    tl.from("[data-hero-meta]", { opacity: 0, y: -12, duration: 0.7, stagger: 0.1 })
      .from("[data-hero-kicker]", { opacity: 0, x: 24, duration: 0.7 }, "-=0.4")
      .from("[data-hero-title]", { opacity: 0, y: 46, duration: 1.1, ease: "power4.out" }, "-=0.35")
      .from("[data-hero-sub]", { opacity: 0, y: 26, duration: 0.9 }, "-=0.65")
      .from("[data-hero-cta] > *", { opacity: 0, y: 18, stagger: 0.09, duration: 0.7 }, "-=0.55")
      .from(dots, { opacity: 0, y: 14, stagger: 0.07, duration: 0.6 }, "-=0.5");
  }

  // section sequences + reveals
  app.querySelectorAll("section").forEach((s) => sectionHeaderIn(s));
  reveal(app);
  imageReveals(app);
  parallax(app);

  // gallery lightbox
  const galNode = app.querySelector("#home-gallery");
  galNode?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lb-item]");
    if (!btn) return;
    const idx = Number(btn.dataset.lbItem);
    openLightbox(
      allImages.slice(0, 8).map((im) => ({ src: im.lg, caption: im.set })),
      idx
    );
  });
}
