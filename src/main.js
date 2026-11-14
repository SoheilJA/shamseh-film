/**
 * main.js — bootstrap: chrome, router, page registration.
 */
import "./styles/main.css";

import { headerHTML, initHeader } from "./components/Header.js";
import { mobileMenuHTML, initMobileMenu } from "./components/MobileMenu.js";
import { footerHTML, initFooter } from "./components/Footer.js";
import { searchOverlayHTML, initSearchOverlay } from "./components/SearchOverlay.js";
import { initScroll, initCustomCursor } from "./init/animations-init.js";

import { route, startRouter } from "./js/router.js";
import { renderIcons, qs } from "./js/utils.js";

import homePage from "./pages/home.js";
import aboutPage from "./pages/about.js";
import productionsPage from "./pages/productions.js";
import productionDetailPage from "./pages/productionDetail.js";
import newsPage from "./pages/news.js";
import articleDetailPage from "./pages/articleDetail.js";
import galleryPage from "./pages/gallery.js";
import contactPage from "./pages/contact.js";
import notFoundPage from "./pages/404.js";

/* ---------- boot ---------- */

document.documentElement.classList.add("js");

// static chrome
const app = qs("#app");
app.insertAdjacentHTML("beforebegin", headerHTML() + mobileMenuHTML() + searchOverlayHTML());
app.insertAdjacentHTML("afterend", footerHTML() + `<div id="curtain" aria-hidden="true"></div>`);

initHeader();
initMobileMenu();
initSearchOverlay();
initFooter();
initScroll();
initCustomCursor();

// routes
route("/", homePage);
route("/about", aboutPage);
route("/productions", productionsPage);
route("/productions/:slug", productionDetailPage);
route("/news", newsPage);
route("/news/:slug", articleDetailPage);
route("/gallery", galleryPage);
route("/contact", contactPage);
route("/404", notFoundPage);

// re-render icons + scroll triggers after each page enters
document.addEventListener("page:enter", () => renderIcons(document));

startRouter();

// restore focusability announcement for screen readers on route change
document.addEventListener("page:enter", (e) => {
  const h1 = document.querySelector("main h1");
  if (h1) h1.setAttribute("tabindex", "-1");
});
