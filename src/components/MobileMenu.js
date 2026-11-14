/**
 * MobileMenu.js — near-full-screen navigation drawer.
 * Staggered entrance, production categories, contact info, socials.
 */
import { company } from "../data/company.js";

export function mobileMenuHTML() {
  const links = [
    { href: "/", label: "خانه", tc: "01", exact: true },
    { href: "/productions", label: "تولیدات", tc: "02" },
    { href: "/news", label: "اخبار", tc: "03" },
    { href: "/about", label: "معرفی", tc: "04" },
    { href: "/gallery", label: "گالری تصاویر", tc: "05" },
    { href: "/contact", label: "ارتباط با ما", tc: "06" },
  ];
  const cats = [
    { href: "/productions?cat=documentary", label: "مستند" },
    { href: "/productions?cat=fiction", label: "داستانی" },
    { href: "/productions?cat=music-video", label: "نماهنگ" },
    { href: "/productions?cat=tv", label: "برنامه تلویزیونی" },
  ];

  return `
  <div id="mobile-menu" class="fixed inset-0 z-[150] invisible" role="dialog" aria-modal="true" aria-label="منوی ناوبری" aria-hidden="true">
    <div class="mm-veil absolute inset-0 bg-[#050505]/70 backdrop-blur-sm opacity-0"></div>
    <div class="mm-panel absolute inset-y-0 right-0 w-full max-w-md bg-ink border-l border-line flex flex-col translate-x-full">
      <div class="flex items-center justify-between px-6 h-16 border-b border-line">
        <span class="flex items-center gap-2.5"><span class="tfa">ناوبری</span><span class="tc" style="font-size:.55rem">MENU</span></span>
        <button type="button" data-menu-close aria-label="بستن منو" class="flex items-center justify-center w-10 h-10 text-ash hover:text-bone transition-colors">
          <i data-lucide="x" data-size="22"></i>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-6 py-8" aria-label="منوی موبایل">
        <ul class="space-y-1">
          ${links
            .map(
              (l) => `
          <li class="mm-item opacity-0">
            <a href="${l.href}" class="group flex items-baseline gap-4 py-3 border-b border-line/60">
              <span class="tc tc-crimson">${l.tc}</span>
              <span class="text-2xl font-bold group-hover:text-crimson group-active:text-crimson transition-colors">${l.label}</span>
            </a>
          </li>`
            )
            .join("")}
        </ul>

        <p class="mt-10 mb-3 flex items-center gap-2.5"><span class="tfa">دسته‌ها</span><span class="tc" style="font-size:.55rem">CATEGORIES</span></p>
        <div class="flex flex-wrap gap-2 mm-item opacity-0">
          ${cats
            .map(
              (c) => `
          <a href="${c.href}" class="border border-line px-4 py-2 text-sm text-ash hover:text-bone hover:border-crimson transition-colors">${c.label}</a>`
            )
            .join("")}
        </div>
      </nav>

      <div class="px-6 py-6 border-t border-line space-y-3 mm-item opacity-0">
        <a href="tel:+98${company.phone.replace("0", "")}" class="flex items-center gap-3 text-ash hover:text-bone transition-colors" dir="ltr">
          <i data-lucide="phone" data-size="16"></i><span class="text-sm">${company.phone}</span>
        </a>
        <a href="tel:+98${company.mobiles[0].replace("0", "")}" class="flex items-center gap-3 text-ash hover:text-bone transition-colors" dir="ltr">
          <i data-lucide="smartphone" data-size="16"></i><span class="text-sm">${company.mobiles[0]}</span>
        </a>
        <div class="flex items-center gap-4 pt-2">
          ${company.socials
            .map(
              (s) => `
          <a href="${s.url}" aria-label="${s.label}" class="flex items-center justify-center w-10 h-10 border border-line text-ash hover:text-bone hover:border-crimson transition-colors">
            <i data-lucide="${s.id === "telegram" ? "send" : "instagram"}" data-size="16"></i>
          </a>`
            )
            .join("")}
        </div>
      </div>
    </div>
  </div>`;
}

export function initMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  if (!menu) return;
  const panel = menu.querySelector(".mm-panel");
  const veil = menu.querySelector(".mm-veil");
  const items = menu.querySelectorAll(".mm-item");
  const openBtn = document.querySelector("[data-menu-open]");
  const closeBtn = menu.querySelector("[data-menu-close]");
  let open = false;

  const setOpen = (state) => {
    open = state;
    menu.style.visibility = state ? "visible" : "hidden";
    menu.setAttribute("aria-hidden", String(!state));
    openBtn?.setAttribute("aria-expanded", String(state));
    document.documentElement.style.overflow = state ? "hidden" : "";
    // simple, reliable transitions (no gsap dependency here)
    if (state) {
      panel.style.transition = "transform .55s cubic-bezier(.16,1,.3,1)";
      veil.style.transition = "opacity .4s ease";
      requestAnimationFrame(() => {
        panel.style.transform = "translateX(0)";
        veil.style.opacity = "1";
        items.forEach((it, i) => {
          it.style.transition = `opacity .5s ease ${0.15 + i * 0.07}s, transform .5s ease ${0.15 + i * 0.07}s`;
          it.style.opacity = "1";
          it.style.transform = "translateY(0)";
        });
      });
    } else {
      panel.style.transform = "translateX(100%)";
      veil.style.opacity = "0";
      items.forEach((it) => {
        it.style.opacity = "0";
        it.style.transform = "translateY(12px)";
      });
    }
  };

  openBtn?.addEventListener("click", () => setOpen(true));
  closeBtn?.addEventListener("click", () => setOpen(false));
  veil.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) setOpen(false);
  });
  // close on navigation
  document.addEventListener("page:enter", () => open && setOpen(false));
  // init hidden state for items
  items.forEach((it) => (it.style.transform = "translateY(12px)"));
}
