/**
 * ToyBot snow-globe-world (2026-09-22, SHADOW) — function-form, mirroring tin-toy-parade's shape.
 *
 * WHY THIS PATH. ToyBot has 23 live paths and every one of them photographs toys ON a surface —
 * a shelf, a table, a diorama, a floor. A snow globe is a CONTAINED WORLD seen through curved
 * glass: a different optical and compositional problem (refraction, weather suspended in water,
 * a rim of light instead of a frame edge). That is a new KIND of ToyBot picture, not a new
 * subject, which is why it earned a path.
 *
 * THE DULL FAILURE THIS IS BUILT AGAINST. A snow globe photographed on a shelf is the gift-shop
 * product shot: competent, lifeless, and something everyone has already seen. The delight is in
 * treating the world INSIDE as a real place with weather and a story, and the glass as a WINDOW
 * into it rather than an object on a table.
 *
 * Axes: WORLD (the sealed place, the hero — leads the prompt) + WEATHER (what the water and the
 * flakes are doing, the money shot) + GLASS (refraction / trapped bubbles / wear at the curve, and
 * a band of base colour along the very bottom edge — it sits LAST so it stays a cropped arc) +
 * MOMENT (a story beat inside, on a 0.7 gate).
 *
 * TWO load-bearing decisions, both taken from hard-won lessons:
 *
 * 1. THE CAMERA IS HAND-AUTHORED IN THIS FILE and the path deliberately does NOT consume
 *    `sharedDNA.camera`. ToyBot's shared CAMERA_FRAMING pool is figure-centric and real-world-
 *    surface-centric ("drone-overhead establishing shot of the full kitchen counter", "figures in
 *    the middle distance with foreground grass blades") — on a path whose entire identity is the
 *    camera being pressed against the glass, that pool would hijack the composition (the
 *    camera-framing-as-LAW rot). The six vantages below are all inside the one family, are
 *    hero-agnostic, name where the CAMERA sits (never a posture), and carry no time of day.
 *
 * 2. DEEP FOCUS, not the bot's usual shallow. Every other Stage-O medium ends "shallow depth of
 *    field", which is right for a tin robot on a table. Here a shallow-DOF product-shot framing
 *    is precisely the failure mode: it blurs the world inside into a bokeh prop. So the medium
 *    prefix and the template both ask for the little world crisp and deep, with only the snow in
 *    front of the glass allowed to go soft.
 */

const globeWorlds = require('../seeds/toybot_snow_globe_worlds.json');
const globeWeather = require('../seeds/toybot_snow_globe_weather.json');
const globeVessel = require('../seeds/toybot_snow_globe_vessel.json');
const globeMoments = require('../seeds/toybot_snow_globe_moments.json');

// HAND-AUTHORED, never generated (see decision 1 above). All six are the same shot — the camera
// against the glass, the world filling the frame — varied only in where it stands and what the
// curve is doing at the edge.
const GLASS_VANTAGES = [
  'straight into the world at its own eye level, its horizon running across the middle of the frame and the bright curve of the glass just clipping the top and bottom corners',
  'a little above the world looking gently down into it, so the roads and the rooftops read as roads and rooftops and the far ground stacks back behind them',
  'low down at the foot of the world looking up along its main way, its buildings or trees rising on both sides and the curve of the glass arcing overhead as one thin bright line',
  'close in on one side, so the tallest thing in the world runs up the left of the frame and the rest of the place recedes away to the right',
  'in at the very edge of the curve, where the far side of the world bends and stretches and doubles faintly in the thickness of the glass while the middle of the world stays tack sharp',
  'pressed so close that the nearest snow is huge and soft and out of focus across the bottom of the frame while the little world behind it stays crisp all the way to its far distance',
];

