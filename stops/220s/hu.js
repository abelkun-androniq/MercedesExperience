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
      real: {
        alt: "Narancssárga, töréspróbán átesett Mercedes C-osztály összegyűrt orral és ép utastérrel",
        caption: "Egy Mercedes C-osztály töréspróba után, évtizedekkel később: az orr összegyűrődött és elnyelte az ütközést, az utascella és az ajtók megtartották alakjukat. Ugyanaz az elv, mint a 220 S-ben.",
      },
      talk: [
        "A magyar származású Barényi Béla 1951-ben szabadalmaztatta az ötletet (DBP 854 157): merev utascella, előtte és mögötte szabályozottan összegyűrődő részekkel.",
        "Az 1959-es W 111 limuzin volt az első így épített autó. 1959. szeptember 10-én a Mercedes Sindelfingenben elvégezte első töréspróbáját: egy W 111-et vezettek egy szilárd akadálynak.",
        "Megállni 50 km/h-ról mindig ugyanannyi energia eltüntetését jelenti. A hosszú, puha gyűrődés ezt kisebb erővel teszi, így a benn ülők kisebb lassulást éreznek. Hasonlítsa össze a két orr csúcs-g értékét.",
        "A merev orr rövidebb úton, sokkal nagyobb erővel áll meg, és magába az utascellába is benyomódik.",
      ],
    },
    {
      label: "A mérőautó",
      prompt: "Hajtson át a bukkanón ép lengéscsillapítókkal, aztán kopottakkal. Mit mutat a mögötte haladó autóban a rögzítő?",
      answer: "Ép lengéscsillapítókkal a görbe egyet-kettőt leng, aztán megnyugszik. Kopottakkal a kerék és a karosszéria minden bukkanó után még több lengésen át ugrál: pontosan ezt láthatták a mérőautóban ülő mérnökök papíron, még a próba közben.",
      params: { label: "Bal első kerék, jel vissza a rögzítőhöz" },
      talk: [
        "A galériában az autó mögött egy egyedi darab áll: egy 1960-as Mercedes-Benz 300 kombi, mérőautóvá alakítva. Országúti próbákon egy kábel kötötte össze az előtte haladó, vizsgált autóval.",
        "A vizsgált autó érzékelői azt mérték, amire a mérnökök kíváncsiak voltak, például hogy mennyit mozog a futómű. A jelek a kábelen futottak vissza a mérőautó rögzítőműszereihez, ahol a mérnökök a próba alatt figyelték őket.",
        "Bukkanón a rugó összenyomódik, a kerék megemelkedik; a lengéscsillapító dönti el, milyen gyorsan cseng le a lengés. A kopott lengéscsillapító azonnal látszik a görbén.",
        "Az ilyen műszerek előtt a tesztpilóták csak azt mondhatták el, milyennek érzik az autót. Az úton végzett mérésekkel a mérnökök számokban hasonlíthattak össze egyik megoldást a másikkal.",
      ],
    },
  ],
  note: "A valódi gyűrődés sokkal egyenetlenebb, mint ennek a modellnek a közel állandó ereje. A hátsó uszonyok adták az autó „Heckflosse” becenevét.",
  unverified: [
    "Tömeg, gyűrődési erők, gyűrődési hosszak és merevségek (valószerű g-értékekhez választva)",
    "A karosszéria méretei és a jármű körvonala",
    "Melyik W 111 változat látható (a fotón egy 1964-es 220 S)",
    "Mérőautó: az érzékelő, a rögzítő és a futómű adatai szemléltetők; a múzeum a kábeles kapcsolatot nevezi meg, a műszereket nem",
  ],
};
