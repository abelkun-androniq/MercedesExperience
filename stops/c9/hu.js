// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Kipufogógáz, amely levegőt pumpál",
  name: "Sauber-Mercedes C 9",
  summary: "Az 1989-ben Le Mans-t megnyerő C csoportos versenyautó: ötliteres V8, két kipufogógáz-hajtású turbófeltöltővel.",
  question: "Hogyan tehet erősebbé egy motort a kipufogógáz?",
  eyebrow: "Sauber-Mercedes C 9, 1989",
  lede: "A turbófeltöltő két lapátkerék egy tengelyen. Az egyiket, a turbinát, a kipufogógáz forgatja; a másik, a kompresszor, friss levegőt sűrít a motorba. A C 9 V8-asának mindkét hengersorán van egy. Kövesse a kipufogógázt a turbinába, figyelje a kompresszort ugyanazon a tengelyen, és emelje a töltőnyomást a versenybeállításról az időmérősre.",
  look: "Keresse a 63-as rajtszámot az oldalán és a kopoltyúkat az ajtók mögött: a két turbó a motor mögött, a hátsó karosszéria alatt ül.",
  takeaway: "Egy régebbi autó Roots-kompresszora a főtengelytől veszi az erejét; a turbófeltöltő a kipufogógázból, amelyet a motor különben kidobna.",
  photo: { alt: "Ezüst Sauber-Mercedes C 9 63-as rajtszámmal és AEG felirattal az orrán a Mercedes-Benz Múzeumban, jobbról elölről nézve; mögötte egy piros versenykamion áll" },
  components: [
    {
      label: "Ikerturbók",
      prompt: "Váltson a versenybeállításról az időmérősre. Mi kell történjen a turbóknál ahhoz, hogy a motor kb. 150 kW-tal többet adjon?",
      answer: "A töltőnyomás 1,6-ről kb. 2,5 barra nő, így minden henger közel harmadával több levegőt kap. A besűrítéséhez minden kompresszornak majdnem kétszer annyi teljesítmény kell, amit turbinája a kipufogógázból vesz el: a tengely gyorsabban forog, a kompresszorból kilépő levegő forróbb, így a töltőlevegő-hűtő szerepe is nő.",
      params: { label: "Hengersoronként egy turbófeltöltő", presets: [{ label: "Verseny: 1,6 bar" }, { label: "Időmérő: 2,5 bar" }] },
      talk: [
        "A motor az M 119, a Mercedes közúti autóinak ötliteres V8-asa, 1989-től hengerenként négy szeleppel. Mindkét hengersor a saját turbójába fújja a kipufogógázt.",
        "A kipufogógáz forrón és nyomás alatt hagyja el a hengereket. A turbinán át kitágulva energiája egy részét átadja a tengelynek, amely percenként jóval több mint százezerszer fordul.",
        "A tengely másik végén a kompresszor sűríti a szívott levegőt. A sűrített levegő felmelegszik, ezért egy töltőlevegő-hűtő lehűti, mielőtt a motorba jut: a hidegebb levegő sűrűbb, több fér belőle minden hengerbe.",
        "A C csoport szabályai korlátozták, mennyi üzemanyagot használhat egy autó a versenyen, ezért versenyben alacsony maradt a töltőnyomás, kb. 530 kW-hoz. Az időmérőn, csak néhány körre, a turbók erősebben fújhattak, legfeljebb kb. 680 kW-ig.",
        "Ez az autó, a 63-as, Jochen Mass, Manuel Reuter és Stanley Dickens vezetésével nyerte az 1989-es Le Mans-i 24 órás versenyt.",
      ],
    },
  ],
  note: "A versenybeli töltőnyomás (1,6 bar), valamint a versenybeli és időmérős teljesítmény közzétett adat. Az időmérős töltőnyomás az, amennyire ennek a modellnek 680 kW-hoz szüksége van; a motor hatásfokai, a turbók mérete és a töltőlevegő-hűtő szemléltető.",
  unverified: [
    "Időmérős töltőnyomás (ebben a modellben kb. 2,5 bar)",
    "Töltési fok és effektív hatásfok, a kompresszor hatásfoka, a töltőlevegő-hűtő hatékonysága és a turbókerék mérete",
    "A motor, a turbók és a hűtők helye; nyomtáv, kerékméret és körvonal (vázolt)",
    "A kameraillesztéshez feltételezett lámpa- és csillagpozíciók",
  ],
};
