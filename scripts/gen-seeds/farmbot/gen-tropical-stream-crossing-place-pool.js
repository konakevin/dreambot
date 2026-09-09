#!/usr/bin/env node
/**
 * FarmBot — tropical_stream_crossing_place bespoke pool ("Tropical Stream
 * Crossing" path, Phase 4: Tropical Farm, 2026-09-09 — 8th and final
 * tropical path).
 *
 * Path-bespoke (not a shared cross-path pool) — this path's own signature
 * hero-setting axis, same pattern as BANANA_GROVE_PLACE (banana-grove-path)
 * and COCONUT_PALM_GROVE_PLACE (coconut-palm-grove). A small, gentle
 * freshwater stream running through the EDGE of the tropical farm, with a
 * simple hand-built wooden plank bridge or a line of flat stepping stones
 * crossing it, banked by tropical farm-adjacent plantings.
 *
 * RENAMED from "jungle stream crossing" (Kevin, verbatim, non-negotiable):
 * "the important thing is that it still feels like a charming FARM since
 * this is FarmBot, just a tropical farm." This must NOT read as a jungle
 * trek, a wilderness river crossing, or an adventure/exploration scene — it
 * is a quiet, tended corner of a WORKING TROPICAL FARM that happens to have
 * water running through it. The words "jungle," "rainforest," "wild,"
 * "untamed," "wilderness," "overgrown," "adventure," "expedition," and
 * "trek" are banned from the generator's OWN output below — not as a Flux
 * negative-prompt (negation doesn't work on Flux, see CLAUDE.md), but as a
 * vocabulary constraint on this Sonnet seed-generation call itself, so
 * those words can never even reach the pool file in the first place.
 *
 * DISTINCT from POND_PLACE (still water, lily pads, backyard-pool scale)
 * and LAKESIDE_RIVERSIDE_PLACE (wide-open lake/river, far horizon, no
 * crossing structure) — this pool's hero element is specifically the
 * CROSSING itself (a plank bridge or stepping stones) plus farm-utility
 * touches at the water's edge: a small dock or flat washing-stone for
 * rinsing produce, a wooden water wheel, a laundry line strung nearby, a
 * fishing basket left on the bank, garden rows just visible past the
 * water's edge.
 *
 * Reuses the established anti-pattern bans from gen-lakeside-riverside-
 * place-pool.js and gen-banana-grove-place-pool.js (both templates for this
 * file):
 *   - implied-crowd/labor-language ban (figures/crowd/hands/footprints/
 *     workers/etc.)
 *   - LIGHT-ON-WATER GOTCHA — metaphorical light language can render as the
 *     LITERAL object, doubly risky here since this pool is specifically
 *     ABOUT water (documented "coins of light" → literal gold coins bug,
 *     FARMBOT_PATH_BUILD_STATE.md). Only non-literalizable words allowed
 *     (shimmer/glimmer/sparkle/glint/dapple/pools/patches of light).
 *   - per-object-personification ban (describe stones/ripples/current
 *     holistically, never individual per-stone agency verbs — see the
 *     lakeside-riverside-moment personified-rock-faces bug).
 *   - signage/label-concept ban (no plank markers, no lettered/numbered
 *     stones, no signs — see the garden-vegetable-patch-tending
 *     hallucinated-numerals bug).
 */
const path = require('path');
const { generatePool } = require('../../lib/seedGenHelper');

const SEEDS_DIR = path.join(__dirname, '..', '..', 'bots', 'farmbot', 'seeds');

