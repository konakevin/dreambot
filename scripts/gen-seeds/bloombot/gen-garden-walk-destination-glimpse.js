#!/usr/bin/env node
/**
 * BLOOMBOT_GARDEN_WALK_DESTINATION_GLIMPSE — what lies BEYOND the
 * archway in a POV-through-bloom-arch garden-walk scene. Sun-drenched
 * meadow, sunlit forest clearing, distant stone cottage, circular
 * lily-pond, hedgerow maze opening.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_garden_walk_destination_glimpse.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} DESTINATION GLIMPSE entries for BloomBot's garden-walk path — what lies BEYOND the bloom-archway in a POV-walk scene. Each entry is one descriptive line, 35-55 words, starting with a CAPS NAME, em-dash, then body describing the destination beyond the archway opening + warm depth lighting + receding bloom-layers framing the view.

━━━ THE BAR ━━━
Every entry names a SPECIFIC destination scene visible THROUGH the archway opening: a sun-drenched meadow, a sunlit forest clearing, a distant stone cottage, a circular lily-pond, a hedgerow-maze opening, a fountain garden, a hidden orchard, a topiary lawn, a stream-side meadow, a walled rose-garden. The destination has WARM GLOWING DEPTH, the bloom-layers in foreground frame the view, the eye is drawn THROUGH the arch toward the destination.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"SUN-DRENCHED BLOOM-MEADOW — wildflower meadow beyond the arch blazing in golden-hour light, poppies and cornflowers stretching back in crisp sharp overlapping layers, warm amber light deepening toward a clear sharp horizon"
"SUNLIT FOREST CLEARING — tall trees framing a sun-flooded glade beyond, vertical light-shafts piercing the canopy, bluebell carpet shimmering at the clearing floor, deep warm luminosity"
"DISTANT STONE COTTAGE — stone cottage with a thin rising chimney-trail glimpsed beyond, warm glowing windows nestled in garden-mass, roses massing at the walls in sharp full-detail bloom"
"CIRCULAR LILY-POND — circular pond beyond the arch with concentric ripples spreading from the center, lily-pads catching warm gold light, bloom-edged banks receding in crisp sharp overlapping layers"
"HEDGEROW MAZE OPENING — formal yew-hedge corridors opening beyond, stone statuary at the maze-center catching warm light, clipped green walls rising high into a sun-bright sky"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~5 MEADOW / FIELD BEYOND (sun-drenched wildflower meadow, lavender field, sunflower field, prairie meadow, alpine bloom-meadow, daisy-and-poppy field)
- ~5 FOREST / GROVE BEYOND (sunlit forest clearing, oak-canopy glade, beechwood clearing, bluebell wood, autumn-leaf grove, fern-floor woodland)
- ~5 ARCHITECTURE / COTTAGE (stone cottage, thatched-roof cottage, Tudor manor, fairy-tale castle turret, hilltop chapel, walled garden gate)
- ~5 WATER FEATURE (circular lily-pond, koi pond, mountain-stream meadow, lake-reflection at meadow's edge, fountain-garden, ornamental pond)
- ~4 FORMAL GARDEN (hedgerow-maze opening, topiary lawn, parterre garden, knot-garden, ornamental yew-allée)
- ~4 ORCHARD / FRUIT-TREE (cherry-blossom orchard, apple orchard in bloom, peach-blossom grove, almond-blossom orchard)
- ~4 ROSE / WALLED GARDEN (walled rose-garden, English-rose walled garden, climbing-rose pergola, rose-arbor)
- ~4 ROLLING-HILL VISTA (rolling green hills beyond, countryside vista, Cotswolds rolling hills, alpine meadow slopes)
- ~3 MOUNTAIN BACKDROP (distant snow-capped peaks behind meadow, alpine ridge backdrop, blue-hued mountain silhouettes, foothills receding)
- ~3 STREAM / RIVER (winding stream through meadow beyond, mountain-stream cascade, river bend lined with blooms)
- ~3 TROPICAL DESTINATION (tropical lagoon beyond, palm-grove glade, ocean-edge meadow, white-sand shore)
- ~3 MAGICAL / FANTASY (glowing magical clearing, faerie ring in grass, enchanted glade with light, light-portal in distance)
- ~3 SEASONAL (autumn-foliage hilltops, snow-covered cottage, spring-blossom drift, summer wheat field)
- ~3 BUILDING-IN-LANDSCAPE (lone windmill on hill, distant pavilion, hilltop temple, gazebo in meadow)
- ~3 PATH-LEADING-FURTHER (further path winding away, garden allée extending, gravel path receding into hedges, stepping stones across stream)
- ~3 SUNRISE / SUNSET (golden-hour over meadow beyond, sunrise over hills, sunset glow on stone cottage, alpenglow at distant ridge)
- ~3 MIST / FOG SOFT-DEPTH (morning-mist meadow, fog-soft distant hills, dew-fog over orchard, mist over lake-edge)
- ~3 WILDLIFE-IN-DESTINATION (deer in distant meadow, swans on lake beyond, flock of birds over field, distant horses grazing)
- ~3 SCULPTURE / GARDEN-ORNAMENT (stone sundial beyond, marble statue in clearing, bronze sundial at meadow-center, ornate fountain)
- ~3 OPEN-SKY MEADOW (open meadow under cumulus, plain bloom-meadow with vivid sky, hilltop with open sky, sweeping vista with full-sky drama)

━━━ BANS ━━━
- NO photographer-name drops.
- NO sci-fi / no neon / no hologram.
- NO bare "garden beyond" — name the SPECIFIC destination + warm depth lighting.
- NO crowds / no people.
- NO indoor-only destinations — these are always OUTDOOR scenes through the arch.

━━━ FORMAT ━━━
Each entry: 35-55 words. Format: "NAME CAPS — body text naming destination + warm depth lighting + receding bloom-layers framing".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
