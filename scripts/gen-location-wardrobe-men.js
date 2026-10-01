#!/usr/bin/env node
/**
 * gen-location-wardrobe-men.js — a men's outfit list (`biome_config.WARDROBE_MEN`, 8 entries) for every card that
 * dresses its cast from its own WARDROBE (imagined worlds and costume cards). CARD_WARDROBE_GENDER_PLAN.md.
 *
 * The WARDROBE lists were asked to "work for both genders; Sonnet adapts the cut" and came out leaning feminine (63 of
 * 67 have women-only items), so a man on Crystal Caverns was handed "a floor-length translucent organza robe over a
 * jeweled bodysuit" and rendered in a sheer robe (Kevin 2026-10-01: "why are we getting fruity outfits like this for
 * men?"). This writes the men's counterpart in the card's own register, with the women's list as the bar for drama.
 *
 * Writes <out>/men.json for review and, with --sql, a migration that sets WARDROBE_MEN on each card. Nothing touches
 * the database.
 *
 *   node scripts/gen-location-wardrobe-men.js --out <dir> [--sql <file>] [--cards "a,b"]
 */
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { callClaude } = require('./lib/anthropic');

const sb = createClient(
  'https://jimftynwrinwenonjrlj.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const arg = (n, d) => {
  const i = process.argv.indexOf('--' + n);
  return i >= 0 ? process.argv[i + 1] : d;
};
const OUT = arg('out', '.');
const SQL = arg('sql', null);
const CONC = Math.max(1, Math.min(4, Number(arg('concurrency', '3'))));
const CARDS = String(arg('cards', ''))
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const IMAGINED_BIOMES = new Set(['fantasy_imagined', 'scifi_cosmic', 'aquatic_underwater']);
// Words that make a man's entry read as women's wear or as undress: a draft carrying one is redrawn.
const NOT_MENSWEAR =
  /\b(skirt|gown|bodice|corset|bodysuit|bikini|midriff|sheer|translucent|see-through|organza|chiffon|negligee|heels?|heeled|stiletto|platform|tiara|loincloth|briefs|thong|shirtless|bare[- ]chested|bare chest|crop(ped)? top|halter|slit)\b|\blace(?!-up|d)\b|\bdress(?! (shoes|coat|uniform|boots|shirt))\b/i;

function parseObject(raw) {
  const s = raw.indexOf('{');
  const e = raw.lastIndexOf('}');
  if (s < 0 || e <= s) throw new Error('no JSON object in reply');
  return JSON.parse(raw.slice(s, e + 1));
}

async function draft(card) {
  const cfg = card.biome_config || {};
  const label = card.display_name || card.name;
  const imagined = cfg.imagined === true || IMAGINED_BIOMES.has(card.biome);
  const register = imagined
    ? 'FANTASTICAL / IMAGINED WORLD: glamorous, dramatic, in-world costume is welcome.'
    : `GROUNDED${cfg.period ? `, the ${cfg.period} era` : ''}: authentic, believable gear worn with attitude; never a theatrical costume${cfg.period ? ', and nothing from a later era' : ''}.`;
  const system = `You are the costume designer for "${label}", a location in a dream app where people are cast as the hero of the scene.
The location's own rule: ${cfg.SUBJECT_RULE || '(none)'}
Register: ${register}
The women's outfit list for this location, the bar for drama and how in-world it is:
${(cfg.WARDROBE || []).map((w) => '- ' + w).join('\n')}

Write 8 outfits for MEN at this location: each the man's counterpart at the same level of drama, so he looks like the coolest, most heroic version of himself in this world.
- Real menswear: name the garments (a frock coat, a doublet, a tunic over breeches, a duster, plate or scale armour, a fitted suit, a flight jacket, a cloak), the materials and one signature detail.
- A man's cut throughout: covered and tailored, trousers or breeches, flat boots or shoes. Opaque fabrics only (leather, wool, velvet, brocade, linen, silk, metal, scale). Striking through cut, material, armour, weapons, jewellery and colour, never through undress or see-through layers.
- On this location's register, never plain or practical everyday wear.
- Vary the mood across the 8 (rugged, regal, sleek, dramatic, playful) and never repeat one formula.
- 8-16 words each.
Reply ONLY JSON: {"WARDROBE_MEN": ["...", ...]}`;
  for (let a = 0; a < 3; a++) {
    try {
      const r = await callClaude({
        job: 'reseed',
        system,
        content: `Write the 8 men's outfits for "${label}".`,
        maxTokens: 1500,
        retryDelaysMs: [2000, 8000, 20000],
        timeoutMs: 120000,
      });
      const list = (parseObject(r.raw).WARDROBE_MEN || []).map(String).filter(Boolean);
      const bad = list.filter((w) => NOT_MENSWEAR.test(w));
      if (list.length >= 8 && !bad.length) return { name: card.name, label, men: list.slice(0, 8) };
      if (a === 2)
        return {
          name: card.name,
          label,
          men: list.filter((w) => !NOT_MENSWEAR.test(w)).slice(0, 8),
          flagged: bad,
        };
    } catch (e) {
      if (a === 2) throw e;
    }
  }
  throw new Error('no usable draft');
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const { data, error } = await sb
    .from('location_cards')
    .select('name, display_name, biome, biome_config')
    .not('picker_tile', 'is', null);
  if (error) throw new Error(error.message);
  // The cards that dress their cast from WARDROBE: imagined worlds and costume cards (_shared/costumeWardrobe.ts).
  const queue = data.filter((c) => {
    const cfg = c.biome_config || {};
    const uses =
      Array.isArray(cfg.WARDROBE) &&
      cfg.WARDROBE.length > 0 &&
      (cfg.imagined === true || IMAGINED_BIOMES.has(c.biome) || cfg.costume === true);
    return uses && (!CARDS.length || CARDS.includes(c.name));
  });
  console.log(`${queue.length} cards`);
  const results = [];
  let next = 0;
  async function worker() {
    while (next < queue.length) {
      const c = queue[next++];
      try {
        const r = await draft(c);
        results.push(r);
        console.log(
          `  ${c.name}: ${r.men.length}${r.flagged ? ` (dropped ${r.flagged.length})` : ''}`
        );
      } catch (e) {
        console.warn(`  ${c.name}: FAILED ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  results.sort((a, b) => a.name.localeCompare(b.name));
  fs.writeFileSync(path.join(OUT, 'men.json'), JSON.stringify(results, null, 1));
  if (SQL) {
    const q = (v) => `'${String(v).replace(/'/g, "''")}'`;
    const lines = results.map(
      (r) =>
        `UPDATE public.location_cards SET biome_config = biome_config || jsonb_build_object('WARDROBE_MEN', ${q(JSON.stringify(r.men))}::jsonb)\n  WHERE name = ${q(r.name)};`
    );
    fs.writeFileSync(SQL, lines.join('\n') + '\n');
    console.log(`wrote ${SQL} (${lines.length} cards)`);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
