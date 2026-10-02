#!/usr/bin/env node
/**
 * audit-nightly-composition.js — NIGHTLY_COMPOSITION_AUDIT_PLAN.md. Tag what every delivered nightly LOOKS like
 * (staging, pose, framing, background), join each tag to the pool that produced it, and rank the pools whose renders
 * cluster on one composition against the base rate. Read-only: no DB writes, no renders.
 *
 * Why from the images: the fall / Halloween corridor shot (migs 656-659) was invisible in the seed text until three
 * users got the same picture on one night; measuring what was picked has misled us before.
 *
 *   node scripts/audit-nightly-composition.js pull --days 30 --out <dir>             rows -> <dir>/rows.json
 *   node scripts/audit-nightly-composition.js tag --out <dir> [--model <id>] [--ids <file>] [--tag-file <name>]
 *   node scripts/audit-nightly-composition.js calibrate --out <dir> --labels <file> --models a,b,c
 *   node scripts/audit-nightly-composition.js report --out <dir> [--min 8]
 *
 * Vision reads use the neutral render-analysis system prompt (vision.ts RENDER_ANALYSIS_SYSTEM_PROMPT) and a plain
 * factual rubric with no justification: a consent story attached to an image question made Haiku refuse
 * (project_haiku_refuses_justified_vision_probes). Tags are cached per upload id, so a re-run only reads new images.
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { callClaude, createLlmContext } = require('./lib/anthropic');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const MODE = process.argv[2];
const OUT = arg('out', null);
const CONC = Number(arg('concurrency', '6'));

const SYSTEM = `You are an image-analysis assistant for an AI art application. You are shown AI-generated artwork produced by the app itself and answer factual questions about the image content (composition, subject count, apparent attributes) concisely and in the exact format requested.`;

const RUBRIC = `Describe this image's composition. Reply with ONLY this JSON object:
{
 "people": <number of human figures clearly visible, 0 if none>,
 "staging": one of
   "route" (the main person stands or walks ON a path, trail, street, avenue, lane, aisle, hallway, bridge deck, dock, staircase or between rows, and that route runs away behind them toward the distance),
   "feature" (the main person is at, beside or leaning on a specific object or structure: a rail, wall, fountain, table, tree, gate, vehicle, animal),
   "seated" (the main person sits),
   "activity" (the main person is clearly doing something with an object: pouring, holding something up, carving, riding, playing),
   "open" (the main person stands in open space with nothing nearby they engage with),
   "none" (no people),
 "pose": one of "walking_toward_camera", "standing_arms_down", "hands_in_pockets_or_on_hips", "leaning", "seated", "holding_object", "active_motion", "other", "none",
 "framing": one of "head_and_shoulders", "waist_up", "knees_up", "full_body", "small_in_wide_scene", "none",
 "centred_symmetric": <true if the main subject is centred in a symmetric, one-point-perspective composition, else false>,
 "background": one of "detailed", "soft_or_blurred", "plain_or_vignette",
 "couple": one of "side_by_side_apart", "close_or_touching", "one_behind_other", "not_a_couple"
}`;

const VALID = {
  staging: ['route', 'feature', 'seated', 'activity', 'open', 'none'],
  pose: [
    'walking_toward_camera',
    'standing_arms_down',
    'hands_in_pockets_or_on_hips',
    'leaning',
    'seated',
    'holding_object',
    'active_motion',
    'other',
    'none',
  ],
  framing: [
    'head_and_shoulders',
    'waist_up',
    'knees_up',
    'full_body',
    'small_in_wide_scene',
    'none',
  ],
  background: ['detailed', 'soft_or_blurred', 'plain_or_vignette'],
  couple: ['side_by_side_apart', 'close_or_touching', 'one_behind_other', 'not_a_couple'],
};

function parseTag(raw) {
  const m = String(raw).match(/\{[\s\S]*\}/);
  if (!m) return null;
  let o;
  try {
    o = JSON.parse(m[0]);
  } catch {
    return null;
  }
  for (const [k, vals] of Object.entries(VALID)) if (!vals.includes(o[k])) o[k] = null;
  o.people = Number.isFinite(Number(o.people)) ? Number(o.people) : null;
  o.centred_symmetric = o.centred_symmetric === true;
  return o;
}

async function readImage(url, model) {
  // The model override applies through an LLM context (scripts/lib/anthropic.js resolveRoute); a refusal or an
  // empty reply falls back down the job's chain, and r.model records who actually answered.
  const llm = model ? createLlmContext({ override: model }) : null;
  for (let a = 0; a < 3; a++) {
    try {
      const r = await callClaude({
        job: 'script',
        llm,
        system: SYSTEM,
        content: [
          { type: 'image', source: { type: 'url', url } },
          { type: 'text', text: RUBRIC },
        ],
        maxTokens: 400,
        timeoutMs: 90000,
      });
      const t = parseTag(r.raw);
      if (t) return { ...t, model: r.model };
    } catch (e) {
      if (a === 2) return { error: String(e.message).slice(0, 120) };
    }
  }
  return { error: 'unparsed' };
}

async function pool(items, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (i < items.length) {
        const k = i++;
        await fn(items[k], k);
      }
    })
  );
}

/** Production nightlies, one day per query (a 30-day select with the jsonb filter times out). */
async function pull() {
  const days = Number(arg('days', '30'));
  const rows = [];
  const end = Date.now();
  for (let d = days; d > 0; d--) {
    const from = new Date(end - d * 86400000).toISOString();
    const to = new Date(end - (d - 1) * 86400000).toISOString();
    for (let off = 0; ; off += 500) {
      const { data, error } = await sb
        .from('ai_generation_log')
        // Only the fields the audit joins on: a whole rolled_axes row carries the observability blob (~130 KB).
        .select(
          'created_at,upload_id,user_id,model_used,fallback_reasons,is_qa,' +
            'engine:rolled_axes->>engine,dreamType:rolled_axes->>dreamType,nightlyPath:rolled_axes->>nightlyPath,' +
            'composition:rolled_axes->>composition,medium:rolled_axes->>medium,vibe:rolled_axes->>vibe,' +
            'faceSwapResult:rolled_axes->>faceSwapResult,seedSource:rolled_axes->seedSource,' +
            'castRoles:rolled_axes->castRoles,isDual:rolled_axes->>isDualFaceSwap'
        )
        .gte('created_at', from)
        .lt('created_at', to)
        .eq('status', 'completed')
        .not('upload_id', 'is', null)
        .order('created_at', { ascending: true })
        .range(off, off + 499);
      if (error) throw new Error(`${from}: ${error.message}`);
      for (const r of data) {
        const a = r;
        if (!String(a.engine || '').startsWith('nightly') || r.is_qa) continue;
        const s = a.seedSource || {};
        const fr = r.fallback_reasons || [];
        rows.push({
          id: r.upload_id,
          at: r.created_at,
          user: r.user_id,
          who: r.user_id === KEVIN ? 'kevin' : 'user',
          // Kevin's harness renders force a sub-theme / cast / look; keep them apart from natural rolls.
          forced: fr.some((x) => /^qa:|force_|forced/.test(String(x))),
          dreamType: a.dreamType || null,
          // WHO was cast, from the cast itself: rolled_axes.dreamType is unreliable (2026-10-02: 316 one-person
          // nightlies say face_swap_dual, 502 couples say nothing).
          cast:
            a.isDual === 'true' || (Array.isArray(a.castRoles) && a.castRoles.length === 2)
              ? 'couple'
              : Array.isArray(a.castRoles) && a.castRoles.length === 1
                ? 'solo'
                : 'scene',
          path: a.nightlyPath || null,
          composition: a.composition || null,
          kind: s.kind || null,
          sub: s.subTheme || null,
          place: s.placeKey || null,
          category: s.category || null,
          posePool: s.posePool || null,
          scene: s.scene || s.location || null,
          action: s.sceneAction || null,
          look: a.medium || null,
          vibe: a.vibe || null,
          model: (r.model_used || '').replace(/^.*\//, ''),
          swap: a.faceSwapResult || null,
        });
      }
      if (data.length < 500) break;
    }
    process.stdout.write('.');
  }
  const ids = rows.map((r) => r.id);
  const urls = {};
  for (let i = 0; i < ids.length; i += 200) {
    const { data, error } = await sb
      .from('uploads')
      .select('id,image_url')
      .in('id', ids.slice(i, i + 200));
    if (error) throw new Error(error.message);
    for (const u of data) urls[u.id] = u.image_url;
  }
  const out = rows.filter((r) => urls[r.id]).map((r) => ({ ...r, url: urls[r.id] }));
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'rows.json'), JSON.stringify(out, null, 1));
  console.log(
    `\n${out.length} nightlies (${out.filter((r) => r.who === 'user').length} real users)`
  );
}

