#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} PIXEL PALETTE descriptions for PixelBot — classic pixel-art palettes.

Each entry: 10-20 words. One specific pixel palette with 3-5 color words.

━━━ CATEGORIES ━━━
- NES 2-bit subset (black + dark-blue + light-red + cream)
- SNES pastel (bright-cyan + magenta + yellow + white)
- Gameboy-green (4 shades of green on classic DMG)
- Pico-8 (16 fixed palette — warm classic)
- CGA (black + cyan + magenta + white)
- Modern-indie-pixel (expanded indie palette)
- Celeste-style (deep-purple + peach + teal + cream)
- Stardew-valley palette (earth-tones + pastel)
- Hyper-Light-Drifter (deep-magenta + teal + orange)
- Owlboy palette (jewel-tones)
- Dead-Cells (dark-purple + orange + cream)
- Octopath-traveler HD-2D (rich modern)
- Atari-2600 (limited 4-color)
- EGA 16-color
- Game-Boy-Color pastel
- Sega-Master-System (16-color)
- Amiga-Workbench (32-color)
- CD-i pastel
- Commodore-64 (16-color limited)
- Atari-Lynx (vibrant)
- NeoGeo Pocket (vibrant pastel)
- PC-98 Japanese-palette (muted gorgeous)
- MSX 2 16-color
- Arcade-classic vibrant primary
- Vampire-Survivors-style
- Stellaris-style (sci-fi-cool)
- Crossover-modern pixel (expanded)
- Shovel-Knight NES-restrained
- Terraria-palette (natural earth)
- Risk-of-Rain-2 pixel-palette
- Dark-Souls-like dungeon pixel-palette
- Fez-palette (warm 32-bit)
- Spelunky-palette
- Chrono-Trigger SNES
- Undertale-limited
- Katana-Zero neon
- Hotline-Miami neon-pink
- Enter-the-Gungeon indie
- Mother-3 warm
- VVVVVV limited
- Thomas-Was-Alone minimal
- Fez-3D-pixel warm

━━━ RULES ━━━
- Named palette families
- 3-5 specific colors per entry
- Pixel-art-authentic

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
