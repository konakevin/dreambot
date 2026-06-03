#!/usr/bin/env node
/**
 * dispatch-bots.js — fleet dispatcher for DB-driven bot scheduling.
 *
 * Reads bot_schedules, finds every active bot whose next_due_at <= now(),
 * runs each (own process for failure isolation) staggered evenly across the
 * 15-min tick window so the feed doesn't get a 3-bot burst, and marks
 * last_posted_at on success (DB trigger advances next_due_at to next slot,
 * which has ±15 min jitter so the same trio doesn't cluster every cycle).
 *
 * Usage:
 *   node scripts/dispatch-bots.js            # real run
 *   node scripts/dispatch-bots.js --dry-run  # lists due bots, runs nothing
 *
 * Called every 15 min by .github/workflows/bots-dispatcher.yml.
 *
 * Exit code 0 = dispatcher completed cleanly (even if individual bots failed).
 * Exit code 1 = dispatcher itself crashed (env missing, DB unreachable, etc.).
 *
 * Failure handling:
 *   - Bot run failure → consecutive_failures++. After MAX_CONSECUTIVE_FAILURES
 *     (5) auto-deactivate with last_failure_reason note. Cost cap per broken
 *     bot: 5 × Replicate render ≈ $0.25.
 *   - Bot run success → consecutive_failures resets to 0.
 *   - Never-posted bot >6h old → auto-deactivate immediately (covers a brand-new
 *     bot wired wrong before it even gets to its 5-failure budget).
 */

const fs = require('fs');
const { spawn } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

const DRY_RUN = process.argv.includes('--dry-run');
const NEVER_POSTED_TIMEOUT_HOURS = 6;
const MAX_CONSECUTIVE_FAILURES = 5;
const TICK_WINDOW_MS = 15 * 60 * 1000;          // dispatcher fires every 15 min
const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const BOT_RUN_TIMEOUT_MS = 10 * 60 * 1000;      // 10 min per bot

function loadEnv() {
  const env = {};
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    for (const l of lines) {
      const eq = l.indexOf('=');
      if (eq > 0) env[l.slice(0, eq).trim()] = l.slice(eq + 1).trim();
    }
  } catch (_) {
    // No .env.local in GH Actions — env vars come from process.env directly.
  }
  return env;
}
const ENV = loadEnv();
const getKey = (n) => process.env[n] || ENV[n];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function runBotProcess(botName) {
  return new Promise((resolve) => {
    let stderrTail = '';
    const proc = spawn(process.execPath, ['scripts/run-bot.js', '--bot', botName], {
      stdio: ['ignore', 'inherit', 'pipe'],
      env: process.env,
    });
    proc.stderr.on('data', (chunk) => {
      const s = chunk.toString();
      process.stderr.write(s);
      stderrTail = (stderrTail + s).slice(-500);
    });
    const timer = setTimeout(() => {
      stderrTail = `timeout after ${BOT_RUN_TIMEOUT_MS / 60000}min`;
      console.error(`⏱  ${botName}: ${stderrTail}, killing`);
      proc.kill('SIGKILL');
    }, BOT_RUN_TIMEOUT_MS);
    proc.on('exit', (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, errTail: stderrTail.trim() });
    });
    proc.on('error', (err) => {
      clearTimeout(timer);
      console.error(`💥 ${botName}: spawn error ${err.message}`);
      resolve({ ok: false, errTail: `spawn error: ${err.message}` });
    });
  });
}

