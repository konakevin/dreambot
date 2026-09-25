#!/usr/bin/env node
/**
 * reconcile-shadow-renders.js — clears the SHADOW badges left on bot profiles after the
 * 2026-09-23 fold-in and the 2026-09-24 historical activation (Kevin, 2026-09-25: "i still see
 * shadow posts on a lot of bots … can we mix those in historically?").
 *
 * Every `uploads.shadow = true` row on a public bot is put into exactly one bucket:
 *
 *   DELETE  — DinoBot `amber-forest` (Kevin: "clean up the amber posts"). Rows AND storage objects
 *             go, after a JSON backup of every row (ids, urls, storage paths) is written to $HOME.
 *   FIX     — already public (folded in by scripts/fold-in-approved-renders.js, which set
 *             is_public / is_posted / posted_at but never cleared `shadow` nor backdated
 *             `created_at`). Set shadow=false and created_at=posted_at. Nothing else changes.
 *   PROMOTE — hidden, on a path that is LIVE on that bot, rendered on a model the path rolls
 *             today, and made AFTER the path's approved batch (for the 2026-09 new paths the
 *             approved batch is the one that was folded in; earlier rounds are the QA iterations
 *             with their documented defects). Handed to scripts/promote-shadow-path.js --ids, which
 *             backdates them into the bot's history.
 *   HIDE    — every other hidden render: a path no longer live, a model the path no longer rolls
 *             (probe renders), or a pre-approval QA round. shadow=false with is_public/is_posted
 *             left false, so the row shows NOWHERE (not the feed, not the profile, not the admin
 *             shadow view) but nothing is deleted.
 *
 * AlphaBot is skipped entirely (private proving ground).
 *
 * Dry-run by default; prints the plan per bot × path × bucket. `--execute` applies it.
 *
 *   node scripts/reconcile-shadow-renders.js --inventory <ultra/inventory.json>
 *   node scripts/reconcile-shadow-renders.js --inventory <…> --execute
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
const EXECUTE = args.includes('--execute');
const INVENTORY = flag('inventory', null);
const WEEKS = flag('weeks', '10');
if (!INVENTORY) {
  console.error('usage: --inventory <inventory.json> [--weeks 10] [--execute]');
  process.exit(2);
}

const DELETE_PATHS = new Set(['dinobot/amber-forest']);
const BATCH = 50;

const sb = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const short = (m) => String(m || '').replace(/^.*\//, '');
const die = (m) => {
  console.error('\nABORT: ' + m);
  process.exit(1);
};

// bot/path → Set of model short names the path rolls today (from the refreshed inventory)
const modelSet = new Map();
for (const r of JSON.parse(fs.readFileSync(INVENTORY, 'utf8'))) {
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

function storageRef(url) {
  const m = String(url || '').match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  return m ? { bucket: m[1], key: decodeURIComponent(m[2]) } : null;
}

(async () => {
  const { data: bots, error: bErr } = await sb
    .from('users')
    .select('id, username')
    .eq('is_bot', true);
  if (bErr) die(bErr.message);
  const uname = new Map(bots.map((b) => [b.id, String(b.username).toLowerCase()]));

  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb
      .from('uploads')
      .select(
        'id, user_id, created_at, posted_at, is_public, is_posted, image_url, image_url_display, image_url_thumb, image_url_hq, recipe, model, like_count, comment_count'
      )
      .eq('shadow', true)
      .order('created_at', { ascending: true })
      .range(from, from + 999);
    if (error) die(error.message);
    rows.push(...(data || []));
    if (!data || data.length < 1000) break;
  }

  // The DELETE paths go in full — every upload of that path on that bot, shadow-flagged or not
  // (amber-forest also has months of ordinary live posts that Kevin wants gone).
  const seen = new Set(rows.map((r) => r.id));
  for (const k of DELETE_PATHS) {
    const [bot, p] = k.split('/');
    const uid = [...uname.entries()].find(([, n]) => n === bot);
    if (!uid) die(`DELETE path ${k}: bot not found`);
    for (let from = 0; ; from += 1000) {
      const { data, error } = await sb
        .from('uploads')
        .select(
          'id, user_id, created_at, posted_at, is_public, is_posted, image_url, image_url_display, image_url_thumb, image_url_hq, recipe, model, like_count, comment_count'
        )
        .eq('user_id', uid[0])
        .eq('recipe->>path', p)
        .order('created_at', { ascending: true })
        .range(from, from + 999);
      if (error) die(error.message);
      for (const r of data || []) if (!seen.has(r.id)) (rows.push(r), seen.add(r.id));
      if (!data || data.length < 1000) break;
    }
  }

  // approval cutoff per bot/path = newest created_at among the already-public shadow rows
  const cutoff = new Map();
  for (const r of rows) {
    if (!(r.is_public || r.is_posted)) continue;
    const bot = uname.get(r.user_id);
    const p = r.recipe && r.recipe.path;
    if (!bot || !p) continue;
    const k = `${bot}/${p}`;
    if (DELETE_PATHS.has(k)) continue;
    if (!cutoff.has(k) || cutoff.get(k) < r.created_at) cutoff.set(k, r.created_at);
  }

  const plan = { DELETE: [], FIX: [], PROMOTE: [], HIDE: [] };
  const why = {};
  const tally = {};
  const note = (bot, p, action, reason) => {
    const k = `${bot} | ${p} | ${action}${reason ? ' (' + reason + ')' : ''}`;
    tally[k] = (tally[k] || 0) + 1;
  };
  for (const r of rows) {
    const bot = uname.get(r.user_id);
    if (!bot) continue; // not a bot upload — never touched
    if (bot === 'alphabot') continue;
    const p = (r.recipe && r.recipe.path) || '?';
    const k = `${bot}/${p}`;
    if (DELETE_PATHS.has(k)) {
      plan.DELETE.push(r);
      note(bot, p, 'DELETE');
      continue;
    }
    if (r.is_public || r.is_posted) {
      plan.FIX.push(r);
      note(bot, p, 'FIX');
      continue;
    }
    if (!livePaths.get(bot) || !livePaths.get(bot).has(p)) {
      plan.HIDE.push(r);
      why[r.id] = 'path not live';
      note(bot, p, 'HIDE', 'path not live');
      continue;
    }
    const set = modelSet.get(k);
    const m = short((r.recipe && r.recipe.model) || r.model);
    if (set && m && !set.has(m)) {
      plan.HIDE.push(r);
      why[r.id] = 'model not rolled: ' + m;
      note(bot, p, 'HIDE', 'off-model ' + m);
      continue;
    }
    if (cutoff.has(k) && r.created_at < cutoff.get(k)) {
      plan.HIDE.push(r);
      why[r.id] = 'pre-approval QA round';
      note(bot, p, 'HIDE', 'pre-approval round');
      continue;
    }
    plan.PROMOTE.push(r);
    note(bot, p, 'PROMOTE');
  }

  console.log(`shadow rows: ${rows.length}`);
  for (const k of Object.keys(tally).sort())
    console.log(`  ${k.padEnd(78)} ${String(tally[k]).padStart(4)}`);
  console.log(
    `\nTOTALS  delete ${plan.DELETE.length} | fix ${plan.FIX.length} | promote ${plan.PROMOTE.length} | hide ${plan.HIDE.length}`
  );

  // tripwires on the delete set
  for (const r of plan.DELETE) {
    if (uname.get(r.user_id) !== 'dinobot') die(`delete candidate ${r.id} is not DinoBot's`);
    if (!(r.recipe && r.recipe.path === 'amber-forest'))
      die(`delete candidate ${r.id} is not amber-forest`);
    if ((r.like_count || 0) + (r.comment_count || 0) > 0)
      console.log(
        `  ⚠️ ${r.id} has engagement (likes ${r.like_count}, comments ${r.comment_count})`
      );
  }

  if (!EXECUTE) {
    console.log('\nDRY RUN — nothing written. Re-run with --execute to apply.');
    return;
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backup = path.join(process.env.HOME, `dreambot-shadow-reconcile-backup-${stamp}.json`);
  fs.writeFileSync(backup, JSON.stringify({ when: stamp, plan, why }, null, 1));
  console.log(`\n✓ before-state backup: ${backup}`);

  // FIX — clear the badge on already-public rows, align created_at with the backdated posted_at
  let n = 0;
  for (const r of plan.FIX) {
    const { error } = await sb
      .from('uploads')
      .update({ shadow: false, created_at: r.posted_at || r.created_at })
      .eq('id', r.id)
      .eq('shadow', true);
    if (error) die(`FIX failed on ${r.id}: ${error.message}`);
    n++;
  }
  console.log(`✓ fixed ${n}/${plan.FIX.length} already-public rows`);

  // HIDE — drop the shadow flag; the row stays unposted and unpublished
  n = 0;
  for (const r of plan.HIDE) {
    const { error } = await sb
      .from('uploads')
      .update({ shadow: false })
      .eq('id', r.id)
      .eq('shadow', true)
      .eq('is_public', false)
      .eq('is_posted', false);
    if (error) die(`HIDE failed on ${r.id}: ${error.message}`);
    n++;
  }
  console.log(`✓ hid ${n}/${plan.HIDE.length} rows (shadow=false, still unposted)`);

  // DELETE — amber-forest rows + their storage objects, by primary key only
  const objects = {};
  for (const r of plan.DELETE) {
    for (const u of [r.image_url, r.image_url_display, r.image_url_thumb, r.image_url_hq]) {
      const ref = storageRef(u);
      if (ref) (objects[ref.bucket] = objects[ref.bucket] || new Set()).add(ref.key);
    }
  }
  const ids = plan.DELETE.map((r) => r.id);
  let del = 0;
  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH);
    const { error } = await sb.from('uploads').delete().in('id', chunk);
    if (error)
      die(`DELETE failed at batch ${i / BATCH} (${del} already removed): ${error.message}`);
    del += chunk.length;
  }
  let objN = 0;
  for (const [bucket, keys] of Object.entries(objects)) {
    const list = [...keys];
    for (let i = 0; i < list.length; i += BATCH) {
      const chunk = list.slice(i, i + BATCH);
      const { error } = await sb.storage.from(bucket).remove(chunk);
      if (error) console.log(`  ⚠️ storage ${bucket} batch ${i / BATCH} failed: ${error.message}`);
      else objN += chunk.length;
    }
  }
  console.log(`✓ deleted ${del} amber-forest rows and ${objN} storage objects`);

  // PROMOTE — per bot, through the existing backdating tool
  const byBot = new Map();
  for (const r of plan.PROMOTE) {
    const b = uname.get(r.user_id);
    if (!byBot.has(b)) byBot.set(b, []);
    byBot.get(b).push(r.id);
  }
  for (const [bot, list] of [...byBot.entries()].sort()) {
    const r = spawnSync(
      process.execPath,
      [
        'scripts/promote-shadow-path.js',
        '--bot',
        bot,
        '--ids',
        list.join(','),
        '--weeks',
        String(WEEKS),
      ],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
    );
    const out = (r.stdout || '') + (r.stderr || '');
    const promoted = (out.match(/Promoted (\d+)\/(\d+)/) || [])[0] || `exit ${r.status}`;
    console.log(`✓ ${bot}: ${promoted}`);
    if (r.status !== 0) console.log(out.split('\n').slice(-8).join('\n'));
  }

  const { count } = await sb
    .from('uploads')
    .select('id', { count: 'exact', head: true })
    .eq('shadow', true);
  console.log(`\nremaining shadow=true rows (all bots incl. AlphaBot): ${count}`);
})().catch((e) => die(e.message));
