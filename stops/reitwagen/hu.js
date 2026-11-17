// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Egy szíj, két szíjtárcsa és egy fogaskoszorú",
  name: "Daimler Reitwagen",
  summary: "Az első benzinmotoros jármű: fél lóerő, egy bőrszíj és két fokozat, amelyeket álló helyzetben, kézzel kell váltani.",
  eyebrow: "Daimler Reitwagen, 1885",
  lede: "Daimler és Maybach új, gyorsjáratú motorját egy fakeretbe szerelték, hogy bebizonyítsák: képes járművet mozgatni. Válasszon fokozatot és emelkedőt: fél lóerő síkon messzire visz, emelkedőn nem sokáig.",
  photo: { alt: "Az 1885-ös, fából készült, bőrnyerges Daimler Reitwagen a Mercedes-Benz Múzeumban, jobbról nézve" },
  components: [
    {
      label: "Szíjhajtás",
      params: { label: "Kétfokozatú szíj, kis fogaskerék és fogaskoszorú", drive: { gears: [{ name: "Alsó" }, { name: "Felső" }] } },
      talk: [
        "Lapos bőrszíj fut a motor szíjtárcsájáról egy hátsó közlőtengelyre. Ezen a tengelyen egy kis fogaskerék forgat egy belső fogazású fogaskoszorút, amely a hátsó kerékhez van rögzítve.",
        "A szíjtárcsák lépcsősek. Ha a szíj a kis motortárcsán és a nagy közlőtengely-tárcsán fut, a kerék lassan forog, de erősen tol: ez az alsó fokozat. Tengelykapcsoló nincs: a szíjat álló helyzetben, kézzel vetik át.",
        "A motort a szabályozó kb. 600/min fordulaton tartja, így minden fokozathoz egyetlen sebesség tartozik: felsőben kb. 12 km/h. Fél lóerő síkon elviszi a lovast, de néhány százalékos emelkedő felső fokozatban megállítja. Próbálja ki az Emelkedő csúszkával.",
        "A lépcsős tárcsák úgy vannak méretezve, hogy ugyanaz a szíj mindkét lépcsőre jó legyen: amennyit az egyik lépcső átmérőben veszít a motoron, annyit nyer a másik a közlőtengelyen.",
      ],
    },
    {
      label: "Motor",
      params: { label: "Egyhengeres a nyereg alatt" },
      talk: [
        "A motor az Állóóra kistestvére: egyetlen függőleges henger, 264 cm³ (58 × 100 mm), 0,5 LE 600/min fordulaton, lendkerekei kerek forgattyúházba zárva.",
        "A gyújtás izzócsöves; a csövet egy égő tartja izzásban, közvetlenül a lovas alatt. Az első utakon állítólag kigyulladt a nyereg.",
        "A szívószelepet a dugattyú szívja nyitva; csak a kipufogószelepet működteti a lendkerékbe vágott horony.",
        "Az üzemanyag a nyereg mögötti felületi porlasztóból jött: a levegő átbuborékolt a benzinen, és keverékként távozott. Külön üzemanyagtartály nem volt.",
      ],
    },
  ],
  note: "Daimler és Maybach 1885. augusztus 29-én szabadalmaztatta a Reitwagent (DRP 36423); az első út, Cannstattból Untertürkheimbe, 1885 novemberében következett. Az eredeti az 1903-as cannstatti gyártűzben elégett: a múzeum másolatot mutat be. A források nem egyeznek abban, ki ült rajta először, Paul vagy Adolf Daimler.",
  unverified: [
    "A szíjtárcsák átmérője, a kis fogaskerék és a fogaskoszorú mérete, valamint az alsó fokozat sebessége (kb. 6 km/h)",
    "Terhelt tömeg (75 kg-os lovassal), gördülési ellenállás és a hajtáslánc hatásfoka",
    "A motor helyzete, a hajtórúd és a forgattyúház mérete",
    "A jármű körvonala (a fotóról átrajzolva)",
    "Terem: Legenda 1 (egy múzeumi másolatot a KTM Motohallnak is kölcsönadtak)",
  ],
};
