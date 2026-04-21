#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/epic_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} EPIC MOMENT descriptions for DragonBot's epic-moment path — charged narrative beats. Battle-mid-charge, spell-cast, coronation, ritual, army-at-dawn, siege. Described as moment-type, character placed later.

Each entry: 15-30 words. One specific epic narrative beat.

━━━ CATEGORIES ━━━
- Army on hilltop at dawn (banners raised, horns blown, first-light on spears)
- Siege assault (ladders against castle wall, catapults flinging, arrows mid-air)
- Battle-mid-charge (cavalry thundering forward, dust rising, warhorns)
- Spell-cast climax (mage hands raised, spell arc visible, allies shielded)
- Coronation (crown held above bowed head in throne room with torchlight)
- Council at round table (hooded figures around glowing map)
- Standoff on bridge (two forces face each other, bridge between them)
- Duel in courtyard (blades crossed mid-strike, crowd distant)
- Ritual mid-summoning (circle glowing, smoke rising, chant-wisps)
- Treaty-signing at weathered table (scrolls, candles, banners)
- Coronation vigil (lone figure kneeling before altar overnight)
- Dragon-rider stand-off (rider on peak, dragon circling)
- Throne-room audience (robed emissary before king-in-throne)
- Oath-taking on sword (blade held, head bowed, torches)
- Sacred-bow nock (archer drawing in stance on cliff)
- Army marching through mountain pass (column stretched far, banners visible)
- Beacon-fires chain (signal mountains lit in succession)
- Funeral pyre at sea (longship burning, smoke rising)
- Summit of wizards (robed figures arriving at tower)
- Prisoner-led through hall (chained figure, torch-bearing guards)
- Sacred hunt (horn-blow hunt in autumn forest, hounds)
- Cathedral light-shafts bathing altar (awaiting figure)
- Storm-before-battle (clouds gathering over field)
- Magic-duel mid-strike (two spells colliding in air)
- Coronation crowd at gate (distant figures awaiting emergence)
- Ritual bonfire surrounded by hooded chanters
- Tribal drum-circle with firelight
- Ship-launch at dock (banners flying, crowds on pier)
- Signal tower flame going up at night

━━━ RULES ━━━
- Moment-type only (characters + settings placed elsewhere)
- Charged / narrative / epic
- Specific beat captured in time

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
