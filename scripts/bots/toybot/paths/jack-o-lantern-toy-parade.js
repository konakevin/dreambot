/**
 * AlphaBot candidate — jack-o-lantern-toy-parade (destination: ToyBot).
 *
 * A whimsical Halloween parade of vintage LITHO-PRINTED TIN WIND-UP TOYS
 * shaped like grinning jack-o-lanterns — real pressed-tin wind-up toys
 * (never a real carved pumpkin, never alive, never CGI), caught mid-step /
 * mid-roll with clockwork keys half-wound. Identity is CLONED byte-faithful
 * from ToyBot's proven tin-toy-parade path (tin_toy_diorama material,
 * flux-1.1-pro / flux-1.1-pro-ultra, PROMPT_PREFIX/PROMPT_SUFFIX from
 * shared-blocks.js) — see scripts/bots/toybot/paths/tin-toy-parade.js for
 * the sibling. A path proven under the wrong config proves nothing, so this
 * file writes ToyBot's own material identity directly into the returned
 * brief rather than relying on AlphaBot's bot-level medium config.
 *
 * AXES (bespoke to this path, not shared with tin-toy-parade or any other):
 *   1. SCENE (pool)             — the Halloween toy-town parade-world.
 *   2. PIECES (pool)            — the wind-up jack-o-lantern-toy cast, mid-action.
 *   3. COMPANION TIN TOY (inline, optional ~40%) — a second autumn tin toy
 *      riding along (black cat / bat / ghost / spider / owl / skeleton...).
 *   4. LIGHTING / MACRO DIORAMA MOOD (inline)   — the cinematic-lighting axis.
 *   5. CAMERA FRAMING (sharedDNA.camera)        — bot-wide shared axis.
 *   6. MONEY-SHOT — THE KEY-WOUND MOMENT (rolled ~50%) — a macro hero-detail
 *      of a clockwork key mid-turn on one toy's back. Optional, not baked
 *      into every seed entry, so it stays a special occasion rather than
 *      homogenizing every render into the same close-up.
 *
 * NON-NEGOTIABLE TEMPLATE MANDATE: every figure is affirmatively a real
 * pressed-tin WIND-UP TOY shaped like a jack-o-lantern — a printed-on
 * (never carved) grinning face, a clockwork wind-up key, tin-panel seams —
 * never a real carved pumpkin, never CGI, never alive — and always caught
 * IN MOTION (mid-step / mid-roll / mid-waddle), never posed like a static
 * shelf display. PLAYFUL and FRIENDLY throughout; never genuine horror,
 * gore, or real scares (family-friendly Halloween).
 *
 * Self-contained function-form path (AlphaBot CANDIDATES contract, see
 * ALPHABOT.md "Workflow"). Requires its own seed pools directly as JSON —
 * no shared pools.js edits needed to render this path standalone.
 */

const SCENES = require('../seeds/jack_o_lantern_toy_parade_scenes.json');
const PIECES = require('../seeds/jack_o_lantern_toy_parade_pieces.json');

// Short fixed lists — inline, no generated pool needed (a handful of
// concrete options doesn't need Sonnet variety generation).
const COMPANION_TIN_TOYS = [
  'a small litho-tin black-cat toy arching its back on tiny tin paws, tail a stiff printed curl',
  'a tin bat toy on a thin wire, wings clacking as it swoops beside the parade',
  'a wind-up tin ghost toy rolling on a hidden wheel, printed sheet-fold wrinkles catching the light',
  'a tin witch-hat spinning-top toy wobbling along the parade route',
  'a tiny tin spider toy dangling and bobbing on a coiled-wire thread',
  'a litho-tin owl toy perched on a tin fence-post, printed round eyes wide',
  'a tin skeleton toy marching stiffly, printed rib-lines and a wind-up hip joint',
  'a tin candy-corn wagon toy trundling along on four small wheels',
];

