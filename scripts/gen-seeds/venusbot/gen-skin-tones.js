#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/venusbot/seeds/skin_tones.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SKIN TONE descriptions for the organic half of a cyborg woman. Each entry is a specific tone — across ALL human ethnicities + alien species. Main diversity axis for the bot.

Each entry: 10-20 words. Specific + visual + distinct.

━━━ MIX WIDELY ━━━
- Human ethnic tones (ebony/cocoa/umber/sepia/olive/tawny/porcelain/tan/beige/alabaster — NAME ethnic specificity)
- African (deep ebony, mahogany, cocoa with red undertones, velvet brown)
- Latinx / Mediterranean (olive-honey, warm tan, sienna, desert-warm)
- South Asian (tawny bronze, warm sienna, golden-brown)
- East Asian (porcelain-peach, warm ivory, honey-gold)
- European (alabaster, rose-pink, freckled cream, cool beige)
- Native / Indigenous (warm copper, red-bronze, sun-weathered)
- Alien / fantasy (pink/green/violet/gray/blue/translucent/obsidian/jade/lavender/fuchsia/seafoam/crimson/iridescent/ashen/bioluminescent)

Each entry names the undertone (warm / cool / rose / golden / copper / silver) and a textural quality (matte / velvety / glossy / translucent / luminous / sun-warmed).

━━━ BANNED ━━━
- "posing" / "modeling" (not about her)
- Race-coded features (no "with elf ears", no "with horns") — this is SKIN ONLY
- Generic "dark skin" / "pale skin" without specificity

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
