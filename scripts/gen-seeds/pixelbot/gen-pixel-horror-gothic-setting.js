#!/usr/bin/env node
/**
 * PIXELBOT_PIXEL_HORROR_GOTHIC_SETTING — 16-bit gothic-action settings.
 * Castlevania (NES/SNES) / Ghosts n Goblins / Demon Crest / Magical
 * Quest / Splatterhouse / Rondo of Blood / Bloodstained pixel. NOT
 * modern psychological horror — classic gothic-fantasy monster-slayer.
 * 55-75 word entries with camera-lock + tile-floor + parallax detail.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_pixel_horror_gothic_setting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} GOTHIC-SETTING entries for PixelBot's pixel-horror path — 16-bit Castlevania (NES/SNES) / Ghosts n Goblins / Demon Crest / Magical Quest / Rondo of Blood / Bloodstained pixel-style classic-gothic monster-slayer environments. Title-caps prefix THEN " — " separator THEN 55-75 word description.

━━━ THE BAR ━━━
Every entry is ONE classic-gothic-fantasy locale on the tile-grid (vampire castle / cathedral / crypt / dragon-cave / cursed-forest / demon-realm / clock-tower / graveyard / etc.). Always opens with camera-lock ("side-view of", "3/4-iso angled-down on", "top-down on"), specifies the TILE FLOOR + GOTHIC ARCHITECTURE + ATMOSPHERIC DETAILS (cobwebs / dripping wax / blood-stains / stained-glass / etc.). Dark gothic-fantasy, NOT modern psychological horror.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"VAMPIRE CASTLE HALLWAY — side-view of a long stone-castle corridor with cracked-flagstone tile floor, iron-chandelier flickering overhead, blood-red carpet running the length, gothic-stone pillars flanking both sides, stained-glass windows casting crimson prismatic light, cobwebs draped from the vaulted ceiling."
"CASTLE STAINED-GLASS CHAPEL — 3/4-iso angled-down on a vampire-castle chapel with massive rose-window at the back wall casting multicolored shards across cracked-stone tile, toppled wooden pews, blood-stained altar at center, dripping candelabras pooling wax on the floor."
"GRAVEYARD AT MIDNIGHT — side-view of a moonlit graveyard with rows of weathered gravestones receding into parallax depth, cobblestone-and-dirt foreground path, twisted dead-trees silhouetted, distant cathedral spire, blue-grey moonlight casting long shadows across the frost-covered ground."

━━━ VARIETY MANDATE (distribute across these gothic locale categories) ━━━

- ~5 VAMPIRE CASTLE INTERIORS (hallway / chapel / throne room / banquet hall / library / dungeon / kitchen / bedchambers / armory / war-room)
- ~4 CASTLE EXTERIORS (battlements at night / drawbridge / outer-courtyard / castle-gate / spire-rooftop / siege-balcony / castle-island silhouette / castle-cliff approach)
- ~4 CRYPTS / CATACOMBS (sealed crypt / open sarcophagus chamber / bone-stacked catacomb / mausoleum interior / coffin-stack vault / burial niche / ossuary hall)
- ~4 CATHEDRAL / CHURCH (gothic cathedral nave / ruined chapel / shattered confessional / bell-tower interior / crypt-below-chapel / cathedral-courtyard / cathedral-rooftop)
- ~4 GRAVEYARD / EXTERIOR (moonlit graveyard / fog-shrouded graveyard / open-grave hole / haunted-mausoleum exterior / cursed-cemetery / dead-tree boneyard / tombstone-maze)
- ~3 CURSED FOREST (twisted dead-tree forest / blood-red autumn forest / fog-shrouded swamp-forest / werewolf-pack forest / ghost-light marsh / bone-strewn forest path)
- ~3 DRAGON-CAVE / LAIR (lava-glow dragon cave / crystal-shard cave / treasure-pile lair / bone-littered lair / smoke-and-ember cave / serpent-pit / underground river cave)
- ~3 CLOCK-TOWER / MECHANICAL (clock-tower summit interior / gear-machinery hall / clockwork-pendulum chamber / spire-roof gear-grind / time-clock arena)
- ~3 DEMON-REALM / HELL (lava-lake demon-realm / fire-pit underworld / brimstone-throne arena / boiling-river chasm / fallen-cathedral hell-version / demonic-chained pit)
- ~3 SWAMP / WITCH-HUT (witch-cottage interior / cauldron-and-hut / fog-swamp clearing / cypress-grove swamp / lily-pad fog-pond / bone-altar swamp-shrine)
- ~2 RUINED / CURSED VILLAGE (abandoned village street / blood-marked village square / haunted-inn interior / cursed-well village / boarded-up plaza)
- ~2 LIBRARY / LABORATORY (alchemy lab in tower / arcane library / scroll-strewn study / ritual-circle chamber / pentagram-floor chamber)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS open with camera-lock signal ("side-view of...", "3/4-iso angled-down on...", "top-down on...").
- ALWAYS describe TILE FLOOR material (cracked-flagstone / cobblestone / blood-stained tile / broken-stone / lava-stone tile).
- ALWAYS include GOTHIC ARCHITECTURE detail (pillars / vaulted-ceiling / arched-window / stained-glass / iron-chandelier / etc.).
- ALWAYS include 2-3 atmospheric details (cobwebs / dripping-wax / blood-stains / flickering-light / moss / chains).
- Body is 55-75 words.

━━━ BANS ━━━
- NO modern psychological horror — classic Castlevania-style gothic-fantasy register only.
- NO modern objects (electric lights / computers / cars).
- NO characters / enemies — setting only (enemies are classic_enemy axis, hero is hero_action axis).
- NO ultra-gore / extreme-violence detail — atmospheric blood only.
- NO photoreal — 16-bit SNES pixel-art register.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
