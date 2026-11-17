// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Az 540 K karosszériája alatt",
  name: "Mercedes-Benz 540 K (W 29)",
  summary: "Független, kettős keresztlengőkaros első felfüggesztés, a csak padlógáznál bekapcsoló Roots-kompresszor és az áramvonalas karosszéria.",
  eyebrow: "Mercedes-Benz 540 K (W 29), 1936–1940",
  lede: "Három dolog a kompresszoros 540 K-ról, mindegyik működés közben: a független első felfüggesztés egy bukkanón és egy kátyún, a Roots-kompresszor, amely csak akkor kapcsolódik be, ha a vezető padlóig nyomja a gázt, és hogy mit ad az áramvonalas karosszéria a végsebességhez. Váltson a múzeumi fotóra, és az első kettőt a valódi autón, a helyén is láthatja.",
  photo: { alt: "Fekete-fehér, 1937-es Mercedes-Benz 540 K Cabriolet B a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Első felfüggesztés",
      params: {
        label: "Bal első kerék · 25 km/h, 5× lassítva",
        links: [{ name: "Alsó lengőkar, első szár" }, { name: "Alsó lengőkar, hátsó szár" }, { name: "Felső lengőkar, első szár" }, { name: "Felső lengőkar, hátsó szár" }, { name: "Nyomtávrúd" }],
        legendTitle: "Alkatrészek",
        legend: [[null, "Alsó lengőkar (két szár)"], [null, "Felső lengőkar (két szár)"], [null, "Nyomtávrúd"], [null, "Csavarrugó"], [null, "Alváz és kerékcsonk"]],
      },
      talk: [
        "Az 1930-as évek autóinak többségén elöl még laprugós merev tengely volt. A Mercedes az 1933-as 380-asnak párhuzamos keresztlengőkarokat és csavarrugókat adott, és az 500 K meg az 540 K is megtartotta őket.",
        "Itt mindkét első kerék önállóan mozog: az egyik kerék alatti bukkanó már nem billenti meg a másikat. Figyelje, ahogy a narancssárga görbe kiugrik a bukkanón, és leesik a kátyúban.",
        "A közel párhuzamos karokkal a kerék szinte függőleges marad, de emelkedés közben az abroncs néhány millimétert oldalra csúszik. Nézze a nyomtávváltozás kijelzést.",
      ],
    },
    {
      label: "Kompresszor",
      params: { engineLabel: "5,4 literes soros nyolchengeres" },
      talk: [
        "A K a Kompressor rövidítése. Az 5,4 literes soros nyolchengeres magában 115 LE-t, működő kompresszorral 180 LE-t ad.",
        "A kompresszor nem mindig jár. Nyomja a pedált padlóig és még tovább, és a főtengely orrán ülő többtárcsás tengelykapcsoló bekapcsolja; ugyanabban a pillanatban a motor normál levegőbeömlője bezárul. Rövid nekiiramodásokra szánták.",
        "A Mercedes a levegőt a porlasztón át fújta be, ahelyett hogy a keveréket szívta volna át a kompresszoron. A Roots-kompresszor nem sűríti magában a levegőt: a lebenyek levegőzsebeket visznek körbe a ház fala mentén, és a kiömlőbe tolják őket.",
      ],
    },
    {
      label: "Légellenállás",
      params: { label: "Teljes teljesítmény az autópályán", shapes: [{ label: "Áramvonalas (1938)" }, { label: "Cabriolet B karosszéria" }] },
      talk: [
        "1938-ban a Mercedes egyetlen 540 K-t épített zárt, áramvonalas karosszériával, hogy a Dunlop tartós nagy sebességen tesztelhesse abroncsait az új autópályákon.",
        "A Mercedes-Benz Classic 2014 májusában szélcsatornában mérte meg a felújított autót: 0,36-os légellenállási tényező, korához képest figyelemre méltó.",
        "Ugyanazzal a 180 LE-vel kb. 185 km/h-t ér el, szemben a nyitott Cabriolet kb. 170 km/h-jával. A légellenállás a sebesség négyzetével nő, így ez a 15 km/h sok teljesítménybe kerül: húzza a csúszkát, és nézze meg.",
      ],
    },
  ],
  note: "A geometria szemléltető: a felfüggesztés csuklópontjai, a kompresszor elrendezése, áttétele, a töltőnyomás és a rugómerevségek valószerű értékek, nem gyári adatok.",
  unverified: [
    "A felfüggesztés csuklópontjai és merevségei",
    "A kompresszor elrendezése, 2,6-es áttétele, 0,5 bar töltőnyomása, a porlasztó helyzete",
    "A jármű körvonala",
    "Hogy a Cabriolet B vagy az 1938-as áramvonalas autó látható-e",
    "A Cabriolet B 0,48-as légellenállási tényezője; mindkét karosszéria homlokfelülete, tömege, gördülési ellenállása és hajtáslánc-hatásfoka",
  ],
};
