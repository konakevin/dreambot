#!/usr/bin/env node
/**
 * verify-bot-cycles.js — health check for bot PATH cycling.
 *
 * For every active bot (bot_schedules.active = true) this:
 *   1. loads the bot's CURRENT path roster from scripts/bots/<name>/index.js,
 *   2. reads the persisted shuffle-bag (bot_path_cycle, migration 283) — the
 *      paths already posted in the current cycle,
 *   3. reads dispatcher post counts per path over a recent window (bot_run_log,
 *      source='dispatcher', status='ok') to expose current distribution,
 * and flags the failure modes the persisted bag was built to kill:
 *   • STARVED   — a current path with 0 dispatcher posts in the window (the
 *                 faebot / gothbot symptom: freshly-added paths never served),
 *   • STALE     — a bot_path_cycle row whose path is no longer in the roster
 *                 (harmless — wiped at the next reset — but surfaced),
 *   • SKEW      — max/min windowed post ratio > 4× across current paths.
 *
 * STARVED/SKEW read a RECENT window of dispatcher posts (default 21 days) so
 * they reflect CURRENT cycling behavior, not the all-time history accumulated
 * under the OLD buggy system — after the persisted bag (migration 283) has
 * driven a couple of cycles, a previously-starved path shows up and the window
 * skew collapses toward 1×. Use --days 0 for the full all-time backlog view.
 *
 * A healthy bot prints "OK". Read-only — never writes. Run any time:
 *   node scripts/verify-bot-cycles.js               # all active bots, 21d window
 *   node scripts/verify-bot-cycles.js --bot faebot  # one bot
 *   node scripts/verify-bot-cycles.js --days 0      # all-time (backlog) view
 *
 * Reads SUPABASE_SERVICE_ROLE_KEY from the env / .env.local (same as run-bot).
 */

const path = require('path');
const { getSupabase } = require('./lib/botEngine');
const { applyBotConfigOverlay } = require('./lib/botConfig');

function arg(name, fallback) {
  const i = process.argv.indexOf('--' + name);
  if (i < 0) return fallback;
  const next = process.argv[i + 1];
  return next && !next.startsWith('--') ? next : true;
}

function loadBot(botName) {
  try {
    return require(path.resolve(`scripts/bots/${botName}/index.js`));
  } catch (err) {
    console.warn(`   ⚠️ could not load scripts/bots/${botName}/index.js: ${err.message}`);
    return null;
  }
}

async function dispatcherPostCounts(sb, botName, sinceIso) {
  // Paginate — PostgREST silently caps single reads at 1000 rows; long-tenured
  // bots have far more than that, and an undercount would fake a STARVED flag.
  const counts = {};
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    let q = sb
      .from('bot_run_log')
      .select('path')
      .eq('bot_name', botName)
      .eq('status', 'ok')
      .eq('source', 'dispatcher');
    if (sinceIso) q = q.gte('created_at', sinceIso);
    const { data, error } = await q.range(from, from + PAGE - 1);
    if (error) {
      console.warn(`   ⚠️ run-log read failed for ${botName}: ${error.message}`);
      return counts;
    }
    for (const r of data || []) counts[r.path] = (counts[r.path] || 0) + 1;
    if (!data || data.length < PAGE) break;
  }
  return counts;
}

async function cycleRows(sb, botName) {
  const { data, error } = await sb.from('bot_path_cycle').select('path').eq('bot_name', botName);
  if (error) {
    console.warn(`   ⚠️ bot_path_cycle read failed for ${botName}: ${error.message}`);
    return [];
  }
  return (data || []).map((r) => r.path);
}

(async () => {
  const sb = getSupabase();
  const only = arg('bot');
  const daysArg = arg('days', '21');
  const days = Number(daysArg);
  // days=0 (or NaN) → all-time; otherwise window the run-log read to now-N days.
  const sinceIso =
    Number.isFinite(days) && days > 0
      ? new Date(Date.now() - days * 86400_000).toISOString()
      : null;
  const windowLabel = sinceIso ? `last ${days}d` : 'all-time';

  let activeNames;
  if (typeof only === 'string') {
    activeNames = [only];
  } else {
    const { data, error } = await sb
      .from('bot_schedules')
      .select('bot_name')
      .eq('active', true)
      .order('bot_name');
    if (error) {
      console.error(`bot_schedules read failed: ${error.message}`);
      process.exit(1);
    }
    activeNames = (data || []).map((r) => r.bot_name);
  }

  console.log(
    `\n🔍 Verifying path cycles for ${activeNames.length} active bot(s) (STARVED/SKEW window: ${windowLabel})\n`
  );

  let problems = 0;

  for (const botName of activeNames) {
    const baseBot = loadBot(botName);
    if (!baseBot) {
      problems++;
      continue;
    }
    // Apply the admin overlay so the roster matches what the dispatcher sees.
    const bot = await applyBotConfigOverlay(sb, baseBot);
    if (!Array.isArray(bot.paths) || bot.paths.length === 0) {
      console.log(`• ${botName}: ⚠️ no paths configured`);
      problems++;
      continue;
    }

    const roster = new Set(bot.paths);
    const [counts, used] = await Promise.all([
      dispatcherPostCounts(sb, botName, sinceIso),
      cycleRows(sb, botName),
    ]);

    const starved = bot.paths.filter((p) => !counts[p]);
    const stale = used.filter((p) => !roster.has(p));
    const usedCurrent = used.filter((p) => roster.has(p));
    const remaining = bot.paths.filter((p) => !new Set(used).has(p));

    const postVals = bot.paths.map((p) => counts[p] || 0);
    const maxPosts = Math.max(...postVals);
    const minPosts = Math.min(...postVals);
    const skew = minPosts > 0 ? maxPosts / minPosts : Infinity;

    const flags = [];
    if (starved.length) flags.push(`STARVED(${starved.length}): ${starved.join(', ')}`);
    if (stale.length) flags.push(`STALE rows: ${stale.join(', ')}`);
    if (skew > 4)
      flags.push(`SKEW ${maxPosts}/${minPosts} = ${skew === Infinity ? '∞' : skew.toFixed(1)}×`);

    const cycleStr =
      `cycle ${usedCurrent.length}/${bot.paths.length} used` +
      (remaining.length ? ` · ${remaining.length} remaining` : ' · complete (resets next post)');

    if (flags.length === 0) {
      console.log(`• ${botName}: OK — ${bot.paths.length} paths · ${cycleStr}`);
    } else {
      problems++;
      console.log(`• ${botName}: ❌ ${flags.join('  |  ')}`);
      console.log(`     ${bot.paths.length} paths · ${cycleStr}`);
    }
  }

  console.log(
    problems === 0
      ? `\n✅ All ${activeNames.length} bots cycling cleanly.\n`
      : `\n⚠️ ${problems} bot(s) flagged — see above.\n`
  );
  process.exit(problems === 0 ? 0 : 1);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
