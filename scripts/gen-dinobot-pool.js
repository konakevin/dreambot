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

  dinobot_extinction_event_surprise_element: `Generate SMALL APOCALYPTIC-ACCENT descriptions for DinoBot's extinction-event path. Each is ONE comma-separated line, 15-30 words, describing a small atmospheric accent in or around the K-Pg extinction moment — ember-fall / ash-flake / glowing-impact-particulate / startled pterosaur / distant secondary impact glow / etc.

The element is SMALL — 2-5% of the frame. Position: foreground edge / midground / horizon background. Adds apocalyptic atmosphere.

Variety mandate (rotate widely):
- ~20% Ember / glowing-pumice particulate falling from the sky in slow arcs
- ~15% Ash-flake drifting / settling on the dinosaur's hide or foreground rock
- ~10% Distant impact-flash secondary on the deep horizon (multi-strike Chicxulub event)
- ~10% Startled pterosaur silhouette fleeing low through the ash-darkened sky
- ~10% Foreground rock cracked / split / scorched by impact thermal wave
- ~10% Smoke-pillar / firestorm-column on the deep horizon
- ~5% Auroral disturbance / atmospheric-energy ripple in the upper sky
- ~5% Falling glowing tektite / impact-ejecta arcing through the sky
- ~5% Ash-dimmed blood-red sun-disk at the horizon
- ~10% Atmospheric crepuscular ash-rays cutting through the dimming sky

EVERY entry includes:
- THE ACCENT TYPE
- POSITION (foreground edge / midground / deep horizon / upper sky)
- ONE SPECIFIC DETAIL (mid-action / catching light / atmospheric / scale-prover)

GOOD examples:
- A drift of glowing-pumice embers falling in slow arcs at midground, each catching the impact-glow
- A startled pterosaur silhouette fleeing low through the ash-darkened sky, distant midground
- An ash-dimmed blood-red sun-disk at the deep horizon, atmospheric particulate veil layered before it
- A smoke-pillar firestorm on the deep horizon, orange-red glow against the darkening sky
- A falling glowing tektite arcing through the upper sky, blue-white tail trailing

ABSOLUTELY BANNED:
- NO humans / no human-trace / no aircraft
- NO modern wildfire imagery (modern trees burning / modern animals fleeing)
- NO gore / no burning-alive-dinosaur / no charred-flesh
- NO duplicate-style entries

Output: ONE apocalyptic-accent per line. No numbering. No quotes.`,

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

  // COLD sibling of dinobot_paleo_landscape_megaflora, for the snowline-forest path.
  // The warm pool's own PALETTE LOCK ("NEVER cold-monochrome") and its 8 formations are
  // all lush jungle, so a snowline path consuming it rendered frosty tree-fern lagoons
  // instead of a high conifer forest. See the archetype block at the bottom of
  // scripts/bots/dinobot/archetype-templates.js for the matching template fix.
  dinobot_snowline_forest_flora: `Generate HIGH-ALTITUDE COLD-FOREST MEGAFLORA descriptions for DinoBot's snowline-forest path. Each is ONE comma-separated line, 30-50 words, describing the huge prehistoric plant-life of a Mesozoic forest AT THE SNOWLINE — where the trees thin out, the snow begins, and the air is thin and cold.

This is the FLORA that makes a COLD ancient landscape feel vast and severe and beautiful. Wind-flagged conifers. Snow-loaded boughs. Krummholz twisted flat by wind. Bare rock and ice above the tree-line. The awe here is SCALE plus HARSHNESS, not lushness.

⚠️ PALETTE LOCK — every entry is COLD: snow-white, glacial cyan, cobalt and slate-blue shadow, near-black wet trunks, dark blue-green needles, pale low-angle winter sun on the lit faces. Committed and saturated, never washed-out and never grey-monochrome — shadow blues go DEEP and lit snow reads BRIGHT. NEVER warm golden-bronze, NEVER amber, NEVER autumn-gold: that is the warm paleo-landscape pool's job, not this one.

⚠️ ONE WARM ACCENT IS ALLOWED AND WANTED — a single small warm note against all that cold is the proven anti-monochrome lever (measured 15 of 15 renders on the nightly cold work): rust-orange scrub, a copper-needled dying conifer, ochre lichen on rock, low amber sun on one ridge. ONE per entry, small, never the dominant tone.

⚠️ NO TROPICAL FLORA — no cycads, no palms, no tree-ferns, no vine-curtains, no fan-cap mushroom-trees, no ginkgo groves. Those belong to the warm pool. This world is conifers, needles, moss, lichen, bare rock, snow and ice.

⚠️ VARIETY MANDATE — equal weight across these formations. NEVER let one dominate:
- ~15% WIND-FLAGGED CONIFER STANDS — ancient conifers with all branches swept to one side by prevailing wind, trunks leaning, snow packed on the lee
- ~15% SNOW-LOADED MEGA-CONIFER CATHEDRAL — 200ft Araucaria and podocarps with boughs bent under deep snow, dark trunks, blue shadow between
- ~13% KRUMMHOLZ AT THE TREE-LINE — ancient trees dwarfed and twisted flat across rock by wind and ice, centuries old and knee-high, snow drifted through them
- ~13% THE TREE-LINE ITSELF — the forest visibly ENDING partway up a slope, bare rock and snowfield above, scattered survivors standing alone beyond it
- ~12% FROST-RIMED GIANTS — huge conifers with every needle and cone furred in hoarfrost, catching low sun, breath-fog cold
- ~12% AVALANCHE SCARS AND DEADFALL — a swathe cut through the forest, snapped trunks silvered and bare, new growth coming up through the snow in the gap
- ~10% MOSS AND LICHEN ROCK GARDENS — house-sized boulders under the canopy, furred in frozen moss and pale lichen, meltwater ice glazing their faces
- ~10% CLOUD-LAYER FORESTS — the forest rising into and out of a cloud deck, tops emerging above a sea of cloud, everything below dissolved in cold white

Each entry names CONCRETE physical things — a trunk, a bough, a drift, a scar, a boulder, a needle-cone, an ice glaze — never just atmosphere adjectives. Ground the scale against something countable.

Output: ONE flora entry per line. No numbering. No quotes.`,

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

  // ══════════════════════════════════════════════════════════════════════════
  // dino-nights (Stage D1, SHADOW) — the nocturnal Mesozoic. Moonlit watering
  // holes, hunts by starlight, pre-dawn mist, Milky Way over sauropod silhouettes.
  // First NIGHT register on DinoBot. LAND STAYS VISIBLY LIT (moonlight REVEALS,
  // never black-silhouette minimalism); eyes catch light naturally NEVER glow;
  // real night sky/light only. night_light REPLACES the universal lighting slot.
  // ══════════════════════════════════════════════════════════════════════════
  dinobot_dino_nights_night_scene: `Generate NOCTURNAL MESOZOIC SCENE descriptions for DinoBot's dino-nights path — the HERO. Each is ONE comma-separated line, 25-45 words: a specific dinosaur (or two) + a nocturnal behavior + a night setting. Photoreal living animals at night, the moonlit/starlit Mesozoic 66+ million years before humans.

Variety mandate — spread WIDELY across species body-plans AND nocturnal behaviors:
- ~18% Sauropod (Brachiosaurus / Diplodocus / Argentinosaurus / Mamenchisaurus) — drinking / moving slowly / silhouetted necks against the night sky at a moonlit water's edge
- ~16% Theropod predator (Tyrannosaurus / Allosaurus / Giganotosaurus / Ceratosaurus) — stalking / patrolling / lapping water, low and quiet in the dark
- ~14% Small feathered coelurosaur / troodontid / raptor pack (Velociraptor / Troodon / Deinonychus) — hunting by starlight, big night-adapted eyes catching the moon
- ~12% Ceratopsian (Triceratops / Styracosaurus / Centrosaurus) — an adult and a juvenile settling / drinking / alert at a night waterhole
- ~10% Hadrosaur (a duck-billed hadrosaur like Parasaurolophus — broad flat toothless beak) — a nocturnal gathering wading a moonlit shallows
- ~10% Stegosaur / ankylosaur (Stegosaurus / Ankylosaurus) — plated/armored back rimlit by the moon, resting or moving through mist
- ~8% Pterosaur (Pteranodon / Quetzalcoatlus) roosting on a night crag or gliding across the star-field, one wing catching moonlight
- ~7% Marine reptile at a moonlit coast (Mosasaurus / Elasmosaurus) breaching / surfacing in phosphor-free real starlight
- ~5% Two species sharing a night waterhole at wary distance (a peaceful truce beat)

EVERY entry: SPECIES (body-plan clear) + NOCTURNAL BEHAVIOR (verb, mid-action, candid) + NIGHT SETTING. The animal is REVEALED by moonlight/starlight, not a pure black silhouette. Eyes may catch the moon naturally.

GOOD examples:
- A colossal Brachiosaurus lowering its long neck to drink at a moonlit lake, the still water mirroring the Milky Way, its wet hide sheened silver by the full moon
- A lone Tyrannosaurus rex moving low through a misty fern-plain under a gibbous moon, breath fogging, its eye catching a cold pinpoint of moonlight
- A pack of feathered Troodon hunting across a starlit floodplain, their large night-adapted eyes reflecting the moon, feathers rimlit silver
- An adult Triceratops and its juvenile drinking at a moonlit waterhole, frills edge-lit by the low moon, ferns silvered around them
- A Stegosaurus moving through waist-high pre-dawn mist, its back plates catching the first cold blue light, the plain still dark below

ABSOLUTELY BANNED:
- NO humans / no human-trace / no fire / no torches / no tents / no fences / no tools
- NO modern animals; NO cattle / mammal words (herd/bull/cow/calf/grazing/savanna) — use gathering / adult / juvenile / feeding / fern-plain / floodplain
- NO glowing-fantasy eyes / no bioluminescence / no magic light — eyes only CATCH real moonlight
- NO pure-black-silhouette-only scene (the moon must REVEAL the animal + land); cinematic-silhouette owns silhouettes
- NO gore / no kill-shot / no combat-carnage
- NO modern-city night / no artificial light of any kind
- NO duplicate-style entries

Output: ONE nocturnal scene per line. No numbering. No quotes.`,

  dinobot_dino_nights_night_light: `Generate NIGHT LIGHT-SOURCE descriptions for DinoBot's dino-nights path — the MONEY-SHOT axis (this REPLACES the daytime lighting slot; it defines the ONLY light in the frame). Each is ONE comma-separated line, 12-24 words: a real, physically-plausible nocturnal light source + how it falls on the scene. REAL light only.

Variety mandate — rotate widely across real night light:
- ~22% Full-moon flood — bright cold silver light REVEALING the whole landscape, crisp moon-shadows
- ~16% Gibbous / half-moon raking low — long soft moon-shadows, the plain half-lit
- ~14% Milky Way + dense starfield as the main light — faint silver star-glow on hide and water, land dimly readable
- ~12% Pre-dawn blue hour — the eastern sky paling cold blue, the land emerging from dark, no sun yet
- ~10% Moonrise / moonset low on the horizon — a huge low moon, warm-amber near the horizon, long light
- ~8% Thin crescent + bright stars — mostly starlight, a sliver moon, delicate low light
- ~7% Moonlight through thin cloud — soft diffused silver, gentle contrast, haloed moon
- ~6% Late-dusk afterglow — the last deep-indigo light in the west, first stars out, land still faintly lit
- ~5% Bright moon reflected off water / wet ground as a second soft light source

EVERY entry: THE LIGHT SOURCE + its QUALITY (cold/warm, soft/crisp) + that it REVEALS the land (never total darkness). Real astronomy only.

GOOD examples:
- Bright full-moon flood, cold silver light revealing the whole fern-plain in crisp detail, sharp moon-shadows
- The Milky Way arching bright overhead, faint silver star-glow catching wet hide and still water, the land dimly readable
- Pre-dawn blue hour, the eastern sky paling to cold cobalt, the plain emerging softly from the dark
- A huge low moon at moonrise, warm amber near the horizon casting long light across the shallows
- A thin crescent moon among brilliant stars, delicate low starlight silvering the mist

ABSOLUTELY BANNED:
- NO artificial light (no fire / torches / lamps / cities / lightning as the main light)
- NO bioluminescence / no glowing plants / no magic light / no aurora (aurora is polar-dinos' axis)
- NO daylight / no sun / no bright-blue-sky
- NO pure blackness — the light must REVEAL the scene
- NO duplicate-style entries

Output: ONE night light-source per line. No numbering. No quotes.`,

  dinobot_dino_nights_night_biome: `Generate NIGHT BIOME / SETTING descriptions for DinoBot's dino-nights path. Each is ONE comma-separated line, 18-32 words: a Mesozoic landscape SETTING at night (no animals — the setting only). The land is REVEALED by moon/starlight, never pure black.

Variety mandate — rotate widely across Mesozoic biomes, all night-coded:
- ~18% Moonlit watering hole / lake edge — still water mirroring the sky, silvered reeds and horsetails
- ~14% Misty fern-plain at night — low ground-fog under the moon, cycads and tree-ferns as dark shapes
- ~12% Pre-dawn floodplain — braided channels catching the paling sky, silt-flats emerging from dark
- ~12% Conifer / araucaria forest edge under the moon — tall silhouetted trunks, moon-shafts through the canopy
- ~10% Moonlit coastline / tidal flat — wet sand reflecting the moon, distant surf, sea-cliffs
- ~10% Volcanic plain at night — dark basalt, a distant volcano's faint glow on the horizon (not erupting-dramatic)
- ~8% Cretaceous river delta at night — wide dark water, cycad-palms, a low mist
- ~8% Highland ridge / crag under the stars — bare rock rimlit by the moon, the Milky Way above
- ~8% Redwood / cycad grove clearing — moonlight pooling in a forest opening, fireflies-free, dew silvered

EVERY entry: THE SETTING + night atmosphere + how moon/starlight REVEALS it. Cretaceous predates grasses — NO grasslands/savanna/lawns.

GOOD examples:
- A wide moonlit watering hole, the still black water mirroring the Milky Way, silvered horsetails and reeds fringing the silent shore
- A misty fern-plain under a full moon, low ground-fog glowing softly, dark cycads and tree-ferns rising from the silver haze
- A pre-dawn floodplain of braided channels catching the paling cobalt sky, silt-flats emerging from the retreating dark
- A towering araucaria forest edge under the moon, moon-shafts falling between silhouetted trunks onto the fern floor
- A moonlit tidal flat, wet sand mirroring the low moon, distant surf pale against dark sea-cliffs

ABSOLUTELY BANNED:
- NO humans / no structures / no artificial light / no roads / no fences
- NO grasslands / savanna / lawns / meadows-of-grass (Cretaceous predates grasses) — use fern-plain / floodplain / cycad-plain
- NO modern-analog flora (no acacia / baobab / oak-lawns) — use araucaria / cycad / tree-fern / horsetail / ginkgo
- NO glowing plants / bioluminescence / aurora
- NO pure blackness — moon/starlight must reveal the land
- NO duplicate-style entries

Output: ONE night setting per line. No numbering. No quotes.`,

  dinobot_dino_nights_surprise_element: `Generate SMALL NIGHT-ACCENT descriptions for DinoBot's dino-nights path. Each is ONE comma-separated line, 15-30 words: a small secondary nocturnal accent adding depth. The element is SMALL (2-5% of frame), midground or foreground edge.

Variety mandate — rotate widely, all night-coded:
- ~18% Small night-life (a Meganeura-like giant insect, a moth-swarm, a scuttling small dinosaur) catching moonlight
- ~14% Reflection of the moon / stars in still water at the foreground edge
- ~12% A distant second dinosaur silhouette at deep midground, revealed by the moon on a ridge
- ~12% Bioluminescence-free real detail: dew-silvered spiderweb / frost-rimmed fern / wet-sheened rock catching moonlight
- ~10% A roosting pterosaur folded on a night crag, one wing edge-lit
- ~10% Small tracks / a footprint pooled with moon-reflecting rainwater in foreground mud
- ~8% A shooting-star or faint satellite-free meteor point in the star-field (not a big phenomenon)
- ~8% Drifting low mist curling through the foreground, catching the moon
- ~8% A juvenile dinosaur half-hidden in silvered ferns at the foreground edge, eye catching the moon

EVERY entry: THE ACCENT + POSITION (foreground edge / midground / distant) + ONE detail (catching moonlight / mid-action).

GOOD examples:
- A giant Meganeura-like dragonfly hovering at the foreground edge, gossamer wings catching a cold glint of moonlight
- The full moon mirrored in a still foreground pool, doubling the silver light across the dark water
- A distant sauropod silhouette on a far midground ridge, its long neck revealed against the star-field
- A dew-silvered spiderweb strung between foreground horsetails, each droplet holding a pinpoint of moonlight
- A roosting Pteranodon folded on a night crag at midground, one leathery wing edge-lit by the low moon

ABSOLUTELY BANNED:
- NO humans / no human-trace / no tools / no artificial light
- NO modern animals; NO cattle/mammal words
- NO glowing-fantasy / bioluminescence / magic light
- NO gore / no kill-shot / no carrion
- NO duplicate-style entries

Output: ONE night-accent per line. No numbering. No quotes.`,

  dinobot_dino_nights_night_phenomenon: `Generate NIGHT PHENOMENON descriptions for DinoBot's dino-nights path — the 0.8-gated atmospheric wonder (fires on ~80% of renders). Each is ONE comma-separated line, 15-30 words: a real, physically-plausible night-sky or atmospheric phenomenon over the Mesozoic scene. Real astronomy/atmosphere only.

Variety mandate — rotate widely:
- ~20% A bright meteor / shooting-star streak across the star-field
- ~16% The Milky Way blazing in exceptional clarity, arching over the scene
- ~12% A moonbow (lunar rainbow) in the mist near a moonlit waterfall / spray
- ~12% A mist inversion — a sea of low fog filling the valley, dinosaur backs and treetops rising above it in the moonlight
- ~10% A lunar halo / 22-degree ring around the moon through thin ice-cloud
- ~10% A meteor shower — several faint streaks radiating across the sky
- ~8% Noctilucent-free real high cloud catching the last afterglow / earthshine on a crescent moon
- ~7% A comet low on the horizon with a faint real tail (no ribbon-fantasy)
- ~5% Distant heat-lightning flickering silently far off (illuminating clouds, not the main light)

EVERY entry: THE PHENOMENON + where it sits + its subtle effect on the scene. Grounded-photographic, never sci-fi.

GOOD examples:
- A brilliant meteor streaking low across the star-field above the sauropod's neck, a brief silver scratch on the night
- The Milky Way blazing overhead in rare clarity, its dust-lanes mirrored in the still black waterhole below
- A faint moonbow arcing through the spray of a moonlit waterfall, delicate silver-grey against the dark
- A mist inversion filling the valley, only the tallest araucaria crowns and a sauropod's neck rising above the moonlit fog-sea
- A soft lunar halo ringing the full moon through thin high ice-cloud, the plain evenly silvered below

ABSOLUTELY BANNED:
- NO sci-fi (no nebulas up close / no orbital / no spacecraft / no alien skies)
- NO aurora (that is polar-dinos' axis)
- NO glowing-fantasy / bioluminescence / magic
- NO humans / no artificial light
- NO ribbon-tail-comet fantasy / no cartoon shooting-stars
- NO duplicate-style entries

Output: ONE night phenomenon per line. No numbering. No quotes.`,

  // ══════════════════════════════════════════════════════════════════════════
  // storm-season (Stage D2, SHADOW) — dinosaurs in DRAMATIC weather. Rain
  // sheeting off a tyrannosaur, lightning over a fleeing gathering, monsoon-
  // flooded fern-plains, dust-storm walls. Jurassic-Park-in-the-rain register.
  // WET-WORLD cranked; animals REACT (mid-flee / hunkered / drinking the flood),
  // never posed; grounded ban doubly enforced (wind+rain invite floaty poses);
  // lightning = ONE physically-lit fork (never sci-fi); clouds are soft/moist
  // (cloud-vocab law: no discs/hovering). storm_light REPLACES universal lighting.
  // ══════════════════════════════════════════════════════════════════════════
  dinobot_storm_season_storm_scene: `Generate DRAMATIC-WEATHER SCENE descriptions for DinoBot's storm-season path — the HERO. Each is ONE comma-separated line, 25-45 words: a specific dinosaur (or two) REACTING to violent weather, in a Mesozoic setting. Photoreal living animals in a real storm, 66+ million years before humans. Jurassic-Park-in-the-rain drama.

Variety mandate — spread WIDELY across species body-plans AND storm-reactions:
- ~18% Large theropod (Tyrannosaurus / Giganotosaurus / Allosaurus) — rain sheeting off its soaked hide, head lowered against the downpour, water streaming from its jaw
- ~15% Sauropod (Brachiosaurus / Argentinosaurus / a long-necked sauropod like Brachiosaurus) — standing firm in the deluge, neck arced, the storm dwarfed by its scale
- ~14% A gathering fleeing (adults + juveniles mid-flight) across a fern-plain as lightning breaks — running low, spray kicking up
- ~12% Ceratopsian (Triceratops / a horned ceratopsian like Triceratops) — hunkered down, frill lowered into the wind, rain beading on its horns
- ~10% Hadrosaur (a duck-billed hadrosaur like Parasaurolophus, broad flat toothless beak) — a gathering wading a rising monsoon flood, drinking the floodwater
- ~10% Stegosaur / ankylosaur (Stegosaurus / an armored ankylosaur like Ankylosaurus) — plated/armored back streaming with rain, planted against the gale
- ~8% A dust-storm wall bearing down — dinosaurs turning to face or flee the advancing ochre wall
- ~7% Pterosaur (a pterosaur like Pteranodon, leathery wings) — struggling against the wind, wings half-folded, hunkered on a crag out of the gale
- ~6% Two species sharing shelter under a mega-conifer / cliff overhang as the storm rages

EVERY entry: SPECIES (body-plan clear) + a STORM-REACTION behavior (verb, mid-action: fleeing / hunkering / drinking-the-flood / bracing / sheltering) + the weather + setting. At least one foot firmly PLANTED (grounded, never floating).

GOOD examples:
- A Tyrannosaurus rex standing in a torrential downpour, rain sheeting off its soaked hide, head lowered against the storm, water streaming from its jaws, feet planted in churned mud
- A gathering of adults and juveniles fleeing low across a flooded fern-plain as a fork of lightning splits the bruised sky behind them, spray kicking from their feet
- A horned ceratopsian like Triceratops hunkered against a howling gale, frill turned into the wind, rain beading and running off its horns and scaly hide
- A long-necked sauropod like Brachiosaurus standing firm in a monsoon deluge, neck arced against the grey curtains of rain, dwarfing the storm
- An armored ankylosaur like Ankylosaurus planted low against a bearing dust-storm wall, ochre grit streaming over its fused-plate armor

ABSOLUTELY BANNED:
- NO humans / no human-trace / no tools / no vehicles / no shelters-built
- NO modern animals; NO cattle/mammal words (herd/bull/cow/calf/grazing/savanna) — use gathering / adults / juveniles / feeding / fern-plain
- NO gore / no kill-shot / no combat-carnage / no lightning-struck-burning-animal
- NO grasslands / savanna (Cretaceous predates grasses); NO modern flora (name araucaria / cycad / tree-fern instead)
- NO floating / no mid-leap-hover — feet planted, storm-braced
- NO sci-fi lightning / no glowing animals
- NO duplicate-style entries

Output: ONE storm scene per line. No numbering. No quotes.`,

  dinobot_storm_season_weather_drama: `Generate WEATHER-DRAMA descriptions for DinoBot's storm-season path — the MONEY-SHOT axis (the show-stopping weather element). Each is ONE comma-separated line, 12-26 words: a specific, physically-real dramatic weather feature rendered vividly.

Variety mandate — rotate widely across REAL violent weather:
- ~22% A sheeting rain-curtain / wall of grey rain marching across the plain
- ~18% ONE physically-lit fork of lightning splitting the bruised sky (a single real bolt, briefly lighting the land)
- ~14% A towering wall of ochre dust bearing down (a real haboob dust-storm front)
- ~12% Hail-flattened ferns / hail bouncing off soaked hide
- ~10% A monsoon flood surging across the fern-plain, brown water rising
- ~8% Wind-driven spray + bent tree-ferns lashing in the gale
- ~8% A low churning shelf-cloud / soft moist billowing storm-front rolling in
- ~8% Steam and mist rising off warm ground as cold rain hits

EVERY entry: THE WEATHER FEATURE + its physical drama (marching / splitting / bearing-down / surging). Clouds are SOFT, MOIST, BILLOWING, feathered — real storm clouds, never rigid.

GOOD examples:
- A sheeting curtain of grey rain marching across the fern-plain, swallowing the far treeline
- One brilliant fork of lightning splitting the bruised violet sky, briefly lighting the drenched land below
- A towering ochre wall of dust bearing down across the plain, the leading edge boiling and churning
- Hail bouncing and rattling off soaked hide, ferns flattened flat under the icy barrage
- A brown monsoon flood surging across the low fern-plain, the water visibly rising over the silt

ABSOLUTELY BANNED:
- NO sci-fi lightning (no multiple electric-blue bolts, no glowing sky-energy, no aurora)
- NO rigid/disc/metallic/hovering cloud shapes — clouds are soft, moist, billowing
- NO tornado-on-a-modern-farm / no modern storm-chasing cues
- NO humans / no structures
- NO duplicate-style entries

Output: ONE weather-drama per line. No numbering. No quotes.`,

  dinobot_storm_season_storm_light: `Generate STORM LIGHT descriptions for DinoBot's storm-season path — the light axis (this REPLACES the daytime lighting slot; it defines the storm's light). Each is ONE comma-separated line, 12-24 words: a real, physically-plausible storm light quality.

Variety mandate — rotate widely across real storm light:
- ~22% Bruised storm-light — heavy violet-grey overcast, the land dim and desaturated under the cell
- ~18% A shaft of break-light — one gap in the storm letting a beam of gold rake the drenched plain
- ~16% Lightning-lit instant — the whole scene briefly flash-lit blue-white by a fork of lightning
- ~12% Pre-storm ochre light — an eerie yellow-green glow before the cell hits
- ~10% Rain-grey flat light — even, silvery, wet, low-contrast under solid cloud
- ~10% Dark-base underlit — the storm's dark belly with a bright horizon-band beneath it
- ~6% Post-storm clearing — the last rain lit gold by a low breaking sun, a rainbow-free wet shine
- ~6% Dust-storm amber gloom — the sun a dim disc through the ochre haze

EVERY entry: THE LIGHT QUALITY + its color + how it falls on the wet scene. Real weather light only.

GOOD examples:
- Bruised violet-grey storm-light, the whole plain dim and desaturated beneath the towering cell
- A single shaft of gold break-light raking through a gap in the storm across the drenched fern-plain
- The scene briefly flash-lit stark blue-white by a fork of lightning, every raindrop caught mid-fall
- An eerie yellow-green pre-storm glow tinting the still air before the cell hits
- The storm's dark belly overhead with a bright silver horizon-band glowing beneath it

ABSOLUTELY BANNED:
- NO sci-fi glow / no neon / no aurora / no bioluminescence
- NO cheerful blue sky / no calm sunshine
- NO artificial light
- NO duplicate-style entries

Output: ONE storm light per line. No numbering. No quotes.`,

  dinobot_storm_season_storm_biome: `Generate STORM-BIOME / SETTING descriptions for DinoBot's storm-season path. Each is ONE comma-separated line, 18-32 words: a Mesozoic landscape SETTING under violent weather (no animals — the setting only). Wet, dramatic, primordial.

Variety mandate — rotate widely across Mesozoic biomes, all storm-coded:
- ~18% A wide fern-plain under a monsoon deluge, channels flooding, silt churning
- ~14% A floodplain river bursting its banks, brown water surging over the flats
- ~12% An open cycad-plain lashed by wind and rain, tree-ferns bent flat
- ~12% A volcanic plain under a bruised sky, rain hissing on dark basalt
- ~10% A mega-conifer forest edge in the gale, araucaria crowns thrashing
- ~10% A coastal flat under a bearing storm, surf and rain merging
- ~8% A canyon / gorge channeling a flash-flood torrent
- ~8% A dust-storm-swept ochre plain, visibility collapsing in the haze
- ~8% A ridge / escarpment silhouetted against a wall of advancing rain

EVERY entry: THE SETTING + the storm-battered atmosphere. Cretaceous predates grasses — fern-plain / floodplain / cycad-plain only.

GOOD examples:
- A wide fern-plain under a monsoon deluge, its shallow channels overflowing, silt churning brown across the flooding ground
- A floodplain river bursting its banks, brown water surging over the silt-flats, drowned tree-ferns bending in the current
- An open cycad-plain lashed by wind-driven rain, squat cycads and tree-ferns bent flat under the gale
- A volcanic plain of dark basalt under a bruised violet sky, cold rain hissing and steaming on the warm rock
- A mega-conifer forest edge in the storm, tall araucaria crowns thrashing against the grey deluge

ABSOLUTELY BANNED:
- NO humans / no structures / no roads / no artificial light
- NO grasslands / savanna / lawns (Cretaceous predates grasses); NO modern flora (no acacia / oak / palm / pine) — araucaria / cycad / tree-fern / horsetail / ginkgo
- NO calm sunny weather
- NO duplicate-style entries

Output: ONE storm setting per line. No numbering. No quotes.`,

  dinobot_storm_season_surprise_element: `Generate SMALL STORM-ACCENT descriptions for DinoBot's storm-season path. Each is ONE comma-separated line, 15-30 words: a small secondary storm detail adding drama. SMALL (2-5% of frame), midground or foreground edge.

Variety mandate — rotate widely, all storm-coded:
- ~18% A pterosaur struggling in the wind at midground, wings half-folded against the gale
- ~14% A splash-crown / big raindrop impacts on a foreground flood-puddle
- ~12% A distant second dinosaur silhouette braced against the storm on a far ridge
- ~12% Bent-flat tree-ferns / a wind-stripped branch tumbling across the foreground
- ~10% Steam rising off warm foreground rock as cold rain hits
- ~10% A juvenile sheltering under an adult's flank / body at midground
- ~8% Floating debris on a rising flood at the foreground edge (logs, fern-mats)
- ~8% A foreground footprint filling fast with rainwater
- ~8% Wind-torn spray whipping off the crest of a flood-wave

EVERY entry: THE ACCENT + POSITION (foreground edge / midground / distant) + ONE storm-detail.

GOOD examples:
- A pterosaur struggling against the crosswind at midground, leathery wings half-folded, fighting to stay aloft
- Big raindrop impacts throwing splash-crowns across a foreground flood-puddle, ripples colliding
- A distant sauropod silhouette braced against the deluge on a far ridge, neck bowed into the wind
- A juvenile sheltering tight under an adult's flank at midground, both streaming with rain
- Steam rising in wisps off warm foreground basalt as the cold rain strikes it

ABSOLUTELY BANNED:
- NO humans / no human-trace / no tools
- NO modern animals; NO cattle/mammal words
- NO gore / no kill-shot / no drowned-corpse
- NO sci-fi / no glowing
- NO duplicate-style entries

Output: ONE storm-accent per line. No numbering. No quotes.`,

  dinobot_storm_season_peak_event: `Generate PEAK STORM-EVENT descriptions for DinoBot's storm-season path — the 0.8-gated climactic moment (fires on ~80% of renders). Each is ONE comma-separated line, 15-30 words: a single dramatic real weather climax. Physically real, never sci-fi.

Variety mandate — rotate widely:
- ~26% The strike-moment — ONE brilliant physically-lit fork of lightning hitting a distant ridge/tree, thunder implied
- ~18% A flash-flood surge — a wall of brown water rushing down a channel, spray flying
- ~14% The dust-wall arrival — the ochre front sweeping over, everything greying out
- ~12% A break in the storm — one shaft of gold light punching through onto the drenched hero
- ~10% Hail-burst — a sudden white barrage bouncing off ground and hide
- ~8% A downburst — a violent column of rain and wind flattening the ferns in a spreading ring
- ~6% A waterspout-free real gustnado of dust spinning briefly across the plain
- ~6% The wall-cloud lowering — a dark rotating shelf dropping over the plain

EVERY entry: THE PEAK EVENT + where it sits + its dramatic effect. Lightning is ONE real fork, physically lit. Clouds soft/moist.

GOOD examples:
- One brilliant fork of lightning striking a distant araucaria on the ridge, the whole plain flash-lit blue-white for an instant
- A wall of brown flash-flood water rushing down the canyon channel, spray flying off the churning front
- The ochre dust-wall sweeping over the scene, the far plain greying out to nothing behind the leading edge
- A single shaft of gold break-light punching through the storm onto the drenched hero at center
- A sudden hail-burst bouncing white off the ground and the soaked hide, ferns hammered flat

ABSOLUTELY BANNED:
- NO sci-fi (no multiple electric bolts / no glowing energy / no aurora)
- NO rigid/disc/hovering cloud shapes — soft, moist, billowing
- NO gore / no lightning-struck-burning-animal
- NO humans / no structures
- NO duplicate-style entries

Output: ONE peak event per line. No numbering. No quotes.`,

  // ══════════════════════════════════════════════════════════════════════════
  // polar-dinos (Stage D3, SHADOW) — real paleo-accuracy showcase. Polar-latitude
  // dinosaurs (Nanuqsaurus, Leaellynasaura, Edmontosaurus at high latitude),
  // snow-dusted feathers/hide, aurora skies, ice-edge coasts, months-long dusk.
  // ENTIRELY NEW palette (the bot is all-warm). SPECIES_ANCHOR load-bearing (obscure
  // genera). Feathering = INSULATION, described POSITIVELY (the coat), never negated.
  // Mesozoic-lock: never Arctic-today (no polar bears, no modern spruce) — cold-hardy
  // primordial flora. polar_light REPLACES universal lighting. Aurora allowed HERE only.
  // ══════════════════════════════════════════════════════════════════════════
  dinobot_polar_dinos_polar_scene: `Generate POLAR-DINOSAUR SCENE descriptions for DinoBot's polar-dinos path — the HERO. Each is ONE comma-separated line, 25-45 words: a specific polar-latitude dinosaur + a cold-adapted behavior + a snowy/icy Mesozoic-polar setting. Photoreal living animals in the deep-time polar world, 66+ million years before humans. Real paleo-accuracy showcase.

For less-famous genera, LEAD with the body-plan + a famous look-alike (SPECIES_ANCHOR). Describe warm insulating coats POSITIVELY — a dense shaggy coat of downy proto-feathers / filament-fuzz dusted with frost, or thick cold-hardy scaly hide.

Variety mandate — spread WIDELY across polar species + cold behaviors:
- ~18% Nanuqsaurus (a small tyrannosaur like a T-rex, with a shaggy insulating coat of proto-feathers) — patrolling a snow-dusted plain, breath fogging
- ~16% Leaellynasaura (a small slender ornithopod like a big-eyed Hypsilophodon, downy filament coat, large dark eyes for the polar dusk) — a small group foraging under snow-laden tree-ferns
- ~14% Edmontosaurus at high latitude (a duck-billed hadrosaur like Parasaurolophus, broad flat toothless beak, frost on its hide) — a gathering crossing a frozen floodplain
- ~12% Pachyrhinosaurus (a horned ceratopsian like Triceratops with a bony nasal boss instead of a horn) — an adult and juvenile pushing through snow
- ~12% A feathered dromaeosaur / troodontid (a feathered raptor like Velociraptor with a thick winter coat) — hunting across the snow at polar dusk
- ~10% An ankylosaur (a low-slung armored ankylosaur like Ankylosaurus) — plodding across a frozen lagoon edge, armor rimed with frost
- ~8% A small huddled group sheltering from wind-driven snow behind an ice ridge
- ~6% A sauropod (a long-necked sauropod like Brachiosaurus) at high latitude browsing snow-dusted araucaria
- ~4% Two species sharing a sheltered snowy hollow at wary distance

EVERY entry: SPECIES (body-plan + look-alike for obscure genera) + a COLD-ADAPTED behavior (verb, candid) + a snowy/icy polar setting. Feathering/coat described positively as insulation. At least one foot planted (grounded).

GOOD examples:
- A Nanuqsaurus (a small tyrannosaur like a T-rex) with a shaggy insulating coat of proto-feathers patrolling a snow-dusted fern-plain at polar dusk, its breath fogging in the cold
- A small group of Leaellynasaura (slender ornithopods like big-eyed Hypsilophodon, downy filament coats) foraging under snow-laden tree-ferns, their large dark eyes wide in the low blue light
- A gathering of Edmontosaurus (duck-billed hadrosaurs like Parasaurolophus, broad flat toothless beaks) crossing a frozen floodplain, frost whitening their hides, breath steaming
- A Pachyrhinosaurus (a horned ceratopsian like Triceratops with a bony nasal boss) and its juvenile pushing through fresh snow toward a wind-scoured ridge
- A feathered raptor like Velociraptor in a thick winter coat, crouched mid-stalk across a moonlit snowfield, frost on its plumage

ABSOLUTELY BANNED:
- NO humans / no human-trace / no tools / no shelters-built
- NO modern Arctic animals (NO polar bears / seals / penguins / walruses / reindeer); NO cattle/mammal words (herd/bull/cow/calf/grazing/savanna) — use gathering / adults / juveniles / feeding
- NO modern spruce/pine/fir forest / no modern tundra-moss-only — use snow-dusted araucaria, cold-hardy cycads, tree-ferns, ginkgo, horsetails
- NO glowing-fantasy eyes / no bioluminescence / no magic
- NO gore / no kill-shot / no frozen-carcass
- NO duplicate-style entries

Output: ONE polar scene per line. No numbering. No quotes.`,

  dinobot_polar_dinos_ice_feature: `Generate POLAR ICE-FEATURE descriptions for DinoBot's polar-dinos path — the MONEY-SHOT axis (the show-stopping ice/snow feature). Each is ONE comma-separated line, 14-28 words: a specific, real polar ice or snow formation rendered vividly.

Variety mandate — rotate widely across real polar features:
- ~22% A towering blue glacier face / calving ice-cliff at the edge of the scene
- ~16% A frozen lagoon / ice-sheeted lake, cracked and mirror-smooth
- ~14% Snow-laden araucaria / cycads bowed under heavy fresh snow
- ~12% A sea-ice edge / pack-ice shelf meeting a dark cold ocean
- ~10% Wind-carved sastrugi ridges / drifted snow dunes across the plain
- ~8% Hanging icicles / frozen waterfall on a dark rock face
- ~8% A frost-rimed fern-plain, every frond edged white
- ~6% Blue crevasses / ice caves glowing with refracted cold light
- ~4% Frozen braided river channels threading a white floodplain

EVERY entry: THE ICE FEATURE + its real physical detail (blue glacial ice / cracked lagoon / snow-laden boughs). Cold, real, grounded-photographic.

GOOD examples:
- A towering blue glacier face rising at the scene's edge, deep glacial ice glowing pale cyan, a fresh calving scar bright white
- A frozen lagoon of cracked mirror-ice stretching to the dark treeline, snow feathered across its surface
- Snow-laden araucaria boughs bowed heavy under fresh powder, clumps sliding off in the cold wind
- A sea-ice edge of jumbled pack-ice meeting a slate-dark cold ocean, spray freezing on the floes
- Wind-carved sastrugi ridges of hard-packed snow rippling across the polar plain

ABSOLUTELY BANNED:
- NO modern Arctic infrastructure (no research stations / no ships / no snowmobiles)
- NO polar bears / penguins / seals
- NO sci-fi / no glowing-magic ice
- NO humans
- NO duplicate-style entries

Output: ONE ice feature per line. No numbering. No quotes.`,

  dinobot_polar_dinos_polar_light: `Generate POLAR LIGHT descriptions for DinoBot's polar-dinos path — the light axis (this REPLACES the daytime lighting slot). Each is ONE comma-separated line, 12-26 words: a real, physically-plausible polar light quality. The polar Mesozoic had real long-dusk light and real auroras.

Variety mandate — rotate widely across real polar light:
- ~24% A green aurora rippling overhead (real polar aurora — allowed on THIS path, curtains of green-and-teal light over the snow)
- ~18% Low-angle polar sun — a pale gold sun skimming the horizon, long blue shadows on snow
- ~16% Blue twilight / months-long dusk — deep cobalt-and-lilac polar gloaming, snow glowing faintly
- ~12% Overcast snow-light — flat, soft, silvery-white, shadowless
- ~10% Pink-and-peach polar alpenglow on snow and ice
- ~8% A pale low midnight-sun glow near the horizon
- ~6% Moonlit polar night — cold silver moonlight on snow, stars sharp
- ~6% A rare crisp clear cold sun, hard blue shadows, sparkling snow

EVERY entry: THE POLAR LIGHT + its color + how it falls on snow/ice. Cool palette (the bot's first). Aurora is real here.

GOOD examples:
- A green aurora rippling in slow curtains overhead, its teal light shimmering across the snowfield below
- A pale gold polar sun skimming low along the horizon, throwing long cold-blue shadows across the drifted snow
- Deep blue polar twilight, the months-long dusk glowing cobalt and lilac, the snow faintly luminous
- Flat soft overcast snow-light, silvery and shadowless, the whole scene calm and pale
- Pink-and-peach alpenglow washing the glacier face and the snow-dusted plain

ABSOLUTELY BANNED:
- NO warm tropical sun / no golden-jungle light (this path is COOL)
- NO sci-fi glow / no neon / no bioluminescence (aurora is the ONLY sky-glow, and it is real)
- NO artificial light
- NO duplicate-style entries

Output: ONE polar light per line. No numbering. No quotes.`,

  dinobot_polar_dinos_surprise_element: `Generate SMALL POLAR-ACCENT descriptions for DinoBot's polar-dinos path. Each is ONE comma-separated line, 15-30 words: a small secondary cold-world detail adding depth. SMALL (2-5% of frame), midground or foreground edge.

Variety mandate — rotate widely, all polar-coded:
- ~18% A distant second polar dinosaur silhouette on a snowy ridge
- ~14% Breath-fog / steam rising from the animal or the ground in the cold
- ~12% A small feathered polar creature / early bird-like theropod on a frosted branch
- ~12% Fresh three-clawed dinosaur tracks pressed into deep snow
- ~10% Icicles / frost crystals catching the low light on a foreground frond
- ~10% Wind-lofted snow / spindrift streaming off a ridge crest
- ~8% A snow-dusted cycad or araucaria bough in the foreground
- ~8% A frozen-over puddle / thin ice cracking underfoot
- ~8% Drifting snowflakes catching the polar light in the foreground

EVERY entry: THE ACCENT + POSITION (foreground edge / midground / distant) + ONE cold-detail.

GOOD examples:
- A distant Nanuqsaurus silhouette cresting a snowy ridge at deep midground, breath fogging against the twilight
- Plumes of breath-fog streaming from the animal's nostrils into the freezing air
- Fresh three-clawed tracks pressed deep into the powder snow across the foreground, already softening with drift
- Frost crystals fringing a foreground tree-fern frond, each edge glittering in the low polar light
- Wind-lofted spindrift streaming off the crest of a snow ridge behind the hero

ABSOLUTELY BANNED:
- NO humans / no human-trace / no tools
- NO modern Arctic animals (polar bears / seals / penguins)
- NO cattle/mammal words
- NO gore / no frozen-carcass
- NO sci-fi / no glowing (aurora only, in the sky)
- NO duplicate-style entries

Output: ONE polar-accent per line. No numbering. No quotes.`,

  dinobot_polar_dinos_polar_phenomenon: `Generate POLAR PHENOMENON descriptions for DinoBot's polar-dinos path — the 0.8-gated wonder (fires on ~80% of renders). Each is ONE comma-separated line, 15-30 words: a real, physically-plausible polar atmospheric or celestial phenomenon. Real science only.

Variety mandate — rotate widely:
- ~26% A brilliant green-and-teal aurora blazing in full curtains across the polar sky
- ~14% A blowing-snow ground-blizzard sweeping low across the plain
- ~12% A sun-dog / 22-degree halo around the low pale sun through ice-crystal haze
- ~12% Light pillars rising from the horizon through diamond-dust ice crystals
- ~10% A pastel nacreous / mother-of-pearl polar-stratospheric cloud glowing at dusk
- ~10% Sea-smoke / frost-fog rolling off open dark water into the cold air
- ~8% Diamond-dust sparkling in the air, the whole scene glittering
- ~8% Fresh heavy snowfall in big slow flakes blanketing the scene

EVERY entry: THE PHENOMENON + where it sits + its effect on the cold scene. Aurora / sun-dogs / light-pillars are all REAL polar science.

GOOD examples:
- A brilliant green-and-teal aurora blazing in vast rippling curtains across the polar sky, its light dancing on the snowfield
- A blowing-snow ground-blizzard streaming low and fast across the plain, the hero's legs vanishing into the white
- A bright sun-dog flanking the low pale sun, a 22-degree halo ringing it through the ice-crystal haze
- Vertical light-pillars rising from the horizon through drifting diamond-dust, cold and still
- Sea-smoke rolling in ghostly sheets off the dark open water into the freezing air

ABSOLUTELY BANNED:
- NO sci-fi (no nebulas up close / no orbital / no spacecraft)
- NO warm tropical weather
- NO glowing-fantasy / bioluminescence / magic (aurora + sun-dogs + light-pillars are REAL, keep them physical)
- NO humans / no artificial light
- NO duplicate-style entries

Output: ONE polar phenomenon per line. No numbering. No quotes.`,

  // ── courtship-display (2026-09-22) — DinoBot's first DISPLAY-BEHAVIOUR path ──────────────────
  // The bot has 16 paths and every one of them is a landscape, a herd, a fight, a family or a
  // portrait. Nothing shows a dinosaur DISPLAYING. These three axes are the path: the ACT, the
  // ANATOMY doing the displaying (the money-shot axis), and the AUDIENCE it is aimed at.

  dinobot_courtship_act: `Generate COURTSHIP-DISPLAY ACT descriptions for DinoBot's courtship-display path. Each is ONE comma-separated line, 25-40 words, describing a dinosaur mid-DISPLAY — the behaviour a Prehistoric-Planet camera crew would wait a week to film.

This is the HERO of the frame. The displaying animal is 35-55% of frame, caught MID-ACT, never posed and never static.

Variety mandate (rotate widely — vary the BODY PLAN as much as the behaviour):
- ~15% Crest / frill / sail flushed with blood and angled broadside to be seen at maximum width
- ~15% Feather fans spread — arm-fans thrown wide, tail-fan raised and shivering
- ~12% Inflated throat sac or dewlap, mid-boom, air visibly distending the skin
- ~12% A dance — rhythmic stamping, a scrape-ceremony gouging the ground, circling with head held over the other's back
- ~10% Head-bobbing / neck-swaying arc, the whole neck describing a curve
- ~10% Presenting an object — a stone, a frond, a mouthful of vegetation held out
- ~8% Two rivals displaying side by side, parallel and matched, sizing each other up without contact
- ~8% Calling — head thrown back, jaws open, the resonating chamber of the crest in use
- ~5% Wing-and-tail flagging on a small feathered dinosaur, bounding in place
- ~5% Building — a mound, a cleared arena, a ring of scraped earth, mid-construction

EVERY entry includes:
- THE BODY PLAN said plainly enough that Flux renders a dinosaur (crested duckbill / horned ceratopsian / sail-backed / long-necked / small feathered theropod / tyrannosaur-built) — never just "a dinosaur"
- THE ACT as an ACTIVE VERB, mid-motion
- ONE PHYSICAL CONSEQUENCE of the act (dust kicked up, ground gouged, throat distended, feathers shivering, vegetation scattered, neck arched)

HARD RULES:
- NO humans, no people, no observers. This is Earth 66 million years before humans.
- NO modern-zoo or safari-park framing. No fences, no enclosures, no signage.
- NO mating / mounting / copulation — this is DISPLAY and courtship RITUAL only, always tasteful.
- NO fighting, no blood, no wounds, no kill — display is the point, violence is a different path.
- NO glowing / bioluminescent / magical anatomy. Real animal colour: flushed reds, ochres, blues, iridescence.
- Describe only what IS present. Never write a negation.

Output: ONE act per line. No numbering. No quotes.`,

  // ── desert-dunes + snowline-forest (2026-09-22) ─────────────────────────────────────────────
  // Promoted from buckets to their own paths on Kevin's call. These recipes exist so each path is
  // READY TO SCALE: `--pool <name> --target 200` after he grades the MVP-25.
  //
  // Both are written OBJECT-LED on purpose, per the finding that produced them: the shared
  // paleo-landscape biome pool averaged 5.6 atmosphere adjectives to 2.4 physical objects and used
  // "amber" in 84% of entries, so 200 entries delivered one look. An atmosphere adjective is a
  // shared CONSTANT across a pool; a physical object is a VARIABLE. Name THINGS, mention light once.

  dinobot_desert_dunes_biome: `Generate PALEO DESERT-DUNE landscape entries for DinoBot's desert-dunes path. Each is ONE comma-separated line, 35-50 words, describing a vast arid dune landscape in deep prehistory.

WRITE OBJECT-LED, NOT ADJECTIVE-LED. This is the single rule that matters. Name at least FOUR countable physical things and mention light or atmosphere exactly ONCE, in a short specific clause. A pool full of atmosphere adjectives renders as one look no matter how the landform varies; a pool full of objects renders as different places.

BANNED WORDS, because DinoBot's landscape register has worn them out: amber, haze, hazy, misted, misty, golden, atmospheric, primordial, ancient, epic, sweeping, majestic, breathtaking, pristine, lush, verdant. Say what you mean more specifically instead.

EVERY ENTRY INCLUDES:
- THE DUNE FORM, named: a long transverse ridge, a star dune, a barchan arm, a wind-scoured corridor, a slip-face mid-avalanche, a dune field spilling against bare rock
- THE GROUND underfoot: razor-sharp ripple marks, coarse grit, a lag of dark pebbles, cracked clay plates in a dry pan, loose slip-face sand
- AT LEAST TWO MORE PHYSICAL THINGS: a petrified trunk lying across a pan, bleached bone in the gravel, wind-stunted cycad scrub in a hollow, fossil-bearing strata exposed at the margin, a lone araucaria half-buried to its crown, a dry wash cut through the crust, hoodoos standing off the field
- ONE LIGHT CLAUSE, specific: late light raking sideways across every ripple, a hard noon shadow off one ridge, a dust-dimmed sun
- ONE VIVID DETAIL that makes it that place: a whole tree fossilised upright, an odd-coloured band through the strata, a spring darkening the sand at a dune's foot, a slip-face caught mid-collapse

Variety mandate: 5 transverse ridge fields, 3 star dunes, 3 wind-scoured corridors, 4 dry pans between dunes, 3 dunes against bare rock, 3 slip-faces avalanching, 4 dune margins with exposed strata or petrified wood.

HARD RULES: no humans, no structures, no modern anything, no glowing terrain. Mega-flora named by species. Describe only what IS present, never a negation.

Output: ONE landscape per line. No numbering. No quotes.`,

  dinobot_snowline_forest_biome: `Generate PALEO SNOWLINE-FOREST landscape entries for DinoBot's snowline-forest path. Each is ONE comma-separated line, 35-50 words, describing high conifer forest in deep prehistory right where the trees give out and the snow begins.

WRITE OBJECT-LED, NOT ADJECTIVE-LED. This is the single rule that matters. Name at least FOUR countable physical things and mention light or atmosphere exactly ONCE, in a short specific clause. This path also exists to be DinoBot's coldest register — the rest of the bot's landscape content is warm, so commit to cold blues, wet black rock and white, with at most one warm accent.

BANNED WORDS, because DinoBot's landscape register has worn them out: amber, haze, hazy, misted, misty, golden, atmospheric, primordial, ancient, epic, sweeping, majestic, breathtaking, pristine, lush, verdant. Say what you mean more specifically instead.

EVERY ENTRY INCLUDES:
- THE FOREST FORM, named: a stand of araucaria thinning to bare rock, a wind-flagged treeline on a ridge, a boulder field above the last trees, a hanging valley with a frozen tarn, a pass with cloud pouring through, a slope of deadfall
- THE GROUND underfoot: snow lying only in the lee of trunks, wet black rock, deep needle litter, frost-shattered scree, a melt stream cutting a snowpack channel
- AT LEAST TWO MORE PHYSICAL THINGS: rime feathered along every needle, a fallen trunk bridging a gully, lichen mapping a boulder face, club-mosses in a sheltered hollow, icicles fringing an overhang, a tarn skinned with ice
- ONE LIGHT CLAUSE, specific: flat overcast with no shadow at all, a low sun throwing long blue shadows downslope, cloud breaking over the pass
- ONE VIVID DETAIL that makes it that place: one araucaria grown horizontal out of the wind, a single warm-lit break in the cloud, a frozen waterfall stopped mid-fall, tracks crossing an untouched snowfield

Variety mandate: 4 thinning araucaria stands, 3 wind-flagged treelines, 3 boulder fields above the trees, 3 hanging valleys with tarns, 3 passes with cloud, 3 deadfall slopes, 3 melt-stream channels, 3 rime-coated stands.

HARD RULES: no humans, no structures, no modern anything, no glowing terrain. Name conifer species (araucaria, podocarp) rather than "conifer". Describe only what IS present, never a negation.

Output: ONE landscape per line. No numbering. No quotes.`,

  // ── undergrowth-scale (2026-09-22) ──────────────────────────────────────────────────────────
  // THE DELIGHT ANGLE: a dino's-eye view from the FOREST FLOOR, looking UP. Every DinoBot path
  // looks AT dinosaurs from human height or above. This one puts the camera at ankle height among
  // the leaf litter, where a chicken-sized dinosaur lives and a giant is just four legs and a
  // shadow passing overhead. Same animals, a perspective nobody gets shown.

  dinobot_undergrowth_floor: `Generate FOREST-FLOOR descriptions for DinoBot's undergrowth-scale path — the world at ankle height, seen by something the size of a chicken. Each is ONE comma-separated line, 30-45 words.

THE BAR (Kevin's motto): playful, adventurous, VIVID, beautiful, clever. Saturated colour and dramatic light, never muted. Every entry carries ONE CHARM DETAIL that makes it that patch of floor and no other. This axis exists to show a perspective nobody is ever shown.

THE CAMERA IS DOWN IN IT. Fern stems are tree trunks. A fallen leaf is a roof. A puddle is a lake. Write the floor as a LANDSCAPE.

Variety mandate (rotate widely):
- ~15% A cathedral of fern stems rising like columns, light coming down between them in hard shafts
- ~12% A fallen log gone soft and mossy, its bark peeled into overhanging shelves, fungi stepping up it in tiers
- ~12% A leaf-litter floor in full autumn colour, curled leaves forming caves and tunnels
- ~10% A rain puddle the size of a lake, the canopy perfectly reflected in it, a drowned leaf on the bottom
- ~10% A cycad's crown seen from directly beneath, fronds radiating out like a vaulted ceiling
- ~10% Horsetails standing in a dense reed-forest at the water's edge, jointed stems banded green
- ~8% A root buttress rising into a wall, a natural archway worn under it
- ~8% A mushroom ring standing like a town, caps at different heights, gills catching the light
- ~8% Moss in full soft depth, a whole plush landscape of hummocks and valleys, dew held in it
- ~7% A shaft of light hitting one small patch of floor and leaving the rest in deep green shade

EVERY ENTRY INCLUDES:
- THE FLOOR-LEVEL SUBJECT treated as a landform (a fern cathedral, a log ridge, a leaf cave, a puddle lake)
- ITS SCALE said from below — stems as columns, a leaf as a roof, a mushroom as a tower
- THE LIGHT and what it does down there: a hard shaft, dappled coins, deep green shade, backlit translucent leaves
- ONE VIVID CHARM DETAIL: dew beaded along a fern's edge, a snail track glinting, a beetle-bored hole through a leaf, a spiral of seed-fluff caught in moss, light through a translucent young frond, rain still dripping from one stem

HARD RULES:
- NO humans, no people, no structures, no modern anything. Earth 66 million years before humans.
- NO glowing/bioluminescent plants. Real light on real plants.
- Mega-flora is the point: tree ferns, cycads, horsetails, ginkgo, araucaria, club-mosses.
- Describe only what IS present. Never write a negation.

Output: ONE floor landscape per line. No numbering. No quotes.`,

  dinobot_undergrowth_resident: `Generate SMALL-DINOSAUR descriptions for DinoBot's undergrowth-scale path — the little dinosaur who LIVES down here, at the scale of a chicken or a turkey. Each is ONE comma-separated line, 25-40 words.

THE BAR: playful, adventurous, vivid, clever. This is the hero and it should be characterful and gorgeous, never a drab lizard.

Variety mandate:
- ~25% A small feathered theropod, plumage patterned like a living bird — barred, spotted, iridescent, crested
- ~15% A tiny armoured herbivore, low and wide, plates and spines in bold pattern
- ~12% A long-legged runner built like a roadrunner, poised mid-stride
- ~12% A climber gripping a fern stem or a log, tail counterbalancing
- ~10% A burrower half out of a hole in the litter, soil on its snout
- ~10% A pair of them together, one alert and one busy
- ~8% A juvenile of a giant species, unmistakably the same body plan at knee height
- ~8% Something perched on the log ridge, surveying its floor-kingdom

EVERY ENTRY INCLUDES:
- SIZE said plainly against the floor world (chicken-sized, turkey-sized, cat-sized)
- ITS PLUMAGE OR HIDE in real animal colour and pattern, specifically: barred rust and cream, iridescent green-black, a crest of stiff quills, sandy with dark spots, a banded tail
- WHAT IT IS DOING, an active verb, mid-motion: peering, darting, scratching the litter, drinking at the puddle-lake, gripping a stem, tilting its head, shaking rain off
- ONE CHARACTERFUL DETAIL that makes it a personality rather than a specimen

HARD RULES:
- NO humans. NO predation, NO blood, NO distress — it is going about its day.
- Real animal colour: no glowing, no metallic, no jewelled.
- It is a DINOSAUR: say the body plan so Flux does not render a bird or a lizard.
- Describe only what IS present. Never write a negation.

Output: ONE resident per line. No numbering. No quotes.`,

  dinobot_undergrowth_giant: `Generate GIANT-OVERHEAD descriptions for DinoBot's undergrowth-scale path — the enormous dinosaur passing by, seen from ankle height where you only get PART of it. Each is ONE comma-separated line, 20-35 words.

WHY THIS AXIS: this is what makes the perspective land. From the floor you never see a whole giant — you see four legs like pillars, a shadow sweeping the litter, a tail passing through frame, a head coming down. The PART is more thrilling than the whole.

THE BAR: adventurous, vivid, clever. This is the awe beat. It is 10-25% of frame and mostly implied.

Variety mandate:
- ~20% Legs only — columns of hide crossing the far floor, feet bigger than the whole foreground
- ~15% A shadow sweeping across the leaf litter, the animal itself out of frame
- ~12% A tail passing overhead through the fern canopy, dragging fronds aside
- ~12% A head lowering into frame from above to browse, seen from directly below
- ~10% A footprint already there, filled with water, a whole puddle in one toe-print
- ~10% Dust or litter shaken loose from the canopy by something heavy passing
- ~8% A giant's flank filling the far background like a wall of hide, no head visible
- ~8% The floor world trembling — ripples crossing the puddle-lake, fronds shivering
- ~5% A neck rising away into the canopy, the body lost in green above

EVERY ENTRY INCLUDES:
- THE PART of the giant that is visible, and where in frame
- ONE CONSEQUENCE at floor level: fronds dragged aside, litter shaken down, ripples crossing the puddle, a shadow crossing, dust drifting
- Its SCALE against the little world, stated

HARD RULES:
- NO humans. NO threat to the small resident, NO predation, NO violence — this is awe, not danger.
- NO whole-giant portraits: this axis is deliberately partial.
- Describe only what IS present. Never write a negation.

Output: ONE giant beat per line. No numbering. No quotes.`,

  // ── den-and-burrow (2026-09-22) ─────────────────────────────────────────────────────────────
  // THE DELIGHT ANGLE: nobody has seen inside a dinosaur burrow. The hero is the UNDERGROUND
  // itself — a cutaway of packed-earth chambers, root ceilings, a shaft of daylight down the
  // entrance tunnel, hatchlings heaped in a nest hollow. Familiar animal, never-seen place.

  dinobot_den_chamber: `Generate DEN-INTERIOR descriptions for DinoBot's den-and-burrow path — the inside of a dinosaur's burrow, which is a place almost nobody has ever been shown. Each is ONE comma-separated line, 30-45 words.

THE BAR (Kevin's motto): playful, adventurous, VIVID, beautiful, clever. Saturated committed colour and dramatic light, never muted. Every entry carries ONE CHARM DETAIL that makes it that den and no other. This axis exists to show people something they have NEVER SEEN.

THE HERO is the underground space: the shape of the chamber, what its walls and ceiling are made of, and the ONE light source reaching it.

Variety mandate (rotate widely):
- ~18% A round nest hollow at the tunnel's end, floor dished and lined, the ceiling a woven mat of live roots
- ~15% A cutaway of the whole burrow system — two or three chambers at different depths joined by sloping tunnels, seen as a cross-section through the earth
- ~12% The entrance tunnel from INSIDE, looking out at a blazing disc of daylight with the silhouette of the world beyond
- ~10% A chamber dug into a riverbank, one wall open to the water, light bouncing up off the river onto the ceiling
- ~10% A chamber under a fallen giant's root-plate, the trunk's underside forming the roof
- ~8% A deep cool chamber with a seep of water down one wall and a shallow pool on the floor
- ~8% A hollow inside a living tree's base, the walls smooth heartwood
- ~7% A chamber whose ceiling has partly collapsed into a skylight with plants leaning in and light pouring down
- ~7% A sandy chamber in a dune bank, walls banded in colour like layered cake
- ~5% A den taken over from something else — an older, bigger burrow adapted, its entrance too large for its tenant

EVERY ENTRY INCLUDES:
- THE CHAMBER'S SHAPE and scale (a dished hollow, a long low gallery, a tall shaft, a two-level system)
- WHAT THE WALLS AND CEILING ARE MADE OF, specifically: packed red earth, woven live roots, smooth heartwood, banded sand, river clay, rock with a seep
- THE ONE LIGHT SOURCE and what it does inside: daylight down the tunnel mouth, a collapse skylight, light bounced up off water, a glow through a root gap
- ONE VIVID CHARM DETAIL: a root that has grown into a natural handrail, a scatter of iridescent beetle shells in the floor litter, a drift of shed down caught in the roots, a fossil shell standing out of the wall, dust turning gold in the light-beam, tiny white rootlets glowing where the light hits them

HARD RULES:
- NO humans, no people, no tools, no excavation, no archaeology. Earth 66 million years before humans.
- NO glowing/magical/bioluminescent anything. Real earth, real roots, real light.
- NO bones, no carcasses, no death. This is a LIVED-IN home.
- Describe only what IS present. Never write a negation.

Output: ONE chamber per line. No numbering. No quotes.`,

  dinobot_den_life: `Generate DEN-LIFE descriptions for DinoBot's den-and-burrow path — who is home and what they are doing in the burrow right now. Each is ONE comma-separated line, 20-35 words.

THE BAR: playful, adventurous, vivid, clever. This is the WARMTH of the picture — a home with somebody in it. Tender, funny, or cosy beats solemn every time.

Variety mandate:
- ~20% A heap of hatchlings asleep in a tangle, one upside down, one with its head on another's back
- ~15% A parent curled around the nest hollow, body making the wall of the room
- ~12% One hatchling venturing up the tunnel toward the light while the others watch from the dark
- ~10% A parent squeezing in through a tunnel plainly too small for it, shoulders scraping the roof
- ~10% Hatchlings tumbling and play-wrestling in the floor litter, dust up in the light
- ~8% A parent grooming or nosing a hatchling, the hatchling squirming
- ~8% One hatchling asleep in a ridiculous spot — wedged in a root fork, on top of a sibling, half out of the nest
- ~7% A juvenile too big for the den now, folded awkwardly into a chamber it has outgrown
- ~5% A parent asleep with hatchlings piled on top of it
- ~5% Empty of adults, hatchlings alone and alert, all heads turned the same way toward the tunnel

EVERY ENTRY INCLUDES:
- WHO is present (a parent, a clutch of hatchlings, a juvenile) and HOW MANY
- WHAT THEY ARE DOING, as an active verb, mid-moment
- ONE TENDER OR FUNNY DETAIL that makes it a family rather than a specimen

HARD RULES:
- NO humans. NO death, NO blood, NO predation, NO distress. This is a safe warm home.
- Feathered and scaly body plans both welcome; say which so Flux renders a dinosaur.
- Describe only what IS present. Never write a negation.

Output: ONE den-life beat per line. No numbering. No quotes.`,

  dinobot_den_surface: `Generate SURFACE-ABOVE descriptions for DinoBot's den-and-burrow path — the world at ground level immediately above or outside the burrow, glimpsed as part of the same continuous shot. Each is ONE comma-separated line, 20-32 words.

WHY THIS AXIS: an underground chamber with a tunnel mouth needs the world beyond that mouth to read as ONE continuous space, not a separate pasted-in panel. So this axis describes what is visible THROUGH the opening, as part of the same unbroken frame.

THE BAR: vivid, beautiful, clever. Saturated colour and dramatic light in the world above, so the tunnel mouth reads as a blazing window.

Variety mandate:
- ~20% Fern and cycad undergrowth crowding right up to the entrance, fronds leaning in over the lip
- ~15% A hot open plain beyond, bleached bright, heat shimmer above the grass
- ~12% A river running past the bank the den is dug into, light off the water
- ~10% Deep forest, the ground dappled, a single hard shaft coming down near the mouth
- ~10% Rain falling on the world above, water running over the lip and beading on the roots
- ~8% Dawn or dusk colour filling the opening, the entrance a disc of orange
- ~8% A dune slope above with sand trickling over the entrance edge in a thin stream
- ~7% Snow or frost on the world above, breath visible at the mouth
- ~5% Blossom or seed-fluff drifting past the opening and settling inside
- ~5% Something large passing at a distance above, legs only, seen from below through the mouth

EVERY ENTRY INCLUDES:
- THE WORLD ABOVE, specifically, and its LIGHT
- HOW IT MEETS THE OPENING — fronds leaning in, water running over the lip, sand trickling, light spilling down the tunnel floor
- It reads as one continuous shot: the same camera sees the chamber and the world through the mouth

HARD RULES:
- NO humans, NO structures, NO paths, NO modern anything.
- Describe only what IS present. Never write a negation.

Output: ONE surface description per line. No numbering. No quotes.`,

  dinobot_courtship_arena: `Generate DISPLAY-ARENA descriptions for DinoBot's courtship-display path — the STAGE the display happens on. Each is ONE comma-separated line, 25-40 words.

WHY THIS POOL EXISTS: the path first REUSED the paleo-landscape biome pool, which is written landscape-first. A vast empty dune field is a magnificent landscape and a terrible stage — the draws that rolled one came back as a lone animal standing in flat monochrome sand. A display needs an ARENA: enclosed enough to hold a gathering, vivid enough to be worth looking at.

THE BAR (Kevin's motto, 2026-09-22): playful, adventurous, VIVID, beautiful, clever. Saturated committed colour and dramatic light, never muted and never tasteful-grey. Every entry carries ONE CHARM DETAIL that makes it that arena and no other. Show something unseen, or something familiar redressed as something more interesting.

Variety mandate (rotate widely):
- ~15% A lek worn bare by generations — packed earth, a ring of scrapes, the vegetation beaten back in a rough circle
- ~12% A river sandbar or shingle spit, water on both sides, the far bank rising in layers
- ~12% A fern clearing in tall forest, light coming down in hard columns through the canopy gap
- ~10% A volcanic ash flat with steam venting from fissures, colour banded into the crust
- ~10% A bloom-covered meadow at full flower, colour to the horizon, seed-heads at knee height
- ~10% A tidal mudflat at low water, a perfect mirror under a huge sky
- ~8% A lakeshore with the water gone still, reeds at the margin
- ~8% A rock amphitheatre — a natural bowl of tiered stone, an obvious stage floor
- ~8% A forest gap where a giant has fallen, the trunk itself the stage
- ~7% A high saddle between ridges with cloud pouring through below

EVERY ENTRY INCLUDES:
- THE GROUND underfoot, specifically, because the display churns it (packed earth, wet shingle, ash crust, deep bloom, cracked mud, moss)
- AN ENCLOSING EDGE that makes it a stage rather than an emptiness — a treeline, a bank, a ridge, a rock wall, reeds, cloud
- ONE VIVID CHARM DETAIL: steam curling from a fissure, a mirror-perfect reflection, one impossibly huge fallen trunk, a drift of blossom caught in a hollow, hot colour banded through the crust, fireflies already up at dusk, a cloud-river pouring over the saddle
- ROOM FOR SEVERAL ANIMALS. This arena has to hold a displayer plus onlookers, so it reads as a place with a floor, not a distant panorama.

HARD RULES:
- NO humans, no people, no observers. Earth 66 million years before humans.
- NO modern anything: no fences, no structures, no signage, no paths.
- NO glowing/magical/bioluminescent terrain. Real geology and real plants, vividly lit.
- Mega-flora is welcome (tree ferns, cycads, araucaria, horsetails at scale) and makes it unmistakably Mesozoic.
- Describe only what IS present. Never write a negation.

Output: ONE arena per line. No numbering. No quotes.`,

  dinobot_courtship_feature: `Generate DISPLAY-ANATOMY descriptions for DinoBot's courtship-display path — the SIGNATURE DETAIL the whole shot is about. Each is ONE comma-separated line, 20-35 words.

This is the money-shot axis: the piece of anatomy actively doing the displaying, described so a viewer can see how it works.

Variety mandate:
- ~20% A crest, in colour and translucence — backlit so the blood vessels read through it
- ~15% A frill or shield, patterned with eye-spots, rings or banding that only shows when angled
- ~15% Feather structures — fan vanes catching light, iridescent sheen shifting across them, barbs separating
- ~12% An inflated sac — skin stretched thin and glossy, colour deepening as it fills
- ~10% A sail or spine-row, membrane between the spines lit from behind
- ~8% Horn, boss or brow detail, worn and scarred from previous seasons
- ~8% A dewlap or wattle in motion, swinging with the head
- ~7% Skin flush — a colour change spreading across the face, snout or flank in real time
- ~5% A tail structure — club, spike-fan, banded underside flashed upward

EVERY entry includes:
- THE STRUCTURE named concretely
- HOW THE LIGHT INTERACTS with it (backlit / translucent / iridescent / wet-gloss / rim-lit)
- ONE TEXTURE OR WEAR detail (pebbled skin, scars, moulting edges, dust caught in the barbs)

HARD RULES:
- Real animal anatomy and real pigment. NO glow, NO bioluminescence, NO metallic or jewelled surfaces.
- NO humans, NO anthropomorphism, NO facial expressions that read human.
- Describe only what IS present. Never write a negation.

Output: ONE anatomy detail per line. No numbering. No quotes.`,

  dinobot_courtship_audience: `Generate AUDIENCE / CONTEXT ACCENT descriptions for DinoBot's courtship-display path. Each is ONE comma-separated line, 15-30 words, describing the small secondary element that gives the display a REASON.

A display aimed at nothing reads as a random pose. This axis supplies who it is FOR. The element is SMALL — 3-10% of frame, in the midground or at a foreground edge.

Variety mandate:
- ~25% The intended mate, watching — head turned, attention plainly on the displayer, unimpressed or interested
- ~15% A rival at a distance, watching and not yet committing
- ~12% Several onlookers of the same species loosely gathered, a lek forming
- ~10% A conspicuously bored onlooker grazing, ignoring the whole performance
- ~10% Ground evidence of the ritual — a scraped arena, flattened vegetation, a trampled ring, old scrape marks
- ~8% A juvenile watching and clumsily copying the posture
- ~8% Another species passing through, indifferent
- ~7% A small animal displaced by the commotion — a lizard darting, insects lifting, a small pterosaur flushed
- ~5% Evidence of a previous contest — a shed feather, a broken frond, a churned patch

EVERY entry includes:
- WHAT the element is
- POSITION (midground / foreground edge / deep distance)
- ITS ATTENTION or lack of it, stated as a posture

HARD RULES:
- NO humans, NO people, NO observers of any kind.
- NO fighting, NO injuries, NO carcasses.
- Describe only what IS present. Never write a negation.

Output: ONE accent per line. No numbering. No quotes.`,

  // ── amber-forest (2026-09-23) ───────────────────────────────────────────────────────────────
  // THE DELIGHT ANGLE: DinoBot's whole landscape register is VISTAS (canyon, coast, plain,
  // volcanic, snowline, desert). It has no path whose hero is a MATERIAL and its OPTICS. A
  // Mesozoic resin forest is a real, science-true, famous place that almost nobody has ever been
  // shown as a PLACE rather than as a museum specimen in a jeweller's case.
  //
  // THE DULL FAILURE THIS PATH DRIFTS TOWARD: "a brown forest with orange goo on some trunks."
  // Two guards run through every recipe below.
  //   (a) AMBER IS ALREADY DINOBOT'S SATURATION WORD — measured 167 of 200 entries (84%) of
  //       DINOBOT_PALEO_LANDSCAPE_BIOME contain "amber". So a path whose SUBJECT is amber has to
  //       earn it through OBJECTS AND OPTICS, never through the adjective. "amber light",
  //       "golden haze" and "warm golden glow" as standalone atmosphere are banned in every
  //       recipe here; resin is written as a PHYSICAL SUBSTANCE with volume, surface and
  //       contents.
  //   (b) RESIN'S DELIGHT IS THAT IT IS A LENS AND A TRAP. Not sap on bark — what the resin does
  //       to light passing through it, and what is stuck inside it forever.
  //
  // ⚠️ NEVER WRITE "STAINED GLASS" IN ANY OF THESE POOLS OR IN THE TEMPLATE. A hanging resin
  // sheet is the obvious thing to call a window of dirty stained glass, and "stained glass" is a
  // documented EMBLEM/TEXT prior on this fleet (PixelBot ice-cavern rendered a carved-relief
  // charm as a centred heraldic emblem and BUILT A MASONRY WALL to carve it into; SteamBot's
  // "blank enamel dial" shipped roman numerals). Describe the sheet by WHAT IT HOLDS — the
  // smeared doubled forest behind it and the thing trapped inside it — never by a glazing
  // tradition.

  dinobot_amber_grove: `Generate RESIN-FOREST GROVE descriptions for DinoBot's amber-forest path — the Mesozoic conifer forest that BLEEDS, written as a LANDFORM and a stage. Each is ONE comma-separated line, 30-45 words.

THE BAR (Kevin's motto): playful, adventurous, VIVID, beautiful, clever. Saturated committed colour and dramatic light, never muted, never a monochrome brown wood. Every entry carries ONE CHARM DETAIL that makes it THAT grove and no other. Ask of every entry: is this the obvious version of a resin forest, or the surprising one? Write the surprising one.

LEAD WITH THE GROVE'S DEFINING MASS. The first words name the shape of the forest itself, because the first-named noun is what gets rendered. A grove with no stated massing renders as the same generic wood every time.

NAME THE MASSING EXPLICITLY, and rotate it hard (no two entries share a massing):
- ~16% A colonnade of enormous straight resin-glazed trunks receding in uneven ranks, wildly different girths, none of them in a row
- ~12% ONE colossal buttressed conifer filling most of the frame, its flanks running with flows, the rest of the forest small behind it
- ~12% A leaning crooked grove on a slope, trunks all tilted the same way, resin running down the low side of every one
- ~10% A blowdown tangle where a giant has come over, its snapped stump weeping in sheets, the crater of its root-plate open
- ~10% A narrow gap between two close trunks, the space between them hung with resin, the forest beyond showing through
- ~10% A terrace of stepped ground with the trunks standing at three different heights, flows joining downhill
- ~8% A clearing floor littered with hardened resin nodules like scattered marbles, the ring of trunks around it
- ~8% A shallow creek cut through the roots, hardened resin lumps rolled smooth in its bed like pebbles
- ~7% A hollow burnt-out giant still standing, resin boiling out of the scorched side in fresh bright runs
- ~7% A dense understorey of tree ferns and cycads under the resin trunks, the canopy far above nearly closed

EVERY ENTRY INCLUDES:
- THE MASSING, first, in plain shape words (a colonnade, a single giant, a leaning slope, a blowdown, a gap, a terrace)
- THE TREES named as real Mesozoic conifers: Araucaria monkey-puzzle with whorled branches, tall Cheirolepid conifers, Agathis-like kauri giants, scaly-barked podocarps, with ginkgo, cycads, tree ferns and horsetails below
- THE FLOOR underfoot, specifically: deep rust needle-litter, emerald moss cushions, bare grey mud, fallen cones, a creek of clear water, a carpet of resin nodules
- THE FOREST'S OWN COLOUR beyond the resin: black-green needle shade, rust-red bark, emerald moss, silver lichen, blue-grey depth between trunks
- ONE VIVID CHARM DETAIL: a trunk whose whole flank is one smooth glaze you could see your face in, a cone stuck fast halfway down a flow, a row of old flows hardened into ribs like organ pipes, a beetle-bored hole with a bead swelling out of it, claw-scores across a resin scar, a sapling growing straight out of a resin-cemented crack
- THE VANTAGE, at the very end, stated as where the CAMERA stands: "seen from the litter looking up the flank", "seen along the colonnade from between two trunks", "seen low across the nodule floor", "seen from inside the hollow looking out"

HARD RULES:
- NO humans, no people, no structures, no tools, no modern anything. Earth 66 million years before humans evolved.
- NO glowing, bioluminescent or magical anything. Real resin, real trees, real daylight.
- NEVER the words "stained glass", "window pane", "cathedral window", "sign", "marking", "glyph" or "carving".
- NEVER "amber light", "golden haze" or "warm golden glow" as the atmosphere — the resin is an OBJECT here, not a colour wash.
- NO fossil, no museum, no specimen jar, no excavation, no polished gemstone framing. This is a LIVING forest.
- ⚠️ SUBSTRING BAN COLLISION — DinoBot's engine runs a RAW SUBSTRING check over your text (bot.bannedPhrases) and HARD-FAILS the render with nothing stored if it matches. There are no word boundaries, so a longer word that merely CONTAINS one of these kills the render: "man ", "woman", "human", "person", "people", "child", "hunter", "explorer", "scientist", "ranger", "tourist". Measured at 3 of 16 renders before this rule: "harvestman" (contains "man ") and "personally" (contains "person"). So write "harvest-spider", never "harvestman"; "plainly", never "personally".
- Describe only what IS present. Never write a negation.

Output: ONE grove per line. No numbering. No quotes.`,

  dinobot_amber_resin_event: `Generate RESIN-FORMATION descriptions for DinoBot's amber-forest path — the SIGNATURE MONEY-SHOT axis. Each entry is ONE specific mass of conifer resin: its VOLUME, its SURFACE STATE, WHERE IT SITS IN THE FRAME, and how it is CROPPED. ONE comma-separated line, 30-45 words.

THIS AXIS IS THE WHOLE PATH. A frame where the resin is only a colour, or only a coating on bark, has no identity. The resin must read as a THING WITH THICKNESS standing in the near foreground — something with real weight and volume you could lean a trunk-sized shadow against.

THE BAR: playful, adventurous, VIVID, beautiful, clever. Show people something they have never been shown. Resin is a substance almost nobody has seen as scenery: it stretches, it sags, it skins over, it traps, it cracks, it goes cloudy, it catches grit, it holds its own weather.

STATE WHERE IN THE FRAME IT SITS AND GIVE IT A CROP. A big near foreground object that is named without a position and a crop renders as a small prop in the middle distance. So: name it plainly, say where in the frame it sits, and let it RUN OFF AN EDGE. For example "hanging across the whole left half and running off the top and bottom edges", "filling the lower third and out past both sides", "arcing across the upper corners".

Variety mandate (rotate widely — one formation per entry, never a collage):
- ~14% A FRESH FLOW still moving, thick and slow as poured honey, a visible bulging leading edge, a skin already wrinkling on top where it has begun to set
- ~12% A HANGING SHEET stretched between two trunks like a sagging curtain, thick enough to distort everything behind it, its bottom edge heavy and rolled
- ~12% A HARDENED BOULDER at the base of a trunk, cloudy and crazed with internal cracks, its outside dulled with dust and stuck grit
- ~10% A STRETCHED THREAD frozen mid-fall, a long taut strand from a branch with a heavy drop still hanging at its end
- ~10% A BEAD ROW along the underside of a branch, drops at wildly uneven spacing — some crowded almost touching, some far apart, sizes all over — each one a tiny round lens
- ~10% A TORN SCAR on a trunk, the old crust dull and dark and chewed open, the fresh stuff welling out through it bright and wet
- ~8% A LOPSIDED ACCUMULATION of old flows piled onto each other at no regular interval, no two lobes the same size and none of them level, each a different clarity and colour
- ~8% A POOL on the ground where a flow has run off the trunk and spread flat, its surface skinned over and dusted with needles
- ~8% A SPLIT NODULE on the litter, the outside a dull cracked lump, the freshly broken face inside water-clear
- ~8% A GLAZED FLANK where a whole face of the trunk is one smooth continuous coat, wet-looking and mirror-bright

EVERY ENTRY INCLUDES:
- ITS VOLUME said physically: how thick, how heavy, how much of it — "as deep as a cone is long", "as thick as a tree-fern's trunk", "a boulder the size of a crouching animal", "a sheet a metre across". SCALE IS ALWAYS MEASURED AGAINST THINGS IN THIS WORLD (a cone, a needle, a frond, a trunk, an animal), NEVER against a body part — this is a no-humans bot and a body-part scale unit puts that body part in the frame.
- ITS SURFACE STATE, specifically: wet and mirror-bright, skinned over and matte, wrinkled where it set, crazed with cracks, dusted with needles and grit, pitted by rain, sticky and pulling threads
- ITS COLOUR RANGE said as a substance, not a light: pale honey, dark treacle, greenish-clear at the thin edge and near-black where it is thickest, milky where it has clouded, rust where bark is suspended in it
- WHERE IN THE FRAME IT SITS AND ITS CROP, at the end of the entry
- ONE CHARM DETAIL of the material itself: a bubble the size of a grape stopped halfway up, a crack that has healed with a paler seam, a single needle standing straight up out of the skin, a run that split around a knot and rejoined below, one corner gone opaque white like frost

⚠️ NO REGULAR REPEATING GEOMETRY. Resin piles up unevenly and it never comes out level. An entry that instructs a regular series — "layer on layer", "eight distinct layers", "each layer's edge a clean overhang", "drops at even spacing", "progressively larger from left to right" — renders as a manufactured object: a tapering tower of identical rings, a stack of doughnuts, a row of matched baubles (measured twice, both "tiered stack" draws). So every mass is LOPSIDED: name the lobes as different sizes, off-centre, none of them level, the fresh run spilling down ONE side only.

HARD RULES:
- NO humans, no people, no tools, no touching. Earth 66 million years before humans evolved.
- NEVER the words "stained glass", "window pane", "cathedral window", "jewel", "gemstone", "polished stone", "sign", "marking", "glyph", "carving" or "engraved". A simile like "as a jewel" gets rendered LITERALLY as a gem.
- ⚠️ NAME THE ATTACHMENT FIRST, ALWAYS. A detached mass with air all round it renders as a MANUFACTURED CURIO — a polished slab standing on the litter, a paperweight dome on a stump, a mineral geode (measured at 3 of 6 renders before this rule). So every mass opens by saying what holds it: welded to the bark where it grew, swelling out of the trunk base, half-buried in the needle-litter, lying against a root, sunk into the floor with moss creeping up one flank. Forest debris is STUCK to it — needles pressed into the crust, a twig on its damp underside, litter banked against one side, a fern stem growing past it.
- NO pedestal, NO plinth, NO stand, NO display, NO polished or cut face: the resin is attached to a tree or lying in the forest floor, never presented on something.
- NO glowing, no bioluminescence, no magic, no internal light source. Resin is lit from OUTSIDE, by daylight.
- NO fossil, no specimen, no museum display, no jewellery, no cut-and-polished amber.
- NEVER "amber light", "golden haze" or "warm golden glow" — this axis describes a SUBSTANCE, never an atmosphere.
- ⚠️ SUBSTRING BAN COLLISION — DinoBot's engine runs a RAW SUBSTRING check over your text (bot.bannedPhrases) and HARD-FAILS the render with nothing stored if it matches. There are no word boundaries, so a longer word that merely CONTAINS one of these kills the render: "man ", "woman", "human", "person", "people", "child", "hunter", "explorer", "scientist", "ranger", "tourist". Measured at 3 of 16 renders before this rule: "harvestman" (contains "man ") and "personally" (contains "person"). So write "harvest-spider", never "harvestman"; "plainly", never "personally".
- Describe only what IS present. Never write a negation.

Output: ONE resin formation per line. No numbering. No quotes.`,

  dinobot_amber_trapped: `Generate TRAPPED-INSIDE descriptions for DinoBot's amber-forest path — what is caught in the resin forever, how DEEP it sits, and how clearly it reads. This is the CLEVER axis: it is the detail that makes the picture a story rather than a texture. Each is ONE comma-separated line, 20-35 words.

THE BAR: playful, adventurous, vivid, clever. Every entry is a tiny piece of comedy or wonder frozen mid-event. The obvious version is "an insect in amber". The surprising version is an insect caught IN THE MIDDLE OF DOING SOMETHING, or a thing nobody would think of as trappable.

EVERY ENTRY NAMES THREE THINGS: WHAT is trapped, HOW DEEP it sits (just under the surface / a needle's length in / far in and gone soft-edged / pressed right against the surface), and WHAT IT WAS DOING when it stopped. SCALE AND DEPTH ARE MEASURED AGAINST THINGS IN THIS WORLD (a needle, a cone, a frond), NEVER against a body part — this is a no-humans bot and a body-part scale unit puts that body part in the frame.

Variety mandate (rotate widely):
- ~16% A giant dragonfly with a wingspan as wide as a cycad frond, stopped mid-wingbeat, both wings still open, every vein visible
- ~12% A whole small feathered dinosaur deep inside a hardened mass, only a dark shape and one clawed foot pressed flat against the surface
- ~10% A fern frond swallowed by a fresh flow, still green inside it while the fronds outside have all browned
- ~10% A tiny insect climbing UP a hanging thread to escape, still going, halfway out
- ~8% A line of ants caught in single file, the leaders already deep and the stragglers only half in
- ~8% A whole spider with a fly already in its jaws, both of them stopped together
- ~8% A single down feather standing upright inside a clear lump, its barbs perfectly separate
- ~7% A lizard's shed tail, still curled, suspended with nothing else around it
- ~7% Two beetles nose to nose mid-argument, legs braced against each other
- ~7% A cluster of conifer pollen and one whole seed-cone, suspended at different depths like things in water
- ~7% A tree frog with a foot splayed against the inside of the surface, its pale belly flat to the glass-smooth face

EVERY ENTRY INCLUDES:
- WHAT is trapped, named as a real Mesozoic creature or plant part: giant odonate dragonfly, long-horn beetle, lacewing, ant, harvestman, spider, cockroach, mayfly swarm, small feathered theropod, gecko-like lizard, tree frog, fern frond, conifer needles, seed-cone, a single feather, flower, pollen cloud
- HOW DEEP, stated plainly
- WHAT IT WAS DOING, as an active verb, mid-event: mid-wingbeat, mid-stride, climbing, spreading its wings, biting, reaching, falling, still gripping
- ONE CHARM DETAIL that makes it that inclusion and no other: one wing crumpled and the other perfect, a thin bubble-trail behind it showing the path it struggled along, its own shadow cast through the resin onto the bark behind, the resin gone slightly cloudy in a halo just around it, one leg left outside the surface

HARD RULES:
- NO humans, no people, no hands, no tools. Earth 66 million years before humans evolved.
- NO gore, NO blood, NO suffering, NO distress language. These are things quietly and beautifully stopped, the way real inclusions look.
- NEVER the words "stained glass", "jewel", "gemstone", "specimen", "museum", "fossil", "display case", "sign", "marking" or "engraved".
- NO glowing, no bioluminescence, no magic.
- ⚠️ SUBSTRING BAN COLLISION — DinoBot's engine runs a RAW SUBSTRING check over your text (bot.bannedPhrases) and HARD-FAILS the render with nothing stored if it matches. There are no word boundaries, so a longer word that merely CONTAINS one of these kills the render: "man ", "woman", "human", "person", "people", "child", "hunter", "explorer", "scientist", "ranger", "tourist". Measured at 3 of 16 renders before this rule: "harvestman" (contains "man ") and "personally" (contains "person"). So write "harvest-spider", never "harvestman"; "plainly", never "personally".
- Describe only what IS present. Never write a negation.

Output: ONE inclusion per line. No numbering. No quotes.`,

  dinobot_amber_optics: `Generate RESIN-OPTICS descriptions for DinoBot's amber-forest path — what the resin DOES to light passing through it, and what the forest looks like SEEN THROUGH it. This axis replaces the bot's normal lighting slot and it owns the whole palette of the frame. Each is ONE comma-separated line, 22-36 words.

WHY THIS AXIS EXISTS: resin is a LENS. That is the never-seen picture, and it is what stops this path being a brown forest with orange goo on some trunks. Every entry is one real optical behaviour of a thick translucent substance in daylight.

THE BAR: VIVID is literal. Every entry names TWO COLOURS, and at least HALF of them must pit a COOL colour against the honey — black-green needle shade, blue-grey forest depth, cold silver rain-light, violet shadow — because a single warm hue across the whole frame is the exact miss this path is built to avoid. A frame that is one flat orange is a failure even when it is competent.

AXIS-CLEAN: this axis is OPTICS AND COLOUR ONLY. No grove massing, no trees, no creatures, no air-particulate, no weather event. Just what the light does.

Variety mandate (rotate widely):
- ~14% CAUSTICS — light through the resin throwing moving honey-coloured shapes across the bark and the litter, the way light through water moves on a pool floor
- ~12% BACKLIT LIGHTBOX — low sun straight through a thick sheet, the whole sheet lit up from behind and everything inside it reading as a clean dark silhouette
- ~12% DOUBLING AND SMEARING — the forest seen through the resin, pulled sideways and repeated, one trunk arriving as two, edges dragged into streaks
- ~10% INVERSION — a swelling bead acting as a fish-eye lens, holding a whole tiny upside-down image of the canopy above it
- ~10% DEPTH GRADIENT — the thin edge nearly colourless and the thick middle almost black, the whole range in one piece
- ~10% SPECULAR — a hard white highlight skating along a wet flow as bright as a struck match, the rest of the trunk in deep shade
- ~8% CLOUDED SCATTER — an old crazed mass glowing softly all the way through instead of transmitting, like light inside milk
- ~8% SHADOW PROJECTION — a trapped insect's shadow thrown right through the resin and printed large on the bark behind it
- ~8% SPLIT COLOUR — a thin wedge bending daylight into a soft smeared wash of colour along a leaf's own curve, green grading through yellow into red, every transition soft-edged
- ~8% COLD AGAINST WARM — the honey transmission on one side of the trunk against cold blue-grey forest shade on the other, the two meeting on a hard line

EVERY ENTRY INCLUDES:
- THE OPTICAL BEHAVIOUR named plainly: transmitted, backlit, doubled, inverted, scattered, projected, split, reflected
- THE SURFACE IT LANDS ON: bark, needle-litter, moss, a broad frond, the creek, another flow, the animal's flank
- TWO NAMED COLOURS, the honey range plus a second one — and in at least half the entries the second is COOL
- ONE CHARM DETAIL of the optic itself: the caustic shapes drifting as a branch moves in the wind, the silhouette inside the lit sheet having one wing sharp and one blurred by depth, the doubled trunk not quite lining up, the projected shadow bigger than the insect that casts it

HARD RULES:
- NEVER "amber light", "golden haze", "warm golden glow", "golden hour glow" or any standalone warm-atmosphere phrase. Every entry must name the PHYSICAL PATH of the light: through what, onto what.
- ⚠️ NEVER "a ruled band", "its own strip", "each stripe sharp at its border" or any straight-edged geometry for a split colour. Measured: that wording rendered a flat rectangular RAINBOW COLOUR-SWATCH CARD lying on the forest floor — a modern graphic-design object 66 million years early, the same literalization class as "coins of light" rendering real gold coins. Colour lands as a SOFT SMEARED WASH that follows the curve of a real leaf, with no hard edge anywhere.
- NEVER a light source inside the resin. The resin is lit from OUTSIDE by daylight. No glowing, no bioluminescence, no magic, no lamps.
- NEVER the words "stained glass", "window pane", "prism", "jewel", "gemstone", "lens flare", "sign" or "marking". Say "acting as a lens", never "like a jewel" — a simile gets rendered as the literal object.
- NO humans, no people. Earth 66 million years before humans evolved.
- ⚠️ SUBSTRING BAN COLLISION — DinoBot's engine runs a RAW SUBSTRING check over your text (bot.bannedPhrases) and HARD-FAILS the render with nothing stored if it matches. There are no word boundaries, so a longer word that merely CONTAINS one of these kills the render: "man ", "woman", "human", "person", "people", "child", "hunter", "explorer", "scientist", "ranger", "tourist". Measured at 3 of 16 renders before this rule: "harvestman" (contains "man ") and "personally" (contains "person"). So write "harvest-spider", never "harvestman"; "plainly", never "personally".
- Describe only what IS present. Never write a negation.

Output: ONE optical behaviour per line. No numbering. No quotes.`,

  dinobot_amber_air: `Generate GROVE-AIR descriptions for DinoBot's amber-forest path — what the air inside a sheltered, sticky, resin-scented conifer forest is doing. Each is ONE comma-separated line, 15-28 words.

WHY THIS AXIS IS BESPOKE: DinoBot's shared atmosphere pool is written for open water and open country (measured: mirror-flat lakes, mud-flats, sandbars, tidepools, wading animals) and it names whole dinosaurs, which would hijack the frame on the renders where this path deliberately has no animal. A closed grove needs its own air.

AXIS-CLEAN: this axis is THE AIR ONLY. No light colour, no optics, no trees, no resin formations, no creatures as subjects, no big weather event.

THE BAR: vivid and specific. The air in this forest is thick, still, and full of small floating things. Sticky forests smell and hum.

Variety mandate:
- ~15% Conifer pollen drifting in visible clouds, settling on everything sticky
- ~12% Midges and small flies hanging in a loose column, some of them drifting too close to a fresh flow
- ~12% Fine spore-dust and needle-fragments turning slowly in still air
- ~10% Warm damp air after rain, water still dripping from the canopy one drop at a time
- ~10% Cool blue forest shade air, completely still, nothing moving at all
- ~10% Thin resin-smoke shimmer rising off a sun-warmed trunk face in the heat
- ~8% A slow drift of seed-fluff and winged conifer seeds spinning down
- ~8% Faint mist caught low between the trunks, thinning as it rises
- ~8% Dry heat with the air visibly wobbling above the hottest flank
- ~7% A single gust passing through, everything small in the air suddenly moving one way

EVERY ENTRY INCLUDES:
- WHAT IS IN THE AIR, named specifically: pollen, spores, midges, needle-fragments, seed-fluff, winged seeds, water droplets, mist, heat-shimmer
- HOW IT MOVES: hanging, turning slowly, drifting sideways, spiralling down, rising, completely still, all rushing one way
- ONE SMALL CHARM DETAIL: a midge already stuck to a wet surface and still moving one leg, pollen collected in the dip of a set flow, a water drop hanging off the tip of a resin thread and not letting go, seed-fluff glued fast in a bright new run

HARD RULES:
- NO humans, no people. Earth 66 million years before humans evolved.
- NO big weather events (no storms, no lightning, no volcanoes) — the canopy is nearly closed here.
- NO glowing, bioluminescent or magical anything.
- NEVER "amber light", "golden haze" or "warm golden glow" — that is the light axis's job, and it is banned as a phrase anywhere on this path.
- NO named dinosaurs, no whole animals as the subject of the entry. Insects only, and only as things in the air.
- ⚠️ SUBSTRING BAN COLLISION — DinoBot's engine runs a RAW SUBSTRING check over your text (bot.bannedPhrases) and HARD-FAILS the render with nothing stored if it matches. There are no word boundaries, so a longer word that merely CONTAINS one of these kills the render: "man ", "woman", "human", "person", "people", "child", "hunter", "explorer", "scientist", "ranger", "tourist". Measured at 3 of 16 renders before this rule: "harvestman" (contains "man ") and "personally" (contains "person"). So write "harvest-spider", never "harvestman"; "plainly", never "personally".
- Describe only what IS present. Never write a negation.

Output: ONE air state per line. No numbering. No quotes.`,

  dinobot_amber_resident: `Generate RESIDENT-DINOSAUR descriptions for DinoBot's amber-forest path — the animal living in the resin forest, caught mid-action. Each is ONE comma-separated line, 25-40 words.

THE BAR: playful, adventurous, vivid, clever. ADVENTUROUS BEATS STATIC — mid-action over parked, a story beat over a tableau, and comedy is very welcome here. A sticky forest is genuinely funny to live in: things get stuck to you, and you have to deal with it.

THE PATH'S BEST JOKE, and it should appear often: a dinosaur that has brushed against a fresh flow and walks away with a glittering stripe down its flank, bark and needles and one dead beetle stuck to it, mildly annoyed.

Variety mandate (rotate widely):
- ~16% Walking away from a trunk with a bright sticky stripe down its flank and litter glued to it, shaking one leg
- ~12% Mid-scratch against a resin-scarred trunk, the old crust crumbling off and fresh stuff welling out where it rubbed
- ~10% Nosing right up to a hanging sheet, its own face distorted and doubled in the thick resin an inch from it
- ~10% A small feathered theropod picking trapped insects off the surface of a set flow, one foot braced on the trunk
- ~10% Licking or chewing at a resin scar, jaw working, plainly finding it a mistake
- ~8% Stepping high and carefully over a resin pool on the floor, one foot lifted, entirely aware of what it is avoiding
- ~8% A juvenile with a resin bead stuck to the top of its snout, trying to rub it off on a fern
- ~8% Standing in a shaft of light coming through a resin sheet, honey-coloured shapes drifting across its hide
- ~8% Sleeping curled against a warm resin-glazed trunk flank, one eye half open
- ~10% Two of the same species together, one busy at the resin and one watching it with visible opinion

EVERY ENTRY INCLUDES:
- THE BODY PLAN said before any Latin name, so the right silhouette renders: "a feathered raptor like Velociraptor", "a duck-billed hadrosaur with a broad flat toothless beak", "a horned ceratopsian with a bony neck-frill", "a long-necked sauropod", "a large theropod like a T-rex", "a low-slung armoured ankylosaur"
- ITS SIZE against the grove, plainly: turkey-sized, as tall as the tree ferns, its shoulder level with the lowest branches
- ITS HIDE OR PLUMAGE in real animal colour and pattern: barred rust and cream, iridescent green-black, sandy with dark spots, slate grey with a pale throat, a crest of stiff quills, a banded tail
- WHAT IT IS DOING, an active verb, mid-motion
- ONE CHARACTERFUL DETAIL that makes it a personality instead of a specimen: a wrinkled eye-ridge, a cocked head, a curled lip, one foot still lifted, needles caught in its feathers

HARD RULES:
- NO humans, no people. Earth 66 million years before humans evolved.
- NO hunting, NO predation, NO blood, NO fighting, NO distress, NO animal trapped or dying in the resin. The resin is an inconvenience and a curiosity, never a threat.
- Real animal colour: no glowing, no metallic, no jewelled, no neon.
- NEVER the words "jewel", "gemstone", "fossil", "specimen" or "museum".
- ⚠️ SUBSTRING BAN COLLISION — DinoBot's engine runs a RAW SUBSTRING check over your text (bot.bannedPhrases) and HARD-FAILS the render with nothing stored if it matches. There are no word boundaries, so a longer word that merely CONTAINS one of these kills the render: "man ", "woman", "human", "person", "people", "child", "hunter", "explorer", "scientist", "ranger", "tourist". Measured at 3 of 16 renders before this rule: "harvestman" (contains "man ") and "personally" (contains "person"). So write "harvest-spider", never "harvestman"; "plainly", never "personally".
- Describe only what IS present. Never write a negation.

Output: ONE resident per line. No numbering. No quotes.`,
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
