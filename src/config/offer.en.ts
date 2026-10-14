/**
 * English copy of the offer (mirrors offer.ts). Keep both files in sync.
 * No prices, rates or €/m² figures.
 */
export const offerEn = {
  pillars: [
    { key: 'festpreis', title: 'Fixed quote within 24 hours', text: 'After a free on-site visit you get a written fixed-price quote within 24 hours. What it says is what it costs – no surcharges that only appear on the invoice.', icon: 'tag' },
    { key: 'garantie', title: '24-hour re-clean guarantee', text: 'Something not clean? Send us a photo. We re-clean within 24 hours (working days) free of charge. If we miss that, you don’t pay for that visit.', icon: 'shield' },
    { key: 'protokoll', title: 'Cleaning report after every visit', text: 'After each clean you get a short cleaning report via WhatsApp or email: what was done and when. You see what was done without having to check yourself.', icon: 'document' },
    { key: 'ansprechpartner', title: 'One fixed contact', text: 'You talk directly to the person who plans and cleans. No call centre, no ticket system.', icon: 'person' },
  ],
  problems: [
    { title: 'It gets cleaned, but not clean.', text: 'The bins are empty, but the coffee rings on the meeting table have been there for weeks. Nobody feels responsible.' },
    { title: 'Nobody picks up the phone.', text: 'With big providers, complaints end up in a hotline. By the time someone reacts, the week is over.' },
    { title: 'Checking costs your time.', text: 'Office managers walk through the rooms in the evening, write lists and chase the cleaning company. That’s not their job.' },
  ],
  process: [
    { title: 'Enquiry', text: 'Fill in the form – about two minutes. We reply on the same working day.' },
    { title: 'Site visit', text: 'Free, on site. We walk through the rooms and agree times, access and special requests.' },
    { title: 'Fixed quote in 24 h', text: 'Within 24 hours after the site visit you have your fixed quote with a detailed cleaning specification.' },
    { title: 'Start', text: 'Key handover with a signed record, first clean on your preferred date, cleaning report after every visit.' },
  ],
  comparison: [
    { topic: 'Quote', typical: '“Price on request”, often after weeks', us: 'Fixed quote within 24 h after a site visit' },
    { topic: 'Contact', typical: 'Hotline or changing site managers', us: 'One fixed contact, directly reachable' },
    { topic: 'Proof', typical: 'None – you check yourself', us: 'Cleaning report after every visit' },
    { topic: 'Complaints', typical: '“We’ll look into it”', us: 'Re-clean within 24 h, or you don’t pay for the visit' },
    { topic: 'Scope', typical: 'Generic “office cleaning”', us: 'Written specification: what, where, how often' },
  ],
  guarantee: {
    name: '24-hour re-clean guarantee',
    short: 'Not clean? Send a photo and we re-clean within 24 hours (working days) free of charge. If we don’t, you don’t pay for that visit.',
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
