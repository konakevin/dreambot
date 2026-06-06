#!/usr/bin/env node
/**
 * DINO_DIORAMA_CRITTERS — secondary prehistoric life / scale-provers
 * at mid/far distance. Tiny clay pterosaurs wheeling in the sky, baby
 * dinos peeking from boulders, distant herd silhouettes, insect-size
 * clay beetles, scattered eggs, small creatures that PROVE the
 * monumental anchor's scale + fill the world with life.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_diorama_critters.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SECONDARY-CRITTER + SCALE-PROVER entries for ToyBot dino-diorama — tiny background life that fills the multi-tier depth and proves the monumental clay anchor's scale. Each entry is one sentence, 18-28 words, naming a small clay creature or detail at mid-to-far distance.

━━━ THE BAR ━━━
Every entry names ONE small clay creature or scale-prover, keeps it SMALL and at MID/FAR distance (never crowds the hero dinos), and adds visible life to the world. The entries serve as quiet population — beetles, dragonflies, baby dinos peeking, distant silhouetted herds, scattered eggs, hatching shells, fossil bones, small mammals, primitive birds. Visible clay material when describing the creature.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"Three tiny clay pterosaurs wheel in lazy circles high above the canopy, their wingspans barely a thumbnail wide against the pale sky."
"A baby clay ankylosaur peeks shyly from behind a mossy boulder, its bumpy shell no bigger than a grape."
"A cluster of clay beetles with iridescent shell-dots crawls across a fallen log in the mid-distance, each one smaller than a pea."
"Far back on the horizon, a tiny silhouetted herd of clay sauropods grazes in a line, each figure barely taller than a fingernail."
"Two juvenile clay raptors crouch behind a rock cluster, heads tilted, watchful eyes level with the pebbles around them."

━━━ VARIETY MANDATE (distribute across these critter types) ━━━
- ~3 PTEROSAURS / FLYING REPTILES (wheeling pterodactyls / soaring quetzalcoatlus / circling dimorphodon)
- ~3 BABY / JUVENILE DINOS (hatchlings peeking / curled babies / playful juveniles in foliage)
- ~3 DISTANT SILHOUETTED HERDS (tiny grazing line / migrating sauropods / silhouette stampede)
- ~3 INSECTS / SMALL INVERTEBRATES (clay beetles / dragonflies / centipedes / scorpions / spiders / ants on logs)
- ~2 EGGS / NESTS (clay nest with eggs / scattered shell fragments / single half-buried egg)
- ~2 SMALL MAMMALS / EARLY BIRDS (early primates / proto-mammals / archaeopteryx / small primitive birds)
- ~2 FOSSILS / BONES (half-buried fossil bones / fossilized skull / weathered ribcage / tracks in mud)
- ~2 SMALL REPTILES / LIZARDS (clay lizards on rocks / small monitors / sleeping iguanodon-baby)
- ~2 FISH / AQUATIC LIFE (clay fish leaping / school in shallow water / amphibians in puddle)
- ~1 RACCOON-DOG / TRILOBITE / EARLY OCEAN CREATURE (atmospheric oddities)
- ~1 SCATTERED FOOTPRINTS / TRACKS (trail of three-toed prints in mud / claw-marks on bark)
- ~1 DROPPED FEATHERS / SHED SCALES (feather scatter / shed claw / abandoned tooth)

━━━ BANS ━━━
- NO modern animals (deer, dogs, cats, humans).
- NO making the critter the FOCAL beat — they're SMALL background population.
- NO bare "small creature" without naming species + clay material + location in the frame (mid-distance / far horizon / background).
- NO repeating the exact same critter species across entries.
- NO living dinosaurs in critter axis at HERO scale — the hero dinos are a separate pool.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
