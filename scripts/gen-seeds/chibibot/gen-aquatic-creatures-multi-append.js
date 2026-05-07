#!/usr/bin/env node
/**
 * Append PAIR + TRIO entries to aquatic_creatures.json. Existing 340 solo
 * stay. Target: 50/30/20 solo/pair/trio. Append: 340 (204 pair + 136 trio).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/aquatic_creatures.json',
  total: 680,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MULTI-CREATURE aquatic entries for ChibiBot's cuddly-aquatic path. The pool already has 340 SOLO entries — your job is to add PAIR and TRIO entries so renders vary character count.

This batch is ALL multi-character. Mix ~60% PAIR / 40% TRIO.

Pixar / Sanrio / Finding-Nemo STYLIZED. NEVER photoreal.

Each entry: 12-22 words. ONE specific multi-creature aquatic moment.

━━━ CRITICAL: MULTIPLE DISTINCT FIGURES, EQUALLY PROMINENT ━━━
- "TWO DISTINCT chibi figures" / "all three visible" / "both equally prominent"
- DIFFERENT aquatic species per character
- RELATIONAL contact: touching, leaning, sharing, gathered

━━━ AQUATIC SPECIES PAIRS/TRIOS (use widely) ━━━
Pairs: sea otter + crab / dolphin + sea-turtle / clownfish + anemone-shrimp / octopus + small fish / seahorse + sea-dragon / pufferfish + clownfish / manta ray + cleaner fish / orca + dolphin / harbor seal + puffin / hermit crab + tiny snail / starfish + sea-urchin / sea-turtle + clownfish / lobster + crab / koi + frog / mermaid + dolphin
Trios: three sea-otter pups / family of dolphins / three baby seahorses / mixed-species coral gathering / three clownfish in an anemone

━━━ 50/50 BABY/ADULT BLEND ━━━
Mix age:
- All-adult (mature sea-turtle + elder octopus)
- All-young (three otter pups belly-up)
- Mixed (mother seal + pup + tiny fish friend)

━━━ AQUATIC ACTIVITIES (every entry) ━━━
Sharing kelp-snack / floating belly-up holding paws / cuddling in coral / mid-leap-together / drifting through sun-shafts / perched on coral together / sharing a clamshell-cup / mid-dance / gathered around a glowing pearl / pressed close in seagrass / mid-bubble-blow

━━━ CHIBI STYLE ━━━
- Pixar/Sanrio stylized — NEVER photoreal
- Glassy dewy eyes, glossy scaled/skinned textures with subsurface scattering
- Optional accessories: shell-pendants, kelp-crowns, pearl-beadwork
- ALL characters chibi proportions

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO predator-prey — friends only
- NO scary deep-sea
- NO sexualized
- NO identifiable humans
- NO single-character entries
- NO "background" language

━━━ DEDUP DIMENSIONS ━━━
UNIQUE species combination + activity per entry.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures: sea-otter pup and tiny crab buddy floating belly-up in the kelp, holding paws, both with massive glassy eyes"
- "TRIO of chibi clownfish in a glowing anemone, three orange-and-white bodies peeking out, all three blinking dewy eyes"
- "TWO DISTINCT chibi figures equally prominent: an elder sea-turtle with a tiny seahorse buddy curled on its mossy shell"
- "TRIO of chibi sea-otters holding paws in a row, drifting through sun-shafts, three furry tails trailing"
- "TWO DISTINCT chibi figures: octopus and small dragon-fish gathered around a glowing pearl, eight tendrils gently touching the fish's fin"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
