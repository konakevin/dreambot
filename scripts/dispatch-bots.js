#!/usr/bin/env node
/**
 * dispatch-bots.js — fleet dispatcher for DB-driven bot scheduling.
 *
 * Reads bot_schedules, finds every active bot whose next_due_at <= now(),
 * runs each sequentially via run-bot.js (own process for failure isolation),
 * marks last_posted_at on success (DB trigger advances next_due_at).
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
 *   - Individual bot run failure → logged + skipped, last_posted_at unchanged
 *     → bot stays due → retries next tick (no cost beyond one Replicate call).
 *   - Bot that has never posted AND was created >6h ago → auto-deactivate with
 *     a note. Protects against newly-seeded broken bots burning Replicate forever.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

const DRY_RUN = process.argv.includes('--dry-run');
const NEVER_POSTED_TIMEOUT_HOURS = 6;
const SUPABASE_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const BOT_RUN_TIMEOUT_MS = 10 * 60 * 1000; // 10 min per bot

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

function runBotProcess(botName) {
  return new Promise((resolve) => {
    const proc = spawn(process.execPath, ['scripts/run-bot.js', '--bot', botName], {
      stdio: 'inherit',
      env: process.env,
    });
    const timer = setTimeout(() => {
      console.error(`⏱  ${botName}: timeout after ${BOT_RUN_TIMEOUT_MS / 60000}min, killing`);
      proc.kill('SIGKILL');
    }, BOT_RUN_TIMEOUT_MS);
    proc.on('exit', (code) => {
      clearTimeout(timer);
      resolve(code === 0);
    });
    proc.on('error', (err) => {
      clearTimeout(timer);
      console.error(`💥 ${botName}: spawn error ${err.message}`);
      resolve(false);
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

  const nowIso = new Date().toISOString();
  const { data: dueBots, error } = await sb
    .from('bot_schedules')
    .select('bot_name, posts_per_day, last_posted_at, next_due_at, created_at, notes')
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
    const overdueMin = Math.round((Date.now() - new Date(b.next_due_at).getTime()) / 60000);
    console.log(`   • ${b.bot_name} (overdue by ${overdueMin}min, posts_per_day=${b.posts_per_day})`);
  }

  if (DRY_RUN) {
    console.log('\n🧪 --dry-run: not running anything');
    process.exit(0);
  }

  let okCount = 0;
  let failCount = 0;
  let deactivatedCount = 0;

  for (const bot of dueBots) {
    // Failsafe: never-posted bot older than 6h → auto-deactivate.
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

    console.log(`\n━━━ ${bot.bot_name} ━━━`);
    const ok = await runBotProcess(bot.bot_name);

    if (ok) {
      const { error: updErr } = await sb
        .from('bot_schedules')
        .update({ last_posted_at: new Date().toISOString() })
        .eq('bot_name', bot.bot_name);
      if (updErr) {
        console.error(`⚠️  ${bot.bot_name}: post succeeded but last_posted_at update failed: ${updErr.message}`);
        failCount++;
      } else {
        okCount++;
      }
    } else {
      console.error(`❌ ${bot.bot_name}: run-bot exited non-zero, leaving last_posted_at unchanged (retry next tick)`);
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
