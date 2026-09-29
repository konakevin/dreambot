#!/usr/bin/env node
/**
 * Bot LLM parity bench, Sonnet 4.6 vs 5.5 (LLM_MIGRATION.md step 1). Brief-only dry runs: no image is
 * rendered, nothing is posted, no run log is written (runBot dryRun, source 'iter-bot' so the production path
 * cycle is untouched).
 *
 * Each arm runs the SAME path sequence for each bot (the pools inside a path still roll), through the real
 * botEngine: the bot_prompt job on the arm's model; the Haiku polish pass, where a bot has one, stays on Haiku.
 * Every Anthropic call is metered (a fetch wrapper): model, stop reason, tokens, latency.
 *
 *   node scripts/qa-llm-parity-bots.js --out=DIR [--bots=a,b] [--runs=10] [--arms=4.6,5.5@high,5.5@medium]
 */
const fs = require('fs');
const path = require('path');
const { AsyncLocalStorage } = require('async_hooks');

for (const l of fs.readFileSync(path.resolve('.env.local'), 'utf8').split('\n')) {
  const i = l.indexOf('=');
  if (i > 0 && !process.env[l.slice(0, i).trim()])
    process.env[l.slice(0, i).trim()] = l.slice(i + 1).trim();
}
const { runBot } = require('./lib/botEngine');

const arg = (name, dflt) => {
  const a = process.argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.slice(name.length + 3) : dflt;
};
const OUT = arg('out', '');
if (!OUT) throw new Error('--out=DIR is required');
const BOTS = arg('bots', 'gothbot,outlawbot,dragonbot,farmbot,mangabot,faebot').split(',');
const RUNS = Number(arg('runs', '10'));
const CONCURRENCY = Number(arg('concurrency', '3'));
const ARMS = arg('arms', '4.6,5.5@high,5.5@medium').split(',');
const OVERRIDE = {
  4.6: null,
  '5.5@high': 'claude-sonnet-5-5@high',
  '5.5@medium': 'claude-sonnet-5-5@medium',
};
fs.mkdirSync(OUT, { recursive: true });

// ── meter ──────────────────────────────────────────────────────────────
const PRICES = {
  'claude-sonnet-4-6': [3, 15],
  'claude-sonnet-5-5': [2, 10],
  'claude-haiku-4-5-20251001': [1, 5],
};
const store = new AsyncLocalStorage();
const calls = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = typeof input === 'string' ? input : input.url || String(input);
  if (!url.startsWith('https://api.anthropic.com/')) return realFetch(input, init);
  let model = '?';
  try {
    model = JSON.parse(String(init && init.body)).model;
  } catch (_e) {
    /* not JSON */
  }
  const t0 = Date.now();
  const res = await realFetch(input, init);
  const c = {
    tag: store.getStore() || null,
    model,
    status: res.status,
    ms: Date.now() - t0,
    stop: null,
    inT: 0,
    outT: 0,
  };
  if (res.ok) {
    try {
      const j = await res.clone().json();
      c.stop = j.stop_reason || null;
      c.inT = (j.usage && j.usage.input_tokens) || 0;
      c.outT = (j.usage && j.usage.output_tokens) || 0;
    } catch (_e) {
      /* unreadable */
    }
  }
  calls.push(c);
  return res;
};
const cost = (c) => {
  const p = PRICES[c.model];
  return p ? (c.inT * p[0] + c.outT * p[1]) / 1e6 : 0;
};

// Words a bot prompt must never carry (BOT_SCENE_QUALITY_PLAYBOOK: named artists flag flux-2, "schoolgirl" flags
// every Flux model).
const SAFETY_WORDS =
  /\b(schoolgirl|greg rutkowski|artgerm|alphonse mucha|hayao miyazaki|studio ghibli|in the style of)\b/i;

