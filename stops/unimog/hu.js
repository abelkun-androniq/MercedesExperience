// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Tengely a kerekek felett",
  name: "Mercedes-Benz Unimog U 500",
  summary: "Az univerzális eszközhordozó, amelynek portáltengelyei magasan a talaj fölé emelik a differenciálműveket.",
  eyebrow: "Mercedes-Benz Unimog U 500, 2004",
  lede: "A Unimog tengelye nem a kerekek közepén, hanem felettük fut: minden kerékagyban egy fogaskerékpár viszi le a hajtást a kerékig. Ez kiemeli az útból a tengelycsövet és a differenciálművet. Hajtson át egy sziklán, és váltson hagyományos tengelyre az összehasonlításhoz.",
  photo: { alt: "Sötétkék, 2004-es Mercedes-Benz Unimog U 500 hómaróval és hólánccal a Mercedes-Benz Múzeumban, balról elölről nézve" },
  components: [
    {
      label: "Portáltengely",
      params: { label: "Első tengely elölről" },
      real: {
        alt: "Zöld katonai tengely felvágott kerékagyházzal: egy kis fogaskerék egy nagyobb fölött",
        caption: "Felvágott portálagy (egy BTR-70 katonai járművön). A féltengely fent érkezik, és egy fogaskerékpár viszi le a hajtást a kerék közepére: ez a lépcső adja a nagyobb hasmagasságot.",
      },
      talk: [
        "A Unimog a Universal-Motor-Gerät, azaz univerzális motoros eszköz rövidítése: a háború után kis traktornak tervezték, amely úton is gyorsan halad, és a Daimler-Benz 1951 óta gyártja.",
        "Tengelyei portáltengelyek. A féltengelyek a kerékközép felett futnak, és az agyban egy homlokfogaskerék-pár hajtja a kerekeket, így a tengelycső és a differenciálmű a fogaskerekek eltolásával magasabban ül, és több hely marad alatta.",
        "Az agyáttétel lassít is: a tengelyek gyorsabban forognak a kerekeknél és kisebb nyomatékot visznek, így a tengelyek és a differenciálmű könnyebbek lehetnek.",
        "A tekercsrugók és a csavarodni hagyott létraalváz minden kereket követni enged a talajon. Ez az U 500 téli útfenntartásra van felszerelve.",
      ],
    },
    {
      label: "Differenciálzárak",
      prompt: "Sár a bal hátsó kerék alatt, előttünk meredek szántó. Nyitott differenciálművel a bal kerék kipörög, a Unimog áll. Mi segít eleget: lamellák, amelyek korlátozzák a kipörgést, vagy egy zár?",
      answer: "Itt csak a zár. A lamellák a szilárd talajon álló keréknek a kipörgő kerék nyomatékának néhányszorosát adják át, ez sem elég ehhez a lejtőhöz. A zár körmös tengelykapcsolója a féltengelyt a differenciálházhoz kapcsolja, a tengely egy darabként forog, és minden kerék annyira tol, amennyit a saját tapadása enged.",
      params: { label: "Hátsó tengely, egyik kerék sárban" },
      talk: [
        "A nyitott differenciálmű egy tengely mindkét kerekének ugyanakkora nyomatékot ad. Sárban a kipörgő kerék csak keveset tud átvinni, így a szilárd talajon álló kerék is csak ugyanannyit kap.",
        "A Unimogot földekre és sárra építették. Vezetője mindkét tengely differenciálművét zárhatja: az egyik féltengelyen egy körmös gyűrű rácsúszik a differenciálház körmeire, így a féltengely-kerekek nem fordulhatnak el többé egymáshoz képest.",
        "Sok közúti és versenyautó helyette önzáró differenciálművet használ. A benne lévő súrlódó lamellák maguktól adnak több nyomatékot a tapadó keréknek, de csak a kipörgő kerékre jutó rész néhányszorosát; itt ez nem elég a lejtőhöz.",
        "Zárt tengely nem engedi, hogy kerekei eltérő sebességgel forogjanak, ezért szilárd talajon kanyarban a gumik egymással küzdenek. A zár lassú haladásra való nehéz terepen; közúton nyitva marad.",
      ],
    },
  ],
  note: "A tengely- és házméretek kerek számok, az elv bemutatására választva. Az önzáró differenciálmű összehasonlításként szerepel: a Unimog zárakat használ.",
  unverified: [
    "A tengelycső és a ház mérete, a portál eltolása, az agyáttétel és az ebből adódó hasmagasság",
    "A jármű körvonala (az adatlap méreteiből vázolva, még nem a fotóról átrajzolva)",
    "Tengelyterhelések, tapadás sárban, a lejtő ellenállása és az önzáró differenciálmű nyomatékelosztási aránya",
    "Terem: Gyűjtemény 3",
  ],
};
