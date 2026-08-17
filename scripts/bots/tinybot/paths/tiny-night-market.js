const pools = require('../pools');
const blocks = require('../shared-blocks');

// TinyBot Stage N2 (SHADOW) — tiny-night-market. A lantern-lit miniature night
// market: rows of tiny food stalls, paper lanterns and string lights, steam off
// bead-sized kettles, a canal of reflected light. SCENE pool = the layered
// world; CAST pool = cute critter vendors + shoppers (~75% / ~35% second hand).
// Signature: jewel-like warm glow in the dark, reflections on wet ground.
module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const scene = picker.pickWithRecency(pools.TINY_NIGHT_MARKET, 'tiny_night_market');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // Cast is MANDATORY here (unlike other TinyBot paths): "market/vendor" is such
  // a strong HUMAN prior that Flux inserts tiny PEOPLE as shopkeepers unless a
  // critter is explicitly cast into that role. Always ≥1 critter (the vendor),
  // ~45% a second (a shopper), framed as the market-folk so critters win the
  // vendor slot instead of humans. (R1 fix, 2026-08-16 — R0 rendered humans 4/6.)
  const cast = [picker.pickWithRecency(pools.TINY_NIGHT_MARKET_CAST, 'tiny_night_market_cast')];
  if (Math.random() < 0.45) {
    const second = picker.pickWithRecency(pools.TINY_NIGHT_MARKET_CAST, 'tiny_night_market_cast');
    if (second !== cast[0]) cast.push(second);
  }
  const castBlock = `\n━━━ THE MARKET-FOLK (the tiny ANIMALS who run + visit this market — caught mid-action) ━━━\n${cast.join(
    '\n'
  )}`;

  return `You are a master model-maker AND storyteller writing CUTE, cozy MINIATURE NIGHT-MARKET scenes for TinyBot. A dollhouse-scale lantern-lit night market glowing in the dark — rows of tiny food stalls, paper lanterns and string lights overhead, steam curling off bead-sized kettles, a canal or wet lane mirroring all the light. The MARKET is the hero, a lived-in, bustling little world run and visited entirely by TINY ANIMALS (mice, hedgehogs, foxes, bunnies) — never a single object posed on a bare surface, and never any human beings. Storybook-adorable, jewel-like, makes you want to wander in. Output wraps with style prefix + suffix.

${blocks.TILT_SHIFT_MINIATURE_BLOCK}

${blocks.OBSESSIVE_MICRO_DETAIL_BLOCK}

${blocks.CLEVER_CUTE_WHOA_BLOCK}

${blocks.NO_HUMANS_BLOCK}

${blocks.IMPOSSIBLE_BEAUTY_BLOCK}

━━━ THE MINIATURE NIGHT MARKET (stage the scene here, keeping its foreground / midground / far-distance layers) ━━━
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

━━━ THE MARKET-FOLK ARE TINY ANIMALS — NEVER PEOPLE (NON-NEGOTIABLE) ━━━
Every vendor behind every stall and every shopper in the lane is a small woodland CREATURE — a mouse ladling soup, a hedgehog stringing lanterns, a fox at the grill, a bunny with a basket. There are ABSOLUTELY NO human beings anywhere in this scene: no shopkeeper, no customer, no passer-by, no child, no silhouette of a person. If a figure appears, it is an ANIMAL. This is a world of little critters.

━━━ NO WORDS OR LETTERING ━━━
Signs, awnings, menu-boards and lanterns carry ONLY simple decorative marks, symbols, or are left blank — NEVER readable letters, words, numbers, or written characters of any language. No text anywhere.

━━━ NIGHT-MARKET DNA ━━━
This is a MODEL NIGHT MARKET — every stall fits on your fingertip. Render with master-modelmaker obsession: matchbox stalls with striped awnings, thread-thin string lights and pinhead paper lanterns, thimble kettles breathing real steam, bead-sized dumplings and skewers, sugar-cube crates of miniature produce, resin-drop lightbulbs glowing warm. The SIGNATURE is WARM GLOW IN THE DARK — hanging bulbs, lantern-light, stall-glow, and long reflections doubled on wet cobbles or a black canal. Jewel-like warm amber with a few soft candy accents; NO harsh neon. Lived-in and bustling: hanging wares, open awnings, lamplit crates, curling steam. Tilt-shift shallow DOF makes the real feel dollhouse.

━━━ COMPOSITION — A CANDID STORYBOOK MOMENT, NOT A CATALOG SHOT ━━━
Wide or mid-wide view down a lantern-lit market lane like a model layout. Build MULTIPLE DEPTH LAYERS: a near stall detail (steaming kettle, glowing wares), the crowded midground of lit stalls and hanging lanterns, and a far distance fading into warm haze. Something happening — steam rising, lanterns swaying, a critter minding a stall. Leave room to breathe; NOT a centered product shot, NOT one object on a bare surface. Tilt-shift shallow DOF, obsessive stall + lantern detail, reflections on wet ground. Palette dictated by LIGHTING + WEATHER + VIBE above (respect them even over "warm cozy" if they call for a colder cast).

Output ONLY the raw 70-100 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