(async () => {
  const jobs = [];
  for (const botName of BOTS) {
    const bot = require(path.resolve(`scripts/bots/${botName}/index.js`));
    const paths = (bot.paths || [])
      .map((p) => (typeof p === 'string' ? p : p.name || p.key))
      .filter(Boolean);
    // The same path sequence on every arm: a fixed stride through the bot's paths.
    const seq = Array.from({ length: RUNS }, (_, i) =>
      paths.length ? paths[(i * 7) % paths.length] : 'random'
    );
    for (const arm of ARMS) seq.forEach((p, i) => jobs.push({ botName, bot, arm, path: p, i }));
  }
  console.log(`▶ ${jobs.length} dry runs (${BOTS.length} bots × ${RUNS} × ${ARMS.length} arms)`);
  const rows = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < jobs.length) {
        const j = jobs[next++];
        const tag = `${j.botName}|${j.arm}|${j.i}`;
        const t0 = Date.now();
        try {
          const r = await store.run(tag, () =>
            runBot({
              bot: j.bot,
              path: j.path,
              dryRun: true,
              source: 'iter-bot',
              llmModel: OVERRIDE[j.arm],
            })
          );
          rows.push({
            ...j,
            bot: undefined,
            ok: !!(r && r.ok && r.finalPrompt),
            prompt: (r && r.finalPrompt) || '',
            ms: Date.now() - t0,
          });
        } catch (e) {
          rows.push({
            ...j,
            bot: undefined,
            ok: false,
            error: e.message,
            prompt: '',
            ms: Date.now() - t0,
          });
        }
        process.stdout.write('.');
      }
    })
  );
  console.log('');

  const summary = {};
  for (const arm of ARMS) {
    const rs = rows.filter((r) => r.arm === arm);
    const cs = calls.filter((c) => c.tag && c.tag.split('|')[1] === arm);
    const sonnetModel = OVERRIDE[arm] ? 'claude-sonnet-5-5' : 'claude-sonnet-4-6';
    const own = cs.filter((c) => c.model === sonnetModel && c.status === 200);
    const pct = (n, d) => (d ? Math.round((1000 * n) / d) / 10 : null);
    const q = (xs, p) =>
      xs.length
        ? [...xs].sort((a, b) => a - b)[Math.min(xs.length - 1, Math.floor(p * xs.length))]
        : 0;
    const words = rs.filter((r) => r.prompt).map((r) => r.prompt.split(/\s+/).length);
    const tagsWith = (pred) => new Set(cs.filter(pred).map((c) => c.tag)).size;
    summary[arm] = {
      runs: rs.length,
      ok_pct: pct(rs.filter((r) => r.ok).length, rs.length),
      errors: rs.filter((r) => r.error).map((r) => `${r.botName}: ${r.error.slice(0, 80)}`),
      sonnet_calls: own.length,
      truncated_runs: tagsWith((c) => c.model === sonnetModel && c.stop === 'max_tokens'),
      refusal_runs: tagsWith((c) => c.stop === 'refusal'),
      // A Haiku call on a run whose bot has no polish pass = the Sonnet call failed over to Haiku.
      non200_sonnet_calls: cs.filter((c) => c.model === sonnetModel && c.status !== 200).length,
      safety_word_prompts: rs.filter((r) => SAFETY_WORDS.test(r.prompt)).length,
      words_p50: q(words, 0.5),
      words_p90: q(words, 0.9),
      latency_p50_ms: q(
        own.map((c) => c.ms),
        0.5
      ),
      latency_p95_ms: q(
        own.map((c) => c.ms),
        0.95
      ),
      out_tokens_avg: own.length ? Math.round(own.reduce((a, c) => a + c.outT, 0) / own.length) : 0,
      cost_per_run_usd: rs.length
        ? Number((cs.reduce((a, c) => a + cost(c), 0) / rs.length).toFixed(5))
        : 0,
      by_bot: Object.fromEntries(
        BOTS.map((b) => {
          const br = rs.filter((r) => r.botName === b);
          const bw = br.filter((r) => r.prompt).map((r) => r.prompt.split(/\s+/).length);
          return [
            b,
            { ok: `${br.filter((r) => r.ok).length}/${br.length}`, words_p50: q(bw, 0.5) },
          ];
        })
      ),
    };
  }
  fs.writeFileSync(path.join(OUT, 'bot-rows.json'), JSON.stringify(rows, null, 1));
  fs.writeFileSync(path.join(OUT, 'bot-calls.json'), JSON.stringify(calls));
  fs.writeFileSync(path.join(OUT, 'bot-summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
})().catch((e) => {
  console.error('FAIL', e.message);
  process.exit(1);
});
