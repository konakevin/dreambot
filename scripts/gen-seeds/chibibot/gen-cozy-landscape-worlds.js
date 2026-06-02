#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cozy_landscape_worlds.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} COZY STORYBOOK WORLD descriptions for ChibiBot's cozy-landscape path — the magical SETTING that IS the hero of the frame. NOT just any landscape — a deliberately COZY, INVITING, cozy storybook / picture-book world where a tiny creature could live forever. The viewer should want to step INTO the frame and stay.

Each entry: 20-35 words. ONE specific cozy world with concrete geography + architecture + scale-anchor. NO creatures (separate axis). NO weather / time-of-day (separate axes). NO resident activity (separate axis). NO props beyond the world's intrinsic features (windows, doors, lanterns are intrinsic to a village; "candle on a table" is a prop axis).

━━━ THE BAR — WORLD AS HERO ━━━

Every world must (1) be UNMISTAKABLY COZY (warm, inviting, safe, idyllic), (2) have CLEAR SCALE (mid-wide landscape OR foreground-with-vista with foreground anchor), (3) include SPECIFIC ARCHITECTURE or NATURE FEATURES (cottages, bridges, paths, rooftops, mushroom-houses, stone walls, market stalls, treehouses), and (4) feel like a place that exists in a Studio Ghibli / Beatrix Potter / Pixar setpiece.

━━━ CATEGORY DISTRIBUTION ━━━

- 20% cozy-village (mushroom-cap village in a forest hollow with cobblestone paths between thatched-roof cottages / acorn-cottage cluster on a moss-carpet meadow with twig-handrail bridges / fairy-ring-village of bell-shaped huts under giant ferns / hilltop village of clay-tile-roofed cottages clustered around a market square)
- 15% cottage / single-home (lone storybook cottage with smoke curling from chimney perched on a wildflower hill / mossy stone cottage tucked under a rocky outcrop with climbing roses / treehouse cottage built into a giant oak with rope-bridge to the canopy / pumpkin-house cottage in an autumn pumpkin patch)
- 15% nature-vista (sun-dappled forest path winding between ancient mossy oaks toward a sunbeam clearing / wildflower meadow rolling toward distant blue mountains with a single tree on the horizon / cliffside meadow overlooking misty fjords with a stone footpath / rolling lavender field stretching to a distant farmhouse silhouette)
- 10% campfire / picnic clearing (cozy campfire clearing in a forest hollow with stone-circle hearth and log-stools / blanket-spread picnic on a hilltop with basket and lantern / firefly clearing with paper-lanterns strung between trees / bonfire ring on a beach cove at sunset with driftwood logs)
- 10% beach / waterside (sunset beach cove with tide-pools and a wooden dock and tiny boat / lighthouse on a rocky point with cottage at its base / canal-side village with stone bridges and reflected lights / lakeside cabin with paddleboat at a wooden dock)
- 10% market / town-square (cottagecore market square with striped awnings and flower-stalls and cobblestone paths / harvest festival square with pumpkins and bunting / spice-bazaar lane with hanging silks and brass lanterns / Christmas market square with wooden booths and snow-dusted roofs)
- 10% magical / fantasy realm (fairy realm with floating glow-mushrooms and crystal arches / cloud-island village suspended in pastel sky / glowing-koi pond garden with stone lanterns and mossy bridges / moss-covered ancient ruins reclaimed by flowering vines)
- 5% snow-dusted / winter-cozy (snow-dusted village square with glowing-window cottages and Christmas-tree center / log-cabin clearing in pine forest with smoke curling from chimney / iced-over pond ringed by snow-laden firs / mountain ski-lodge with warm windows)
- 5% seasonal-specific (autumn pumpkin patch with hay-bale fort and crow scarecrow / spring blossom-garden with pink-petal canopy and stone-bench / summer wildflower meadow with butterfly-cloud / harvest fields with rolled hay-bales at golden hour)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- Concrete geography + concrete architecture in one sentence
- Material truth: cobblestone, thatched roof, moss-carpet, climbing roses, wooden dock, stone bridge, paper-lantern
- ONE signature scale-anchor (a foreground tree, a distant mountain, a single chimney, a bridge crossing)
- Picture-able as a single still — the viewer can imagine the frame

━━━ DEDUP ━━━

Dedup by: setting-type + architecture + scale-anchor. "mushroom-cap village in a forest hollow" and "fairy mushroom village under giant ferns" are duplicates.

━━━ HARD BANS ━━━

- NO creatures or characters
- NO time-of-day language (no "at sunset" / "moonlit" — separate axis)
- NO weather (no "rainy" / "snowy" unless inherently part of a winter-cozy world)
- NO resident activity verbs
- NO dark / haunted / abandoned / scary
- NO modern features (no cars / power lines / suburbia)

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
