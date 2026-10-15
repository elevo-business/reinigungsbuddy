# PLAN.md – Website Reinigungsbuddy

Stand: 14.10.2026 (Rev. 3) · Status: **freigegeben, Entwurf umgesetzt** (siehe README.md und QA.md)

Dieses Dokument legt Sitemap, Keyword-Mapping, Designsystem, Komponenten und Architektur fest. Gebaut wird erst nach deinem OK. Am Ende stehen die Punkte, zu denen ich eine Entscheidung oder Daten von dir brauche.

---

## 0. Entscheidungen (14.10.2026)

| Thema | Entscheidung |
|---|---|
| Bezirke | Keine eigenen Bezirksseiten. Alle 12 Bezirke als Einsatzgebiet auf Startseite, Footer, FAQ und im Schema |
| Rückmeldung | Am selben Werktag (Stichzeit 16 Uhr, änderbar in `offer.ts`) |
| Domain | Folgt später (`SITE_URL`) |
| Kontaktdaten | Vorerst ausgeblendet. Anfragen über das Formular an mert@reinigungs-buddy.de |
| Vorher-Nachher | Für den Entwurf frei lizenzierte Beispielbilder (Unsplash), sichtbar als „Beispielbild" gekennzeichnet |
| Palette / Schrift | Keine Rückmeldung, daher Empfehlung umgesetzt: Palette A „Waldtinte", General Sans + Switzer |
| Formularversand | Eigener Anfrage-Server im Container (`server/server.mjs`): speichern + E-Mail, optional Webhook |
| Angebot (Rev. 4) | Vier Zusagen: Festpreis innerhalb von 24 h nach Objektbegehung, 24-h-Nachbesserung, Reinigungsprotokoll nach jedem Einsatz, fester Ansprechpartner. **Keine** Aussagen zu Laufzeit/Kündbarkeit, kein Gratis-Leistungsverzeichnis, kein Inhaber-Block |

## 1. Sitemap

```
/                                   Home
├── /leistungen/                    Hub: alle Leistungen + Verbrauchsmaterial-Service
│   ├── /bueroreinigung-berlin/
│   ├── /unterhaltsreinigung-berlin/
│   ├── /grundreinigung-berlin/
│   ├── /fensterreinigung-berlin/
│   ├── /teppichreinigung-berlin/
│   ├── /sanitaer-kuechenreinigung-berlin/
│   ├── /desinfektionsreinigung-berlin/
│   ├── /praxisreinigung-berlin/
│   ├── /treppenhausreinigung-berlin/
│   └── /umzugsreinigung-buero-berlin/
├── /ratgeber/                      Übersicht
│   ├── /ratgeber/kosten-bueroreinigung-faktoren/
│   ├── /ratgeber/leistungsverzeichnis-bueroreinigung/
│   ├── /ratgeber/unterhaltsreinigung-vs-grundreinigung/
│   ├── /ratgeber/reinigungsfirma-wechseln/
│   ├── /ratgeber/wie-oft-buero-reinigen/
│   └── /ratgeber/praxisreinigung-hygieneanforderungen/
├── /garantie/
├── /ueber-uns/
├── /angebot/                       Mehrstufiges Formular (indexierbar)
│   └── /angebot/danke/             noindex, nicht in Sitemap
├── /leistungsverzeichnis/danke/    Lead-Magnet-Bestätigung, noindex
├── /impressum/  /datenschutz/  /agb/   (AGB: noindex, solange Entwurf)
├── /404
└── /en/
    ├── /en/office-cleaning-berlin/
    ├── /en/services/
    └── /en/contact/                 (Formular EN, Danke-Seite /en/contact/thanks/ noindex)
```

**Umfang:** 10 Leistungsseiten + Hub, 6 Ratgeber, 4 EN-Seiten, 6 Vertrauens-/Pflichtseiten → ca. 28 indexierbare URLs. **Keine eigenen Bezirksseiten** (siehe 2.1).

