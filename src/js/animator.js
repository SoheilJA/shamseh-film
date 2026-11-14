/**
 * animator.js — GSAP engine, Lenis smooth scroll, shared motion vocabulary.
 * Every helper respects prefers-reduced-motion and disables expensive
 * effects on touch devices.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { prefersReduced, isTouch } from "./utils.js";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger, prefersReduced, isTouch };

/* ---------- smooth scroll (skipped for reduced motion) ---------- */

let lenis = null;

export function initScroll() {
  if (lenis || prefersReduced()) return lenis;
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function stopScroll() {
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
}
export function startScroll() {
  lenis?.start();
  document.documentElement.style.overflow = "";
}

/** kill page-scoped triggers when leaving a route (keeps custom cursor alive) */
export function cleanupPage() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  gsap.globalTimeline.getChildren(false, true, true).forEach((t) => {
    const targets = t.targets ? t.targets() : [];
    const isCursor = targets.some(
      (n) => n.classList?.contains("cursor-dot") || n.classList?.contains("cursor-ring")
    );
    if (!isCursor) t.kill();
  });
}

/* ---------- reveal vocabulary ---------- */

/**
 * Standard scroll-reveal for [data-rv] elements.
 * data-rv="up|fade|scale" · data-rv-delay="ms" · data-rv-stagger container
 */
export function reveal(root = document, opts = {}) {
  const items = root.querySelectorAll("[data-rv]:not([data-rv-done])");
  if (!items.length) return;

  if (prefersReduced()) {
    items.forEach((n) => {
      n.style.opacity = 1;
      n.style.transform = "none";
      n.setAttribute("data-rv-done", "");
    });
    return;
  }

  items.forEach((node) => {
    const kind = node.dataset.rv || "up";
    const delay = Number(node.dataset.rvDelay || 0);
    const from = { opacity: 0, duration: 0.9, ease: "power3.out", delay };
    if (kind === "up") from.y = 34;
    if (kind === "fade") from.y = 0;
    if (kind === "scale") {
      from.scale = 0.94;
      from.y = 22;
    }
    if (kind === "line") {
      from.scaleX = 0;
      from.transformOrigin = "right center";
      from.duration = 1.1;
    }
    gsap.from(node, {
      ...from,
      scrollTrigger: { trigger: node, start: "top 88%", once: true },
      onStart: () => node.setAttribute("data-rv-done", ""),
    });
  });
  ScrollTrigger.refresh();
}

/** image mask reveal — clip-path wipe (used for full-bleed stills) */
export function imageReveals(root = document) {
  const items = root.querySelectorAll("[data-img-reveal]:not([data-img-reveal-done])");
  if (!items.length) return;
  if (prefersReduced()) {
    items.forEach((n) => {
      n.style.clipPath = "none";
      n.setAttribute("data-img-reveal-done", "");
    });
    return;
  }
  items.forEach((node) => {
    gsap.fromTo(
      node,
      { clipPath: "inset(12% 8% 12% 8%)", scale: 1.12, opacity: 0.4 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        scale: 1,
        opacity: 1,
        duration: 1.35,
        ease: "power3.out",
        scrollTrigger: { trigger: node, start: "top 85%", once: true },
        onStart: () => node.setAttribute("data-img-reveal-done", ""),
      }
    );
  });
}

/** subtle parallax on [data-parallax] media */
export function parallax(root = document) {
  if (prefersReduced() || isTouch()) return;
  root.querySelectorAll("[data-parallax]").forEach((node) => {
    const strength = Number(node.dataset.parallax || 12);
    gsap.fromTo(
      node,
      { yPercent: -strength },
      {
        yPercent: strength,
        ease: "none",
        scrollTrigger: {
          trigger: node.parentElement || node,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      }
    );
  });
}

/** cinematic title split-line entrance (SplitType) */
export async function titleIn(node, { delay = 0.1, once = true } = {}) {
  if (!node) return;
  if (prefersReduced()) return;
  const { default: SplitType } = await import("split-type");
  const split = new SplitType(node, { types: "lines" });
  // wrap lines for overflow masks
  split.lines?.forEach((line) => {
    const wrap = document.createElement("span");
    wrap.style.display = "block";
    wrap.style.overflow = "hidden";
    line.parentNode.insertBefore(wrap, line);
    wrap.appendChild(line);
  });
  gsap.from(split.lines, {
    yPercent: 110,
    opacity: 0,
    duration: 1.1,
    ease: "power4.out",
    stagger: 0.09,
    delay,
  });
  return split;
}

/** section header sequence: kicker → title → rule */
export function sectionHeaderIn(section) {
  const kicker = section.querySelector("[data-kicker]");
  const title = section.querySelector("[data-section-title]");
  const rule = section.querySelector("[data-section-rule]");
  if (kicker) reveal(kicker);
  if (title) titleIn(title, { delay: 0.15 });
  if (rule && !prefersReduced()) {
    gsap.from(rule, {
      scaleX: 0,
      transformOrigin: "right center",
      duration: 1.2,
      ease: "power3.inOut",
      scrollTrigger: { trigger: rule, start: "top 90%", once: true },
    });
  }
}
