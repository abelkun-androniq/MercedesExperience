// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Der Standuhr-Motor",
  name: "Daimler-Motor „Standuhr“",
  summary: "Der schnelllaufende Einzylinder, der das Motorfahrzeug möglich machte: Glührohrzündung und Schwungräder im geschlossenen Kurbelgehäuse.",
  eyebrow: "Einzylindermotor von Daimler und Maybach, 1884–1885",
  lede: "Der kleine, schnelllaufende Motor von Gottlieb Daimler und Wilhelm Maybach, in Zeitlupe gezeigt: Wenn sich der Kolben nach unten bewegt, öffnet der Unterdruck im Zylinder das Einlassventil, eine Nut im Schwungrad drückt das Auslassventil, und ein glühendes Röhrchen entzündet das Gemisch kurz vor dem Ende des Verdichtungstakts.",
  photo: {
    alt: "Der Standuhr-Motor von Daimler und Maybach aus dem Jahr 1885 im Mercedes-Benz Museum, entlang der Kurbelwelle gesehen",
  },
  components: [
    {
      label: "Motor",
      prompt: "Sehen Sie, wie sich der Einlass öffnet, während der Kolben abwärtsgeht.",
      params: {
        label: "Viertakt · ein Zylinder",
      },
      talk: [
        "Daimler und Maybach bauten diesen Motor 1884–85 in Cannstatt. Der aufrechte Zylinder auf dem runden Kurbelgehäuse brachte ihm den Spitznamen Standuhr ein.",
        "Er lief mit etwa 600 U/min, als die meisten Gasmotoren jener Zeit 120 bis 180 schafften. Mehr Drehzahl bei gleicher Größe heißt mehr Leistung pro Gewicht: leicht genug für ein Fahrzeug. Eine Version davon trieb 1885 den Reitwagen an.",
        "Eine Zündkerze gibt es nicht. Ein Röhrchen außerhalb des Zylinders wird von einem Brenner glühend gehalten; der Verdichtungstakt drückt Gemisch hinein, und es entzündet sich von selbst. Achten Sie auf das Glühen links am Zylinderkopf.",
        "Nur das Auslassventil wird betätigt, von einer Stange aus einer gekrümmten Nut im Schwungrad: Die Stange leuchtet auf, wenn sie das Ventil hebt. Das Einlassventil hat gar keinen Nocken: Wenn sich der Kolben nach unten bewegt, öffnet es der Unterdruck im Zylinder.",
      ],
    },
  ],
  note: "Die Geometrie ist veranschaulichend: Nur Bohrung und Hub stammen aus zeitgenössischen Angaben, Ventile und Glührohr sind vereinfacht platziert.",
  unverified: [
    "Bohrung 58 mm × Hub 100 mm (264 cm³) und 0,5–1 PS bei etwa 600 U/min: Die Quellen widersprechen sich, und manche Werte beschreiben vielleicht die Reitwagen-Version",
    "Pleuellänge, Ventilgrößen und Steuerzeiten",
    "Größe und Umriss des Kurbelgehäuses, aus dem Foto mit einem angenommenen Gehäuseradius von 220 mm skaliert",
    "Raum und Ebene",
  ],
};
