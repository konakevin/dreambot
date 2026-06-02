const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.MUSHROOM_VILLAGE, 'mushroom_village');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');
  const includeCreature = Math.random() < 0.5;
  const creature = includeCreature
    ? picker.pickWithRecency(pools.TINY_CREATURES, 'tiny_creature')
    : null;

  return `You are a master model-maker writing MUSHROOM-VILLAGE scenes for TinyBot. Fungal civilization at miniature scale — toadstool houses with carved doors and warm windows, acorn-cap roofs, lantern-mushrooms lighting moss paths, spore-light streetlamps, lichen carpets, fern canopies overhead, beetle-shell carts. Smurfs / Brambly Hedge / Beatrix Potter / Studio Ghibli energy at tilt-shift miniature scale. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MUSHROOM-VILLAGE SCENE ━━━
${scene}
${creature ? `\n━━━ OPTIONAL TINY INHABITANT ━━━\n${creature}` : ''}

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

━━━ MUSHROOM-VILLAGE DNA ━━━
This is a TOADSTOOL CIVILIZATION rendered as a tiny model. Mushrooms are HOUSES — red-and-white amanita with carved doors, brown porcini towers, golden chanterelle terraced cottages, pale puffball domes. Tiny windows glow warm from within. Acorn-cup chimneys, twig-bridges, leaf-shingle awnings, snail-shell mailboxes, beetle-elytra weather vanes. Forest floor as the world: moss carpets, fern canopies overhead, fallen leaves as plazas, pebbles as paving stones. Tilt-shift shallow DOF makes the real woodland feel dollhouse. Magical but grounded — these are real fungi rendered with model-village details, not cartoon mushrooms.

━━━ COMPOSITION ━━━
Wide or mid-wide elevated view looking down at the mushroom village like a model railway forest layout, OR macro-close on a single toadstool house with neighbors visible behind. Tilt-shift shallow DOF. Obsessive miniature detail at every fungal surface. Palette dictated by LIGHTING + WEATHER + VIBE blocks above — let the rolled axes win, even if the scene seed implies cozy.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
