#!/usr/bin/env node
/**
 * eval-model.js — put a candidate image model through DreamBot's full acceptance test.
 *
 *   node scripts/eval-model.js "black-forest-labs/flux-2-pro"
 *   node scripts/eval-model.js "flux 3"              # fuzzy, resolves against Replicate
 *   node scripts/eval-model.js <id> --phase 2        # one phase only
 *   node scripts/eval-model.js <id> --n 9 --no-album # sample size, skip the album push
 *
 * WHAT IT IS FOR. Adopting a model is a decision with a long tail: the wrong one renders
 * beautifully in a demo and then quietly drops the +1 from one couple in five, or times
 * out at 150s after the sparkle was already charged, or paints every look as a
 * photograph. Each of those has actually happened here. This runs the checks that would
 * have caught them, in the order that costs the least to fail.
 *
 * WHAT "GOOD" MEANS is defined in scripts/lib/modelEval/dimensions.js, with the incident
 * behind every bar. Read that file, not this one, to understand the verdict.
 *
 * HOW IT IS STRUCTURED. Phases run cheapest-first and a FATAL failure stops the run, so a
 * model that cannot hit 9:16 costs about five renders instead of seventy. Phases 0-3 are
 * CLEAN ROOM: direct provider calls with bare prompts, no engine, no Sonnet, no look
 * fragment, no framing block, no swap. That isolation is the whole point — the engine's
 * own boilerplate can make a perfectly good model look broken, which is exactly how four
 * consecutive wrong verdicts were reached about gpt-image-2.5 on 2026-09-16. Phase 4
 * then runs the real pipeline, because a model that passes in isolation can still fail
 * the swap.
 *
 * WHAT IT WILL NOT DO. It does not grade artistic quality. Style judgement is returned as
 * evidence — renders in the Dreams album, base-and-swapped pairs, counts — and a human
 * or an agent following the skill decides. Two automated style graders were written the
 * same day and both failed their own control, one calling all 53 renders "artwork" and
 * the other giving order-dependent verdicts on 8 of 17. Anything here that claims a
 * verdict is counting something a detector measured, not appraising a picture.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const D = require('./lib/modelEval/dimensions');
const P = require('./lib/modelEval/probes');
const { toAlbum } = require('./lib/modelEval/album');
const { waitForHeadroom } = require('./lib/poolHeadroom');

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';

// ── args ──────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name, dflt) => {
  const i = argv.indexOf('--' + name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : dflt;
};
const has = (name) => argv.includes('--' + name);
const QUERY = argv.find((a) => !a.startsWith('--'));
const N = Number(flag('n', 9));
const ONLY_PHASE = argv.includes('--phase') ? Number(flag('phase', -1)) : null;
const USE_ALBUM = !has('no-album');

if (!QUERY) {
  console.error('usage: node scripts/eval-model.js "<model id or name>" [--n 9] [--phase N]');
  process.exit(1);
}

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const RUN = `${QUERY.replace(/[^a-z0-9]+/gi, '-')}-${Date.now()}`;
const OUT = path.join(process.env.TMPDIR || '/tmp', 'model-eval', RUN);
fs.mkdirSync(OUT, { recursive: true });

const results = {}; // key → { verdict, detail, evidence }
const say = (s = '') => console.log(s);
const record = (key, verdict, detail, evidence) => {
  results[key] = { verdict, detail, evidence: evidence || null };
  const mark = verdict === 'PASS' ? '✓' : verdict === 'FAIL' ? '✗' : verdict === 'INFO' ? '·' : '?';
  say(`   ${mark} ${D.byKey(key) ? D.byKey(key).title : key}: ${detail}`);
};

/**
 * Resolve a fuzzy name to a real model id. Saves the most annoying failure mode of all —
 * spending an hour evaluating a model id that never existed, or silently testing the
 * wrong variant of a family (flare vs sunburst, pro vs ultra vs flex).
 */
