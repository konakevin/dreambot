#!/usr/bin/env node
/**
 * Paired pure-scene + holiday nightly renders, Sonnet 4.6 vs 5.5 (LLM_5_5_TUNING.md W3 / 3.2). These paths write the
 * prompt with the `nightly_brief` job (no people, no face swap). Each pair, on Kevin's account (private album):
 *   A  4.6: force_pure_scene (+ force_holiday_scene) + force_place, everything else rolled as in production
 *   B  5.5: the same flags, plus A's look (qa_pin_look), vibe (force_vibe) and image model (force_model), and
 *           force_llm_model. The place is pinned; the spot inside it, time, weather and camera still roll.
 * Results → <out>/results.json (resumable: finished pairs are skipped). Build the blind vote from it.
 *
 *   node scripts/lab-llm-scene-pairs.js --out=DIR [--pure=12] [--holiday=fall:4,halloween:4] [--arm55=claude-sonnet-5-5@high]
 *     [--c-overlays=k1,k2]   (a third side on the same pinned roll; resume on the same --out)
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');

const URL_ = process.env.EXPO_PUBLIC_SUPABASE_URL;
const TOK = process.env.DREAM_QUEUE_WORKER_TOKEN;
const sb = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY);
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};
const OUT = arg('out', '');
const PURE = Number(arg('pure', '12'));
const HOLIDAY = arg('holiday', 'fall:4,halloween:4')
  .split(',')
  .filter(Boolean)
  .flatMap((x) => {
    const [k, n] = x.split(':');
    return Array.from({ length: Number(n || 1) }, () => k);
  });
const ARM55 = arg('arm55', 'claude-sonnet-5-5@high');
// --c-overlays=k1,k2: a third side C = B's exact flags + these QA overlays (force_llm_overlays), added to pairs that
// already have A and B (resume on the same --out). Tests one 5.5 prompt change against the same pinned roll.
const C_OVERLAYS = arg('c-overlays', '');
if (!OUT) throw new Error('--out=DIR is required');
fs.mkdirSync(OUT, { recursive: true });
const RESULTS = path.join(OUT, 'results.json');

async function render(body) {
  await waitForHeadroom({ min: 25, label: 'llm-scene-pairs' });
  const t0 = Date.now();
  const since = new Date(t0 - 5000).toISOString();
  let p = {};
  let netErr = null;
  try {
    const res = await fetch(`${URL_}/functions/v1/nightly-dreams`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOK}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: KEVIN, persist: true, ...body }),
      signal: AbortSignal.timeout(200_000),
    });
    p = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  } catch (e) {
    netErr = e.message;
  }
  let uploadId = p.upload_id || null;
  // A long request can lose its response while the render finishes: recover it from the log.
  if (!uploadId && netErr) {
    const want = body.force_llm_model ? 'claude-sonnet-5-5' : 'claude-sonnet-4-6';
    const { data } = await sb
      .from('ai_generation_log')
      .select('upload_id,fallback_reasons')
      .eq('user_id', KEVIN)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(10);
    const hit = (data || []).find(
      (r) =>
        r.upload_id && (r.fallback_reasons || []).some((s) => s === `llm:nightly_brief:${want}`)
    );
    uploadId = hit ? hit.upload_id : null;
  }
  if (!uploadId)
    return {
      error: String(p.error || netErr || 'no upload'),
      seconds: Math.round((Date.now() - t0) / 1000),
    };
  const { data: log } = await sb
    .from('ai_generation_log')
    .select('rolled_axes,model_used,enhanced_prompt,fallback_reasons')
    .eq('upload_id', uploadId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  const fr = (log && log.fallback_reasons) || [];
  const ax = (log && log.rolled_axes) || {};
  return {
    uploadId,
    seconds: Math.round((Date.now() - t0) / 1000),
    engine: ax.engine || null,
    look: ax.medium || null,
    vibe: ax.vibe || null,
    model: (log && log.model_used) || null,
    spot: (ax.seedSource && ax.seedSource.location) || ax.anchor || null,
    llm: fr.filter((s) => /^llm/.test(s)),
    truncated: fr.some((s) => s.startsWith('llm_truncated:nightly_brief')),
    failed: fr.some((s) => /nightly_sonnet_failed|llm_failed:nightly_brief/.test(s)),
    holiday: fr.filter((s) => /^holiday_(roll|scene|day_of)/.test(s)),
    holidayKey: (fr.find((s) => /^holiday_(scene|day_of):/.test(s)) || '').split(':')[1] || null,
    words: log && log.enhanced_prompt ? log.enhanced_prompt.split(/\s+/).length : null,
  };
}

(async () => {
  const { data: rec } = await sb
    .from('user_recipes')
    .select('recipe')
    .eq('user_id', KEVIN)
    .single();
  const places = ((rec.recipe.dream_seeds || {}).places || []).filter(
    (p) => p && !/elven|fantasy/i.test(p)
  );
  const plan = [
    ...Array.from({ length: PURE }, (_, i) => ({ key: `p${i + 1}`, kind: 'pure' })),
    ...HOLIDAY.map((h, i) => ({ key: `h${i + 1}`, kind: 'holiday', holiday: h })),
  ].map((x, i) => ({ ...x, place: places[(i * 7) % places.length] }));
  const done = fs.existsSync(RESULTS)
    ? JSON.parse(fs.readFileSync(RESULTS, 'utf8'))
    : { plan, pairs: {} };
  const save = () => fs.writeFileSync(RESULTS, JSON.stringify(done, null, 1));
  console.log(
    `▶ ${plan.length} pairs (${PURE} pure-scene, ${HOLIDAY.length} holiday), 5.5 = ${ARM55}`
  );
  let next = 0;
  await Promise.all(
    [0, 1].map(async () => {
      while (next < plan.length) {
        const it = plan[next++];
        const prev = done.pairs[it.key];
        if (prev && prev.b && prev.b.uploadId && (!C_OVERLAYS || (prev.c && prev.c.uploadId)))
          continue;
        const flags = {
          force_pure_scene: true,
          force_place: it.place,
          ...(it.holiday ? { force_holiday_scene: it.holiday } : {}),
        };
        const a = (prev && prev.a) || (await render(flags));
        done.pairs[it.key] = { ...it, a };
        save();
        if (!a.uploadId) {
          console.log(`  ${it.key} A failed: ${a.error}`);
          continue;
        }
        // B copies what A rolled: a holiday scene is forced to A's holiday; a plain scene that rolls a holiday
        // (Fall is live at 50%) is re-rendered, up to 3 tries, so both sides are the same kind of dream.
        const bFlags = {
          ...flags,
          ...(a.engine === 'nightly-holiday-scene' && a.holidayKey
            ? { force_holiday_scene: a.holidayKey }
            : {}),
          ...(a.look ? { qa_pin_look: a.look } : {}),
          ...(a.vibe ? { force_vibe: a.vibe } : {}),
          ...(a.model ? { force_model: a.model } : {}),
          force_llm_model: ARM55,
        };
        const renderMatching = async (f) => {
          let r = null;
          const discarded = [];
          for (let t = 0; t < 3; t++) {
            r = await render(f);
            if (!r.uploadId || r.engine === a.engine) break;
            discarded.push(r.uploadId);
          }
          if (discarded.length) r.discarded = discarded;
          return r;
        };
        const b = prev && prev.b && prev.b.uploadId ? prev.b : await renderMatching(bFlags);
        done.pairs[it.key] = { ...it, a, b };
        save();
        if (C_OVERLAYS && b.uploadId) {
          const c = await renderMatching({ ...bFlags, force_llm_overlays: C_OVERLAYS });
          c.overlays = C_OVERLAYS;
          done.pairs[it.key] = { ...it, a, b, c };
          save();
          console.log(
            `  ${it.key} C ${c.uploadId ? `${c.engine} ${c.words}w ${c.llm.join(' ')}` : 'ERROR ' + c.error}`
          );
        }
        const tag = (r) =>
          r.uploadId
            ? `${r.engine} ${r.look} ${r.model && r.model.split('/')[1]} ${r.words}w${r.truncated ? ' TRUNCATED' : ''}${r.failed ? ' FAILED' : ''} ${r.llm.join(' ')}`
            : `ERROR ${r.error}`;
        console.log(
          `  ${it.key} ${it.place}${it.holiday ? ' [' + it.holiday + ']' : ''}\n     A ${tag(a)}\n     B ${tag(b)}`
        );
      }
    })
  );
  const rows = Object.values(done.pairs).filter((p) => p.a && p.b && p.a.uploadId && p.b.uploadId);
  const n = rows.length;
  const count = (arm, f) => rows.filter((p) => f(p[arm])).length;
  console.log(
    `\n${n} pairs complete · truncated 4.6 ${count('a', (r) => r.truncated)}/${n}, 5.5 ${count('b', (r) => r.truncated)}/${n}` +
      ` · failed 4.6 ${count('a', (r) => r.failed)}, 5.5 ${count('b', (r) => r.failed)}` +
      ` · same look ${rows.filter((p) => p.a.look === p.b.look).length}/${n}, same model ${rows.filter((p) => p.a.model === p.b.model).length}/${n}` +
      ` · holiday engine A ${count('a', (r) => r.engine === 'nightly-holiday-scene')}, B ${count('b', (r) => r.engine === 'nightly-holiday-scene')}`
  );
})();
