// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "21,5 Liter gegen die Luft",
  name: "Blitzen-Benz",
  summary: "Vier Zylinder mit je 5,4 Litern und eine spitze Karosserie: 228,1 km/h in Daytona 1911.",
  eyebrow: "Benz 200 PS „Blitzen-Benz“, 1909",
  question: "Verdoppelt doppelte Leistung die Geschwindigkeit?",
  lede: "Drehen Sie den riesigen Vierzylinder durch, dann fahren Sie eine Rekordfahrt. Die Leistung, um durch die Luft zu kommen, wächst mit der dritten Potenz der Geschwindigkeit: Viel mehr Leistung bringt nur wenig mehr Tempo.",
  photo: {
    alt: "Weißer Rekordwagen Blitzen-Benz von 1909 im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Motor",
      params: {
        label: "Vier Zylinder, 21,5 Liter · Zündfolge 1-3-4-2",
      },
      talk: [
        "Vier Zylinder mit 185 × 200 mm ergeben 21 504 cm³, etwa 5,4 Liter je Zylinder, für 200 PS bei 1600 U/min.",
        "Benz baute diesen Motor zuerst mit 15,1 Litern für den Rennwagen von 1908. Die auf 185 mm erweiterte Bohrung ergab 21,5 Liter.",
        "Hängende Ventile im Kopf, über Stoßstangen und Kipphebel von einer tief im Block liegenden Nockenwelle betätigt.",
        "Bei nur 1600 U/min bewegt der lange Hub jeden Kolben im Mittel trotzdem mit etwa 10,7 m/s, so schnell wie ein Hub von 100 mm bei 3200 U/min.",
      ],
    },
    {
      label: "Rekordfahrt",
      prompt: "Lesen Sie die Höchstgeschwindigkeit des Modells ab, schieben Sie dann die Motorleistung von 200 auf 400 PS und lesen Sie erneut ab. Hat sie sich verdoppelt?",
      answer: "Nein: Doppelte Leistung ergibt in diesem Modell etwa 294 km/h, nicht 456. Die Leistung gegen den Luftwiderstand wächst mit der dritten Potenz der Geschwindigkeit, also bringt die Verdopplung weniger als ein Drittel mehr Tempo.",
      params: {
        label: "Rekordfahrt mit voller Leistung",
        shapes: [{ label: "Blitzen-Benz" }],
      },
      talk: [
        "Bob Burman am 23. April 1911 in Daytona Beach: 228,1 km/h über die fliegende Meile, schneller als jedes Flugzeug und jeder Zug jener Zeit. Der Rekord hielt bis 1919.",
        "Barney Oldfield hatte dort 1910 mit ihm schon 211,97 km/h erreicht.",
        "Der Luftwiderstand wächst mit dem Quadrat der Geschwindigkeit, die Leistung, um ihn zu überwinden, mit der dritten Potenz. Doppelte Leistung bringt weniger als ein Drittel mehr Tempo.",
        "Der Windkanal zeigt, woher dieser Widerstand kommt. Unter „Druck“ staut sich die Luft rot vor dem Kühler; hinter dem Kopf des Fahrers und dem kurzen Heck reißt sie ab und bildet einen wirbelnden Nachlauf, dessen Unterdruck das Fahrzeug zurückzieht.",
        "Jedes Kilowatt, das in den Luftwiderstand geht, rührt am Ende diesen Nachlauf um, und die Wirbel erwärmen schließlich die Luft. Achten Sie auf die Anzeigen: In diesem Schnitt ist fast der ganze Widerstand Sog hinter dem Fahrzeug. Der Druck auf den Kühler hebt sich größtenteils dort auf, wo die Luft um seine Kanten beschleunigt, und die Reibung macht nur wenige Prozent aus.",
        "Daher der spitze Kühler und der Heckkegel: Je weniger Luft das Fahrzeug beiseiteschieben muss und je sanfter es sie dahinter wieder zusammenfließen lässt, desto kleiner der Nachlauf.",
      ],
    },
  ],
  note: "Das Fahrzeug im Museum ist einer von sechs gebauten Blitzen-Benz; die Widerstandswerte hier sind so gewählt, dass das einfache Modell die Rekordgeschwindigkeit erreicht. Der Windkanal ist eine Live-2-D-Lattice-Boltzmann-Simulation der Mittelebene: Er zeigt das Muster der Strömung, keine Messwerte.",
  unverified: [
    "Luftwiderstandsbeiwert 0,55, Stirnfläche 1,1 m², Masse 1450 kg, Rollwiderstand und Wirkungsgrad des Antriebs",
    "Ventiltrieb als hängende Ventile mit Stoßstangen gezeichnet",
    "Pleuellänge, Zylinderlage, Radstand",
    "Dass sechs gebaut wurden",
    "Umriss und Mittelschnitt: von einem Seitenfoto über eine angepasste Kamera abgezeichnet, etwa ±5 cm; Windlauf abgerundet, Fahrer, Kurbelgehäuse und flacher Unterboden angenommen",
    "Windkanal: ein 2-D-Schnitt bei viel kleinerer Reynolds-Zahl als am echten Fahrzeug (etwa 10⁴ gegen 10⁷), die Räder außerhalb; seine Widerstandsaufteilung gilt für den Schnitt",
  ],
};
