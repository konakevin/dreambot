#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_foreground_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} FOREGROUND-ELEMENT entries for a MangaBot anime-village keyframe. SCENE-LED — each entry names an EXTREME-FOREGROUND ANCHOR that sits in the lower third / corner of the frame to deepen the multi-tier composition. This is the closest depth-plane to camera.

Each entry: 12-22 words. ONE specific foreground anchor. Anchors scale, creates depth-bracket between viewer and midground village.

GENRE SPLIT (this 25-entry pool):
- 60% PASTORAL-PERIOD (Mushishi / Mononoke / Spice-and-Wolf register)
- 40% MODERN-JAPAN (Akihabara / Shimokitazawa / Showa-era / kissaten)

FOREGROUND VARIETY:
- Cherry-petal puddle (pink-blossom raft on rain-water in stone-cup)
- Lantern dropped at the lane's edge (paper torn, candle still flickering)
- Bicycle leaning against a wall (Showa-era roadbike with woven basket)
- Cat-shrine offering plate (small saucer of fish-flakes left at threshold)
- Pairs of geta-sandals lined at a genkan entry (lacquered wooden clogs)
- Persimmons hanging on string from low eaves (autumn-orange globes against weathered wood)
- Clay teapot resting on a stone stoop (steam rising, small cup beside it)
- Konbini paper-bag sat on a stone-bench at lane's edge (Showa-modern detail)
- Stack of folded futon set on a cypress veranda
- Vinyl umbrella propped against a vending machine, rain beading on it
- Wagon-wheel half-mired in mud (Spice-and-Wolf rural muddy lane)
- Wooden bucket of fresh well-water (rope coiled at the rim)
- Heap of rain-rinsed daikon piled in a wicker basket
- Small stone jizo statue at the lane edge, cloth-cap on its head
- Charcoal-brazier on a low stone (warm coals glowing, kettle on top)
- Cluster of paper-charms tied to a wooden post (omikuji fluttering)
- Wet camellia-petals scattered across stone-step
- Pair of wet boots at a doorway, water pooling beneath
- Discarded matsuri-fan dropped on lantern-lit cobble
- Open noodle-bowl steaming on a takeout-counter sill
- Bicycle bell catching late-light on a vintage frame
- Wooden hand-cart loaded with daikon resting at lane-edge
- Stacked tea-cups arranged on a low takeout shelf
- Cluster of bamboo-pipes pouring spring-water into a stone basin
- Small wooden chair upended beside a yatai's curtained front

DO write:
- A cherry-petal puddle in a worn stone basin, pink raft of blossoms floating on dawn rainwater
- A paper lantern dropped at the lane's edge, its candle still flickering inside the torn shade
- A Showa-era bicycle leaning against weathered cypress wall, woven basket holding folded newspaper
- Pairs of lacquered geta lined neatly at a genkan entry, raindrops beaded on the dark wood
- Persimmons hanging on string from low eaves, autumn-orange globes catching late-afternoon light
- A clay teapot resting on a stone stoop, thin steam rising into the cool morning shade
- A small jizo statue at the lane edge with a red knitted cap, fresh flowers laid at its base

DO NOT write:
- Hero-portrait character close-ups
- Anything mid-or-background scale (this is EXTREME foreground)
- Pure decoration without object-truth ("magical floating sparkles")
- Generic "objects on the ground" — name a SPECIFIC anchor
- Modern megacity props
- Western elements

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
