/**
 * offer.ts – Angebot, Garantie und Schalter an EINER Stelle.
 *
 * Du kannst hier Texte ändern, ohne HTML anzufassen. Regeln:
 *  - Keine Preise, Preisspannen, Stundensätze oder €/m²-Werte eintragen.
 *  - Nur versprechen, was du sicher hältst.
 */

export const offer = {
  /** Rückmeldung nach Anfrage (Danke-Seite, Formular, FAQ). */
  response: {
    promise: 'am selben Werktag',
    /** Anfragen nach dieser Uhrzeit (oder am Wochenende) beantworten wir am nächsten Werktag. */
    cutoff: '16 Uhr',
  },

  /** Festpreis-Angebot nach Objektbegehung */
  quoteHours: 24,

  /** Die Bausteine des Angebots – Reihenfolge = Reihenfolge auf der Seite. */
  pillars: [
    {
      key: 'festpreis',
      title: 'Ein Preis, der feststeht',
      text: 'Nach der kostenlosen Objektbegehung erhalten Sie innerhalb von 24 Stunden ein schriftliches Angebot. Der Preis gilt so, wie er dort steht. Ohne Zuschläge und ohne Überraschungen auf der Rechnung.',
      icon: 'tag',
    },
    {
      key: 'ansprechpartner',
      title: 'Ein Ansprechpartner',
      text: 'Sie haben eine feste Person, die Ihr Objekt kennt und erreichbar ist. Keine Hotline, keine Warteschleife, keine wechselnden Zuständigkeiten.',
      icon: 'person',
    },
    {
      key: 'protokoll',
      title: 'Sie sehen, was gemacht wurde',
      text: 'Nach jedem Einsatz erhalten Sie ein kurzes Reinigungsprotokoll. So wissen Sie Bescheid, ohne selbst kontrollieren zu müssen.',
      icon: 'document',
    },
    {
      key: 'garantie',
      title: 'Nachbesserung in 24 Stunden',
      text: 'Ist etwas nicht in Ordnung, genügt eine kurze Nachricht. Wir reinigen innerhalb von 24 Stunden (werktags) kostenlos nach. Gelingt uns das nicht, berechnen wir den Einsatz nicht.',
      icon: 'shield',
    },
  ],

  /** Garantie-Bedingungen (Seite /garantie/ + Garantie-Block). Kurz und eindeutig halten. */
  guarantee: {
    name: 'Nachbesserungsgarantie',
    short: 'Ist etwas nicht sauber, reinigen wir innerhalb von 24 Stunden (werktags) kostenlos nach. Gelingt uns das nicht, berechnen wir den Einsatz nicht.',
    conditions: [
      'Die Garantie gilt für alle Leistungen, die im vereinbarten Leistungsverzeichnis stehen.',
      'Melden Sie den Mangel innerhalb von 24 Stunden nach dem Einsatz, am einfachsten per WhatsApp oder E-Mail mit Foto.',
      'Die 24-Stunden-Frist für die Nachbesserung beginnt mit Ihrer Meldung und läuft nur an Werktagen (Montag bis Freitag, ohne gesetzliche Feiertage in Berlin).',
      'Wir brauchen innerhalb der Frist Zugang zu den betroffenen Räumen. Ist kein Zugang möglich, verlängert sich die Frist entsprechend.',
      'Reinigen wir nicht innerhalb der Frist nach, wird der betroffene Einsatz nicht berechnet. Gemeint ist der einzelne Reinigungstermin, auf den sich die Meldung bezieht.',
      'Nicht abgedeckt: Verschmutzungen, die nach dem Einsatz entstanden sind, sowie Flecken oder Schäden, die sich mit einer Unterhaltsreinigung nicht entfernen lassen (z. B. Wasserschäden, verätzte Oberflächen). Darauf weisen wir Sie vorab hin.',
    ],
  },

  /** Ablauf in 3 Schritten */
  process: [
    { title: 'Anfrage stellen', text: 'Das Formular dauert etwa zwei Minuten. Wir melden uns am selben Werktag bei Ihnen.' },
    { title: 'Objekt ansehen', text: 'Wir kommen kostenlos vorbei und nehmen Räume, Zeiten und Wünsche auf. Innerhalb von 24 Stunden danach haben Sie Ihr Festpreis-Angebot.' },
    { title: 'Loslegen', text: 'Sie sagen zu, wir übernehmen den Schlüssel gegen Protokoll und starten zum Wunschtermin.' },
  ],

  /** Warum Büros die Reinigungsfirma wechseln (Problem-Block) */
  problems: [
    { title: 'Es wird gereinigt, aber nicht sauber.', text: 'Papierkörbe sind leer, aber die Kaffeeflecken auf dem Besprechungstisch stehen seit Wochen. Niemand fühlt sich zuständig.' },
    { title: 'Niemand geht ans Telefon.', text: 'Bei größeren Firmen landen Reklamationen in einer Hotline. Bis jemand reagiert, ist die Woche vorbei.' },
    { title: 'Kontrolle kostet Ihre Zeit.', text: 'Office-Manager laufen abends durch die Räume, schreiben Mängellisten und telefonieren hinterher. Das ist nicht ihr Job.' },
  ],

  /** Vergleichstabelle (ohne Konkurrenten zu nennen) */
  comparison: [
    { topic: 'Angebot', typical: 'Preis „auf Anfrage", oft erst nach Wochen', us: 'Festpreis in 24 Stunden nach Objektbegehung' },
    { topic: 'Ansprechpartner', typical: 'Hotline oder wechselnde Objektleitung', us: 'Ein fester Ansprechpartner, direkt erreichbar' },
    { topic: 'Nachweis', typical: 'Keiner, Sie kontrollieren selbst', us: 'Reinigungsprotokoll nach jedem Einsatz' },
    { topic: 'Reklamation', typical: '„Wir kümmern uns darum"', us: 'Nachbesserung in 24 h, sonst zahlen Sie den Einsatz nicht' },
    { topic: 'Leistungsumfang', typical: 'Pauschal „Büroreinigung"', us: 'Schriftliches Leistungsverzeichnis: was, wo, wie oft' },
  ],

  /** Allgemeine Einwände – werden auf Leistungsseiten mit den leistungsspezifischen FAQs kombiniert. */
  commonFaq: [
    {
      q: 'Wie entsteht der Festpreis?',
      a: 'Wir sehen uns die Räume bei einer Objektbegehung vor Ort an und erfassen Fläche, Bodenbeläge, Anzahl der Sanitärräume, Glasflächen, gewünschte Häufigkeit und Zeitfenster. Daraus entsteht ein Leistungsverzeichnis und ein Festpreis, der genau diese Leistungen abdeckt. Ändert sich später etwas, etwa mehr Fläche oder ein zusätzlicher Reinigungstag, passen wir das Angebot schriftlich an, bevor sich etwas am Preis ändert.',
    },
    {
      q: 'Wie läuft die Schlüsselübergabe?',
      a: 'Schlüssel, Transponder oder Codes übergeben Sie uns persönlich gegen ein schriftliches Übergabeprotokoll. Schlüssel werden nicht mit Adresse beschriftet und nicht über Nacht im Fahrzeug gelassen. Bei Vertragsende bekommen Sie alles gegen Quittung zurück.',
    },
    {
      q: 'Was passiert, wenn bei der Reinigung etwas beschädigt wird?',
      a: 'Wir melden jeden Schaden sofort, auch kleine. Wir dokumentieren ihn mit Foto und regeln ihn über unsere Betriebshaftpflicht. [PLATZHALTER: Versicherer und Deckungssumme eintragen, sobald die Police vorliegt.]',
    },
    {
      q: 'Welche Reinigungsmittel verwenden Sie?',
      a: 'Für die Unterhaltsreinigung setzen wir materialschonende, pH-neutrale Reiniger und Mikrofasertücher mit Farbsystem ein (z. B. rot für WC, gelb für Waschbecken, blau für Büroflächen, grün für Küche), damit nichts verschleppt wird. Reinigungsmittel und Geräte bringen wir mit. Sicherheitsdatenblätter erhalten Sie auf Anfrage.',
    },
    {
      q: 'Zu welchen Zeiten wird gereinigt?',
      a: 'Wann es für Sie passt: früh morgens vor Arbeitsbeginn, abends nach Feierabend oder tagsüber, wenn das Team ohnehin im Homeoffice ist. Das Zeitfenster legen wir bei der Objektbegehung fest und halten es ein.',
    },
  ],

  /** Leistungen für den Bedarfs-Konfigurator (key = Kurzname, slug = Leistungsseite) */
  configurator: {
    services: [
      { key: 'buero', label: 'Büroflächen', hint: 'Arbeitsplätze, Böden, Papierkörbe', slug: 'bueroreinigung-berlin' },
      { key: 'sanitaer', label: 'Sanitär & Teeküche', hint: 'WCs, Waschbecken, Küche', slug: 'sanitaer-kuechenreinigung-berlin' },
      { key: 'glas', label: 'Fenster & Glas', hint: 'Fenster, Glastüren, Trennwände', slug: 'fensterreinigung-berlin' },
      { key: 'teppich', label: 'Teppich & Polster', hint: 'Teppichboden, Bürostühle', slug: 'teppichreinigung-berlin' },
      { key: 'grund', label: 'Grundreinigung', hint: 'Einmalig, gründlich, inkl. Böden', slug: 'grundreinigung-berlin' },
      { key: 'desinfektion', label: 'Desinfektion', hint: 'Kontaktflächen, Sanitär', slug: 'desinfektionsreinigung-berlin' },
      { key: 'praxis', label: 'Praxis / Kanzlei', hint: 'Empfang, Behandlungsräume', slug: 'praxisreinigung-berlin' },
      { key: 'treppenhaus', label: 'Treppenhaus & Eingang', hint: 'Stufen, Geländer, Briefkästen', slug: 'treppenhausreinigung-berlin' },
      { key: 'umzug', label: 'Endreinigung / Umzug', hint: 'Übergabe an Vermieter', slug: 'umzugsreinigung-buero-berlin' },
      { key: 'material', label: 'Verbrauchsmaterial', hint: 'Seife, Papier, Müllbeutel', slug: 'leistungen' },
    ],
    areas: ['bis 100 m²', '100–250 m²', '250–500 m²', '500–1.000 m²', 'über 1.000 m²', 'weiß ich nicht genau'],
    frequencies: ['täglich', '3× pro Woche', '2× pro Woche', '1× pro Woche', 'alle 2 Wochen', 'einmalig'],
    objectTypes: ['Büro', 'Praxis / Kanzlei', 'Treppenhaus / Wohnhaus', 'Ladenfläche / Studio', 'Coworking', 'Sonstiges'],
  },

  /** Schalter */
  switches: {
    /** Vorher-Nachher-Galerie anzeigen (Inhalte aus src/content/projekte/) */
    showGallery: false,
    /** Exit-Intent-Hinweis auf das Leistungsverzeichnis (nur Desktop, 1× pro Sitzung) */
    exitIntent: false,
    /** Cal.com-Link für Termin für die Objektbegehunge (Klick-zum-Laden). null = ausgeblendet. */
    calcomUrl: null as string | null,
    /** Link zu Ihren Google-Bewertungen. null = ausgeblendet. */
    googleReviewsUrl: null as string | null,
  },
} as const;

export type Offer = typeof offer;