async function resolveModel(query) {
  if (/^[\w.-]+\/[\w.-]+$/.test(query)) {
    // Looks like a real id. For Replicate, confirm it EXISTS before spending anything.
    if (P.providerFor(query) === 'replicate' && env.REPLICATE_API_TOKEN) {
      const res = await fetch(`https://api.replicate.com/v1/models/${query}`, {
        headers: { Authorization: 'Bearer ' + env.REPLICATE_API_TOKEN },
      });
      if (res.ok) {
        const j = await res.json();
        return { id: query, exists: true, description: j.description || '', owner: j.owner };
      }
      return { id: query, exists: false, note: `Replicate returned ${res.status} for this id` };
    }
    return { id: query, exists: null, note: 'non-Replicate id, existence not checked' };
  }
  // Fuzzy: search Replicate. Anything else has to be named exactly.
  //
  // Replicate's search is the HTTP `QUERY` method with the search string as a plain-text
  // BODY. The obvious-looking `GET /v1/models?query=...` silently IGNORES the parameter
  // and returns an arbitrary page of models — which looks like a working search right up
  // until you notice "seedream 4" did not return bytedance/seedream-4.
  if (!env.REPLICATE_API_TOKEN) return { id: query, exists: null, note: 'no token to search with' };
  const res = await fetch('https://api.replicate.com/v1/models', {
    method: 'QUERY',
    headers: {
      Authorization: 'Bearer ' + env.REPLICATE_API_TOKEN,
      'Content-Type': 'text/plain',
    },
    body: query,
  });
  if (!res.ok) return { id: query, exists: null, note: `search failed (${res.status})` };
  const j = await res.json();
  const all = (j.results || []).map((m) => ({
    id: `${m.owner}/${m.name}`,
    description: (m.description || '').slice(0, 90),
  }));
  if (!all.length) return { id: query, exists: false, note: 'no Replicate model matched' };

  /**
   * NEVER auto-pick a weak match.
   *
   * Replicate's search is loose enough to be actively dangerous here: the query "flux 2"
   * returns hautechai/grounding-dino (an OBJECT DETECTOR) as its top hit. Taking the top
   * result would have silently run a full image-model evaluation against a detector, and
   * every number in the report would have looked like a real finding. Picking the wrong
   * VARIANT is the quieter version of the same bug — flare vs sunburst, pro vs ultra vs
   * flex — and that one produces a plausible report about a model you never tested.
   *
   * So: auto-pick only when a candidate's ID contains every alphanumeric token of the
   * query. Anything less prints the shortlist and stops, and the caller names the model
   * exactly. Refusing to guess costs one round trip; guessing wrong costs a day.
   */
  const tokens = query.toLowerCase().match(/[a-z0-9]+/g) || [];
  const idMatches = (c) => tokens.every((t) => c.id.toLowerCase().includes(t));
  const strong = all.filter(idMatches);
  const shortlist = (strong.length ? strong : all).slice(0, 8);

  if (strong.length === 1) {
    return { id: strong[0].id, exists: true, description: strong[0].description };
  }
  return {
    id: null,
    exists: null,
    ambiguous: true,
    candidates: shortlist,
    note: strong.length
      ? `"${query}" matches ${strong.length} models — name one exactly.`
      : `no model's ID contains all of [${tokens.join(', ')}]. The closest Replicate could offer is below, and none of them are necessarily an image model.`,
  };
}

// ── phase 0: can we call it at all ────────────────────────────────────────────
async function phase0(model) {
  say('\n▸ PHASE 0 — plumbing');
  say(`   ${D.why('plumbing').slice(0, 200)}…`);
  const r = await P.rawRender(model, 'A quiet street corner at dawn.', env);
  if (!r.ok) {
    const hint =
      P.providerFor(model) === 'replicate'
        ? 'Replicate rejected our DEFAULT input body. Likely a schema mismatch — check the model’s input fields and add a special case in _shared/generateImage.ts the way bytedance/seedream-4 has one.'
        : `Provider "${P.providerFor(model)}" needs a map entry before the engine can call this (e.g. OPENAI_MODEL_MAP + render defaults for OpenAI).`;
    record('plumbing', 'FAIL', `${r.error}. ${hint}`);
    return false;
  }
  record(
    'plumbing',
    'PASS',
    `renders via ${r.provider} · ${r.width}x${r.height} · ${(r.elapsedMs / 1000).toFixed(1)}s`
  );
  P.save(r.buf, OUT, 'phase0-plumbing');
  return r;
}

