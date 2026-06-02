#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_landscape_world_details.json',
  total: 100,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WORLD-DETAIL elements for ChibiBot cozy-landscape — the tiny architectural / nature / props that POPULATE a cozy world and prove the scene is alive. Each render picks 3 (pickN:3) so each entry must be distinct enough to layer with two others without overlap. These are the obsessive details that make a cozy world feel LIVED-IN.

Each entry: 10-20 words. ONE specific detail. NO time-of-day / weather / creature / activity language.

━━━ WHAT MAKES A GREAT ENTRY ━━━

- ONE concrete prop / feature / signature element that adds story-richness to a cozy world
- Specific material + scale + placement
- Picture-able as a single visible element in the wider scene
- Adds CHARM and LIVED-IN feeling without crowding the main world subject

━━━ CATEGORY DISTRIBUTION ━━━

- 20% architectural-detail (thatched roof with moss patches / wooden shutters painted teal with white trim / Dutch door split open / brass weather-vane shaped like a fox / climbing-rose trellis arching over a doorway / stained-glass-window glowing warm from inside)
- 15% pathway / walkway (cobblestone path winding between cottages / stepping-stone walk across a mossy lawn / pebble-mosaic patio with a single chair / wooden-plank walkway over a small pond / spiral stone steps up to a tower)
- 15% garden-detail (wildflower border along a path / window-box overflowing with pink geraniums / herb garden with tiny signs / vegetable patch with bamboo trellises / kitchen-garden with pumpkins and gourds / climbing morning-glories on a fence)
- 10% lantern / lighting (paper-lantern strung between two posts / brass hurricane-lantern hanging from a hook / glowing window cast warm light onto a path / candle in a glass jar on a windowsill / fairy-lights wrapped around a porch railing)
- 10% market / commerce (striped market-awning over a fruit stall / wooden barrel of apples beside a doorway / hand-painted shop sign hanging from chains / bushel-basket of flowers for sale / chalkboard menu on an easel)
- 10% water-feature (small wooden bridge over a stream / lily-pad pond with stone border / decorative birdbath with chipped paint / mossy fountain with trickling water / koi pond with stone lanterns at the edge)
- 10% laundry / domestic-evidence (laundry line strung with tiny clothes / quilts hung over a porch railing / wooden ladder leaning against a wall / wheelbarrow parked by a garden gate / rocking chair on a porch)
- 5% smoke / fire / hearth (chimney smoke curling skyward / outdoor fire-pit with logs / kettle on a hearth / wood-stove with cast-iron pot)
- 5% magical-detail (glowing mushroom cluster / sparkle-mist drifting between cottages / floating paper-lantern / fairy-light constellation / wisp of magic-glow rising from a chimney)

━━━ DEDUP ━━━

Dedup by: detail-type + concrete material/feature. "climbing roses on a trellis" and "trellis with climbing pink roses" are duplicates.

━━━ HARD BANS ━━━

- NO creatures or characters
- NO time/weather
- NO activity verbs (no "smoke pouring from chimney as someone cooks")
- NO modern-tech

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
