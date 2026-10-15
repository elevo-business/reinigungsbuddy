/**
 * Gemeinsamer Versand für Kurz- und Mehrschritt-Formular.
 * POST an /api/anfrage (Anfrage-Server, siehe server/server.mjs) → Weiterleitung auf die Danke-Seite.
 * Die Google-Ads-Conversion feuert erst dort (fireLeadConversion in track.ts).
 */
import { track, attribution } from './track';

/** Flächenangabe, die nicht zur Zielgruppe (Büros ab 100 m²) passt */
export const SMALL_AREA = 'bis 100 m²';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Bezirk aus ?bezirk=… übernehmen (nur bekannte Werte aus #rb-cfg, siehe src/lib/bezirke.ts) */
export function bezirkFromUrl(): { name: string; district: string } | null {
  const key = new URLSearchParams(location.search).get('bezirk')?.toLowerCase().trim();
  if (!key) return null;
  try {
    const map: Record<string, [string, string]> = JSON.parse(document.getElementById('rb-cfg')?.textContent || '{}').bezirke || {};
    const hit = map[key];
    return hit ? { name: hit[0], district: hit[1] } : null;
  } catch {
    return null;
  }
}

export async function sendLead(form: HTMLFormElement, ui: { submit: HTMLButtonElement; label: HTMLElement; sending: string; fail: HTMLElement; tooMany: HTMLElement; thanks: string }) {
  const fd = new FormData(form);
  const data: Record<string, string> = {};
  fd.forEach((v, k) => { data[k] = String(v).trim(); });
  Object.assign(data, attribution());
  if (!data.bezirk) {
    const b = bezirkFromUrl();
    if (b) data.bezirk = b.district;
  }

  ui.fail.classList.add('hidden');
  ui.tooMany.classList.add('hidden');
  ui.submit.disabled = true;
  const label = ui.label.textContent;
  ui.label.textContent = ui.sending;
  try {
    const res = await fetch('/api/anfrage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.status === 429) { ui.tooMany.classList.remove('hidden'); throw new Error('429'); }
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.ok) throw new Error(String(res.status));
    const small = data.flaeche === SMALL_AREA;
    // id 'x' = vom Server als Spam erkannt → nichts zählen
    if (json.id !== 'x') {
      track('lead_form_submit', { objektart: data.objektart || '', flaeche: data.flaeche || '', qualifiziert: !small });
      if (window.rbConsent) {
        try { sessionStorage.setItem('rb-lead', JSON.stringify({ id: json.id, email: data.email, phone: data.telefon, small })); } catch { /* egal */ }
      }
    }
    location.href = `${ui.thanks}?id=${encodeURIComponent(json.id)}`;
  } catch (err) {
    ui.submit.disabled = false;
    ui.label.textContent = label;
    if ((err as Error).message !== '429') ui.fail.classList.remove('hidden');
    track('form_error', { status: (err as Error).message });
  }
}
