#!/usr/bin/env node
/**
 * Seed first_dream_cells with 33 baseline recipes (3 personas × 10
 * location classes + 3 persona-base fallbacks).
 *
 * These are FIRST-PASS recipes. Per the spec, each cell should hit a
 * 4.5+/5 banger rate after auto-QA tuning rounds. This script gives
 * every cell a coherent starting point that compiles + renders cleanly.
 *
 * Tuning happens after launch via:
 *   node scripts/iter-first-dream.js --persona portrait --location-class urban --count 5 --post
 * (script lives in Phase 6 follow-up)
 *
 * Usage:
 *   node scripts/seed-first-dream-cells.js              # dry run
 *   node scripts/seed-first-dream-cells.js --execute    # write
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--execute');

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
const envFile = readEnvFile();
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY || envFile.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_URL =
  process.env.SUPABASE_URL || envFile.SUPABASE_URL || 'https://jimftynwrinwenonjrlj.supabase.co';
if (!SERVICE_ROLE) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(SUPABASE_URL, SERVICE_ROLE);

// ── Locked guardrails for every cell ──────────────────────────────────
// Mediums that face-swap cleanly + render reliably. NEVER bot-only on
// first dream. Curated set — these ALL look beautiful with face-swap.

const SAFE_PORTRAIT_MEDIUMS = ['canvas', 'render', 'watercolor', 'illustration', 'pencil'];
const SAFE_VISTA_MEDIUMS = ['canvas', 'watercolor', 'illustration', 'fairytale', 'storybook'];
const SAFE_COUPLE_MEDIUMS = ['canvas', 'watercolor', 'illustration', 'render'];

// Objects that work for character-led cells. Vista uses no objects (epic
// landscape stands alone).
const PORTRAIT_OBJECTS = ['personal', 'magical', 'natural', 'companion'];
const COUPLE_OBJECTS = ['personal', 'magical', 'natural'];

// Phrases that ALWAYS get banned (in addition to the global guardrails)
const COMMON_BANNED = [
  'gothic',
  'horror',
  'demon',
  'demonic',
  'vampire',
  'halloween',
  'macabre',
  'dark fantasy',
  'sinister',
  'creepy',
  'jack skellington',
  'nightmare before christmas',
];

// ── Cell recipes ──────────────────────────────────────────────────────
// Each cell is { persona, location_class, composition_brief, lighting_recipe,
// camera_recipe, sensory_anchor_keys, allowed_mediums, allowed_object_classes,
// banned_phrases, banner_caption_template, forced_vibe_key, is_base_fallback }

const CELLS = [];

// ────────────────────────────────────────────────────────────────────
// PORTRAIT × ___ — solo heroic medium-close framing
// ────────────────────────────────────────────────────────────────────

CELLS.push({
  persona: 'portrait',
  location_class: 'base',
  composition_brief:
    'Medium-close 3/4 framing waist-up, subject angled slightly toward camera in a candid movie-still moment, NEVER posing. Subject occupies left or right third. Atmospheric depth behind. Fully visible face, well-lit.',
  lighting_recipe:
    'Cinematic warm key light from one side, soft cool fill from the other, atmospheric haze catching the light, painterly chiaroscuro tradition. Golden-hour warmth dominant.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, eye-level or slightly low angle, candid film-still framing, subtle bokeh.',
  sensory_anchor_keys: ['atmospheric_haze', 'warm_rim_light', 'painterly_brushwork'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: COMMON_BANNED,
  banner_caption_template: 'I imagined you here. The light was just right.',
  forced_vibe_key: 'cinematic',
  is_base_fallback: true,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'urban',
  composition_brief:
    'Medium-close 3/4 framing on a wet city street at golden-hour-into-blue-hour transition. Subject at left or right third, fire-escape or alley angle slightly looking up. Wet asphalt below catching reflected neon. Subject in dramatic costume or modern wardrobe befitting the city. Distant skyline glow softly out of focus behind.',
  lighting_recipe:
    'Warm orange neon rim light from one side bouncing off wet pavement + cool blue ambient fill + atmospheric steam haze. Reflected light pools on asphalt. Cinematic Blade Runner / Drive lighting.',
  camera_recipe:
    '50mm equivalent, shallow depth of field with neon bokeh, slight low angle, anamorphic horizontal lens flare.',
  sensory_anchor_keys: ['wet_pavement_reflection', 'drifting_steam', 'neon_bokeh', 'atmospheric_haze'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'forest', 'meadow', 'beach', 'mountain'],
  banner_caption_template: 'I put you in {place}. The neon caught your face.',
  forced_vibe_key: 'cinematic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'coastal',
  composition_brief:
    'Medium-close 3/4 framing at golden hour on a rocky shore or pier. Subject at left or right third with sea spray haze around them, ocean horizon visible behind. Subject in flowing or cinematic wardrobe. Wave-spray foreground texture. Salt-air atmospheric depth.',
  lighting_recipe:
    'Warm golden-hour key from low angle illuminating face, cool sea-spray ambient fill, sun-flare softening the silhouette. Painterly Mediterranean light.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, eye-level, sun-flare bloom, gentle motion blur on water spray.',
  sensory_anchor_keys: ['sea_spray_haze', 'golden_hour_warmth', 'crashing_wave', 'salt_atmosphere'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'forest', 'city', 'mountain peak'],
  banner_caption_template: 'I put you on the shore at {place}. The light was kind.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'forest',
  composition_brief:
    'Medium-close 3/4 framing in dappled god-rays through forest canopy. Subject at left or right third, mossy log or fern foreground, tall trees fading into atmospheric depth behind. Subject in fairytale-coded or naturally fitting wardrobe. Dust motes catching light beams.',
  lighting_recipe:
    'God-rays piercing canopy, warm dappled light catching subject face, cool forest-shadow ambient, dust motes suspended in beams. Studio Ghibli forest light tradition.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, eye-level, soft bokeh on background ferns, dust-mote particle texture.',
  sensory_anchor_keys: ['god_rays', 'dust_motes', 'mossy_foreground', 'dappled_warmth'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'city', 'street', 'pavement'],
  banner_caption_template: 'I imagined you in {place}. The light came through the leaves.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'mountain',
  composition_brief:
    'Medium-close 3/4 framing on a high alpine ridge or rocky outcrop. Subject at left or right third with breath visible in cold air. Snow particles or alpine grass foreground. Distant peaks fading into cool atmospheric depth behind. Subject in adventure or mythic wardrobe. Sense of altitude and scale.',
  lighting_recipe:
    'Cool alpine light, warm low-angle sun catching face from one side, cold blue ambient fill, gentle snow-mist haze. Crisp high-altitude clarity.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, slightly low angle for hero stance, sharp face, soft mountain backdrop.',
  sensory_anchor_keys: ['breath_in_cold_air', 'snow_particles', 'alpine_clarity', 'distant_peaks'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'tropical', 'beach', 'city'],
  banner_caption_template: 'I imagined you at {place}. The air was thin and clean.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'desert',
  composition_brief:
    'Medium-close 3/4 framing at golden hour in vast desert landscape. Subject at left or right third with long shadow stretching behind. Sand or red-rock formation in foreground, distant mesa or dune horizon behind. Subject in flowing or adventure wardrobe. Heat haze on horizon.',
  lighting_recipe:
    'Warm low-angle golden-hour sun illuminating face, long shadow cast, cool blue desert sky ambient, dust haze softening distance. Painterly Western light.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, slightly low angle, sun flare optional, sharp foreground texture.',
  sensory_anchor_keys: ['long_shadow', 'heat_haze', 'golden_hour_warmth', 'dust_atmosphere'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'forest', 'snow', 'rain'],
  banner_caption_template: 'I imagined you in {place}. The sun was setting.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'interior',
  composition_brief:
    'Medium-close 3/4 framing in warm cozy interior — library, fireplace nook, or window seat. Subject at left or right third in warm tungsten light. Books, candles, or decorative shelving softly out of focus behind. Subject in soft cozy wardrobe. Window light optional.',
  lighting_recipe:
    'Warm tungsten key from one side, soft cool window-light fill from another, candle-flicker accent, atmospheric haze from fireplace or steam. Vermeer-inspired interior light.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, eye-level, soft warm bokeh, slight low angle for comfort.',
  sensory_anchor_keys: ['warm_tungsten', 'fireplace_flicker', 'window_light_pool', 'soft_atmosphere'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'outdoor', 'mountain', 'beach'],
  banner_caption_template: 'I imagined you in {place}. The fire was lit.',
  forced_vibe_key: 'cozy',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'architectural',
  composition_brief:
    'Medium-close 3/4 framing inside or before a monumental sacred space — cathedral, palace hall, ruins. Subject at left or right third dwarfed slightly by vertical scale of architecture. Beam-of-light shaft cutting from above through dust or incense. Weathered stone textures.',
  lighting_recipe:
    'Dramatic vertical beams of warm light cutting through cool stone-shadow, subject illuminated by indirect bounce, atmospheric dust catching light shafts. Painterly Renaissance light tradition.',
  camera_recipe:
    '50mm equivalent, slight low angle to emphasize architectural scale, shallow depth of field, sharp face.',
  sensory_anchor_keys: ['light_shafts', 'dust_in_beams', 'weathered_stone', 'verticality'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'modern street', 'tropical'],
  banner_caption_template: 'I imagined you within {place}. The light fell from above.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'garden',
  composition_brief:
    'Medium-close 3/4 framing in lush flowering garden — cherry blossoms, rose bowers, conservatory greenery. Subject at left or right third surrounded by layered foliage and blooms. Petals drifting through air. Foreground bloom soft-focus, midground subject sharp, background depth of more flora.',
  lighting_recipe:
    'Soft sun through canopy, warm dappled light, gentle bloom on petals, cool shadow ambient. Impressionist garden light.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, eye-level, soft floral bokeh, dreamy bloom.',
  sensory_anchor_keys: ['drifting_petals', 'dappled_garden_light', 'lush_foliage', 'soft_bloom'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'desert', 'snow', 'industrial'],
  banner_caption_template: 'I imagined you in {place}. The petals were drifting.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'aquatic',
  composition_brief:
    'Medium-close 3/4 framing partially submerged or in shallow water — at the surface, in a glowing aquarium, or near a magical lagoon. Subject at left or right third with water refraction and bubble streams. Bioluminescent or sun-through-water lighting.',
  lighting_recipe:
    'Water-refraction light patterns, bioluminescent or sun-through-water glow, cool blue-green ambient, warm key from above water surface. Aquatic dream-lighting.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, eye-level near water surface, refraction bloom, bubble particles.',
  sensory_anchor_keys: ['water_refraction', 'bubble_streams', 'bioluminescent_glow', 'aquatic_blue_green'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'desert', 'mountain peak', 'urban street'],
  banner_caption_template: 'I imagined you in {place}. The light came through the water.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'portrait',
  location_class: 'sky_cosmic',
  composition_brief:
    'Medium-close 3/4 framing against an impossible cosmic or sky-scale backdrop — nebula, floating island edge, alien-world horizon. Subject at left or right third with cosmic glow rim-lighting them. Starfield, aurora, or nebula soft behind. Subject in mythic or futuristic wardrobe.',
  lighting_recipe:
    'Cosmic rim light from nebula or aurora, deep cool ambient with star-glow accents, dramatic atmospheric depth. Sci-fi wonder lighting.',
  camera_recipe:
    '50mm equivalent, shallow depth of field, eye-level or slight low angle, soft star bokeh.',
  sensory_anchor_keys: ['cosmic_rim_light', 'starfield_depth', 'aurora_glow', 'celestial_atmosphere'],
  allowed_mediums: SAFE_PORTRAIT_MEDIUMS,
  allowed_object_classes: PORTRAIT_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'city street', 'forest', 'beach'],
  banner_caption_template: 'I imagined you out beyond {place}. The stars caught you.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

// ────────────────────────────────────────────────────────────────────
// VISTA × ___ — epic-tiny figure inside vast scene (no face-swap)
// ────────────────────────────────────────────────────────────────────

CELLS.push({
  persona: 'vista',
  location_class: 'base',
  composition_brief:
    'Wide epic landscape with a small distant figure as scale anchor at lower-third. Vast environment dominates the frame. Atmospheric depth from foreground through midground to background. Cinematic painterly composition.',
  lighting_recipe:
    'Dramatic painterly light — warm key from one side, atmospheric haze in midground, cool ambient depth in background. Romanticism painted-landscape tradition.',
  camera_recipe:
    'Wide angle, deep depth of field, slightly elevated angle, layered foreground/midground/background, atmospheric perspective.',
  sensory_anchor_keys: ['atmospheric_haze', 'painterly_brushwork', 'epic_scale', 'layered_depth'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: COMMON_BANNED,
  banner_caption_template: 'A place I imagined for you.',
  forced_vibe_key: 'epic',
  is_base_fallback: true,
});

CELLS.push({
  persona: 'vista',
  location_class: 'urban',
  composition_brief:
    'Sweeping cityscape from elevated vantage at golden hour or blue hour. Tiny silhouette figure on a rooftop or fire escape at lower-third for scale. Skyline stretching to horizon. Atmospheric haze and city glow. Painterly cinematic vista.',
  lighting_recipe:
    'Golden-hour or blue-hour cinematic light, city-glow ambient warmth, atmospheric haze softening distance. Painterly skyline tradition.',
  camera_recipe:
    'Wide angle, deep depth of field, elevated overlook angle, layered urban depth.',
  sensory_anchor_keys: ['atmospheric_haze', 'city_glow', 'epic_scale', 'silhouette_anchor'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'forest', 'meadow', 'mountain peak'],
  banner_caption_template: 'A vision of {place} I painted for you.',
  forced_vibe_key: 'cinematic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'coastal',
  composition_brief:
    'Vast seascape at golden hour with tiny silhouette figure on cliff or shore at lower-third for scale. Crashing waves in foreground, stretching ocean to horizon. Atmospheric salt-air haze, sun-flare bloom. Painterly Turner-tradition vista.',
  lighting_recipe:
    'Warm low-angle golden-hour sun, sun-flare softening sea, cool blue ambient on water, painterly atmosphere. Turner / Aivazovsky maritime light.',
  camera_recipe:
    'Wide angle, deep depth of field, slightly elevated, layered foreground waves through midground sea to horizon.',
  sensory_anchor_keys: ['sea_spray_haze', 'sun_flare', 'crashing_wave', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'forest', 'mountain peak', 'urban street'],
  banner_caption_template: 'I painted you a horizon at {place}.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'forest',
  composition_brief:
    'Vast forest landscape with tiny figure on mossy path at lower-third for scale. Towering trees fading into atmospheric depth, god rays piercing canopy in midground. Layered green tones from foreground ferns to background mist. Painterly enchanted-forest vista.',
  lighting_recipe:
    'God-rays through canopy, warm dappled forest light, cool atmospheric mist in distance. Studio Ghibli forest light.',
  camera_recipe:
    'Wide angle, deep depth of field, low elevated angle showing figure against towering trees, atmospheric perspective.',
  sensory_anchor_keys: ['god_rays', 'dust_motes', 'forest_mist', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'city', 'beach', 'desert'],
  banner_caption_template: 'I painted {place} for you.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'mountain',
  composition_brief:
    'Vast alpine landscape with tiny figure on a ridge at lower-third for scale. Snow-capped peaks stretching to horizon, glacier or alpine lake in midground. Atmospheric haze softening distant ranges. Painterly Bierstadt-tradition vista.',
  lighting_recipe:
    'Warm low-angle sun illuminating peaks, cool blue alpine shadows, atmospheric mountain haze. Bierstadt / Hudson River School light.',
  camera_recipe:
    'Wide angle, deep depth of field, slightly elevated, layered ridges into atmospheric distance.',
  sensory_anchor_keys: ['atmospheric_haze', 'distant_peaks', 'alpine_clarity', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'tropical', 'beach', 'urban'],
  banner_caption_template: 'I painted you a view from {place}.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'desert',
  composition_brief:
    'Vast desert landscape with tiny figure on a dune or rock formation at lower-third for scale. Endless sand, mesa, or red-rock to horizon. Long shadow stretching from figure. Heat haze softening distance. Painterly Western vista.',
  lighting_recipe:
    'Warm golden-hour sun, long shadow stretching across sand, cool blue desert sky, dust haze softening distance. Painterly Western light.',
  camera_recipe:
    'Wide angle, deep depth of field, slightly elevated, layered dunes or rock to horizon.',
  sensory_anchor_keys: ['long_shadow', 'heat_haze', 'golden_hour_warmth', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'forest', 'snow', 'rain'],
  banner_caption_template: 'I painted {place} for you. The sun was low.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'interior',
  composition_brief:
    'Vast lavish interior space — grand library, ballroom, conservatory hall — with tiny figure for scale at lower-third. Towering bookshelves, chandeliers, tall windows with light streaming. Layered architectural depth. Painterly interior vista.',
  lighting_recipe:
    'Warm tungsten key, cool window-light beams, atmospheric dust catching shafts, painterly Vermeer interior light.',
  camera_recipe:
    'Wide angle, deep depth of field, slightly low angle for grandeur, layered architectural depth.',
  sensory_anchor_keys: ['light_shafts', 'dust_in_beams', 'warm_tungsten', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'outdoor', 'beach', 'mountain'],
  banner_caption_template: 'I painted {place} for you.',
  forced_vibe_key: 'cozy',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'architectural',
  composition_brief:
    'Vast monumental architecture — cathedral, ruins, palace courtyard — with tiny figure at lower-third for scale dwarfed by vertical mass. Beams of light cutting through to floor. Weathered stone, columns, vaulted ceilings. Painterly architectural vista.',
  lighting_recipe:
    'Dramatic vertical light beams, warm bounce on stone, cool shadow ambient, atmospheric dust catching beams. Painterly Renaissance interior tradition.',
  camera_recipe:
    'Wide angle, low angle emphasizing vertical scale, deep depth of field, atmospheric depth.',
  sensory_anchor_keys: ['light_shafts', 'weathered_stone', 'verticality', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'modern street', 'tropical'],
  banner_caption_template: 'I painted you a glimpse of {place}.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'garden',
  composition_brief:
    'Vast lush garden landscape — flowering meadow, conservatory, blossom-laden grove — with tiny figure on path at lower-third for scale. Layered floral depth from foreground bloom to misty distance. Painterly Impressionist vista.',
  lighting_recipe:
    'Soft sun through canopy, warm dappled light, gentle floral bloom, atmospheric mist softening distance. Monet garden light.',
  camera_recipe:
    'Wide angle, deep depth of field, eye-level path angle, soft floral atmosphere.',
  sensory_anchor_keys: ['drifting_petals', 'dappled_garden_light', 'lush_foliage', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'desert', 'snow', 'industrial'],
  banner_caption_template: 'I painted you a walk through {place}.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'aquatic',
  composition_brief:
    'Vast underwater or surface-water landscape — coral reef, lagoon, abyssal city — with tiny diver or boat at lower-third for scale. Light shafts piercing water. Bioluminescent or sun-filtered glow. Layered aquatic depth. Painterly underwater vista.',
  lighting_recipe:
    'Sun shafts through water surface, bioluminescent or refracted glow, cool blue-green ambient, warm accents on coral or surface life. Painterly aquatic light.',
  camera_recipe:
    'Wide angle, deep depth of field, eye-level mid-water, sun-shaft beams, particle haze.',
  sensory_anchor_keys: ['water_refraction', 'sun_shafts', 'bioluminescent_glow', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'desert', 'mountain peak', 'urban street'],
  banner_caption_template: 'I painted {place} for you.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'vista',
  location_class: 'sky_cosmic',
  composition_brief:
    'Vast cosmic or sky-scale vista — nebula, floating-island chain, alien-world horizon, starfield — with tiny figure or ship at lower-third for scale. Impossible scale, dreamlogic perspective. Layered cosmic depth. Painterly sci-fi vista.',
  lighting_recipe:
    'Cosmic glow from nebula or aurora, star-glow accents, deep cool ambient, painterly atmospheric depth. Painterly sci-fi space-art tradition.',
  camera_recipe:
    'Wide angle, deep depth of field, dramatic cosmic perspective, layered scale.',
  sensory_anchor_keys: ['cosmic_glow', 'starfield_depth', 'aurora_glow', 'epic_scale'],
  allowed_mediums: SAFE_VISTA_MEDIUMS,
  allowed_object_classes: [],
  banned_phrases: [...COMMON_BANNED, 'city street', 'forest path', 'beach'],
  banner_caption_template: 'I painted you a glimpse of {place}.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

// ────────────────────────────────────────────────────────────────────
// COUPLE × ___ — dual face-swap, intimate side-by-side
// ────────────────────────────────────────────────────────────────────
// Couple cells force composition='character' and dispatch through the
// 7-layer dual face-swap pipeline. Subjects MUST be side-by-side
// (left-third + right-third) — center contact / kissing / hugging
// CANNOT face-swap because dualFaceSwap crops the frame in half.

const COUPLE_BASE_RULES =
  'Both subjects waist-up, side-by-side composition (subject 1 in left third, subject 2 in right third), both angled three-quarter toward viewer like a candid movie still. NEVER center contact, NEVER kissing/hugging/piggyback (face-swap crops the frame in half — center contact breaks). Both faces fully visible and well-lit. Stationary side-by-side body language.';

CELLS.push({
  persona: 'couple',
  location_class: 'base',
  composition_brief:
    `${COUPLE_BASE_RULES} Atmospheric depth behind. Painterly cinematic framing.`,
  lighting_recipe:
    'Cinematic warm key catching both faces, soft cool fill from opposite side, painterly atmospheric haze. Movie-poster lighting.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, both characters filling the frame, sharp face realism.',
  sensory_anchor_keys: ['atmospheric_haze', 'warm_rim_light', 'painterly_brushwork'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'embrace'],
  banner_caption_template: 'I imagined you both here. The light loved you.',
  forced_vibe_key: 'cinematic',
  is_base_fallback: true,
});

CELLS.push({
  persona: 'couple',
  location_class: 'urban',
  composition_brief:
    `${COUPLE_BASE_RULES} Wet city street at golden-to-blue hour transition behind them. Distant skyline glow, neon bokeh softly out of focus.`,
  lighting_recipe:
    'Warm neon rim from one side + cool ambient from the other, wet-pavement reflection, atmospheric steam haze. Both faces caught in warm key.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, neon bokeh background, anamorphic flare.',
  sensory_anchor_keys: ['wet_pavement_reflection', 'neon_bokeh', 'drifting_steam', 'atmospheric_haze'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'forest', 'mountain'],
  banner_caption_template: 'I put you both in {place}. The neon caught you.',
  forced_vibe_key: 'cinematic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'coastal',
  composition_brief:
    `${COUPLE_BASE_RULES} Golden-hour shore behind them, ocean stretching to horizon, sea spray haze, gentle wave foreground.`,
  lighting_recipe:
    'Warm low-angle golden sun catching both faces, sun-flare bloom, cool sea-spray ambient. Painterly Mediterranean light.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, sun flare bloom.',
  sensory_anchor_keys: ['sea_spray_haze', 'golden_hour_warmth', 'sun_flare', 'salt_atmosphere'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'forest', 'urban'],
  banner_caption_template: 'I put you both at {place}. The waves were quiet.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'forest',
  composition_brief:
    `${COUPLE_BASE_RULES} Dappled god-rays through canopy behind them, mossy clearing, dust motes catching light beams.`,
  lighting_recipe:
    'God-rays through canopy, warm dappled key catching both faces, cool forest-shadow ambient, dust motes suspended.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, soft forest bokeh.',
  sensory_anchor_keys: ['god_rays', 'dust_motes', 'mossy_foreground', 'dappled_warmth'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'city', 'desert'],
  banner_caption_template: 'I imagined you both in {place}. The light came through.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'mountain',
  composition_brief:
    `${COUPLE_BASE_RULES} High alpine ridge behind them, breath visible in cold air, distant peaks fading into haze.`,
  lighting_recipe:
    'Warm low-angle alpine sun catching both faces from one side, cold blue ambient fill, snow-mist haze.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, alpine clarity, soft mountain backdrop.',
  sensory_anchor_keys: ['breath_in_cold_air', 'alpine_clarity', 'distant_peaks', 'cold_warmth_contrast'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'tropical', 'beach'],
  banner_caption_template: 'I imagined you both at {place}. The air was thin.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'desert',
  composition_brief:
    `${COUPLE_BASE_RULES} Vast desert behind them at golden hour, long shadows stretching, distant mesa or dune horizon.`,
  lighting_recipe:
    'Warm low-angle golden sun catching both faces, long parallel shadows, dust haze, cool sky ambient.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, slightly low angle for hero stance.',
  sensory_anchor_keys: ['long_shadow', 'heat_haze', 'golden_hour_warmth', 'dust_atmosphere'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'forest', 'snow'],
  banner_caption_template: 'I imagined you both in {place}. The sun was setting.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'interior',
  composition_brief:
    `${COUPLE_BASE_RULES} Warm cozy interior behind them — fireplace, library nook, cafe window — soft tungsten ambient.`,
  lighting_recipe:
    'Warm tungsten key from one side catching both faces, cool window-light fill from another, candle flicker accent.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, soft warm bokeh.',
  sensory_anchor_keys: ['warm_tungsten', 'fireplace_flicker', 'window_light_pool', 'soft_atmosphere'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'outdoor', 'mountain'],
  banner_caption_template: 'I imagined you both in {place}. The fire was lit.',
  forced_vibe_key: 'cozy',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'architectural',
  composition_brief:
    `${COUPLE_BASE_RULES} Monumental sacred space behind them — cathedral, palace hall, ruins. Beams of light cutting through stone.`,
  lighting_recipe:
    'Dramatic vertical beams of warm light catching both faces, cool stone-shadow ambient, atmospheric dust catching beams.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, slight low angle emphasizing scale.',
  sensory_anchor_keys: ['light_shafts', 'dust_in_beams', 'weathered_stone', 'verticality'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'modern street'],
  banner_caption_template: 'I imagined you both in {place}. The light fell from above.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'garden',
  composition_brief:
    `${COUPLE_BASE_RULES} Lush flowering garden behind them — cherry blossoms, rose bowers, conservatory greenery. Petals drifting.`,
  lighting_recipe:
    'Soft sun through canopy, warm dappled key catching both faces, gentle floral bloom, cool shadow ambient.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, soft floral bokeh.',
  sensory_anchor_keys: ['drifting_petals', 'dappled_garden_light', 'lush_foliage', 'soft_bloom'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'desert', 'snow'],
  banner_caption_template: 'I imagined you both in {place}. The petals drifted.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'aquatic',
  composition_brief:
    `${COUPLE_BASE_RULES} Aquarium glow, lagoon shore, or surface of magical water behind them. Refracted blue-green light, bubble streams.`,
  lighting_recipe:
    'Water-refraction light patterns catching both faces, bioluminescent or sun-through-water glow, cool blue-green ambient.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, refraction bloom.',
  sensory_anchor_keys: ['water_refraction', 'bubble_streams', 'bioluminescent_glow', 'aquatic_blue_green'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'desert', 'mountain'],
  banner_caption_template: 'I imagined you both in {place}. The light came through the water.',
  forced_vibe_key: 'ethereal',
  is_base_fallback: false,
});

CELLS.push({
  persona: 'couple',
  location_class: 'sky_cosmic',
  composition_brief:
    `${COUPLE_BASE_RULES} Cosmic vista behind them — nebula, floating island edge, alien horizon. Star glow, aurora.`,
  lighting_recipe:
    'Cosmic rim light catching both faces, deep cool ambient with star-glow accents, dramatic atmospheric depth.',
  camera_recipe:
    '50mm equivalent, medium-shot waist-up, eye-level, soft star bokeh.',
  sensory_anchor_keys: ['cosmic_rim_light', 'starfield_depth', 'aurora_glow', 'celestial_atmosphere'],
  allowed_mediums: SAFE_COUPLE_MEDIUMS,
  allowed_object_classes: COUPLE_OBJECTS,
  banned_phrases: [...COMMON_BANNED, 'kissing', 'hugging', 'piggyback', 'city street', 'forest'],
  banner_caption_template: 'I imagined you both beyond {place}. The stars caught you.',
  forced_vibe_key: 'epic',
  is_base_fallback: false,
});

// ── Main ──────────────────────────────────────────────────────────────

async function main() {
  console.log('━━━ seed-first-dream-cells ━━━');
  console.log(`  DRY_RUN: ${DRY_RUN}`);
  console.log(`  Cells to seed: ${CELLS.length}`);
  console.log('');

  // Verify expected count
  if (CELLS.length !== 33) {
    console.error(`Expected 33 cells (3 personas × 10 location classes + 3 base), got ${CELLS.length}`);
    process.exit(1);
  }

  // Verify uniqueness
  const seen = new Set();
  for (const c of CELLS) {
    const key = `${c.persona}:${c.location_class}`;
    if (seen.has(key)) {
      console.error(`Duplicate cell: ${key}`);
      process.exit(1);
    }
    seen.add(key);
  }
  console.log('✓ 33 unique (persona, location_class) cells');

  // Verify every persona has every location class + base
  const expectedClasses = [
    'base', 'urban', 'coastal', 'forest', 'mountain', 'desert',
    'interior', 'architectural', 'garden', 'aquatic', 'sky_cosmic',
  ];
  for (const persona of ['portrait', 'vista', 'couple']) {
    for (const cls of expectedClasses) {
      if (!seen.has(`${persona}:${cls}`)) {
        console.error(`Missing cell: ${persona}:${cls}`);
        process.exit(1);
      }
    }
  }
  console.log('✓ Every persona × location_class covered');

  if (DRY_RUN) {
    console.log('\n(Re-run with --execute to upsert.)');
    return;
  }

  // Upsert all cells
  const { error } = await sb.from('first_dream_cells').upsert(CELLS, {
    onConflict: 'persona,location_class',
  });
  if (error) {
    console.error('Upsert failed:', error.message);
    process.exit(1);
  }
  console.log(`✓ Seeded ${CELLS.length} cells`);
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
