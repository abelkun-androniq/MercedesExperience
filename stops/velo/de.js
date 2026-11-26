// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Zwei Riemen und eine Losscheibe",
  name: "Benz Velo",
  summary: "Das erste Serienautomobil: 1,5 PS, zwei Flachriemen für zwei Gänge und eine Losscheibe als Kupplung.",
  eyebrow: "Benz Velo, 1894",
  lede: "Von Karl Benz’ kleinem, erschwinglichem Wagen wurden bis 1902 etwa 1200 Stück verkauft. Schalten Sie, indem Sie einen Riemen von seiner Losscheibe auf die Festscheibe schieben, und finden Sie dann heraus, welche Steigung 1,5 PS mit zwei Personen an Bord schaffen.",
  photo: {
    alt: "Schwarzer Benz Velo von 1894 mit großen Speichen-Hinterrädern und kupferbeschlagener Karosserie im Mercedes-Benz Museum, von hinten rechts gesehen",
  },
  components: [
    {
      label: "Riemen und Ketten",
      params: {
        label: "Zwei Riemen, Losscheiben, Ketten",
        drive: {
          gears: [{ name: "Langsam" }, { name: "Schnell" }],
        },
      },
      real: {
        alt: "Sitzbank und Bedienelemente eines Benz Velo von 1894, die Hebel zum Riemenschalten stehen neben dem Sitz",
        caption: "Ein anderer Velo von 1894, beim London to Brighton Run: Die aufrechten Hebel neben dem Sitz verschieben die Riemen. Was bewegt sich unter dem Sitz, wenn der Fahrer einen Hebel bewegt? Im Modell gleitet der Riemen seitlich von der Losscheibe auf die Festscheibe.",
      },
      talk: [
        "Zwei Flachriemen laufen vom Motor zu einer Vorgelegewelle unter dem Sitz, einer je Gang. Neben jeder Festscheibe auf der Vorgelegewelle dreht sich eine Losscheibe; ein Riemen auf seiner Losscheibe treibt nichts an. Einen Riemen hinüberzuschieben ist Gangwechsel und Kupplung zugleich.",
        "Die Vorgelegewelle trägt das Differenzial. Von jedem Ende läuft eine Kette nach hinten zu einem Kettenrad am Hinterrad.",
        "1,5 PS bei 450 U/min ergeben im schnellen Gang in der Ebene etwa 20 km/h. Mit zwei Personen an Bord bringt ihn schon eine Steigung von wenigen Prozent im schnellen Gang zum Stehen; im langsamen Gang schafft er etwa 4 %. An steileren Hügeln stiegen die Fahrgäste aus und schoben.",
        "Damit ein am Hang angehaltener Wagen nicht zurückrollte, hatte der Velo neben seinen hölzernen Bremsklötzen auf den Vollgummireifen eine Bergstütze, eine Strebe, die auf die Straße fiel.",
      ],
    },
    {
      label: "Motor",
      params: {
        label: "Einzylinder, liegend im Heck",
      },
      talk: [
        "Ein liegender Zylinder mit 1045 cm³ (110 × 110 mm) leistet 1,5 PS bei 450 U/min.",
        "Anders als beim Patent-Motorwagen steht das Schwungrad aufrecht und dreht sich quer zum Fahrzeug.",
        "Benz blieb bei der elektrischen Zündung mit Spule und Zündkerze; das Einlassventil öffnet der Unterdruck des abwärtsgehenden Kolbens, und nur das Auslassventil wird betätigt.",
        "Der Motor sitzt hinten unter dem Rücksitz; der Kraftstoff kam zuerst aus einem Oberflächenvergaser, später aus einem Schwimmervergaser.",
      ],
    },
  ],
  note: "Benz baute 1894 67 Velos und 1895 134, bis 1902 etwa 1200 Velo- und Comfortable-Wagen, zu je 2000 Mark. Ein Velo nahm 1894 an der Fahrt Paris–Rouen teil. Ein dritter Gang und ein Rückwärtsgang waren ab 1896 auf Wunsch und ab 1900 serienmäßig zu haben.",
  unverified: [
    "Scheiben- und Kettenradgrößen und die Geschwindigkeit im langsamen Gang (etwa 12 km/h)",
    "Gesamtmasse (zwei Personen an Bord), Rollwiderstand und Wirkungsgrad des Antriebs",
    "Lage von Motor, Schwungrad und Vorgelegewelle, Pleuellänge",
    "Umriss der Karosserie (vom Foto abgezeichnet)",
    "Raum: Mythos 1",
  ],
};
