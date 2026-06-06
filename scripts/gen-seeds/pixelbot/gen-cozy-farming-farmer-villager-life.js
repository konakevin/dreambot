#!/usr/bin/env node
/**
 * PIXELBOT_COZY_FARMING_FARMER_VILLAGER_LIFE — 16-bit cozy life-sim
 * (Stardew / Harvest Moon / Animal Crossing pixel-spin) solo farmer
 * mid-cozy-task OR ambient villager moment in scene. TITLE-CAPS
 * prefix register matching the existing pool.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_cozy_farming_farmer_villager_life.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} FARMER-OR-VILLAGER-LIFE entries for PixelBot's cozy-farming-life-sim path — 16-bit Stardew/Harvest-Moon-style solo farmer mid-cozy-task OR ambient villager moments. Mirror this exact format: TITLE-CAPS PREFIX — description (40-60 words).

━━━ THE BAR ━━━
Every entry is ONE farmer or villager (or domestic animals as ambient life) mid-cozy-action on the cozy-farming pixel landscape. Title-caps prefix names the moment. Description includes specific cozy props, garments, and atmosphere. Position language ("solo farmer in the foreground", "villager-vendor in the midground", "tiny on the foreground") is required.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"FARMER WATERING CROPS — solo farmer in straw-hat and overalls tiny on the foreground mid-watering a crop-row with watering-can tilted forward, gentle water-pixels cascading down, mid-stride pose leaning toward the next seedling row, worn boots in the soil."
"CHICKENS PECKING IN YARD — cluster of six brown-and-white chickens in the midground pecking at scattered seed-pixels on a dirt-patch beside a wooden coop, feathers ruffled, heads bobbing, ambient pastoral coop-life with a feed-sack propped against the fence-post."
"BLACKSMITH AT FORGE — villager-blacksmith in a heavy leather-apron on the midground mid-hammer-strike at a glowing anvil, bright orange spark-pixels bursting upward, warm forge-glow behind casting amber light, muscular mid-action pose with hammer raised, iron tongs resting on the bench."
"VILLAGERS DANCING AT FESTIVAL — four villagers in the midground mid-dance in a loose circle at a festival, arms linked, feet lifted in a step, colorful hanging-lanterns glowing overhead, bunting strung between posts, generous celebratory cozy mood with wide smiles visible."

━━━ VARIETY MANDATE (distribute across these cozy moments) ━━━

Solo farmer tasks (~40% of entries):
- ~4 CROP WORK (watering / planting / harvesting tomatoes / harvesting carrots / harvesting pumpkins / weeding / tilling / sowing seeds / picking strawberries / picking apples)
- ~3 ANIMAL CARE (feeding chickens / milking cow / brushing horse / herding sheep / collecting eggs / petting dog / feeding rabbits)
- ~2 TOOL WORK (chopping wood / mining ore in pit / repairing fence / hammering posts / mending tools)
- ~2 FISHING / FORAGE (fishing at dock / foraging berries / collecting mushrooms / clamming at beach)
- ~2 COZY DOMESTIC (resting on porch / drinking tea / reading book in chair / sitting by hearth / napping under tree)
- ~2 SOCIAL / FRIEND (chatting with neighbor / giving gift / accepting flowers / waving from porch)

Villager NPCs at work (~35%):
- ~4 SHOPKEEPERS (vendor at market stall / baker pulling bread / blacksmith at forge / general-store clerk / fish-vendor / cheesemonger / candy-maker / pickle-seller)
- ~3 CRAFTSPEOPLE (carpenter sawing / potter at wheel / weaver at loom / cobbler sewing boots / candlemaker / herbalist mixing tea)
- ~3 FESTIVAL VILLAGERS (festival vendor / festival musician / dancing villagers / ring-toss kids / parade marcher / lantern-lighter)
- ~3 CHORE VILLAGERS (sweeping porch / hanging laundry / drawing well-water / washing windows / mowing grass / pruning hedges / sweeping path)

Domestic animals as ambient life (~15%):
- ~3 CHICKENS / FOWL (chickens pecking / chickens dust-bathing / ducks paddling / ducks waddling / geese honking)
- ~2 LIVESTOCK (cows munching / sheep grazing / sheep being sheared / pigs in pen / goats climbing / horses grazing)
- ~2 PETS (cats curled napping / kittens chasing leaves / dogs sniffing flowers / pet-rabbit in garden / parrot on perch)

Children + romantic ambient (~10%):
- ~2 KIDS (kids playing tag / child with wooden-sword / child chasing balloon / kids splashing in stream / kid riding cat / kid building fort)
- ~2 COUPLES / FAMILY (couple on bench / family at picnic / elder with grandkid / mother carrying baby / friends sharing pie / lovers under tree)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 3-5 WORDS IN ALL-CAPS, then " — " separator, then the description.
- Body is one sentence, 40-60 words.
- ALWAYS include position cue: "tiny on the foreground" / "in the midground" / "on the foreground" / "in the midground inside a barn" etc.
- ALWAYS include cozy-specific descriptors: "ambient pastoral register" / "cozy domestic register" / "peaceful afternoon register" / "generous cozy register" / "warm celebratory cozy mood".
- ALWAYS include 1-2 cozy prop tells (basket / lantern / mug / tools / hat / apron / fence / barn / dock / pond / festival-bunting).

━━━ BANS ━━━
- NO combat, NO dungeon, NO monsters — cozy farming life only.
- NO modern objects (cars, phones, TVs).
- NO photoreal register — everything is 16-bit cozy pixel art.
- NO bare "a farmer farming" — name the SPECIFIC crop, animal, tool, task.
- NO repeating the exact same NPC archetype across entries.
- NO grim / dark / horror tones — register is COZY + warm + peaceful + generous.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string in the "TITLE-CAPS — body" format.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
