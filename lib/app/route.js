// Where a stop stands, as the route page, the stop pages and the highlights all say it: the room's fragment id on the
// route page and the qualifier for a placement not yet confirmed on site (stops/tour.js `check`, `seen`).
import { t } from "./i18n.js";

// index.html#room-legend-6 and the like.
export const roomId = room => `room-${room.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

// Lower-case, for after the room and level: "" when the placement is not in doubt. A doubtful room names the room where
// the car was last documented, and the year, when that is known.
export function checkNote(stop) {
  if (stop.check === "level") return t("level not yet checked");
  if (stop.check !== "room") return "";
  return stop.seen ? t("room not yet checked: last documented in {0} ({1})", t(stop.seen.room), stop.seen.year) : t("room not yet checked");
}

// The route card's line for a car whose room is in doubt (null when it is not).
export function roomCaption(stop) {
  if (stop.check !== "room") return null;
  return stop.seen ? t("Room not yet checked: last documented in {0} ({1})", t(stop.seen.room), stop.seen.year) : t("Room not yet checked: it may stand elsewhere");
}

// "Legend 2 · Level 7 · room not yet checked: …"
export const placeOf = stop => [t(stop.room), t("Level {0}", stop.level), checkNote(stop)].filter(Boolean).join(" · ");
