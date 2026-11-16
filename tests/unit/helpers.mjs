// Shared test helpers: load the tour and every car config (pure data, no three.js).
import tour from "../../stops/tour.js";

export { tour };
export const loadCars = () => Promise.all(tour.map(async s => (await import(`../../stops/${s.slug}/car.js`)).default));
