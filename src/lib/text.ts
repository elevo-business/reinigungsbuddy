/** Wandelt [PLATZHALTER: …] in sichtbar markiertes HTML um (nur Entwurf). Text wird escaped. */
export function withPlaceholders(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc.replace(/\[PLATZHALTER:([^\]]*)\]/g, '<mark class="ph">[Platzhalter:$1]</mark>');
}

export function pad(n: number) {
  return String(n).padStart(2, '0');
}
