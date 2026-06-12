// QA script for the new California Slip & Fall funnel. Pure static checks.
import fs from 'node:fs';
import path from 'node:path';

const pages = [
  { name: 'Variant A', path: 'slip-and-fall-case-check-california/index.html' },
  { name: 'Variant B', path: 'california-slip-and-fall-case-guide/index.html' },
  { name: 'Results',   path: 'slip-and-fall-case-guide-results/index.html' },
];

const sharedFiles = [
  'js/slip-fall-funnel.js',
  'js/utm-gclid-tracking.js',
  'css/slip-fall-funnel.css',
];

let failures = 0;
function ok(label) { console.log('  PASS ' + label); }
function fail(label) { failures++; console.log('  FAIL ' + label); }
function assert(cond, label) { (cond ? ok : fail)(label); }

for (const f of sharedFiles) {
  if (!fs.existsSync(f)) {
    failures++;
    console.log('FAIL missing shared file:', f);
  } else {
    console.log('PASS shared file present:', f);
  }
}

for (const p of pages) {
  console.log('\n=== ' + p.name + ' (' + p.path + ')');
  if (!fs.existsSync(p.path)) {
    fail('file exists');
    continue;
  }
  const h = fs.readFileSync(p.path, 'utf8');
  const count = (re) => (h.match(re) || []).length;

  assert(/^<!DOCTYPE/i.test(h), '<!DOCTYPE first');
  assert(count(/<html\b/gi) === 1 && count(/<\/html>/gi) === 1, 'one <html>');
  assert(count(/<head\b/gi) === 1 && count(/<\/head>/gi) === 1, 'one <head>');
  assert(count(/<body\b/gi) === 1 && count(/<\/body>/gi) === 1, 'one <body>');
  assert(count(/<h1\b/gi) === 1, 'one H1');
  assert(/GTM-WS8XT5FC/.test(h), 'has GTM container');
  assert(/googletagmanager\.com\/ns\.html\?id=GTM-WS8XT5FC/.test(h), 'has GTM noscript fallback');
  assert(/844-467-4335/.test(h), 'has 844-467-4335 in markup');
  assert(/tel:\+18444674335/.test(h), 'tel:+18444674335 anchors used');
  assert(/data-callrail-phone="844-467-4335"/.test(h), 'data-callrail-phone marker present');
  assert(/\/js\/slip-fall-funnel\.js/.test(h), 'loads shared assessment JS');
  assert(/\/js\/utm-gclid-tracking\.js/.test(h), 'loads shared utm/gclid script');
  assert(/\/css\/slip-fall-funnel\.css/.test(h), 'loads shared CSS');
  assert(/Insider Accident Lawyers/.test(h), 'firm name present');
  assert(/3435 Wilshire Blvd/.test(h), 'firm address present in footer');
  assert(/Attorney advertising|attorney advertising/.test(h), 'attorney advertising disclaimer present');
  assert(!/\$0/.test(h), 'no visible $0 placeholders');
  assert(!/0 Cases/.test(h), 'no "0 Cases" placeholders');
  assert(!/Lorem ipsum/i.test(h), 'no Lorem ipsum');
  assert(!/TODO/.test(h), 'no TODO markers');
  assert(!/maximum compensation/i.test(h), 'no "maximum compensation" promises');

  // Results page should be noindex; the two ad pages should be indexable
  if (/case-guide-results/.test(p.path)) {
    assert(/<meta[^>]+name="robots"[^>]+noindex/i.test(h), 'results page noindex');
  } else {
    assert(!/<meta[^>]+name="robots"[^>]+noindex/i.test(h), 'ad page is NOT noindex');
    assert(/rel="canonical"/.test(h), 'has self-referencing canonical');
  }

  // No raw email in tel/sms anchors
  assert(!/tel:\d{3}\.\d{3}\.\d{4}/.test(h), 'no dotted phone numbers in tel: links');

  // Defensive: no `console.log` left in inline scripts
  assert(!/console\.log\(/.test(h), 'no console.log in page scripts');
}

// vercel.json sanity
console.log('\n=== vercel.json');
const vj = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const sources = vj.rewrites.map(r => r.source);
for (const need of [
  '/slip-and-fall-case-check-california',
  '/slip-and-fall-case-check-california/',
  '/california-slip-and-fall-case-guide',
  '/california-slip-and-fall-case-guide/',
  '/slip-and-fall-case-guide-results',
  '/slip-and-fall-case-guide-results/',
]) {
  assert(sources.includes(need), 'rewrite present: ' + need);
}

console.log('\nFailures:', failures);
process.exit(failures === 0 ? 0 : 1);
