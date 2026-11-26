// Picks the page language before first paint (a classic script in <head>): the visitor's saved choice, else the browser's
// language. It sets <html lang>, which lib/app/i18n.js reads, and hides marked static text until it is translated.
// Keep LANGS in step with lib/app/i18n.js.
(function () {
  var LANGS = ["en", "hu", "de"];
  var lang = null;
  try { lang = localStorage.getItem("tour-lang"); } catch (e) { /* storage blocked: fall back to the browser language */ }
  if (LANGS.indexOf(lang) < 0) {
    var browser = (navigator.language || "").slice(0, 2).toLowerCase();
    lang = LANGS.indexOf(browser) < 0 ? "en" : browser;
  }
  document.documentElement.lang = lang;
  if (lang !== "en") document.documentElement.classList.add("translating");
})();
