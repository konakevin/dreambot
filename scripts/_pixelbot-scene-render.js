#!/usr/bin/env node
/**
 * PixelBot scene-path SHADOW render wrapper (PIXELBOT_SCENES_PLAN.md §4).
 *
 * Renders N shadow posts (hidden: shadow=true / is_public=false / is_posted=false,
 * visible only to the supreme admin in-app) for one scene path, WITHOUT the
 * path needing to be wired into index.js yet (in-memory patch via scenePaths).
 * Reuses the real posting pipeline end to end. Also the tool for the look check.
 *
 *   node scripts/_pixelbot-scene-render.js --path pixel-vista --count 5 --label pixel-vista-r0
 *   node scripts/_pixelbot-scene-render.js --path pixel-vista --count 1 --label look-3 --look 3
 *   [--vibe <key>]   force a vibe    [--look <i>]  force look-register index i
 *   [--models flux2] pin the flux-2 family (flux-dev + ultra are excluded on this bot)
 */
const { runBot } = require('./lib/botEngine');
const bot = require('./bots/pixelbot');
const pools = require('./bots/pixelbot/pools');
const scene = require('./bots/pixelbot/scenePaths');
const fs = require('fs');

const argv = process.argv.slice(2);
const arg = (n, fb) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : fb; };
const key = arg('path'); const count = parseInt(arg('count', '5'), 10); const label = arg('label', `${key}-r0`);
const vibe = arg('vibe', 'random'); const look = arg('look', null);
// --models flux2 pins the flux-2 family. Without this the in-memory patch used
// to hand every path all five SCENE_MODELS, including the two that are excluded
// on this bot (flux-dev and flux-1.1-pro-ultra render smooth paintings with no
// pixel structure, and ultra signs its work) — which cost one path 3 of its 5
// round-0 renders. A path can also self-declare via `module.exports.models`.
const modelsArg = arg('models', null);
const MODEL_SETS = {
  flux2: {
    'black-forest-labs/flux-2-pro': 1,
    'black-forest-labs/flux-2-max': 1,
    'black-forest-labs/flux-2-flex': 1,
  },
};
if (!key) { console.error('usage: --path <key> [--count N] [--label L] [--vibe v] [--look i] [--models flux2]'); process.exit(2); }
if (modelsArg && !MODEL_SETS[modelsArg]) { console.error('unknown --models set:', modelsArg, '(known:', Object.keys(MODEL_SETS).join(', '), ')'); process.exit(2); }

const builder = require(`./bots/pixelbot/paths/${key}`);
scene.patchInMemory(bot, key, builder, modelsArg ? { models: MODEL_SETS[modelsArg] } : {});
if (look !== null) {
  const entry = pools.PIXELBOT_LOOK_REGISTER[parseInt(look, 10)];
  if (!entry) { console.error('no look at index', look); process.exit(2); }
  const orig = bot.rollSharedDNA;
  bot.rollSharedDNA = (a) => ({ ...orig(a), lookRegister: entry });
  console.log(`⚡ look forced [${look}]: ${entry.slice(0, 60)}…`);
}
const outDir = `/tmp/pixelbot-${label}`;
fs.mkdirSync(outDir, { recursive: true });
console.log(`🤖 PixelBot scene SHADOW render — path=${key} count=${count} label=${label} vibe=${vibe}`);
(async () => {
  const results = [];
  for (let i = 1; i <= count; i++) {
    console.log(`━━━ #${i}/${count} | ${key} ━━━`);
    try {
      const r = await runBot({ bot, path: key, vibe, dryRun: false, outDir, label, idx: i, post: true, shadow: true, source: 'iter-bot' });
      results.push({ i, ok: r.ok !== false, imageUrl: r.imageUrl, error: r.error });
      console.log(r.ok === false ? `   ❌ ${r.errorStage} ${r.error}` : `   ✅ posted(shadow): ${r.imageUrl}`);
    } catch (e) { results.push({ i, ok: false, error: e.message }); console.log(`   ❌ ${e.message}`); }
  }
  fs.writeFileSync(`${outDir}/manifest.json`, JSON.stringify({ key, label, look, results, at: new Date().toISOString() }, null, 2));
  console.log(`━━━ Done: ${results.filter((r) => r.ok).length} ok, ${results.filter((r) => !r.ok).length} failed ━━━`);
})();
