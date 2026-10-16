/**
 * Anfrage-Server für reinigungs-buddy.de
 *
 * Läuft im selben Container wie nginx (nginx leitet /api/ hierher weiter).
 *
 *  POST /api/anfrage   Anfrage annehmen (JSON per fetch oder klassisches Formular ohne JavaScript)
 *                      1. prüfen (Pflichtfelder, Honeypot, Mindest-Ausfüllzeit, Rate-Limit)
 *                      2. IMMER zuerst speichern  → DATA_DIR/anfragen.jsonl  (keine Anfrage geht verloren)
 *                      3. E-Mail an LEAD_TO (SMTP), optional Eingangsbestätigung an den Kunden
 *                      4. optional Webhook (LEAD_WEBHOOK_URL), z. B. n8n, Make, Zapier
 *  GET  /api/anfragen  Übersicht aller Anfragen (nur mit ADMIN_PASSWORD, Benutzername beliebig)
 *  GET  /api/health    Health-Check
 *
 * Umgebungsvariablen: siehe README, Abschnitt „Anfrageformular".
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const env = process.env;
// Fest auf 3000 (nginx leitet /api/ hierher). NICHT env.PORT nutzen: Coolify setzt PORT=80, das ist nginx.
const PORT = Number(env.ANFRAGE_PORT || 3000);
const DATA_DIR = env.DATA_DIR || '/data';
const FILE = path.join(DATA_DIR, 'anfragen.jsonl');
const LEAD_TO = env.LEAD_TO || 'mert@reinigungs-buddy.de';
const SMTP_FROM = env.SMTP_FROM || env.SMTP_USER || LEAD_TO;
const SITE_NAME = 'Reinigungsbuddy';
const AUTO_REPLY = env.AUTO_REPLY !== '0';
const ADMIN_PASSWORD = env.ADMIN_PASSWORD || '';
const WEBHOOK = env.LEAD_WEBHOOK_URL || '';
const THANKS = { de: '/danke/', en: '/en/contact/thanks/' };

const log = (...a) => console.log(new Date().toISOString(), ...a);

/** Datum in Berliner Zeit, z. B. „15.10.2026, 20:32" (unabhängig von der ICU-Ausstattung des Systems) */
function berlin(iso) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.day}.${parts.month}.${parts.year}, ${parts.hour}:${parts.minute}`;
}

/* ---------- E-Mail ---------- */
const mailer = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || 587),
      secure: env.SMTP_SECURE ? env.SMTP_SECURE === '1' : Number(env.SMTP_PORT) === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      requireTLS: Number(env.SMTP_PORT || 587) === 587,
    })
  : null;

/* ---------- Speicher ---------- */
let storeOk = true;
try {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.accessSync(DATA_DIR, fs.constants.W_OK);
} catch (e) {
  storeOk = false;
  log('WARNUNG: DATA_DIR nicht beschreibbar:', DATA_DIR, e.message);
}

function store(lead) {
  fs.appendFileSync(FILE, JSON.stringify(lead) + '\n', { mode: 0o600 });
}

function readAll() {
  try {
    return fs
      .readFileSync(FILE, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l) => { try { return JSON.parse(l); } catch { return null; } })
      .filter(Boolean);
  } catch {
    return [];
  }
}

/* ---------- Felder ---------- */
const FIELDS = {
  objektart: 80, flaeche: 40, haeufigkeit: 40, bezirk: 60, start: 40,
  name: 120, firma: 160, email: 160, telefon: 40, nachricht: 3000,
  leistung: 80, quelle: 200, landingpage: 200, formular: 20, sprache: 2,
  gclid: 200, gbraid: 200, wbraid: 200,
  utm_source: 100, utm_medium: 100, utm_campaign: 150, utm_term: 150, utm_content: 150,
};
// Kurzformular: Fläche, Name, E-Mail. Das Mehrschritt-Formular prüft seine weiteren Pflichtfelder im Browser.
const REQUIRED = ['flaeche', 'name', 'email'];
/** Zielgruppe der Anzeigen: Büros ab 100 m². Kleinere Flächen werden als nicht qualifiziert markiert. */
const SMALL_AREA = 'bis 100 m²';
const EMAIL_RE = /^[^\s@<>()",;]+@[^\s@<>()",;]+\.[^\s@<>()",;]{2,}$/;

function clean(raw) {
  const out = {};
  for (const [k, max] of Object.entries(FIELDS)) {
    let v = raw[k];
    if (Array.isArray(v)) v = v.join(', ');
    v = String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);
    out[k] = k === 'nachricht' ? v : v.replace(/[\r\n]+/g, ' ');
  }
  out.sprache = out.sprache === 'en' ? 'en' : 'de';
  return out;
}

/* ---------- Rate-Limit (nur im Arbeitsspeicher, IP wird nicht gespeichert) ---------- */
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 10;
}

/* ---------- Texte ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function rows(l) {
  return [
    ['Qualifiziert', l.qualifiziert ? 'ja' : 'NEIN – Fläche unter 100 m²'],
    ['Objekt', l.objektart],
    ['Leistung (Seite)', l.leistung],
    ['Fläche', l.flaeche],
    ['Häufigkeit', l.haeufigkeit],
    ['Bezirk', l.bezirk],
    ['Start', l.start],
    ['Name', l.name],
    ['Firma', l.firma],
    ['E-Mail', l.email],
    ['Telefon', l.telefon],
    ['Nachricht', l.nachricht],
    ['Sprache', l.sprache],
    ['Seite', l.quelle],
    ['Einstiegsseite', l.landingpage],
    ['Formular', l.formular === 'kurz' ? 'Kurzformular' : 'Mehrschritt'],
    ['Google Ads (gclid)', l.gclid || l.gbraid || l.wbraid],
    ['Kampagne', [l.utm_source, l.utm_medium, l.utm_campaign, l.utm_term].filter(Boolean).join(' / ')],
    ['Eingang', berlin(l.ts)],
    ['Anfrage-Nr.', l.id],
  ].filter(([, v]) => v);
}

function leadMail(l) {
  const r = rows(l);
  const subject = `${l.qualifiziert ? '' : '[unter 100 m²] '}Neue Anfrage: ${[l.firma || l.name, l.flaeche, l.objektart, l.bezirk].filter(Boolean).join(', ')}${l.gclid || l.gbraid || l.wbraid ? ' (Google Ads)' : ''}`;
  const text = r.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nAntworten: einfach auf diese E-Mail antworten (geht direkt an ${l.email}).`;
  const tel = l.telefon ? `<p style="margin:0 0 16px"><a href="tel:${esc(l.telefon.replace(/[^\d+]/g, ''))}" style="display:inline-block;background:#1a6e4f;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none">Jetzt anrufen: ${esc(l.telefon)}</a></p>` : '';
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#14211c">
<h2 style="margin:0 0 6px">Neue Anfrage über die Website</h2>
<p style="margin:0 0 16px;color:#5b655f">Versprochen: Rückmeldung am selben Werktag (nach 16 Uhr: nächster Werktag).</p>
${tel}<table cellpadding="6" style="border-collapse:collapse">${r
    .map(([k, v]) => `<tr><td style="color:#5b655f;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('')}</table></div>`;
  return { subject, text, html };
}

function confirmMail(l) {
  if (l.sprache === 'en') {
    return {
      subject: `Your enquiry at ${SITE_NAME}`,
      text: `Hello,\n\nthank you for your enquiry. We have received it and will get back to you on the same working day (enquiries after 4 pm: next working day).\n\nNext steps:\n1. We arrange a free site visit with you.\n2. Within 24 hours after the visit you receive your fixed-price quote in writing.\n\nIf you would like to add anything, simply reply to this email.\n\nKind regards\n${SITE_NAME}`,
    };
  }
  return {
    subject: `Ihre Anfrage bei ${SITE_NAME}`,
    text: `Guten Tag,\n\nvielen Dank für Ihre Anfrage. Sie ist bei uns angekommen. Wir melden uns am selben Werktag bei Ihnen (Anfragen nach 16 Uhr: am nächsten Werktag).\n\nSo geht es weiter:\n1. Wir vereinbaren mit Ihnen einen Termin für die kostenlose Objektbegehung.\n2. Innerhalb von 24 Stunden danach erhalten Sie Ihr schriftliches Festpreis-Angebot.\n\nMöchten Sie noch etwas ergänzen? Antworten Sie einfach auf diese E-Mail.\n\nViele Grüße\n${SITE_NAME}`,
  };
}

async function withRetry(fn, label) {
  for (let i = 0; i < 4; i++) {
    try { return await fn(); } catch (e) {
      log(`FEHLER ${label} (Versuch ${i + 1}):`, e.message);
      await new Promise((r) => setTimeout(r, 2000 * 2 ** i));
    }
  }
  return null;
}

async function deliver(l) {
  if (mailer) {
    const m = leadMail(l);
    await withRetry(() => mailer.sendMail({ from: `"${SITE_NAME} Website" <${SMTP_FROM}>`, to: LEAD_TO, replyTo: `"${l.name.replace(/"/g, '')}" <${l.email}>`, ...m }), `E-Mail ${l.id}`);
    if (AUTO_REPLY) {
      const c = confirmMail(l);
      await withRetry(() => mailer.sendMail({ from: `"${SITE_NAME}" <${SMTP_FROM}>`, to: l.email, replyTo: LEAD_TO, ...c }), `Bestätigung ${l.id}`);
    }
  }
  if (WEBHOOK) {
    await withRetry(async () => {
      const res = await fetch(WEBHOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(l), signal: AbortSignal.timeout(10_000) });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
    }, `Webhook ${l.id}`);
  }
}

