#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/cozy_rpg_town_atmosphere.json',
  total: 200,
  batch: 50,
  append: false,
  maxTokens: 6000,
  metaPrompt: (
    n
  ) => `Write ${n} ATMOSPHERE descriptions for PixelBot's cozy-rpg-town path. Each entry is 15-30 words describing the animated-feel atmospheric particulate + lived-in detail for a cozy pixel-RPG town (Stardew + Octopath HD-2D + Sea of Stars).

EVERY entry must include 2-3 of these animated-feel elements:
- Chimney smoke curling from rooftops
- Drifting cherry / apple / autumn-leaf petals
- Dust motes in light shafts
- Hanging laundry billowing
- Lantern-flames dancing
- Drifting paper-lantern lights
- Birds in flight overhead
- Pixel-cats / dogs / chickens mid-stride
- NPC mid-action (vendor stocking, baker hauling, kid running)
- Festival flag-banners flapping

Examples (write fresh):
- "Chimney smoke curling from three cottages, drifting cherry-blossom petals across the square, hanging laundry billowing on a line between two roofs, a pixel-cat dozing on a barrel."
- "Autumn leaves drifting across cobblestones, dust motes in golden god-rays, a pixel-dog mid-stride along the path, festival flag-banners flapping in soft breeze."
- "Drifting paper-lantern lights swaying overhead, chimney smoke from the tavern, two NPCs mid-stride at the well, a chicken pecking near a fence-post."
- "Soft snow falling gently, smoke curling from every chimney, lantern-flames dancing in the cold breeze, a baker NPC hauling a tray of fresh bread."
- "Distant church-bells tolling, drifting petals from cherry trees, hanging laundry billowing, three NPCs gathered around the central well, a pixel-cat curled at a doorway."

Output ONLY a valid JSON array of ${n} strings. No preamble, no commentary, no markdown code fences.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