// ── phase 1: shape, speed, cost ───────────────────────────────────────────────
async function phase1(model, first) {
  say('\n▸ PHASE 1 — shape, speed, cost');
  const timings = [first.elapsedMs];
  const costs = first.costUsd ? [first.costUsd] : [];

  // ASPECT. The single most common disqualifier, and unfixable when it fails.
  const r = first.ratio;
  const offBy = Math.abs(r - P.TARGET_RATIO);
  if (offBy <= 0.02) {
    record('aspect', 'PASS', `${r.toFixed(3)} ≈ 9:16 (${first.width}x${first.height})`);
  } else {
    record(
      'aspect',
      'FAIL',
      `${r.toFixed(3)} vs target ${P.TARGET_RATIO.toFixed(3)} (${first.width}x${first.height}). ` +
        'Display cannot rescue this: the feed crops and full-screen letterboxes. This is why gpt-image-2 is banned from nightly.'
    );
  }

  // RESOLUTION. Too big defeats the face detector — the flux-1.1-pro-ultra ban.
  const mp = first.megapixels;
  if (mp != null) {
    record(
      'resolution',
      mp <= 2.5 ? 'PASS' : 'FAIL',
      `${mp.toFixed(2)}MP` +
        (mp > 2.5 ? ' — over the ~2.5MP ceiling; flux-1.1-pro-ultra was banned for defeating face detection at ~4MP' : '')
    );
  }

  // LATENCY over a few samples — one render is not a p95.
  const more = await P.pool(
    Array.from({ length: 3 }, (_, i) => () =>
      P.rawRender(model, `A quiet harbour at dawn, boat number ${i + 1}.`, env)
    ),
    3
  );
  for (const m of more) {
    if (m && m.ok) {
      timings.push(m.elapsedMs);
      if (m.costUsd) costs.push(m.costUsd);
    }
  }
  timings.sort((a, b) => a - b);
  const p50 = timings[Math.floor(timings.length / 2)] / 1000;
  const p95 = timings[timings.length - 1] / 1000;
  record(
    'latency',
    p95 < 140 ? 'PASS' : 'FAIL',
    `p50 ${p50.toFixed(1)}s · p95 ${p95.toFixed(1)}s (RENDER_TIMEOUT_MS is 140s, gateway 150s)`
  );

  if (costs.length) {
    const avg = costs.reduce((a, b) => a + b, 0) / costs.length;
    record('cost', avg <= 0.05 ? 'PASS' : 'INFO', `$${avg.toFixed(3)}/render (measured from usage tokens)`);
  } else {
    record('cost', 'INFO', 'no token usage returned — check Replicate pricing for this model manually');
  }
  return true;
}

// ── phase 2: the art ──────────────────────────────────────────────────────────
async function phase2(model) {
  say('\n▸ PHASE 2 — medium fidelity, prompt adherence, hard priors  (CLEAN ROOM)');
  say(`   n=${N} per family. Judge these yourself; this tool deliberately does not grade style.`);

  const jobs = [];
  for (const fam of P.MEDIUM_FAMILIES) {
    for (let i = 0; i < N; i++) {
      jobs.push(async () => {
        const r = await P.rawRender(model, fam.prompt.replace('{S}', P.MEDIUM_SUBJECT), env);
        if (!r.ok) return { fam: fam.key, ok: false, error: r.error };
        const file = P.save(r.buf, path.join(OUT, 'medium'), `${fam.key}-${i + 1}`);
        let album = null;
        if (USE_ALBUM) {
          album = await toAlbum(sb, KEVIN, r.buf, {
            label: `${model.split('/').pop()} · ${fam.label} ${i + 1}/${N}`,
            model,
            medium: fam.key,
            prompt: fam.prompt.replace('{S}', P.MEDIUM_SUBJECT),
            width: r.width,
            height: r.height,
          });
        }
        return { fam: fam.key, ok: true, file, album };
      });
    }
  }
  const out = await P.pool(jobs, 3);
  const perFam = {};
  for (const o of out) {
    if (!o) continue;
    (perFam[o.fam] = perFam[o.fam] || { ok: 0, fail: 0 })[o.ok ? 'ok' : 'fail']++;
  }
  record(
    'medium_fidelity',
    'REVIEW',
    Object.entries(perFam)
      .map(([k, v]) => `${k} ${v.ok}/${v.ok + v.fail} rendered`)
      .join(' · ') + (USE_ALBUM ? ' → in your Dreams album, tagged 🔬 EVAL' : ` → ${OUT}/medium`),
    { dir: path.join(OUT, 'medium') }
  );

  // ADHERENCE — a countable prompt rather than an impression.
  const adh = await P.pool(
    Array.from({ length: Math.min(N, 5) }, () => () => P.rawRender(model, P.ADHERENCE.prompt, env)),
    3
  );
  adh.forEach((r, i) => r && r.ok && P.save(r.buf, path.join(OUT, 'adherence'), `adherence-${i + 1}`));
  record(
    'prompt_adherence',
    'REVIEW',
    `${adh.filter((r) => r && r.ok).length} renders — count these facts in each: ${P.ADHERENCE.facts.join(', ')}`,
    { dir: path.join(OUT, 'adherence'), facts: P.ADHERENCE.facts }
  );

  // PRIORS — a map, not a grade.
  for (const prior of P.PRIORS) {
    const rs = await P.pool(
      Array.from({ length: Math.min(N, 5) }, () => () => P.rawRender(model, prior.prompt, env)),
      3
    );
    rs.forEach((r, i) => r && r.ok && P.save(r.buf, path.join(OUT, 'priors'), `${prior.key}-${i + 1}`));
    say(`   · prior ${prior.key}: ${rs.filter((r) => r && r.ok).length} renders — ${prior.looking_for}`);
  }
  record('hard_priors', 'REVIEW', `probes saved to ${OUT}/priors — record what it will not be argued out of`);

  // SCENE COVERAGE — the range nightly actually demands, not one lucky cell.
  say('\n   scene coverage — interior/exterior, six lighting types, landscape and couples:');
  const sceneN = Math.max(2, Math.min(3, N));
  const sceneJobs = [];
  for (const sc of P.SCENE_MATRIX) {
    for (let i = 0; i < sceneN; i++) {
      sceneJobs.push(async () => {
        const r = await P.rawRender(model, sc.prompt, env);
        if (!r.ok) return { sc, ok: false, error: r.error };
        P.save(r.buf, path.join(OUT, 'scenes'), `${sc.key}-${i + 1}`);
        let album = null;
        if (USE_ALBUM) {
          album = await toAlbum(sb, KEVIN, r.buf, {
            label: `${model.split('/').pop()} · ${sc.key} ${i + 1}/${sceneN}`,
            model,
            medium: sc.key,
            prompt: sc.prompt,
            width: r.width,
            height: r.height,
          });
        }
        // Where the scene is supposed to contain people, ask the real detector whether
        // it does — a couple scene that renders one merged figure is a swap failure
        // waiting to happen, and it is invisible in a thumbnail.
        let faces = null;
        if (sc.people && album) {
          const a = await P.analyze(album.url, env);
          faces = a ? (a.significantFaces ?? a.faceCount) : null;
        }
        return { sc, ok: true, faces };
      });
    }
  }
  const scenes = await P.pool(sceneJobs, 3);
  const perScene = {};
  for (const s of scenes) {
    if (!s || !s.sc) continue;
    const e = (perScene[s.sc.key] = perScene[s.sc.key] || { axis: s.sc.axis, ok: 0, fail: 0, faces: [] });
    e[s.ok ? 'ok' : 'fail']++;
    if (s.faces != null) e.faces.push(s.faces);
  }
  for (const [key, e] of Object.entries(perScene)) {
    const faceNote = e.faces.length
      ? ` · faces ${e.faces.join('/')}${e.faces.every((f) => f === 2) ? '' : ' ⚠ not a clean couple'}`
      : '';
    say(`     ${key.padEnd(18)} ${e.ok}/${e.ok + e.fail}  ${e.axis}${faceNote}`);
  }
  const anyFail = Object.values(perScene).some((e) => e.fail > 0);
  const coupleTrouble = Object.values(perScene).some(
    (e) => e.faces.length && !e.faces.every((f) => f === 2)
  );
  record(
    'scene_range',
    anyFail ? 'FAIL' : 'REVIEW',
    (anyFail ? 'some cells failed to render. ' : '') +
      (coupleTrouble
        ? 'a couple cell did NOT give two clean faces — check whether it is the NIGHT/low-light one, which is exactly where flux couples break. '
        : '') +
      `judge each cell for LUSHNESS, not just correctness — a right-but-empty frame fails the product. ${
        USE_ALBUM ? 'In your Dreams album.' : `${OUT}/scenes`
      }`,
    { perScene }
  );
  await vibeProbe(model);
  return true;
}

