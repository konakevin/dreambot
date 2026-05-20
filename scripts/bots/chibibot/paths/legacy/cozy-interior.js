/**
 * CuddleBot cozy-interior path — beautiful Pixar/Studio-Ghibli interior
 * spaces are the hero. Snug fireplace reading-nook, sunlit kitchen with
 * pot bubbling on the stove, attic library, window-seat with rain on
 * panes, cottage-loft bedroom under exposed beams, tea-room with
 * floral wallpaper. A small cute critter resident is ALWAYS present —
 * peripheral, going about cozy-interior life.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.COZY_INTERIOR_SCENES, 'cozy_interior_scene');
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing COZY-INTERIOR scenes for CuddleBot — beautiful interior SPACES that the viewer wants to live in. Snug fireplace reading-nook, sunlit kitchen with bubbling pot, attic library, rain-window window-seat, cottage-loft bedroom under exposed beams, tea-room with floral wallpaper, fairy-light-strung sewing room, sun-drenched conservatory, hobbit-hole snug, Studio-Ghibli kitchen. The COZY ROOM and ATMOSPHERE are the hero — the architecture and warm light carry the scene. A small cute critter resident is ALWAYS present, peripheral. Pixar / Sanrio / Studio Ghibli / Howl's-Moving-Castle / Kiki's-Delivery-Service / Hobbit-hole / Beatrix-Potter aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE COZY-INTERIOR SCENE ━━━
${scene}

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

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COZY-INTERIOR DNA ━━━
The ROOM is the subject — not a backdrop. Render the cozy interior with obsessive detail: stone fireplace with crackling-fire glow, knit blanket draped over an armchair, bookshelf overflowing with volumes, exposed wooden beams, cast-iron pot bubbling on a wood-stove, copper kettle on a kitchen rack, pressed-flower frames on the wall, floral-wallpaper, woven rugs, lace curtains, cluttered tea-set on a coffee table, wax-dripping candles in brass holders, dried herbs hanging from rafters, mason jars of preserves, hand-knit cushions, framed botanical illustrations, throw pillows, stack of well-loved books with bookmarks. The room feels LIVED IN and LOVED — half-finished knitting on the armrest, baked-pie cooling on the windowsill, watering-can by a houseplant, slippers tucked under the chair. The cute critter resident is doing something cozy — curled in a knit blanket, reading a tiny book, sipping tea from a thimble, peeking out from under a quilt, watching rain on the window — small but charming. Artbook-quality rendering.

━━━ COMPOSITION ━━━
Wide or mid-wide interior view of the room — armchair-by-fire angle, kitchen-doorway angle, window-seat at side. Architecture and furnishings fill 70-85% of the frame. Tilt-shift or shallow DOF on a single charming detail OK. WARM-amber lighting from a fireplace, oil-lamp, candle, OR sun-pouring-through-a-window — interior MUST READ as warm-and-glowing. Cozy palette dominant: warm honey-amber + cream + soft sage-green + dusty-rose + warm wood-brown + cream wallpaper. Critter is small, peripheral, NOT center-frame. Maximum cozy-interior saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
