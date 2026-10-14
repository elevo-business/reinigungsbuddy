/** Wandelt [PLATZHALTER: …] in sichtbar markiertes HTML um (nur Entwurf). Text wird escaped. */
export function withPlaceholders(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\[PLATZHALTER:([^\]]*)\]/g, '<mark class="ph">[Platzhalter:$1]</mark>');
}

export function pad(n: number) {
  return String(n).padStart(2, '0');
}

/**
 * Weiche Trennstellen (&shy;) in langen deutschen Komposita, damit große Headlines
 * auf schmalen Displays sauber umbrechen – unabhängig von der Silbentrennung des Browsers.
 */
const JOINTS: [RegExp, string][] = [
  [/([A-Za-zÄÖÜäöüß]{3,}?)(reinigung)/g, '$1\u00AD$2'],
  [/(Nachbesserungs)(garantie)/g, '$1\u00AD$2'],
  [/(Leistungs)(verzeichnis)/g, '$1\u00AD$2'],
  [/(Reinigungs)(firma|buddy|paket|mittel)/g, '$1\u00AD$2'],
  [/(Hygiene)(anforderungen|plan)/g, '$1\u00AD$2'],
  [/(Festpreis)(-Angebot)/g, '$1\u00AD$2'],
  [/(Montag)(morgen)/g, '$1\u00AD$2'],
  [/(Ansprech)(partner)/g, '$1\u00AD$2'],
  [/(Verbrauchs)(material)/g, '$1\u00AD$2'],
];
export function shy(s: string): string {
  return JOINTS.reduce((acc, [re, rep]) => acc.replace(re, rep), s);
}
