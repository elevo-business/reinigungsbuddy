/**
 * Conversion-Events – eine Funktion für alle Tools.
 *
 *  lead_form_submit      Anfrageformular abgeschickt
 *  phone_click           Klick auf eine Telefonnummer
 *  whatsapp_click        Klick auf einen WhatsApp-Link
 *  configurator_complete Bedarfs-Konfigurator bis zur Zusammenfassung ausgefüllt
 *  lead_magnet_optin     Leistungsverzeichnis angefordert
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

export function initTracking() {
  window.rbTrack = track;
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-track]');
    if (el) track(el.dataset.track!, { label: (el.textContent || '').trim().slice(0, 40) });
  });
}
