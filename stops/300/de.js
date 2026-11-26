// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Auf Knopfdruck waagrecht",
  name: "Mercedes-Benz 300",
  summary: "Das deutsche Spitzenmodell der Nachkriegszeit, der „Adenauer“. Sank das Heck unter Fahrgästen und Gepäck ab, spannte ein Elektromotor auf Knopfdruck des Fahrers einen zusätzlichen Drehstab vor.",
  eyebrow: "Mercedes-Benz 300, 1952",
  lede: "Beladen Sie ein Auto mit Fahrgästen und Gepäck, sinkt sein Heck. Der 300 hat einen zusätzlichen Drehstab quer über der Hinterachse, und ein Elektromotor kann ihn spannen, bis der Wagen wieder waagrecht steht. Beladen Sie ihn und sehen Sie zu, wie das Heck wieder hochkommt.",
  photo: {
    alt: "Roter Mercedes-Benz 300 „Adenauer“ von 1952 im Mercedes-Benz Museum, von vorn rechts gesehen",
  },
  components: [
    {
      label: "Niveauregulierung hinten",
      params: {
        label: "Das Fahrzeug beladen",
      },
      talk: [
        "Konrad Adenauer, der erste Bundeskanzler, ließ sich in einer Reihe dieser 300 fahren, was dem Wagen seinen Spitznamen gab. Er war der größte und schnellste deutsche Serienwagen seiner Zeit.",
        "Hinten sitzt eine Pendelachse an Schraubenfedern. Voll beladen sinkt das Heck, die Scheinwerfer zeigen nach oben, und die Hinterräder neigen sich nach innen.",
        "Ein zusätzlicher Drehstab läuft quer über der Hinterachse. Auf Knopfdruck am Armaturenbrett verdreht ihn ein Elektromotor weiter, und die zusätzliche Vorspannung hebt das Heck auf seine normale Höhe zurück. Hier wirkt er von selbst, bis der Wagen waagrecht steht.",
        "Der Stab trägt die Zusatzlast, macht die Federung aber nicht steifer, also sinkt die Eigenfrequenz mit wachsender Last trotzdem. Luftfedern vermeiden das: Für die Last aufgepumpt, werden sie auch steifer (siehe den 300 SEL 6.3).",
      ],
    },
  ],
  note: "Die Niveauregulierung hier ist proportional und automatisch; im Fahrzeug schaltete der Fahrer den Motor ein. Massen und Federraten sind runde Werte.",
  unverified: [
    "Radlastanteile, Federraten und die Spannrate des Motors",
    "Bedienung: ein Schalter am Armaturenbrett (hier als automatisch gezeigt)",
    "Umriss der Karosserie (aus den Maßen des Datenblatts skizziert, noch nicht vom Foto abgezeichnet)",
    "Raum: Mythos 4",
  ],
};
