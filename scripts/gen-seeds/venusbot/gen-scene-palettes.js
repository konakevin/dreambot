#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/venusbot/seeds/scene_palettes.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} SCENE PALETTE descriptions — the overall color mood / grading for a render. Used across all VenusBot paths. Critical anti-cluster axis: these keep batches from all looking the same teal/orange.

Each entry: 14-28 words. Names the dominant colors + shadows + highlights + atmosphere.

━━━ CATEGORIES TO MIX ━━━
- Warm (sunset gold / copper / burnt-orange / peach / amber / honey)
- Cold (arctic white / cerulean / silver / mercury / fog-haze)
- Rich saturated (amethyst / emerald / magenta / indigo / wine-red / toxic chartreuse)
- Monochrome (black-and-white with single accent — crimson / gold / electric blue)
- Antique (sepia / ochre / parchment / bone-white / dusty rose / moss green)
- Neon (hot pink + acid yellow / electric violet + cyan / poison-green + hot magenta)
- Metallic (rose-gold / champagne / bronze patina / pewter / obsidian-and-gold)
- Cosmic (nebula-violets / aurora-greens / galaxy-blues / starfield black)
- Organic (forest emerald / autumn russet / desert ochre / ocean navy)
- Dramatic (crimson + black / blood-red + charcoal / molten-lava-and-charcoal)
- Elegant (champagne + ivory / pearl + rose / chiaroscuro black + cream)
- Nature-surreal (mint + rose-gold / bioluminescent-aqua-and-white)

Each entry names: dominant 1-2 hues + shadow color + highlight color + atmosphere descriptor (all warm / all cold / painterly / editorial / chiaroscuro / etc.)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