(async () => {
  const supabaseKey = getKey('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY missing');
    process.exit(1);
  }
  const sb = createClient(SUPABASE_URL, supabaseKey);

  const dispatchStart = Date.now();
  const nowIso = new Date(dispatchStart).toISOString();
  const { data: dueBots, error } = await sb
    .from('bot_schedules')
    .select('bot_name, posts_per_day, last_posted_at, next_due_at, created_at, consecutive_failures, notes')
    .eq('active', true)
    .lte('next_due_at', nowIso)
    .order('next_due_at', { ascending: true });

  if (error) {
    console.error(`DB query failed: ${error.message}`);
    process.exit(1);
  }

  if (!dueBots || dueBots.length === 0) {
    console.log(`✨ ${nowIso} — no due bots`);
    process.exit(0);
  }

  console.log(`📋 ${nowIso} — ${dueBots.length} due bot(s):`);
  for (const b of dueBots) {
    const overdueMin = Math.round((dispatchStart - new Date(b.next_due_at).getTime()) / 60000);
    console.log(
      `   • ${b.bot_name} (overdue ${overdueMin}min, pd=${b.posts_per_day}, fails=${b.consecutive_failures})`,
    );
  }

  if (DRY_RUN) {
    console.log('\n🧪 --dry-run: not running anything');
    process.exit(0);
  }

  // Stagger N bots across the 15-min tick window so the feed sees one post
  // every ~(15/N) min instead of all back-to-back. Slot 0 starts immediately;
  // slot i targets dispatchStart + (i/N) * TICK_WINDOW_MS. If a prior bot's
  // render ran long past the target, we proceed immediately (no negative sleep).
  const slotSpacingMs = Math.floor(TICK_WINDOW_MS / dueBots.length);

  let okCount = 0;
  let failCount = 0;
  let deactivatedCount = 0;

  for (let i = 0; i < dueBots.length; i++) {
    const bot = dueBots[i];

    // Never-posted-and-stale failsafe: catches newly-seeded broken bots
    // before they even hit their 5-attempt budget.
    if (bot.last_posted_at === null) {
      const ageHours = (Date.now() - new Date(bot.created_at).getTime()) / 3.6e6;
      if (ageHours > NEVER_POSTED_TIMEOUT_HOURS) {
        const note = `auto-deactivated after ${ageHours.toFixed(1)}h without a successful post`;
        console.warn(`🛑 ${bot.bot_name}: ${note}`);
        const { error: updErr } = await sb
          .from('bot_schedules')
          .update({ active: false, notes: note })
          .eq('bot_name', bot.bot_name);
        if (updErr) console.error(`   ↳ failed to deactivate: ${updErr.message}`);
        deactivatedCount++;
        continue;
      }
    }

    if (i > 0) {
      const targetStartMs = dispatchStart + i * slotSpacingMs;
      const waitMs = targetStartMs - Date.now();
      if (waitMs > 0) {
        console.log(`⏳ ${bot.bot_name}: sleeping ${Math.round(waitMs / 1000)}s for stagger`);
        await sleep(waitMs);
      }
    }

    console.log(`\n━━━ ${bot.bot_name} (${i + 1}/${dueBots.length}) ━━━`);
    const { ok, errTail } = await runBotProcess(bot.bot_name);

    if (ok) {
      const { error: updErr } = await sb
        .from('bot_schedules')
        .update({
          last_posted_at: new Date().toISOString(),
          consecutive_failures: 0,
          last_failure_reason: null,
        })
        .eq('bot_name', bot.bot_name);
      if (updErr) {
        console.error(`⚠️  ${bot.bot_name}: post ok but DB update failed: ${updErr.message}`);
        failCount++;
      } else {
        okCount++;
      }
      continue;
    }

    // Failure path — increment counter; auto-deactivate on 5th consecutive.
    const newFailures = (bot.consecutive_failures || 0) + 1;
    const reason = errTail.slice(-300) || 'run-bot.js exited non-zero (no stderr captured)';

    // ── Fleet-wide infra failure detection ───────────────────────────
    // If the failure is an Anthropic credit-balance exhaustion (or a
    // similar fleet-wide infra issue), it's not a per-bot config bug —
    // EVERY bot will hit the same wall. Don't increment the per-bot
    // failure counter (an unpaid bill should not auto-deactivate the
    // entire fleet 5 ticks later), don't spend 15 more minutes burning
    // through the remaining due bots, and exit the workflow non-zero so
    // GitHub Actions surfaces it as a red run + failure email.
    // Caught: 2026-06-03 — credit exhaustion took down 10 of 17 bots
    // one by one before anyone noticed.
    const CREDIT_PATTERNS = [
      /credit\s*balance\s*is\s*too\s*low/i,
      /credit_balance_too_low/i,
      /Claude\s+exhausted/i,
    ];
    if (CREDIT_PATTERNS.some((re) => re.test(reason))) {
      console.error(
        `🚨 ${bot.bot_name}: ANTHROPIC CREDIT EXHAUSTION DETECTED — this is fleet-wide infra, not a bot bug.`,
      );
      console.error(`   ↳ ${reason.slice(0, 200)}`);
      console.error(
        '   ↳ Skipping per-bot failure counter (an unpaid bill should not deactivate the fleet).',
      );
      console.error(
        '   ↳ Aborting remaining due bots in this tick (they would all hit the same error).',
      );
      // Record the latest failure timestamp/reason so the health monitor
      // can correlate, but DON'T bump consecutive_failures.
      await sb
        .from('bot_schedules')
        .update({
          last_failure_at: new Date().toISOString(),
          last_failure_reason: `credit_exhaustion: ${reason.slice(0, 200)}`,
        })
        .eq('bot_name', bot.bot_name);
      failCount++;
      console.log(
        `\n📊 dispatcher aborted on credit exhaustion — ok=${okCount} fail=${failCount} deactivated=${deactivatedCount}`,
      );
      process.exit(1); // red workflow → GitHub failure email
    }

    if (newFailures >= MAX_CONSECUTIVE_FAILURES) {
      const note = `auto-deactivated after ${newFailures} consecutive failures. Last error: ${reason}`;
      console.error(`🛑 ${bot.bot_name}: ${note}`);
      const { error: updErr } = await sb
        .from('bot_schedules')
        .update({
          active: false,
          consecutive_failures: newFailures,
          last_failure_at: new Date().toISOString(),
          last_failure_reason: reason,
          notes: note,
        })
        .eq('bot_name', bot.bot_name);
      if (updErr) console.error(`   ↳ failed to deactivate: ${updErr.message}`);
      deactivatedCount++;
      failCount++;
    } else {
      console.error(
        `❌ ${bot.bot_name}: failure ${newFailures}/${MAX_CONSECUTIVE_FAILURES} (retry next tick): ${reason.slice(0, 120)}`,
      );
      const { error: updErr } = await sb
        .from('bot_schedules')
        .update({
          consecutive_failures: newFailures,
          last_failure_at: new Date().toISOString(),
          last_failure_reason: reason,
        })
        .eq('bot_name', bot.bot_name);
      if (updErr) console.error(`   ↳ failure-count update failed: ${updErr.message}`);
      failCount++;
    }
  }

  console.log(
    `\n📊 dispatcher done — ok=${okCount} fail=${failCount} deactivated=${deactivatedCount}`,
  );
  process.exit(0);
})().catch((err) => {
  console.error(`💥 dispatcher crash: ${err.stack || err.message}`);
  process.exit(1);
});