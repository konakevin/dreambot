/**
 * StarBot alien-city path — slot-pool composition v2 (2026-05-11).
 *
 * Architecture path: anchor scale TINY/SMALL, world is hero.
 * Mirrors alien-landscape composer but uses ALIEN_CITIES as Tier 3 setting
 * pool. The brief follows the lessons learned in the female-explorer
 * iteration (scene-first, compact, no-portrait, world-reacts).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const ANCHOR_SCALE_RANGE = ['TINY', 'SMALL'];

function pickN(arr, n, picker) {
  const out = [];
  const seen = new Set();
  let attempts = 0;
  while (out.length < n && attempts < n * 4) {
    const pick = picker.pickWithRecency(arr, `scale_prover_${out.length}`);
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
  // ── Tier 1 universal axes ──
  const storyBeat = picker.pickWithRecency(pools.STORY_BEATS, 'story_beat');
  const anchorScale = pickScaleFromRange(pools.ANCHOR_SCALE, ANCHOR_SCALE_RANGE, picker);
  const compositionFrame = picker.pickWithRecency(pools.COMPOSITION_FRAME, 'composition_frame');
  const scaleProvers = pickN(pools.SCALE_PROVERS, 2, picker);
  const weatherParticulate = picker.pickWithRecency(
    pools.WEATHER_PARTICULATE,
    'weather_particulate'
  );
  const emotionalDna = picker.pickWithRecency(pools.EMOTIONAL_DNA, 'emotional_dna');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  // ── Tier 2 StarBot-level axes ──
  const anchorEntity = picker.pickWithRecency(pools.STARBOT_ANCHOR_ENTITY, 'starbot_anchor_entity');
  const skyLayer = picker.pickWithRecency(pools.ALIEN_SKY_LAYER, 'alien_sky_layer');

  // ── Tier 3 path-level primary pool ──
  const cityType = picker.pickWithRecency(pools.ALIEN_CITIES, 'alien_city');
  // Surprise element — a secondary subject woven into the city for interest
  const surpriseElement = picker.pickWithRecency(pools.SURPRISE_ELEMENT, 'surprise_element');

  return `You are a sci-fi cinematographer writing a SINGLE CINEMATIC FRAME of a vast alien city for StarBot. The city is the HERO; the anchor entity proves the scale. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — VAST CITY DOMINATES THE FRAME ━━━
The city fills 80%+ of the frame. Multi-tier vertical density — buildings stacked on bridges stacked on towers, at least 4 visible elevation levels. Hundreds of lit windows / signs / details. The anchor entity is a small element that proves the scale, not the subject.

━━━ NON-NEGOTIABLE — NEVER A SINGLE HERO BUILDING ━━━
The city is a CIVILIZATION — dozens of supporting structures, multiple towers, bridges between, smaller buildings clustered at the base of taller ones. Never an isolated single tower in haze.

━━━ THE STORY MOMENT — what's happening in this frame ━━━
${storyBeat}

━━━ THE CITY ━━━
${cityType}

Render with multi-tier vertical density. Foreground: tactile detail near the camera (terrace edge / antenna array / cable / rooftop garden). Midground: city body with hundreds of windows, multiple towers, bridges connecting at various heights, traffic between. Deep distance: the city's signature anchor (largest tower / spire / megastructure) looming through atmospheric haze. Sky: ${skyLayer}.

━━━ THE ANCHOR ENTITY — in the city at the prescribed scale ━━━
${anchorEntity}

━━━ ANCHOR SCALE — how big the entity is ━━━
${anchorScale}

The entity is a SILHOUETTE — back-turned or in profile — at midground or deep midground. NEVER a foreground centered figure.

━━━ COMPOSITION FRAME ━━━
${compositionFrame}

━━━ INSIDE THE CITY, ALIVE WITH ACTIVITY — NON-NEGOTIABLE ━━━
The frame is INSIDE the city — wide-angle views looking DOWN a busy avenue, looking UP between towers, on a balcony or skybridge overlooking the throng, in a busy market plaza, in a transport hub. NOT distant skyline shots where the city is small in the frame surrounded by terrain — the city FILLS the frame.

The city is ALIVE WITH COMMOTION:
- Multiple ships of varying sizes flying between buildings at different elevations — small commuter craft, mid-size freighters, large transports
- Traffic visible on multi-tier skyways / skybridges / elevated rails
- Holographic signage and billboards flickering, advertising in unknown alien glyphs
- Smaller drones, hover-vehicles, and commerce in motion at street level
- Hundreds of pinprick lit windows speckling every tower face
- Light pollution from a thousand sources cutting through atmospheric haze
- Steam vents, signal beacons, spotlight beams visible
- Tiny figures populating bridges and balconies (proving the city is INHABITED)

This is a BUSY metropolis at work, not a quiet diorama. The atmosphere should feel like being immersed in a great alien capital.

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weatherParticulate}

━━━ SCALE PROVERS — include BOTH visibly in the city ━━━
- ${scaleProvers[0]}
- ${scaleProvers[1]}

━━━ EMOTIONAL DNA ━━━
${emotionalDna}

━━━ SURPRISE ELEMENT — woven into the city for added story interest ━━━
${surpriseElement}

Place this at midground or deep midground in the busy city scene — alongside the ships and crowds and traffic already happening.

━━━ THE WORLD REACTS ━━━
The city is ALIVE. Tiny ships threading between towers, light glowing from windows at multiple elevations, holographic signage flickering, atmospheric haze separating depth bands. Never a static lifeless diorama.

━━━ FORBIDDEN ━━━
- NO isolated single tower in fog (the city is a CIVILIZATION, multiple structures always)
- NO foreground centered character — entity is a silhouette in midground
- NO generic "cyberpunk megacity" without specific architectural language — match what the city description says
- NO portrait composition — the city fills the frame

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE (write the prompt in this order — anchor entity LAST so it stays small) ━━━
[wide cinematic shot of the vast alien city — multi-tier density emphasized as the OPENING], [the specific city type and architecture style — dozens of supporting structures named], [hundreds of lit details, bridges between elevations, smaller buildings at the bases], [the sky layer and atmospheric depth], [lighting and the world reacting — ships, lights, particles, holographic signage], [scale provers visible — tiny ships threading gaps / lit-window-grain / etc.], [color palette and mood], [FINALLY: by the way, a tiny anchor-entity silhouette is at midground doing the story moment — described as a small element, never foreground centered]

CRITICAL — anchor entity goes at the END of the prompt only. If you mention it in the first half of the prompt, REWRITE the prompt with the entity at the very end. This is to keep Flux from rendering the entity foreground-large.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
};
