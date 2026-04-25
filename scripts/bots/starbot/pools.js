/**
 * StarBot — axis pools. All Sonnet-seeded 50-entry pools.
 * Regenerate: node scripts/gen-seeds/starbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8'));
}

// ─────────────────────────────────────────────────────────────
// CYBORG-WOMAN POOLS (hand-curated, stable)
// ─────────────────────────────────────────────────────────────

const CYBORG_SKIN_TONES = [
  // Human tones
  'deep ebony brown skin with rich mahogany undertones, warm and matte',
  'dark cocoa skin with red-brown undertones, velvety finish',
  'warm umber brown skin, golden undertones catching rim light',
  'mid-toned sepia brown skin, terracotta undertones',
  'olive-tan Mediterranean skin with warm honey undertones',
  'golden-tawny South Asian skin with warm sienna undertones',
  'warm porcelain East-Asian skin with peach undertones',
  'sunburned desert-tan skin, copper-warm and weathered',
  'light beige skin with cool rose undertones',
  'freckled alabaster skin with rose-pink undertones',
  'deep bronze skin with warm copper undertones, luminous finish',
  'cool-toned ivory skin with blue-pink undertones, porcelain smooth',
  'warm caramel skin with amber undertones, sun-kissed glow',
  'pale Nordic skin with cool silvery undertones, almost translucent',
  'rich chestnut-brown skin with warm gold undertones, satin finish',
  // Alien tones
  'soft fuchsia-pink alien skin, smooth and glossy like petals',
  'moss-green alien skin with deeper jade speckling across the cheekbones',
  'jet-black alien skin absorbing light like velvet, no reflection',
  'ashen gray alien skin with charcoal micro-veining, matte stone finish',
  'translucent pale-lavender alien skin with blood vessels faintly visible',
  'icy robin-egg blue alien skin with white frost bloom across the cheeks',
  'deep wine-purple alien skin with indigo shadow gradients',
  'iridescent shifting-hue alien skin (copper-to-teal gradient depending on angle)',
  'obsidian-black alien skin with sparse constellations of bioluminescent freckles',
  'warm terracotta-red alien skin with ochre undertones, desert-creature energy',
  'pale-gold alien skin with a fine subdermal shimmer, like buttered chrome',
  'seafoam green alien skin with opalescent micro-scales across the temples',
  'deep cobalt-blue alien skin with violet undertones, cool and matte',
  'coral-pink alien skin with warm peach undertones, soft matte finish',
  'slate-gray alien skin with silver micro-flecking, polished stone texture',
  'emerald-green alien skin with darker veining across the jawline',
  'plum-purple alien skin with warm magenta undertones, rich and deep',
  'pale cerulean alien skin with white frost patterns near the temples',
  'burnt-orange alien skin with rust-red undertones, matte and warm',
  'midnight-blue alien skin with faint star-like pinpoints across cheekbones',
  'pearl-white alien skin with rainbow-shifting undertones, luminous finish',
  'deep jade alien skin with cool blue undertones, smooth and matte',
  'storm-gray alien skin with violet lightning-vein patterns, matte finish',
  'copper-rose alien skin with metallic warmth, brushed-metal sheen',
  'bone-white alien skin with cool ivory undertones, ancient and matte',
  'dark teal alien skin with cyan undertones, deep ocean-creature energy',
  'soft lilac alien skin with pink undertones, powdery matte finish',
  'crimson-red alien skin with deep burgundy undertones, warm and rich',
  'silver-chrome alien skin with cool blue reflections, mirror-like patches',
  'dusty-rose alien skin with warm mauve undertones, desert-bloom softness',
  'forest-green alien skin with brown undertones, bark-like matte texture',
  'ice-white alien skin with pale blue undertones, frosted crystal finish',
  'amber-gold alien skin with warm honey glow, sun-soaked warmth',
  'void-black alien skin with shifting oil-slick iridescence at the edges',
  'pale mint-green alien skin with cool silver undertones, dewy and calm',
];

const CYBORG_HAIR_STYLES = [
  'platinum braids floating weightlessly',
  'holographic fiber optic hair streaming upward',
  'crystalline glass hair refracting light',
  'molten violet hair tendrils drifting',
  'silver plasma hair defying gravity',
  'long flowing white hair lifted by unseen wind',
  'electric teal hair spilling over chrome shoulder plates',
  'copper wire tendrils sparking with energy',
  'jet-black razor-cut asymmetric bob with chrome underlayer',
  'deep crimson waves cascading over exposed shoulder servos',
  'buzzcut with holographic scalp tattoo circuitry visible',
  'ash-blonde cornrows threaded with glowing fiber-optic strands',
];

const CYBORG_BODY_TYPES = [
  'voluptuous hourglass build, full bust, narrow waist, wide curvy hips — bombshell silhouette',
  'thick curvy athletic build, broad shoulders, strong mechanical thighs, full chest — powerful and sexy',
  'tall amazonian build, 6-foot frame, long mechanical legs, athletic shoulders — statuesque and commanding',
  'short petite build, 5-foot frame, compact curves, generous bust for her size — small and devastating',
  'lean athletic runway build, long limbs, subtle curves, narrow hips — elegant and sharp',
  'pear-shaped build, slim upper torso, wide voluptuous hips and thick mechanical thighs — weighty and sexy',
  'stacked bombshell build — full bust, cinched waist, lush curvy hips, dramatic hourglass silhouette',
  'athletic curvy build with visible muscle definition under soft skin, sculpted mechanical abs — gym-goddess cyborg',
  'slim-thicc build — slender waist and shoulders, unexpectedly thick hips and curvy thighs',
  'tall willowy build, subtle breast shaping, narrow hips, long mechanical limbs — androgynous cyborg beauty',
];

const CYBORG_EYE_STYLES = [
  'luminous violet eyes with triple irises',
  'electric cyan eyes radiating inner light',
  'amber plasma eyes burning with intensity',
  'opalescent eyes with shifting pupils',
  'molten gold eyes with mechanical iris shutters',
  'sapphire eyes with visible neural threading',
  'holographic eyes displaying data streams',
  'blood-crimson eyes with pinpoint targeting reticles',
  'pale mercury-silver eyes reflecting like mirrors',
  'deep emerald eyes with bioluminescent ring around the pupil',
];

const CYBORG_INTERNAL_EXPOSURE = [
  'one cheek panel slightly lifted like a hinged hatch, revealing spinning brass micro-gears and a pulsing plasma core inside her skull',
  'a transparent observation-window section on her temple exposing the circuit board beneath, data streams visibly scrolling',
  'a visible service seam along her jaw partially open showing bundles of fiber-optic nerve cables glowing inside',
  'one of her eyes is a clearly visible mechanical iris aperture — tiny servos and focus rings visible around the orbit, pulsing LEDs deep inside',
  'one side of her forehead opened like a maintenance panel, exposing pulsing liquid-coolant lines and a central glowing reactor core',
  'a glass observation window built into her neck showing the rotating mechanism of internal vertebrae, circuitry flashing behind it',
  'a diagnostic port at her collarbone is open with a wisp of internal plasma visible, fiber-optic filaments spilling out like thin glowing tendrils',
  'her torso is translucent — mechanical structure inside and a glowing core at center-chest, softly visible through the clear skin',
  'most of her chest and abdomen read as clear polymer, the internal mechanisms and glowing heart-light showing through like a museum display',
  'translucent skin across her front exposes the quiet architecture of her inner workings and the steady glow of her core',
  'her sternum and belly glow softly from within — a translucent shell over mechanical structure, the internal light washing outward',
  'wide portions of her body are translucent, internal workings visible in soft dreamy detail — not anatomy, but a gorgeous reveal',
  'a long transparent strip running from throat to navel showing spinning gyroscopes, pulsing conduits, and a reactor core',
  'both forearms are fully transparent acrylic, every tendon-cable and hydraulic line visible, fingers trailing faint light',
  'her rib cage is open chrome latticework, the power core visible between the gaps like a caged star',
];

const CYBORG_GLOW_COLORS = load('cyborg_glow_colors');

const VIBE_COLOR = {
  cinematic: 'teal-and-orange sci-fi cinematic grade, deep shadows, luminous highlights',
  dark: 'oil-black dominant, single nebula-glow accent, stark void',
  epic: 'dramatic cosmic god-rays, rich indigo-and-gold, heroic scale palette',
  nostalgic: 'faded 70s-sci-fi palette, muted copper, warm-amber control panels',
  psychedelic: 'impossible magenta-violet nebula hues, hallucinatory cosmic shifts',
  peaceful: 'soft pastel nebula-pinks, gentle luminous calm, tranquil space',
  ethereal: 'pearl-white cosmic mist, opalescent space-gas, luminous pale tones',
  arcane: 'deep violet nebula, emerald spacedust, mystical cosmic hues',
  ancient: 'weathered bronze + deep-copper, sepia-sunset palette',
  enchanted: 'soft magical nebula glow, dreamy lavender-and-blue cosmic',
  fierce: 'stark crimson-and-obsidian, savage solar flare contrast',
  coquette: 'soft pastel nebula-pink + cream (rare for StarBot, soft edge)',
  voltage: 'electric blue plasma, neon cyberpunk accents, stark contrast',
  nightshade: 'deep violet void with silver starfield, plum-shadow palette',
  macabre: 'inked blood-crimson cosmic-dread, dark-nebula palette',
  shimmer: 'shimmering starlight + iridescent cosmic-dust highlights',
  surreal: 'impossible cosmic color pairings, hallucinatory space shifts',
};

module.exports = {
  // Cyborg-woman pools (hand-curated)
  CYBORG_SKIN_TONES,
  CYBORG_HAIR_STYLES,
  CYBORG_BODY_TYPES,
  CYBORG_EYE_STYLES,
  CYBORG_INTERNAL_EXPOSURE,
  CYBORG_GLOW_COLORS,
  // Cyborg-woman pools (Sonnet-seeded)
  CYBORG_CHARACTERS: load('cyborg_characters'),
  CYBORG_FEATURES: load('cyborg_features'),
  CYBORG_ACTIONS: load('cyborg_actions'),
  CYBORG_CLOSEUP_FRAMINGS: load('cyborg_closeup_framings'),
  // Scene pools
  COSMIC_PHENOMENA: load('cosmic_phenomena'),
  COSMIC_ANCHORS: load('cosmic_anchors'),
  MEGASTRUCTURES: load('megastructures'),
  ALIEN_LANDSCAPES: load('alien_landscapes'),
  SPACE_OPERA_SCENES: load('space_opera_scenes'),
  SCI_FI_INTERIORS: load('sci_fi_interiors'),
  COZY_SCI_FI_INTERIORS: load('cozy_sci_fi_interiors'),
  ALIEN_CITIES: load('alien_cities'),
  ROBOT_TYPES: load('robot_types'),
  TRANQUIL_MOMENTS: load('tranquil_moments'),
  REAL_SPACE_SUBJECTS: load('real_space_subjects'),
  COSMIC_ORACLE_CHARACTERS: load('cosmic_oracle_characters'),
  COSMIC_ORACLE_ACTIONS: load('cosmic_oracle_actions'),
  COSMIC_ORACLE_LOCATIONS: load('cosmic_oracle_locations'),
  FEMALE_EXPLORERS: load('female_explorers'),
  MALE_EXPLORERS: load('male_explorers'),
  SCI_FI_FEMALE_OUTFITS: load('sci_fi_female_outfits'),
  SCI_FI_MALE_OUTFITS: load('sci_fi_male_outfits'),
  SCI_FI_ACTIONS: load('sci_fi_actions'),
  ATMOSPHERES: load('atmospheres'),
  LIGHTING: load('lighting'),
  CAMERA_ANGLES: load('camera_angles'),
  CITY_CAMERA_ANGLES: load('city_camera_angles'),
  SCENE_PALETTES: load('scene_palettes'),
  VIBE_COLOR,
};
