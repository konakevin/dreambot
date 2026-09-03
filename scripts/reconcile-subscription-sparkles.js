#!/usr/bin/env node
/**
 * Subscription sparkle reconciliation backstop.
 *
 * Monthly sparkle bundles are granted by the revenuecat-webhook on each RENEWAL.
 * If RevenueCat ever drops a RENEWAL webhook (delivery failure that exhausts its
 * retries), that subscriber silently misses that cycle's sparkles and nothing
 * catches it. This job is that safety net: for each ACTIVE MONTHLY subscriber who
 * has NOT received a bundle grant in their current billing cycle, it grants the
 * configured monthly bundle. Yearly subs already got 12x up front → skipped.
 *
 * Idempotent per user-per-cycle: the grant reason is
 *   sub_reconcile:<tier>:<userId>:<cycleStartDate>
 * so re-running (or a late webhook arriving after) never double-grants — it also
 * checks for any real webhook grant since the cycle start and skips if present.
 *
 * Monthly-vs-yearly detection: the users.<tier>_subscription_period stamp (mig 452),
 * with a fallback to inferring from the last bundle grant amount (12x = yearly) for
 * subs that predate the stamp. Indeterminate (no stamp AND no prior grant) → logged
 * for manual review, never auto-granted (avoids over-granting an edge/admin sub).
 *
 * Fail-loud: every reconcile grant emits a ::warning:: (a dropped webhook worth
 * knowing about). Run daily via .github/workflows/subscription-sparkle-reconcile.yml.
 *
 *   node scripts/reconcile-subscription-sparkles.js            # live
 *   node scripts/reconcile-subscription-sparkles.js --dry-run  # report only
 */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { waitForHeadroom } = require('./lib/poolHeadroom');

const getKey = (n) => process.env[n];
const SUPABASE_URL = getKey('SUPABASE_URL') || 'https://jimftynwrinwenonjrlj.supabase.co';
const SUPABASE_KEY = getKey('SUPABASE_SERVICE_ROLE_KEY');
const DRY_RUN = process.argv.includes('--dry-run');

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL.trim(), SUPABASE_KEY.trim());

const TIERS = [
  {
    name: 'pro',
    flagColumn: 'pro_subscription',
    expiresColumn: 'pro_subscription_expires_at',
    periodColumn: 'pro_subscription_period',
    bundleColumn: 'pro_monthly_sparkle_bundle',
    reasonPrefix: 'pro_bundle',
    fallbackBundle: 75,
  },
  {
    name: 'basic',
    flagColumn: 'basic_subscription',
    expiresColumn: 'basic_subscription_expires_at',
    periodColumn: 'basic_subscription_period',
    bundleColumn: 'basic_monthly_sparkle_bundle',
    reasonPrefix: 'basic_bundle',
    fallbackBundle: 20,
  },
];

// All decision logic (cycle math, period inference, grant/skip) lives in the
// pure, unit-tested module — this script is a thin I/O shell around it.
// (Audit 2026-09-03 H2; the extraction also fixed a month-end setMonth rollover
// bug that could have double-granted subs with month-end expiry dates.)
const { decideReconcile } = require('./lib/subscriptionReconcile');

