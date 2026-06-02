/**
 * StarBot megastructure path — colossal artificial structures at planet-or-
 * greater scale (orbital rings, Dyson constructs, planetary mantles).
 *
 * Slot-composer using the proven scene-path recipe (alien-city pattern):
 * universal axes + ANCHOR_SCALE_RANGE=['TINY','SMALL'] (entity as scale prover)
 * + Tier 3 MEGASTRUCTURE_SETTING pool authored bespoke for this path.
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
  const storyBeat = picker.pickWithRecency(pools.STORY_BEATS, 'story_beat');
  const anchorScale = pickScaleFromRange(pools.ANCHOR_SCALE, ANCHOR_SCALE_RANGE, picker);
  const compositionFrame = picker.pickWithRecency(pools.COMPOSITION_FRAME, 'composition_frame');
  const scaleProvers = pickN(pools.SCALE_PROVERS, 3, picker);
  const weatherParticulate = picker.pickWithRecency(
    pools.WEATHER_PARTICULATE,
    'weather_particulate'
  );
  const emotionalDna = picker.pickWithRecency(pools.EMOTIONAL_DNA, 'emotional_dna');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const anchorEntity = picker.pickWithRecency(pools.STARBOT_ANCHOR_ENTITY, 'starbot_anchor_entity');
  const skyLayer = picker.pickWithRecency(pools.ALIEN_SKY_LAYER, 'alien_sky_layer');
  const surpriseElement = picker.pickWithRecency(pools.SURPRISE_ELEMENT, 'surprise_element');
  const megastructure = picker.pickWithRecency(
    pools.MEGASTRUCTURE_SETTING,
    'megastructure_setting'
  );

  return `You are a sci-fi concept-art painter writing a SINGLE CINEMATIC FRAME of a colossal megastructure for StarBot. The megastructure is the HERO; the anchor entity proves the impossible scale. Output wraps with style prefix + suffix.

━━━ NON-NEGOTIABLE — MEGASTRUCTURE AT IMPOSSIBLE-PLANETARY SCALE ━━━
The megastructure is ARTIFICIAL, ENGINEERED, IMPOSSIBLY LARGE — kilometers to planet-spanning. It fills 85%+ of the frame. NOT a city, NOT a settlement, NOT a building cluster — a SINGULAR colossal artificial construct (orbital ring / Dyson swarm / planetary mantle / megaship hulk / impossibly tall space elevator / alien portal kilometers across / colossal sphere station).

The scale must be UNMISTAKABLY POST-PLANETARY: visible curvature of the structure / horizon-spanning extent / structure dwarfing nearby planet / structure with its own atmosphere / structure passing through clouds. If your prompt would render as "city in a canyon" or "settlement at ground level" — REWRITE as a megastructure.

Anchor entity is a TINY element that proves the scale, not the subject.

━━━ NON-NEGOTIABLE — MULTI-TIER DEPTH ━━━
Foreground: tactile detail (railing edge / structural beam / nearby surface). Midground: a section of the megastructure body with hundreds of details visible. Deep distance: the megastructure curving / extending / receding into atmospheric haze at incomprehensible scale.

━━━ THE STORY MOMENT — what's happening in this frame ━━━
${storyBeat}

━━━ THE MEGASTRUCTURE ━━━
${megastructure}

━━━ SKY OVERHEAD ━━━
${skyLayer}

━━━ THE ANCHOR ENTITY — somewhere in the megastructure at TINY scale ━━━
${anchorEntity}

━━━ ANCHOR SCALE — entity is a SCALE PROVER, not the subject ━━━
${anchorScale}

The entity is a tiny silhouette — back-turned or in profile — at midground or deep midground. NEVER a foreground centered figure.

━━━ COMPOSITION FRAME ━━━
${compositionFrame}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weatherParticulate}

━━━ SCALE PROVERS — include ALL THREE visibly in the megastructure scene ━━━
- ${scaleProvers[0]}
- ${scaleProvers[1]}
- ${scaleProvers[2]}

━━━ EMOTIONAL DNA ━━━
${emotionalDna}

━━━ SURPRISE ELEMENT — woven into the megastructure for added story interest ━━━
${surpriseElement}

Place at midground or deep midground in the megastructure's vast volumes.

━━━ FORBIDDEN ━━━
- NO foreground centered figure — entity is a tiny silhouette midground or deeper
- NO single structure isolated in empty space without surrounding detail (smaller structures / ships / traffic / atmospheric layers always present)
- NO portrait composition — the megastructure fills the frame
- NO franchise proper nouns (Halo / Citadel / Death Star / etc.)

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE (write the prompt in this order — anchor entity LAST so it stays small) ━━━
[wide cinematic shot of the colossal megastructure — multi-tier composition emphasized as the OPENING], [the specific megastructure type and structural identity], [hundreds of supporting details / smaller modules / atmospheric haze layers], [the sky layer overhead], [scale provers visible — ships as dots, lit-window grain, atmospheric haze bands], [surprise element at midground], [lighting and the world reacting], [color palette and mood], [FINALLY: by the way, a tiny anchor-entity silhouette is at midground doing the story moment — described as a small element, NEVER foreground centered]

CRITICAL — anchor entity goes at the END of the prompt only. If you mention the entity in the first half of the prompt, REWRITE with the entity at the very end. The megastructure is the hero.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
};
