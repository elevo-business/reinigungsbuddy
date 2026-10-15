# Übergabe: Landingpages ↔ Google-Ads-Kampagne

Stand: 15.10.2026 · Branch `claude/reinigungsbuddy-website-ln1zqa` · Antwort auf das Briefing „Landingpages auf Google-Ads-Kampagne abstimmen".

## 1. Finale URLs

| Anzeigengruppe | Finale URL | H1 (Message Match) |
|---|---|---|
| Büroreinigung | `https://reinigungs-buddy.de/bueroreinigung-berlin/` | Büroreinigung in Berlin, die einfach funktioniert. |
| Unterhaltsreinigung | `https://reinigungs-buddy.de/unterhaltsreinigung-berlin/` | Unterhaltsreinigung in Berlin, jede Woche in gleicher Qualität. |
| Gebäudereinigung / Reinigungsfirma | `https://reinigungs-buddy.de/` | Gebäudereinigung in Berlin, um die Sie sich nicht kümmern müssen. |
| Büroreinigung Bezirke | `https://reinigungs-buddy.de/bueroreinigung-berlin/` + Final-URL-Suffix `bezirk=spandau` (bzw. `mitte`, `charlottenburg`, `wilmersdorf`, `kreuzberg`, `friedrichshain`, `prenzlauer-berg`, `schoeneberg`, `tempelhof`, `steglitz`, `neukoelln`, `reinickendorf`, `pankow`, `lichtenberg`, `koepenick` …) | gleiche H1; die Zeile darüber wird zu „Büroreinigung in Spandau" |
| Danke-Seite (Conversion, noindex) | `https://reinigungs-buddy.de/danke/` | — |

Optional für spätere A/B-Tests: reine Anzeigen-Seiten ohne Navigation unter `/lp/…` (noindex), siehe GOOGLE-ADS.md.

## 2. Was auf jeder Zielseite oben steht

Im sichtbaren Bereich bzw. direkt darunter: Headline, Kurzformular (Fläche, Name, Firma, E-Mail, Telefon) und alle Zusagen aus den Anzeigen:
Kostenlose Objektbegehung · Festpreis innerhalb von 24 Stunden danach · Keine versteckten Zuschläge · Ein fester Ansprechpartner · Reinigungsprotokoll nach jedem Einsatz · Nachbesserung innerhalb von 24 Stunden (werktags) · Rückmeldung am selben Werktag · In allen 12 Berliner Bezirken · **Für Büros ab 100 m²** (Zeile über der Headline und im Formular-Kopf).

`/bueroreinigung-berlin/` und `/unterhaltsreinigung-berlin/` haben zusätzlich den Abschnitt „Büroreinigung in Ihrem Bezirk" mit allen 12 Bezirken und Ortsteilen.

**Unter 100 m²:** Die Option „bis 100 m²" bleibt im Formular. Wählt jemand sie, erscheint ein Hinweis. Die Anfrage wird gespeichert und gemailt (Betreff beginnt mit „[unter 100 m²]"), zählt aber **nicht** als Google-Ads-Conversion.

## 3. Wie das Formular sendet

- Kein mailto mehr. Das Formular schickt per POST an einen eigenen kleinen Server im Website-Container (`/api/anfrage`). Der Server speichert jede Anfrage auf dem Server, schickt sie per E-Mail (SMTP) an mert@reinigungs-buddy.de (Antworten gehen direkt an den Kunden) und eine Eingangsbestätigung an den Kunden. Danach Weiterleitung auf `/danke/?id=<Anfrage-Nr.>`.
- Funktioniert auch ohne JavaScript.
- Mitgesendet: `gclid`, `gbraid`, `wbraid`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, Einstiegsseite, Seite des Formulars. Nach Einwilligung werden die Werte 90 Tage im First-Party-Cookie `rb_attr` gemerkt.
- **Test mit `?gclid=test123`:** bestanden (lokaler Docker-Test des fertigen Containers mit Test-Mailserver). Aufruf von `/bueroreinigung-berlin/?gclid=test123&utm_source=google&utm_campaign=buero&bezirk=spandau`, danach Wechsel auf die Startseite und Absenden dort: Anfrage enthielt `gclid: test123`, `utm_campaign: buero`, Einstiegsseite `/bueroreinigung-berlin/`. E-Mail-Betreff „Neue Anfrage: … (Google Ads)".
- **Auf dem Live-Server noch nicht getestet**, weil dort die Zugangsdaten fehlen (siehe 5).

## 4. Conversion-Tracking: wo die IDs hin müssen

Datei `src/config/site.ts` → `analytics`:

```ts
googleAdsId: 'AW-XXXXXXXXX',          // aus dem Event-Snippet: send_to 'AW-XXXXXXXXX/XXXXXXX'
googleAdsLabel: 'XXXXXXX',            // Conversion „Anfrage" (Formular gesendet)
googleAdsPhoneLabel: null,            // optional: eigene Conversion „Klick auf tel:"
googleAdsEmailLabel: null,            // optional: eigene Conversion „Klick auf mailto:"
```

Die Werte einfach an Claude Code schicken, dann wird eingetragen und deployt.

- Lead-Conversion feuert auf `/danke/` mit `transaction_id` = Anfrage-Nr. (kein Doppelzählen bei Reload) und erweiterten Conversions (E-Mail/Telefon, von gtag gehasht). Getestet: genau eine Conversion pro Anfrage, keine für „bis 100 m²", tel-Klick feuert eigenes Label.
- **Wichtig:** In Google Ads **keine** zusätzliche URL-basierte Conversion „/danke/" anlegen und den Google-Tag **nicht** selbst einbauen, sonst wird doppelt gezählt.
- Consent Mode v2 (Basic): Standard „denied", gtag wird erst nach „Einverstanden" geladen. Banner liegt als Overlay über der Seite, kein Layout-Shift.
- Conversion-Aktion: Kategorie „Lead-Formular senden", Zählung „Eine", erweiterte Conversions an (Methode Google-Tag).

## 5. Was noch fehlt (nicht von der Website lösbar)

| Punkt | Wer |
|---|---|
| **Firmen-Telefonnummer.** Platz im Header ist vorbereitet (Desktop: Nummer, mobil: „Anrufen"-Button), erscheint automatisch, sobald die Nummer in `site.ts` → `contact.phone` / `phoneE164` steht. Dieselbe Nummer als Anruf-Asset in Ads. | Mert: Nummer liefern |
| Coolify: SMTP-Variablen, Volume `/data`, `ADMIN_PASSWORD`, Redeploy (README Abschnitt 5) | Mert / Cowork |
| Microsoft 365: „Authentifiziertes SMTP" für mert@ aktivieren (oder Brevo) | Mert / Cowork |
| Google Ads: Conversion-Aktion anlegen, IDs zurückgeben | Cowork |
| **„50 % im ersten Monat":** nicht umgesetzt, Entscheidung offen. Bis dahin nicht in die Anzeigen. Falls ja: Konditionen (Mindestumfang? nur Neukunden? nur Unterhaltsreinigung?) liefern, dann Banner auf den 3 Zielseiten + Abschnitt in AGB. | Mert |

## 6. Messwerte (Lighthouse mobil, lokal)

`/`, `/bueroreinigung-berlin/`, `/angebot/`: Performance 100, Barrierefreiheit 100, Best Practices 100, SEO 100. LCP 1,5–1,6 s, CLS 0. `/unterhaltsreinigung-berlin/`: Performance 99, LCP 1,8 s.
