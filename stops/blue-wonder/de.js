// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Der schnellste Lkw seiner Zeit",
  name: "Mercedes-Benz Renntransporter „Blaues Wunder“",
  summary: "Diesen Transporter mit dem Motor des 300 SL gab es nur einmal. Selbst mit einem Rennwagen auf der Ladefläche soll er rund 160 km/h erreicht haben.",
  eyebrow: "Renntransporter „Blaues Wunder“, 1955",
  lede: "Die Rennabteilung wollte ihre Wagen über Nacht an der Strecke haben, oder zurück im Werk. Also baute sie einen Lkw mit Sportwagenmotor und niedriger, runder Front. Vergleichen Sie ihn mit einem kastenförmigen Lkw: Bei diesen Geschwindigkeiten geht fast die ganze Leistung ins Beiseiteschieben der Luft.",
  photo: {
    alt: "Blauer Mercedes-Benz Renntransporter von 1955 mit einem silbernen 300 SLR auf der Ladefläche im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Luftwiderstand",
      params: {
        label: "Volle Leistung auf der Autobahn",
        shapes: [{ label: "Transporter, leer" }, { label: "Mit Rennwagen" }, { label: "Kasten-Lkw, gleicher Motor" }],
      },
      talk: [
        "Rennleiter Alfred Neubauer wünschte ihn sich, und Chefingenieur Rudolf Uhlenhaut entwarf ihn, auf einem verlängerten Rahmen des 300 S. Der Motor ist der Dreiliter-Sechszylinder des 300 SL mit Benzineinspritzung, hier mit 192 PS.",
        "Der Luftwiderstand wächst mit dem Quadrat der Geschwindigkeit, die Leistung, um ihn zu überwinden, mit der dritten Potenz. Doppeltes Tempo braucht etwa die achtfache Leistung, also sind die letzten paar km/h die teuersten.",
        "Die niedrige, runde Front und die kleine Stirnfläche machen ihn schnell. Wechseln Sie zum Kasten-Lkw: gleicher Motor und gleiches Gewicht, aber eine flache Front von doppelter Größe, und die Höchstgeschwindigkeit fällt um etwa 40 km/h.",
        "Ein Rennwagen auf der offenen Ladefläche bringt Gewicht und Widerstand. Selbst beladen soll der Transporter etwa 160 km/h erreicht haben.",
        "Wechseln Sie im Windkanal die Karosserien. Die flache Front des Kasten-Lkw staut die Luft und hinterlässt hinter seiner Rückwand einen hohen Nachlauf. Über das runde Fahrerhaus des Transporters strömt die Luft glatt und reißt dann über der offenen Ladefläche ab, die ein Rennwagen teilweise ausfüllt.",
      ],
    },
  ],
  note: "Das Original wurde 1967 verschrottet; der Lkw im Museum ist ein nach Fotos und Zeichnungen wiederaufgebauter Nachbau. Auf dem Foto trägt er einen Rennsportwagen 300 SLR. Beim Motor widersprechen sich die Quellen (manche nennen einen 300-SL-Motor mit 240 PS).",
  unverified: [
    "Luftwiderstandsbeiwerte, Stirnflächen, Massen und Wirkungsgrad des Antriebs",
    "Der Kasten-Lkw ist ein erfundener Vergleich, kein echtes Fahrzeug",
    "Radstand (2900 mm), Spurweite und Lampenpositionen für die Fotoanpassung",
    "Umriss der Karosserie (vom Foto abgezeichnet)",
    "Mittelschnitte: der Transporter aus dem Umriss und Mittellinienpunkten auf dem Foto; der Rennwagen auf der Ladefläche und der Kasten-Lkw skizziert",
    "Windkanal: ein 2-D-Schnitt bei viel kleinerer Reynolds-Zahl als am echten Fahrzeug (etwa 10⁴ gegen 10⁷), die Räder außerhalb; seine Widerstandsaufteilung gilt für den Schnitt",
    "Raum: Collection 2",
  ],
};
