/**
 * ChibiBot bookish-sanctuary path — written 2026-05-05 in the CuddleBot
 * cozy-interior pattern. Books are the SUBJECT, not a prop. Libraries,
 * nooks, antique studies, occult magic-shops, family library-rooms.
 * Towers of books + soft tungsten/candlelight + a peripheral cute
 * creature resident (sleeping cat on books, owl on rafter).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.BOOKISH_SANCTUARY_SCENES, 'bookish_sanctuary_scene');
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing BOOKISH-SANCTUARY scenes for ChibiBot — beautiful interior SPACES where books are the visual subject. Antique private libraries with floor-to-ceiling shelves, reading nooks tucked in bay windows, occult magic-shop reading rooms with leather grimoires, university common rooms with worn Chesterfields, family library-rooms with mismatched shelves, bookbinder's workshops, hidden tower libraries. The COZY ROOM + the BOOKS + the WARM LAMP-LIGHT are the heroes. A small cute critter resident is ALWAYS present, peripheral. Pixar / Studio Ghibli / Beatrix-Potter / Hogwarts-cozy-corner aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE BOOKISH-SANCTUARY SCENE ━━━
${scene}

━━━ BOOKS ARE MANDATORY (the subject — not just decoration) ━━━
Books DOMINATE the frame. Floor-to-ceiling shelves packed tight with leather and cloth-bound spines, towers of books on the floor leaning against the shelves, books open on tables, books spilling onto chairs. Hundreds of visible spines, varied bindings (leather, cloth, gilt, vellum), spines visibly OLD. NEVER a sparse "tasteful" library — books overflow.

━━━ COZY RESIDENT (always feature in the scene — peripheral, NOT centered) ━━━
${creature}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

${blocks.COZY_INDOOR_CLUTTER_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ BOOKISH-SANCTUARY DNA ━━━
The ROOM and the BOOKS are the subject. Render with obsessive cozy detail: floor-to-ceiling shelves overflowing with leather spines, towers of books leaning, rolling brass ladder, deep leather armchair worn smooth, brass desk-lamp with a green shade pooling honey-amber, Persian rug deep-pile, magnifying glass on a brass chain, fountain pen on letter, ceramic mug steaming half-drunk, candles dripped wax, dust motes in the lamp-beam. The cute critter resident is doing something cozy — sleeping on a stack of books, peeking out between the spines, dozing in the leather armchair, perched on a high shelf — small but charming. Artbook-quality rendering.

━━━ COMPOSITION ━━━
Wide or mid-wide interior view. Architecture, books, and furnishings fill 70-85% of the frame. Hundreds of book-spines visibly varied (leather / cloth / gilt). WARM-amber lamp-light or candlelight is non-negotiable. Cozy palette: warm honey-amber + leather-oxblood + walnut-brown + brass-glint + cream parchment + emerald or oxblood velvet accents. Critter is small, peripheral, NOT center-frame. Maximum cozy-library saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
