#!/usr/bin/env node
/**
 * Which slot field makes a render plainer? (LLM_5_5_TUNING.md phase 1.) Takes paired render results from
 * scripts/lab-llm-render-parity.js, pulls each render's exact final prompt + slot JSON from ai_generation_log, and
 * re-renders on flux-1.1-pro DIRECTLY (Replicate, fixed seed, production input, no face swap, no DB load):
 *
 *   base   the base arm's prompt (e.g. 4.6)
 *   test   the test arm's prompt (e.g. 5.5)
 *   test+<fields>   the test prompt with those fields' text replaced by the base arm's text
 *   <name>          --extra=<name>=<results.json>: another sample of the base arm (e.g. the noise-floor re-run), same
 *                   seed; its keys are a<k> / b<k> for pair <k> of results file 1 / 2 (how noise46 was pinned). This
 *                   is the null: how far a fresh base-arm Sonnet sample moves from the first one on the same seeds.
 *   test@<key>      --dry-overlay=<key>: a NEW test-arm prompt from a nightly dry run with that QA overlay
 *                   (llm_prompt_overlays), same input and same seed, so a round can be checked for ~4¢ a render
 *
 * Same seed for every variant of an input, so a difference comes from the text. Scores every render with the
 * scenery score (scripts/qa-scenery-score.ts) and prints per-variant medians + paired wins against the test prompt.
 * Method of record: memory project_flux_prompt_position_probe (render the shipped prompt, same seed, A/B).
 *
 *   node scripts/lab-flux-slot-bisect.mjs --results=a.json,b.json --out=DIR [--base=4.6] [--test=5.5]
 *     [--swap=scene_description] [--swap=left_wardrobe+right_wardrobe] [--dry-overlay=<key>] [--llm=claude-sonnet-5-5@high]
 *     [--seeds=1] [--limit=N] [--plan] [--score-only]
 */
import fs from 'fs';
import { Buffer } from 'buffer';
import path from 'path';
import { execFileSync } from 'child_process';

const env = Object.fromEntries(
  fs
    .readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const SRK = env.SUPABASE_SERVICE_ROLE_KEY;
const REP = env.REPLICATE_API_TOKEN;
const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};
const OUT = arg('out');
const BASE = arg('base', '4.6');
const TEST = arg('test', '5.5');
const SEEDS = Number(arg('seeds', '1'));
const LIMIT = Number(arg('limit', '0'));
const SWAPS = process.argv.filter((x) => x.startsWith('--swap=')).map((x) => x.slice(7).split('+'));
const SCORE_ONLY = process.argv.includes('--score-only');
const PLAN = process.argv.includes('--plan');
const DRY_KEY = arg('dry-overlay', '');
const LLM = arg('llm', 'claude-sonnet-5-5@high');
const PLAIN_BELOW = 9;
const EXTRAS = process.argv
  .filter((x) => x.startsWith('--extra='))
  .map((x) => {
    const [name, file] = x.slice(8).split('=');
    return { name, file };
  });
if (!OUT || !arg('results')) throw new Error('usage: --results=a.json[,b.json] --out=DIR');
const IMG = path.join(OUT, 'img');
fs.mkdirSync(IMG, { recursive: true });

// 1. Pair base/test rows per (file, key); couples only.
const pairs = [];
for (const [fi, f] of arg('results').split(',').entries()) {
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  const by = {};
  for (const r of d.results) {
    if (r.cast !== 2 || !r.uploadId) continue;
    (by[r.key] ||= {})[r.arm] = r;
  }
  for (const [key, arms] of Object.entries(by)) {
    if (arms[BASE] && arms[TEST])
      pairs.push({ id: `f${fi}-${key}`, key, file: f, base: arms[BASE], test: arms[TEST] });
  }
}

for (const ex of EXTRAS) {
  for (const r of JSON.parse(fs.readFileSync(ex.file, 'utf8')).results) {
    if (r.cast !== 2 || !r.uploadId || r.arm !== BASE) continue;
    const p = pairs.find((q) => q.id === `f${'ab'.indexOf(r.key[0])}-${r.key.slice(1)}`);
    if (p) (p.extras ||= {})[ex.name] = r;
  }
}

// 2. Final prompt + slot JSON from the log.
const ids = pairs.flatMap((p) => [
  p.base.uploadId,
  p.test.uploadId,
  ...Object.values(p.extras || {}).map((r) => r.uploadId),
]);
const log = {};
for (let i = 0; i < ids.length; i += 40) {
  const res = await fetch(
    `https://jimftynwrinwenonjrlj.supabase.co/rest/v1/ai_generation_log?select=upload_id,enhanced_prompt,sonnet_raw_response&upload_id=in.(${ids.slice(i, i + 40).join(',')})`,
    { headers: { apikey: SRK, Authorization: `Bearer ${SRK}` } }
  );
  for (const u of await res.json()) log[u.upload_id] = u;
}
const slots = (raw) => {
  try {
    return JSON.parse(String(raw || '').replace(/,\s*}/g, '}'));
  } catch {
    return null;
  }
};
const trimEnd = (s) =>
  String(s || '')
    .trim()
    .replace(/[.;,\s]+$/, '');
