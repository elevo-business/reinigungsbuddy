/**
 * Erzeugt statische Assets, die committet werden:
 *  - public/og/*.png        Open-Graph-Bilder (1200×630) je Haupttemplate
 *  - public/downloads/leistungsverzeichnis-bueroreinigung-vorlage.pdf
 *
 * Voraussetzung: `npm run build:only` und `npx astro preview` laufen (Port 4321),
 * Chromium für Playwright installiert (PLAYWRIGHT_BROWSERS_PATH oder CHROMIUM_PATH).
 * Aufruf: npm run assets
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const base = process.env.PREVIEW_URL || 'http://localhost:4321';
const exe = process.env.CHROMIUM_PATH || (fs.existsSync('/opt/pw-browsers/chromium-1194/chrome-linux/chrome') ? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' : undefined);
const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(root, 'public/fonts', f)).toString('base64');

const og = [
  { file: 'home', kicker: 'Gebäudereinigung Berlin', title: 'Festpreis in 24 h. Reinigungs&shy;protokoll. Garantie.' },
  { file: 'leistung', kicker: 'Büroreinigung Berlin', title: 'Ein Ansprechpartner für alles, was sauber sein muss.' },
  { file: 'ratgeber', kicker: 'Ratgeber Büroreinigung', title: 'Wissen, bevor Sie Angebote vergleichen.' },
  { file: 'en', kicker: 'Office cleaning Berlin', title: 'Fixed quote in 24 h. Cleaning report. Guarantee.' },
];

const signet = '<svg viewBox="200 270 700 540" xmlns="http://www.w3.org/2000/svg"><path d="M268 628C335 705 403 742 470 742C568 742 664 663 758 510" fill="none" stroke="#4FC79C" stroke-width="106" stroke-linecap="round"/><circle cx="805" cy="348" r="58" fill="#4FC79C"/></svg>';
const tpl = (o) => `<!doctype html><html><head><style>
@font-face{font-family:G;src:url(${font('GeneralSans-Semibold.woff2')})}
@font-face{font-family:S;src:url(${font('Switzer-Medium.woff2')})}
*{margin:0;box-sizing:border-box}body{width:1200px;height:630px;background:#0F2E23;color:#F4F3EF;font-family:S;position:relative;overflow:hidden}
.w{position:absolute;inset:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.k{font-size:24px;letter-spacing:.08em;text-transform:uppercase;color:#A9C2B7}
h1{font-family:G;font-weight:600;font-size:84px;line-height:.98;letter-spacing:-.035em;max-width:960px}
.b{display:flex;align-items:center;gap:16px;font-family:G;font-size:34px;letter-spacing:-.03em}.b svg{height:40px}
.big{position:absolute;right:-80px;bottom:-120px;height:520px;opacity:.12}
</style></head><body><div class="big">${signet}</div><div class="w"><p class="k">${o.kicker}</p><h1>${o.title}</h1><div class="b">${signet}<span>Reinigungsbuddy</span></div></div></body></html>`;

const browser = await chromium.launch({ executablePath: exe });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
fs.mkdirSync(path.join(root, 'public/og'), { recursive: true });
for (const o of og) {
  await page.setContent(tpl(o), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(root, `public/og/${o.file}.png`) });
  console.log('og', o.file);
}
fs.mkdirSync(path.join(root, 'public/downloads'), { recursive: true });
const pdfPage = await browser.newPage();
await pdfPage.goto(`${base}/leistungsverzeichnis/vorlage/`, { waitUntil: 'networkidle' });
await pdfPage.evaluate(() => document.fonts.ready);
await pdfPage.pdf({ path: path.join(root, 'public/downloads/leistungsverzeichnis-bueroreinigung-vorlage.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
console.log('pdf ok');
await browser.close();
