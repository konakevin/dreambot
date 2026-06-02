/**
 * StarBot space-opera path — sci-fi spaceship as anchor entity.
 *
 * Slot-composer using the proven character-path recipe (female-explorer pattern):
 * universal axes + ANCHOR_SCALE_RANGE=['MEDIUM','LARGE'] (ship as hero) +
 * path-level Tier 3 pools (SPACE_OPERA_SHIPS as anchor entity, SPACE_OPERA_SETTING,
 * SHIP_ACTION). Conditional WIDE-ACTION layer (50% gate) adds BUSY_FLEET_ELEMENTS
 * + BATTLE_DYNAMICS for multi-ship action scenes.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const ANCHOR_SCALE_RANGE = ['MEDIUM', 'LARGE'];

function pickN(arr, n, picker, axisName = 'pick') {
  const out = [];
  const seen = new Set();
  let attempts = 0;
  while (out.length < n && attempts < n * 4) {
    const pick = picker.pickWithRecency(arr, `${axisName}_${out.length}`);
    if (!seen.has(pick)) {
      seen.add(pick);
      out.push(pick);
    }
    attempts++;
  }
  return out;
}

function pickScaleFromRange(allEntries, range, picker) {
  const filtered = allEntries.filter((entry) => range.some((label) => entry.startsWith(label)));
  if (filtered.length === 0) return allEntries[0];
  return picker.pickWithRecency(filtered, 'anchor_scale');
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // ── Universal axes ──
  const storyBeat = picker.pickWithRecency(pools.STORY_BEATS, 'story_beat');
  const anchorScale = pickScaleFromRange(pools.ANCHOR_SCALE, ANCHOR_SCALE_RANGE, picker);
  const compositionFrame = picker.pickWithRecency(pools.COMPOSITION_FRAME, 'composition_frame');
  const scaleProvers = pickN(pools.SCALE_PROVERS, 3, picker, 'scale_prover');
  const weatherParticulate = picker.pickWithRecency(
    pools.WEATHER_PARTICULATE,
    'weather_particulate'
  );
  const emotionalDna = picker.pickWithRecency(pools.EMOTIONAL_DNA, 'emotional_dna');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  // ── Bot-level axes ──
  const skyLayer = picker.pickWithRecency(pools.ALIEN_SKY_LAYER, 'alien_sky_layer');
  const surpriseElement = picker.pickWithRecency(pools.SURPRISE_ELEMENT, 'surprise_element');

  // ── Path-level Tier 3 axes ──
  const ship = picker.pickWithRecency(pools.SPACE_OPERA_SHIPS, 'space_opera_ship');
  const setting = picker.pickWithRecency(pools.SPACE_OPERA_SETTING, 'space_opera_setting');
  const shipAction = picker.pickWithRecency(pools.SHIP_ACTION, 'ship_action');

  // ── Conditional WIDE-ACTION drama layer (50% gate) ──
  const wideAction = Math.random() < 0.5;
  const trafficElements = wideAction
    ? pickN(pools.BUSY_FLEET_ELEMENTS, 3, picker, 'traffic_element')
    : [];
  const battleDynamics = wideAction
    ? pickN(pools.BATTLE_DYNAMICS, 3, picker, 'battle_dynamic')
    : [];
  const wideActionSection = wideAction
    ? `
━━━ WIDE-ACTION MODE — MULTI-SHIP SCENE ━━━
The frame is a CHAOTIC ACTION SCENE with multiple ships at varied depths, motion, weapons firing, missile contrails streaking, plasma engines blazing. Not a quiet hero portrait — a busy fleet engagement / traffic chaos / battle.

━━━ OTHER SHIPS IN THE SCENE (3 must be visibly rendered) ━━━
- ${trafficElements[0]}
- ${trafficElements[1]}
- ${trafficElements[2]}

━━━ COMBAT / ACTION MOMENTS (3 must be visibly rendered) ━━━
- ${battleDynamics[0]}
- ${battleDynamics[1]}
- ${battleDynamics[2]}

`
    : `
━━━ CLOSE-UP HERO MODE — SHIP AS THE SHOW ━━━
The frame is a CINEMATIC HERO SHOT of the featured ship. Scale-proving figures or smaller craft visible nearby. Hull detail readable — paneling, gantries, antennas, weathering, lived-in complexity. Like a poster shot.

`;

  return `You are a sci-fi concept-art painter writing a SINGLE CINEMATIC FRAME of a spaceship scene for StarBot. The ship is the ANCHOR ENTITY at MEDIUM-LARGE scale, set in a sci-fi environment with multi-tier depth. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — SHIP AS HERO ━━━
The featured spaceship is the SUBJECT at MEDIUM-LARGE anchor scale (25-50% of frame). Hull detail clearly readable — paneling, weapon mounts, engine glow, weathering, sci-fi industrial complexity. NOT a tiny silhouette in a vast environment.

━━━ NON-NEGOTIABLE — MULTI-TIER DEPTH ━━━
Foreground: tactile detail near the ship (debris / smaller craft / hull surface). Midground: the FEATURED SHIP, dominant. Deep distance: setting + cosmic anchors receding into atmospheric haze.
${wideActionSection}
━━━ THE STORY MOMENT — what's happening in this frame ━━━
${storyBeat}

━━━ THE FEATURED SHIP (anchor entity at MEDIUM-LARGE scale) ━━━
${ship}

━━━ THE SHIP'S ACTION (posture / state / motion) ━━━
${shipAction}

━━━ THE SETTING (sci-fi environment wrapping the ship) ━━━
${setting}

━━━ SKY OVERHEAD / COSMIC LAYER ━━━
${skyLayer}

━━━ ANCHOR SCALE ━━━
${anchorScale}

━━━ COMPOSITION FRAME ━━━
${compositionFrame}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weatherParticulate}

━━━ SCALE PROVERS — include ALL THREE visibly in the scene ━━━
- ${scaleProvers[0]}
- ${scaleProvers[1]}
- ${scaleProvers[2]}

━━━ EMOTIONAL DNA ━━━
${emotionalDna}

━━━ SURPRISE ELEMENT — secondary subject woven into the scene ━━━
${surpriseElement}

━━━ FORBIDDEN ━━━
- NO biomech / tentacled / organic creature ships (no octopus / squid / spider / chitin / kraken)
- NO modern naval / US-navy / WWII / army-coded aesthetic
- NO planetary architecture rendered as the ship
- NO franchise proper nouns (Millennium Falcon / Normandy / Star Destroyer / etc. — inspired by, not literal)
- NO static empty frame — multi-tier depth + scale provers + setting always present

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — CRITICAL ━━━
Write ONE LONG DENSE FLOWING comma-separated composition. Do NOT separate elements into sections or bullet points — every axis above must be WOVEN INTO the single flowing scene description with SPECIFIC NUMBERS and COUNTS naming each element.

Reference for the density target — this is what a good scene description looks like:
"6.1-kilometer ceramic-white teardrop Banks-Culture vessel, 200+ micro-drones spiraling from 95-meter tender like glowing fireflies, 22 octagonal defense satellites in spherical formation, four angular 180-meter picket ships in diamond formation, twenty 6-meter navigation beacons strobing amber, cosmic graveyard of massive capital hulks with catastrophic breaches"

Every entry you pull from the axes above must be NAMED IN THE PROMPT with a count, color, scale, or position. The other ships / scale provers / surprise element MUST appear by name with concrete counts in the scene. NOT "a fleet visible" — "twelve 80m supply ships parallel-running" / "200+ EVA workers tethered" / "a kilometer-class capital silhouette receding into haze". Sonnet writes ONE flowing 130-150 word enumeration.

Output ONLY the raw 130-150 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
};
