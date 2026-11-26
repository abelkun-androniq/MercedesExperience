// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Motor und Differenzial des ersten Automobils",
  name: "Benz Patent-Motorwagen",
  summary: "Karl Benz’ Dreirad: ein liegender Zylinder, ein waagrechtes Schwungrad und ein Differenzial, damit die Hinterräder verschieden schnell drehen können.",
  eyebrow: "Benz Patent-Motorwagen, 1886",
  lede: "Das Fahrzeug, das Karl Benz im Januar 1886 patentieren ließ. Sehen Sie dem liegenden Einzylinder hinten zu und dann dem Differenzial auf der Vorgelegewelle, das in der Kurve das äußere Hinterrad schneller laufen lässt.",
  photo: {
    alt: "Benz Patent-Motorwagen von 1886 mit grünen Rädern im Mercedes-Benz Museum, von hinten links gesehen",
  },
  components: [
    {
      label: "Motor",
      params: {
        label: "Einzylinder, liegend",
      },
      talk: [
        "Ein Zylinder mit 954 cm³ (90 × 150 mm) liegt flach im Heck und leistet 0,75 PS bei etwa 400 U/min.",
        "Auch das große Schwungrad liegt flach. Benz tat das, damit seine Kreiselwirkung in engen Kurven nicht gegen die Lenkung arbeitet.",
        "Benz zündete elektrisch, mit Spule und Zündkerze, statt mit Daimlers Glührohr.",
        "Das Modell zeigt nur Kolben, Kurbel und Schwungrad. Der echte Motor hat auch eine Ventilsteuerung, hier nicht gezeichnet: Mercedes-Benz beschreibt einen Einlassschieber und ein gesteuertes Auslassventil.",
        "Das ganze Getriebe ist ein Riemen zur Vorgelegewelle: ein Gang, kein Rückwärtsgang. Den Riemen auf eine Losscheibe neben der Antriebsscheibe zu schieben ist die Kupplung.",
      ],
    },
    {
      label: "Differenzial",
      params: {
        label: "Differenzial auf der Vorgelegewelle",
      },
      talk: [
        "In der Kurve hat das äußere Hinterrad einen weiteren Weg als das innere. Auf einer starren Welle müsste eines von beiden rutschen.",
        "Benz baute ein Differenzial in die Vorgelegewelle ein. Der Riemen dreht sein Gehäuse, und kleine Kegelräder darin lassen die beiden Abtriebswellen verschieden schnell laufen.",
        "Von jedem Ende der Vorgelegewelle läuft eine Kette zu einem Hinterrad, wie beim Fahrrad.",
        "Bewegen Sie den Lenkregler. Geradeaus laufen die kleinen Ausgleichsräder mit dem Gehäuse um, ohne sich zu drehen; in der Kurve beginnen sie zu kreisen.",
      ],
    },
  ],
  note: "Das Patent DRP 37435 vom 29. Januar 1886 gilt oft als Geburtsurkunde des Automobils. Manche Quellen nennen 91,4 × 150 mm (984 cm³) für den Motor.",
  unverified: [
    "Radgrößen, Spurweite und Radstand",
    "Pleuellänge, Schwungradgröße, Lage von Motor und Vorgelegewelle",
    "Kettenradgrößen und die Kurvengeschwindigkeit von 12 km/h",
    "Umriss der Karosserie (vom Foto abgezeichnet)",
  ],
};
