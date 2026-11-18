// Page shell for every stop: stop.html?s=<slug>[&r=teaser]. Builds the page from stops/tour.js + stops/<slug>/car.js: the
// car's scroll story (story.js), where it is on the route, and prev/next.
// With r=teaser (links from teaser.html) prev/next, the stop count and the back link stay within the teaser.
import tour, { teaser } from "../../stops/tour.js";
import { registerOffline } from "./offline.js";
import { t, loadCar, localizePage, missing } from "./i18n.js";
import { h, link } from "./dom.js";
import { story, play } from "./story.js";

const params = new URLSearchParams(location.search);
const slug = params.get("s");
const teaserStops = tour.filter(s => teaser.includes(s.slug));
const inTeaser = params.get("r") === "teaser" && teaserStops.some(s => s.slug === slug);
const route = inTeaser ? teaserStops : tour;
const idx = route.findIndex(s => s.slug === slug);   // validated before any dynamic import
const app = document.getElementById("app");

localizePage();
registerOffline();
if (inTeaser) Object.assign(document.getElementById("back"), { href: "teaser.html", textContent: t("← Highlights") });
if (idx < 0) {
  document.title = t("Stop not found · Museum tour");
  app.replaceChildren(h("h1", {}, t("Stop not found")), h("p", {}, t("This QR code or link does not match a stop on the tour."), " ", link("./", t("Open the tour route"))));
} else {
  main().catch(err => {
    console.error(err);
    app.append(h("p", { class: "fail" }, t("The 3D view could not load. Check your connection and reload the page; after one visit with signal it also works offline.")));
  });
}

async function main() {
  const stop = route[idx];
  const car = await loadCar(stop.slug);
  document.title = t("{0} · Museum tour", car.name);
  const prev = route[idx - 1], next = route[idx + 1], here = s => `stop.html?s=${s.slug}${inTeaser ? "&r=teaser" : ""}`;
  const nameOf = async s => (s ? (await loadCar(s.slug)).name : null);
  const [prevName, nextName] = await Promise.all([nameOf(prev), nameOf(next)]);
  const s = story(car, { title: "h1" });
  document.getElementById("where").textContent = t("Stop {0} of {1} · {2} · Level {3}", idx + 1, route.length, t(stop.room), stop.level)
    + (stop.check ? ` · ${stop.check === "level" ? t("level not yet checked") : t("room not yet checked")}` : "");
  app.replaceChildren(s.el,
    h("nav", { class: "pager", "aria-label": t("Previous and next stop") },
      prev ? link(here(prev), `← ${prevName}`) : h("span"), next ? link(here(next), `${nextName} →`) : h("span")),
    h("p", { class: "note" }, t("Unofficial private tour notes, not affiliated with Mercedes-Benz. 3D: three.js (MIT). Mechanisms are original code from illustrative hardpoints.")));
  const handles = await play([s]);
  if (params.has("debug")) window.__tour = { stories: handles, missing: () => [...missing], ready: true };
}
