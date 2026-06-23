#!/usr/bin/env node
/**
 * BloomBot hanging-flowers path pools (2026-06-22).
 *
 * A SCENIC WALKWAY beneath an OVERHEAD CANOPY of HANGING FLOWERS — cascading
 * wisteria curtains, suspended flower-basket chandeliers, hanging bloom-orbs and
 * floral pendant lanterns strung above a path that recedes into atmospheric
 * depth, with lush "alive" flower accents lining the way. The reference is the
 * Kevin-hearted wisteria-over-train-tracks render: a dreamy tunnel of hanging
 * blooms overhead, flowers spilling along the path, soft misty light at the end.
 *
 * Three bespoke axes (+ universal lighting; palette + roster from flowerEngine):
 *   setting        — the WALKWAY environment the canopy hangs over (the big
 *                    variety axis: parks / towns / train stations + tracks /
 *                    gardens / courtyards / canals / plazas / cloisters / more).
 *   hanging_pieces — THE SIGNATURE MONEY-SHOT axis: the suspended hanging flower
 *                    chandeliers / baskets / wisteria curtains / bloom-orbs that
 *                    form the overhead canopy.
 *   walkway_accent — the lush living accents lining the path at ground/eye level.
 *   atmospheric_phenomenon — 55%-gated magic-moment element.
 * Run: node scripts/gen-seeds/bloombot/gen-hanging-flowers-pools.js
 *      (SEED_TOTAL=25 for the MVP, default 200 for scale-up)
 */
const { generatePool } = require('../../lib/seedGenHelper');

