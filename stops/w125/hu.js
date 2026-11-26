// Hungarian text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Jéggel hűtve",
  name: "Mercedes-Benz W 125 rekordautó",
  summary: "Az áramvonalas autó, amely közúton 432,7 km/h-t ért el; motorját egy tartálynyi jég hűtötte, hogy az orra zárva maradhasson.",
  question: "Miért visz jeget egy rekordautó?",
  eyebrow: "Mercedes-Benz W 125 tizenkéthengeres rekordautó, 1938",
  lede: "A hűtőn levegőnek kell átáramlania, és ez a levegő légellenállásba kerül. Néhány kilométeres útra a W 125 rekordautó megvolt nélküle: hűtővize egy jégtartályon folyt át, az orra pedig szinte zárva maradt. Válassza meg a futam hosszát, és nézze, ahogy a jég elolvad, aztán a víz melegedni kezd.",
  look: "Nézze meg az orrát: két kis nyílás ott, ahol egy versenyautónak nagy hűtőrácsa lenne, a kerekek pedig sima burkolatok alá rejtve.",
  takeaway: "Az olvadó jég úgy nyeli el a hőt, hogy közben nem melegszik: ez elég egy rövid rekordfutamra, a zárt orr pedig sokkal kisebb légellenállást jelentett.",
  photo: { alt: "Ezüst, áramvonalas Mercedes-Benz W 125 rekordautó burkolt kerekekkel és kis pilótafülke-búrával, felülről nézve a múzeum döntött kanyarján" },
  components: [
    {
      label: "Jéghűtés",
      prompt: "Tegye a futamot hosszabbá, mint amennyi egy rekordhoz kell. Mikor fogy el a jég, és mi történik utána?",
      answer: "Ebben a modellben ezen a sebességen kb. 4 km után. Utána a víz hűtés nélkül melegszik, és kb. 12 km után felforr. Egy rekordkísérlethez néhány kilométer kellett a felgyorsuláshoz, a mért kilométerhez és a fékezéshez: a jég elég volt, a zárt orr pedig megspórolta a hűtőn átáramló levegő légellenállását.",
      params: { label: "Teljes teljesítmény 432 km/h-nál, jéggel hűtve" },
      talk: [
        "1938. január 28-án Rudolf Caracciola ezzel az autóval repülőrajtos kilométert hajtott a Frankfurt és Darmstadt közötti autópályán, mindkét irányban, 432,7 km/h átlagsebességgel. Közúton 2017-ig senki sem ment gyorsabban.",
        "Feltöltött V12-es motorja több mint 700 LE-t adott. A hő nagy része, amelyet nem tudott munkává alakítani, a hűtővízbe került: teljes teljesítménynél több száz kilowatt.",
        "Hűtő helyett a víz egy jégtartályon folyt át. Olvadás közben a jég 0 °C-on marad, és minden elolvadó kilogramm sok hőt nyel el. Az ötlet a berlin-adlershofi DVL légiközlekedési kutatóintézettől származott.",
        "Mivel a hűtőhöz nem kellett levegő, az orr szinte zárva maradhatott: sokkal kisebb légellenállás, cserébe néhány kilométeres hatótáv, amíg a jég el nem fogyott.",
      ],
    },
  ],
  note: "A rekord, dátuma és helye dokumentált. Hogy mennyi hő jutott a vízbe, és mennyi jeget és vizet tartott a tartály, kerek számok, az elv bemutatására választva.",
  unverified: [
    "A hűtővízbe jutó hő teljes teljesítménynél (300 kW)",
    "Jég és víz a tartályban (30 kg és 20 kg)",
    "A motor és a tartály helye, a tengelytáv és a körvonal (a fotóról vázolva)",
    "Kameraillesztés: a kerekek burkolat alatt vannak (a kerékagyakat a burkolatok közepére vettük)",
  ],
};
