#!/usr/bin/env node
/**
 * PIXELBOT_COZY_RPG_TOWN_NPC_LIFE — inhabited cozy-pixel-RPG town detail.
 * Stardew + Octopath HD-2D + Sea of Stars + Eastward + Children of Morta
 * townhub NPCs in their daily life moments. ~45-65 word entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_cozy_rpg_town_npc_life.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} NPC-LIFE entries for PixelBot's cozy-rpg-town path — Stardew Valley / Octopath Traveler HD-2D / Sea of Stars / Eastward / Children of Morta cozy-town hub register. Each entry is one INHABITED daily-life moment showing an NPC mid-action OR a town-life detail (animal / object) that signals the place is lived-in. Title-caps prefix THEN " — " separator THEN 45-65 word description.

━━━ THE BAR ━━━
Every entry is ONE life-sim NPC moment OR cozy inhabited detail on the town tile-grid. NPC is named by role + outfit + a present-tense mid-action verb (sweeping / pulling / arranging / chasing / sleeping / climbing / sketching). The setting context (cobblestone / awning / market-stall / fountain / shopfront / tavern-door) anchors it to a cozy RPG town. Generous, warm, lived-in. ~45-65 words.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"MARKET VENDOR AT STALL — pixel-NPC vendor in a striped apron calling out cheerfully at a wooden stall stacked with wicker baskets of red apples and golden pears, colorful price-tags dangling from the awning, two customers leaning in to browse, cobblestone square bustling around him."
"CHILDREN CHASING BALL — three pixel-NPC children sprinting across sun-dappled cobblestone chasing a worn leather ball, arms pumping, mouths open in laughter-implied motion, a small spotted dog bounding alongside them, a fruit vendor shaking his head with a grin as they pass his stall."
"CAT SLEEPING ON BARREL — fat orange tabby sprawled across the flat top of a wooden barrel outside a tavern door, one paw dangling lazily over the edge, sunlight pooling on its belly, a half-empty flower-box on the windowsill above framing the drowsy scene."

━━━ VARIETY MANDATE (distribute across these categories) ━━━

NPCs — daily-life townsfolk (~70%):
- ~6 VENDORS / SHOPKEEPERS (baker, butcher, fishmonger, jeweler, tailor, weaver, basket-maker, candle-maker, weapon-smith, herbalist, scroll-seller, cheesemonger)
- ~5 TOWNSFOLK DOING DOMESTIC CHORES (sweeping porch, hanging laundry, watering window-boxes, drawing well-water, beating rugs, chopping firewood, shucking corn, kneading bread, sharpening tools, polishing brass)
- ~3 CRAFTSPEOPLE AT WORK (blacksmith at anvil, potter at wheel, woodcarver at bench, fletcher at workbench, painter at easel, weaver at loom, glassblower at hearth, stonemason at chisel)
- ~3 CHILDREN AT PLAY (chasing ball, drawing chalk, climbing tree, splashing puddles, racing hoops, playing tag, feeding ducks, building stick-forts)
- ~3 ELDERS / DOMESTIC (grandmother knitting on bench, elder smoking pipe at doorstep, mother nursing baby, father teaching child, couple chatting on bench)
- ~3 LIVELY SOCIAL (musicians playing, dancers at festival, bard with lute, juggler at fountain, two friends laughing, old men playing chess, neighbors gossiping)

Cozy inhabited details — animals + objects (~30%):
- ~4 CATS / DOGS / PETS (cat sleeping on barrel, dog napping at door, cat stretching, puppy chasing tail, kittens nursing, dog leashed to cart)
- ~3 STREET ANIMALS (chickens pecking, ducks waddling, pigeons in fountain, sparrows on awning, goose hissing, geese in puddle)
- ~3 COZY SCENE PROPS (laundry strung between houses, flower-boxes overflowing, basket of fresh bread on doorstep, lantern-strings overhead, fruit pyramid at stall, mail bundled in basket, festival garlands)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- Body is one sentence with present-tense action, 45-65 words.
- ALWAYS name the role + outfit detail + mid-action verb (or animal/object + state + place).
- ALWAYS anchor to a cozy town context (cobblestone / awning / shopfront / market / fountain / tavern-door / bench / barrel).
- Tone: lived-in, cozy, warm, magical-pastoral.

━━━ BANS ━━━
- NO combat / weapons-in-use / blood / violence — this is a COZY peaceful town.
- NO modern objects (cars / phones / electric lights — lanterns / oil-lamps only).
- NO character-naming famous IPs (no Tom Nook, no specific Stardew NPCs).
- NO grim / dark / threatening atmospheres.
- NO photoreal register — this is 16-bit pixel-art cozy RPG.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in the "TITLE-CAPS — body" format.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
