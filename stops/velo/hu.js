// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Két szíj és egy szabadon futó tárcsa",
  name: "Benz Velo",
  summary: "Az első sorozatban gyártott autó: 1,5 LE, két lapos szíj a két fokozathoz, tengelykapcsolóként pedig egy szabadon futó tárcsa.",
  eyebrow: "Benz Velo, 1894",
  lede: "Karl Benz kicsi, megfizethető autójából 1902-ig mintegy 1200 darab kelt el. Váltson fokozatot úgy, hogy a szíjat a szabadon futó tárcsáról a rögzítettre teszi, aztán derítse ki, milyen meredek emelkedőt bír 1,5 LE két emberrel.",
  photo: { alt: "Fekete, nagy küllős hátsó kerekű, rézlemezes karosszériájú 1894-es Benz Velo a Mercedes-Benz Múzeumban, jobbról hátulról nézve" },
  components: [
    {
      label: "Szíjak és láncok",
      params: { label: "Két szíj, szabadon futó tárcsák, láncok", drive: { gears: [{ name: "Alsó" }, { name: "Felső" }] } },
      talk: [
        "Két lapos szíj fut a motortól az ülés alatti közlőtengelyre, fokozatonként egy. A közlőtengelyen minden rögzített tárcsa mellett egy szabadon futó is forog; a szabadon futó tárcsán járó szíj semmit sem hajt. A szíj átcsúsztatása egyszerre fokozatváltás és tengelykapcsoló.",
        "A közlőtengelyben van a differenciálmű. Mindkét végéről lánc fut hátra egy-egy hátsó kerék lánckerekéhez.",
        "1,5 LE 450/min fordulaton felső fokozatban síkon kb. 20 km/h-t ad. Két emberrel néhány százalékos emelkedő felsőben megállítja; alsó fokozatban kb. 4 %-ot bír. Meredekebb emelkedőkön az utasok kiszálltak és toltak.",
        "Hogy a lejtőn megállt autó ne guruljon vissza, a Velónak visszagurulásgátlója is volt, egy az útra leengedhető támasz, a tömör gumiabroncsokra szoruló fa fékpofák mellett.",
      ],
    },
    {
      label: "Motor",
      params: { label: "Egyhengeres, hátul fekvő" },
      talk: [
        "Egyetlen vízszintes, 1045 cm³-es (110 × 110 mm) henger 450/min fordulaton 1,5 LE-t ad.",
        "A Patent-Motorwagennel ellentétben a lendkerék állva, keresztben forog.",
        "Benz megtartotta az elektromos gyújtást gyújtótekerccsel és gyújtógyertyával; a szívószelepet a dugattyú szívja nyitva, csak a kipufogószelep vezérelt.",
        "A motor hátul, a hátsó ülés alatt ül; az üzemanyagot eleinte felületi porlasztó adta, később úszós porlasztó.",
      ],
    },
  ],
  note: "Benz 1894-ben 67, 1895-ben 134 Velót épített, 1902-ig pedig mintegy 1200 Velót és Comfortable-t, 2000 márkáért. Egy Velo részt vett az 1894-es Párizs–Rouen versenyen. A harmadik fokozat és a hátramenet 1896-tól felár ellenében, 1900-tól alapáron járt.",
  unverified: [
    "A szíjtárcsák és lánckerekek mérete, valamint az alsó fokozat sebessége (kb. 12 km/h)",
    "Terhelt tömeg (két emberrel), gördülési ellenállás és a hajtáslánc hatásfoka",
    "A motor, a lendkerék és a közlőtengely helyzete, hajtórúdhossz",
    "A jármű körvonala (a fotóról átrajzolva)",
    "Terem: Legenda 1",
  ],
};
