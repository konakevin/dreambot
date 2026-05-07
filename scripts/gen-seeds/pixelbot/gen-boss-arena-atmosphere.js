#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/boss_arena_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's boss-arena path. Each entry is 15-30 words describing the dramatic boss-arena animated-feel particulate (Hades + Hollow Knight + Salt and Sanctuary + Dead Cells boss-reveal).

EVERY entry must include 2-3 of these dramatic-tension elements:
- Drifting embers / sparks / ash
- Magical-aura particles pulsing around boss
- Drifting smoke / mist / fog
- Falling debris / crumbling stone
- Energy-tendrils / lightning-arcs / flame-wisps
- Drifting feathers / petals (for serene-but-deadly bosses)
- Drifting cape / banner / hair / robe-edge motion on boss
- Cracked-floor light leaking / runic-pulse-glow
- Breath-mist (for cold/icy/undead bosses)
- Distant tremor / dust-billow from boss-stomp

Examples (write fresh):
- "Drifting embers rising from a cracked floor, magical-violet aura pulsing around the boss, drifting black-cape edges visible on the silhouette, deep shadow corners."
- "Falling stone debris from a cracked ceiling, lightning-arcs crackling across the boss's weapon, drifting smoke from torches, dust-billow at the boss's feet."
- "Pulsing pale-cyan magical aura, drifting ice-crystal particles in the cold air, breath-mist visible, frozen-warrior statues lining the chamber edge."
- "Drifting blood-red ember-particles, swirling cape-edges of dark robes, distant tremor cracking the floor near the boss, runic-pulse glow on the inscribed circle."
- "Drifting feathers across the arena, the boss's robe-edge swaying mid-pose, soft golden cosmic motes pulsing, raking-light dust-particles catching the beam."
- "Geyser-eruption of lava in middle-distance, drifting embers everywhere, smoke-billowing from the boss's flame-aura, falling stone debris at the foreground."
- "Drifting black-feathers from the boss's wings, pulsing nightshade-violet aura particles, cracked-floor blood-light leaking, deep tendril-shadow stretching from the boss."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
