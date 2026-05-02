const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BORROWERS_SCENES, 'borrowers_scene');
  const lighting = picker.pickWithRecency(pools.TILT_SHIFT_LIGHTING, 'tilt_shift_lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a master model-maker writing BORROWERS scenes for TinyBot. Tiny humans (5cm tall, Arrietty / Borrowers / Ant-Man scale) living inside a normal-sized human world — using thimbles for bathtubs, spools as stools, pencils as beams, breakfast tables looming overhead like cathedrals. Object-for-scale anchoring is the SIGNATURE — the everyday object dwarfs the tiny human and tells the scale story. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

━━━ TINY HUMANS REQUIRED (this path overrides the NO_HUMANS rule) ━━━

This path EXPLICITLY features tiny humans 5cm tall — Arrietty / The Borrowers / Ant-Man scale. They are the protagonists. They wear handmade clothes stitched from scraps (handkerchief skirts, sock-cuff sweaters, button hats). They are dwarfed by everyday objects which are rendered at NORMAL human size for scale anchoring.

Cap on tiny humans: 1-2 in the scene MAX. Solo borrower or borrower-pair. Never crowds. Never identifiable real-person faces — borrowers are stylized figurines, soft features, illustrative not photographic.

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE BORROWERS SCENE ━━━
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

━━━ BORROWERS DNA ━━━
The signature shot is SCALE-COLLISION through object anchoring. The object is rendered at its TRUE everyday size — a thimble, a teacup, a postage stamp, a pencil — and a 5cm-tall borrower interacts with it. The viewer instantly reads the scale because they know how big a thimble is. Tilt-shift macro lens makes the everyday surface (table-top, kitchen-counter, nightstand) feel like a borrower-scale landscape: a teacup is a swimming pool, a book is a building, a spool of thread is a wagon wheel. Resourceful, cozy, secretive — borrowers live HIDDEN inside human spaces.

━━━ COMPOSITION ━━━
Macro close-up at borrower-eye-level OR slightly elevated. The everyday object dominates the frame. The borrower is clearly visible but small. Tilt-shift shallow DOF. Object surface texture rendered with obsessive detail (thimble metal, spool thread grain, paper fibers, fabric weave at extreme close-up). Warm palette. The scene tells a tiny story — borrower mid-task, mid-climb, mid-sip, mid-rest.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
