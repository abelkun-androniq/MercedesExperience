// German text for car.js, merged over it by loadCar (lib/app/i18n.js): same shape, strings only, null keeps the original.
export default {
  title: "Lenken mit den Motoren",
  name: "Mercedes-Benz SLS AMG Coupé Electric Drive",
  summary: "Vier Elektromotoren, einer je Rad: Sie können die äußeren Räder stärker antreiben als die inneren und so das Auto in die Kurve drehen.",
  question: "Kann ein Auto mit seinen Motoren lenken?",
  eyebrow: "Mercedes-Benz SLS AMG Coupé Electric Drive, 2013",
  lede: "Der Flügeltürer SLS mit vier Elektromotoren statt des V8, einer je Rad, und einer Batterie im Mitteltunnel. Mit einem Motor an jedem Rad kann das Auto in der Kurve die äußeren Räder stärker antreiben als die inneren. Halten Sie eine Kurve und verlagern Sie den Antrieb nach außen, dann folgen Sie der Energie von der Batterie zu den Rädern und beim Bremsen zurück.",
  look: "Suchen Sie den blauen Schriftzug „Electric Drive“ an der Tür und den blau getönten Kühlergrill: die einzigen Zeichen von außen, dass unter der langen Haube kein Benzinmotor sitzt.",
  takeaway: "Ein Motor je Rad erlaubt der Software, was kein Differenzial kann: jedem Rad seinen eigenen Schub geben und beim Bremsen Energie zurückholen.",
  photo: { alt: "Weißer Mercedes-Benz SLS AMG Coupé Electric Drive mit blauem Schriftzug an der Tür im Mercedes-Benz Museum, von vorn links" },
  components: [
    {
      label: "Torque Vectoring",
      prompt: "Das Auto fährt eine Kurve mit 50 m Radius bei 50 km/h. Verlagern Sie Antrieb von den inneren auf die äußeren Räder. Was geschieht mit dem Lenkwinkel, den die Vorderräder brauchen?",
      answer: "Er sinkt: in diesem Modell von etwa 3,5° auf unter 2°. Der Mehrschub der äußeren Räder dreht das Auto in die Kurve, also müssen die Vorderreifen weniger lenken. Verlagern Sie den Antrieb andersherum, braucht das Auto mehr Lenkwinkel als vorher.",
      params: { label: "Eine gleichmäßige Linkskurve von oben" },
      talk: [
        "Jedes Rad hat seinen eigenen Motor: vier Synchronmotoren, zusammen 552 kW und 1000 N·m, je zwei treiben eine Achse über ein eigenes Getriebe an. Zwischen den Rädern gibt es kein Differenzial.",
        "In der Kurve kann die Steuerung die äußeren Räder stärker und die inneren schwächer schieben lassen, sie sogar bremsen. Der Unterschied der Vortriebskräfte dreht das Auto in die Kurve, wie stärkeres Paddeln auf einer Seite eines Kanus.",
        "Mercedes nannte das AMG Torque Dynamics. Die Vorderreifen brauchen weniger Lenkwinkel und weniger Seitenhaftung, also bleibt mehr für die Kurve selbst.",
        "Der Unterschied muss innerhalb dessen bleiben, was jeder Reifen übertragen kann: Wer ein Rad zu stark schieben lässt, lässt es durchdrehen. Das Modell hält die Reifen in ihrem sanften, linearen Bereich.",
      ],
    },
    {
      label: "Von der Batterie zu den Rädern und zurück",
      prompt: "Bremsen Sie sanft, dann stark. Wohin geht die Bewegung des Autos jeweils?",
      answer: "Beim sanften Bremsen fließt alles zurück in die Batterie: Die Motoren arbeiten als Generatoren, die Reibungsbremsen bleiben kalt. Beim starken Bremsen kann die Batterie so schnell keine Energie aufnehmen; die Motoren geben ihr so viel, wie sie annimmt, und die Bremsscheiben machen aus dem Rest Wärme.",
      params: { label: "Leistung zwischen Batterie und Rädern" },
      talk: [
        "Die Batterie speichert 60 kWh bei 400 Volt: 12 Module mit je 72 Lithium-Ionen-Zellen, zusammen 548 kg, im Tunnel, in dem sonst die Kardanwelle läuft, und hinter den Sitzen.",
        "Beim Fahren fließt Strom von der Batterie zu den vier Motoren; ein Teil der Energie geht unterwegs als Wärme verloren.",
        "Beim Bremsen werden die Motoren zu Generatoren: Die Räder treiben sie an, und der Strom fließt zurück in die Batterie. Diese Energie würde sonst die Bremsscheiben heizen.",
        "Batterie und Motoren können nur begrenzt Leistung auf einmal aufnehmen. Bei einer Vollbremsung leisten die Reibungsbremsen weiterhin einen großen Teil der Arbeit.",
      ],
    },
  ],
  note: "Leistung, Drehmoment und Batteriedaten stammen von Mercedes. Die Kurve, die Gewichtsverteilung, die Reifensteifigkeiten, die Verluste und die Rekuperationsgrenze sind runde Werte, gewählt, um das Prinzip zu zeigen.",
  unverified: [
    "Gewichtsverteilung, Schräglaufsteifigkeit der Reifen und die Stirnfläche mal cw",
    "Wirkungsgrade von Antrieb und Rekuperation und die Rekuperationsgrenze (150 kW an der Batterie)",
    "Lage von Batterie und Motoren (skizziert)",
    "Umriss der Karosserie (wie beim SLS-Halt, skizziert)",
  ],
};
