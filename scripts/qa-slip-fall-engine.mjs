// Headless smoke test for the slip-fall funnel engine.
// We polyfill window/document/localStorage/sessionStorage just enough to
// require the IIFE and reach window.IALSlipFall, then exercise the
// public API (buildPersonalizedResults & internal tagging via crafted
// answer sets).
import fs from 'node:fs';
import vm from 'node:vm';

const src = fs.readFileSync('js/slip-fall-funnel.js', 'utf8');

const noopStore = () => {
  const m = new Map();
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    clear: () => m.clear(),
  };
};

const ctx = {
  console,
  window: null,
  document: {
    readyState: 'complete',
    documentElement: { lang: 'en', scrollHeight: 1 },
    getElementById: () => null,
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
  },
  localStorage: noopStore(),
  sessionStorage: noopStore(),
  setTimeout: () => 0,
  clearTimeout: () => {},
  fetch: () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }),
  URLSearchParams: globalThis.URLSearchParams,
  Date, Math, JSON,
};
ctx.window = ctx;
ctx.window.dataLayer = [];
ctx.window.location = { pathname: '/test', search: '', hostname: 'example.com', href: 'https://example.com/test' };
ctx.window.IntersectionObserver = class { constructor(){} observe(){} disconnect(){} };
ctx.window.requestIdleCallback = (cb) => cb();
ctx.window.scrollY = 0;
ctx.window.innerHeight = 600;
ctx.window.addEventListener = () => {};
ctx.document.addEventListener = () => {};

vm.createContext(ctx);
vm.runInContext(src, ctx);

let failures = 0;
function assert(cond, msg) {
  if (cond) console.log('  PASS ' + msg);
  else { failures++; console.log('  FAIL ' + msg); }
}

console.log('\n=== Engine boot');
assert(ctx.window.IALSlipFall, 'window.IALSlipFall exposed');
assert(typeof ctx.window.IALSlipFall.buildPersonalizedResults === 'function', 'buildPersonalizedResults exposed');
assert(typeof ctx.window.IALSlipFall.pushEvent === 'function', 'pushEvent exposed');

console.log('\n=== buildPersonalizedResults');
const bullets = ctx.window.IALSlipFall.buildPersonalizedResults({
  where: 'grocery',
  warning: 'none',
  injuries: ['fracture','surgery'],
  evidence: ['photos_hazard','witnesses'],
}, { priority: 'PL_A_PRIORITY', tags: [] });
assert(Array.isArray(bullets), 'returns array');
assert(bullets.length === 5, 'returns 5 bullets (control / hazard / notice / injury / evidence)');
for (const b of bullets) {
  assert(typeof b.h === 'string' && b.h.length > 0, 'bullet has heading');
  assert(typeof b.p === 'string' && b.p.length > 0, 'bullet has paragraph');
  assert(!/maximum compensation/i.test(b.p), 'no "maximum compensation"');
  assert(!/you (definitely|absolutely) have a case/i.test(b.p), 'no "definitely have a case"');
}

console.log('\n=== Personalization branches');
const govBullets = ctx.window.IALSlipFall.buildPersonalizedResults({
  where: 'public', warning: 'none', injuries: ['head'], evidence: ['witnesses'],
}, { priority: 'PL_B_REVIEW', tags: [] });
assert(govBullets[0].p.toLowerCase().includes('public entity'), 'public-property bullet mentions public entity');

const ownHomeBullets = ctx.window.IALSlipFall.buildPersonalizedResults({
  where: 'own_home', warning: 'clear', injuries: ['none'], evidence: ['none_yet'],
}, { priority: 'PL_C_EDU', tags: [] });
assert(ownHomeBullets[0].p.toLowerCase().includes('own and control'), 'own-home bullet uses careful own-home language');

const workBullets = ctx.window.IALSlipFall.buildPersonalizedResults({
  where: 'workplace', warning: 'hard_see', injuries: ['back_neck'], evidence: ['report','witnesses'],
}, { priority: 'PL_B_REVIEW', tags: [] });
assert(workBullets[0].p.toLowerCase().includes('workers'), 'workplace bullet mentions workers comp considerations');

console.log('\n=== pushEvent does not leak PII');
ctx.window.dataLayer.length = 0;
ctx.window.IALSlipFall.pushEvent('pl_assessment_step', {
  page_variant: 'variant_a',
  step_number: 3,
  step_id: 'hazard',
  // PII attempted (should be stripped by allowlist):
  first_name: 'Jane',
  phone: '5551234567',
  email: 'jane@example.com',
  injury_description: 'fracture',
  priority_tag: 'PL_A_PRIORITY',
});
const last = ctx.window.dataLayer[ctx.window.dataLayer.length - 1];
assert(!('first_name' in last), 'first_name stripped');
assert(!('phone' in last), 'phone stripped');
assert(!('email' in last), 'email stripped');
assert(!('injury_description' in last), 'injury_description stripped');
assert(!('priority_tag' in last), 'priority_tag stripped');
assert(last.event === 'pl_assessment_step', 'event name preserved');
assert(last.page_variant === 'variant_a', 'page_variant preserved');
assert(last.step_number === 3, 'step_number preserved');
assert(last.step_id === 'hazard', 'step_id preserved');

console.log('\nFailures:', failures);
process.exit(failures === 0 ? 0 : 1);
