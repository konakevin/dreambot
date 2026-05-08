#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

// Total + append: tune for iteration vs prod.
//   Quick iteration: TOTAL=25 APPEND=false (overwrites — fast smoke test)
//   Production:      TOTAL=200 APPEND=false (full regen)
const TOTAL = parseInt(process.env.TOTAL, 10) || 25;
const APPEND = process.env.APPEND === 'true';

generatePool({
  outPath: 'scripts/bots/toybot/seeds/miniature_dungeon_scenes.json',
  total: TOTAL,
  batch: Math.min(TOTAL, 25),
  append: APPEND,
  metaPrompt: (n) => `You are writing ${n} TABLETOP-MINIATURE DIORAMA scene descriptions for ToyBot's miniature-dungeon path. The path is a flagship cinematic-tabletop-miniature feed — D&D adventuring parties, Warhammer-scale battles, dungeon crawls, taverns, boss fights, painted figurines, terrain kits, dice, spell effects, tiny-world storytelling. Reaction goal: "holy shit this miniature scene is insane" / "I want to play this campaign" / "I can't stop zooming in."

Each entry: 30-50 words. Comma-separated descriptive phrase clusters. NO sentences with periods.

━━━ SUB-THEME DISTRIBUTION (deliver ALL 8 in roughly equal proportion) ━━━

~13% DUNGEON CRAWL — torchlit corridors, skeleton crypts, treasure rooms, trap halls, eerie tunnels, loot piles, glowing runes, fog hugging the floor, stone tile floors, dripping water, moss and cobwebs in corners, dungeon doorway arches.

~13% TAVERN QUEST HUB — cozy medieval fantasy tavern interiors, adventuring party miniatures at wooden tables with tiny mugs of ale and plates of stew, quest board covered in parchment notes, warm fireplace glow, hanging lanterns, barrels stacked, miniature rugs, hooded stranger lurking, bards mid-song.

~13% CAMPFIRE ADVENTURE — fantasy wilderness camps, miniature adventurers around glowing campfires in forest clearings or mountain passes, tiny bedrolls and backpacks, cooking pots over flames, scattered scrolls and maps on rocks, glowing fireflies, miniature pine trees, distant ruined arches, soft mist, starry sky.

~13% BOSS BATTLE ARENA — epic boss fights on tabletop, miniature heroes facing massive boss minis (dragons on treasure hoards, lich kings, demon portals, giant beasts in collapsed cathedrals, ancient elemental titans). Glowing spell effects swirling, shattered columns, ruined temple tiles, gold coins and jewels scattered, smoke and embers rising, glowing runic circles, miniature skulls and broken shields.

~13% WARGAME BATTLEFIELD — Warhammer-scale wargame board dioramas, miniature soldiers / armored armies / tanks / walkers / mechs on ruined-city or alien-world terrain. Trenches, sandbags, broken concrete, smoke drifting, bullet casings and debris, glowing plasma weapon effects, banners waving, artillery emplacements, fortifications, cratered ground.

~12% WIZARD TOWER LIBRARY — arcane study interiors, miniature mages at desks, tiny bookshelves overflowing with tomes, floating candles, glowing crystal balls, potion bottles and scrolls scattered, intricate magic circles carved into floors, stained glass windows casting colored light, cobwebs in corners, miniature ladders, shimmering magical dust, alchemical apparatus, astrolabes, summoning circles.

~12% ANCIENT RUINS EXPEDITION — jungle temple and lost-civilization scenes, miniature adventurers climbing mossy stone steps, vine-covered temple doorways, tiny carved statues and cracked stone blocks, glowing golden idols on altars, scattered coins and relic fragments, miniature ferns and flowers, damp ground with puddles, sunlight breaking through canopy, floating dust motes and mist.

~11% GAME NIGHT OVERHEAD — top-down or near-overhead "game night" tabletop scene, detailed battle map spread across a wooden table, hand-painted miniatures positioned mid-encounter, polyhedral dice scattered near character sheets, tiny treasure tokens and spell cards, candlelit atmosphere, open leather-bound rulebook, miniature dungeon walls placed on the map, glowing lantern light, GM screen visible, scribbled notes on parchment.

━━━ HARD RULES (every entry must satisfy ALL) ━━━

1. Every entry must read as a PHYSICAL TABLETOP DIORAMA — hand-painted miniatures on handcrafted terrain. NEVER digital fantasy illustration. (The signature phrases like "macro lens miniature photography" / "shallow depth of field" / "hand-painted tabletop miniature figures" are added at the path-builder level — DO NOT include them in your seeds.)

2. Every entry must list AT LEAST 6 specific MICRO-DETAILS by name from this menu (or beyond): polyhedral dice, battle map, treasure tokens, tiny barrels, scrolls, candles, skull piles, moss flocking, sandbags, crates, lanterns, spell cards, coin piles, rubble, books, potion bottles, torches, traps, banners, weapon racks, broken shields, cobwebs, bedrolls, cooking pots, character sheets, parchment notes, mugs of ale, plates of stew, tiny rugs, miniature ladders, ferns, vines, statues, altars, bones, scattered weapons, glowing runes, plasma effects, smoke trails, magical particles.

3. Every entry must include AT LEAST 2 ATMOSPHERE EFFECTS: fog, smoke, dust motes, embers, candle flicker, volumetric light beams, rain droplets, magical particles, mist drift, swirling dust, shimmer, glowing-rune particle, firefly motes.

4. Every entry must include AT LEAST 1 SCALE CUE proving it's a tabletop diorama: visible brush strokes on figures, paint texture on armor, drybrushed highlights, static-grass on bases, flocked-base detail, tabletop edge visible, hobbyist hand JUST out of frame holding paintbrush, display-cabinet glass reflection, tiny molded seams.

5. Every entry must include CINEMATIC LIGHTING LANGUAGE: warm torchlight, moody shadows, rim light, god rays, dramatic contrast, key-light, single-source spotlight, volumetric haze.

6. Use specific archetypes (dwarf / orc / wizard / dragon / paladin) — never "fantasy character".

━━━ BANNED ━━━
- NO "real person" / "real creature" / "real human" — these are MINIATURES on a tabletop.
- NO game-IP proper nouns (Frodo / Gandalf / Drizzt / Space Marine chapter names / Astartes / Pikachu).
- NO CGI / 3D-render / digital-illustration language.
- NO sexual content.
- NO graphic gore — injured poses OK, no spraying blood.
- NO extreme zoom on a single small object — broader diorama context must always be visible.

━━━ DEDUP ━━━
No two entries share the same sub-theme + key character + key prop combination. Spread widely across the 8 sub-themes.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
