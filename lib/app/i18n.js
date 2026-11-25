// Page language. lang.js picks it before first paint and sets <html lang>; this module reads it. English is the source:
// t("English text", ...args) looks the text up in lib/app/i18n/<lang>.js (keyed by the English, first argument always a
// "double-quoted" literal so tests can find it), fills {0}, {1}… with args and writes numeric args the local way.
// Car text is translated per stop in stops/<slug>/<lang>.js: car.js's shape, strings only, merged over it by loadCar.
export const LANGS = ["en", "hu"];
const STORE = "tour-lang";   // also read by lang.js
export const lang = LANGS.includes(globalThis.document?.documentElement.lang) ? document.documentElement.lang : "en";
const catalog = lang === "en" ? null : (await import(`./i18n/${lang}.js`)).default;
export const missing = new Set();   // keys with no translation; ?debug exposes them and the e2e tests check it is empty

// A number (as toFixed gives it) written the local way: decimal comma in Hungarian. Other text passes unchanged.
export const num = v => (lang !== "en" && /^[-−]?\d+\.\d+$/.test(String(v)) ? String(v).replace(".", ",") : String(v));

export function t(text, ...args) {
  let out = text;
  if (catalog) { out = catalog[text]; if (out === undefined) { missing.add(text); out = text; } }
  return args.length ? out.replace(/\{(\d)\}/g, (_, i) => num(args[i])) : out;
}

// Overlay a translation on a car config: objects key by key, arrays item by item; null or a missing item keeps the original.
export function merge(base, over) {
  if (over == null) return base;
  if (Array.isArray(base) && Array.isArray(over)) return base.map((b, i) => merge(b, over[i]));
  if (base && typeof base === "object" && !Array.isArray(base) && typeof over === "object" && !Array.isArray(over)) {
    const out = { ...base };
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  }
  return over;
}

// slug must already be checked against stops/tour.js.
export async function loadCar(slug) {
  const car = (await import(`../../stops/${slug}/car.js`)).default;
  return lang === "en" ? car : merge(car, (await import(`../../stops/${slug}/${lang}.js`)).default);
}

// What a page keeps across the language switch, which reloads it: keepOnSwitch(save) registers a function returning
// JSON-able state, stored just before the reload; resumed() hands it back once, on the reloaded page (same URL) only.
const RESUME = "tour-resume";
let keeper = null, resume = null;
export const keepOnSwitch = save => { keeper = save; };
export const resumed = () => { const r = resume; resume = null; return r; };
try {
  const r = JSON.parse(sessionStorage.getItem(RESUME));
  sessionStorage.removeItem(RESUME);
  if (r?.url === location.href) { resume = r.state; history.scrollRestoration = "manual"; }   // the page places itself
} catch { /* storage blocked, or not in a browser: nothing to resume */ }

// Static page text (elements marked data-i18n hold their English text as the key) and the EN/HU switch in the header bar.
export function localizePage() {
  for (const el of document.querySelectorAll("[data-i18n]")) el.textContent = t(el.textContent.trim().replace(/\s+/g, " "));
  document.documentElement.classList.remove("translating");
  for (const b of document.querySelectorAll("[data-lang]")) {
    b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    b.addEventListener("click", () => {
      if (b.dataset.lang === lang) return;
      try { localStorage.setItem(STORE, b.dataset.lang); } catch { /* storage blocked: the reload falls back to the default */ }
      try { if (keeper) sessionStorage.setItem(RESUME, JSON.stringify({ url: location.href, state: keeper() })); } catch { /* the reloaded page starts afresh */ }
      location.reload();
    });
  }
}
