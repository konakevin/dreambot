#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for ToyBot — toy-world color moods.

Each entry: 10-20 words. One specific toy palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Bold primary (red + blue + yellow + white — classic LEGO)
- 80s saturated (hot-pink + teal + yellow + black — retro-toy)
- Pastel cozy (soft-pink + mint + butter + cream)
- Noir moody (charcoal + single-amber-light + grey + cream)
- Fantasy warm (amber + gold + forest-green + cream)
- Sci-fi cool (chrome + cyan + white + shadow)
- Sackboy-burlap (brown + beige + green-yarn + cream)
- Claymation primary (bright Play-Doh red/blue/yellow/green)
- Vinyl glossy (glossy-rich color + matte-panel-shadow)
- Cyberpunk neon (magenta + cyan + yellow + black)
- Rust and brass steampunk (bronze + rust + cream + shadow)
- Pirate cove (teal + gold + brown + cream)
- Ninja stealth (black + red + grey + accent-gold)
- Wild-west sepia (burnt-orange + tan + black + cream)
- Castle medieval (slate + burgundy + gold + moss-green)
- Space-marine (olive + khaki + metal-grey + amber-accent)
- Autumn-toy (rust + pumpkin + honey + chocolate)
- Winter-snow-toy (white + pale-blue + grey + warm-amber-window)
- Jungle-green (saturated-greens + earth-brown + sunlight-gold)
- Ocean-blue (cobalt + teal + white-foam + coral)
- Desert-dune (sand + terracotta + cream + deep-shadow)
- Lego-classic (red + blue + yellow + green + white + black)
- Coraline-eerie (muted-teal + burnt-rust + charcoal + ghost-white)
- Laika-autumn (deep-orange + burgundy + forest + cream)
- 70s toy-catalog (avocado + amber + cream + faded-red)
- Superhero bright (primary-red + primary-blue + yellow + white)
- Fairy-tale pastel (lavender + rose + pale-mint + cream)
- Mid-century-modern-toy (teal + mustard + cream + walnut)
- Christmas-toy (crimson + forest-green + gold + cream)
- Retro-robot (chrome + red + blue + yellow)
- Parisian-toy (cream + rose + navy + gold-accent)
- Cherry-blossom-toy (sakura-pink + cream + pale-green + gold)
- Pirate-sea (teal + gold + cream + rust)

━━━ RULES ━━━
- Toy-color palettes
- 3-5 specific color words per entry

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