module.exports = ({ vibeDirective, picker }) => {
  const world = picker.pickWithRecency(globeWorlds, 'snow_globe_world');
  const weather = picker.pickWithRecency(globeWeather, 'snow_globe_weather');
  const vessel = picker.pickWithRecency(globeVessel, 'snow_globe_vessel');
  const vantage = picker.pickWithRecency(GLASS_VANTAGES, 'snow_globe_vantage');

  // 0.7 — a story beat inside is what makes the little place alive rather than a model, so it
  // fires most of the time; the other ~30% are pure place-and-weather (a city at night, an
  // aurora), which are strong on their own and keep the beat from feeling compulsory.
  const moment =
    Math.random() < 0.7 ? picker.pickWithRecency(globeMoments, 'snow_globe_moment') : null;

  return `You are a macro photographer shooting a whole little world that lives sealed inside a glass snow globe, for ToyBot. A real hand-painted miniature world in real water behind real curved glass, photographed from inches away. Photoreal, cinematic, richly coloured.

⚠️⚠️⚠️ THE FRAMING IS THE WHOLE POINT — THE GLASS IS CROPPED, THE WORLD FILLS THE FRAME ⚠️⚠️⚠️
The little WORLD fills the frame edge to edge and is rendered SHARP and DEEP — its far side, its distant ground and its own small lights all crisp and fully readable, front to back. The glass is present as ONE bright wet ARC across the top corners of the picture that RUNS OFF the picture's edges: a curved wall we are looking THROUGH, cut away by the frame. Weather hangs in the water in front of the world and between its buildings, each speck separate and caught in the light.

Write the WORLD as the subject of the photograph and the glass as the thing we look through. The glass appears in the prompt ONLY as that cropped arc at the top corners — so the prompt never gives it a base, a stand, a foot, a shelf, a table or a room around it, and never describes it as a whole object standing anywhere. If the whole vessel ends up in frame with something visible behind it, the render has FAILED. If there is no curved glass in the picture at all, the render has equally FAILED. It must read as a WINDOW INTO A REAL PLACE that happens to be held in water behind glass.

━━━ THE WORLD INSIDE — the hero, and it opens the prompt ━━━
${world}
This place is real and it continues past the frame: its own lit windows, its own road going somewhere, its own far side.

━━━ THE WEATHER IN THE WATER — the money shot ━━━
${weather}
The flakes read as real weather, caught mid-fall: each one its own separate lit speck with its own soft edge and its own shadow side.
${
  moment
    ? `
━━━ THE MOMENT INSIDE — something is happening right now ━━━
${moment}
Every figure is a tiny hand-painted miniature, grain-of-rice scale, a face suggested with two dabs of paint — part of the place, never a portrait.
`
    : `
━━━ NOBODY ABOUT ━━━
The little world holds only its own life right now: the lights burning in its windows, the weather coming down on it, and the road waiting.
`
}
━━━ THE GLASS — the cropped arc at the top corners, and what it does to the light ━━━
${vessel}

━━━ EVERY FIGURE IN THE WORLD ━━━
Any figure anywhere in this world — the one doing the thing, and anyone else the street would have — is a TINY HAND-PAINTED MINIATURE at grain-of-rice scale, its face two dabs of paint, its coat one confident block of colour. Name each one that way as you write it, so the little world stays populated by painted people rather than by photographs of real ones.

━━━ IF TWO PICKS DISAGREE ━━━
The WORLD above is fixed. If the moment or the weather names something the world does not have — a harbour on a forest road, a ferris wheel in a fishing village, falling leaves in a blizzard — keep the world exactly as written and adapt the other pick to what is actually there, or leave it out. One true place beats a forced combination.

━━━ THE WARMTH FROM OUTSIDE ━━━
This is ONE continuous shot of one continuous space, the way a real camera catches a lit thing in a warm room. Whatever is beyond the glass is present ONLY as one bright warm highlight riding the curve at the edge of frame, and that warmth comes back INTO the world as a glint along its wet rooftops and a warm edge on the nearest snow. Inside, the weather is going hard; the light coming in is still and warm.

━━━ THE MATERIAL LOOK ━━━
The world is a REAL hand-painted miniature: modelled plaster and resin and painted tin, visible brush-marks, rounded hand-sculpted forms, flock snow glued along the roof ridges where the weather calls for snow, tiny grain-of-wheat bulbs burning behind the windows. The glass has real thickness and a faint green cast where it bends away. The water is real water, faintly slow, with a soft drift of sediment low down. Really photographed, with real texture.

━━━ THE CAMERA ━━━
${vantage}

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

━━━ WRITE THE FLUX PROMPT IN THIS ORDER ━━━
1. The world inside and its defining mass, named first, filling the frame in deep sharp focus.
2. Its own lights, its road, its far distance.
3. The snow or other weather hanging in the water, per-flake, and the light catching it.${moment ? '\n4. The moment happening inside, with its tiny painted figures.' : ''}
${moment ? '5' : '4'}. One short clause naming the flat panels BY NAME, because whichever one you leave out is the one that comes back lettered: every shutter, door panel, awning, hull, hanging shop-bracket AND the whole shopfront band above the windows is a plain smooth painted surface wearing at most one simple painted picture — a loaf, a fish, a star, a sprig, a curl of gilt.
${moment ? '6' : '5'}. The glass last, and ONLY as one bright wet arc across the top corners of the frame, running off the picture's edges.

━━━ FAILURE CONDITIONS ━━━
• The whole vessel ends up in frame, with a stand under it and a room behind it, rather than a window into the world → FAILED
• The world is small, blurred, or a single object on a bare white mound → FAILED
• The glass does anything more than bend the extreme corners → FAILED
• Any real human, real hand or real furniture in frame → FAILED
• Readable writing anywhere → FAILED

Describe only what IS present — never write a negation into the prompt.

LENGTH IS THE LAST AND LOUDEST RULE: output ONLY the raw 95-125 word scene description, comma-separated phrases. Name the world, its weather, its moment and the glass rim, and STOP. No preamble, no titles, no headers, no markers, no bold labels, no "render as" suffixes.`;
};
