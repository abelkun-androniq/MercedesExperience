// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Miért nyílnak felfelé az ajtók",
  name: "Mercedes-Benz 300 SL Gullwing",
  summary: "Vékony, hegesztett csövekből álló váz, amely magasan fut végig az ajtók tájékán, ezért az ajtókat a tetőre kellett zsanérozni; és az első sorozatgyártású autó közvetlen befecskendezéses négyütemű benzinmotorral.",
  eyebrow: "Mercedes-Benz 300 SL Coupé (W 198), 1954–1957",
  question: "Miért felfelé nyílnak az ajtói?",
  look: "Nézze meg a magas küszöböt a nyitott ajtó alatt. Képzelje el, hogy át kell rajta másznia.",
  takeaway: "Nézze meg újra a fémet, amelyen át kellene lépnie: az a küszöb maga a váz, amely a dolgát végzi.",
  lede: "Csavarja meg a 300 SL csővázát, mintha az egyik első kerék felhajtana egy szegélykőre, aztán vágja le az oldalait szokásos ajtókhoz, és csavarja meg újra. Utána forgassa át az oldalára döntött soros hathengerest, amelynek üzemanyagát közvetlenül a hengerekbe fecskendezik.",
  photo: { alt: "Ezüst, 1955-ös Mercedes-Benz 300 SL „Sirályszárnyú” nyitott ajtókkal a Mercedes-Benz Múzeumban, jobbról elölről nézve" },
  components: [
    {
      label: "Csőváz",
      prompt: "Mi történne, ha ezek a csövek olyan alacsonyan futnának, hogy szokásos ajtó is beférjen? Váltson vázat, és hasonlítsa össze.",
      answer: "Levágott oldalakkal ez a modell merevségének csak kb. harmadát tartja meg. A magas csövek adják a valódi autó magas küszöbét, ezért az ajtók a tetőn csuklósak.",
      more: "A váz terhelése és merevsége",
      params: { label: "A váz megcsavarása", modes: { high: "Eredeti, magas küszöb", low: "Alacsony küszöb hagyományos ajtóhoz" } },
      real: {
        alt: "Egy 300 SL csupasz, fekete csőváza a Mercedes-Benz Múzeumban kiállítva",
        caption: "Egy 300 SL csupasz csőváza, ebben a múzeumban fényképezve 2013-ban. Figyelje meg, milyen magasan futnak az oldalsó csövek ott, ahol egy ajtó lenne.",
      },
      talk: [
        "Rudolf Uhlenhaut mérnökei az 1952-es 300 SL versenyautót vékony, hegesztett acélcsövekből álló váz köré építették; a csövek háromszögekbe rendezve csak húzást vagy nyomást kapnak, hajlítást soha. Az 1954-es közúti autó megtartotta.",
        "A piros csövek húzottak, a kékek nyomottak. Az oldalak csak azért maradnak merevek, mert háromszögeik magasra érnek, egészen át azon a részen, ahol az ajtó lenne.",
        "Ezért az ajtók a tetőn csuklósak, és felfelé nyílnak: ez a Sirályszárnyú (Gullwing). A beszálláshoz így is át kell mászni egy magas, széles küszöbön.",
        "Vágja le az oldalakat alacsony küszöbig, és ugyanaz a váz ugyanakkora terhelés alatt kb. háromszor annyira csavarodik el (ebben az egyszerű modellben).",
      ],
    },
    {
      label: "Motor",
      prompt: "Most kövesse a motorháztetőt az orr felé. Hogyan fért be egy magas hathengeres ez alá az alacsony vonal alá?",
      answer: "45°-kal balra dőlve fekszik, így a motorháztető alacsonyan ülhetett. Az üzemanyagot közvetlenül minden hengerbe fecskendezik: figyelje a porlasztott sugarat.",
      more: "Befecskendezés és vezérlés",
      params: { label: "Soros hathengeres, közvetlen befecskendezés · gyújtási sorrend 1-5-3-6-2-4" },
      talk: [
        "Az M 198 a 300-as limuzin háromliteres hathengerese, átdolgozva: 2996 cm³, 215 LE (DIN) 5800/min fordulaton, az amerikai SAE szerint 240 LE.",
        "Egy Bosch szivattyú a szívóütem alatt közvetlenül minden hengerbe benzint fecskendez: ez az első négyütemű sorozatautó közvetlen benzinbefecskendezéssel. Figyelje a porlasztott sugarat.",
        "A motor 45°-kal balra dől, hogy a motorháztető alacsonyan ülhessen. A szárazkarteres kenés, külön olajtartállyal, laposan tartja a forgattyúházat.",
      ],
    },
    {
      label: "A motor kiegyensúlyozása",
      prompt: "Hogyan egyenlítik ki egymás tehetetlenségi erőit a soros hathengeres dugattyúi? Nyomja meg a „Lépés 30°-kal” gombot, és kövesse a nyilakat: az 1. és a 6. dugattyú együtt mozog.",
      answer: "A hengerek tükörpárokban dolgoznak, 1 és 6, 2 és 5, 3 és 4, egymáshoz képest harmad fordulattal eltolva: lökéseik kioltják egymást, fordulatonként egyszer és kétszer is, és ugyanígy a blokk közepe körüli billentés is. Egy soros négyhengeresnél a fordulatonként kétszeres lökések ehelyett összeadódnak.",
      more: "Motorvezérlés",
      params: { label: "Soros hathengeres · rázóerők" },
      real: {
        alt: "Csupasz hathengeres motorblokk egy raklapon, előtte a főtengelye",
        caption: "Egy ismeretlen hathengeres motor blokkja és főtengelye. Kövesse az első és az utolsó forgattyút: egy irányba mutatnak, így az 1. és a 6. dugattyú együtt emelkedik.",
      },
      talk: [
        "A dugattyúk fordulatonként kétszer gyorsulnak és lassulnak, és közben tolják-húzzák a blokkot: fordulatonként egyszer saját fel-le mozgásuk miatt, kétszer a hajtórúd kilengése miatt, amitől a dugattyú a felső holtpont közelében gyorsabban mozog, mint az alsónál.",
        "A soros hathengeresben az erők és a blokk közepe körüli billentés kioltják egymást. A 190 E négyhengerese kioltja a fordulatonként egyszeres lökéseket, de a kétszeresek mind egy irányba mutatnak: a négyhengeres magas fordulaton zúg, a hathengeres simán jár.",
        "A kiegyensúlyozott nem jelent egyenletest: a főtengely harmad fordulatonként így is kap egy munkaütemet, hosszának különböző pontjain, és a hajtáslánc viszi tovább ezeket a nyomatéklökéseket.",
      ],
    },
  ],
  note: "1954 és 1957 között 1400 kupé készült. A közúti változat ötlete Max Hoffman amerikai importőrtől származott.",
  unverified: [
    "A váz csomópontjainak helyzete és a csövek keresztmetszete; a háromszoros merevségvesztés e modell eredménye, nem mérés",
    "Hajtórúdhossz és a motor helyzete",
    "Rázóerők: egyforma dugattyútömegek és egyenletesen elosztott, szimmetrikus főtengely",
    "A jármű körvonala",
  ],
};
