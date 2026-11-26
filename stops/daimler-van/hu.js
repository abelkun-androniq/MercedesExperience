// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "A motor hűtése",
  name: "Daimler motoros üzleti kocsi",
  summary: "A mai kisteherautók elődje, elöl, a motor alatt Wilhelm Maybach csöves hűtőjével.",
  question: "Mi áramlik a hűtő csöveiben, víz vagy levegő?",
  look: "Keresse meg a motor alatti kerek hűtőt: a közepén megy át az indítókar. Az előlapján minden kis lyuk egy cső vége.",
  takeaway: "Nézze meg újra a kerek előlapot: minden lyuk egy levegőjárat a vízen át, és a körülötte lévő vékony fém vezeti át a hőt.",
  eyebrow: "Daimler motoros üzleti kocsi, 1899",
  lede: "5,6 LE-s szállítókocsi 500 kg teherre. Kéthengeres motorja alatt Maybach csöves hűtője ül: a csöveken a levegő áramlik át, a víz körülöttük folyik. Vesse össze egy egyszerű víztartállyal, azonos kiindulásból.",
  photo: { alt: "Zöld, 1899-es Daimler motoros üzleti kocsi a Mercedes-Benz Múzeumban, jobbról elölről nézve" },
  components: [
    {
      label: "Hűtés",
      prompt: "Mindkettő 90 °C-os vízzel indul, 16 km/h-val és 60 %-os terheléssel. Melyik rendszerben hűl le a víz menet közben? Váltson közöttük, és figyelje a görbét.",
      answer: "Csak a csöves hűtőben. A csövein átáramló levegő kezdetben 4,2 kW-ot vesz el a víztől, többet, mint a motor 3,6 kW-ja, így a víz 80 °C-on állandósul. A tartálynál a levegő csak a külső falai mellett halad el: 1,5 kW, és a víz forrásig melegszik.",
      params: { label: "Hűtővíz, mindkettőnél azonos kiindulás", types: [{ label: "Csöves hűtő (1897)" }, { label: "Egyszerű víztartály" }] },
      real: {
        alt: "Wilhelm Maybach 1897-es rajza a csöves hűtőről: vízszekrény, amelyen elölről hátrafelé sok cső fut át",
        caption: "Maybach saját rajza, 1897. A csövek egyenesen átfutnak a vízszekrényen, elölről hátra: rajtuk a levegő áramlik át, a körülöttük lévő teret a víz tölti ki. A kocsi kerek előlapja ennek a szekrénynek az eleje.",
      },
      talk: [
        "Wilhelm Maybach csöves hűtőjét 1897 decemberében jegyezték be (104718. számú használati minta): lapos vízszekrény, amelyet sok cső fúr át; a csöveken a levegő áramlik át, körülöttük pedig a víz.",
        "A hő minden cső vékony fémfalán jut át a vízből a levegőbe. Sok kis cső nagy falfelületet ad, így az átáramló levegő sok hőt vihet el.",
        "Ezen a kocsin elöl, a motor alatt ül: ez a kerek rács, a közepén átvezetett indítókarral.",
        "Az egyszerű tartály csak a külső falain ad le hőt; a többit a víz tárolja, és egyre melegebb lesz. Hűtő nélkül a motor egyszerűen elveszíti az elforró vizet: növelje a terhelést, és nézze meg, milyen gyorsan fogy.",
        "Maga a kocsi: 1527 cm³-es kéthengeres, 5,6 LE, 500 kg hasznos teher, 16 km/h, és görgős láncok a hátsó kerekekhez.",
      ],
    },
  ],
  note: "A Daimler öt változatot épített 500 és 2000 kg közötti hasznos teherrel, 3–10 LE-vel.",
  unverified: [
    "A vízbe jutó hő (a motorteljesítmény 1,5-szeresének véve)",
    "A hűtő és a tartály hűtőteljesítménye",
    "Az egyszerű tartályos összehasonlítás",
    "A hűtő és a motor mérete és helyzete (a fotóról méretezve)",
    "A jármű körvonala (a fotóról átrajzolva)",
  ],
};
