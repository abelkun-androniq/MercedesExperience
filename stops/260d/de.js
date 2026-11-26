// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Der erste Diesel-Pkw",
  name: "Mercedes-Benz 260 D",
  summary: "Der erste Serien-Pkw mit Dieselmotor: ein Vierzylinder mit 2,6 Litern, Vorkammern und Bosch-Einspritzung, 45 PS.",
  eyebrow: "Mercedes-Benz 260 D (W 138), 1936",
  lede: "Ein Dieselmotor hat keine Zündkerze: Das Verdichten macht die Luft heiß genug, um den Kraftstoff zu entzünden. Sehen Sie zu, wie Kraftstoff in jede Vorkammer spritzt, kurz bevor der Kolben oben ankommt, und verschieben Sie dann das Verdichtungsverhältnis.",
  photo: {
    alt: "Schwarze Mercedes-Benz 260 D Pullman-Limousine von 1938 im Mercedes-Benz Museum, von vorn rechts gesehen",
  },
  components: [
    {
      label: "Motor",
      params: {
        label: "Vierzylinder-Diesel · Zündfolge 1-3-4-2",
      },
      real: {
        alt: "Aufgeschnittener Zylinderkopf eines Ganz-Jendrassik-Dieselmotors von 1934, an den Schnittflächen rot lackiert, mit der kleinen Brennkammer neben dem Zylinder",
        caption: "Ein aufgeschnittener Ganz-Jendrassik-Dieselkopf von 1934: Auch der ungarische Motor hat eine kleine Kammer neben dem Zylinder, mit ihm durch einen engen Kanal verbunden. Wo brennt der Kraftstoff im OM 138 zuerst? Die Formen unterscheiden sich von Motor zu Motor.",
      },
      talk: [
        "Vorgestellt auf der Berliner Automobilausstellung im Februar 1936: der erste in Serie gebaute Diesel-Pkw, oft als Taxi eingesetzt.",
        "Der Motor OM 138: vier Zylinder, 90 × 100 mm, 2545 cm³, 45 PS bei 3000 U/min. Kaum ein Benziner kam mit einer Tankfüllung weiter.",
        "Der Kraftstoff wird nicht in den Zylinder selbst gespritzt, sondern in eine kleine Vorkammer im Zylinderkopf. Dort beginnt er zu brennen und schießt in den Zylinder, was den Diesel ruhig und leise genug für einen Pkw machte.",
        "Bosch lieferte die Einspritzpumpe. Schieben Sie das Verdichtungsverhältnis auf Benzinerwerte herunter, und die Luft wird nicht mehr heiß genug, um den Kraftstoff zu entzünden.",
      ],
    },
  ],
  note: "Mythos 3 ist der Raum von Diesel und Kompressor: der 260 D und die Gebläse von SSK und 540 K sind zwei Antworten auf dieselbe Frage nach mehr Leistung und Reichweite.",
  unverified: [
    "Verdichtungsverhältnis 20,5 : 1",
    "Ventiltrieb als hängende Ventile mit Stoßstangen gezeichnet",
    "Pleuellänge, Zylinderabstand, Lage des Motors",
    "Radstand und Umriss der Karosserie",
    "Fotokamera angepasst an beide rechten Räder, die Scheinwerfer, den Kühlergrill und eine geschätzte Dachhöhe (etwa 20 px Abweichung), die Überlagerung ist also ungefähr",
    "Eine Quelle nennt 3200 U/min als Nenndrehzahl",
  ],
};
