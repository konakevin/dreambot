#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dark_realm_scenes.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} DARK REALM scene descriptions for DragonBot. Corrupted wastelands, necromancer kingdoms, fallen empires, cursed lands. Mordor / Dark Souls / Bloodborne / Diablo energy.

Each entry: 15-25 words. One specific dark fantasy landscape or realm.

━━━ SCENE TYPES (mix broadly across ALL) ━━━
- Corrupted wastelands: blighted earth, dead trees, toxic rivers, ashen sky
- Necromancer citadels: black spired towers, green-lit windows, undead armies massing
- Fallen empires: once-great cities now crumbling, overgrown with dark thorns, haunted
- Volcanic hellscapes: lava rivers, obsidian fortresses, fire and brimstone
- Cursed forests: twisted trees with faces, perpetual fog, glowing eyes in darkness
- Undead battlefields: skeletal armies, ghostly banners, eternal war frozen in time
- Dark temples: sacrificial altars, blood-red moonlight, forbidden rituals
- Abyssal chasms: bottomless rifts, bridges over void, eldritch light from below
- Plague lands: abandoned villages, sickly green fog, ravens everywhere
- Frozen hells: ice wastes with trapped souls, blue-black glaciers, aurora of despair
- Sunken kingdoms: drowned cities rising from black water, spectral lights
- Shadow realms: reality distorted, impossible geometry, darkness as substance
- Bone cathedrals: structures built from dragon/giant bones, grim grandeur
- Witch kingdoms: dark enchantment, thorned castles, perpetual twilight

━━━ RULES ━━━
- Beautiful but MENACING — concept art you'd hang on your wall
- The land itself is the villain — hostile, corrupted, wrong
- Optional small figures for scale (lone wanderer, dark knight, necromancer)
- Vary the TYPE of darkness: volcanic, undead, cursed, frozen, abyssal
- No named locations (no Mordor, no Anor Londo)
- No repeats

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
