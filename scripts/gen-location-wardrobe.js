#!/usr/bin/env node
/**
 * Author a location-specific WARDROBE pool for the bespoke biome.
 *
 * The shared WARDROBE_MOODS in characterSlotPrompt.ts (casual, sporty, boho,
 * resort, vintage, etc.) gives Sonnet stylistic guidance but no location-
 * specific anchoring — so Fairy Cottage / Gothic Realm / High Fantasy
 * character renders default to generic outdoor-casual wear instead of
 * location-coded outfits.
 *
 * This script adds an 8-entry WARDROBE array to each location's existing
 * biome_config (preserves the already-authored TIME / WEATHER / PHENOMENA
 * etc.). The runtime picks one entry per render and uses it as the
 * primary wardrobe anchor in the Sonnet brief.
 *
 * Usage:
 *   node scripts/gen-location-wardrobe.js --location fairy_cottage
 *   node scripts/gen-location-wardrobe.js --all
 *   node scripts/gen-location-wardrobe.js --location yosemite --dry-run
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { getFlavor } = require('./locationFlavor');
const { SONNET } = require('./lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;
if (!ANTHROPIC || !KEY) {
  console.error('ANTHROPIC_API_KEY or SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
const has = (n) => args.includes('--' + n);
const ALL = has('all');
const DRY = has('dry-run');
const ONLY = flag('location', null);
const FORCE = has('force'); // overwrite existing WARDROBE
const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SB_URL, KEY);

function buildPrompt(loc, flavor, picker, biome) {
  const soul = flavor.soul ? `\nLocation soul: ${flavor.soul}` : '';
  return `Author an 8-entry WARDROBE pool for "${loc}" — location-specific clothing anchors that an AI image generator will pick from when rendering characters AT THIS LOCATION.

The pool's job: when a user's cast (self, plus_one, etc.) is rendered at "${loc}", their clothing should feel ON-LOCATION — not generic casual wear.

Without this pool: characters at Fairy Cottage render in flannel + jeans (generic outdoor). Characters at Gothic Realm render in modern streetwear. Characters at Tokyo render in linen-shirt-and-chinos resort defaults. ALL wrong for location identity.

━━━ LOCATION CONTEXT ━━━
Name: ${loc}
Picker category: ${picker}
Shared biome (if any): ${biome || '(none)'}${soul}

━━━ YOUR OUTPUT (strict JSON) ━━━
Return ONLY this JSON object (no preamble, no markdown):

{
  "WARDROBE": [
    "<8 entries, ~6-15 words each>"
  ]
}

━━━ WARDROBE ENTRY RULES ━━━
- Each entry describes a complete outfit STYLE (not a single garment).
- Range across formality — include some casual, some elevated, some signature-to-location.
- Each entry must feel ON-BRAND for THIS location's identity. A traveler going to "${loc}" would actually wear something like this. A photographer shooting tourism for "${loc}" would dress models in these outfits.
- WORK FOR BOTH genders (men AND women). Sonnet will adapt the cut for the character's gender, so phrase like "linen tunic with leather belt" (works either way) NOT "embroidered floral dress" (locked feminine).
- NO single-color statements. Be specific about fabric, texture, silhouette, or one signature element.

━━━ GOOD EXAMPLES (study these — match this bar) ━━━

For Fairy Cottage:
- "earthtoned linen tunic with leather belt, soft moccasin boots, optional embroidered cloak"
- "flowing gauze layered dress in dusty sage or lavender, leaf-and-vine accent"
- "rustic peasant blouse with full skirt, wildflower-embroidered apron, woven straw hat"
- "fitted velvet doublet or vest, soft suede breeches, knee-high leather boots"

For Gothic Realm:
- "Victorian black frock coat with high collar and cravat, tailored trousers, polished oxfords"
- "long mourning dress with lace cuffs and high collar, pleated bustle, button boots"
- "tweed Sherlock-style cape and deerstalker, wool trousers, leather brogues"
- "ornate brocade waistcoat over crisp white shirt, dark trousers, silver pocket watch chain"

For Tokyo:
- "summer cotton yukata with bold geometric or floral print, soft obi belt, zori sandals"
- "harajuku layered street style: oversized hoodie, pleated skirt or distressed jeans, platform shoes"
- "minimal Japanese fashion: black turtleneck, wide-leg cropped trousers, white sneakers"
- "salaryman uniform: charcoal slim suit, white shirt, dark tie, leather briefcase"

For Yosemite:
- "vintage REI down parka in faded crimson, wool beanie, hiking pants, broken-in trail boots"
- "denim shirt over thermal henley, canvas Carhartt pants, leather work boots"
- "moss-green Patagonia fleece, technical hiking shorts, low-cut Salomon trail runners"

For Iceland:
- "wool Icelandic lopapeysa sweater with traditional yoke pattern, dark trousers, hiking boots"
- "weatherproof parka over fleece base layer, gaiters, insulated waterproof boots"
- "structured trench coat in olive or charcoal over neutral knitwear, leather Chelsea boots"

For Hawaii:
- "lightweight aloha shirt with bold tropical floral print, linen shorts, leather sandals"
- "flowing tropical maxi dress in coral or hibiscus print, woven sun hat, beaded jewelry"
- "casual surf wear: rashguard, board shorts, slip-on sneakers, mirrored sunglasses"

━━━ BAD EXAMPLES (DO NOT WRITE LIKE THIS) ━━━
- "casual outfit" (too vague, no location anchor)
- "fancy dress" (too vague)
- "Hawaiian shirt" (single garment, no full outfit)
- "winter clothes" (too generic, doesn't anchor to THIS location)
- "outdoor adventure gear" (works for any nature location — be MORE SPECIFIC)

━━━ FINAL RULE ━━━
A photographer outfitting a model for a tourism shoot of "${loc}" would pick from this pool. A traveler shopping for their trip would consider these styles. If your entry could work equally well at any random location, IT'S WRONG. Each entry must scream "${loc}".

Return ONLY the JSON object. No preamble, no markdown, no commentary.`;
}

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: SONNET,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.content?.[0]?.text || '').trim();
}

function parseJson(text) {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('No JSON object found');
  return JSON.parse(m[0]);
}

async function processLocation(loc) {
  const { data: card, error } = await sb
    .from('location_cards')
    .select('name, display_name, picker_category, biome, biome_config')
    .eq('name', loc)
    .maybeSingle();
  if (error || !card) {
    console.log(`  ${loc}: not found — skipping`);
    return;
  }
  const existing = card.biome_config || {};
  if (existing.WARDROBE && !FORCE && !DRY) {
    console.log(`  ${loc}: already has WARDROBE — skipping (use --force to regen)`);
    return;
  }

  const flavor = getFlavor(loc);
  console.log(`  Generating WARDROBE for "${loc}" (${card.picker_category})...`);
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(loc, flavor, card.picker_category, card.biome));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  let parsed;
  try {
    parsed = parseJson(text);
  } catch (e) {
    console.error(`  ${loc} ⚠️ JSON parse failed: ${e.message}`);
    return;
  }
  if (!Array.isArray(parsed.WARDROBE) || parsed.WARDROBE.length < 6) {
    console.error(`  ${loc} ⚠️ WARDROBE missing or too short (got ${parsed.WARDROBE?.length})`);
    return;
  }
  console.log(`  ✓ ${loc} — ${parsed.WARDROBE.length} entries (${elapsed}s)`);

  if (DRY) {
    parsed.WARDROBE.forEach((w, i) => console.log(`    ${(i + 1).toString().padStart(2)}. ${w}`));
    return;
  }

  const merged = { ...existing, WARDROBE: parsed.WARDROBE };
  const { error: upErr } = await sb
    .from('location_cards')
    .update({ biome_config: merged })
    .eq('name', loc);
  if (upErr) {
    console.error(`  ${loc} ⚠️ DB update failed: ${upErr.message}`);
    return;
  }
  console.log(`  ✓ Persisted WARDROBE for "${loc}"`);
}

(async () => {
  let locations = [];
  if (ONLY) {
    locations = [ONLY];
  } else if (ALL) {
    const { data } = await sb
      .from('location_cards')
      .select('name')
      .eq('is_approved', true)
      .order('name');
    locations = (data || []).map((r) => r.name);
  } else {
    console.log('Usage: --location <name> | --all  [--dry-run] [--force]');
    process.exit(1);
  }
  console.log(`Generating WARDROBE for ${locations.length} location(s)${DRY ? ' (dry-run)' : ''}${FORCE ? ' (force)' : ''}...`);
  for (const loc of locations) {
    try {
      await processLocation(loc);
    } catch (e) {
      console.error(`  ${loc} ⚠️ unexpected:`, e.message);
    }
  }
  console.log('Done.');
})();
