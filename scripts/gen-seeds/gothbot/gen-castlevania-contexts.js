#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/castlevania_contexts.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} CASTLEVANIA CONTEXT descriptions for GothBot's castlevania-scene path — Castlevania-game-art / Bloodborne / Berserk aesthetic settings. Vampire hunters, cursed cathedrals, gargoyles, wrought iron, crimson stained glass, moonlit courtyards.

Each entry: 15-30 words. One specific Castlevania-ish setting.

━━━ CATEGORIES ━━━
- Cursed cathedrals (cathedral interior with crimson stained-glass, broken pews)
- Gargoyle-ridden courtyards (castle courtyard with gargoyles looking down, moonlit)
- Wrought-iron gates (massive iron gate with bat-motifs, moonlit)
- Crimson stained-glass (tall arched window with blood-red-pattern, candlelit interior)
- Moonlit courtyards (empty courtyard with fountain and gargoyles, full moon)
- Werewolf-shadow alleys (narrow Victorian alley with werewolf silhouette at end)
- Gothic-nobility ballrooms (Victorian dress-ball backdrop empty or one figure)
- Candlelit crypts (subterranean crypt with many candles, stone coffins)
- Blood-moon castle skies (castle silhouette against massive red moon)
- Vampire-hunter training ground (old chapel with weapons-rack and altar)
- Cursed chapels (abandoned chapel with iron chains hanging)
- Dark castle throne-rooms (black throne with red-velvet, candelabras)
- Castle entrance halls (sweeping stair with tapestries and iron chandelier)
- Witch's tower-top (circular chamber with cauldron and raven)
- Cobblestone gothic streets (rain-slick cobblestones with gas-lamps and fog)
- Gothic bridge across moat (stone bridge with guard-towers)
- Cathedral bell-tower (massive bells with bats circling)
- Crypt-mausoleum entry (iron-gate mausoleum with stone angels)
- Gothic library (floor-to-ceiling dark wood shelves with globe and candles)
- Vampire-lord study (study with velvet chair, chalice, skull, open grimoire)
- Torture chamber (iron-maiden and chains — atmospheric, not gory)
- Cursed-forest-gate (iron gate into dark forest with crimson mist)
- Haunted dining halls (long wooden table with melted candles)
- Organ chambers (massive pipe-organ with skeletal-key, gothic ceiling)
- Statuary galleries (hall of weeping-angel statues in moonlight)
- Sword-wielder's duel courtyard (candlelit dueling-ground with rose petals)
- Tower-top fighting arena (exposed tower platform under storm-sky)
- Cobwebbed clock-room with iron-works exposed
- Werewolf-forest pack-gathering (shadowy pack under blood-moon)
- Vampire-garden courtyard (black roses and marble fountain)

━━━ RULES ━━━
- Castlevania / Bloodborne / Berserk aesthetic
- Ornate gothic detail
- Often empty for character to be placed
- Dramatic single-light-source compositions

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
