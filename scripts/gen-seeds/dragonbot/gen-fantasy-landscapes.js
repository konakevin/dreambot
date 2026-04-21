#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/fantasy_landscapes.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `You are writing ${n} FANTASY LANDSCAPE descriptions for DragonBot — the FLAGSHIP path. Each entry is a gorgeous high-fantasy scene worthy of a fantasy-art-show gallery wall. Entries 20-40 words each. Cinematic wide vistas only — no characters, no people, no figures of any kind.

━━━ AESTHETIC NORTH STAR ━━━
Think Ted Nasmith / John Howe / Alan Lee / Frank Frazetta — the painters who made LOTR, Middle-earth art books, Howl's-Moving-Castle, Hyrule. Grounded painterly high-fantasy. Castles nestled in dramatic natural settings. Waterfalls cascading down cliffs. Vast mist-filled valleys at dawn. Multi-tiered spired citadels with towers piercing clouds. Stone bridges over gorges. Gothic keeps against sunset sky. Rivendell, Minas Tirith, Hogwarts-as-architecture, fantasy-Kyoto, Elvish forest-citadel, Dwarven mountain-city.

━━━ GROUNDED HIGH-FANTASY — BANNED TROPES ━━━
NO surreal AI-looking weirdness:
- NO floating islands with magical crystals suspended in void
- NO bioluminescent-everything glowing
- NO impossible-physics-defying architecture floating in sky
- NO multiple-moons / multiple-suns / aurora-dominant skies
- NO neon-magical-energy blasting around
- NO crystalline-everything
- NO hallucinatory liquid-starlight-waterfalls
Keep it GROUNDED — real physics, real architecture rooted to earth, real light from real-ish sun/moon. The magic is in the BEAUTY, not in impossible elements.

━━━ WHAT TO STACK (cinematic painter's recipe) ━━━
Each entry should weave together:
- ONE focal architectural element (castle, keep, spired-citadel, tower, monastery, temple, bridge, aqueduct, lighthouse, gate — OR zero architecture if pure-nature-vista)
- ONE or two dramatic natural features (cliff, waterfall, valley, mountain, forest, lake, gorge, ridge, peak, fjord)
- ONE specific lighting moment (dawn, golden hour, dusk, blue hour, stormy-break, misty-morning, moonrise, sunset-gold)
- Atmospheric cue (mist, fog, storm-clouds, low-cloud, drifting-snow, falling-leaves, rain-break)
- Painterly color-palette cue (amber-and-forest, misty-blue-gold, sunset-rose-bronze, storm-grey-with-gold-break, etc.)

━━━ HARD DIVERSITY CAPS (200 pool) ━━━
- Every entry visibly distinct in location / architecture-type / natural-setting combination
- Max 30 entries centered on a single massive castle
- Min 40 entries pure-nature-vista (no architecture at all — just jaw-dropping fantasy wilderness)
- Min 20 entries with bridge/aqueduct/pass as focal element
- Min 20 entries with monastery/temple/shrine as focal (small architecture in vast natural setting)
- Min 20 entries featuring waterfalls prominently
- Min 20 entries in snow/winter/arctic fantasy setting
- Min 20 entries in forest-canyon or deep-woods setting
- Min 15 entries at night / moonlit / blue-hour
- Spread across all seasons, all times-of-day, all biomes

━━━ RULES ━━━
- NO characters, NO figures, NO silhouettes of people
- Dragons allowed as distant peripheral silhouette in ≤15% of entries (optional, not required)
- Painterly concept-art aesthetic — never photoreal, never 3D-render-cheap
- GROUNDED high-fantasy — Tolkien-canonical not Reddit-AI-fantasy

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
