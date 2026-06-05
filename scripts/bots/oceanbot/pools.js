/**
 * OceanBot — pool registry. Maps pool-name strings to seed JSON arrays.
 *
 * load() is resilient (try/catch ENOENT → []) so the module loads even
 * when seed files are still being generated. Returns [] for missing
 * pools instead of crashing — the composer surfaces the gap via
 * pool-name resolution failure with a clear error.
 *
 * 10 paths × ~10-11 axes each = ~100 path-bespoke pools. Plus shared:
 *   LIGHTING + ATMOSPHERES + SCENE_PALETTES — universal slots
 *   VIBE_COLOR — vibe → palette string lookup (static, not seed-driven)
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// Vibe → color palette string (deterministic from rolled vibe — not a seed pool).
// Ocean-coded vibes only; matches the 10 vibes declared on the bot.
const VIBE_COLOR = {
  cinematic: 'cinematic ocean palette, teal-and-orange depth, saturated contrast',
  dark: 'inky abyssal blacks, deep navy shadow, storm-cloud chiaroscuro',
  peaceful: 'silvered dawn palette, soft pastel sea, dawn-mist tranquility',
  epic: 'dramatic god-ray palette, heroic sunset over swell, painterly saturation',
  nostalgic: 'faded-postcard ocean palette, copper sunset, sepia-tinted age-of-sail',
  ethereal: 'opalescent sea palette, pearl-white luminance, soft glow',
  ancient: 'weathered-bronze patina, verdigris-on-stone, age-of-empire faded color',
  enchanted: 'soft magical glow, dreamy aqua-and-rose shimmer',
  voltage: 'lightning-blue electric arcs, storm-cyan, cold cosmic accents',
  nightshade: 'deep violet moonlight, plum sea shadow, twilight silvers',
};

module.exports = {
  // ── Shared / universal pools ──
  LIGHTING: load('lighting'),
  ATMOSPHERES: load('atmospheres'),
  SCENE_PALETTES: load('scene_palettes'),

  VIBE_COLOR,

  // ── shipwreck-kingdom path-bespoke pools (pilot path — wired before
  // ── any seed files exist; loads as [] until gen-oceanbot-pool.js
  // ── populates them) ──
  SHIPWRECK_KINGDOM_WRECK_CLASS: load('shipwreck_kingdom_wreck_class'),
  SHIPWRECK_KINGDOM_DECAY_STATE: load('shipwreck_kingdom_decay_state'),
  SHIPWRECK_KINGDOM_CORAL_GROWTH: load('shipwreck_kingdom_coral_growth'),
  SHIPWRECK_KINGDOM_MARINE_LIFE: load('shipwreck_kingdom_marine_life'),
  SHIPWRECK_KINGDOM_CAUSTIC_LIGHT: load('shipwreck_kingdom_caustic_light'),
  SHIPWRECK_KINGDOM_WATER_CLARITY: load('shipwreck_kingdom_water_clarity'),
  SHIPWRECK_KINGDOM_FOREGROUND_ELEMENT: load('shipwreck_kingdom_foreground_element'),
  SHIPWRECK_KINGDOM_SCALE_PROVERS: load('shipwreck_kingdom_scale_provers'),
  SHIPWRECK_KINGDOM_CAMERA_FRAMING: load('shipwreck_kingdom_camera_framing'),
  SHIPWRECK_KINGDOM_SURPRISE_ELEMENT: load('shipwreck_kingdom_surprise_element'),
  SHIPWRECK_KINGDOM_DRAMA: load('shipwreck_kingdom_drama'),

  // ── lost-cities path-bespoke pools (2nd path — sunken civilizations
  // ── reclaimed by coral. Hewn stone instead of wooden ships; otherwise
  // ── same axis structure as shipwreck-kingdom. Full-bespoke content
  // ── per [[feedback_full_bespoke_per_path_no_shared_pools]]) ──
  LOST_CITIES_RUIN_CLASS: load('lost_cities_ruin_class'),
  LOST_CITIES_CRUMBLE_STATE: load('lost_cities_crumble_state'),
  LOST_CITIES_CORAL_GROWTH: load('lost_cities_coral_growth'),
  LOST_CITIES_MARINE_LIFE: load('lost_cities_marine_life'),
  LOST_CITIES_CAUSTIC_LIGHT: load('lost_cities_caustic_light'),
  LOST_CITIES_WATER_CLARITY: load('lost_cities_water_clarity'),
  LOST_CITIES_FOREGROUND_ELEMENT: load('lost_cities_foreground_element'),
  LOST_CITIES_SCALE_PROVERS: load('lost_cities_scale_provers'),
  LOST_CITIES_CAMERA_FRAMING: load('lost_cities_camera_framing'),
  LOST_CITIES_SURPRISE_ELEMENT: load('lost_cities_surprise_element'),
  LOST_CITIES_DRAMA: load('lost_cities_drama'),

  // ── pirates path-bespoke pools (3rd path — above-water naval-lore,
  // ── Pirates-of-the-Caribbean cinema. Even LEANER than lost-cities:
  // ── the hero pirate_scene entry encodes setting + characters + action
  // ── + atmosphere all in one, so only 2 path-bespoke pools are needed.
  // ── Lighting + atmosphere come from the universal pools.) ──
  PIRATE_SCENES: load('pirate_scenes'),
  PIRATE_CAMERA_FRAMING: load('pirate_camera_framing'),

  // ── ghost-ship path-bespoke pools (4th path — derelict pre-1850
  // ── wooden ships drifting alone, Flying Dutchman energy. Same
  // ── lean 2-pool shape as pirates — hero entries are dense enough
  // ── that supporting axes can do less. NO PEOPLE / no crew on this
  // ── path; pirates is OceanBot's only crewed exception.) ──
  GHOST_SHIPS: load('ghost_ships'),
  GHOST_SHIP_CAMERA_FRAMING: load('ghost_ship_camera_framing'),

  // ── kraken-leviathan path-bespoke pools (5th path — sea monsters
  // ── attacking pre-1850 wooden ships. ONLY 4 creatures: kraken,
  // ── giant squid, giant octopus, leviathan-whale. Embodiment rule
  // ── enforced via the KRAKEN_CREATURE_BLOCK in shared-blocks.js.) ──
  KRAKEN_SCENES: load('kraken_scenes'),
  KRAKEN_CAMERA_FRAMING: load('kraken_camera_framing'),

  // ── deep-wonder path-bespoke pools (6th path, first of 5 scenic —
  // ── bioluminescent beauty, alien elegance, deep-sea creatures with
  // ── inner light. NO ships / no people / no diving gear; just the
  // ── creature and the abyssal dark.) ──
  DEEP_WONDER: load('deep_wonder'),
  DEEP_WONDER_CAMERA_FRAMING: load('deep_wonder_camera_framing'),

  // ── whale-encounter path-bespoke pools (7th path, 2nd scenic —
  // ── NatGeo / Blue Planet whale documentary. Real cetacean species
  // ── rendered with anatomical accuracy. Naturalistic, NOT mythic
  // ── — kraken-leviathan handles the Moby-Dick register. NO SHIPS,
  // ── NO PEOPLE, NO DIVING GEAR.) ──
  WHALE_ENCOUNTER: load('whale_encounter'),
  WHALE_ENCOUNTER_CAMERA_FRAMING: load('whale_encounter_camera_framing'),

  // ── reef-paradise path-bespoke pools (8th path, 3rd scenic —
  // ── tropical shallow-water coral reef in maximum biodiversity.
  // ── Counterpoint to deep-wonder (sun-lit instead of abyssal-dark).
  // ── NO SHIPS, NO PEOPLE, NO DIVING GEAR.) ──
  REEF_SCENES: load('reef_scenes'),
  REEF_CAMERA_FRAMING: load('reef_camera_framing'),

  // ── polar-seas path-bespoke pools (9th path, 4th scenic — Arctic /
  // ── Antarctic ocean with ice formations + polar wildlife + aurora.
  // ── NO SHIPS, NO PEOPLE — those are covered by other paths.) ──
  POLAR_SCENES: load('polar_scenes'),
  POLAR_CAMERA_FRAMING: load('polar_camera_framing'),

  // ── bioluminescent-night path-bespoke pools (10th and FINAL path,
  // ── 5th scenic — nighttime ocean surface lit by dinoflagellate
  // ── plankton bloom. Counterpoint to deep-wonder (surface vs abyss).
  // ── NO SHIPS, NO PEOPLE, NO ARTIFICIAL LIGHTS — only the natural
  // ── glow + optional wild creature.) ──
  BIOLUM_SCENES: load('biolum_scenes'),
  BIOLUM_CAMERA_FRAMING: load('biolum_camera_framing'),

  // ── seaturtle-scape path-bespoke pools (12th path — sea-turtles
  // ── across life span from hatchling to adult, real species, in
  // ── reef + kelp + open ocean + shore + nesting habitats.) ──
  SEATURTLE_SCENES: load('seaturtle_scenes'),
  SEATURTLE_CAMERA_FRAMING: load('seaturtle_camera_framing'),

  // ── wild-sealife-camera path-bespoke pools (13th path — apex
  // ── predators + pelagic giants + sea-mammals + game fish + notable
  // ── invertebrates, NatGeo CAUGHT-on-camera register.) ──
  WILD_SEALIFE_SCENES: load('wild_sealife_scenes'),
  WILD_SEALIFE_CAMERA_FRAMING: load('wild_sealife_camera_framing'),

  // ── tropical-fish-closeup path-bespoke pools (14th path — single-
  // ── species portrait of one bright tropical fish in the reef,
  // ── distinct from reef-paradise biodiversity-explosion.) ──
  TROPICAL_FISH_SCENES: load('tropical_fish_scenes'),
  TROPICAL_FISH_CAMERA_FRAMING: load('tropical_fish_camera_framing'),

  // ── coastal-power path-bespoke pools (15th path — heavy swells +
  // ── wave-crashes + shorebreak against cliffs / sea-stacks / jagged
  // ── rocks / lighthouses / beaches, mother-nature-power register
  // ── across multiple atmospheric weather/sky registers.) ──
  COASTAL_POWER_SCENES: load('coastal_power_scenes'),
  COASTAL_POWER_WEATHER_AND_SKY: load('coastal_power_weather_and_sky'),
  COASTAL_POWER_CAMERA_FRAMING: load('coastal_power_camera_framing'),

  // ── mystical-mermaid character-path pools (11 — 10 path axes + 1
  // ── drama conditional). Full-bespoke per the
  // ── feedback_full_bespoke_per_path_no_shared_pools rule. The path
  // ── file (paths/mystical-mermaid.js) loads these directly via
  // ── loadSeed (function-form), but registering them here keeps the
  // ── registry complete + lets other tooling discover them. Each
  // ── pool starts at MVP-25 entries and scales to production-200
  // ── after R0 approval. ──
  MERMAID_ARCHETYPE: load('mermaid_archetype'),
  MERMAID_FACE_AND_SKIN: load('mermaid_face_and_skin'),
  MERMAID_EYES: load('mermaid_eyes'),
  MERMAID_HAIR: load('mermaid_hair'),
  MERMAID_TAIL: load('mermaid_tail'),
  MERMAID_ADORNMENT: load('mermaid_adornment'),
  MERMAID_SETTING: load('mermaid_setting'),
  MERMAID_ACTION: load('mermaid_action'),
  MERMAID_MYSTICAL_ELEMENT: load('mermaid_mystical_element'),
  MERMAID_CAMERA_FRAMING: load('mermaid_camera_framing'),
  MERMAID_DRAMA: load('mermaid_drama'),

  // 10 scene paths + 1 character path (mystical-mermaid) — OceanBot complete.
};
