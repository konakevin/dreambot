#!/usr/bin/env node
/**
 * BLOOMBOT_CONSERVATORY_ATMOSPHERIC_PHENOMENON — small atmospheric /
 * wildlife / particulate phenomenon inside a Victorian glass-and-iron
 * conservatory. Condensation runs on glass, peacock on flagstone, pollen
 * in side-light, oculus light-circle, butterfly cloud at fountain.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_conservatory_atmospheric_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERIC PHENOMENON entries for BloomBot's conservatory path — small atmospheric / wildlife / light / particulate phenomenon inside a Victorian glass-and-iron palm-house / orangery / botanical conservatory. Each entry is one descriptive line, 25-45 words, starting with a CAPS NAME, em-dash, then body describing the phenomenon + how it interacts with the conservatory's glass roof, iron arches, fountain, flagstone floor, or plant masses.

━━━ THE BAR ━━━
Every entry names a SPECIFIC interior atmospheric event: condensation tracking down glass, pollen-cloud in slanted side-light, an oculus light-circle pooled on flagstone, butterfly cloud at fountain, peacock on flagstone, fern-frond unfurl mid-frame, hummingbird at exotic bloom, palm-shadow lattice on tile. Conservatory-coded — glass-and-iron architecture, palms, fountains, glass-house humidity, filtered green light.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"CONDENSATION RUN ON GLASS — slow beads of condensation tracking down the glass-and-iron joints, each droplet catching the afternoon light, the humid interior atmosphere made visible against the cold pane surface"
"PEACOCK ON THE FLAGSTONE — solitary peacock stationed near the central fountain, iridescent tail-feathers spread in full display, the blue-and-green ocelli catching glass-filtered light in shifting metallic hues"
"POLLEN-CLOUD IN SIDE-LIGHT — golden pollen-cloud dispersing in clear side-lit air crossing the mid-conservatory space, individual motes drifting slowly, the warm dust catching the lateral light"
"OCULUS LIGHT-CIRCLE — perfect luminous circle cast by the central dome oculus pooled directly onto the flagstone floor, the surrounding floor receding in crisp sharp overlapping layers into cooler green shadow"
"BUTTERFLY CLOUD AT FOUNTAIN — loose cluster of pale sulphur and tortoiseshell butterflies hovering above the central fountain basin, wings flickering in the glass-filtered light, two settling at the water-edge"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~3 CONDENSATION / DROPLET (condensation run on glass, fog on inner panes, water-bead chain on iron joint, dew-line at glass curve)
- ~3 LIGHT-PATCH ON FLOOR (oculus light-circle, dome-roof light-ring, diamond-paned light-lattice, lantern-cast shadow-pattern)
- ~3 PEACOCK / EXOTIC BIRD (peacock display, peahen at flagstone, golden pheasant, scarlet macaw on palm, blue-and-yellow macaw)
- ~3 POLLEN / FLORAL PARTICLE (pollen-cloud in side-light, fern-spore drift, orchid-spore haze, palm-pollen drift)
- ~3 BUTTERFLY / MOTH (butterfly cloud at fountain, atlas-moth on glass, blue-morpho hovering, swallowtail at orchid)
- ~3 HUMMINGBIRD / SUNBIRD (ruby-throated at orchid, calliope at trumpet vine, malachite sunbird at bloom, jewel-throated hover at corolla)
- ~3 PALM / FROND SHADOW (palm-frond shadow-lattice, banana-leaf shadow-cast, fern-frond mid-unfurl, tree-fern crown silhouette)
- ~3 GLASS-LIGHT EFFECT (sun-flare through curved-glass roof, rainbow refraction off pane edge, halo around globe-lamp, prism-shadow on tile)
- ~3 STEAM / HUMIDITY (heat-steam rising from foliage, mist over fountain pool, humidity-haze in air, breath-fog from leaves)
- ~3 SINGLE FOLIAGE-MOTION (single banana-leaf unrolling, fern-frond mid-unfurl, vine-tendril mid-twist, single bloom mid-open)
- ~3 EXOTIC INSECT (giant atlas-beetle on palm, iridescent damselfly at pool, jewel-wasp on glass)
- ~3 SMALL REPTILE (gecko on glass, green-anole on frond, day-gecko on archway, single iguana on flagstone)
- ~3 FOUNTAIN / WATER (mist over central fountain, water-bead chain at fountain rim, lily-pad with water-bead, koi gleam in pool)
- ~3 IRON-AND-GLASS ARCH DETAIL (vine-curl on iron arch, climbing-bloom along ironwork, latticework shadow on tile)

━━━ BANS ━━━
- NO photographer-name drops.
- NO sci-fi / no neon / no hologram.
- NO bare "humid air" — name the SPECIFIC phenomenon (condensation, pollen, butterfly cloud).
- NO crowds / no people — single creatures or small clusters.
- NO modern-electronics. Victorian / Edwardian conservatory register.

━━━ FORMAT ━━━
Each entry: 25-45 words. Format: "NAME CAPS — body text naming the specific phenomenon + how it interacts with conservatory architecture (glass / iron / fountain / flagstone)".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
