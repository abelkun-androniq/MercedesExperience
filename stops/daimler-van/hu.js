// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "A motor hűtése",
  name: "Daimler motoros üzleti kocsi",
  summary: "A mai kisteherautók elődje, elöl, a motor alatt Wilhelm Maybach csöves hűtőjével.",
  eyebrow: "Daimler motoros üzleti kocsi, 1899",
  lede: "5,6 LE-s szállítókocsi 500 kg teherre. Kéthengeres motorja alatt Maybach csöves hűtője ül. Váltson a hűtő és egy egyszerű víztartály között, változtassa a sebességet, és figyelje a víz hőmérsékletét.",
  photo: { alt: "Zöld, 1899-es Daimler motoros üzleti kocsi a Mercedes-Benz Múzeumban, jobbról elölről nézve" },
  components: [
    {
      label: "Hűtés",
      params: { label: "Hűtővíz teljes terhelésen", types: [{ label: "Csöves hűtő (1897)" }, { label: "Egyszerű víztartály" }] },
      talk: [
        "Wilhelm Maybach csöves hűtőjét 1897 decemberében jegyezték be (104718. számú használati minta): lapos vízszekrény, amelyet sok cső fúr át, és ezeken áramlik át a levegő.",
        "Ezen a kocsin elöl, a motor alatt ül: ez a kerek rács, a közepén átvezetett indítókarral.",
        "Hűtő nélkül a motor egyszerűen elveszíti az elforró vizet. Váltson teljes terhelésen az egyszerű tartályra, és nézze meg, milyen gyorsan fogy.",
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