/* ---------- HTTP ---------- */
function readBody(req, max = 32_768) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > max) { reject(new Error('too large')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parse(body, type) {
  if (type.includes('application/json')) return JSON.parse(body || '{}');
  const p = new URLSearchParams(body);
  const o = {};
  for (const k of new Set(p.keys())) { const all = p.getAll(k); o[k] = all.length > 1 ? all : all[0]; }
  return o;
}

function send(res, status, data, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers });
  res.end(JSON.stringify(data));
}

async function handleLead(req, res) {
  const type = String(req.headers['content-type'] || '');
  const isJson = type.includes('application/json');
  let raw;
  try { raw = parse(await readBody(req), type); } catch { return send(res, 400, { ok: false, error: 'bad_request' }); }

  const lang = raw.sprache === 'en' ? 'en' : 'de';
  const done = (id) => isJson ? send(res, 200, { ok: true, id }) : (res.writeHead(303, { Location: `${THANKS[lang]}?id=${id}`, 'Cache-Control': 'no-store' }), res.end());

  // Spam: Honeypot gefüllt oder zu schnell → so tun, als ob alles geklappt hätte
  const started = Number(raw.t || 0);
  if (raw.website || (started && Date.now() - started < 3000)) { log('Spam verworfen'); return done('x'); }

  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  if (limited(ip)) return send(res, 429, { ok: false, error: 'rate_limited' });

  const l = clean(raw);
  const missing = REQUIRED.filter((k) => !l[k]);
  if (missing.length || !EMAIL_RE.test(l.email)) {
    if (!isJson) { res.writeHead(303, { Location: lang === 'en' ? '/en/contact/?fehler=1' : '/angebot/?fehler=1' }); return res.end(); }
    return send(res, 422, { ok: false, error: 'invalid', fields: missing.length ? missing : ['email'] });
  }

  l.id = `${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto.randomBytes(3).toString('hex')}`;
  l.ts = new Date().toISOString();
  l.qualifiziert = l.flaeche !== SMALL_AREA;

  let saved = false;
  if (storeOk) {
    try { store(l); saved = true; } catch (e) { log('FEHLER Speichern:', e.message); }
  }
  if (!saved && !mailer && !WEBHOOK) return send(res, 500, { ok: false, error: 'not_configured' });

  log(`Anfrage ${l.id} (${l.flaeche}${l.qualifiziert ? '' : ', nicht qualifiziert'}${l.gclid ? ', Google Ads' : ''})`);
  if (saved) {
    deliver(l).catch((e) => log('FEHLER Zustellung:', e.message));
    return done(l.id);
  }
  // Nicht gespeichert → Zustellung abwarten, damit wir wissen, ob die Anfrage angekommen ist
  try {
    if (mailer) await mailer.sendMail({ from: `"${SITE_NAME} Website" <${SMTP_FROM}>`, to: LEAD_TO, replyTo: l.email, ...leadMail(l) });
    else await deliver(l);
    if (mailer && AUTO_REPLY) mailer.sendMail({ from: `"${SITE_NAME}" <${SMTP_FROM}>`, to: l.email, replyTo: LEAD_TO, ...confirmMail(l) }).catch(() => {});
    return done(l.id);
  } catch (e) {
    log('FEHLER Zustellung ohne Speicher:', e.message);
    return send(res, 502, { ok: false, error: 'delivery_failed' });
  }
}

