#!/usr/bin/env node
/**
 * backfill-cast-haircolor.mjs — fix stored dream_cast hair COLOR fleet-wide.
 * The combined describe-photo is unreliable on hair color (mislabeled a dirty-
 * blonde/greying man "chestnut brown"); a FOCUSED single-trait read is accurate.
 * For each human cast member, runs the focused read + swaps the color in the
 * stored physical_summary (keeping cut/style). Mirrors vision.classifyHairColor +
 * replaceHairColorInSummary. Cheap (Haiku only), resumable (marks via _hairFixed).
 *   node scripts/backfill-cast-haircolor.mjs            # DRY RUN
 *   node scripts/backfill-cast-haircolor.mjs --write    # apply
 */
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { createClient } = require('@supabase/supabase-js');
const env = Object.fromEntries(fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
const ANTH = env.ANTHROPIC_API_KEY, HAIKU = 'claude-haiku-4-5-20251001';
const WRITE = process.argv.includes('--write');

async function hairColor(url) {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': ANTH, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: HAIKU, max_tokens: 20, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'url', url } }, { type: 'text', text: "In 2 to 4 words, what is this person's natural hair color (say 'greying' or 'salt-and-pepper' if grey is present)? Reply with only the color words, nothing else." }] }] }) });
    if (!r.ok) return null;
    const t = ((await r.json()).content?.[0]?.text || '').trim();
    if (!t || t.length > 40 || /(cannot|can't|unable|sorry|not able)/i.test(t)) return null;
    return t.toLowerCase();
  } catch { return null; }
}
function replaceHair(summary, color) {
  if (!summary || !color) return summary;
  const parts = summary.split(',');
  const idx = parts.findIndex((p) => /\bhair\b/i.test(p) && !/\b(beard|mustache|moustache|stubble|sideburns)\b/i.test(p));
  if (idx === -1) return `${color} hair, ${summary}`;
  parts[idx] = parts[idx].replace(/^(\s*).*?\bhair\b/i, `$1${color} hair`);
  return parts.join(',');
}
async function photoUrl(m) {
  if (m.thumb_url) return m.thumb_url;
  if (m.storage_path) { const { data } = await sb.storage.from('cast-photos').createSignedUrl(m.storage_path, 300); return data?.signedUrl || null; }
  return null;
}
(async () => {
  const recipes = [];
  for (let f = 0; ; f += 1000) { const { data } = await sb.from('user_recipes').select('user_id, recipe').order('user_id').range(f, f + 999); if (!data || !data.length) break; recipes.push(...data); if (data.length < 1000) break; }
  let users = 0, fixed = 0, skipped = 0, noPhoto = 0;
  for (const r of recipes) {
    const cast = r.recipe?.dream_cast; if (!Array.isArray(cast) || !cast.length) continue;
    let changed = false;
    for (const m of cast) {
      if (m.role === 'pet' || m._hairFixed) { if (m._hairFixed) skipped++; continue; }
      const url = await photoUrl(m); if (!url) { noPhoto++; continue; }
      const c = await hairColor(url);
      if (c) { const before = m.physical_summary; m.physical_summary = replaceHair(m.physical_summary || '', c); m._hairFixed = true; changed = true; fixed++; console.log(`  ${r.user_id.slice(0, 8)}/${m.role}: "${(before || '').slice(0, 40)}" → hair="${c}"`); }
      await new Promise((s) => setTimeout(s, 250));
    }
    if (changed) { users++; if (WRITE) { const { error } = await sb.from('user_recipes').update({ recipe: r.recipe }).eq('user_id', r.user_id); if (error) console.error(`  ✗ ${r.user_id.slice(0, 8)}: ${error.message}`); } }
  }
  console.log(`\n${WRITE ? 'APPLIED' : 'DRY RUN'} — users: ${users}, hair fixed: ${fixed}, already: ${skipped}, no-photo: ${noPhoto}`);
})().catch((e) => { console.error('FATAL', e.message); process.exit(1); });
