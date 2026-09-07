#!/usr/bin/env node
/**
 * Generate MVP-25 seed pools for the new BloomBot Halloween candidate
 * nightshade-forest-path (Kevin 2026-09-07 — "spooky forest paths with
 * nightshade flowers drenching the scene — it's like a scary scene with
 * beautiful flowers").
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'bloombot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'nightshade-forest-path_blooms.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct hero-flower descriptions for a bot that renders
flowers as the unmistakable hero (gallery-quality, hyperreal-CGI register).
Each entry must name a REAL gothic/poisonous nightshade-family (or
nightshade-coded) flower species — deadly nightshade/belladonna (dark
purple-black bell flowers, glossy black berries), black nightshade (small
white star-flowers, black berry clusters), henbane (sinister cream petals
veined in deep purple), black datura / devil's trumpet, wolfsbane/monkshood
(deep purple hooded spikes), foxglove (maroon-purple spotted throats),
belladonna vine, deadly amanita-adjacent dark blooms, black hellebore,
witch's thimble, etc — vary widely. Describe each with LUSH, MAGNIFICENT,
richly-detailed botanical beauty (not menace) — the flower itself must sound
gorgeous even though the species is poisonous/gothic. 15-25 words each.
Examples:
["Deadly nightshade drapes in heavy garlands, its dark purple-black bell flowers glossy and full, clusters of jet-black berries gleaming like wet onyx beads.", "Foxglove spires rise in dense ranks, each maroon-purple throat deeply freckled and velvety, packed shoulder to shoulder in magnificent overgrown abundance."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'nightshade-forest-path_settings.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct EERIE FOREST PATH setting descriptions (structure/
place only — no flowers, no mention of scary mood, those are separate axes).
Vary widely: a narrow dirt path vanishing into deep fog between gnarled
ancient trees, a tunnel formed by twisted overarching branches, a crumbling
stone stairway descending into a hollow, an old iron gate half-collapsed at
a forest boundary, a forgotten forest shrine swallowed by roots, a
plank bridge over a black still creek, a path threading between massive
gnarled roots breaking through the ground, a clearing ringed by dead-looking
bare trees, etc. 15-25 words each, vivid and specific structural detail.
Examples:
["A narrow dirt path vanishes into deep fog between rows of ancient gnarled oaks, their bark black and cracked with age.", "A collapsed iron gate leans at the forest's edge, rust-eaten bars swallowed by decades of unchecked growth."]

Output ONLY a JSON array of ${n} strings.`,
  },
  {
    outPath: path.join(SEEDS_DIR, 'nightshade-forest-path_atmosphere.json'),
    total: 120,
    append: true,
    metaPrompt: (n) => `Generate ${n} distinct "money-shot" EERIE ATMOSPHERE descriptions for a
genuinely unsettling forest scene — the single detail that sells real dread
(this path is a deliberate exception allowing real scariness, unlike most
flower-bot content). Vary widely: deep shadow pooling between the trees like
something watching, gnarled branches reaching overhead like grasping hands,
an unnatural dead stillness with no birdsong, cold mist curling low across
the ground like slow breath, one shaft of thin moonlight cutting through
absolute dark, the sense of being watched from just beyond the treeline,
etc. 15-25 words each, genuinely eerie and atmospheric — not gory, not
graphic, just real dread. Examples:
["Deep shadow pools between the trunks like something patient and watching, swallowing the path just a few steps ahead.", "Not a single bird calls — an unnatural, heavy stillness presses down over the whole hollow."]

Output ONLY a JSON array of ${n} strings.`,
  },
];

async function main() {
  for (const r of RECIPES) {
    console.log(`\n=== ${path.basename(r.outPath)} ===`);
    await generatePool(r);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
