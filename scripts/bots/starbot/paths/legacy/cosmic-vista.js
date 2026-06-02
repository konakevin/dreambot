/**
 * StarBot cosmic-vista path — pure cosmic phenomenon, no characters or ships.
 *
 * Canonical pure-scenery architecture (playbook 6-axis scene-path with NO
 * anchor entity — the phenomenon IS the anchor):
 *   Universal axes (6): story_beats / composition_frame / scale_provers /
 *     weather_particulate / emotional_dna / lighting
 *   Bot-level axes (1): surprise_element (secondary phenomenon woven in)
 *   Path-level (1): cosmic_phenomena (primary subject)
 *   Conditional drama layer (40% gate): cosmic_event — supernova / GRB /
 *     collision / quasar flare
 *
 * Hard rule: NO ships, NO figures, NO architecture. Pure astronomical
 * imagery. Scale provers must be ASTRONOMICAL (moons / rings / asteroid
 * fields / dust lanes) — never human-made or biological.
 */

const pools = require('../pools');

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

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // ── Universal axes ──
  const storyBeat = picker.pickWithRecency(pools.STORY_BEATS, 'story_beat');
  const compositionFrame = picker.pickWithRecency(pools.COMPOSITION_FRAME, 'composition_frame');
  const scaleProvers = pickN(pools.SCALE_PROVERS, 3, picker, 'scale_prover');
  const weatherParticulate = picker.pickWithRecency(
    pools.WEATHER_PARTICULATE,
    'weather_particulate'
  );
  const emotionalDna = picker.pickWithRecency(pools.EMOTIONAL_DNA, 'emotional_dna');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  // ── Bot-level axes ──
  const surpriseElement = picker.pickWithRecency(pools.SURPRISE_ELEMENT, 'surprise_element');

  // ── Path-level axis (primary subject) ──
  const phenomenon = picker.pickWithRecency(pools.COSMIC_PHENOMENA, 'cosmic_phenomenon');

  // ── Conditional COSMIC_EVENT drama layer (40% gate) ──
  const isCosmicEvent = Math.random() < 0.4;
  const cosmicEvent = isCosmicEvent
    ? picker.pickWithRecency(pools.COSMIC_EVENT, 'cosmic_event')
    : null;
  const eventSection = isCosmicEvent
    ? `
━━━ COSMIC EVENT — render this drama visibly ACTIVE in the scene ━━━
${cosmicEvent}

The event is the MOMENT — caught mid-detonation, mid-collision, mid-eruption. Energy + matter + light surging through the frame.

`
    : '';

  return `You are a sci-fi concept-art painter writing a PURE COSMIC VISTA for StarBot — a jaw-dropping cosmic phenomenon that fills the ENTIRE frame. NO characters, NO ships, NO architecture, NO figures of any kind. Pure cosmos, vast and overwhelming. Hubble / Webb / Villeneuve Dune cosmic-horror aesthetic. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — PURE COSMOS ONLY ━━━
The cosmic phenomenon FILLS THE FRAME. The only permitted elements are astronomical:
- Stars / nebulae / dust lanes / planets / moons / rings / asteroid fields / accretion disks / gas filaments / cosmic radiation
- FORBIDDEN: ships, spacecraft, probes, satellites, drones, figures, characters, silhouettes, buildings, architecture, ANY human-made or biological elements
- If a scale prover names a "ship" or "figure" or "building," reinterpret it as the closest ASTRONOMICAL equivalent (moon, asteroid, distant star)

━━━ MULTI-DEPTH PAINTED COSMOS ━━━
Foreground: tactile cosmic detail (gas filaments / dust shimmer / ring debris). Midground: the primary phenomenon at full scale. Deep distance: receding starfield, atmospheric depth, secondary astronomical anchors.

━━━ THE PRIMARY PHENOMENON (fills the frame) ━━━
${phenomenon}
${eventSection}
━━━ NARRATIVE BEAT (cosmic-scale interpretation) ━━━
${storyBeat}

Interpret this beat at COSMIC scale — no human figure. The drama is between cosmic forces, between epochs, between scales of physics.

━━━ COMPOSITION FRAME ━━━
${compositionFrame}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weatherParticulate}

━━━ SCALE PROVERS — include ALL THREE visibly (ASTRONOMICAL only) ━━━
- ${scaleProvers[0]}
- ${scaleProvers[1]}
- ${scaleProvers[2]}

REINTERPRET any human / mechanical scale provers above as their astronomical equivalent. "Ships as dots" → "asteroids as dots". "Figures-as-pinpricks" → "stars-as-pinpricks". "Lit windows" → "stellar nurseries". Pure cosmos only.

━━━ EMOTIONAL DNA ━━━
${emotionalDna}

━━━ SURPRISE ELEMENT — secondary phenomenon woven into the scene ━━━
${surpriseElement}

If the surprise element above names a human / mechanical / biological detail, reinterpret it as an astronomical equivalent.

━━━ FORBIDDEN ━━━
- NO ships / spacecraft / probes / satellites / drones / vehicles
- NO figures / silhouettes / characters / creatures
- NO buildings / architecture / megastructures / orbital habitats
- NO planetary surfaces with ground-level details
- NO atmospheric haze in vacuum (haze only inside nebulae or near planetary atmospheres)
- NO franchise proper nouns

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 100-130 words ━━━
Open with the PRIMARY PHENOMENON dominating the frame. Then layer the cosmic environment — secondary astronomical anchors, lighting quality, particulate matter, dust lanes, scale-prover astronomical bodies. ONE haunting detail (impossible geometry / light bending the wrong way / time visibly dilating / a star where one shouldn't be). Painted finish, gallery-grade atmospheric depth, Hubble-photograph realism + Villeneuve cinematography.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
};
