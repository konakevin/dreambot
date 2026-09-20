/** FLUX COUPLE LAB round runner (Kevin 2026-09-18). N forced couples through the LIVE nightly on the experimental couple
 *  engine, one variable per round. Usage:
 *    node scripts/lab-couple-round.js --round=R1 --variant=narrative [--n=10] [--model=black-forest-labs/flux-1.1-pro]
 *         [--engine=experimental|production] [--big=0.5] [--gate=0.35] [--eyes=false] [--library=true] [--style=legacy]
 *  Writes scratchpad/lab/<round>.json and prints held / failure reasons / delivered face sizes. */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');
const SP =
  '/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad';
const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.slice(k.length + 3) : d;
};
const ROUND = arg('round', 'R0');
const VARIANT = arg('variant', 'narrative');
const N = parseInt(arg('n', '10'), 10);
const MODEL = arg('model', 'black-forest-labs/flux-1.1-pro');
const ENGINE = arg('engine', 'experimental');
const BIG = arg('big', null);
const ACTIVE = arg('active', 'false') === 'true';
const LOOK = arg('look', null);
const VIBE = arg('vibe', null); // pin the vibe too (macabre probe 2026-09-20)
const GATE = arg('gate', null);
const EYES = arg('eyes', 'false');
const LIB = arg('library', 'true');
const HONEST = arg('honest', null); // true | false | null = engine_config.nightly_flux_couple_honest_looks (mig 529)
const STYLE = arg('style', 'legacy');
const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^"|"$/g, ''),
      ];
    })
);
const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec',
  TOK = env.DREAM_QUEUE_WORKER_TOKEN;
