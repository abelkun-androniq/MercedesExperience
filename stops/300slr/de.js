// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Im Inneren des Uhlenhaut-Coupés",
  name: "Mercedes-Benz 300 SLR Uhlenhaut-Coupé",
  summary: "Ein vom Grand-Prix-Wagen abgeleiteter Reihenachtzylinder mit Benzin-Direkteinspritzung und Ventilen, die Nocken statt Federn schließen.",
  eyebrow: "Mercedes-Benz 300 SLR Uhlenhaut-Coupé (W 196 S), 1955",
  question: "Wie schließt man ein Ventil ohne Feder?",
  lede: "Der Rennsportwagen, den Rudolf Uhlenhaut auf der Straße fuhr. Zwei Mechanismen: der Reihenachtzylinder, der den Kraftstoff direkt in die Zylinder gespritzt bekommt, und die desmodromische Ventilsteuerung, die ihn dort drehen ließ, wo Federn aufgeben.",
  photo: {
    alt: "Silbernes Mercedes-Benz 300 SLR Uhlenhaut-Coupé von 1955 im Mercedes-Benz Museum, von vorn rechts gesehen",
  },
  components: [
    {
      label: "Reihenachtzylinder",
      params: {
        label: "Viertakt · acht Zylinder, Direkteinspritzung",
      },
      talk: [
        "Dies ist der Reihenachtzylinder des Grand-Prix-Wagens W 196, für Sportwagenrennen vergrößert: 78 mm Bohrung und Hub, 2982 cm³ und etwa 310 PS.",
        "Eine Bosch-Pumpe spritzt den Kraftstoff während des Ansaugtakts direkt in jeden Zylinder; achten Sie auf den Strahl. Daimler-Benz kannte die Direkteinspritzung von seinen Flugmotoren.",
        "Der Motor liegt zur Seite geneigt, damit die Haube niedrig sitzen kann. Uhlenhaut, Leiter der Versuchsabteilung, nutzte dieses Coupé als Dienstwagen; es erreichte etwa 290 km/h.",
        "Nur zwei Coupés wurden gebaut. 2022 verkaufte Mercedes-Benz das andere für 135 Millionen Euro, der höchste je für ein Auto bezahlte Preis.",
      ],
    },
    {
      label: "Desmodromische Ventile",
      prompt: "Erhöhen Sie die Motordrehzahl. Wo hört das federgeschlossene Ventil auf, dem Nocken zu folgen?",
      answer: "In diesem Modell oberhalb von etwa 7000 U/min, am höchsten Punkt des Hubs: Dort muss das Ventil schneller abbremsen und umkehren, als seine Feder es zwingen kann, also fliegt es weiter, vom Nocken weg. Das desmodromische Ventil wird von einem zweiten Nocken zugezogen: Es folgt dem Nocken im ganzen gezeigten Drehzahlbereich.",
      params: {
        label: "Desmodromisches Ventil gegen federgeschlossenes Ventil",
      },
      real: {
        alt: "Nahaufnahme durch die Inspektionsöffnung eines Ducati-Motorradmotors: ein oberer Kipphebel auf dem Ventilschaftende und ein gegabelter Kipphebel unter dem Bund am Schaft",
        caption: "An diesem Ducati-Motor zieht der gegabelte Kipphebel das Ventil am Bund seines Schafts zu; der obere Kipphebel öffnet es. Der Ring markiert die Gabel; im Modell markiert derselbe Ring die Gabel des Mercedes-Schließhebels. Die Hebelanordnungen unterscheiden sich; die Idee, das Schließen mit Zwang, ist dieselbe.",
      },
      talk: [
        "Bei hoher Drehzahl kann eine Ventilfeder das Ventil nicht mehr schnell genug zurückziehen: Das Ventil hebt vom Nocken ab und kann den Kolben treffen. Erhöhen Sie die Drehzahl und sehen Sie zu, wie die Linie des Federventils die gestrichelte Nockenlinie verlässt.",
        "Die desmodromische Steuerung von Mercedes hat keine Schließfeder. Ein zweiter Nocken und ein Kipphebel ziehen das Ventil zu, also folgt das Ventil in diesem Modell im gezeigten Drehzahlbereich dem Nocken genau.",
        "Öffnungs- und Schließnocken sind aufeinander abgestimmt: Ihre Radien ergeben zusammen stets denselben Wert, so arbeiten die beiden nie gegeneinander. Ducati machte die Idee später an Motorrädern berühmt.",
      ],
    },
  ],
  note: "Die Geometrie ist veranschaulichend: Außer Bohrung und Hub sind Motormaße, Zündfolge, Neigungswinkel und Ventiltriebwerte plausible Werte, keine Werksangaben.",
  unverified: [
    "Zündfolge (allgemeiner Reihenachtzylinder)",
    "Motorneigung 33°",
    "Pleuellänge, Steuerzeiten und die Abhebedrehzahl des Federventils",
    "Umriss der Karosserie",
    "Raum und Ebene",
  ],
};
