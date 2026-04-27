/**
 * GothBot vampire-boys — extreme macro male vampire face portraits.
 *
 * Cloned from vampire-girls-2, adapted for masculine vampire portraits.
 * Same architecture: minimal medium (vampire-portrait), ALL character
 * details from pools, forced CROP rotation.
 *
 * POOLS:
 *   - VAMPIRE_MALE_ARCHETYPES — who he is (energy/story)
 *   - FACIAL_FEATURES — bone structure / face geometry
 *   - VAMPIRE_MALE_MAKEUP — specific masculine makeup look
 *   - HAIR_COLORS + MALE_HAIRSTYLES — hair
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
  'EXTREME LOW ANGLE: camera below his chin looking UP. Both glowing eyes looking DOWN at us. Underside of jaw, nostrils, the underlit menace of something looking down at prey.',
  'THREE-QUARTER TURN: face turned 30-40 degrees. Near eye large and glowing, far eye smaller and partially occluded by nose bridge. Cheekbone catching light. Classic portrait angle but MACRO tight.',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const crop = CROPS[Math.floor(Math.random() * CROPS.length)];
  const archetype = picker.pickWithRecency(pools.VAMPIRE_MALE_ARCHETYPES, 'vb_archetype');
  const face = picker.pickWithRecency(pools.FACIAL_FEATURES, 'vb_face');
  const makeup = picker.pickWithRecency(pools.VAMPIRE_MALE_MAKEUP, 'vb_makeup');
  const hairColor = picker.pickWithRecency(pools.HAIR_COLORS, 'vb_hair_color');
  const hairstyle = picker.pickWithRecency(pools.MALE_HAIRSTYLES, 'vb_hairstyle');
  const wardrobe = picker.pickWithRecency(pools.VAMPIRE_MALE_WARDROBE, 'vb_wardrobe');
  const moment = picker.pickWithRecency(pools.VAMPIRE_MALE_CANDID_MOMENTS, 'vb_moment');
  const ethnicity =
    pools.VAMPIRE_MALE_ETHNICITIES && pools.VAMPIRE_MALE_ETHNICITIES.length > 0
      ? picker.pickWithRecency(pools.VAMPIRE_MALE_ETHNICITIES, 'vb_ethnicity')
      : null;
  const eyeColor =
    pools.VAMPIRE_EYE_COLORS && pools.VAMPIRE_EYE_COLORS.length > 0
      ? picker.pickWithRecency(pools.VAMPIRE_EYE_COLORS, 'vb_eye_color')
      : null;
  const lightingPool =
    pools.VAMPIRE_LIGHTING && pools.VAMPIRE_LIGHTING.length > 0
      ? pools.VAMPIRE_LIGHTING
      : pools.LIGHTING;
  const lighting = picker.pickWithRecency(lightingPool, 'vb_lighting');
  const skinCorruption = pools.VAMPIRE_SKIN_CORRUPTION && pools.VAMPIRE_SKIN_CORRUPTION.length > 0
    ? picker.pickWithRecency(pools.VAMPIRE_SKIN_CORRUPTION, 'vb_skin_corruption')
    : 'blue-black veins mapping temples, cracked porcelain skin, sunken hollows beneath cheekbones';
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing ONE extreme macro vampire face portrait for GothBot. This is a hyperreal close-up of a SCARY, hauntingly handsome, CORRUPTED vampire man's face. He is HANDSOME but something is deeply WRONG — ancient, predatory, inhuman. Not a handsome guy with contact lenses. A MONSTER wearing a handsome face.

TASK: write ONE vivid macro face description (50-70 words, comma-separated phrases). Output is wrapped with style prefix + suffix — you produce ONLY the scene.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY COMPOSITION — USE THIS EXACT CROP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${crop}

His face fills the ENTIRE frame. This is MACRO — no body, no shoulders, no neck, no space above his head. The face IS the image.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHARACTER INGREDIENTS — USE EACH ONE, DO NOT INVENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${ethnicity ? `ETHNICITY: ${ethnicity}\nUse these specific ethnic features. Name his ethnicity in the first few words.\n\n` : ''}FACE STRUCTURE: ${face}
Render THIS face — this jaw, this nose, this cheekbone, this brow. NOT a generic handsome face. MASCULINE bone structure — strong jaw, prominent brow ridge, angular features.

EYES: ${eyeColor || 'glowing supernatural iris with volcanic inner detail'}
His eyes GLOW — they radiate light onto the skin around them. Fire-like, volcanic, supernatural. The iris is impossibly detailed and luminous.

MAKEUP: ${makeup}
Use THIS specific look. Render it BOLD and DRAMATIC — heavy, intense, striking. This is masculine dark-beauty: kohl, war-paint, bruise-shadow, contour carved by centuries. NOT subtle, NOT pretty-boy, NOT androgynous. Dark couture on a warrior's face.

HAIR: ${hairColor}, ${hairstyle}

WARDROBE (barely visible at frame edge): ${wardrobe}

CANDID MOMENT: ${moment}
He was caught doing THIS. Use it as his expression/action.

WHO HE IS: ${archetype}
Let this inform his ENERGY — his gaze, his stillness, his menace. Ancient vs feral vs bored vs grief-stricken.

LIGHTING: ${lighting}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MANDATORY QUALITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GENDER: This is a MAN. Masculine features — strong jawline, brow ridge, Adam's apple, facial stubble or clean-shaven angular jaw. NEVER feminine, NEVER androgynous, NEVER pretty-boy. He should read as MALE immediately.

NO LIPSTICK. NO colored lips. NO lip gloss. NO lip tint. His lips are NATURAL — pale, cracked, wind-chapped, or bloodless. The ONLY exception is solid black lips (black-metal aesthetic). Never red, never oxblood, never plum, never wine, never any color on his mouth.

SKIN: he is DEAD. Not pale — DEAD. Deathly corpse-drained, gaunt, translucent. Render THIS specific corruption detail prominently on his face:
${skinCorruption}
The skin should make the viewer UNCOMFORTABLE — striking but deeply wrong. A corpse that forgot to stop moving.

FANGS: sharp elongated upper canine fangs visible through parted lips.

GAZE: cold, ancient, predatory. He's deciding whether you're worth the effort. NOT brooding-romantic, NOT smoldering, NOT pretty. PREDATOR calm.

DRAMATIC VISUALS: go MAXIMUM. This is AI art — blow it out. The glowing eyes should BLAZE. The makeup should be STRIKING and BOLD. The lighting should carve his face into something MYTHIC. Every element cranked to "oh fuck" levels of visual impact. He is HANDSOME but MORBID and TERRIFYING — something ancient and wrong wearing a handsome face. The handsomeness makes the horror WORSE.

━━━ HARD BANS ━━━
- NO blood dripping, NO blood on face, NO blood on lips, NO blood on chin, NO blood anywhere
- NO devil horns, NO pentagrams, NO satanic symbols
- NO anime-smooth, NO Halloween costume, NO cosplay
- NO magazine editorial, NO fashion photography energy
- NO second person in frame — he is ALONE
- ONE man only
- NO feminine features, NO androgynous, NO pretty-boy

${blocks.NO_CHEAP_GORE_BLOCK}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ PALETTE ━━━
${sharedDNA.scenePalette}
${sharedDNA.colorPalette}
${vibeDirective.slice(0, 200)}

━━━ OUTPUT ━━━
50-70 words, comma-separated phrases. Start with his ETHNICITY. Follow with face structure, skin, eyes, makeup, hair, expression, crop/angle, lighting. No preamble, no headers, no bold, no markers.`;
};
