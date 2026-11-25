// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Az Állóóra-motor",
  name: "Daimler „Állóóra” motor",
  summary: "A gyorsjáratú egyhengeres, amely lehetővé tette a motoros járművet: izzócsöves gyújtás és a forgattyúházba zárt lendkerekek.",
  eyebrow: "Daimler és Maybach egyhengeres motorja, 1884–1885",
  lede: "Gottlieb Daimler és Wilhelm Maybach kicsi, gyorsjáratú motorja lassítva forog: a lefelé mozgó dugattyú kiszívja nyitásra a szívószelepet, a lendkerék egy hornya nyomja a kipufogószelepet, egy izzó cső pedig a sűrítési ütem vége felé meggyújtja a keveréket.",
  photo: { alt: "Daimler és Maybach 1885-ös Állóóra-motorja a Mercedes-Benz Múzeumban, a főtengely irányából nézve" },
  components: [
    {
      label: "Motor",
      prompt: "Figyelje meg, hogyan nyílik ki a szívószelep, amikor a dugattyú lefelé indul.",
      params: { label: "Négyütemű körfolyamat · egy henger" },
      talk: [
        "Daimler és Maybach 1884–85-ben építette ezt a motort Cannstattban. Kerek forgattyúházon álló, függőleges hengere miatt kapta a Standuhr, azaz Állóóra becenevet.",
        "Nagyjából 600/min fordulattal járt, amikor a kor gázmotorjainak többsége 120–180-at tudott. Ugyanakkora méretből több fordulat több teljesítményt ad a tömegéhez képest: elég könnyű lett ahhoz, hogy járműbe kerüljön. Egy változata hajtotta az 1885-ös Reitwagent.",
        "Gyújtógyertya nincs. A hengeren kívüli csövet egy égő tartja izzásban; a sűrítési ütem keveréket nyom bele, és az magától meggyullad. Figyelje az izzást a hengerfej bal oldalán.",
        "Csak a kipufogószelep vezérelt: egy rúd nyitja, amelyet a lendkerék ívelt hornya mozgat; a rúd felvillan, amikor megemeli a szelepet. A szívószelepnek egyáltalán nincs bütyke: a lefelé mozgó dugattyú szívja nyitva.",
      ],
    },
  ],
  note: "A geometria szemléltető: csak a furat és a löket származik korabeli adatokból, a szelepek és az izzócső helyzete egyszerűsített.",
  unverified: [
    "Furat 58 mm × löket 100 mm (264 cm³) és 0,5–1 LE kb. 600/min fordulaton: a források eltérnek, és egyes adatok a Reitwagen változatára vonatkozhatnak",
    "Hajtórúdhossz, szelepméretek és vezérlési idők",
    "A forgattyúház mérete és körvonala, a fotóról méretezve, 220 mm-es házsugarat feltételezve",
    "Terem és szint",
  ],
};
