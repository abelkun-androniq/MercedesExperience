// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Két kormányzott tengely",
  name: "Mercedes-Benz LP 333",
  summary: "Előre tolt fülkés teherautó két kormányzott első tengellyel, hogy terhét az új német tengelyterhelési határok szerint ossza el.",
  eyebrow: "Mercedes-Benz LP 333, 1959",
  lede: "Az 1958-as új szabályok korlátozták, mennyit vihet egy teherautó egy-egy tengelye. A Mercedes-Benz válasza: egy második kormányzott tengely elöl. Hogy a gumik ne csússzanak, a második tengelynek kevésbé kell fordulnia, mint az elsőnek. Forgassa a kormányt, és figyelje, ahogy minden kerék tengelyvonala egy pontban találkozik.",
  photo: { alt: "Zöld, 1959-es, két első tengelyes Mercedes-Benz LP 333 platós teherautó a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      prompt: "Állítsa a kormányzás csúszkáját 20°-ra, és tartsa ott. Aztán nyomja meg: „A második tengely merev”. Mielőtt odanéz: melyik gumik csúsznak majd oldalra?",
      answer: "A második tengely kerékpárja, színnel kiemelve. Egyenesre merevítve nem a fordulási középpont körüli köreik mentén állnak, ezért a teherautó oldalra húzza őket, itt kb. 14°-os kúszással. A tolórúddal kormányozva a köreik mentén állnak, és gördülnek.",
      label: "Kettős első tengely",
      params: { label: "Kormányzás felülről" },
      talk: [
        "Az 1950-es évek végének német szabályai csökkentették a teherautók tengelyenként megengedett terhelését. A rakomány megtartásához az LP 333 két kormányzott tengelyt kapott a fülkéje alá: összesen három tengely, ezért a „Tausendfüßler”, azaz ezerlábú becenév.",
        "Hogy a gumik csúszás nélkül gördüljenek, minden kerék tengelyvonalának ugyanabba a fordulási középpontba kell mutatnia, a hátsó tengely vonalán. A második tengely közelebb van ehhez a vonalhoz, ezért kerekeinek kevésbé kell fordulniuk.",
        "A két tengely kormánykarja közötti összekötő rúd úgy van méretezve, hogy a második tengelyt épp a megfelelő kisebb szöggel fordítsa. Mindkét tengely kettős csuklós trapéz is, így a belső kerék jobban fordul, mint a külső.",
        "Ha a második tengelyt egyenesen rögzítjük, gumijait minden kanyarban oldalt húzza, ami koptatja őket és nehezíti a kormányzást.",
      ],
    },
  ],
  note: "Felülről, idealizált trapézokkal ábrázolva; az összekötő rúd a bal oldali kormánykarok között látható.",
  unverified: [
    "Tengelytávok, nyomtávok, kerékméret és a kormánykarok geometriája",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Terem: Gyűjtemény 2",
  ],
};
