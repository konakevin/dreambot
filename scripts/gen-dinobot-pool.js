#!/usr/bin/env node
/**
 * DinoBot pool generator (unified). Hosts all per-path pool recipes for
 * DinoBot's bespoke axis-system migration.
 *
 * Usage:
 *   node scripts/gen-dinobot-pool.js --pool <name> --count 30
 *   node scripts/gen-dinobot-pool.js --pool <name> --target 200 --count 30
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');
const { SONNET } = require('./lib/models');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .map((s, i, a) => (s.startsWith('--') ? [s.slice(2), a[i + 1] ?? true] : null))
    .filter(Boolean)
);
const POOL = args.pool;
const TARGET = parseInt(args.target || '0', 10);
const BATCH = parseInt(args.batch || '25', 10);
const COUNT = parseInt(args.count || (TARGET ? '0' : '30'), 10);

if (!POOL) {
  console.error('Usage: --pool <name> --count N OR --target N');
  process.exit(1);
}

const OUT = path.resolve(__dirname, 'bots/dinobot/seeds', `${POOL}.json`);

const RECIPES = {
  dinobot_nesting_ground_surprise_element: `Generate SMALL FAMILY-MOMENT ACCENT descriptions for DinoBot's nesting-ground path. Each is ONE comma-separated line, 15-30 words, describing a small secondary accent in the family-scene — additional juvenile / distant adult / nest-detail / hatching-egg / scattered debris / family-trace.

The element is SMALL — 2-5% of the frame. Position: midground or foreground edge. Adds depth and family-life context.

Variety mandate (rotate widely):
- ~20% Additional juvenile / hatchling in the foreground edge (smaller scale-prover, peeking out of fern / play-pawing)
- ~15% Distant adult watching from cliff-edge / treeline / midground (guardian-coded)
- ~10% Hatching egg with crack opening / shell-fragment scattered (life-cycle moment)
- ~10% Discarded nest debris (broken eggshells / arranged twigs / down-feathers)
- ~10% Sibling further off mid-action (running / pouncing / drinking at distance)
- ~10% Parent feeding moment (regurgitating / passing food / nuzzling)
- ~10% Juvenile-and-parent mirror gesture (both heads turned same direction / both watching skies)
- ~5% Communal-nursery sense (multiple nest mounds visible at deep distance)
- ~5% Small dinosaur footprint / juvenile tracks in mud / juvenile-tail-drag pattern
- ~5% Atmospheric small life (giant dragonfly Meganeura, primordial bird in flight, etc.)

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / distant background)
- ONE SPECIFIC DETAIL (mid-action / catching light / posture / etc.)

GOOD examples:
- A second juvenile hatchling in the foreground edge, head emerging from fern fronds, eye reflecting the golden light
- A distant adult Triceratops watching from a cliff-edge at deep midground, silhouette against the sky, frill catching sunset light
- A hatching egg in the foreground at midground edge, crack opening with a tiny snout visible inside, shell-fragments scattered around
- Scattered eggshell fragments and arranged twigs in foreground, the nest aftermath
- A juvenile Maiasaura sibling further off mid-pounce on a stick, mid-air leap captured

ABSOLUTELY BANNED:
- NO humans / no human-trace
- NO modern animals
- NO combat / no kill-shot / no gore / no dead-juvenile / no parent-attacked
- NO weapons / tools / artifacts
- NO duplicate-style entries

Output: ONE family-accent per line. No numbering. No quotes.`,

  dinobot_herd_migration_surprise_element: `Generate SMALL HERD-ACCENT descriptions for DinoBot's herd-migration path. Each is ONE comma-separated line, 15-30 words, describing a small secondary accent in or around the colossal migrating herd — trailing juvenile / fallen tree the herd parts around / pterosaur flock above / dust-rising / mud-track-detail / atmospheric scale-prover.

The element is SMALL — 2-5% of the frame. Position: midground or foreground edge. Adds depth and scale-prover energy to the migration scene.

Variety mandate (rotate widely):
- ~20% Trailing juvenile dinosaur at the herd's flank/rear (smaller-scale silhouette running to keep up)
- ~15% Pterosaur flock circling above the herd (size-prover, marine-air contrast)
- ~10% Dust-cloud or vapor-cloud rising from the herd's footfalls (massive-scale atmospheric)
- ~10% Fallen mega-tree the herd is parting around / stepping over (epic-obstacle scale-prover)
- ~10% Deep mud-print rim / three-clawed dinosaur tracks at foreground (anatomy-prover)
- ~10% Herd-stragglers visible at far vanishing-point silhouette (depth-prover)
- ~10% Foreground bone / fossil / weathered-trail-marker the herd passes over (deep-time)
- ~5% Small pterosaur skimming low across the herd (action-scale-prover)
- ~5% Atmospheric Meganeura or primordial insect-swarm (scale-prover small life)
- ~5% Mother-dinosaur with juvenile-on-flank moment within the herd-mass (intimacy beat)

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / distant background)
- ONE SPECIFIC DETAIL (mid-action / catching light / posture / scale-prover)

GOOD examples:
- A trailing juvenile Parasaurolophus at the herd's right flank, smaller-crest catching light, running to keep up with the adults ahead
- A flock of twenty pterosaurs circling the herd above, vast wingspans casting brief shadows across the moving backs
- A massive fallen Araucaria trunk in the midground foreground, the herd parting around it like water around a stone
- Three-clawed dinosaur footprints in deep mud at foreground, each print holding a pool of rainwater catching the sky
- Distant vanishing-point silhouettes of the herd-stragglers receding into the haze, scale-staggered

ABSOLUTELY BANNED:
- NO humans / no human-trace / no fences / no tools
- NO modern mammals (no wildebeest / no bison / no elephants)
- NO modern birds (pterosaurs OK)
- NO combat / no kill-shot / no gore / no predator-attack-on-herd
- NO duplicate-style entries

Output: ONE herd-accent per line. No numbering. No quotes.`,

  dinobot_territory_clash_surprise_element: `Generate SMALL CLASH-ACCENT descriptions for DinoBot's territory-clash path. Each is ONE comma-separated line, 15-30 words, describing a small secondary accent in or around the two-dinosaur confrontation — broken-debris / dust-rising / panicked-bystander / atmospheric small life / etc.

The element is SMALL — 2-5% of the frame. Position: midground or foreground edge. Adds tension and atmosphere to the clash.

Variety mandate (rotate widely):
- ~20% Broken fern-frond / cycad-tree-debris kicked up at the impact point (mid-air debris-spray)
- ~15% Dust-cloud or vapor-cloud rising at the contact-zone (massive-impact atmospheric)
- ~15% Panicked-bystander dinosaur fleeing the periphery — wrong species, small, in flight-stride
- ~10% Pterosaur flock startled into flight above the clash (size-prover, lift-off)
- ~10% Deep three-clawed dinosaur tracks already gouged in the foreground mud / dirt
- ~10% Small ground-shake atmospheric — pebbles bouncing / mud-spray / hoofprint-puddle rippling
- ~5% Watching juvenile dinosaur at deep midground silhouette (witness to the clash)
- ~5% Foreground bone / fossil / weathered-skull from a previous clash (deep-time anchor)
- ~5% Atmospheric Meganeura or primordial insect-swarm disturbed (scale-prover small life)
- ~5% Streak of light-ray catching the dust at the impact moment (cinematic god-ray)

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / distant background)
- ONE SPECIFIC DETAIL (mid-action / catching light / posture / scale-prover)

GOOD examples:
- A spray of broken fern-fronds catching backlight in the impact zone, midground, debris suspended mid-air
- A panicked Compsognathus fleeing from the periphery, tiny bipedal silhouette mid-stride, dust pluming behind
- A dust-cloud rising at the contact-zone, midground, refracting amber light into suspended particulate
- Three-clawed dinosaur prints gouged in foreground mud, each print holding a rainwater pool catching the sky
- A watching juvenile Triceratops silhouette at deep midground, frill catching distant light, witnessing the clash

ABSOLUTELY BANNED:
- NO humans / no human-trace / no fences / no tools
- NO modern mammals / no buffalo / no bison / no rhinos
- NO modern birds (pterosaurs OK)
- NO gore / blood / carcass / wound / kill-shot detail
- NO duplicate-style entries

Output: ONE clash-accent per line. No numbering. No quotes.`,
  dinobot_dino_action_surprise_element: `Generate SMALL ACTION-ACCENT descriptions for DinoBot's dino-action path. Each is ONE comma-separated line, 15-30 words, describing a small atmospheric accent in or around the peak-action moment — dust-spray / water-spray / scattered-debris / motion-blur-particulate / fleeing-prey-silhouette / mud-print / etc.

The element is SMALL — 2-5% of the frame. Position: foreground edge / midground around the action / behind in bokeh. Adds motion-energy and atmosphere.

Variety mandate (rotate widely):
- ~20% Dust-spray / dust-cloud erupting from the dinosaur's footfall or claw-strike
- ~15% Water-spray / mud-spray / wet-spatter from a stomp / strike / chase through water
- ~15% Fleeing-prey-silhouette small in midground — startled into flight, exiting frame
- ~10% Scattered-debris kicked up — broken-ferns / cycad-fronds / pebble-spray
- ~10% Foreground three-clawed dinosaur footprints just made
- ~10% Atmospheric motion-haze / particulate-light catching the action
- ~5% Distant secondary dinosaur watching/witnessing the action
- ~5% Foreground tactile detail — mud / leaves crushed / vegetation parted
- ~5% Pterosaur flock startled into flight from nearby trees
- ~5% Dramatic light-shaft cutting across the action moment

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / distant background)
- ONE SPECIFIC DETAIL (mid-action / catching light / texture / scale-prover)

GOOD examples:
- A dust-cloud erupting from the Velociraptor's hind-foot, midground, golden particles suspended mid-spray
- A startled Compsognathus silhouette mid-stride at the periphery, fleeing the predator's strike
- Three-clawed dinosaur prints freshly gouged in foreground mud, water seeping in
- A light-shaft cutting across the action moment, catching dust-particulate in golden beam
- Broken cycad-fronds scattered foreground, crushed underfoot during the charge

ABSOLUTELY BANNED:
- NO humans / no human-trace
- NO modern animals / no mammals
- NO gore / no blood-spray / no torn-flesh / no carcass
- NO duplicate-style entries

Output: ONE action-accent per line. No numbering. No quotes.`,

  dinobot_dino_portrait_surprise_element: `Generate SMALL PORTRAIT-ACCENT descriptions for DinoBot's dino-portrait path. Each is ONE comma-separated line, 15-30 words, describing a small intimate portrait accent — breath-fog / dust-mote / drifting-feather / water-drip / scar-detail / pollen-particulate / etc.

The element is SMALL — 2-5% of the frame. Position: foreground edge / mid-frame / behind hero in bokeh. Adds character and atmosphere to the portrait.

Variety mandate (rotate widely):
- ~15% Breath-fog / steam plume at the dinosaur's jaw (cold-air or dawn atmosphere)
- ~15% Drifting feather / down-fluff (foreground particulate)
- ~10% Pollen-particulate or dust-mote suspended in light-shaft
- ~10% Water-drip / sweat-drop / muddy-flecks on hide (texture)
- ~10% Foreground tactile detail — moss / fern-frond / mud / arranged-pebbles
- ~10% Old scar / wound-trace / weather-mark on hide (story-detail)
- ~10% Distant secondary dinosaur silhouette at deep bokeh-soft midground (scale-prover)
- ~5% Insect / Meganeura hovering nearby (small life accent)
- ~5% Pterosaur silhouette in deep distance sky-bokeh
- ~10% Light-shaft / god-ray catching the dinosaur's eye or specific feature

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / behind in bokeh)
- ONE SPECIFIC DETAIL (mid-action / catching light / texture / posture)

GOOD examples:
- A plume of breath-steam at the Tyrannosaurus's lower jaw, catching dawn light, suspended in the cold air
- A single iridescent feather drifting in the foreground midair, catching warm rim-light
- A distant Brachiosaurus silhouette in deep bokeh-soft background, scale-prover for the hero
- Pollen-particulate suspended in a god-ray cutting across the scene, golden-amber glow
- An old scar across the dinosaur's flank, weathered ridge-line catching low-angle light

ABSOLUTELY BANNED:
- NO humans / no human-trace
- NO modern animals
- NO gore / blood / wound-fresh
- NO duplicate-style entries

Output: ONE portrait-accent per line. No numbering. No quotes.`,

  dinobot_aerial_perspectives_surprise_element: `Generate SMALL AERIAL-ACCENT descriptions for DinoBot's aerial-perspectives path. Each is ONE comma-separated line, 15-30 words, describing a small secondary aerial accent — companion pterosaur silhouette / sun-disk-positioning / cloud-strata / lightning-arc / atmospheric small detail.

The element is SMALL — 2-5% of the frame. Position: sky / foreground edge / distant horizon. Adds aerial drama and depth.

Variety mandate (rotate widely):
- ~15% Companion pterosaur silhouette in distance, formation flight or wingtip-mirror
- ~15% Sun-disk positioning — partially behind clouds / on horizon / corona-flare
- ~10% Moon-disk in day-sky or full-moon at night
- ~10% Cloud-strata layering — anvil-cumulus / mares-tail / mist-band horizon
- ~10% Lightning-arc cracking through storm-cloud distant
- ~10% Distant flock of pterosaurs in V-formation receding
- ~10% Volcanic-ash plume in deep background sky
- ~5% Meteor streak across the sky
- ~5% Aurora ribbon in night sky
- ~5% Sundog / parhelion / cloud-iridescence atmospheric phenomenon
- ~5% Distant ground-detail visible from above — river-bend / volcanic-cone / canyon-shadow

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / distant sky / horizon)
- ONE SPECIFIC DETAIL (mid-action / catching light / posture / scale-prover)

GOOD examples:
- A flock of seven distant Pteranodon silhouettes in V-formation deep behind, wingtips catching backlight
- The sun-disk half-set on the horizon with corona-flare, atmospheric haze layering the sky
- A volcanic-ash plume on the deep horizon, drifting orange against pale blue
- A lightning-arc cracking blue-white through a distant storm-cloud, illuminating the cloud-strata
- A meteor streak arcing across the deep sky, blue-white tail

ABSOLUTELY BANNED:
- NO humans / no aircraft / no helicopters / no drones / no human-trace
- NO modern birds (eagles, hawks — pterosaurs only)
- NO modern animals
- NO duplicate-style entries

Output: ONE aerial-accent per line. No numbering. No quotes.`,

  aerial_subjects: `Generate FLYING PTEROSAUR descriptions for DinoBot's aerial-perspectives path. Each is ONE comma-separated line, 20-35 words, describing a specific pterosaur (or early-flying-dinosaur) species MID-FLIGHT in the air.

The pterosaur is MID-FLIGHT — never perched, never on the ground, never resting, never swimming. Wing-membrane stretched across elongated 4th-finger to ankle (paleontologically accurate, NOT bird-feathered, NOT bat, NOT dragon).

Valid species (rotate widely across the pool):
- Pteranodon (back-pointing crest, large wingspan, marine)
- Quetzalcoatlus (giant, stork-proportions, ten-meter wingspan)
- Pterodactylus (small, toothed snout, slender)
- Tupuxuara (semi-circular crest)
- Tropeognathus (keeled rostrum)
- Rhamphorhynchus (long vane-tipped tail, needle teeth)
- Anhanguera (keeled rostrum, marine, fish-hunter)
- Tapejara (elaborate forward-curved crest)
- Dimorphodon (puffin-like beak, short wings)
- Nyctosaurus (Y-shaped head crest, soaring)
- Hatzegopteryx (robust skull, terror of Romania)
- Microraptor (four-winged glider — feathered)
- Archaeopteryx (early feathered dinosaur, primitive flight)

EVERY entry includes:
- THE SPECIES NAME (explicitly)
- THE FLIGHT ACTION (soaring / banking / diving / hovering / circling / gliding / climbing / mid-flap / wingtip-grazing-water)
- ONE DEFINING ANATOMY DETAIL (crest shape / wingspan / membrane translucency / beak shape)

GOOD examples:
- Quetzalcoatlus mid-soar at sunset, ten-meter wingspan extended, leathery membrane translucent in backlight, neck folded back in flight
- Pteranodon banking hard right over open ocean, distinctive backward-pointing crest catching golden hour, wings tilted in deep stall
- Tapejara gliding over volcanic plain, elaborate forward-curved crest visible in profile, wings angled steeply in descending spiral
- Anhanguera mid-dive with long tooth-lined jaws extended, snatching silvery fish from glassy ocean surface, wingtips inches from water
- Microraptor gliding between conifer canopies, four iridescent feathered wings spread wide, long tail-vane acting as rudder mid-flight

ABSOLUTELY BANNED:
- NO ground dinosaurs (no theropods / sauropods / hadrosaurs / ceratopsians on ground)
- NO "aerial perspective of [ground dinosaur]" — this path is PTEROSAURS IN FLIGHT only
- NO perched / standing / resting pterosaurs — MID-FLIGHT only
- NO swimming dinosaurs
- NO dragon / eagle / bat / griffin coding — paleontological pterosaur anatomy only
- NO humans / no aircraft / no human-trace
- NO duplicate-style entries

Output: ONE flying-pterosaur entry per line. No numbering. No quotes.`,

  dinobot_dino_pack_surprise_element: `Generate SMALL PACK / GROUP ACCENT descriptions for DinoBot's dino-pack path. Each is ONE comma-separated line, 15-30 words, describing a small secondary pack accent — sentinel-individual / trailing-juvenile / pack-leader-pose / scattered-prey-bones / pterosaur-above / dust-cloud / etc.

The element is SMALL — 2-5% of the frame. Position: midground or foreground edge. Adds depth and pack-life energy.

Variety mandate (rotate widely):
- ~15% Sentinel-individual posed alert at a vantage point — neck-up / on-rock / on-rise
- ~15% Trailing juvenile of the same species at the pack's flank/rear (smaller scale-prover)
- ~15% Pack-leader-pose — distinctive individual at the head, head-high or wing-spread
- ~10% Pterosaur flock circling above the pack (size-prover)
- ~10% Dust-cloud or vapor-cloud rising from the pack's footfalls
- ~10% Scattered-prey-bones / weathered-skull / fossil debris foreground (deep-time anchor)
- ~5% Sub-pack splinter group in deep midground (scale-stratification)
- ~5% Distant vanishing-point silhouettes of trailing pack-stragglers
- ~5% Foreground mud-prints or three-clawed footprints
- ~10% Atmospheric small life (giant dragonfly, primordial bird-silhouette, etc.)

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / distant background)
- ONE SPECIFIC DETAIL (mid-action / catching light / posture / scale-prover)

GOOD examples:
- A sentinel Velociraptor perched on a fallen Araucaria log, midground, head turning sharply to scan the horizon
- A trailing juvenile Parasaurolophus at the pack's left flank, smaller crest catching light, running to keep up
- A pack-leader Tyrannosaurus at the head of the cluster, scarred jaw raised in a guttural call
- A flock of twenty Pteranodon circling above the pack, vast wingspans tilting in thermal updraft
- Three-clawed dinosaur footprints in deep mud at foreground, rainwater pooling in each print

ABSOLUTELY BANNED:
- NO humans / no human-trace
- NO modern mammals
- NO gore / no carcass-blood / no kill-shot-detail
- NO duplicate-style entries

Output: ONE pack-accent per line. No numbering. No quotes.`,

  dinobot_dino_cozy_surprise_element: `Generate SMALL COZY-MOMENT ACCENT descriptions for DinoBot's dino-cozy path. Each is ONE comma-separated line, 15-30 words, describing a small intimate accent in or around the cozy scene — additional hatchling / soft-light-dapple / nest-debris / dropped-feather / soft-petal-floating / etc.

The element is SMALL — 2-5% of the frame. Position: midground or foreground edge. Adds warmth and intimacy to the cozy scene.

Variety mandate (rotate widely):
- ~20% Additional juvenile / hatchling peeking from the periphery (smaller scale-prover)
- ~15% Soft-light-dapple — sunbeams filtering through canopy onto the scene
- ~10% Dropped feather / hatchling-down / soft-fluff catching light (delicate texture)
- ~10% Nest-debris — moss arrangement / soft eggshells / arranged twigs (cozy-craft)
- ~10% Foreground petal / leaf / berry resting on the ground (intimate detail)
- ~10% Atmospheric small life — butterfly / dragonfly / Meganeura hovering peacefully nearby
- ~5% Soft mist or dew on foreground fronds (cozy moisture)
- ~5% Sleeping smaller dinosaur in the deep background (multi-scene warmth)
- ~5% Bird-like small theropod silhouette resting on a branch (peaceful periphery)
- ~10% Foreground tactile cozy detail — moss / soft soil / arranged stones / etc.

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / distant background)
- ONE SPECIFIC DETAIL (mid-action / catching light / posture / scale-prover)

GOOD examples:
- A tiny hatchling Maiasaura peeking from under the mother's tail, eye reflecting golden light, soft and curious
- Dappled sunlight filtering through cycad fronds overhead, painting golden patches across the scene
- A single iridescent feather drifting in foreground midair, catching warm backlight
- Foreground moss-and-stone arrangement at the nest edge, soft tactile detail
- A Meganeura dragonfly hovering peacefully in the midground, wings catching diffused light

ABSOLUTELY BANNED:
- NO humans / no human-trace
- NO modern animals (no mammals, no modern birds)
- NO predation / violence / fear / fleeing / threat
- NO harsh / cold / dramatic-disaster details
- NO duplicate-style entries

Output: ONE cozy-accent per line. No numbering. No quotes.`,

  dinobot_cinematic_silhouette_surprise_element: `Generate SMALL SILHOUETTE-ACCENT descriptions for DinoBot's cinematic-silhouette path. Each is ONE comma-separated line, 15-30 words, describing a small secondary silhouette accent in or around the dinosaur — pterosaur-silhouette / sun-or-moon-disk-positioning / meteor-streak / bird-flock / atmospheric small element / etc.

The element is SMALL — 2-5% of the frame. Position: foreground edge / midground / sky. Adds drama to the silhouette composition.

Variety mandate (rotate widely):
- ~20% Pterosaur silhouette crossing the sky (size-prover, mid-flight) — Pteranodon / Quetzalcoatlus / Pterodactylus
- ~15% Sun-disk positioning — partly behind dinosaur / on the horizon / peeking through cloud (composition anchor)
- ~15% Moon-disk or moon-phase positioning — full moon / crescent / blood-moon / supermoon (composition anchor)
- ~10% Meteor streak / shooting star arcing across the night sky (cosmic-drama)
- ~10% Flock of pterosaur silhouettes — V-formation / scatter / circling (multi-silhouette)
- ~10% Foreground silhouetted plant — cycad-frond / mushroom-tree / Araucaria branch (depth anchor)
- ~5% Lightning fork in the sky background (storm-drama)
- ~5% Aurora ribbon in night sky (polar drama)
- ~5% Distant volcanic cone silhouetted at the horizon (deep-time anchor)
- ~5% Atmospheric Meganeura insect silhouette in the foreground (scale-prover small life)

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / sky)
- ONE SPECIFIC DETAIL (mid-action / catching light / scale-prover)

GOOD examples:
- A flock of seven Pteranodon silhouettes crossing the sky in V-formation, distant, wings catching backlight
- The sun-disk half-set on the horizon directly behind the dinosaur, molten-red corona
- A meteor streak arcing across the deep night sky, blue-white tail catching atmosphere
- A blood-moon disk rising on the horizon, oxblood-red, atmospheric haze around it
- A foreground silhouetted cycad-frond at the right edge, depth-anchor against the bright sky

ABSOLUTELY BANNED:
- NO humans / no human-trace
- NO modern silhouettes (no helicopters / no airplanes / no telephone poles)
- NO modern mammal silhouettes
- NO duplicate-style entries

Output: ONE silhouette-accent per line. No numbering. No quotes.`,

  dinobot_ocean_reptiles_ocean_scene: `Generate STRICT MESOZOIC OPEN-OCEAN scene descriptions for DinoBot's ocean-reptiles path. Each is ONE comma-separated line, 30-50 words, describing the OCEAN setting — open marine water, underwater, surface-break, deep-abyss, reef, continental-shelf.

⚠️ STRICT OCEAN IDENTITY — NEVER river / swamp / lake / mud-flat / pond / wetland. ALWAYS pelagic open-ocean / deep blue water / coral reef / underwater light-shafts / surface-break / storm-tossed waves. NO land visible primary (a distant land silhouette at deep horizon is OK at most).

⚠️ COMPOSITION MODES (rotate widely — encourage underwater and breach shots):
- ~30% UNDERWATER OPEN-OCEAN — submerged perspective looking through blue water, sunlight shafts cutting down from the surface above, particulate-haze, vast emptiness extending beyond
- ~20% MID-OCEAN BREACH / SURFACE-BREAK — half-above-half-below water-line, marine reptile breaching with spray and waves, dramatic action moment
- ~15% DEEP ABYSS — dark blue-violet deep water, fading light from above, atmospheric water-particulate, sense of impossible depth
- ~10% UNDERWATER REEF / CORAL-CANYON — primordial reef with corals, sponges, sea-lilies (crinoids), light filtering from above
- ~10% STORM-TOSSED SURFACE — wave-tossed open ocean with whitecaps, marine reptile partly visible in wave-crest, storm sky overhead
- ~5% CONTINENTAL SHELF / SHALLOW REEF — sunlit shallow water with marine life visible, sand bottom, light dappling
- ~5% UNDERWATER KELP / PRIMORDIAL ALGAE FOREST — towering sea-plant forest with light filtering through, particulate
- ~5% DAWN / SUNSET OCEAN HORIZON — wide open-ocean horizon with marine reptile surfacing or breaching, dramatic sky

EVERY entry includes:
- THE OCEAN SETTING TYPE (underwater open-ocean / surface-break / deep abyss / reef / storm-tossed / etc.)
- WATER QUALITY (cerulean / sapphire-blue / turquoise / cobalt / dark blue-violet / sunlit-aqua / etc.)
- ATMOSPHERIC DEPTH cue (light-shafts from above / particulate-haze / fading depth / wave-tossed / etc.)
- ONE specific detail (bubble streams / kelp swaying / coral structure / wave-spray / sun-dappled bottom)

GOOD examples:
- A vast underwater open-ocean perspective in deep cerulean blue, sunlight shafts cutting down from the surface 60ft above in parallel beams, particulate-haze drifting, vast emptiness fading to deep blue-violet in every direction
- A mid-ocean surface-break composition split half-above-half-below the waterline, storm-grey sky above, dark blue-green water below with foam and bubble-streams from a breach, distant horizon
- A primordial reef in sunlit shallow water 20ft deep, ancient corals and sponges across the sand-bottom, schools of small fish darting between, light dappling the sea-floor in moving patterns
- A storm-tossed open-ocean surface with whitecaps under a bruised-violet sky, towering wave-crests with foam streaming off the tops, sheet-lightning at deep horizon

ABSOLUTELY BANNED:
- NO rivers / no swamps / no mud-flats / no lakes / no ponds / no marshes
- NO modern beach / no tropical-vacation / no Caribbean coastal
- NO modern fish / no modern marine life (no whales / no dolphins / no sharks unless megalodon-coded primordial)
- NO humans / no boats / no human-trace
- NO modern coastal city / no harbor

Output: ONE ocean scene per line. No numbering. No quotes.`,

  dinobot_ocean_reptiles_creature: `Generate OCEAN-DINOSAUR descriptions for DinoBot's ocean-reptiles path. Each is ONE comma-separated line, 25-40 words, describing a recognizable DINOSAUR in an OCEAN context — wading in coastal surf, swimming, breaching the surface, on a sea-cliff with ocean below, fishing in tidal estuary, etc.

⚠️ CRITICAL — RENDER ACTUAL DINOSAURS, NOT MARINE REPTILES. Use ICONIC DINOSAUR FORMS the viewer immediately recognizes as dinosaurs: T-rex, Spinosaurus, sauropods (Brachiosaurus / Diplodocus / Argentinosaurus / Apatosaurus / Mamenchisaurus), hadrosaurs (Parasaurolophus / Edmontosaurus), Triceratops, Stegosaurus, raptors (Velociraptor / Utahraptor / Deinonychus), Allosaurus, Carnotaurus, Therizinosaurus, Ankylosaurus, Pachycephalosaurus.

⚠️ ABSOLUTELY BANNED: NO marine reptiles (NO mosasaurs / NO plesiosaurs / NO ichthyosaurs / NO pliosaurs / NO marine crocodiles / NO marine pterosaurs over ocean). NO sea turtles. NO ammonites as the subject. NO modern marine life. Those are NOT dinosaurs.

⚠️ ARTISTIC LICENSE is OK — even if a sauropod or T-rex wasn't pelagic in real life, render them IN ocean contexts. The goal is "dinosaur in ocean" not paleontological-accuracy.

Variety mandate (rotate widely across DINOSAUR types + ocean-interaction modes — including FULLY UNDERWATER scenes):

ABOVE-SURFACE / WADING (~65% of pool):
- ~15% SPINOSAURUS / BARYONYX / SUCHOMIMUS — semi-aquatic theropod mid-fishing in tidal surf / breaching from the waves / wading chest-deep in salt water with sail above
- ~15% SAUROPOD (Brachiosaurus / Diplodocus / Apatosaurus / Argentinosaurus / Mamenchisaurus) — wading in coastal shallows with long neck extending above the waves / breaching in inland sea with neck arching skyward
- ~10% T-REX / Carnotaurus / Allosaurus / Giganotosaurus — chest-deep in coastal surf scanning the shoreline / mid-stride through ocean shallows / silhouette on sea-cliff with ocean breaking below
- ~10% HADROSAUR (Parasaurolophus / Edmontosaurus / Maiasaura) — wading delta-into-surf / mid-stride along the salt shoreline
- ~5% CERATOPSIAN (Triceratops / Styracosaurus) on coastal beach mid-stride / drinking at sea-edge / silhouette against ocean horizon
- ~5% STEGOSAUR / ANKYLOSAUR on sea-cliff overlook with ocean crashing below / wading shallow surf
- ~5% RAPTOR pod splashing through coastal tidepools / running coastal sand-edge as waves wash up

⚠️ FULLY UNDERWATER DINOSAURS (~35% of pool — artistic license, dinosaurs SWIMMING SUBMERGED below the surface):
- ~10% SPINOSAURUS fully underwater paddling through deep blue water, sail breaking the surface above OR fully submerged, tail propelling, fish scattering around it, light-shafts from above
- ~10% SAUROPOD fully submerged underwater with long neck arching periscope-style above the surface OR fully under with neck extended forward, four legs paddling, light-shafts cutting across its mottled hide
- ~5% HADROSAUR underwater swimming submerged with head pointed forward, webbed-hand strokes, bubble-trail behind, light shafts through deep blue water
- ~5% T-REX or large theropod underwater mid-swim with body fully submerged, head turning, doggy-paddle leg motion, light-shafts from above catching scarred hide
- ~3% RAPTOR pod underwater mid-swim, feathers slicked back, all paddling in formation, deep blue water around
- ~2% Other dinosaur SUBMERGED — pachycephalosaur / therizinosaur / etc. mid-swim through deep water

EVERY entry includes:
- THE DINOSAUR SPECIES (scientifically-named, recognizable iconic dinosaur)
- THE OCEAN-INTERACTION ACTION (wading / swimming / breaching / mid-stride-in-surf / fishing / silhouette on cliff above ocean)
- POSITION (chest-deep in surf / mid-swim with head above water / on coastal sand / on sea-cliff / mid-delta / etc.)
- ONE SPECIFIC DETAIL (water streaming off hide / wake behind / spray rising / waves crashing around legs / silhouette against sunset ocean / etc.)

GOOD examples:
- A massive Spinosaurus mid-fishing in tidal coastal surf, sail rising 10ft above the waves, head submerged to the eyes, fish flashing in the foam, distant ocean horizon behind
- A Brachiosaurus sauropod wading chest-deep in coastal shallow water, 40-foot neck arching above the waves to scan the horizon, water streaming off its massive hide, distant sea-stacks at the horizon
- A T-rex mid-stride through coastal surf at sunset, chest-deep in glowing-gold waves, head turned to scan the shoreline, water sheeting off its scarred hide
- A pair of Parasaurolophus hadrosaurs mid-swim across a Mesozoic inland sea, crests visible above the water, gentle wake spreading behind, distant coastline silhouetted
- A Triceratops mid-stride along a wide Mesozoic beach at low tide, waves washing across its feet, frill catching the golden sunset light, ocean horizon stretching beyond
- Three Velociraptors mid-run along the coastal sand-edge as waves wash up around their feet, feathers rippling, head-feathers raised, all three in tight formation

UNDERWATER (artistic license) examples:
- A massive Spinosaurus fully submerged paddling through deep blue water, sail breaking the surface above into the air, tail undulating, schools of silver fish scattering around it, parallel light-shafts cutting down from the surface 40ft overhead
- A Brachiosaurus sauropod underwater fully submerged with long neck arching periscope-style up through the surface 30ft above, four legs paddling in slow rhythm, mottled hide catching the underwater light-shafts, bubble trails rising
- A Parasaurolophus hadrosaur swimming submerged in deep blue water, crest streamlined, webbed-hand strokes propelling forward, bubble-trail rising from snout, distant light-shafts overhead
- A T-rex underwater mid-swim with body fully submerged but head turned, doggy-paddle leg motion, scarred hide catching the light-shafts from the distant surface above, deep blue void around
- A pod of three Velociraptors underwater mid-swim in synchronized formation, feathers slicked back, all paddling forward, deep blue water enveloping them, light-shafts catching their banks

ABSOLUTELY BANNED:
- NO marine reptiles (NO mosasaurs / plesiosaurs / ichthyosaurs / pliosaurs / marine crocodiles / Metriorhynchus / Dakosaurus)
- NO sea turtles (NO Archelon / NO Protostega)
- NO ammonites as subject
- NO modern marine life (whales / dolphins / orcas / modern sharks)
- NO humans / no boats / no human-trace
- NO close-up portrait
- NO combat-kill-shot / no gore

Output: ONE ocean-dinosaur per line. No numbering. No quotes.`,

  dinobot_ocean_reptiles_surprise: `Generate MARINE ACCENT descriptions for DinoBot's ocean-reptiles path. Each is ONE comma-separated line, 15-25 words, describing a small marine accent — school of fish, ammonite, jellyfish, marine pterosaur, plankton-glow, etc.

The element is SMALL — 2-5% of the frame. Adds life and atmosphere to the ocean scene.

Variety mandate:
- ~20% School of small primordial fish (silver flash, mid-darting, formation)
- ~15% Drifting ammonite (single or pair, spiral shell visible, tentacles trailing)
- ~10% Translucent jellyfish drifting (single or cluster, bioluminescent edge)
- ~10% Marine pterosaur in flight above water (Pteranodon / Nyctosaurus skimming surface)
- ~10% Bubble stream rising from depth (single or cluster, catching light)
- ~10% Sea-lily (crinoid) cluster on rock or floating
- ~5% Belemnite squid mid-jet (primordial squid)
- ~5% Trilobite-relative on bottom (primordial benthic creature)
- ~5% Hammerhead-shape primordial shark silhouette at distance
- ~5% Sunbeam shaft through water (volumetric light-shaft)

EVERY entry includes:
- THE ELEMENT TYPE
- POSITION in the frame (foreground / midground / at depth / surface above / etc.)
- ONE SPECIFIC DETAIL (silver flash / mid-drift / wingtip touching / bioluminescent edge / etc.)

GOOD examples:
- A school of small silver primordial fish at midground darting in unison, formation tight, scales catching the light-shafts
- A single drifting ammonite at midground edge, 2-foot spiral shell pattern visible, tentacles trailing in the current
- A pair of translucent jellyfish drifting at foreground midground, bioluminescent edges glowing pale-aqua
- A Pteranodon marine pterosaur skimming the surface at deep midground above the water-line in silhouette

ABSOLUTELY BANNED:
- NO humans / no boats / no human-trace
- NO modern marine life
- NO weapons / tools / artifacts
- NO duplicate-style entries

Output: ONE marine accent per line. No numbering. No quotes.`,

  dinobot_ocean_reptiles_phenomenon: `Generate ATMOSPHERIC OCEAN PHENOMENON descriptions for DinoBot's ocean-reptiles path (80%-gated). Each is ONE comma-separated line, 20-35 words, describing an atmospheric event in/over the ocean — light-shafts, storm, plankton-bloom, breach-event, etc.

Variety mandate:
- ~25% Sun-shafts from above piercing the water column (specific parallel beams cutting down)
- ~15% Storm-front building over the surface (thunderhead wall / sheet-lightning at deep horizon)
- ~10% Surface breach event (massive splash + spray + ripples)
- ~10% Plankton-bloom bioluminescence (glowing-green or pale-blue tide)
- ~10% Whale-fall-style nutrient-bloom on sea-floor (rare — primordial decomposition)
- ~10% Deep current creating particulate stream (visible water-motion)
- ~5% Volcanic vent / underwater geothermal column (smoker)
- ~5% Mass migration silhouettes (distant herd-of-marine-reptiles at deep horizon)
- ~5% Sunset / dawn-color sky over surface (deep amber / molten-rose / etc.)
- ~5% Underwater rainfall (above-surface rain creating ripple pattern from below)

EVERY entry includes:
- THE PHENOMENON TYPE
- A SPECIFIC visual detail
- POSITION in the frame (above / below / at surface / deep horizon / etc.)

GOOD examples:
- Sun-shafts piercing the water column from above in parallel beams 60ft long, catching every bubble and particulate as they fade into deep blue
- A storm-front building at deep horizon with sheet-lightning illuminating the thunderhead wall, rain-curtain descending on the dark sea below
- A massive surface-breach explosion at midground with spray rising 30ft, concentric ripples spreading, foam streaming off
- A plankton-bloom bioluminescence glowing pale-blue across the dark underwater scene, illuminating the silhouettes of marine reptiles in the distance

ABSOLUTELY BANNED:
- NO modern lightning (sheet-lightning OK)
- NO sci-fi / orbital / cosmic
- NO contrails / no rainbows
- NO human-trace

Output: ONE phenomenon per line. No numbering. No quotes.`,

  dinobot_swamp_river_water_scene: `Generate MESOZOIC SWAMP / RIVER / WATERWAY scene descriptions for DinoBot's swamp-river path. Each is ONE comma-separated line, 30-50 words, describing the WATER-CENTRIC prehistoric setting — the swamp, river, marshland, mud-flat, or aquatic-edge that anchors the scene.

⚠️ WATER IS THE SETTING — every entry features water prominently: tannin-dark rivers, foggy swamps, lily-pad marshes, muddy banks, mangrove-like primordial roots in water, fern-edged riverbanks, mist over the water surface, reflective stillness.

⚠️ STRICT MESOZOIC IDENTITY — NEVER read as modern wetland marsh / Atlantic coastal / English bog / Pacific-Northwest rainforest. Always ancient prehistoric Earth — Mesozoic-coded with mega-flora at the water's edge.

Variety mandate (rotate across water-types):
- ~20% Tannin-dark prehistoric river with mega-flora banks (river-of-history reflective black water + tree-fern-and-cycad packed shores)
- ~15% Foggy swamp at dawn (low ground-fog over still water, gnarled aerial roots, atmospheric haze)
- ~15% Mud-flat / muddy bank at river bend (wide muddy shoreline + footprints implied + mega-flora at the back)
- ~10% Lily-pad marsh (giant prehistoric water-plants + still reflective water + atmospheric depth)
- ~10% Mangrove-like primordial root-tangle (aerial-root tangle rising from black water + golden hazy light)
- ~10% Wide river-bend through Mesozoic jungle (river curving through mega-flora-packed jungle banks + atmospheric haze)
- ~10% Misted lake-edge (calm lake with mist-shrouded distant shore + cycad-fringe + reflective)
- ~5% Shallow inland-sea (warm primordial shallow sea + cycad-palm-fringed shoreline + distant mountains)
- ~5% Rain-soaked swamp (active rain falling on water + mist + dripping mega-flora)

EVERY entry includes:
- THE WATER FEATURE TYPE (tannin-dark river / foggy swamp / mud-flat / lily-marsh / etc.)
- BANK / SHORE FLORA (Mesozoic mega-flora at the edge — tree-ferns, cycads, horsetails, primordial-roots)
- WATER QUALITY (tannin-dark / reflective / muddy / mist-shrouded / lily-covered / etc.)
- ATMOSPHERIC TOUCH (rolling mist / golden god-rays / dripping vines / vapor rising)

GOOD examples:
- A tannin-dark Mesozoic river curving through dense tree-fern banks, surface mirror-still reflecting the canopy, golden god-rays shafting through the mega-flora, atmospheric haze receding into deep distance
- A foggy primordial swamp at dawn, low ground-fog rolling over reflective black water, gnarled aerial roots of mega-conifers rising from the shallows, distant atmospheric haze in warm amber
- A wide muddy river-bend at sunrise, tannin-rich water reflecting the warm sky, cycads packed along both banks 30ft tall, mist rolling along the surface
- A lily-pad marsh with giant prehistoric water-plants 6ft across, still reflective water between, horsetails clustering at the edges, warm afternoon haze

ABSOLUTELY BANNED:
- NO modern wetland / Atlantic-marsh / English-bog / sandy-coast
- NO modern animals / no human-trace
- NO temperate-deciduous trees at water-edge
- NO grass / lawn / golf-course
- NO cold-monochrome / washed-out palette
- NO frozen / icy / arctic

Output: ONE water-scene per line. No numbering. No quotes.`,

  dinobot_swamp_river_dino: `Generate SEMI-AQUATIC DINOSAUR descriptions for DinoBot's swamp-river path. Each is ONE comma-separated line, 25-40 words, describing a dinosaur (or aquatic reptile / pterosaur) interacting with WATER in the prehistoric scene.

The dinosaur is a MEANINGFUL element of the scene — 25-40% of the frame. Photoreal living animal mid-water-behavior. National-Geographic-cinematic candid moment.

Variety mandate (rotate widely across aquatic + dino types):
- ~20% SPINOSAURID fishing (Spinosaurus / Baryonyx / Suchomimus mid-fishing, head submerged or jaw clamped on a silver fish, sail rising)
- ~15% SAUROPOD wading or drinking (Brachiosaurus / Apatosaurus / Argentinosaurus wading mid-river, water at shoulder, neck arched to drink)
- ~15% HADROSAUR drinking (Parasaurolophus / Edmontosaurus / Maiasaura at water's edge, head lowered, water dripping from duck-bill)
- ~10% CROCODILIAN MEGA-PREDATOR (Deinosuchus / Sarcosuchus / Postosuchus floating with only eye-ridges + nostrils above black water, motionless)
- ~10% CERATOPSIAN at watering hole (Triceratops / Styracosaurus / Pachyrhinosaurus drinking at muddy edge, head lowered)
- ~10% MOSASAUR or PLESIOSAUR breaching (long-necked plesiosaur surface mid-rise / mosasaur head breaching with spray)
- ~8% PTEROSAUR skimming (Quetzalcoatlus / Pteranodon skimming water surface with bill open, wingtip touching water)
- ~7% AMPHIBIOUS MEGA-CRAB / GIANT INVERTEBRATE (rare — giant primordial freshwater creature partially emerged)
- ~5% THEROPOD drinking (large theropod cautiously lowering head to water, eyes still scanning)

EVERY entry includes:
- THE DINOSAUR SPECIES (scientifically named)
- THE WATER INTERACTION (fishing / wading / drinking / floating / breaching / skimming / etc.)
- POSITION (mid-river / at the bank / in the shallows / partially submerged / at the water-edge)
- ONE WATER-SPECIFIC DETAIL (water dripping / ripples spreading / fish in jaws / wake behind / spray rising / etc.)
- ATMOSPHERIC INTEGRATION (golden light on hide / mist at its feet / haze in distance)

GOOD examples:
- A massive Spinosaurus mid-fishing in a tannin-dark river, head submerged to the eyes, sail rising 10ft from the water, ripples spreading outward, mist curling around its shoulders
- A Brachiosaurus sauropod wading mid-river with water at shoulder height, long neck arched 40ft to drink, golden afternoon light catching its mottled hide, cycads packed along both banks
- A pair of Parasaurolophus hadrosaurs at the muddy river-edge drinking, water dripping from their duck-bills, dust visible in the wet earth around their feet
- A massive Deinosuchus crocodilian floating motionless in dark water, only nostrils and eye-ridges visible, a single dragonfly landing on its barnacled snout

ABSOLUTELY BANNED:
- NO humans / no human-trace
- NO modern animals
- NO close-up portrait (dino is INTEGRATED into water scene, not a head-fills-frame portrait)
- NO combat / no kill-shot / no gore
- NO weapons / tools / artifacts

Output: ONE aquatic dinosaur per line. No numbering. No quotes.`,

  dinobot_swamp_river_surprise: `Generate TINY SECONDARY SUBJECT descriptions for DinoBot's swamp-river path (60%-gated). Each is ONE comma-separated line, 15-25 words, describing a small water-coded accent — dragonfly, fish-jump, pterosaur skimming, crocodilian eye, water-bird, aquatic plant detail.

The element is SMALL — 2-5% of the frame. Position: midground or foreground edge. Adds life and atmosphere to the water scene.

Variety mandate:
- ~25% Giant Meganeura dragonfly hovering / landing on lily-pad / catching light
- ~15% Single fish-jump or splash mid-air
- ~15% Pterosaur skimming surface at deep midground (silhouette + reflection)
- ~10% Crocodilian-eye-and-nostrils-only above water at midground
- ~10% Distant water-bird-pterosaur (Pteranodon perched on snag / fishing)
- ~10% Aquatic mega-plant detail (giant water-lily / floating fern-mat / aquatic horsetail)
- ~10% Mist-ripple / vapor-curl / water-disturbance at midground edge
- ~5% Tadpole-cluster / school of fish visible through clear water

EVERY entry includes:
- THE ELEMENT TYPE (dragonfly / fish-jump / pterosaur-skim / etc.)
- POSITION (foreground edge / midground / mid-air / on a lily-pad / etc.)
- ONE SPECIFIC DETAIL (wings catching light / silver flash / silhouetted / mid-bite / etc.)

GOOD examples:
- A giant Meganeura dragonfly hovering above a lily-pad at foreground midground, iridescent wings catching the golden god-ray
- A silver fish caught mid-jump at midground, water-droplets frozen in the air around its arc, single concentric ripple below
- A pterosaur skimming the water surface at deep midground in profile silhouette, bill open, wingtip just touching the surface
- A crocodilian eye-and-nostrils-only above the black water at midground edge, single dragonfly perched on the snout

ABSOLUTELY BANNED:
- NO humans / no human-trace
- NO modern animals
- NO weapons / tools
- NO duplicate-style entries

Output: ONE surprise element per line. No numbering. No quotes.`,

  dinobot_swamp_river_phenomenon: `Generate ATMOSPHERIC PHENOMENON descriptions for DinoBot's swamp-river path (80%-gated). Each is ONE comma-separated line, 20-35 words, describing an atmospheric event over the water scene — fog, mist, rain, god-rays, golden light, storm.

Variety mandate:
- ~25% Low ground-fog rolling along the water (knee-height mist, hiding lower banks)
- ~20% Golden god-rays through the canopy (specific shafts hitting the water)
- ~15% Mist banks at deep distance (atmospheric haze receding)
- ~10% Active rain falling on water (rain-rings on the surface, dripping mega-flora)
- ~10% Vapor rising from warm water in cool morning air (steam-vapor curls)
- ~10% Storm-front building at deep distance (thunderhead wall + sheet-lightning + rain-curtain)
- ~5% Distant volcanic activity (smoke plume on the horizon)
- ~5% Aurora / atmospheric-glow over swamp (rare strange Mesozoic sky-glow)

EVERY entry includes:
- THE PHENOMENON TYPE
- A SPECIFIC visual detail
- POSITION (rolling across the water / above the canopy / at deep distance / etc.)

GOOD examples:
- Low ground-fog rolling along the water surface at knee-height, hiding the lower banks, only the upper mega-flora visible above
- Golden god-rays slanting through the tree-fern canopy in three parallel shafts hitting the river surface, illuminating drifting pollen
- Active rain falling steadily on the water, concentric rain-rings spreading across the surface, mega-flora dripping at the edges
- Steam-vapor curling from the warm tannin-dark water in cool morning air, ribbons rising 6ft, atmospheric haze beyond

ABSOLUTELY BANNED:
- NO modern lightning bolts (sheet-lightning OK)
- NO sci-fi / cosmic / aliens
- NO contrails / no rainbows
- NO human-trace

Output: ONE phenomenon per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_biome: `Generate ALIEN-MESOZOIC BIOME descriptions for DinoBot's paleo-landscape path. Each is ONE comma-separated line, 30-50 words, describing the OVERALL biome/landscape — the ancient prehistoric Earth setting that anchors the scene.

⚠️ STRICT IDENTITY LOCK — every entry must read as UNMISTAKABLY ALIEN-MESOZOIC. NEVER read as modern Earth. NEVER read as Iceland / Pacific-Northwest / Atlantic-coastal-marsh / modern Alpine / English wetland. ALWAYS ancient-world primordial Mesozoic Earth — Pandora-Skull-Island-Land-of-the-Lost coded.

⚠️ Each biome commits to ONE of these signature paleo-environments + a SIGNATURE MEGA-FLORA element that ANCHORS its Mesozoic identity:
- ~15% MESOZOIC CYCAD-PALM VALLEY ON RUST-VOLCANIC PLAIN — red-earth volcanic plain with primordial palm-like cycads scattered across, distant peaks, atmospheric haze
- ~15% PRIMORDIAL JUNGLE WITH MEGA-FLORA — dense Mesozoic jungle saturated with tree-ferns + hanging vine-cathedrals + Araucaria cathedral pillars
- ~12% KARST-TOWER MESOZOIC VISTA — Zhangjiajie-style rock pillars with golden-bronze cliff-clinging mega-flora, misted depth
- ~12% MUSHROOM-TREE GROVE BIOME — fan-cap mega-fungi groves with fern-floor, atmospheric haze, golden god-rays
- ~10% ICONIC MEGA-TREE OUTLOOK — single ancient tree on a rocky outlook, distant Mesozoic mountains
- ~10% TANNIN-DARK MESOZOIC RIVER — primordial river through tree-fern-and-cycad-packed banks, atmospheric haze
- ~8% VOLCANIC PALEO-PLAIN — black-basalt plain with cycad-clusters, distant volcano with smoke plume
- ~8% MEGA-CONIFER CATHEDRAL FOREST — ancient Araucaria 200ft tall, fern-floor, god-rays
- ~5% PRIMORDIAL SHORELINE — Mesozoic inland-sea coast with cycad-palm fringe and primordial-coded geography
- ~5% MISTED PALEO-CANYON — deep canyon with mega-flora clinging to cliff walls, golden afternoon haze

⚠️ HARD BANS — these are signature failure modes:
- NO Iceland-style snowy-rocky-grey-monochrome canyons
- NO modern coastal marsh / Atlantic wetland / sandy-beach-with-cumulus-only
- NO temperate-deciduous English oak / maple / beech forest
- NO Pacific-Northwest rainforest / Olympic rainforest aesthetic
- NO modern alpine / Swiss-Alps / Rocky-Mountain aesthetic
- NO grasslands / lawn / savanna (Cretaceous predates grasslands)
- NO modern coniferous forest (pine / spruce / fir)
- NO human-trace / no roads / no fences / no buildings
- NO modern animals

EVERY entry includes:
- THE PALEO-BIOME TYPE specifically named (alien-Mesozoic-coded — palm-cycad valley / mushroom-tree grove / karst-tower vista / etc.)
- A SIGNATURE MEGA-FLORA element anchoring the Mesozoic identity
- WARM EARTH-TONE PALETTE cue (rust-red / golden-bronze / amber / autumn-ochre / emerald-undergrowth)
- ATMOSPHERIC depth (misted distance / golden haze / blue-violet receding)
- MULTI-TIER DEPTH (foreground tactile / midground biome body / deep distance / sky)

GOOD examples:
- A primordial rust-red volcanic plain scattered with primordial palm-cycads 30ft tall, basalt boulders strewn across the ochre earth, distant Mesozoic peaks rising through golden afternoon haze, small water-cuts threading through the red soil toward a distant lake
- A dense Mesozoic jungle saturated with 80ft tree-ferns and hanging vine-cathedrals draping from Araucaria mega-conifers above, fern-floor undergrowth in deep emerald, atmospheric haze receding into golden depth
- A Zhangjiajie-style karst-tower vista rising from a misted Mesozoic valley, golden-bronze foliage clinging to every vertical cliff-face, atmospheric depth compressing into deep blue-violet haze between columns

Output: ONE biome per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_megaflora: `Generate PRIMORDIAL MEGAFLORA descriptions for DinoBot's paleo-landscape path. Each is ONE comma-separated line, 30-50 words, describing the IMPOSSIBLY HUGE prehistoric plant-life that defines a Mesozoic / Jurassic / Cretaceous landscape — mega-trees, giant ferns, cycads, primordial conifers, ancient horsetails, mushroom-tree groves, gnarled iconic mega-trees, karst-tower cliff-trees.

This is the FLORA that makes a paleo-landscape feel ALIEN and AWE-INSPIRING. Mushroom-tree groves with fan-cap mega-fungi. Iconic single mega-trees. Karst-tower mountains with golden cliff-foliage. Cycad-palm groves on rust-volcanic plains. Mega-conifer cathedrals with sun-shafts.

⚠️ PALETTE LOCK — every entry skews WARM EARTH-TONES — autumn-gold / bronze / rust-red / amber / ochre / emerald-undergrowth / blue-haze at distance. Rich saturated warm tones. NEVER cold-monochrome, NEVER washed-out.

⚠️ VARIETY MANDATE — equal weight across all 8 signature formations. NEVER let one dominate. The path's identity is the FULL VARIETY across these formations, not any single one:
- ~13% MUSHROOM-TREE GROVES — fan-cap mega-fungi 80ft tall in golden-bronze, fern-floor, atmospheric haze
- ~13% ICONIC SINGLE MEGA-TREE — a single impossibly-large gnarled ancient tree dominating a rocky outlook, distant mountains
- ~13% CYCAD-PALM GROVES ON RUST-VOLCANIC PLAINS — primordial palm-like cycads scattered across red-earth volcanic plain, distant peaks
- ~13% KARST-TOWER MOUNTAINS with CLIFF-CLINGING TREES — towering Zhangjiajie-style rock pillars with golden-bronze foliage on cliff-faces, misted depth
- ~13% MEGA-CONIFER CATHEDRAL — ancient Araucaria 200ft tall, scale-bark trunks, golden god-rays through canopy
- ~12% HANGING VINE-CATHEDRALS — impossible vine-curtains from invisible canopy, draping mega-corridors
- ~12% TREE-FERN GROVES — 80ft tree-ferns with bronze-frilled fronds, cathedral-pillar horsetails between
- ~11% GINKGO GROVES — golden-fan-leaved giant ginkgos in autumn-bronze, scattered like deciduous mega-trees

EVERY entry includes:
- THE SIGNATURE FORMATION TYPE (mushroom-tree / single mega-tree / karst-cliff / cycad-palm / Araucaria-cathedral / vine-cathedral / etc.)
- IMPOSSIBLE SCALE cue (80ft mushroom-cap / cathedral-pillar / 200ft tall / impossible heights / iconic single landmark)
- WARM EARTH-TONE COLOR (autumn-gold / bronze / rust-red / amber / ochre — specific named hue)
- ATMOSPHERIC TOUCH (golden god-rays / misted depth / fern-floor / atmospheric haze)
- COMPOSITIONAL CUE (multi-tier canopy stacking / receding into mist / dominating the skyline / scattered across the plain)

GOOD examples:
- A grove of fan-cap mushroom-trees 80ft tall stacking up like a multi-tier roof in golden-bronze, fern-floor undergrowth in deep emerald, golden god-rays shafting through the gaps, atmospheric haze in the distance
- A single impossibly-large gnarled ancient mega-tree dominating a rocky outlook with hanging golden-bronze foliage, twisted root-system splayed across the rocks, distant Mesozoic mountains in misted haze
- Towering Zhangjiajie-style karst-pillars rising from a misted valley, golden-bronze foliage clinging to every vertical cliff-face in scattered cliff-trees, atmospheric depth into deep blue haze
- A scattered cycad-palm grove on a rust-red volcanic plain, primordial palm-like crowns 30ft tall, distant peaks rising through golden afternoon haze, small water-cuts running through red earth
- An ancient Araucaria mega-conifer cathedral 200ft tall, scale-bark trunks rising into shadow, golden god-rays shafting through the upper canopy down to the fern-floor

ABSOLUTELY BANNED:
- NO Iceland-style snowy alpine canyons (cold-rocky-grey-monochrome)
- NO English-oak deciduous wetland marsh
- NO modern grass / lawn / savanna (Cretaceous predates grasslands)
- NO modern-coniferous-forest (pine / spruce / fir)
- NO bonsai-scale (always MEGA)
- NO animal life in the flora description (this is the plant slot only)
- NO cold-monochrome / washed-out palette

Output: ONE megaflora entry per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_phenomenon: `Generate ATMOSPHERIC / GEOLOGIC PHENOMENON descriptions for DinoBot's paleo-landscape path (80%-gated). Each is ONE comma-separated line, 20-35 words, describing a dramatic atmospheric or geologic event that elevates the prehistoric landscape — volcanic activity, weather drama, light phenomena, dust events, mist banks, etc.

Variety mandate:
- ~15% Distant volcanic activity (smoke plume / ash column / lava-glow at horizon / pyroclastic curl on distant slope)
- ~15% Storm-front drama (thunderhead wall / sheet-lightning / rain-curtain / squall-line at horizon)
- ~10% Golden god-rays through canopy / cloud (specific light shafts cutting through atmosphere)
- ~10% Mist banks / fog rolling (low ground-fog / river-mist / canopy-mist)
- ~10% Distant comet / fireball / atmospheric event (Cretaceous-doom-coded — use sparingly)
- ~10% Massive flock-event in sky (pterosaur flock streaming across distance / cloud of insects)
- ~10% Dust-event (herd-stirred dust on plain / wind-blown sediment / volcanic ash drift)
- ~10% Aurora / atmospheric-glow event (rare strange Cretaceous sky-glow)
- ~10% Sunset / sunrise epic-color (specific named gradient — molten-rose-and-amethyst / blood-orange-into-violet)

EVERY entry includes:
- THE PHENOMENON TYPE (volcanic / storm / god-ray / mist / etc.)
- A SPECIFIC visual detail (smoke column / lightning fork / shaft of light / fog-curl / etc.)
- POSITION in the frame (at distant horizon / above the canopy / rolling along the river / draping the valley / etc.)

GOOD examples:
- Distant volcanic activity at the deep horizon — single ash plume rising 30,000 feet, lava-glow at the volcano's base lighting the underside of the column
- Storm-front wall at deep midground — towering thunderhead stretching from horizon to zenith, sheet-lightning illuminating its underbelly, rain-curtain descending below
- Golden god-rays slanting through the tree-fern canopy in three parallel shafts, illuminating drifting pollen and insect-haze, the canopy above silhouetted dark
- Massive pterosaur flock streaming across the deep distance in a long ribbon, hundreds of small dark V-shapes against the violet-rose sunset sky
- Low river-mist rolling along the valley floor at hip-height, only the tops of the cycads visible above the cloud, golden morning-light catching the upper canopy

ABSOLUTELY BANNED:
- NO modern weather-event imagery (no rainbows / no contrails)
- NO humans / human-trace
- NO modern animals
- NO sci-fi / cosmic / nebulae (this is Earth, not space — comet/fireball is exception, atmospheric only)
- NO cheap horror imagery

Output: ONE phenomenon per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_surprise_element: `Generate CANDID DINOSAUR descriptions for DinoBot's paleo-landscape path. Each is ONE comma-separated line, 25-40 words, describing a dinosaur (or pterosaur / aquatic-reptile) IN the prehistoric landscape doing CANDID natural behavior — grazing, drinking, walking, resting, mid-movement, surveying. NOT posing, NOT action-set-piece, NOT close-up portrait.

The dinosaur is a MEANINGFUL element of the scene at MEDIUM scale — 15-30% of the frame. Position: midground, integrated INTO the landscape, with mega-flora around it. Photoreal living animal in its natural prehistoric world. National-Geographic-cinematic candid moment.

Variety mandate (rotate widely across dinosaur types):
- ~20% Sauropod (long-necked giant — Brachiosaurus / Apatosaurus / Argentinosaurus / Diplodocus) feeding from canopy / walking through grove / drinking from river
- ~15% Hadrosaur (Parasaurolophus / Edmontosaurus / Maiasaura) grazing mega-flora / drinking / mid-stride
- ~10% Ceratopsian (Triceratops / Styracosaurus / Pachyrhinosaurus) at watering hole / mid-walk / surveying
- ~10% Theropod (Tyrannosaurus / Allosaurus / Giganotosaurus) walking / surveying / mid-stride — never combat-action
- ~10% Stegosaur / ankylosaur (Stegosaurus / Ankylosaurus / Euoplocephalus) grazing / walking / mid-tail-sway
- ~10% Pterosaur (Quetzalcoatlus / Pteranodon) perched on cliff-edge / mid-takeoff / gliding across midground
- ~10% Aquatic reptile (Mosasaurus / Plesiosaur / Liopleurodon) surfacing in distant lake / wading at shoreline
- ~5% Small theropod (Velociraptor / Compsognathus / Oviraptor) in midground undergrowth — looking up / pausing mid-step
- ~5% Juvenile dinosaur (smaller version of any species) — sense of family / pack life

EVERY entry includes:
- THE DINOSAUR SPECIES (scientifically named or genus-coded)
- THE CANDID ACTION (grazing / drinking / walking / mid-stride / surveying / resting / drinking from river / etc.)
- POSITION IN FRAME (midground left / midground right / partly framed by mega-flora / at the watering hole / etc.)
- ONE ATMOSPHERIC DETAIL (catching the golden light / silhouetted in haze / dust rising at its feet / etc.)
- INTEGRATION with the LANDSCAPE — the dino is IN the world, not standing in front of it

GOOD examples:
- A massive Brachiosaurus sauropod in the midground feeding from the upper canopy, long neck arched 40 feet into a tree-fern crown, golden afternoon light catching its hide, smaller cycads packed around its legs
- A pair of Parasaurolophus hadrosaurs at midground drinking from a tannin-dark river-bend, dust rising at their feet, atmospheric haze in the distance, mega-flora packed across the background
- A lone Triceratops at midground left mid-stride through a clearing in the cycad-palm grove, head down sniffing the ground, golden god-rays catching its frill, rust-volcanic plain stretching to distant peaks
- A Tyrannosaurus rex at midground walking past a fallen mega-log, head turned to scan the canopy, dust rising at its tail, deep-violet haze receding behind
- A Quetzalcoatlus pterosaur perched on a karst-tower cliff-edge at midground, 30-foot wings folded, looking out across the misted valley

ABSOLUTELY BANNED:
- NO humans / human-trace
- NO modern animals
- NO portrait close-up framing (dino is INTEGRATED into landscape, not a portrait)
- NO action-combat-set-piece (always candid natural behavior)
- NO weapons / tools / artifacts
- NO duplicate-style entries (every entry different species + different action)

Output: ONE candid dinosaur per line. No numbering. No quotes.`,

  dinobot_paleo_landscape_sky: `Generate MESOZOIC SKY descriptions for DinoBot's paleo-landscape path. Each is ONE comma-separated line, 15-30 words, describing the sky above the prehistoric landscape — saturated, theatrical, atmospheric.

The sky is THE atmospheric anchor — always SATURATED + DRAMATIC. Mesozoic skies were richly colored (higher CO2 atmosphere) — emerald-tinted dusks, blood-orange sunsets, violet-rose dawns, copper twilight.

Variety mandate:
- ~20% Golden / amber late-afternoon sky (warm directional light)
- ~15% Violet-rose sunset/sunrise (twilight bleeds)
- ~15% Storm-bruised purple sky (thunderhead drama)
- ~10% Eclipse / dim-sun / unusual-light event
- ~10% Pre-dawn aqua / silver morning
- ~10% Mesozoic-emerald-tinted high atmosphere
- ~10% Pale blue with monsoon cloud-architecture
- ~10% Copper-sunset with pyroclastic / ash drift

EVERY entry includes:
- THE SKY COLOR PALETTE (specific named hues — molten-rose-and-amethyst / blood-orange-into-violet / etc.)
- ONE CLOUD ARCHITECTURE detail (cumulus / mammatus / cirrus / thunderhead / streaks)
- ONE ATMOSPHERIC DETAIL (haze / clarity / pollen-mist / smoke-veil)

GOOD examples:
- Golden afternoon sky bleeding to copper-amber at horizon, towering cumulus cloud-castles catching the warm directional light, mid-altitude haze softening the deep distance
- Violet-rose dusk bleeding to deep-indigo zenith, single bright morning-star visible at horizon, scattered cirrus catching the fading light
- Storm-bruised violet sky with mammatus pouches at high altitude, sheet-lightning illuminating the underbelly, rain-curtain descending at deep distance
- Mesozoic-emerald-tinted high atmosphere bleeding to copper at horizon, cumulus thunderheads piled vertically, soft pollen-haze in the mid-atmosphere

ABSOLUTELY BANNED:
- NO modern-blue clear-sky / no contrails
- NO sci-fi / nebulas / orbital
- NO red-fog / blood-rain dominant
- NO cheerful-summer-blue

Output: ONE sky per line. No numbering. No quotes.`,
};

const RECIPE = RECIPES[POOL];
if (!RECIPE) {
  console.error('Unknown pool:', POOL);
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function signatureOf(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 4)
    .slice(0, 4)
    .join('|');
}

async function generateBatch(n) {
  const resp = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 4000,
    messages: [{ role: 'user', content: `${RECIPE}\n\nGenerate ${n} entries now.` }],
  });
  return resp.content[0].text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 15 && !/^[\d#\-\*]/.test(l.slice(0, 2)));
}

(async () => {
  if (TARGET) {
    let existing = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : [];
    const sigs = new Set(existing.map(signatureOf));
    console.log(`[${POOL}] appending: existing ${existing.length} — target ${TARGET}`);
    while (existing.length < TARGET) {
      const need = Math.min(BATCH, TARGET - existing.length);
      const batch = await generateBatch(Math.ceil(need * 1.3));
      const fresh = batch.filter((b) => !sigs.has(signatureOf(b)));
      for (const f of fresh) {
        if (existing.length >= TARGET) break;
        existing.push(f);
        sigs.add(signatureOf(f));
      }
      fs.writeFileSync(OUT, JSON.stringify(existing, null, 2));
      console.log(`  ${existing.length}/${TARGET}`);
    }
    return;
  }
  const batch = await generateBatch(COUNT);
  const sigs = new Set();
  const deduped = batch.filter((b) => {
    const sig = signatureOf(b);
    if (sigs.has(sig)) return false;
    sigs.add(sig);
    return true;
  });
  fs.writeFileSync(OUT, JSON.stringify(deduped, null, 2));
  console.log(`[${POOL}] wrote ${deduped.length} entries`);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
