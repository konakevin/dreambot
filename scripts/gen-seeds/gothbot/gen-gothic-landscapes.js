#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothic_landscapes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} GOTHIC LANDSCAPE descriptions for GothBot's dark-landscape path — pure gothic environments, no characters. Haunted castles, cemeteries, cathedral ruins, blood-moon forests, gothic cityscapes. Castlevania/Bloodborne/Crimson-Peak aesthetic.

Each entry: 15-30 words. One specific gothic landscape.

━━━ CATEGORIES ━━━
- Haunted castles (cliff-top gothic fortress with crimson banners, moonlit spires with fog drifting)
- Cemeteries (foggy Victorian cemetery with weeping-angel statues, cracked mausoleums)
- Cathedral ruins (overgrown cathedral with vines on stained-glass, collapsed nave with moonlight)
- Blood-moon forests (black-barked trees under red moon, silhouette branches)
- Lightning-struck trees (dead oak split by lightning, purple-black sky)
- Gothic cityscapes (rain-slick Victorian streets with gas-lamps, foggy gothic cathedral silhouettes)
- Moonlit mausoleums (marble crypt with stone angels, midnight fog rolling)
- Old graveyards (moss-covered headstones with candle, raven perched)
- Hollow chapels (empty chapel with dust-beams, candelabras toppled)
- Ruined abbey (collapsed stone archway with ivy, amber sunset)
- Blood-moon wolves (pack-howl silhouette, crimson moon rising)
- Ghost-ship harbors (tattered-sail ghost-ship in fog, wrecked pier)
- Widow's-walks (Victorian widow's-walk house overlooking stormy sea)
- Mourning-peaks (black mountain peaks in thunderstorm)
- Crypt-city underground (vast crypt-network with torches, stone coffins)
- Gothic bridges (fog-shrouded stone arch bridge over dark river)
- Cursed villages (abandoned village with boarded windows, crows circling)
- Stone-circle cursed (ancient menhirs in blood-moon light with fog)
- Dark-waterlake (black lake with fog, lone gondola silhouette)
- Gothic lighthouse (black-painted lighthouse on jagged cliff, stormy sea)
- Vampire-garden overgrown (black rose garden with thorns, marble statuary)
- Manor courtyards (crumbling gothic courtyard with fountain, broken angel-statue)
- Haunted opera-house (exterior at night, chandeliers faintly glowing)
- Necropolis (vast city-of-the-dead with multi-tiered tombs)
- Castle moat-bridge (drawbridge lowered over black moat, torchlight)
- Clock-tower gothic (massive gothic clock tower with gargoyles)
- Inn-at-dark-crossroads (isolated gothic inn on moor, single warm window)
- Ritual stone-circle (blood-moon pentagram of stones with altar)
- Burning-cathedral aftermath (smoking-ruins cathedral, sunrise after siege)
- Shipwreck on gothic shore (wrecked galleon on rocks, stormy clouds)

━━━ RULES ━━━
- No characters (dark-scene path handles characters)
- Pure gothic environment
- Castlevania/Bloodborne production-art quality
- Include specific architectural / atmospheric detail

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
