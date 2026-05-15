#!/usr/bin/env node
/**
 * Author a bespoke BiomeConfig for one location.
 *
 * Each location gets a custom atmosphere library (TIME / WEATHER / CAMERA /
 * PHENOMENA / SUBJECT_RULE / BANS) tuned to that location's identity, so
 * dream renders feel recognizable to people who have been there:
 * "Tunnel View golden hour on El Capitan and Half Dome" — not generic
 * "alpine sunset".
 *
 * Reads flavor context (soul + iconic anchors) from locationFlavor.js to
 * give Sonnet enough grounding to write specific-not-generic axis entries.
 *
 * Stores result in location_cards.biome_config JSONB (added in migration 170).
 * At render time, the nightly engine prefers biome_config over the shared
 * biomeAxes.ts lookup.
 *
 * Usage:
 *   node scripts/gen-location-biome.js --location hawaii
 *   node scripts/gen-location-biome.js --location yosemite --dry-run
 *   node scripts/gen-location-biome.js --all
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
const SB_URL = 'https://jimftynwrinwenonjrlj.supabase.co';
const sb = createClient(SB_URL, KEY);

function buildPrompt(loc, flavor, picker, biome, subRegions, mustInclude) {
  const soul = flavor.soul ? `\nLocation soul: ${flavor.soul}` : '';
  const anchorsBlock =
    flavor.anchors && flavor.anchors.length > 0
      ? `\nKnown iconic anchors at this location:\n${flavor.anchors
          .slice(0, 25)
          .map((a) => `  - ${a}`)
          .join('\n')}`
      : '';
  const subRegionsBlock =
    subRegions && subRegions.length > 0
      ? `\nKnown sub-regions / districts:\n${subRegions
          .slice(0, 20)
          .map((s) => `  - ${s}`)
          .join('\n')}`
      : '';
  const mustIncludeBlock =
    mustInclude && mustInclude.length > 0
      ? `\nKnown feature categories at this location:\n${mustInclude
          .slice(0, 15)
          .map((m) => `  - ${m}`)
          .join('\n')}`
      : '';

  return `Author a BESPOKE atmosphere library (BiomeConfig) for "${loc}" — a per-location set of TIME / WEATHER / CAMERA / PHENOMENA descriptions plus SUBJECT_RULE and BANS that an AI image generator weaves into dream-render prompts.

The goal: when a user picks "${loc}" as their dream location, every nightly dream should feel RECOGNIZABLE to anyone who has been there. Generic "golden hour" / "blue sky" / "clear weather" is not good enough. Every line must carry location-specific atmospheric DNA.

━━━ LOCATION CONTEXT ━━━
Name: ${loc}
Picker category: ${picker}
Currently-assigned shared biome (if any): ${biome || '(none)'}${soul}${anchorsBlock}${subRegionsBlock}${mustIncludeBlock}

━━━ YOUR OUTPUT (strict JSON) ━━━
Return ONLY a JSON object with this EXACT shape (no preamble, no markdown):

{
  "TIME": [...8 entries...],
  "WEATHER": [...7 entries...],
  "CAMERA": [...5 entries...],
  "PHENOMENA": [...12 entries...],
  "SUBJECT_RULE": "...",
  "BANS": [...6-8 entries...]
}

━━━ TIME (8 entries, ~12-22 words each) ━━━
Eight times-of-day or lighting conditions, EACH grounded in this location's specific atmospheric DNA.

GOOD example (Hawaii): "Diamond Head sunrise — first pink light catching the volcanic cone over Waikīkī shore, calm Pacific reflecting amber"
BAD: "Sunrise — soft pink light"

GOOD example (Tokyo): "Shibuya midnight — neon-saturated rain-slick streets reflecting all colors, dense vertical city alive with light"
BAD: "Night cityscape — building lights glowing"

For URBAN locations: reference architecture (mansard roofs, brick stoops, neon signs, etc.) + named districts where it makes the entry specific.
For NATURE locations: reference geological + biological detail (granite walls, lodgepole pines, Sitka spruce, glacial blue, red sandstone, etc.).
For COASTAL: reference the specific ocean (Pacific / Caribbean / Aegean / Mediterranean).
Spread across times: sunrise, mid-morning, golden hour, blue hour, night, midday, pre-dawn, post-rain, etc. Mix it.

━━━ WEATHER (7 entries) ━━━
Seven weather conditions specific to this location's climate vocabulary. NOT just "partly cloudy" — invoke the location's signature weather feel.

GOOD example (Iceland): "wind-whipped snow squall sweeping across black volcanic sand, sun cutting through the breaking clouds"
GOOD example (Paris): "moody overcast with a single shaft of sun raking across mansard rooftops"
BAD: "Cloudy day"

━━━ CAMERA (5 entries) ━━━
Five cinematic framings. These can be more generic / shared, but should still feel right for THIS location's scale. e.g., 'cinematic aerial sweep' works for both Hawaii cliffs and Tokyo skyline. 'extreme low angle looking up' fits both granite walls and skyscrapers.

━━━ PHENOMENA (12 entries) ━━━
Twelve atmospheric / light / natural phenomena unique or iconic to this location. The MOST important section — phenomena are what make a place visually unforgettable.

GOOD example (Hawaii): "trade-wind shower passing through Mānoa Valley with a full double rainbow"
GOOD example (Paris): "Eiffel Tower hourly sparkle lighting at the top of the hour"
GOOD example (Yosemite): "Firefall — late February evening light igniting Horsetail Falls in fire-orange"
GOOD example (Tokyo): "Shibuya scramble crossing at peak rush — thousands of pedestrians flowing in all directions, neon overhead"
BAD: "Sun rays through clouds"

For URBAN locations, include: street-level reflections, district-specific glows, signature lighting, cultural festivals/events that produce iconic atmospheres.
For NATURE, include: weather + light phenomena unique to this geography (Patagonian wind, Saharan sandstorm, Amazonian mist, alpine alpenglow).

━━━ SUBJECT_RULE (1 paragraph, ~40-70 words) ━━━
What the render SUBJECT should be — describes the framing rules. Example for Hawaii: "unmistakably recognizable OUTDOOR LANDSCAPE view of Hawaii's volcanic + Pacific geography. Iconic features (Diamond Head, Nā Pali Coast, Haleakalā, lava fields) rendered MASSIVE — towering, monumental, dominating the frame. Pure Hawaii geography + atmosphere."

For URBAN: emphasize architecture-as-hero, named districts, the city's vertical or horizontal scale.
For NATURE: emphasize natural feature dominance, scale, monumental geography.

━━━ BANS (6-8 entries) ━━━
Hard content rules — what to NEVER render at this location. Be location-aware.

GOOD examples:
For Hawaii: "NO snow / ice / arctic elements", "NO mid-latitude deciduous trees", "NO European architecture"
For Paris: "NO tropical elements (no palm trees, no jungle)", "NO modern glass skyscrapers as subject"
For Yosemite: "NO tropical or desert elements", "NO urban/architectural subjects"

Universal bans (always include these): NO PEOPLE, NO FIGURES, NO CHARACTERS, NO IMPOSSIBLE PHYSICS, NO FANTASY / SCI-FI elements (unless the location IS fantasy/scifi).

━━━ CRITICAL — NO PEOPLE IN ATMOSPHERE ━━━
This BiomeConfig drives SCENE-ONLY renders (no humans in frame). Every TIME / WEATHER / PHENOMENA entry must describe atmospheres achievable in an EMPTY landscape or cityscape.

WRONG (mentions people): "Shibuya scramble crossing surge — thousands flowing in diagonal waves"
RIGHT (people-free): "Shibuya rain-slick midnight — neon reflecting on glassy pavement, distant Hachiko statue silhouette, traffic light reflections in puddles"

WRONG: "Tsukiji 4:30am fish-market activity under fluorescent work lights"
RIGHT: "Tsukiji pre-dawn — empty outer-market alleys under cold fluorescent work lights, distant Tokyo Bay waterfront still dark"

For cities famous for crowd-density (Shibuya, Times Square, Las Ramblas, etc.) — describe the SAME location at OFF-HOURS, or focus on architecture / signage / lighting / weather instead of crowds.

━━━ FINAL RULE ━━━
A traveler who has been to this location should read every TIME / WEATHER / PHENOMENA entry and say "yes — that's exactly what it's like there" — even with NO PEOPLE in the scene. Generic atmospheric language = failure. People-as-atmosphere = failure. Be SPECIFIC and PEOPLE-FREE.

Return ONLY the JSON object. No preamble, no markdown fences, no commentary.`;
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
      max_tokens: 4000,
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
  // Strip code-fence if present, find the JSON object
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('No JSON object found in response');
  return JSON.parse(m[0]);
}

function validate(config, loc) {
  const issues = [];
  if (!Array.isArray(config.TIME) || config.TIME.length < 6)
    issues.push(`TIME: expected 8 entries, got ${config.TIME?.length}`);
  if (!Array.isArray(config.WEATHER) || config.WEATHER.length < 5)
    issues.push(`WEATHER: expected 7 entries, got ${config.WEATHER?.length}`);
  if (!Array.isArray(config.CAMERA) || config.CAMERA.length < 4)
    issues.push(`CAMERA: expected 5 entries, got ${config.CAMERA?.length}`);
  if (!Array.isArray(config.PHENOMENA) || config.PHENOMENA.length < 8)
    issues.push(`PHENOMENA: expected 12 entries, got ${config.PHENOMENA?.length}`);
  if (typeof config.SUBJECT_RULE !== 'string' || config.SUBJECT_RULE.length < 20)
    issues.push(`SUBJECT_RULE: missing or too short`);
  if (!Array.isArray(config.BANS) || config.BANS.length < 4)
    issues.push(`BANS: expected 6-8 entries, got ${config.BANS?.length}`);
  return issues;
}

async function processLocation(loc) {
  const { data: card, error } = await sb
    .from('location_cards')
    .select('name, display_name, picker_category, biome, sub_regions, must_include, biome_config')
    .eq('name', loc)
    .maybeSingle();
  if (error || !card) {
    console.log(`  ${loc}: not found — skipping`);
    return;
  }
  if (card.biome_config && !DRY) {
    console.log(`  ${loc}: already has biome_config — skipping (delete it first to regen)`);
    return;
  }

  const flavor = getFlavor(loc);
  console.log(`  Generating biome for "${loc}" (${card.picker_category}, biome=${card.biome || 'null'})...`);
  const t0 = Date.now();
  const text = await callSonnet(
    buildPrompt(
      loc,
      flavor,
      card.picker_category,
      card.biome,
      card.sub_regions || [],
      card.must_include || []
    )
  );
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

  let config;
  try {
    config = parseJson(text);
  } catch (e) {
    console.error(`  ${loc} ⚠️ JSON parse failed:`, e.message);
    console.error('  First 200 chars:', text.slice(0, 200));
    return;
  }

  const issues = validate(config, loc);
  if (issues.length > 0) {
    console.error(`  ${loc} ⚠️ validation issues: ${issues.join('; ')}`);
    return;
  }

  console.log(`  ✓ ${loc} parsed in ${elapsed}s — TIME:${config.TIME.length} WEATHER:${config.WEATHER.length} PHENOMENA:${config.PHENOMENA.length} BANS:${config.BANS.length}`);

  if (DRY) {
    console.log('\nSample entries:');
    console.log('  TIME[0]:', config.TIME[0]);
    console.log('  WEATHER[0]:', config.WEATHER[0]);
    console.log('  PHENOMENA[0]:', config.PHENOMENA[0]);
    console.log('  SUBJECT_RULE:', config.SUBJECT_RULE);
    console.log('  BANS[0]:', config.BANS[0]);
    return;
  }

  const { error: upErr } = await sb
    .from('location_cards')
    .update({ biome_config: config })
    .eq('name', loc);
  if (upErr) {
    console.error(`  ${loc} ⚠️ DB update failed:`, upErr.message);
    return;
  }
  console.log(`  ✓ Persisted biome_config for "${loc}"`);
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
    console.log('Usage: --location <name> | --all  [--dry-run]');
    process.exit(1);
  }
  console.log(`Generating biomes for ${locations.length} location(s)${DRY ? ' (dry-run)' : ''}...`);
  for (const loc of locations) {
    try {
      await processLocation(loc);
    } catch (e) {
      console.error(`  ${loc} ⚠️ unexpected error:`, e.message);
    }
  }
  console.log('Done.');
})();