/**
 * Do our authored vibe fragments actually move this model?
 *
 * PAIRED, with a within-arm control: the identical scene rendered WITH the fragment and
 * WITHOUT it. Rendering a vibe on its own and deciding it "looks cozy" proves nothing —
 * that is precisely the mistake that let the vibe fragment reach 0 of 50 nightlies while
 * every render looked plausible. Only the pair shows whether the fragment did anything.
 *
 * Clean room, so this isolates "does the MODEL respond to this text" from "does the
 * ENGINE deliver it" — two separate questions that were conflated for weeks.
 */
async function vibeProbe(model) {
  const { data: vibes } = await sb
    .from('dream_vibes')
    .select('key, label, flux_fragment, fragment_position')
    .eq('is_active', true)
    .not('flux_fragment', 'is', null);
  if (!vibes || !vibes.length) {
    record('vibe_fidelity', 'SKIP', 'no active vibes carry a flux_fragment');
    return;
  }
  // A spread of strongly VISUAL vibes where a failure is obvious to the eye. Falls back
  // to whatever the catalogue holds, so this follows the live data rather than a list
  // that rots.
  const preferred = ['cozy', 'moonlit__wild', 'bioluminescent', 'dark', 'chaos'];
  const picked = preferred
    .map((k) => vibes.find((v) => v.key === k))
    .filter(Boolean)
    .concat(vibes.filter((v) => !preferred.includes(v.key)))
    .slice(0, 5);

  const SCENE = 'a stone terrace overlooking a wide valley, with a table and two chairs';
  say('\n   vibe fidelity — each vibe rendered WITH its fragment and WITHOUT it (the control):');

  const jobs = [];
  for (const v of picked) {
    for (const arm of ['with', 'without']) {
      jobs.push(async () => {
        // fragment_position 'early' means ahead of the scene; anything else trails it.
        const prompt =
          arm === 'without'
            ? SCENE
            : v.fragment_position === 'early'
              ? `${v.flux_fragment}, ${SCENE}`
              : `${SCENE}, ${v.flux_fragment}`;
        const r = await P.rawRender(model, prompt, env);
        if (!r.ok) return { v, arm, ok: false };
        P.save(r.buf, path.join(OUT, 'vibes'), `${v.key}-${arm}`);
        if (USE_ALBUM) {
          await toAlbum(sb, KEVIN, r.buf, {
            label: `${model.split('/').pop()} · vibe ${v.key} · ${arm.toUpperCase()} fragment`,
            model,
            medium: v.key,
            prompt,
            width: r.width,
            height: r.height,
          });
        }
        return { v, arm, ok: true };
      });
    }
  }
  const out = await P.pool(jobs, 3);
  for (const v of picked) {
    const got = out.filter((o) => o && o.v && o.v.key === v.key && o.ok).length;
    say(`     ${v.key.padEnd(18)} ${got}/2 rendered  “${String(v.flux_fragment).slice(0, 58)}…”`);
  }
  record(
    'vibe_fidelity',
    'REVIEW',
    `${picked.length} paired comparisons. For each pair ask ONLY: did the fragment move the render in the ` +
      `direction it describes? Judge the PAIR, never a single render. ${
        USE_ALBUM ? 'Pairs are in your Dreams album, labelled WITH / WITHOUT.' : `${OUT}/vibes`
      }`
  );
}

