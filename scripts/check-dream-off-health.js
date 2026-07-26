#!/usr/bin/env node
/**
 * check-dream-off-health.js — loud health monitor for Dream Off games.
 *
 * Exits 1 (failing the workflow → GitHub failure email) when the game engine
 * looks unhealthy:
 *   - overdue games: past phase_expires_at + grace but not advanced (the
 *     advance_expired_dream_offs pg_cron sweep isn't running), or
 *   - unsettled pots: a terminal game (results/no_contest/cancelled) whose pot
 *     never reached 'settled' (escrow not returned), or
 *   - POT-LEDGER IMBALANCE: a pot whose balance != SUM(ledger.amount) — the
 *     escrow-correctness canary (money invariant broken = highest severity).
 *
 * No-ops green while the feature is dark (engine_config.dream_off_enabled=false)
 * — there are no games to check. Run on a schedule by
 * .github/workflows/dream-off-monitor.yml. Mirrors scripts/check-dream-queue.js.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-dream-off-health.js
 */

const { createClient } = require('@supabase/supabase-js');

function readEnvFile() {
  try {
    const lines = require('fs').readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const envFile = readEnvFile();
const getKey = (n) => process.env[n] || envFile[n];

const SUPABASE_URL = (getKey('SUPABASE_URL') || 'https://jimftynwrinwenonjrlj.supabase.co').trim();
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SUPABASE_KEY.trim());

(async () => {
  const problems = [];

  // Dark-launch no-op: nothing exists to be unhealthy until the flag flips.
  const { data: cfg } = await sb
    .from('engine_config')
    .select('dream_off_enabled')
    .eq('id', 1)
    .single();
  if (!cfg || cfg.dream_off_enabled !== true) {
    console.log('✓ Dream Off is dark (dream_off_enabled=false) — nothing to monitor.');
    process.exit(0);
  }

  // 1 + 2: overdue games + unsettled terminal pots (the RPC bundles both).
  const { data: stuck, error: stuckErr } = await sb.rpc('dream_off_stuck_count');
  if (stuckErr) {
    console.error(`dream_off_stuck_count RPC failed: ${stuckErr.message}`);
    process.exit(1);
  }
  if ((stuck?.overdue_games ?? 0) > 0) {
    problems.push(
      `${stuck.overdue_games} overdue game(s) past deadline not advanced (cron sweep down?)`
    );
  }
  if ((stuck?.unsettled_pots ?? 0) > 0) {
    problems.push(
      `${stuck.unsettled_pots} terminal game(s) with an unsettled pot (escrow not returned)`
    );
  }

  // 3: pot-ledger imbalance — balance MUST equal the signed sum of its ledger.
  // Paginated to dodge the PostgREST 1000-row cap on either table.
  const balByGame = new Map();
  const ledgerByGame = new Map();
  for (const [table, sink, cols] of [
    ['dream_off_pot', balByGame, 'game_id, balance'],
    ['dream_off_pot_ledger', ledgerByGame, 'game_id, amount'],
  ]) {
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb
        .from(table)
        .select(cols)
        .range(from, from + 999);
      if (error) {
        console.error(`${table} read failed: ${error.message}`);
        process.exit(1);
      }
      for (const r of data ?? []) {
        if (table === 'dream_off_pot') sink.set(r.game_id, r.balance);
        else sink.set(r.game_id, (sink.get(r.game_id) ?? 0) + r.amount);
      }
      if (!data || data.length < 1000) break;
    }
  }
  let imbalances = 0;
  for (const [gameId, balance] of balByGame) {
    const ledgerSum = ledgerByGame.get(gameId) ?? 0;
    if (balance !== ledgerSum) {
      imbalances++;
      if (imbalances <= 5) {
        console.error(`  ⚠ pot ${gameId}: balance=${balance} but ledger sum=${ledgerSum}`);
      }
    }
  }
  if (imbalances > 0) {
    problems.push(`${imbalances} pot(s) with balance != ledger sum (ESCROW INVARIANT BROKEN)`);
  }

  if (problems.length > 0) {
    console.error('\n✖ Dream Off health check FAILED:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(
    `✓ Dream Off healthy — ${balByGame.size} pot(s) balanced, no overdue games, no unsettled pots.`
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
