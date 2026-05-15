#!/usr/bin/env node
/**
 * Generate 50 named-landmark iconic spots for a single location.
 *
 * Hard requirements:
 *  - 50 PURE LOCATION PILLARS (no time-of-day, weather, light language)
 *  - SPECIFIC NAMED places only — never generic "beach" / "cliff" / "waterfall"
 *  - All entries are real iconic features actually associated with the location
 *  - Spread across geographic features and sub-regions
 *  - No duplicates / near-duplicates
 *
 * Inserts at quality_tier='A' by default. Existing 'S' tier entries are
 * preserved (the 5 hand-locked pillars).
 *
 * Usage:
 *   node scripts/gen-iconic-spots-50.js --location hawaii
 *   node scripts/gen-iconic-spots-50.js --location hawaii --dry-run
 */

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { flavorBlock, getFlavor } = require('./locationFlavor');
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
const LOCATION = flag('location', 'hawaii');
// Default count comes from per-location flavor; --count CLI flag overrides.
const FLAVOR_COUNT = getFlavor(LOCATION).count;
const COUNT = parseInt(flag('count', String(FLAVOR_COUNT)), 10);
const DRY = has('dry-run');
const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SB_URL, KEY);

function metaPrompt(loc, count, biome, subRegions, mustInclude) {
  if (biome === 'fantasy_imagined') return fantasyMetaPrompt(loc, count, subRegions, mustInclude);
  if (biome === 'scifi_cosmic') return scifiMetaPrompt(loc, count, subRegions, mustInclude);
  return realLocationMetaPrompt(loc, count, subRegions, mustInclude);
}

function hintsBlock(subRegions, mustInclude) {
  const parts = [];
  if (subRegions && subRegions.length > 0) {
    parts.push(
      `━━━ SUB-REGION COVERAGE (NON-NEGOTIABLE) ━━━\nSpread the entries across ALL of these sub-regions of the location. At least one or two entries from EACH:\n` +
        subRegions.map((s) => `  - ${s}`).join('\n')
    );
  }
  if (mustInclude && mustInclude.length > 0) {
    parts.push(
      `━━━ FEATURE CATEGORIES TO COVER ━━━\nThe pool MUST include entries from each of these feature categories:\n` +
        mustInclude.map((m) => `  - ${m}`).join('\n')
    );
  }
  return parts.length > 0 ? '\n\n' + parts.join('\n\n') : '';
}

function fantasyMetaPrompt(loc, count, subRegions, mustInclude) {
  return `Generate the TOP ${count} most ICONIC FICTIONAL LANDMARKS within "${loc}" — the recognizable named locations that fans of this fictional place would immediately know.${flavorBlock(loc)}${hintsBlock(subRegions, mustInclude)}

These are PURE LOCATION PILLARS used as scene anchors for AI image generation. The user picked "${loc}" because they love it (the source material — book / film / game / mythology). Each pillar must be a SPECIFIC NAMED LOCATION from THAT canon.

━━━ HARD REQUIREMENTS ━━━
- Each entry names a SPECIFIC FICTIONAL LANDMARK from "${loc}" canon (e.g., for "hogwarts": Great Hall, Forbidden Forest, Astronomy Tower, Quidditch Pitch, Black Lake, Hogsmeade, Whomping Willow, Owlery, Greenhouses, Boathouse, Hogwarts Express bridge, Chamber of Secrets entrance, Room of Requirement entrance, Dumbledore's office tower, Gryffindor Common Room entrance, etc.)
- 4-12 words long
- Outdoor / exterior view of the named landmark (so it can be rendered as a scene, not an interior shot)
- For interior-iconic places (Great Hall, Common Rooms): describe an EXTERIOR-VIEW or APPROACH-VIEW (e.g., "Great Hall stained glass windows lit from within at twilight" instead of "inside the Great Hall")
- These are FICTIONAL — so "no hallucinations" does NOT apply; the canonical fictional landmarks ARE the source of truth

━━━ HARD BANS (still apply) ━━━
- NO TIME OF DAY ("at sunset" / "at golden hour") — those are axes
- NO WEATHER (no "stormy" / "snowy" baked into pillar)
- NO LIGHT/COLOR DESCRIPTIONS (no "glowing" / "moonlit" — those are axes)
- NO PEOPLE / NO CHARACTERS in pillar text
- NO REAL-WORLD locations leaking in — every entry must be from "${loc}" canon, not from real Earth places that look similar
- NO GENERIC TERMS — "the magical castle" is wrong; it must be "Hogwarts Astronomy Tower" or similar named feature

━━━ EXAMPLE — what GREAT looks like for "hogwarts" ━━━
- Hogwarts Castle towering against rocky cliff
- Forbidden Forest dark canopy at the school's edge
- Astronomy Tower silhouetted above the castle
- Black Lake reflecting the castle towers
- Quidditch Pitch with circular goal hoops
- Hogwarts Express crossing the Glenfinnan Viaduct
- Hogsmeade village with snow-covered cottages
- Whomping Willow ancient gnarled tree
- Owlery turret high above the school
- Greenhouses with crystalline glass roofs
- Boathouse cove below the castle cliffs
- Hagrid's Hut in the forest clearing
...etc

(Notice: each names a SPECIFIC canonical Hogwarts landmark. None are real-world places.)

━━━ EXAMPLE — what BAD looks like (would all be REJECTED) ━━━
- "Diamond Head volcanic crater" (real-world Hawaii — wrong canon)
- "ancient stone castle on a hill" (generic — not named)
- "magical glowing tower at sunset" (light + time baked in)
- "the Great Hall interior with floating candles" (interior + light)
- "wizard hangout spot" (generic and silly)

━━━ OUTPUT ━━━
Return EXACTLY ${count} entries, one per line, no numbering, no commentary. Just ${count} canonical fictional landmark strings from "${loc}".`;
}

