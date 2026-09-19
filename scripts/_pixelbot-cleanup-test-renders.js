#!/usr/bin/env node
/**
 * Delete PixelBot's SHADOW test renders from the scene-path build
 * (Kevin, 2026-09-19: "cleanup all the test renders").
 *
 * Scope is deliberately narrow and triple-guarded: PixelBot's user id AND
 * shadow = true AND created_at >= --since. Public posts, other bots and any
 * non-shadow row can never match. Storage objects are removed first, then the
 * rows. Dry-run by default; pass --apply to delete.
 *
 *   node scripts/_pixelbot-cleanup-test-renders.js --since 2026-09-19T05:00:00Z
 *   node scripts/_pixelbot-cleanup-test-renders.js --since 2026-09-19T05:00:00Z --apply
 */
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=') && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]; })
);
const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const PIXELBOT = '87b57ebe-30b0-44d9-9f74-a1e65a066caf';
const BUCKET = 'uploads';
const argv = process.argv.slice(2);
const arg = (n, fb) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : fb; };
const SINCE = arg('since');
const APPLY = argv.includes('--apply');
if (!SINCE) { console.error('--since <ISO> is required'); process.exit(2); }

// "…/storage/v1/object/public/uploads/<path>" → "<path>"
const keyOf = (url) => {
  const m = String(url || '').match(new RegExp(`/object/public/${BUCKET}/(.+)$`));
  return m ? decodeURIComponent(m[1].split('?')[0]) : null;
};

(async () => {
  const rows = [];
  for (let from = 0; ; from += 1000) { // PostgREST caps reads at 1000
    const { data, error } = await sb.from('uploads')
      .select('id, caption, image_url, image_url_display, created_at, shadow, is_public, is_posted')
      .eq('user_id', PIXELBOT).eq('shadow', true).gte('created_at', SINCE)
      .order('created_at', { ascending: true }).range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) break;
  }
  const byPath = {};
  for (const r of rows) { const m = String(r.caption).match(/^\[([^\]]+)\]/); const k = m ? m[1] : '(none)'; byPath[k] = (byPath[k] || 0) + 1; }
  console.log(`matched ${rows.length} shadow rows since ${SINCE}`);
  for (const [k, v] of Object.entries(byPath).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(24)} ${v}`);
  const leaked = rows.filter((r) => r.is_public || r.is_posted);
  if (leaked.length) { console.error(`REFUSING: ${leaked.length} matched rows are public/posted`); process.exit(1); }
  if (!APPLY) { console.log('\nDRY RUN — pass --apply to delete.'); return; }

  const keys = [...new Set(rows.flatMap((r) => [keyOf(r.image_url), keyOf(r.image_url_display)]).filter(Boolean))];
  let removed = 0;
  for (let i = 0; i < keys.length; i += 100) {
    const chunk = keys.slice(i, i + 100);
    const { error } = await sb.storage.from(BUCKET).remove(chunk);
    if (error) console.warn('  storage warn:', error.message);
    else removed += chunk.length;
  }
  console.log(`storage objects removed: ${removed} of ${keys.length}`);

  let deleted = 0;
  for (let i = 0; i < rows.length; i += 100) {
    const ids = rows.slice(i, i + 100).map((r) => r.id);
    const { error } = await sb.from('uploads').delete().in('id', ids);
    if (error) throw error;
    deleted += ids.length;
  }
  console.log(`upload rows deleted: ${deleted}`);

  const { count } = await sb.from('uploads').select('id', { count: 'exact', head: true })
    .eq('user_id', PIXELBOT).eq('shadow', true).gte('created_at', SINCE);
  console.log(`remaining shadow rows in window: ${count === null ? 'unknown' : count}`);
})().catch((e) => { console.error(e); process.exit(1); });
