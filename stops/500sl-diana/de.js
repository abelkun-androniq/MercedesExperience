// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Ein Bügel, der aufsteht",
  name: "Mercedes-Benz 500 SL",
  summary: "Prinzessin Dianas Roadster R 129, dessen Überrollbügel in 0,3 Sekunden hochschnellt, wenn ein Sensor spürt, dass der Wagen kippt.",
  eyebrow: "Mercedes-Benz 500 SL, 1991",
  lede: "Ein offenes Auto hat kein Dach, auf dem es landen könnte. Der R 129 versteckt hinter seinen Sitzen einen Überrollbügel: Ein Neigungssensor, der spürt, dass der Wagen sich überschlägt, löst eine Feder aus, und der Bügel schwenkt hoch, bevor der Wagen auf der Seite liegt. Lassen Sie ihn an einem Bordstein kippen und sehen Sie verlangsamt zu.",
  photo: {
    alt: "Bordeauxroter Mercedes-Benz 500 SL von Prinzessin Diana aus dem Jahr 1991 im Mercedes-Benz Museum, von vorn rechts gesehen",
  },
  components: [
    {
      label: "Automatischer Überrollbügel",
      params: {
        label: "Am Bordstein gestolpert: seitlicher Überschlag",
      },
      talk: [
        "Ein Auto kippt um, sobald sein Schwerpunkt über die äußeren Räder hinausrollt: hier bei etwa 57°. Ein Sensor überwacht die Neigung und wie schnell sie sich ändert, und löst lange vorher aus.",
        "Der Überrollbügel liegt hinter den Sitzen eingeklappt. Eine vorgespannte Feder stellt ihn in etwa 0,3 Sekunden auf, sobald ein Magnet ihn freigibt, lange bevor der Wagen auf der Seite liegt. Er lässt sich auch per Schalter aufstellen.",
        "Kopfüber liegt der Wagen dann auf dem verstärkten Windschutzscheibenrahmen und dem Bügel, die über den Köpfen der Insassen Raum freihalten. Ohne den Bügel bleibt kaum welcher.",
        "Der SL R 129 von 1989 war das erste Auto mit automatischem Überrollbügel. Dieser gehörte Prinzessin Diana: Ein deutsches Auto für ein Mitglied der Königsfamilie war ein Bruch mit der Tradition.",
      ],
    },
  ],
  note: "Das Fahrzeug ist als starrer Umriss gezeigt, der nach dem Anstoßen an einem Bordstein über ebenen Boden rollt: eine Veranschaulichung des Prinzips, kein Crashtest.",
  unverified: [
    "Schwerpunkthöhe, Trägheitsradius und der Auslösewinkel des Sensors",
    "Umrisshöhen, Kopfhöhe und Größe des Überrollbügels",
    "Feder und Trägheit des Überrollbügels (auf die angegebenen 0,3 s ausgelegt)",
    "Umriss der Karosserie (aus den Maßen des Datenblatts skizziert, noch nicht vom Foto abgezeichnet)",
    "Raum: Collection 4 (der R 129 wird auch in Mythos 6 geführt)",
  ],
};
