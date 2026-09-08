#!/usr/bin/env node
/**
 * audit-themed-pool-realplaces.mjs — demote REAL-WORLD place names out of an IMAGINED / themed location's
 * pure-scene spot pool (LOCATION_SEED_PLAYBOOK.md; found 2026-09-08: "ghost town" carried Bodie / Jerome /
 * Rhyolite, "saloon" the Long Branch, "prehistoric" Stonehenge / Avebury — 30+ real anchors each — left by the
 * real-city generator; they render as postcards of somewhere else). Sonnet flags anchors naming a specific
 * real place / landmark / brand / franchise; flagged rows get pure_scene_eligible=false, never below --floor
 * eligible rows (top the pool up first with gen-themed-postcard-spots.mjs). NOT for real places (Coney
 * Island's own landmarks belong there).
 *
 *   node scripts/audit-themed-pool-realplaces.mjs --locations "ghost town,saloon" [--floor 45] [--dry-run]
 */
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';
const R = '/Users/kevinmchenry/Development/apps/dreambot';
const env = Object.fromEntries(
  fs
    .readFileSync(R + '/.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [
        l.slice(0, i).trim(),
        l
          .slice(i + 1)
          .trim()
          .replace(/^["']|["']$/g, ''),
      ];
    })
);
const sb = createClient(env.EXPO_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
const argOf = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const LOCS = argOf('locations', '')
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean);
const FLOOR = Number(argOf('floor', 45));
if (!LOCS.length) {
  console.error('--locations required');
  process.exit(1);
}
const DRY = process.argv.includes('--dry-run');
for (const key of LOCS) {
  const { data: rows } = await sb
    .from('location_iconic_spots')
    .select('id,spot_text')
    .eq('location_key', key)
    .eq('is_active', true)
    .eq('pure_scene_eligible', true);
  const list = rows.map((r, i) => `${i + 1}. ${r.spot_text}`).join('\n');
  const prompt = `These are scene anchors for an IMAGINED, generic themed dream world called "${key}" (not a real place). Flag every anchor that names a SPECIFIC REAL-WORLD place, landmark, company, brand, event or franchise (e.g. "Brompton Cemetery", "Georgetown Loop Railroad", "Ring of Brodgar", "Coney Island Cyclone" counts as real for every world EXCEPT "coney island" itself, which is a real place — for "coney island" flag only anchors that name a place NOT on Coney Island). Generic words ("a saloon", "a cemetery avenue", "a stone circle") are fine.\n\n${list}\n\nOutput ONLY a JSON array of the flagged anchor numbers, e.g. [3, 17]. Empty array if none.`;
  const resp = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  });
  let nums = [];
  try {
    nums = JSON.parse(
      resp.content[0].text
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```\s*$/, '')
    );
  } catch {
    const m = resp.content[0].text.match(/\[[\d,\s]*\]/);
    nums = m ? JSON.parse(m[0]) : [];
  }
  const flagged = nums.map((n) => rows[n - 1]).filter(Boolean);
  const keep = rows.length - flagged.length;
  const demote = keep >= FLOOR ? flagged : flagged.slice(0, Math.max(0, rows.length - FLOOR));
  console.log(
    `${key.padEnd(18)} eligible ${rows.length} | real-place flagged ${flagged.length} | demoting ${demote.length} → ${rows.length - demote.length}`
  );
  for (const f of flagged.slice(0, 4)) console.log('    ·', f.spot_text.slice(0, 100));
  if (!DRY && demote.length) {
    const { error } = await sb
      .from('location_iconic_spots')
      .update({ pure_scene_eligible: false })
      .in(
        'id',
        demote.map((d) => d.id)
      );
    if (error) console.log('   ✗', error.message);
  }
}
