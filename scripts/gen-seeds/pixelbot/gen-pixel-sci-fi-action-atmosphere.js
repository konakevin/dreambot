#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_sci_fi_action_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} ATMOSPHERE descriptions for PixelBot's pixel-sci-fi-action path (Contra / Mega Man / Metroid / Blaster Master / Gradius / R-Type / Star Fox 16-bit retro sci-fi action aesthetic).

Each entry is 15-30 words. EVERY entry must include 2-3 of these animated sci-fi-action elements:
- Plasma-bolt trails crossing the scene
- Muzzle-flash strobing on hero/enemy
- Explosion-shrapnel debris flying
- Energy-arcs crackling between conduits
- Sparks from welding rigs / damaged consoles
- Floating debris / metallic-dust / shrapnel
- Steam venting from blast-doors / pressure-vents
- Drifting smoke-trails from explosions
- Alien-spore particles / bioluminescent motes
- Toxic-gas geysers / chemical-vapor
- Lava-bubble pop / volcanic-ash drift
- Electric arcs / lightning between machinery
- Drifting space-debris / starfield-particle drift
- Drifting moon-dust / hostile-planet sand
- Smoke from burning wreckage / ruined buildings
- Floating consoles / hovering security-drones in motion

Examples (write fresh):
- "Plasma-bolt trails crossing the scene horizontally, muzzle-flash strobing orange-yellow on hero sprite, drifting metallic-dust particles, energy-arcs crackling between damaged consoles."
- "Explosion-shrapnel debris flying from a destroyed gun-turret, drifting smoke-trail behind a kamikaze-drone, sparks from welding rigs in middle-distance, glowing reactor-pillars pulsing."
- "Drifting alien-spore particles bioluminescent acid-green, steam venting from blast-doors, toxic-gas geysers in the foreground, distant explosion-glow strobing."
- "Lava-bubble pop sequences across the molten floor, volcanic-ash drift, drifting hellfire-smoke, plasma-bolt trails from hero rifle crossing the foreground."
- "Drifting space-debris in the parallax background, electric-blue laser-beams strobing across the scene, drifting metallic-dust in vacuum, hero ship leaving an exhaust-trail."
- "Sparks from damaged conduits, drifting smoke-trails from a destroyed mech-arm, electric-arcs crackling between energy-shield-emitters, falling shrapnel."
- "Drifting moon-dust on the lunar surface, plasma-bolt trails from hero rifle, drifting smoke from a crashed ship, distant explosion-flash on the horizon."
- "Drifting alien-pollen-motes in the canopy, plasma-bolt trails crossing the scene horizontally, muzzle-flash strobing on hero sprite, drifting smoke from a wrecked mech-walker."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