function handleAdmin(req, res) {
  if (!ADMIN_PASSWORD) { res.writeHead(404); return res.end(); }
  const auth = String(req.headers.authorization || '');
  const pass = Buffer.from(auth.replace(/^Basic /, ''), 'base64').toString().split(':').slice(1).join(':');
  const a = Buffer.from(pass), b = Buffer.from(ADMIN_PASSWORD);
  if (!(a.length === b.length && crypto.timingSafeEqual(a, b))) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Anfragen", charset="UTF-8"', 'Cache-Control': 'no-store' });
    return res.end('Login erforderlich');
  }
  const leads = readAll().reverse();
  if (new URL(req.url, 'http://x').searchParams.get('format') === 'csv') {
    const keys = ['id', 'ts', 'qualifiziert', ...Object.keys(FIELDS)];
    const csv = [keys.join(';'), ...leads.map((l) => keys.map((k) => `"${String(l[k] ?? '').replace(/"/g, '""').replace(/\n/g, ' ')}"`).join(';'))].join('\n');
    res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="anfragen.csv"', 'Cache-Control': 'no-store' });
    return res.end('﻿' + csv);
  }
  const cols = ['Eingang', 'Name', 'Firma', 'E-Mail', 'Telefon', 'Fläche', 'Objekt', 'Häufigkeit', 'Bezirk', 'Nachricht', 'Quelle'];
  const html = `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>Anfragen (${leads.length})</title>
<style>body{font:14px system-ui,sans-serif;margin:16px;color:#14211c}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:6px;text-align:left;vertical-align:top}th{background:#f4f3ef;position:sticky;top:0}.wrap{overflow-x:auto}a{color:#1a6e4f}</style>
<h1>Anfragen (${leads.length})</h1><p><a href="?format=csv">Als CSV herunterladen</a> · Status: E-Mail ${mailer ? 'aktiv' : '<b>nicht eingerichtet</b>'}${WEBHOOK ? ', Webhook aktiv' : ''}</p>
<div class="wrap"><table><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr>${leads
    .map((l) => `<tr><td>${esc(berlin(l.ts))}</td><td>${esc(l.name)}</td><td>${esc(l.firma)}</td><td><a href="mailto:${esc(l.email)}">${esc(l.email)}</a></td><td>${l.telefon ? `<a href="tel:${esc(l.telefon)}">${esc(l.telefon)}</a>` : ''}</td><td>${esc(l.flaeche)}${l.qualifiziert === false ? ' <b>(unter 100 m²)</b>' : ''}</td><td>${esc(l.objektart)}</td><td>${esc(l.haeufigkeit)}</td><td>${esc(l.bezirk)}</td><td style="white-space:pre-wrap">${esc(l.nachricht)}</td><td>${esc(l.quelle)}${l.gclid || l.gbraid || l.wbraid ? ' · Google Ads' : ''}${l.utm_campaign ? ' · ' + esc(l.utm_campaign) : ''}</td></tr>`)
    .join('')}</table></div>`;
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' });
  res.end(html);
}

const server = http.createServer(async (req, res) => {
  const url = (req.url || '').split('?')[0].replace(/\/+$/, '');
  try {
    if (url === '/api/anfrage' && req.method === 'POST') return await handleLead(req, res);
    if (url === '/api/anfragen' && req.method === 'GET') return handleAdmin(req, res);
    if (url === '/api/health') return send(res, 200, { ok: true, mail: Boolean(mailer), store: storeOk });
    send(res, 404, { ok: false });
  } catch (e) {
    log('FEHLER:', e.message);
    if (!res.headersSent) send(res, 500, { ok: false, error: 'server_error' });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  log(`Anfrage-Server läuft auf :${PORT} · E-Mail: ${mailer ? env.SMTP_HOST : 'NICHT eingerichtet'} · Speicher: ${storeOk ? FILE : 'NICHT beschreibbar'}${WEBHOOK ? ' · Webhook aktiv' : ''}`);
  if (mailer) mailer.verify().then(() => log('SMTP-Verbindung ok')).catch((e) => log('WARNUNG SMTP:', e.message));
});
