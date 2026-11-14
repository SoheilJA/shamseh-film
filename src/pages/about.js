/**
 * about.js — company identity page. Built strictly from verifiable source
 * content: production history from the archive, original logo, real credits.
 */
import { company } from "../data/company.js";
import { productions, byCategory, CATEGORIES } from "../data/productions.js";
import { toFaDigits, renderIcons, esc } from "../js/utils.js";
import { reveal, imageReveals, parallax, sectionHeaderIn } from "../js/animator.js";
import { withBase } from "../js/base.js";

const DIRECTORS = {};
productions.forEach((p) =>
  p.credits
    .filter((c) => /کارگردان/.test(c.role))
    .forEach((c) => c.people.forEach((n) => (DIRECTORS[n] = (DIRECTORS[n] || 0) + 1)))
);
const topDirectors = Object.entries(DIRECTORS).sort((a, b) => b[1] - a[1]).slice(0, 6);

export default async function aboutPage(app) {
  app.innerHTML = `
  <main id="main" class="grain">

    <!-- masthead -->
    <section class="pt-32 md:pt-44 pb-16 md:pb-24 px-[var(--spacing-gutter)]">
      <p class="tc tc-crimson mb-6">ABOUT THE STUDIO · معرفی</p>
      <h1 class="text-display font-black leading-[1.05] mb-8" data-section-title>
        گروه سینمایی<br />شمسه فیلم
      </h1>
      <p class="text-ash max-w-2xl leading-loose text-base md:text-xl">
        استودیوی تولید فیلم و محتوای سینمایی، مستقر در مشهد.
      </p>
      <div data-section-rule class="h-px w-full bg-line mt-12 md:mt-16"></div>
    </section>

    <!-- identity -->
    <section class="px-[var(--spacing-gutter)] py-16 md:py-24 grid gap-12 lg:grid-cols-12 items-center">
      <div class="lg:col-span-5 order-2 lg:order-1">
        <div class="relative overflow-hidden frame-marks bg-soot" data-img-reveal>
          <div class="aspect-[4/3] grid place-items-center p-10">
            <img src="${withBase("/assets/images/logo-lg.webp")}" alt="نشان گروه سینمایی شمسه فیلم" loading="lazy"
                 class="max-w-full max-h-full object-contain" />
          </div>
        </div>
        <p class="tc mt-4 text-center">OFFICIAL MARK · نشان رسمی (آرشیو وب‌سایت پیشین)</p>
      </div>
      <div class="lg:col-span-6 lg:col-start-7 order-1 lg:order-2">
        <p class="kicker mb-6" data-kicker>ما که هستیم <span class="tc">WHO WE ARE</span></p>
        <h2 class="text-h2 font-black mb-8 leading-snug" data-section-title>
          روایت‌هایی از دل خراسان، برای پرده سینما و تلویزیون
        </h2>
        <div class="space-y-5 text-ash leading-loose text-[.98rem] md:text-lg">
          <p>
            گروه سینمایی شمسه فیلم یک مجموعه مستقل تولید فیلم در مشهد است. هسته اصلی فعالیت استودیو،
            ساخت فیلم‌های مستند برای شبکه‌های سیما — به‌ویژه شبکه مستند و شبکه افق — و تولید فیلم‌های
            کوتاه داستانی و نماهنگ است.
          </p>
          <p>
            نام شمسه در کارنامه‌ی استودیو با مجموعه‌هایی چون «خانه‌های نورانی» گره خورده است؛ مستندهایی
            درباره حسینیه‌ها و خانه‌هایی که سال‌هاست میزبان روضه و مراسم‌اند. در کنار آن، فیلم‌های
            کوتاه داستانی مانند «ماهی پرنده»، «کودک و گربه» و «بدون لک» و نماهنگ‌هایی مانند «قرعه» و
            «تار و پود» ساخته‌اند.
          </p>
          <p>
            شمسه فیلم در قالب برنامه‌های تلویزیونی نیز با نهادهایی چون موسسه رسانه‌های صوتی و تصویری
            آستان قدس رضوی همکاری کرده و برنامه‌هایی مانند «زیر گنبد طلا» و «ماه نشان» را تولید کرده است.
          </p>
        </div>
      </div>
    </section>

    <!-- what we do: categories -->
    <section class="bg-coal border-y border-line py-16 md:py-24">
      <div class="px-[var(--spacing-gutter)]">
        <p class="kicker mb-6" data-kicker>حوزه‌های تولید <span class="tc">WHAT WE MAKE</span></p>
        <h2 class="text-h2 font-black mb-12" data-section-title>چهار خط تولید</h2>
        <div class="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          ${CATEGORIES.filter(c => c.key !== "all").map((c, i) => `
          <a href="${withBase(`/productions?cat=${c.key}`)}" class="group bg-coal hover:bg-soot transition-colors duration-500 p-7 md:p-9 flex flex-col justify-between min-h-48">
            <p class="tc tc-crimson">0${toFaDigits(i + 1)} · ${toFaDigits(byCategory(c.key).length)} اثر</p>
            <div class="mt-10">
              <h3 class="text-h3 font-black mb-3">${c.fa}</h3>
              <p class="tc group-hover:text-bone transition-colors">VIEW ARCHIVE →</p>
            </div>
          </a>`).join("")}
        </div>
      </div>
    </section>

    <!-- key people -->
    <section class="px-[var(--spacing-gutter)] py-16 md:py-24">
      <p class="kicker mb-6" data-kicker>چهره‌های پشت دوربین <span class="tc">FILMMAKERS</span></p>
      <h2 class="text-h2 font-black mb-12" data-section-title>کارگردانان آرشیو</h2>
      <div class="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
        ${topDirectors.map(([name, count]) => `
        <div class="bg-ink p-7 md:p-8 flex items-baseline justify-between gap-4">
          <p class="font-bold text-lg md:text-xl">${esc(name)}</p>
          <p class="tfa">${toFaDigits(count)} اثر</p>
        </div>`).join("")}
      </div>
      <p class="tc mt-6">COUNTED FROM ARCHIVE CREDITS · بر اساس عوامل ثبت‌شده در آرشیو</p>
    </section>

    <!-- numbers strip -->
    <section class="border-y border-line bg-coal">
      <div class="grid grid-cols-2 md:grid-cols-4">
        ${[
          [toFaDigits(productions.length), "TOTAL PRODUCTIONS", "اثر تولیدشده"],
          [toFaDigits(byCategory("documentary").length), "DOCUMENTARIES", "مستند"],
          [toFaDigits(byCategory("fiction").length), "SHORT FILMS", "فیلم کوتاه داستانی"],
          [toFaDigits(4), "TV PARTNERS", "همکاری تلویزیونی"],
        ].map(([n, en, fa]) => `
        <div class="p-8 md:p-12 border-l border-line last:border-l-0 md:[&:nth-child(2)]:border-l">
          <p class="text-h1 font-black mb-3">${n}</p>
          <p class="tc mb-1" style="font-size:.6rem">${en}</p>
          <p class="text-smoke text-sm">${fa}</p>
        </div>`).join("")}
      </div>
    </section>

    <!-- location -->
    <section class="px-[var(--spacing-gutter)] py-16 md:py-24">
      <div class="grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <p class="kicker mb-6" data-kicker>محل استودیو <span class="tc">LOCATION</span></p>
          <h2 class="text-h2 font-black mb-6" data-section-title>مشهد، خراسان رضوی</h2>
          <address class="not-italic text-ash leading-loose text-lg">
            ${company.address}
          </address>
          <div class="mt-8 flex flex-wrap gap-4">
            <a href="${withBase("/contact")}" class="btn-cine">صفحه ارتباط با ما <i data-lucide="arrow-left" data-size="16"></i></a>
            <a href="${company.phoneHref}" class="btn-ghost" dir="ltr">${company.phone}</a>
          </div>
        </div>
        <div class="relative overflow-hidden frame-marks" data-img-reveal>
          <img src="${company.heroSlides[0].image}" alt="نمای تولیدات شمسه فیلم" loading="lazy"
               class="img-cine w-full aspect-[16/10] object-cover" data-parallax="7" />
        </div>
      </div>
    </section>
  </main>`;

  renderIcons(app);
  document.title = "معرفی | گروه سینمایی شمسه فیلم";
  app.querySelectorAll("section").forEach((s) => sectionHeaderIn(s));
  reveal(app);
  imageReveals(app);
  parallax(app);
}
