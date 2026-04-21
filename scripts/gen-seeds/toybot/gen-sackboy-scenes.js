#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/sackboy_scenes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SACKBOY SCENE descriptions for ToyBot's sackboy path — LBP-style fabric-world with stitched-Sackboy-style characters. EVERYTHING in the world is fabric / felt / yarn / paper / cardboard. LittleBigPlanet energy.

Each entry: 15-30 words. One specific stitched-fabric-world scene with Sackboy-style character.

━━━ CATEGORIES ━━━
- Fabric cotton-cloud world (stitched-Sackboy gliding on felt cloud)
- Burlap dungeon (stitched-hero lit by felt-torch)
- Felt-grass hillside (fabric-Sackboy picnic)
- Cardboard-village rescue (stitched-hero running)
- Felt-moon astronaut (stitched-Sackboy in felt-space-suit)
- Paper-cherry-blossom samurai (stitched-figure with paper-sword)
- Knit-snowland (yarn-snowman + stitched-explorer)
- Yarn-forest adventure (woven trees)
- Paper-ocean ship ride (cardboard-boat)
- Cotton-snow mountain climb
- Felt-jungle exploration
- Button-eye detective office
- Fabric-carnival funhouse
- Stitched-pirate-ship deck
- Fabric-castle throne-room
- Felt-dragon battle
- Knit-desert camel-ride
- Paper-plane dogfight (paper-craft planes)
- Fabric-alien-planet-rover
- Stitched-wizard with yarn-wand
- Sackboy picnic with fabric-food
- Yarn-hot-air-balloon
- Felt-underwater scene
- Paper-flower-field picnic
- Stitched-Sackboy first-spring planting
- Fabric-space-battle yarn-lasers
- Felt-volcano eruption
- Cardboard-knight joust
- Stitched-football-match crowd
- Fabric-tea-party multiple Sackboys
- Felt-christmas scene stitched-tree
- Yarn-rescue from fabric-fire
- Paper-butterfly-chase meadow
- Felt-quilt-cloud castle
- Fabric-king throne-room ceremony
- Stitched-archer in yarn-forest

━━━ RULES ━━━
- EVERYTHING fabric / felt / yarn / paper / cardboard
- Visible stitching + button-eyes + yarn-hair
- Sackboy-LBP aesthetic
- Cinematic mid-action moment

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
