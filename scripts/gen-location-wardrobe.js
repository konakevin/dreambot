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
  return `Author an 8-entry WARDROBE pool for "${loc}" — striking, DREAM-WORTHY outfit anchors an AI image generator picks from when casting a person AT THIS LOCATION.

This is a DREAM image generator. The cast should look like the COOLEST, most exciting version of themselves — the hero or heroine of a stylish film set in this world. The bar is: COOL, SEXY, FUN, a little FANTASTIC. Think a costume designer dressing the lead, NOT a tourist packing practical clothes for a trip. Elevate every ordinary garment into its most cinematic, head-turning version.

NEVER plain, practical, frumpy, dowdy, or pedestrian. No errand-wear, no domestic/farmhand looks, no "sensible" travel outfits. If a person could wear it to run to the grocery store, it's WRONG — make it the version that belongs on a movie poster for "${loc}".

Still unmistakably ON-LOCATION: the dream-glam must fit THIS world (a Wild West gunslinger or saloon showgirl, a Tokyo neon-street icon, a gothic vampire noble) — location identity AND dream-glamour, together.

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
- Each entry describes a complete, striking outfit STYLE with a flattering SILHOUETTE + a signature element.
- COOL / SEXY / FUN / a bit FANTASTIC on EVERY entry. Form-fitting, dramatic, alluring, confident, head-turning where the world allows it. It's fine to lean glamorous or a little adult (tasteful) when the location invites it (saloon showgirl, gothic seductress, beach glamour). Guns, leather, corsets, capes, jewelry — signature drama is good.
- Do NOT range down into "casual/practical/sensible." Range across MOODS (rugged-cool, sultry-elegant, playful-bold, heroic-dramatic) — but every entry stays exciting.
- Each entry must feel ON-BRAND for THIS location's identity — dream-glam that belongs at "${loc}".
- WORK FOR BOTH genders (men AND women). Sonnet adapts the cut, so phrase so it reads sexy/striking on a woman AND cool/heroic on a man — e.g. "fitted fringed leather with a low-slung gun belt and tall boots" (sultry cowgirl OR rugged gunslinger). Avoid anything that locks dowdy (no aprons, shawls, sensible layers).
- NO single-color statements. Be specific about fabric, texture, silhouette, or one signature element.

━━━ GOOD EXAMPLES (study these — match this COOL/SEXY/FANTASTIC bar) ━━━

For Wild West (outlaw / gunslinger / saloon):
- "form-fitting fringed suede with a low-slung twin-holster gun belt, tall worn boots, a wide hat tipped low"
- "a sleek black leather duster over fitted dark clothes, silver-buckled belt, a rifle slung across the back"
- "saloon-showgirl glamour: a laced satin corset-bodice with ruffled skirt and a feather in the hair, OR a sharp gambler's brocade waistcoat, string tie, and pocket revolver"

For Gothic Realm (dark, seductive):
- "sleek Victorian gothic: a fitted high-collar tailcoat OR a corseted black-lace gown, velvet choker, polished boots"
- "a dramatic hooded cloak over fitted leather, silver clasps, a slender blade at the hip"

For Tokyo (neon-cool):
- "neon cyber-street style: a cropped techwear jacket, holographic accents, sleek platform boots"
- "sharp minimalist black: tailored asymmetric coat, fitted trousers, statement silver jewelry"

For Hawaii (sun-glam):
- "sun-kissed resort glamour: a silky sarong or an open linen shirt over swimwear, layered gold jewelry, barefoot on the sand"

━━━ BAD EXAMPLES (DO NOT WRITE LIKE THIS — these are FRUMPY/PEDESTRIAN, the exact thing we're killing) ━━━
- "a plain button shirt with suspenders and trousers, a basket" (farmhand/domestic — DEAD boring)
- "practical hiking gear / REI parka / Carhartt work pants" (errand-wear, zero dream)
- "a modest long dress with an apron and shawl" (frumpy, dowdy)
- "casual outfit / fancy dress / winter clothes" (vague AND pedestrian)

━━━ FINAL RULE ━━━
A costume designer dressing the STAR of a dream set at "${loc}" picks from this pool. If an entry is something a real person would practically throw on for errands, IT'S WRONG. Every entry must be the coolest, sexiest, most exciting version that still unmistakably belongs at "${loc}".

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
