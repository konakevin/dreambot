/**
 * StarBot male-explorer path — slot-pool DNA upgrade (mirrors GothBot pattern).
 * Each render rotates independent skin / eyes / hair_color / hairstyle / outfit /
 * accessory / character / action / landscape ledgers.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.MALE_EXPLORERS, 'male_explorer');
  const outfit = picker.pickWithRecency(pools.SCI_FI_MALE_OUTFITS, 'sci_fi_male_outfit');
  const skin = picker.pickWithRecency(pools.EXPLORER_SKIN, 'me_skin');
  const eyes = picker.pickWithRecency(pools.EXPLORER_EYES, 'me_eyes');
  const hairColor = picker.pickWithRecency(pools.EXPLORER_HAIR_COLOR, 'me_hair_color');
  const hairstyle = picker.pickWithRecency(pools.MALE_EXPLORER_HAIRSTYLES, 'me_hairstyle');
  const accessory = picker.pickWithRecency(pools.MALE_EXPLORER_ACCESSORIES, 'me_accessory');
  const action = picker.pickWithRecency(pools.SCI_FI_ACTIONS, 'sci_fi_action');
  const landscape = picker.pickWithRecency(pools.ALIEN_LANDSCAPES, 'alien_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi concept-art painter writing EPIC SCI-FI EXPLORER scenes for StarBot — a single badass MAN standing in a jaw-dropping alien or cosmic environment. Same universe as our cosmic vistas and alien cities. The character is the HERO but the world around him is equally breathtaking. Output wraps with style prefix + suffix.

${blocks.SCI_FI_AWE_BLOCK}

${blocks.COSMIC_CANVAS_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. This explorer ALONE against the cosmos.

━━━ HE MUST LOOK LIKE A SPECIFIC PERSON — OBSESSIVE DETAIL ━━━
Render him with obsessive detail — he must feel like ONE specific explorer, not a generic-sci-fi-man trope:
- FACE: every detail of his exact skin description rendered, expression-line specificity
- SKIN: render the EXACT skin description from the pool — how sci-fi light hits it, where shadow pools
- EYES: the EXACT color and intensity from the pool — they radiate, they catch HUD-glow
- HAIR: the EXACT color AND hairstyle from the pools (beard included where described)
- OUTFIT: render the FULL suit / armor from the pool with obsessive material detail
- ACCESSORY: the signature object from the pool — render it visible and identity-anchoring
- BODY LANGUAGE: capable confidence mid-action

━━━ THE EXPLORER (his core identity) ━━━
He is MASCULINE — strong jaw, broad shoulders, powerful build, rugged features, masculine clothing and armor.
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

━━━ THE ENVIRONMENT (as epic as the character) ━━━
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

━━━ ENVIRONMENT GEAR (NON-NEGOTIABLE) ━━━
He is OUTDOORS on an alien world. He MUST have visible environmental protection — helmet with visor (up or down), breathing mask, rebreather apparatus, sealed EVA hood, or atmospheric filter across his face. The gear should be RUGGED and battle-worn, matching his outfit's aesthetic.

━━━ COMPOSITION ━━━
GROUNDED AND REAL — feet on the ground. No floating. CANDID SHOTS — caught mid-action, mid-thought, from a three-quarter angle or side profile. NEVER from behind. NEVER walking directly toward the camera. The environment stretches vast behind him. Full-body or wide mid-shot. Depth on depth — foreground detail, midground character, background alien landscape.

DRAMATIC VISUALS: render the EXACT slot-pool details above — DO NOT substitute generic descriptions. Every slot is locked.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
