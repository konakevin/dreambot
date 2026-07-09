#!/usr/bin/env node
/**
 * Copy the in-code ACTIVE pose pools into the action_poses table (migration
 * 350, Phase D) — after this, poses are dashboard-tunable (disabled=true to
 * cull, INSERT to grow, no deploy). Rows are linted at insert. Idempotent:
 * refuses to run when the table already has rows (--wipe to replace ALL rows
 * — this table is wholly owned by this seeder, unlike bot_seeds).
 *
 * Usage: node scripts/seed-action-poses-db.js [--wipe]
 */
require('dotenv').config({ path: '/Users/kevinmchenry/Development/apps/dreambot/.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { lintActivePoseEntry } = require('./lib/posePoolLint');
const fs = require('fs');

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Parse the TS pool files' entries (text + biomes) without a TS runtime:
// the arrays are literal objects, so a tolerant regex walk is enough.
function parsePool(file) {
  const src = fs.readFileSync(file, 'utf8');
  const out = [];
  const entryRe = /\{\s*text:\s*'((?:[^'\\]|\\.)*)'\s*,(?:\s*biomes:\s*\[([^\]]*)\]\s*,?)?/g;
  let m;
  while ((m = entryRe.exec(src))) {
    const text = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
    const biomes = m[2]
      ? m[2]
          .split(',')
          .map((b) => b.trim().replace(/^'|'$/g, ''))
          .filter((b) => b && !b.startsWith('...'))
      : null;
    out.push({ text, biomes: biomes && biomes.length ? biomes : null });
  }
  return out;
}

(async () => {
  const dual = parsePool('supabase/functions/_shared/pools/dual_actions_active.ts');
  const solo = parsePool('supabase/functions/_shared/pools/single_actions_active.ts');
  console.log(`parsed: dual ${dual.length}, solo ${solo.length}`);

  let bad = 0;
  for (const e of [...dual, ...solo]) {
    const p = lintActivePoseEntry(e.text);
    if (p.length) {
      bad++;
      console.error(`✗ ${p.join('; ')}: ${e.text.slice(0, 80)}`);
    }
  }
  if (bad) process.exit(1);

  const { count } = await sb.from('action_poses').select('*', { count: 'exact', head: true });
  if (count > 0 && !process.argv.includes('--wipe')) {
    console.error(`action_poses already has ${count} rows. Use --wipe to replace.`);
    process.exit(1);
  }
  if (process.argv.includes('--wipe')) {
    await sb.from('action_poses').delete().gte('id', 0);
  }
  const rows = [
    ...dual.map((e) => ({ cast_type: 'dual', text: e.text, biomes: e.biomes })),
    ...solo.map((e) => ({ cast_type: 'solo', text: e.text, biomes: e.biomes })),
  ];
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await sb.from('action_poses').insert(rows.slice(i, i + 100));
    if (error) {
      console.error('insert failed:', error.message);
      process.exit(1);
    }
  }
  const { count: after } = await sb
    .from('action_poses')
    .select('*', { count: 'exact', head: true });
  console.log(`✓ action_poses seeded: ${after} rows (dual ${dual.length} / solo ${solo.length})`);
})();
