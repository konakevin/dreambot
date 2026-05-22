#!/usr/bin/env node
/**
 * Generate a BrickBot axis pool using Sonnet.
 *
 * Bespoke pirate recipes for the 2026-05-22 axis-system migration of the
 * pirates path. Anchored on Pirates of the Caribbean LEGO sets, Bricklink
 * AFOL pirate dioramas, vintage LEGO Pirates (Black Seas Barracuda etc.),
 * and Treasure Island / Master & Commander narrative beats. Per the
 * `feedback_each_path_bespoke_not_cloned.md` rule: every recipe here is
 * pirate-bespoke, not cloned from any other bot's gen script.
 *
 * Infrastructure (signatureOf / dedupe / target-loop) mirrors
 * gen-mechbot-pool.js + gen-dragonbot-pool.js.
 *
 * Usage:
 *   node scripts/gen-brickbot-pool.js --pool brickbot_pirates_scene_type --target 50
 *   node scripts/gen-brickbot-pool.js --pool brickbot_pirates_ship_class --count 25
 *
 * Output: scripts/bots/brickbot/seeds/<pool>.json
 */

const fs = require('fs');
const path = require('path');
const { SONNET } = require('./lib/models');

function readEnvFile() {
  try {
    const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
    const env = {};
    for (const line of lines) {
      const eq = line.indexOf('=');
      if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}
const env = readEnvFile();
const ANTHROPIC = process.env.ANTHROPIC_API_KEY || env.ANTHROPIC_API_KEY;
if (!ANTHROPIC) {
  console.error('ANTHROPIC_API_KEY missing');
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (n, fb) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : fb; };
const has = (n) => args.includes('--' + n);
const POOL = flag('pool', null);
const COUNT = parseInt(flag('count', '25'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — BrickBot pirates path (2026-05-22)
// Bespoke per-path; NOT cloned from other bots' recipes.
// Canon: POTC LEGO sets + Bricklink AFOL pirate dioramas + vintage LEGO
// Pirates (Black Seas Barracuda / Skull's Eye Schooner / Brickbeard's
// Bounty) + Treasure Island + Master & Commander.
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {

  // ─── scene_type — narrative stage (the WHAT) ───
  brickbot_pirates_scene_type: {
    format: 'simple',
    theme: `LEGO MOC PIRATE DIORAMA SCENE STAGES — narrative-stage descriptions for the BrickBot pirates axis system. Each entry is ONE narrative stage (the WHAT — what category of pirate moment is this diorama?). Each entry 30-55 words.

⚠️ CRITICAL — entries describe the STAGE / SETTING / NARRATIVE CATEGORY only. NO camera framing language. NO minifig action verbs (those belong to a separate axis). NO build technique vocab. NO weather. Just: where are we, what kind of moment.

VARIETY MANDATE — distribute the entries across these narrative categories (target ~5-10% per category):
  • SHIP-ON-SHIP COMBAT — broadside cannonade / boarding-action / chase / fireship attack
  • TREASURE DISCOVERY — cave reveal / shipwreck salvage / x-marks-spot dig / hidden vault / cursed-chest opening
  • HARBOR / PORT LIFE — dockside loading / tavern stand-off / smuggler's cove / market chaos / black-market deal
  • CREW LIFE ABOARD — galley meal / belowdecks gambling / sail-mending / navigator working charts / capstan-hauling
  • CURSED / SUPERNATURAL — Davy Jones' Locker / ghost-ship encounter / cursed-crew transformation / Kraken summoning
  • SEA-MONSTER ATTACK — Kraken-arms wrapping hull / megalodon-leap / sea-serpent rising / phantom-fleet breach
  • NAVY / IMPERIAL CONFRONTATION — Royal Navy chase / flagship-vs-pirate stand-off / governor's-fleet blockade / court-martial deck
  • ISLAND HIDEOUT / EXPLORATION — jungle base reveal / lagoon-grotto entry / treasure-island landing / native encounter
  • MUTINY / CREW POLITICS — captain-overthrow mid-deck / pistol-duel-at-dawn / blackballed-into-rowboat-set-adrift / new-captain coronation
  • SHIPWRECK / SURVIVAL — beached-on-reef rescue / castaway raft / iceberg-impact / storm-survival lash-down
  • PARLEY / DIPLOMACY — pirate-council neutral-ground / flag-of-truce exchange / hostage-negotiation aboard / wedding-of-rival-captains
  • CHASE — predator-chase storm-pursuit / running-from-frigate-through-shoals / outsmart-via-reef / lure-into-trap

Each entry must:
• Name the narrative category in first 6-10 words
• Establish the diorama STAGE (deck / cave / dock / island / open sea / belowdecks / harbor / shipwreck / locker)
• Suggest the TENSION or STAKES of the moment (without prescribing the action verb)
• NEVER name a specific minifig action (no "captain swinging cutlass"; that's the minifig_action axis)
• NEVER name a specific weather event (no "storm-tossed waves"; that's the weather_drama axis)`,
    touchpoints: [
      'SHIP-ON-SHIP BROADSIDE COMBAT — two galleons locked in close-range cannonade, hulls less than a brick-length apart, gunports both decks alight with trans-orange flame elements, splintered hull-fragments mid-flight between vessels, the moment before the boarding lines launch',
      'TREASURE CAVE DISCOVERY — vast brick-built grotto interior with shafts of light from collapsed ceiling, mounded gold doubloons + jeweled chests + ceremonial weapons stacked waist-high, ancient skeletons in rotted finery propped against treasure-piles, a rope ladder descending from the ceiling-gap',
      'HARBOR DOCKSIDE TAVERN STAND-OFF — narrow brick-built dock between warehouse and a moored sloop, hanging tavern-sign creaking, lantern-lit windows, crates and barrels stacked tight, a pirate crew and a Royal Navy patrol facing off in the wedge between buildings',
      "DAVY JONES' LOCKER — ethereal underwater shipwreck graveyard, half-rotted galleon hulls leaning at impossible angles on the seafloor, drifting kelp + skeletal fish, trans-clear water-haze layered overhead, anchored hulls coral-encrusted, a faint phosphorescent glow",
      'KRAKEN ATTACK — colossal brick-built tentacles in trans-dark-green emerging from the brick-water around a three-masted galleon, suckers visible, tentacles wrapping the mainmast and the bowsprit, crew scattering across the deck, masthead-lanterns swinging wildly',
      "ROYAL NAVY FLAGSHIP STAND-OFF — a Royal Navy frigate in formal-white-with-red-trim hull-paint with all gun-ports open, broadside-on across two brick-length of open sea from a black-hulled pirate galleon flying the Jolly Roger, the moment of pre-engagement parley",
      'JUNGLE HIDEOUT REVEAL — pirate base hidden in dense brick-built jungle on a steep island slope, waterfall in trans-blue layered plates cascading past, ramshackle huts and a careened sloop being scraped of barnacles, jungle-canopy rigged with rope-walks',
      "MUTINY ON THE QUARTERDECK — pirate crew arrayed across the quarterdeck in a tense semicircle, captain alone at the rail flanked by two loyal officers, the moment-before-violence freeze with hands moving toward weapons, dawn-fog rolling across the deck",
      'SHIPWRECK SALVAGE — half-buried hull of an old wreck broken-back on a reef-island, sea-eroded ribs exposed, crew lowering barrels and chests from the canted deck to a longboat below, surf foaming around the wreck-base, gulls perched on the stern',
      'PIRATE-COUNCIL PARLEY — three pirate captains standing on a neutral-ground sandbar at low tide, each flanked by their crew, ships-at-anchor visible in the deeper water beyond, brick-built parley-flag pole between them with white pennant',
      'BURIED-TREASURE DIG — six crew members around a half-excavated pit on a beach with the chest just beginning to emerge from sand, palm trees fringing, parrot perched on a shovel-handle, dawn-light raking sideways across the dig-site',
      'SMUGGLER COVE NIGHT-RUN — small sloop pulling into a hidden cove between cliffs at deep-night, lanterns muffled, crates being passed dock-to-deck in chain-of-hands, the moment when a Royal Navy lantern appears at the cove-mouth',
      'CURSED CREW TRANSFORMATION — pirate crew mid-transition between human and skeleton forms in moonlit water beneath their ship, half-skeleton half-human variants visible, the cursed-chest open on the deck above',
      'CASTAWAY RAFT DRIFT — a single pirate on a brick-built raft of lashed-timbers in glassy open ocean, supplies tied down with rope, sail of tattered shirt, the vast empty horizon dominant',
      'BLACK-MARKET DEAL — narrow dockside alley between warehouse and harbor wall, two crews exchanging chests for crates, a lookout at each end of the alley, lantern-lit and tense, ledger-keeper at a barrel-side desk',
      'SEA-BATTLE BOARDING ACTION — two ships locked together with boarding planks deployed across the gap, crews mid-charge across the planks, smoke from both decks, the moment of impact between the wave of pirates and the defenders on the navy-ship deck',
      'GOVERNOR\'S FLEET BLOCKADE — three Royal Navy ships strung across a harbor mouth in blockade-line, a pirate vessel trapped inside the bay, the moment of decision before the run, harbor town visible behind on a hillside',
      'PIRATE WEDDING ABOARD SHIP — quarterdeck arrayed for a wedding between two pirate captains with their crews gathered, a brick-built arch of crossed-cutlasses and palm-leaves, the moment of vows, ship-flagged in celebratory pennants',
      'CHASE THROUGH SHOALS — pirate sloop running between barely-submerged reef-tops in a tight maze of brick-built shoal-water, a Royal Navy frigate in pursuit beyond the reef-line unable to follow due to draft, the cunning escape mid-frame',
      'CAPTAIN\'S CABIN PLOTTING — interior cutaway of a galleon\'s captain\'s cabin with brick-built oak-paneled walls, charts spread across the table, the captain and first mate poring over a treasure-map, lantern-glow, stern-window showing open ocean',
    ],
    instructions: `Each entry is ONE pirate narrative stage, 30-55 words. Format: "STAGE NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines. STRICT BANS: never include camera framing language ("WIDE / MEDIUM / CLOSE / wide-shot / aerial"), never include minifig action verbs ("captain swinging cutlass / crew hauling"), never include weather events ("storm-tossed / lightning-flash / dense fog"), never include lighting descriptors ("golden hour / candlelit / moonlit"). Those belong to other axes. Stage + tension only.`,
  },

  // ─── minifig_action — verb-led story beats ───
  brickbot_pirates_minifig_action: {
    format: 'simple',
    theme: `LEGO MINIFIG ACTION BEATS — verb-led story moments for the BrickBot pirates path. Each entry is a freeze-frame of minifigs IN MID-ACTION (the story beat), NOT minifigs posing in a setting. Each entry 25-45 words.

⚠️ HARD MANDATE — STORY BEAT MANDATE per the playbook. Every entry MUST start with an ACTIVE VERB and describe a moment with CAUSE + EFFECT in the same frame. Verbs like: leaping, slashing, hauling, lunging, parrying, brandishing, heaving, mid-toss, hurling, swinging, climbing, dragging, lifting, smashing, firing, dodging, falling, catching, rescuing, pinning, escaping, signaling.

⚠️ HARD BANS:
  • NEVER "minifigs standing around"
  • NEVER "captain posing on deck"
  • NEVER "crew watching" / "looking at" / "gazing at" / "wide-eyed at"
  • NEVER "characters arranged in semicircle"
  • NEVER passive states (sitting, resting, waiting, observing)

✓ Body-position variety — distribute across:
  • Mid-leap / mid-fall / airborne (~15%)
  • Mid-swing / mid-strike / mid-parry (sword/axe/club) (~20%)
  • Hauling / lifting / pulling (capstan, rope, rigging, dragging body, raising flag) (~15%)
  • Mid-fire / mid-reload (musket, pistol, cannon, bomb-fuse) (~10%)
  • Climbing / vaulting / running (rigging, rope-ladder, ship-side, rooftop) (~15%)
  • Diving / rescuing / catching (overboard, mid-air, falling-object) (~10%)
  • Multi-figure interaction (duel, brawl, formation-charge, rescue, hand-off) (~15%)

Each entry must:
• Start with an ACTIVE VERB
• Name 1-3 specific minifigs involved (captain, first mate, gunner, lookout, navy officer, cabin boy, etc.) with brief identifier (eye-patch / red-coat / yellow-hat / etc.)
• Describe the SHARED OBJECT or EVENT they're interacting with (cutlass, treasure chest, falling rigging, exploding barrel, kraken tentacle, etc.)
• Imply the moment-before and moment-after (this is a freeze-frame, not a pose)
• PLASTIC SCALE — these are minifigs, so describe their action AS minifig poses (C-shaped hand gripping cutlass, two-stud arms bent at parry-angle, etc.) — never anatomical detail`,
    touchpoints: [
      'Captain mid-leap from rigging to enemy deck, cutlass extended forward in C-grip, hat caught mid-air behind, defender minifig already raising shield in reaction, rope-end whipping back behind the captain',
      'Two crew members hauling on the capstan-bars mid-stride, third crew at the chain feeding it through the hawse-hole, fourth at the rail watching the heavy iron anchor breaking the brick-water surface',
      'First mate parrying a Royal Navy cutlass-strike with their own cutlass, both blades crossed at the brick-built guard, the sailor behind them already swinging a marlin-spike at the second navy attacker',
      'Gunner ramming the cannon-charge home with the rammer, second crew hauling on the gun-tackle to position, third crew with the lit match-cord ready at the touch-hole, all three mid-motion in coordinated reload',
      'Cabin boy mid-toss of a powder-keg with lit fuse trans-orange spark element rising, target enemy crew at the rail in mid-recoil-recognition, falling-arc trajectory implied by their crouch and the boy\'s follow-through',
      'Cursed-skeleton crew member mid-rise from the deck planks, ribcage-torso emerging through fog elements, the human crew member nearby already mid-stumble-backwards with cutlass dropping from their grip',
      'Captain hurling a grappling-hook trans-clear-fishing-line trailing from a C-grip arm, target enemy rail visible across the brick-water gap, second crew member behind already mid-pull on the line ready to haul',
      'Two minifigs in a sword duel mid-parry at the top of the quarterdeck stairs, the loser already mid-backstep with cutlass guard buckling, the winner pressing forward, third character below the stairs frozen mid-watch with hand-on-pistol',
      'Lookout minifig falling from the crow\'s-nest mid-air, mouth-printed in alarm-shout, rope-end whipping past as they pass the mainsail, deck crew below mid-rush toward the impact-point',
      'Crew member at the wheel mid-spin of the helm, body braced against the wheel, captain beside them mid-shout-into-storm with pointing-hand gesturing toward a course-line, navigator behind mid-stride toward the helm with chart in hand',
      'Pirate at the bow mid-leap onto a longboat below, cutlass mid-stab toward a defender mid-fall from the longboat into the brick-water, second longboat-defender mid-draw of a pistol turning toward the leaper',
      'Captain mid-rescue of a falling crew member, leaning over the rail with one C-grip on the rail and the other clenched on the falling sailor\'s wrist, the saved sailor mid-swing of free arm reaching upward, the brick-water below visible',
      'Two minifigs hoisting the Jolly Roger up the main mast, one at the deck pulling the halyard hand-over-hand, the other at the top of the mast guiding the flag into position, the flag mid-unfurl catching the wind',
      'Royal Navy officer mid-fire of a flintlock pistol toward a pirate mid-dodge at the rail, the pistol-flash trans-yellow flame element, the pirate mid-tumble over the side already in motion to roll behind the rail-cover',
      'Crew member mid-vault of the ship\'s rail onto a boarding plank, second crew mid-charge behind them with cutlass overhead, third crew at the rear of the line mid-loose-of-an-arrow toward the defenders',
      'Cook mid-throw of a heavy cooking-pot from the galley-door at a pirate-on-pirate-mutineer at the foot of the stairs, the mutineer mid-duck with arm raised in defense, broth-elements (trans-brown 1×1 round bricks) arcing through the air',
      'Mid-haul on the topsail-halyard by a row of four crew at the mast-base, the sail mid-rise up the mast, sail-trim crew at the yard mid-pull on the sheet-line to set the sail-angle',
      'Captain mid-stab of a cutlass through a chart pinned to the table, mid-shout at the gathered officers around him with finger-pointing at a marked location, navigator mid-recoil with hands up',
      'Two crew members mid-drag of a chest across the sand from the surf-line toward the longboat, third crew at the longboat mid-arms-out to receive the chest, fourth crew at the surf-line mid-scan toward the tree-line for threats',
      "Pirate mid-swing on a rope from the foretop down across the deck, cutlass trailing behind, target navy-officer at the helm mid-turn with sword half-drawn, the rope's anchor-point visible at the foretop with a crew member who released it",
    ],
    instructions: `Each entry is ONE pirate minifig action beat, 25-45 words. Format: free-form prose STARTING WITH AN ACTIVE VERB (Mid-leap / Hauling / Parrying / Hurling / Mid-toss / Climbing / Diving / etc.). Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO "minifigs standing", NO "captain posing", NO "watching" / "looking at" / "gazing", NO passive states. Story beat + verb + cause/effect always.`,
  },

  // ─── build_technique — MOC distinguisher ───
  brickbot_pirates_build_technique: {
    format: 'simple',
    theme: `LEGO MOC BUILD TECHNIQUE — AFOL-distinguishing brick-construction technique notes for the BrickBot pirates path. Each entry is ONE specific MOC technique that makes a pirate diorama read as "Bricklink AFOL convention build" instead of "official LEGO set photo." Each entry 25-45 words.

⚠️ THE BAR — these are the techniques AFOL builders use that win Brickworld + Brickfair Best-of-Show. The viewer who is a LEGO fan should INSTANTLY clock the cleverness.

VARIETY MANDATE — distribute across these technique categories:
  • SNOT (Studs Not On Top) construction — sideways-stud techniques for curves, hull-planking, organic shapes
  • Trans-piece use — trans-blue layered waves, trans-orange flame elements, trans-clear ice, trans-green poison, trans-yellow lantern-glow
  • Slope-brick + plate-curving — for rocky cliffs, hull-curves, sail-billowing, waves
  • Technic articulation — for cannon mounts, ship's wheel, hidden hinges, crane mechanisms, drawbridges
  • Illegal techniques — clutch-power-on-tile, brick-bending, unofficial connections AFOLs use anyway
  • Microscale tricks — minifig-accessory repurposed as macro detail (lightsaber-hilt as railing-post, croissant as decorative-scroll, banana as palm-leaf)
  • Printed-tile signature pieces — using specific rare printed tiles (treasure-map / compass-rose / skull-and-crossbones) as build-anchors
  • Studded-vs-tile texture contrast — deliberate studded areas for wood-plank texture, tiled areas for stone or polished surfaces
  • Brick-built rigging — antenna pieces as ratlines, string-and-bar as shrouds, flex-tube as cordage
  • Hidden cutaways — interior detail revealed by partial-wall builds (cross-section galleys, half-decks)

Each entry must:
• Name the technique TYPE in first 5-8 words
• Specify WHICH PIRATE BUILD ELEMENT it applies to (hull / mast / waves / cliff / treasure-pile / cannon / etc.)
• Specify the SPECIFIC BRICK PARTS used (e.g. "1×2 cheese slope" / "2×2 round dish" / "Technic axle pin" / "trans-orange 1×1 flame")
• Imply the visual IMPACT (curvature / texture / glow / motion / scale)`,
    touchpoints: [
      'SNOT-built galleon hull curvature using sideways-stud bracket sections turning the hull-planks parallel to the keel — 1×2 plate-with-side-stud bricks create the inward hull-curve from aft to bow, with overlapping curved-slopes for the wave-cut bow',
      'Trans-blue ocean built in layered plate-and-tile stacking — 2×4 trans-light-blue plates on the lowest layer, 1×2 trans-dark-blue tiles offset above for wave-crest depth, sprinkled 1×1 white round-plates as foam crests',
      'Trans-orange + trans-red + trans-yellow flame elements as cannon-fire muzzle-flash, clustered at the gun-port mouth with motion-blur implied by staggered stud-heights, the flame-stack mounted on a hidden 1×1 round-plate connection',
      'Technic-axle articulation in the cannon mount allowing the gun-barrel to tilt up/down on a hidden pivot, with 1×1 plate trunnions disguised as wood-block gun-carriage detail, the carriage rolling on 1×1 round-plates as wheels',
      'Crow\'s-nest built using a stack of inverted round-bricks with macaroni-arc tiling for the rim, lookout minifig connected via a single stud at the center, the platform mounted on the mast via a Technic-pin clutch-connection',
      'Brick-built sail-billow using overlapping 2×4 white tile-on-plate panels at progressive angles, secured at the yard-arm via clip-and-bar connection, the billow-curve achieved by intentional half-stud-offset stagger',
      'Sloped-brick rocky cliff face using a mixed light-bley + dark-bley + tan slope-brick palette in random sequence, with cracks built as gap-techniques between brick edges, tufts of tan-1×1 round-plates as scrubby foliage',
      'Treasure-pile constructed from gold-plated minifig-coins, ingots (1×1 round tiles in gold), and gold-stud-on-plate as scattered loose doubloons, mixed with trans-clear jewel elements (1×1 round trans-purple / trans-red / trans-green) as gems',
      'Microscale rigging using minifig fishing-rod antenna pieces as ratlines, black string-with-end-studs as shrouds running yard-to-deck, flex-tube black rubber pieces as the standing rigging fore-and-aft',
      'Printed treasure-map tile (the iconic LEGO Pirates printed-tile from set 6285) used as the build-anchor on the captain\'s table, surrounded by 1×1 round-tile compass-rose detail and a minifig dagger as a chart-pinning prop',
      'Studs-up wood-plank deck contrasting with tiled smooth quarterdeck — main-deck shows visible studs as wood-plank texture, quarterdeck tiled smooth-grey as polished officer\'s walking-surface, the texture contrast separates the social zones',
      'SNOT-built ship\'s figurehead using 1×1 headlight bricks and curved slopes attached sideways to the bow, the figurehead represented in profile with hair flowing rearward built from layered curved-slope plates',
      'Trans-clear baseplate-mounted ice slab as the diorama-floor for an iceberg scene, with 2×2 trans-clear plates lifting the wreck-fragments above the brick-water surface to create the half-submerged effect',
      'Macro-scale cannonball built from a stack of brown 1×1 round-plates connecting to a 2×2 round-dome — the cannonball mid-air represents the moment after the cannon-fire, positioned via clear-stud connector',
      'Tavern-sign built as a hanging assembly using two 1×1 round-plate hinges as the swinging-mount, a printed 2×3 sign-tile as the face, the assembly suspended from a Technic-pin in the building-eave',
      'Kraken tentacle built using a chain of curved-slope and ball-joint sections in trans-dark-green, with suction-cup elements (1×1 round-plate inverted) along the underside, the tentacle articulated via internal flex-tube spine',
      'Skull-and-crossbones Jolly Roger built as a printed flag tile (Imperial Officer\'s tile from the Pirates line) mounted on a black antenna piece serving as the flagpole, the flag mid-unfurl angled by a hidden 1×1 plate brace',
      'Belowdecks cross-section revealed by partial-wall build technique — the hull is built with one side cut away to show the rib-frames + cargo + crew quarters, the structural-integrity preserved by hidden brick-bracing inside the build',
      'Brick-built parrot on the captain\'s shoulder using 1×1 round-plate in red-yellow-blue color blocks for the body, a 1×1 headlight as the head-and-beak, a tile-with-clip as the tail, mounted to the minifig shoulder via a connection-stud',
      'Custom mast-step built using a 2×2 round-dome inverted as the base for the mast, the mast itself a stack of 1×1 round-bricks in tan with brown crossbeams, the entire mast-assembly removable via a single Technic-pin for transport',
    ],
    instructions: `Each entry is ONE MOC build-technique note for a pirate diorama, 25-45 words. Format: "TECHNIQUE NAME CAPS — body with specific brick parts named". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no real-world construction language (no "plywood / glue / paint / 3D-print"); LEGO bricks only. No vague references ("uses some bricks") — name SPECIFIC part types (1×2 slope / trans-blue plate / Technic axle pin / minifig accessory).`,
  },

  // ─── camera_framing — pirate-specific framings ───
  brickbot_pirates_camera_framing: {
    format: 'simple',
    theme: `PIRATE-SPECIFIC CAMERA FRAMING — LEGO MOC photography angles for the pirates path. Each entry is ONE camera position + framing rule specific to PIRATE diorama subject matter (NOT a generic camera angle list). Each entry 15-30 words.

⚠️ This is bespoke — entries should leverage pirate-specific scenery (rigging, hold-cutaway, deck-perspective, crow's-nest, longboat-low, kraken-POV) rather than generic photography terms.

VARIETY MANDATE — distribute across:
  • Vertigo angles up (worm's-eye up a mast / under a yardarm / from longboat looking up at galleon)
  • Vertigo angles down (crow's-nest down-shot / yardarm down-shot / aerial over the deck)
  • Lateral broadside (cannon-deck mid-firing / ship-vs-ship broadside-on between vessels)
  • Through-rigging shot (camera between yardarm + sail to deck below)
  • Below-the-deck cutaway (cross-section interior — gunroom, gally, captain's cabin)
  • Discovery POV (camera at chest-level approaching treasure / a corpse / a clue)
  • Over-shoulder duel (camera behind one combatant looking past their shoulder at the opponent)
  • Kraken's-POV up (camera in the water looking up at the ship-bottom + tentacles)
  • Shipwreck dutch-tilt (camera tilted to match the wreck's broken-back angle)
  • Cliff-edge / aerial over a cove or harbor
  • Lantern-glow close-shot (intimate light, single fig + glowing element)
  • Approach down-the-dock (camera at dock-end, action receding into ship perspective)

Each entry must:
• Specify camera POSITION (height / location / orientation)
• Specify the framing's PURPOSE — what story-element does this angle DRAMATIZE
• Reference pirate-specific scenery elements`,
    touchpoints: [
      "CROW'S-NEST DOWN-SHOT — camera at the masthead looking straight down at the deck below, the mast itself receding into the foreground, crew on deck small and overhead-perspective, sail-tops and yardarms framing the corners",
      "LONGBOAT-LOW LOOKING UP AT GALLEON — camera at water-level from a longboat alongside a galleon, the hull dominating the frame as a wall of planking, gun-ports overhead, rigging visible at the top edge of frame, the dwarfing scale-shot",
      "CANNON-DECK BROADSIDE — camera inside the gun-deck mid-firing, three cannons in receding perspective down the deck, gun-crews mid-action, smoke + muzzle-flash trans-elements punching through the open gun-ports",
      "KRAKEN'S POV — camera submerged in the brick-water looking UP at the ship-keel with tentacles wrapping around the hull, crew silhouetted on the deck above, the water-surface refracted by trans-blue layered plates",
      "SHIPWRECK DUTCH-TILT — camera tilted 30 degrees to match the broken-backed wreck on a reef-island, the canted angle making the wreck dominate the diagonal, surf foaming around the wreck-base, gulls perched on the stern at the high side",
      'THROUGH-RIGGING TO DECK — camera positioned between the mainmast yardarm and the topsail looking down through the rigging to deck-action below, the rigging framing the action like a diagonal lattice across the frame',
      "OVER-SHOULDER DUEL — camera positioned just behind the right shoulder of one combatant in a sword-duel, looking past their cutlass-arm at the opponent in mid-parry, the opponent's face/expression visible, the duel-stage receding behind",
      "CHEST-LEVEL DISCOVERY — camera at minifig chest-height, three-quarter behind a pirate approaching an open treasure-chest, the chest contents (jewels + gold + map) dominating the foreground, the pirate's reaching C-grip visible",
      "CAPTAIN'S CABIN CUTAWAY — camera positioned at the cabin's missing fourth wall, looking into the interior — table + charts + lantern centered, stern-window showing brick-water beyond, captain + officers in mid-conference",
      "WORM'S-EYE UP THE MAST — camera at deck-level looking straight up the mainmast, mast receding into perspective, yard-arms crossing overhead, rigging-lines converging toward the masthead, sails billowing at the top edge of frame",
      "DOCK-END APPROACH — camera at the far end of a dock looking down its length toward a moored ship at the seaward end, crew + crates + lanterns in receding perspective along the dock, the ship dominating the frame's far end",
      'KRAKEN-TENTACLE TIGHT-CROP — camera close on a single tentacle wrapping a mast, the suckers + skin-texture filling the foreground, the crew on the mast above in the upper-frame mid-reaction, the rest of the scene cropped out',
      "BURIED-CHEST DIG WIDE — high-angle overhead from a palm-tree perch looking down at a beach dig-site, six crew members radiating around the half-excavated chest, palm-shadows raking across the sand from the angled light",
      'BROADSIDE BETWEEN TWO SHIPS — camera in the open-water gap BETWEEN two engaged galleons, both hulls visible left and right of frame, broadside fire arcing across the gap, the camera at wave-top height inside the engagement',
      "OVER-THE-RAIL BOARDING — camera at the rail of one ship looking across at the enemy ship's rail, boarders mid-leap across the gap, the rail's edge providing the foreground frame-bar",
      "QUARTERDECK MUTINY WIDE — high-angle from the mainmast looking down at the quarterdeck mutiny scene, captain isolated at the rail flanked by loyalists, the crew arrayed in a tense semicircle, the angle making the captain look cornered",
      'LANTERN-INTIMATE CLOSE — tight-crop on a single minifig holding a lit lantern in the dark, the lantern\'s trans-yellow glow lighting their face from below, the surroundings dropped into shadow, a moment of conspiratorial intimacy',
      "AERIAL OVER COVE — overhead aerial shot of a hidden cove between cliffs, a sloop pulling into the cove, the cliff-walls framing the cove like parentheses, the brick-water inside the cove a different color than the open ocean",
      "BELOW-DECKS POV — camera at a minifig walking down the belowdecks corridor of a ship, hammocks slung overhead, cargo + crew in receding perspective, the corridor framing the action like a tunnel",
      "STORM-SURVIVAL TIGHT — camera at deck-level mid-storm with rain-rods (trans-clear bar pieces) streaking diagonally across the frame, crew lashed-to-rigging in the background, the chaos cropped to the immediate deck",
    ],
    instructions: `Each entry is ONE pirate-specific camera framing, 15-30 words. Format: "FRAMING NAME CAPS — body". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no generic camera terms ("medium shot / wide shot / close-up") without pirate-specific anchoring — every entry must reference pirate scenery (rigging / yardarm / mast / longboat / kraken / cannon / quarterdeck / etc.).`,
  },

  // ─── ship_class — silhouette bender ───
  brickbot_pirates_ship_class: {
    format: 'simple',
    theme: `PIRATE SHIP/VESSEL CLASS — silhouette anchor for the pirates path. Each entry is ONE specific ship/vessel class with rigging + hull-curvature + proportion characteristics. Each entry 12-25 words.

⚠️ These are silhouette anchors — they tell Flux what TYPE of ship is in the frame. Aerospace-accurate; if it says "galleon" expect three masts + square-rigged + high stern-castle; if "sloop" expect one mast + fore-and-aft rigged.

VARIETY MANDATE — distribute across:
  • CARIBBEAN/GOLDEN-AGE classics (galleon / brig / sloop / frigate / man-o-war / schooner / barque) — most of the pool
  • NORSE longships (single mast, square sail, dragon-prow, oar-banked)
  • ASIAN junks (multiple battened sails, square-stern, lugsail rigging)
  • MIDDLE-EASTERN dhows (lateen-rigged, single or two masts, raked sails)
  • SMALL CRAFT (longboat, jolly-boat, cutter, gig, periagua)
  • FANTASY/HYBRID (skyship-galleon, submarine-pirate / pirate-of-the-skies dirigible, ghost-ship)
  • SPACE-PIRATE — Treasure Planet style galleon-in-space, asteroid-mining sloop
  • STEAMPUNK — gear-driven hybrid sail-and-steam vessel
  • SPECIALTY (whaler / smuggler-runner / fireship / careened-careening-vessel)

Each entry must:
• Name the class in first 4-8 words
• Specify mast count + rig type
• Specify hull-curvature characteristic (high stern / low waist / sharp bow / wide beam / etc.)
• Specify the typical SCALE (size relative to crew — 50-crew / 20-crew / 5-crew)`,
    touchpoints: [
      'Three-masted Caribbean galleon — square-rigged on fore and main, lateen on mizzen, high stern-castle, raked bow, 50-80 crew capacity, the classic pirate flagship',
      "Single-masted Caribbean sloop — fore-and-aft rigged mainsail with jib, sharp bow for speed, low waist, 10-20 crew capacity, the smuggler's runner",
      "Two-masted brig — square-rigged on both masts, mid-size with balanced silhouette, broad beam, 20-30 crew, the workhorse of Atlantic piracy",
      "Royal Navy fourth-rate frigate — three-masted square-rigged, 40-50 guns, distinctive red-and-white pattern, the imperial enforcer",
      'Norse longship — single mast with square red-and-white sail, low slung clinker-built hull, dragon-headed prow, 30-oar bench, raid-vessel',
      "Chinese junk — three battened lugsail masts, square-stern, raked transom, distinctive crab-claw sail-shape, ocean-going trade",
      "Arabian dhow — lateen-rigged single mast on a swept-back rake, sharp prow, wooden-pegged hull, monsoon trader",
      "Pirate captain's longboat — single mast with lugsail, open-decked, 6-12 crew, the standard ship-to-shore craft",
      "Ghost-ship galleon — half-translucent trans-clear hull, tattered sails, ragged-rigging, phantom-fleet variant of the Caribbean galleon silhouette",
      "Treasure Planet space-galleon — three-masted classic galleon silhouette but with solar-sail rigging and propeller-engines amidships, nebula-faring",
      "Pirate dirigible / skyship — airship hull suspended below a lozenge-shaped envelope, propeller-engines port and starboard, swing-anchor at the bow",
      'Steampunk hybrid — three-masted galleon with paddlewheels amidships and visible steam-stack at the stern, gear-mechanism deck details',
      "Smuggler's schooner — two-masted fore-and-aft rigged, sharp-bowed for speed, narrow beam, 15-crew capacity, designed for run-the-blockade work",
      "Man-o-war first-rate — three-masted square-rigged, 100-guns across three decks, hulking high-sided silhouette, the imperial flagship",
      'Whaler barque — three-masted hybrid square-and-fore-aft rigging, wide beam for hold-capacity, davit-mounted whaleboats, sturdy hull',
      'Fireship-converted brig — two-masted brig stripped of cargo and packed with combustibles, deliberately rigged to burn — sent against enemy fleets',
      "Caribbean periagua — long shallow-draft single-sail boat with paddle-stations, indigenous-built design, 8-12 crew, coastal raid-vessel",
      "Asteroid-mining sloop (space-pirate) — single-masted Caribbean-sloop silhouette with vacuum-sealed cabin and ion-drive instead of sails, asteroid-belt operating",
      "Cursed Dutchman-style galleon — barnacle-encrusted three-masted galleon with tattered sails and skeletal-figurehead, the iconic supernatural pirate vessel",
      "Careened-careening vessel — any class undergoing maintenance, beached at low-tide on its side with crew scraping the hull, broadside view of the keel",
    ],
    instructions: `Each entry is ONE ship/vessel class anchor, 12-25 words. Format: "CLASS NAME CAPS — rigging + hull + scale". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: no anachronisms (no "diesel-engine galleon"); no modern-military terms (no "battleship / aircraft carrier / destroyer"); no vague descriptors ("big pirate ship"). Specific rig + class name + scale always.`,
  },

  // ─── register — era+faction bender (weighted ~60/40) ───
  brickbot_pirates_register: {
    format: 'simple',
    theme: `PIRATE REGISTER — era + faction lock for each render. Each entry is ONE specific historical/genre register that controls the crew attire + build motifs + props for this render. Each entry 20-40 words.

⚠️ WEIGHTED DISTRIBUTION — the pool should weight ~55-65% toward GOLDEN-AGE CARIBBEAN (the path's brand center) and ~35-45% toward NON-DEFAULT REGISTERS (the bending advantage). Generate accordingly.

REGISTER CATEGORIES — distribute as:
  • ~30% GOLDEN-AGE CARIBBEAN (1650-1730) — tricorn hats / cutlasses / flintlock pistols / silk sashes / Pirates of the Caribbean / Treasure Island / Captain Kidd / Blackbeard / Henry Morgan
  • ~10% GOLDEN-AGE CARIBBEAN SUB-VARIANTS — privateer (legal commission), Buccaneer (Spanish Main raider), Quaker-coast pirate (gentleman pirate)
  • ~10% NORSE RAID (8th-11th century) — Viking longships / shield-walls / horned-or-helmet (NOT both — historians! :) / chain-mail / axes / runic banners / Hägar lineage
  • ~5% GREEK MYTH / ARGONAUTS — bronze helmets / hoplite armor / amphora-stacks / Jason and Argonauts / Cyclops + sea-monsters / classical-trireme
  • ~5% ASIAN JUNK PIRATES — Ching Shih + South China Sea / Wokou / Vietnamese-thuyền pirates / queue-braid + conical-hat + curved-saber + jade + lacquered-armor
  • ~5% MIDDLE-EASTERN / BARBARY COAST — turbans + scimitars + dhow-rigging + Salee / Algiers raiders / silk-and-leather attire
  • ~5% CURSED / GHOST CREW — skeleton-torso variants + tattered-cape + phosphorescent-eyes + green-glow + Davy Jones lineage
  • ~5% FANTASY (One Piece / Sea of Thieves / Sea Beast) — exaggerated-anime style / fantasy-creature crews / impossibly-shaped ships / treasure-hunt fantasy
  • ~5% SPACE-PIRATE (Treasure Planet / Star Wars-pirate / Outlaw Star) — Caribbean attire + retro-futurist mods / plasma-cutlasses / solar-sails / nebula-backdrops
  • ~5% ROYAL NAVY / IMPERIAL FORCE — red-coat marines + tricorn officers + Union-Jack / Spanish-galleon Imperial / French-corsair / Dutch East-India-Company
  • ~5% STEAMPUNK PIRATE — Victorian-era + brass-gear + dirigible-skyship + steam-mechanical-prosthesis / monocle / pith-helmet
  • ~5% MODERN-SOMALI / RIVER-RAIDER — small fast skiffs + AK-coded weapons (LEGO-stylized) + improvised crew kit (rare register — use sparingly)

Each entry must:
• Name the register category in first 4-8 words
• Specify CREW ATTIRE characteristics (hat style / coat / sash / weapon-type)
• Specify BUILD MOTIFS (figurehead style / flag / rigging-flavor)
• Specify any restrictions ("ship_class becomes [X] regardless")`,
    touchpoints: [
      "GOLDEN-AGE CARIBBEAN — tricorn hats, leather cross-belts, silk sashes, cutlasses + flintlock pistols, Jolly Roger flag, 1650-1730 era, the path's brand-center register",
      "GOLDEN-AGE CARIBBEAN PRIVATEER — same Caribbean attire but officer's-uniform-coat in burgundy or navy, letter-of-marque scroll prop, more disciplined crew posture, legal-commission flag instead of Jolly Roger",
      "BUCCANEER (Spanish Main raider) — leather-jerkin attire, broad-brim hat instead of tricorn, single boucan-knife + musket, Caribbean-isle base motifs, Tortuga / Hispaniola lineage",
      "BLACKBEARD CREW VARIANT — Caribbean Golden-Age base but heightened theatricality, slow-burning fuses tied into the captain's beard (trans-orange spark elements), pistol-bandoliers, terror-shock motif",
      'NORSE RAID — Viking longship attire, horned OR antlered helmets (not both — historians take note), chain-mail tunics, two-handed axes, round wood-and-iron shields, runic banners; ship_class becomes Norse-longship-variant regardless',
      'NORSE RAID JOMSVIKING — elite Norse raider variant — black leather-and-mail, bear-pelt cloak, single-handed axes + seax, austere unmarked banner, ship_class still longship',
      'GREEK MYTH / ARGONAUTS — bronze hoplite helmets, leather-and-bronze armor, xiphos sword + dory spear, classical-trireme rig, amphora-stacks as scene props; ship_class becomes Greek-trireme; sea-monsters become classical (Scylla / Charybdis / Cyclops)',
      'CHING SHIH SOUTH-CHINA-SEA PIRATE — conical bamboo hats, silk tunics with embroidered sashes, queue-braid hair, curved sabers + matchlocks, junk-rigged battened sails; ship_class becomes Chinese-junk',
      "WOKOU JAPANESE-COAST RAIDER — pirate variant blending samurai-derived gear with Asian-pirate elements — half-armor with sashimono banner, katana + wakizashi, longbow, captured-Chinese-junk-variant ship_class",
      'BARBARY CORSAIR — Salee / Algiers pirate, turban + sashed-tunic + leather-vest, scimitar + flintlock, dhow-rigging visible; ship_class becomes Arabian-dhow or Mediterranean-galley',
      "CURSED GHOST CREW — skeleton-torso minifig variants with tattered-cape elements, half-translucent armor, phosphorescent-eye prints, ship is half-translucent with trans-clear hull highlights, ghost-ship galleon",
      "DAVY JONES CURSED CREW — barnacle-and-coral-encrusted crew variants, kraken-tentacle-arm prosthetics on certain figures, octopus-headed captain, ship is the cursed Dutchman-style galleon",
      "ONE-PIECE FANTASY CREW — exaggerated anime-stylized attire (oversized hats, mismatched colors, signature accessories), each crew-member with a unique fantasy element (devil-fruit reference, exaggerated weapon, fantasy-creature companion), fantasy-shaped ship",
      "SEA OF THIEVES FANTASY — fantasy-pirate exaggerated-color attire, parrot-companions and cosmetic flair, treasure-vault-hunting register, megalodon and skeleton-fleet motifs",
      "SPACE-PIRATE (Treasure Planet) — Caribbean-pirate attire updated with solar-cell visors, plasma-cutlasses replacing iron blades, robotic prosthesis on at least one crew-member, ship is space-galleon with solar sails; weather becomes nebula / asteroid-drift / ion-storm",
      "STAR-WARS PIRATE — Hondo Ohnaka / Cad Bane lineage — mixed-species crew, jetpacks + blaster-rifles + holstered-pistols + helmet/visor accessories, ship_class becomes star-pirate-galleon (corvette / patrol-ship)",
      'ROYAL NAVY RED-COAT — Royal Navy marine attire, red coats with white cross-belts, tricorn officer hats, muskets-with-bayonets + officer-cutlasses, Union-Jack pennants; ship_class becomes British man-o-war or frigate',
      "SPANISH GALLEON IMPERIAL — Spanish-Empire era crew, conquistador-derived officer attire, gold-trim coats, ornate cross-bearing-banners, ship_class becomes Spanish-galleon (treasure-fleet variant)",
      "STEAMPUNK PIRATE — Victorian-era pirate, brass-gear-decorated coats, pith helmet OR top-hat, mechanical-prosthesis on at least one figure, gear-festooned weapons (steam-pistol / clockwork-cutlass), ship is steampunk hybrid",
      'MODERN SOMALI RAIDER (rare register) — present-day attire — keffiyeh + denim + military-surplus + tactical-vest, small fast skiffs as ship_class regardless, AK-coded long-arms (LEGO-stylized), modern-port backdrop',
    ],
    instructions: `Each entry is ONE pirate register lock, 20-40 words. Format: "REGISTER NAME CAPS — attire + motif + restrictions". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. WEIGHTED OUTPUT: ~55-65% Golden-Age Caribbean variants, ~35-45% non-default registers. STRICT BANS: no register-mixing within a single entry (no "Norse raider with Caribbean tricorn hat" — that's the cross-axis compatibility clauses' job).`,
  },

  // ─── scene_props — diorama fill details (pickN:2) ───
  brickbot_pirates_scene_props: {
    format: 'simple',
    theme: `PIRATE DIORAMA STORYTELLING PROPS — small brick-built details that fill the corners of a pirate scene and add narrative depth. Each entry is ONE specific prop or detail with a story implied. Each entry 12-30 words.

⚠️ These are picked TWO PER RENDER (pickN:2), so each entry must be SMALL enough to coexist with another. Not centerpieces — diorama-fill.

VARIETY MANDATE — distribute across:
  • LIVING COMPANIONS (parrot on shoulder, monkey climbing rigging, ship's cat watching, parrot in a brass cage, rats fleeing)
  • TREASURE-ELEMENTS (overflowing chest, scattered doubloons, jewel-encrusted goblet, silver-candlestick, gilded skull)
  • WEAPONS-LITTER (dropped cutlass on deck, cocked-flintlock on barrel, powder-keg with lit fuse, cannonball stack)
  • RIGGING / SHIP-PARTS (coiled rope on deck, broken yardarm, torn sail, lashed-cargo netting)
  • NAVIGATION / CAPTAIN GEAR (spyglass on rail, sextant on chart-table, compass-rose, ship's-log open)
  • FOOD / CREW LIFE (rum-keg open with cup beside, salt-pork hanging in galley, hardtack-tin, fishing-line over rail)
  • TROPHIES / FLAGS (Jolly Roger flag in close-up, captured enemy-pennant, severed-figurehead, ship-bell)
  • CURSED / SUPERNATURAL ELEMENTS (skull on a pike, cursed-amulet, glowing-jewel in a stand, voodoo-doll, kraken-ink-cloud)
  • PERSONAL ITEMS (peg-leg leaning against barrel, eyepatch on a hook, captain's hat on a stand, locket-on-a-chain)
  • MAP / DOCUMENT ELEMENTS (rolled chart, treasure-map fragment, ship's-log open, wax-sealed letter, navigation-rules-tile)
  • TAVERN / DOCK DETAIL (lit lantern hanging, wanted-poster nailed to a post, ale-tankard on a barrel, dock-rope-coil)

Each entry must:
• Name the prop type in first 3-6 words
• Specify the SPECIFIC LEGO BRICK PARTS where applicable (e.g., "minifig parrot accessory", "1×1 round trans-purple jewel element")
• Imply a STORYTELLING CONTEXT (this prop suggests... a backstory)`,
    touchpoints: [
      'Parrot on the captain\'s shoulder — minifig parrot accessory in red-blue-yellow, beak-painted-tile, perched via the shoulder-stud connection, ruffled mid-render as if it just landed',
      "Monkey climbing in the rigging — minifig monkey accessory in brown, gripping a rope with one paw, hanging mid-swing from a ratline antenna-piece, mid-mischief",
      "Overflowing treasure chest open on deck — 2×3 chest element open with gold-1×1-round-plates spilling out, trans-red + trans-green + trans-purple jewel-bricks scattered across the spill, gold-stud-on-plate doubloons",
      "Dropped cutlass on the deck planks — minifig cutlass piece lying flat on the studded wood-plank deck, the blade pointed away from a fallen minifig partially visible at frame-edge, suggesting a recent fight",
      "Powder-keg with lit fuse trans-orange — 2×2 cylinder-brick keg with a 1×1 round-plate fuse-piece in trans-orange spark element rising above, the moment-before-the-explosion freeze",
      "Coiled rope on the deck — brown flex-tube piece coiled neatly beside the foot of the mainmast, ready-for-use, a sailor's prepared-line for the next maneuver",
      "Spyglass on the quarterdeck rail — minifig telescope/spyglass accessory propped on the rail-edge, lens-end pointing toward the horizon, abandoned by a watchman who was just called away",
      "Open rum-keg with brass cup beside — 2×2 cylinder-brick keg with the lid off, a 1×1 round-plate brass tile beside as the cup, faint trans-brown 1×1 round-plate as the rum-spill suggesting a recent draw",
      "Severed enemy-ship figurehead — a brick-built ship's-figurehead piece propped against the rail like a trophy, splintered at the base, the prize-of-the-day from yesterday's engagement",
      "Skull-on-a-pike — minifig skull piece mounted on top of a black antenna-piece staked into the deck, warning to the crew or the prisoner, the morbid trophy-marker",
      "Captain's hat on a brass-hook — minifig tricorn hat hanging on a hook-piece bracket-mounted to the wall of the captain's cabin, the captain's-quarters detail",
      "Spilled chart on the navigator's table — 2×3 printed map-tile lying askew across a table, a minifig dagger pinning one corner, dividers (technic-pin tool) abandoned beside it, mid-plotting",
      "Lit hanging lantern — minifig lantern accessory hanging from a chain-piece (2-link chain) attached to a deck-beam overhead, trans-orange glow element inside, illuminating a small zone of the scene",
      "Wanted poster nailed to a tavern post — a printed 2×3 wanted-poster tile attached to a post with a 1×1 round-plate as the nail-head, the captain's face on the poster, a reward in doubloons listed",
      "Ship's bell mounted on the quarterdeck — a 1×1 round-brass-bell piece mounted on a Technic-axle bracket, the bell-pull rope hanging beside, the watch-change signal-piece",
      "Cocked flintlock on a barrel — minifig flintlock-pistol accessory propped on a barrel with the cock pulled back, ready-to-fire, set down between shots in a duel-pause",
      "Broken yardarm on the deck — a brown round-brick segment with attached rigging-strings lying broken across the deck, a sail-fragment trailing, evidence of recent battle-damage",
      "Open ship's log on the captain's table — a printed 2×2 ship's-log tile open with quill (minifig quill-accessory) beside, ink-pot 1×1 round-tile in black, the captain's-record-of-yesterday",
      "Severed mooring-line on the dock — a frayed-rope-end (flex-tube cut at angle) hanging from a dock-bollard, the ship that should be there gone, the moment-of-discovery",
      "Voodoo-doll on a barrel — a small custom-built minifig-effigy with pins (1×1 round-plates in pin colors) stuck in it, lying on a barrel-top, the cursed-trinket left as a warning",
    ],
    instructions: `Each entry is ONE pirate diorama prop, 12-30 words. Format: "PROP NAME — brick-parts + story-context". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO real-world materials (no "wooden carved figurehead" without naming brick parts); NO centerpiece-sized props (entries must be SMALL — coexist with other props in the same render); NO oversized treasure piles (those belong to scene_type entries).`,
  },

  // ─── lighting — axis-clean light source + direction + color quality ───
  brickbot_pirates_lighting: {
    format: 'simple',
    theme: `LEGO MOC PIRATE LIGHTING — axis-clean light SOURCE + DIRECTION + COLOR-QUALITY entries for the pirates path. Each entry is ONE specific lighting setup. Each entry 15-30 words.

⚠️ AXIS-CLEAN MANDATE (per playbook lesson 4 — EarthBot epic-vista 2026-05-20). Lighting pool owns ONE conceptual lane: light source + direction + color. Strictly OFF other lanes.

⚠️ HARD BANS — strip these from EVERY entry:
  • NO weather words: fog / mist / haze / rain / storm / lightning / squall / wind / blizzard / hurricane / aurora (those belong to weather_drama axis)
  • NO scene elements: sails / rigging / deck / cabin / cave / beach / harbor / treasure / barrels / lanterns-as-PROPS (those belong to scene_type / scene_props axes)
  • NO minifig action: "lighting carving shadows on faces" / "crew silhouetted" (those belong to minifig_action axis)
  • NO color-cast OVERRIDE language: don't say "warm golden light overrides the scene" — describe the light SOURCE + DIRECTION + COLOR neutrally

✓ VARIETY MANDATE — distribute across:
  • NATURAL DAYLIGHT (high-noon overhead / golden-hour-raking / blue-hour-dusk / dawn-cool-pink / midday-tropical-glare)
  • NATURAL NIGHT (full-moon overhead / crescent-moon side / starlight-only / moonless / moonrise-low-on-horizon)
  • COLORED SKY (sunset-orange-red / blood-red-dawn / sickly-yellow-pre-light / cobalt-tropical-overhead / charcoal-overcast)
  • PRACTICAL LIGHT SOURCES (single-candle / oil-lantern / torch / multiple-torches / firelight / muzzle-flash / explosion-flash)
  • DIRECTIONAL CHARACTER (raking-sidelight / backlight-silhouette / overhead-vertical / underlit-from-below / three-quarter-frontlight / rim-light)
  • SCENE-NEUTRAL DIFFUSE (overcast-soft / cloud-bright-flat / shaded-cool / open-shade)
  • CHIAROSCURO / HIGH-CONTRAST (Caravaggio-deep-shadow / single-source-dark-surround / spotlight-pool-of-light)

Each entry must:
• Specify the LIGHT SOURCE (sun / moon / candle / lantern / torch / explosion / etc.) in first 4-8 words
• Specify the DIRECTION (raking / overhead / backlit / sidelit / underlit / etc.)
• Specify the COLOR QUALITY (amber / silver-blue / harsh-white / saturated-orange / cool-grey / etc.)
• OPTIONALLY note a single visual signature (e.g., "long shadows" / "sharp edge-glow" / "soft halo" / "color-cast on light side")`,
    touchpoints: [
      'GOLDEN-HOUR RAKING SIDELIGHT — late-afternoon sun low on the horizon raking horizontally from one side, warm amber color quality on lit surfaces, long deep-violet shadow opposite, sharp shadow-edges',
      "FULL-MOON OVERHEAD COOL — directly overhead full moon, cool silver-blue color quality on all upward surfaces, deep blue-black undersides, vertical shadows underfoot",
      'SINGLE-CANDLE WARM POOL — one small candle as the only light source, warm orange glow falling off rapidly to darkness within 2 brick-lengths, deep-amber color quality at the source fading to pitch-black',
      'HARSH-NOON TROPICAL OVERHEAD — sun directly overhead, harsh-white color quality, sharp short shadows directly below objects, no atmospheric softening, high-contrast everywhere',
      'BLOOD-RED DAWN HORIZON BACKLIGHT — sun just below the horizon-line, blood-red + crimson color cast on the underside of any objects in frame, everything silhouetted against the red sky, deep-purple foreground',
      'COBALT TROPICAL MIDDAY OVERHEAD — high tropical sun with cobalt-blue sky, bleached-white lit surfaces, sharp-edged shadows, the saturated-blue overhead bouncing soft secondary-blue into shadows',
      'OIL-LANTERN WARM POOL UNDERLIT — handheld oil lantern at minifig waist-height, warm amber color quality lighting faces from below, dramatic underlit chiaroscuro, falloff to deep shadow at the edges',
      "MUZZLE-FLASH WHITE STROBE — instant cannon or pistol discharge as the dominant light source, magnesium-white color quality bleaching the lit side, hard-edged shadows on the off-side, momentary freeze-frame",
      "MOONRISE LOW-HORIZON RAKING — full moon just above the horizon raking horizontally, cool silver-blue color quality on lit surfaces, long deep-indigo shadows opposite, more dramatic than overhead moon",
      "TORCHLIGHT CIRCLE FROM ABOVE — torch held overhead by a minifig as light source, warm orange falloff in concentric circle below, sharp warm-cool boundary at the edge, flickering-implied color shift",
      "STARLIGHT-ONLY MOONLESS NIGHT — no moon, only faint silver-blue starlight, all surfaces very dim cool-blue, barely-readable shadow definition, near-pitch-black darkness with only highlights catching",
      "SUNSET-DISK BURNING ORANGE BACKLIGHT — sun-disk visible on the horizon as a saturated orange-red glow, everything silhouetted dark against the burning sky, lit surfaces tinged warm-amber",
      "FIRE-PIT UPLIGHT WARM — large bonfire as light source from below, hot orange-red color quality on undersides of objects above, sparks-implied warm-yellow particulate, cool-blue darkness above",
      "EXPLOSION-FLASH FLAT WHITEOUT — instant powder-magazine or grenade detonation, flat magnesium-white color quality washing out all surfaces evenly, momentary blowout, dust-debris implied",
      "BLUE-HOUR DUSK COOL DIFFUSE — post-sunset twilight, no direct light source, cool-blue-violet color quality on all surfaces, very soft diffuse shadows, the romantic-darkening transitional light",
      "DAWN-PINK COOL HORIZON GLOW — pre-sunrise pink-and-cool-blue gradient lighting, soft-diffuse color quality, barely-defined shadows, the gentle wash-of-color awakening light",
      "CARAVAGGIO DEEP-SHADOW SINGLE-SOURCE — chiaroscuro lighting from one off-frame source (could be window / lantern), warm color quality on lit edge, deep-black void on the other 80% of frame, dramatic high-contrast",
      "OVERCAST FLAT DIFFUSE COOL — heavily overcast sky bouncing flat cool-grey light, no directional shadows, even illumination, slightly desaturated color quality across the frame, neutral mood",
      "SUNLIGHT THROUGH SHAFT FROM ABOVE — single shaft of warm sunlight piercing downward from a hole / window / opening overhead, sharp-edged light-shaft, surrounding darkness on the unlit areas",
      "MULTIPLE-TORCH RING WARM — several torches arrayed in a ring around the scene, warm orange color quality from all sides, soft-overlapping shadows, the central subject lit evenly warm",
      "CRESCENT-MOON SIDELIT COOL — crescent moon low-angle from one side, soft silver-blue color quality on the lit side, deep-blue shadows on the other side, half the scene definition",
      "FIREPLACE / GALLEY-STOVE UNDERLIT — interior light source from a low fireplace or stove, warm flickering orange uplighting faces and lower bodies, cool darkness on upper surfaces above",
      "SHIP-LANTERN HANGING WARM SPOT — single hanging lantern as fixed light, warm circular pool of orange light directly below, falloff to cool darkness beyond the pool's edge",
      "MIDDAY OPEN-SHADE COOL — subject in deep shade of a structure on a bright day, cool indirect-bounced light filling, the bright daylit area visible on one edge of frame creating a value contrast",
      "FIRELIGHT FLICKERING WARM SIDELIT — fire-pit or bonfire from one side, warm flickering orange-yellow on the lit side, deep purple-black on the off-side, dramatic warm-cool split lighting",
      "STORM-BREAK SUN-SHAFTS THROUGH GAP — sun-shafts piercing through a break in dark clouds, sharp-edged warm-yellow light-shafts cutting through cool-grey ambient, dramatic god-rays",
      "BLOOD-MOON RED OVERHEAD — full moon directly overhead in trans-red color quality, sickly-red color cast on all upward surfaces, deep-burgundy shadows, supernatural-event lighting",
      "WAXING-MOON HALF-LIT — half-moon at three-quarter angle, soft silver-blue color quality on the lit side, gentle gradient to deep-blue darkness on the off-side, balanced cool lighting",
      "BACKLIT-FROM-HORIZON SILHOUETTE — light source on the deep-distance horizon backlighting the foreground subject as a pure dark silhouette against the lit sky, edge-glow rim-light on subject's contour",
      "NOON SHADOWLESS DIFFUSE — bright cloudless midday with sun directly overhead AND high-altitude haze diffusing slightly, near-shadowless even illumination, slightly warm color quality",
      "SHIP'S-LANTERN ARC SWEEP — hanging lantern caught mid-swing in motion, warm orange light-arc swept across the lit surfaces in a curve, momentary directional implied by the swing-blur",
      "DAWN-COOL-PINK BACKLIT — early pre-sunrise with pink-and-cool-blue gradient sky backlighting the foreground, soft-warm light catching upper edges only, cool-blue shadows below",
      "TWILIGHT-PURPLE OVERHEAD DEEP — post-blue-hour deep-twilight, rich purple-and-indigo overhead, no direct light source, very low ambient, the world dropping into night",
      "ICE-WHITE LIGHTHOUSE BEAM SWEEP — distant lighthouse rotating beam as the light source, cool-white narrow shaft of light raking horizontally across the frame, momentary directional lighting, falloff to darkness",
      "SAFFRON SUNSET LOW-HORIZON RAKING — late-stage sunset with saffron-yellow + saturated-orange + deep-pink horizontal gradient, raking light from one side warming the lit edges, long shadows opposite",
      "CYAN-GREEN PHOSPHORESCENT UPLIGHT — supernatural / cursed light source from below (phosphorescent water / will-o-wisp), cool-cyan-green color quality on the underside of objects above, eerie soft uplight",
      "SHOOTING-STAR STREAK ABOVE — momentary white-hot streak across the sky, brief illumination on the upper surfaces from above, mostly atmospheric / sky-only signature",
      "MOON-PATH ON WATER ONLY — moonlight bright ENOUGH only to define a silver-white path along the water surface, the surrounding scene dark, the path the dominant light-feature in frame",
      "LATE-AFTERNOON WARM BACKLIT — sun low in the sky behind the subject, warm-amber rim-light on the contours of the subject, cool-blue shadowed front, the iconic-warm-backlight setup",
      "POWDER-MAGAZINE RED-LANTERN SHIELDED — interior magazine with a shielded red-glass lantern as the only light, dim crimson glow on all surfaces, deep-shadow dominant, ominous safety-lit register",
    ],
    instructions: `Each entry is ONE pirate-scene lighting setup, 15-30 words. Format: "SOURCE+DIRECTION CAPS — color quality + signature". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO weather words (fog / storm / rain / lightning / aurora — those belong to weather_drama); NO scene elements (sails / rigging / deck / cabin / treasure / barrels); NO minifig action; NO mood/narrative. SOURCE + DIRECTION + COLOR only.`,
  },

  // ─── palette — axis-clean color combinations ───
  brickbot_pirates_palette: {
    format: 'simple',
    theme: `LEGO MOC PIRATE PALETTE — axis-clean color-combination entries for the pirates path. Each entry is ONE specific multi-color palette for a pirate diorama. Each entry 12-25 words.

⚠️ AXIS-CLEAN — palette pool owns ONE conceptual lane: color combinations. The entry can carry a brief register-tag at the end (e.g., "captain's-quarters") for flavor, but the bulk is colors.

✓ VARIETY MANDATE — distribute across pirate-coded palettes:
  • CARIBBEAN GOLDEN-AGE (weathered-oak + sail-white + brass + pirate-red)
  • STORM / NIGHT (storm-navy + ghost-cyan + tarnished-gold + bleached-bone)
  • TROPICAL (turquoise + coral-pink + sand + driftwood + palm-green)
  • TREASURE-COLOR (gold + emerald + ruby + bronze + amber)
  • SUNSET / WARM (saffron + crimson + amber + burnt-sienna + deep-purple)
  • COOL / MOONLIT (silver-blue + indigo + cool-charcoal + ivory + steel)
  • BATTLE / SMOKE (cannon-gray + powder-black + fire-orange + steel-blue + blood-red)
  • CURSED / GHOST (phosphorescent-green + abyss-black + bone-white + verdigris)
  • NORSE / VIKING (iron-grey + bone-white + leather-brown + raven-black + axe-steel)
  • ASIAN-JUNK (jade + lacquer-red + silk-gold + bamboo-tan + ink-black)
  • SPACE-PIRATE (nebula-purple + plasma-cyan + stellar-gold + void-black + asteroid-grey)
  • STEAMPUNK (brass-gold + leather-brown + glass-cyan + iron-black + copper-patina)
  • ROYAL NAVY (red-coat + white-cross-belt + navy-blue + brass + black-bicorn)
  • BLOOD / VIOLENCE (crimson + black-iron + spatter + ash)

Each entry must:
• Name 3-5 specific colors with a noun-anchor (e.g., "weathered-oak brown" not just "brown")
• Use specific color-modifier vocabulary (weathered / tarnished / bleached / saturated / cool / molten)
• End with a brief register tag (lagoon-hideout / cursed-treasure / battle-scarred / captain-quarters)
• NEVER drift into lighting language (no "golden-hour orange") — describe colors as MATERIAL colors`,
    touchpoints: [
      "Weathered-oak brown + sail-canvas white + brass-doubloon gold + pirate-red, sun-bleached-deck",
      "Storm-dark navy + ghost-ship cyan + tarnished gold + bleached-bone, phantom-vessel",
      "Tropical turquoise + coral-pink + bone-sand + driftwood-grey + palm-green, lagoon-hideout",
      "Treasure amber + emerald-jewel + ruby + antique-bronze + dark-mahogany, plundered-hoard",
      "Saffron sunset + crimson + burnt-sienna + deep-purple + ember-orange, fire-sky",
      "Silver-blue + indigo + cool-charcoal + ivory + steel-grey, moonlit-night",
      "Cannon-grey + powder-black + fire-orange + steel-blue + blood-red, broadside-battle",
      "Phosphorescent-green + abyss-black + bone-white + verdigris-copper, cursed-depths",
      "Iron-grey + raven-black + bone-white + leather-brown + birch-pale, Norse-raid",
      "Jade + lacquer-red + silk-gold + bamboo-tan + ink-black, Asian-junk",
      "Nebula-purple + plasma-cyan + stellar-gold + void-black + asteroid-grey, space-pirate",
      "Brass-gold + tan-leather + glass-cyan + iron-black + copper-patina, steampunk",
      "Red-coat + white-cross-belt + navy + brass + black-bicorn + ivory, Royal-Navy",
      "Crimson-blood + black-iron + ash-grey + bone-white + rust-orange, mutineer-violence",
      "Burgundy velvet + gold-braid + crimson-sash + ivory-lace + ebony, commodore-finery",
      "Spiced-rum amber + tobacco-brown + cream + aged-oak + brass, tavern-grog",
      "Map-parchment + ink-brown + wax-seal-red + aged-vellum + leather, treasure-chart",
      "Cobalt-ocean + foam-white + hemp-rope + anchor-iron + cloud-white, open-sea",
      "Powder-blue sky + gull-white + driftwood-tan + horizon-navy, endless-voyage",
      "Kraken-ink black + tentacle-purple + drowned-blue + pearl-shimmer + abyss-teal, deep-terror",
      "Galleon-gold + ocean-spray white + hull-tar black + sail-shadow grey, flagship-pride",
      "Sea-glass green + driftwood grey + copper-penny + bone-white, shipwreck-ruins",
      "Hurricane-grey + lightning-white + tempest-blue + blackened-mast + cold-rain-silver, storm-tossed",
      "Limestone-cave cream + torch-flame orange + moss-green + shadow-charcoal + wet-stone, smuggler-grotto",
      "Bandana-scarlet + sun-faded denim + leather-brown + brass-buckle + tan-trousers, pirate-garb",
      "Cutlass-steel + blood-spatter + gunmetal + leather-grip-brown + iron-black, blade-duel",
      "Spyglass-brass + horizon-teal + cloud-white + telescope-black + cool-grey, crow-nest",
      "Port-wine red + harbor-fog-grey + dock-timber + lantern-yellow + brick-red, shore-leave",
      "Outlaw-silver + wanted-poster-tan + bounty-red + gallows-black + parchment-cream, notorious",
      "Reef-coral + lagoon-shimmer + shell-pink + volcanic-rock + palm-green, cove-secret",
      "Sea-brine green + jellyfish-glow + reef-coral + undertow-blue + kelp-amber, submerged-wreck",
      "Cinder-black + ember-orange + ash-grey + soot + dying-coal-red, smoldering-aftermath",
      "Whaler-tan + scrimshaw-ivory + iron-pike + harpoon-steel + oil-amber, whaler-deck",
      "Cursed-pearl + bone-grey + green-corruption + verdigris + skull-white, Davy-Jones",
      "Spanish-galleon-gold + conquistador-red + obsidian + ivory-bone + ornate-bronze, Spanish-empire",
      "Argonaut-bronze + Aegean-blue + olive-green + amphora-clay + ivory-marble, Greek-myth",
      "Barbary-corsair turban-white + scimitar-steel + tan-silk + sun-bronze, Mediterranean-raid",
      "Wokou black-lacquer + samurai-red + steel-katana + silk-saffron + bamboo, Japan-coast",
      "Mango-orange + parrot-emerald + pineapple-yellow + macaw-blue + sand, tropical-plumage",
      "Iceberg-white + glacier-cyan + arctic-ivory + frozen-silver + polar-grey, polar-pirate",
    ],
    instructions: `Each entry is ONE pirate palette, 12-25 words. Format: comma-separated colors then comma + register-tag. Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NO lighting language ("golden-hour orange" — describe as material color); NO scene elements (no "captain's-coat-red sash" — just "captain-red"); NO weather words. Material colors with anchors + register-tag.`,
  },

  // ─── weather_drama — environmental drama (50%-gated conditional) ───
  brickbot_pirates_weather_drama: {
    format: 'simple',
    theme: `PIRATE WEATHER / ENVIRONMENTAL DRAMA — atmospheric/oceanic event that AMPLIFIES the scene. Each entry is ONE specific weather or environmental drama event that can fire on a pirate diorama (50%-gated conditional). Each entry 20-40 words.

⚠️ This axis is decoupled from scene_type and lighting — it's the BENDING AXIS that lets us roll "kraken-attack + glass-calm-sea" (eerie tranquil) or "harbor-port + thunderhead-break" (dramatic departure). The drama event AMPLIFIES the moment without prescribing the lighting time-of-day.

VARIETY MANDATE — distribute across:
  • STORM EVENTS (thunderhead-break / squall-mid-deck / lightning-strike-mast / driving-rain / wind-whipped-sails)
  • CALM EVENTS (glass-mirror-calm-sea / dead-calm-becalmed / mist-still-water / glass-water-reflection)
  • FOG / VISIBILITY (dense-fog rolling in / thick-haze obscuring / mid-fog-bank-emergence)
  • OCEAN CREATURES (kraken-tentacles emerging / megalodon-fin / whale-breaching / dolphin-pod / sea-serpent rising)
  • SKY / NIGHT EVENTS (full-moon / blood-moon / shooting-star / aurora over polar-pirate / lunar-eclipse mid-scene)
  • COASTAL HAZARDS (waterspout / hurricane-eye / iceberg-emerging-from-fog / reef-rocks-revealed-at-low-tide)
  • SUPERNATURAL ENVIRONMENTAL (phosphorescent-water / ghost-ship-emerging-from-mist / cursed-fog-with-faces / will-o'-the-wisp-lanterns)
  • BIRDS (storm-petrels-fleeing / albatross-overhead / gulls-mobbing-deck / parrot-flock-screaming)
  • DAY/NIGHT TRANSITION (dawn-line-on-horizon / sunset-fire-on-water / twilight-purple / pre-storm-yellow-light)
  • DEBRIS / WRECKAGE (floating-cargo-from-recent-wreck / drifting-corpse / shark-feeding-frenzy-on-flotsam / lifeless-message-bottle)

Each entry must:
• Name the drama event in first 4-8 words
• Specify WHICH BRICK PARTS render it (trans-pieces / flex-tubes / specific elements)
• Specify the VISUAL IMPACT (what changes in the frame — color cast / motion / focal point)
• NEVER override the lighting axis directly (don't say "golden hour" — say "sun-disk pierces the storm-clouds" instead)`,
    touchpoints: [
      "THUNDERHEAD BREAK — towering brick-built thundercloud-bank to one side built from layered white + light-bley plates with darker-bley underbellies, a brilliant trans-yellow lightning-bolt element striking a distant mast, rain-rods (trans-clear bar pieces) angling across the cloud-edge",
      'GLASS-MIRROR CALM SEA — completely still brick-water using flat trans-blue tiles edge-to-edge with zero foam-crests, the ship\'s reflection visible in the surface (built as inverted mirror-image below), eerie tranquil contrast to any combat-action above',
      'DENSE FOG ROLLING IN — cotton-batting white-and-light-bley plate-stack fog elements layered along the brick-water surface and creeping inward, the distant ship-silhouettes half-obscured by the fog-bank, only mast-tops visible',
      "KRAKEN-TENTACLES EMERGING — multiple trans-dark-green tentacle-builds rising from around the hull on both sides, suction-cups visible (1×1 round-plate inverted), the brick-water around the tentacles disturbed with foam-1×1-round-plates",
      "MEGALODON FIN BREACHING — colossal trans-dark-grey shark-fin element rising above the brick-water beside the ship, the silhouette of the body visible beneath the trans-blue surface, the scale-of-the-shark dwarfing the ship",
      "FULL MOON OVER OCEAN — a 4×4 round-tile in trans-white as the full moon hanging in the brick-sky background, casting a moonlit-path of pale-blue trans-light-blue tile-strip across the brick-water surface to the foreground",
      "BLOOD MOON CURSED-EVENT — same moon-disc but in trans-red, casting a sickly red moonlit-path across the water and tinting the entire scene with red-glow trans-red 1×1 round-plates scattered as atmospheric particulate",
      'WATERSPOUT FUNNEL — a brick-built funnel-cloud reaching from a thunderhead to the brick-water surface using stacked round-bricks tapering to a point, the funnel-base whipping up a debris-cloud of small white 1×1 round-plates',
      "SHARK FEEDING FRENZY — multiple grey dark-bley shark-elements circling beneath the brick-water surface, churning the water with white 1×1 round-plate foam-bursts, the silhouettes barely visible through the trans-blue plates",
      "HURRICANE EYE — circular calm zone of glass-still brick-water in the foreground, with a dramatic brick-built wall-of-storm encircling the edges of the frame, the moment-of-eye-passing before the back-half of the hurricane hits",
      "ICEBERG EMERGING FROM FOG — a massive trans-white + light-blue mountainous iceberg-build looming out of the brick-fog directly in the ship's path, the ship's bow pointing toward the bergy-base, the moment-of-recognition freeze",
      "PHOSPHORESCENT WATER — the brick-water glowing with trans-light-green + trans-cyan 1×1 round-plates scattered across the surface, every wake and disturbance lit up like neon, the cursed-water bioluminescent supernatural-event",
      "STORM-PETRELS FLEEING — a swarm of small dark-bley 1×1 round-plates and small-bird-accessory pieces clustered in the air just above the brick-water surface, all flying in the same direction, the omen-of-bad-weather-approaching",
      "DAWN-LINE ON HORIZON — a horizontal trans-orange + trans-yellow + trans-red brick-stripe along the seam between brick-water and brick-sky in the distance, the sun-disc not yet risen but the light-bleeding-up effect rendered in tile-strip",
      "DRIFTING WRECKAGE — splintered ship-fragments (broken brown brick-pieces + a torn sail-fragment + a floating barrel + a fragment of figurehead) drifting on the brick-water surface beside the ship, evidence of an earlier disaster",
      "AURORA OVER POLAR-PIRATE — vertical trans-green + trans-cyan brick-strip aurora-curtains in the brick-sky background, only fires when scene is set in arctic / polar register, casting an unearthly green glow on the scene",
      "GHOST-SHIP EMERGING FROM MIST — a half-translucent (trans-clear brick-highlighted) ship-silhouette materializing out of a fog-bank in the deep background, only barely-visible, the supernatural omen-of-the-Flying-Dutchman",
      "PRE-STORM YELLOW LIGHT — the brick-sky rendered in sickly trans-yellow + tan plate-stack as the pre-storm jaundice-light, the brick-water glassy and ominous, the calm-before-the-storm freeze-frame",
      "SUNSET FIRE ON WATER — the brick-water lit by a fiery trans-orange + trans-red glow-strip leading from the horizon to the foreground, the ship silhouetted against the burning-sea, dramatic-departure framing",
      "WILL-O'-THE-WISP LANTERNS — small floating trans-green 1×1 round-plate orbs hovering above the brick-water in the foreground, the swamp-cove-supernatural-event, lures-to-doom drifting between the ship and the shore",
    ],
    instructions: `Each entry is ONE pirate weather/environmental drama event, 20-40 words. Format: "DRAMA NAME CAPS — brick-parts + visual-impact". Output as a NUMBERED list (1. ... 2. ... 3. ...). One entry per line, NO internal newlines. STRICT BANS: NEVER specify time-of-day or lighting color cast (no "golden-hour storm" — that's the lighting axis); NEVER lock crew/scene reaction language (no "crew screaming in panic" — that's minifig_action); environmental EVENT only.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES. Available: ${Object.keys(POOL_RECIPES).join(', ')}`);
  process.exit(1);
}

function buildPrompt(count, recipe) {
  if (recipe.format === 'simple') {
    return `${recipe.theme}

━━━ TOUCHPOINT EXAMPLES (draw aesthetic from these — same caliber, same vocabulary register) ━━━
${recipe.touchpoints.map((t) => '  • ' + t).join('\n')}

${recipe.instructions}

Output ${count} numbered list entries (1. ... 2. ... 3. ...). Each entry on its own single line. NO preamble, NO commentary, NO markdown fences.`;
  }
  throw new Error(`Unknown recipe.format "${recipe.format}"`);
}

async function callSonnet(prompt) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15 * 60 * 1000);
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: SONNET, max_tokens: 16000, messages: [{ role: 'user', content: prompt }] }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally { clearTimeout(timeoutId); }
}

function parseArray(text) {
  const body = text.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) { if (current) entries.push(current); current = m[2].trim(); }
    else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["']|["']$/g, '').replace(/^[-•*]\s*/, '').trim())
    .filter((e) => e.length > 20 && e.length < 1200);
  if (cleaned.length === 0) throw new Error('No numbered entries found in response');
  return cleaned;
}

const STOPWORDS = new Set(['the','a','an','and','or','but','with','of','in','on','at','to','for','from','by','as','is','are','was','were','be','been','being','have','has','had','this','that','these','those','it','its','they','them','their','her','his','into','onto','through','across','over','under','near','around','between','one','two','three','some','any','all','no','not','than','then','also','so','very','more','most','many','much','each','every','other','another','same','such','only','own','just','still','here','there','where','when','what','who','wide','tall','long','high','low','large','small','massive','huge','vast','above','below','beside','behind','toward','within','throughout']);

function signatureOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  let body = dashIdx >= 0 ? entry.slice(dashIdx + 3) : entry;
  const tokens = body.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 4 && !STOPWORDS.has(w)).slice(0, 20);
  return [...new Set(tokens)].sort().slice(0, 12).join(' ');
}