// Wardrobe word counts read back from a composed couple prompt ("… wearing X; to his right, … wearing Y. ").
const wardWords = (prompt) => {
  const m = [...String(prompt).matchAll(/wearing ([^;]+?)(?:;|\. )/g)].slice(0, 2);
  return m.map((x) => x[1].trim().split(/\s+/).length);
};

// 3. Build variants. A pair is used only when both prompts share the look prefix (the same attempt-1 composer).
const jobs = [];
const skipped = [];
const dryPending = [];
for (const p of pairs.slice(0, LIMIT || pairs.length)) {
  const bl = log[p.base.uploadId];
  const tl = log[p.test.uploadId];
  const bp = bl && bl.enhanced_prompt;
  const tp = tl && tl.enhanced_prompt;
  const bs = slots(bl && bl.sonnet_raw_response);
  const ts = slots(tl && tl.sonnet_raw_response);
  if (!bp || !tp || !bs || !ts || bp.slice(0, 60) !== tp.slice(0, 60)) {
    skipped.push(
      `${p.id}: ${!bp || !tp ? 'no prompt' : !bs || !ts ? 'no slots' : 'look prefix differs'}`
    );
    continue;
  }
  const variants = { base: bp, test: tp };
  for (const [name, r] of Object.entries(p.extras || {})) {
    const ep = log[r.uploadId] && log[r.uploadId].enhanced_prompt;
    if (ep && ep.slice(0, 60) === bp.slice(0, 60)) variants[name] = ep;
    else skipped.push(`${p.id}: extra ${name} ${ep ? 'look prefix differs' : 'no prompt'}`);
  }
  for (const fields of SWAPS) {
    let v = tp;
    let ok = true;
    for (const f of fields) {
      const from = trimEnd(ts[f]);
      const to = trimEnd(bs[f]);
      if (!from) continue;
      if (!v.includes(from)) {
        ok = false;
        break;
      }
      v = v.replace(from, to);
    }
    if (ok) variants[`test+${fields.join('+')}`] = v;
    else skipped.push(`${p.id}: ${fields.join('+')} text not found verbatim`);
  }
  if (DRY_KEY) dryPending.push({ p, variants });
  else pushJobs(p, variants);
}
function pushJobs(p, variants) {
  for (let s = 0; s < SEEDS; s++) {
    const seed = 7001 + pairs.indexOf(p) * 10 + s;
    for (const [name, prompt] of Object.entries(variants)) {
      jobs.push({
        pair: p.id,
        seed,
        variant: name,
        prompt,
        ward: wardWords(prompt),
        file: path.join(IMG, `${p.id}-s${seed}-${name.replace(/[^a-z0-9]+/gi, '_')}.jpg`),
      });
    }
  }
}

// 3b. --dry-overlay: one nightly dry run per input on the test model + the QA overlay (cached in OUT).
if (DRY_KEY) {
  const cacheFile = path.join(OUT, `dry-${DRY_KEY}.json`);
  const cache = fs.existsSync(cacheFile) ? JSON.parse(fs.readFileSync(cacheFile, 'utf8')) : {};
  const itemsFor = {};
  let next = 0;
  await Promise.all(
    [0, 1, 2].map(async () => {
      while (next < dryPending.length) {
        const { p, variants } = dryPending[next++];
        if (!cache[p.id]) {
          const itemsPath = path.join(path.dirname(p.file), 'items-nightly.json');
          itemsFor[itemsPath] ||= JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
          const item = itemsFor[itemsPath].find((it) => it.key === p.key);
          const res = await fetch(
            'https://jimftynwrinwenonjrlj.supabase.co/functions/v1/nightly-dreams',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${env.DREAM_QUEUE_WORKER_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: 'eab700d8-f11a-4f47-a3a1-addda6fb67ec',
                dry_run: true,
                force_cast_role: 'dual',
                force_slot_input: item.input,
                force_model: item.model,
                force_llm_model: LLM,
                force_llm_overlays: DRY_KEY,
              }),
              signal: AbortSignal.timeout(120_000),
            }
          ).catch((e) => ({ ok: false, json: async () => ({ error: e.message }) }));
          const d = await res.json().catch(() => ({}));
          cache[p.id] = {
            finalPrompt: d.finalPrompt || null,
            stamps: (d.fallbackReasons || []).filter((f) => /llm/.test(f)),
            error: d.error || null,
          };
          fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 1));
        }
        const c = cache[p.id];
        const applied = c.stamps.some((x) => x === `llm_overlay:nightly_slots:${DRY_KEY}`);
        if (c.finalPrompt && applied && c.finalPrompt.slice(0, 60) === variants.test.slice(0, 60))
          variants[`test@${DRY_KEY}`] = c.finalPrompt;
        else
          skipped.push(
            `${p.id}: dry run ${!c.finalPrompt ? `failed (${c.error})` : !applied ? `overlay not applied (${c.stamps.join(' ')})` : 'look prefix differs'}`
          );
        pushJobs(p, variants);
      }
    })
  );
}
fs.writeFileSync(path.join(OUT, 'jobs.json'), JSON.stringify(jobs, null, 1));
console.log(`${pairs.length} pairs, ${jobs.length} renders planned (${skipped.length} skips)`);
for (const s of skipped) console.log('  skip', s);
if (PLAN) process.exit(0);

