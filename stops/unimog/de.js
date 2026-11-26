// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Achsen über den Rädern",
  name: "Mercedes-Benz Unimog U 500",
  summary: "Der universelle Geräteträger, dessen Portalachsen die Differenziale hoch über den Boden heben.",
  eyebrow: "Mercedes-Benz Unimog U 500, 2004",
  lede: "Die Achse eines Unimog läuft nicht durch die Mitte seiner Räder, sondern über ihnen: Jede Nabe hat ein Zahnradpaar, das den Antrieb zum Rad hinunterführt. Das hebt Achsrohr und Differenzial aus dem Weg. Fahren Sie über einen Felsen und wechseln Sie zum Vergleich zu einer konventionellen Achse.",
  photo: {
    alt: "Dunkelblauer Mercedes-Benz Unimog U 500 von 2004 mit Schneefräse und Schneeketten im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Portalachse",
      params: {
        label: "Vorderachse, von vorn gesehen",
      },
      real: {
        alt: "Eine grüne Militärachse mit aufgeschnittenem Radnabengehäuse, darin ein kleines Zahnrad über einem größeren",
        caption: "Eine aufgeschnittene Portalnabe (an einem Militärfahrzeug BTR-70). Die Achswelle kommt weit oben herein, und ein Zahnradpaar führt den Antrieb hinunter zur Radmitte: Diese Stufe ist die zusätzliche Bodenfreiheit.",
      },
      talk: [
        "Unimog steht für Universal-Motor-Gerät: nach dem Krieg als kleiner Traktor entworfen, der auch schnell auf der Straße fahren konnte, und seit 1951 von Daimler-Benz gebaut.",
        "Seine Achsen sind Portalachsen. Die Halbwellen laufen über den Radmitten und treiben jedes Rad über ein Stirnradpaar in der Nabe an, so sitzen Achsrohr und Differenzial um den Versatz der Zahnräder höher und lassen darunter mehr Platz.",
        "Die Nabenzahnräder untersetzen auch: Die Wellen drehen schneller als die Räder und tragen weniger Drehmoment, also können Wellen und Differenzial leichter sein.",
        "Schraubenfedern und ein Leiterrahmen, der sich verwinden darf, lassen jedes Rad dem Boden folgen. Dieser U 500 ist für den Winterdienst ausgerüstet.",
      ],
    },
    {
      label: "Differenzialsperren",
      prompt: "Schlamm unter dem linken Hinterrad, vorn ein steiler Acker. Mit offenem Differenzial dreht das linke Rad durch, und der Unimog bleibt stehen. Was hilft genug: Lamellen, die den Schlupf begrenzen, oder eine Sperre?",
      answer: "Hier nur die Sperre. Die Lamellen geben dem Rad auf festem Boden ein Mehrfaches des Drehmoments am durchdrehenden Rad, für diesen Hang immer noch zu wenig. Die Klauenmuffe der Sperre verbindet die Halbwelle mit dem Ausgleichsgehäuse, die Achse dreht sich als Ganzes, und jedes Rad schiebt so stark, wie seine eigene Haftung erlaubt.",
      params: { label: "Hinterachse, ein Rad im Schlamm" },
      talk: [
        "Ein offenes Differenzial gibt beiden Rädern einer Achse dasselbe Drehmoment. Im Schlamm kann das durchdrehende Rad nur wenig übertragen, also bekommt das Rad auf festem Boden genauso wenig.",
        "Der Unimog wurde für Felder und Schlamm gebaut. Der Fahrer kann die Differenziale beider Achsen sperren: Eine Klauenmuffe auf einer Halbwelle schiebt sich auf Klauen am Ausgleichsgehäuse, sodass sich die Achswellenräder nicht mehr gegeneinander drehen können.",
        "Viele Straßen- und Rennwagen nutzen stattdessen ein Sperrdifferenzial mit Lamellen. Die Reibscheiben darin geben dem Rad mit Haftung von selbst mehr Drehmoment, aber nur ein Mehrfaches des Anteils am durchdrehenden Rad; hier reicht das für den Hang nicht.",
        "Eine gesperrte Achse lässt ihre Räder nicht unterschiedlich schnell drehen, also kämpfen die Reifen in einer Kurve auf festem Boden gegeneinander. Sperren sind für langsame Fahrt in schwerem Gelände; auf der Straße bleiben sie offen.",
      ],
    },
  ],
  note: "Achs- und Gehäusemaße sind runde Werte, gewählt, um das Prinzip zu zeigen. Das Sperrdifferenzial mit Lamellen dient dem Vergleich: Der Unimog nutzt Sperren.",
  unverified: [
    "Maße von Achsrohr und Gehäuse, Portalversatz, Übersetzung der Nabenzahnräder und die daraus folgende Bodenfreiheit",
    "Umriss der Karosserie (aus den Maßen des Datenblatts skizziert, noch nicht vom Foto abgezeichnet)",
    "Achslasten, Haftung im Schlamm, die Zugkraft am Hang und das Momentenverhältnis des Sperrdifferenzials",
    "Raum: Collection 3",
  ],
};