**URL-Konvention:** Kleinschreibung, Umlaute transkribiert (`oe`, `ue`), immer mit Trailing Slash (`trailingSlash: 'always'` in Astro + Redirect-Regeln im Hosting).

---

## 2. Keyword-Mapping

Regel: ein Haupt-Keyword pro URL. Wo sich im Briefing zwei Seiten ein Keyword teilen würden, habe ich das aufgelöst (siehe „Korrekturen" darunter).

| URL | Haupt-Keyword | Nebenkeywords | Intent |
|---|---|---|---|
| `/` | Gebäudereinigung Berlin | Reinigungsfirma Berlin, Reinigungsservice Berlin, Gewerbereinigung Berlin | kommerziell |
| `/leistungen/` | Büroreinigung Leistungen | Leistungsumfang Gebäudereinigung, Verbrauchsmaterial Büro, Hygienepapier Service | Navigation/kommerziell |
| `/bueroreinigung-berlin/` | Büroreinigung Berlin | Büro reinigen lassen Berlin, Reinigungsfirma Büro Berlin, Büroreinigung Firma | transaktional |
| `/unterhaltsreinigung-berlin/` | Unterhaltsreinigung Berlin | regelmäßige Reinigung Gewerbe, tägliche Büroreinigung, Reinigungsintervall | transaktional |
| `/grundreinigung-berlin/` | Grundreinigung Berlin | Büro Grundreinigung, Intensivreinigung Gewerbe, Bodengrundreinigung | transaktional |
| `/fensterreinigung-berlin/` | Fensterreinigung Berlin | Glasreinigung Büro, Glasfassade reinigen, Glastrennwände | transaktional |
| `/teppichreinigung-berlin/` | Teppichreinigung Büro Berlin | Teppichboden reinigen, Polsterreinigung Bürostühle, Sprühextraktion | transaktional |
| `/sanitaer-kuechenreinigung-berlin/` | Sanitärreinigung Büro Berlin | Teeküche reinigen, WC-Reinigung Gewerbe, Sozialräume | transaktional |
| `/desinfektionsreinigung-berlin/` | Desinfektionsreinigung Berlin | Flächendesinfektion Büro, Kontaktflächen desinfizieren | transaktional |
| `/praxisreinigung-berlin/` | Praxisreinigung Berlin | Arztpraxis Reinigung, Kanzleireinigung Berlin, Zahnarztpraxis Reinigung | transaktional |
| `/treppenhausreinigung-berlin/` | Treppenhausreinigung Berlin | Hausreinigung Berlin, Hausverwaltung Reinigung, Eingangsbereich | transaktional |
| `/umzugsreinigung-buero-berlin/` | Endreinigung Büro Berlin | Büroumzug Reinigung, Übergabereinigung Gewerbe, Endreinigung Gewerbe | transaktional |
| `/ratgeber/kosten-bueroreinigung-faktoren/` | Büroreinigung Kosten | Was kostet Büroreinigung, Kosten Büroreinigung Berlin, Reinigungskosten Faktoren | informativ |
| `/ratgeber/leistungsverzeichnis-bueroreinigung/` | Leistungsverzeichnis Büroreinigung | Reinigungsplan Büro Vorlage, Checkliste Büroreinigung | informativ + Lead |
| `/ratgeber/unterhaltsreinigung-vs-grundreinigung/` | Unterhaltsreinigung oder Grundreinigung | Unterschied Unterhaltsreinigung Grundreinigung | informativ |
| `/ratgeber/reinigungsfirma-wechseln/` | Reinigungsfirma wechseln | Reinigungsvertrag kündigen, Übergabe Reinigungsfirma | informativ |
| `/ratgeber/wie-oft-buero-reinigen/` | Wie oft Büro reinigen | Reinigungsintervall Büro, Büroreinigung Häufigkeit | informativ |
| `/ratgeber/praxisreinigung-hygieneanforderungen/` | Praxisreinigung Hygieneanforderungen | Hygieneplan Arztpraxis, Reinigung Arztpraxis Vorschriften | informativ |
| `/garantie/` | – (Marke: Reinigungsbuddy Garantie) | Nachbesserungsgarantie | Vertrauen |
| `/ueber-uns/` | – (Marke) | Inhaber Reinigungsbuddy | Vertrauen |
| `/angebot/` | – (Angebot Büroreinigung anfragen) | Festpreis Reinigung Angebot | Conversion |
| `/en/` | cleaning company Berlin | commercial cleaning Berlin, English speaking cleaning company Berlin | kommerziell |
| `/en/office-cleaning-berlin/` | office cleaning Berlin | office cleaners Berlin, startup office cleaning | transaktional |
| `/en/services/` | commercial cleaning services Berlin | window cleaning, carpet cleaning office Berlin | Navigation |
| `/en/contact/` | – | request a quote cleaning Berlin | Conversion |

**Korrekturen gegenüber dem Briefing (Kannibalisierung):**
1. **„Büroreinigung Kosten Berlin"** stand als Nebenkeyword auf `/bueroreinigung-berlin/`. Ohne Preise kann die Leistungsseite diesen Intent nicht bedienen → das Keyword gehört dem Ratgeber-Artikel „Kosten-Faktoren". Die Leistungsseite verlinkt mit genau diesem Ankertext dorthin.
2. **„Endreinigung Gewerbe"** stand bei Grundreinigung *und* Umzugsreinigung → nur noch bei `/umzugsreinigung-buero-berlin/`. Grundreinigung bekommt stattdessen „Intensivreinigung".
3. **„Kanzleireinigung"** bleibt Nebenkeyword von `/praxisreinigung-berlin/` (gleicher Intent: kleine Praxis/Kanzlei mit Publikumsverkehr). Eigene Seite erst, wenn die Search Console Nachfrage zeigt.

### 2.1 Bezirke ohne eigene Seiten

Ziel ist das Ranking für **„Gebäudereinigung Berlin"** (plus „Büroreinigung Berlin" usw.), nicht für jeden Bezirk einzeln. Die Bezirke tauchen deshalb als Einsatzgebiet auf, nicht als eigene URLs:

