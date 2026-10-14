import { site } from '~/config/site';

/** WhatsApp-Deeplink mit vorformulierter Nachricht – null, solange keine Nummer hinterlegt ist. */
export function whatsappLink(text: string): string | null {
  const n = site.contact.whatsappE164;
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function phoneLink(): string | null {
  return site.contact.phoneE164 ? `tel:${site.contact.phoneE164}` : null;
}

export const hasPhone = Boolean(site.contact.phoneE164);
export const hasWhatsapp = Boolean(site.contact.whatsappE164);
