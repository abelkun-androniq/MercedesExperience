# Sprachreview der deutschen Museumstour

Der deutsche Text ist vollständig. Alle 46 Stationen haben eine Übersetzung. Die Lokalisierungstests bestätigen die Abdeckung der 612 UI-Einträge und der 1.097 Textfelder an den Stationen sowie die Platzhalter im UI-Katalog. Besonders gut funktionieren kurze Überschriften wie „Der Motor taucht ab“ und Beobachtungsaufträge wie „Suchen Sie die Fuge zwischen Dach und Heckscheibe“. Sie geben Besuchern etwas Konkretes, das sie am Exponat wiederfinden können.

## Zuerst ändern

| Fundstelle | Aktueller Wortlaut | Vorschlag und Grund |
| --- | --- | --- |
| [300 SL, Motor M 198](../stops/300sl/de.js) | „240 PS nach der amerikanischen SAE-Norm“ | „215 PS nach DIN bei 5800 U/min. Nach der amerikanischen SAE-Norm betrug die Leistung 240 hp.“ Die englische Fassung unterscheidet ausdrücklich zwischen PS und hp. Die Zahl 240 gehört zur Einheit hp. |
| [Daimler-Standuhr](../stops/daimler-engine/de.js), [Reitwagen](../stops/reitwagen/de.js) und [Velo](../stops/velo/de.js) | „Der abwärtsgehende Kolben saugt das Einlassventil auf“ | „Wenn sich der Kolben nach unten bewegt, öffnet der Unterdruck im Zylinder das Einlassventil.“ Das englische *sucks the valve open* beschreibt, wie sich das Ventil öffnet. „Aufsaugen“ lässt an ein mitgerissenes Bauteil denken. Bei der Standuhr betrifft das auch die Einleitung. |
| [Evo II, vorderer Radlauf](../stops/190e-evo2/de.js), letzter Absatz unter den Details | „Die Ausstellung des Meshes liegt schon weniger als einen Zentimeter von der Außenseite des Reifens entfernt“ | „Im Modell liegt der verbreiterte Radlauf weniger als einen Zentimeter von der Außenflanke des Reifens entfernt. Ein schmalerer Radlauf würde den Reifen nicht mehr abdecken. Wie viel der Radlauf allein zur Ablenkung der Luft beiträgt, bleibt offen.“ Mit *flare* ist die Verbreiterung am Kotflügel gemeint. „Ausstellung“ liest sich auf einer Museumsseite als Verweis auf die Schau. |
| [Evo II, Antwort zum vorderen Radlauf](../stops/190e-evo2/de.js) | „weit vor der Tür vorbei“ | „An der gestrichelten Linie, 60 cm hinter der Achse, verläuft die Bahn etwa 37 cm weiter außen als am Anfang. Sie führt seitlich an der Tür vorbei.“ Die 37 cm bezeichnen die seitliche Verschiebung der Strömungsbahn. Der Abstand zur Tür wird hier nicht gemessen. |
| [Mercedes-Benz 300, Kurzbeschreibung](../stops/300/de.js) | „dessen Hinterachse ein Elektromotor für volle Beladung nachspannen konnte“ | „Der Mercedes-Benz 300, das deutsche Spitzenmodell der Nachkriegszeit, hieß auch »Adenauer«. Sank das Heck unter der Last von Fahrgästen und Gepäck ab, konnte der Fahrer per Knopfdruck einen zusätzlichen Drehstab vorspannen.“ Das benennt das Teil, an dem der Elektromotor angreift, und wahrt den Unterschied zwischen Bedienung am Fahrzeug und Automatik im Modell. |
| [ABS, Ergebnisanzeigen](../lib/app/i18n/de.js) · `Stop with ABS` und `Stop without` | „Halt mit ABS“ / „Halt ohne“ | **„Bremsweg mit ABS“ / „Bremsweg ohne ABS“**. Die beiden Anzeigen vergleichen Strecken in Metern. Beide Beschriftungen sind so auch einzeln verständlich. |
| [LP 333, Lenkungsvergleich](../lib/app/i18n/de.js) · `Second axle fixed` und `Fixed second axle: its tyres scrub` | „Zweite Achse starr“ / „Starre zweite Achse: ihre Reifen radieren“ | **„Zweite Achse ungelenkt“ / „Die zweite Achse bleibt in Geradeausstellung. Ihre Reifen radieren in der Kurve.“** Der Schalter ändert die Lenkung. „Starr“ legt eine Aussage über die Achsbauart nahe. In der [Erklärung am Fahrzeug](../stops/lp333/de.js) entsprechend „Lassen Sie die Räder der zweiten Achse geradeaus stehen.“ |
| [Aerodynamik, Vergleichswert](../lib/app/i18n/de.js) · `Quoted` | „Werksangabe“ | „Überlieferte Höchstgeschwindigkeit“. „Werksangabe“ schreibt jeden Wert dem Hersteller zu. Beim [Blitzen-Benz](../stops/blitzen-benz/car.js) steht hier z. B. die gerundete Rekordgeschwindigkeit von Daytona. |

## Verständlicher an der Station