// ── phase 3: geometry + composition, measured by the real detector ────────────
async function phase3(model) {
  say('\n▸ PHASE 3 — geometry and composition  (scored by the swap’s OWN detector)');
  if (!env.DUAL_SWAP_FLY_URL || !env.DUAL_SWAP_FLY_TOKEN) {
    record('geometry', 'SKIP', 'DUAL_SWAP_FLY_URL / _TOKEN not in .env.local — cannot reach /analyze');
    return true;
  }

  // Sampled ACROSS LIGHTING, not once in daylight: flux couples fail the dual swap on
  // night vibes specifically (1/10 vs 16/28) while its solos are 7/7, so a geometry probe
  // that only sees sunshine will pass a model that breaks every dark couple in production.
  const perCondition = Math.max(3, Math.ceil(N / P.GEOMETRY_CONDITIONS.length));
  const jobs = [];
  for (const cond of P.GEOMETRY_CONDITIONS) {
    for (let i = 0; i < perCondition; i++) {
      jobs.push(async () => {
        const r = await P.rawRender(model, cond.prompt, env);
        if (!r.ok) return { cond, ok: false };
        P.save(r.buf, path.join(OUT, 'geometry'), `${cond.key}-${i + 1}`);
        // /analyze takes a URL, so the render has to be reachable. Push it to the album
        // (private) and hand over that public storage URL.
        const album = await toAlbum(sb, KEVIN, r.buf, {
          label: `${model.split('/').pop()} · geometry ${cond.key} ${i + 1}`,
          model,
          prompt: cond.prompt,
          width: r.width,
          height: r.height,
        });
        const a = album ? await P.analyze(album.url, env) : null;
        return { cond, ok: true, analyze: a };
      });
    }
  }
  const rs = await P.pool(jobs, 3);

  const measured = rs.filter((r) => r && r.ok && r.analyze);
  if (!measured.length) {
    record('geometry', 'SKIP', 'no renders could be analyzed (upload or Fly probe failed)');
    return true;
  }
  const isTwo = (r) => (r.analyze.significantFaces ?? r.analyze.faceCount) === 2;
  const byCond = {};
  for (const r of measured) {
    const e = (byCond[r.cond.key] = byCond[r.cond.key] || { light: r.cond.light, ok: 0, n: 0 });
    e.n++;
    if (isTwo(r)) e.ok++;
  }
  for (const [key, e] of Object.entries(byCond)) {
    say(`     ${key.padEnd(14)} ${e.ok}/${e.n} gave 2 separable faces  (${e.light})`);
  }
  const twoFaces = measured.filter(isTwo);
  const pass = twoFaces.length >= Math.ceil(measured.length * (7 / 9));
  // Report per-condition rather than averaged: a model that holds geometry by day and
  // loses it at night is a DIFFERENT finding from one that is uniformly mediocre, and
  // averaging hides exactly the failure flux has.
  const weak = Object.entries(byCond).filter(([, e]) => e.ok / e.n < 7 / 9);
  record(
    'geometry',
    pass && !weak.length ? 'PASS' : 'FAIL',
    `${twoFaces.length}/${measured.length} overall` +
      (weak.length ? ` · WEAK in: ${weak.map(([k]) => k).join(', ')}.` : '.') +
      ' ' +
      (pass && !weak.length
        ? 'This model can be TOLD about head placement, in every lighting condition — flux-1.1-pro cannot, and that is what costs 21% of couples their +1.'
        : weak.some(([k]) => k === 'night' || k === 'interior_low')
          ? 'It loses head separation in LOW LIGHT — the same shape as the flux night-vibe failure. Couples will degrade on dark nightlies.'
          : 'Like flux-1.1-pro, this model will not honour a head-gap instruction. Do not plan a couple fix around prompting it.')
  );

  const fracs = measured.map((r) => r.analyze.bboxFrac).filter((f) => typeof f === 'number').sort((a, b) => a - b);
  if (fracs.length) {
    const med = fracs[Math.floor(fracs.length / 2)];
    record(
      'composition',
      'INFO',
      `median face bboxFrac ${med.toFixed(3)} — ` +
        (med > 0.08
          ? 'a TIGHT framer: pasted faces will be large, so the swap will be visible on painted looks. That is face scale, not a medium failure.'
          : 'frames wide enough that the swap should sit unobtrusively in painted looks.')
    );
  }
  return true;
}

