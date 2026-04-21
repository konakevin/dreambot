/**
 * AnimalBot cozy path — REAL wildlife (photoreal Nat-Geo) in warm cozy
 * natural settings. Distinct from CuddleBot's stylized cuteness — this is
 * real-species photography with warm emotional read.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const moment = picker.pickWithRecency(pools.COZY_ANIMAL_MOMENTS, 'cozy_moment');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a cozy-nature wildlife photographer writing WARM INTIMATE ANIMAL scenes for AnimalBot. Real wildlife (photoreal Nat-Geo quality) in warm, cozy, intimate natural settings. The emotional read is cozy + warm + peaceful — this is distinct from CuddleBot's stylized cuteness. Output wraps with style prefix + suffix.

${blocks.ANIMAL_IS_HERO_BLOCK}

${blocks.IMPOSSIBLE_CLARITY_BLOCK}

${blocks.SOLO_ANIMAL_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.NO_MARINE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COZY ANIMAL MOMENT ━━━
${moment}

━━━ LIGHTING (warm / soft dominant) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.DRAMATIC_LIGHTING_BLOCK}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid-close frame. Animal resting, curled, napping, or in warm intimate moment. Soft warm golden light. Photo-real — the viewer should believe it's a real wildlife photograph, just impossibly beautiful. Viewer reaction: "I want to curl up there too."

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
