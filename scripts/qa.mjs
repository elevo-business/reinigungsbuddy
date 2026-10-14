/**
 * QA-Checks auf dem fertigen Build (dist/). Läuft automatisch nach `npm run build`.
 *
 *  1. Genau eine <h1> pro Seite
 *  2. Title ≤ 60 und Description ≤ 155 Zeichen, keine Duplikate (indexierbare Seiten)
 *  3. Canonical vorhanden und = eigene URL
 *  4. Interne Links zeigen auf existierende Seiten/Dateien
 *  5. Alle <img> haben ein alt-Attribut
 *  6. hreflang-Paare sind gegenseitig
 *  7. Preis-Check: kein €, Euro, EUR, pro m², /m², Stundensatz, priceRange
 *  8. Floskel-Check (Anti-Generik-Liste aus dem Briefing)
 *  9. JSON-LD ist gültiges JSON, ohne Review/AggregateRating/priceRange/offers
 * 10. Report: offene Platzhalter je Seite (kein Fehler, nur Liste)
 *
 * Exit-Code 1 bei Fehlern (Punkte 1–9).
 */
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.cwd(), 'dist');
const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.html')) files.push(p);
  }
})(dist);

const errors = [];
const warn = [];
const placeholders = {};
const titles = new Map();
const descs = new Map();
const hreflangs = {};
const urlOf = (file) => '/' + path.relative(dist, file).replace(/index\.html$/, '').replace(/\\/g, '/');
const text = (html) => html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ');
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const PRICE = [/€/, /\bEuro\b/i, /\bEUR\b/, /pro\s*m²/i, /\/\s*m²/, /Stundensatz/i, /priceRange/];
const FLOSKELN = [/Willkommen bei/i, /zuverlässiger Partner/i, /maßgeschneidert/i, /höchste Qualität/i, /Wir sind stolz/i, /in der heutigen Zeit/i, /höchsten Hygienestandards/i];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  const url = urlOf(file);
  const isNoindex = /<meta name="robots" content="noindex/.test(html);
  const isTemplate = url.startsWith('/leistungsverzeichnis/vorlage');

  // 1. H1
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${url}: ${h1} × <h1>`);

  // 2. Title/Description
  const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '');
  const desc = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  if (!isTemplate) {
    if (!title) errors.push(`${url}: kein <title>`);
    if (!desc) errors.push(`${url}: keine Description`);
    if (title.length > 60) errors.push(`${url}: Title ${title.length} Zeichen („${title}")`);
    if (desc.length > 155) errors.push(`${url}: Description ${desc.length} Zeichen`);
    if (!isNoindex) {
      if (titles.has(title)) errors.push(`Doppelter Title: ${url} und ${titles.get(title)}`);
      if (descs.has(desc)) errors.push(`Doppelte Description: ${url} und ${descs.get(desc)}`);
      titles.set(title, url);
      descs.set(desc, url);
    }
    // 3. Canonical
    const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (!canon) errors.push(`${url}: kein Canonical`);
    else if (new URL(canon).pathname !== url && url !== '/404.html') errors.push(`${url}: Canonical zeigt auf ${canon}`);
  }

  // 4. Interne Links
  for (const m of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    let href = decode(m[1]);
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    href = href.split('#')[0].split('?')[0];
    if (!href) continue;
    const target = path.join(dist, href);
    const ok = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')));
    if (!ok) errors.push(`${url}: toter Link → ${href}`);
    if (!href.includes('.') && !href.endsWith('/')) warn.push(`${url}: Link ohne Trailing Slash → ${href}`);
  }

  // 5. Alt-Texte
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) errors.push(`${url}: <img> ohne alt`);
  }

  // 6. hreflang sammeln
  const alts = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], new URL(m[2]).pathname]);
  if (alts.length) hreflangs[url] = Object.fromEntries(alts);

  // 7. Preise (sichtbarer Text, Attribute und JSON-LD)
  const visible = text(html);
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const metaAttrs = [...html.matchAll(/content="([^"]*)"/g)].map((m) => m[1]).join(' ');
  for (const re of PRICE) {
    if (re.test(visible) || re.test(ld.join(' ')) || re.test(metaAttrs)) errors.push(`${url}: Preisangabe gefunden (${re})`);
  }

  // 8. Floskeln
  for (const re of FLOSKELN) if (re.test(visible)) errors.push(`${url}: Floskel gefunden (${re})`);

  // 9. JSON-LD
  for (const block of ld) {
    try {
      const data = JSON.parse(block);
      const s = JSON.stringify(data);
      for (const bad of ['"Review"', '"AggregateRating"', '"priceRange"', '"offers"', 'PLATZHALTER']) {
        if (s.includes(bad)) errors.push(`${url}: JSON-LD enthält ${bad}`);
      }
      if (!data['@context'] || !data['@type']) errors.push(`${url}: JSON-LD ohne @context/@type`);
    } catch (e) {
      errors.push(`${url}: ungültiges JSON-LD (${e.message})`);
    }
  }

  // 10. Platzhalter
  const ph = [...visible.matchAll(/\[Platzhalter:([^\]]*)\]/gi)].map((m) => m[1].trim());
  if (ph.length) placeholders[url] = [...new Set(ph)];
}

// 6. hreflang gegenseitig
for (const [url, map] of Object.entries(hreflangs)) {
  for (const [lang, target] of Object.entries(map)) {
    if (lang === 'x-default') continue;
    const back = hreflangs[target];
    if (!back) errors.push(`hreflang: ${url} → ${target} (${lang}), aber Zielseite hat keine hreflang-Tags`);
    else if (!Object.values(back).includes(url)) errors.push(`hreflang: ${target} verweist nicht zurück auf ${url}`);
  }
}

const pages = files.length;
console.log(`\nQA – ${pages} HTML-Seiten geprüft`);
console.log(`hreflang-Seiten: ${Object.keys(hreflangs).length}`);
if (warn.length) console.log(`\nHinweise (${warn.length}):\n  ` + [...new Set(warn)].join('\n  '));
const phCount = Object.values(placeholders).flat().length;
console.log(`\nOffene Platzhalter (${phCount}):`);
for (const [u, list] of Object.entries(placeholders)) console.log(`  ${u}\n    - ${list.join('\n    - ')}`);
if (errors.length) {
  console.log(`\n✗ ${errors.length} Fehler:\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('\n✓ Alle Checks bestanden (H1, Titles, Descriptions, Canonicals, Links, Alt-Texte, hreflang, Preise, Floskeln, JSON-LD).');