// 4. Render (3 in flight), production flux-1.1-pro input + seed.
async function render(j) {
  if (fs.existsSync(j.file)) return;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(
      'https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REP}`,
          'Content-Type': 'application/json',
          Prefer: 'wait=60',
        },
        body: JSON.stringify({
          input: {
            prompt: j.prompt,
            aspect_ratio: '9:16',
            num_outputs: 1,
            output_format: 'jpg',
            output_quality: 100,
            seed: j.seed,
          },
        }),
      }
    );
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 10000));
      continue;
    }
    let pred = await res.json();
    while (pred.status && !['succeeded', 'failed', 'canceled'].includes(pred.status)) {
      await new Promise((r) => setTimeout(r, 2000));
      pred = await (
        await fetch(pred.urls.get, { headers: { Authorization: `Bearer ${REP}` } })
      ).json();
    }
    if (pred.status !== 'succeeded') {
      j.error = String(pred.error || pred.detail || pred.status);
      if (/nsfw|flagged/i.test(j.error)) return;
      continue;
    }
    const url = Array.isArray(pred.output) ? pred.output[0] : pred.output;
    fs.writeFileSync(j.file, Buffer.from(await (await fetch(url)).arrayBuffer()));
    return;
  }
}
if (!SCORE_ONLY) {
  let next = 0;
  let done = 0;
  await Promise.all(
    [0, 1, 2].map(async () => {
      while (next < jobs.length) {
        const j = jobs[next++];
        await render(j);
        done++;
        if (done % 10 === 0) console.log(`  ${done}/${jobs.length}`);
      }
    })
  );
  const errs = jobs.filter((j) => j.error && !fs.existsSync(j.file));
  if (errs.length)
    console.log(
      `${errs.length} failed:`,
      errs.map((j) => `${j.pair}/${j.variant}: ${j.error}`).join('; ')
    );
}

// 5. Score + report.
const deno = fs.existsSync(`${process.env.HOME}/.deno/bin/deno`)
  ? `${process.env.HOME}/.deno/bin/deno`
  : 'deno';
const tsv = execFileSync(
  deno,
  ['run', '-A', new URL('./qa-scenery-score.ts', import.meta.url).pathname, IMG],
  {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }
);
const score = {};
for (const line of tsv.trim().split('\n')) {
  const [detail, , faces, fh, p] = line.split('\t');
  score[p] = { detail: Number(detail), faces: Number(faces), fh: fh === '-' ? null : Number(fh) };
}
const med = (xs) => {
  const s = xs.filter((x) => typeof x === 'number').sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : NaN;
};
for (const j of jobs) j.score = score[j.file] || null;
fs.writeFileSync(
  path.join(OUT, 'scores.json'),
  JSON.stringify(
    jobs.map(({ prompt, ...r }) => r),
    null,
    1
  )
);
const names = [...new Set(jobs.map((j) => j.variant))];
const cell = (pair, seed, v) =>
  jobs.find((j) => j.pair === pair && j.seed === seed && j.variant === v);
console.log(
  `\nscenery by variant (flux-1.1-pro, same seed per input; "plain" = scenery under ${PLAIN_BELOW}):`
);
const vs = (j, other) => {
  const o = cell(j.pair, j.seed, other);
  return o && o.score ? j.score.detail - o.score.detail : null;
};
for (const v of names) {
  const rs = jobs.filter((j) => j.variant === v && j.score);
  const cmp = (other) => {
    if (v === other) return '';
    const d = rs.map((j) => vs(j, other)).filter((x) => x !== null);
    if (!d.length) return '';
    const m = med(d);
    return `  vs ${other}: higher ${d.filter((x) => x > 0).length}/${d.length}, median ${m >= 0 ? '+' : ''}${m.toFixed(2)}`;
  };
  console.log(
    `  ${v.padEnd(36)} n=${String(rs.length).padStart(3)}  wardrobe words ${String(med(rs.map((j) => (j.ward || []).reduce((a, b) => a + b, 0) || null))).padStart(3)}  scenery ${med(rs.map((j) => j.score.detail)).toFixed(2)}  plain ${rs.filter((j) => j.score.detail < PLAIN_BELOW).length}  face ${med(rs.map((j) => j.score.fh)).toFixed(3)}  0-face ${rs.filter((j) => j.score.faces === 0).length}` +
      cmp('test') +
      cmp('base')
  );
}
