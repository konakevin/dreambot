#!/usr/bin/env node
/**
 * Remove PixelBot posts belonging to paths that were CUT from the roster
 * (2026-09-19). Deletes storage objects, then likes/comments, then the rows.
 *
 * Guarded: user_id = PixelBot AND the caption's [path] tag is in an explicit
 * allow-list passed on the command line. Nothing else can match. Dry-run by
 * default; --apply performs the delete.
 *
 *   node scripts/_pixelbot-remove-cut-path-posts.js --paths jrpg-combat,dungeon-depth
 *   node scripts/_pixelbot-remove-cut-path-posts.js --paths ... --apply
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
const arg = (n) => { const i = argv.indexOf('--' + n); return i >= 0 ? argv[i + 1] : null; };
const APPLY = argv.includes('--apply');
const PATHS = (arg('paths') || '').split(',').map((s) => s.trim()).filter(Boolean);
if (!PATHS.length) { console.error('--paths <a,b,c> is required'); process.exit(2); }

const keyOf = (url) => {
  const m = String(url || '').match(new RegExp(`/object/public/${BUCKET}/(.+)$`));
  return m ? decodeURIComponent(m[1].split('?')[0]) : null;
};

(async () => {
  const all = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from('uploads')
      .select('id, caption, image_url, image_url_display, created_at, shadow, is_public')
      .eq('user_id', PIXELBOT).order('created_at', { ascending: true }).range(from, from + 999);
    if (error) throw error;
    all.push(...data);
    if (data.length < 1000) break;
  }
  const tagOf = (c) => { const m = String(c || '').match(/^\[([^\]]+)\]/); return m ? m[1] : null; };
  const rows = all.filter((r) => PATHS.includes(tagOf(r.caption)));

  const by = {};
  for (const r of rows) { const t = tagOf(r.caption); (by[t] = by[t] || []).push(r); }
  console.log(`PixelBot has ${all.length} uploads; ${rows.length} match the ${PATHS.length} named paths:`);
  for (const p of PATHS) console.log(`  ${p.padEnd(24)}${(by[p] || []).length}`);

  // Safety: nothing outside the allow-list, and the untouched remainder must survive.
  const stray = rows.filter((r) => !PATHS.includes(tagOf(r.caption)));
  if (stray.length) { console.error('REFUSING: selection leaked outside the allow-list'); process.exit(1); }
  console.log(`\nremaining PixelBot uploads after this delete: ${all.length - rows.length}`);
  if (!APPLY) { console.log('\nDRY RUN — pass --apply to delete.'); return; }

  const ids = rows.map((r) => r.id);
  let likes = 0, comments = 0;
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const l = await sb.from('likes').delete().in('upload_id', chunk).select('upload_id');
    if (l.error) console.warn('  likes warn:', l.error.message); else likes += l.data.length;
    const c = await sb.from('comments').delete().in('upload_id', chunk).select('id');
    if (c.error) console.warn('  comments warn:', c.error.message); else comments += c.data.length;
  }
  console.log(`likes removed: ${likes} | comments removed: ${comments}`);

  const keys = [...new Set(rows.flatMap((r) => [keyOf(r.image_url), keyOf(r.image_url_display)]).filter(Boolean))];
  let removed = 0;
  for (let i = 0; i < keys.length; i += 100) {
    const { error } = await sb.storage.from(BUCKET).remove(keys.slice(i, i + 100));
    if (error) console.warn('  storage warn:', error.message); else removed += Math.min(100, keys.length - i);
  }
  console.log(`storage objects removed: ${removed} of ${keys.length}`);

  let deleted = 0;
  for (let i = 0; i < ids.length; i += 100) {
    const { error } = await sb.from('uploads').delete().in('id', ids.slice(i, i + 100));
    if (error) throw error;
    deleted += Math.min(100, ids.length - i);
  }
  console.log(`upload rows deleted: ${deleted}`);

  const { count } = await sb.from('uploads').select('id', { count: 'exact', head: true }).eq('user_id', PIXELBOT);
  console.log(`PixelBot uploads now: ${count}`);
})().catch((e) => { console.error(e); process.exit(1); });
