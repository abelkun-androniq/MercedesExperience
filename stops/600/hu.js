// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Csendes hidraulika",
  name: "Mercedes-Benz 600 Pullman",
  summary: "Az állami limuzin, amelynek ablakait, üléseit, tolótetejét, csomagtartófedelét és ajtóbehúzóit egyetlen központi hidraulika működtette.",
  eyebrow: "Mercedes-Benz 600 Pullman, 1965",
  lede: "A 600-asban nincsenek elektromos ablakemelő motorok. A motoron ülő szivattyú nagy nyomáson tartja az olajat egy tárolóban, és minden kapcsoló csak egy szelepet nyit. Nyomjon meg egyet, és figyelje, ahogy az olaj megtol egy dugattyút, a szivattyú pedig visszatölti a nyomást.",
  photo: { alt: "Fekete, 1965-ös Mercedes-Benz 600 Pullman páncélozott állami limuzin a Mercedes-Benz Múzeumban, jobbról elölről nézve" },
  components: [
    {
      label: "Komforthidraulika",
      params: {
        label: "Egy szivattyú, egy tároló, sok henger",
        consumers: [{ label: "Hátsó ablak" }, { label: "Első ülés" }, { label: "Tolótető" }, { label: "Csomagtartófedél" }, { label: "Ajtóbehúzó" }],
      },
      talk: [
        "A motorhajtású szivattyú egy gáztöltésű tárolót kb. 150 bar-ra tölt. Innen csövek vezetnek kis hidraulikus hengerekhez az ablakoknál, az üléseknél, a tolótetőnél és a csomagtartófedélnél, valamint az ajtókat behúzó szerkezetekhez.",
        "Minden kapcsoló egy szelepet nyit: a tárolóból érkező olaj megtolja a dugattyút, és az ablak hangtalanul emelkedik, elektromos motor nélkül az ajtóban. A gázpárna miatt a szivattyúnak nem kell járnia, amíg a gombot nyomja.",
        "Ahogy az olaj távozik, a gáz kitágul, és a nyomás csökken. Egy beállított szint alatt a szivattyú újra bekapcsol, és feltölti a tárolót.",
        "150 bar-on egy két centiméteres dugattyú több kilonewtonnal tol: sokkal többel, mint amennyi egy ablaknak kell, ezért egyenletesen, a szelep szabta sebességgel mozog.",
      ],
    },
  ],
  note: "A múzeum autója páncélozott Pullman állami limuzin. A hengerméretek és a csővezetés itt az elv vázlata, nem a 600-as rajzai.",
  unverified: [
    "A tároló mérete és előtöltése, a szivattyú és a szelep szállítása, a bekapcsolási nyomás",
    "A hengerek mérete, lökete és helye az autóban",
    "Hidraulikus ajtóbehúzók (a kutatási jegyzetek említik)",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Terem: Legenda 5",
  ],
};
