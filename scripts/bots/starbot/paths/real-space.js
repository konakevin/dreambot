/**
 * StarBot real-space path — PHOTOREAL astrophotography.
 * NASA-Hubble / JWST-style. Real nebulae, galaxies, planets. Named OK.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const subject = picker.pickWithRecency(pools.REAL_SPACE_SUBJECTS, 'real_space_subject');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are an astrophotographer writing REAL SPACE scenes for StarBot — photoreal NASA-Hubble / JWST astrophotography. Real nebulae, galaxies, planets with named-wavelength treatments. Distinct from fictional cosmic-vista. Output wraps with style prefix + suffix.

${blocks.REAL_ASTRONOMY_BLOCK}

${blocks.SCI_FI_AWE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE REAL ASTRONOMICAL SUBJECT ━━━
${subject}

━━━ LIGHTING / WAVELENGTH TREATMENT ━━━
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
Astrophotography framing. Subject filling most of frame or cinematic wide. Wavelength-mapped color treatment. Real-astronomy aesthetic — photoreal, not fictional concept-art.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
