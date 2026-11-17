// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Miért nyílnak felfelé az ajtók",
  name: "Mercedes-Benz 300 SL",
  summary: "Vékony, hegesztett csövekből álló váz, amely magasan fut végig az ajtók tájékán, ezért az ajtókat a tetőre kellett zsanérozni; és az első sorozatgyártású autó közvetlen befecskendezéses négyütemű benzinmotorral.",
  eyebrow: "Mercedes-Benz 300 SL Coupé (W 198), 1954–1957",
  lede: "Csavarja meg a 300 SL csővázát, mintha az egyik első kerék felhajtana egy szegélykőre, aztán vágja le az oldalait szokásos ajtókhoz, és csavarja meg újra. Utána forgassa át az oldalára döntött soros hathengerest, amelynek üzemanyagát közvetlenül a hengerekbe fecskendezik.",
  photo: { alt: "Ezüst, 1955-ös Mercedes-Benz 300 SL „Sirályszárnyú” nyitott ajtókkal a Mercedes-Benz Múzeumban, jobbról elölről nézve" },
  components: [
    {
      label: "Csőváz",
      params: { label: "A váz megcsavarása", modes: { high: "300 SL váz: magas oldalfalak", low: "Lecsökkentve szokásos ajtókhoz" } },
      talk: [
        "Rudolf Uhlenhaut mérnökei az 1952-es 300 SL versenyautót vékony, hegesztett acélcsövekből álló váz köré építették; a csövek háromszögekbe rendezve csak húzást vagy nyomást kapnak, hajlítást soha. Az 1954-es közúti autó megtartotta.",
        "A piros csövek húzottak, a kékek nyomottak. Az oldalak csak azért maradnak merevek, mert háromszögeik magasra érnek, egészen át azon a részen, ahol az ajtó lenne.",
        "Ezért az ajtók a tetőn csuklósak, és felfelé nyílnak: ez a Sirályszárnyú (Gullwing). A beszálláshoz így is át kell mászni egy magas, széles küszöbön.",
        "Vágja le az oldalakat alacsony küszöbig, és ugyanaz a váz ugyanakkora terhelés alatt kb. háromszor annyira csavarodik el (ebben az egyszerű modellben).",
      ],
    },
    {
      label: "Motor",
      params: { label: "Soros hathengeres, közvetlen befecskendezés · gyújtási sorrend 1-5-3-6-2-4" },
      talk: [
        "Az M 198 a 300-as limuzin háromliteres hathengerese, átdolgozva: 2996 cm³, 215 LE (DIN) 5800/min fordulaton, az amerikai SAE szerint 240 LE.",
        "Egy Bosch szivattyú a szívóütem alatt közvetlenül minden hengerbe benzint fecskendez: ez az első négyütemű sorozatautó közvetlen benzinbefecskendezéssel. Figyelje a porlasztott sugarat.",
        "A motor 45°-kal balra dől, hogy a motorháztető alacsonyan ülhessen. A szárazkarteres kenés, külön olajtartállyal, laposan tartja a forgattyúházat.",
      ],
    },
  ],
  note: "1954 és 1957 között 1400 kupé készült. A közúti változat ötlete Max Hoffman amerikai importőrtől származott.",
  unverified: [
    "A váz csomópontjainak helyzete és a csövek keresztmetszete; a háromszoros merevségvesztés e modell eredménye, nem mérés",
    "Hajtórúdhossz és a motor helyzete",
    "A jármű körvonala",
  ],
};
