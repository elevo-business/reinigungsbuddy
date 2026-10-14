# SEO-Checkliste: alles außerhalb der Website

Die Website ist technisch vorbereitet. Für Top-Platzierungen bei „Gebäudereinigung Berlin" und im Local Pack (Kartenergebnisse) zählt aber mindestens genauso viel, was **außerhalb** passiert. Diese Liste in der Reihenfolge abarbeiten.

**Grundregel NAP:** Name, Adresse und Telefon müssen überall **buchstabengenau identisch** sein, auf der Website (`src/config/site.ts`), im Impressum, im Google-Unternehmensprofil und in allen Verzeichnissen. Also nicht einmal „Reinigungsbuddy" und einmal „Reinigungsbuddy Gebäudereinigung", nicht einmal „Str." und einmal „Straße".

---

## 1. Vor dem Livegang

- [ ] Kontaktdaten, Adresse und Inhaberdaten in `src/config/site.ts` eintragen
- [ ] Impressum, Datenschutz und AGB rechtlich prüfen lassen
- [ ] `SITE_URL` beim Hoster auf die endgültige Domain setzen
- [ ] Formular auf Webhook umstellen (README, Abschnitt 5) oder mailto bewusst beibehalten
- [ ] Beispielbilder ersetzen oder Galerie ausblenden
- [ ] `npm run build`: alle QA-Checks grün

## 2. Google-Unternehmensprofil (wichtigster Hebel für das Local Pack)

