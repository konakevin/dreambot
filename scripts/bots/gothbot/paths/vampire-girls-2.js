/**
 * GothBot vampire-girls-2 — extreme macro vampire face portraits.
 *
 * Clean-slate path. The medium (vampire-portrait) is SHORT — just rendering
 * style (hyperreal, macro, wet skin). ALL character details come from pools.
 * Composition is forced via random CROP pick, not left to Sonnet.
 *
 * POOLS:
 *   - VAMPIRE_ARCHETYPES — who she is (energy/story)
 *   - FACIAL_FEATURES — bone structure / face geometry
 *   - VAMPIRE_MAKEUP — specific makeup look
 *   - HAIR_COLORS + FEMALE_HAIRSTYLES — hair
 *   - VAMPIRE_WARDROBE — hint of clothing at frame edge
 *   - VAMPIRE_CANDID_MOMENTS — micro-action
 *   - VAMPIRE_ETHNICITIES — ethnic features
 *   - VAMPIRE_EYE_COLORS — glowing iris
 *   - VAMPIRE_LIGHTING — directional light composition
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const CROPS = [
  'SINGLE EYE DOMINANT: one massive glowing eye fills 50%+ of the frame. The other eye is cropped out or lost in total shadow. We see: one huge iris + cheekbone + side of nose + edge of lips. Asymmetric, off-center.',
  'BOTH EYES FRONTAL: both glowing eyes staring directly into camera, face framed tight — forehead cropped, chin cropped. Nose between the eyes, lips at very bottom of frame. Confrontational, symmetric, unsettling.',
  'HALF-FACE SPLIT LIGHT: hard split — one half lit, other half in near-total blackness. One glowing eye visible, one invisible. Half of nose, half of lips. Dramatic chiaroscuro bisection.',
  'EXTREME LOW ANGLE: camera below her chin looking UP. Both glowing eyes looking DOWN at us. Underside of jaw, nostrils, the underlit menace of something looking down at prey.',
  'THREE-QUARTER TURN: face turned 30-40 degrees. Near eye large and glowing, far eye smaller and partially occluded by nose bridge. Cheekbone catching light. Classic portrait angle but MACRO tight.',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const crop = CROPS[Math.floor(Math.random() * CROPS.length)];
  const archetype = picker.pickWithRecency(pools.VAMPIRE_ARCHETYPES, 'vg2_archetype');
  const face = picker.pickWithRecency(pools.FACIAL_FEATURES, 'vg2_face');
  const makeup = picker.pickWithRecency(pools.VAMPIRE_MAKEUP, 'vg2_makeup');
  const hairColor = picker.pickWithRecency(pools.HAIR_COLORS, 'vg2_hair_color');
  const hairstyle = picker.pickWithRecency(pools.FEMALE_HAIRSTYLES, 'vg2_hairstyle');
  const wardrobe = picker.pickWithRecency(pools.VAMPIRE_WARDROBE, 'vg2_wardrobe');
  const moment = picker.pickWithRecency(pools.VAMPIRE_CANDID_MOMENTS, 'vg2_moment');
  const ethnicity =
    pools.VAMPIRE_ETHNICITIES && pools.VAMPIRE_ETHNICITIES.length > 0
      ? picker.pickWithRecency(pools.VAMPIRE_ETHNICITIES, 'vg2_ethnicity')
      : null;
  const eyeColor =
    pools.VAMPIRE_EYE_COLORS && pools.VAMPIRE_EYE_COLORS.length > 0
      ? picker.pickWithRecency(pools.VAMPIRE_EYE_COLORS, 'vg2_eye_color')
      : null;
  const lightingPool =
    pools.VAMPIRE_LIGHTING && pools.VAMPIRE_LIGHTING.length > 0
      ? pools.VAMPIRE_LIGHTING
      : pools.LIGHTING;
  const lighting = picker.pickWithRecency(lightingPool, 'vg2_lighting');
  const skinCorruption = pools.VAMPIRE_SKIN_CORRUPTION && pools.VAMPIRE_SKIN_CORRUPTION.length > 0
    ? picker.pickWithRecency(pools.VAMPIRE_SKIN_CORRUPTION, 'vg2_skin_corruption')
    : 'blue-black veins mapping temples, cracked porcelain skin, sunken hollows beneath cheekbones';
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing ONE extreme macro vampire face portrait for GothBot. This is a hyperreal close-up of a SCARY, CORRUPTED, ANCIENT vampire woman's face. She is STRIKING but something is deeply WRONG — inhuman, predatory, DEAD. Not a model with contact lenses. A MONSTER that happens to have a face.

TASK: write ONE vivid macro face description (50-70 words, comma-separated phrases). Output is wrapped with style prefix + suffix — you produce ONLY the scene.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY COMPOSITION — USE THIS EXACT CROP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${crop}

Her face fills the ENTIRE frame. This is MACRO — no body, no shoulders, no neck, no space above her head. The face IS the image.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHARACTER INGREDIENTS — USE EACH ONE, DO NOT INVENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${ethnicity ? `ETHNICITY: ${ethnicity}\nUse these specific ethnic features. Name her ethnicity in the first few words.\n\n` : ''}FACE STRUCTURE: ${face}
Render THIS face — this jaw, this nose, this cheekbone, this brow. NOT a generic face. ANGULAR, GAUNT, WRONG.

EYES: ${eyeColor || 'glowing supernatural iris with volcanic inner detail'}
Her eyes GLOW — they radiate light onto the skin around them. Fire-like, volcanic, supernatural. The iris is impossibly detailed and luminous.

MAKEUP: ${makeup}
Use THIS specific makeup look. Render it BOLD and DRAMATIC — heavy, intense, striking. NOT subtle, NOT dripping, NOT running. The makeup is APPLIED WITH INTENTION and PRECISION — sharp, deliberate, ancient. This is war-paint, not beauty editorial.

HAIR: ${hairColor}, ${hairstyle}

WARDROBE (barely visible at frame edge): ${wardrobe}

CANDID MOMENT: ${moment}
She was caught doing THIS. Use it as her expression/action.

WHO SHE IS: ${archetype}
Let this inform her ENERGY — her gaze, her stillness, her menace. Ancient vs feral vs bored vs grief-stricken.

LIGHTING: ${lighting}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY QUALITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SKIN: she is DEAD. Not pale — DEAD. Deathly corpse-drained, gaunt, translucent. Render THIS specific corruption detail prominently on her face:
${skinCorruption}
The skin should make the viewer UNCOMFORTABLE — WRONG. A corpse that forgot to stop moving. NOT smooth, NOT flawless, NOT model skin.

FANGS: sharp elongated upper canine fangs visible through parted lips — not subtle, not small. PREDATOR teeth.

GAZE: cold, ancient, predatory. She's deciding whether you're worth the effort. NOT seductive, NOT flirty. PREDATOR calm.

DRAMATIC VISUALS: go MAXIMUM. The glowing eyes should BLAZE. The makeup should be STRIKING and BOLD. The cracked veined skin should be VISCERAL and DETAILED. The lighting should carve every vein and crack into sharp relief. Every element cranked to jaw-dropping visual impact. She is MONSTROUS and ANCIENT — something dead and wrong that still moves and stares. NOT beautiful, NOT pretty, NOT gorgeous. STRIKING and TERRIFYING. The face of something that should not exist.

━━━ HARD BANS ━━━
- NO blood dripping, NO blood on face, NO blood on lips, NO blood on chin, NO blood anywhere
- NO devil horns, NO pentagrams, NO satanic symbols
- NO anime-smooth, NO Halloween costume, NO cosplay
- NO magazine editorial, NO fashion photography, NO model energy, NO beauty shoot
- She is NOT pretty. She is NOT gorgeous. She is NOT beautiful. She is STRIKING and WRONG and DEAD.
- NO perfect skin, NO flawless complexion, NO smooth porcelain �� she is a CORPSE
- NO second person in frame — she is ALONE
- ONE woman only

${blocks.NO_CHEAP_GORE_BLOCK}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ PALETTE ━━━
${sharedDNA.scenePalette}
${sharedDNA.colorPalette}
${vibeDirective.slice(0, 200)}

━━━ OUTPUT ━━━
50-70 words, comma-separated phrases. Start with her ETHNICITY. Follow with face structure, skin, eyes, makeup, hair, expression, crop/angle, lighting. No preamble, no headers, no bold, no markers.`;
};
