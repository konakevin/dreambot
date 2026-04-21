#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glambot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE-WIDE COLOR PALETTE descriptions for GlamBot — editorial color moods.

Each entry: 10-20 words. One specific editorial palette with 3-5 color words.

━━━ CATEGORIES ━━━
- Jewel-tones (emerald + sapphire + ruby + gold)
- Monochromatic-emerald (multiple-green shades + black + cream)
- Neon-cyberpunk (magenta + cyan + yellow + black)
- Minimalist-white (white + cream + grey + black-accent)
- Sunset-editorial (burnt-orange + coral + gold + blue-shadow)
- Dark-editorial (black + crimson + chrome + shadow)
- Chrome-metallic (silver + chrome + grey + warm-accent)
- Rose-gold-editorial (rose-gold + blush + cream + deep-shadow)
- Electric-blue (cobalt + ice + silver + black)
- Tropical-editorial (turquoise + coral + gold + palm)
- Desert-bronze (sand + bronze + cream + terracotta)
- Velvet-burgundy (deep-red-velvet + gold + black + cream)
- Pastel-editorial-bold (electric-pastel-pink + mint + butter + white)
- Champagne-gold (champagne + cream + gold + warm-beige)
- Monochromatic-black (all-black + subtle-shadow + single-accent)
- Cherry-bomb-red (red + cream + gold + black)
- Matrix-green (emerald + black + chartreuse + white)
- Sapphire-drama (deep-sapphire + silver + white + accent)
- Lavender-haze (lavender + rose + cream + silver)
- Electric-purple (ultra-violet + neon-pink + cream + silver)
- Saffron-gold (saffron + gold + cream + warm-brown)
- Oxblood (oxblood + gold + cream + shadow)
- Mustard-and-plum (mustard + plum + cream + warm-beige)
- Blush-and-denim (blush + indigo + cream + warm-white)
- Kohl-and-chrome (black-kohl + chrome + cream + red-accent)
- Ivory-and-gold minimal
- Plum-and-mint contrast
- Coral-reef (coral + turquoise + cream + sand)
- Arctic-crystal (ice-blue + white + silver + cream)
- Fire-and-smoke (orange + black + crimson + amber)
- Mirror-silver (silver + cream + grey + glass-reflection)
- Cyber-pink (hot-pink + cyan + black + white)
- Autumn-editorial (rust + burgundy + gold + brown)
- Spring-editorial-bold (chartreuse + pink + cream + gold)
- Blood-and-milk (crimson + cream + black + rose)

━━━ RULES ━━━
- Editorial / bold palettes
- 3-5 specific colors per entry
- Never soft-coquette (that's CoquetteBot)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
