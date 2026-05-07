#!/usr/bin/env node
/**
 * One-time append: add MULTI-CREATURE (pair + trio) entries to cute_creatures.json
 * to break the all-solo render anchor. Existing 200 solo entries stay.
 * Target: 50/30/20 solo/pair/trio distribution.
 *
 * Existing: 200 solo. Total target: 400. Append: 200 (120 pair + 80 trio).
 * Pairs and trios mix species + 50/50 baby+adult mix.
 */
const { generatePool } = require('../../lib/seedGenHelper');

generatePool({
  outPath: 'scripts/bots/chibibot/seeds/cute_creatures.json',
  total: 400,
  append: true,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} MULTI-CREATURE descriptions for ChibiBot's cute-creature pools. The pool currently has 200 SOLO creature entries — your job is to add PAIR and TRIO entries so renders vary character count.

This batch is ALL multi-character. Mix:
- ~60% PAIR (two characters): "tiny fox companion to a small badger, both peering from a moss-burrow"
- ~40% TRIO (three characters): "trio of hedgehog siblings sharing acorn-cups under a fern"

Pixar / Sanrio / Studio Ghibli STYLIZED cute. NEVER photoreal. ADULT-cute or BABY-cute, mix freely (~50/50 across entries).

Each entry: 12-22 words. ONE specific multi-creature relational moment.

━━━ CRITICAL: TWO/THREE DISTINCT FIGURES, EQUALLY PROMINENT ━━━
Composition language must FORCE Flux to render multiple characters at equal prominence:
- Use phrases like "TWO DISTINCT chibi figures side-by-side", "BOTH equally prominent in frame", "all three visible as separate characters"
- DIFFERENT species per character (so Flux can't merge them into one) — e.g., "fox + bunny", "otter + crab", "hedgehog + mouse + fledgling"
- RELATIONAL contact: touching, leaning, sharing, holding paws, gathered around something

━━━ RELATIONAL WARMTH (every entry) ━━━
The characters are TOGETHER FOR A REASON: cuddling, sharing food, walking together, watching the world, having a conversation, comforting each other, playing, gathering, picnicking. NOT a crowd, NOT random clustering — small intimate group with relational warmth.

━━━ MIX OF SPECIES PAIRS/TRIOS (use widely) ━━━
Pairs: fox + bunny / otter + crab / hedgehog + mouse / badger + bird / squirrel + chipmunk / cat + ferret / rabbit + sparrow / sloth + tropical bird / sea turtle + clownfish / polar bear + arctic fox / capybara + duckling / sloth + butterfly / kitten + mouse / fawn + chick / lemur + frog
Trios: three siblings (mice, foxes, kittens) / parent + two young / two friends + one companion / mixed-species gathering (fox + mouse + bird) / three-creature picnic / three-creature naptime

━━━ 50/50 BABY/ADULT BLEND ━━━
Mix age across entries:
- ~50% all-adult or mixed-age groups: "old wise badger with young apprentice mouse"
- ~50% all-young or all-adolescent groups: "two kits play-fighting in a flower-meadow"
Avoid making EVERY trio "three babies" — vary it.

━━━ ACTIVITIES + COMPOSITIONS (every entry) ━━━
Cuddling close + napping in a pile + sharing acorn-cups + walking down a moss-path / cobblestone lane + perched together watching the sunset + giving a smaller friend a piggyback + playing with leaves + reading a tiny book together + making tea together + watching fireflies + sharing a blanket + sitting on a mushroom together + at a tiny picnic + walking single-file home + helping each other carry a load

━━━ CHIBI STYLE (still applies) ━━━
- Pixar / Sanrio / Disney stylized — NEVER photoreal
- Glassy reflective dewy eyes (still chibi-cute proportions even for adults)
- Soft fluffy / velvet / scaled textures
- Optional cute accessories — woven scarves, flower crowns, beadwork collars, tiny aprons
- Both/all characters render with chibi proportions

━━━ ABSOLUTELY BANNED ━━━
- NO photoreal / NO documentary
- NO predator-prey scenarios — companions are FRIENDS, not hunter+hunted
- NO sexualized
- NO identifiable real humans
- NO single-character entries (this batch is multi-only)
- NO "background character" or "secondary creature" language — every character is FOREGROUND and equally prominent

━━━ DEDUP DIMENSIONS — CRITICAL ━━━
EVERY ENTRY uses a UNIQUE species combination + activity. Don't repeat "fox + bunny + cuddling" across entries — vary species + activity. With 16+ pair combos and 5+ trio formats and 15+ activities, no excuse for repeats.

━━━ EXAMPLES (DO NOT REUSE) ━━━
- "TWO DISTINCT chibi figures: tiny fox kit and weathered badger sharing acorn-tea on a moss-log, both equally prominent in frame, paws nearly touching"
- "TWO DISTINCT chibi figures side-by-side: round otter holding a clamshell-cup, hermit crab buddy on top of the otter's head with a tiny pearl-tongs"
- "TRIO of chibi mice siblings cuddled in a flower-petal hammock, three round bodies overlapping, three pairs of glassy eyes peeking out"
- "TWO DISTINCT chibi figures equally prominent: an elder polar bear with a small arctic fox kit walking side-by-side across moonlit snow"
- "TRIO at a tiny picnic — chibi hedgehog with knit scarf, chibi rabbit with flower crown, chibi sparrow on a teapot — all three foregrounded around a leaf-mat"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, no markdown.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
