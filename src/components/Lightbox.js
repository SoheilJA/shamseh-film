/**
 * Lightbox.js — cinematic image lightbox: keyboard, touch swipe, counter.
 * Usage: openLightbox(items, index) where items = [{src, caption?}]
 */
import { stopScroll, startScroll, gsap } from "../js/animator.js";
import { esc } from "../js/utils.js";

let state = null;
let root = null;

function ensureRoot() {
  if (root) return root;
  root = document.createElement("div");
  root.id = "lightbox";
  root.className = "veil invisible";
  root.innerHTML = `
    <button type="button" data-lb-close aria-label="بستن"
      class="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex items-center gap-2 tc hover:text-bone transition-colors px-3 py-2">
      ESC <i data-lucide="x" data-size="18"></i>
    </button>
    <div class="tc absolute top-5 md:top-7 right-5 md:right-7 z-10" data-lb-counter></div>
    <button type="button" data-lb-prev aria-label="تصویر قبلی"
      class="absolute inset-y-0 right-0 z-10 w-16 md:w-24 flex items-center justify-center text-ash hover:text-bone transition-colors">
      <i data-lucide="chevron-right" data-size="30"></i>
    </button>
    <button type="button" data-lb-next aria-label="تصویر بعدی"
      class="absolute inset-y-0 left-0 z-10 w-16 md:w-24 flex items-center justify-center text-ash hover:text-bone transition-colors">
      <i data-lucide="chevron-left" data-size="30"></i>
    </button>
    <figure class="h-full w-full flex flex-col items-center justify-center px-14 md:px-28 py-16">
      <img data-lb-img class="max-w-full max-h-[78vh] object-contain shadow-2xl select-none" alt="" />
      <figcaption data-lb-cap class="tc mt-5 text-center"></figcaption>
    </figure>`;
  document.body.appendChild(root);

  root.addEventListener("click", (e) => {
    if (e.target.closest("[data-lb-close]") || e.target === root) close();
    if (e.target.closest("[data-lb-prev]")) step(1); // RTL: prev = right
    if (e.target.closest("[data-lb-next]")) step(-1);
  });
  document.addEventListener("keydown", (e) => {
    if (!state) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });

  // touch swipe
  let startX = 0;
  root.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );
  root.addEventListener(
    "touchend",
    (e) => {
      if (!state) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 48) step(dx > 0 ? 1 : -1); // swipe right = prev in RTL
    },
    { passive: true }
  );
  return root;
}

function render() {
  const item = state.items[state.index];
  const img = root.querySelector("[data-lb-img]");
  const cap = root.querySelector("[data-lb-cap]");
  const counter = root.querySelector("[data-lb-counter]");
  img.src = item.src;
  img.alt = item.caption || "تصویر گالری";
  cap.textContent = item.caption || "";
  counter.textContent = `${String(state.index + 1).padStart(2, "0")} / ${String(state.items.length).padStart(2, "0")}`;
}

function step(dir) {
  if (!state) return;
  state.index = (state.index + dir + state.items.length) % state.items.length;
  const img = root.querySelector("[data-lb-img]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    gsap.fromTo(img, { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
  }
  render();
}

export function openLightbox(items, index = 0, captionOf = () => "") {
  if (!items?.length) return;
  const r = ensureRoot();
  state = {
    index,
    items: items.map((it) =>
      typeof it === "string" ? { src: it, caption: captionOf(it) } : it
    ),
  };
  render();
  import("../js/utils.js").then(({ renderIcons }) => renderIcons(r));
  r.style.visibility = "visible";
  stopScroll();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    gsap.fromTo(r, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.fromTo(
      r.querySelector("img"),
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out", delay: 0.1 }
    );
  } else {
    r.style.opacity = "1";
  }
}

function close() {
  if (!state) return;
  state = null;
  const r = root;
  const done = () => {
    r.style.visibility = "hidden";
    startScroll();
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) gsap.to(r, { opacity: 0, duration: 0.3, ease: "power2.in", onComplete: done });
  else {
    r.style.opacity = "0";
    done();
  }
}
