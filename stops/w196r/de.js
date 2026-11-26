// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Räder verkleidet oder frei",
  name: "Mercedes-Benz W 196 R Stromlinie",
  summary: "Der Formel-1-Wagen mit zwei Karosserien: verkleidete Räder für schnelle Strecken, freie Räder für kurvige.",
  eyebrow: "Mercedes-Benz W 196 R Stromlinien-Rennwagen, 1955",
  lede: "Mercedes plante für seinen Grand-Prix-Wagen von 1954 zwei Karosserien. Verkleidete Räder senken den Luftwiderstand auf langen Geraden; freie Räder sparen Gewicht und lassen den Fahrer den Wagen in Kurven genau platzieren. Wechseln Sie die Karosserie und beobachten Sie die Luft hinter dem Vorderrad.",
  photo: {
    alt: "Silberner Mercedes-Benz W 196 R Stromlinien-Rennwagen von 1955 mit verkleideten Rädern und Startnummer 18 im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Vorderrad",
      prompt: "Von oben gesehen, in Nabenhöhe: der Vorderreifen, die Karosserie daneben und eine gestrichelte Linie quer durch die Luft hinter dem Rad. Wechseln Sie die Karosserie: Was geschieht mit der Luft direkt hinter dem Rad?",
      answer: "Hinter dem freien Reifen verliert die Luft in einem radbreiten Streifen etwa die Hälfte ihrer Geschwindigkeit: eine Spur langsamer, aufgewühlter Luft. Mit verkleidetem Rad liegt dieser Streifen in der Karosserie: Die aufgewühlte Luft des Reifens bleibt in seinem Radhaus, und außen läuft die Luft an der glatten Haut entlang. Die Stromlinie ist breiter, zeigt der Luft aber kein freies Rad: ihr Vorteil auf den schnellen Geraden von Reims und Monza. In Kurven zahlten ihre Fahrer dafür, weil sie die Vorderräder nicht sehen und platzieren konnten.",
      more: "Details zum Windkanal",
      params: {
        label: "Vordere Ecke · von oben in Nabenhöhe gesehen",
        cases: [
          {
            label: "Verkleidet",
            say: "Verkleidet: Der Reifen dreht sich in seinem eigenen Radhaus, und die Luft strömt an der glatten Karosserie entlang. Der Streifen hinter dem Rad liegt in der Karosserie.",
          },
          {
            label: "Frei",
            say: "Frei: Die Luft trifft auf den nackten Reifen und hinterlässt dahinter ein Band langsamer Luft, etwas breiter als der Reifen selbst.",
          },
        ],
      },
      talk: [
        "Für die neue 2,5-Liter-Formel 1 von 1954 plante Mercedes von Anfang an zwei Karosserien: diese Stromlinie für sehr schnelle Strecken und eine klassische mit freien Rädern.",
        "Sie gewann gleich beim ersten Start, in Reims am 4. Juli 1954: Fangio vor Kling. Zwei Wochen später, auf der engen Strecke von Silverstone, konnten die Fahrer die verkleideten Vorderräder in den Kurven nicht genau platzieren und wurden nur Vierter und Siebter.",
        "1955 fuhr die Stromlinie nur ein einziges Rennen, in Monza mit seiner neuen Steilkurve, wo Fangio gewann. Der Motor M 196, ein Reihenachtzylinder mit Direkteinspritzung und desmodromischen Ventilen, leistete nun 290 PS bei 8500 U/min.",
        "Das Bild ist ein waagrechter Schnitt in Nabenhöhe durch einen 3-D-Windkanal der vorderen Ecke, im Voraus berechnet. Die Farbe ist die Geschwindigkeit der Luft im Verhältnis zur Fahrgeschwindigkeit; grau ist fest, Karosserie und Reifen im Schnitt. Bei freiem Rad zeigt die orangefarbene Markierung, wo auf der gestrichelten Linie 36 cm hinter dem Reifen die Luft langsamer strömt als 80 % der Fahrgeschwindigkeit.",
        "Beide Karosserien wurden mit demselben Reifen, derselben Straße, derselben Geschwindigkeit und denselben Startpunkten für die Bahnen berechnet, auf Gittern mit 24 und 16 mm großen Zellen. Auf beiden Gittern verliert die Luft im Streifen hinter dem freien Reifen etwa die Hälfte ihrer Geschwindigkeit (61 % und 44 %, jeweils über fünf Durchströmungen auf wenige Punkte stabil), und ein größerer Kanal ändert das um 4 Punkte. Ob die Luft neben dem Fahrzeug mit verkleideter Karosserie schneller oder langsamer strömt, hat sich nicht eingependelt: Es ändert sich mit dem Gitter und der Kanalgröße, wird also nicht behauptet. Der Reifen steht still über einer bewegten Straße (ein drehender Reifen braucht ein feineres Modell), die Aufhängungslenker fehlen, und die Reynolds-Zahl ist etwa ein Tausendstel der des echten Wagens: Lesen Sie den Unterschied zwischen den Karosserien, nicht die Werte.",
        "Eine getrennte Abschätzung für die Gerade, mit angenommenen Luftwiderstandsbeiwerten (0,5 verkleidet, 0,7 frei), Stirnflächen und Massen, macht die Stromlinie bei denselben 290 PS etwa 20 km/h schneller. Für keine der Karosserien ist eine Höchstgeschwindigkeit überliefert, also ist das eine Veranschaulichung, kein Messwert.",
      ],
    },
    {
      label: "Motor",
      prompt: "Warum nahm Mercedes den Abtrieb aus der Mitte der Kurbelwelle? Fahren Sie die Drehzahl durch und vergleichen Sie die Verdrehung mit einem Abtrieb am Ende.",
      answer: "Aus der Mitte verdreht jede Vierergruppe von Zylindern nur die halbe Kurbelwelle gegen das Abtriebsrad. In diesem Modell trifft der Abtrieb am Ende im Drehzahlbereich auf eine Torsionsresonanz, der Abtrieb in der Mitte nicht. Mercedes-Benz nennt Schwingungen als Grund für die Wahl.",
      more: "Motortakte",
      params: {
        label: "M 196 Reihenachtzylinder, 2,5 Liter · Abtrieb in der Mitte der Kurbelwelle",
      },
      talk: [
        "Der M 196: acht Zylinder mit 76 mm Bohrung und 68,8 mm Hub, 2,5 Liter, weit auf die Seite gelegt, mit Direkteinspritzung und desmodromischen Ventilen.",
        "Seine Kurbelwelle besteht aus zwei Vierergruppen. Der Abtrieb verlässt sie über ein Zahnrad in der Mitte, zwischen den Zylindern 4 und 5, und läuft über die Kardanwelle nach hinten zum Getriebe an der Hinterachse.",
        "Eine lange Kurbelwelle ist eine Torsionsfeder mit schweren Kröpfungen. Jeder Arbeitstakt verdreht sie ein wenig; bei einer Drehzahl kommen die Stöße im Takt ihrer eigenen Schwingung, und die Verdrehung wächst: eine Resonanz. Dämpfung hält die Spitze klein.",
        "Ausgeglichen und gleichmäßig sind zweierlei: Die Massenkräfte des Achtzylinders heben sich auf, dennoch verdreht sich seine Kurbelwelle. Steifigkeit, Trägheitsmomente, Dämpfung und Zündwelligkeit hier sind veranschaulichend, nicht die des M 196.",
      ],
    },
  ],
  note: "Die Stromlinie fuhr mit dem normalen Radstand von 2350 mm; eine Version mit 2210 mm wurde 1955 in Monza erprobt, aber nicht eingesetzt. Fangio wurde in beiden Jahren Weltmeister.",
  unverified: [
    "Luftwiderstandsbeiwerte, Stirnflächen, Massen und Wirkungsgrad des Antriebs der getrennten Abschätzung für die Gerade in den technischen Fakten (eine Höchstgeschwindigkeit ist nicht überliefert, also wird keine verglichen)",
    "Spurweiten, Radradius und Lage der Nase für die Fotoanpassung (ungefähr: die Räder ergeben eine fast gerade Punktreihe)",
    "Umriss der Karosserie (vom Foto abgezeichnet)",
    "Nahaufnahme des Vorderrads: ein örtlicher 3-D-Kanal der vorderen Ecke (halbes Fahrzeug gespiegelt, bewegte Straße, Reifen mit 340 mm Radius und 150 mm Breite, still 48 mm über der Straße gehalten, Karosserieformen aus Umriss und Fotos vereinfacht, Aufhängung weggelassen), Reynolds-Zahl 10⁴ auf den Reifendurchmesser gegen etwa 10⁷",
    "Motor: Zündfolge, Pleuellänge, Lage und die Neigung von 53°; Modell der Kurbelwellenverdrehung (Steifigkeit, Trägheitsmomente, Dämpfung, Zündwelligkeit) veranschaulichend; dem M 196 werden keine kritischen Drehzahlen zugeschrieben",
    "Raum: Mythos 7",
  ],
};
