#!/usr/bin/env node
/**
 * BLOOMBOT_GARDEN_WALK_ATMOSPHERIC_PHENOMENON — POV-walk through an
 * arched bloom-archway, small atmospheric / wildlife / particulate
 * phenomenon happening at the arch passage. Rose-petal fall, firefly
 * cloud at dusk, monarch butterfly wave, hummingbird at arch-bloom,
 * robin perched on arch top.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/bloombot/seeds/bloombot_garden_walk_atmospheric_phenomenon.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ATMOSPHERIC PHENOMENON entries for BloomBot's garden-walk path — a POV looking through an arched bloom-archway toward a luminous destination beyond. Each entry is one descriptive line, 25-45 words, starting with a CAPS NAME, em-dash, then body describing a small atmospheric / wildlife / particulate phenomenon happening AT or THROUGH the archway opening.

━━━ THE BAR ━━━
Every entry names a SPECIFIC small phenomenon happening at the archway: falling petals, firefly cloud, butterfly cluster, hummingbird at climbing bloom, robin perched on arch-crown, golden pollen drifting, dust-motes in a sunbeam, fog-veil tonguing through, dew-drop curtain, sun-flare through the keystone. Always relate to the archway + destination glimpse beyond.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"ROSE-PETAL FALL THROUGH OPENING — loose cascade of blush-pink petals drifting mid-air through the archway passage, each petal individually lit against the luminous destination beyond, slow descent caught in stillness."
"FIREFLY CLOUD AT DUSK — dense soft-cloud of fireflies suspended within the archway opening at blue-dusk, hundreds of cold-green pulse-lights stereo-arranged through the passage depth, foreground blooms in silhouette."
"MONARCH BUTTERFLY WAVE — small cluster of monarch butterflies suspended mid-passage through the arch opening, amber-and-black wings individually back-lit translucent, jewel-depth catching the destination light behind"
"HUMMINGBIRD AT ARCH BLOOM — solitary ruby-throated hummingbird hovering at a climbing bloom on the archway frame, wings a transparent motion-blur, beak touching the corolla, iridescent throat catching side-light"
"ROBIN PERCHED ON ARCH TOP — solitary robin perched at the very crown of the archway bloom-mass, head tilted toward the path below, orange breast bright against the luminous destination glow beyond"

━━━ VARIETY MANDATE (distribute across these categories) ━━━
- ~3 FALLING / DRIFTING PETALS (rose-petal cascade, cherry-blossom drift, dogwood-petal fall, magnolia-petal drift, peony-petal release)
- ~3 INSECT-CLOUD (firefly cloud, butterfly cluster, dragonfly haze, gnat-cloud in sunlight, mayfly drift)
- ~3 SINGLE HUMMINGBIRD (ruby-throated at bloom, Anna hummingbird at flower, calliope at climbing-rose, sword-bill at trumpet vine)
- ~3 SINGLE BIRD ON ARCH (robin perched on crown, songbird on archway, wren in vine-mass, bluebird on the frame)
- ~3 POLLEN / SPORE CLOUD (golden pollen-cloud through opening, milkweed-down drift, dandelion-clock pieces lifting, cottonwood-fluff)
- ~3 LIGHT-IN-AIR (single sun-shaft through keystone, sun-flare through arch, god-ray through bloom-mass, dust-motes drifting)
- ~3 FOG / MIST (fog-veil tonguing through, morning-mist drifting, dew-fog suspended, low ground-fog under arch)
- ~3 RAIN / DEW (curtain of dew-drops on bloom-mass, gentle drizzle through arch, fine mist-spray, water-bead chain)
- ~3 SMALL ANIMAL (squirrel on arch-frame, kitten paused on path, bumblebee chain at climbing-bloom, hare framed in opening)
- ~3 RAINBOW / OPTICAL (small rainbow through fog at arch, prism-light through dew, sun-pillar through opening)
- ~3 SNOWFLAKE / SEASON-SPECIFIC (winter snowflake drift, spring blossom-snow, autumn-leaf fall through opening)
- ~3 GLOWWORM / NIGHT (glowworm-cluster on archway, moonlight-shaft through opening, single luminous moth)
- ~3 PETAL-CARPET ON PATH (loose petal-confetti underfoot, scattered fallen blossoms on flag-stones, petal-trail leading toward destination)
- ~3 SMOKE / STEAM (drifting incense-curl from outside frame, gentle smoke-trail, ambient mist-shaft)

━━━ BANS ━━━
- NO photographer-name drops.
- NO bare "magical light" — name the SPECIFIC small phenomenon at the arch.
- NO sci-fi / no neon / no hologram.
- NO crowds — single creatures or small clusters.
- NO bare "many flowers" — the phenomenon is the hero, the archway is the stage.

━━━ FORMAT ━━━
Each entry: 25-45 words. Format: "NAME CAPS — body text naming the small phenomenon + position relative to the archway / passage / destination beyond".

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
