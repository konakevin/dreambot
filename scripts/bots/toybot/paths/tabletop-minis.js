const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const useLandscape = Math.random() < 0.3;
  const scene = useLandscape
    ? picker.pickWithRecency(pools.TABLETOP_LANDSCAPES, 'tabletop_landscape')
    : picker.pickWithRecency(pools.TABLETOP_SCENES, 'tabletop_scene');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a pro-painter display-case photographer writing WARHAMMER / D&D tabletop-miniature dioramas for ToyBot. 28mm–32mm scale hand-painted pewter-or-plastic figures on handcrafted terrain — visible brush-strokes, drybrushed highlights, flocked bases, collector-grade paint jobs. Games-Workshop / Reaper / WizKids aesthetic. Output wraps with style prefix + suffix.

${blocks.TOY_PHOTOGRAPHY_BLOCK}

${blocks.CINEMATIC_STORY_BLOCK}

${blocks.DRAMATIC_LIGHTING_MAKES_CHEAP_LOOK_EPIC_BLOCK}

${blocks.PATH_MEDIUM_LOCK_BLOCK}

━━━ TABLETOP-MINIS MEDIUM LOCK ━━━
EVERY figure is a 28mm–32mm painted pewter-or-plastic tabletop-miniature — visible brush-strokes, wash-shaded recesses, drybrushed highlights, metallic-armor paint, freehand shield-crest detail, mounted on a round flocked base with static-grass / cork-rock / sand texture. Environment is a handcrafted terrain diorama — sculpted-foam rocks, lichen-trees, plaster ruins, resin-water. Games-Workshop / Reaper / WizKids DNA. Display-cabinet toy-photography — dramatic spotlight or cabinet-LED, warm-key rim-light. NEVER CGI, NEVER illustration, NEVER real fantasy scene.

━━━ THE TABLETOP SCENE ━━━
${scene}

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
Mid-close terrain-diorama frame. Painted miniatures mid-battle-or-narrative on handcrafted terrain. Dramatic display-cabinet lighting. Visible brush-strokes + flocked-base texture. Collector-grade pro-painter showcase.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
