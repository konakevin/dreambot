#!/usr/bin/env node
/**
 * backfill-cast-ethnicity.mjs — one-time (resumable) fill of the new
 * dream_cast[].ethnicity field on EXISTING users, so the race anchor
 * (RACE_FIDELITY_PLAN.md) has data to work with before those users' next nightly.
 *
 * For every human cast member (self / plus_one, NOT pet) that lacks `ethnicity`,
 * resolves the photo (thumb_url or a signed cast-photos storage_path), runs the
 * SAME justification-free closed-set Haiku read as _shared/vision.classifyEthnicity,
 * and writes one of the 6 buckets (or leaves it unset when null/uncertain →
 * skin-tone fallback at render). Skips members already filled, so re-running is safe.
 *
 * Cheap: Haiku vision calls only, NO renders / no DB-pool pressure. Gentle throttle.
 *
 *   node scripts/backfill-cast-ethnicity.mjs            # DRY RUN
 *   node scripts/backfill-cast-ethnicity.mjs --write    # apply
 */
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { createClient } = require('@supabase/supabase-js');
const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => {
    const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
const ANTH = env.ANTHROPIC_API_KEY, HAIKU = 'claude-haiku-4-5-20251001';
const WRITE = process.argv.includes('--write');
const BUCKETS = ['White', 'Black', 'East Asian', 'South Asian', 'Hispanic/Latino', 'Middle Eastern'];
const PROMPT =
  "Which single option best matches this person's broad appearance? Choose EXACTLY one and reply with only that option, nothing else:\n" +
  BUCKETS.join(', ') + ', Uncertain.';

async function classify(url) {
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTH, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: HAIKU, max_tokens: 30, messages: [{ role: 'user', content: [{ type: 'image', source: { type: 'url', url } }, { type: 'text', text: PROMPT }] }] }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const t = (j.content?.[0]?.text || '').toLowerCase();
    return [...BUCKETS].sort((a, b) => b.length - a.length).find((b) => t.includes(b.toLowerCase())) || null;
  } catch { return null; }
}
async function photoUrl(m) {
  if (m.thumb_url) return m.thumb_url;
  if (m.storage_path) {
    const { data } = await sb.storage.from('cast-photos').createSignedUrl(m.storage_path, 300);
    return data?.signedUrl || null;
  }
  return null;
}

(async () => {
  const recipes = [];
  for (let from = 0; ; from += 1000) {
    const { data } = await sb.from('user_recipes').select('user_id, recipe').order('user_id').range(from, from + 999);
    if (!data || !data.length) break;
    recipes.push(...data); if (data.length < 1000) break;
  }
  let users = 0, classified = 0, nulls = 0, skipped = 0, noPhoto = 0;
  const tally = {};
  for (const r of recipes) {
    const cast = r.recipe?.dream_cast;
    if (!Array.isArray(cast) || !cast.length) continue;
    let changed = false;
    for (const m of cast) {
      if (m.role === 'pet') continue;
      if (m.ethnicity) { skipped++; continue; }
      const url = await photoUrl(m);
      if (!url) { noPhoto++; continue; }
      const eth = await classify(url);
      if (eth) { m.ethnicity = eth; classified++; changed = true; tally[eth] = (tally[eth] || 0) + 1; }
      else nulls++;
      await new Promise((s) => setTimeout(s, 250)); // gentle throttle
    }
    if (changed) {
      users++;
      if (WRITE) {
        const { error } = await sb.from('user_recipes').update({ recipe: r.recipe }).eq('user_id', r.user_id);
        if (error) console.error(`  ✗ ${r.user_id.slice(0, 8)}: ${error.message}`);
      }
      console.log(`  ${r.user_id.slice(0, 8)}: ${cast.filter((m) => m.ethnicity).map((m) => `${m.role}=${m.ethnicity}`).join(', ')}`);
    }
  }
  console.log(`\n${WRITE ? 'APPLIED' : 'DRY RUN'} — users touched: ${users}, classified: ${classified}, null/uncertain: ${nulls}, already-set: ${skipped}, no-photo: ${noPhoto}`);
  console.log('bucket tally:', JSON.stringify(tally));
  if (!WRITE) console.log('(re-run with --write to apply)');
})().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
