/**
 * GlowBot ethereal-scene path — Ghibli / Narnia / Rivendell soft-magical scenes.
 * Floating islands, cloud palaces, divine staircases. Fantasy-architectural
 * but always peaceful + awe-inspired + light-as-hero.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.ETHEREAL_SCENES, 'ethereal_scene');
  const lightTreatment = picker.pickWithRecency(pools.LIGHT_TREATMENTS, 'light_treatment');
  const architecture = picker.pickWithRecency(pools.ARCHITECTURAL_ELEMENTS, 'architectural_element');
  const emotionalTone = picker.pickWithRecency(pools.EMOTIONAL_TONES, 'emotional_tone');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a magical-realism painter writing ETHEREAL SCENES for GlowBot — Ghibli / Narnia / Rivendell soft-magical realms. Floating islands, cloud palaces, divine staircases, elvish bridges, moss-draped temples. Always peaceful, always sacred, always LIGHT-CARRIED. Output wraps with style prefix + suffix.

${blocks.LIGHT_IS_HERO_BLOCK}

${blocks.AWE_AND_PEACE_BLOCK}

${blocks.NO_HARSH_DARK_FIERCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE ETHEREAL SCENE ━━━
${scene}

━━━ ARCHITECTURAL ELEMENT (anchors composition) ━━━
${architecture}

━━━ LIGHT TREATMENT ━━━
${lightTreatment}

━━━ EMOTIONAL TONE ━━━
${emotionalTone}

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
Fantasy-architectural scale. Ethereal construct (floating, above-clouds, impossibly-suspended) integrated with soft-sacred light. Architectural element anchors but does not dominate — light is still the hero. Ghibli-warmth or Rivendell-divine, NEVER dark-gothic or menacing-fantasy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
