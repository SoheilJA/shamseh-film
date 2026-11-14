/**
 * base.js — deploy base path helpers (GitHub Pages serves under /shamseh-film/).
 */

const BASE = import.meta.env.BASE_URL;

/** strip base prefix from a pathname → internal route path ("/productions") */
export function stripBase(pathname) {
  if (pathname === BASE.slice(0, -1)) return "/";
  if (BASE !== "/" && pathname.startsWith(BASE)) return pathname.slice(BASE.length - 1) || "/";
  return pathname || "/";
}

/** prefix internal route path with base for absolute asset URLs */
export function withBase(path) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return (BASE === "/" ? "" : BASE.replace(/\/$/, "")) + path;
}

/** recursively rewrite absolute "/assets/..." strings inside a data structure (in place) */
export function withBaseDeep(node) {
  if (typeof node === "string") return node.startsWith("/assets/") ? withBase(node) : node;
  if (Array.isArray(node)) {
    for (let i = 0; i < node.length; i++) node[i] = withBaseDeep(node[i]);
    return node;
  }
  if (node && typeof node === "object") {
    for (const k of Object.keys(node)) node[k] = withBaseDeep(node[k]);
    return node;
  }
  return node;
}
