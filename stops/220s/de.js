// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Knautschzonen und eine steife Zelle",
  name: "Mercedes-Benz 220 S",
  summary: "Die „Heckflosse“: das erste Auto, gebaut nach Béla Barényis Sicherheitskarosserie, mit steifer Fahrgastzelle zwischen Knautschzonen.",
  eyebrow: "Mercedes-Benz 220 S (W 111), 1959",
  lede: "Fahren Sie das Auto in Zeitlupe gegen eine Wand. Der Vorderwagen faltet sich und nimmt die Energie auf einem halben Meter auf, während die Zelle ganz bleibt. Probieren Sie dann einen steifen Vorderwagen: Er hält früher an, was für die Insassen schlechter ist.",
  photo: {
    alt: "Cremefarbener Mercedes-Benz 220 S (W 111) von 1964 im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Crashtest",
      params: {
        label: "Frontalaufprall gegen eine starre Wand",
        cases: [{ label: "Sicherheitskarosserie: Knautschzone" }, { label: "Steifer Vorderwagen" }],
      },
      real: {
        alt: "Eine orangefarbene Crashtest-Mercedes-C-Klasse mit gestauchtem Vorderwagen und intaktem Innenraum",
        caption: "Eine Mercedes C-Klasse nach einem Crashtest, Jahrzehnte später: Der Vorderwagen hat sich gefaltet und den Stoß aufgenommen, während Fahrgastzelle und Türen ihre Form behielten. Dieselbe Idee wie beim 220 S.",
      },
      talk: [
        "Béla Barényi ließ die Idee 1951 patentieren (DBP 854 157): eine steife Fahrgastzelle mit Vorder- und Hinterwagen, die sich kontrolliert falten.",
        "Die Limousine W 111 von 1959 war das erste so gebaute Auto. Am 10. September 1959 fuhr Mercedes in Sindelfingen seinen ersten Crashtest und ließ einen W 111 gegen ein festes Hindernis prallen.",
        "Anhalten aus 50 km/h heißt immer, dieselbe Energie loszuwerden. Ein langer, weicher Deformationsweg tut es mit geringerer Kraft, also spüren die Insassen weniger Verzögerung. Bei welchem Vorderwagen ist die Verzögerung beim Aufprall am größten?",
        "Der steife Vorderwagen hält auf kürzerem Weg mit weit höherer Kraft an und drückt in die Zelle selbst hinein.",
      ],
    },
  ],
  note: "Echtes Deformationsverhalten ist viel ungleichmäßiger als die fast konstante Kraft dieses Modells. Die Flossen am Heck gaben dem Wagen seinen Spitznamen „Heckflosse“.",
  unverified: [
    "Masse, Deformationskräfte, Deformationswege und Steifigkeiten (so gewählt, dass plausible g-Werte entstehen)",
    "Karosseriemaße und Umriss der Karosserie",
    "Welche W-111-Variante ausgestellt ist (das Foto zeigt einen 220 S von 1964)",
  ],
};
