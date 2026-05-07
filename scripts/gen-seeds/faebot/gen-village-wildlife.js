#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/village_wildlife.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} WILDLIFE / LIVING-SCENE descriptions for FaeBot's fae-village path. Each entry is 20-40 words describing critters and small life-signs that get layered into a fae-village painted-fantasy scene to make it feel ALIVE.

The village is INHABITED — small creatures and tiny life-signs animate the painting. Each entry should include 2-4 different species/elements at varied distances (close to camera, mid-distance, near-cottages).

━━━ CRITTER VOCABULARY ━━━
Pick 2-4 from these per entry, mixing scale and species:

FLYING (most common):
- hummingbirds (hovering at flowers, near windows)
- butterflies (drifting, perched on petals, flock in light shafts)
- dragonflies (skimming water, hovering, darting)
- moths (luminous-winged, drawn to lanterns)
- songbirds (perched on rails, singing from branches)
- bees (visiting flower-boxes)
- fireflies (constellation clouds drifting)
- glowbugs (slow-drifting magical points of light)

CRAWLING / GROUND:
- ladybugs (on leaves, on cottage railings)
- snails (with painted shells)
- forest mice (peeking from doorways)
- frogs (on lily-pads, on mossy stones)

LARGER (occasional):
- a fox-spirit silhouette glimpsed in the trees
- a deer at the forest edge
- a small owl perched on a branch

LIVING-SCENE TOUCHES (always include 1-2):
- tiny silhouetted fae figure (on a porch, crossing a bridge, in a window, climbing stairs)
- smoke curling from a chimney
- hanging laundry on a clothesline
- lit windows with figures inside
- woven-grass laundry, garlands of flowers, hanging herb bundles
- a fae watering a flower-box

━━━ EXAMPLES (write fresh, do not copy) ━━━
- "Hummingbirds hovering at honeysuckle flower-boxes, butterflies drifting through golden light shafts, ladybugs on a leaf-railing, a tiny silhouetted fae figure peeking from a doorway, smoke curling lazily from a chimney."
- "Dragonflies skimming above a still pond by the cottages, glowbug clouds drifting between dwellings, a small fae crossing a bridge with a basket, songbirds perched on a vine-rope railing."
- "Fireflies forming a slow-drifting constellation cloud through the village, moths gathering near a lantern, a frog perched on a lily-pad below the porch, hanging herb-bundles fluttering in soft breeze."
- "Butterflies fluttering around the flower-petal pavilion, hummingbirds at trumpet-flowers, a tiny silhouetted fae watering window-boxes, painted-shell snails on a moss railing, sparkling motes drifting."
- "A pair of dragonflies at eye level, ladybugs on a foreground fern, a small fae figure visible in a lit window mending fabric, woven-grass laundry hanging on a line, fireflies in mid-distance."
- "Songbirds perched on a hewn-wood beam, butterflies in light shafts, a fox-spirit silhouette glimpsed at the forest edge, smoke curling from two cottages, a fae figure crossing a bridge with a lantern."

━━━ AVOID ━━━
- Same species repeated across all entries — rotate broadly
- Large mammals dominating the frame — these are SMALL touches that make the scene feel alive
- Predator/prey violence — fae world is peaceful

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete wildlife description (20-40 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
