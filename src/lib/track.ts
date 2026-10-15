/**
 * Conversion-Events – eine Funktion für alle Tools.
 *
 *  lead_form_submit      Anfrageformular abgeschickt
 *  phone_click           Klick auf eine Telefonnummer
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

/**
 * Lead-Conversion nach erfolgreichem Absenden des Formulars.
 * Google Ads: Conversion mit transaction_id (= Anfrage-Nr., verhindert Doppelzählung)
 * und Enhanced Conversions (E-Mail/Telefon werden von gtag gehasht übertragen) – nur nach Einwilligung.
 * Wartet höchstens 1,2 Sekunden, damit die Weiterleitung zur Danke-Seite nie hängt.
 */
export function trackLead(lead: { id: string; email: string; phone?: string; objektart: string; bezirk: string }, cfg: { adsId?: string; adsLabel?: string }) {
  track('lead_form_submit', { objektart: lead.objektart, bezirk: lead.bezirk });
  return new Promise<void>((resolve) => {
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(); } };
    setTimeout(finish, 1200);
    if (!window.rbConsent || !window.gtag) return finish();
    window.gtag('event', 'generate_lead', { lead_source: 'website_form' });
    if (cfg.adsId && cfg.adsLabel) {
      const phone = (lead.phone || '').replace(/[^\d+]/g, '');
      const user: Record<string, string> = { email: lead.email.trim().toLowerCase() };
      if (/^\+\d{8,}$/.test(phone)) user.phone_number = phone;
      else if (/^0\d{6,}$/.test(phone)) user.phone_number = '+49' + phone.slice(1);
      window.gtag('set', 'user_data', user);
      window.gtag('event', 'conversion', { send_to: `${cfg.adsId}/${cfg.adsLabel}`, transaction_id: lead.id, event_callback: finish });
    } else finish();
  });
}

/** Kampagnen-Herkunft: aus der aktuellen URL, sonst aus der Sitzung (nur nach Einwilligung gespeichert) */
export function attribution(): Record<string, string> {
  const keys = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  const q = new URLSearchParams(location.search);
  const out: Record<string, string> = {};
  keys.forEach((k) => { const v = q.get(k); if (v) out[k] = v; });
  if (Object.keys(out).length) return out;
  try { return JSON.parse(sessionStorage.getItem('rb-attr') || '{}'); } catch { return {}; }
}

export function initTracking() {
  window.rbTrack = track;
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (el) track(el.dataset.track!, { label: (el.textContent || '').trim().slice(0, 40) });
  });
}
