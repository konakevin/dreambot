/**
 * Cast-photo scanner accuracy eval.
 *
 * Runs the labeled fixture corpus (__tests__/fixtures/cast/manifest.json) through
 * the vision reads and scores vs ground truth. Headline metric: the GREY
 * FALSE-POSITIVE rate — a non-grey head classified grey — which is the fleet
 * over-greying bug (RACE_FIDELITY_PLAN.md / cast-scanner work).
 *
 * Tests a matrix so we can prove the fix: current (Haiku + grey-biased focused
 * prompt + Haiku combined-describe) vs candidate (Sonnet + de-biased prompt +
 * Sonnet combined-describe). Calls the Anthropic API directly (mirrors vision.ts
 * prompts) so prompt variants can be measured without deploying.
 *
 * Run: node scripts/eval-cast-scanner.mjs   (reads ANTHROPIC_API_KEY from .env.local)
 */
import fs from 'fs';

const ROOT = '/Users/kevinmchenry/Development/apps/dreambot';
const env = Object.fromEntries(
  fs.readFileSync(`${ROOT}/.env.local`, 'utf8').split('\n').filter((l) => l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const KEY = env.ANTHROPIC_API_KEY;
const HAIKU = 'claude-haiku-4-5-20251001';
const SONNET = 'claude-sonnet-4-6';
const FIX = `${ROOT}/__tests__/fixtures/cast/`;
const manifest = JSON.parse(fs.readFileSync(FIX + 'manifest.json', 'utf8'));

const BUCKETS = ['White', 'Black', 'East Asian', 'South Asian', 'Hispanic/Latino', 'Middle Eastern'];

// ── prompts (mirror vision.ts) ──────────────────────────────────────────────
const ETH_PROMPT =
  "Which single option best matches this person's broad appearance? Choose EXACTLY one and reply with only that option, nothing else:\n" +
  BUCKETS.join(', ') + ', Uncertain.';
const HAIR_BIASED = // CURRENT (line 220 vision.ts) — primes grey
  "In 2 to 4 words, what is this person's natural hair color (say 'greying' or 'salt-and-pepper' if grey is present)? Reply with only the color words, nothing else.";
const HAIR_DEBIASED = // CANDIDATE fix — neutral, only grey when truly grey
  "What is this person's natural hair color? Answer in 2 to 4 words using plain color terms (black, dark brown, brown, light brown, blonde, red, auburn, grey, white). Report grey, greying, or salt-and-pepper ONLY if the hair is clearly and mostly grey or white — natural highlights, warm lighting, or a few stray strands are NOT grey. If the person is bald or shaved, answer 'bald'. Reply with only the color words, nothing else.";
const CAST_PERSON = // the combined describe (castPerson, vision.ts) — we parse hair + AGE
  'Your response MUST BEGIN with a HEADER LINE: the gender ("Male" or "Female"), a comma, then the build (exactly ONE of "thin", "athletic", or "average"). Then describe them for an AI artist creating a flattering stylized character — focus on the FACE and HAIR. Include: exact age estimate, face shape, eye color, hair (exact color like sandy brown or chestnut, length, texture, style and cut), skin tone, distinguishing features. Do NOT describe clothing. 3 sentences max. Be specific.\n\nAfter the description, add a NEW LINE starting with "AGE:" followed by your best numeric age estimate as an integer only. Estimate their TRUE age as accurately as you can.\n\nAfter the AGE line, add a NEW LINE starting with "TRAITS:" listing hair color/length/cut, facial hair, skin tone, approximate age, build, eye color.';

async function call(model, prompt, b64, media) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000); // no single call can stall the run
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model, max_tokens: 400, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: media, data: b64 } }, { type: 'text', text: prompt }] }] }),
        signal: ctrl.signal,
      });
      if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 1500 * (attempt + 1))); continue; }
      const j = await res.json();
      return (j.content?.[0]?.text || '').trim();
    } catch (_e) { await new Promise((r) => setTimeout(r, 1000)); }
    finally { clearTimeout(timer); }
  }
  return '';
}

