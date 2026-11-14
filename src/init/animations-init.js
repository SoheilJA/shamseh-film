/**
 * animations-init.js — one-time global animation setup (custom cursor).
 */
import { gsap } from "../js/animator.js";
import { isTouch, prefersReduced } from "../js/utils.js";

export { initScroll } from "../js/animator.js";

export function initCustomCursor() {
  if (isTouch() || prefersReduced()) return;
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  const xTo = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
  const yTo = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
  const rxTo = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power2.out" });
  const ryTo = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power2.out" });

  window.addEventListener(
    "pointermove",
    (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
      const interactive = e.target.closest("a, button, [data-cursor]");
      ring.classList.toggle("is-active", !!interactive);
    },
    { passive: true }
  );

  // hide native cursor only on fine pointers where the custom one is visible
  document.documentElement.style.cursor = "none";
  document.querySelectorAll("a, button").forEach((n) => (n.style.cursor = "none"));
  // keep it simple: a body-level rule handles dynamic nodes
  const style = document.createElement("style");
  style.textContent = `@media (hover:hover) and (pointer:fine){ *{cursor:none !important} }`;
  document.head.appendChild(style);
}
