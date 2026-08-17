const pools = require('../pools');
const blocks = require('../shared-blocks');

// TinyBot Stage N1 (SHADOW) — tiny-winter-village. A snowy miniature village
// diorama: snow-laden roofs, a frozen pond, string lights, a little winter
// market, warm windows in the blue dusk. SCENE pool = the layered constructed
// world; CAST pool = cute critters mid-action giving the village life (~75% /
// ~35% second hand, as tiny-vehicles). Signature contrast: cold blue snow vs
// warm amber light.
module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TINY_WINTER_VILLAGE, 'tiny_winter_village');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const cast = [];
  if (Math.random() < 0.75) {
    cast.push(picker.pickWithRecency(pools.TINY_WINTER_VILLAGE_CAST, 'tiny_winter_village_cast'));
    if (Math.random() < 0.35) {
      const second = picker.pickWithRecency(
        pools.TINY_WINTER_VILLAGE_CAST,
        'tiny_winter_village_cast'
      );
      if (second !== cast[0]) cast.push(second);
    }
  }
  const castBlock = cast.length
    ? `\n━━━ THE LITTLE CAST (small critters mid-action — warm life, NOT the hero) ━━━\n${cast.join('\n')}`
    : '';

  return `You are a master model-maker AND storyteller writing CUTE, cozy MINIATURE WINTER-VILLAGE scenes for TinyBot. A dollhouse-scale snowy village caught alive in the blue dusk — snow-laden matchbox cottages, a frozen skating pond, a tiny winter market, string lights and warm-glowing windows. The VILLAGE is the hero, a lived-in little world, not a single object posed on a bare surface. Storybook-adorable, makes you want to reach in. NO humans (peripheral distant silhouettes at most). Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MINIATURE WINTER VILLAGE (stage the scene here, keeping its foreground / midground / far-distance layers) ━━━
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

━━━ WINTER-VILLAGE DNA ━━━
This is a MODEL WINTER VILLAGE — every cottage fits in your palm. Render with master-modelmaker obsession: hand-laid stone walls the size of sugar cubes under real dried-grass thatch and thick snow-caps, thumb-sized chimneys with incense-stick smoke, resin-drop window glass glowing warm amber, thread-thin string lights, a glassy resin pond for ice, bottle-brush pines dusted white. The SIGNATURE is cold blue snow against warm amber light — deep blue snow-shadows, a single open doorway or lantern spilling gold. Lived-in at miniature scale: tiny footprints in fresh powder, matchstick woodpiles, thimble planters, bead-sized bonfires. Tilt-shift shallow DOF makes the real feel dollhouse.

━━━ COMPOSITION — A CANDID STORYBOOK MOMENT, NOT A CATALOG SHOT ━━━
Wide or mid-wide elevated view looking down at the snowy village like a model railway layout. Build MULTIPLE DEPTH LAYERS: a near detail (a lit doorway, the pond edge, a market stall), the village midground of snow-capped rooftops and glowing windows, and a far distance fading into soft snowfall haze. Something quietly happening — smoke curling, lights glowing, a critter mid-task. Leave room to breathe; NOT a centered product shot, NOT one object on a bare surface. Tilt-shift shallow DOF, obsessive snow + architecture detail. Palette dictated by LIGHTING + WEATHER + VIBE above (respect them even over "warm cozy" if they call for a colder cast).

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
