#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/jrpg_combat_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} LIGHTING descriptions for PixelBot's jrpg-combat path (Final Fantasy IV-VI / Chrono Trigger / Secret of Mana / Seiken Densetsu 3 / Lufia II / Y's series 16-bit-era JRPG combat-screenshot aesthetic — used as inspiration only, never named in output).

Each entry is 15-30 words. EVERY entry must include:
- DRAMATIC OUTDOOR JRPG-COMBAT LIGHT SOURCE — golden-hour amber sunshine / sunset gold-orange / dawn-pearl morning / dusk-amber / blue-hour twilight / moonlit-blue night / aurora-pink-cyan / storm-flash / lava-glow rising / cave crystal-glow / temple stained-glass shaft / dungeon torch-amber / desert noon-bleached / forest dappled-light / underwater refracted / mountain god-rays
- SPELL-EFFECT GLOW lighting accent — fireball-orange-glow / lightning-cyan-strobe / ice-shard pale-blue / healing-glow warm-yellow / dark-magic-violet pulse / holy-light-pillar gold / summon-aura iridescent / ember-rain orange-yellow / frost-cone pale-cyan
- SATURATED SNES-ERA palette — RICH chunky color blocks
- 16-BIT CHUNKY PIXEL feel — visible dithered shadow edges, no smooth gradients

Examples (write fresh):
- "Golden-hour amber sunshine through forest canopy, dappled tile-shadows on grass-floor, fireball-orange spell-glow strobing on combatants, deep emerald shadow corners, dithered shadow gradients."
- "Dawn-pearl morning light over the ruined temple, lightning-cyan strobe from mage's staff casting blue-white flashes across cracked tiles, deep purple shadow corners, dithered shadow edges."
- "Cave crystal-glow pale-cyan as primary light on the stone-tile floor, ice-shard volley adding pale-blue strobes mid-frame, deep blue-violet ambient, dithered shadow gradients."
- "Sunset gold-orange across the snowy plain, party rim-lit warm-amber, ice-giant casting pale-cyan frost-cone strobing on snow, deep purple shadow ambient, dithered snow-edge shadows."
- "Stormy noon with lightning-flash strobe over coastal cliff, mage's summon-aura iridescent prism-light glowing party from below, deep blue-black ambient between flashes, dithered rain-streak shadows."
- "Volcanic-orange lava-glow rising from cracked tile-floor, fireball-orange spell-glow doubled by environment, party rim-lit warm-amber, deep blackened-stone ambient, dithered ember-edge shadows."
- "Aurora-pink-cyan ribbons over the frozen lake at night, mage's lightning-bolt cyan-strobe complementing aurora light, deep blue-violet ambient, dithered ice-edge shadows."
- "Dungeon torch-amber flickering from wall-sconces, dark-magic-violet pulse from lich's staff casting pulsing shadows, deep blue-black corner ambient, dithered shadow gradients."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