// ── normalizers ─────────────────────────────────────────────────────────────
const GREY_RE = /\b(salt[- ]?and[- ]?pepper|grey|gray|silver|greying|graying|white[- ]?hair|white-haired|going gr[ae]y|peppered|grizzled)\b/i;
// A short FOCUSED hair answer is entirely about hair, so a bare "white" there means
// white hair (grey family). In a combined describe "white" may be skin, so that path
// uses GREY_RE only.
const isGreyRead = (s, focused) => GREY_RE.test(s || '') || (focused && /\bwhite\b/i.test(s || ''));
function hairFamily(s, focused) {
  s = (s || '').toLowerCase();
  if (/\b(bald|shaved head|hairless|no hair|clean.?shaven head)\b/.test(s)) return 'bald';
  if (isGreyRead(s, focused)) return 'grey';
  if (/\b(blonde|blond|golden)\b/.test(s)) return 'blonde';
  if (/\bauburn\b/.test(s)) return 'auburn';
  if (/\b(ginger|copper|\bred\b)\b/.test(s)) return 'red';
  if (/\b(brown|chestnut|brunette|sandy|mousy)\b/.test(s)) return 'brown';
  if (/\bblack\b/.test(s)) return 'black';
  return 'other';
}
function ethOf(txt) {
  const t = (txt || '').toLowerCase();
  return [...BUCKETS].sort((a, b) => b.length - a.length).find((b) => t.includes(b.toLowerCase())) || (/uncertain/i.test(t) ? 'Uncertain' : null);
}
function ageOf(describe) { const m = (describe || '').match(/AGE:\s*(\d{1,3})/i); return m ? parseInt(m[1], 10) : null; }
// pull the hair phrase from a combined describe: prefer the TRAITS line, else prose
function hairFromDescribe(d) {
  const traits = (d.match(/TRAITS:([^\n]*)/i) || [])[1] || '';
  const src = traits || d;
  // grab a window around the first "hair"
  const m = src.match(/([a-z- ]{0,24})\bhair\b/i);
  return m ? m[0] : src;
}

// leniency clusters: auburn↔red↔brown (warm), and black↔brown (both "dark" — very
// dark brown vs black is a legitimately hard call and not the point of this eval).
const WARM = new Set(['brown', 'auburn', 'red']);
const DARK = new Set(['black', 'brown']);
const familyMatch = (a, b) => a === b || (WARM.has(a) && WARM.has(b)) || (DARK.has(a) && DARK.has(b));

// ── run matrix with small concurrency ───────────────────────────────────────
async function mapLimit(items, limit, fn) {
  const out = []; let i = 0;
  const workers = Array.from({ length: limit }, async () => { while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); } });
  await Promise.all(workers); return out;
}

const rows = await mapLimit(manifest, 2, async (m) => {
  const b64 = fs.readFileSync(FIX + m.file).toString('base64');
  const [ethH, ethS, hairBiasedH, hairDebiasedS, descH, descS] = await Promise.all([
    call(HAIKU, ETH_PROMPT, b64, 'image/jpeg'),
    call(SONNET, ETH_PROMPT, b64, 'image/jpeg'),
    call(HAIKU, HAIR_BIASED, b64, 'image/jpeg'),
    call(SONNET, HAIR_DEBIASED, b64, 'image/jpeg'),
    call(HAIKU, CAST_PERSON, b64, 'image/jpeg'),
    call(SONNET, CAST_PERSON, b64, 'image/jpeg'),
  ]);
  const r = { id: m.id, truth: m.truth,
    ethH: ethOf(ethH), ethS: ethOf(ethS),
    hairBiasedH: { raw: hairBiasedH, fam: hairFamily(hairBiasedH, true), grey: isGreyRead(hairBiasedH, true) },
    hairDebiasedS: { raw: hairDebiasedS, fam: hairFamily(hairDebiasedS, true), grey: isGreyRead(hairDebiasedS, true) },
    combH: { fam: hairFamily(hairFromDescribe(descH), false), grey: isGreyRead(hairFromDescribe(descH), false), age: ageOf(descH) },
    combS: { fam: hairFamily(hairFromDescribe(descS), false), grey: isGreyRead(hairFromDescribe(descS), false), age: ageOf(descS) },
  };
  const hb = r.hairBiasedH.grey ? 'GREY' : r.hairBiasedH.fam;
  const hd = r.hairDebiasedS.grey ? 'GREY' : r.hairDebiasedS.fam;
  console.log(`${m.id} truth[${m.truth.ethnicity||'?'}/${m.truth.hairFamily}${m.truth.isGrey?'(grey)':''}/${m.truth.age}] | ethH=${r.ethH} ethS=${r.ethS} | hairBiasedHaiku=${hb} hairDebiasedSonnet=${hd} | ageH=${r.combH.age} ageS=${r.combS.age}`);
  return r;
});

