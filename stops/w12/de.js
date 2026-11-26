// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Zwei Sekunden an der Box",
  name: "Mercedes-AMG F1 W12 E Performance",
  summary: "Das Formel-1-Auto von 2021, das an der Wand über der Boxenstopp-Station des Museums hängt: ein Radwechsel, Schritt für Schritt zerlegt.",
  question: "Wie wechselt man vier Räder in zwei Sekunden?",
  eyebrow: "Mercedes-AMG F1 W12 E Performance, 2021",
  lede: "Der W12 hängt an der Wand hinter der Boxenstopp-Station des Museums, an der Besucher selbst einen Radwechsel probieren können. Hier ist eine Ecke eines Stopps, verlangsamt: Heber, Schlagschrauber, Zentralmutter, Nabe und zwei Räder. Gehen Sie ihn Schritt für Schritt durch und sehen Sie dann, was geschieht, wenn der Schrauber die Mutter schräg trifft.",
  look: "Finden Sie das Auto, das aufrecht an der Wand hängt, und die eine große Mutter in der Mitte jedes Rads. Dann probieren Sie die Station davor aus.",
  takeaway: "Ein Zwei-Sekunden-Stopp sind zwanzig Leute, die gleichzeitig je eine kleine Aufgabe erledigen, und jeder von ihnen kann das Rennen verlieren.",
  photo: { caption: "Fotografiert im Rennen beim Großen Preis von Österreich 2021; im Museum hängt das Auto an der Wand hinter der Boxenstopp-Station", alt: "Schwarzer Mercedes-AMG F1 W12 mit der Nummer 44 und Petronas-Schriftzug in voller Fahrt auf dem Red Bull Ring, von links" },
  components: [
    {
      label: "Boxenstopp",
      prompt: "Gehen Sie den Stopp Schritt für Schritt durch. Was hält das Rad fest, und was dreht es?",
      answer: "Die Zentralmutter hält das Rad nur fest: Mitnehmerstifte an der Nabe übertragen Antrieb und Bremsen. Deshalb reicht eine Mutter, und deshalb kann der Schrauber sie in etwa einer Viertelsekunde abdrehen. Die Mutter bleibt im Rad, also geht das alte Rad mit seiner Mutter und das neue kommt mit seiner eigenen.",
      params: { label: "Die linke vordere Ecke eines Stopps, verlangsamt" },
      talk: [
        "Jede Ecke hat eine Crew von drei: einer am Schrauber, einer nimmt das alte Rad ab, einer setzt das neue auf. Heber an Nase und Heck heben das Auto; weitere Mechaniker halten es und beobachten den Verkehr in der Boxengasse.",
        "Ein Formel-1-Rad wird von einer einzigen Zentralmutter gehalten, und die Mutter ist im Rad gehalten. Ein Druck auf den Abzug löst sie, der Schrauber schaltet selbst um, und der nächste Druck zieht die neue fest.",
        "Während das Auto zwei Sekunden steht, legen die Autos auf der Strecke mehr als 100 Meter zurück. Eine Zehntelsekunde, die an der Box verloren geht, kann auf der Strecke ein Platz sein.",
        "In Monaco 2021 traf der Schrauber die Mutter an Valtteri Bottas' W12 schräg und fräste die Klauen ab, an denen er greift. Die Mutter ließ sich nicht drehen; das Rad kam erst im Werk ab, etwa 43 Stunden später. Schalten Sie „Schrauber schräg“ ein, um es zu sehen.",
        "2021 gewann Mercedes mit dem W12 zum achten Mal in Folge die Konstrukteurswertung.",
      ],
    },
  ],
  note: "Die Phasenzeiten sind typisch für einen Zwei-Sekunden-Stopp. Die Hubhöhe der Heber und das Tempo, mit dem die beim Stehen verlorene Strecke berechnet wird, sind runde Werte.",
  unverified: [
    "Phasenzeiten des Stopps (typisch, nicht die dieses Autos)",
    "Radstand, Spurweiten und Reifengröße (nach dem Reglement 2021) und der Umriss (skizziert)",
    "Tempo für die beim Stehen verlorene Strecke (200 km/h)",
  ],
};
