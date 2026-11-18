// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Fék, amely enged",
  name: "Mercedes-Benz ESF 22",
  summary: "Kísérleti biztonsági autó légzsákkal, övfeszítővel és blokkolásgátló fékkel, évekkel a sorozatgyártás előtt.",
  eyebrow: "Mercedes-Benz ESF 22, 1973",
  lede: "Elég erős fékezéskor a kerék megáll: a gumi csúszik, kevésbé tapad, és már nem kormányoz. A tesztautó blokkolásgátlója épp előtte engedi fel a féket, majd újra behúzza, másodpercenként sokszor. Fékezzen 100 km/h-ról, és hasonlítsa össze a két megállást.",
  photo: { alt: "Fehér, 1973-as Mercedes-Benz ESF 22 kísérleti biztonsági jármű a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Blokkolásgátló fék",
      params: { label: "Vészfékezés, bal első kerék", surfaces: [{ label: "Száraz út" }, { label: "Nedves út" }] },
      talk: [
        "A gumi akkor tapad a legjobban, ha kicsit lassabban forog, mint ahogy alatta az út halad: kb. 10–20 % csúszásnál. A blokkoló kerék 100 % csúszással csúszik, kevésbé tapad, és nem tud felvenni oldalerőt, amely kormányozná az autót.",
        "A blokkolásgátló minden kerék fordulatát figyeli. Ha az egyik túl gyorsan lassul, blokkolni készül: egy szelep visszatartja a féknyomást, amíg a kerék újra fel nem gyorsul, aztán ismét felépíti.",
        "A ciklus másodpercenként többször ismétlődik, és a gumit a legjobb tapadás közelében tartja. Száraz és nedves úton is rövidebb a fékút, és a vezető még kikerülheti az akadályt.",
        "A Mercedes-Benz és a Bosch az 1970-es években végig dolgozott a blokkolásgátlón. Az ESF 22-höz hasonló tesztautók évekkel azelőtt hordozták, hogy 1978-ban az S-osztályban kapható lett.",
      ],
    },
  ],
  note: "Az ESF az Experimental-Sicherheits-Fahrzeug, azaz kísérleti biztonsági jármű rövidítése: a Mercedes-Benz az 1970-es évek elején egy nemzetközi biztonsági program keretében egész sorozatot épített belőlük.",
  unverified: [
    "A kerékterhelés, a kerék tehetetlensége, a féknyomaték és a szabályzó csúszási küszöbei",
    "Gumigörbék (tankönyvi Burckhardt-illesztés száraz és nedves útra)",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Terem: Legenda 5",
  ],
};
