/**
 * ChibiBot rainy-interior path — written 2026-05-05 in the CuddleBot
 * cozy-interior pattern. Stormy night, you're INSIDE, a window separates
 * you from the rain. Warm-amber inside vs blue-grey storm outside is the
 * emotional anchor. A cute creature resident is always peripheral
 * (sleeping cat, fox curled by hearth, hedgehog on the reading-nook
 * cushion).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.RAINY_INTERIOR_SCENES, 'rainy_interior_scene');
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing RAINY-INTERIOR scenes for ChibiBot — beautiful interior SPACES on a stormy night, the viewer inside a warm private space with rain visibly streaming down a window. Snug bedroom with reading lamp + duvet, lo-fi desk by a window, café corner with rain on the glass, kitchen with a steaming kettle and rain-streaked window. The COZY ROOM + the WINDOW + the RAIN are the heroes — warm-amber inside contrasted against blue-grey storm outside. A small cute critter resident is ALWAYS present, peripheral. Pixar / Studio Ghibli / Beatrix-Potter / Howl's-Moving-Castle aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE RAINY-INTERIOR SCENE ━━━
${scene}

━━━ THE WINDOW IS MANDATORY ━━━
At least ONE prominent window or glass door is visible with rain visibly streaking down it (silver streaks, drumming on the panes, condensation fogging the corners). The view through the glass is dim, cool, blue-grey-rain. The contrast between INSIDE-WARM and OUTSIDE-COLD carries the emotional weight of the frame.

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

━━━ RAINY-INTERIOR DNA ━━━
The ROOM is the subject. Render the cozy interior with obsessive detail: warm-amber lamp pooling honey light, knit blanket draped on chair, stack of dog-eared paperbacks, ceramic mug steaming with tea, vinyl on the turntable, monstera trailing from a windowsill, dried herbs hanging, candle flickering, framed art on the wall. The room feels LIVED IN — half-finished knitting on the armrest, slippers tucked under the bed, mug ring on the table, blanket bunched. Rain visibly drumming the window — silver streaks, condensation at the corners, wet branches and dim grey storm-light beyond. The cute critter resident is doing something cozy — curled in a knit blanket, sleeping on a stack of books, peeking out from under a quilt, watching the rain on the glass — small but charming. Artbook-quality rendering.

━━━ COMPOSITION ━━━
Wide or mid-wide interior view of the cozy room. Architecture and furnishings fill 70-85% of the frame. Window with rain visibly active is in-frame. WARM-amber interior lighting is non-negotiable. Cozy palette: warm honey-amber + cream + soft sage + dusty-rose + warm wood-brown, contrasted by cool blue-grey rain outside. Critter is small, peripheral, NOT center-frame. Maximum cozy-interior saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
