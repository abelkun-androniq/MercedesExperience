// The museum route, in walking order (the museum is visited from level 8 downwards; Legend n is on level 9 − n).
// Single source for stop order and prev/next. Each slug has stops/<slug>/car.js. Rooms/levels: confirm on site.
// check: what is known to be doubtful until someone has seen the exhibit ("level": the room's level is a guess, "room":
// the car may stand in another room); the route, the stop page and the highlights say so next to the room name.
// seen: where a doubtful car was last documented elsewhere, and when (the stop's note names the source).
export default [
  { slug: "daimler-engine", room: "Legend 1", level: 8 },
  { slug: "reitwagen", room: "Legend 1", level: 8 },
  { slug: "patent-motorwagen", room: "Legend 1", level: 8 },
  { slug: "daimler-carriage", room: "Legend 1", level: 8 },
  { slug: "daimler-boat", room: "Legend 1", level: 8 },
  { slug: "victoria", room: "Legend 1", level: 8 },
  { slug: "velo", room: "Legend 1", level: 8 },
  { slug: "daimler-van", room: "Legend 1", level: 8 },
  { slug: "simplex", room: "Legend 2", level: 7 },
  { slug: "simplex-60", room: "Legend 2", level: 7 },
  { slug: "blitzen-benz", room: "Legend 2", level: 7, check: "room", seen: { room: "Legend 7", year: 2026 } },   // the banked curve: Stuttgart tourism office
  { slug: "milnes-daimler", room: "Collection 1", level: 7 },
  { slug: "lo1112", room: "Collection 1", level: 7 },
  { slug: "o302", room: "Collection 1", level: 7, check: "room", seen: { room: "Collection 4", year: 2022 } },   // Daimler Truck's photos
  { slug: "ssk", room: "Legend 3", level: 6 },
  { slug: "770", room: "Legend 3", level: 6 },
  { slug: "260d", room: "Legend 3", level: 6 },
  { slug: "540k", room: "Legend 3", level: 6 },
  { slug: "l6500", room: "Collection 2", level: 6 },
  { slug: "lp333", room: "Collection 2", level: 6 },
  { slug: "blue-wonder", room: "Collection 2", level: 6 },
  { slug: "transporter-1624", room: "Collection 2", level: 6 },
  { slug: "300", room: "Legend 4", level: 5 },
  { slug: "300sl", room: "Legend 4", level: 5 },
  { slug: "ponton", room: "Legend 4", level: 5 },
  { slug: "300slr", room: "Legend 4", level: 5 },
  { slug: "unimog", room: "Collection 3", level: 5 },
  { slug: "g-class", room: "Collection 3", level: 5 },
  { slug: "220s", room: "Legend 5", level: 4 },   // beside the 300 measuring car: the museum's own account, February 2022
  { slug: "230sl", room: "Legend 5", level: 4 },
  { slug: "600", room: "Legend 5", level: 4 },
  { slug: "300sel63", room: "Legend 5", level: 4 },
  { slug: "c111", room: "Legend 5", level: 4 },
  { slug: "esf22", room: "Legend 5", level: 4 },
  { slug: "190sl", room: "Collection 4", level: 4, check: "level" },
  { slug: "papamobil", room: "Collection 4", level: 4, check: "level" },
  { slug: "ml320", room: "Collection 4", level: 4, check: "level" },
  { slug: "500sl-diana", room: "Collection 4", level: 4, check: "level" },
  { slug: "190e", room: "Legend 6", level: 3 },
  { slug: "slk", room: "Legend 6", level: 3 },
  { slug: "a-class", room: "Legend 6", level: 3 },
  { slug: "sls", room: "Legend 6", level: 3 },
  { slug: "sls-ed", room: "Legend 6", level: 3 },
  { slug: "necar", room: "Legend 6", level: 3, check: "room" },   // photographed in the museum (Mercedes archive; a 2025 visit), room unnamed
  { slug: "w25", room: "Legend 7", level: 2 },
  { slug: "w125", room: "Legend 7", level: 2 },
  { slug: "w196r", room: "Legend 7", level: 2 },
  { slug: "500slc", room: "Legend 7", level: 2 },
  { slug: "c9", room: "Legend 7", level: 2 },
  { slug: "190e-evo2", room: "Legend 7", level: 2 },
  { slug: "w11", room: "Legend 7", level: 2, check: "room" },   // placed in Legend 7 in December 2024
  { slug: "w12", room: "Legend 7", level: 2 },   // on the wall behind the pit-stop rig
];

// The teaser page (teaser.html): the three stops with the most to show, kept in route order. Opened from there, their stop
// pages page between these three only.
export const teaser = ["blitzen-benz", "300sl", "300slr"];
