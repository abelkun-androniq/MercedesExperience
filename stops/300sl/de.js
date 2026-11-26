// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Warum die Türen nach oben aufgehen",
  name: "Mercedes-Benz 300 SL Flügeltürer",
  summary: "Ein Rahmen aus dünnen geschweißten Rohren, der hoch durch den Türbereich läuft, sodass die Türen am Dach angeschlagen werden mussten; und der erste Viertakt-Benzinmotor mit Direkteinspritzung in einem Serienwagen.",
  eyebrow: "Mercedes-Benz 300 SL Coupé (W 198), 1954–1957",
  question: "Warum gehen seine Türen nach oben auf?",
  look: "Sehen Sie sich den hohen Schweller unter der offenen Tür an. Stellen Sie sich vor, darüber zu klettern.",
  takeaway: "Sehen Sie sich das Metall noch einmal an, über das Sie steigen müssten: Dieser Schweller ist der Rahmen, der seine Arbeit tut.",
  lede: "Verdrehen Sie den Rohrrahmen des 300 SL, als führe ein Vorderrad auf einen Bordstein, dann schneiden Sie seine Seiten für normale Türen herunter und verdrehen ihn noch einmal. Drehen Sie danach seinen Reihensechszylinder durch, der auf der Seite liegt und den Kraftstoff direkt in die Zylinder gespritzt bekommt.",
  photo: {
    alt: "Silberner Mercedes-Benz 300 SL Flügeltürer von 1955 mit geöffneten Türen im Mercedes-Benz Museum, von vorn rechts gesehen",
  },
  components: [
    {
      label: "Gitterrohrrahmen",
      prompt: "Was würde passieren, wenn diese Rohre tief genug für eine normale Tür lägen? Wechseln Sie den Rahmen und vergleichen Sie.",
      answer: "Mit heruntergeschnittenen Seiten behält dieses Modell nur etwa ein Drittel seiner Steifigkeit. Die hohen Rohre geben dem echten Wagen seinen hohen Schweller, also sind die Türen am Dach angeschlagen.",
      more: "Lasten und Steifigkeit des Rahmens",
      params: {
        label: "Den Rahmen verdrehen",
        modes: {
          high: "Originaler hoher Schweller",
          low: "Niedriger Schweller für normale Türen",
        },
      },
      real: {
        alt: "Der nackte schwarze Rohrrahmen eines 300 SL im Mercedes-Benz Museum",
        caption: "Der nackte Rahmen eines 300 SL, 2013 in diesem Museum fotografiert. Sehen Sie, wie hoch die Seitenrohre dort verlaufen, wo eine Tür wäre.",
      },
      talk: [
        "Rudolf Uhlenhauts Ingenieure bauten den Renn-300-SL von 1952 um einen Rahmen aus dünnen geschweißten Stahlrohren, in Dreiecken angeordnet, sodass jedes Rohr nur auf Zug oder Druck belastet wird, nie auf Biegung. Der Straßenwagen von 1954 behielt ihn.",
        "Rote Rohre stehen unter Zug, blaue unter Druck. Die Seiten bleiben nur steif, weil ihre Dreiecke tief reichen, bis hinauf durch den Bereich, wo eine Tür wäre.",
        "Also sind die Türen im Dach angeschlagen und öffnen nach oben: der Flügeltürer. Beim Einsteigen klettert man trotzdem über einen hohen, breiten Schweller.",
        "Schneiden Sie die Seiten auf einen niedrigen Schweller herunter, verdreht sich derselbe Rahmen unter derselben Last etwa dreimal so stark (in diesem einfachen Modell).",
      ],
    },
    {
      label: "Motor",
      prompt: "Folgen Sie nun der Motorhaube zur Nase. Wie passte ein hoher Sechszylinder unter diese niedrige Linie?",
      answer: "Er liegt um 45° nach links geneigt, damit die Haube niedrig sitzen konnte. Der Kraftstoff wird direkt in jeden Zylinder gespritzt: Achten Sie auf den Strahl.",
      more: "Einspritzung und Motortakte",
      params: {
        label: "Reihensechszylinder, Direkteinspritzung · Zündfolge 1-5-3-6-2-4",
      },
      talk: [
        "Der M 198 ist der überarbeitete Dreiliter-Sechszylinder der 300-Limousine: 2996 cm³, 215 PS nach DIN bei 5800 U/min. Nach der amerikanischen SAE-Norm betrug die Leistung 240 hp.",
        "Eine Bosch-Pumpe spritzt das Benzin während des Ansaugtakts direkt in jeden Zylinder: der erste Viertakt-Serienwagen mit Benzin-Direkteinspritzung. Achten Sie auf den Strahl.",
        "Der Motor ist um 45° nach links geneigt, damit die Haube niedrig sitzen konnte. Eine Trockensumpfschmierung, mit dem Öl in einem eigenen Tank, hält das Kurbelgehäuse flach.",
      ],
    },
    {
      label: "Massenausgleich",
      prompt: "Wie können sechs bewegte Kolben den Motor im Gleichgewicht lassen? Drücken Sie „30° weiter“ und folgen Sie den Pfeilen: Die Kolben 1 und 6 bewegen sich gemeinsam.",
      answer: "Die Zylinder arbeiten in spiegelbildlichen Paaren, 1 und 6, 2 und 5, 3 und 4, je eine Dritteldrehung versetzt: Ihre Stöße heben sich auf, einmal und zweimal je Umdrehung, ebenso das Kippen um die Mitte. Beim Reihenvierzylinder addieren sich die Stöße zweimal je Umdrehung dagegen.",
      more: "Motortakte",
      params: {
        label: "Reihensechszylinder · Massenkräfte",
      },
      real: {
        alt: "Ein nackter Sechszylinder-Motorblock auf einer Palette, die Kurbelwelle davor ausgelegt",
        caption: "Ein Sechszylinderblock und seine Kurbelwelle, von einem nicht genannten Motor. Verfolgen Sie die erste und die letzte Kröpfung: Sie zeigen in dieselbe Richtung, also steigen die Kolben 1 und 6 gemeinsam.",
      },
      talk: [
        "Die Kolben beschleunigen und bremsen zweimal je Umdrehung und ziehen und drücken dabei am Block: einmal je Umdrehung durch ihr eigenes Auf und Ab, zweimal je Umdrehung durch das Schwenken der Pleuelstange, das einen Kolben nahe oben schneller bewegt als nahe unten.",
        "Beim Reihensechszylinder heben sich die Kräfte und das Kippen um die Blockmitte auf. Der Vierzylinder des 190 E gleicht die Stöße einmal je Umdrehung aus, doch die zweimal je Umdrehung zeigen alle in dieselbe Richtung: Ein Vierzylinder brummt bei hoher Drehzahl, ein Sechszylinder läuft ruhig.",
        "Ausgeglichen heißt nicht gleichmäßig: Die Kurbelwelle bekommt weiterhin jede Dritteldrehung einen Arbeitstakt, an verschiedenen Stellen ihrer Länge, und der Antriebsstrang trägt diese Drehmomentstöße.",
      ],
    },
  ],
  note: "Von 1954 bis 1957 wurden 1400 Coupés gebaut. Die Idee zu einer Straßenversion kam vom amerikanischen Importeur Max Hoffman.",
  unverified: [
    "Lage der Rahmenknoten und Rohrquerschnitt; der dreifache Steifigkeitsverlust ist ein Ergebnis dieses Modells, keine Messung",
    "Pleuellänge und Lage des Motors",
    "Massenkräfte: gleiche Kolbenmassen und eine gleichmäßig versetzte, symmetrische Kurbelwelle",
    "Umriss der Karosserie",
  ],
};
