// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Szinkron nélküli váltó és méhsejthűtő",
  name: "Mercedes-Simplex 40 PS",
  summary: "Az „egyszerű” Mercedes: négyfokozatú, tolókerekes váltó láncos hajtással és Maybach méhsejthűtője.",
  eyebrow: "Mercedes-Simplex 40 PS, 1902",
  lede: "Az első Mercedes utódja. Kapcsolja maga a tolókerekes váltót: szinkron nélkül egy fokozat csak akkor megy be, ha a fordulatok egyeznek. Aztán hasonlítsa össze a méhsejthűtőt a régebbi csöves típussal.",
  photo: { alt: "Kék, 1902-es Mercedes Simplex 40 PS a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Sebességváltó",
      params: { label: "Négyfokozatú tolókerekes váltó" },
      talk: [
        "Nincs szinkron: a kar egy fogaskerékpárt tol kapcsolódásba, és azok csak akkor csúsznak be, ha a fogaik már nagyjából azonos sebességgel mozognak.",
        "Felfelé váltáskor a vezetők lenyomták a kuplungot, és megvárták, hogy a váltó lelassuljon. Visszaváltáskor kettős kuplungozással dolgoztak: üres, kuplung fel, gázfröccs, kuplung le, majd be a fokozatba.",
        "A kar a vezető melletti kulisszában mozog. A váltó mögött egy közlőtengely a differenciálművel két láncot hajt a hátsó kerekekhez.",
        "A bemutató mind a négy fokozaton végigvált felfelé. Aztán próbálja ki maga: a recsegés azt jelenti, hogy a fordulatok még túl messze vannak egymástól.",
      ],
    },
    {
      label: "Hűtő",
      params: { label: "Hűtővíz teljes terhelésen", types: [{ label: "Méhsejthűtő (1900)" }, { label: "Csöves, azonos méretű (1897)" }] },
      talk: [
        "Maybach méhsejthűtője, a DRP 122766 számú szabadalom (bejelentve 1900 szeptemberében), 8070 darab, egyenként 6 × 6 mm-es négyzetes csőből áll.",
        "A négyzetes csövek szorosabban illeszkednek, mint a kerekek, így ugyanakkora térben nagyobb a hűtőfelület. Kis sebességnél a hűtő mögötti kis ventilátor segít.",
        "Az 1898-as Phoenixtől az 1900-as első Mercedesig a vízfogyasztás 100 km-en 18 literről 9-re feleződött, miközben a teljesítmény 8 LE-ről 35 LE-re nőtt.",
        "A méhsejtes orr ettől fogva minden Mercedes arca lett.",
      ],
    },
  ],
  note: "6785 cm³-es négyhengeres, kb. 943 kg, 2450 mm tengelytáv: a legrégebbi fennmaradt Mercedes egy ilyen típusú Simplex.",
  unverified: [
    "Fogszámok, véghajtás és a kulissza elrendezése (egy forrás három fokozatot említ)",
    "A motor fordulatszám-tartománya és a bemutató gyorsulása",
    "A vízbe jutó hő és mindkét hűtő teljesítménye",
    "A váltó, a motor és a hűtő helyzete",
    "A jármű körvonala",
  ],
};
