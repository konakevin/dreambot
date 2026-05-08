#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/assassin_epic_backdrop.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} EPIC GOTHIC BACKDROP descriptions for GothBot's vampire-assassin paths. Each entry is 20-35 words. This backdrop DWARFS the character — the scale-defining gothic anchor that fills the upper portion of the frame OR dominates the horizon.

CONTEXT: Castlevania-castle / Bloodborne-cathedral / Van-Helsing-fortress scale energy. The setting is the world; this backdrop is the WORLD'S MOST IMPRESSIVE SILHOUETTE.

Categories (rotate widely):
- Castlevania-style castle silhouette — towering spires, hundreds of pinnacles, dwarfing the horizon
- Cathedral with thousand-foot spires piercing storm-violet sky, gothic mass dwarfing the village below
- Massive abandoned gothic abbey on a distant cliff, silhouetted against blood-moon
- Blood-moon swallowing half the upper frame, heavy crimson dominant
- Mountain-scale ruined fortress carved into a sheer cliff-face, partially overgrown with ivy
- Vampire-estate manor with a hundred dark-windowed wings, towers piercing the night sky
- Gothic-mountain monastery on a peak, lit from within by hellfire-orange windows
- Massive cracked clock-tower with gothic facade, looming over the village square
- Towering gothic university with bell-towers and observatory domes, silhouetted at twilight
- Distant fog-shrouded city of gothic spires receding into atmospheric haze
- Cliff-top vampire fortress overlooking a black ocean, lighthouse-spire piercing the sky
- Massive plague-cathedral facade with a thousand carved saints, lit from within by sickly green
- Gothic megastructure ruin half-submerged in a dark lake, spires emerging from water
- Castle ruin atop a mountain, with broken aqueduct receding into mist
- Towering castle-gate with iron portcullis as tall as a small tower
- Distant gothic citadel silhouetted by storm lightning, every spire briefly illuminated

EVERY entry must include:
- Massive gothic structure or natural element (castle / cathedral / abbey / fortress / blood-moon / cliff-mountain / etc.)
- Scale word ("towering", "looming", "dwarfing", "thousand-foot", "mountain-scale", "swallowing the sky")
- Atmospheric integration (fog haze, moonlight rim, storm light, blood-moon corona, jewel-tone sky)
- Position (background dominant, upper-frame, on the distant horizon, looming overhead)

Examples (write fresh):
- "A Castlevania-style castle silhouette with a thousand spires and pinnacles dwarfing the horizon, towering against a violet-and-indigo storm sky, swallowing the upper third of the frame"
- "A cathedral with thousand-foot spires piercing the storm-violet sky, gothic stone mass dwarfing the village below, every window glowing fel-green with sickly inner light"
- "Blood-moon swallowing the upper half of the frame, deep-crimson with corona burning around its edges, casting blood-shadow across the gothic landscape below"

Output ONLY a valid JSON array of ${n} strings (20-35 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