function scifiMetaPrompt(loc, count, subRegions, mustInclude) {
  return `Generate the TOP ${count} most ICONIC FICTIONAL LANDMARKS within "${loc}" — recognizable named sci-fi locations from canon (book / film / game / world-building lore).${flavorBlock(loc)}${hintsBlock(subRegions, mustInclude)}

These are PURE LOCATION PILLARS for AI image generation. Each must be a SPECIFIC NAMED feature within the fictional sci-fi world.

━━━ HARD REQUIREMENTS ━━━
- Names a SPECIFIC sci-fi landmark, structure, or natural feature from this fictional setting
- 4-12 words long
- Outdoor / exterior view (NOT interior corridors)
- Sci-fi license is granted: alien skies, twin moons, neon megacities, plasma storms, terraformed terrain, futuristic megastructures are ALL fair game

━━━ HARD BANS (still apply) ━━━
- NO TIME OF DAY in pillar
- NO WEATHER in pillar
- NO LIGHT/COLOR DESCRIPTIONS in pillar
- NO PEOPLE
- NO REAL-WORLD locations
- NO FANTASY-MAGIC elements (no spell circles, magical aura — this is sci-fi, tech and physics-bending only)

━━━ EXAMPLE — what GREAT looks like for "alien planet" ━━━
- Crimson sandstone arches under twin-moon sky
- Bioluminescent crystal forest with glowing flora
- Floating sky-island archipelago in cloud-thick atmosphere
- Methane lake with mirror-still surface
- Plasma-storm horizon over fractured mesas
- Massive geode caverns visible from surface
- Ancient alien megalith ruins on dune sea
- Aurora-lit ice geysers shooting upward
- Volcanic ridges with violet-glowing magma
- Terraformed habitat dome on rocky plain
...etc

━━━ OUTPUT ━━━
Return EXACTLY ${count} entries, one per line, no numbering, no commentary.`;
}

function realLocationMetaPrompt(loc, count, subRegions, mustInclude) {
  return `Generate the TOP ${count} most ICONIC, POSTCARD-WORTHY NAMED LANDMARKS in "${loc}" — the specific named places a tourist would put on their postcards from this location. Include architectural landmarks, named beaches (where coastal), iconic natural features, signature city anchors, and cultural/sacred sites — whatever DEFINES this specific place.${flavorBlock(loc)}${hintsBlock(subRegions, mustInclude)}

These are PURE LOCATION PILLARS used as scene anchors for AI image generation. The user picked "${loc}" because they love it — these pillars must depict the absolute "must-see" spots a tourist would put on their postcards. If "${loc}" has multiple islands or sub-regions, the 50 MUST be spread across all of them.

━━━ HARD REQUIREMENTS (every single entry) ━━━
- 4-10 words long
- Names a SPECIFIC, ACTUAL landmark (e.g., "Nā Pali Coast" — NOT "tropical cliffs"; "Halema'uma'u Crater" — NOT "volcanic crater")
- Outdoor natural landscape OR iconic outdoor landmark
- Real and recognizable to people who know the location
- No two entries depict the same place — full dedup

━━━ HARD BANS ━━━
- NO TIME OF DAY ("at sunrise" / "at golden hour" / "at dusk") — those are axes, never in the pillar
- NO WEATHER ("stormy" / "misty" / "with rain")
- NO LIGHT/COLOR DESCRIPTIONS ("glowing" / "amber-lit" / "godrays")
- NO INTERIORS (no churches, monasteries, temples-interior, factories, mills, bunkers, forges, museums, restaurants)
- NO GENERIC TERMS unanchored — never just "beach" / "cliff" / "waterfall" / "valley". Always name the specific one.
- NO HALLUCINATIONS — only real iconic features actually in ${loc}. For Hawaii: NO monasteries, NO traditional metalworking, NO obscure infrastructure.
- NO PEOPLE
- NO INDUSTRIAL/PROCESSING SITES (no plantations, refineries, ranches as subject)

━━━ VARIETY REQUIREMENT (NON-NEGOTIABLE) ━━━
- Each entry must be DEFINITIVELY postcard-worthy — what a tourist would specifically travel to see and photograph.
- Span distinct named feature types — each entry should be a different KIND of iconic place.
- Sub-region coverage and required feature categories are specified above (in HINTS block, if present). Honor those.

━━━ EXAMPLE — what GREAT looks like ━━━
For "iceland":
- Vatnajökull glacier ice caves and crevasses
- Reynisfjara black sand beach with basalt sea stacks
- Skógafoss waterfall with mossy basalt cliffs
- Þingvellir rift with mossy lava walls
- Geysir geothermal steam plumes
- Jökulsárlón glacier lagoon with floating icebergs
- Diamond Beach with stranded glacier ice
- Seljalandsfoss waterfall with viewing path behind
- Kirkjufell mountain with reflecting lake
- Gullfoss waterfall double cascade
- ...etc

(Notice: each names a SPECIFIC landmark; no time/weather/light; all real Iceland features.)

━━━ EXAMPLE — what BAD looks like (would be REJECTED) ━━━
- "tropical beach with palm trees" (generic — not named)
- "volcanic cliffs at sunset" (generic + time of day)
- "the abandoned sugar plantation mill" (industrial, niche)
- "secluded monastery garden" (interior, hallucinated for Hawaii)
- "hidden waterfall grotto" (generic, not named)

━━━ OUTPUT (CRITICAL — DO NOT UNDER-DELIVER) ━━━
Return EXACTLY ${count} entries — count them carefully. ${count} entries means literally ${count} separate lines. Do not stop early. Do not give 50 when ${count} is asked. Cover EVERY sub-region listed above (at least 2-3 entries per sub-region) AND every must_include category (at least 1-2 entries per category).

One entry per line, no numbering, no commentary, no preamble, no markdown code fences. Just ${count} pillar strings, deduped, all named landmarks.`;
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
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  return (data.content?.[0]?.text || '').trim();
}

