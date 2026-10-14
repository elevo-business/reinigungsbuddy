import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import fs from 'node:fs';

/**
 * glob-Loader, der bei leerem Ordner still bleibt (statt Build-Warnung).
 * Wichtig für „stimmen": Die Sammlung ist absichtlich leer, bis echte Kundenstimmen vorliegen.
 */
function optionalGlob(pattern: string, base: string, ext: RegExp) {
  const has = fs.existsSync(base) && fs.readdirSync(base).some((f) => ext.test(f) && !f.startsWith('_'));
  return has ? glob({ pattern, base }) : { name: 'empty-collection', load: async () => {} };
}

const faq = z.array(z.object({ q: z.string(), a: z.string() }));

/** Leistungsseiten: je Leistung eine MDX-Datei in src/content/leistungen/ */
const leistungen = defineCollection({
  loader: glob({ pattern: '[!_]*.mdx', base: './src/content/leistungen' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      /** Kurzname für Navigation, Kacheln und Breadcrumbs */
      name: z.string(),
      keyword: z.string(),
      metaTitle: z.string().max(60),
      metaDescription: z.string().max(155),
      h1: z.string(),
      /** 2–3 Sätze direkt nach der H1: was, für wen, wo, wie zum Angebot */
      directAnswer: z.string(),
      teaser: z.string(),
      heroImage: image(),
      heroAlt: z.string(),
      serviceType: z.string(),
      /** Konfigurator-Vorauswahl (Keys aus offer.configurator.services) */
      preset: z.array(z.string()).default([]),
      /** zitierfähige Fakten-Liste */
      facts: z.array(z.object({ label: z.string(), value: z.string() })),
      included: z.array(z.object({ group: z.string(), items: z.array(z.string()) })),
      excluded: z.array(z.string()),
      faq,
      related: z.array(z.string()).default([]),
      whatsappText: z.string(),
      /** Passender Ratgeber-Artikel (slug) */
      guide: z.string().optional(),
    }),
});

/** Ratgeber-Artikel */
const ratgeber = defineCollection({
  loader: glob({ pattern: '[!_]*.mdx', base: './src/content/ratgeber' }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      keyword: z.string(),
      metaTitle: z.string().max(60),
      metaDescription: z.string().max(155),
      excerpt: z.string(),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      image: image(),
      imageAlt: z.string(),
      /** Leistungsseite (slug), auf die der Artikel zielt */
      service: z.string(),
      cta: z.object({ title: z.string(), text: z.string(), button: z.string() }),
      faq: faq.optional(),
      readingMinutes: z.number().optional(),
    }),
});

/** Vorher-Nachher-Projekte */
const projekte = defineCollection({
  loader: glob({ pattern: '[!_]*.md', base: './src/content/projekte' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      objectType: z.string(),
      district: z.string(),
      before: image(),
      after: image(),
      beforeAlt: z.string(),
      afterAlt: z.string(),
      /** true = frei lizenziertes Beispielbild, keine eigene Arbeit (wird sichtbar gekennzeichnet) */
      example: z.boolean().default(false),
      order: z.number().default(0),
    }),
});

/** Echte Kundenstimmen (nur mit Einwilligung!). Komponente bleibt unsichtbar, solange leer. */
const stimmen = defineCollection({
  loader: optionalGlob('[!_]*.md', './src/content/stimmen', /\.md$/),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    company: z.string().optional(),
    district: z.string().optional(),
    quote: z.string(),
    date: z.coerce.date(),
    consent: z.literal(true),
  }),
});

export const collections = { leistungen, ratgeber, projekte, stimmen };
