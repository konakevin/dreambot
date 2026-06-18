#!/usr/bin/env node
/**
 * BloomBot jack-and-the-giant-flower path pools (2026-06-18).
 * Three bespoke axes for the giant-flower-climbing-to-the-sky path:
 *   giant_form     — HOW the colossal hero flower towers up to the sky (the
 *                    silhouette/structure; species-agnostic, the species comes
 *                    from the flowerEngine roster hero).
 *   base_surround  — the lush ground-level world at the giant's base (scale).
 *   sky_ascent     — the open sky the giant climbs up into (40%-gated).
 * Run: node scripts/gen-seeds/bloombot/gen-giant-flower-pools.js
 */
const { generatePool } = require('../../lib/seedGenHelper');

const POOLS = {
  bloombot_giant_flower_giant_form: {
    metaPrompt: (n) => `You are writing ${n} GIANT-FLOWER FORM descriptions for BloomBot's "jack-and-the-giant-flower" path — a single flower grown as TALL as a giant redwood, but on a LUSH GREEN FLOWERING VINE-STEM, not a tree (a Jack-and-the-Beanstalk nod; NO Jack, NO human). Each entry describes the FORM of the giant flower + its towering flowery stem — species-AGNOSTIC (the actual flower species is supplied separately, so do NOT name a species).

Each entry: 15-30 words. THE KEY DETAIL every entry MUST carry: the stalk is a THICK, SOFT, GREEN, LEAFY FLOWER-VINE-STEM — wrapped in tendrils, climbing-leaves and small buds, CURVING and twisting organically as it climbs (NEVER a woody tree-trunk, NEVER bark, NEVER a straight rigid pole). One single giant bloom crowns it, high overhead, redwood-tall.

VARIETY — ~25 distinct forms of the giant flower on a flowery vine-stem: one titanic bloom swaying atop a thick green leaf-wrapped stem that spirals up hundreds of feet; a colossal bloom crowning a curving beanstalk-vine studded with smaller buds all up its length; a giant nodding bloom on a soft fluted green stem leaning gracefully against the sky; a huge bloom atop a twisting tendril-laced vine-stalk that loops and curls as it climbs; a vast bloom on a leafy stem so tall it disappears into mist, leaves cascading; a giant bloom on a green stem that forks into several budding side-shoots high up; a towering arching flower-vine heavy with one enormous bloom turned to the light; a thick juicy green stem dripping with leaves and little climbing-flowers, one colossal bloom far above. Each names the SINGLE giant bloom + the thick GREEN LEAFY TWISTING FLOWER-VINE-STEM + the redwood-tall scale.

RULES — no species names, no humans. The stalk MUST read as a LUSH GREEN LEAFY FLOWER-VINE-STEM that curves/twists — NEVER a woody tree-trunk, NEVER bark, NEVER straight-rigid. Redwood-TALL but a flower-stem, not a tree.

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },
  bloombot_giant_flower_base_surround: {
    metaPrompt: (n) => `You are writing ${n} GROUND-WORLD descriptions for BloomBot's "jack-and-the-giant-flower" path — the normal-scale world at the foot of a giant flower that towers overhead. This world is DWARFED — it gives SCALE so the giant reads as monumental. The KEY GOAL is BIOME VARIETY: do NOT default to a temperate pine forest / mountain meadow. Span many different landscapes.

Each entry: 15-30 words. A real, vivid, normal-scale ground-level landscape, with normal-size details that look TINY against the colossal stem.

VARIETY MANDATE — ~25 DISTINCT BIOMES, spread widely (each entry a different one): a sun-baked DESERT of red dunes and cacti; a misty TROPICAL JUNGLE floor of broad ferns and vines; a SNOWY tundra with frosted shrubs; a golden AUTUMN wood of fallen leaves; a wildflower MEADOW rolling to the horizon; a rocky COASTAL cliff over crashing surf; a still LAKESHORE with reeds and lily-pads; a SAVANNA of dry grass and acacia; an ALPINE scree slope of tiny wildflowers; a mossy ANCIENT-WOODLAND floor with toadstools; a misty SWAMP of cypress knees and dark water; a TERRACED rice-paddy valley; a PRAIRIE of tall grass; a volcanic BLACK-SAND plain; a cottage GARDEN with little hedges; a BAMBOO grove; a frozen LAKE; a CANYON floor of red rock; a HEATHLAND of purple scrub; a FERN gully with a waterfall. Vary the SCALE-PROVER too (and sometimes use none): occasionally a tiny deer / fox / rabbit / flock of birds / butterflies / grazing sheep — but DO NOT put an animal in most of them, and NEVER the same animal twice in a row. NO humans, ever.

RULES — no humans; do NOT describe the giant flower itself (ONLY the small dwarfed ground landscape); make each a DIFFERENT biome; keep the scale-contrast clear (tiny normal things at the base).

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },
  bloombot_giant_flower_sky_ascent: {
    metaPrompt: (n) => `You are writing ${n} SKY descriptions for BloomBot's "jack-and-the-giant-flower" path — the open sky a COLOSSAL flower climbs up into. This is the "growing up to heaven" destination overhead.

Each entry: 12-25 words. Open, breathtaking sky with room to breathe. Supports the upward awe.

VARIETY — ~25 distinct skies: towering sunlit cumulus clouds pierced by golden god-rays; a soft golden-hour heaven of peach and lavender; a deep starfield with a great glowing moon; a brilliant rainbow arcing over fresh rain-washed blue; floating cloud-islands drifting in the upper air; a dawn sky flushing pink-to-gold; rolling storm-clouds breaking into a shaft of light; a luminous aurora rippling green and violet; a pearl-white misty heaven the crown fades into; a vast clear cobalt summer sky with wisps of cloud. Each is an open sky overhead, awe-inducing, never enclosed.

RULES — open sky only (never an enclosed tunnel/ceiling), no humans, no flowers described here (just the sky).

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },
};

(async () => {
  const total = parseInt(process.env.SEED_TOTAL || '200', 10);
  for (const [key, cfg] of Object.entries(POOLS)) {
    await generatePool({
      outPath: `scripts/bots/bloombot/seeds/${key}.json`,
      total,
      batch: 25,
      metaPrompt: cfg.metaPrompt,
    });
  }
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
