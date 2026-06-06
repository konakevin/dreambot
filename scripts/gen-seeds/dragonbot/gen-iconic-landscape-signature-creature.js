#!/usr/bin/env node
/**
 * ICONIC_LANDSCAPE_SIGNATURE_CREATURE — production scale-up to 200.
 *
 * Tiny iconic-creature anchors for DragonBot's iconic-landscape path. Each
 * entry names a SPECIFIC mythic creature (or magical particle-effect) woven
 * into the deep distance at SCALE-PROVER scale ONLY — ant-sized /
 * matchstick-sized / pinprick / silhouette-on-horizon. NEVER focal, NEVER
 * hero. The creature ADDS a mythic-tradition cue without violating the
 * no-characters rule of the path.
 *
 * Mirrors the existing 25 entries' register: 18-28 word sentence naming the
 * creature, the location in the frame (distant ridge / horizon / midground
 * sky / valley floor), and the explicit miniature-scale cue (ant-sized /
 * matchstick-sized / pinprick).
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/iconic_landscape_signature_creature.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} TINY-CREATURE / SIGNATURE-PARTICLE anchors for DragonBot's iconic-landscape path. Each entry names a SPECIFIC mythic creature (or magical particle-effect) woven into the DEEP DISTANCE at SCALE-PROVER scale ONLY — ant-sized / matchstick-sized / pinprick / silhouette-on-horizon. NEVER focal, NEVER hero. The creature ADDS a mythic-tradition cue.

Each entry: 18-28 words, ONE sentence. Names: (1) the creature OR particle-effect, (2) the location in the frame (deep distance / far ridge / horizon / midground sky / valley floor / far meadow), and (3) the EXPLICIT MINIATURE-SCALE CUE.

━━━ EXAMPLE REGISTER (mirror this exactly) ━━━

  "Giant eagle-pair banking above the glacier ridge, two matchstick-sized silhouettes wheeling in slow arcs against the pale amber sky."
  "Dragon-shadow tracing the horizon treeline, one ant-sized winged form sweeping a single dark crescent over the distant plain."
  "Aurora-spirits threading through the high valley mist, dozens of pinprick gold lights drifting in loose, unhurried formation."
  "Will-o-wisp cluster hovering over the bog midground, a loose scatter of matchstick-bright points bobbing in faint unison."
  "Pixie-cloud swirling around the old-growth canopy, a soft pinprick shimmer of moving light caught briefly between the dark branches."

━━━ VARIETY MANDATE — distribute the ${n} entries roughly across these creature categories ━━━

(roughly equal counts — do NOT cluster on one category)

1. **DRAGON-SHADOWS / WYVERN-FLIGHTS** — single dragon-shadow on horizon, dragon-flock converging, wyvern-pair gliding, dragon-hatchling perched on spire, drake-silhouettes wheeling, dragon-shadow on cliff-face.

2. **GIANT BIRDS / RAPTORS** — giant eagle-pair, condor-flight, roc-shadow, giant-owl gliding, thunderbird silhouette, vulture-circle.

3. **WINGED MYTHIC BEASTS** — griffin-pair circling, pegasus-flight, hippogriff-silhouette, sky-stag with antler-clouds, manticore-shadow.

4. **HERD-CREATURES IN VALLEY / PLAIN** — unicorn-herd grazing, wild-pegasi running, ghost-deer stepping, deer-pair at watering hole, horse-herd crossing, elk-procession, white-stag and hinds, wild-aurochs herd.

5. **WATER-CREATURES SURFACING** — hydra-silhouette surfacing, sea-serpent breaching, kelpie-pair on lake-edge, kraken-tentacle distant, river-drake breaking water, lake-spirit rising.

6. **TINY GROUND-CREATURES IN MIDGROUND** — sphinx crouched on escarpment, manticore-pair distant, chimera pacing far ridge, basilisk-shape on rocks, giant-tortoise silhouette, wolf-pack ridge-line.

7. **WISPS / WILL-O-WISPS / LEY-PARTICLES** — will-o-wisp cluster, leyline-particles streaming, aurora-spirits threading, ghost-fire bobbing, marsh-wisp scatter, soul-light drift.

8. **MAGICAL POLLEN / SPORE / DUST CLOUDS** — glowing pollen-cloud, fae-spore-cloud, dragon-ember drift, ash-mote spiral, dream-pollen, blessing-mote rise.

9. **FAIRIE / PIXIE / SPRITE CLOUDS** — pixie-cloud swirling, faerie-dragon swarm, sprite-cloud drift, dryad-light cluster, wisp-fairy ring, nymph-glow shimmer.

10. **CELESTIAL / FALLING-STAR / METEOR PHENOMENA** — falling-stars streaking, meteor-trail single arc, comet on horizon, star-dust drift, aurora-curtain ripple distant, eclipse-shadow falling.

11. **GHOST / SPIRIT MANIFESTATIONS** — ghost-deer stepping, spirit-dust rising, wraith-light hovering, ancestor-spirit column, banshee-flicker, soul-wisp drift.

12. **MIGRATING SWARMS** — moth-cloud crossing the moon, swallow-flock arcing the dusk, dragon-fly swarm catching light, butterfly-storm spiral, glowbug-cloud rising.

13. **SACRED-ANIMAL SIGHTINGS** — white-stag at forest-edge, golden-hare in meadow, raven-cluster on ruin, sacred-ox at horizon, oracle-bird on standing-stone, holy-wolf at ridge.

14. **PETAL / LEAF / NATURE-PARTICLE DRIFT** — cherry-blossom-petals carried on canyon updraft, autumn-leaves spiraling upward, snow-petal veil, ember-petals drifting from canopy, seed-down drift, blossom-storm.

━━━ THE MINIATURE-SCALE CUE — NON-NEGOTIABLE ━━━

Every entry MUST contain an explicit miniature-scale cue. Use these phrases (mirror the existing 25's language):

- "ant-sized" — for solid creatures at deep distance
- "matchstick-sized" — for slightly larger / closer-but-still-tiny silhouettes
- "pinprick" — for points of light, magical motes, distant flying creatures
- "a thin pinprick veil" / "pinprick shimmer" / "pinprick scratch" — for particle-effects
- "a loose scatter of matchstick-bright points" — for clusters of small glowing things
- "barely distinguishable from the [fog/mist/sky]" — emphasis on near-invisibility
- "translucent pinprick forms" — for ghostly creatures
- "a thin pinprick column" — for rising motes/sparks
- "ant-sized [color] shapes" — for distant herds

Use SPECIFIC NUMBERS or descriptors when natural: "two ant-sized silhouettes" / "seven ant-sized white shapes" / "three matchstick-sized winged horses" / "five pinprick silhouettes" / "dozens of pinprick gold lights".

━━━ THE LOCATION CUE — NON-NEGOTIABLE ━━━

Every entry MUST name the creature's location in the frame:

- "above the glacier ridge"
- "tracing the horizon treeline"
- "in the deep-distance green"
- "above the distant white cliffs"
- "over the bog midground"
- "around the old-growth canopy"
- "at the distant lake center"
- "on the far desert escarpment"
- "between the dark branches"
- "across the deep-distance amber grass"
- "in the high valley mist"
- "at the valley watering hole far below"
- "on the midground spire"

━━━ STRICT BANS ━━━

- NO focal creatures. NEVER "a dragon in the foreground" / "a unicorn grazing in the foreground". Distance only.
- NO humanoid characters. NO heroes / elves / orcs / dwarves / hobbits / humans / kobolds / goblins in frame, even tiny. Beasts and magical-particles only.
- NO franchise-specific creature names ("balrog", "nazgul", "fel-orc-warg", "tauren-druid").
- NO photoreal / CGI / 3D-render language.
- NO modern / sci-fi / cyberpunk creatures.
- NO descriptors that violate the no-focal-character rule — NEVER "in the foreground" / NEVER "standing close to the viewer".
- NO entries that omit the explicit miniature-scale cue.
- NO entries that omit the location-in-frame cue.

━━━ STRICT FORMAT ━━━

- ONE sentence per entry. No internal periods.
- 18-28 words.
- Start with the creature/particle name in noun-phrase form (e.g., "Giant eagle-pair...", "Dragon-shadow...", "Aurora-spirits...", "Will-o-wisp cluster...", "Faerie-dragon swarm...").
- Strip apostrophes from possessives.
- Each creature unique — no near-duplicates of prior entries.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string. Each entry follows the format exactly.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
