/**
 * Header.js — adaptive site chrome: transparent over hero, solid after scroll.
 * Desktop: inline nav + productions dropdown + search.
 */
import { go } from "../js/utils.js";

const NAV = [
  { href: "/", label: "خانه", exact: true },
  { href: "/productions", label: "تولیدات", dropdown: true },
  { href: "/news", label: "اخبار" },
  { href: "/about", label: "معرفی" },
  { href: "/gallery", label: "گالری" },
  { href: "/contact", label: "ارتباط با ما" },
];

const DROPDOWN = [
  { href: "/productions", label: "همه آثار", tc: "ARCHIVE" },
  { href: "/productions?cat=documentary", label: "مستند", tc: "DOCUMENTARY" },
  { href: "/productions?cat=fiction", label: "داستانی", tc: "FICTION" },
  { href: "/productions?cat=music-video", label: "نماهنگ", tc: "MUSIC VIDEO" },
  { href: "/productions?cat=tv", label: "برنامه تلویزیونی", tc: "TELEVISION" },
];

export function headerHTML() {
  return `
  <header id="site-header" class="fixed inset-x-0 top-0 z-[100]">
    <div class="flex items-center justify-between gap-4 px-[var(--spacing-gutter)] h-16 md:h-20">
      <a href="/" class="group flex items-center gap-3" aria-label="شمسه فیلم — صفحه اصلی">
        <span class="inline-block w-2 h-2 bg-crimson group-hover:rotate-45 transition-transform duration-500"></span>
        <span class="leading-none">
          <span class="block text-[1.05rem] md:text-xl font-bold tracking-tight">شمسه فیلم</span>
          <span class="tc mt-1 hidden sm:block" style="font-size:.56rem">SHAMSEH FILM · MASHHAD</span>
        </span>
      </a>

      <nav class="hidden lg:flex items-center gap-8" aria-label="ناوبری اصلی">
        ${NAV.map(
          (n) => `
        <div class="relative group/nav" ${n.dropdown ? 'data-dropdown' : ""}>
          <a href="${n.href}" data-nav-link="${n.href}"
             class="u-link text-[.95rem] text-ash hover:text-bone transition-colors duration-300 py-2">
            ${n.label}
          </a>
          ${
            n.dropdown
              ? `<div class="pointer-events-none absolute top-full right-0 pt-3 opacity-0 translate-y-2 translate-x-2 transition-all duration-300 group-hover/nav:pointer-events-auto group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:translate-x-0 group-focus-within/nav:pointer-events-auto group-focus-within/nav:opacity-100">
              <div class="min-w-56 border border-line bg-ink/95 backdrop-blur-xl py-2">
                ${DROPDOWN.map(
                  (d) => `
                <a href="${d.href}" class="flex items-center justify-between gap-6 px-5 py-2.5 text-sm text-ash hover:text-bone hover:bg-soot transition-colors">
                  <span>${d.label}</span>
                  <span class="tc" style="font-size:.55rem">${d.tc}</span>
                </a>`
                ).join("")}
              </div>
            </div>`
              : ""
          }
        </div>`
        ).join("")}
      </nav>

      <div class="flex items-center gap-2 md:gap-4">
        <button type="button" data-search-open aria-label="جستجو"
          class="flex items-center justify-center w-10 h-10 text-ash hover:text-bone transition-colors">
          <i data-lucide="search" data-size="19"></i>
        </button>
        <a href="/contact" class="hidden md:inline-flex btn-cine !py-2.5 !px-5 text-sm">شروع همکاری</a>
        <button type="button" data-menu-open class="lg:hidden flex flex-col justify-center gap-[5px] w-10 h-10" aria-label="باز کردن منو" aria-expanded="false">
          <span class="menu-line block w-6 h-px bg-bone transition-transform duration-300"></span>
          <span class="menu-line block w-6 h-px bg-bone transition-opacity duration-300"></span>
          <span class="menu-line block w-4 h-px bg-bone transition-transform duration-300 self-end"></span>
        </button>
      </div>
    </div>
  </header>`;
}

/** scroll state + active link sync */
export function initHeader() {
  const header = document.getElementById("site-header");
  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.addEventListener("page:enter", (e) => {
    const path = e.detail.path.split("?")[0];
    document.querySelectorAll("[data-nav-link]").forEach((a) => {
      const navPath = a.dataset.navLink;
      const active =
        navPath === "/" ? path === "/" : path === navPath || path.startsWith(navPath + "/");
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
      a.classList.toggle("!text-bone", active);
    });
  });
}