- **Home, Sektion „Einsatzgebiet":** alle 12 Bezirke mit typischen Ortsteilen und Gewerbelagen in einem kompakten Block, z. B. „Mitte (Moabit, Wedding, Tiergarten) · Friedrichshain-Kreuzberg · …", dazu eine schlichte SVG-Karte von Berlin ohne Klickziele und ohne Google Maps.
- **Footer:** Zeile „Einsatzgebiet: ganz Berlin" mit allen 12 Bezirksnamen als Text.
- **Leistungsseiten:** ein Satz zum Einsatzgebiet in der Direktantwort und eine FAQ „Reinigen Sie auch in [Spandau/Marzahn/…]?".
- **Schema:** `areaServed` = Berlin + alle 12 Bezirke als `Place` (im `LocalBusiness` und in jedem `Service`).
- **Google-Unternehmensprofil:** Einzugsgebiet = die 12 Bezirke. Für das Local Pack ist das wichtiger als Unterseiten.

Spätere Option: Zeigt die Search Console nach einigen Monaten echte Suchanfragen für einen Bezirk (z. B. „Büroreinigung Mitte"), bauen wir gezielt *eine* Seite dafür. Die Inhaltsstruktur bleibt dafür vorbereitet, Seiten entstehen aber erst bei Bedarf.

---

## 3. Designsystem

### 3.1 Ausgangspunkt: dein Signet

Dein Logo (Bogen + Punkt: ein Lächeln, das zugleich ein „i"/Häkchen ist) gibt die Marke vor: **Waldtinte `#0F2E23`** und **Mint `#4FC79C`**. Beide Paletten bauen darauf auf. Ich erfinde daher kein neues Signet, sondern zeichne deins sauber als SVG nach und entwickle die Wortmarke dazu.

Der „Bogen" wird zum wiederkehrenden Marken-Element: als Unterstreichung, die sich beim Hover aufbaut, als Häkchen in Checklisten und als Abschluss-Zeichen am Ende jeder Sektion.

### 3.2 Zwei Paletten (Kontrast nach WCAG 2.2 gemessen)

**Palette A – „Waldtinte" (Empfehlung)**

| Rolle | Wert | Kontrast |
|---|---|---|
| Papier (Hintergrund) | `#F4F3EF` | – |
| Tinte (Text, dunkle Flächen) | `#0F2E23` | 13,2 : 1 auf Papier ✔ AAA |
| Mint (Akzent, CTAs auf Dunkel, Markierungen) | `#4FC79C` | 6,95 : 1 auf Tinte ✔ AA |
| Tinte auf Mint (Text im Primär-Button) | `#0F2E23` auf `#4FC79C` | 6,95 : 1 ✔ AA |
| Moos (Links/Akzenttext auf Papier) | `#1F7A58` | 4,75 : 1 ✔ AA |
| Grau (Sekundärtext) | `#5B625E` | 5,64 : 1 ✔ AA |
| Linie (Rasterlinien) | `#0F2E23` mit 12 % Deckkraft | dekorativ |

*Wichtig:* Mint auf Papier hat nur 1,9 : 1. Mint kommt deshalb **nie als Text auf hellem Grund** vor, sondern nur als Fläche (Button, Markierung hinter Tinte-Text) oder auf dunklen Sektionen.

*Begründung:* Die Palette ist direkt aus deinem Logo abgeleitet, Wiedererkennung ab dem ersten Kontakt (Google-Profil, WhatsApp-Avatar, Website). Das tiefe Grün statt Schwarz wirkt wie ein Premium-Handwerks- oder Interior-Studio und hat nichts mit dem Türkis-Wassertropfen-Look der Branche zu tun. Hell-Dunkel-Wechsel (Papier-Sektionen ↔ Waldtinte-Sektionen) gibt Rhythmus ohne Verläufe.

**Palette B – „Anthrazit & Signal"**

| Rolle | Wert | Kontrast |
|---|---|---|
| Papier | `#F4F3EF` | – |
| Anthrazit (Text) | `#14171A` | 16,2 : 1 ✔ AAA |
| Signalgelb (CTA-Flächen) | `#E2F04A` | Anthrazit darauf 14,4 : 1 ✔ AAA |
| Mint (nur Signet + kleine Markierungen auf Dunkel) | `#4FC79C` | 8,55 : 1 auf Anthrazit ✔ |
| Grau | `#5E6A64` | 5,08 : 1 ✔ AA |

*Begründung:* Maximaler Kontrast, sehr „Berlin-Editorial", CTAs springen stärker ins Auge. *Nachteil:* Das Logo-Grün steht dann neben einem zweiten Akzent (Gelb), die Marke wird weniger eindeutig. Das Gelb-auf-Schwarz-Muster nutzen außerdem viele Tech-Startups, so wirkt es weniger eigen.

→ **Empfehlung: Palette A.** Sie trägt die vorhandene Marke konsequent (das Prinzip „eine Marke tragen" aus der Two-Bettys-Referenz).

### 3.3 Typografie

| Einsatz | Schrift | Schnitte | Begründung |
|---|---|---|---|
| Headlines | **General Sans** (Fontshare, ITF Free Font License) | 500, 600 | Grotesk mit Charakter (offene Formen, leicht technisch), keine Inter-Kopie. Funktioniert sehr groß mit engem Tracking (`-0.035em`). |
| Fließtext | **Switzer** (Fontshare) | 400, 400 italic, 500 | Ruhige, gut lesbare Grotesk, harmoniert mit General Sans, trotzdem eigener Grauwert. |
| Zahlen | Switzer mit `tabular-nums` | – | Sektionsnummern (01, 02 …), Schritt-Nummern, Fakten-Blöcke. |

- Selbst gehostet als WOFF2 in `public/fonts/`, Subset Latin + Latin-Extended (deutsche Umlaute, ß, „ "), `font-display: swap`, Preload nur General Sans 600 (Hero-H1).
- Typo-Skala mit `clamp()`: H1 `clamp(2.75rem, 7vw + 1rem, 6rem)`, H2 `clamp(2rem, 4vw + .5rem, 3.75rem)`, Fließtext 1.0625rem / Zeilenhöhe 1.6, Zeilenlänge max. 68 Zeichen.
- Fallback-Font-Metriken (`size-adjust`, `ascent-override`) gegen CLS beim Font-Swap.

*Lizenz-Hinweis:* Die Fontshare-Lizenz erlaubt die kommerzielle Nutzung und das Self-Hosting. Die Lizenzdatei lege ich in `public/fonts/` ab.

### 3.4 Layout-Prinzipien

- 12-Spalten-Raster (Desktop), 4 Spalten (mobil), max. Inhaltsbreite 1440 px, Seitenränder `clamp(1rem, 4vw, 3rem)`.
- Sichtbare Haarlinien (1 px, 12 % Tinte) als Spalten- und Sektionstrenner. Jede Sektion beginnt mit Nummer + Label in der Kopfzeile („02 — Das Angebot").
- Asymmetrie: Headlines spannen 8–9 Spalten, Fließtext sitzt versetzt in den Spalten 7–12. Fotos laufen randlos über die volle Breite oder brechen bewusst aus dem Raster aus.
- **Hero ohne „Text links, Bild rechts":** riesige H1 über die ganze Breite, darunter ein Querstreifen mit 3 Offer-Fakten in Tabellenoptik, dann ein randloses Foto, in das die Vertrauenszeile und der Konfigurator-Einstieg hineinragen.
- Icons: eigenes Set aus ca. 16 Linien-Icons (1,5 px Strich, runde Enden, passend zum Bogen des Signets), als Inline-SVG-Komponente.
- Bewegung: Unterstreichungen, die sich aufbauen; Bild-Zoom 1,03 beim Hover; Scroll-Reveal per CSS (`animation-timeline: view()` mit IntersectionObserver-Fallback). Bei `prefers-reduced-motion` alles aus.

### 3.5 Drei übernommene Designprinzipien

> Transparenz: Awwwards/Godly habe ich für diesen Plan nicht live durchsucht. Die drei Prinzipien leite ich aus wiederkehrenden Mustern prämierter Service- und Studio-Seiten der letzten Jahre ab. Bevor ich das Layout final setze, prüfe ich aktuelle Gewinner gezielt und melde dir, falls sich daraus etwas ändert.

1. **Typografie als Hauptbild.** Prämierte Studio-Seiten führen mit einer übergroßen, präzise gesetzten Aussage statt mit einem Stockfoto. Für uns heißt das: Die H1 *ist* der Hero, Fotos kommen als zweite Ebene. Das löst nebenbei das LCP-Problem (Text-LCP statt Bild-LCP).
2. **Sichtbares System: Raster, Nummern, Index.** Nummerierte Sektionen, Haarlinien und tabellarische Fakten-Listen („Leistung — Intervall — enthalten") wirken wie ein Architektur-Leistungsverzeichnis. Das passt inhaltlich, denn Reinigung *ist* ein Leistungsverzeichnis, und es signalisiert Ordnung, genau das Versprechen der Dienstleistung.
3. **Die Handlung ist Teil des Heros (Batmaid-Prinzip).** Der erste Schritt zur Anfrage (Konfigurator „Was soll bei Ihnen sauber werden?") sitzt direkt im ersten Viewport und nicht hinter einem Button. Ein Klick auf eine Kachel ist schon der Beginn der Anfrage.

---

## 4. Komponentenliste

**Layout & Navigation**
| Komponente | Typ | Notiz |
|---|---|---|
| `BaseLayout.astro` | statisch | Head, SEO, Fonts, Consent, Sticky-Bars |
| `Header.astro` | statisch + kleines Script | Sprachumschalter, Desktop-Sticky-CTA ab Scrolltiefe |
| `MobileMenu` | Island (Vanilla, ~1 KB) | Fokus-Falle, Esc schließt |
| `Footer.astro` | statisch | NAP aus `site.ts`, Leistungslinks, Einsatzgebiet (12 Bezirke als Text) |
| `StickyMobileBar.astro` | statisch | Anrufen · WhatsApp · Angebot |
| `Breadcrumbs.astro` | statisch | sichtbar + `BreadcrumbList`-Schema |
| `LanguageSwitch.astro` | statisch | verlinkt das hreflang-Pendant |

**SEO**
| `SEO.astro` | Title, Description, Canonical, hreflang, OG/Twitter |
| `SchemaOrg.astro` | JSON-LD: LocalBusiness, Service, FAQPage, BreadcrumbList, Article, WebSite |

**Sektionen (Leistungsseiten-Reihenfolge 1–12)**
| `Hero.astro` · `DirectAnswer.astro` · `ProblemBlock.astro` · `OfferStack.astro` · `ScopeChecklist.astro` (enthalten / nicht enthalten) · `BeforeAfterGallery.astro` · `ProcessSteps.astro` · `AllInOneBlock.astro` · `ComparisonTable.astro` · `GuaranteeBlock.astro` · `OwnerBlock.astro` · `FAQ.astro` (`<details>`, kein JS) · `FinalCTA.astro` · `SectionHeader.astro` (Nummer + Label) · `FactsBlock.astro` (zitierbare Fakten für KI-Suche) |

**Interaktiv (Islands, Vanilla TS bzw. Preact nur, wenn es nötig ist)**
| Komponente | Budget gz | Notiz |
|---|---|---|
| `NeedsConfigurator` | ≤ 8 KB | Kacheln (Mehrfachauswahl) + Fläche + Häufigkeit → Paketzusammenfassung ohne Preise → übergibt Werte per URL-Parameter an `/angebot/` |
| `MultiStepForm` | ≤ 14 KB | 4 Schritte, Fortschrittsbalken, Inline-Validierung, Honeypot + Zeitprüfung, liest Konfigurator-Werte |
| `BeforeAfterSlider` | ≤ 3 KB | `<input type="range">` als Basis → Tastatur + Touch + Screenreader automatisch |
| `LeadMagnetForm` | ≤ 3 KB | E-Mail-Opt-in, optional Exit-Intent (Desktop, 1× pro Session, Schalter in `offer.ts`) |
| `ConsentBanner` | ≤ 4 KB | eigene Lösung, Consent Mode v2, lädt Meta Pixel/GA4 erst nach Zustimmung |
| `ClickToLoad` | ≤ 1 KB | Zwei-Klick-Hülle für Karte, Cal.com, Google-Bewertungen |
| `Track` | ≤ 1 KB | `lead_form_submit`, `phone_click`, `whatsapp_click`, `configurator_complete`, `lead_magnet_optin` → Plausible + (nach Consent) Pixel/GA4, Debug-Modus per `?debug=1` |

Ziel: höchstens ca. 25 KB JS gz auf der schwersten Seite (Home mit Konfigurator + Formular). Budget sind 50 KB.

**Inhalts-Komponenten**
| `Testimonials.astro` (rendert nur, wenn `src/content/stimmen/` Einträge hat) · `ProjectCard.astro` · `ServiceArea.astro` (Bezirksliste + schlichte SVG-Karte, keine Links) · `ArticleCTA.astro` (kontextbezogen je Artikel) · `Picture.astro` (Wrapper um `astro:assets` mit STOCK-Kommentar) · `Icon.astro` · `Logo.astro` |

---

## 5. Architektur

```
src/
  config/offer.ts         Angebotstexte, Garantie, Schalter (Galerie, Exit-Intent, Cal.com …)
  config/site.ts          NAP, Telefon, WhatsApp, Öffnungszeiten, Social, Geo (eine Quelle)
  config/i18n.ts          UI-Strings DE/EN, hreflang-Paare
  content.config.ts       Zod-Schemas aller Collections
  content/leistungen/*.mdx   (de + en-Unterordner)
  content/ratgeber/*.mdx
  content/projekte/*.md      Vorher-Nachher
  content/stimmen/*.md       echte Kundenstimmen (leer)
  components/ layouts/ pages/ styles/ lib/ (schema.ts, tracking.ts, whatsapp.ts)
  assets/images/
functions/                Cloudflare Pages Functions   ┐ gleiche Logik,
netlify/functions/        Netlify Functions            ┘ zwei dünne Adapter
public/  fonts/ favicon/ site.webmanifest robots.txt leistungsverzeichnis-vorlage.pdf
```

**Stack:** Astro 5 (aktuelle stabile Version, prüfe ich beim Setup), Tailwind CSS v4 (Design-Tokens als CSS-Variablen), TypeScript strict, MDX, `@astrojs/sitemap`, statische Ausgabe.

**Architekturentscheidung – Formularversand über eine Serverless-Funktion:**
Würde die statische Seite direkt an `FORM_WEBHOOK_URL` posten, stünde die Webhook-URL öffentlich im JavaScript (Spam-Einfallstor), und `.env`-Werte wären im Browser sichtbar. Außerdem braucht die **Meta Conversions API** ein serverseitiges Access-Token. Deshalb:
- Formular → `/api/lead` (Cloudflare Pages Function bzw. Netlify Function) → prüft Honeypot und Zeit, leitet an `FORM_WEBHOOK_URL` (Make/Zapier/n8n) weiter, sendet bei Consent das CAPI-Event.
- **E-Mail-Fallback:** Bei Netlify nutzt die Funktion Netlify Forms. Bei Cloudflare (dort gibt es kein Forms-Feature) geht der Fallback an Formspree. Beides dokumentiere ich im README.
- Die Seite bleibt vollständig statisch (SSG), nur dieser eine Endpunkt läuft serverseitig. Die Kosten liegen bei beiden Hostern im Gratis-Kontingent.

**Analytics:** Plausible (cookielos, EU-gehostet) als Standard, per Schalter austauschbar gegen selbst gehostetes Matomo im cookielosen Modus.

**Lead-Magnet-PDF:** Eine Vorlage „Leistungsverzeichnis Büroreinigung" baue ich als druckbare HTML-Seite und erzeuge daraus ein PDF (generisch, für den sofortigen Download). Die *individuelle* Version für das jeweilige Büro erstellst du nach dem Opt-in. So ist es auch auf der Seite formuliert, damit wir nichts versprechen, was automatisch nicht geht.

---

## 6. Inhalts- und Ehrlichkeitsregeln (gelten beim Bauen)

- **Keine Preise**, auch nicht im Schema-Markup (`priceRange` und `offers` fehlen), in Meta-Descriptions oder in FAQs. Der QA-Build sucht nach `€`, `Euro`, `EUR`, `pro m²`, `/m²`, `Stundensatz`, `priceRange` und bricht bei einem Treffer ab.
- **Keine erfundenen Zahlen, Kunden, Bewertungen, Zertifikate.** Testimonials und `AggregateRating` bleiben aus, bis es echte Einträge gibt.
- **Keine Versprechen über die Kapazität eines Kleinbetriebs hinaus:** kein 24/7, kein Ersatzteam. Die Garantie gilt „werktags", die Bedingungen stehen auf `/garantie/`.
- Floskel-Sperrliste (Briefing Abschnitt 7) als automatischer Check im QA-Skript.
- Stockfotos nur von Unsplash (Standardlizenz), Pexels oder Pixabay, dokumentiert in `CREDITS.md` und im Code als `<!-- STOCK -->` markiert. Vorher-Nachher-Galerie: **Vorschlag: zum Launch per Schalter aus**, statt Beispielbilder zu zeigen (siehe Frage 4).

---

## 7. Umsetzungsreihenfolge nach Freigabe

1. Setup: Astro, Tailwind, Fonts, Tokens, Basis-Layout, SEO- und Schema-Komponenten, `site.ts`/`offer.ts`
2. Logo/Signet als SVG, Favicons, Manifest, OG-Bilder
3. Kern-Komponenten + Home
4. Leistungs-Template + 10 Leistungsseiten + Hub
5. Konfigurator, Formular, `/api/lead`, Danke-Seiten, Tracking, Consent
6. 6 Ratgeber-Artikel + PDF
7. Garantie, Über uns, Pflichtseiten, 404
8. EN-Version
9. Doku: README, SEO-CHECKLISTE, CREDITS, FOTO-ANLEITUNG
10. QA: Build, Lighthouse, Schema-Validierung, Link-/H1-/Titel-/Preis-Checks → `QA.md`

Ich committe nach jeder Phase auf `claude/reinigungsbuddy-website-ln1zqa`.

---

## 8. Offene Fragen / was ich von dir brauche

**Entscheidungen**
1. **Palette A (Waldtinte, aus deinem Logo) oder B (Anthrazit & Signal)?** Meine Empfehlung: A.
2. **Schriften General Sans + Switzer okay?** Alternative: Satoshi für die Headlines.
3. **Formular über Serverless-Funktion (Abschnitt 5)?** Dann musst du dich für einen Hoster entscheiden: **Cloudflare Pages** (Fallback-E-Mail über Formspree) oder **Netlify** (Netlify Forms eingebaut). Ich baue beide Adapter, dokumentiere aber einen als Standard.
4. **Vorher-Nachher zum Launch:** Galerie ausblenden (meine Empfehlung, weil Beispielbilder auf einer Vertrauens-Seite eher schwächen) oder mit gekennzeichneten Beispielbildern zeigen?
5. **Rückrufzeit auf der Danke-Seite:** Welches „[X] Stunden" hältst du sicher ein? Vorschlag: „innerhalb von 4 Stunden (werktags 8–18 Uhr)".

**Daten (Abschnitt 0 ist noch leer)**
Bis du sie lieferst, setze ich klar erkennbare Platzhalter (`[PLATZHALTER: …]`) zentral in `site.ts`:
- Rechtsform/Inhaber, Anschrift, Telefon, WhatsApp-Nummer, E-Mail, Domain
- USt-IdNr./Steuer-Nr., HWK-Eintrag (falls vorhanden), Betriebshaftpflicht (ja/nein, Deckungssumme)
- Servicezeiten, Einsatzgebiet außerhalb Berlins (Potsdam/Falkensee ja oder nein?)
- **Geo-Koordinaten** ergeben sich aus der Anschrift. Hast du keine Gewerbeadresse, nur eine Privatadresse, sag es mir: Dann wird das Google-Profil als „Service-Area-Business" ohne öffentliche Adresse geführt, und das Schema passe ich entsprechend an.
- Ein Foto von dir für den Inhaber-Block (bis dahin ein neutraler Platzhalter, kein Stock-Gesicht, denn ein fremdes Gesicht als „Inhaber" wäre irreführend).
- Links zu Google-Unternehmensprofil / Instagram / LinkedIn, falls vorhanden.
- Logo: Ist das gelieferte Signet final? Existiert schon eine Wortmarke oder eine Hausschrift?