const LIGHTING_MOODS = [
  'tungsten workshop-lamp light casting long dramatic tin shadows',
  'blue autumn dusk with a warm porch-light glow spilling across the parade',
  'orange-and-purple string-light Halloween-carnival glow strung overhead',
  'a harvest moon backlighting the toys through bare skeletal tree branches',
  'candlelit jack-o-lantern glow reflecting warm orange across every tin panel',
  'foggy graveyard moonlight with a cool blue rim-light on the tin toys',
  'low amber sunset streaming sideways across the printed-tin procession',
  'a cozy attic-window shaft of light with dust motes drifting over the toys',
];

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(SCENES, 'jack_o_lantern_toy_parade_scene');

  const pieces = [picker.pickWithRecency(PIECES, 'jack_o_lantern_toy_parade_piece')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(PIECES, 'jack_o_lantern_toy_parade_piece');
    if (second !== pieces[0]) pieces.push(second);
  }

  // Companion autumn tin toy — optional, ~40%, never mandatory (avoids
  // homogenizing every render around the same second character).
  let companionBlock = '';
  if (Math.random() < 0.4) {
    const companion = COMPANION_TIN_TOYS[Math.floor(Math.random() * COMPANION_TIN_TOYS.length)];
    companionBlock = `\nA companion autumn tin toy shares the scene: ${companion}.`;
  }

  const lighting = LIGHTING_MOODS[Math.floor(Math.random() * LIGHTING_MOODS.length)];

  // MONEY-SHOT AXIS — the KEY-WOUND MOMENT. Rolled ~50% so the macro
  // key-detail hero shot is a special occasion, not every render (never make
  // a signature feature mandatory on every entry). When it hits, the key is
  // a near-macro DETAIL within a still-readable frame — never a crop so
  // tight the parade/scene disappears.
  const keyMoment =
    Math.random() < 0.5
      ? `\n\n━━━ MONEY SHOT — THE KEY-WOUND MOMENT ━━━\nMake one foreground jack-o-lantern tin toy's wind-up key the near-macro hero-detail of this shot: turn that toy three-quarters toward the camera so its grinning face AND a large exposed clockwork key on its near, camera-facing flank are BOTH simultaneously visible in frame — the key must be on the side turned toward the lens, never on its back or its far side where the camera cannot see it. Caught mid-turn, a hot rim of light glinting off its teeth, one last click implied. Keep the rest of the parade clearly readable in the mid/background behind it — this is a hero DETAIL, never a crop so tight the parade disappears.`
      : '';

  return `You are a macro collectible photographer shooting a whimsical Halloween parade of vintage LITHO-PRINTED TIN WIND-UP TOYS shaped like jack-o-lanterns, in the same charming flat-lithographed NOVELTY-CHARACTER tin-toy tradition as classic vintage tin cats, rabbits, and clowns: a smooth continuous painted-tin shell with a simple stamped body and a plain exposed wind-up key. A real vintage tin-toy diorama on a table, photographed warm and playful, never scary. 1950s-60s tin-toy tradition reimagined for Halloween. Photoreal cinematic macro, shallow depth of field.

━━━ NON-NEGOTIABLE — TOY IDENTITY ━━━
Every figure is affirmatively a real pressed litho-TIN WIND-UP TOY shaped like a jack-o-lantern: ONE continuous round pumpkin-shaped tin shell IS the entire body — there is no separate humanoid head-and-torso, no robot-style ball-jointed limbs, no second face lower on the body. Small stubby tin legs, tin wheels, or a wheelbase, and small tin arms attach directly to that single round shell, same as a classic tin roly-poly novelty toy. Its ONE grinning face is a flat printed lithograph fused once to the front of that round shell — never repeated anywhere else on the toy. That same hard stamped-tin panel construction (visible tab-and-slot seams, lithographed printing) wraps the full curve of the shell down to its stubby feet or wheelbase, and it has a clockwork wind-up key. Every toy is caught IN MOTION — mid-step on stubby tin feet, mid-roll on tin wheels, or mid-waddle — never standing still or posed like a shelf display. The tabletop is populated ONLY by these stamped-tin toy figures and their tin-toy props (tin fences, tin lanterns, tin tombstones) — every object in frame shares the same hard stamped-metal material.

━━━ THE PARADE-WORLD ━━━
${scene}

━━━ THE JACK-O-LANTERN TIN TOYS — the clockwork stars of the parade ━━━
${pieces.map((p, i) => `${i + 1}. ${p}`).join('\n')}${companionBlock}
The parade is in motion — toys waddling, rolling, marching, a key half-wound. PLAYFUL and FRIENDLY, grinning jack-o-lantern faces, never a genuine scare.
${keyMoment}

━━━ THE MATERIAL LOOK ━━━
EVERYTHING is vintage LITHOGRAPHED PRESSED TIN: colorful printed-on detail (the grinning jack-o-lantern face, rivets, seams, tiny painted vine-stems, all printed on the metal), pressed-tin body panels with tab-and-slot seams, clockwork wind-up keys, slight patina, tiny scratches, a warm enamel sheen. Warm ${lighting}. Tilt-shift macro, every surface hard stamped metal catching a reflected highlight, tactile tin texture throughout the whole frame.

━━━ CAMERA + FRAMING ━━━
${sharedDNA.camera}
Frame the parade with depth: a foreground jack-o-lantern tin toy mid-step, the procession and printed-tin toy-town receding behind, a sense of clockwork motion.

━━━ MOOD ━━━
${vibeDirective.slice(0, 150)}

Output ONLY the 80-110 word Flux prompt, comma-separated. NO preamble, NO headers, NO ━━━ markers, NO "render as" suffixes. Start immediately with the scene description. End with: no text, no words, no letters, no watermarks, masterwork composition, hyper detailed.`;
};
