# Google Ads: Einrichtung und Landingpages

Kurzfassung: Anzeigen auf die Landingpages unter `/lp/` schicken, die Conversion „Anfrage" mit zwei Werten in `site.ts` verbinden, deployen, testen. Danach erst Budget hochfahren.

---

## 1. Zielseiten

Alle Zielseiten haben oben ein Kurzformular (Fläche, Name, Firma, E-Mail, Telefon) und darunter alle Zusagen aus den Anzeigen. Auf dem Handy ist das Formular ohne Scrollen sichtbar, sonst springt der Button in der Leiste unten direkt dorthin.

| Anzeigengruppe | Finale URL |
|---|---|
| Büroreinigung | `https://reinigungs-buddy.de/bueroreinigung-berlin/` |
| Unterhaltsreinigung | `https://reinigungs-buddy.de/unterhaltsreinigung-berlin/` |
| Gebäudereinigung / Reinigungsfirma | `https://reinigungs-buddy.de/` |
| Büroreinigung + Bezirk | `https://reinigungs-buddy.de/bueroreinigung-berlin/?bezirk=spandau` (bzw. `mitte`, `charlottenburg`, `kreuzberg`, `prenzlauer-berg` …) |
| Danke-Seite (Conversion, noindex) | `https://reinigungs-buddy.de/danke/` |

Für die Bezirks-Anzeigengruppe den Parameter als **Final-URL-Suffix** auf Anzeigengruppenebene setzen (`bezirk=spandau`), dann bleibt die finale URL gleich.

**Alternative ohne Navigation:** Unter `/lp/…` gibt es zusätzlich reine Anzeigen-Seiten ohne Menü (noindex), z. B. `/lp/bueroreinigung-berlin/`, `/lp/gebaeudereinigung-berlin/`, `/lp/praxisreinigung-berlin/`. Sie eignen sich für einen späteren A/B-Test (Google Ads → Experimente).

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
6. In `src/config/site.ts` → `analytics` eintragen:
   ```ts
   googleAdsId: 'AW-123456789',
   googleAdsLabel: 'AbCdEfGhIjKlMn',
   // optional, je eine eigene Conversion-Aktion „Anruf-Klick" bzw. „E-Mail-Klick":
   googleAdsPhoneLabel: '…',
   googleAdsEmailLabel: '…',
   ```
7. Committen, Coolify deployt neu. Das Consent-Banner erscheint jetzt automatisch, die Datenschutzerklärung ergänzt sich selbst um den Abschnitt zu Google Ads.

Den globalen Google-Tag aus Google Ads **nicht** zusätzlich einbauen und **keine** zusätzliche Conversion „Seitenaufruf /danke/" per URL-Regel anlegen: Die Seite meldet die Conversion selbst (mit Anfrage-Nr. als transaction_id). Beides zusammen würde doppelt zählen.

---

## 3. Testen vor dem Start

1. Seite im Inkognito-Fenster öffnen: `https://reinigungs-buddy.de/bueroreinigung-berlin/?gclid=test123&utm_campaign=test&bezirk=spandau`
2. Im Banner **„Einverstanden"** klicken.
3. Formular ausfüllen und absenden. Erwartet:
   - Weiterleitung auf die Danke-Seite mit Anfrage-Nr.
   - E-Mail an `mert@reinigungs-buddy.de` mit „(Google Ads)" im Betreff und „Google Ads (gclid): test123" im Text
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

- **Telefonnummer eintragen** (`site.ts` → `contact.phone` und `contact.phoneE164`): erscheint dann im Header jeder Seite (mobil als „Anrufen"-Button), in der Leiste unten und zählt mit `googleAdsPhoneLabel` als Conversion. Dieselbe Nummer als **Anruf-Asset** in Google Ads hinterlegen.
- **Schnell antworten:** Wer innerhalb einer Stunde zurückruft, gewinnt deutlich häufiger den Auftrag. Die E-Mail enthält bei Telefonangabe einen „Jetzt anrufen"-Button.
- **Echte Kundenstimmen** in `src/content/stimmen/` einpflegen (nur mit Einwilligung). Sie erscheinen automatisch auf allen Landingpages.
- **Google-Unternehmensprofil** mit Bewertungen und als **Standort-Asset** in Google Ads verknüpfen.
- **Offline-Conversions:** Jede Anfrage speichert die `gclid`. Wird aus einer Anfrage ein Auftrag, kann man das in Google Ads hochladen (Conversions → Uploads). Dann optimiert Google auf Aufträge statt nur auf Anfragen.
