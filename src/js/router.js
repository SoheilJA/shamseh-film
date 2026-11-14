/**
 * router.js — tiny history router with cinematic page transitions.
 * Routes render into #app between persistent header/footer chrome.
 */
import { qs } from "./utils.js";
import { gsap, cleanupPage, scrollToTop, startScroll } from "./animator.js";

const routes = [];
let currentPath = null;
let transitioning = false;

export function route(pattern, page) {
  routes.push({ pattern, page });
}

function match(path) {
  for (const r of routes) {
    const keys = [];
    const regex = new RegExp(
      "^" + r.pattern.replace(/:[^/]+/g, (m) => (keys.push(m.slice(1)), "([^/]+)")) + "$"
    );
    const m = path.match(regex);
    if (m) {
      const params = {};
      keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      return { page: r.page, params };
    }
  }
  return null;
}

/** all internal navigation funnels here */
export async function navigate(path, { replace = false, instant = false } = {}) {
  if (transitioning) return;
  if (path === currentPath) {
    scrollToTop();
    return;
  }
  transitioning = true;

  const app = qs("#app");
  const curtain = qs("#curtain");
  const run = async () => {
    // teardown
    cleanupPage();
    document.dispatchEvent(new CustomEvent("page:leave"));

    const found = match(path) || match("/404") || { page: null, params: {} };
    window.history[replace ? "replaceState" : "pushState"]({}, "", path);
    currentPath = path;

    if (found.page) {
      app.innerHTML = "";
      await found.page(app, found.params);
    } else {
      app.innerHTML = "";
    }

    scrollToTop(true);
    document.dispatchEvent(new CustomEvent("page:enter", { detail: { path } }));
    transitioning = false;
  };

  if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    await run();
    return;
  }

  // curtain in → swap → curtain out
  await gsap
    .timeline()
    .to(curtain, { y: 0, duration: 0.52, ease: "power3.inOut" }, 0)
    .to(curtain, { opacity: 1, duration: 0.3 }, 0)
    .then();
  await run();
  // let the new page paint one frame
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  await gsap
    .timeline()
    .set(curtain, { y: "-100%", duration: 0 }, 0)
    .to(curtain, { y: "-200%", duration: 0.6, ease: "power3.inOut" }, 0)
    .to(curtain, { opacity: 0.0, duration: 0.2 }, 0.35)
    .then();
  gsap.set(curtain, { y: "100%", opacity: 1 });
  startScroll();
}

export function startRouter() {
  // intercept internal links
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    const href = a.getAttribute("href");
    if (!href || a.target === "_blank" || a.hasAttribute("download") || a.dataset.external !== undefined) return;
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
    e.preventDefault();
    navigate(href);
  });

  window.addEventListener("popstate", () => {
    navigate(location.pathname, { replace: true });
  });

  // initial render
  navigate(location.pathname, { replace: true, instant: true });
}

export const currentRoute = () => currentPath;
