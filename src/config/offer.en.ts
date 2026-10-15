/**
 * English copy of the offer (mirrors offer.ts). Keep both files in sync.
 * No prices, rates or €/m² figures.
 */
export const offerEn = {
  pillars: [
    { key: 'festpreis', title: 'A price that stays fixed', text: 'After a free on-site visit you receive a written quote within 24 hours. The price is the price. No surcharges, no surprises on the invoice.', icon: 'tag' },
    { key: 'ansprechpartner', title: 'One contact person', text: 'One person who knows your premises and is easy to reach. No hotline, no queue, no handovers.', icon: 'person' },
    { key: 'protokoll', title: 'You see what was done', text: 'After every visit you get a short cleaning report, so you know what was done without checking yourself.', icon: 'document' },
    { key: 'garantie', title: 'Re-clean within 24 hours', text: 'If something isn’t right, just send a short message. We re-clean within 24 hours (working days) free of charge. If we can’t, we don’t charge for that visit.', icon: 'shield' },
  ],
  problems: [
    { title: 'It gets cleaned, but not clean.', text: 'The bins are empty, but the coffee rings on the meeting table have been there for weeks. Nobody feels responsible.' },
    { title: 'Nobody picks up the phone.', text: 'With big providers, complaints end up in a hotline. By the time someone reacts, the week is over.' },
    { title: 'Checking costs your time.', text: 'Office managers walk through the rooms in the evening, write lists and chase the cleaning company. That’s not their job.' },
  ],
  process: [
    { title: 'Send an enquiry', text: 'The form takes about two minutes. We get back to you on the same working day.' },
    { title: 'Site visit', text: 'We visit for free and note rooms, times and requirements. Within 24 hours you have your fixed-price quote.' },
    { title: 'Get started', text: 'You confirm, we take over the keys against a signed record and start on your preferred date.' },
  ],
  comparison: [
    { topic: 'Quote', typical: '“Price on request”, often after weeks', us: 'Fixed quote within 24 h after a site visit' },
    { topic: 'Contact', typical: 'Hotline or changing site managers', us: 'One fixed contact, directly reachable' },
    { topic: 'Proof', typical: 'None – you check yourself', us: 'Cleaning report after every visit' },
    { topic: 'Complaints', typical: '“We’ll look into it”', us: 'Re-clean within 24 h, or you don’t pay for the visit' },
    { topic: 'Scope', typical: 'Generic “office cleaning”', us: 'Written specification: what, where, how often' },
  ],
  guarantee: {
    name: 'Re-clean guarantee',
    short: 'If something isn’t clean, we re-clean within 24 hours (working days) free of charge. If we can’t, we don’t charge for that visit.',
    conditions: [
      'The guarantee covers all services listed in the agreed cleaning specification.',
      'Report the issue within 24 hours after the visit, ideally via WhatsApp or email with a photo.',
      'The 24-hour window starts with your report and only runs on working days (Monday to Friday, excluding public holidays in Berlin).',
      'If we miss the window, the visit concerned is not charged.',
    ],
  },
  faq: [
    { q: 'How is the fixed price calculated?', a: 'We look at your premises during an on-site visit and record floor area, floor types, number of washrooms, glass, frequency and time window. This becomes a cleaning specification with a fixed price for exactly those services. If something changes later, we update the quote in writing before anything changes on the invoice.' },
    { q: 'Do you speak English?', a: 'Yes. Quotes, cleaning specifications and day-to-day communication are available in English.' },
    { q: 'Do we need to be in the office during cleaning?', a: 'No. Most clients give us a key or fob and we clean before or after working hours. The cleaning report shows you what was done.' },
    { q: 'How does key handover work?', a: 'Keys, fobs or codes are handed over in person against a signed handover record. Keys are never labelled with your address. When the contract ends, everything is returned against receipt.' },
    { q: 'Which districts do you cover?', a: 'All 12 Berlin districts, from Spandau to Marzahn-Hellersdorf and from Reinickendorf to Treptow-Köpenick. Site visits are free everywhere in Berlin.' },
  ],
} as const;
