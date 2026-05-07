#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/jrpg_combat_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's jrpg-combat path (Final Fantasy IV-VI / Chrono Trigger / Secret of Mana / Seiken Densetsu 3 16-bit-era JRPG combat-screenshot aesthetic — used as inspiration only, never named in output).

Each entry is 15-30 words. EVERY entry must include 2-3 of these animated combat-action particle elements:
- Spell residue / magic-spark trails (fireball-embers, ice-fragment-shimmer, lightning-arcs, dark-magic-wisps, holy-light-motes)
- Sword-slash motion-trails / arrow-trails / spear-thrust streaks
- Drifting dust / debris kicked up from monster stomps
- Drifting petals / leaves / pollen / cherry-blossom (forest combat)
- Drifting snow / falling rain / drifting fog (weather combat)
- Drifting embers / ash from lava / volcanic combat
- Drifting firefly-glow / magical-mote / sparkles (magic combat)
- Falling stones / cracking-ground / impact-shrapnel (heavy combat)
- Spell-aura glow particles around party member (healing-glow, summon-aura)
- Monster-attack-effect particles (dragon-fire, ice-witch-frost, lich-soul-mist)
- Wind-vortex blades / motion-blur on fast attacks
- Trampled-grass / dust-cloud puffs from running sprites

Examples (write fresh):
- "Fireball-embers trailing across mid-frame, sword-slash motion-trail on warrior, drifting dust from troll-stomp, dappled leaf-shadow on grass-tiles."
- "Ice-fragment-shimmer in cone from mage's staff, drifting snow particles, debris kicked up from ice-giant's smashed glacier, breath-mist on combatants."
- "Lightning-arcs zigzagging from mage to lich, drifting ash from cracked tomb, dark-magic-wisps swirling around lich, motion-blur on warrior's axe-swing."
- "Healing-glow motes drifting around princess, drifting petals from cherry-blossoms, sword-slash trail on samurai, drifting magical sparkles."
- "Dragon-fire embers raining across the mountain pass, drifting snowflakes, sword-slash motion-trail on warrior, debris kicked up from dragon-claw impact."
- "Holy-light-motes drifting from cleric's staff, arrow-trail across mid-frame, drifting fireflies, spell-aura glow around party member."
- "Web-trails from spider-queen, drifting spore-particles in cave, motion-blur on monk's quarterstaff spin, glowing crystal-vein particles."
- "Wind-blade vortex around mage, drifting dust-cloud from running ninja, motion-blur on shuriken, dappled sun-particles in clearing."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
