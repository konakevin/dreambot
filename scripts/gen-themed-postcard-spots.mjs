#!/usr/bin/env node
/**
 * gen-themed-postcard-spots.mjs — top up a THEMED / imagined location's pure-scene spot pool to a target
 * eligible depth (LOCATION_SEED_PLAYBOOK.md "Depth floor + mix"; Kevin 2026-09-08: bring the thin
 * fantasy/themed places to 50). gen-postcard-spots.js is built for the 48 real cities ("reads as the real
 * place to anyone who has been there"); themed worlds need the world's OWN bible (the location card's
 * atmosphere / architecture / light / cinematic phrases / must-include) and a rubric that asks for
 * signature POVs of that KIND of place.
 *
 *   node scripts/gen-themed-postcard-spots.mjs --locations "haunted mansion,ghost town" [--to 50] [--dry-run]
 *
 * Per location: eligible = active & pure_scene_eligible; need = target − eligible (+3 margin); Sonnet
 * writes `need` anchors (≤ 25 per call) against 15 existing samples for dedup; rows are scale-classified
 * (wide / medium / intimate) and follow the playbook's two eligibility rules: pure_scene_eligible = active
 * & NON-intimate, character_eligible = active & NON-wide; quality_tier 'S' (postcard by construction).
 * Refusal / markdown leaks ("**", "I can't") are dropped before insert. Idempotent by exact spot_text.
 */
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const env = Object.fromEntries(
  fs
    .readFileSync('.env.local', 'utf8')
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
const sb = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co',
  env.SUPABASE_SERVICE_ROLE_KEY
);
const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
const SONNET = 'claude-sonnet-4-6';
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const LOCS = arg('locations', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const TARGET = Number(arg('to', 50));
const DRY = process.argv.includes('--dry-run');
if (!LOCS.length) {
  console.error('--locations required');
  process.exit(1);
}

function classifyScale(t) {
  const s = t.toLowerCase();
  if (
    /(expanse|range|panorama|skyline|plain|vista|ridge|valley|savanna|prairie|aerial|from above|from the air|across the|sweeping|horizon|whole (town|city|valley)|far below|stretching)/.test(
      s
    )
  )
    return 'wide';
  if (
    /(interior|inside|close-up|closeup|detail of|macro|on the table|on a shelf|tabletop|a single|corner of|nook|alcove|window sill|doorway detail)/.test(
      s
    )
  )
    return 'intimate';
  return 'medium';
}
const REFUSAL = /\*\*|\bI can(?:'|’)?t\b|\bI cannot\b|\bAs an AI\b|\bI'm unable\b/i;

const RUBRIC = (
  card,
  n,
  samples
) => `You are a postcard curator for an imagined, themed dream world called "${card.display_name || card.name}".
World bible (author against it, never contradict it):
- atmosphere: ${(card.atmosphere || []).slice(0, 6).join('; ')}
- architecture / built forms: ${(card.architecture || []).slice(0, 6).join('; ')}
- light: ${(card.light_signature || []).slice(0, 4).join('; ')}
- palette: ${(card.visual_palette || []).slice(0, 5).join('; ')}
- cinematic phrases: ${(card.cinematic_phrases || []).slice(0, 5).join('; ')}
- must include somewhere in the pool: ${(card.must_include || []).slice(0, 5).join('; ')}

Author EXACTLY ${n} fresh pure-scene anchors — beautiful, specific, postcard-worthy POVs of THIS world that could be the locked subject of a no-human image render. Each anchor:
  • names a SPECIFIC vantage inside the world (a named-feeling place + what you see from it), 10-22 words, dense concrete nouns, its own light or weather;
  • reads instantly as this KIND of place (a ${card.name}) — its signature forms, not a generic landscape;
  • is compelling as a single still frame with NO people (no man/woman/person/figure/crowd/face/eyes words; creatures, statues-as-silhouettes and distant lights are fine);
  • mix of scales: ~45% wide vistas, ~45% medium landmark-with-context, ~10% intimate corners;
  • no text, signs or lettering; no real brand, franchise or character names.
Do NOT duplicate any of these existing anchors:
${samples.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}
Output STRICTLY a JSON array of exactly ${n} strings, JSON only.`;

async function topUp(key) {
  const { data: card } = await sb
    .from('location_cards')
    .select(
      'name,display_name,atmosphere,architecture,light_signature,visual_palette,cinematic_phrases,must_include'
    )
    .eq('name', key)
    .maybeSingle();
  if (!card) {
    console.log(`  ✗ ${key}: no location card`);
    return 0;
  }
  const { data: rows } = await sb
    .from('location_iconic_spots')
    .select('spot_text,is_active,pure_scene_eligible,quality_tier')
    .eq('location_key', key);
  const existing = new Set((rows || []).map((r) => r.spot_text.trim().toLowerCase()));
  const eligible = (rows || []).filter((r) => r.is_active && r.pure_scene_eligible).length;
  const need = Math.max(0, TARGET + 3 - eligible);
  console.log(`\n${key}: eligible ${eligible} → need ${need}`);
  if (!need) return 0;
  const samples = (rows || [])
    .filter((r) => r.is_active)
    .sort((a, b) => (a.quality_tier || 'Z').localeCompare(b.quality_tier || 'Z'))
    .slice(0, 15)
    .map((r) => r.spot_text);
  let inserted = 0;
  let remaining = need;
  for (let round = 0; round < 4 && remaining > 0; round++) {
    const n = Math.min(25, remaining + 2);
    const resp = await anthropic.messages.create({
      model: SONNET,
      max_tokens: 3000,
      messages: [{ role: 'user', content: RUBRIC(card, n, samples) }],
    });
    let text = resp.content[0].text
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/, '')
      .trim();
    let arr;
    try {
      arr = JSON.parse(text);
    } catch {
      const m = text.match(/\[[\s\S]*\]/);
      arr = m ? JSON.parse(m[0]) : [];
    }
    const fresh = [];
    for (const raw of arr) {
      const spot_text = String(raw).trim();
      const k = spot_text.toLowerCase();
      if (
        !spot_text ||
        existing.has(k) ||
        REFUSAL.test(spot_text) ||
        /\b(man|woman|person|people|figure|figures|crowd|face|faces|eyes?)\b/i.test(spot_text)
      )
        continue;
      const wc = spot_text.split(/\s+/).length;
      if (wc < 6 || wc > 30) continue;
      const kind = classifyScale(spot_text);
      existing.add(k);
      fresh.push({
        location_key: key,
        spot_text,
        spot_kind: kind,
        quality_tier: 'S',
        is_active: true,
        pure_scene_eligible: kind !== 'intimate',
        character_eligible: kind !== 'wide',
      });
    }
    const pure = fresh.filter((r) => r.pure_scene_eligible).length;
    if (DRY) {
      console.log(`  (dry) round ${round + 1}: ${fresh.length} clean (${pure} pure-scene)`);
      for (const f of fresh.slice(0, 6)) console.log('    -', f.spot_kind, '|', f.spot_text);
      remaining -= pure;
      continue;
    }
    if (fresh.length) {
      const { error } = await sb.from('location_iconic_spots').insert(fresh);
      if (error) {
        console.log(`  ✗ insert: ${error.message}`);
        break;
      }
    }
    inserted += fresh.length;
    remaining -= pure;
    console.log(
      `  round ${round + 1}: +${fresh.length} rows (${pure} pure-scene eligible), remaining ${Math.max(0, remaining)}`
    );
    samples.push(...fresh.slice(0, 5).map((f) => f.spot_text));
  }
  return inserted;
}
(async () => {
  let total = 0;
  for (const l of LOCS) total += await topUp(l);
  console.log(`\nDONE: ${total} rows inserted${DRY ? ' (dry: 0)' : ''}`);
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
