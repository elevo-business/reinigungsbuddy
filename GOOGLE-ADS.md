# Google Ads: Einrichtung und Landingpages

Kurzfassung: Anzeigen auf die Landingpages unter `/lp/` schicken, die Conversion „Anfrage" mit zwei Werten in `site.ts` verbinden, deployen, testen. Danach erst Budget hochfahren.

---

## 1. Landingpages

Für jede Anzeigengruppe gibt es eine eigene Seite. Die Headline wiederholt das Suchwort, das Formular ist sofort sichtbar, es gibt keine Navigation, über die Besucher abspringen. Die Seiten stehen auf `noindex` und nicht in der Sitemap, damit sie nicht mit den normalen Leistungsseiten bei Google konkurrieren.

| Anzeigengruppe (Beispiel-Keywords) | Finale URL |
|---|---|
| Gebäudereinigung: *gebäudereinigung berlin, reinigungsfirma berlin, gebäudereinigung firma berlin* | `https://reinigungs-buddy.de/lp/gebaeudereinigung-berlin/` |
| Büroreinigung: *büroreinigung berlin, büro reinigung firma berlin, reinigungsfirma büro berlin* | `/lp/bueroreinigung-berlin/` |
| Unterhaltsreinigung: *unterhaltsreinigung berlin* | `/lp/unterhaltsreinigung-berlin/` |
| Praxisreinigung: *praxisreinigung berlin, arztpraxis reinigung berlin, kanzleireinigung berlin* | `/lp/praxisreinigung-berlin/` |
| Treppenhausreinigung: *treppenhausreinigung berlin, treppenhaus reinigung hausverwaltung* | `/lp/treppenhausreinigung-berlin/` |
| Grundreinigung: *grundreinigung büro berlin* | `/lp/grundreinigung-berlin/` |
| Fensterreinigung: *fensterreinigung büro berlin, glasreinigung berlin gewerbe* | `/lp/fensterreinigung-berlin/` |
| Endreinigung: *büro endreinigung berlin, reinigung büroauszug berlin* | `/lp/umzugsreinigung-buero-berlin/` |
| weitere | `/lp/desinfektionsreinigung-berlin/`, `/lp/sanitaer-kuechenreinigung-berlin/`, `/lp/teppichreinigung-berlin/` |

Empfehlung für den Start: 2–4 Anzeigengruppen (Gebäudereinigung, Büroreinigung, Praxisreinigung, Treppenhausreinigung), Keywords als **Wortgruppe** oder **genau passend**, Standort **Berlin** mit Option „Präsenz: Personen an diesem Ort oder die sich regelmäßig dort aufhalten".

**Auszuschließende Keywords** (Kampagnenebene, verhindert teure Fehlklicks): `job`, `jobs`, `stellenangebote`, `minijob`, `gehalt`, `ausbildung`, `selbstständig`, `franchise`, `privat`, `wohnung`, `haushalt`, `putzfrau`, `haushaltshilfe`, `endreinigung wohnung`, `kosten pro stunde`, `preis pro m2`, `rechner`, `gratis`, `kostenlos putzen`, `reinigungsmittel`, `staubsauger`, `kaufen`.

Anzeigentexte ohne Preise, aber mit den echten Zusagen, z. B.:
- Gebäudereinigung in Berlin · Festpreis 24 h nach Begehung · Fester Ansprechpartner
- Reinigungsprotokoll nach jedem Einsatz · Kostenlose Objektbegehung · Jetzt anfragen

---

## 2. Conversion-Aktion anlegen (einmalig, ca. 10 Minuten)

