/**
 * StarBot female-explorer path — slot-pool DNA upgrade (mirrors GothBot pattern).
 * Each render rotates independent skin / eyes / hair_color / hairstyle / outfit /
 * accessory / character / action / landscape ledgers.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const character = picker.pickWithRecency(pools.FEMALE_EXPLORERS, 'female_explorer');
  const outfit = picker.pickWithRecency(pools.SCI_FI_FEMALE_OUTFITS, 'sci_fi_female_outfit');
  const skin = picker.pickWithRecency(pools.EXPLORER_SKIN, 'fe_skin');
  const eyes = picker.pickWithRecency(pools.EXPLORER_EYES, 'fe_eyes');
  const hairColor = picker.pickWithRecency(pools.EXPLORER_HAIR_COLOR, 'fe_hair_color');
  const hairstyle = picker.pickWithRecency(pools.FEMALE_EXPLORER_HAIRSTYLES, 'fe_hairstyle');
  const accessory = picker.pickWithRecency(pools.FEMALE_EXPLORER_ACCESSORIES, 'fe_accessory');
  const action = picker.pickWithRecency(pools.SCI_FI_ACTIONS, 'sci_fi_action');
  const landscape = picker.pickWithRecency(pools.ALIEN_LANDSCAPES, 'alien_landscape');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a sci-fi concept-art painter writing an EXPLORER scene for StarBot — a single stunning woman in a jaw-dropping alien environment. Output wraps with style prefix + suffix.

━━━ GENDER LOCK (NON-NEGOTIABLE) ━━━
This character is a BEAUTIFUL WOMAN. Render her as unambiguously feminine — gorgeous face, feminine body, ornate detailed suit/armor.

━━━ SHE MUST LOOK LIKE A SPECIFIC PERSON — OBSESSIVE DETAIL ━━━
Render her with obsessive detail — she must feel like ONE specific explorer, not a generic-sci-fi-woman trope:
- FACE: every detail of her exact skin description rendered, expression-line specificity
- SKIN: render the EXACT skin description from the pool — how sci-fi light hits it, where shadow pools
- EYES: the EXACT color and intensity from the pool — they radiate, they catch HUD-glow
- HAIR: the EXACT color AND hairstyle from the pools, rendered with sheen
- OUTFIT: render the FULL suit / armor from the pool with obsessive material detail — every chrome plate, every synth-leather strap
- ACCESSORY: the signature object from the pool — render it visible and identity-anchoring
- BODY LANGUAGE: capable confidence mid-action

━━━ CRITICAL — MATCH THE POOLS ━━━
Render the EXACT slot-pool details below. Do NOT substitute generic descriptions. Do NOT default to:
- the same "sun-scorched vacuum-chapped" skin on every explorer
- teal-and-orange lighting on every scene
- nebula backdrop behind every character (match the ENVIRONMENT pool entry)
- the same three-quarter-angle mid-shot every time — vary the framing

━━━ THE EXPLORER (her core identity) ━━━
${character}

━━━ HER SKIN ━━━
${skin}

━━━ HER EYES ━━━
${eyes}

━━━ HER HAIR ━━━
${hairColor}, ${hairstyle}

━━━ HER OUTFIT (render with material detail) ━━━
${outfit}

━━━ SIGNATURE ACCESSORY (the small detail that anchors her identity) ━━━
${accessory}

━━━ THE ACTION (what she is doing RIGHT NOW) ━━━
${action}

━━━ THE ENVIRONMENT ━━━
${landscape}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ ENVIRONMENT GEAR (NON-NEGOTIABLE) ━━━
She is OUTDOORS on an alien world. She MUST have visible environmental protection — helmet with visor, breathing mask, rebreather, sealed EVA hood, or atmospheric filter. No one breathes alien atmosphere unprotected.

━━━ COMPOSITION ━━━
ONE character, no companions. GROUNDED — feet on the ground, no floating. CANDID — caught mid-action, not posing for camera. We see her face and expression — three-quarter angle or side profile. NEVER from behind, NEVER walking directly toward camera. The environment stretches vast behind her. Full-body or wide mid-shot. Depth — foreground detail, midground character, background alien landscape.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