| Fundstelle | Aktueller Wortlaut oder Auszug | Vorschlag |
| --- | --- | --- |
| [Evo II, Titel](../stops/190e-evo2/de.js) | „Luftwiderstand für Haftung bezahlen“ | „Warum mehr Haftung auf der Geraden Tempo kostet“. Das macht den Zielkonflikt zwischen Kurvenfahrt und Geradeausfahrt bereits auf der Routenkarte verständlich. |
| [190 E, Kurzbeschreibung und Einleitung](../stops/190e/de.js) | „der Vierzylinder M102 beim Durchdrehen“ | „Wie reagiert die Raumlenker-Hinterachse auf eine Bodenwelle und ein Schlagloch? Am Vierzylinder M102 sehen Sie anschließend, in welcher Reihenfolge die Zylinder zünden.“ „Durchdrehen“ passt zu den Rädern auf Eis an anderen Stationen. Hier läuft der Motor im Viertakt. |
| [L 6500, Titel](../stops/l6500/de.js) | „Zwölfeinhalb Liter Diesel“ | „Ein Diesel mit 12,5 Litern Hubraum“. So ist schon im Titel klar, worauf sich die Literangabe bezieht. In der Kurzbeschreibung „Ein schwerer Lkw für 6,5 Tonnen“ zu „Ein schwerer Lkw für 6,5 Tonnen Nutzlast“ ergänzen. |
| [220 S, Knautschzone](../stops/220s/de.js) | „Vergleichen Sie die Spitzen-g beider Vorderwagen.“ | „Bei welchem Vorderwagen ist die Verzögerung beim Aufprall am größten?“ Die Frage lässt sich direkt anhand der Anzeige beantworten. |
| [770, Doppelzündung](../lib/app/i18n/de.js) und [Motorerklärung](../stops/770/de.js) | „Eine Kerze zündet ein Magnetzünder, die andere eine Batteriezündspule“ | „Die eine Zündkerze erhält ihren Zündstrom vom Magnetzünder, die andere von einer batteriebetriebenen Zündspule. So entzündet sich das Gemisch an zwei Stellen und verbrennt schneller. Fällt eine Zündanlage aus, läuft der Motor mit der anderen weiter.“ Die zwei getrennten Stromquellen erklären den Vorteil der Doppelzündung. |
| [Blaues Wunder, Kurzbeschreibung](../stops/blue-wonder/de.js) | „Ein Einzelstück-Transporter mit 300-SL-Motor, der einen Rennwagen mit 160 km/h tragen konnte.“ | „Diesen Transporter mit dem Motor des 300 SL gab es nur einmal. Selbst mit einem Rennwagen auf der Ladefläche soll er rund 160 km/h erreicht haben.“ Das passt auch zur vorsichtigen Geschwindigkeitsangabe weiter unten auf der Seite. |
| [Vario-Dach, Rückkehr zum SLK](../stops/slk/de.js) | „so viel Gepäckraum gibt der Besitzer bei offenem Dach auf“ | „Schauen Sie noch einmal auf den Kofferraumdeckel. Darunter liegt bei offenem Dach das ganze Stahldach. Wie viel Platz bleibt dann für Gepäck?“ Der Blick bleibt beim Exponat. |

## Orientierung und Bedienelemente

Die folgenden Einträge stehen im [deutschen UI-Katalog](../lib/app/i18n/de.js). Die englischen Schlüssel erleichtern die Übernahme.

| Schlüssel | Aktuell | Vorschlag |
| --- | --- | --- |
| `At each stop, open the car's page…` (Einleitung der Route) | „sehen Sie einem seiner Mechanismen bei der Arbeit zu“ | „Öffnen Sie an jeder Station die Seite zum Fahrzeug. Dort sehen Sie, wie die Technik funktioniert. Scrollen Sie weiter, um zu sehen, wo die Bauteile im Fahrzeug sitzen. Die Route beginnt auf Ebene 8 und folgt dem Rundgang des Museums nach unten.“ |
| `In real life:` | „In echt:“ | „Das Bauteil im Bild:“ passt auch zu historischen Zeichnungen und Fotos von Vergleichsfahrzeugen. |
| `Tap the 3D view to swap back` / `Put the photo back and show the 3D view` | „um zurückzutauschen“ / „Foto zurücklegen und die 3D-Ansicht zeigen“ | Hinweis „Tippen Sie auf die kleine 3D-Ansicht, um sie wieder groß zu sehen.“ Für die Schaltfläche „Wieder zur großen 3D-Ansicht wechseln“. |
| `Braking` / `Brake off` | „Bremst“ / „Bremse los“ | „Bremse betätigt“ / „Bremse gelöst“. Die Schaltfläche zeigt den aktuellen Zustand an. |
| `Into rolling` | „Für das Rollen“ | „Leistung für den Rollwiderstand“. So lässt sich der Wert direkt mit der daneben ausgewiesenen Leistung für den Luftwiderstand vergleichen. |
| `% of static` | „% der statischen“ | „% der statischen Radlast“. Damit ist der Bezugswert auch in der kleinen Einheitenzeile verständlich. |
| `One lump of air and seats` (im Zeitraffer-Hinweis der Klimaanlage) | „Ein Block aus Luft und Sitzen“ | „Eine Sekunde entspricht hier {0} Minuten. Das Modell fasst Luft und Sitze zu einer gemeinsamen Wärmekapazität zusammen. Die Werte veranschaulichen die Wärmebilanz.“ Das beschreibt die Vereinfachung und bewahrt den Zeitfaktor. |
| `Ready offline. All stops are saved on this device.` | „Offline bereit. Alle Stationen sind auf diesem Gerät gespeichert.“ | „Offline verfügbar. Alle Stationen sind auf diesem Gerät gespeichert.“ Im zugehörigen Hilfetext denselben sichtbaren Wortlaut verwenden, etwa „Sobald »Offline verfügbar« erscheint, sind alle Stationen auf diesem Gerät gespeichert.“ |
