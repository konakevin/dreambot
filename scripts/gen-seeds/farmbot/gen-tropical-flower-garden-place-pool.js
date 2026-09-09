#!/usr/bin/env node
/**
 * FarmBot — tropical_flower_garden_place bespoke pool ("Tropical Flower
 * Garden", Phase 4: Tropical Farm, 2026-09-09).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as PINEAPPLE_FIELD_PLACE, BANANA_GROVE_PLACE,
 * and MANGO_ORCHARD_PLACE. A charming, cultivated TROPICAL FLOWER GARDEN —
 * hibiscus, plumeria/frangipani, bird-of-paradise, orchids, bougainvillea —
 * arranged in a tended, personal-scale garden setting (raised beds, trellises,
 * garden paths, watering cans), NOT a wild tropical rainforest.
 *
 * CRITICAL CREATIVE CONSTRAINT (Kevin, verbatim, FARMBOT_PATH_BUILD_STATE.md
 * Phase 4 section): "the important thing is that it still feels like a
 * charming FARM since this is FarmBot, just a tropical farm." This garden is
 * a real, small, cultivated, hand-tended plot a family or small crew works
 * by hand — raised beds, trellises, tidy garden paths, a watering can,
 * pruning shears — clear evidence of ongoing care, cheerful order — NEVER
 * wild/overgrown/jungle-like or rainforest-exploration territory. The words
 * "jungle," "rainforest," "wild," "untamed," "wilderness," and "overgrown"
 * are banned from the generator's OWN output below — not as a Flux
 * negative-prompt (negation doesn't work on Flux, see CLAUDE.md), but as a
 * vocabulary constraint on this Sonnet seed-generation call itself, so those
 * words can never even reach the pool file in the first place.
 *
 * Reuses the established anti-pattern bans from gen-banana-grove-place-pool.js
 * (the template for this file, per FARMBOT_PATH_BUILD_STATE.md instructions):
 *   - implied-crowd-language ban (figures/crowd/hands/footprints/etc.) —
 *     extended here with tropical-garden-labor words (gardeners, workers,
 *     tenders, visitors) since a tended garden more readily invites implied-
 *     person language than an empty field does.
 *   - metaphorical-light-language ban (no "coins"/"jewels"/"beads" of
 *     light — see the orchard-afternoon "literal gold coins on the ground"
 *     bug in FARMBOT_PATH_BUILD_STATE.md; use "pools"/"patches"/"shafts" of
 *     light instead).
 *   - per-object-personification ban (describe clusters of blossoms/petals
 *     holistically, never with individual per-flower agency verbs — see the
 *     lakeside-riverside-moment personified-rock-faces bug).
 *   - signage/label-concept ban (no plant labels, plant tags, row markers,
 *     placards, or numbered/lettered stakes of any kind — see the
 *     garden-vegetable-patch-tending hallucinated-numerals bug; a plain,
 *     unmarked wooden stake or trellis post is fine).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_tropical_flower_garden_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL, TENDED TROPICAL FLOWER GARDEN descriptions
for a cozy tropical-farm bot — a charming, cultivated garden of tropical blooms as a rich, living
little world of its own, entirely through its physical details. The garden itself is ALWAYS the
grammatical subject named FIRST in the sentence.

CRITICAL — CHARMING FARM GARDEN, NOT WILD JUNGLE. This is a real, small, hand-tended flower garden
that a family or a small crew tends by hand — tidy raised beds, a trellis or two laced with climbing
vines, a neat garden path of packed earth or flat stones winding between the beds, clear evidence of
ongoing care (a watering can resting nearby, a pair of pruning shears, a low picket or bamboo fence,
a wheelbarrow). This must read as personal, cultivated, farm-garden scale, the same cheerful, orderly
"I want to live there" feeling as any other tended field or orchard — NEVER as an untamed, overgrown,
dense, or unexplored wild space. Do not use the words "jungle," "rainforest," "wild," "untamed,"
"wilderness," or "overgrown" anywhere in your output.

Lean into the garden's specific hero imagery: bold red and pink hibiscus blossoms with their
trumpet-shaped flare, fragrant white and yellow plumeria/frangipani clusters, tall bird-of-paradise
blooms with their sharp orange-and-blue crests, delicate orchids nestled along a shaded trellis or
tucked into hanging pots, bougainvillea spilling in vivid magenta and orange papery bracts over a
fence or archway, tidy raised garden beds edged in wood or stacked stone, a trellis or garden arch
laced with climbing vines, a packed-earth or flat-stone path winding between the beds, a watering can
or coiled hose resting nearby, warm humid air. Vary time of day (soft early-morning mist beading on
petals, bright midday bloom, warm late-afternoon light), angle (looking down the garden path, a wide
view across the beds, close along a trellis heavy with blossoms), which flowers lead the sentence,
and which garden detail anchors the scene.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, gardeners, workers, tenders, visitors, riders, children, kids, bystanders,
onlookers, laughter, faces, hands, someone/anyone doing something, footprints (implies a walker just
left). Describe only the garden, beds, trellises, blossoms, path, tools, light, and air — a beautiful
cultivated place with nobody in the frame yet (a character may be added separately later by the
render pipeline; your job is the empty garden itself).

CRITICAL — light must stay physically grounded. Describe dappled or beaded light as "pools,"
"patches," "shafts," or "mottled light" — NEVER as "coins," "jewels," "beads," "sequins," or any
other small literal object, which risks Flux rendering that literal object scattered on the ground
instead of light.

CRITICAL — describe clusters of blossoms or petals holistically (as a group), never with individual
per-flower agency/action verbs (no "each bloom reaching," no "a hibiscus peeking out") — that
phrasing risks Flux rendering individual flowers as if they have faces.

CRITICAL — no signs, plant labels, plant tags, placards, or numbered/lettered stakes of any kind (a
plain unmarked wooden stake, trellis post, or fence rail is fine; anything implying a WRITTEN label
or marker on it is not) — labeled objects risk Flux hallucinating garbled text or numerals onto them.

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A small tended garden of tropical blooms unfolds in tidy raised beds, bold red hibiscus flaring
open beside clusters of fragrant white plumeria, a packed-earth path winding between the beds toward
a trellis heavy with climbing bougainvillea.", "Tall bird-of-paradise blooms rise in a neat row along
a low bamboo fence, their sharp orange-and-blue crests catching warm midday light, a watering can
resting on the flat-stone path beside a bed of delicate orchids."]

🚫 STRICT BANS: NO named people/characters, NO implied people or labor (figures/crowd/gardeners/
workers/tenders/visitors/riders/children/kids/bystanders/onlookers/laughter/faces/hands/footprints),
NO readable text/signage/labels/plant tags/markers, NO brand names, NO photographer/camera-brand
names, NO bare/empty garden lacking bloom/light/bed detail, NO metaphorical light objects
(coins/jewels/beads/sequins), NO per-flower or per-petal personification, NO "jungle," "rainforest,"
"wild," "untamed," "wilderness," or "overgrown" wording of any kind — this is always a small,
cultivated, hand-tended farm garden.

Output ONLY the JSON array, no preamble, no numbering.`,
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
