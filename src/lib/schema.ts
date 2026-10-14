import { site } from '~/config/site';

/** Absolute URL zur aktuellen Domain */
export function abs(path: string, base: URL | string): string {
  return new URL(path, base).toString();
}

export function businessId(base: URL | string) {
  return abs('/#business', base);
}

/** Berlin + alle 12 Bezirke als Place-Liste für areaServed */
export function areaServed() {
  return [
    { '@type': 'City', name: 'Berlin', sameAs: 'https://www.wikidata.org/wiki/Q64' },
    ...site.districts.map((d) => ({
      '@type': 'Place',
      name: `Berlin-${d.name}`,
      containedInPlace: { '@type': 'City', name: 'Berlin' },
    })),
    ...site.surroundings.map((name) => ({ '@type': 'Place', name })),
  ];
}

const dayMap: Record<string, string> = {
  Mo: 'Monday', Di: 'Tuesday', Mi: 'Wednesday', Do: 'Thursday', Fr: 'Friday', Sa: 'Saturday', So: 'Sunday',
};

export function localBusiness(base: URL | string) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': businessId(base),
    name: site.name,
    description:
      'Gebäudereinigung und Büroreinigung in Berlin: Festpreis-Angebot in 24 Stunden, monatlich kündbar, Foto-Protokoll nach jedem Einsatz.',
    url: abs('/', base),
    logo: abs('/brand/reinigungsbuddy-signet.png', base),
    image: abs('/og/home.png', base),
    areaServed: areaServed(),
    knowsLanguage: ['de', 'en'],
    founder: { '@type': 'Person', name: site.owner.firstName },
  };
  if (site.contact.phoneE164) data.telephone = site.contact.phoneE164;
  if (site.contact.email) data.email = site.contact.email;
  if (site.address) {
    data.address = {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: 'DE',
    };
    data.geo = { '@type': 'GeoCoordinates', latitude: site.address.lat, longitude: site.address.lng };
  }
  if (site.hours.length) {
    data.openingHoursSpecification = site.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => dayMap[d] ?? d),
      opens: h.opens,
      closes: h.closes,
    }));
  }
  if (site.sameAs.length) data.sameAs = site.sameAs;
  return data;
}

export function website(base: URL | string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs('/#website', base),
    url: abs('/', base),
    name: site.name,
    inLanguage: ['de-DE', 'en'],
    publisher: { '@id': businessId(base) },
  };
}

export function service(opts: { name: string; serviceType: string; description: string; url: string; base: URL | string; lang?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${opts.url}#service`,
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    url: opts.url,
    provider: { '@id': businessId(opts.base) },
    areaServed: areaServed(),
  };
}

export function faqPage(items: { q: string; a: string }[], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: stripPlaceholders(i.a) },
    })),
  };
}

export function breadcrumbs(items: { name: string; href: string }[], base: URL | string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: abs(it.href, base),
    })),
  };
}

export function article(opts: {
  title: string; description: string; url: string; image: string; published: Date; updated?: Date; base: URL | string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${opts.url}#article`,
    headline: opts.title,
    description: opts.description,
    image: opts.image,
    datePublished: opts.published.toISOString(),
    dateModified: (opts.updated ?? opts.published).toISOString(),
    inLanguage: 'de-DE',
    mainEntityOfPage: opts.url,
    author: { '@type': 'Person', name: site.owner.firstName, jobTitle: `${site.owner.role}, ${site.name}`, url: abs('/ueber-uns/', opts.base) },
    publisher: { '@id': businessId(opts.base) },
  };
}

/** Platzhalter gehören nicht ins Schema-Markup */
export function stripPlaceholders(s: string) {
  return s.replace(/\s*\[PLATZHALTER:[^\]]*\]/g, '').trim();
}
