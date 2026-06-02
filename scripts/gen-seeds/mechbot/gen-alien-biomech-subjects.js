#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mechbot/seeds/alien_biomech_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (
    n
  ) => `You are writing ${n} BIOMECHANICAL ORGANISM descriptions for MechBot's alien-biomechs path. Each describes a single creature-scale flesh-and-machine fusion organism, 14-22 words.

Each entry: body plan + flesh-machine fusion ratio + signature anatomy + bioluminescent/fluid accents.

━━━ NON-NEGOTIABLE ━━━
The subject is an ORGANISM (a creature you could face). NOT a vehicle, NOT a building, NOT a humanoid cyborg. Creature-scale (between human-sized and rhino-sized). Flesh-machine fusion is integral — not flesh wearing armor; the machine and the body are one.

━━━ BODY-PLAN VARIETY ━━━
- Arthropod (insectoid, crustacean — chitinous + hydraulic legs)
- Cephalopod (tentacled, bulbous mantle — coolant-tube tendrils)
- Chimeric (multiple borrowed body plans — quadruped torso + tentacles)
- Serpentine / wormlike (segmented body, articulated joints)
- Avian / pterosaur (winged, raptorial — bone-and-cable wing struts)
- Quadruped predator (mammal-like silhouette, machine-augmented)
- Amphibian / aquatic (gill-vents, finned, slick fluid-coating)
- Hive form (segmented colonial, multiple sub-bodies linked)

━━━ FLESH-MACHINE FUSION DETAILS ━━━
- Chitin-plated thorax with exposed coolant-pipe ribs
- Hydraulic-tendon legs ending in clawed fingers
- Arterial coolant tubing visible across the dorsal surface
- Cybernetic eye-cluster / sensor-stalk array
- Sphincter-like exhaust vents pulsing in flank
- Translucent flesh panels showing internal mechanisms
- Bone-spike protrusions integrated with metal plate
- Bioluminescent organ-glow at joints / mouths / eye-clusters

━━━ AESTHETIC LANGUAGE ━━━
- H.R. Giger biomechanical horror
- Bloodborne body-horror beauty
- Annihilation Shimmer organic strangeness
- Scorn machine-organism intimacy
- Hollow Knight infected uncanny

━━━ EXAMPLES (write fresh) ━━━
- "Centaur-tall arthropod with chitin-plated thorax, eight hydraulic-tendon legs, arterial coolant tubing pulsing along its dorsal ridge"
- "Cephalopod predator with bulbous coolant-fluid mantle, six cable-tendrils tipped in chrome talons, bioluminescent eye-cluster"
- "Quadruped chimera blending wolf silhouette and beetle plating, exposed hydraulic spine, jaw cavity ringed with sensor stalks"

━━━ DEDUP DIMENSIONS ━━━
Deduplicate by: body plan + signature anatomy + flesh-machine fusion ratio.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
