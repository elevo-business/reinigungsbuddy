/** DE ↔ EN Seitenpaare für hreflang und den Sprachumschalter. */
export const pairs: Record<string, string> = {
  '/': '/en/',
  '/bueroreinigung-berlin/': '/en/office-cleaning-berlin/',
  '/leistungen/': '/en/services/',
  '/angebot/': '/en/contact/',
};

const reverse = Object.fromEntries(Object.entries(pairs).map(([de, en]) => [en, de]));

export type Lang = 'de' | 'en';

export function alternateOf(path: string): { de?: string; en?: string } {
  if (pairs[path]) return { de: path, en: pairs[path] };
  if (reverse[path]) return { de: reverse[path], en: path };
  return {};
}

export function langOf(path: string): Lang {
  return path.startsWith('/en/') || path === '/en' ? 'en' : 'de';
}
