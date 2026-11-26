// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Abgas, das Luft pumpt",
  name: "Sauber-Mercedes C 9",
  summary: "Der Gruppe-C-Wagen, der 1989 Le Mans gewann: ein Fünfliter-V8 mit zwei abgasgetriebenen Turboladern.",
  question: "Wie kann Abgas einen Motor stärker machen?",
  eyebrow: "Sauber-Mercedes C 9, 1989",
  lede: "Ein Turbolader sind zwei Laufräder auf einer Welle. Das Abgas dreht das eine, die Turbine; das andere, der Verdichter, drückt frische Luft in den Motor. Der V8 des C 9 hat an jeder Zylinderbank einen. Folgen Sie dem Abgas in eine Turbine, beobachten Sie den Verdichter auf derselben Welle und drehen Sie den Ladedruck von Rennen auf Qualifying.",
  look: "Suchen Sie die Startnummer 63 an der Flanke und die Kiemen hinter den Türen: Die beiden Turbolader sitzen hinter dem Motor unter der Heckverkleidung.",
  takeaway: "Ein Roots-Gebläse an einem älteren Auto nimmt seine Kraft von der Kurbelwelle; ein Turbolader nimmt sie aus Abgas, das der Motor sonst wegwerfen würde.",
  photo: { alt: "Silberner Sauber-Mercedes C 9 mit der Nummer 63 und AEG-Schriftzug auf der Nase im Mercedes-Benz Museum, von vorn rechts; dahinter steht ein roter Renntruck" },
  components: [
    {
      label: "Zwei Turbolader",
      prompt: "Schalten Sie von der Renneinstellung auf Qualifying. Was muss an den Turboladern geschehen, damit der Motor etwa 150 kW mehr leistet?",
      answer: "Der Ladedruck steigt von 1,6 auf etwa 2,5 bar, also bekommt jeder Zylinder fast ein Drittel mehr Luft. Um sie hineinzupressen, braucht jeder Verdichter fast doppelt so viel Leistung, die seine Turbine dem Abgas entnimmt: Die Welle dreht schneller, die Luft verlässt den Verdichter heißer, und der Ladeluftkühler wird wichtiger.",
      params: { label: "Ein Turbolader je Zylinderbank des V8", presets: [{ label: "Rennen: 1,6 bar" }, { label: "Qualifying: 2,5 bar" }] },
      talk: [
        "Der Motor ist der M 119, der Fünfliter-V8 aus den Straßenautos von Mercedes, ab 1989 mit vier Ventilen je Zylinder. Jede Zylinderbank bläst ihr Abgas in ihren eigenen Turbolader.",
        "Das Abgas verlässt die Zylinder heiß und unter Druck. Während es sich in der Turbine entspannt, gibt es einen Teil dieser Energie an die Welle ab, die weit über hunderttausendmal in der Minute dreht.",
        "Am anderen Ende der Welle verdichtet der Verdichter die Ansaugluft. Verdichtete Luft wird heiß, also kühlt ein Ladeluftkühler sie, bevor sie in den Motor geht: Kühlere Luft ist dichter, mehr davon passt in jeden Zylinder.",
        "Die Gruppe C begrenzte, wie viel Kraftstoff ein Auto im Rennen verbrauchen durfte, also blieb der Ladedruck im Rennen niedrig, für etwa 530 kW. Im Qualifying, für nur wenige Runden, durften die Turbos stärker blasen, für bis zu etwa 680 kW.",
        "Dieses Auto, die Nummer 63, gewann die 24 Stunden von Le Mans 1989 mit Jochen Mass, Manuel Reuter und Stanley Dickens.",
      ],
    },
  ],
  note: "Der Renn-Ladedruck (1,6 bar) und die Leistungen in Rennen und Qualifying sind veröffentlichte Werte. Der Qualifying-Ladedruck hier ist der, den dieses Modell für 680 kW braucht; die Wirkungsgrade des Motors, die Größe der Turbos und der Ladeluftkühler sind veranschaulichend.",
  unverified: [
    "Qualifying-Ladedruck (etwa 2,5 bar in diesem Modell)",
    "Liefergrad und effektiver Wirkungsgrad, Verdichterwirkungsgrad, Wirkung des Ladeluftkühlers und Größe des Turbinenrads",
    "Lage von Motor, Turbos und Ladeluftkühlern; Spurweiten, Radgrößen und Umriss (skizziert)",
    "Lage von Scheinwerfern und Stern, auf denen die Kameraanpassung beruht",
  ],
};
