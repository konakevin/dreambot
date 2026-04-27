#!/usr/bin/env node
/**
 * iter-bot.js — dev iteration entry point. Batches renders to /tmp for
 * review without posting to DB (unless --post is set).
 *
 * Usage:
 *   node scripts/iter-bot.js --bot <name> [flags]
 *
 * Flags:
 *   --count N         # number of renders (default 5)
 *   --mode X          # 'random' (default), 'mixed' (round-robin), or specific path
 *   --vibe X          # specific vibe (default 'random')
 *   --label X         # string included in saved filenames (default 'iter')
 *   --post            # ALSO post each render to DB + commit dedup + write run log
 *   --dry-run         # skip flux + download (brief-only debug)
 *
 * Examples:
 *   node scripts/iter-bot.js --bot gothbot --count 10 --mode random --label smoke
 *   node scripts/iter-bot.js --bot gothbot --count 5 --mode stare --label stare-iter
 *   node scripts/iter-bot.js --bot gothbot --count 5 --mode mixed --post --label ship1
 *
 * Batch mode: failures log + continue (unlike run-bot.js which fails loud).
 * Dev mode defaults: no DB post, no dedup commit, saves to /tmp/<bot>-<label>/.
 */

const path = require('path');
const { runBot } = require('./lib/botEngine');

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return fallback;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

(async () => {
  const botName = arg('bot');
  if (!botName || typeof botName !== 'string') {
    console.error(
      'Usage: node scripts/iter-bot.js --bot <name> [--count N] [--mode X] [--vibe X] [--label X] [--post] [--dry-run]'
    );
    process.exit(2);
  }

  const count = parseInt(arg('count', '5'), 10);
  const mode = arg('mode', 'random');
  const vibe = arg('vibe', 'random');
  const medium = arg('medium', null); // force a specific medium string — overrides bot.mediums
  const model = arg('model', null); // force a specific model (e.g. 'black-forest-labs/flux-dev')
  const label = arg('label', 'iter');
  const post = arg('post', false) === true;
  const dryRun = arg('dry-run', false) === true;

  let bot;
  try {
    bot = require(path.resolve(`scripts/bots/${botName}/index.js`));
  } catch (err) {
    console.error(`Failed to load bot module scripts/bots/${botName}/: ${err.message}`);
    process.exit(2);
  }

  // Force medium override — temporarily replace the mediums list with just the specified one.
  if (medium && typeof medium === 'string') {
    bot.mediums = [medium];
    delete bot.defaultMedium;
    delete bot.mediumByPath;
    console.log(`⚡ medium forced to: ${medium}`);
  }

  // Force model override — collapse modelByPath to force every render onto a single model.
  // Cross-cuts bot.modelByPath + useModelPicker + allowedModels. Useful for A/B testing models.
  if (model && typeof model === 'string') {
    const forced = {};
    for (const p of bot.paths) forced[p] = model;
    bot.modelByPath = forced;
    console.log(`⚡ model forced to: ${model}`);
  }

  const outDir = `/tmp/${botName}-${label}`;
  console.log(
    `🤖 ${bot.displayName || bot.username} — count=${count} mode=${mode} vibe=${vibe} label=${label} post=${post} dryRun=${dryRun}`
  );
  console.log(`📁 ${outDir}\n`);

  const results = [];
  for (let i = 1; i <= count; i++) {
    let resolvedPath;
    if (mode === 'random' || mode === 'mixed') {
      if (mode === 'mixed') {
        resolvedPath = bot.paths[(i - 1) % bot.paths.length];
      } else {
        resolvedPath = 'random';
      }
    } else {
      resolvedPath = mode;
    }

    console.log(`━━━ #${i}/${count} | path=${resolvedPath} | vibe=${vibe} ━━━`);
    try {
      const r = await runBot({
        bot,
        path: resolvedPath,
        vibe: typeof vibe === 'string' ? vibe : 'random',
        dryRun,
        outDir,
        label,
        idx: i,
        post,
      });
      results.push(r);
      if (!r.ok) {
        console.error(`  ❌ #${i} failed at stage=${r.errorStage}: ${r.error}`);
      } else if (dryRun) {
        console.log(`  DRY — path=${r.path} vibe=${r.vibeKey}`);
        console.log(`  PROMPT: ${r.finalPrompt.slice(0, 200)}...`);
      } else {
        console.log(`  ✅ path=${r.path} vibe=${r.vibeKey} medium=${r.medium}`);
        console.log(`     saved: ${r.localPath}`);
        if (r.imageUrl) console.log(`     posted: ${r.imageUrl}`);
      }
    } catch (err) {
      // runBot throws only in prod mode; batch mode catches internally,
      // but defensive catch here in case of out-of-band error.
      console.error(`  ❌ #${i} exception: ${err.message}`);
      results.push({ ok: false, error: err.message });
    }
    console.log();
  }

  const ok = results.filter((r) => r.ok).length;
  const failed = results.length - ok;
  console.log(`━━━ Done: ${ok} ok, ${failed} failed ━━━`);
  process.exit(failed > 0 ? 1 : 0);
})();
