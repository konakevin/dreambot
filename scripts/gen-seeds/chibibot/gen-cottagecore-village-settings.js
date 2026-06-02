#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cottagecore_village_settings.json',
  total: 200,
  batch: 25,
  metaPrompt: (
    n
  ) => `You are writing \${n} COTTAGECORE-VILLAGE SETTINGS for ChibiBot cottagecore-village — cozy cottagecore-biome villages that are the HERO of the frame. NOT a single cottage — a VILLAGE (cluster of multiple dwellings).

Each entry: 25-40 words. ONE specific village. NO creatures, NO time-of-day, NO weather verbs.

━━━ THE BAR — CHIBI-SCALE COZY COTTAGECORE VILLAGE I WANT TO LIVE IN ━━━

The viewer's reaction: "I want to move into that cottagecore village." Cluster of multiple dwellings. Heavily detailed lived-in. Studio Ghibli / Howl-Moving-Castle / Beatrix-Potter / Whisper-of-the-Heart aesthetic.

━━━ 11 SUB-TYPES — MUST VARY ACROSS THE POOL — distribute roughly evenly ━━━

- 10% THATCHED-ROOF CLUSTER (cluster of stone-and-thatched-roof cottages along a flower-edged lane, cottage-garden roses climbing every wall, half-timbered walls, smoke-curling chimneys)
- 10% WINDMILL VILLAGE (cluster of cottages around a giant wooden windmill in a wheat-field, dirt-lane between buildings, wheat-stacks scattered, windmill-sails turning slowly)
- 10% LAVENDER-FIELD COTTAGES (cluster of cottages with rows of lavender fields between them, lavender-bunches drying on porches, stone-pavement, cottage-garden roses, distant rolling hills)
- 10% APPLE-ORCHARD HAMLET (cluster of cottages nestled in a fall apple-orchard, apple-laden branches arching over rooftops, wood-fence enclosures, harvest-baskets, cider-press in a corner)
- 10% WISTERIA-TUNNEL VILLAGE (cluster of cottages connected by wisteria-tunnel arches dripping purple-and-white flowers, stone-pavement, lace-curtain windows, cottage-garden hydrangeas)
- 10% COBBLESTONE LANE (cluster of half-timbered cottages along a winding cobblestone lane, hanging-basket flowers, swinging cottage-signs (bakery, post, tea-shop), warm cobble-textured pavement)
- 10% CANAL-SIDE COTTAGES (cluster of pastel cottages lining a meandering canal, painted-narrowboats moored, stone-bridges crossing the water, climbing wisteria on bridges, lily-pads in the canal)
- 5% BEE-SKEP VILLAGE (cluster of cottages with active bee-skeps in their gardens, wildflower meadow surrounding, bee-laden lavender bushes, honey-pot signage, cottage-garden roses everywhere)
- 10% MUSHROOM-COTTAGE CLUSTER (Smurf-village-style cluster of giant-mushroom-cottages with carved-window-doors, mossy floors, fairy-light strands, dewdrop-flowers, mushroom-rooftops in red-cap and amanita variations)
- 5% FAIRY-GLADE HAMLET (cluster of fairy-tale-fairy-cottages in a moss-covered glade, glowing flower-lanterns, mushroom-stool seats, vine-wrapped doorways, fairy-light strands woven through trees)
- 10% STONE-BRIDGE COTTAGES (cluster of cottages clustered around an arched stone-bridge over a stream, climbing-vine-wrapped bridge, ducks on the stream, cottage-garden flowers along the bank, weeping-willow nearby)

━━━ MANDATORY: COZY-DECOR ELEMENTS IN EVERY ENTRY ━━━

Each entry MUST visibly include at least 3 village elements that establish the biome (architecture / lighting / flora / atmosphere / props).

━━━ HARD BANS ━━━

- NO creatures or characters
- NO time / weather / activity verbs
- NO single solo cottage — must be a VILLAGE (cluster of multiple dwellings)
- NO dark / moody / abandoned villages
- NO snow / NO desert / NO underwater / NO ultra-modern architecture

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
