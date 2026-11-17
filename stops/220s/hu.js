// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Gyűrődőzónák és merev utascella",
  name: "Mercedes-Benz 220 S",
  summary: "A „Heckflosse” (uszonyos) limuzin: az első autó, amely Barényi Béla biztonsági karosszériája szerint épült, merev utascellával a gyűrődőzónák között.",
  eyebrow: "Mercedes-Benz 220 S (W 111), 1959",
  lede: "Vezesse az autót lassítva a falnak. Az orra összegyűrődik, és fél méteren nyeli el az energiát, miközben az utascella ép marad. Aztán próbáljon ki egy merev orrot: hamarabb áll meg, ami rosszabb a benn ülőknek.",
  photo: { alt: "Krémszínű, 1964-es Mercedes-Benz 220 S (W 111) a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Töréspróba",
      params: { label: "Frontális ütközés merev falnak", cases: [{ label: "Biztonsági karosszéria: gyűrődőzóna" }, { label: "Merev orr" }] },
      talk: [
        "A magyar származású Barényi Béla 1951-ben szabadalmaztatta az ötletet (DBP 854 157): merev utascella, előtte és mögötte szabályozottan összegyűrődő részekkel.",
        "Az 1959-es W 111 limuzin volt az első így épített autó. 1959. szeptember 10-én a Mercedes Sindelfingenben elvégezte első töréspróbáját: egy W 111-et vezettek egy szilárd akadálynak.",
        "Megállni 50 km/h-ról mindig ugyanannyi energia eltüntetését jelenti. A hosszú, puha gyűrődés ezt kisebb erővel teszi, így a benn ülők kisebb lassulást éreznek. Hasonlítsa össze a két orr csúcs-g értékét.",
        "A merev orr rövidebb úton, sokkal nagyobb erővel áll meg, és magába az utascellába is benyomódik.",
      ],
    },
  ],
  note: "A valódi gyűrődés sokkal egyenetlenebb, mint ennek a modellnek a közel állandó ereje. A hátsó uszonyok adták az autó „Heckflosse” becenevét.",
  unverified: [
    "Tömeg, gyűrődési erők, gyűrődési hosszak és merevségek (valószerű g-értékekhez választva)",
    "A karosszéria méretei és a jármű körvonala",
    "Melyik W 111 változat látható (a fotón egy 1964-es 220 S)",
  ],
};
