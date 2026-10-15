import { site } from '~/config/site';

/** ä → ae usw., Leerzeichen → Bindestrich */
export const slugify = (s: string) =>
  s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/\s+/g, '-');

/**
 * Zuordnung für ?bezirk=… → [Anzeigename, Bezirk].
 * Akzeptiert Bezirke (charlottenburg-wilmersdorf), deren Teile (charlottenburg, wilmersdorf)
 * und Ortsteile (prenzlauer-berg, moabit …), jeweils auch mit Umlauten (koepenick / köpenick).
 */
export function bezirkMap() {
  const map: Record<string, [string, string]> = {};
  const add = (label: string, district: string) => {
    for (const k of [slugify(label), label.toLowerCase().replace(/\s+/g, '-')]) map[k] ??= [label, district];
  };
  for (const d of site.districts) {
    add(d.name, d.name);
    d.name.split('-').forEach((part) => add(part, d.name));
    d.areas.forEach((a) => add(a, d.name));
  }
  return map;
}
