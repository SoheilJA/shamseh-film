/**
 * contact.js — contact info with click-to-call, related orgs, map link.
 * Per project rules: no fake form submission; the original contact form
 * layout is acknowledged but marked as not connected (frontend-only).
 */
import { company } from "../data/company.js";
import { renderIcons, esc } from "../js/utils.js";
import { reveal, sectionHeaderIn, parallax } from "../js/animator.js";

const MAP_QUERY = encodeURIComponent("مشهد، خیابان کوهسنگی، کوهسنگی ۲۰، پلاک ۳۱");

export default async function contactPage(app) {
  app.innerHTML = `
  <main id="main" class="grain pt-28 md:pt-36 pb-20 md:pb-32">

    <section class="px-[var(--spacing-gutter)] pb-12 md:pb-16">
      <p class="tc tc-crimson mb-5">CONTACT · ارتباط با ما</p>
      <h1 class="text-display font-black leading-[1.05] mb-6" data-section-title>بیایید روایت را شروع کنیم</h1>
      <p class="text-ash max-w-2xl leading-loose md:text-lg">
        برای همکاری تولیدی، سفارش مستند و نماهنگ، یا هر پرسش دیگری از راه‌های زیر با گروه سینمایی شمسه فیلم در تماس باشید.
      </p>
      <div data-section-rule class="h-px w-full bg-line mt-10 md:mt-14"></div>
    </section>

    <section class="px-[var(--spacing-gutter)] grid gap-10 lg:grid-cols-12">

      <!-- info column -->
      <div class="lg:col-span-5 space-y-8">
        <div class="border border-line p-6 md:p-8">
          <p class="tc tc-crimson mb-4">ADDRESS · نشانی</p>
          <address class="not-italic text-bone/90 text-lg md:text-xl leading-loose">
            ${company.address}
          </address>
          <a href="https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}" target="_blank" rel="noopener noreferrer" data-external
             class="tc tc-bone hover:text-crimson transition-colors mt-5 inline-flex items-center gap-2 border border-line px-4 py-3 hover:border-crimson">
            OPEN IN GOOGLE MAPS <i data-lucide="external-link" data-size="13"></i>
          </a>
        </div>

        <div class="border border-line p-6 md:p-8" dir="ltr">
          <p class="tc tc-crimson mb-4 text-right" dir="rtl">PHONE · تلفن تماس</p>
          <a href="${company.phoneHref}" class="group flex items-center justify-between gap-4 py-3 border-b border-line last:border-b-0">
            <span class="flex items-center gap-3 text-bone text-lg group-hover:text-crimson transition-colors">
              <i data-lucide="phone" data-size="18"></i> ${company.phone}
            </span>
            <span class="tc">LANDLINE</span>
          </a>
          ${company.mobiles
            .map(
              (m) => `
          <a href="tel:+98${m.replace("0", "")}" class="group flex items-center justify-between gap-4 py-3 border-b border-line last:border-b-0">
            <span class="flex items-center gap-3 text-bone text-lg group-hover:text-crimson transition-colors">
              <i data-lucide="smartphone" data-size="18"></i> ${m}
            </span>
            <span class="tc">MOBILE</span>
          </a>`
            )
            .join("")}
        </div>

        <div class="border border-line p-6 md:p-8">
          <p class="tc tc-crimson mb-5">SOCIAL · شبکه‌های اجتماعی</p>
          <div class="flex items-center gap-3">
            ${company.socials
              .map(
                (s) => `
            <a href="${s.url}" aria-label="${s.label}"
               class="flex items-center gap-2.5 border border-line px-5 py-3 text-ash hover:text-bone hover:border-crimson transition-colors">
              <i data-lucide="${s.id === "telegram" ? "send" : "instagram"}" data-size="16"></i>
              <span class="text-sm">${s.label}</span>
            </a>`
              )
              .join("")}
          </div>
          <p class="tc mt-4" style="font-size:.55rem">LINKS FROM THE ORIGINAL SITE (NOT YET SET)</p>
        </div>
      </div>

      <!-- map + related -->
      <div class="lg:col-span-6 lg:col-start-7 space-y-10">
        <div class="relative overflow-hidden frame-marks border border-line" data-img-reveal>
          <iframe
            title="موقعیت گروه سینمایی شمسه فیلم روی نقشه"
            src="https://www.openstreetmap.org/export/embed.html?bbox=59.5270%2C36.2660%2C59.5860%2C36.3080&layer=mapnik&marker=36.2870%2C59.5565"
            class="w-full h-[340px] md:h-[420px] grayscale invert-[0.92] contrast-[0.9] hue-rotate-180"
            loading="lazy"></iframe>
          <div class="absolute top-4 right-4 bg-ink/85 backdrop-blur px-4 py-3 border border-line">
            <p class="tc tc-bone" style="font-size:.6rem">STUDIO LOCATION</p>
            <p class="text-sm text-ash mt-1">کوهسنگی ۲۰، پلاک ۳۱</p>
          </div>
        </div>

        <div>
          <p class="tc tc-crimson mb-5">RELATED ORGANIZATIONS · پیوند‌های مرتبط</p>
          <div class="grid sm:grid-cols-2 gap-3">
            ${company.relatedLinks
              .map(
                (l) => `
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" data-external
               class="group flex items-center justify-between gap-3 border border-line px-5 py-4 hover:border-crimson/60 transition-colors">
              <span class="text-ash group-hover:text-bone transition-colors text-[.95rem]">${l.label}</span>
              <i data-lucide="arrow-up-left" data-size="15" class="text-smoke group-hover:text-crimson transition-colors"></i>
            </a>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </section>
  </main>`;

  renderIcons(app);
  document.title = "ارتباط با ما | گروه سینمایی شمسه فیلم";
  sectionHeaderIn(app);
  reveal(app);
  parallax(app);
}