(async () => {
  // Look up biome + Stage 1 hints (sub_regions, must_include) for this location
  const { data: locCard } = await sb
    .from('location_cards')
    .select('biome, sub_regions, must_include')
    .eq('name', LOCATION)
    .maybeSingle();
  const biome = locCard?.biome ?? 'tropical_coastal';
  const subRegions = locCard?.sub_regions || [];
  const mustInclude = locCard?.must_include || [];
  console.log(
    `Generating ${COUNT} iconic spots for "${LOCATION}" (biome: ${biome}, ${subRegions.length} sub_regions, ${mustInclude.length} must_include)${DRY ? ' (dry-run)' : ''}...`
  );
  const t0 = Date.now();
  const text = await callSonnet(metaPrompt(LOCATION, COUNT, biome, subRegions, mustInclude));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  const lines = text
    .split('\n')
    .map((l) =>
      l.replace(/^\s*\`{3,}\s*$/, '').replace(/^\d+[\.\)]\s*/, '').replace(/^[-•]\s*/, '').trim()
    )
    .filter((l) => l.length > 3 && l.length < 120 && !l.startsWith('`'));
  console.log(`✓ Sonnet returned ${lines.length} entries in ${elapsed}s`);

  // Show all entries in dry-run, sample of 10 in real-run
  if (DRY) {
    console.log('\nAll 50 entries:');
    lines.forEach((l, i) => console.log(`  ${(i + 1).toString().padStart(2)}. ${l}`));
    console.log('\nDry-run: not inserting.');
    return;
  }
  console.log('\nSample (first 10):');
  lines.slice(0, 10).forEach((l, i) => console.log(`  ${(i + 1).toString().padStart(2)}. ${l}`));
  if (lines.length > 10) console.log(`  ... and ${lines.length - 10} more`);
  console.log();

  // Pull existing entries to dedup (in-memory pre-filter)
  const { data: existing } = await sb
    .from('location_iconic_spots')
    .select('spot_text')
    .eq('location_key', LOCATION);
  const existingTexts = new Set((existing || []).map((r) => r.spot_text.toLowerCase()));
  const newRows = lines
    .filter((l) => !existingTexts.has(l.toLowerCase()))
    .map((l) => ({
      location_key: LOCATION,
      spot_text: l,
      spot_kind: 'vista',
      quality_tier: 'A',
      is_active: true,
    }));
  console.log(
    `Attempting ${newRows.length} new (${lines.length - newRows.length} pre-dedup, ${existing?.length || 0} existing)...`
  );

  if (newRows.length === 0) {
    console.log('Nothing new to insert.');
    return;
  }
  // Upsert with ignoreDuplicates so any race / case collision skips silently
  const { error, data: inserted } = await sb
    .from('location_iconic_spots')
    .upsert(newRows, { onConflict: 'location_key,spot_text', ignoreDuplicates: true })
    .select('id');
  if (error) {
    console.error('Insert failed:', error.message);
    return;
  }
  console.log(`✓ Inserted ${inserted.length} new pillars.`);

  // Final count
  const { count } = await sb
    .from('location_iconic_spots')
    .select('*', { count: 'exact', head: true })
    .eq('location_key', LOCATION)
    .eq('is_active', true);
  console.log(`Total active pillars for "${LOCATION}": ${count}`);
})();