- [ ] Profil anlegen bzw. beanspruchen: [business.google.com](https://business.google.com)
- [ ] **Hauptkategorie:** „Gebäudereinigungsdienst"
- [ ] Weitere Kategorien (nur passende): „Reinigungsdienst", „Fensterputzer", „Teppichreinigungsdienst"
- [ ] **Ohne Ladenlokal:** Adresse ausblenden und als Service-Area-Business führen. Dann in `site.ts` `address: null` lassen.
- [ ] **Einzugsgebiet:** alle 12 Bezirke einzeln eintragen (Mitte, Friedrichshain-Kreuzberg, Pankow, Charlottenburg-Wilmersdorf, Spandau, Steglitz-Zehlendorf, Tempelhof-Schöneberg, Neukölln, Treptow-Köpenick, Marzahn-Hellersdorf, Lichtenberg, Reinickendorf)
- [ ] **Leistungen** anlegen, genau wie auf der Website (Büroreinigung, Unterhaltsreinigung, Grundreinigung, Fenster- & Glasreinigung …), jeweils mit kurzer Beschreibung, **ohne Preise**
- [ ] Beschreibung (750 Zeichen): Festpreis innerhalb von 24 h nach Objektbegehung, Reinigungsprotokoll nach jedem Einsatz, 24-h-Nachbesserungsgarantie, inhabergeführt, Deutsch und Englisch
- [ ] Öffnungs- bzw. Servicezeiten identisch zu `site.ts` (`hours`)
- [ ] Website-Link: Startseite. Terminlink: `/angebot/`
- [ ] **Fotos:** Logo, Titelbild, Inhaber bei der Arbeit, Team, Fahrzeug, echte Einsätze (mit Einwilligung). Mindestens 10 zum Start, danach jeden Monat neue
- [ ] **Wöchentliche Beiträge:** z. B. Tipp der Woche, Vorher-Nachher eines Einsatzes, neuer Ratgeber-Artikel
- [ ] Fragen & Antworten mit den 5 häufigsten Fragen selbst befüllen
- [ ] Profil-URL in `site.ts` unter `sameAs` eintragen

## 3. Weitere Plattformen (gleiche NAP-Daten!)

- [ ] **Bing Places:** [bingplaces.com](https://www.bingplaces.com), Import aus Google möglich
- [ ] **Apple Business Connect:** [businessconnect.apple.com](https://businessconnect.apple.com), wichtig für iPhone-Karten
- [ ] Gelbe Seiten
- [ ] Das Örtliche
- [ ] 11880.com
- [ ] Cylex
- [ ] Yelp
- [ ] Optional: GoLocal, Werkenntwen, Branchenbuch Berlin, Handwerkskammer-Betriebssuche (falls eingetragen)

Für jeden Eintrag: gleicher Name, gleiche Adresse bzw. Einzugsgebiet, gleiche Telefonnummer, Website-Link, Kategorie „Gebäudereinigung".

## 4. Google Search Console & Bing Webmaster Tools

- [ ] Property für die Domain anlegen ([search.google.com/search-console](https://search.google.com/search-console)), Verifizierung per DNS
- [ ] Sitemap einreichen: `https://ihre-domain.de/sitemap-index.xml`
- [ ] Startseite und die 10 Leistungsseiten über „URL-Prüfung" zur Indexierung beantragen
- [ ] Nach 4–8 Wochen: Bericht „Leistung" prüfen. Für welche Suchanfragen wird die Seite gezeigt? Tauchen Bezirksnamen auf (z. B. „Büroreinigung Mitte"), kann gezielt eine einzelne Bezirksseite entstehen (siehe PLAN.md, Abschnitt 2.1)
- [ ] Bing Webmaster Tools: Import aus der Search Console

## 5. Bewertungen: der Prozess nach jedem Auftrag

Bewertungen sind für das Local Pack einer der stärksten Faktoren. Nie erfinden, nie kaufen, nie mit Rabatten belohnen (Google-Richtlinien und UWG).

- [ ] Kurzlink zur Google-Bewertung erzeugen (im Unternehmensprofil: „Nach Rezensionen fragen")
- [ ] QR-Code daraus erstellen (Visitenkarte, Übergabeprotokoll, Rechnung)
- [ ] **Ablauf:** Nach dem ersten Monat bzw. nach Einmalaufträgen eine persönliche WhatsApp oder E-Mail mit Link schicken:
  > „Hallo Frau X, danke für die ersten Wochen. Wenn Sie zufrieden sind, würde mir eine kurze Google-Bewertung sehr helfen: [Link]. Und wenn etwas nicht passt, schreiben Sie mir lieber direkt. – Mert"
- [ ] Jede Bewertung beantworten, auch die positiven, innerhalb von 48 Stunden
- [ ] Mit Einwilligung einzelne Zitate als Kundenstimme auf die Website übernehmen (`src/content/stimmen/`)

## 6. Lokale Backlinks und Partnerschaften

- [ ] Berliner Unternehmensnetzwerke: IHK Berlin (Veranstaltungen), Unternehmensnetzwerke der Bezirke (z. B. Wirtschaftskreise, Standortgemeinschaften), BNI-Chapter
- [ ] **Gewerbehof- und Bürohausverwaltungen:** Kontakt zu Verwaltungen von Gewerbehöfen (Kreuzberg, Wedding, Neukölln), Bürohäusern und Praxishäusern. Ziel: Empfehlung als Reinigungspartner, Eintrag in deren Mieterinformationen
- [ ] **Coworking-Betreiber:** Reinigung anbieten, im Gegenzug Partner- oder Dienstleister-Seite
- [ ] Hausverwaltungen (Treppenhausreinigung) mit Referenzobjekten
- [ ] Gastbeiträge: Ratgeber-Inhalte (z. B. „Leistungsverzeichnis") in Office-Manager-Blogs oder Newslettern
- [ ] Lokale Vereine oder Kiez-Initiativen sponsern (Link auf der Sponsorenseite)

## 7. Laufend

- [ ] Monatlich einen neuen Ratgeber-Artikel oder ein Update eines bestehenden
- [ ] Vierteljährlich: Search Console prüfen, Titles und Descriptions der Seiten mit hohen Impressionen und niedriger Klickrate verbessern
- [ ] Eigene Fotos statt Stockfotos, Seite für Seite
- [ ] Vorher-Nachher-Galerie mit echten Projekten füllen
