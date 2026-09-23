#!/usr/bin/env node
/**
 * Generate the BrickBot `airfield-biplanes` axis pools using Sonnet.
 *
 * Own gen script (NOT recipes bolted into the 5.8k-line shared
 * gen-brickbot-pool.js) so this path build never contends with another
 * agent on that file. Infrastructure (signatureOf / dedupe / target-loop /
 * numbered-list parse / timestamped backup) mirrors gen-brickbot-pool.js
 * verbatim so pool files come out byte-compatible.
 *
 * Per `feedback_each_path_bespoke_not_cloned`: every recipe here is
 * airfield-bespoke. Canon: LEGO Adventurers bi-wing (Johnny Thunder pulp
 * expedition), classic LEGO Town/City aerodrome + stunt plane, LEGO Creator
 * vintage propeller plane, and the Bricklink AFOL aviation-diorama
 * community.
 *
 * THREE hard traps this path's recipes exist to defeat:
 *   1. REAL-AIRCRAFT BRAND NAMES pull photoreal stock imagery — every entry
 *      describes the machine by SILHOUETTE, never a make/model.
 *   2. READABLE TEXT — airfields mean registrations, roundels, signage, and
 *      Flux renders gibberish lettering (hard fail). Every marking is a
 *      pictorial emblem / painted shape / printed stripe / plain blank
 *      panel, named IN THE SEED (a template rule never reaches Flux —
 *      Sonnet only writes what is present).
 *   3. PHOTOREAL DRIFT — aviation photography is a huge Flux prior, so the
 *      brick signal (studs, plate seams, moulded parts, minifig C-hands)
 *      is explicit in every pool.
 *
 * Usage:
 *   node scripts/gen-brickbot-airfield-pools.js --pool brickbot_airfield_aircraft --target 25
 *   node scripts/gen-brickbot-airfield-pools.js --pool brickbot_airfield_palette --count 25
 *
 * Output: scripts/bots/brickbot/seeds/<pool>.json
 *
 * NOTE: brickbot_airfield_camera_framing is deliberately NOT here — camera
 * pools are hand-authored (playbook: Sonnet-generated camera pools leak
 * their sibling axes — time of day, light, weather, hero type, posture
 * verbs — by default).
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
const flag = (n, fb) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : fb;
};
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
// Shared mandates repeated verbatim into every recipe. Kept as consts so
// the three traps above cannot drift apart between pools.
// ─────────────────────────────────────────────────────────────

const BRICK_LAW = `⚠️ EVERYTHING IS LEGO BRICK. Wings are stacked plates with tile-clad leading edges and visible studs, struts are Technic pins and bars, rigging is taut bar-and-clip runs, the propeller is a moulded three-blade element, the engine is a ring of round bricks, grass is a green plate mosaic with tuft plant elements, water is trans-blue plates, smoke is white cloud-slope bricks. Every figure is a LEGO minifigure with C-shaped hands and a printed face. BANNED WORDS: photoreal, photorealistic, CGI, rendered, lifelike, real metal, die-cast, HO-scale, model-railway realism, scale-model, canvas-real, aged patina photograph.`;

const NO_REAL_AIRCRAFT = `⚠️ NEVER NAME A REAL AIRCRAFT. A real make or model name pulls Flux straight to photoreal stock aviation photography and the whole brick read collapses. ABSOLUTELY BANNED NAMES: Sopwith, Camel, Pup, Fokker, Dr.I, Nieuport, Albatros, SPAD, Bristol, Spitfire, Hurricane, Mustang, Stearman, Curtiss, Jenny, Waco, Pitts, Stampe, Tiger Moth, de Havilland, Cessna, Piper, Cub, Beechcraft, Boeing, Antonov, Polikarpov, Bucker, Jungmeister, Avro, Fairey, Gipsy. Describe the MACHINE INSTEAD: a stubby single-seat biplane with a fat cowled rotary engine and a scalloped upper wing; a long-nosed two-seat bi-wing with staggered wings and twin open cockpits. Silhouette, stance, wing count, engine shape, cockpit count, undercarriage — never a name.`;

const NO_TEXT_LAW = `⚠️ NO READABLE TEXT ANYWHERE — this is the path's hardest failure. Airfields invite registrations, serials, roundels, stencils, nose-art and signage, and Flux renders all of it as gibberish lettering, which is a hard fail. So every marking is described as ONE of: a painted geometric shape (a chevron, a stripe, a band, a sunburst, a lightning flash, a diagonal flash, a checker row, a scalloped edge), a small ROUND PICTORIAL EMBLEM (a soaring bird, a leaping fish, a winged horse, a five-pointed star, a crescent moon, a coiled serpent, a palm and sun, a cartoon lion head), or a PLAIN BLANK PANEL. Name the plain surface explicitly in the entry — "its fuselage flanks plain cream with one painted red chevron", "a plain unmarked rudder", "blank smooth tail panels". BANNED WORDS: text, lettering, letters, numbers, numerals, digits, registration, serial, tail number, code, name, nameplate, signboard, sign, placard, notice board, chalkboard, clipboard, map, chart, paper, poster, banner slogan, stencil, decal, logo, brand, label, writing, inscription, scoreboard, timetable, clock face, weathervane, compass rose, sundial, coat of arms, crest.`;

const REGISTER_LAW = `⚠️ TASTE REGISTER — iconic LEGO heritage reads best: LEGO Adventurers pulp expedition bi-wings (Johnny Thunder, 1930s leather-and-tan), classic LEGO Town/City aerodrome (primary-colour cheerful), LEGO Creator vintage propeller planes, LEGO City stunt planes, golden-age barnstorming and air-racing. Licensed pop-culture flavour (an Indiana-Jones-ish expedition register, a vintage-air-race register) is FINE. NEVER hard-SF or modern-military photoreal registers (no jets, no Mass-Effect/Expanse/Star-Citizen tech, no cyberpunk, no drone/stealth) — those photoreal-drift and kill the "everything is brick" signal. Classic-era charm over grimdark, always.`;

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — airfield-biplanes (8 gen'd axes; camera hand-authored)
// ─────────────────────────────────────────────────────────────

const DELIGHT_LAW = `⚠️ THE BAR — PLAYFUL, ADVENTUROUS, VIVID, BEAUTIFUL, CLEVER. This is DreamBot: the render exists to DELIGHT. A technically-correct entry that is sober, tidy or merely plausible is a MISS, not a pass. The failure to avoid is the LEGO-catalogue photo: a neat apron with a parked plane on it. Every entry must either show something a viewer has NEVER SEEN, or take the obvious version and REDRESS it as something more interesting. Ask of every entry: is this the obvious version or the surprising one? Write the surprising one.

⚠️ ONE CHARM DETAIL PER ENTRY — a small clever thing the eye discovers on second look, specific to THAT entry and no other (a dog wearing the mechanic's cap, a chicken riding the cowl, a jam jar handed up to the cockpit, a stone idol head at the strip threshold, a kite tangled in the rigging). Never a generic flourish.

⚠️ VIVID — saturated committed colour and dramatic light. Never muted, never washed-out, never tasteful-grey.

⚠️ ADVENTURE AND A LITTLE COMEDY ARE WELCOME. This is a toy, and toys are played WITH: a barnstorming air-race, a hand-prop with the mechanic diving clear, a wheels-just-off-the-grass moment with the wind cone snapping, a biplane nosed into a haystack while brick cows look on, a wing-walker mid-transfer, a jungle strip with a crated mystery cargo, a sky-pirate's patched machine, a mail plane loading in a blizzard, a kid on the fence with a toy plane in hand. Licensed pop-culture flavour is allowed and encouraged where it is more fun than the generic version (a pulp jungle-temple airstrip, a golden-age air-race meet). Mid-action beats a parked aircraft every single time.`;

const POOL_RECIPES = {
  // ════════════════════════════════════════════════════════
  // AIRCRAFT — THE HERO. Silhouette + livery + era-role + charm detail.
  // No separate `register` axis (LEGO's aviation heritage is a thin
  // conceptual space; a register pool would cap ~15 and repeat).
  // ════════════════════════════════════════════════════════
  brickbot_airfield_aircraft: {
    format: 'simple',
    theme: `BRICK-BUILT VINTAGE AIRCRAFT WITH CHARACTER — the HERO of a LEGO airfield diorama. Each entry is ONE aircraft, 34-52 words: its SILHOUETTE, its VIVID LIVERY, its adventurous era-ROLE, its ONE CLEVER CHARM DETAIL, and a brick construction cue.

MOSTLY BIPLANES (about 19 of 25) — two stacked wings braced by a strut cage. A few variants for range: a triplane, a high-wing monoplane, a twin-float seaplane, a stubby single-wing racer, an amphibian with a boat hull.

${DELIGHT_LAW}

⚠️ THE CHARM DETAIL IS THE POINT ON THIS AXIS — every machine carries ONE clever bolt-on nobody else has: a wing-walking rail with a trapeze bar, a mechanical letter-catcher arm, a crate-cage strapped under the belly with something shifting inside, a canoe lashed to the float struts, a brass survey lens on a swing-arm, a bathtub cockpit salvaged from a boat, a parrot perch bolted beside the windscreen, a gramophone horn wired as a loud-hailer, a fold-down picnic table on the lower wing, a dog's goggled seat behind the pilot, a pennant bar, a net of coconuts, a rack of message tubes, a spare propeller strapped to the flank.

${NO_REAL_AIRCRAFT}

${NO_TEXT_LAW}

${BRICK_LAW}

${REGISTER_LAW}

VARIETY MANDATE — one entry each, spread across these adventurous era-roles: barnstormer with a wing-walking rail · flying-circus display plane with smoke pods and a trapeze bar · golden-age pylon air-racer (huge engine, tiny cockpit set far aft) · airmail carrier with a mechanical letter-catcher arm · pulp jungle-expedition bi-wing on fat balloon tyres · sky-pirate's patched machine in mismatched salvaged panels · crop-duster with spray booms and a scarecrow mascot lashed to a strut · naval floatplane on twin pontoons with a canoe lashed alongside · tandem trainer with a hand-painted target on the tail and a bell on the rim · mountain-rescue plane on brick skis with a toboggan rack · photo-survey plane with a brass swing-arm lens · banner-tow plane with a plain rear hook and a pennant bar · glider-tug with a coiled tow line and a windmill vane · freight bi-wing with a crate-cage under the belly · bush plane on oversized balloon tyres with a canoe on the roof · aerobatic single-seater rigged for inverted flight with a mirror on the strut · coastal patrol bi-wing with folding wings and a gramophone loud-hailer · rotary-engined scout with a horseshoe cowling and a parrot perch · long-nosed inline racer with a radiator nose and a spare prop strapped on · amphibian with a boat hull, wing-tip floats and a fishing rod in a clip · a chunky cheerful LEGO-Town aerodrome plane with a pull-along kite reel · a scarlet triplane with three narrow wings and a pennant bar · a compact single-wing racer with spatted wheels and a tiny mascot figurehead · a two-seat tourer with a brick cabin and a fold-down picnic table on the wing · a veteran bi-wing wearing replacement panels and a tally of painted stars.

EVERY ENTRY MUST: (a) open with the wing arrangement + a stance word (stubby, long-nosed, chunky, slender, squat, broad-winged); (b) name the engine shape (a fat cowled rotary ring, a horseshoe cowling, a long inline nose with a flat radiator, a broad radial ring); (c) name the cockpit count, open or brick-cabined; (d) give the LIVERY as a SATURATED colour plus ONE painted geometric shape and/or ONE small round pictorial emblem, with the fuselage flanks named as SMOOTH UNMARKED BRICK; (e) name the ONE CHARM DETAIL; (f) close with a brick-construction cue.

Write as ONE flowing sentence, no headline prefix, no dash-separated title.`,
    touchpoints: [
      'A stubby cherry-red single-seat pylon racer with a fat cowled rotary ring almost as wide as the fuselage, tiny cockpit set far aft, flanks smooth unmarked brick carrying one painted cream lightning flash and a round emblem of a soaring swift, a tiny mascot figurehead clipped to the nose ring, wings stacked plates on a Technic-pin strut cage.',
      'A chunky sand-and-chocolate pulp jungle-expedition bi-wing on fat balloon tyres, twin open cockpits in tandem, a crate-cage of Technic liftarms strapped under the belly with something shifting behind the bars, flanks smooth unmarked brick with one painted band and a round emblem of a palm and sun, bar-and-clip rigging triangulating the cellule.',
      'A slender bright-orange flying-circus biplane with a wing-walking rail along the upper wing and a trapeze bar slung beneath it, horseshoe cowling over a moulded three-blade propeller, smooth unmarked orange flanks with one painted white sunburst, smoke pods clipped under the lower wing, Technic-pin struts bracing stacked plate wings.',
      "A squat sky-pirate's biplane in patched mismatched panels of dark red, black and salvaged grey, a broad radial ring with one cylinder visibly replaced, single open cockpit behind a bent windscreen element, smooth unmarked flanks with one painted skull-and-star pictorial emblem and a pennant bar at the tail, rigging of taut bar-and-clip runs.",
      'A long-nosed buff airmail bi-wing with a flat inline radiator nose and a mechanical letter-catcher arm swung out on a Technic axle, single open cockpit, smooth unmarked buff flanks with one painted dark diagonal band and a round emblem of a winged horse, a rack of message tubes clipped along the fuselage spine.',
      'A chunky turquoise amphibian with a stacked-wedge-plate boat hull, wing-tip floats on bar-and-clip struts, twin open cockpits and a fishing rod held in a clip beside the rear rim, smooth unmarked turquoise hull with one painted white sunburst on the bow, upper wing stacked plates on a Technic-pin cage.',
    ],
    instructions: `Each entry is ONE aircraft, 34-52 words, a single flowing sentence, no headline prefix, no dash-separated title. No camera position, no lighting, no weather, no setting, no minifig action — the machine and its one charm detail only. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // FLIGHT MOMENT — THE SIGNATURE MONEY-SHOT AXIS. Mid-action always.
  // Livery-agnostic by construction (the aircraft axis owns colour).
  // ════════════════════════════════════════════════════════
  brickbot_airfield_flight_moment: {
    format: 'simple',
    theme: `THE FROZEN MOMENT — the money shot of a LEGO airfield diorama. Each entry is ONE instant, 26-44 words, and it is ALWAYS MID-ACTION with a consequence visible in the same frame.

${DELIGHT_LAW}

⚠️ A PARKED AEROPLANE IS A FAIL. Never "stopped", never "parked", never "sitting", never "at rest". Something is happening and something is reacting to it.

THREE FAMILIES, roughly equal: (A) GROUND-RUNNING DRAMA — the take-off run, the landing flare, a hand-prop with the mechanic diving clear, a tied-tail run-up straining at its rope, a swing round on one braked wheel, being towed by a tiny tractor with a rope going taut; (B) AIRBORNE LOW OVER THE FIELD — wheels a single stud clear at lift-off, a steep climb off the strip end, a low banked pass over the hangar ridge with the crew ducking, a hedgerow hop, the apex of a loop, a wing-walker mid-transfer, a banner snatched off a ground gantry; (C) MISHAP AND MAINTENANCE COMEDY — nosed gently into a haystack with brick cows looking on, tail-up in a duck pond of trans-blue plates, nose-down on trestles with the engine ring bare and a chicken on the cowling, one wheel off and the axle propped on a crate, a lower-wing panel peeled back with the dope tin tipping.

WRITE A READABLE, WEIGHT-BEARING MOMENT — wheels touching, wheels a stud above the grass, skids cutting a line, trestles under the spar, a wingtip dipped, a tail buried in hay. NEVER a vague hover. NEVER motion blur — motion is a FROZEN brick moment (tuft elements flattened in a fan, a scatter of tan studs lifted, a skid line scored in the plate-mosaic, a rope snapped bar-straight).

${BRICK_LAW}

${NO_TEXT_LAW}

⚠️ NO LIVERY AND NO AIRCRAFT COLOUR. The aircraft axis owns the machine's colour scheme and its painted markings, and a colour named here will CONTRADICT the rolled hero. Never name a fuselage colour, a wing colour, a paint scheme, or a specific emblem. "Smooth unmarked panels" is fine — that is the no-text guard, not a livery.

⚠️ DO NOT describe the camera position, the lighting, the sky, the weather, the palette, or the airfield setting — other axes own those.

VARIETY MANDATE — one each, no repeats: both wheels a single stud clear at the exact instant of lift-off, tuft elements fanned flat behind · the tail-skid carving a long curved groove as the machine swings round on one braked wheel · a hand-prop caught at the top of the swing with the mechanic already twisting away off his feet · straining against a tied-tail run-up rope pulled bar-straight, the stake bending in the turf · in the landing flare, tail dropping, wheels a stud above the grass and the skid poised to bite · banked steeply low over the hangar ridge with a crewman flat on the roof ducking under the wingtip · nose buried gently in a round hay-bale brick with brick cows turning to look and the tail cocked up · tail-up in a duck pond of trans-blue plates with brick ducks scattering off the wingtips · nose-down on trestles, cowling hinged open, the engine ring bare and a brick chicken settled on the rocker cover · up on trestles with one wheel off, the axle propped on a fuel crate and the wheel rolling away downhill · a lower-wing panel peeled back off the plate frame with the dope tin tipping off the spar · being towed by a tiny brick tractor, the tow rope snapping taut and the tractor's front wheels lifting · a wing-walker mid-transfer from the upper-wing rail to the strut cage, one hand and one boot still committed · snatching a plain pennant off a ground gantry, the line whipping up into the undercarriage bay · climbing steeply off the strip end with a brick bird-flock parting around the wingtips · skimming a hedgerow on the take-off hop with a farmer minifig's hat lifting off in the wash · at the apex of a slow loop with a smoke-pod trail of cloud-slope bricks curling behind · touching down on floats and throwing trans-blue plates in a wide fan over a jetty · landing on brick skis with white plate-flecks sheeting up over a waiting dog-sled team · being winched out of the hangar mouth on a trolley, wingtips a stud from the door frame on either side · dropping a crate on a parachute fabric element over a jungle clearing, the crate still swinging · thundering down the strip abreast of a galloping brick horse with its rider standing in the stirrups · pivoting hard round a plain painted pylon cone with the inner wingtip a stud off the grass · taxiing straight at a wandering brick goose that is refusing to move, the pilot half out of the cockpit · lifting a kite on a long line off the tail hook while two kid minifigs sprint beneath it.`,
    touchpoints: [
      'Caught at the exact stud of lift-off with both moulded wheels a fraction clear of the plate-grass, tuft elements fanned flat behind the tail and the skid line still freshly scored into the turf.',
      'Nose buried gently in a round hay-bale brick with the tail cocked high, straw studs sprayed forward and three brick cows turning their printed faces to look.',
      'A hand-prop caught at the top of the swing, the moulded blade vertical and the mechanic minifigure already twisting away off his feet with both arms flung wide.',
      'Nose-down on brick trestles with the cowling hinged open on clip plates, the round-brick engine ring bare to its cylinders and a brick chicken settled calmly on the rocker cover.',
      'Skimming a brick hedgerow on the take-off hop with the undercarriage a stud above the top course, a farmer minifigure below losing his hat into the wash.',
      'Banked steeply low over the hangar ridge, one wingtip dipped toward the fence, a crewman flat on the roof ridge ducking as the shadow crosses him.',
    ],
    instructions: `Each entry is ONE mid-action instant, 26-44 words, a single flowing sentence, no headline prefix, no dash-separated title. No camera, no lighting, no weather, no palette, no aircraft colour, no airfield description. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // AIRFIELD SETTING — the stage, redressed as somewhere worth seeing.
  // ════════════════════════════════════════════════════════
  brickbot_airfield_setting: {
    format: 'simple',
    theme: `THE AIRFIELD — the brick-built stage a vintage aircraft lives on, and it is somewhere WORTH SEEING. Each entry is ONE complete setting, 28-46 words.

${DELIGHT_LAW}

⚠️ A TIDY APRON IS A FAIL. The generic mown strip with a hangar is the obvious version; write the surprising one. Put the strip somewhere with a story: a jungle temple threshold, a mesa top reachable only by air, a village street closed off for a race with bunting overhead, an ice-floe edge, a volcano rim, a treetop platform, a frozen lake between ice-fishing huts, a fossil dig, a circus field beside a big top, a lighthouse headland, a rooftop strip above a brick city, a windmill field, a floating sky-island.

${BRICK_LAW}

${NO_TEXT_LAW}

${REGISTER_LAW}

EVERY ENTRY MUST name (a) the strip surface in brick terms (a mown green plate mosaic with a paler tile centreline, tan plates, white snow plates, light-bley apron tiles, brown plank plates, grey stepped plates), (b) at least TWO pieces of brick airfield furniture (a fabric wind cone on a bar mast, a corrugated arch hangar with hinged doors, round-brick fuel drums with smooth lids, a hand-cranked winch drum, plain painted pylon cones, bunting studs on bar masts, brick trestles, a five-bar gate on clip hinges, a wheeled trolley), and (c) ONE CHARM DETAIL that makes it that field and no other.

VARIETY MANDATE — one each: a jungle strip hacked from plant-element canopy with a carved stone idol head at the threshold · a mesa-top strip with sheer slope-brick walls and a rope-and-plank lift down the cliff · a village street closed for a race, bunting studs slung overhead between shuttered brick houses · an ice-floe edge strip of white plates with a brick seal watching from a trans-blue lead · a volcano-rim survey strip on grey stepped plates above a trans-orange crater glow · a treetop platform strip of plank plates lashed between giant plant-element trunks · a frozen-lake strip between ice-fishing huts with a dog-sled team waiting · a fossil-dig strip beside a half-excavated brick skeleton in tan plates · a flying-circus field beside a red-and-white striped big top with a cannon aimed at the sky · a lighthouse headland strip with a stepped brick edge above trans-blue water plates · a rooftop strip on a brick city block with a water tower and washing lines between chimneys · a windmill field of patchwork plates with a turning brick sail-wheel at the strip head · a desert dry-lake strip of tan plates ringed by slope-brick buttes and a lone signal cannon · a golden-age pylon race course over stubble plates with plain painted cones and a spectator rail · a wheat strip flanked by round hay-bale bricks with a scarecrow on a bar mast · a mountain-pass strip on a stepped brick shelf with a bell on a plinth · an atoll strip of tan plates with a plank floatplane ramp and a wrecked hull half in the water plates · a market-town aerodrome behind a five-bar gate with a produce cart at the fence · a snowbound strip beside a log cabin with a laden dog-sled and a smoking chimney · a circus-train field where a bright brick carriage sits derailed beside the strip · a stilted delta strip of plank plates over trans-blue water plates with fishing nets on frames · a quarry-floor strip of grey plates with a stone crane arm swung over the edge · an orchard strip between rows of plant-element fruit trees with laden crates stacked at the verge · a canyon-floor strip of tan plates between towering slope-brick walls with a rope bridge overhead · a seaside pier-end strip of plank plates with a helter-skelter of curved slope bricks behind it.

DO NOT describe the aircraft, the camera position, the lighting, or the palette.`,
    touchpoints: [
      'A jungle strip hacked from dense plant-element canopy, rough tan plates running between buttress-root slope bricks, a carved stone idol head half-swallowed by vines at the threshold and a fabric wind cone rigged on a bamboo bar mast beside stacked fuel drums.',
      'A mesa-top strip of pale tan plates ringed by sheer slope-brick walls, a rope-and-plank lift rigged on a hand-cranked winch drum over the drop and a wind cone stiff on its mast beside a stone-brick shelter.',
      'A village street closed off for a race, bunting studs slung overhead between shuttered brick houses, plain painted pylon cones marking the turn at the square and a brick cat watching from a windowsill above the crowd rail.',
      'A frozen-lake strip of white plates between two ice-fishing huts, a dog-sled team harnessed and waiting at the verge, round-brick fuel drums part-buried in snow tile and a wind cone locked rigid on its bar mast.',
      'A treetop platform strip of plank plates lashed between giant plant-element trunks, rope-clip guardrails along both edges, a hand-cranked winch drum at the head and a brick toucan perched on the wind-cone mast.',
      'A volcano-rim survey strip of grey stepped plates above a trans-orange crater glow, a corrugated arch hangar braced against the slope, drum stacks chained down and a brass bell on a stone-brick plinth at the threshold.',
    ],
    instructions: `Each entry is ONE airfield setting, 28-46 words, a single flowing sentence, no headline prefix, no dash-separated title. No aircraft, no camera, no lighting, no palette, no minifig action. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // GROUND CREW BEAT — verb-led minifig story beat, with comedy.
  // ════════════════════════════════════════════════════════
  brickbot_airfield_ground_crew_beat: {
    format: 'simple',
    theme: `THE GROUND-CREW STORY BEAT — a freeze-frame of minifigs DOING something on a LEGO airfield. Each entry is 22-38 words and MUST OPEN with "Mid-" plus a verb.

${DELIGHT_LAW}

⚠️ COMEDY AND CHARACTER ARE THE POINT ON THIS AXIS. Slapstick is welcome: a dog running off with the mechanic's cap, a chicken riding the cowling, a toolbox spilling down the ladder, a minifig tangled in the rigging, a kid handing up a jam jar, a goose chasing the fuel hand. Every entry is a cause, a body fully committed to it, and a reaction in the same frame. NEVER minifigs standing around, NEVER posing, NEVER "watching" or "gazing".

${BRICK_LAW}

${NO_TEXT_LAW} In particular: NO paper, NO maps, NO charts, NO clipboards, NO notice boards, NO logbooks — text priors that render as gibberish scribble.

CAST: mechanics in overalls, a pilot in a leather cap and goggles, a flagman with plain paddle bats, a fuel hand, a parachute packer, kids on the fence, a dog figure, a brick chicken or goose, a farmer, a market woman, a photographer with a brick box camera. Minifig hands are C-shaped clips — describe grip as a yellow hand clamped on a bar, never human fingers.

VARIETY MANDATE — one each: mid-swing hand-propping, leaning his whole torso back off the arc · mid-dive clear of the catching propeller, flat out over the grass with his cap already gone · mid-pull on a chock rope with heels gouged into the turf and a second crewman shouting · mid-climb up a step-ladder with a spanner raised while the toolbox tips off the top rung behind him · mid-pour from a tipped fuel churn onto the top-wing filler with a goose pecking at his boot · mid-wave with two plain paddle bats crossed high, leaning back onto his heels · mid-chase after a dog running off with the mechanic's leather cap in its printed jaws · mid-lift of a crate up into the front cockpit, both arms locked overhead and knees deep · mid-handover of a jam jar from a kid minifig on the fence up to a hand reaching from the cockpit · mid-shout up at the cockpit rim with both yellow hands cupped and one boot on the tyre · mid-haul on the tail, two crew swinging the skid round while a third calls the turn · mid-untangle of a crewman caught in the bar-and-clip rigging, one arm hooked through the wires · mid-shoo of a brick chicken off the rocker cover with a rolled rag element · mid-brush of dope onto a peeled lower-wing panel with the tin balanced on the spar · mid-scramble up onto the upper wing with a bucket, one boot slipping off a strut · mid-crank of a brick box camera on a tripod, bent low to the finder as the machine rolls past · mid-spill of a toolbox down the ladder, spanners scattering as studs across the apron tiles · mid-dash with a red extinguisher brick held straight out and one foot off the tiles · mid-toss of a rolled bundle up to a hand reaching from the cockpit rim · mid-squirt of an oil can at the rocker gear with his elbow braced on the cowl lip · mid-signal from a marshaller dropped low on one knee with a bat pointed flat at the skid · mid-swap of a cracked propeller blade, pressing the new one onto the hub pin with both hands · mid-push on a wingtip, three crew leaning shoulder-first as the machine rolls backward · mid-clamber of two kid minifigs up the fence rails with a toy plane still gripped in one hand · mid-fold of a parachute canopy across a trestle, two crew pulling opposite edges flat.`,
    touchpoints: [
      'Mid-dive clear of the catching propeller, the mechanic minifigure flat out over the plate-grass with his leather cap already tumbling away and the blade a stud behind his boots.',
      'Mid-chase after a dog figure running off with the leather cap clamped in its printed jaws, the mechanic minifigure stretched full-length with one yellow hand almost on the tail.',
      'Mid-climb up a brick step-ladder with a spanner element raised toward the open cowling ring, the toolbox tipping off the top rung behind him and studs already spilling.',
      'Mid-handover of a jam-jar element from a kid minifigure balanced on the fence rail up to a yellow hand reaching down over the cockpit rim.',
      'Mid-shoo of a brick chicken off the rocker cover with a rolled rag element, the bird half-lifted with both wing plates flared and the mechanic overbalancing on the trestle.',
      'Mid-pour from a tipped fuel churn onto the top-wing filler while a brick goose pecks hard at his boot and a second crewman braces the ladder rails.',
    ],
    instructions: `Each entry is ONE minifig story beat, 22-38 words, opening with "Mid-" plus a verb, a single flowing sentence, no headline prefix, no dash-separated title. No camera, no lighting, no palette, no aircraft colour. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // BUILD TECHNIQUE — the AFOL distinguisher + the load-bearing
  // anti-photoreal lever for this path.
  // ════════════════════════════════════════════════════════
  brickbot_airfield_build_technique: {
    format: 'simple',
    theme: `AFOL AVIATION-MOC BUILD TECHNIQUES — the parts-usage cleverness that makes a brick aeroplane read as a Bricklink champion's build and NOT as a photoreal aeroplane. Each entry is ONE technique, 24-40 words, naming REAL LEGO parts and methods.

This axis is the path's load-bearing anti-photoreal guard. Every entry must make a viewer clock the plastic: studs, seams, moulded parts, clip joints, SNOT facings.

${BRICK_LAW}

${NO_TEXT_LAW}

PARTS VOCABULARY to draw on: plates, tiles, wedge plates, slope bricks, curved slopes, cheese slopes, round 2x2 bricks, cylinder bricks, Technic pins, Technic liftarms, bars, clips, bar-and-clip joints, hinge plates, headlight bricks, jumper plates, SNOT brackets, moulded three-blade propeller element, small curved windscreen element, trans-clear bricks and rods, trans-orange flame elements, moulded tyres on plate hubs, fabric elements, string with end studs, rubber bands, plant elements, tuft elements, minifig accessories repurposed as micro-detail.

VARIETY MANDATE — one each: wing cellules as stacked plates with tile-clad leading edges and a deliberate row of exposed studs along the top surface · interplane struts as Technic pins and bars in a braced N-cage · rigging as taut black bar-and-clip runs triangulating the cellule, every wire a real part · a rotary engine as a ring of round 2x2 bricks with cylinder-brick stubs and a moulded three-blade propeller · fabric-effect fuselage as smooth tiles with the plate seams left visible so the frame reads beneath · a SNOT-clad cowling with headlight bricks for exhaust stubs and a jumper-plate nose ring · the grass strip as a green plate mosaic with scattered tuft elements and a mown paler tile centreline · the hangar arch as stacked curved slope bricks with hinged panel doors on clip plates · undercarriage springing as a stretched rubber band lashed across Technic-pin legs · a trans-clear windscreen element set on a jumper plate ahead of the cockpit · a tail-skid as a bar clipped under a wedge-plate tail · propeller wash as a thin trans-clear disc on the hub · exhaust smoke as white cloud-slope bricks stepping back off the stubs · a wooden hangar wall as vertically-SNOTed tan tiles with liftarm bracing behind · a wind cone as a fabric element threaded on a bar mast · brick trestles with Technic-liftarm cross-bracing under the wing spar · cowling panels hinged open on clip plates to show cylinder bricks inside · an inspection hatch as a single tile on a clip · the tail plane as one large wedge plate with a painted band · the apron as light-bley tiles with intentional expansion-joint lines of exposed studs · float hulls as stacked wedge plates stepping to a boat-shaped keel · wing-tip skids as bars in clips at each lower-wing end · a control-surface hinge as an actual hinge plate so the elevator sits visibly deflected · spatted wheel fairings as curved slopes hugging the moulded tyres · a hand-cranked winch drum as a Technic axle through round bricks with string wound on.`,
    touchpoints: [
      'Wing cellules built as stacked plates with tile-clad leading edges and a deliberate row of exposed studs left bare along each top surface, so the aerofoil reads unmistakably plastic.',
      'Interplane struts assembled from Technic pins and bars into a braced N-cage between the wings, every joint a visible connection point rather than a smooth moulding.',
      'Rigging run as taut black bar-and-clip lengths triangulating the cellule from spar to spar, each wire an actual part clipped at both ends.',
      'A rotary engine built as a ring of round 2x2 bricks with cylinder-brick stubs radiating out, capped by a moulded three-blade propeller element on a jumper-plate hub.',
      'A fabric-effect fuselage skinned in smooth tiles with the plate seams left showing between panels, so the brick-built frame reads through the covering.',
      'The hangar arch stacked from curved slope bricks with hinged panel doors on clip plates, the whole shell visibly courses of plastic rather than corrugated steel.',
    ],
    instructions: `Each entry is ONE build technique, 24-40 words, a single flowing sentence, no headline prefix, no dash-separated title. Technique + parts only — no camera, no lighting, no palette, no story. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // LIGHTING — axis-clean (time + direction + colour + shadow) and
  // DRAMATIC. No weather, no fog, no optical phenomena, no palette.
  // ════════════════════════════════════════════════════════
  brickbot_airfield_lighting: {
    format: 'simple',
    theme: `DRAMATIC LIGHTING FOR A LEGO AIRFIELD DIORAMA — each entry is ONE lighting condition, 16-30 words.

⚠️ VIVID AND DIRECTIONAL. Flat, even, grey or washed-out light is a MISS — this render has to stop a scroll. Commit to a strong direction, a saturated colour of light, and a clear shadow behaviour. Bright clean midday is allowed once or twice for contrast; everything else has drama in it.

AXIS-CLEAN AND STRICT: this axis owns ONLY time of day, light direction, light colour, and shadow behaviour. It must contain NO fog, NO mist, NO rain, NO snow, NO weather event, NO rainbows, NO aurora, NO colour statement about the bricks themselves, NO camera position, NO subject. Never describe light as a column, pillar, shaft, beam, bar, ribbon or sheet — name the LIT SURFACE instead and let the light spread.

VARIETY MANDATE — spread across: hard low sun raking along one flank and throwing a long crisp shadow across the turf · fire-orange sunset light flooding in from behind the camera, everything lit warm and flat · a break in the cloud lighting only the strip bright while the field beyond stays dark · deep blue-hour dusk with warm hangar light spilling out and glowing on the apron · clean hard midday with short black shadows pooling tight beneath the wheels · low back-light rimming every wing edge bright and dropping the near side into shade · amber tungsten work-light inside a hangar with everything past the wing dropping to black · cold early-dawn light, pale and blue, every mast shadow stretched long and sharp · hot desert overhead sun bleaching the top surfaces bright and leaving hard black shade beneath · dappled light through plant-element branches breaking the wing into sharp bright and shaded patches · storm-dark sky with one bright sunlit band across the far field and the foreground in deep shadow · low winter sun with bright fill bouncing up off snow plates into the underwing · warm golden light through an open hangar door laying a bright glowing patch across the floor tiles · sharp side-light splitting the fuselage bright and dark down a hard edge · night field light from a row of warm lamp bricks, the machine lit from below and the sky black · rose-and-violet afterglow with the upper surfaces still catching colour and the ground gone dark · high hard tropical sun with colour blazing and shadow edges knife-sharp · firelight glow from a brazier throwing warm flicker up the near flank and deep shadow behind · cool blue shade under a hangar roof with a blaze of hot light beyond the open doors · bright clean even daylight, colour absolutely true, for a render that needs no drama from the light · last red light catching only the top wing while everything below sits in shadow · strong three-quarter sun with the shadow of the wing laid across the turf as a sharp shape · pale silver overcast with soft directional falloff and faint grey shadow · hard sun directly behind the machine making a bright halo along every edge · warm late-afternoon light low enough to reach right under the wing and light the undercarriage.`,
    touchpoints: [
      'Hard low sun raking along one flank, the opposite side dropping into deep shade and a long crisp shadow thrown right across the turf.',
      'A break in the cloud lighting only the strip bright while the whole field beyond stays dark and heavy.',
      'Deep blue-hour dusk with warm hangar light spilling out and glowing hot across the apron tiles.',
      'Amber tungsten work-light inside a hangar, everything past the wing dropping away to black.',
      'Fire-orange sunset flooding in from behind the camera, the whole machine lit warm and flat with almost no shadow toward us.',
      'Storm-dark sky above with one bright sunlit band across the far field and the foreground held in deep shadow.',
    ],
    instructions: `Each entry is ONE lighting condition, 16-30 words, a single flowing sentence, no headline prefix, no dash-separated title. Time, direction, colour and shadow ONLY. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // PALETTE — axis-clean, VIVID LEGO-coded colour stories. No nouns of
  // places or things (a palette slot with scene nouns is a second-scene
  // injection).
  // ════════════════════════════════════════════════════════
  brickbot_airfield_palette: {
    format: 'simple',
    theme: `VIVID COLOUR PALETTES for a LEGO airfield diorama — each entry is ONE cohesive colour story, 12-24 words.

⚠️ SATURATED AND COMMITTED. LEGO is a toy made of bright plastic and that is the point. At least 18 of the 25 entries are BOLD — strong saturated colour with real contrast. At most a handful are softer period registers, and even those keep one saturated accent. BANNED WORDS: muted, faded, washed-out, bleached, desaturated, dusty, grey-toned, subdued, restrained, barely-there, low-saturation.

STRICTLY COLOUR AND LIGHT WORDS ONLY. NO nouns of things or places, NO aircraft, NO scene, NO lighting condition, NO camera. A palette entry that names an object injects a second scene.

Use LEGO-coded colour names: bright red, cool yellow, medium blue, dark azure, bright light orange, lime, sand green, dark tan, reddish brown, olive green, magenta, bright pink, dark purple, light bley, dark bley, white, black, trans-clear, trans-orange, trans-blue, trans-neon-green, metallic gold, metallic silver.

VARIETY MANDATE — spread across: cheerful primary trios · a single blazing colour against near-black · racing liveries with a hard third accent · tropical brights · jewel tones with metallic trim · sunset warms · circus reds and golds · candy brights · high-contrast complementaries (orange against dark azure, lime against magenta) · trans-element glow accents · art-deco silver-black-and-one-colour · autumn saturates · deep blues with hot accents · two-tone with a metallic note · bold earth registers that still sing.`,
    touchpoints: [
      'Blazing bright red and cool yellow against deep black, a loud circus trio with hard graphic contrast.',
      'Bright light orange against dark azure with a white accent, punchy complementary contrast that pops from across the room.',
      'Cherry red, warm cream and gloss black with one metallic gold trim note, a crisp high-contrast racing register.',
      'Lime and magenta with a dark bley ground, a deliberately loud clash sharpened by one white highlight.',
      'Deep dark azure and bright pink with a trans-clear glint, jewel-bright and cold with a hot accent.',
      'Metallic silver, gloss black and white with a single blazing bright-red accent, sharp art-deco graphic drama.',
    ],
    instructions: `Each entry is ONE colour story, 12-24 words, a single flowing sentence, no headline prefix, no dash-separated title. Colour and light words only — no object nouns at all. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },

  // ════════════════════════════════════════════════════════
  // FIELD EVENT — 50%-gated conditional. Vivid, playful, in brick.
  // ════════════════════════════════════════════════════════
  brickbot_airfield_field_event: {
    format: 'simple',
    theme: `THE FIELD EVENT — a secondary beat on a LEGO airfield, 16-30 words, rendered in BRICK PARTS with a visible physical impact.

${DELIGHT_LAW}

⚠️ PLAYFUL AND VIVID. A dull gust is a miss. Reach for the beat that makes someone smile or lean in: a brick flamingo flock lifting off, a hot-air balloon drifting across the strip, a kite tangled in the rigging, a brick elephant ambling onto the threshold, a shower of trans-pink blossom plates, confetti studs, a runaway cart, a brass band's instruments scattering.

${BRICK_LAW}

${NO_TEXT_LAW} A towed banner or pennant is ALWAYS plain or carries one painted geometric shape, never a slogan.

RIGID-OBJECT WORDS ARE BANNED for anything made of air, smoke, light, dust or water: NEVER column, pillar, wall, tower, bar, ribbon, disc, sheet, beam, or "shaped like". Smoke is a curling trail of white cloud-slope bricks. Dust is a scatter of tan studs. Water is a spray of trans-blue plates. Light is a glow spreading outward across a named lit surface.

VARIETY MANDATE — one each: prop-wash flattening a fan of tuft elements and lifting a scatter of tan studs · the wind cone snapping stiff and straight out on its mast · a curling trail of white cloud-slope bricks streaming off a wingtip smoke pod · a flock of trans-pink brick flamingos lifting off a lagoon of trans-blue plates · a striped brick hot-air balloon drifting low across the far end of the strip · a kite on a long line tangling itself in the bar-and-clip rigging · a brick elephant ambling out onto the strip threshold with a crewman waving both arms · trans-clear rain rods slanting across the field and beading along the top wing · a brick bird-flock scattering up off the hangar ridge · a round hay-bale brick rolling loose across the threshold trailing straw studs · a trans-orange spark spitting from the exhaust stubs as the engine catches · a gust snatching a canvas tent flap up off its pegs · white plate-flecks sheeting up behind a pair of brick skis · a spray of trans-blue plates thrown wide off the floats · a loose fabric panel peeling back along the lower wing and rippling free · a shower of trans-pink blossom plates drifting across the grass from an orchard row · a plain pennant chain snapping taut along its bunting line · a brick sheep flock breaking away from the strip edge in a ragged line · a stack of round-brick fuel drums toppling one after another across the apron · a runaway produce cart bouncing down the strip with apples scattering as red studs · a scatter of confetti studs still settling after a race finish · a dog figure streaking flat out down the strip edge after the machine · a tarpaulin fabric element ballooning off a parked wing · a brass-band instrument tipping off a stand as the wash hits, brick horn rolling away · a trans-red flare arcing up and over from beside the ops hut leaving a curl of cloud-slope bricks.`,
    touchpoints: [
      'A flock of trans-pink brick flamingos lifting off a lagoon of trans-blue plates, legs still trailing and wing plates flared wide across the strip edge.',
      'A striped brick hot-air balloon drifting low across the far end of the strip, its basket a stud above the hedgerow and a crewman leaning out over the rim.',
      'A kite on a long line tangling itself in the bar-and-clip rigging, the fabric element pinned flat against the strut cage and two kid minifigures hauling below.',
      'A runaway produce cart bouncing down the strip with red apple studs scattering ahead of it and one wheel already off its axle pin.',
      'Prop-wash flattening a broad fan of tuft elements behind the tail and lifting a loose scatter of tan studs off the strip in a wide low arc.',
      'A brick elephant ambling out onto the strip threshold, trunk raised, while a crewman minifigure waves both yellow arms at it from the verge.',
    ],
    instructions: `Each entry is ONE field event, 16-30 words, a single flowing sentence, no headline prefix, no dash-separated title. Event and its brick-built impact only — no camera, no lighting condition, no palette, no aircraft colour. Output a NUMBERED list, one entry per line, no internal newlines.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(
    `No recipe for pool "${POOL}". Add it to POOL_RECIPES. Available: ${Object.keys(POOL_RECIPES).join(', ')}`
  );
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
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: SONNET,
        max_tokens: 16000,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Sonnet ${res.status}: ${(await res.text()).slice(0, 300)}`);
    const data = await res.json();
    return (data.content?.[0]?.text || '').trim();
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseArray(text) {
  const body = text
    .replace(/```[a-z]*\n?/gi, '')
    .replace(/```/g, '')
    .trim();
  const lines = body.split('\n');
  const entries = [];
  let current = null;
  const numRe = /^\s*(\d+)\s*[.):\]]\s*(.+)$/;
  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const m = trimmed.match(numRe);
    if (m) {
      if (current) entries.push(current);
      current = m[2].trim();
    } else if (current) current += ' ' + trimmed;
  }
  if (current) entries.push(current);
  const cleaned = entries
    .map((e) => e.replace(/^["'`]+|["'`]+$/g, '').trim())
    .filter((e) => e.length >= 20 && e.length <= 1200);
  if (cleaned.length === 0) throw new Error('no numbered entries parsed');
  return cleaned;
}

const STOP = new Set([
  'the',
  'and',
  'with',
  'from',
  'into',
  'that',
  'this',
  'over',
  'under',
  'onto',
  'across',
  'their',
  'while',
  'every',
  'each',
  'lego',
  'brick',
  'bricks',
  'plate',
  'plates',
  'minifig',
  'minifigs',
  'minifigure',
]);

function signatureOf(entry) {
  const words = String(entry)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP.has(w));
  const uniq = [...new Set(words)].slice(0, 12).sort();
  return uniq.join('|');
}

function titleOf(entry) {
  const dashIdx = String(entry).indexOf('—');
  if (dashIdx < 0) return null;
  return entry.slice(0, dashIdx).trim().toLowerCase();
}

function dedupe(entries) {
  const seenSigs = new Map();
  const seenTitles = new Map();
  const kept = [];
  const dropped = [];
  for (const e of entries) {
    if (typeof e !== 'string' || e.length < 20) continue;
    const title = titleOf(e);
    if (title && seenTitles.has(title)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'title' });
      continue;
    }
    const sig = signatureOf(e);
    if (sig.length < 10) {
      if (title) seenTitles.set(title, e);
      kept.push(e);
      continue;
    }
    if (seenSigs.has(sig)) {
      dropped.push({ entry: e.slice(0, 80), reason: 'body' });
      continue;
    }
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
  try {
    arr = parseArray(text);
  } catch (e) {
    console.error('Parse failed:', e.message);
    console.error('First 400 chars:', text.slice(0, 400));
    return [];
  }
  console.log(`  • Sonnet returned ${arr.length} entries in ${elapsed}s`);
  return arr;
}

(async () => {
  const outPath = path.resolve(`scripts/bots/brickbot/seeds/${POOL}.json`);
  let preExisting = [];
  if (fs.existsSync(outPath)) {
    try {
      preExisting = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {}
  }
  const finalTarget = TARGET ?? preExisting.length + COUNT;
  const startCount = preExisting.length;
  console.log(
    `Pool "${POOL}": ${startCount} → ${finalTarget} (iterative gen+dedup)${DRY ? ' (dry-run)' : ''}`
  );
  let pool = [...preExisting];
  let iteration = 0;
  while (pool.length < finalTarget && iteration < MAX_ITERATIONS) {
    iteration++;
    const stillNeeded = finalTarget - pool.length;
    const batchSize = Math.min(30, Math.ceil(stillNeeded * 1.4));
    console.log(
      `\nIteration ${iteration}: pool at ${pool.length}/${finalTarget}, need ${stillNeeded} more, gen ${batchSize}`
    );
    const fresh = await generateBatch(batchSize);
    if (fresh.length === 0) {
      console.warn('  ⚠ empty Sonnet response — stopping iteration');
      break;
    }
    const within = dedupe(fresh);
    if (within.dropped.length > 0)
      console.log(`  • within-batch dedup dropped ${within.dropped.length}`);
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
    if (toAdd.length === 0 && newUnique.length === 0) {
      console.warn('  ⚠ batch added nothing — Sonnet may be exhausted on theme, stopping');
      break;
    }
  }
  console.log(
    `\n━━━ Final: ${pool.length}/${finalTarget} entries (${pool.length - startCount} new)`
  );
  if (DRY) {
    console.log('\nDry-run — not writing to disk.');
    return;
  }
  const bakPath = outPath + '.bak-' + Date.now();
  if (fs.existsSync(outPath) && preExisting.length > 0) {
    fs.copyFileSync(outPath, bakPath);
    console.log(`Backed up existing pool → ${bakPath}`);
  }
  fs.writeFileSync(outPath, JSON.stringify(pool, null, 2));
  console.log(`✓ Wrote ${pool.length} entries → ${outPath}`);
})();
