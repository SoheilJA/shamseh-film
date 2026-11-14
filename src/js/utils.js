/**
 * Shared utilities — Persian dates, DOM helpers, lucide icons.
 */

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toFaDigits(input) {
  return String(input).replace(/\d/g, (d) => FA_DIGITS[+d]);
}

const J_MONTHS = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

/** Gregorian → Jalali (https://en.wikipedia.org/wiki/Jalali_calendar algorithms) */
export function toJalali(gy, gm, gd) {
  const gDm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    gDm[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm, jd;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

/** ISO date (YYYY-MM-DD) → "۱۶ دی ۱۴۰۰" */
export function faDate(iso) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const [jy, jm, jd] = toJalali(y, m, d);
  return `${toFaDigits(jd)} ${J_MONTHS[jm - 1]} ${toFaDigits(jy)}`;
}

/** ISO date → compact "۱۴۰۰/۱۰/۱۶" */
export function faDateShort(iso) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  const [jy, jm, jd] = toJalali(y, m, d);
  return `${toFaDigits(jy)}/${toFaDigits(jm)}/${toFaDigits(jd)}`;
}

/* ---------- DOM helpers ---------- */

export const el = (html) => {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export const debounce = (fn, ms = 200) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

export const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** render lucide icons inside a root after page mount */
export function renderIcons(root = document) {
  import("lucide").then((lucide) => {
    root.querySelectorAll("i[data-lucide]").forEach((n) => {
      const raw = n.dataset.lucide;
      // kebab/snake → PascalCase lookup
      const key = raw
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
      const iconNode = lucide[key] || lucide[key + "Icon"];
      if (!iconNode) {
        n.remove();
        return;
      }
      const size = n.dataset.size ? Number(n.dataset.size) : 20;
      const cls = n.dataset.cls || "";
      const svg = lucide.createElement(iconNode, {
        width: size,
        height: size,
        "stroke-width": n.dataset.sw || "1.6",
      });
      svg.classList.add(...cls.split(" ").filter(Boolean));
      n.replaceWith(svg);
    });
  });
}

/** click-safe internal link helper — returns anchor string for router */
export const go = (path) => path;

/** escape html for user/data-provided strings injected into templates */
export function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouch = () =>
  window.matchMedia("(hover: none), (pointer: coarse)").matches;
