#!/usr/bin/env node
/**
 * Generate a MechBot axis pool using Sonnet.
 *
 * Mirrors the gen-dragonbot-pool.js / gen-gothbot-pool.js infrastructure:
 * signature-based dedup, --target iterative gen+dedup loop, append-mode
 * preservation of existing entries. Pool recipes are MechBot-bespoke.
 *
 * Usage:
 *   node scripts/gen-mechbot-pool.js --pool titan_war_lighting --target 50
 *   node scripts/gen-mechbot-pool.js --pool titan_war_drama --target 50
 *   node scripts/gen-mechbot-pool.js --pool titan_war_composition --target 15
 *
 * Output: scripts/bots/mechbot/seeds/<pool>.json
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
const COUNT = parseInt(flag('count', '30'), 10);
const TARGET = flag('target', null) ? parseInt(flag('target', '0'), 10) : null;
const MAX_ITERATIONS = parseInt(flag('max-iter', '15'), 10);
const DRY = has('dry-run');

if (!POOL) {
  console.error('Usage: --pool <name> --count <N> [--target N] [--dry-run]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// POOL RECIPES — MechBot bespoke (titan-war-machines path, 2026-05-15)
// ─────────────────────────────────────────────────────────────

const POOL_RECIPES = {
  // ─── mech-skyships path: composition (sky vertigo angles) ───
  mech_skyships_composition: {
    format: 'simple',
    theme: `SKY-VERTIGO CAMERA ANGLES for the mech-skyships path — each entry specifies a camera position + framing that makes the viewer FEEL the air, the altitude, and the speed of the predatory sci-fi skyship through perspective alone. Each entry 25-50 words.

⚠️ MANDATORY — every entry must convey VERTIGO + AERIAL spectacle. The viewer's gut reaction must be "I feel the altitude" or "I feel the speed."

✓ SKY-VERTIGO ANGLE CATEGORIES (vary across):
  • WORM'S-EYE FROM GROUND — camera at ground level looking straight up as the skyship roars overhead, hull filling the upper sky-frame
  • OVER-THE-WING POV — camera mounted on the skyship's wing looking forward toward a target / horizon, blade-wing filling foreground edge
  • COCKPIT/CANOPY-POV — looking through forward-facing canopy at the target ahead, reticle / HUD elements visible at frame edge
  • GOD'S-EYE FROM HIGHER ALTITUDE — camera at higher altitude looking down at skyship + ground far below, multiple cloud-layers between
  • THROUGH-CLOUD-LAYER BREAK — skyship piercing through a cloud-deck from above or below, vapor-cone bursting off prow
  • MOUNTAIN-PASS THREADING — skyship banking hard through narrow gap between snow-capped peaks, peaks framing the frame
  • LOW-PASS OVER CITY — camera at street-level / rooftop as skyship roars past tower-tops, windows reflecting hull-glow
  • CHEEK-TO-CHEEK PARALLEL — camera alongside skyship at matching speed, hull filling right or left half of frame, contrails behind
  • FORMATION-FLYBY — camera leading the formation, ships in V or wedge behind, exhaust-trails trailing
  • DOGFIGHT-BANK PURSUIT — camera locked on skyship banking hard through cloud-cover in pursuit, motion-blur on wingtips
  • CARRIER-LAUNCH — skyship deploying from a larger sky-vessel (mothership-class), scale-prover smaller ships visible
  • ATMOSPHERIC RE-ENTRY BURN — skyship descending through fire with thermal-shield glowing white-hot, atmospheric burn-trail
  • VERTICAL CLIMB — skyship climbing straight up through cloud layers, exhaust-cone trailing below, sun-glare ahead
  • DIVE-BOMB DESCENT — camera tracking skyship in steep dive toward ground target, ground rushing up
  • HOVER-OVER-WASTELAND — skyship suspended motionless over visible ground action, ground figures looking up
  • UNDER-THE-BELLY — camera directly beneath skyship as it passes overhead, weapon-mounts and exhaust-vents visible
  • TILT-BACK-FROM-SHADOW — camera on the ground in the moving shadow of the skyship overhead, sun blocked by hull silhouette
  • ABOVE THE CLOUD DECK — wide aerial shot at cloud-bank altitude, skyship piercing the cloud-deck with upper hull in sun and lower in shadow
  • THROUGH-DEBRIS-CLOUD — camera tracking skyship through a debris field / explosion aftermath, hull weaving through tumbling wreckage`,
    touchpoints: [
      'WORM\'S-EYE FROM GROUND — camera flush against cracked desert hardpan looking straight up as the skyship roars overhead, blade-hull filling the upper frame, exhaust-cone trailing white-hot vapor, ground figures sprinting in the foreground silhouetted against the sun',
      'OVER-THE-WING POV — camera mounted on the skyship\'s starboard blade-wing looking forward toward a distant target spire, wing dominating the lower-left of frame, target ship banking away across cumulus cloud-cover',
      'CANOPY-POV PURSUIT — looking through forward canopy at the target skyship banking away in pursuit, reticle elements glowing red at frame edge, instrument-glow reflected on the canopy glass, sun-glare across the top',
      'GOD\'S-EYE FROM HIGHER ALTITUDE — high-aerial view looking down at the skyship gliding between two cloud-layers, ground far below visible through a break in the lower cloud-deck, multiple ship-specks at vanishing point',
      'THROUGH-CLOUD-LAYER BREAK — skyship in the act of piercing the cloud-deck from above, hull half-emerging into open sky, vapor-cone bursting off prow, sun-shafts breaking through the cloud-tear',
      'MOUNTAIN-PASS THREADING — skyship banking hard through a narrow gap between snow-capped peaks, peaks framing the left and right edges of frame, blade-wings nearly grazing rock, contrails curling',
      'LOW-PASS OVER MEGACITY — camera at rooftop level as the skyship roars past tower-tops, neon signage reflecting off the hull-plating, downwash visible kicking debris from rooftops, distant skyline lit in dusk-orange',
      'CHEEK-TO-CHEEK PARALLEL — camera alongside the skyship at matching speed, hull filling the right half of the frame from prow to stern, contrails trailing behind, distant fleet specks visible at vanishing point left',
      'FORMATION-FLYBY — camera leading the formation at jet altitude, three ships in V-formation behind, exhaust-trails braiding, sun behind the formation casting silhouette, distant carrier-airship at horizon',
      'DOGFIGHT-BANK PURSUIT — camera locked on the skyship banking hard through dense cumulus in pursuit of an off-frame target, motion-blur on wingtips, missile-launch flare from underside, contrail spiraling',
      'CARRIER-LAUNCH DEPLOYMENT — skyship deploying from a larger mothership-class carrier visible at frame-top, scale-prover smaller ships in the distance, atmospheric haze separating altitudes, sun-shafts',
      'ATMOSPHERIC RE-ENTRY BURN — skyship descending through fire with thermal-shield glowing white-hot at prow, atmospheric burn-trail crossing the upper sky, ground far below partially visible through plasma-glare',
      'VERTICAL CLIMB — skyship climbing straight up through three cloud-layers, exhaust-cone trailing below in a vapor-pillar, sun-glare ahead at the apex of climb, smaller ships specks lower in formation',
      'DIVE-BOMB DESCENT — camera tracking the skyship in steep dive toward a ground target, ground rushing up below, weapon-mounts charging visibly, motion-blur on the hull, debris already in the air',
      'HOVER-OVER-WASTELAND — skyship suspended motionless above visible ground action, ground figures with rifles looking up, dust-cloud kicked up by downwash, multiple smaller ships circling at altitude',
      'UNDER-THE-BELLY PASS — camera directly beneath the skyship as it passes overhead, weapon-mounts and exhaust-vents visible against the sky, sun-glare at edge, ground rushing in the foreground motion-blur',
      'TILT-BACK FROM SHADOW — camera on a hilltop in the moving shadow of the skyship overhead, sun blocked by hull silhouette above, ground figures shielding eyes, skyship hull edge-lit by sun-rim',
      'ABOVE CLOUD-DECK PIERCE — wide aerial shot at cloud-bank altitude, skyship piercing the cloud-deck with upper hull in golden sun and lower half in deep cloud-shadow, smaller ships visible at the cloud-line',
      'THROUGH-DEBRIS-CLOUD WEAVE — camera tracking the skyship as it weaves through a tumbling debris field aftermath of an explosion, hull dodging chunks of wreckage, lens-flare from a distant fire',
      'OVER-THE-SHOULDER FROM PILOT — POV behind a tiny pilot figure standing on a tower-top watching the skyship pass overhead, pilot in foreground silhouetted, skyship dominating midground at full scale',
    ],
    instructions: `Each entry is ONE specific sky-vertigo camera-angle preset, 25-50 words. Format: "ANGLE NAME CAPS — camera position + what dominates the frame + aerial/scale-prover reference". Vary across the 15+ angle categories. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mech-skyships path: lighting (aerial flight) ───
  mech_skyships_lighting: {
    format: 'simple',
    theme: `AERIAL FLIGHT LIGHTING for the mech-skyships path. Each entry is ONE specific cinematic lighting setup for sky-based action. Each entry 20-40 words.

⚠️ STRICT BAN — NO "volumetric haze / generic atmospheric fog" as the PRIMARY lighting language. Volumetric god-rays are OK as a sky element but not the primary lighting mode. Lighting must specify SOURCE + DIRECTION + COLOR + behavior.

🚫 ALSO BANNED:
• NO cosmic/astronomy vocabulary (K-type dwarfs / nebula light / wrong fit for aerial flight)
• NO daylight-resort-vista cheerful flat-sky
• NO ground-cave/interior lighting modes

✓ MANDATORY VARIETY — distribute roughly evenly across:
  A. **GOLDEN HOUR HIGH-ALTITUDE** (~15%): warm low-angle sun glancing across hull-tops, long shadows on cloud-deck
  B. **DAWN ABOVE THE CLOUD-DECK** (~15%): cold blue ambient + first warm orange touching upper hull surfaces, dual-color contrast
  C. **DUSK BLOOD-RED HORIZON** (~10%): sun at horizon bleeding crimson across the entire sky, ships silhouetted edge-red
  D. **STORM-CELL LIGHTNING FLASH** (~10%): pre-storm dark with actinic-white lightning forks briefly silhouetting ship and clouds
  E. **NIGHT WITH ENGINE-GLOW + RUNNING-LIGHTS** (~10%): cold moonlight base + ship's own engine-glow + chassis running-lights as primary illumination
  F. **SUNSET PURPLE-GOLD GRADIENT** (~10%): sky purple at zenith / gold at horizon, ships backlit edge-amber
  G. **ATMOSPHERIC RE-ENTRY THERMAL BURN** (~5%): white-hot plasma-shield at prow, atmospheric burn-trail providing primary illumination
  H. **MUZZLE-FLASH WEAPONS-DISCHARGE** (~10%): combat scene where weapon-discharge from the ship provides strobing primary light against darker background
  I. **NEON-CYBERPUNK CITY-GLOW UPLIGHT** (~5%): low-altitude over a neon megacity, multi-color sign-lights uplighting the ship's underside
  J. **ORBITAL TWILIGHT TERMINATOR** (~5%): high-altitude shot at the day/night terminator-line, half hull in sun + half in shadow
  K. **AURORA EM-WARFARE INTERFERENCE** (~5%): high-altitude with aurora-coded electromagnetic warfare distorting the sky in green/violet curtains`,
    touchpoints: [
      'GOLDEN HOUR HIGH-ALTITUDE — warm low-angle sun glancing across hull-tops casting long amber shadows down onto the cloud-deck below, clear air, every panel of the skyship crisp in the backlight',
      'DAWN ABOVE CLOUD-DECK — cold blue ambient with first warm orange touching only the upper hull surfaces of the skyship, dual-color contrast, cloud-deck below glowing pink from horizon-line sun',
      'DUSK BLOOD-RED HORIZON — sun at horizon bleeding deep crimson across the entire sky, the skyship silhouetted edge-red against the burning sky, hard shadows cast on the cloud-deck below',
      'STORM-CELL LIGHTNING FLASH — pre-storm dark with actinic-white lightning forks branching between charged cloud-banks, briefly silhouetting the skyship in stark white-on-black, deep shadow between flashes',
      'NIGHT ENGINE-GLOW PRIMARY — cold moonlight base ambient with the skyship\'s own engine-glow and chassis running-lights providing primary illumination, hull self-lit in amber/cyan against deep cobalt sky',
      'SUNSET PURPLE-GOLD GRADIENT — sky transitioning purple at zenith to gold at horizon, skyship backlit edge-amber, cloud-deck below catching gold from horizon-side, shadows long and stretched',
      'ATMOSPHERIC RE-ENTRY THERMAL — white-hot plasma-shield at the skyship\'s prow providing primary illumination, atmospheric burn-trail crossing the upper sky behind, hull glowing orange-white from heat',
      'MUZZLE-FLASH STROBE — combat scene with weapon-discharge from the skyship providing strobing primary light against deep storm-darkness, sharp shadow contrast pulsing in firing-rhythm',
      'NEON-CYBERPUNK CITY-GLOW UPLIGHT — low-altitude over a neon megacity at night, magenta and cyan sign-lights from below uplighting the skyship\'s underside hull, hard upward shadows',
      'ORBITAL TWILIGHT TERMINATOR — high-altitude shot at the day/night terminator-line, half the skyship hull in golden sun and half in cobalt shadow, atmospheric blue curve visible at horizon',
      'AURORA EM-WARFARE INTERFERENCE — high-altitude with aurora-coded electromagnetic distortion curtaining the sky in green-violet ribbons, skyship hull faintly reflecting the aurora-color',
      'HARSH MIDDAY ABOVE-CLOUD — overhead white sun with razor-edged shadows on the skyship hull, cloud-deck below bleached pale, heat-shimmer visible at distance',
      'OVERCAST BATTLEFIELD SKY — uniform blanket-cloud diffuse light, low contrast, skyship reading in muted tones, ground far below visible through atmospheric haze',
      'VOLCANIC UPLIGHT FROM BELOW — flying over an active volcanic region with orange lava-glow uplighting the skyship\'s underside hull in warm orange-red, smoke-columns from below',
      'TWIN-SUN ALIEN SKY — alien-planet sky with two suns of different colors casting overlapping double-shadows on the skyship hull, atmospheric tint pulled toward unusual color',
    ],
    instructions: `Each entry is ONE specific aerial flight lighting setup, 20-40 words. Format: "LIGHTING MODE CAPS — [source + direction + color + shadow character + sky context]". Distribute across the 11 buckets. NO "volumetric haze / generic atmospheric fog" as PRIMARY mode. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mech-skyships path: engagement (ALWAYS-ON multi-actor combat scene) ───
  mech_skyships_engagement: {
    format: 'simple',
    theme: `MULTI-ACTOR COMBAT NARRATIVE BEATS for the mech-skyships path — each entry describes a SCENE with the hero skyship + 2-4 OTHER actors in active interaction. NOT a solo hero ship flying. Each entry 40-80 words.

⚠️ MANDATORY — every entry must include MULTIPLE actors in the scene with INTERACTION between them. The hero ship is engaged with: other ships (enemy / allied / fleet) AND/OR ground forces AND/OR a target structure AND/OR a city/installation reacting AND/OR debris/wreckage from prior kills. The viewer must read the STORY in 2 seconds.

🚫 BANNED — NO solo hero-ship-flying-through-clouds entries. NO peaceful cruise. NO empty sky. If the entry could be summed up as "ship in pretty sky," it FAILS the gate.

✓ ENGAGEMENT TYPES — vary across:
  A. **DOGFIGHT TANGLE** (~15%): 2-4 enemy ships locked in pursuit pattern with hero, missile-trails crossing, one already smoking from hits
  B. **SQUADRON STRIKE** (~15%): wing of ships diving in formation toward target convoy / installation / city below, AA-fire rising
  C. **ESCORT DEFENSE** (~10%): hero ship shielding larger carrier-class vessel from incoming attackers, weapons firing forward
  D. **CHASE PURSUIT** (~10%): hero ship in stern-chase of fleeing target ship, target throwing debris/countermeasures back, contrails braided
  E. **ARRIVAL / DESCENT** (~10%): hero ship breaking atmosphere over a ground target, ground troops scattering, AA-emplacements rotating up
  F. **AMBUSH-FROM-CLOUDS** (~10%): hero ship bursting out of cloud-cover to engage unsuspecting enemy formation, weapons opening up
  G. **BOMBING-RUN** (~10%): hero ship in low-pass over target releasing ordnance, multiple explosions blooming behind, allied wingmen following
  H. **DROP-DEPLOYMENT** (~5%): hero ship hovering low while smaller drop-pods / drones deploy from chassis-bays toward ground
  I. **INTERCEPT** (~5%): hero ship banking hard to intercept incoming threat (missile-swarm / kamikaze ship / boarding pod), threat visible at vanishing point
  J. **KILL-CONFIRMED** (~5%): hero ship banking away from a fresh kill, target ship spiraling down in flames, allied formation in deep distance
  K. **DEEP-STRIKE** (~5%): hero ship in low-altitude attack run between buildings, target rooftop / installation in sight, ground AA tracking it

Each entry must:
• Name the engagement TYPE in the first 6 words
• Identify the hero ship + the OTHER actors (2-4 named: "enemy interceptors" / "carrier-class vessel" / "ground AA emplacements" / "drop-pods" / "wingmen formation" / "target convoy" / "boarding swarm" / etc.)
• Describe the INTERACTION (weapons-fire / pursuit / defensive maneuver / target reaction / debris / explosions)
• Add 1-2 scale-prover details when appropriate (ground forces, dwarfed buildings, distant fleet specks)`,
    touchpoints: [
      'DOGFIGHT TANGLE — hero skyship banking hard pursued by three enemy interceptors in tight formation, missile-trails braiding between all four ships, one enemy already trailing smoke from a clean hit, contrails crossing the cloud-layer in tight loops, sun-glare lens-flaring across the engagement',
      'SQUADRON STRIKE — wing of five hero ships in V-formation diving toward an enemy convoy crawling across the wasteland below, lead ship releasing first ordnance with bloom-explosion already blooming on a target vehicle, AA-tracer rising from the convoy in colored arcs',
      'ESCORT DEFENSE — hero skyship positioned in front of a larger carrier-class vessel, weapons firing forward at incoming enemy formation, shield-impact discharge rippling across the hero ship\'s prow, allied fighters launching from the carrier behind',
      'CHASE PURSUIT — hero ship in stern-chase of a fleeing enemy ship, target throwing countermeasure-flares back in a spray of decoys, both ships banked hard through cloud-cover, hero ship\'s weapon-mount charging glowing red',
      'ARRIVAL DESCENT — hero ship breaking atmospheric re-entry over a defended ground installation, ground AA emplacements visibly rotating to track it, troops scattering for cover, dust and debris kicked up by downwash, allied dropships descending in formation behind',
      'AMBUSH FROM CLOUDS — hero ship bursting up out of a cumulus cloud-bank to engage an unsuspecting enemy formation at altitude, weapons opening up mid-emerge, enemy ships visibly reacting with hard banks',
      'BOMBING RUN OVER CITY — hero ship in low-pass over an enemy megacity releasing ordnance, multiple bloom-explosions in the city streets behind it, allied wingmen following in echelon, AA-fire rising from rooftops',
      'DROP DEPLOYMENT — hero ship hovering low above a ground target, multiple smaller drop-pods deploying from chassis-bays in sequence, pods firing retro-thrusters toward landing zones, ground figures visible below preparing to engage',
      'INTERCEPT FROM ALTITUDE — hero ship banking hard from cruise altitude to intercept an incoming missile-swarm, missile contrails visible spiraling toward the hero, point-defense weapons firing tracer-streams',
      'KILL CONFIRMED BANK-AWAY — hero ship banking away from a fresh kill, target enemy ship spiraling down in flames trailing black smoke, allied formation visible in deep distance continuing engagement',
      'DEEP STRIKE BETWEEN BUILDINGS — hero ship in low-altitude attack run threading between tower-tops of an enemy megacity, target installation visible ahead with weapons charging, ground AA-fire tracking from rooftops',
      'CARRIER STRIKE — hero ship launching torpedo run against a colossal enemy carrier-class vessel, torpedo contrails extending forward, carrier point-defense lighting up in counter-fire, allied wingmen flanking',
      'WAVE-ATTACK SWARM — hero ship leading a wave of smaller drone-craft toward a larger enemy target, drones spreading into attack formation, target rotating defensive guns to track the wave',
      'WINGMAN-DOWN MOMENT — hero ship banking past a fellow ship spiraling down in flames, looking back at the dying wingman, enemy ship visible at vanishing point peeling away from the kill',
      'PINCER MOVEMENT — hero ship closing on enemy target from one flank while allied ship visible closing from opposite flank, target ship caught between, hero\'s weapons charging for the kill-shot',
      'BOARDING REPEL — hero ship engaging incoming boarding-pods from enemy formation, point-defense lighting up the swarm of pods, debris from destroyed pods raining downward through cloud-layer',
      'RESCUE EXTRACTION — hero ship dropping low over a downed friendly ship in burning wreckage, deployment-bay open, ground figures running toward extraction, enemy ships closing at distance',
      'COVER-FIRE ADVANCE — hero ship laying suppressive fire upward at enemy formation while allied gunship advances behind it toward target, multiple weapon-flashes from hero\'s mounts, enemy ships scattering',
      'HIGH-G EVASION — hero ship pulling extreme maneuver through cloud-canyon to evade multiple incoming missiles, missiles tracking in trailing contrails, enemy ship visible at deep distance that launched them',
      'DRAGON-DESCENT OVER CITY — hero ship descending vertically toward a megacity target, AA-streams from below tracking it, target buildings already burning, allied formation circling at higher altitude',
      'FRIENDLY-FORMATION INBOUND — hero ship leading a wedge of allied ships inbound to engagement zone visible at deep distance, distant flashes from ongoing combat, hero\'s weapons charging for the engagement',
    ],
    instructions: `Each entry is ONE multi-actor combat narrative beat, 40-80 words. Format: "ENGAGEMENT TYPE CAPS — hero ship + 2-4 other actors + their interaction + scale-provers if relevant". STRICT mandate: MULTIPLE actors interacting visibly. NO solo hero-ship-flying. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── mech-skyships path: drama (40%-gated sky-combat phenomena) ───
  mech_skyships_drama: {
    format: 'simple',
    theme: `40%-GATED SKY-COMBAT PHENOMENA for the mech-skyships path — a sky-event that amplifies the spectacle of aerial warfare. Each entry 25-50 words.

⚠️ STRICT — each phenomenon must amplify SKY-COMBAT spectacle. Star Wars trench-run + 40K Imperial fleet + Mass Effect orbital + Independence Day + Battle of Endor lineage. NO peaceful nature, NO biomech, NO fantasy.

✓ SKY-COMBAT PHENOMENA — distribute across:
  • TRACER-ROUND ARCS streaking across the sky in colored lines
  • MISSILE-LAUNCH from ship's underside with launch-flare and contrail
  • SHIELD-IMPACT DISCHARGE energy-shield rippling visibly under incoming fire
  • ORBITAL-STRIKE BEAM descending from above the atmosphere onto a ground target
  • DROPSHIP-DEPLOYMENT smaller craft launching from the skyship's chassis-bays
  • ATMOSPHERIC-RE-ENTRY BURN STREAK something descending from orbit through fire
  • FORMATION OF DISTANT SHIPS visible at vanishing point engaging unseen target
  • DOGFIGHT TANGLE multiple skyship silhouettes locked in pursuit across the sky
  • SONIC-BOOM SHOCKWAVE visible atmospheric ring from supersonic flyover
  • EXPLOSION-BLOOM from a destroyed ship visible at distance, debris-cloud expanding
  • CARRIER-AIRSHIP LOOMING vast carrier-class vessel in upper background deploying ships
  • DEBRIS-FIELD FOREGROUND wreckage tumbling through the air from a recent kill
  • SEARCHLIGHT-BEAMS from anti-air positions sweeping the sky tracking the skyship
  • LIGHTNING-STORM ELECTROMAGNETIC arc-discharges branching between charged cloud-banks
  • CONTRAIL TANGLE multiple ships' contrails crisscrossing the sky in dogfight patterns
  • DEPLOYED SWARM-DRONES launching from the skyship's hangar-bays in formation
  • PLASMA-DISCHARGE FROM HULL energy bleeding visibly between hull-plates after impact
  • CITY-BELOW-ON-FIRE distant city ablaze visible through cloud-breaks
  • CRASHED-SHIP-FIREBALL fresh impact-crater with rising flames at ground level visible
  • EMP-PULSE-DAMPENED HULL hull running-lights stuttering offline after EMP-burst
  • COMET-LIKE METEOR-STRIKE incoming kinetic-rod or asteroid impact across the upper sky`,
    touchpoints: [
      'TRACER-ROUND ARCS — colored tracer-round streaks crossing the sky in arcing lines from anti-air positions tracking the skyship, briefly illuminating the air around the hull',
      'MISSILE-LAUNCH FROM UNDERSIDE — skyship releasing a missile from its underside with launch-flare bloom and white-hot contrail spiraling toward an off-frame target',
      'SHIELD-IMPACT DISCHARGE — energy-shield rippling visibly under heavy incoming fire, hexagonal cells lighting up where rounds strike, electromagnetic discharge bleeding outward in arcs',
      'ORBITAL-STRIKE BEAM DESCENT — single column of focused energy descending vertically from above the atmosphere onto a distant ground target, accompanied by ground-flash visible through cloud-break',
      'DROPSHIP DEPLOYMENT — smaller craft launching in sequence from the skyship\'s chassis-bays, each dropship with its own engine-glow, deploying toward the ground far below',
      'ATMOSPHERIC-RE-ENTRY BURN STREAK — long re-entry streak crossing the upper sky with white-hot leading edge, something descending toward the battlefield from orbit, burn-trail visible for miles',
      'DISTANT FORMATION ENGAGING — formation of ships visible at vanishing point engaging an unseen target with weapon-flashes, smoke-columns rising from kills',
      'DOGFIGHT TANGLE — multiple skyship silhouettes locked in pursuit across the upper sky, contrails crisscrossing in tight loops, weapon-flashes between them',
      'SONIC-BOOM SHOCKWAVE — visible atmospheric shockwave ring expanding outward from a supersonic ship-flyby, briefly distorting the air, dual-vapor-cone in the wake',
      'EXPLOSION-BLOOM AT DISTANCE — bright orange explosion-bloom from a destroyed ship visible at deep distance, debris-cloud expanding outward, fireball still rolling',
      'CARRIER-AIRSHIP LOOMING ABOVE — vast carrier-class mothership in the upper background deploying smaller ships in waves, scale-prover for the hero ship',
      'DEBRIS-FIELD FOREGROUND — tumbling wreckage in the foreground from a recent kill, the hero skyship weaving through hull-fragments, dust and burning debris in the air',
      'SEARCHLIGHT BEAMS SWEEPING — multiple anti-air searchlights from ground positions sweeping the sky tracking the skyship, beams crossing through clouds',
      'LIGHTNING ELECTROMAGNETIC STORM — sky filled with branching electromagnetic arc-discharges between charged cloud-banks, occasional strikes hitting the skyship\'s antenna-arrays',
      'CONTRAIL TANGLE — multiple ships\' contrails crisscrossing the sky in tight dogfight patterns, sun lighting the white trails against deep blue, the spectacle of aerial battle visible in the trails alone',
      'DEPLOYED SWARM-DRONES — swarm of small combat drones launching from the skyship\'s hangar-bays in coordinated formation, engine-trails braiding behind them',
      'PLASMA-DISCHARGE FROM HULL — visible plasma-arc bleeding between damaged hull-plates after an impact, energy crackling across the chassis seams',
      'CITY-BELOW-ON-FIRE — distant city ablaze visible through breaks in the cloud-deck far below, multiple smoke-columns rising from the burning blocks',
      'CRASHED-SHIP FIREBALL — fresh impact-crater visible at ground level through a cloud-break, recently-downed ship with rising flames and smoke',
      'EMP-PULSE DAMPENED HULL — skyship\'s running-lights stuttering offline sequentially after an EMP-burst, hull going dark in cascade, engine-glow flickering',
      'COMET-LIKE METEOR-STRIKE — incoming kinetic-rod or meteor-strike crossing the upper sky with white-hot leading edge, contrail visible for miles, impending impact',
    ],
    instructions: `Each entry is ONE specific sky-combat phenomenon, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visual action + secondary detail + aerial/atmospheric note". STRICT sky-combat aesthetic — NO peaceful, NO biomech, NO fantasy. Amplifies aerial-warfare spectacle. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── titan-war-machines path: composition (vertigo angles) ───
  titan_war_composition: {
    format: 'simple',
    theme: `VERTIGO-INDUCING CAMERA ANGLES for the titan-war-machines path — each entry specifies a camera position + framing that makes the viewer FEEL the kilometer-scale of the titan through perspective alone. Each entry 25-50 words.

⚠️ MANDATORY — every entry must induce VERTIGO through scale-perspective. The viewer's gut reaction must be "I can FEEL how massive that is."

✓ VERTIGO ANGLE CATEGORIES (vary across these):
  • WORM'S-EYE-VIEW from titan's base — camera at ground level looking straight up the leg of the titan, foot/leg dominates lower frame, body recedes into perspective vanishing point overhead
  • FLY-BETWEEN-LEGS — camera positioned between two of the titan's leg-pillars at ground level, looking through to distant battlefield, leg-columns frame the shot like skyscrapers
  • KAIJU-STEP-DESCENDING — extreme low-angle as titan's foot DESCENDS toward viewer, debris and dust exploding outward, foot fills upper third of frame
  • AERIAL-ORBIT-AROUND-HEAD — camera at titan's head altitude, city/battlefield far below, head silhouette dominates against sky, jets/helicopters dwarfed mid-air for scale
  • DWARFED-SKYLINE-ESTABLISHING — wide cinematic shot from a kilometer away, titan stands in midground dwarfing entire city skyline, atmospheric haze receding miles into deep distance
  • SLOT-CANYON-BETWEEN-BUILDINGS — camera in narrow alley between skyscrapers at street level, titan visible filling the slot of sky between buildings overhead, scale shocking
  • CRACKED-PAVEMENT-FOREGROUND — extreme low POV with cracked asphalt and overturned vehicle in foreground, titan looming above mid-stride, scale-prover vehicles dwarfed
  • HELICOPTER-PASS — camera at jet altitude doing a pass alongside the titan's torso, titan visible across miles, ground far below
  • CLIFF-EDGE-VANTAGE — camera on a cliff or rooftop at human eye-level, titan rising from below the cliff, viewer feels precipice
  • MID-FALL-CAMERA — POV as if camera is in free-fall past the titan's chest, body fills frame, ground far below visible through motion-blur
  • SCRAPING-CLOUD-LAYER — wide aerial shot at cloud-bank altitude, titan's upper hemisphere PIERCING the cloud-deck, lower body invisible below clouds, jets visible at the cloud-line for scale
  • OVER-THE-SHOULDER-FROM-SOLDIER — POV behind a tiny human soldier on the ground, soldier in foreground, titan looms over them at full scale, viewer feels the soldier's perspective`,
    touchpoints: [
      'WORM\'S-EYE-VIEW UP THE LEG — camera at ground level looking straight up the leg-pillar of the titan, foot dominating lower third of frame, leg-armor receding into impossible perspective vanishing point overhead, head barely visible at the top of the sky',
      'FLY-BETWEEN-LEGS — camera positioned between two of the titan\'s massive leg-pillars at ground level, looking through to a distant burning battlefield, leg-columns framing the shot like ancient skyscraper columns',
      'KAIJU-STEP-DESCENDING — extreme low-angle as the titan\'s foot DESCENDS toward viewer mid-impact, dust and debris exploding outward in a concentric pressure-wave ring, foot filling the upper two-thirds of the frame, shock-cracks radiating across the ground',
      'AERIAL-ORBIT-AROUND-HEAD — camera at titan\'s head altitude tracking around it, head silhouette dominating against the sky, city/battlefield far below at the base, military jets dwarfed mid-air for scale reference',
      'DWARFED-SKYLINE-ESTABLISHING — wide cinematic establishing shot from a kilometer away, the titan stands in midground dwarfing the entire city skyline behind it, atmospheric haze receding miles into deep distance',
      'SLOT-CANYON-BETWEEN-BUILDINGS — camera in a narrow alley between skyscrapers at street level, the titan visible filling the SLOT of sky between buildings overhead, scale-shock from the impossibly-narrow frame against impossibly-large titan',
      'CRACKED-PAVEMENT-FOREGROUND — extreme low POV with cracked asphalt and an overturned car in foreground edge, the titan looming above mid-stride, scale-prover vehicles dwarfed by the leg in midground',
      'HELICOPTER-PASS ALONGSIDE TORSO — camera at jet altitude doing a flyby alongside the titan\'s torso, the titan visible across miles of the frame, ground far below, the camera and titan moving together',
      'CLIFF-EDGE-VANTAGE LOOKING DOWN — camera on a cliff at human eye-level, the titan rising from below the cliff and visible all the way to the head far above, viewer feels the precipice and the scale together',
      'MID-FALL-CAMERA — POV as if the camera is in free-fall past the titan\'s chest, the body filling the frame in motion-blur, ground far below visible through the blur, sense of vertigo and speed',
      'SCRAPING-CLOUD-LAYER — wide aerial shot at cloud-bank altitude, the titan\'s upper hemisphere PIERCING the cloud-deck, lower body invisible below clouds, military jets visible at the cloud-line for scale reference',
      'OVER-THE-SHOULDER-FROM-SOLDIER — POV behind a tiny human soldier on the ground in the foreground, the soldier silhouetted against the titan that LOOMS above them at full kilometer-scale, the viewer occupies the soldier\'s perspective',
      'STREET-LEVEL-WITH-DEBRIS — camera at street level with chunks of falling debris suspended in the foreground, the titan in midground walking through downtown crushing skyscrapers underfoot, the debris frames the shot',
      'AERIAL-WIDE-WITH-JETS-IN-FOREGROUND — high-altitude shot with a squadron of military jets in the foreground frame, the titan visible across miles in midground at the same altitude as the jets, ground far below',
      'BENEATH-THE-FALLING-FOOT — POV directly beneath as the titan\'s foot descends from above, sky disappearing as the foot fills the frame from above, the viewer about to be crushed, scale-shock at maximum',
    ],
    instructions: `Each entry is ONE specific vertigo camera-angle preset, 25-50 words. Format: "ANGLE NAME CAPS — camera position + what dominates the frame + scale-prover reference". Vary across the 10+ angle categories. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── titan-war-machines path: lighting (ground-based combat) ───
  titan_war_lighting: {
    format: 'simple',
    theme: `GROUND-BASED COMBAT LIGHTING for the titan-war-machines path. Each entry is ONE specific cinematic lighting setup for an active war zone. Each entry 20-40 words.

⚠️ STRICT BAN — NO "volumetric haze / atmospheric fog / volumetric god-rays / dust-particulate veil" as the PRIMARY lighting language. Those phrases fade every render to the same look. May appear as a secondary modifier only.

🚫 ALSO BANNED:
• NO cosmic/astronomy vocabulary (K-type dwarfs / M-class stars / nebulas / orbital phenomena — wrong fit for ground combat)
• NO "soft diffuse atmospheric" as primary mode
• NO cheerful daylight resort vistas

✓ MANDATORY VARIETY — distribute roughly evenly across these buckets:
  A. **HARD MIDDAY COMBAT** (~15%): overhead white sun, razor-edged shadows, high contrast, heat-shimmer at distance
  B. **DAWN MILITARY OPERATION** (~15%): cold pre-sunrise blue base + first warm orange touching highest titan surfaces, dual-color contrast
  C. **DUSK FIRE-GLOW** (~15%): sun-at-horizon orange-purple sky + warm fire-glow from burning city below uplighting the titan
  D. **NIGHT WITH MUZZLE-FLASH STROBE** (~15%): cold moonlight base + strobing white-hot muzzle-flashes from titan's weapons-fire creating freeze-frame illumination
  E. **SODIUM-AMBER URBAN** (~10%): sodium street-lamps + emergency floodlights from below, warm orange wash + hard shadows
  F. **STORM-LIGHTNING FLASH** (~10%): pre-storm dark + actinic-white lightning fork briefly silhouetting the titan against the sky
  G. **ARC-FLASH STROBE** (~5%): industrial arc-discharge from damaged power infrastructure briefly painting the titan in blue-white strobe
  H. **NUCLEAR-WINTER OVERCAST** (~5%): flat diffuse cold light through ash-fall, low contrast, ground bouncing fill-light into titan shadows
  I. **REACTOR-MELTDOWN GLOW** (~5%): titan or distant explosion lighting the scene in orange-white from a single point, hard shadows radiating outward
  J. **TACTICAL FLOODLIGHT ARRAY** (~5%): multiple bright stadium-style floodlights from elevated positions, titan with multiple overlapping cast shadows`,
    touchpoints: [
      'HARD MIDDAY COMBAT — overhead white sun casting razor-edged shadows directly beneath the titan, brutal high-contrast, heat-shimmer visible across the distant battlefield, clean air, every panel of the titan crisp',
      'DAWN MILITARY OPERATION — pre-sunrise cold blue base with first warm orange touching the highest titan surfaces, dual-color contrast, deep blue shadow in the lower frame, every titan detail readable in the gradient',
      'DUSK FIRE-GLOW — sun at horizon-line painting the sky purple-and-gold, warm fire-glow uplighting the titan from below from the burning city beneath, hard shadows cast skyward',
      'NIGHT MUZZLE-FLASH STROBE — cold cobalt moonlight as base, strobing white-hot muzzle-flashes from the titan\'s firing weapons creating freeze-frame illumination, sharp shadow contrast pulsing in rhythm',
      'SODIUM-AMBER URBAN — warm orange sodium-lamp wash across the downtown battlefield, emergency floodlights from below illuminating the titan\'s lower half, hard yellow shadows, after-image of cooler distant light',
      'PRE-STORM LIGHTNING FLASH — sky pre-storm dark, single actinic-white lightning fork briefly freezing the titan silhouetted against the sky, deep shadow areas momentarily readable, storm-darkness immediately after',
      'INDUSTRIAL ARC-FLASH STROBE — actinic blue-white arc-discharge from damaged power infrastructure briefly painting the titan in stuttering hard light, sodium-amber ambient between flashes',
      'NUCLEAR-WINTER OVERCAST — flat diffuse cold light through perpetual ash-fall, low contrast, ash-grey ambient everywhere, ground bouncing fill-light into the titan\'s shadows, distant fires barely visible',
      'REACTOR-MELTDOWN GLOW — distant catastrophic energy-event lighting the entire scene in orange-white from a single point on the horizon, hard shadows radiating outward, mushroom-cloud silhouette in the background',
      'TACTICAL FLOODLIGHT ARRAY — multiple bright stadium-style floodlights from elevated positions on surrounding ruins, the titan with multiple overlapping cast shadows in different directions, hard high-contrast frontal light',
      'SUNSET PURPLE-GOLD — sun at horizon with sky purple-and-gold gradient overhead, every titan surface backlit edge-amber, shadows long and stretched across the foreground rubble',
      'ORBITAL-STRIKE GLOW — single column of focused energy descending from above the atmosphere onto a distant target, ground-flash illuminating the titan from the side, dramatic single-source lighting',
      'BLOOD-RED DUSK — sun at horizon bleeding to deep crimson, hot red atmospheric glow across the entire battlefield, the titan silhouetted edge-red against the sky, hard shadows beneath',
      'COLD ARCTIC OVERCAST — flat blue-grey diffuse light through high cloud, ground bouncing fill-light upward, the titan reading in cool tones with snow accumulating on its shoulders',
      'BACKLIT SUNSET SILHOUETTE — sun positioned directly behind the titan making it a hard-edged silhouette with rim-light, foreground battlefield in deep shadow, sky in orange-gold blaze',
    ],
    instructions: `Each entry is ONE specific ground-based combat lighting setup, 20-40 words. Format: "LIGHTING MODE CAPS — [source + direction + color + shadow character + atmospheric note]". Distribute across the 10 buckets. NO "volumetric haze / atmospheric fog / volumetric god-rays" as PRIMARY mode. NO cosmic-astronomy vocabulary. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },

  // ─── titan-war-machines path: drama (40%-gated combat phenomena) ───
  titan_war_drama: {
    format: 'simple',
    theme: `40%-GATED COMBAT PHENOMENA for the titan-war-machines path — a war-event that amplifies the titan's biblical scale through scene context. Each entry 25-50 words.

⚠️ STRICT — each phenomenon must amplify SCALE + COMBAT spectacle. NO peaceful nature, NO Giger biomech, NO fantasy. Pacific Rim weather + Edge of Tomorrow battle-effects + Battlestar Galactica orbital combat + Mass Effect war-front lineage.

✓ COMBAT PHENOMENA — distribute across:
  • ORBITAL-STRIKE BEAM descending from the sky onto a distant target
  • EMP-BURST PULSE rippling across the battlefield disabling vehicles and lights
  • ARTILLERY-FLASH ROW periodic bright flashes on the horizon
  • SONIC-BOOM SHOCKWAVE from supersonic jet flyover or titan weapon-discharge
  • KAIJU-FOOTFALL PRESSURE-WAVE rippling outward from a titan footstep
  • FALLING MUNITIONS ARC visible streaks descending across the sky
  • SMOKE COLUMNS rising from distant burning city blocks beyond the horizon
  • REACTOR-MELTDOWN GLOW on the horizon — mushroom-cloud silhouette
  • PROPELLANT-VENT PLUME from the titan's chassis billowing volumetrically
  • DRONE-SWARM passing overhead in coordinated geometric formation
  • LIGHTNING STORM with electromagnetic arc-discharges branching between charged clouds
  • ATMOSPHERIC-ENTRY BURN streak crossing the upper sky — something descending from orbit
  • WEAPON-CHARGING GLOW on the titan or a distant mech, energy-conduits illuminated
  • TANK-BATTALION ADVANCE visible in deep distance, dust-cloud trailing
  • JET-SQUADRON FLYBY visible passing across the frame at distance
  • CARRIER-AIRSHIP looming in the upper background at altitude
  • CRASHED-JET FIREBALL fresh impact-crater with rising flames
  • DISTANT-TITAN SILHOUETTE another titan visible in the deep background mid-combat
  • SHIELD-IMPACT DISCHARGE energy-shield rippling under heavy fire
  • DEPLOYED COMBAT DRONES swarm-units launching from titan's chassis-bays
  • SEISMIC GROUND-CRACKS spreading outward from titan footfall
  • TRACER-ROUND ARCS streaking across the sky in colored lines`,
    touchpoints: [
      'ORBITAL-STRIKE BEAM — single column of focused energy descending vertically from above the atmosphere onto a target in deep distance, accompanied by ground-flash and outward shockwave',
      'EMP-BURST PULSE — visible electromagnetic shockwave rippling outward as ringed energy-distortion, briefly disabling all running-lights, vehicles, and signal-arrays across the battlefield',
      'ARTILLERY-FLASH ROW — periodic bright orange flashes along the horizon from distant artillery fire, briefly illuminating the underside of cloud-cover, smoke-trails rising from each impact',
      'SONIC-BOOM SHOCKWAVE — visible atmospheric shockwave ring expanding outward from a supersonic jet flyover or titan weapon-discharge, briefly distorting the air, dual-vapor-cone in the wake',
      'KAIJU-FOOTFALL PRESSURE-WAVE — visible ground-and-air pressure-wave rippling outward from a colossal titan footstep, ground compressing in concentric rings, dust lifted into the air',
      'FALLING MUNITIONS ARC — visible streaks of incoming artillery or missile-fire descending across the sky toward distant targets, each leaving a contrail across the upper atmosphere',
      'SMOKE COLUMNS BEYOND HORIZON — multiple smoke columns rising from a distant burning city blocks beyond the horizon, reaching high altitude before dispersing into the sky',
      'REACTOR-MELTDOWN GLOW — distant catastrophic energy-event lighting the horizon orange-white, atmospheric haze around the meltdown-site glowing dangerously, mushroom-cloud silhouette',
      'PROPELLANT-VENT PLUME — pressurized vapor cloud erupting from the titan\'s chassis-vents in volumetric volume, briefly obscuring the lower hemisphere of the titan in fog',
      'DRONE-SWARM FORMATION — dozens of small aerial mech-drones in coordinated geometric formation passing overhead, their running-lights tracing the formation pattern across the sky',
      'ELECTROMAGNETIC STORM — sky filled with branching electromagnetic arc-discharges between charged cloud-banks, occasional strikes hitting the titan\'s antenna-arrays with visible arc-flash',
      'ATMOSPHERIC-ENTRY BURN — long re-entry streak crossing the upper sky with white-hot leading edge, something descending toward the battlefield from orbit, burn-trail visible for miles',
      'WEAPON-CHARGING GLOW — energy-conduits illuminating along the titan\'s primary weapon-mount as charge builds, glow intensifying, sky around the muzzle starting to brighten',
      'TANK-BATTALION ADVANCE — visible armored column in deep distance, dust-cloud trailing behind, tank-treads kicking up debris, scale-prover for the titan above',
      'JET-SQUADRON FLYBY — visible jet squadron passing across the frame at distance, contrails behind them, dwarfed by the titan in midground for scale',
      'CARRIER-AIRSHIP LOOMING — vast carrier-airship looming in the upper background at altitude, deploying jets, scale-comparison against the titan',
      'CRASHED-JET FIREBALL — fresh impact-crater with rising flames and smoke at midground, recently downed jet, debris scattered, contextualizing the active combat',
      'DISTANT-TITAN SILHOUETTE — another titan visible silhouetted in the deep background, mid-combat with unseen enemy, smoke and flash from its weapons-fire',
      'SHIELD-IMPACT DISCHARGE — energy-shield rippling visibly under heavy incoming fire, hexagonal cells lighting up where rounds strike, electromagnetic discharge spreading',
      'DEPLOYED COMBAT DRONES — swarm of small combat drones launching from the titan\'s chassis-bays in coordinated formation, exhaust-trails behind them',
      'SEISMIC GROUND-CRACKS — visible cracks spreading outward through the pavement from each titan footfall, dust escaping the cracks, ground destabilizing',
      'TRACER-ROUND ARCS — colored tracer-round streaks crossing the sky in arcing lines from anti-air positions tracking the titan, briefly illuminating the air',
    ],
    instructions: `Each entry is ONE specific combat phenomenon for a titan-war scene, 25-50 words. Format: "PHENOMENON NAME CAPS — primary visual action + secondary detail + scale or atmospheric note". STRICT war-cinema aesthetic — NO peaceful, NO Giger, NO fantasy. Amplifies the titan's biblical scale. Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
  },
};

const recipe = POOL_RECIPES[POOL];
if (!recipe) {
  console.error(`No recipe for pool "${POOL}". Add it to POOL_RECIPES.`);
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
  const outPath = path.resolve(`scripts/bots/mechbot/seeds/${POOL}.json`);
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
