/**
 * VenusBot — axis pools.
 *
 * Two sources:
 *   (a) Hand-curated (inline) — the small, stable diversity axes. Change
 *       rarely, easier to review as code diffs.
 *   (b) Sonnet-authored (loaded from seeds/*.json at require time) — the
 *       50-entry pools generated in batches via gen-seeds/venusbot/.
 *       Regenerate via `node scripts/gen-seeds/venusbot/gen-<name>.js`.
 *
 * Dedup windows are set at pick-time in index.js + paths, not here.
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8')
  );
}

// ─────────────────────────────────────────────────────────────
// HAND-CURATED AXES (small, stable)
// ─────────────────────────────────────────────────────────────

// SKIN TONES — the organic side of the cyborg. Diverse across human
// ethnicities + alien species.
const SKIN_TONES = [
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
];

const HAIR_STYLES = [
  'platinum braids floating weightlessly',
  'holographic fiber optic hair streaming upward',
  'crystalline glass hair refracting light',
  'molten violet hair tendrils drifting',
  'silver plasma hair defying gravity',
  'long flowing white hair lifted by unseen wind',
  'electric teal hair spilling over chrome shoulder plates',
  'copper wire tendrils sparking with energy',
];

const BODY_TYPES = [
  'voluptuous hourglass build with full heavy bust, narrow waist, wide curvy hips — bombshell silhouette',
  'thick curvy athletic build, broad shoulders, strong mechanical thighs, full chest, soft stomach — powerful and sexy',
  'tall amazonian build, 6-foot frame, long mechanical legs, athletic shoulders, firm medium-full bust — statuesque and commanding',
  'short petite build, 5-foot frame, compact curves, generous bust for her size, softly rounded hips — small and devastating',
  'lean athletic runway build, long limbs, subtle curves, small firm bust, narrow hips — elegant and sharp',
  'pear-shaped build with slim upper torso, small-medium bust, wide voluptuous hips and thick mechanical thighs — weighty and sexy',
  'apple-shaped build with full chest and shoulders, soft rounded midsection, slimmer legs — top-heavy bombshell energy',
  'stacked bombshell build — enormous full bust, cinched waist, lush curvy hips, dramatic hourglass silhouette',
  'athletic curvy build with visible muscle definition under soft skin, medium-full bust, sculpted mechanical abs — gym-goddess cyborg',
  'slim-thicc build — slender waist and shoulders, unexpectedly thick hips and curvy thighs, full medium bust',
  'tall willowy build, flat-chested with subtle breast shaping, narrow hips, long mechanical limbs — androgynous cyborg beauty',
  'plus-size voluptuous build, fully curvy body, soft full bust, rounded hips and thighs, confident fuckable silhouette',
];

const EYE_STYLES = [
  'luminous violet eyes with triple irises',
  'electric cyan eyes radiating inner light',
  'amber plasma eyes burning with intensity',
  'opalescent eyes with shifting pupils',
  'molten gold eyes with mechanical iris shutters',
  'sapphire eyes with visible neural threading',
  'holographic eyes displaying data streams',
];

// INTERNAL EXPOSURE — translucent-body reveal. Mix of small-window +
// whole-torso variants. Small enough + stable enough to stay inline.
const INTERNAL_EXPOSURE = [
  'one cheek panel slightly lifted like a hinged hatch, revealing spinning brass micro-gears and a pulsing amber plasma core inside her skull',
  'a transparent observation-window section on her temple exposing the circuit board beneath, data streams visibly scrolling across it in real time',
  'a visible service seam along her jaw partially open showing bundles of fiber-optic nerve cables glowing turquoise inside',
  'one of her eyes is a clearly visible mechanical iris aperture — tiny servos and focus rings visible around the orbit, pulsing LEDs deep inside',
  'one side of her forehead opened like a maintenance panel, exposing pulsing liquid-coolant lines and a central glowing reactor core',
  'a glass observation window built into her neck showing the rotating mechanism of internal vertebrae processing, circuitry flashing behind it',
  'one ear housing is open and exposed, showing intricate brass resonance chambers, copper wire bundles, and tiny LEDs winking inside',
  'a diagnostic port at her collarbone is open with a wisp of internal plasma visible, fiber-optic filaments spilling out like thin glowing tendrils',
  'her torso is translucent — you can see the mechanical structure inside and a glowing core at center-chest, softly visible through the clear skin',
  'most of her chest and abdomen read as clear polymer, the internal mechanisms and glowing heart-light showing through like something seen in a beautiful museum display',
  'translucent skin across her front exposes the quiet architecture of her inner workings and the steady glow of her core, rendered with museum-piece restraint',
  'her sternum and belly glow softly from within — a translucent shell over mechanical structure, the internal light washing outward',
  'her body has an almost-translucent quality across her torso — gentle hints of internal structure visible, the pulsing inner glow more felt than seen',
  'her chest is see-through in a subtle way — the internal mechanism glows through the clear skin like a lantern through paper',
  'wide portions of her body are translucent, and the internal workings are visible in soft, dreamy detail — not an anatomy diagram, but a gorgeous reveal',
];

// GLOW_COLORS — dominant-glow color for the render (eyes, internal core, circuits).
const GLOW_COLORS = [
  'electric cyan',
  'molten amber / orange',
  'plasma magenta / hot pink',
  'deep violet / ultraviolet',
  'toxic acid green',
  'molten gold',
  'ice blue / arctic white',
  'blood crimson',
  'prismatic rainbow spectrum',
  'mercury silver / chrome white',
];

// SCENE_PALETTES — overall color mood of the image. Critical for avoiding
// teal/orange clustering across batches.
const SCENE_PALETTES = [
  'warm sunset gold and copper tones, burnt-orange shadows, peach highlights — all warm',
  'deep crimson and oxblood reds, black shadows, gold accent highlights — bloody and regal',
  'icy arctic whites and pale cerulean, silver highlights, fog haze, clinical cool',
  'rich amethyst and violet with magenta highlights, indigo shadows, dreamy saturated',
  'emerald forest greens with gold rim-light, deep umber shadows, nature-mystic',
  'pure monochrome black-and-white with a single crimson accent — editorial graphic',
  'dusty sepia and bone-white tones, ochre highlights, antique-film aesthetic',
  'hot neon pink and acid yellow, black shadows, cyberpunk-pop electric',
  'creamy pearl and rose-gold, soft peach atmosphere, ivory highlights — bright and luxe',
  'toxic chartreuse green with black shadows and hot-pink accents — poison-editorial',
  'molten lava orange and charcoal, ember-red highlights — volcanic warm',
  'bleached desert sand and sunbaked ochre, blue-sky negative space, hot bright',
  'deep ocean navy and teal with silver-white foam highlights — aquatic and cold',
  'champagne gold on ivory, soft rose shadows, editorial studio bright',
  'inky midnight black with moonlight silver rim-light, subtle violet undertones',
  'burgundy and mulled-wine reds with soft candlelight gold, chiaroscuro',
  'butter-yellow and cream with soft robin-blue accents — vintage sunny',
  'blood-red and raw-meat crimson against charcoal — brutal painterly',
];

// VIBE_COLOR — secondary lighting palette keyed to the render's vibe.
const VIBE_COLOR = {
  cinematic: 'teal-and-orange cinematic color grade, molten gold highlights, electric teal shadows',
  cozy: 'warm amber ambient light, deep magenta shadows, soft backlit glow',
  ancient: 'molten amber sunbeams, bronze patina surfaces, electric teal shadows',
  ethereal: 'pearl-white ambient glow, opalescent mist, prismatic sparkles',
  epic: 'dramatic god rays, molten gold, deep magenta shadows',
  psychedelic: 'kaleidoscopic color splits, impossible magentas, acid greens, electric violet',
  nostalgic: 'warm amber light, golden particles drifting, soft copper glow',
  voltage: 'electric blue arcs, neon magenta, cyan lightning',
  shimmer: 'shimmering gold particles, iridescent highlights, soft warm rim light',
  arcane: 'deep violet and emerald glows, mystical candlelight, runic shimmer',
  dark: 'inky shadows, single hard rim light, crimson accent, brutal chiaroscuro',
  fierce: 'blazing crimson and molten gold, sharp harsh highlights, explosive contrast',
  nightshade: 'deep plum and obsidian, cold moonlight silver accents, poison-purple atmosphere',
  surreal: 'impossible color pairings, dream-logic lighting, hallucinatory shifts',
  macabre: 'candlelit darkness, blood-red pools, bone-ivory highlights, death-in-flowers mood',
};

// ─────────────────────────────────────────────────────────────
// SONNET-SEEDED AXES (loaded from seeds/*.json, 30-50 entries each)
// Regenerate: node scripts/gen-seeds/venusbot/gen-<name>.js
// ─────────────────────────────────────────────────────────────

const POSES = load('poses');                         // 50 — closeup gestures
const ACTION_POSES = load('action_poses');           // 50 — full-body camera angles
const EXPRESSIONS = load('expressions');             // 50 — facial / gaze micro-tells
const CYBORG_FEATURES = load('cyborg_features');     // 50 — dominant mechanical body elements
const ENERGY_EFFECTS = load('energy_effects');       // 50 — glow/circuit/pulse effects
const ACCENT_DETAILS = load('accent_details');       // 50 — small flourishes
const ENVIRONMENTS = load('environments');           // 50 — closeup backgrounds
const MOMENTS = load('moments');                     // 50 — full-body narrative moments { kind, text }
const SEDUCTION_MOMENTS = load('seduction_moments'); // 50 — cyberpunk nightlife scenes
const WILDCARDS = load('wildcards');                 // 50 — surreal "look twice" elements
const HUMAN_TOUCH_VARIANTS = load('human_touch_variants'); // 30 — robot path sliver
// characters, makeups, cyborg_fashion_moments, stare_moments loaded by paths that use them

module.exports = {
  // Hand-curated
  SKIN_TONES,
  HAIR_STYLES,
  BODY_TYPES,
  EYE_STYLES,
  INTERNAL_EXPOSURE,
  GLOW_COLORS,
  SCENE_PALETTES,
  VIBE_COLOR,
  // Sonnet-seeded (50 entries)
  POSES,
  ACTION_POSES,
  EXPRESSIONS,
  CYBORG_FEATURES,
  ENERGY_EFFECTS,
  ACCENT_DETAILS,
  ENVIRONMENTS,
  MOMENTS,
  SEDUCTION_MOMENTS,
  WILDCARDS,
  HUMAN_TOUCH_VARIANTS,
};
