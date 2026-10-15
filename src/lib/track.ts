/**
 * Conversion-Events – eine Funktion für alle Tools.
 *
 *  lead_form_submit      Anfrageformular abgeschickt
 *  phone_click           Klick auf eine Telefonnummer (tel:-Link) – optional eigene Google-Ads-Conversion
 *  email_click           Klick auf eine E-Mail-Adresse (mailto:-Link) – optional eigene Google-Ads-Conversion
 *  whatsapp_click        Klick auf einen WhatsApp-Link
 *  form_start            erste Auswahl im Anfrageformular
 *  form_step             nächster Schritt im Anfrageformular erreicht
 *
 * Ziele: Plausible (cookielos, immer wenn eingebunden) und – NUR nach Einwilligung –
 * Meta Pixel (fbq) und GA4 (gtag). Debug: ?debug=1 an die URL hängen → Ausgabe in der Konsole.
 */

type Props = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (e: string, o?: { props?: Props }) => void;
    fbq?: (...a: unknown[]) => void;
    gtag?: (...a: unknown[]) => void;
    rbConsent?: boolean;
    rbTrack?: (event: string, props?: Props) => void;
  }
}

const META_EVENTS: Record<string, string> = {
  lead_form_submit: 'Lead',
  lead_magnet_optin: 'CompleteRegistration',
  phone_click: 'Contact',
  whatsapp_click: 'Contact',
  email_click: 'Contact',
};

function debugOn() {
  try {
    if (new URLSearchParams(location.search).has('debug')) sessionStorage.setItem('rb-debug', '1');
    return sessionStorage.getItem('rb-debug') === '1';
  } catch {
    return false;
  }
}

export function track(event: string, props: Props = {}) {
  const payload = { ...props, page: location.pathname };
  if (debugOn()) console.info('[track]', event, payload);
  window.plausible?.(event, { props: payload });
  if (window.rbConsent) {
    window.gtag?.('event', event, payload);
    const meta = META_EVENTS[event];
    if (meta) window.fbq?.('track', meta, payload);
    else window.fbq?.('trackCustom', event, payload);
  }
}

const ATTR_KEYS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const ATTR_COOKIE = 'rb_attr';

function readCookie(name: string) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? decodeURIComponent(m[1]) : '';
}

/**
 * Kampagnen-Herkunft (gclid, utm_*) und Einstiegsseite.
 * Aus der aktuellen URL; sonst aus dem First-Party-Cookie „rb_attr" (90 Tage, nur nach Einwilligung gesetzt).
 */
export function attribution(): Record<string, string> {
  const q = new URLSearchParams(location.search);
  const out: Record<string, string> = {};
  ATTR_KEYS.forEach((k) => { const v = q.get(k); if (v) out[k] = v.slice(0, 200); });
  if (Object.keys(out).length) return { ...out, landingpage: location.pathname };
  try { return JSON.parse(readCookie(ATTR_COOKIE) || '{}'); } catch { return {}; }
}

/** Nach Einwilligung: Kampagnen-Kennungen aus der URL für 90 Tage merken (für spätere Offline-Conversions). */
export function rememberAttribution() {
  const q = new URLSearchParams(location.search);
  if (!ATTR_KEYS.some((k) => q.get(k))) return;
  const value = encodeURIComponent(JSON.stringify(attribution()));
  document.cookie = `${ATTR_COOKIE}=${value}; Max-Age=${90 * 24 * 3600}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}

/** Telefonnummer für erweiterte Conversions ins Format +49… bringen */
function e164(phone = '') {
  const p = phone.replace(/[^\d+]/g, '');
  if (/^\+\d{8,}$/.test(p)) return p;
  if (/^00\d{8,}$/.test(p)) return '+' + p.slice(2);
  if (/^0\d{6,}$/.test(p)) return '+49' + p.slice(1);
  return '';
}

type AdsCfg = { id?: string; lead?: string; phone?: string; email?: string };
function adsCfg(): AdsCfg {
  try { return JSON.parse(document.getElementById('rb-cfg')?.textContent || '{}').ads || {}; } catch { return {}; }
}

/** Google-Ads-Conversion senden (nur mit Einwilligung und eingetragener ID) */
export function adsConversion(kind: 'lead' | 'phone' | 'email', extra: Record<string, unknown> = {}) {
  const c = adsCfg();
  const label = c[kind];
  if (!window.rbConsent || !window.gtag || !c.id || !label) return false;
  window.gtag('event', 'conversion', { send_to: `${c.id}/${label}`, ...extra });
  return true;
}

/**
 * Lead-Conversion auf der Danke-Seite.
 * Das Formular legt nach erfolgreichem Versand (und nur mit Einwilligung) Anfrage-Nr., E-Mail und Telefon
 * kurz im Sitzungsspeicher ab. Hier wird daraus die Google-Ads-Conversion mit transaction_id
 * (verhindert Doppelzählung beim Neuladen) und erweiterten Conversions (gtag hasht E-Mail/Telefon).
 * Anfragen unter 100 m² zählen nicht als Google-Ads-Conversion (nicht qualifiziert).
 */
export function fireLeadConversion() {
  let lead: { id: string; email: string; phone?: string; small?: boolean } | null = null;
  try {
    lead = JSON.parse(sessionStorage.getItem('rb-lead') || 'null');
    sessionStorage.removeItem('rb-lead');
  } catch { /* kein Speicher */ }
  const id = new URLSearchParams(location.search).get('id');
  if (!lead || !id || lead.id !== id || id === 'x' || !window.rbConsent || !window.gtag) return;
  window.gtag('event', 'generate_lead', { lead_source: 'website_form', qualified: !lead.small });
  if (lead.small) return;
  const user: Record<string, string> = { email: lead.email.trim().toLowerCase() };
  const phone = e164(lead.phone);
  if (phone) user.phone_number = phone;
  window.gtag('set', 'user_data', user);
  adsConversion('lead', { transaction_id: id });
}

export function initTracking() {
  window.rbTrack = track;
  if (window.rbConsent) rememberAttribution();
  else window.addEventListener('rb:consent', rememberAttribution, { once: true });
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest<HTMLAnchorElement>('a[href^="tel:"], a[href^="mailto:"]');
    if (link) {
      const tel = link.href.startsWith('tel:');
      track(tel ? 'phone_click' : 'email_click', { label: (link.textContent || '').trim().slice(0, 40) });
      adsConversion(tel ? 'phone' : 'email');
      return;
    }
    const el = target.closest<HTMLElement>('[data-track]');
    if (el) track(el.dataset.track!, { label: (el.textContent || '').trim().slice(0, 40) });
  });
}
