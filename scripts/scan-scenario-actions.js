#!/usr/bin/env node
/**
 * scan-scenario-actions.js — guard the `action` column on the scenario pools (mig 516).
 *
 * The column is a VERBATIM slice of `scene`, produced by scripts/lib/scenarioSplit.js. Two things can quietly
 * break it later: a hand edit that leaves a fragment ("both hands, acacia trees behind him" — the determiner trap
 * the splitter tests caught), or a re-run of a looser splitter that cuts mid-phrase. Either would replace a real
 * pose with nonsense on thousands of dreams, and the render would look merely odd rather than broken.
 *
 * So this asserts the three properties that make an action trustworthy:
 *   1. it is still a verbatim substring of its own `scene` (nothing was invented or rewritten)
 *   2. it is long enough to be an action, not a fragment
 *   3. it does not open with a determiner noun, which is the signature of a bad cut
 *
 * Exits 1 on any violation. Read-only.
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { MIN_HALF, DETERMINER_NOUNS } = require('./lib/scenarioSplit.js');
const ROOT = path.join(__dirname, '..');
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, '.env.local'), 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const s = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const BAD_OPENER = new RegExp(`^(?:${DETERMINER_NOUNS})\\b`, 'i');

(async () => {
  let violations = 0;
  let checked = 0;
  for (const table of ['dual_scenarios', 'single_scenarios']) {
    let rows = [], from = 0;
    for (;;) {
      const { data, error } = await s.from(table).select('id,scene,action,disabled').order('id').range(from, from + 999);
      if (error) { console.error(`${table}: ${error.message}`); process.exit(1); }
      if (!data || !data.length) break;
      rows = rows.concat(data); if (data.length < 1000) break; from += 1000;
    }
    const withAction = rows.filter((r) => !r.disabled && r.action);
    checked += withAction.length;
    for (const r of withAction) {
      const a = String(r.action).trim();
      const why =
        !String(r.scene || '').includes(a) ? 'not a verbatim slice of its scene'
        : a.length < MIN_HALF ? `too short (${a.length} chars) to be an action`
        : BAD_OPENER.test(a) ? 'opens with a determiner noun — a bad cut'
        : null;
      if (why) {
        violations++;
        console.error(`  ✗ ${table} ${r.id.slice(0, 8)}: ${why}\n      action: ${a.slice(0, 90)}`);
      }
    }
    console.log(`${table}: ${withAction.length} rows carry an action`);
  }
  if (violations > 0) {
    console.error(`\n✗ scenario action scan: ${violations} violation(s) of ${checked} actions.`);
    process.exit(1);
  }
  console.log(`\n✓ scenario action scan: ${checked} actions, all verbatim slices, none a fragment.`);
})();
