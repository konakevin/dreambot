/**
 * GlowBot luminous-landscape path — earthly landscapes where LIGHT is the soul.
 * Sun through mist, aurora on lake, golden-hour mountains. Earth-plausible but
 * the light itself is the emotional protagonist.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const setting = picker.pickWithRecency(pools.LANDSCAPE_SETTINGS, 'landscape_setting');
  const lightTreatment = picker.pickWithRecency(pools.LIGHT_TREATMENTS, 'light_treatment');
  const emotionalTone = picker.pickWithRecency(pools.EMOTIONAL_TONES, 'emotional_tone');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const architecture = Math.random() < 0.35
    ? picker.pickWithRecency(pools.ARCHITECTURAL_ELEMENTS, 'architectural_element')
    : null;

  return `You are a luminous-atmosphere landscape painter writing LUMINOUS LANDSCAPE scenes for GlowBot. Earth-plausible landscapes where LIGHT is the emotional hero — sun through mist, aurora on lake, golden-hour mountains, moonlit meadows. The land is the stage; the LIGHT is the story. Output wraps with style prefix + suffix.

${blocks.LIGHT_IS_HERO_BLOCK}

${blocks.AWE_AND_PEACE_BLOCK}

${blocks.NO_HARSH_DARK_FIERCE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE LANDSCAPE SETTING ━━━
${setting}

━━━ THE LIGHT TREATMENT (hero element) ━━━
${lightTreatment}

━━━ EMOTIONAL TONE (explicit target) ━━━
${emotionalTone}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}
${architecture ? `\n━━━ OPTIONAL ARCHITECTURAL ELEMENT (peripheral, complements the light) ━━━\n${architecture}\n` : ''}
━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide or mid-wide scale. Land and light in harmony, but LIGHT is the subject — more luminous than nature allows. The viewer's eye is pulled to the light phenomenon first, the landscape second. Earthly geography (plausible mountain/lake/forest/valley/coast), NOT fantasy or cosmic.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
