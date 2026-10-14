# Reinigungsbuddy – Website

Website für Reinigungsbuddy, Gebäudereinigung in Berlin. Statische Seite mit **Astro 7** und **Tailwind CSS 4**: schnell, ohne Cookies, Inhalte in einfachen Textdateien.

> **Status: Entwurf.** Kontaktdaten, Rechtstexte, Inhaberfoto und Vorher-Nachher-Fotos sind noch Platzhalter. Die vollständige Liste steht in [QA.md](QA.md#offene-platzhalter).

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
In **`src/config/offer.ts`**: Texte der sechs Zusagen, Garantie-Bedingungen, Ablauf, Vergleichstabelle, allgemeine FAQ und Rückmeldezeit (`response.promise`, `response.cutoff`).

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

**Inhaberfoto:** Datei nach `src/assets/images/` legen und in `site.ts` bei `owner.photo` den Dateinamen eintragen.

**Vorher-Nachher:** siehe [FOTO-ANLEITUNG.md](FOTO-ANLEITUNG.md).

---

## 5. Anfrageformular

Standard: Beim Absenden öffnet sich das E-Mail-Programm der Besucherin oder des Besuchers mit einer fertig ausgefüllten Anfrage an **`site.leadEmail`** (derzeit `hey@elevo.solutions`). Ohne JavaScript funktioniert das Formular als einfaches mailto-Formular.

*Einschränkung von mailto:* Wer kein E-Mail-Programm eingerichtet hat (häufig am Firmen-PC mit Webmail), muss die Anfrage kopieren. Das Formular bietet dafür einen Button „Anfrage kopieren". Für den Livebetrieb empfehlen wir einen echten Versand:

**Umstellung auf Webhook (Make, Zapier, n8n) oder Formspree:**
1. In Make/Zapier/n8n einen Webhook anlegen (bzw. bei Formspree ein Formular) und die URL kopieren.
2. Beim Hoster die Umgebungsvariable `PUBLIC_FORM_ENDPOINT=<URL>` setzen (lokal: `.env`, siehe `.env.example`).
3. Neu bauen. Das Formular sendet dann JSON per POST und leitet auf `/angebot/danke/` weiter.

Payload-Beispiel:
```json
{ "objektart": "Büro", "leistungen": ["Büroflächen", "Fenster & Glas"], "flaeche": "100–250 m²",
  "haeufigkeit": "2× pro Woche", "bezirk": "Mitte", "start": "so bald wie möglich",
  "name": "…", "firma": "…", "email": "…", "telefon": "…", "rueckruf": "vormittags",
  "nachricht": "…", "quelle": "/bueroreinigung-berlin/", "sprache": "de" }
```

*Hinweis:* Die Webhook-URL steht dann im JavaScript der Seite. Bei Missbrauch die URL im Tool neu erzeugen. Für eine geschützte Variante mit Meta Conversions API (Server-Token) wäre eine kleine Serverless-Funktion beim Hoster der nächste Schritt.

Spam-Schutz: Honeypot-Feld und Mindest-Ausfüllzeit, kein CAPTCHA. Formulardaten werden nicht im Browser gespeichert.

---

## 6. Tracking & Einwilligung

In `site.ts` → `analytics`:

| Feld | Wirkung |
|---|---|
| `plausibleDomain` | Plausible (cookielos, ohne Banner) wird geladen |
| `metaPixelId`, `ga4Id` | Consent-Banner erscheint. Pixel bzw. GA4 laden **erst nach Zustimmung** (Google Consent Mode v2 voreingestellt auf „denied") |

Ohne Werte wird nichts geladen und kein Banner gezeigt.

Conversion-Events (an Plausible immer, an Pixel/GA4 nur nach Einwilligung):

| Event | Auslöser | Meta-Standard-Event |
|---|---|---|
| `lead_form_submit` | Anfrageformular abgeschickt (mailto geöffnet bzw. Webhook erfolgreich) | Lead |
| `phone_click` | Klick auf Telefonnummer | Contact |
| `whatsapp_click` | Klick auf WhatsApp-Link | Contact |
| `configurator_complete` | Konfigurator bis zur Zusammenfassung | (custom) |
| `lead_magnet_optin` | Leistungsverzeichnis angefordert | CompleteRegistration |

**Debug:** `?debug=1` an eine URL hängen. Alle Events erscheinen dann in der Browser-Konsole (gilt für die ganze Sitzung).

Wichtig bei mailto: `lead_form_submit` wird beim Öffnen des E-Mail-Programms gezählt, nicht beim tatsächlichen Absenden. Mit Webhook ist die Messung exakt.

---

## 7. Deployment

Die Domain wird über die Umgebungsvariable `SITE_URL` gesetzt (Canonicals, Sitemap, hreflang). Ohne Wert gilt `https://reinigungsbuddy.de`.

### Cloudflare Pages
1. Repository in Cloudflare Pages verbinden.
2. Build command: `npm run build` · Output directory: `dist` · Umgebungsvariable `NODE_VERSION=22`, `SITE_URL=https://ihre-domain.de`, optional `PUBLIC_FORM_ENDPOINT`.
3. Eigene Domain unter *Custom domains* verbinden.

### Netlify
1. Repository in Netlify importieren.
2. Build command: `npm run build` · Publish directory: `dist` · Environment: `NODE_VERSION=22`, `SITE_URL`, optional `PUBLIC_FORM_ENDPOINT`.
3. Domain unter *Domain management* verbinden.

### Eigener Server (z. B. die vorhandene Domain)
`npm run build` lokal ausführen und den Inhalt von `dist/` per SFTP in das Webroot hochladen. Für saubere URLs muss der Server Verzeichnis-Indizes (`/leistungen/` → `/leistungen/index.html`) ausliefern, was Apache und nginx standardmäßig tun. Die 404-Seite ist `dist/404.html` (Apache: `ErrorDocument 404 /404.html`).

Trailing Slash: Alle URLs enden auf `/`. Falls der Server Aufrufe ohne Slash nicht automatisch umleitet, eine 301-Regel ergänzen.

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
- [SEO-CHECKLISTE.md](SEO-CHECKLISTE.md): alles außerhalb der Website (Google-Profil, Verzeichnisse, Bewertungen)
- [FOTO-ANLEITUNG.md](FOTO-ANLEITUNG.md): eigene Vorher-Nachher-Fotos
- [CREDITS.md](CREDITS.md): Bildnachweise und Lizenzen
