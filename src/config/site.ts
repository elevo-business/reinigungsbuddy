/**
 * site.ts – EINE Quelle der Wahrheit für Name, Kontakt und Einsatzgebiet.
 *
 * Alles, was hier `null` ist, wird auf der Website automatisch ausgeblendet
 * (z. B. Telefon-Button, WhatsApp-Button, Adresse im Schema-Markup).
 * Sobald du einen Wert einträgst, erscheint er überall gleichzeitig:
 * Header, Footer, Sticky-Leiste, Impressum, JSON-LD.
 *
 * Werte in [PLATZHALTER: …] sind noch offen und werden im QA-Check gelistet.
 */

export const site = {
  name: 'Reinigungsbuddy',
  legalName: 'ELEVO Solutions, Inhaber Mert Efe Celik',

  /**
   * Betreiber laut Impressum (übernommen von elevo.solutions).
   * Reinigungsbuddy ist eine Marke von ELEVO Solutions (Einzelunternehmen).
   */
  operator: {
    company: 'ELEVO Solutions',
    legalForm: 'Einzelunternehmen',
    owner: 'Mert Efe Celik',
    street: 'Ahrstraße 6',
    postalCode: '52511',
    city: 'Geilenkirchen',
    country: 'Deutschland',
    email: 'mert@reinigungs-buddy.de',
  },
  tagline: 'Gebäudereinigung in Berlin',

  /** Wird beim Deployment über SITE_URL gesetzt; hier nur als Fallback. */
  url: 'https://reinigungs-buddy.de',

  /**
   * Hierhin gehen die Anfragen aus dem Formular (über den Anfrage-Server, siehe server/server.mjs).
   * Wird nur noch als Notfall-Adresse angezeigt, falls der Versand einmal fehlschlägt.
   * Die Zieladresse für den Server selbst steht in der Umgebungsvariable LEAD_TO.
   */
  leadEmail: 'mert@reinigungs-buddy.de',

  /** Öffentlich angezeigte Kontaktdaten – vorerst ausgeblendet (null). */
  contact: {
    phone: null as string | null, // Anzeige, z. B. '030 123 456 78'
    phoneE164: null as string | null, // Für tel:-Links, z. B. '+493012345678'
    whatsappE164: null as string | null, // Ohne +, z. B. '4915112345678'
    email: null as string | null, // Öffentliche E-Mail, z. B. 'kontakt@reinigungsbuddy.de'
  },

  /** Adresse – null = Service-Area-Business (keine öffentliche Adresse). */
  address: null as null | {
    street: string;
    postalCode: string;
    city: string;
    lat: number;
    lng: number;
  },

  /** Inhaber – erscheint im Inhaber-Block und als Autor im Ratgeber. */
  owner: {
    firstName: 'Mert',
    fullName: 'Mert Efe Celik',
    role: 'Inhaber',
    /** Pfad zu deinem Foto in src/assets/images/, sobald vorhanden (z. B. 'inhaber-mert.jpg'). */
    photo: null as string | null,
  },

  /**
   * Servicezeiten (für Text + Schema). Leer = nicht im Schema.
   * Beispiel: [{ days: ['Mo','Di','Mi','Do','Fr','Sa'], opens: '06:00', closes: '21:00' }]
   */
  hours: [] as { days: string[]; opens: string; closes: string }[],
  hoursText: '[PLATZHALTER: Servicezeiten, z. B. Mo–Sa, auch früh morgens und abends]',

  /** Profile für sameAs im Schema (Google-Unternehmensprofil, Instagram, LinkedIn …). */
  sameAs: [] as string[],

  /** Rechtliches */
  vatId: 'DE364166667' as string | null,
  taxId: null as string | null,
  chamberEntry: null as string | null, // Handwerksrolle HWK Berlin
  insurance: null as string | null, // z. B. 'Betriebshaftpflicht bei XY, Deckungssumme …'

  /** Einsatzgebiet: alle 12 Berliner Bezirke mit typischen Ortsteilen. */
  districts: [
    { name: 'Mitte', slug: 'mitte', areas: ['Moabit', 'Wedding', 'Tiergarten', 'Gesundbrunnen'] },
    { name: 'Friedrichshain-Kreuzberg', slug: 'friedrichshain-kreuzberg', areas: ['Kreuzberg', 'Friedrichshain', 'Oberbaum City'] },
    { name: 'Pankow', slug: 'pankow', areas: ['Prenzlauer Berg', 'Weißensee', 'Niederschönhausen'] },
    { name: 'Charlottenburg-Wilmersdorf', slug: 'charlottenburg-wilmersdorf', areas: ['City West', 'Wilmersdorf', 'Westend', 'Halensee'] },
    { name: 'Spandau', slug: 'spandau', areas: ['Siemensstadt', 'Haselhorst', 'Wilhelmstadt'] },
    { name: 'Steglitz-Zehlendorf', slug: 'steglitz-zehlendorf', areas: ['Steglitz', 'Dahlem', 'Lichterfelde', 'Zehlendorf'] },
    { name: 'Tempelhof-Schöneberg', slug: 'tempelhof-schoeneberg', areas: ['Schöneberg', 'Tempelhof', 'Mariendorf', 'Friedenau'] },
    { name: 'Neukölln', slug: 'neukoelln', areas: ['Nord-Neukölln', 'Britz', 'Buckow', 'Rudow'] },
    { name: 'Treptow-Köpenick', slug: 'treptow-koepenick', areas: ['Adlershof', 'Johannisthal', 'Köpenick', 'Alt-Treptow'] },
    { name: 'Marzahn-Hellersdorf', slug: 'marzahn-hellersdorf', areas: ['Marzahn', 'Hellersdorf', 'Biesdorf'] },
    { name: 'Lichtenberg', slug: 'lichtenberg', areas: ['Friedrichsfelde', 'Rummelsburg', 'Hohenschönhausen'] },
    { name: 'Reinickendorf', slug: 'reinickendorf', areas: ['Tegel', 'Borsigwalde', 'Wittenau', 'Hermsdorf'] },
  ],

  /** Optional: Umland, das ebenfalls angefahren wird. Leer = nur Berlin. */
  surroundings: [] as string[],

  /** Tracking – alles optional. Ohne Werte wird nichts geladen und kein Banner gezeigt. */
  analytics: {
    /** Plausible (cookielos, kein Banner nötig). Domain wie in Plausible angelegt. */
    plausibleDomain: null as string | null,
    plausibleScript: 'https://plausible.io/js/script.js',
    /** Nur nach Einwilligung geladen: */
    metaPixelId: null as string | null,
    ga4Id: null as string | null,
    /**
     * Google Ads Conversion-Tracking (nur nach Einwilligung).
     * In Google Ads: Ziele → Conversions → Neue Conversion-Aktion → Website → manuell einrichten.
     * Dort stehen beide Werte im Event-Snippet: send_to: 'AW-123456789/AbCdEfGhIjK'
     *   googleAdsId    = 'AW-123456789'
     *   googleAdsLabel = 'AbCdEfGhIjK'
     */
    googleAdsId: null as string | null,
    googleAdsLabel: null as string | null,
    /** Optional: eigene Conversion-Aktionen für Klicks auf Telefonnummer bzw. E-Mail-Adresse (nur das Label) */
    googleAdsPhoneLabel: null as string | null,
    googleAdsEmailLabel: null as string | null,
  },
} as const;

export type Site = typeof site;
