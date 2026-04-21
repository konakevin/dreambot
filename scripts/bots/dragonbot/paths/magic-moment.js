/**
 * DragonBot magic-moment path — ARCANE MAXIMALISM.
 * Layered impossibly-magical artifact/phenomena scenes. 4-5 magical elements
 * per render. Scene responds to the magic.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const phenomenon = picker.pickWithRecency(pools.ARCANE_PHENOMENA, 'arcane_phenomenon');
  const architecture = picker.pickWithRecency(pools.ARCHITECTURAL_ELEMENTS, 'architectural_element');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  return `You are an arcane-maximalism concept-art painter writing MAGIC MOMENT scenes for DragonBot — LAYERED multi-element magical scenes. 4-5 magical elements stacked. Scene RESPONDS to the magic. NEVER simple-object-on-altar. Output wraps with style prefix + suffix.

${blocks.EPIC_FANTASY_BLOCK}

${blocks.MAGICAL_ATMOSPHERE_EVERYWHERE_BLOCK}

${blocks.PAINTERLY_ILLUSTRATION_BLOCK}

${blocks.CINEMATIC_COMPOSITION_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

${blocks.ARCANE_MAXIMALISM_BLOCK}

━━━ THE LAYERED ARCANE PHENOMENON ━━━
${phenomenon}

━━━ ARCHITECTURAL CONTEXT ━━━
${architecture}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC RESPONSE ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid frame centered on the arcane phenomenon. 4-5 magical elements layered and visible. Scene responds — dust suspended, stones cracking, walls breathing, light bending. Architectural context supports drama.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