const RECIPES = [
  {
    outPath: path.join(SEEDS_DIR, 'farmbot_tropical_stream_crossing_place.json'),
    total: 120,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (n) => `Generate ${n} distinct SMALL TROPICAL FARM STREAM CROSSING descriptions
for a cozy tropical-farm bot — a small, gentle freshwater stream running through the edge of a
cultivated tropical farm, crossed by a simple wooden plank bridge or a line of flat stepping
stones, as a rich, living little world of its own, entirely through its physical details. The
stream and its crossing are ALWAYS the grammatical subject named FIRST in the sentence.

CRITICAL — CHARMING FARM, NOT WILD JUNGLE OR ADVENTURE SCENE. This is a quiet, tended corner of a
real, small, working tropical farm that happens to have water running through it — NOT a jungle
trek, NOT a wilderness river crossing, NOT an adventure or exploration scene. The stream is
shallow, gentle, and narrow enough to cross easily; its banks are lightly tended, not a dense wild
riverbank. Do not use the words "jungle," "rainforest," "wild," "untamed," "wilderness,"
"overgrown," "unexplored," "adventure," "expedition," or "trek" anywhere in your output.

Every entry needs the CROSSING itself as the hero: EITHER a simple hand-built wooden plank bridge
(a few weathered boards laid across, maybe a single rope or wood handrail) OR a line of flat
stepping stones set evenly across the shallow water. Alternate between the two roughly evenly
across the pool.

Weave in farm-appropriate touches around the water's edge (vary which ones appear, 1-3 per entry,
never all at once): a small wooden dock or a flat washing-stone worn smooth where produce gets
rinsed, a simple wooden water wheel turning slowly, a laundry line strung between two posts nearby
with a few garments drying, a woven fishing basket left resting on the bank, neat cultivated garden
rows just visible past the water's edge, banana or palm plants and other tropical farm plantings
lightly bordering the bank (never dense or wild), smooth stones, a bit of moss, tall grass trimmed
low near the crossing.

Vary time of day (soft early-morning mist over the water, bright midday light, warm late-afternoon
glow), the water's visible motion (a slow gentle current, small ripples trailing past a stone, a
calm shallow pool before the crossing), and which specific detail leads the sentence.

LIGHT ON WATER — describe light on the water's surface only with words like shimmer, glimmer,
sparkle, glint, dapple, or "pools/patches of light." Do NOT use any object-metaphor for light on
water — NEVER "coins," "coin-dappled," "ribbons," "threads," "jewels," "sequins," "discs," or any
other phrase naming a physical object standing in for light — these render as the LITERAL object,
not as light.

CRITICAL — describe the stepping stones, ripples, or current holistically (as a group or a single
flowing motion), never with individual per-stone agency/action verbs (no "each stone humming," no
"a ripple peeking out from behind every rock") — that phrasing risks Flux rendering individual
stones or ripples as if they have faces.

CRITICAL — no signs, labels, tags, markers, placards, or numbered/lettered stones or planks of any
kind (a plain unmarked stepping stone or weathered plank is fine; anything implying a WRITTEN
label or marker on it is not) — labeled objects risk Flux hallucinating garbled text or numerals
onto them.

CRITICAL — this is a PLACE description with NO people in it at all, not even implied ones. Do NOT
mention: figures, crowd, workers, pickers, laborers, farmhands, riders, children, kids, bystanders,
onlookers, laughter, faces, hands, someone/anyone doing something, footprints (implies a walker
just left). Describe only the stream, its crossing, banks, farm-edge touches, light, and air — a
beautiful cultivated place with nobody in the frame yet (a character may be added separately later
by the render pipeline; your job is the empty crossing itself).

Output ONLY a JSON array of ${n} strings, no preamble, no numbering. 25-40 words each.

Examples:
["A narrow, gentle stream slips along the edge of the tropical farm, crossed by a simple wooden
plank bridge with a single rope handrail, morning mist drifting low over the shallow water and a
few garden rows visible just past the far bank.", "A line of flat stepping stones sits evenly
spaced across a shallow, sun-dappled stream, a woven fishing basket resting on the near bank
beside a small wooden water wheel turning slowly in the current."]

🚫 STRICT BANS: NO named people/characters, NO implied people or labor (figures/crowd/workers/
pickers/laborers/farmhands/riders/children/kids/bystanders/onlookers/laughter/faces/hands/
footprints), NO readable text/signage/labels/markers, NO brand names, NO photographer/camera-brand
names, NO bare/empty crossing lacking water/light/plant detail, NO metaphorical light objects
(coins/jewels/beads/sequins/ribbons/threads/discs), NO per-stone or per-ripple personification, NO
"jungle," "rainforest," "wild," "untamed," "wilderness," "overgrown," "unexplored," "adventure,"
"expedition," or "trek" wording of any kind — this is always a small, gentle, tended stream at the
edge of a cultivated working farm.

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
