/**
 * Footer.js — the closing sequence: marquee, company block, links, credits.
 */
import { company } from "../data/company.js";

export function footerHTML() {
  const year = "۱۴۰۰–۱۴۰۱";
  return `
  <footer class="relative border-t border-line bg-coal overflow-hidden">
    <!-- latin marquee strip -->
    <div class="border-b border-line py-4 overflow-hidden" aria-hidden="true">
      <div class="marquee-track">
        ${Array(2)
          .fill(
            `<span class="tc tc-bone mx-8">SHAMSEH FILM</span>
             <span class="tc mx-8">FILM ARCHIVE</span>
             <span class="tc mx-8">DOCUMENTARY</span>
             <span class="tc mx-8">FICTION</span>
             <span class="tc mx-8">MUSIC VIDEO</span>
             <span class="tc mx-8">TELEVISION</span>
             <span class="tc tc-crimson mx-8">MASHHAD · IRAN</span>`
          )
          .join("")}
      </div>
    </div>

    <div class="px-[var(--spacing-gutter)] py-14 md:py-20 grid gap-12 md:grid-cols-12">
      <!-- company -->
      <div class="md:col-span-5">
        <p class="kicker mb-6">CONTACT · ارتباط</p>
        <h2 class="text-h3 font-bold leading-snug mb-6">
          هر روایت، یک پرده از<br class="hidden md:block"> نور است.
        </h2>
        <address class="not-italic text-ash leading-loose text-[.95rem]">
          ${company.address}
        </address>
        <div class="mt-5 space-y-2 text-[.95rem]" dir="ltr">
          <a href="${company.phoneHref}" class="block text-ash hover:text-crimson transition-colors w-fit" dir="ltr">
            <span class="tc mr-2" style="font-size:.55rem">TEL</span>${company.phone}
          </a>
          ${company.mobiles
            .map(
              (m) => `
          <a href="tel:+98${m.replace("0", "")}" class="block text-ash hover:text-crimson transition-colors w-fit" dir="ltr">
            <span class="tc mr-2" style="font-size:.55rem">MOB</span>${m}
          </a>`
            )
            .join("")}
        </div>
      </div>

      <!-- nav -->
      <nav class="md:col-span-3" aria-label="ناوبری پابرگ">
        <p class="mb-6 flex items-center gap-2.5"><span class="tfa">نقشه سایت</span><span class="tc" style="font-size:.55rem">SITEMAP</span></p>
        <ul class="space-y-3 text-ash">
          ${[
            ["/productions", "تولیدات"],
            ["/news", "اخبار"],
            ["/about", "معرفی"],
            ["/gallery", "گالری تصاویر"],
            ["/contact", "ارتباط با ما"],
          ]
            .map(
              ([href, label]) => `
          <li><a href="${href}" class="u-link hover:text-bone transition-colors">${label}</a></li>`
            )
            .join("")}
        </ul>
      </nav>

      <!-- related links -->
      <nav class="md:col-span-4" aria-label="پیوند‌های مرتبط">
        <p class="mb-6 flex items-center gap-2.5"><span class="tfa">پیوند‌های مرتبط</span><span class="tc" style="font-size:.55rem">RELATED</span></p>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-ash">
          ${company.relatedLinks
            .map(
              (l) => `
          <li>
            <a href="${l.url}" target="_blank" rel="noopener noreferrer" data-external
               class="u-link hover:text-bone transition-colors text-[.9rem]">${l.label}</a>
          </li>`
            )
            .join("")}
        </ul>
      </nav>
    </div>

    <div class="px-[var(--spacing-gutter)] py-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-smoke">© گروه سینمایی شمسه فیلم — ${year}</p>
      <div class="flex items-center gap-3">
        ${company.socials
          .map(
            (s) => `
        <a href="${s.url}" aria-label="${s.label}" class="flex items-center justify-center w-9 h-9 border border-line text-ash hover:text-bone hover:border-crimson transition-colors">
          <i data-lucide="${s.id === "telegram" ? "send" : "instagram"}" data-size="15"></i>
        </a>`
          )
          .join("")}
      </div>
      <button type="button" data-to-top class="tc hover:text-bone transition-colors flex items-center gap-2">
        BACK TO TOP <i data-lucide="arrow-up" data-size="13"></i>
      </button>
    </div>
  </footer>`;
}

export function initFooter() {
  document.querySelector("[data-to-top]")?.addEventListener("click", () => {
    import("../js/animator.js").then(({ scrollToTop }) => scrollToTop(false));
  });
}