async function tag() {
  const model = arg('model', null);
  const file = path.join(OUT, arg('tag-file', `tags.${model || 'default'}.json`));
  const tags = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  let rows = JSON.parse(fs.readFileSync(path.join(OUT, 'rows.json'), 'utf8'));
  if (arg('ids', null)) {
    const want = new Set(JSON.parse(fs.readFileSync(arg('ids'), 'utf8')));
    rows = rows.filter((r) => want.has(r.id));
  }
  const todo = rows.filter((r) => !tags[r.id] || tags[r.id].error);
  console.log(`tagging ${todo.length} of ${rows.length} with ${model || 'job default'}`);
  let n = 0;
  await pool(todo, async (r) => {
    tags[r.id] = await readImage(r.url, model);
    if (++n % 50 === 0) {
      fs.writeFileSync(file, JSON.stringify(tags));
      process.stdout.write(`${n} `);
    }
  });
  fs.writeFileSync(file, JSON.stringify(tags));
  const errs = Object.values(tags).filter((t) => t.error).length;
  console.log(`\ndone, ${errs} errors -> ${file}`);
}

/** Labels file: { "<upload_id>": { "route": true|false } } graded by hand. */
async function calibrate() {
  const labels = JSON.parse(fs.readFileSync(arg('labels'), 'utf8'));
  const models = String(arg('models', '')).split(',');
  const rows = JSON.parse(fs.readFileSync(path.join(OUT, 'rows.json'), 'utf8'));
  const byId = new Map(rows.map((r) => [r.id, r]));
  const ids = Object.keys(labels).filter((id) => byId.has(id) || labels[id].url);
  for (const model of models) {
    const tags = {};
    await pool(ids, async (id) => {
      tags[id] = await readImage(labels[id].url || byId.get(id).url, model);
    });
    let agree = 0;
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let errs = 0;
    for (const id of ids) {
      const t = tags[id];
      if (!t || t.error) {
        errs++;
        continue;
      }
      const said = t.staging === 'route';
      const truth = !!labels[id].route;
      if (said === truth) agree++;
      if (said && truth) tp++;
      if (said && !truth) fp++;
      if (!said && truth) fn++;
    }
    console.log(
      `${model}: agree ${agree}/${ids.length - errs} · route recall ${tp}/${tp + fn} · false routes ${fp} · errors ${errs}`
    );
    fs.writeFileSync(path.join(OUT, `calib.${model}.json`), JSON.stringify(tags, null, 1));
  }
}