function titleOf(entry) {
  const dashIdx = entry.indexOf(' — ');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map(); const seenTitles = new Map();
  const kept = []; const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) { dropped.push({ entry: e.slice(0, 80), reason: 'title' }); continue; }
    const sig = signatureOf(e);
    if (sig.length < 10) { if (title) seenTitles.set(title, e); kept.push(e); continue; }
    if (seenSigs.has(sig)) { dropped.push({ entry: e.slice(0, 80), reason: 'body' }); continue; }
    seenSigs.set(sig, e);
    if (title) seenTitles.set(title, e);
    kept.push(e);
  }
  return { kept, dropped };
}

async function generateBatch(batchCount) {
  const t0 = Date.now();
  const text = await callSonnet(buildPrompt(batchCount, recipe));
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  let arr;
  try { arr = parseArray(text); }
  catch (e) { console.error('Parse failed:', e.message); console.error('First 400 chars:', text.slice(0, 400)); return []; }
  if (!Array.isArray(arr) || arr.length === 0) { console.warn('  ⚠ Sonnet returned no usable entries'); return []; }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/brickbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) { try { preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8')); } catch {} }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  if (TARGET !== null) console.log(`Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`);
  else console.log(`Pool "${POOL}": gen ${COUNT} new (start ${startCount})${DRY ? ' (dry-run)' : ''}`);
  let pool = [...preExisting]; let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(25, Math.ceil(stillNeeded * 1.5));
    console.log(`\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`);
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) { console.warn('  ⚠ empty Sonnet response — stopping iteration'); break; }
    const within = dedupe(fresh);
    if (within.dropped.length > 0) console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
    const existingSigs = new Set(pool.map((e) => signatureOf(e)));
    const existingTitles = new Set(pool.map((e) => titleOf(e)).filter(Boolean));
    const newUnique = within.kept.filter((e) => {
      if (existingSigs.has(signatureOf(e))) return false;
      const t = titleOf(e);
      if (t && existingTitles.has(t)) return false;
      return true;
    });
    const crossDropped = within.kept.length - newUnique.length;
    if (crossDropped > 0) console.log(`  • cross-batch dedup dropped ${crossDropped}`);
    const room = finalTarget - pool.length;
    const toAdd = newUnique.slice(0, room);
    pool = [...pool, ...toAdd];
    console.log(`  ✓ Added ${toAdd.length} unique → pool at ${pool.length}/${finalTarget}`);
    if (toAdd.length === 0 && newUnique.length === 0) { console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping'); break; }
  }
  console.log(`\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`);
  if (DRY) { console.log('\nDry-run — not writing to disk.'); return; }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) { fs.copyFileSync(outPath, bakPath); console.log(`Backed up existing pool → ${bakPath}`); }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
