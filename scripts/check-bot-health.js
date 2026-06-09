#!/usr/bin/env node
/**
 * check-bot-health.js — loud health monitor for the bot fleet.
 *
 * Exits 1 (failing the GitHub Action → email alert) when any signal
 * suggests the fleet has silently stopped posting. Caught case that
 * triggered this monitor: 2026-06-03, Anthropic credit balance lapsed
 * during the day, the dispatcher's 5-consecutive-failures protection
 * auto-deactivated 10 of 17 bots one by one over a few hours with no
 * external alarm. Bots had been "broken" for ~19h before Kevin noticed.
 *
 * Alarm conditions (any one trips the workflow red):
 *
 *   • inactive-fleet — every ACTIVE bot has last_posted_at older than
 *     INACTIVE_HOURS (default 12). Catches a fleet-wide infra outage
 *     (credit exhaustion, Replicate down, dispatcher cron not firing)
 *     before per-bot timers slowly age into auto-deactivation.
 *
 *   • per-bot-stale — any individual ACTIVE bot's last_posted_at is
 *     older than STALE_HOURS (default 18). Catches a single-bot config
 *     bug that's silently failing without tripping the 5-failure
 *     deactivation threshold.
 *
 *   • deactivated-spike — total inactive bots ≥ DEACTIVATED_ALARM
 *     (default 8). Catches a wave of auto-deactivations from a single
 *     fleet-wide event — wide-fleet credit exhaustion / model 429s.
 *
 *   • credit-exhaustion-recent — any bot's last_failure_reason matches
 *     the credit-balance pattern within the last RECENT_FAILURE_HOURS
 *     (default 24). Pairs with the dispatcher's new credit-detection
 *     branch — surfaces the infra issue independently of the dispatcher
 *     workflow status.
 *
 * Run on a schedule by .github/workflows/bot-health-monitor.yml.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/check-bot-health.js
 *
 * Tunables (env): INACTIVE_HOURS, STALE_HOURS, DEACTIVATED_ALARM,
 *                 RECENT_FAILURE_HOURS.
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

const SUPABASE_URL = getKey('SUPABASE_URL') || 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');

const INACTIVE_HOURS = parseInt(getKey('INACTIVE_HOURS') || '12', 10);
const STALE_HOURS = parseInt(getKey('STALE_HOURS') || '18', 10);
const DEACTIVATED_ALARM = parseInt(getKey('DEACTIVATED_ALARM') || '8', 10);
const RECENT_FAILURE_HOURS = parseInt(getKey('RECENT_FAILURE_HOURS') || '24', 10);
// ANY auto-deactivation is worth an alarm — the old deactivated-spike (≥8) had
// a blind spot the gothbot/brickbot/yumbot incident (2026-06-09) fell into: 3
// bots killed by a missing GEMINI/OPENAI key, well under 8.
const AUTO_DEACTIVATED_ALARM = parseInt(getKey('AUTO_DEACTIVATED_ALARM') || '1', 10);
// Early-warning: an active bot climbing toward the 5-failure cutoff, regardless
// of reason (key missing, 429, credit). Catches it BEFORE it goes dark.
const FAILURE_ALARM = parseInt(getKey('FAILURE_ALARM') || '3', 10);

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());

const CREDIT_PATTERNS = [
  /credit\s*balance\s*is\s*too\s*low/i,
  /credit_balance_too_low/i,
  /Claude\s+exhausted/i,
  /credit_exhaustion/i,
];

(async () => {
  // Pull the full schedule snapshot. Small table (~18 rows) — no pagination
  // needed.
  const { data: schedules, error } = await sb
    .from('bot_schedules')
    .select(
      'bot_name, active, last_posted_at, consecutive_failures, last_failure_at, last_failure_reason, notes'
    )
    .order('bot_name');

  if (error) {
    console.error('::error::bot_schedules query failed:', error.message);
    process.exit(1);
  }

  const now = Date.now();
  const inactiveCutoff = now - INACTIVE_HOURS * 3600_000;
  const staleCutoff = now - STALE_HOURS * 3600_000;
  const recentFailureCutoff = now - RECENT_FAILURE_HOURS * 3600_000;

  const active = schedules.filter((b) => b.active);
  const inactive = schedules.filter((b) => !b.active);

  const lastPostAge = (b) => (b.last_posted_at ? now - new Date(b.last_posted_at).getTime() : null);
  const noRecentPost = (b) => {
    const age = lastPostAge(b);
    return age === null || age > staleCutoff - now + STALE_HOURS * 3600_000; // == age > STALE
  };
  const cleanNoRecentPost = (b) => {
    const age = lastPostAge(b);
    return age === null ? true : age > STALE_HOURS * 3600_000;
  };
  const activeStale = active.filter(cleanNoRecentPost);

  // ─ Fleet-wide inactivity ─
  const activeWithRecentPost = active.filter((b) => {
    const age = lastPostAge(b);
    return age !== null && age < INACTIVE_HOURS * 3600_000;
  });
  const fleetInactive = active.length > 0 && activeWithRecentPost.length === 0;

  // ─ Recent credit-exhaustion signal ─
  const creditExhausted = schedules.filter((b) => {
    if (!b.last_failure_reason) return false;
    if (!b.last_failure_at) return false;
    if (new Date(b.last_failure_at).getTime() < recentFailureCutoff) return false;
    return CREDIT_PATTERNS.some((re) => re.test(b.last_failure_reason));
  });

  // ─ Auto-deactivated bots ─ the dispatcher flips active=false + stamps an
  //   "auto-deactivated" note after 5 consecutive failures. Excludes bots
  //   disabled by hand (no such note) so an intentional pause never alarms.
  const autoDeactivated = inactive.filter((b) => /auto-deactivated/i.test(b.notes || ''));

  // ─ Active bots climbing toward the 5-failure cutoff (early warning) ─
  const elevatedFailures = active.filter((b) => (b.consecutive_failures || 0) >= FAILURE_ALARM);

  // ─ Summary ─
  console.log(`Active bots: ${active.length}, inactive: ${inactive.length}`);
  console.log(`Auto-deactivated bots: ${autoDeactivated.length}`);
  console.log(
    `Active bots with >= ${FAILURE_ALARM} consecutive failures: ${elevatedFailures.length}`
  );
  console.log(
    `Active with last_posted_at within ${INACTIVE_HOURS}h: ${activeWithRecentPost.length}`
  );
  console.log(`Active stale (last_posted > ${STALE_HOURS}h): ${activeStale.length}`);
  console.log(
    `Bots with credit-exhaustion failure in last ${RECENT_FAILURE_HOURS}h: ${creditExhausted.length}`
  );

  let alarm = false;

  if (fleetInactive) {
    console.error(
      `::error::FLEET INACTIVE — every one of ${active.length} active bot(s) has no post within ${INACTIVE_HOURS}h. Likely fleet-wide infra outage (credits / Replicate / dispatcher cron). Check the most recent bots-dispatcher workflow run.`
    );
    alarm = true;
  }

  if (activeStale.length > 0) {
    console.error(
      `::error::${activeStale.length} active bot(s) stale (last_posted > ${STALE_HOURS}h): ${activeStale.map((b) => b.bot_name).join(', ')}`
    );
    alarm = true;
  }

  if (inactive.length >= DEACTIVATED_ALARM) {
    console.error(
      `::error::${inactive.length} inactive bot(s) (>= ${DEACTIVATED_ALARM} threshold) — possible wave of auto-deactivations. Inactive: ${inactive.map((b) => b.bot_name).join(', ')}`
    );
    alarm = true;
  }

  if (autoDeactivated.length >= AUTO_DEACTIVATED_ALARM) {
    console.error(
      `::error::${autoDeactivated.length} bot(s) AUTO-DEACTIVATED after consecutive failures: ${autoDeactivated
        .map(
          (b) =>
            `${b.bot_name} [${(b.last_failure_reason || 'no reason')
              .replace(/[^\x20-\x7E]/g, '')
              .trim()
              .slice(0, 70)}]`
        )
        .join(
          '; '
        )}. Fix the root cause, then reactivate (active=true, next_due_at=now, consecutive_failures=0).`
    );
    alarm = true;
  }

  if (elevatedFailures.length > 0) {
    console.error(
      `::error::${elevatedFailures.length} active bot(s) at >= ${FAILURE_ALARM} consecutive failures — heading toward auto-deactivation: ${elevatedFailures
        .map((b) => `${b.bot_name}=${b.consecutive_failures}`)
        .join(', ')}`
    );
    alarm = true;
  }

  if (creditExhausted.length > 0) {
    console.error(
      `::error::Anthropic credit-exhaustion failure recorded on ${creditExhausted.length} bot(s) within the last ${RECENT_FAILURE_HOURS}h. Top up at https://console.anthropic.com/settings/billing — bots cannot Sonnet-brief without credits. Affected: ${creditExhausted.map((b) => b.bot_name).join(', ')}`
    );
    alarm = true;
  }

  if (alarm) {
    console.log('\n=== Snapshot (last_posted_at age in hours) ===');
    schedules.forEach((b) => {
      const ageH = lastPostAge(b) === null ? 'NEVER' : (lastPostAge(b) / 3600_000).toFixed(1) + 'h';
      console.log(
        `  ${b.bot_name.padEnd(12)} active=${b.active}  fails=${b.consecutive_failures || 0}  last_post=${ageH}`
      );
    });
    process.exit(1);
  }

  console.log('✅ bot fleet healthy.');
})().catch((e) => {
  console.error('::error::bot-health monitor crashed:', e.message);
  process.exit(1);
});