// ── what a run will cost, BEFORE it spends anything ───────────────────────────
/**
 * Every render here is a real paid API call — there is no way to measure aspect ratio,
 * latency, true cost or swap survival without rendering. So the run is costed up front
 * and `--estimate` prints it without spending a cent.
 *
 * The counts are DERIVED from the same constants the phases loop over, not typed in, so
 * this cannot drift away from what the run actually does when a scene or a vibe is added.
 */
function plan(familyCount = 6) {
  const sceneN = Math.max(2, Math.min(3, N));
  const perCondition = Math.max(3, Math.ceil(N / P.GEOMETRY_CONDITIONS.length));
  const rows = [
    ['0', 'plumbing', 1],
    ['1', 'latency samples', 3],
    ['2', `medium fidelity (${P.MEDIUM_FAMILIES.length} families × ${N})`, P.MEDIUM_FAMILIES.length * N],
    ['2', 'prompt adherence', Math.min(N, 5)],
    ['2', `hard priors (${P.PRIORS.length} × ${Math.min(N, 5)})`, P.PRIORS.length * Math.min(N, 5)],
    ['2', `scene range (${P.SCENE_MATRIX.length} scenes × ${sceneN})`, P.SCENE_MATRIX.length * sceneN],
    ['2', 'vibe fidelity (5 vibes × with/without)', 10],
    ['3', `geometry (${P.GEOMETRY_CONDITIONS.length} lighting × ${perCondition})`, P.GEOMETRY_CONDITIONS.length * perCondition],
    ['4', `swap per look family (${familyCount})`, familyCount],
  ];
  return { rows, total: rows.reduce((a, r) => a + r[2], 0) };
}

/** Per-render prices we have MEASURED, for scale. A candidate's real price is not known
 *  until phase 1 measures it — which is itself one of the reasons to run phase 1 first. */
const KNOWN_PRICES = [
  ['flux-1.1-pro', 0.04],
  ['gemini-2-image', 0.039],
  ['gpt-image-2.5 (high)', 0.042],
  ['gpt-image-2.5 (medium)', 0.011],
];

function printEstimate(familyCount) {
  const { rows, total } = plan(familyCount);
  say('\n  Renders this run will make:');
  for (const [phase, what, n] of rows) say(`    phase ${phase}  ${String(n).padStart(3)}  ${what}`);
  say(`    ${' '.repeat(9)}${String(total).padStart(3)}  TOTAL`);
  say('\n  Estimated cost at measured per-render prices:');
  for (const [label, price] of KNOWN_PRICES) {
    say(`    $${(total * price).toFixed(2).padStart(6)}   if it prices like ${label} ($${price.toFixed(3)}/render)`);
  }
  say('\n  Phase 4 also runs Sonnet briefs (~$0.02 each, so well under $0.20 total) and the');
  say('  face swap, which runs on the existing Fly machine and is not billed per call.');
  say('\n  A model that FAILS early costs almost nothing — that is what the gating is for:');
  say('    1 render  (~$0.04)  cannot be called at all');
  say('    4 renders (~$0.16)  wrong aspect ratio, or too slow — both unfixable, run stops');
  say(`\n  --n <N> scales the sampled phases (default ${N}). Below n=9 the medium and look`);
  say('  verdicts stop being trustworthy: variance dominates, and n=1-3 produced two of');
  say('  the four wrong verdicts this whole skill exists to prevent.');
}

// ── phase 4: the swap, once per LOOK FAMILY ───────────────────────────────────
/**
 * One representative look from each family, swapped.
 *
 * Per FAMILY and not per look (Kevin): the 57 looks collapse into 7 families that behave
 * alike under a swap, so one render each covers the real variation at a seventh of the
 * cost. What varies between families is how a pasted photographic face SITS in the style
 * — it disappears into a photographic look by definition, and it has the furthest to
 * travel in watercolor and comic_print. That is the thing being looked at here.
 */
