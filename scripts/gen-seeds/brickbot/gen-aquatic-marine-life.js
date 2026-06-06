#!/usr/bin/env node
/**
 * BRICKBOT_AQUATIC_MARINE_LIFE — brick-built sea creatures populating the
 * reef/beach/wreck for scale, life, story. Audit 2026-06-05: 34 → 200.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/brickbot/seeds/brickbot_aquatic_marine_life.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (n) => `You are writing ${n} MARINE-LIFE entries for BrickBot's aquatic path — each entry is ONE brick-built sea creature populating a reef/beach/wreck/kelp diorama. Each entry is ONE phrase, 22-35 words, leading with "A brick" and naming creature + build technique + posture + scene context.

━━━ THE BAR ━━━
Every entry names a SPECIFIC sea creature, describes how it's CONSTRUCTED from brick parts (slope-bricks, plates, SNOT, bar-rods, tiles, plant-elements, transparent pieces), names its POSTURE (mid-glide / mid-strike / suspended / drifting / arched), and gives ONE scene anchor (suspended on clear rod, drifting past kelp, banking by coral, perched on hull). The creature reads unmistakably BRICK, never photoreal.

━━━ VARIETY MANDATE (distribute across categories) ━━━
- ~5 FISH SCHOOLS / SHOALS — clownfish, parrotfish, angelfish, jacks, sardines, etc. (small slope-and-wedge fish on clear rods)
- ~4 LARGE PELAGIC — whale, orca, dolphin, marlin, sailfish, tuna, sunfish (slope-plate hull + plate-fins)
- ~4 SHARKS / RAYS — great white, hammerhead, tiger, whale-shark, manta, eagle-ray, stingray
- ~4 REEF DWELLERS — moray eel, octopus, cuttlefish, lobster, crab, sea-urchin, starfish, sea-snake
- ~3 CEPHALOPODS / DEEP / WEIRD — giant squid, vampire squid, anglerfish, gulper-eel, lanternfish
- ~3 SHELLED — sea-turtle, nautilus, crab, lobster, conch (dome-slope shells + tile-pattern)
- ~3 JELLYFISH / DRIFTERS — bell-domed jellies, trans-plate Portuguese-man-of-war, ctenophore, plankton-swarm
- ~2 MARINE MAMMALS — seal, sea-lion, manatee, walrus, sea-otter (resting/raft contexts)
- ~2 BIRDS AT SURFACE — pelican plunge, gull at gunwale, frigatebird overhead, cormorant diving
- ~2 CORAL-DWELLER CRYPTIDS — seahorse, frogfish, mantis-shrimp, lionfish, scorpionfish, blue-ringed octopus
- ~1 WHALE-SHARK / MEGAFAUNA at fly-by scale — gargantuan slope-plate hull dwarfing the diver
- ~1 SEAGRASS / FORAGER — dugong, sea-cow, parrotfish grazing

━━━ FORMAT ━━━
Each entry: ONE phrase, lead with "A brick", 22-35 words. Touchpoints:
"A brick sea-turtle — domed green slope-brick shell with hexagon tile-pattern, plate flippers angled mid-stroke, printed-eye head on a short neck, gliding past a coral wall."
"A brick clownfish-school — a dozen small orange-and-white slope-and-wedge fish on clear rods at a matched drift-angle weaving around a modified-plant anemone clump."
"A brick anglerfish — a dark-grey slope-brick lure-rigged head with a trans-yellow bulb-element dangling from a clear bar-rod, gaping printed-jaw plate-tile teeth, hovering in trench-dark."

━━━ BANS ━━━
- NO photoreal language ("scaly skin", "glistening fish")
- NO live-fluid-motion verbs ("swimming gracefully", "darting through water")
- NO duplicating species already in pool — vary across categories
- NO licensed franchise names
- NO non-marine animals
- NO blank "fish" — name the species

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each starts with "A brick".`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
