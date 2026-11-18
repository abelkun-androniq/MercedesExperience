// Teaser page (teaser.html): the teaser stops as scroll stories (story.js), one after the other. Each story links its stop
// page with &r=teaser, so the stop pages page between these stops.
import tour, { teaser } from "../../stops/tour.js";
import { showOfflineStatus } from "./offline.js";
import { t, loadCar, localizePage, missing } from "./i18n.js";
import { h } from "./dom.js";
import { story, play } from "./story.js";

localizePage();
showOfflineStatus(document.getElementById("status"));
const cars = await Promise.all(tour.filter(s => teaser.includes(s.slug)).map(s => loadCar(s.slug)));
const credits = [...new Set(cars.filter(c => c.photo).map(c => `${c.photo.credit.author} (${c.photo.credit.license})`))];
document.getElementById("credits").textContent = t("Photos via Wikimedia Commons: {0}; each car's page links its photo's source.", credits.join(", "));

const stories = cars.map(car => story(car, { more: h("a", { class: "pill primary", href: `stop.html?s=${car.slug}&r=teaser` }, t("Open this car on its own page")) }));
document.getElementById("cars").replaceChildren(...stories.map(s => s.el));
const handles = await play(stories);
if (new URLSearchParams(location.search).has("debug")) window.__tour = { stories: handles, missing: () => [...missing], ready: true };
