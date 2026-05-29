#!/usr/bin/env node
/**
 * Generate per-location biome_config (Phase 1.5 of NIGHTLY_DREAM_ARCHITECTURE.md).
 *
 * Every location card gets its OWN location-tuned BiomeConfig
 * (TIME/WEATHER/CAMERA/PHENOMENA/SUBJECT_RULE/BANS), Sonnet-generated from:
 *   - the card's biome CLASS (register + subject focus + ban theme — the
 *     structural/axis-clean anchor), and
 *   - the card's real identity (name, visual_palette, atmosphere,
 *     cinematic_phrases, iconic spots).
 *
 * Result: one mechanism (every card runs on biome_config), maximum richness
 * (each location bespoke). The shared biomeAxes.ts stays as the class taxonomy
 * (tag-filtering) + the runtime fallback for not-yet-generated cards.
 *
 *   node scripts/gen-location-biome-configs.js --only "ancient egypt"   # one, dry-run
 *   node scripts/gen-location-biome-configs.js --limit 4                # 4 missing, dry-run
 *   node scripts/gen-location-biome-configs.js --apply                  # all missing, write
 *
 * By default only fills cards WITHOUT biome_config (preserves the curated 53).
 * --regen also overwrites existing configs (use with care).
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = Object.fromEntries(
  fs
    .readFileSync(`${__dirname}/../.env.local`, 'utf8')
    .split('\n')
    .filter((l) => l.includes('='))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', env.SUPABASE_SERVICE_ROLE_KEY);
const MODEL = 'claude-sonnet-4-6';

// Per-class anchor: register (the mood/world), subject focus (what the
// SUBJECT_RULE locks), ban theme (what the BANS must exclude for coherence).
// Mirrors the 14 shared biomes in _shared/biomeAxes.ts.
const CLASS_SPEC = {
  tropical_coastal: {
    register: 'sun-drenched tropical coast / islands',
    subject: 'the iconic coastline, water, reefs or island geography rendered massive',
    bans: 'no interiors-as-subject, no snow/ice, no fantasy or sci-fi, no people',
  },
  arctic_polar: {
    register: 'frozen polar / arctic wilderness',
    subject: 'the iconic frozen landscape — ice, glaciers, snow plains, fjords — rendered massive',
    bans: 'no tropical/warm elements, no palm trees, no people, no fantasy or sci-fi',
  },
  desert_arid: {
    register: 'arid desert',
    subject: 'dunes, mesas, canyons, red-rock or the named desert monument rendered massive',
    bans: 'no water/ocean/lush greenery, no snow/ice, no tropical, no people',
  },
  temperate_forest: {
    register: 'lush temperate woodland',
    subject: 'towering trees, layered canopy and forest depth rendered immersive and grand',
    bans: 'no desert, no snow-takeover, no tropical-beach, no people, no fantasy glow',
  },
  alpine_mountain: {
    register: 'dramatic high mountains',
    subject: 'monumental peaks, ridgelines, glaciated faces and vast valleys rendered massive',
    bans: 'no tropical, no desert dunes, no people, no fantasy or sci-fi',
  },
  grassland_savanna: {
    register: 'open savanna / grassland',
    subject: 'endless rolling grass, lone trees and big dramatic sky rendered expansive',
    bans: 'no vehicles/tourists, no tropical-beach, no snow, no dense jungle, no people',
  },
  wetland_jungle: {
    register: 'dense tropical jungle / wetland',
    subject: 'towering canopy, hanging vines, rivers and waterfalls rendered immersive and vast',
    bans: 'no desert, no snow, no arid terrain, no people, no fantasy glow',
  },
  urban_city: {
    register: 'iconic modern cityscape',
    subject: 'the skyline, streets, bridges or landmark architecture rendered grand and layered',
    bans: 'no wilderness takeover, no interiors-as-subject, no overt fantasy/sci-fi unless the place is genuinely futuristic, no people-as-subject',
  },
  interior_intimate: {
    register: 'cozy, intimate indoor space',
    subject:
      'the interior itself — furnishings, textures, warm light — filling the frame at human / eye-level scale',
    bans: 'no outdoor landscape as the subject (a view through a window is fine), no vast/aerial scale, no open sky as subject, no wild animals indoors, no people',
  },
  aquatic_underwater: {
    register: 'immersive underwater world',
    subject:
      'submerged reef, sunken city, kelp forest or open-water vista with caustic light and a cool teal-cyan-blue palette',
    bans: 'no dry-land elements, no warm-amber land palette, no open sky as subject, no people/divers',
  },
  fantasy_imagined: {
    register: 'imagined magical realm (magic and impossible beauty ARE allowed)',
    subject: 'the magical location rendered with supernatural beauty, glow and dreamlike scale',
    bans: 'no modern technology, no sci-fi (spaceships/neon-grid), no photoreal-mundane, no people',
  },
  scifi_cosmic: {
    register:
      'imagined sci-fi world (alien skies, megastructures, tech and physics-bending allowed)',
    subject: 'the sci-fi landmark or world feature rendered monumental',
    bans: 'no present-day-Earth elements, no fantasy-magic (runes/fairies), no real-Earth landmarks, no people',
  },
  gothic_historic: {
    register: 'moody gothic / historic (twilight, night or storm-light only)',
    subject:
      'towering gothic stone architecture — cathedrals, manors, gas-lit streets — dark ornate beauty as the hero',
    bans: 'no bright daylight, no modern elements, no tropical, no cheerful/pastel palette, no sci-fi, no people',
  },
  ancient_ruins: {
    register: 'iconic ancient monument / wonder',
    subject: 'the named ancient monument rendered MASSIVE and awe-scaled — monument-as-hero',
    bans: 'no modern infrastructure/signage/tourists, no anachronistic clothing/tech, no fantasy or sci-fi, no people',
  },
  red_rock_canyon: {
    register: 'red-rock canyon country (Colorado Plateau / desert southwest)',
    subject:
      'towering stratified sandstone walls, mesas, hoodoos, natural arches and vast canyon depth rendered awe-scaled',
    bans: 'no ocean/sea/lush greenery (a thin river or seasonal waterfall is fine), no snow/ice, no tropical foliage, no people',
  },
  volcanic_geothermal: {
    register: 'volcanic / geothermal landscape (lava, geysers, basalt, hot springs)',
    subject:
      'basalt columns, lava fields, erupting geysers, steaming hot springs and craters rendered vast and otherworldly',
    bans: 'no tropical/palms, no desert dunes, no fantasy/sci-fi (the otherworldliness is REAL geology), no people',
  },
  fjord_coastal: {
    register: 'nordic fjord coast (sheer cliffs into deep water)',
    subject:
      'sheer cliff walls plunging into deep still water, ribboning waterfalls and snow-capped peaks above, immense vertical scale',
    bans: 'no tropical/palms, no warm-amber palette, no desert, no urban skyline, no people',
  },
  mediterranean_coastal: {
    register: 'sun-drenched Mediterranean / Aegean coast (whitewashed towns, blue domes)',
    subject:
      'whitewashed cliffside towns, blue domes, caldera cliffs and the deep-blue Aegean rendered luminous and grand',
    bans: 'no tropical palms/jungle, no turquoise-lagoon-with-palms look, no snow, no overcast gloom, no people',
  },
  temperate_coastal: {
    register: 'rugged cool temperate coast (Pacific/Atlantic cliffs, fog, surf)',
    subject:
      'towering sea-cliffs, crashing surf, fog-wrapped headlands, arched coastal bridges and wind-bent cypress rendered dramatic and moody-bright',
    bans: 'no tropical palms, no calm turquoise lagoon, no desert, no snow, no city skyline as subject, no people',
  },
  zen_garden: {
    register: 'serene manicured Japanese garden',
    subject:
      'manicured maples, cushioned moss, raked gravel, stone lanterns, arched bridges and koi ponds rendered serene and balanced at intimate / eye-level scale',
    bans: 'no wild towering forest or dense jungle, no desert/snow-takeover, no vast/aerial/monumental scale, no people',
  },
};

function buildPrompt(card) {
  const cls = card.biome && CLASS_SPEC[card.biome] ? card.biome : 'tropical_coastal';
  const spec = CLASS_SPEC[cls];
  const join = (arr, n) => (Array.isArray(arr) ? arr.slice(0, n).join(' · ') : '');
  return `You are an art director defining the ATMOSPHERIC CONFIG for AI-generated "dream" images of a specific iconic location. Output ONLY a valid JSON object (no prose, no markdown fence) matching EXACTLY this schema:
{
  "TIME": [6-8 strings],
  "WEATHER": [6-7 strings],
  "CAMERA": [5 strings],
  "PHENOMENA": [8-10 strings],
  "SUBJECT_RULE": "one rich sentence",
  "BANS": [6-7 strings]
}

LOCATION: "${card.name}"
BIOME CLASS: ${cls} — ${spec.register}
SUBJECT FOCUS: ${spec.subject}
BAN THEME: ${spec.bans}

LOCATION TRUTH — this is the real "${card.name}". Every entry must feel unmistakably like THIS place: reference its actual geography, materials, light and named features. Distill the VISUAL + atmospheric truth from the notes below; IGNORE camera-technique jargon and non-visual/smell/sound notes:
- visual elements: ${join(card.visual_palette, 14)}
- atmosphere: ${join(card.atmosphere, 12)}
- signature views: ${join(card.cinematic_phrases, 10)}
- iconic spots: ${join(card.iconicSpots, 8) || '(none)'}

AXIS-CLEAN DISCIPLINE (critical — each axis owns ONE lane and never bleeds into another; combinations of pure axes create the variety):
- TIME = time-of-day + the quality of light at that hour ONLY. NO weather, NO optical events.
- WEATHER = what the air and sky are physically doing (clarity / cloud / rain / mist / haze / wind / storm appropriate to THIS place) ONLY. NO light descriptors, NO optical phenomena.
- PHENOMENA = specific optical & atmospheric EVENTS ONLY (rim-light, god-rays, lens flare, reflections, glints, mirages, halos, caustics). NO time-of-day, NO weather conditions.
- CAMERA = framing / angle / lens ONLY.
- SUBJECT_RULE = ${spec.subject}, locked so the render is unmistakably "${card.name}".
- BANS = 6-7 hard bans enforcing: ${spec.bans}.

LOCATION-SPECIFICITY MANDATE: every TIME / WEATHER / PHENOMENA entry must reference THIS location's real character — never generic. Example for Egypt: "khamsin dust-wind hazing the Giza plateau" NOT "wind-blown sand". Use the real materials, geography and named features above.

COHERENCE: everything must be physically possible at this exact location. No cross-biome contamination.

Output ONLY the JSON object.`;
}

async function callSonnet(prompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${JSON.stringify(j).slice(0, 300)}`);
  return j.content[0].text;
}

function parseConfig(text) {
  const a = text.indexOf('{');
  const b = text.lastIndexOf('}');
  if (a < 0 || b < 0) throw new Error('no JSON object in output');
  const obj = JSON.parse(text.slice(a, b + 1));
  const arr = (k) =>
    Array.isArray(obj[k]) && obj[k].length > 0 && obj[k].every((x) => typeof x === 'string');
  if (!arr('TIME') || !arr('WEATHER') || !arr('CAMERA') || !arr('PHENOMENA') || !arr('BANS'))
    throw new Error('missing/invalid array axis');
  if (typeof obj.SUBJECT_RULE !== 'string' || obj.SUBJECT_RULE.length < 20)
    throw new Error('missing/short SUBJECT_RULE');
  return {
    TIME: obj.TIME,
    WEATHER: obj.WEATHER,
    CAMERA: obj.CAMERA,
    PHENOMENA: obj.PHENOMENA,
    SUBJECT_RULE: obj.SUBJECT_RULE,
    BANS: obj.BANS,
  };
}

(async () => {
  const only =
    (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1] ||
    (process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : null);
  const limitArg = process.argv.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : only ? 1 : Infinity;
  const apply = process.argv.includes('--apply');
  const regen = process.argv.includes('--regen');

  let q = sb
    .from('location_cards')
    .select('name,biome,biome_config,visual_palette,atmosphere,cinematic_phrases')
    .order('name');
  if (only) q = q.eq('name', only);
  const { data: cards, error } = await q;
  if (error) throw error;

  const targets = cards.filter((c) => regen || only || !c.biome_config).slice(0, limit);
  console.log(`Targets: ${targets.length} card(s)${apply ? ' (WILL WRITE)' : ' (dry-run)'}\n`);

  // attach iconic spots
  const { data: spots } = await sb
    .from('location_iconic_spots')
    .select('location_key,spot_text')
    .eq('is_active', true);
  const spotMap = {};
  for (const s of spots || [])
    (spotMap[s.location_key] = spotMap[s.location_key] || []).push(s.spot_text);

  let ok = 0;
  const failures = [];
  for (const card of targets) {
    card.iconicSpots = spotMap[card.name] || [];
    try {
      const text = await callSonnet(buildPrompt(card));
      const cfg = parseConfig(text);
      console.log(`\n========== ${card.name}  [${card.biome}] ==========`);
      console.log('SUBJECT_RULE:', cfg.SUBJECT_RULE);
      console.log('TIME[0]:', cfg.TIME[0]);
      console.log('WEATHER[0]:', cfg.WEATHER[0]);
      console.log('PHENOMENA[0]:', cfg.PHENOMENA[0]);
      console.log('BANS:', cfg.BANS.join(' | '));
      if (apply) {
        const { error: uerr } = await sb
          .from('location_cards')
          .update({ biome_config: cfg })
          .eq('name', card.name);
        if (uerr) throw uerr;
      }
      ok++;
    } catch (e) {
      console.warn(`  ⚠️  ${card.name}: ${e.message}`);
      failures.push(card.name);
    }
  }
  console.log(
    `\n${apply ? 'Wrote' : 'Generated'} ${ok}/${targets.length}. Failures: ${failures.length}${failures.length ? ' → ' + failures.join(', ') : ''}`
  );
})();
