const pools = require('../pools');
const blocks = require('../shared-blocks');

// TinyBot Stage N3 (SHADOW) — tiny-carnival. A miniature fairground glowing at
// dusk/night: a lit Ferris wheel, a carousel of carved animals, striped tents,
// bunting, game stalls, string lights. SCENE pool = the layered fairground
// world; CAST pool = cute critters riding + running booths (~75% / ~35%).
// Signature: thousands of tiny warm bulbs, festive twinkle, damp-ground glow.
module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TINY_CARNIVAL, 'tiny_carnival');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // Cast is MANDATORY here (as tiny-night-market): "fairground/carnival" is a
  // strong HUMAN prior (riders, crowds, barkers) that makes Flux insert tiny
  // PEOPLE unless critters are explicitly cast into the ride/booth roles. Always
  // ≥1 critter, ~45% a second, framed as the fair-folk so critters win over
  // humans. (Applied proactively from the tiny-night-market R0 lesson, 2026-08-16.)
  const cast = [picker.pickWithRecency(pools.TINY_CARNIVAL_CAST, 'tiny_carnival_cast')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(pools.TINY_CARNIVAL_CAST, 'tiny_carnival_cast');
    if (second !== cast[0]) cast.push(second);
  }
  const castBlock = `\n━━━ THE FAIR-FOLK (the tiny ANIMALS who ride + run this fair — caught mid-action) ━━━\n${cast.join(
    '\n'
  )}`;

  return `You are a master model-maker AND storyteller writing CUTE, joyful MINIATURE CARNIVAL scenes for TinyBot. A dollhouse-scale fairground twinkling at dusk — a lit Ferris wheel, a carousel of carved animals, striped big-top tents, bunting, game stalls, string lights everywhere. The FAIRGROUND is the hero, a lived-in, twinkling little world in motion, ridden and run entirely by TINY ANIMALS (mice, bunnies, hedgehogs, foxes) — never a single object posed on a bare surface, and never any human beings. Storybook-magical, makes you grin. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MINIATURE FAIRGROUND (stage the scene here, keeping its foreground / midground / far-distance layers) ━━━
${scene}
${castBlock}

${blocks.varietyAxesSection(sharedDNA)}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ THE FAIR-FOLK ARE TINY ANIMALS — NEVER PEOPLE (NON-NEGOTIABLE) ━━━
This is a world inhabited ONLY by small woodland CREATURES — mice, bunnies, foxes, hedgehogs, fawns, squirrels. EVERY single figure in the scene is one of these little animals: the rider in each gondola is a tiny animal, every seat on the carousel holds a tiny animal, the stall-keeper is a tiny animal, anyone on the path is a tiny animal. The ONLY inhabitants of this entire world are little creatures — there is simply no such thing as a person here. Keep the grounds open and uncrowded; the LIGHTS + RIDES carry the festive life, and the few figures present are all little animals.

━━━ NO WORDS OR LETTERING ━━━
Signs, booths, ticket kiosks and banners carry ONLY simple decorative marks, symbols, or are left blank — NEVER readable letters, words, numbers, or written characters of any language. No text anywhere.

━━━ CARNIVAL DNA ━━━
This is a MODEL FAIRGROUND — every ride fits in your palm. Render with master-modelmaker obsession: a Ferris wheel strung with bead-sized bulbs and thimble gondolas, a carousel of hand-painted carved horses under a striped canopy, matchbox ticket booths, thread-thin bunting, striped big-top tents, tiny plush prizes on game-stall shelves. The SIGNATURE is FESTIVE LIGHT — thousands of tiny warm bulbs, glowing rides, string lights, chase-lights, and long reflections on damp ground. Movement everywhere: a turning wheel, a spinning carousel, fluttering flags. Warm bulb-amber with a few candy accent colors; NO harsh neon. Tilt-shift shallow DOF makes the real feel dollhouse.

━━━ COMPOSITION — A CANDID STORYBOOK MOMENT, NOT A CATALOG SHOT ━━━
Wide or mid-wide view across the lit fairground like a model layout. Build MULTIPLE DEPTH LAYERS: a near ride or stall detail (carousel horse, glowing booth), the lit midground of the fair (the Ferris wheel, tents, midway), and a far distance fading into dusk haze. Something in MOTION — the wheel turning, the carousel spinning, a critter mid-ride. Leave room to breathe; NOT a centered product shot, NOT one ride alone on a bare surface. Tilt-shift shallow DOF, obsessive bulb + ride detail, reflections on damp ground. Palette dictated by LIGHTING + WEATHER + VIBE above (respect them even over "warm cozy" if they call for a colder cast).

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