1. Google Ads → **Ziele → Conversions → Übersicht → + Neue Conversion-Aktion → Website**.
2. Domain `reinigungs-buddy.de` eingeben, dann **„Conversion-Aktion manuell mit Code einrichten"**.
3. Einstellungen:
   - Zielkategorie: **Lead-Formular senden** (bzw. „Anfrage senden")
   - Wert: **Für jede Conversion denselben Wert verwenden** oder **Keinen Wert verwenden** (nur intern sichtbar)
   - Zählung: **Eine** (eine Anfrage pro Klick zählt einmal)
   - Klick-Conversion-Zeitraum: 30 Tage
4. Unter **Erweiterte Conversions** aktivieren und als Methode **„Google Tag"** bzw. „Code" wählen. Die Seite übergibt E-Mail und Telefon bereits richtig.
5. Bei „Tag einrichten" → **„Selbst installieren"**. Im angezeigten **Event-Snippet** steht eine Zeile wie
   `'send_to': 'AW-123456789/AbCdEfGhIjKlMn'`.
6. In `src/config/site.ts` eintragen:
   ```ts
   googleAdsId: 'AW-123456789',
   googleAdsLabel: 'AbCdEfGhIjKlMn',
   ```
7. Committen, Coolify deployt neu. Das Consent-Banner erscheint jetzt automatisch, die Datenschutzerklärung ergänzt sich selbst um den Abschnitt zu Google Ads.

Den globalen Google-Tag aus Google Ads **nicht** zusätzlich einbauen, die Website lädt ihn selbst (erst nach Einwilligung).

---

## 3. Testen vor dem Start

1. Seite im Inkognito-Fenster öffnen: `https://reinigungs-buddy.de/lp/gebaeudereinigung-berlin/?gclid=test&utm_campaign=test`
2. Im Banner **„Einverstanden"** klicken.
3. Formular ausfüllen und absenden. Erwartet:
   - Weiterleitung auf die Danke-Seite mit Anfrage-Nr.
   - E-Mail an `mert@reinigungs-buddy.de` mit „Google Ads (gclid): test"
   - Eingangsbestätigung an die eingegebene Adresse
   - Eintrag unter `https://reinigungs-buddy.de/api/anfragen`
4. Mit `?debug=1` an der URL zeigt die Browser-Konsole alle Events.
5. In Google Ads unter Conversions steht nach einigen Stunden der Status „Conversions werden erfasst". Echte Conversions erscheinen erst nach echten Anzeigenklicks.

---

## 4. Gebotsstrategie

- **Start (erste 2–4 Wochen):** „Klicks maximieren" mit Höchst-CPC oder „Conversions maximieren" ohne Ziel-CPA, Tagesbudget so wählen, dass pro Tag mehrere Klicks möglich sind.
- **Ab ca. 15–30 Conversions in 30 Tagen:** auf „Conversions maximieren" mit **Ziel-CPA** umstellen.
- Wöchentlich den Bericht **Suchbegriffe** prüfen und unpassende Begriffe ausschließen.

---

## 5. Was die Conversion-Rate noch deutlich erhöht

- **Telefonnummer eintragen** (`site.ts` → `contact.phone`/`phoneE164`): erscheint dann im Header der Landingpages, in der Sticky-Leiste und als Klick-Event. Im B2B-Bereich ruft ein großer Teil der Interessenten lieber an. In Google Ads zusätzlich ein **Anruf-Asset** anlegen.
- **Schnell antworten:** Wer innerhalb einer Stunde zurückruft, gewinnt deutlich häufiger den Auftrag. Die E-Mail enthält bei Telefonangabe einen „Jetzt anrufen"-Button.
- **Echte Kundenstimmen** in `src/content/stimmen/` einpflegen (nur mit Einwilligung). Sie erscheinen automatisch auf allen Landingpages.
- **Google-Unternehmensprofil** mit Bewertungen und als **Standort-Asset** in Google Ads verknüpfen.
- **Offline-Conversions:** Jede Anfrage speichert die `gclid`. Wird aus einer Anfrage ein Auftrag, kann man das in Google Ads hochladen (Conversions → Uploads). Dann optimiert Google auf Aufträge statt nur auf Anfragen.
