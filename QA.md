# QA-Bericht

Stand: 14.10.2026 · Build: Astro 7.3.8 · geprüft auf dem lokalen Produktions-Build (`npm run build` + `astro preview`)

## Zusammenfassung

| Prüfung | Ergebnis |
|---|---|
| `npm run build` | ✓ ohne Fehler, ohne Warnungen · 33 HTML-Seiten, davon 28 in der Sitemap |
| Lighthouse mobil (4 Seiten) | ✓ Performance 99–100, Accessibility, Best Practices und SEO je 100 |
| Core Web Vitals (Lab) | ✓ LCP 1,7–1,8 s · CLS ≤ 0,004 · TBT 0 ms |
| JavaScript pro Seite | ✓ ca. 6 KB gzip (Budget 50 KB) |
| JSON-LD (validator.schema.org) | ✓ alle 32 Seiten mit Markup: 0 Fehler, 0 Warnungen |
| Genau eine H1 pro Seite | ✓ |
| Titles ≤ 60 / Descriptions ≤ 155, keine Duplikate | ✓ |
| Canonical auf jeder Seite | ✓ |
| Interne Links | ✓ keine toten Links |
| Alt-Texte | ✓ alle Bilder |
| hreflang-Paare | ✓ 4 Paare DE ↔ EN, gegenseitig, mit x-default |
| Preis-Check (€, Euro, EUR, pro m², /m², Stundensatz, priceRange) | ✓ 0 Treffer in Text, Meta und JSON-LD |
| Sperrliste (kündbar, Mindestlaufzeit, Foto-Protokoll, Besichtigung, Video-Call, „Ich bin Mert", Leistungsverzeichnis gratis) | ✓ 0 Treffer, Prüfung läuft bei jedem Build |
| Floskel-Check (Anti-Generik-Liste) | ✓ 0 Treffer |
| Formular (mailto) | ✓ Validierung, Konfigurator-Vorbelegung, Honeypot/Zeitprüfung, Bestätigung, Event |
| Formular (Webhook-Modus) | ✓ JSON-Payload vollständig, Weiterleitung auf `/angebot/danke/`, Event |
| Mobil 360 px und 390 px | ✓ kein horizontales Scrollen (16 Seiten geprüft) |
| Tastatur | ✓ Skip-Link als erster Tab-Stopp, Menü mit Enter/Esc inkl. Fokus-Rückgabe, FAQ per Enter, Slider per Pfeiltasten |
| `prefers-reduced-motion` | ✓ Reveals und Transitions abgeschaltet |
| Duplicate-Check Bezirksseiten | entfällt: keine Bezirksseiten (Entscheidung vom 14.10.) |

Die automatischen Checks (H1, Titles, Canonicals, Links, Alt, hreflang, Preise, Floskeln, JSON-LD) laufen bei **jedem** `npm run build` mit (`scripts/qa.mjs`). Der Build schlägt fehl, sobald einer davon nicht besteht.

## Lighthouse (mobil, Lab-Daten)

| Seite | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 | 1,7 s | 0,004 | 0 ms |
| `/bueroreinigung-berlin/` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 0 ms |
| `/ratgeber/kosten-bueroreinigung-faktoren/` | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms |
| `/en/office-cleaning-berlin/` | 100 | 100 | 100 | 100 | 1,7 s | 0 | 0 ms |

Gemessen mit Lighthouse 12 (simuliertes Mobilgerät, gedrosseltes 4G) gegen den lokalen Preview-Server. INP ist ein Feldwert und lässt sich erst mit echten Besuchern messen. TBT 0 ms und ca. 6 KB JS sprechen für Werte deutlich unter 200 ms. Nach dem Livegang die Messung gegen die echte Domain wiederholen, denn Hoster und CDN beeinflussen TTFB und LCP.

## Strukturierte Daten

| Seitentyp | Typen |
|---|---|
| alle Seiten | `LocalBusiness` (mit `@id`, `areaServed` = Berlin + 12 Bezirke, ohne `priceRange`), `WebSite` |
| Leistungsseiten | `Service` (`provider` → LocalBusiness-`@id`, `areaServed`, `serviceType`, ohne `offers`), `FAQPage`, `BreadcrumbList` |
| Ratgeber-Artikel | `Article` (`author`: Person „Mert"), `FAQPage`, `BreadcrumbList` |
| Startseite, Garantie, EN | `FAQPage`, `BreadcrumbList` (Unterseiten) |
| Leistungen-Hub | `ItemList`, `FAQPage`, `BreadcrumbList` |

Kein `Review`- oder `AggregateRating`-Markup (keine echten Bewertungen vorhanden). Adresse, Telefon, `geo` und `openingHoursSpecification` erscheinen automatisch, sobald sie in `site.ts` eingetragen sind. Danach erneut im [Rich-Results-Test](https://search.google.com/test/rich-results) prüfen.

## Bekannte Einschränkungen des Entwurfs

1. **Formular per mailto:** Ohne eingerichtetes E-Mail-Programm muss die Anfrage kopiert werden (Button vorhanden). `lead_form_submit` zählt das Öffnen des E-Mail-Programms, nicht das Absenden. Empfehlung vor Livegang: `PUBLIC_FORM_ENDPOINT` setzen (README, Abschnitt 5).
2. **Vorher-Nachher-Galerie** ist derzeit ausgeblendet (`showGallery: false` in `offer.ts`). Wieder einschalten, sobald eigene Fotos vorliegen (FOTO-ANLEITUNG.md).
3. **Kein Telefon und kein WhatsApp** hinterlegt: Die Sticky-Leiste zeigt nur „Festpreis anfragen". Telefon- und WhatsApp-Buttons erscheinen automatisch, sobald die Nummern in `site.ts` stehen.
4. **Silbentrennung:** Lange Komposita in Headlines bekommen automatisch weiche Trennstellen (`shy()` in `src/lib/text.ts`). Neue lange Wörter ggf. dort ergänzen.

## Offene Platzhalter

Auf der Website als gelb markierter Text `[Platzhalter: …]` sichtbar. Vollständige Liste: `npm run qa`.

| Wo | Was fehlt |
|---|---|
| `src/config/site.ts` | Inhaber (Vor- und Nachname), Rechtsform, Anschrift (oder bewusst `null` für Service-Area-Business), Telefon, WhatsApp, öffentliche E-Mail, Servicezeiten, Profile (`sameAs`), USt-IdNr., Handwerksrolle, Versicherung, Domain |
| `offer.ts` → FAQ „Schaden" | Versicherer und Deckungssumme der Betriebshaftpflicht |
| `/impressum/` | Name, Rechtsform, Anschrift, Telefon, USt-IdNr., Handwerksrolle, Berufshaftpflicht |
| `/datenschutz/` | Verantwortlicher, Hoster inkl. Speicherdauer und Drittland. Gesamten Text prüfen lassen |
| `/agb/` | Kündigungsfrist, Haftung, Zahlung. **Gesamter Text ist ein Entwurf** (noindex), anwaltlich prüfen lassen |
| `/ueber-uns/` | Gründungsjahr, vollständiger Name |
| `src/content/projekte/` | Eigene Vorher-Nachher-Fotos (siehe FOTO-ANLEITUNG.md) |
| `src/content/stimmen/` | Echte Kundenstimmen mit Einwilligung (Sektion bleibt bis dahin unsichtbar) |
| Stockfotos (17) | Nach und nach durch eigene Fotos ersetzen (CREDITS.md) |

### Inhaltlich zu bestätigen

Diese Aussagen stehen auf der Website und müssen im Betrieb stimmen:

- Rückmeldung **am selben Werktag**, Stichzeit **16 Uhr** (`offer.ts` → `response`)
- Reinigungsprotokoll nach **jedem** Einsatz (per WhatsApp oder E-Mail)
- Festpreis **innerhalb von 24 Stunden nach der Objektbegehung**
- **Englischsprachige** Kommunikation (EN-Seiten, FAQ „Sprechen Sie Englisch?")
- Eingesetzte Mittel: pH-neutrale Reiniger, **Farbsystem**, Flächendesinfektion aus der **VAH-Liste**
- Bereitschaft, eine **Verschwiegenheitserklärung** zu unterschreiben (Praxis/Kanzlei)
- Ausgefallene Termine werden nicht berechnet
- Der Inhaber reinigt selbst mit (Über uns)