async function pickFamilyLooks() {
  const { data } = await sb
    .from('dream_mediums')
    .select('key, label, nightly_family, weight')
    .eq('nightly_look', true)
    .eq('is_active', true);
  const byFam = {};
  for (const r of data || []) {
    const fam = r.nightly_family;
    if (!fam) continue; // holiday looks have no family and are seasonal — not representative
    if (!byFam[fam] || (r.weight || 0) > (byFam[fam].weight || 0)) byFam[fam] = r;
  }
  return Object.entries(byFam).map(([family, row]) => ({ family, key: row.key, label: row.label }));
}

/** A real cast to swap: lift the slot input from one of Kevin's own recent dual renders
 *  rather than inventing one, so the faces, relationship and anchors are production-shaped. */
async function castSeed() {
  const { data } = await sb
    .from('ai_generation_log')
    .select('rolled_axes')
    .eq('user_id', KEVIN)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(60);
  for (const r of data || []) {
    const a = r.rolled_axes;
    if (!a || a.dreamType !== 'face_swap_dual') continue;
    const si = a.observability && a.observability.slotInput;
    if (si && Array.isArray(si.cast) && si.cast.some((c) => c.role === 'plus_one')) return si;
  }
  return null;
}

async function phase4(model) {
  say('\n▸ PHASE 4 — face swap across every look family');
  const TOK = env.DREAM_QUEUE_WORKER_TOKEN;
  if (!TOK) {
    record('swap_technical', 'SKIP', 'DREAM_QUEUE_WORKER_TOKEN missing from .env.local');
    return;
  }
  const seed = await castSeed();
  if (!seed) {
    record('swap_technical', 'SKIP', 'no recent dual face-swap render to lift a cast from');
    return;
  }
  const families = await pickFamilyLooks();
  say(`   ${families.length} families · 1 swapped render each · ${model}`);

  const rows = await P.pool(
    families.map((fam) => async () => {
      await waitForHeadroom({ min: 25, label: `eval:${fam.family}` });
      const res = await fetch(
        'https://jimftynwrinwenonjrlj.supabase.co/functions/v1/nightly-dreams',
        {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + TOK, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: KEVIN,
            persist: true,
            force_model: model,
            qa_pin_look: fam.key, // NEVER force_look — it aliases to force_medium (§4)
            force_cast_role: 'dual',
            force_face_swap_eligible: true,
          }),
        }
      );
      const p = await res.json().catch(() => ({}));
      if (!p.upload_id) return { fam, ok: false, error: p.error || res.status };
      await sb
        .from('uploads')
        .update({ caption: `🔬 EVAL swap · ${fam.family} · ${model.split('/').pop()}` })
        .eq('id', p.upload_id);

      const { data: logs } = await sb
        .from('ai_generation_log')
        .select('fallback_reasons, rolled_axes')
        .eq('upload_id', p.upload_id)
        .limit(1);
      const log = logs && logs[0];
      const stamps = ((log && log.fallback_reasons) || []).map(String);
      const degraded = stamps.some((s) => /dual_degrade_single|degrade_solo|solo_rebuild/.test(s));
      const sim = stamps.find((s) => s.startsWith('identity_sim:')) || null;

      // THE BASE — the model's own work, before the swap touched it. Same seed as the
      // final, so this pair is the only honest way to see what the swap cost (§1).
      const rawUrl = log && log.rolled_axes && log.rolled_axes.observability
        ? log.rolled_axes.observability.replicateRawUrl
        : null;
      if (rawUrl && rawUrl.startsWith('data:')) {
        P.save(
          Buffer.from(rawUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
          path.join(OUT, 'swap'),
          `${fam.family}-BASE`
        );
      }
      return { fam, ok: true, degraded, sim, stamps, imageUrl: p.image_url };
    }),
    3 // hard rule: the DB pool is the shared ceiling
  );

  const done = rows.filter((r) => r && r.ok);
  for (const r of done) {
    say(
      `     ${r.fam.family.padEnd(18)} ${r.degraded ? '✗ DEGRADED' : '✓ swap held'}  ${r.sim || ''}`
    );
  }
  const degradeRate = done.length ? done.filter((r) => r.degraded).length / done.length : 1;
  record(
    'swap_technical',
    done.length === 0 ? 'SKIP' : degradeRate <= 0.1 ? 'PASS' : 'FAIL',
    done.length === 0
      ? 'no renders completed'
      : `${Math.round(degradeRate * 100)}% degraded across ${done.length} families ` +
        `(bar ≤10%; production baseline on flux is 21% over 105 couples)`
  );
  record(
    'swap_natural',
    'REVIEW',
    `BASE vs swapped pairs per family — bases in ${OUT}/swap, finals in your Dreams album tagged 🔬 EVAL swap. ` +
      'Compare within a family, not across: the question is whether the pasted face sits in THAT style at this ' +
      'model’s own face scale. Watercolor and comic_print are where a photographic face has furthest to travel.'
  );
}

