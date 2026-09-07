#!/usr/bin/env node
/**
 * Shadow-night acceptance for the nightly model policy (NIGHTLY_MODEL_POLICY_PLAN.md §4 step 2).
 * Tallies every `policy_shadow:<site>:match|diff:<legacy>-><policy set>` stamp nightly wrote in the last
 * N hours (real users only) and exits 1 on any diff that is not an ACCEPTED divergence (plan §3: the
 * photography flux-dev pick — the only legacy pick the legacy-equivalent rows cannot draw).
 *
 *   node scripts/check-model-policy-shadow.js [--hours 24]
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const KEVIN = 'eab700d8-f11a-4f47-a3a1-addda6fb67ec';
const ACCEPTED_DIFF = [/^policy_shadow:faceswap_pick:diff:flux-dev->/];
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};

(async () => {
  const sb = createClient(process.env.EXPO_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const since = new Date(Date.now() - Number(arg('hours', '24')) * 3600e3).toISOString();
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from('ai_generation_log')
      .select('id,user_id,model_used,fallback_reasons,np:rolled_axes->>nightlyPath')
      .gte('created_at', since)
      .neq('user_id', KEVIN)
      .order('id')
      .range(from, from + 999);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  const nightly = rows.filter((r) => r.np);
  const bySite = {};
  const badDiffs = [];
  let stamped = 0;
  for (const r of nightly) {
    const stamps = (r.fallback_reasons || []).filter((s) => s.startsWith('policy_shadow:'));
    if (stamps.length) stamped++;
    for (const s of stamps) {
      const site = s.split(':')[1];
      const kind = s.split(':')[2];
      bySite[site] = bySite[site] || { match: 0, diff: 0 };
      bySite[site][kind === 'match' ? 'match' : 'diff']++;
      if (kind !== 'match' && !ACCEPTED_DIFF.some((re) => re.test(s))) badDiffs.push({ id: r.id, stamp: s });
    }
  }
  console.log(`nightly renders (real users) since ${since.slice(0, 16)}: ${nightly.length}; with shadow stamps: ${stamped}`);
  for (const [site, t] of Object.entries(bySite)) console.log(`  ${site.padEnd(14)} match ${t.match}  diff ${t.diff}`);
  if (nightly.length > 0 && stamped === 0) {
    console.error('✗ no shadow stamps at all — is engine_config.model_policy_mode = shadow and the render deployed?');
    process.exit(1);
  }
  if (badDiffs.length) {
    console.error(`✗ ${badDiffs.length} unexpected shadow diff(s):`);
    for (const d of badDiffs.slice(0, 20)) console.error(`   ${d.id}  ${d.stamp}`);
    process.exit(1);
  }
  console.log('✓ shadow night clean: the policy agreed with the legacy picker everywhere it matters.');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