const POOLS = {
  bloombot_hanging_flowers_setting: {
    metaPrompt: (n) => `You are writing ${n} WALKWAY-SETTING descriptions for BloomBot's "hanging-flowers" path — a scenic path/walkway that a CANOPY of hanging flowers will be strung above (the hanging flowers themselves are supplied separately, so do NOT describe them here). Each entry is JUST the walkable SETTING: a real place with a clear path/lane/walkway leading away into depth, that flowers can hang over and line.

Each entry: 15-30 words. A specific, evocative, real-feeling place with a walkable path receding into the distance — described so the eye is invited to walk INTO it. NO people, ever. NO hanging flowers described (that is a separate axis).

VARIETY MANDATE — ~25 DISTINCT walkway settings, spread widely (each a different place): a leafy PARK promenade with lampposts; an old cobblestone TOWN lane between leaning buildings; a quiet TRAIN-STATION platform with an empty bench; a curving stretch of TRAIN TRACKS through a green cutting; a formal GARDEN gravel path between hedges; a stone COURTYARD with a central fountain; a CANAL-SIDE towpath with still water; a narrow European ALLEY with worn shutters; a covered MARKET arcade; a college CLOISTER walk of pointed arches; a wooden BOARDWALK over a pond; a RIVERSIDE stone promenade; an old stone BRIDGE crossing a stream; a sun-dappled forest TRAIL; a pergola WALKWAY of weathered timber posts; a temple/shrine APPROACH of mossy steps; a tea-house GARDEN path with stepping-stones; a tram-lined city STREET with old streetlamps; a greenhouse/conservatory NAVE walk; a vineyard LANE between trellised rows; a quaint village HIGH STREET; a harbour QUAY walk; a rooftop GARDEN terrace path; a railway FOOTBRIDGE; a botanical-garden PATH between beds. Make each unmistakably its own place. Include a hint of MOOD/light where it helps (misty dawn, golden dusk, after soft rain), but keep the focus on the setting + the receding path.

RULES — no humans; no hanging flowers (separate axis); each a DIFFERENT real-feeling setting; ALWAYS a clear walkable path/lane/track leading into depth.

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },
  bloombot_hanging_flowers_hanging_pieces: {
    metaPrompt: (n) => `You are writing ${n} HANGING-FLOWER-ARRANGEMENT descriptions for BloomBot's "hanging-flowers" path — the SUSPENDED flower pieces that hang OVERHEAD above a walkway. This is the HERO of the shot, and it MUST read as ELEGANTLY COMPOSED and DELIBERATELY DESIGNED — like a florist / garden-event designer arranged it — NOT a random spammy jumble of flowers hanging down everywhere. Species-AGNOSTIC (the flower species + colors are supplied separately, so do NOT name a species or a color — describe the STRUCTURE, the ARRANGEMENT and how it hangs).

Each entry: 15-30 words. THE KEY QUALITY every entry MUST carry: COMPOSITION OVER DENSITY — discrete pieces SPACED with clear RHYTHM at intentional intervals, OR one clean cohesive cascade, always with breathing room / negative space and a clean backdrop visible between the pieces. Lush and full, but curated and intentional — never a chaotic wall of mixed strands packing every inch.

VARIETY MANDATE — ~25 DISTINCT COMPOSED hanging arrangements, spread widely: a rhythmic row of identical ornate flower-CHANDELIERS hung at even intervals down the walk; a neat line of matching round hanging BASKETS brimming on chains, evenly spaced; large suspended bloom-ORBS / flower-balls hung at regular heights like pendant lights; pendant flower-LANTERNS alternating with smaller bloom-balls in a tidy sequence; elegant garland SWAGS looping post-to-post in even bays; a single CLEAN COHESIVE curtain of one cascading species forming a tidy tunnel-arch with clear shape; a symmetric PAIR of cascades framing one central focal hanging piece; matching hanging WREATHS / bloom-hoops in a measured row; a tiered CHANDELIER of concentric bloom-rings as a centerpiece; a graceful arched PERGOLA hung with a regular rhythm of pendant clusters; a row of flowering hanging planters spaced evenly along the beam; a restrained, well-spaced canopy of pendant clusters with sky visible between. Vary the HEIGHT, the type of piece, and whether it's discrete-pieces vs one clean cascade — but EVERY entry is COMPOSED, SPACED and DESIGNED, hanging DOWN from above over the walkway.

RULES — no species names, no specific colors (supplied separately); no humans; EVERY entry hangs DOWN from above (never flowers growing up from the ground — separate axis); EVERY entry reads CURATED + COMPOSED with rhythm/spacing/negative space — NEVER "a dense beaded veil of strands everywhere", NEVER "a chaotic tangle", NEVER "every inch packed", NEVER many mixed flower types jumbled together overhead.

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },
  bloombot_hanging_flowers_walkway_accent: {
    metaPrompt: (n) => `You are writing ${n} WALKWAY-ACCENT descriptions for BloomBot's "hanging-flowers" path — the lush, ALIVE floral accents that line and dress the PATH at ground and eye level, beneath the overhead hanging-flower canopy. These fill the lower frame and the path's edges so the whole scene feels overflowing and alive. Species-AGNOSTIC + color-AGNOSTIC (supplied separately).

Each entry: 12-25 words. A way the EDGES and GROUND of the walkway are dressed in flowers and living greenery — at ground/eye level (NOT hanging from above; that is a separate axis).

VARIETY MANDATE — ~25 DISTINCT ground/edge accents: dense flower-beds banking both sides of the path; a soft carpet of fallen petals scattered across the path; mossy stone planters overflowing at intervals; climbing blooms spiralling up every lamppost; window-boxes spilling down the walls; flowering shrubs crowding the verges; potted blooms clustered along a station platform; wildflowers pushing up between cobblestones / sleeper-ties; a low border of blooms tracing the path's curve; ferns and lush foliage filling the gaps; clipped hedges studded with flowers; a bloom-lined railing or balustrade; reflections of blooms in a wet path / still water; flower barrels along a quay; ivy and blossom reclaiming an old wall; a ribbon of blooms following the kerb into the distance. Keep them LUSH and ALIVE — the path should feel embraced by flowers on every side.

RULES — no species names, no specific colors (supplied separately); no humans; GROUND/EDGE level only (never hanging from above); keep the path itself walkable and leading into depth.

OUTPUT — JSON array of ${n} strings. No preamble, no numbering.`,
  },
  bloombot_hanging_flowers_atmospheric_phenomenon: {
    metaPrompt: (n) => `You are writing ${n} ATMOSPHERIC-PHENOMENON descriptions for BloomBot's "hanging-flowers" path — a 55%-gated "magic-moment" element that elevates a scenic walkway beneath a canopy of hanging flowers. Each is a single visible atmospheric detail rendered IN the passage.

Each entry: 10-20 words. One specific, visible, magical-but-believable atmospheric element.

VARIETY MANDATE — ~25 distinct phenomena: a drift of petals raining down through the hanging canopy; soft volumetric god-rays slanting through the blooms; a low ground-mist glowing in the light; a haze of golden pollen-dust in the air; fireflies winking among the hanging baskets at dusk; the wet sheen of the path after gentle rain reflecting the blooms; a cloud of butterflies threading the canopy; dewdrops sparkling on the hanging racemes; hanging lanterns glowing warm among the flowers at blue hour; sunbeams dappling the path through gaps in the canopy; a faint rainbow in drifting mist; soft bokeh of distant lights down the path; first snow dusting on out-of-season blooms; a single shaft of warm light at the path's end. Each is ONE visible element.

RULES — no humans; one visible atmospheric element per entry; keep it believable-magical, never garish.

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
