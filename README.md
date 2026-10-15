# Reinigungsbuddy – Website

Website für Reinigungsbuddy, Gebäudereinigung in Berlin. Statische Seite mit **Astro 7** und **Tailwind CSS 4**: schnell, ohne Cookies, Inhalte in einfachen Textdateien.

> **Status: Entwurf.** Kontaktdaten, Rechtstexte und eigene Vorher-Nachher-Fotos sind noch Platzhalter. Die vollständige Liste steht in [QA.md](QA.md#offene-platzhalter).

---

## 1. Lokal starten

Voraussetzung: [Node.js](https://nodejs.org) ab Version 22.

```bash
npm install        # einmalig
npm run dev        # Entwicklungsserver auf http://localhost:4321
npm run build      # fertige Website nach dist/ bauen + QA-Checks
npm run preview    # gebaute Website lokal ansehen
```

`npm run build` bricht ab, wenn ein QA-Check fehlschlägt, zum Beispiel bei einer Preisangabe, einem toten Link, einer doppelten H1 oder einem zu langen Title. Die Meldung sagt, welche Seite betroffen ist.

---

## 2. Wo was steht

```
src/
  config/site.ts        Name, Kontaktdaten, Adresse, Inhaber, Servicezeiten, Bezirke, Tracking-IDs
  config/offer.ts       Angebot, Garantie-Bedingungen, Ablauf, Vergleich, FAQ, Schalter
  config/offer.en.ts    Englische Fassung von offer.ts
  content/leistungen/   Eine .mdx-Datei pro Leistungsseite
  content/ratgeber/     Eine .mdx-Datei pro Ratgeber-Artikel
  content/projekte/     Vorher-Nachher-Projekte (Vorlage: _vorlage.md)
  content/stimmen/      Echte Kundenstimmen (Vorlage: _vorlage.md) – leer = Sektion unsichtbar
  assets/images/        Fotos (werden beim Build automatisch optimiert)
  components/           Bausteine (Hero, Formular, Konfigurator, FAQ …)
  pages/                Seiten (URL = Dateipfad)
  pages/lp/             Google-Ads-Landingpages (noindex, ohne Navigation)
server/server.mjs       Anfrage-Server: speichert Anfragen und verschickt E-Mails
public/                 Schriften, Favicons, Logo, OG-Bilder, PDF-Vorlage
scripts/qa.mjs          QA-Checks nach dem Build
scripts/generate-assets.mjs  OG-Bilder + PDF neu erzeugen
```

---

## 3. Inhalte pflegen (ohne Programmierkenntnisse)

### Kontaktdaten eintragen
Alles in **`src/config/site.ts`**. Telefon, WhatsApp, E-Mail und Adresse stehen dort auf `null` und sind deshalb überall ausgeblendet. Sobald Sie einen Wert eintragen, erscheint er automatisch in Header, Footer, Sticky-Leiste, Impressum und im Schema-Markup:

```ts
contact: {
  phone: '030 123 456 78',
  phoneE164: '+493012345678',
  whatsappE164: '4915112345678',   // ohne +
  email: 'kontakt@reinigungsbuddy.de',
},
address: { street: 'Musterstraße 1', postalCode: '10115', city: 'Berlin', lat: 52.53, lng: 13.38 },
```

Mit einer WhatsApp-Nummer erscheinen auf jeder Leistungsseite WhatsApp-Buttons mit vorformulierter Nachricht (Text im Feld `whatsappText` der jeweiligen .mdx-Datei).

### Angebot, Garantie, Schalter
In **`src/config/offer.ts`**: Texte der vier Zusagen, Garantie-Bedingungen, Ablauf, Vergleichstabelle, allgemeine FAQ und Rückmeldezeit (`response.promise`, `response.cutoff`).

Schalter unter `switches`:

| Schalter | Wirkung |
|---|---|
| `showGallery` | Vorher-Nachher-Galerie ein/aus |
| `exitIntent` | Hinweis auf das Leistungsverzeichnis beim Verlassen der Seite (nur Desktop, 1× pro Sitzung) |
| `calcomUrl` | Link zur Cal.com-Terminbuchung → erscheint auf `/angebot/` als Klick-zum-Laden |
| `googleReviewsUrl` | für ein späteres Bewertungs-Widget (Klick-zum-Laden) |

**Regel:** Nirgends Preise, Preisspannen, Stundensätze oder €/m² eintragen. Der Build prüft das automatisch.

### Leistungsseite bearbeiten
Datei in `src/content/leistungen/` öffnen. Oben (zwischen den `---`) stehen die Felder: Title, Description, H1, Direktantwort, Fakten, Leistungsumfang, FAQ. Darunter steht der Fließtext in Markdown (`## Überschrift`, `- Aufzählung`, `**fett**`, `[Linktext](/ziel/)`).

Tipp: Enthält ein Wert einen Doppelpunkt, gehört er in Anführungszeichen: `metaTitle: "Teil 1: Teil 2"`.

### Ratgeber-Artikel hinzufügen
Eine bestehende Datei in `src/content/ratgeber/` kopieren, umbenennen (Dateiname = URL) und Inhalte anpassen. `service` verweist auf die passende Leistungsseite, `cta` ist der Abschluss-Kasten.

### Kundenstimmen (nur echte!)
`src/content/stimmen/_vorlage.md` kopieren, ohne Unterstrich benennen, ausfüllen. Nur mit schriftlicher Einwilligung der Person. `consent: true` ist Pflicht. Sobald eine Datei existiert, erscheint die Sektion automatisch. Erfundene Bewertungen sind rechtlich unzulässig (UWG).

---

## 4. Bilder tauschen

1. Neues Foto (Querformat, mind. 2000 px breit, JPG) nach `src/assets/images/` legen. Dateiname beschreibend, z. B. `bueroreinigung-berlin-mitte-empfang.jpg`.
2. In der jeweiligen `.mdx`-Datei `heroImage:` auf den neuen Dateinamen setzen und `heroAlt:` beschreiben (was ist zu sehen?).
3. Bei Seiten ohne .mdx (Startseite, Über uns) steht der Import oben in der Datei in `src/pages/…`, z. B. `import heroImg from '~/assets/images/….jpg'`.
4. Altes Stockfoto löschen und aus `CREDITS.md` entfernen.

Alle Stockbilder sind im HTML mit `<!-- STOCK: später durch eigenes Foto ersetzen -->` markiert.

**Inhaber-Block** („Ich bin …“): derzeit ausgeblendet. Die Komponente `src/components/sections/OwnerBlock.astro` existiert weiter. Zum Wiedereinblenden auf den Seiten einbinden und in `site.ts` bei `owner.photo` ein Foto hinterlegen.

**Vorher-Nachher:** siehe [FOTO-ANLEITUNG.md](FOTO-ANLEITUNG.md).

---

## 5. Anfrageformular

Das Formular schickt die Anfrage an einen kleinen Server im selben Container (`server/server.mjs`, nginx leitet `/api/` dorthin weiter). Der Server

1. prüft die Angaben (Pflichtfelder, Honeypot, Mindest-Ausfüllzeit, höchstens 5 Anfragen pro 10 Minuten und IP),
2. **speichert jede Anfrage zuerst** in `/data/anfragen.jsonl` (so geht keine Anfrage verloren, auch wenn der E-Mail-Versand hakt),
3. schickt sie per E-Mail an `LEAD_TO` (Antworten gehen direkt an die Kundin bzw. den Kunden) und eine Eingangsbestätigung an die Kundin bzw. den Kunden,
4. leitet auf `/angebot/danke/?id=<Anfrage-Nr.>` weiter.

Ohne JavaScript funktioniert das Formular als normales HTML-Formular mit derselben Weiterleitung.

### Umgebungsvariablen (Coolify → *Environment Variables*, **ohne** Haken „Build Variable")

| Variable | Pflicht | Beispiel / Bedeutung |
|---|---|---|
| `SMTP_HOST` | ja | `smtp.office365.com` |
| `SMTP_PORT` | | `587` (Standard) |
| `SMTP_USER` | ja | `mert@reinigungs-buddy.de` |
| `SMTP_PASS` | ja | Passwort bzw. App-Passwort des Postfachs |
| `SMTP_FROM` | | Absender, Standard = `SMTP_USER` |
| `LEAD_TO` | | Empfänger der Anfragen, Standard `mert@reinigungs-buddy.de` |
| `AUTO_REPLY` | | `0` schaltet die Eingangsbestätigung an Kunden ab |
| `ADMIN_PASSWORD` | empfohlen | schaltet die Übersicht `https://reinigungs-buddy.de/api/anfragen` frei (Benutzername beliebig, CSV-Export) |
| `LEAD_WEBHOOK_URL` | | optional zusätzlich an n8n/Make/Zapier senden (JSON) |

**Persistent Storage:** In Coolify unter *Persistent Storage* ein Volume auf **`/data`** anlegen. Sonst ist die Anfragen-Datei nach jedem Deployment leer (die E-Mails kommen trotzdem an).

**Microsoft 365 (Exchange Online) als SMTP:** Im Microsoft 365 Admin Center → *Benutzer* → `mert@…` → *E-Mail* → *E-Mail-Apps verwalten* → **„Authentifiziertes SMTP"** aktivieren. Ist in der Organisation „Sicherheitsstandards" (Security Defaults) aktiv, blockiert Microsoft SMTP mit Passwort. Dann entweder Security Defaults ausschalten und MFA per Richtlinie regeln, oder einen SMTP-Dienst wie **Brevo** (EU, kostenloser Tarif) nutzen: `SMTP_HOST=smtp-relay.brevo.com`, `SMTP_PORT=587`, Zugangsdaten aus Brevo, Absender-Domain dort bestätigen. Bei einem anderen Dienst als Microsoft 365 die Datenschutzerklärung (Abschnitt 7) anpassen.

**Prüfen nach dem Deployment:**
- `https://reinigungs-buddy.de/api/health` zeigt `"mail":true,"store":true`.
- Im Coolify-Log steht „SMTP-Verbindung ok". Steht dort „WARNUNG SMTP", stimmen Zugangsdaten oder SMTP-Freigabe nicht.
- Eine Testanfrage abschicken: E-Mail an `LEAD_TO`, Bestätigung an die eingegebene Adresse, Eintrag unter `/api/anfragen`.

Gespeicherte Felder: Objektart, Fläche, Häufigkeit, Bezirk, Name, Firma, E-Mail, Telefon, Nachricht, Seite, Leistung (bei Landingpages), Sprache sowie bei Anzeigen-Klicks `gclid`/`gbraid`/`wbraid` und `utm_*`. Die IP-Adresse wird nicht gespeichert. Anfragen, aus denen kein Auftrag wird, nach spätestens 6 Monaten aus `/data/anfragen.jsonl` löschen (siehe Datenschutzerklärung).

---

## 6. Tracking, Google Ads & Einwilligung

In `site.ts` → `analytics`:

| Feld | Wirkung |
|---|---|
| `plausibleDomain` | Plausible (cookielos, ohne Banner) wird geladen |
| `googleAdsId`, `googleAdsLabel` | Google Ads Conversion-Tracking. Consent-Banner erscheint, gtag lädt **erst nach Zustimmung** |
| `metaPixelId`, `ga4Id` | Consent-Banner erscheint. Pixel bzw. GA4 laden **erst nach Zustimmung** (Google Consent Mode v2 voreingestellt auf „denied") |

Ohne Werte wird nichts geladen und kein Banner gezeigt. Die Einrichtung in Google Ads steht Schritt für Schritt in **[GOOGLE-ADS.md](GOOGLE-ADS.md)**.

Conversion-Events (an Plausible immer, an Google/Meta nur nach Einwilligung):

| Event | Auslöser | Google Ads / Meta |
|---|---|---|
| `lead_form_submit` | Anfrage vom Server **bestätigt** (nicht beim Klick) | Conversion mit Anfrage-Nr. als `transaction_id` + erweiterte Conversions · Meta „Lead" |
| `form_start` | erste Eingabe im Formular | |
| `form_step` | Schritt 2 bzw. 3 erreicht | |
| `form_error` | Versand fehlgeschlagen | |
| `phone_click` | Klick auf Telefonnummer | Meta „Contact" |
| `whatsapp_click` | Klick auf WhatsApp-Link | Meta „Contact" |

**Debug:** `?debug=1` an eine URL hängen. Alle Events erscheinen dann in der Browser-Konsole (gilt für die ganze Sitzung).

---

## 7. Deployment

Die Domain wird über die Build-Variable `SITE_URL` gesetzt (Canonicals, Sitemap, hreflang). Ohne Wert gilt `https://reinigungs-buddy.de`.

### Coolify (eigener Server)
Das Repo enthält ein `Dockerfile`: Node 22 baut die Seite, im fertigen Container laufen nginx (Website) und der Anfrage-Server (`/api/`).

1. In Coolify die Anwendung auf **Build Pack: Dockerfile** stellen, *Ports Exposes* **80**.
2. *Environment Variables*: `SITE_URL=https://reinigungs-buddy.de` mit Haken **„Build Variable"**, dazu die SMTP-Variablen aus Abschnitt 5 (ohne Haken).
3. *Persistent Storage*: Volume auf `/data`.
4. Unter *Domains* `https://reinigungs-buddy.de,https://www.reinigungs-buddy.de` eintragen, *Direction* auf „Redirect to non-www".
5. Deploy. `npm run build` inkl. QA-Checks läuft im Container. Schlägt ein Check fehl, bricht das Deployment mit Hinweis im Log ab.

Nixpacks funktioniert **nicht** zuverlässig: Es installiert Node 22.11, Astro 7 braucht ≥ 22.12.

nginx liefert die eigene 404-Seite aus, leitet `/pfad` per 301 auf `/pfad/` um, cached `/_astro/` und `/fonts/` ein Jahr (Dateinamen enthalten Hashes) und setzt Basis-Sicherheitsheader. Der Health-Check des Containers prüft `/api/health`.

Rein statische Hoster (Cloudflare Pages, Netlify, Webspace) funktionieren nur noch ohne Formular-Versand. Für das Formular wird der Container gebraucht.

---

## 8. OG-Bilder und PDF neu erzeugen

```bash
npm run build:only
npx astro preview &      # Port 4321
npm run assets           # erzeugt public/og/*.png und public/downloads/…vorlage.pdf
npm run build            # neu bauen, damit die Dateien in dist/ landen
```

Benötigt Chromium für Playwright (`npx playwright install chromium` oder `CHROMIUM_PATH`).

---

## 9. Weitere Dokumente

- [PLAN.md](PLAN.md): Konzept, Sitemap, Keyword-Mapping, Designsystem
- [QA.md](QA.md): Prüfergebnisse und offene Platzhalter
- [GOOGLE-ADS.md](GOOGLE-ADS.md): Landingpages, Conversion-Tracking und Kampagnen-Start
- [SEO-CHECKLISTE.md](SEO-CHECKLISTE.md): alles außerhalb der Website (Google-Profil, Verzeichnisse, Bewertungen)
- [FOTO-ANLEITUNG.md](FOTO-ANLEITUNG.md): eigene Vorher-Nachher-Fotos
- [CREDITS.md](CREDITS.md): Bildnachweise und Lizenzen
