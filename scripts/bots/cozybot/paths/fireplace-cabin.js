/**
 * CozyBot fireplace-cabin path — written 2026-05-05 in the CuddleBot
 * cozy-interior pattern. Wood, wool, fire, snow outside. The fire is the
 * dominant warm light source. A cute creature resident is always
 * peripheral (sleeping cat by hearth, fox curled on rug, owl on a beam).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.FIREPLACE_CABIN_SCENES, 'fireplace_cabin_scene');
  const creature = picker.pickWithRecency(pools.CUTE_CREATURES, 'creature');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are writing FIREPLACE-CABIN scenes for CozyBot — beautiful interior SPACES of a wood-and-wool cabin, lodge, mountain cottage, hytte, or alpine chalet, with the fireplace as the dominant light source. Snowy mountain cabin with stone hearth, Norwegian hytte with soapstone stove, alpine chalet with timber-frame and stone fireplace, Russian dacha with tile pechka, Japanese mountain teahouse with sunken irori. The COZY ROOM + the FIRE + the SNOW OUTSIDE are the heroes. A small cute critter resident is ALWAYS present, peripheral. Pixar / Studio Ghibli / Beatrix-Potter aesthetic. Output wraps with style prefix + suffix.

${blocks.CUTE_CUDDLY_COZY_BLOCK}

${blocks.STYLIZED_NOT_PHOTOREAL_BLOCK}

${blocks.NO_DARK_NO_INTENSE_BLOCK}

${blocks.NO_PEOPLE_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE FIREPLACE-CABIN SCENE ━━━
${scene}

━━━ THE FIRE IS MANDATORY ━━━
A roaring fireplace, wood stove, soapstone heater, pechka tile stove, or sunken irori hearth dominates the lighting. Fire-glow is the dominant warm light source — amber pooling onto wood floors, gold on stone surrounds, flickering shadows on the walls. Visible logs / embers / sparks / fire's living motion. Window or door reveals snow / pine forest / alpine peaks in cool blue beyond — making INSIDE feel safer.

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

━━━ FIREPLACE-CABIN DNA ━━━
The ROOM is the subject. Render the cabin interior with obsessive cozy detail: stone or tile fireplace blazing, sheepskin rug spread before the hearth, wool throws layered on chairs, copper kettle steaming on the stove, embroidered cushions piled, leather armchair worn smooth, dried herbs and copper pots hanging from beams, lantern on a hook, cast-iron pot on the irori or pechka, woven baskets, hand-loomed Persian or rosemaling rug, log-pile beside the hearth. Window-glimpse of snowy pines / blizzard / alpine peaks at twilight — making the inside feel safer. The cute critter resident is doing something cozy — curled on the sheepskin by the fire, peeking from under the throw, dozing on the leather armchair, watching the snow through the window — small but charming. Artbook-quality rendering.

━━━ COMPOSITION ━━━
Wide or mid-wide interior view. Architecture and furnishings fill 70-85% of the frame. Fire is in-frame and brightly burning — fire-glow dominates the warmth. Window or door showing cold/snow outside. Cozy palette: warm honey-amber from fire + chestnut wood + cream wool + sheepskin oat + soft sage, contrasted with cool blue-grey-snow outside. Critter is small, peripheral, NOT center-frame. Maximum cozy-cabin saturation.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
