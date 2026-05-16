/**
 * GothBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/gothbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// All vibes push toward the Nightshade spine: deep purples, midnight blues, velvet blacks,
// poison greens, witch-fire green, fel-violet, blacklight, moonlit silver, tarnished silver,
// twilight lavender. Red is rare/accent-only — never window-glow, never blood-moon dominant.
const VIBE_COLOR = {
  cinematic: 'teal-and-amber cinematic grade, deep indigo shadows, warm candle highlights',
  dark: 'oil-black dominant with warm amber-and-orange candle glow cutting the shadow',
  epic: 'dramatic moonbeams through gothic arches, silver + fel-violet + forge-ember accents',
  nostalgic: 'faded sepia gothic, burnt umber + tarnished-gold + weathered plum',
  psychedelic:
    'impossible violet + poisonous witch-fire green + amber flashes, hallucinatory gothic',
  ethereal: 'pearl-white ghost-mist, opalescent fog, lavender with pale-gold candle-gleam',
  arcane: 'deep violet + emerald ritual-glow + mystical candle-amber + witch-fire green mix',
  ancient: 'weathered bronze + stone-grey + warm alchemist-gold + crypt-dust + faded plum',
  enchanted:
    'soft ghostly glow, lavender-and-midnight + warm candle secondary against twilight-indigo',
  fierce: 'stark violet + obsidian, forge-ember backlight, torch-orange rim-light',
  coquette: 'dark-rose pastel + cream + black lace + warm candle-amber + midnight-indigo',
  voltage: 'electric-violet storm-arcs + fel-green neon + amber-sparks, high contrast',
  nightshade: 'deep-violet moonlight + plum-shadows + silver starlight + candle-amber pool',
  macabre: 'inked plum-and-obsidian + fel-green dread + single warm-orange lantern accent',
  shimmer: 'tarnished silver + alchemist-gold glint amidst shadow + moonlit violet ground',
  surreal: 'impossible violet + witch-fire green + molten-amber pairings, hallucinatory gothic',
};

// GOTHIC_STRUCTURES may not exist yet during regen — load defensively
function loadOptional(name) {
  try {
    return load(name);
  } catch {
    return [];
  }
}

module.exports = {
  DARK_FEMALE_CHARACTERS: load('dark_characters'),
  DARK_MALE_CHARACTERS: loadOptional('dark_male_characters'),
  FEMALE_CHARACTER_ACTIONS: load('character_actions'),
  MALE_CHARACTER_ACTIONS: loadOptional('male_character_actions'),
  HAIR_COLORS: loadOptional('hair_colors'),
  FEMALE_HAIRSTYLES: loadOptional('female_hairstyles'),
  MALE_HAIRSTYLES: loadOptional('male_hairstyles'),
  SKIN_TONES: loadOptional('skin_tones'),
  FACIAL_FEATURES: loadOptional('facial_features'),
  CHARACTER_BACKDROPS: loadOptional('character_backdrops'),
  FEMALE_ACCESSORIES: load('goth_woman_accessories'),
  MALE_ACCESSORIES: loadOptional('male_accessories'),
  GOTHIC_LANDSCAPES: load('gothic_landscapes'),
  GOTHIC_STRUCTURES: loadOptional('gothic_structures'),
  // ─── dark-landscape path (2026-05-15, bespoke axis migration)
  GOTHBOT_DARK_LANDSCAPE_BIOME: load('gothbot_dark_landscape_biome'),
  GOTHBOT_DARK_LANDSCAPE_ARCHITECTURE: load('gothbot_dark_landscape_architecture'),
  GOTHBOT_DARK_LANDSCAPE_PHENOMENON: load('gothbot_dark_landscape_phenomenon'),
  GOTHBOT_DARK_LANDSCAPE_SURPRISE_ELEMENT: load('gothbot_dark_landscape_surprise_element'),
  GOTHBOT_DARK_LANDSCAPE_SKY: load('gothbot_dark_landscape_sky'),
  // ─── gothic-vista path (2026-05-15, bespoke axis migration with LAND-IS-ALIVE mandate)
  GOTHBOT_GOTHIC_VISTA_BIOME: load('gothbot_gothic_vista_biome'),
  GOTHBOT_GOTHIC_VISTA_ARCHITECTURE: load('gothbot_gothic_vista_architecture'),
  GOTHBOT_GOTHIC_VISTA_PHENOMENON: load('gothbot_gothic_vista_phenomenon'),
  GOTHBOT_GOTHIC_VISTA_SURPRISE_ELEMENT: load('gothbot_gothic_vista_surprise_element'),
  GOTHBOT_GOTHIC_VISTA_SKY: load('gothbot_gothic_vista_sky'),
  // ─── goth-male-closeup path (2026-05-15 migration — male dark-aristocrat closeup, bespoke pools)
  GOTHBOT_GOTH_MALE_CLOSEUP_ARCHETYPE: loadOptional('gothbot_goth_male_closeup_archetype'),
  GOTHBOT_GOTH_MALE_CLOSEUP_SKIN: loadOptional('gothbot_goth_male_closeup_skin'),
  GOTHBOT_GOTH_MALE_CLOSEUP_EYES: loadOptional('gothbot_goth_male_closeup_eyes'),
  GOTHBOT_GOTH_MALE_CLOSEUP_HAIR_COLOR: loadOptional('gothbot_goth_male_closeup_hair_color'),
  GOTHBOT_GOTH_MALE_CLOSEUP_HAIRSTYLE: loadOptional('gothbot_goth_male_closeup_hairstyle'),
  GOTHBOT_GOTH_MALE_CLOSEUP_FACE_DETAIL: loadOptional('gothbot_goth_male_closeup_face_detail'),
  GOTHBOT_GOTH_MALE_CLOSEUP_WARDROBE: loadOptional('gothbot_goth_male_closeup_wardrobe'),
  GOTHBOT_GOTH_MALE_CLOSEUP_ACCESSORY: loadOptional('gothbot_goth_male_closeup_accessory'),
  GOTHBOT_GOTH_MALE_CLOSEUP_CANDID_MOMENT: loadOptional('gothbot_goth_male_closeup_candid_moment'),
  GOTHBOT_GOTH_MALE_CLOSEUP_CAMERA_PERSPECTIVE: loadOptional('gothbot_goth_male_closeup_camera_perspective'),
  // ─── goth-closeup path (2026-05-15 migration — female dark-seductress closeup, bespoke pools)
  GOTHBOT_GOTH_CLOSEUP_ARCHETYPE: loadOptional('gothbot_goth_closeup_archetype'),
  GOTHBOT_GOTH_CLOSEUP_SKIN: loadOptional('gothbot_goth_closeup_skin'),
  GOTHBOT_GOTH_CLOSEUP_EYES: loadOptional('gothbot_goth_closeup_eyes'),
  GOTHBOT_GOTH_CLOSEUP_HAIR_COLOR: loadOptional('gothbot_goth_closeup_hair_color'),
  GOTHBOT_GOTH_CLOSEUP_HAIRSTYLE: loadOptional('gothbot_goth_closeup_hairstyle'),
  GOTHBOT_GOTH_CLOSEUP_MAKEUP: loadOptional('gothbot_goth_closeup_makeup'),
  GOTHBOT_GOTH_CLOSEUP_WARDROBE: loadOptional('gothbot_goth_closeup_wardrobe'),
  GOTHBOT_GOTH_CLOSEUP_ACCESSORY: loadOptional('gothbot_goth_closeup_accessory'),
  GOTHBOT_GOTH_CLOSEUP_CANDID_MOMENT: loadOptional('gothbot_goth_closeup_candid_moment'),
  GOTHBOT_GOTH_CLOSEUP_CAMERA_PERSPECTIVE: loadOptional('gothbot_goth_closeup_camera_perspective'),
  // ─── cozy-goth path (2026-05-15 migration — layered witch's-lair / wizard's-workroom, magical-glow + figure-accent)
  GOTHBOT_COZY_GOTH_INTERIOR_SPACE: loadOptional('gothbot_cozy_goth_interior_space'),
  GOTHBOT_COZY_GOTH_MAGICAL_GLOW_ITEM: loadOptional('gothbot_cozy_goth_magical_glow_item'),
  GOTHBOT_COZY_GOTH_OCCULT_ARTIFACT: loadOptional('gothbot_cozy_goth_occult_artifact'),
  GOTHBOT_COZY_GOTH_FIGURE_ACCENT: loadOptional('gothbot_cozy_goth_figure_accent'),
  GOTHBOT_COZY_GOTH_AMBIENT_ATMOSPHERE: loadOptional('gothbot_cozy_goth_ambient_atmosphere'),
  // ─── castlevania-scene path (2026-05-15 migration — Konami Castlevania, Ayami Kojima painted)
  GOTHBOT_CASTLEVANIA_SCENE_STRUCTURE: loadOptional('gothbot_castlevania_scene_structure'),
  GOTHBOT_CASTLEVANIA_SCENE_DETAIL: loadOptional('gothbot_castlevania_scene_detail'),
  GOTHBOT_CASTLEVANIA_SCENE_INNER_LIGHT: loadOptional('gothbot_castlevania_scene_inner_light'),
  GOTHBOT_CASTLEVANIA_SCENE_ACCENT_CREATURE: loadOptional('gothbot_castlevania_scene_accent_creature'),
  GOTHBOT_CASTLEVANIA_SCENE_SPICE: loadOptional('gothbot_castlevania_scene_spice'),
  GOTHBOT_CASTLEVANIA_SCENE_SKY: loadOptional('gothbot_castlevania_scene_sky'),
  // ─── gothic-architecture path (2026-05-15, bespoke axis migration with STRUCTURE-IS-HERO)
  GOTHBOT_GOTHIC_ARCHITECTURE_STRUCTURE: load('gothbot_gothic_architecture_structure'),
  GOTHBOT_GOTHIC_ARCHITECTURE_DETAIL: load('gothbot_gothic_architecture_detail'),
  GOTHBOT_GOTHIC_ARCHITECTURE_INNER_LIGHT: load('gothbot_gothic_architecture_inner_light'),
  GOTHBOT_GOTHIC_ARCHITECTURE_ACCENT_CREATURE: load('gothbot_gothic_architecture_accent_creature'),
  GOTHBOT_GOTHIC_ARCHITECTURE_SPICE: load('gothbot_gothic_architecture_spice'),
  GOTHBOT_GOTHIC_ARCHITECTURE_SKY: load('gothbot_gothic_architecture_sky'),
  DARK_CREATURES: load('dark_creatures'),
  CASTLEVANIA_CONTEXTS: load('castlevania_contexts'),
  COZY_GOTH_SETTINGS: load('cozy_goth_settings'),
  VAMPIRE_ARCHETYPES: loadOptional('vampire_archetypes'),
  VAMPIRE_WARDROBE: loadOptional('vampire_wardrobe'),
  VAMPIRE_SETTINGS: loadOptional('vampire_settings'),
  VAMPIRE_KILLER_DETAILS: loadOptional('vampire_killer_details'),
  VAMPIRE_HAIR: loadOptional('vampire_hair'),
  VAMPIRE_MENACE_FEATURES: loadOptional('vampire_menace_features'),
  VAMPIRE_COMPOSITIONS: loadOptional('vampire_compositions'),
  GOTH_FEMALE_ARCHETYPES: loadOptional('goth_female_archetypes'),
  GOTH_FEMALE_MAKEUP: loadOptional('goth_female_makeup'),
  GOTH_FEMALE_MOMENTS: loadOptional('goth_female_moments'),
  GOTH_FEMALE_WARDROBE: loadOptional('goth_female_wardrobe'),
  GOTH_FEMALE_SKIN: loadOptional('goth_female_skin'),
  GOTH_EYE_COLORS: loadOptional('goth_eye_colors'),
  GOTH_MALE_EYE_COLORS: loadOptional('goth_male_eye_colors'),
  VAMPIRE_LIGHTING: loadOptional('vampire_lighting'),
  VAMPIRE_ETHNICITIES: loadOptional('vampire_ethnicities'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  SCENE_PALETTES: load('scene_palettes'),
  // Vampire-assassin paths (added 2026-05-08). 6 shared pools + 4 female + 4 male.
  ASSASSIN_SKIN: load('assassin_skin'),
  ASSASSIN_EYES: load('assassin_eyes'),
  ASSASSIN_HAIR_COLOR: load('assassin_hair_color'),
  ASSASSIN_STAGE: load('assassin_stage'),
  ASSASSIN_EPIC_BACKDROP: load('assassin_epic_backdrop'),
  ASSASSIN_ADVENTURE_ACTIONS: load('assassin_adventure_actions'),
  VAMPIRE_ASSASSIN_FEMALE: load('vampire_assassin_female'),
  ASSASSIN_OUTFITS_FEMALE: load('assassin_outfits_female'),
  ASSASSIN_HAIRSTYLES_FEMALE: load('assassin_hairstyles_female'),
  ASSASSIN_ACCESSORIES_FEMALE: load('assassin_accessories_female'),
  VAMPIRE_ASSASSIN_MALE: load('vampire_assassin_male'),
  ASSASSIN_OUTFITS_MALE: load('assassin_outfits_male'),
  ASSASSIN_HAIRSTYLES_MALE: load('assassin_hairstyles_male'),
  ASSASSIN_ACCESSORIES_MALE: load('assassin_accessories_male'),
  // Combat path pools (added 2026-05-08).
  COMBAT_FOE: load('combat_foe'),
  COMBAT_MOMENT: load('combat_moment'),
  // Vampire-vs-vampire duel pools (added 2026-05-16) — humanoid-only foe.
  VAMPIRE_FOE: loadOptional('vampire_foe'),
  VAMPIRE_DUEL_MOMENT: loadOptional('vampire_duel_moment'),
  // Monster-prowl path pools (added 2026-05-08).
  CREATURE_ARCHETYPE: load('creature_archetype'),
  CREATURE_WILD_ACTION: load('creature_wild_action'),
  VIBE_COLOR,

  // Sensory anchor pools — 3 contexts × 7 channels × 50 entries.
  // Wired into bot.sensoryAnchors.poolsByContextAndChannel in index.js.
  SENSORY_POOLS: {
    female: {
      smell: load('sensory_female_smell'),
      sound: load('sensory_female_sound'),
      touch: load('sensory_female_touch'),
      temperature: load('sensory_female_temperature'),
      weight: load('sensory_female_weight'),
      air: load('sensory_female_air'),
      lightcolor: load('sensory_female_lightcolor'),
    },
    male: {
      smell: load('sensory_male_smell'),
      sound: load('sensory_male_sound'),
      touch: load('sensory_male_touch'),
      temperature: load('sensory_male_temperature'),
      weight: load('sensory_male_weight'),
      air: load('sensory_male_air'),
      lightcolor: load('sensory_male_lightcolor'),
    },
    scene: {
      smell: load('sensory_scene_smell'),
      sound: load('sensory_scene_sound'),
      touch: load('sensory_scene_touch'),
      temperature: load('sensory_scene_temperature'),
      weight: load('sensory_scene_weight'),
      air: load('sensory_scene_air'),
      lightcolor: load('sensory_scene_lightcolor'),
    },
  },
};
