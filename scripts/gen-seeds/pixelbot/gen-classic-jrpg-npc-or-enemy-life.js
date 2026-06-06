#!/usr/bin/env node
/**
 * PIXELBOT_CLASSIC_JRPG_NPC_OR_ENEMY_LIFE — 16-bit SNES-style JRPG
 * NPC villagers mid-routine OR enemy creatures patrolling the tile-grid.
 * Title-caps prefix register matching the existing pool. Tiny sprite
 * scale, classic JRPG-style enemy sprite or NPC daily-life pose.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_classic_jrpg_npc_or_enemy_life.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} NPC-OR-ENEMY-LIFE entries for PixelBot's classic-jrpg path — 16-bit SNES-style JRPG NPC villagers mid-daily-routine OR enemy creatures patrolling the tile-grid. Mirror this exact format: TITLE-CAPS PREFIX — description (35-50 words).

━━━ THE BAR ━━━
Every entry is ONE NPC or enemy on the tile-grid, in mid-action, named in TITLE-CAPS-PREFIX style. The sprite scale is small ("tiny sprite", "small sprite"). The register is classic SNES JRPG (Final Fantasy IV/V/VI, Chrono Trigger, Secret of Mana, Lufia II, Terranigma, Earthbound, A Link to the Past, Dragon Quest VI). The format MUST be: "TITLE — body."

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"VENDOR AT MARKET-STALL — NPC-vendor in flour-dusted apron standing behind a wooden market-stall stacked with bread-loaves and root-vegetables, mid-customer-greeting gesture with one hand raised, tiny sprite on the tile-grid, classic SNES-JRPG-town register."
"GREEN-SLIME PATROLLING — single green-slime creature mid-bounce across the dungeon tile-grid, round gelatinous body compressed at bottom of hop, tiny black eyes visible at top, classic SNES-JRPG-style enemy sprite, small scale."
"PRIEST AT ALTAR — NPC-priest in white ceremonial robe standing at a carved stone-altar with both hands raised in mid-prayer-gesture, two candles flickering at altar-sides, atmospheric holy-moment, tiny sprite on the tile-grid."
"SKELETON-ARCHER PATROLLING — single skeleton-warrior with warped bow mid-draw, arrow nocked, hollow eye-sockets aimed forward, patrolling the dungeon tile-grid, atmospheric undead-enemy register, classic SNES-JRPG-style sprite, tiny sprite on tile-grid."

━━━ VARIETY MANDATE (distribute across these archetypes) ━━━

NPCs (~55% of entries — daily-life villager routines):
- ~5 SHOPKEEPERS / VENDORS (weapon-merchant, potion-shop owner, armor-merchant, item-shop clerk, baker, fishmonger, tailor, jeweler, butcher, herb-shop owner, scroll-merchant)
- ~5 VILLAGERS DOING CHORES (sweeping porch, fishing at pond, gardening, hauling water, chopping wood, washing laundry, feeding chickens, tending grain, kneading bread, drawing well-water)
- ~3 RELIGIOUS / SAGE NPCs (priest at altar, monk meditating, oracle on dais, sage at tome, druid in grove, nun lighting candles, hooded prophet)
- ~3 ROYAL / GUARDS (castle-guard at post, soldier on patrol, knight-captain saluting, royal-herald with scroll, court-mage reading, princess at window)
- ~3 ENTERTAINMENT NPCs (dancer in inn, bard with lute, juggler at festival, traveling-storyteller, drunkard at bar, gambler with dice, innkeeper polishing mugs)
- ~3 CHILDREN / KIDS (kid chasing cat, kids playing tag, child with wooden-sword, child watching a frog, kid building sandcastle)
- ~2 ROMANTIC / SOCIAL (couple chatting by fountain, two friends bench-sitting, mother carrying baby, elder with cane)

Enemies (~45% — patrolling/encountering creatures, classic JRPG bestiary):
- ~5 SLIMES + VARIANTS (green-slime patrolling, red-slime, blue-slime split-attack, metal-slime fleeing, king-slime arrival, slime stack pyramid)
- ~5 UNDEAD (skeleton-warrior patrolling, skeleton-archer, ghoul shuffle, zombie shamble, lich casting, mummy mid-stride, ghost wisp drift, shade-form flicker)
- ~3 BAT / FLYING (bats in mid-flight, cave-bat swoop, harpy mid-flight, will-o-wisp drift, ghost-bat cluster, vampire-bat dive)
- ~3 ORC / GOBLIN / HOBGOBLIN (orc-warrior patrolling, goblin-scout crouching, hobgoblin captain, kobold mid-sneak, ogre lumbering)
- ~3 BEAST (wolf-pack patrolling, bear mid-roar, giant-rat skittering, dire-wolf snarling, panther leaping, boar charging, giant-spider on web)
- ~3 BOSS-CREATURE (dragon coiled, hydra five-headed, demon-lord at throne, golem rising, manticore mid-leap, basilisk mid-stare)
- ~3 MYTHIC / ELEMENTAL (fire-elemental swirling, ice-elemental forming, earth-golem stomping, water-spirit rising, wind-djinn forming, lightning-spirit crackling)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator, then the description.
- Body is one sentence, 35-50 words.
- ALWAYS include sprite-scale signal: "tiny sprite on the tile-grid", "small scale", "small sprite", etc.
- ALWAYS include era signal: "classic SNES-JRPG", "classic JRPG-style", "atmospheric JRPG register", etc.
- ALWAYS show what the NPC/enemy is DOING with a present-tense verb (mid-stride / mid-bounce / mid-prayer / mid-cast / mid-roar / etc.).

━━━ BANS ━━━
- NO modern objects (cars, phones, guns).
- NO photoreal register — everything is 16-bit pixel sprite.
- NO bare "an NPC" — name role + outfit + action.
- NO repeating the same exact NPC/enemy archetype across entries.
- NO 3D-render / CGI language — only classic 16-bit SNES-style pixel art.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in the "TITLE-CAPS — body" format.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