/** Over-represented compositions per pool, against the base rate of the same cast type. */
function report() {
  const min = Number(arg('min', '8'));
  const rows = JSON.parse(fs.readFileSync(path.join(OUT, 'rows.json'), 'utf8'));
  const tags = JSON.parse(
    fs.readFileSync(path.join(OUT, arg('tag-file', 'tags.default.json')), 'utf8')
  );
  const joined = rows
    .filter((r) => tags[r.id] && !tags[r.id].error)
    .map((r) => ({ ...r, t: tags[r.id] }));
  const castOf = (r) => r.cast;
  const poolKeys = (r) => {
    const keys = [];
    if (r.kind && r.kind.startsWith('holiday')) keys.push(`${r.kind}/${r.sub || '?'}`);
    else if (r.kind === 'location' || (!r.kind && r.place)) keys.push(`location/${r.place || '?'}`);
    else if (r.kind) keys.push(`${r.kind}${r.category ? '/' + r.category : ''}`);
    if (r.posePool) keys.push(`pose/${r.posePool}`);
    keys.push(`look/${r.look}`);
    return keys;
  };
  const FEATURES = [
    ['staging', 'route'],
    ['staging', 'open'],
    ['pose', 'walking_toward_camera'],
    ['pose', 'standing_arms_down'],
    ['framing', 'head_and_shoulders'],
    ['framing', 'small_in_wide_scene'],
    ['background', 'plain_or_vignette'],
    ['couple', 'close_or_touching'],
  ];
  const lines = [];
  for (const cast of ['solo', 'couple', 'scene']) {
    const all = joined.filter((r) => castOf(r) === cast);
    if (!all.length) continue;
    const base = {};
    for (const [f, v] of FEATURES)
      base[`${f}=${v}`] = all.filter((r) => r.t[f] === v).length / all.length;
    lines.push(
      `\n## ${cast} (${all.length} tagged)  base: ${Object.entries(base)
        .map(([k, v]) => `${k} ${(100 * v).toFixed(0)}%`)
        .join(' · ')}`
    );
    const groups = new Map();
    for (const r of all)
      for (const k of poolKeys(r)) (groups.get(k) || groups.set(k, []).get(k)).push(r);
    const flagged = [];
    for (const [k, g] of groups) {
      if (g.length < min) continue;
      for (const [f, v] of FEATURES) {
        const share = g.filter((r) => r.t[f] === v).length / g.length;
        const b = base[`${f}=${v}`];
        if (share >= 0.35 && share >= 2 * b)
          flagged.push({
            k,
            n: g.length,
            f: `${f}=${v}`,
            share,
            b,
            users: g.filter((r) => r.who === 'user').length,
          });
      }
    }
    flagged.sort((a, b) => b.share / Math.max(b.b, 0.02) - a.share / Math.max(a.b, 0.02));
    for (const x of flagged)
      lines.push(
        `${x.k.padEnd(48)} n=${String(x.n).padStart(3)} (users ${x.users})  ${x.f} ${(100 * x.share).toFixed(0)}% vs ${(100 * x.b).toFixed(0)}%`
      );
  }
  const txt = lines.join('\n');
  fs.writeFileSync(path.join(OUT, 'report.txt'), txt);
  console.log(txt);
}

const MODES = { pull, tag, calibrate, report };
if (!MODES[MODE] || !OUT) {
  console.error('usage: audit-nightly-composition.js <pull|tag|calibrate|report> --out <dir> ...');
  process.exit(2);
}
Promise.resolve(MODES[MODE]()).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