const out = [];
let i = 0;
async function one(n) {
  await waitForHeadroom({ min: 25, label: `lab:${ROUND}:${n}` });
  const body = {
    user_id: KEVIN,
    persist: true,
    force_cast_role: 'dual',
    // --model=roll leaves the model to the engine (look-first pool + policy), the production roll.
    ...(MODEL === 'roll' ? {} : { force_model: MODEL }),
    force_prompt_style: STYLE,
    force_eye_lock: EYES !== 'true' ? false : true,
    force_override_library: LIB === 'true',
    force_couple_engine: ENGINE,
    force_couple_variant: VARIANT,
  };
  if (ACTIVE) body.force_active = true;
  if (LOOK) body.force_look = LOOK;
  if (VIBE) body.force_vibe = VIBE;
  if (HONEST === 'true' || HONEST === 'false') body.force_honest_looks = HONEST === 'true';
  if (BIG) body.qa_big_face_max_hfrac = Number(BIG);
  if (GATE) body.qa_max_face_hfrac = Number(GATE);
  const t0 = Date.now();
  const res = await fetch(`${env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/nightly-dreams`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOK}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const p = await res.json().catch(() => ({}));
  const el = Math.round((Date.now() - t0) / 1000);
  if (!p.upload_id) {
    console.log(`#${n} FAILED ${el}s ${p.error || res.status}`);
    out.push({ n, error: p.error || res.status });
    return;
  }
  await sb
    .from('uploads')
    .update({ caption: `✨ LAB ${ROUND} #${n}` })
    .eq('id', p.upload_id);
  const { data: l } = await sb
    .from('ai_generation_log')
    .select('fallback_reasons,model_used,rolled_axes')
    .eq('upload_id', p.upload_id)
    .limit(1);
  const st = ((l && l[0] && l[0].fallback_reasons) || []).map(String);
  const s = st.join(' ');
  const rerendered = /rerender_for_dual/.test(s);
  const degraded = /dual_degrade_single|solo_fallback|SHIPPED_FACELESS|pure_scene_fallback/.test(s);
  const firstFail =
    rerendered || degraded
      ? st
          .slice(0, Math.max(0, st.indexOf('rerender_for_dual')) || st.length)
          .filter((x) =>
            /identity_below_threshold|no_dual_split|dual_reject|face_gate:couple|giant_face_hfrac|side_check_reject/.test(
              x
            )
          )
          .map((x) => x.replace(/:.*$/, ''))
          .join('+') || '?'
      : null;
  const sims = (s.match(/identity_sim:L([\d.-]+)\/R([\d.-]+)/g) || []).map((m) =>
    m.replace('identity_sim:', '')
  );
  const held = !rerendered && !degraded;
  const model = ((l && l[0] && l[0].model_used) || '').split('/').pop();
  const { data: u } = await sb.from('uploads').select('image_url').eq('id', p.upload_id).single();
  const cp =
    (l &&
      l[0] &&
      l[0].rolled_axes &&
      l[0].rolled_axes.observability &&
      l[0].rolled_axes.observability.couplePrompt) ||
    p.prompt_used ||
    '';
  const baseUrl = (st.find((x) => /^dual_target:0:https/.test(x)) || '').replace(
    'dual_target:0:',
    ''
  );
  out.push({
    n,
    upload_id: p.upload_id,
    image_url: u && u.image_url,
    base_url: baseUrl,
    held,
    rerendered,
    degraded,
    firstFail,
    sims,
    model,
    elapsed_s: el,
    prompt: cp,
    stamps: st,
  });
  console.log(
    `#${String(n).padStart(2)} ${el}s ${held ? 'HELD' : rerendered ? `re-rendered (${firstFail}) → ${degraded ? 'DEGRADED' : model}` : 'DEGRADED (' + firstFail + ')'} · id ${sims.join(' ')} · ${st.find((x) => /^couple_engine/.test(x)) || ''}`
  );
}
(async () => {
  const CONC = 3;
  await Promise.all(
    Array.from({ length: CONC }, async () => {
      while (i < N) {
        const n = ++i;
        try {
          await one(n);
        } catch (e) {
          console.log(`#${n} threw ${e.message}`);
          out.push({ n, error: e.message });
        }
      }
    })
  );
  // delivered face sizes (YuNet, same detector as the gate)
  const ok = out.filter((r) => r.upload_id && r.image_url);
  const dir = path.join(SP, 'lab', ROUND);
  fs.mkdirSync(dir, { recursive: true });
  const files = [];
  for (const r of ok) {
    try {
      const b = Buffer.from(await (await fetch(r.image_url)).arrayBuffer());
      const f = path.join(dir, `${r.n}.jpg`);
      fs.writeFileSync(f, b);
      files.push({ id: String(r.n), path: f });
    } catch (_) {}
  }
  fs.writeFileSync(path.join(dir, 'files.json'), JSON.stringify(files));
  try {
    const v = JSON.parse(
      execFileSync(
        'deno',
        [
          'run',
          '--allow-read',
          '--allow-env',
          '--allow-net=esm.sh,cdn.jsdelivr.net,deno.land,jsr.io',
          path.join(SP, '_tmp-split-verdict.ts'),
          path.join(dir, 'files.json'),
        ],
        { encoding: 'utf8', maxBuffer: 64e6, cwd: SP }
      )
        .trim()
        .split('\n')
        .pop()
    );
    const rows = Array.isArray(v) ? v : Object.entries(v).map(([id, x]) => ({ id, ...x }));
    for (const r of rows) {
      const faces = r.faces || r.boxes || [];
      const H = r.height || r.imageHeight || r.h;
      const t =
        r.tallest ??
        r.maxFaceHFrac ??
        r.hfrac ??
        (faces.length && H ? Math.max(...faces.map((f) => f.h || f.height || 0)) / H : null);
      const o = out.find((x) => String(x.n) === String(r.id));
      if (o) o.face = t;
    }
  } catch (e) {
    console.log('face measure skipped:', e.message.slice(0, 80));
  }
  fs.writeFileSync(
    path.join(SP, 'lab', `${ROUND}.json`),
    JSON.stringify(
      {
        round: ROUND,
        variant: VARIANT,
        model: MODEL,
        engine: ENGINE,
        big: BIG,
        gate: GATE,
        eyes: EYES,
        library: LIB,
        style: STYLE,
        look: LOOK,
        vibe: VIBE,
        results: out,
      },
      null,
      1
    )
  );
  const held = ok.filter((r) => r.held);
  const why = {};
  for (const r of ok) if (r.firstFail) why[r.firstFail] = (why[r.firstFail] || 0) + 1;
  const hf = held
    .map((r) => r.face)
    .filter((x) => typeof x === 'number')
    .sort((a, b) => a - b);
  const med = hf.length ? Math.round(hf[Math.floor(hf.length / 2)] * 100) + '%' : '-';
  console.log(
    `\n${ROUND} ${VARIANT} ${MODEL.split('/').pop()}: rendered ${ok.length} · HELD first try ${held.length} (${Math.round((100 * held.length) / Math.max(1, ok.length))}%) · held faces ${hf.map((x) => Math.round(x * 100) + '%').join(' ')} (median ${med}) · failures ${JSON.stringify(why)}`
  );
})();
