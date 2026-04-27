/**
 * OceanBot mermaid-legend — old maritime folklore glimpses.
 * Beautiful mermaids observed in the wild ocean, the way sailors told the stories.
 * Environment-dominant: the ocean is the subject, she is part of its mystery.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.MERMAID_LEGEND_SCENES, 'mermaid_legend_scene');
  const action = picker.pickWithRecency(pools.MERMAID_LEGEND_ACTIONS, 'mermaid_legend_action');
  const hairColor = picker.pickWithRecency(pools.MERMAID_HAIR_COLORS, 'mermaid_hair_color');
  const hairStyle = picker.pickWithRecency(pools.MERMAID_HAIR_STYLES, 'mermaid_hair_style');
  const tailColor = picker.pickWithRecency(pools.MERMAID_TAIL_COLORS, 'mermaid_tail_color');
  const tailStyle = picker.pickWithRecency(pools.MERMAID_TAIL_STYLES, 'mermaid_tail_style');
  const lighting = picker.pickWithRecency(pools.MERMAID_LEGEND_LIGHTING, 'mermaid_legend_lighting');

  const covering = picker.pickWithRecency(pools.MERMAID_COVERINGS, 'mermaid_covering');

  const framing = Math.random() < 0.4
    ? 'She fills 40-50% of the frame. We see her face, her expression, the detail of her scales.'
    : 'Wide shot — the vast maritime scene dominates. She is clearly visible but the ocean dwarfs her.';

  return `You are painting a scene from an old sailor's tale — a MERMAID glimpsed in the wild ocean. She is observing something quietly. She does NOT know she is being watched. Output wraps with style prefix + suffix.

${blocks.MARITIME_MYTH_BLOCK}

━━━ THE MERMAID — ANATOMY (CRITICAL) ━━━
She is a MERMAID — half-fish, half-human. FISH TAIL from the waist down, exactly TWO ARMS, NO legs, NO feet. The tail curves gently to one side, NEVER at a sharp angle.

She is NOT a woman. She is NOT wearing a dress, gown, skirt, or any clothing. Her chest is covered ONLY by ${covering}. She is a wild ocean creature.

Her hair: ${hairColor}, ${hairStyle}
Her tail: ${tailColor}, ${tailStyle}

━━━ POSTURE ━━━
She is SWIMMING (half-submerged, head and chest above water, tail hidden below) or SITTING on a rock with tail curving into water. NO standing, NO kneeling, NO lying flat, NO floating on surface. She is NOT on a beach. She is IN the water or ON rocks surrounded by water.

━━━ WHAT SHE IS OBSERVING ━━━
${action}

━━━ FRAMING ━━━
${framing}

━━━ THE SCENE ━━━
${scene}

━━━ LIGHTING ━━━
${lighting}

━━━ COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 250)}

━━━ THE LEGEND ━━━
This is the world those stories came from — age-of-sail seas, rocky coasts, fog, moonlight. The ocean was vast and unknowable and full of things that sang in the dark. She is mysterious, beautiful, impossible. One mermaid, alone.

Output ONLY 60-90 words. Comma-separated phrases. No preamble, no headers.`;
};
