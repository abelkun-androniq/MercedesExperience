// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Kora leggyorsabb teherautója",
  name: "Mercedes-Benz versenyautó-szállító",
  summary: "Egyedi szállítójármű 300 SL motorral, amely 160 km/h-val tudott vinni egy versenyautót.",
  eyebrow: "„Blue Wonder” (Kék Csoda) versenyautó-szállító, 1955",
  lede: "A versenyrészleg azt akarta, hogy autói egyetlen éjszaka alatt a pályára vagy vissza a gyárba jussanak. Ezért épített egy teherautót sportautómotorral és alacsony, lekerekített orral. Hasonlítsa össze egy szögletes teherautóval: ezeken a sebességeken szinte az egész teljesítmény a levegő félretolására megy el.",
  photo: { alt: "Kék, 1955-ös Mercedes-Benz versenyautó-szállító ezüst 300 SLR-rel a platóján a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Légellenállás",
      params: {
        label: "Teljes teljesítmény az autópályán",
        shapes: [{ label: "Szállító, üresen" }, { label: "Versenyautóval" }, { label: "Szögletes teherautó, azonos motorral" }],
      },
      talk: [
        "Alfred Neubauer versenyigazgató kérte, Rudolf Uhlenhaut főmérnök tervezte, meghosszabbított 300 S alvázra. A motor a 300 SL háromliteres, benzinbefecskendezéses hathengerese, itt 192 LE-vel.",
        "A légellenállás a sebesség négyzetével nő, a legyőzéséhez szükséges teljesítmény a köbével. A sebesség megduplázásához kb. nyolcszoros teljesítmény kell, így az utolsó néhány km/h a legdrágább.",
        "Az alacsony, lekerekített orr és a kis homlokfelület teszi gyorssá. Váltson a szögletes teherautóra: ugyanaz a motor és tömeg, de kétszer akkora lapos homlok, és a végsebesség kb. 40 km/h-val csökken.",
        "A nyitott platón szállított versenyautó tömeget és légellenállást ad hozzá. Állítólag a szállító megrakva is elérte a kb. 160 km/h-t.",
        "A szélcsatornában váltson a karosszériák között. A szögletes teherautó lapos homlokfala feltorlasztja a levegőt, és magas, örvénylő nyomvizet hagy a hátfala mögött. A szállító lekerekített fülkéje fölött a levegő simán áramlik, majd a nyitott plató fölött leválik; ezt a teret egy versenyautó részben kitölti.",
      ],
    },
  ],
  note: "Az eredetit 1967-ben szétbontották; a múzeumi teherautó fényképek és rajzok alapján újraépített másolat. A fotón egy 300 SLR versenysportautót visz. A források eltérnek a motorban (egyesek 240 LE-s 300 SL egységet említenek).",
  unverified: [
    "Légellenállási tényezők, homlokfelületek, tömegek és a hajtáslánc hatásfoka",
    "A szögletes teherautó kitalált összehasonlítás, nem valódi jármű",
    "A fotóillesztéshez használt tengelytáv (2900 mm), nyomtáv és lámpahelyzetek",
    "A jármű körvonala (a fotóról átrajzolva)",
    "Középsíkú metszetek: a szállító a körvonalból és a fotó középvonali pontjaiból; a platón álló versenyautó és a szögletes teherautó vázlatos",
    "Szélcsatorna: kétdimenziós metszet a valódinál jóval kisebb Reynolds-számmal (kb. 10⁴ a 10⁷ helyett), a kerekek kívül esnek rajta; az ellenállás megoszlása a metszetre vonatkozik",
    "Terem: Gyűjtemény 2",
  ],
};
