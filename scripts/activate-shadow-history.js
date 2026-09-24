#!/usr/bin/env node
/**
 * activate-shadow-history.js — Phase B of AXIS_POOL_EXPANSION.md (Kevin 2026-09-24:
 * "historical activation of shadow posts for all bots").
 *
 * Picks, per bot and per LIVE path, the hidden shadow renders that are safe to make public, then
 * hands them to scripts/promote-shadow-path.js (--bot --ids), which flips them public and threads
 * them into the bot's past feed at a natural cadence. Selection rules (all four must hold):
 *
 *   1. the render's path is in the bot's live `paths[]` today (not disabled, parked, moved or cut)
 *   2. the render's model is one the path can roll today (its pin or its picker pool)
 *   3. for a path the reseed program paired before/after, only the AFTER renders (the harness's
 *      own record of which renders used the new pool); every other path: any render
 *   4. at most --cap per path (default 12), newest first
 *
 * Usage:
 *   node scripts/activate-shadow-history.js --inventory <inventory.json> --harness <scratchpad>
 *        [--cap 12] [--weeks 8] [--bot faebot] [--dry-run]
 *
 * --inventory  the fleet model inventory (bot/path → configured model shares); see the study run
 * --harness    the scratchpad root holding the reseed harness runs (<run>/after/render-results.json)
 * --dry-run    print the plan (and the promotion script's own dry-run) and write nothing
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : fb;
};
const DRY = args.includes('--dry-run');
const CAP = parseInt(flag('cap', '12'), 10);
const WEEKS = parseInt(flag('weeks', '8'), 10);
const ONLY_BOT = flag('bot', null);
const INVENTORY = flag('inventory', null);
const HARNESS = flag('harness', null);
if (!INVENTORY || !HARNESS) {
  console.error(
    'usage: --inventory <inventory.json> --harness <scratchpad dir> [--cap 12] [--weeks 8] [--bot X] [--dry-run]'
  );
  process.exit(2);
}
const sb = createClient(
  process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const short = (m) => String(m || '').replace(/^.*\//, '');

// bot/path → Set of model short names the path can roll today
const inventory = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const modelSet = new Map();
for (const r of inventory) {
  if (!r.dist) continue;
  modelSet.set(
    `${r.bot}/${r.path}`,
    new Set(
      Object.entries(r.dist)
        .filter(([, v]) => v > 0)
        .map(([m]) => m)
    )
  );
}
// live paths per bot, from the modules themselves
const livePaths = new Map();
for (const d of fs.readdirSync('scripts/bots')) {
  const f = path.join('scripts/bots', d, 'index.js');
  if (!fs.existsSync(f)) continue;
  // eslint-disable-next-line global-require
  const bot = require(path.resolve(f));
  livePaths.set(d, new Set(bot.paths || []));
}

// The reseed harness's AFTER records: image URL → true. Any path that appears here is a paired
// path, and only these URLs qualify for it.
const afterUrls = new Set();
const pairedPaths = new Set();
function harvest(file) {
  let rows;
  try {
    rows = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return;
  }
  for (const r of rows) if (r && r.ok && r.url) afterUrls.add(r.url);
}
for (const d of fs.readdirSync(HARNESS)) {
  const after = path.join(HARNESS, d, 'after', 'render-results.json');
  if (fs.existsSync(after)) harvest(after);
}

(async () => {
  // all hidden shadow renders, with their bot username
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from('uploads')
      .select('id, user_id, created_at, image_url, recipe, model')
      .eq('shadow', true)
      .eq('is_public', false)
      .order('created_at', { ascending: false })
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }
  const { data: users } = await sb
    .from('users')
    .select('id, username')
    .in('id', [...new Set(rows.map((r) => r.user_id))]);
  const uname = new Map((users || []).map((u) => [u.id, String(u.username).toLowerCase()]));
  // A path is "paired" (reseed before/after) when any of its hidden renders is one of the
  // harness's AFTER renders; for those paths only the AFTER renders qualify.
  for (const r of rows) {
    if (afterUrls.has(r.image_url) && r.recipe && r.recipe.path && uname.get(r.user_id))
      pairedPaths.add(`${uname.get(r.user_id)}/${r.recipe.path}`);
  }

  const plan = new Map(); // bot → { path → [ids] }
  const skipped = {};
  const skip = (why) => (skipped[why] = (skipped[why] || 0) + 1);
  const perPath = new Map();
  for (const r of rows) {
    const bot = uname.get(r.user_id);
    const p = r.recipe && r.recipe.path;
    if (!bot || !p) continue;
    if (bot === 'alphabot') {
      skip('alphabot (private)');
      continue;
    }
    if (!livePaths.has(bot) || !livePaths.get(bot).has(p)) {
      skip('path not live on that bot');
      continue;
    }
    const key = `${bot}/${p}`;
    const model = short((r.recipe && r.recipe.model) || r.model);
    const set = modelSet.get(key);
    if (set && model && !set.has(model)) {
      skip('model the path no longer rolls');
      continue;
    }
    if (pairedPaths.has(key) && !afterUrls.has(r.image_url)) {
      skip('reseed "before" render');
      continue;
    }
    const list = perPath.get(key) || [];
    if (list.length >= CAP) {
      skip('over the per-path cap');
      continue;
    }
    list.push(r.id);
    perPath.set(key, list);
  }
  for (const [key, ids] of perPath) {
    const [bot, p] = key.split('/');
    if (!plan.has(bot)) plan.set(bot, new Map());
    plan.get(bot).set(p, ids);
  }

  console.log(
    `shadow renders considered: ${rows.length} | paired (reseed) paths known: ${pairedPaths.size} | after-URLs indexed: ${afterUrls.size}`
  );
  console.log('skipped:', JSON.stringify(skipped));
  const summary = [];
  for (const [bot, paths] of [...plan.entries()].sort()) {
    if (ONLY_BOT && bot !== ONLY_BOT) continue;
    const ids = [...paths.values()].flat();
    console.log(
      `\n${bot}: ${ids.length} renders across ${paths.size} paths — ${[...paths.entries()].map(([p, l]) => `${p} ${l.length}`).join(', ')}`
    );
    const cmd = [
      'scripts/promote-shadow-path.js',
      '--bot',
      bot,
      '--ids',
      ids.join(','),
      '--weeks',
      String(WEEKS),
    ];
    if (DRY) cmd.push('--dry-run');
    const r = spawnSync(process.execPath, cmd, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    const out = (r.stdout || '') + (r.stderr || '');
    console.log(
      out
        .split('\n')
        .filter((l) => /promot|schedul|dry|error|Error|✓|✅|would|Promoted|window/i.test(l))
        .slice(0, 12)
        .map((l) => '   ' + l)
        .join('\n')
    );
    summary.push({ bot, paths: paths.size, candidates: ids.length, exit: r.status, dry: DRY });
  }
  fs.writeFileSync(
    'scratch-activation-plan.json',
    JSON.stringify(
      {
        when: new Date().toISOString(),
        dry: DRY,
        summary,
        plan: Object.fromEntries([...plan].map(([b, m]) => [b, Object.fromEntries(m)])),
      },
      null,
      1
    )
  );
  console.log('\nsummary:', JSON.stringify(summary));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