// ── scoring ─────────────────────────────────────────────────────────────────
function ethAcc(key) { const set = rows.filter((r) => r.truth.ethnicity); const ok = set.filter((r) => r[key] === r.truth.ethnicity).length; return `${ok}/${set.length} (${(100*ok/set.length).toFixed(0)}%)`; }
function greyStats(pick) {
  const nonGrey = rows.filter((r) => !r.truth.isGrey && r.truth.hairFamily !== 'bald');
  const grey = rows.filter((r) => r.truth.isGrey);
  const fp = nonGrey.filter((r) => pick(r).grey).length;
  const fn = grey.filter((r) => !pick(r).grey).length;
  return { fp, fpN: nonGrey.length, fn, fnN: grey.length };
}
function famAcc(pick) { const set = rows.filter((r) => r.truth.hairFamily !== 'bald'); const ok = set.filter((r) => familyMatch(pick(r).fam, r.truth.hairFamily)).length; return `${ok}/${set.length} (${(100*ok/set.length).toFixed(0)}%)`; }
function ageErr(key) { const set = rows.filter((r) => r[key].age != null); const signed = set.map((r) => r[key].age - r.truth.age); const mean = signed.reduce((a, b) => a + b, 0) / set.length; const mae = signed.map(Math.abs).reduce((a, b) => a + b, 0) / set.length; const within = set.filter((r) => Math.abs(r[key].age - r.truth.age) <= 5).length; return `signed=${mean>=0?'+':''}${mean.toFixed(1)}y MAE=${mae.toFixed(1)}y within±5y=${within}/${set.length}`; }

console.log('\n════════ RESULTS ════════');
console.log('ETHNICITY  Haiku:', ethAcc('ethH'), ' Sonnet:', ethAcc('ethS'));
console.log('\nHAIR GREY-CONFUSION (headline — lower FP is the fix):');
for (const [name, pick] of [['focused BIASED Haiku (current)', (r) => r.hairBiasedH], ['focused DEBIASED Sonnet', (r) => r.hairDebiasedS], ['combined-describe Haiku', (r) => r.combH], ['combined-describe Sonnet', (r) => r.combS]]) {
  const g = greyStats(pick);
  console.log(`  ${name.padEnd(32)} grey false-POS ${g.fp}/${g.fpN} non-grey  | grey false-NEG ${g.fn}/${g.fnN} grey  | family ${famAcc(pick)}`);
}
console.log('\nAGE  Haiku describe:', ageErr('combH'), '\n     Sonnet describe:', ageErr('combS'));
fs.writeFileSync(`${ROOT}/scripts/.eval-cast-results.json`, JSON.stringify(rows, null, 2));
console.log('\nsaved scripts/.eval-cast-results.json');

// ── GATE: fail the run if the SHIPPED config (Sonnet ethnicity + de-biased focused
// hair on Sonnet + Sonnet age) regresses below target. This is what makes
// `npm run eval:cast` a real check, not just a print. Thresholds are the bar the
// fix cleared 2026-09-01. (Small corpus → a little slack below the measured values.)
const gate = [];
const ethSet = rows.filter((r) => r.truth.ethnicity);
const ethOk = ethSet.filter((r) => r.ethS === r.truth.ethnicity).length;
gate.push(['ethnicity Sonnet ≥85%', ethOk / ethSet.length >= 0.85, `${ethOk}/${ethSet.length}`]);
const g = greyStats((r) => r.hairDebiasedS);
gate.push(['grey false-positives == 0', g.fp === 0, `${g.fp}/${g.fpN}`]);
gate.push(['grey recall ≥75%', g.fnN === 0 || (g.fnN - g.fn) / g.fnN >= 0.75, `${g.fnN - g.fn}/${g.fnN}`]);
const famSet = rows.filter((r) => r.truth.hairFamily !== 'bald');
const famOk = famSet.filter((r) => familyMatch(r.hairDebiasedS.grey ? 'grey' : r.hairDebiasedS.fam, r.truth.hairFamily)).length;
gate.push(['hair family ≥85%', famOk / famSet.length >= 0.85, `${famOk}/${famSet.length}`]);
const ageSet = rows.filter((r) => r.combS.age != null);
const ageWithin = ageSet.filter((r) => Math.abs(r.combS.age - r.truth.age) <= 5).length;
gate.push(['age within±5y ≥75%', ageWithin / ageSet.length >= 0.75, `${ageWithin}/${ageSet.length}`]);

console.log('\n════════ GATE (shipped config) ════════');
let failed = 0;
for (const [name, ok, detail] of gate) { console.log(`  ${ok ? '✅' : '❌'} ${name}  (${detail})`); if (!ok) failed++; }
if (failed) { console.error(`\n${failed} gate check(s) FAILED — scanner regressed.`); process.exit(1); }
console.log('\nAll gate checks passed.');
