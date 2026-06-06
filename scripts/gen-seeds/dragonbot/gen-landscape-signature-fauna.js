#!/usr/bin/env node
/**
 * LANDSCAPE_SIGNATURE_FAUNA — production scale-up to 200.
 *
 * SCALE-PROVER axis — fauna at PIXEL-TALL / MATCHSTICK-SIZED / ANT-SIZED
 * scale ONLY. Never focal. Distant herds / flights / silhouettes at the
 * horizon / ridge-line / cloud-bank / sea-edge / forest-edge. Their job
 * is to make the BIG things feel impossibly big — not to be the subject.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/landscape_signature_fauna.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SIGNATURE-FAUNA entries for DragonBot's landscape path. The LANDSCAPE is the hero — this axis is the TINY SCALE-PROVER wildlife woven into the deep distance. Each entry is one sentence, 22-32 words.

━━━ THE HARD MANDATE — TINY + DISTANT + NEVER FOCAL ━━━

Every entry describes fauna at PIXEL-TALL / MATCHSTICK-SIZED / ANT-SIZED scale ONLY. Their job is to make the LAND feel impossibly big. They are WOVEN INTO the deep distance — on the horizon / on the far ridge / overhead in the high thermals / at the far sea-edge / at the forest-edge midground. NEVER foreground. NEVER focal. NEVER large in frame.

━━━ EVERY ENTRY MUST CONTAIN ALL FOUR ━━━

1. NAMED FANTASY-CODED CREATURE — a SPECIFIC species: pegasus / unicorn / phoenix / dragon-shadow / griffon / hippogriff / wyvern / dire-bear / dire-wolf / aurochs / sphinx / faerie-cluster / wisp-fox / spirit-fox / leviathan / merfolk / giant / wild-horse / ibex / crane / butterfly-cloud / firefly-swarm / spirit-deer / phoenix / cockatrice
2. EXPLICIT TINY-SCALE LANGUAGE — "pixel-tall" / "matchstick-sized" / "ant-sized" / "thumbnail-scale" / "pinprick-white" / "barely a smear" / "too small to count individual shapes" / "barely a silhouette"
3. PLACEMENT IN DEEP DISTANCE — "crossing the far cloud-bank" / "moving in single file along the far ridge-line" / "on the distant cliff promontory" / "at the horizon" / "at the deep-distance reef-break" / "in the high thermals overhead" / "at the far sea-edge" / "at the forest-edge midground"
4. ONE READABLE GESTURE / ACTION — "their wing-beats lost to distance" / "moving in single file" / "wheeling above the cliffside" / "racing the horizon" / "their motion the only thing separating them from the wave-noise" / "their tiny horns catching the late-afternoon sidelight for one brief moment"

━━━ VARIETY MANDATE (distribute roughly across these creature types) ━━━

- 5 WINGED-FANTASY-IN-SKY (pegasus / phoenix / dragon-shadow / griffon / hippogriff / wyvern / cockatrice / roc) — distant in the air
- 4 HERD / HOOFED-MASS (deer-herd / wild-horse-stream / aurochs / bison / ibex / oryx / spirit-deer / caribou) — moving across far plain or ridge
- 3 PACK / PREDATOR (wolf-pack / dire-bear / dire-wolf / shadow-cats / hunting-cats) — single-file or moving on far ridge
- 3 MAGICAL-LIGHT-SWARM (firefly-swarm / faerie-cluster / wisp-cloud / spirit-mote-drift / pixie-host) — collective glow at distance
- 3 BIRD-FORMATION (crane-V / migrating-geese / hawks-circling / starling-murmuration / vulture-spiral) — in the air
- 3 SEA / WATER-EDGE (whale-spout / leviathan-back / dolphin-pod / merfolk-silhouette / kraken-tentacle-at-horizon) — at far sea-edge / reef-break
- 3 LONE-MYTHIC-SILHOUETTE (sphinx / giant / titan / lone-dragon / standing-elemental) — single distant motionless shape
- 3 INSECT-CLOUD / SMALL-BEING (butterfly-cloud / dragonfly-swarm / lantern-bug-host / moth-drift) — collective at midground
- 3 SOLO-MYTHIC-MOMENT (unicorn-pair in clearing / lone phoenix soaring / dragon-shadow on horizon / sphinx on promontory / spirit-fox at forest edge)
- 2 CLIFF-DWELLER (ibex on cliff-face / mountain-goats on vertical rock / dire-eagle on cliff-eyrie / harpy-silhouette on spire) — vertical placement
- 2 PROCESSION / MIGRATION (massed herd crossing valley / bison-thunder / aurochs-stampede in deep distance / centaur-procession on far road)

━━━ EXAMPLE PHRASINGS TO USE ━━━

Format: "A [creature] of [count] [tiny-scale-word] [shape/silhouette descriptor] [verb-of-distance], [placement] [gesture or readable detail]."

GOOD:
- "A pegasus-flight of three pixel-tall silhouettes crossing the far cloud-bank, their wing-beats lost to distance but their shapes unmistakably horse-winged against the pale sky."
- "Ant-sized wild-horses streaming across the open plain midground, perhaps twenty shapes flowing together like a single dark ribbon across the pale winter grass."
- "A dragon-shadow racing the horizon in deep distance, pixel-tall and unmistakably winged, its moving crescent-darkness briefly darkening a pale strip of river below."

━━━ BANS — CRITICAL ━━━

- NO foreground fauna. NO mid-foreground fauna. ONLY deep distance / horizon / far ridge / high thermals / far sea-edge.
- NO close-up fauna detail (no "eyes" / no "face" / no "claws" / no "scales detail") — they are TOO SMALL to resolve detail.
- NO fauna AS HERO. NO fauna that fills the frame. NO fauna larger than matchstick-sized.
- NO domestic / mundane animals as scene-defining (no chickens / no goats in a barnyard / no farm-cats) — fantasy-coded creatures or distant wild herds only
- NO characters / no humanoid figures of any kind. NO mounted figures. NO riders.
- NO weapon or combat language. NO confrontation. NO predation visible.
- NO photographer / film references

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
