/**
 * StarBot cosmic-oracle path — sci-fi character WITHIN a cosmic environment.
 *
 * Canonical character-in-scene architecture (playbook 8-axis scene-path with
 * anchor entity at SMALL-MEDIUM scale — figure lives WITHIN the cosmic scene,
 * not as a centered portrait):
 *   Universal axes (7): story_beats / anchor_scale / composition_frame /
 *     scale_provers / weather_particulate / emotional_dna / lighting
 *   Bot-level axes (2): alien_sky_layer / surprise_element
 *   Path-level Tier 3 (3): cosmic_oracle_characters (anchor entity) /
 *     cosmic_oracle_locations / cosmic_oracle_actions
 *   Conditional drama layer (40% gate): ritual_moment — mystic / oracle action
 *
 * Medium: star_oil_cosmos (painted cosmic oil-canvas — environment-dominant
 * composition with figure WITHIN scene).
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
  const weatherParticulate = picker.pickWithRecency(pools.WEATHER_PARTICULATE, 'weather_particulate');
  const emotionalDna = picker.pickWithRecency(pools.EMOTIONAL_DNA, 'emotional_dna');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  // ── Bot-level axes ──
  const skyLayer = picker.pickWithRecency(pools.ALIEN_SKY_LAYER, 'alien_sky_layer');
  const surpriseElement = picker.pickWithRecency(pools.SURPRISE_ELEMENT, 'surprise_element');

  // ── Path-level axes ──
  const character = picker.pickWithRecency(pools.COSMIC_ORACLE_CHARACTERS, 'cosmic_oracle_character');
  const location = picker.pickWithRecency(pools.COSMIC_ORACLE_LOCATIONS, 'cosmic_oracle_location');
  const action = picker.pickWithRecency(pools.COSMIC_ORACLE_ACTIONS, 'cosmic_oracle_action');

  // ── Conditional RITUAL drama layer (40% gate) ──
  const isRitual = Math.random() < 0.4;
  const ritualMoment = isRitual ? picker.pickWithRecency(pools.RITUAL_MOMENT, 'ritual_moment') : null;
  const ritualSection = isRitual ? `
━━━ RITUAL / MYSTIC MOMENT — render this visibly in the scene ━━━
${ritualMoment}

The mystic energy is part of the scene — the character is channeling / divining / manifesting / communing with the cosmos. Visible glow, sigil, energy thread, or supernatural presence.

` : '';

  return `You are a sci-fi concept-art painter writing a CHARACTER-WITHIN-COSMIC-SCENE for StarBot — one solo figure of a specific sci-fi lineage caught in a candid moment within a richly-detailed cosmic environment. The scene is painted, atmospheric, gallery-grade. The character is INSIDE the scene, not posed in front of it. Output wraps with style prefix + suffix (star_oil_cosmos painted oil-canvas medium).

━━━ NON-NEGOTIABLE — CHARACTER MUST BE VISIBLE ━━━
EXACTLY ONE character is visibly rendered in the frame at MEDIUM-LARGE anchor scale (20-40% of frame height) — off-center at rule-of-thirds position, NOT centered portrait, NOT a tiny dot. Face partially visible (3/4 profile or side-lit). Helmets have visor up or transparent. Without the character the render fails — the character is the focal point even though the scene wraps them.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE figure. No companions, no enemies, no crowds. This figure ALONE in their cosmic moment.

━━━ NON-NEGOTIABLE — MULTI-TIER PAINTED SCENE ━━━
Foreground: tactile detail (rock edge / mist / shimmer / glyph). Midground: THE CHARACTER, off-center, mid-action. Deep distance: the cosmic environment receding into atmospheric haze and impossibly-scaled astronomical anchors.

━━━ THE STORY MOMENT — what's happening in this frame ━━━
${storyBeat}
${ritualSection}
━━━ THE CHARACTER (anchor entity at SMALL-MEDIUM scale — render EXACTLY) ━━━
${character}

The character is LOCKED — render the species anatomy / gear / wardrobe / accessories described above. Their face is partially visible. They are off-center, mid-action.

━━━ THE ACTION (body-shaping, posed within the scene) ━━━
${action}

━━━ THE LOCATION (cosmic environment wrapping the character) ━━━
${location}

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

━━━ SCALE PROVERS — include ALL THREE visibly ━━━
- ${scaleProvers[0]}
- ${scaleProvers[1]}
- ${scaleProvers[2]}

━━━ EMOTIONAL DNA ━━━
${emotionalDna}

━━━ SURPRISE ELEMENT — secondary subject woven into the scene ━━━
${surpriseElement}

━━━ FORBIDDEN ━━━
- NO centered portrait — character is OFF-CENTER, scene dominates
- NO posed beauty shot — character is mid-action within scene
- NO companion / second figure / crowd
- NO modern Earth clothes / military uniforms / contemporary fashion
- NO gore / blood-spray
- NO franchise proper-noun characters
- NO biomech tentacled horrors

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 110-140 words ━━━
OPEN WITH THE CHARACTER. The first 25-30 words name the figure (species / gear / wardrobe / face partially visible) and the action they are mid-performing.

━━━ HARD FRAMING RULES (non-negotiable) ━━━
- The character is OFF-CENTER at rule-of-thirds position — body anchored to the left third OR right third of the frame, never centered.
- The character occupies 20-35% of the frame — NOT a centered portrait closeup, NOT a face-fills-the-frame headshot, NOT a beauty shot.
- The remaining 65-80% of the frame is the COSMIC ENVIRONMENT — name AT LEAST THREE specific scene-depth elements visible around them (a distant astronomical anchor, a midground architectural feature, a foreground tactile detail).
- The viewer can see the character's body language AND the scene wrapping them simultaneously.

After opening with the character: paint the cosmic environment wrapping them — atmosphere, lighting, sky, deep-distance anchors, midground forms, foreground texture. ONE haunting detail (something subtly wrong / a light with no source / starlight at the wrong angle). Painted finish, gallery-grade atmospheric depth.

The character is the subject. The cosmos is the stage. If the result is a centered portrait closeup, the prompt fails.

Output ONLY the raw 110-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
};
