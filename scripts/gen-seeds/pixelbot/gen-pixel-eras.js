#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_eras.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL ART ERA/STYLE descriptions for PixelBot. Each entry is a specific retro gaming era or pixel art style that will be injected into every render as a style anchor.

Each entry: 8-15 words. A specific pixel art era with its defining visual characteristics.

━━━ ERAS TO COVER (spread across all) ━━━
- 8-bit NES/Game Boy (4-color tile grids, chunky sprites, green-tint or pastel)
- 8-bit ZX Spectrum / Commodore 64 (attribute clash, bold primaries, scanlines)
- 16-bit SNES (rich palettes, Mode 7 depth, lush color gradients)
- 16-bit Sega Genesis (higher contrast, blast processing sharpness, punchy saturated)
- 32-bit PS1-era (pre-rendered backgrounds, dithered textures, CRT warmth)
- GBA-era (bright backlit palette, clean sprites, portable-screen-sized scenes)
- Modern indie pixel (Celeste/Hyper Light Drifter/Dead Cells — high detail within pixel constraint)
- Isometric pixel diorama (SimCity/Ultima/Habbo Hotel angular grid)
- PC-98 / MSX Japanese computer pixel (anime-influenced, limited palette, dithered gradients)
- Pixel art demoscene (technical showpiece, impossible detail in tiny resolution)

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: platform/era + visual characteristic. Two entries for the same era with different visual focus = good. Two entries describing the same exact look = too similar.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
