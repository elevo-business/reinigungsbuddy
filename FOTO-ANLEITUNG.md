# Foto-Anleitung: eigene Vorher-Nachher-Bilder

Vorher-Nachher-Bilder überzeugen nur, wenn man sofort sieht: Das ist **derselbe Raum**, nur sauber. Dafür braucht es keine Profikamera, aber Disziplin beim Fotografieren.

> **Rechtlich wichtig:** Nur eigene Fotos von eigenen Einsätzen verwenden. Fremde Vorher-Nachher-Bilder als eigene Arbeit zu zeigen, verletzt Urheberrechte und ist irreführende Werbung (UWG). Die derzeitigen Beispielbilder sind als „Beispielbild" gekennzeichnet und müssen ersetzt werden.

## 1. Vorher: Einwilligung

- **Kunde fragen, bevor fotografiert wird.** Am besten schriftlich (E-Mail oder WhatsApp genügt): „Darf ich Vorher-Nachher-Fotos dieses Raums auf meiner Website und im Google-Profil zeigen? Ohne Firmennamen, ohne Personen, ohne Dokumente."
- Keine Personen, keine Gesichter auf Fotos auf Bildschirmen, keine Dokumente, Whiteboards, Bildschirminhalte oder Firmenlogos im Bild, außer der Kunde wünscht es ausdrücklich.
- In Praxen: keine Patientendaten, keine Behandlungsräume während der Sprechzeit.

## 2. Aufnahme: so werden die Bilder vergleichbar

| Regel | Warum |
|---|---|
| **Vor Arbeitsbeginn fotografieren** | Nach dem ersten Wischen ist das Vorher-Bild weg |
| **Gleicher Standpunkt** | Füße auf eine Fliesenfuge, Türrahmen oder Tape-Markierung stellen, Position merken |
| **Gleiche Höhe** | Handy auf Brusthöhe oder auf einer festen Kante abstützen |
| **Gleiche Brennweite** | Immer die Hauptkamera (1×), kein Zoom, kein Weitwinkel (0,5×) |
| **Gleiches Licht** | Gleiche Lampen an, gleiche Jalousien-Stellung, möglichst gleiche Tageszeit |
| **Querformat** | Die Galerie zeigt 4:3-Querformat. Hochformat wird beschnitten |
| **Gerade halten** | Gitterlinien in der Kamera-App einschalten, Wandkanten senkrecht |
| **Kein Filter, kein Nachschärfen** | Sonst wirkt das Nachher-Bild bearbeitet und unglaubwürdig |

**Tipp:** Das Vorher-Foto direkt nach der Aufnahme halbtransparent als Vorlage nutzen. Manche Kamera-Apps haben eine „Overlay"- oder „Geister"-Funktion. Sonst das Vorher-Bild am zweiten Handy anzeigen und danebenhalten.

**Gute Motive:** Teeküche mit Kalk und Kaffeerändern, Teppich mit Laufstraße, Fugen im Sanitär, grauer PVC-Boden vor und nach der Grundreinigung, Glastrennwand mit Fingerabdrücken, Treppenhaus-Podest.

## 3. Dateien vorbereiten

1. Fotos auf den Rechner übertragen, Originalauflösung (mind. 2000 px breit).
2. Beschreibend benennen, ohne Umlaute und Leerzeichen:
   `grundreinigung-pvc-boden-kreuzberg-vorher.jpg`, `grundreinigung-pvc-boden-kreuzberg-nachher.jpg`
3. Beide Dateien nach `src/assets/images/` kopieren. Größe und Format optimiert der Build automatisch.

## 4. In die Galerie einpflegen

1. `src/content/projekte/_vorlage.md` kopieren und umbenennen, z. B. `grundreinigung-kreuzberg.md` (ohne Unterstrich am Anfang!).
2. Felder ausfüllen:

```yaml
---
title: Grundreinigung PVC-Boden im Agenturbüro
objectType: Büro
district: Friedrichshain-Kreuzberg
before: ../../assets/images/grundreinigung-pvc-boden-kreuzberg-vorher.jpg
after: ../../assets/images/grundreinigung-pvc-boden-kreuzberg-nachher.jpg
beforeAlt: Grauer, fleckiger PVC-Boden in einem Büroflur vor der Grundreinigung
afterAlt: Derselbe Flur mit hellem, gleichmäßig glänzendem PVC-Boden nach der Grundreinigung
example: false
order: 1
---
```

3. Die beiden Beispiel-Dateien `beispiel-schreibtisch.md` und `beispiel-grossraum.md` löschen, sobald zwei eigene Projekte vorhanden sind. Ebenso die Bilder `beispiel-*.jpg` in `src/assets/images/` und die Zeilen in `CREDITS.md`.
4. `npm run build`. Die Galerie zeigt die ersten zwei Projekte nach `order`.

Galerie vorübergehend ausblenden: in `src/config/offer.ts` `showGallery: false`.

## 5. Weitere Nutzung

Dieselben Bilderpaare (mit Einwilligung) eignen sich für Beiträge im Google-Unternehmensprofil und auf Instagram/LinkedIn, siehe SEO-CHECKLISTE.md.
