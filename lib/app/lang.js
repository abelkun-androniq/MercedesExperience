// Picks the page language before first paint (a classic script in <head>): the visitor's saved choice, else the browser's
// language. It sets <html lang>, which lib/app/i18n.js reads, and hides marked static text until it is translated.
(function () {
  var lang = null;
  try { lang = localStorage.getItem("tour-lang"); } catch (e) { /* storage blocked: fall back to the browser language */ }
  if (lang !== "en" && lang !== "hu") lang = /^hu\b/i.test(navigator.language || "") ? "hu" : "en";
  document.documentElement.lang = lang;
  if (lang !== "en") document.documentElement.classList.add("translating");
})();
