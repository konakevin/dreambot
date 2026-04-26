#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_perspectives.json',
  total: 25,
  batch: 25,
  metaPrompt: (n) => `You are writing ${n} PIXEL ART CAMERA PERSPECTIVE descriptions for PixelBot. Each entry is a specific camera angle/viewpoint that will be injected into every render. These should describe HOW the scene is framed, not WHAT is in it.

Each entry: 8-15 words. A specific pixel-art camera perspective with its visual signature.

━━━ PERSPECTIVES TO COVER (spread across all) ━━━
- Top-down isometric (classic JRPG overworld, 45-degree angle, tiled grid visible)
- Three-quarter overhead (Stardew Valley / Link to the Past, slightly tilted down)
- Side-scrolling profile (Castlevania / Metroid / Dead Cells, flat horizontal view)
- Straight-on platformer (Celeste / Mario, clean horizontal layers, parallax depth)
- First-person corridor (Doom / Wolfenstein pixel, vanishing-point hallway)
- Diorama cutaway (cross-section like a dollhouse, rooms visible inside walls)
- Close-up detail shot (zoomed into one object or face, pixel texture visible)
- Wide panoramic vista (sweeping landscape, layered parallax background)
- Low-angle hero shot (looking up at subject, dramatic pixel silhouette)
- Bird's-eye straight down (pure top-down, map-view, no perspective distortion)
- Over-the-shoulder (RPG dialogue framing, character back visible)
- Dutch angle / tilted (off-kilter framing, tension and unease)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: camera angle + distance (close/mid/wide). Two isometric entries at different zoom levels = OK. Two identical three-quarter overheads = too similar.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
