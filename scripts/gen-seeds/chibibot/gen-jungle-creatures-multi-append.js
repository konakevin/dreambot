#!/usr/bin/env node
/**
 * Append PAIR + TRIO entries to jungle_creatures.json to break solo anchor.
 * Existing 400 solo entries stay. Target: 50/30/20 solo/pair/trio.
 * Existing: 400. Total target: 800. Append: 400 (240 pair + 160 trio).
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/jungle_creatures.json',
  total: 800,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MULTI-CREATURE jungle entries for ChibiBot's jungle-canopy path. The pool already has 400 SOLO creature entries — your job is to add PAIR and TRIO entries so renders vary character count.

This batch is ALL multi-character. Mix:
- ~60% PAIR
- ~40% TRIO

Pixar / Sanrio / Studio Ghibli / Encanto STYLIZED. NEVER photoreal.

Each entry: 12-22 words. ONE specific multi-creature jungle moment.

━━━ CRITICAL: MULTIPLE DISTINCT FIGURES, EQUALLY PROMINENT ━━━
- Use "TWO DISTINCT chibi figures" / "all three visible" / "both equally prominent"
- DIFFERENT jungle species per character (so Flux renders them as separate)
- RELATIONAL contact: touching, leaning, sharing, gathered around something

━━━ JUNGLE SPECIES PAIRS/TRIOS (use widely) ━━━
Pairs: sloth + macaw / capybara + tiny bird / orangutan + lemur / toucan + frog / gibbon + butterfly / jaguar (chibi) + small monkey / coati + parrot / leaf-frog + dragonfly / chameleon + gecko / iguana + butterfly / mouse-deer + capybara / pangolin + tiny bird / spider monkey + sloth / kinkajou + bushbaby / fruit bat + leaf-katydid
Trios: three chibi monkeys / sloth + capybara + macaw / mixed-species canopy gathering / three baby tree-frogs on a leaf / parent jaguar + two cubs + tiny bird companion

━━━ 50/50 BABY/ADULT BLEND ━━━
Mix age:
- All-adult groups (mature sloth + elder gibbon)
- All-young groups (baby toucan trio)
- Mixed (parent + young + bird friend)

━━━ JUNGLE ACTIVITIES (every entry) ━━━
Sharing fruit on a vine-bridge / cuddling in a treehouse / napping on a giant leaf / drinking from a banana-cup / mid-vine-swing / preening together / perched-watching the canopy / playing in a stream / picnicking on a mushroom / sharing a banana / hiding under a giant leaf in rain / swinging together on a vine

━━━ CHIBI STYLE (still applies) ━━━
- Pixar/Sanrio stylized — NEVER photoreal
- Glassy dewy eyes, soft fluffy/scaled textures
- Optional accessories: leaf-hats, flower-crowns, vine-bracelets
- ALL characters render with chibi proportions

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary / NO Nat-Geo
- NO predator-prey — friends only
- NO scary fanged creatures
- NO sexualized
- NO identifiable real humans
- NO single-character entries (multi-only)
- NO "background character" language

━━━ DEDUP DIMENSIONS ━━━
UNIQUE species combination + activity per entry. With 15+ jungle pair combos × 12+ activities, ample variety.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures: sloth elder hanging upside-down with a tiny chibi blue-morpho butterfly on its nose, both perfectly framed"
- "TRIO of chibi capybaras soaking in a hot spring, three round bodies in a row, six glassy eyes blinking lazily"
- "TWO DISTINCT chibi figures equally prominent: a wise toucan with chipped beak and a tiny frog companion on its branch, sharing a fruit"
- "TRIO of chibi spider-monkeys hanging by their tails from one vine, three round bodies dangling, mid-laugh"
- "TWO DISTINCT chibi figures: orangutan elder offering a leaf-cup of nectar to a small lemur kit, both equally prominent"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
