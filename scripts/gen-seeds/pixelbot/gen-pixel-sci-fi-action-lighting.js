#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_sci_fi_action_lighting.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} LIGHTING descriptions for PixelBot's pixel-sci-fi-action path (Contra / Mega Man / Metroid / Blaster Master / Gradius / R-Type / Star Fox 16-bit retro sci-fi action aesthetic).

Each entry is 15-30 words. EVERY entry must include:
- DRAMATIC SCI-FI LIGHT SOURCE — pulsing reactor-core / energy-arcs / plasma-bolt-trails / neon-energy-shields / flickering monitors / lit fluorescent-strip / lava-glow / starlight / muzzle-flash strobe / explosion-glow / lit reactor-pillars / alien bioluminescence
- HIGH CONTRAST — saturated 16-bit retro sci-fi palette: electric-blue / hot-magenta plasma / acid-green toxic / metallic-orange explosions / cool-cyan reactor / blue-black space
- 16-BIT CHUNKY PIXEL feel — visible dithered shadow edges, no smooth gradients

Examples (write fresh):
- "Pulsing electric-blue reactor-core as primary light source on the corridor floor, hot-magenta plasma-arcs crackling between junction-boxes, deep blue-black shadow corners, dithered shadow edges."
- "Acid-green toxic-glow rising from chemical-tanks, deep blue-black ambient surrounding, lit fluorescent-strip overhead in cool-cyan, dithered shadow gradients on metallic catwalks."
- "Distant nebula glowing pink-and-violet in the cosmic backdrop, electric-blue laser-beams strobing across the foreground, hero spaceship rim-lit metallic-orange from explosion-glow, deep starfield-black ambient."
- "Lit reactor-pillars pulsing electric-blue throughout the chamber, alien bioluminescence acid-green from biomech-walls, deep blue-black shadow corners, dithered atmospheric depth."
- "Lava-glow orange-red rising from cracked alien-planet floor, drifting embers catching the light, deep purple-black volcanic ambient, lit pulse-rifle muzzle-flash strobing electric-blue on hero sprite."
- "Lit lunar-base structures glowing warm-amber against starfield-black sky, electric-blue plasma-bolt trails crossing the scene, deep blue-violet ambient."
- "Pulsing magenta alien-rune-glow on temple walls, deep cool-cyan jungle-canopy ambient, lit muzzle-flash strobe orange-yellow on hero sprite."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
