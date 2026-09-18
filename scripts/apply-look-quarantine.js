#!/usr/bin/env node
/**
 * apply-look-quarantine.js — the purple QUARANTINE button is how Kevin retires a look.
 *
 * Rule (Kevin, 2026-09-13): "we have the purple quarantine button on posts and i would like to use that in order to
 * flag looks i want removed." So every quarantined render votes against the LOOK it rendered with, and this takes
 * that look out of the nightly catalogue for every model and every surface.
 *
 * The lever is `dream_mediums.nightly_enabled = false` — the same switch the loader gates on, one row per look,
 * reversible with `nightly_enabled = true`. The look's grading history in `nightly_look_approvals` is left intact,
 * and the reason is written into `client_meta.quarantine_strike` so a later reader knows why it went.
 *
 * Quarantine only hides a render (`quarantined_at`, migration 449); it is the admin's "this is a bad render" tap,
 * so it is exactly the signal we want and it works on ANY dream, not just QA rounds.
 *
 *   node scripts/apply-look-quarantine.js              # dry run: what would be retired, and why
 *   node scripts/apply-look-quarantine.js --apply      # retire them
 *   node scripts/apply-look-quarantine.js --since=2026-09-01 [--min=2]
 */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const ROOT = path.join(__dirname, '..');
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(ROOT, '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);
const s = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const APPLY = process.argv.includes('--apply');
const since = (process.argv.find((a) => a.startsWith('--since=')) || '').split('=')[1] || null;
const min = parseInt(
  (process.argv.find((a) => a.startsWith('--min=')) || '--min=1').split('=')[1],
  10
);

(async () => {
  let q = s
    .from('uploads')
    .select('id,dream_medium,model,face_swap_mode,quarantined_at,created_at')
    .not('quarantined_at', 'is', null)
    .order('quarantined_at', { ascending: false })
    .limit(1000);
  if (since) q = q.gte('quarantined_at', since);
  const { data: bad, error } = await q;
  if (error) return console.log('ERR', error.message);
  const { data: looks } = await s
    .from('dream_mediums')
    .select('key,label,nightly_enabled,nightly_family,client_meta')
    .eq('nightly_look', true);
  const byKey = new Map((looks || []).map((l) => [l.key, l]));

  // Resolving the look from a quarantined render, two ways, because the two engine states store it differently:
  //   minimal  — the look IS the medium (it is pinned), so uploads.dream_medium already holds the look key;
  //   looks path — the medium column holds the provisional medium, and the look lives in the render's
  //                ai_generation_log stamps (`look:<key>`), joined by upload_id.
  // Quarantine is a soft hide (migration 449): the row, the image and the log all survive, so either lookup works
  // long after the render disappears from every feed.
  const ids = (bad || []).map((u) => u.id);
  const stampLook = new Map();
  for (let i = 0; i < ids.length; i += 200) {
    const { data: logs } = await s
      .from('ai_generation_log')
      .select('upload_id,rolled_axes,fallback_reasons')
      .in('upload_id', ids.slice(i, i + 200));
    for (const g of logs || []) {
      // The look stamp lives in fallback_reasons (`look:<key>`); rolled_axes.stamps was never written.
      const stamps = [
        ...((g.rolled_axes && g.rolled_axes.stamps) || []),
        ...(Array.isArray(g.fallback_reasons) ? g.fallback_reasons : []),
      ];
      const hit = stamps.map(String).find((x) => /^look:/.test(x));
      if (hit) stampLook.set(g.upload_id, hit.replace('look:', ''));
    }
  }
  const hits = new Map();
  let unresolved = 0;
  for (const u of bad || []) {
    const key =
      u.dream_medium && byKey.has(u.dream_medium)
        ? u.dream_medium
        : byKey.has(stampLook.get(u.id) || '')
          ? stampLook.get(u.id)
          : null;
    if (!key) {
      if (u.dream_medium && !/bot_|^render$/.test(u.dream_medium)) unresolved++;
      continue; // a bot render or a legacy medium — not a nightly look, so nothing to retire
    }
    if (!hits.has(key)) hits.set(key, []);
    hits.get(key).push({ ...u, via: u.dream_medium === key ? 'medium' : 'log stamp' });
  }
  if (unresolved > 0)
    console.log(
      `(${unresolved} quarantined render(s) could not be matched to a nightly look — legacy mediums)`
    );
  console.log(
    `quarantined renders${since ? ` since ${since}` : ''}: ${(bad || []).length} · of those on a nightly look: ${[...hits.values()].reduce((a, b) => a + b.length, 0)}`
  );
  if (hits.size === 0) return console.log('nothing to retire.');

  const toRetire = [];
  console.log(`\nLOOKS FLAGGED BY QUARANTINE (threshold: ${min} render${min > 1 ? 's' : ''}):`);
  for (const [key, us] of [...hits.entries()].sort((a, b) => b[1].length - a[1].length)) {
    const row = byKey.get(key);
    const live = row.nightly_enabled !== false;
    const act = us.length >= min && live;
    if (act) toRetire.push({ key, us });
    console.log(
      `  ${key.replace('nightly_', '').padEnd(26)} ${String(us.length).padStart(2)} quarantined · ${row.nightly_family} · ${live ? 'in the catalogue' : 'ALREADY retired'}${act ? '  → RETIRE' : us.length < min ? '  (under threshold)' : ''}`
    );
    for (const u of us.slice(0, 3))
      console.log(
        `      ${u.quarantined_at.slice(0, 16)} ${String(u.model || '')
          .split('/')
          .pop()} · found via ${u.via}`
      );
  }
  if (!APPLY)
    return console.log(
      `\n(dry run — ${toRetire.length} look(s) would leave the catalogue; pass --apply)`
    );

  for (const { key, us } of toRetire) {
    const row = byKey.get(key);
    const meta = {
      ...(row.client_meta || {}),
      quarantine_strike: {
        at: new Date().toISOString(),
        uploads: us.slice(0, 20).map((u) => u.id),
        count: us.length,
      },
    };
    const { error: e } = await s
      .from('dream_mediums')
      .update({ nightly_enabled: false, client_meta: meta })
      .eq('key', key);
    console.log(e ? `  ERR ${key}: ${e.message}` : `  retired ${key}`);
  }
  const { data: left } = await s
    .from('dream_mediums')
    .select('key')
    .eq('nightly_look', true)
    .neq('nightly_enabled', false);
  console.log(
    `\ncatalogue now holds ${(left || []).length} enabled nightly looks. Restore any with nightly_enabled = true.`
  );
})();
