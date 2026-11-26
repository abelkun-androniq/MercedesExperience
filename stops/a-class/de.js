// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Der Motor taucht ab",
  name: "Mercedes-Benz A-Klasse",
  summary: "Ein kurzes Auto mit langem Deformationsweg: Sein Sandwichboden lässt den Motor bei einem Frontalaufprall unter die Insassen gleiten.",
  eyebrow: "Mercedes-Benz A 160, 1997",
  lede: "Die A-Klasse ist kaum 3,6 Meter lang, da bleibt wenig Platz für eine Knautschzone. Deshalb ist ihr Boden doppelt, mit Motor und Getriebe teilweise darunter, schräg geneigt. Lassen Sie sie aufprallen und sehen Sie zu, wie der Motor nach unten und unter die Zelle gleitet, statt in sie hinein.",
  photo: {
    alt: "Silberner Mercedes-Benz A 160 von 1998 im Mercedes-Benz Museum, von oben vorn rechts gesehen",
  },
  components: [
    {
      label: "Sandwichboden",
      params: {
        label: "Frontalaufprall gegen eine starre Wand",
        cases: [{ label: "Motor gleitet unter den Boden" }, { label: "Motor in die Zelle gedrückt" }],
      },
      talk: [
        "Ein kurzes Auto hat einen kurzen Vorderwagen, und eine kurze Knautschzone stoppt den Wagen abrupt. Die A-Klasse antwortet mit einem Boden aus zwei Lagen: Die Insassen sitzen hoch, obenauf, Motor und Getriebe sind tief und nach vorn geneigt davor und teilweise darunter eingebaut.",
        "Bei einem harten Frontalaufprall lässt sich der Motorblock nicht zusammendrücken. Bei herkömmlicher Bauweise wird er geradewegs nach hinten gegen die Stirnwand und in den Fußraum geschoben.",
        "Hier trifft er auf eine schräge Führung und gleitet nach unten und unter den Boden, so faltet sich der Vorderwagen über seine ganze Länge weiter, und die Zelle bleibt ganz.",
        "Das hohe Sitzen bringt die Insassen außerdem über die Linie eines Autos, das seitlich auftrifft.",
      ],
    },
  ],
  note: "Als eine Masse mit faltendem Vorderwagen gezeigt: Der Weg des Motors ist gezeichnet, um das Prinzip zu zeigen, nicht aus Crashtests von Mercedes-Benz übernommen.",
  unverified: [
    "Größe und Lage des Motorblocks und die Neigung, an der er hinabgleitet",
    "Aufprallkräfte, Deformationswege und Steifigkeit der Zelle",
    "Umriss der Karosserie (aus den Maßen des Datenblatts skizziert, noch nicht vom Foto abgezeichnet)",
    "Raum: Mythos 6",
  ],
};