// ── report ────────────────────────────────────────────────────────────────────
function report(model, resolution) {
  say('\n' + '═'.repeat(78));
  say(`  VERDICT — ${model}`);
  if (resolution.description) say(`  ${resolution.description}`);
  say('═'.repeat(78));

  const fatalFails = D.fatalKeys().filter((k) => results[k] && results[k].verdict === 'FAIL');
  const fails = Object.entries(results).filter(([, v]) => v.verdict === 'FAIL');
  const review = Object.entries(results).filter(([, v]) => v.verdict === 'REVIEW');

  for (const d of D.DIMENSIONS) {
    const r = results[d.key];
    if (!r) continue;
    say(`  ${r.verdict.padEnd(7)} ${d.title}`);
  }

  say('');
  if (fatalFails.length) {
    say(`  ⛔ REJECT — fatal: ${fatalFails.join(', ')}.`);
    say('     These are not tunable. A model that fails them cannot ship on any path.');
  } else if (fails.length) {
    say(`  ⚠️  CONDITIONAL — failed: ${fails.map(([k]) => k).join(', ')}.`);
    say('     Check scene_only: a model that fails the cast dimensions can still earn a');
    say('     place in pure-scene nightlies and bots via scene_eligible_models.');
  } else {
    say('  ✅ CLEARS THE AUTOMATIC BARS.');
  }
  if (review.length) {
    say(`\n  STILL NEEDS YOUR EYES: ${review.map(([k]) => k).join(', ')}`);
    say('  Judge these in the app, on the BASE renders, at n≥9. Follow');
    say('  .claude/skills/model-eval/SKILL.md for how to call each one.');
  }
  say(`\n  renders: ${OUT}`);
  fs.writeFileSync(
    path.join(OUT, 'report.json'),
    JSON.stringify({ model, resolution, results, n: N }, null, 2)
  );
}

// ── main ──────────────────────────────────────────────────────────────────────
(async () => {
  say(`\nEvaluating: "${QUERY}"`);
  const resolution = await resolveModel(QUERY);
  if (resolution.ambiguous) {
    say(`\n  ✗ ${resolution.note}`);
    say('\n  Closest matches:');
    resolution.candidates.forEach((c) =>
      say(`     ${c.id}${c.description ? '   ' + c.description : ''}`)
    );
    say('\n  Nothing was rendered. Re-run with an exact id — this tool will not guess,');
    say('  because a plausible report about the wrong model is worse than no report.');
    process.exit(1);
  }
  if (resolution.exists === false) {
    say(`\n  ✗ ${resolution.note}`);
    say('  Nothing was rendered. Check the name before spending anything on it.');
    process.exit(1);
  }
  const model = resolution.id;
  say(`  model: ${model}  ·  provider: ${P.providerFor(model)}  ·  n=${N}`);

  // Real families, so the estimate matches the run rather than assuming six.
  let familyCount = 6;
  try {
    familyCount = (await pickFamilyLooks()).length || 6;
  } catch {
    /* fall back to the usual count */
  }
  if (has('estimate')) {
    printEstimate(familyCount);
    say('\n  Nothing was rendered. Drop --estimate to run it.');
    return;
  }
  const { total } = plan(familyCount);
  say(`  this run will make ~${total} renders — see --estimate for the cost breakdown`);

  // The engine-touching phases share the DB pool with the live app.
  await waitForHeadroom({ min: 25, label: 'model-eval' });

  const run = (p) => ONLY_PHASE === null || ONLY_PHASE === p;

  let first = null;
  if (run(0)) {
    first = await phase0(model);
    if (!first) return report(model, resolution);
  }
  if (run(1) && first) {
    await phase1(model, first);
    if (results.aspect && results.aspect.verdict === 'FAIL') {
      say('\n  Stopping: a wrong aspect ratio cannot be tuned away, so the remaining');
      say('  phases would only tell you how good an unusable model is.');
      return report(model, resolution);
    }
    if (results.latency && results.latency.verdict === 'FAIL') {
      say('\n  Stopping: renders that cross the timeout FAIL in production after');
      say('  consuming a queue slot and a sparkle charge.');
      return report(model, resolution);
    }
  }
  if (run(2)) await phase2(model);
  if (run(3)) await phase3(model);
  if (run(4)) await phase4(model);

  report(model, resolution);
})().catch((e) => {
  console.error('\neval-model crashed:', e.message);
  process.exit(1);
});
