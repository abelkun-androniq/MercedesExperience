// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Mit Eis gekühlt",
  name: "Mercedes-Benz W 125 Rekordwagen",
  summary: "Der Stromlinienwagen, der auf öffentlicher Straße 432,7 km/h erreichte, sein Motor gekühlt von einem Tank voll Eis, damit die Nase geschlossen bleiben konnte.",
  question: "Warum fährt ein Rekordwagen Eis mit?",
  eyebrow: "Mercedes-Benz W 125 Zwölfzylinder-Rekordwagen, 1938",
  lede: "Durch einen Kühler muss Luft strömen, und diese Luft kostet Widerstand. Für eine Fahrt von wenigen Kilometern kam der W 125 Rekordwagen ohne aus: Sein Kühlwasser lief durch einen Eistank, und die Nase blieb fast geschlossen. Wählen Sie die Länge der Fahrt und sehen Sie zu, wie das Eis schmilzt und dann das Wasser warm wird.",
  look: "Schauen Sie auf die Nase: zwei kleine Öffnungen, wo ein Rennwagen einen großen Kühlergrill hätte, und die Räder unter glatten Verkleidungen versteckt.",
  takeaway: "Schmelzendes Eis nimmt Wärme auf, ohne wärmer zu werden, genug für eine kurze Rekordfahrt, und eine geschlossene Nase bedeutete viel weniger Widerstand.",
  photo: { alt: "Silberner Stromlinien-Rekordwagen Mercedes-Benz W 125 mit verkleideten Rädern und kleiner Cockpithaube, von oben auf der Steilkurve des Museums" },
  components: [
    {
      label: "Eiskühlung",
      prompt: "Machen Sie die Fahrt länger, als ein Rekord braucht. Wann ist das Eis aufgebraucht, und was geschieht danach?",
      answer: "Bei diesem Tempo in diesem Modell nach etwa 4 km. Dann erwärmt sich das Wasser, ohne dass etwas es kühlt, und kocht nach etwa 12 km. Ein Rekordversuch brauchte wenige Kilometer zum Beschleunigen, den gemessenen Kilometer und das Bremsen: Das Eis reichte, und die geschlossene Nase sparte den Widerstand der Luft durch einen Kühler.",
      params: { label: "Volle Leistung bei 432 km/h, mit Eis gekühlt" },
      talk: [
        "Am 28. Januar 1938 fuhr Rudolf Caracciola mit diesem Wagen einen fliegenden Kilometer auf der Autobahn zwischen Frankfurt und Darmstadt, in beiden Richtungen, im Schnitt 432,7 km/h. Schneller fuhr auf öffentlicher Straße bis 2017 niemand.",
        "Sein aufgeladener V12 leistete über 700 PS. Der größte Teil der Wärme, die er nicht in Arbeit verwandeln konnte, ging ins Kühlwasser, bei voller Leistung Hunderte Kilowatt.",
        "Statt durch einen Kühler lief das Wasser durch einen Eistank. Eis bleibt beim Schmelzen bei 0 °C, und jedes Kilogramm, das schmilzt, nimmt viel Wärme auf. Die Idee kam von der Deutschen Versuchsanstalt für Luftfahrt (DVL) in Berlin-Adlershof.",
        "Da kein Kühler Luft brauchte, konnte die Nase fast geschlossen bleiben: viel weniger Widerstand, um den Preis einer Reichweite von nur wenigen Kilometern, bis das Eis weg war.",
      ],
    },
  ],
  note: "Der Rekord, sein Datum und Ort sind belegt. Wie viel Wärme ins Wasser ging und wie viel Eis und Wasser der Tank fasste, sind runde Werte, gewählt, um das Prinzip zu zeigen.",
  unverified: [
    "Wärme ins Kühlwasser bei voller Leistung (300 kW)",
    "Eis und Wasser im Tank (30 kg und 20 kg)",
    "Lage von Motor und Tank, Radstand und Umriss (vom Foto skizziert)",
    "Kameraanpassung: Die Räder sind verkleidet (Radnaben in der Mitte der Verkleidungen angenommen)",
  ],
};
