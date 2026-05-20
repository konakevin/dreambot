#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_village_settings.json',
  total: 50,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} COZY JUNGLE-VILLAGE settings for ChibiBot — magical rainforest VILLAGES + COTTAGES + TREEHOUSE clusters that a viewer would want to MOVE INTO. The architecture and the jungle environment are the hero of the frame. Studio Ghibli / Encanto / Princess-Mononoke / Avatar-Pandora-village / Lost-Tribe aesthetic.

Each entry: 20-35 words. ONE specific cozy jungle-village setting with concrete architecture + jungle context. NO creatures (separate axis). NO time-of-day or weather (separate axes). NO activity verbs.

━━━ THE BAR — INHABITED RAINFOREST VILLAGE ━━━

Every entry must (1) be UNMISTAKABLY a JUNGLE / RAINFOREST setting (giant ceiba trees, hanging vines, banana leaves, ferns, tropical canopy), (2) feature SPECIFIC ARCHITECTURE (treehouse / hut / bridge / market stall / canopy platform / vine-stair), and (3) feel LIVED-IN (cozy details visible in the buildings, evidence of inhabitants).

━━━ CATEGORY DISTRIBUTION ━━━

- 25% TREEHOUSE-VILLAGE (cluster of treehouses built into a giant ceiba with rope-bridges between / canopy-platform village with thatched-roof huts circling a kapok tree / vine-stair-treehouse cluster wrapped around twin redwoods / lantern-lit treehouse village seen from a neighboring branch)
- 20% JUNGLE-FLOOR VILLAGE (mushroom-house cluster in a sunbeam clearing / leaf-roof hut cluster on a jungle floor with banana-leaf awnings / mossy stone cottage cluster in a vine-wrapped clearing / fern-circle village with ground-level huts)
- 15% MARKET / PLAZA (jungle-floor market square with woven-mat stalls and palm-frond canopies / open-air market beneath a giant orchid canopy / banana-stall market on a vine-bridge plaza / tropical fruit-bazaar lane between treehouses)
- 10% VINE-BRIDGE / WALKWAY (long rope-bridge village connecting tree-platforms / wooden-plank walkway threading between hanging-bottle homes / vine-ladder cluster up to a sky-village / hanging-walkway market)
- 10% TEA-HOUSE / GATHERING (canopy-platform tea-house surrounded by flowering vines / sky-deck gathering platform with paper-lanterns / orchid-petal-roofed tea house / wooden gazebo on a giant lily-pad-platform)
- 5% WATER-ADJACENT (canal-village with stilt-houses over a jungle stream / lily-pad-platform village over still water / waterfall-side cottage cluster behind the falls / pond-edge cottage cluster)
- 5% ANCIENT-RUIN / RECLAIMED (mossy ancient temple steps with built-in cottage doors / overgrown ziggurat with hanging-vine homes carved into the steps / reclaimed jungle-ruin village with mossy stone arches)
- 5% MAGICAL-REALM (glowing-mushroom village in a deep-jungle hollow / fairy-glow village with luminous vines / spirit-tree village with phosphorescent-moss accents)
- 5% UNUSUAL-VESSEL (giant gourd-house cluster / hollow-seedpod cottage cluster / nutshell-cottage village / banana-trunk hut cluster)

━━━ WHAT MAKES AN ENTRY 10/10 ━━━

- Concrete architecture-type + concrete jungle anchor (vines, canopy, ferns, kapok, ceiba, banana leaves)
- Material truth: thatched roofs, bark walls, woven-vine railings, mossy stones, lantern-flowers, glowing-mushrooms, hanging-vines
- ONE signature feature (lantern-flower streetlamps / hanging-bottle homes / rope-bridge connectors / sky-platform)
- Picture-able as a single still

━━━ HARD BANS ━━━

- NO creatures
- NO time-of-day
- NO weather
- NO activity verbs
- NO modern-tech
- NO dark / haunted / abandoned-with-dread (overgrown-reclaimed is OK if magical)
- NO tilt-shift / miniature / diorama wording (just render as a cozy place)

━━━ DEDUP ━━━

Dedup by: village-type + architecture + jungle-feature.

━━━ OUTPUT ━━━

JSON array of \${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
