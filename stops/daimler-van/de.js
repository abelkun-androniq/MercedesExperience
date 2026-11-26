// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Den Motor kühl halten",
  name: "Daimler Geschäftswagen",
  summary: "Der Vorläufer der heutigen Transporter, mit Wilhelm Maybachs Röhrchenkühler vorn unter dem Motor.",
  question: "Was fließt durch die Röhrchen des Kühlers, Wasser oder Luft?",
  look: "Suchen Sie den runden Kühler unter dem Motor: Die Andrehkurbel führt durch seine Mitte. Jedes kleine Loch in seiner Front ist das Ende eines Röhrchens.",
  takeaway: "Sehen Sie sich die runde Front noch einmal an: Jedes Loch ist ein Luftkanal durch das Wasser, und das dünne Metall darum trägt die Wärme hinüber.",
  eyebrow: "Daimler Motor-Geschäftswagen, 1899",
  lede: "Ein Lieferwagen mit 5,6 PS für 500 kg. Unter seinem Zweizylinder sitzt Maybachs Röhrchenkühler: Die Luft strömt durch seine Röhrchen, das Wasser fließt um sie herum. Vergleichen Sie ihn mit einem einfachen Wasserkasten, vom selben Start aus.",
  photo: {
    alt: "Grüner Daimler Motor-Geschäftswagen von 1899 im Mercedes-Benz Museum, von vorn rechts gesehen",
  },
  components: [
    {
      label: "Kühlung",
      prompt: "Beide starten mit 90 °C warmem Wasser, bei 16 km/h und 60 % Last. In welchem System kühlt das Wasser während der Fahrt ab? Wechseln Sie zwischen beiden und beobachten Sie die Kurve.",
      answer: "Nur mit dem Röhrchenkühler. Die Luft strömt durch seine Röhrchen und entzieht dem Wasser anfangs 4,2 kW, mehr als die 3,6 kW des Motors, also pendelt es sich bei 80 °C ein. Am Kasten streicht die Luft nur an den Außenwänden vorbei: 1,5 kW, und sein Wasser steigt bis zum Sieden.",
      params: {
        label: "Kühlwasser, für beide derselbe Start",
        types: [{ label: "Röhrchenkühler (1897)" }, { label: "Einfacher Wasserkasten" }],
      },
      real: {
        alt: "Wilhelm Maybachs Zeichnung des Röhrchenkühlers von 1897: ein Wasserkasten, durch den von vorn nach hinten viele Röhrchen laufen",
        caption: "Maybachs eigene Zeichnung, 1897. Die Röhrchen laufen gerade durch den Wasserkasten, von vorn nach hinten: Die Luft geht durch sie hindurch, das Wasser füllt den Raum um sie herum. Die runde Front am Lieferwagen ist die Vorderseite dieses Kastens.",
      },
      talk: [
        "Wilhelm Maybachs Röhrchenkühler wurde im Dezember 1897 eingetragen (Gebrauchsmuster Nr. 104718): ein flacher Wasserkasten, von vielen Röhrchen durchbohrt, durch die Luft strömt, rundherum das Wasser.",
        "Die Wärme geht durch die dünne Metallwand jedes Röhrchens, vom Wasser in die Luft. Viele kleine Röhrchen ergeben eine große Wandfläche, so kann die vorbeiströmende Luft viel Wärme mitnehmen.",
        "An diesem Lieferwagen sitzt er vorn unter dem Motor: das runde Gitter, mit der Andrehkurbel durch die Mitte.",
        "Ein einfacher Kasten gibt Wärme nur über seine Außenwände ab; sein Wasser speichert den Rest und wird heißer. Ohne Kühler verliert ein Motor einfach das Wasser, das verkocht: Erhöhen Sie die Last, um zu sehen, wie schnell es geht.",
        "Der Lieferwagen selbst: ein Zweizylinder mit 1527 cm³, 5,6 PS, 500 kg Nutzlast, 16 km/h und Rollenketten zu den Hinterrädern.",
      ],
    },
  ],
  note: "Daimler baute fünf Versionen mit 500 bis 2000 kg Nutzlast und 3 bis 10 PS.",
  unverified: [
    "Wärme ins Wasser (angenommen: 1,5 × Motorleistung)",
    "Kühlleistung von Kühler und Kasten",
    "Der Vergleich mit dem einfachen Wasserkasten",
    "Größe und Lage von Kühler und Motor (aus dem Foto skaliert)",
    "Umriss der Karosserie (vom Foto abgezeichnet)",
  ],
};
