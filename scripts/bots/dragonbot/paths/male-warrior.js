/**
 * DragonBot male-warrior path — slot-pool DNA upgrade (mirrors GothBot pattern).
 * Each render rotates independent skin / eyes / hair_color / hairstyle / outfit /
 * accessory / character / action / landscape ledgers.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.MALE_WARRIORS, 'male_warrior');
  const outfit = picker.pickWithRecency(pools.MALE_OUTFITS, 'male_outfit');
  const skin = picker.pickWithRecency(pools.WARRIOR_SKIN, 'mw_skin');
  const eyes = picker.pickWithRecency(pools.WARRIOR_EYES, 'mw_eyes');
  const hairColor = picker.pickWithRecency(pools.WARRIOR_HAIR_COLOR, 'mw_hair_color');
  const hairstyle = picker.pickWithRecency(pools.MALE_WARRIOR_HAIRSTYLES, 'mw_hairstyle');
  const accessory = picker.pickWithRecency(pools.MALE_WARRIOR_ACCESSORIES, 'mw_accessory');
  const action = picker.pickWithRecency(pools.WARRIOR_ACTIONS, 'warrior_action');
  const landscape = picker.pickWithRecency(pools.FANTASY_LANDSCAPES, 'fantasy_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a fantasy concept-art painter writing EPIC FANTASY WARRIOR scenes for DragonBot — a single heroic man standing in a jaw-dropping high-fantasy landscape. Same universe as our dragons and vast landscapes. The character is the HERO but the world behind him is equally breathtaking. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. This warrior ALONE against the world.

━━━ HE MUST LOOK LIKE A SPECIFIC PERSON — OBSESSIVE DETAIL ━━━
Render him with obsessive detail — he must feel like ONE specific warrior, not a generic-fantasy-man trope:
- FACE: every detail of his exact skin description rendered, jaw catching firelight, expression-line specificity, scars and battle-marks where the pool calls for them
- SKIN: render the EXACT skin description from the pool — how light hits it, where shadow pools
- EYES: the EXACT color and intensity from the pool — they radiate, they catch firelight
- HAIR: the EXACT color AND hairstyle from the pools (beard included where described)
- OUTFIT: render the FULL armor / warrior dress from the pool with obsessive material detail — every leather strap, every steel plate, every furred-or-scaled layer
- ACCESSORY: the signature object from the pool — render it visible and identity-anchoring
- BODY LANGUAGE: predatory confidence mid-action

━━━ THE WARRIOR (his core identity — let this inform his ENERGY) ━━━
He is MASCULINE — rugged, scarred, angular. Render him as unambiguously male: powerful build, battle-worn jaw, masculine wardrobe.
${character}

━━━ HIS SKIN ━━━
${skin}

━━━ HIS EYES ━━━
${eyes}

━━━ HIS HAIR (and beard if described) ━━━
${hairColor}, ${hairstyle}

━━━ HIS OUTFIT (render with material detail) ━━━
${outfit}

━━━ SIGNATURE ACCESSORY (the small detail that anchors his identity) ━━━
${accessory}

━━━ THE ACTION (what he is doing RIGHT NOW) ━━━
${action}

━━━ THE LANDSCAPE (as epic as the character) ━━━
${landscape}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
GROUNDED AND REAL — feet on the ground. No floating, no mid-air leaps, no flying through the air. If jumping, he MUST be jumping ONTO or OFF something specific.
CANDID SHOTS — caught mid-action, mid-thought, mid-moment from a three-quarter angle or side profile. NEVER from behind. NEVER walking directly toward the camera. The landscape stretches vast behind him. Full-body or wide mid-shot. Depth on depth — foreground detail, midground character, background landscape.

DRAMATIC VISUALS: render the EXACT slot-pool details above — DO NOT substitute generic descriptions. The eyes should match the eye pool entry. The skin should match the skin pool entry. The outfit should match the outfit pool entry. Every slot is locked.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
