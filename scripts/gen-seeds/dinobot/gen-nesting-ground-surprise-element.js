#!/usr/bin/env node
/**
 * DINOBOT_NESTING_GROUND_SURPRISE_ELEMENT — family-specific small
 * accents added to a Mesozoic nesting/family-life scene. Hatchlings
 * peeking, sibling tumbles, parent nuzzles, hatching eggs, distant
 * adult silhouettes, communal-nest hints, dragonflies overhead.
 * Subtle background life that supports the family beat without
 * stealing focus from the hero family.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dinobot/seeds/dinobot_nesting_ground_surprise_element.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE-ELEMENT entries for DinoBot's nesting-ground path — small family-life accents that add depth to a Mesozoic dinosaur-family scene. Each entry is one sentence, 20-32 words, naming ONE quiet accent at foreground edge / midground / deep background.

━━━ THE BAR ━━━
Every entry names ONE small accent that REINFORCES the family-life mood of the scene — never steals the hero family's focus. The accent is placed with explicit position ("at the foreground edge", "at midground distance", "at deep midground", "at the far background", "in the upper background"). The register is National-Geographic-cinematic tender prehistoric family-life — quiet, observed, warm.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"A second juvenile DinoBot hatchling at the foreground edge, peeking through broad fern fronds, one tiny forepaw raised mid-pat against a leaf"
"A distant adult DinoBot silhouetted on a cliff-edge at deep midground, head lowered watchfully, crest catching amber afternoon light"
"A hatching egg at the foreground edge, a single crack splitting the shell, small snout pressing through, fragments scattered across packed earth"
"A parent DinoBot at midground, head lowered toward a tiny juvenile, passing a small mouthful of soft vegetation, both still"
"Multiple shallow nest mounds visible at deep background distance, low rounded forms receding into haze, suggesting a shared communal nursery ground"

━━━ VARIETY MANDATE (distribute across these family-life accent types) ━━━
- ~4 HATCHLING / JUVENILE PEEKING (peeking through ferns / curled in leaf-litter / belly-low in foliage / hatchling at foreground edge / juvenile shyly emerging)
- ~3 SIBLING INTERACTION (siblings play-pawing / mirroring posture / huddled together / leap over log / parallel sprint / nuzzling)
- ~3 PARENT-OFFSPRING TENDER (parent passing food / parent nuzzling juvenile / parent grooming juvenile / parent watching juvenile / shielding wing-over-young)
- ~3 EGG / SHELL DETAIL (hatching egg with crack / intact egg with light pressing in / scattered shell fragments / broken eggshell halves / down feathers around)
- ~2 DISTANT ADULT SILHOUETTE (adult on ridge / adult emerging from treeline / adult at far background / adult quietly approaching / adult standing sentinel)
- ~2 COMMUNAL NESTING HINT (multiple shallow nest mounds / nursery basin / cluster of distant nests / nursery ground across the plain)
- ~2 FOOTPRINTS / TRACKS (juvenile claw-prints / tail-drag line / scattered three-toed tracks / fresh impressions in mud)
- ~2 DRAGONFLY / FLYING INSECT (Meganeura overhead / dragonfly resting on stem / iridescent wings catching light / cluster mid-hover)
- ~2 PRIMITIVE BIRD / FEATHERED (early bird silhouette overhead / archaeopteryx mid-glide / feathered glider in distance / primitive bird perched)
- ~2 NEST MATERIAL / DEBRIS (woven dry grass / compacted nest twigs / down-feather scatter / chewed-leaf debris / shed claw)
- ~2 PUDDLE / SHALLOW WATER (juvenile drinking / sibling at puddle / parent watching juvenile drink / shallow water reflecting sky)
- ~1 MOTHER PROTECTIVE POSE (curled around eggs / wings half-spread defensively / low growl)
- ~1 SLEEPING JUVENILE (curled tight in leaf-bed / under parent's flank / drowsing in dappled light)
- ~1 SCAVENGER / SMALL CREATURE (tiny lizard at periphery / small mammal scurrying / primitive amphibian at puddle)

━━━ BANS ━━━
- NO modern animals (deer, dogs, cats, raccoons).
- NO predator-threat language that would dominate the family scene — predators in another pool.
- NO making the accent the FOCAL beat — it's small, peripheral, atmospheric.
- NO bare "an egg" — name position + state + small detail.
- NO repeating the same exact accent across entries.
- NO violent / gory imagery — register is tender family-life.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Reference the dinosaur generically as "DinoBot" or by family-role (adult / parent / juvenile / hatchling / sibling) — do not name specific species (the hero family species comes from another pool).`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