async function main() {
  const nowIso = new Date().toISOString();
  const { data: cfgRows } = await sb.from('engine_config').select('*').limit(1);
  const cfg = cfgRows && cfgRows[0] ? cfgRows[0] : {};

  let checked = 0;
  let granted = 0;
  let indeterminate = 0;

  for (const tier of TIERS) {
    // Nullish (not falsy) fallback: Dreamer's bundle is a REAL 0 (dreams-only
    // tier, 2026-09-04) — `|| fallback` would resurrect the old 20-sparkle grant.
    const monthlyBundle =
      cfg[tier.bundleColumn] != null ? Number(cfg[tier.bundleColumn]) : tier.fallbackBundle;
    if (!(monthlyBundle > 0)) continue; // dreams-only tier: nothing to reconcile

    // Active paid subs on this tier (paginated — PostgREST caps at 1000).
    let subs = [];
    for (let off = 0; off < 5000; off += 1000) {
      const { data, error } = await sb
        .from('users')
        .select(`id, ${tier.expiresColumn}, ${tier.periodColumn}`)
        .eq(tier.flagColumn, true)
        .gt(tier.expiresColumn, nowIso)
        .order('id', { ascending: true })
        .range(off, off + 999);
      if (error) {
        console.error(`[reconcile] ${tier.name} user query failed:`, error.message);
        break;
      }
      subs = subs.concat(data || []);
      if (!data || data.length < 1000) break;
    }

    for (const u of subs) {
      checked++;
      const expiresAt = u[tier.expiresColumn];

      // Last real bundle grant (webhook) for this user+tier.
      const { data: lastRows } = await sb
        .from('sparkle_transactions')
        .select('amount, created_at')
        .eq('user_id', u.id)
        .like('reason', `${tier.reasonPrefix}:%`)
        .order('created_at', { ascending: false })
        .limit(1);
      const lastGrant = lastRows && lastRows[0] ? lastRows[0] : null;

      // Pure decision (period inference, yearly/indeterminate skips, cycle
      // coverage) — see scripts/lib/subscriptionReconcile.js + its jest suite.
      const { action, cycleKey, reconcileReason } = decideReconcile({
        tierName: tier.name,
        userId: u.id,
        periodStamp: u[tier.periodColumn],
        lastGrant,
        monthlyBundle,
        expiresAt,
      });

      if (action === 'skip_yearly') continue; // legacy 12x-up-front — provisioned for the year
      if (action === 'skip_indeterminate') {
        // No stamp AND no grant history (trial / admin flag / pre-stamp sub) —
        // don't guess/over-grant. Plain log, NOT a ::warning:: (alarm noise).
        indeterminate++;
        console.log(
          `[reconcile] ${tier.name} sub ${u.id} active with no period stamp and no prior grant — indeterminate, skipped.`
        );
        continue;
      }
      if (action === 'skip_covered') continue; // a grant already landed this cycle

      // action === 'grant': MISSING this cycle's bundle. Idempotent per user-per-cycle.
      const { data: already } = await sb
        .from('sparkle_transactions')
        .select('id')
        .eq('reason', reconcileReason)
        .limit(1);
      if (already && already.length > 0) continue; // already reconciled this cycle

      // Under the 2026-09-04 drip, a monthly grant for a YEARLY sub is the
      // EXPECTED path (months 2-12) — plain log. The ::warning:: remains for
      // monthly subs, where a reconcile grant means a RENEWAL webhook dropped.
      const isYearlyDrip = u[tier.periodColumn] === 'yearly';
      const msg = `[reconcile] ${isYearlyDrip ? 'yearly DRIP grant' : 'MISSING monthly bundle (dropped RENEWAL webhook)'} for ${tier.name} ${u.id} (cycle ${cycleKey}) ${DRY_RUN ? '[dry-run, would grant ' + monthlyBundle + ']' : 'granting ' + monthlyBundle}`;
      if (isYearlyDrip) console.log(msg);
      else console.warn(`::warning:: ${msg}`);
      granted++;
      if (!DRY_RUN) {
        await waitForHeadroom({ min: 25, label: 'reconcile-sparkles' });
        const { error } = await sb.rpc('grant_sparkles', {
          p_user_id: u.id,
          p_amount: monthlyBundle,
          p_reason: reconcileReason,
        });
        if (error) {
          granted--;
          console.error(`[reconcile] grant_sparkles failed for ${u.id}:`, error.message);
        }
      }
    }
  }

  console.log(
    `[reconcile] checked ${checked} active subs — ${DRY_RUN ? 'WOULD grant' : 'granted'} ${granted} missing bundle(s), ${indeterminate} indeterminate.`
  );
  // Non-zero grants on a live run is a signal (dropped webhooks), but not a failure.
}

main().catch((e) => {
  console.error('::error:: reconcile-subscription-sparkles crashed:', e.message);
  process.exit(1);
});
