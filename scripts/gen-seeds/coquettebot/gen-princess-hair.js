#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/coquettebot/seeds/princess_hair.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} PRINCESS HAIR descriptions for CoquetteBot — combined hair color + style + accessories in one cohesive look. Pink pastel coquette aesthetic. These describe a girl's or creature's hair in a fairytale/princess scene.

Each entry: 8-15 words. One specific hair look (color + style + accessory together).

━━━ HAIR COLORS (mix freely) ━━━
- Pastels: rose-pink, lavender, peach, mint, baby-blue, lilac, strawberry-blonde
- Warm naturals: golden-blonde, honey, copper, auburn, chestnut, warm brown
- Cool naturals: platinum, silver-white, ash-blonde, raven-black with pink highlights
- Metallics: rose-gold, champagne-gold, pearl-white, soft-silver
- Fantasy: cotton-candy pink, sunset ombré, cherry-blossom gradient, moonlight-white

━━━ HAIR STYLES (vary widely) ━━━
- Long flowing: cascading waves, mermaid curls, straight silk curtain, windswept
- Braids: fishtail, crown braid, twin braids, waterfall braid, loose side braid
- Updos: messy bun, ballet bun, chignon, half-up with tendrils, twisted updo
- Playful: twin tails, high ponytail with ribbon, loose low ponytail, space buns
- Short: chin-length bob, pixie with side-swept bangs, wavy bob, tousled crop
- Textured: ringlet curls, soft waves, beachy texture, voluminous bouncy curls

━━━ HAIR ACCESSORIES (one per entry) ━━━
- Flowers: fresh roses woven in, cherry blossom sprigs, tiny wildflowers, peony crown
- Ribbons: satin bow at nape, velvet ribbon headband, trailing silk ribbons, bow clips
- Crowns: delicate tiara, flower crown, pearl circlet, crystal diadem, leaf crown
- Jewels: pearl hairpins, crystal combs, gem-studded clips, diamond butterfly pins
- Whimsical: tiny butterflies perched, dewdrop beads, star clips, feather wisps
- Vintage: jeweled headband, cameo hair brooch, tortoiseshell combs, lace snood

━━━ RULES ━━━
- Each entry = ONE cohesive look (color + style + accessory woven together)
- No two entries should share the same color+style+accessory combination
- Keep coquette-feminine energy throughout
- Vary across the FULL spectrum of colors, lengths, styles, and accessories
- NO descriptions of face, body, or clothing — hair only

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
