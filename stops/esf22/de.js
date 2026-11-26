// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Bremsen, die loslassen",
  name: "Mercedes-Benz ESF 22",
  summary: "Ein experimentelles Sicherheitsfahrzeug mit Airbags, Gurtstraffern und Antiblockiersystem, Jahre bevor diese in Serie kamen.",
  eyebrow: "Mercedes-Benz ESF 22, 1973",
  lede: "Bremst man hart genug, hört ein Rad auf, sich zu drehen: Der Reifen rutscht, haftet schlechter und lenkt nicht mehr. Das Antiblockiersystem dieses Versuchswagens löst die Bremse kurz vorher, dann greift sie wieder, viele Male pro Sekunde. Bremsen Sie aus 100 km/h und vergleichen Sie die beiden Bremswege.",
  photo: {
    alt: "Weißes experimentelles Sicherheitsfahrzeug Mercedes-Benz ESF 22 von 1973 im Mercedes-Benz Museum, von vorn links gesehen",
  },
  components: [
    {
      label: "Antiblockiersystem",
      params: {
        label: "Notbremsung, linkes Vorderrad",
        surfaces: [{ label: "Trockene Straße" }, { label: "Nasse Straße" }],
      },
      real: {
        alt: "Ein zylindrischer Sensor mit Kabel neben einem Zahnkranz hinter einer Bremsscheibe",
        caption: "Ein ABS-Raddrehzahlsensor (hier an einem Motorrad) neben dem Zahnkranz, der sich mit dem Rad dreht. Jeder vorbeilaufende Zahn gibt einen Impuls, so weiß das Steuergerät, wie schnell jedes Rad dreht.",
      },
      talk: [
        "Ein Reifen haftet am besten, wenn er sich etwas langsamer dreht, als die Straße unter ihm vorbeizieht: etwa 10 bis 20 % Schlupf. Ein blockiertes Rad rutscht mit 100 % Schlupf, haftet schlechter und kann die Seitenkraft, die das Auto lenkt, nicht mehr aufnehmen.",
        "Das Antiblockiersystem überwacht die Drehzahl jedes Rads. Wird eines zu schnell langsamer, droht es zu blockieren: Ein Ventil hält den Bremsdruck zurück, bis das Rad wieder schneller dreht, und lässt ihn dann erneut ansteigen.",
        "Der Zyklus wiederholt sich mehrmals pro Sekunde und hält den Reifen nahe seiner besten Haftung. Der Bremsweg wird auf trockener und nasser Straße kürzer, und der Fahrer kann noch um ein Hindernis lenken.",
        "Mercedes-Benz und Bosch arbeiteten in den 1970er-Jahren am Antiblockiersystem. Versuchswagen wie dieser ESF 22 trugen es Jahre, bevor das System 1978 in der S-Klasse auf den Markt kam.",
      ],
    },
  ],
  note: "ESF steht für Experimental-Sicherheits-Fahrzeug: Mercedes-Benz baute Anfang der 1970er-Jahre eine Reihe davon für ein internationales Sicherheitsprogramm.",
  unverified: [
    "Radlast, Trägheit des Rads, Bremsmoment und die Schlupfschwellen der Regelung",
    "Reifenkurven (Burckhardt-Lehrbuchwerte für trockene und nasse Straße)",
    "Umriss der Karosserie (aus den Maßen des Datenblatts skizziert, noch nicht vom Foto abgezeichnet)",
    "Raum: Mythos 5",
  ],
};
