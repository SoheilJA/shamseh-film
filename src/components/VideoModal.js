/**
 * VideoModal.js — cinematic Aparat player lightbox.
 * Aparat embeds: https://www.aparat.com/video/video/embed/videohash/<hash>/vt/frame
 */
import { stopScroll, startScroll, gsap } from "../js/animator.js";

let root = null;

function ensureRoot() {
  if (root) return root;
  root = document.createElement("div");
  root.id = "video-modal";
  root.className = "veil invisible";
  root.innerHTML = `
    <div class="h-full w-full flex flex-col items-center justify-center px-[var(--spacing-gutter)] py-16">
      <div class="w-full max-w-5xl">
        <div class="flex items-center justify-between mb-3">
          <p class="tc" data-vm-title></p>
          <button type="button" data-vm-close aria-label="بستن ویدیو"
            class="tc hover:text-bone transition-colors flex items-center gap-2">
            ESC <span class="inline-grid place-items-center w-8 h-8 border border-line"><i data-lucide="x" data-size="15"></i></span>
          </button>
        </div>
        <div class="relative w-full border border-line bg-black" style="aspect-ratio:16/9">
          <iframe data-vm-frame class="absolute inset-0 w-full h-full" title="پخش ویدیو"
            allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
            allowfullscreen frameborder="0"></iframe>
        </div>
        <p class="tc mt-3 opacity-60">PLAYBACK VIA APARAT</p>
      </div>
    </div>`;
  document.body.appendChild(root);
  root.addEventListener("click", (e) => {
    if (e.target === root || e.target.closest("[data-vm-close]")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && root.style.visibility === "visible") close();
  });
  return root;
}

export function openVideoModal(aparatHash, title = "") {
  const r = ensureRoot();
  r.querySelector("[data-vm-frame]").src =
    `https://www.aparat.com/video/video/embed/videohash/${aparatHash}/vt/frame`;
  r.querySelector("[data-vm-title]").textContent = title ? `در حال پخش — ${title}` : "در حال پخش";
  import("../js/utils.js").then(({ renderIcons }) => renderIcons(r));
  r.style.visibility = "visible";
  stopScroll();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) {
    gsap.fromTo(r, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    gsap.fromTo(
      r.querySelector(".max-w-5xl"),
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.08 }
    );
  } else r.style.opacity = "1";
}

function close() {
  if (!root) return;
  const r = root;
  const done = () => {
    r.style.visibility = "hidden";
    r.querySelector("[data-vm-frame]").src = "";
    startScroll();
  };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduced) gsap.to(r, { opacity: 0, duration: 0.28, onComplete: done });
  else {
    r.style.opacity = "0";
    done();
  }
}
