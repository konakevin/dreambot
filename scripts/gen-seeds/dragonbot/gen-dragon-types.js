#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/dragon_types.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} DRAGON TYPE descriptions for DragonBot's dragon-scene path — specific dragon variants as hero subject. GNARLY, DRAMATIC, CHARACTERFUL. Mythic creatures, not cute. Different dragons in different settings.

Each entry: 15-30 words. One specific dragon with distinguishing features + setting context.

━━━ CATEGORIES ━━━
- Western wyrm (massive four-legged dragon, hoard visible, amber cave light)
- Eastern serpentine dragon (long coiling body, whiskers, cloud-swimming)
- Wyvern (two-legged bat-winged dragon mid-flight over crags)
- Ancient rotting dragon (massive skeletal overgrown, moss-covered, ruin-dwelling)
- Crystal dragon (translucent scales, refracting light, ice-cavern)
- Shadow dragon (smoke-form wings, glowing eyes, void-like body)
- Sunset dragon (amber-scales glowing, golden-hour flight, sun-burst backdrop)
- Ice dragon (white-scaled frost-wyrm, breath-frost, glacier lair)
- Volcano dragon (obsidian-scaled, lava-lit, cone-nesting)
- Storm dragon (cloud-form, lightning-crackle, thunderhead-dwelling)
- Ancient black dragon (massive scarred, ruined city, red-eye glow)
- Sea dragon (kelp-wreathed serpent coiling in shallows, pearl-scales)
- Hoard-keeper (dragon coiled atop gold mountain, treasure-gleaming)
- In-flight hunter (mid-wing-spread over mountains, talons extended)
- Sleeping-ancient (colossal ancient in volcanic cave, breath-smoke rising)
- Standoff-with-rider (dragon facing dragon-rider with drawn blade)
- Mid-breath-attack (mouth open mid-roar, breath-weapon forming)
- Young whelp (smaller dragon emerging from egg-cluster)
- Cliff-perch with wingspan silhouette against sky
- Lair guardian with adventurer-silhouette in doorway (scale indicator)
- Dragon-rider combat dive over battle
- Dragon circling lone tower
- Nightscale dragon under starfield
- Iridescent dragon with color-shifting scales
- Moon-aligned dragon at full moon flight
- Multi-headed hydra-variant (three heads, serpentine body)
- Dragon emerging from cavern mouth with smoke
- Dragon-bone ghost (spectral ancient dragon)
- Two-dragon territorial roar face-off
- Dragon mid-stoop grabbing prey
- Winged-serpent feathered-scales Mesoamerican-variant
- Nine-tailed-dragon ancient spirit

━━━ RULES ━━━
- Dragons are GNARLY / dramatic / characterful — not cute
- Include dragon type + setting + pose
- Real-dragon variants (western/eastern/wyvern etc.)
- No named IP dragons (no Smaug, no Drogon, no Toothless)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
