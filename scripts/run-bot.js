#!/usr/bin/env node
/**
 * run-bot.js — production entry point for the new bot engine.
 *
 * Renders ONE dream via the bot engine and posts it. Intended to be
 * called by per-bot GitHub Actions workflows on cron.
 *
 * Usage:
 *   node scripts/run-bot.js --bot <name> [--path <path>] [--vibe <key>] [--dry-run]
 *
 * Examples:
 *   node scripts/run-bot.js --bot venusbot                   # random path, random vibe
 *   node scripts/run-bot.js --bot venusbot --path stare      # specific path
 *   node scripts/run-bot.js --bot venusbot --dry-run         # brief only, no flux/post
 *
 * Exit code 0 = success. Non-zero = failure (fail-loud per architecture:
 * run-log row written with status=failed, error_stage, error details).
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
    console.error('Usage: node scripts/run-bot.js --bot <name> [--path X] [--vibe Y] [--dry-run]');
    process.exit(2);
  }

  const botPath = arg('path', 'random');
  const vibe = arg('vibe', 'random');
  const dryRun = arg('dry-run', false) === true;

  let bot;
  try {
    bot = require(path.resolve(`scripts/bots/${botName}/index.js`));
  } catch (err) {
    console.error(`Failed to load bot module scripts/bots/${botName}/: ${err.message}`);
    process.exit(2);
  }

  console.log(`🤖 ${bot.displayName || bot.username} — path=${botPath} vibe=${vibe} dryRun=${dryRun}`);

  try {
    const result = await runBot({
      bot,
      path: typeof botPath === 'string' ? botPath : 'random',
      vibe: typeof vibe === 'string' ? vibe : 'random',
      dryRun,
    });
    if (dryRun) {
      console.log(`\nDRY RUN — resolved path=${result.path} vibe=${result.vibeKey} medium=${result.medium}`);
      console.log(`FINAL PROMPT (${result.finalPrompt.length} chars):`);
      console.log(result.finalPrompt);
    } else {
      console.log(`✅ Posted: ${result.imageUrl}`);
      console.log(`   path=${result.path} vibe=${result.vibeKey} medium=${result.medium}`);
      console.log(`   duration=${result.durationMs}ms cost=${result.costCents}¢`);
    }
    process.exit(0);
  } catch (err) {
    console.error(`❌ ${bot.displayName || botName} failed: ${err.message}`);
    process.exit(1);
  }
})();
