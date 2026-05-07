#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/boss_arena_scenes.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} 16-BIT BOSS-BATTLE GAMEPLAY SCREENSHOT scene descriptions for PixelBot's boss-arena path. Each entry feeds a Flux pixel-art prompt-writer. Genre lineage: Hyper Light Drifter + Hades + Diablo II + Octopath Traveler boss battles + Salt and Sanctuary + Children of Morta + Castlevania boss rooms.

━━━ THE NORTH STAR ━━━

Each entry should look like A SCREENSHOT FROM AN ACTUAL 16-BIT BOSS BATTLE — not key art, not a poster, not a movie still. The camera shows the arena from a TOP-DOWN, 3/4 ISOMETRIC, or SIDE-VIEW gameplay angle. The viewer thinks: "I'd play this fight right now."

Each entry: 30-50 words, ONE paragraph. ALWAYS describes:
1. CAMERA ANGLE — top-down / 3/4 isometric / side-view (one of these per entry)
2. ARENA FLOOR clearly visible (tiled / mossy / magic-circle / sand / lava-bridge / ice / cracked-stone)
3. BOSS CREATURE as a SPRITE on the arena (skeleton-king / dragon / minotaur / wraith / treant / golem / kraken / chimera / lich / hydra / phoenix / etc.) — mid-action (rearing, roaring, swinging weapon, charging spell, wings spread)
4. PLAYER-SPRITE small on the arena floor — a single hero somewhere in the frame
5. ARENA EDGES/WALLS framing the space (pillars / broken-stones / cliff-edges / magma-cracks / frozen-spike-walls)

━━━ BOSS-CREATURE TYPE — ROTATE BROADLY ━━━
- Skeleton King on a throne-arena
- Lich raising undead in a graveyard arena
- Dragon coiled around a lava-pit
- Treant looming over a forest clearing
- Minotaur in a bone-strewn coliseum
- Wraith floating over a cathedral floor
- Stone Golem slamming a temple platform
- Kraken tentacles emerging from a flooded chamber
- Hydra in a swamp arena
- Cyber-mech in a steel-tile arena
- Demon-knight in a magic-circle chamber
- Frost giant in a glacier arena
- Spider-queen in a cobweb cavern
- Lava elemental on an obsidian platform
- Death-knight in a cursed throne room
- Eldritch eye-creature in a void chamber
- Beast-king in a moonlit clearing
- Plague-rat-king in a sewer arena
- Phoenix on a crystal pedestal
- Dual-wielding samurai-boss on a temple floor
- Necromancer in a bone-circle
- Ice-witch on a frozen lake-arena
- Spider-knight on a webbed-floor

━━━ CAMERA ANGLE EXAMPLES ━━━

TOP-DOWN gameplay (40% of entries):
- "Top-down view of a circular stone arena with cracked tiles, a bone dragon coiled in the center mid-roar, hero player-sprite tiny at the south edge with sword raised, broken pillars at four corners, scattered torches casting glow, drifting ash."
- "Top-down arena floor of mossy stone with central magic-circle, treant boss looming center mid-stomp with massive arms raised, hero-sprite small at north edge bow drawn, fern-overgrown walls, drifting petals, dappled light."

3/4 ISOMETRIC gameplay (40% of entries):
- "3/4 isometric view of a colosseum arena with sand floor, minotaur-boss mid-charge in center holding a war-axe, hero player-sprite small at the entrance gate sword raised, stone audience-stands rising on either side, torches flickering."
- "3/4 isometric view of a magma-temple arena with obsidian-tile floor, fire elemental-boss rearing in the center radiating heat-shimmer, hero sprite tiny at the foreground edge, lava-channels glowing through cracks, falling embers."

SIDE-VIEW arena (20% of entries):
- "Side-view of a broad cathedral hall arena, demon-knight-boss in center mid-swing of a flaming claymore, hero-sprite tiny at the right edge dodge-rolling, columned hall extending behind, torches lining the walls, ash drifting."

━━━ HARD RULES ━━━

- ALWAYS show the arena AS A PLAYABLE SPACE — floor visible, walls visible, edges/boundaries clear
- BOSS is an enemy-sprite ON the arena, NEVER a sky-silhouette or background-looming key-art figure
- HERO PLAYER-SPRITE small somewhere in the frame (mandatory — the screenshot must show who's fighting)
- 16-BIT chunky pixel-grid aesthetic — NOT modern HD-2D smooth, NOT painterly
- NO UI / health bars / damage numbers / dialogue boxes
- NEVER vertical-portrait dramatic key-art compositions
- NEVER concept-art looking-up-at-massive-boss
- Multiple particle/effect sprites visible (energy arcs, sparks, embers, magic-glow, slash-trails) — gameplay-action energy

━━━ AVOID ━━━

- Vertical-poster key-art ("TOWERING silhouette" / "looming proportions" / "scale intimidation")
- Concept-art compositions (looking-up at boss, dramatic camera-tilt)
- Boss-as-sky-element (don't put the boss in the BACKGROUND — put it ON the arena floor as a fightable sprite)
- Specific named IPs (Hades, Souls, Diablo by name)
- Smooth modern indie-pixel rendering — strict 16-bit chunky retro

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete scene description (30-50 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
