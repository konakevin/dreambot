#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/tabletop_backdrop.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SOFT-FOCUS BACKDROP descriptions for a kawaii checkered-tabletop scene. The tabletop is the foreground hero — this axis describes what's visible BEHIND it (a window, kitchen wall, cafe interior, garden patio, cottage corner, etc.) as a SOFT-FOCUS atmospheric backdrop, NEVER sharp landscape.

Each entry: 16-26 words. ONE specific backdrop. Soft-focus / bokeh / dreamy.

DO write:
- A soft-focus kitchen window behind with leaded panes and pastel curtains
- A blurred-bokeh cafe interior with hanging plants and warm pendant-lights
- A dreamy garden-patio with climbing roses and white picket fence softly out of focus
- A soft cottage-kitchen wall with hanging copper pots in warm bokeh
- A pastel patisserie display case visible behind in soft focus
- A blurred picnic-blanket meadow with wildflowers and grass behind
- A soft cottage living-room with leaded windows and lace curtains
- A dreamy tea-house corner with shoji screens and bamboo accents softly out of focus
- A blurred sunny garden behind with pastel flowers softly bokeh
- A soft kitchen counter with pastel-color jars in warm-glow bokeh
- A dreamy cafe wall with chalkboard menu and shelves of mugs in soft focus
- A blurred bakery display case with macarons and cakes behind
- A soft pastel pink-painted wall with picture frames and a window in soft focus
- A dreamy autumn-window with maple leaves outside in soft bokeh
- A soft conservatory-greenhouse interior with plants and pastel pots behind
- A blurred Japanese tea-house with paper lanterns and bamboo in soft focus
- A dreamy bistro setting with vintage chair-back and curtained window behind
- A soft cottage-corner with floral wallpaper and a small framed painting
- A blurred sunny-window with potted plants on the sill in soft focus
- A dreamy birthday-party banner backdrop in pastel-rainbow softly out of focus

DO NOT write:
- Sharp / detailed / fully rendered landscapes (this is a SOFT-FOCUS BOKEH backdrop)
- Foreground (foods / vessels / tabletop / characters)
- Modern industrial / mall / commercial scenes
- Dark / scary / dirty
- Real kanji / English-text labels

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
