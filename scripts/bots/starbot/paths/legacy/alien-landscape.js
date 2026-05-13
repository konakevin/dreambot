/**
 * StarBot alien-landscape path — slot-pool composition (v2 architecture).
 *
 * Every render is a STORY SCENE composed from a stack of axis rolls:
 *   Tier 1 (universal):  STORY_BEATS, ANCHOR_SCALE, COMPOSITION_FRAME,
 *                        SCALE_PROVERS, WEATHER_PARTICULATE, EMOTIONAL_DNA,
 *                        LIGHTING (existing universal pool)
 *   Tier 2 (bot-level):  STARBOT_ANCHOR_ENTITY, ALIEN_SKY_LAYER
 *   Tier 3 (path-level): ALIEN_PLANET_BIOME
 *
 * Combinatorial space ≈ 12 × 2 × 12 × C(12,2) × 8 × 8 × 50 × 12 × 12 × 30
 * ≈ 10^10 distinct scenes. Variety is effectively infinite.
 *
 * Path config: alien-landscape is a LANDSCAPE path → anchorScaleRange =
 * ['TINY', 'SMALL'] so the world is hero and the entity proves the scale.
 *
 * See BOT_SCENE_QUALITY_PLAYBOOK.md for the cross-bot architecture.
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

const ANCHOR_SCALE_RANGE = ['TINY', 'SMALL']; // landscape path: entity small, world hero

function pickN(arr, n, picker) {
  // Sample n distinct items from arr using the picker's recency-aware logic.
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
  // anchor_scale entries are listed as TINY / SMALL / MEDIUM / LARGE in order.
  // Filter to those whose label matches the range, then pick one.
  const filtered = allEntries.filter((entry) => range.some((label) => entry.startsWith(label)));
  if (filtered.length === 0) return allEntries[0];
  return picker.pickWithRecency(filtered, 'anchor_scale');
}

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // ── Tier 1: universal axes ──
  const storyBeat = picker.pickWithRecency(pools.STORY_BEATS, 'story_beat');
  const anchorScale = pickScaleFromRange(pools.ANCHOR_SCALE, ANCHOR_SCALE_RANGE, picker);
  const compositionFrame = picker.pickWithRecency(pools.COMPOSITION_FRAME, 'composition_frame');
  const scaleProvers = pickN(pools.SCALE_PROVERS, 2, picker);
  const weatherParticulate = picker.pickWithRecency(pools.WEATHER_PARTICULATE, 'weather_particulate');
  const emotionalDna = picker.pickWithRecency(pools.EMOTIONAL_DNA, 'emotional_dna');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  // ── Tier 2: StarBot-level axes ──
  const anchorEntity = picker.pickWithRecency(pools.STARBOT_ANCHOR_ENTITY, 'starbot_anchor_entity');
  const skyLayer = picker.pickWithRecency(pools.ALIEN_SKY_LAYER, 'alien_sky_layer');

  // ── Tier 3: path-level primary pool ──
  const biome = picker.pickWithRecency(pools.ALIEN_PLANET_BIOME, 'alien_planet_biome');

  return `You are a sci-fi concept artist composing a STORY SCENE for StarBot's alien-landscape path. You are NOT free to invent the scene — you are weaving together the rolled axes below into a 120-180 word scene description that integrates ALL of them coherently. Output wraps with style prefix + suffix.

${blocks.STORY_SCENE_TEMPLATE_BLOCK}

━━━ STORY BEAT — the narrative moment this still captures ━━━
${storyBeat}

━━━ ANCHOR ENTITY — what's in the frame ━━━
${anchorEntity}

━━━ ANCHOR SCALE — how big the entity is in frame ━━━
${anchorScale}

━━━ THE BIOME — the alien world the scene is set in ━━━
${biome}

━━━ SKY LAYER — what's overhead ━━━
${skyLayer}

━━━ COMPOSITION FRAME — the camera/framing rule ━━━
${compositionFrame}

━━━ LIGHTING ━━━
${lighting}

━━━ WEATHER / PARTICULATE ━━━
${weatherParticulate}

━━━ SCALE PROVERS — include BOTH of these in the scene as visible elements ━━━
- ${scaleProvers[0]}
- ${scaleProvers[1]}

━━━ EMOTIONAL DNA — the feeling the render carries ━━━
${emotionalDna}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ HOW TO COMPOSE ━━━
Weave EVERY rolled axis into a single coherent 120-180 word scene description. The BIOME defines what world we're on. The ANCHOR ENTITY at the ANCHOR SCALE proves the scale and gives the story a witness. The STORY BEAT is the moment captured. The COMPOSITION FRAME is the camera. The SKY LAYER is overhead. WEATHER and LIGHTING shape the atmosphere. SCALE PROVERS appear as named visible elements. EMOTIONAL DNA dictates light and tone.

Demand FOUR explicit depth layers in your output: FOREGROUND (specific tangible detail — a rock, plant, machinery, ruin), MIDGROUND (the biome's body, where the anchor entity sits, scale provers visible), DEEP DISTANCE (the biome's signature feature looming, atmospheric haze), SKY (the sky layer rolled).

The anchor entity is NOT center-foreground unless ANCHOR_SCALE = MEDIUM or LARGE. For TINY/SMALL: place the entity in MIDGROUND-BACK as a SILHOUETTE — back-turned or in profile — at the prescribed proportion. NEVER render a centered foreground large figure for TINY/SMALL paths.

━━━ HARD BANS ━━━
- Do NOT default to bioluminescent everything unless the BIOME specifies it
- Do NOT default to twin-moon sky unless the SKY LAYER specifies it
- Do NOT default to "atmospheric haze" softness unless WEATHER specifies haze
- Do NOT center a large foreground entity when ANCHOR_SCALE is TINY or SMALL
- Do NOT invent biome details outside what's described in the BIOME axis

Output ONLY the raw 120-180 word scene description. Comma-separated phrases or short sentences. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the scene content.`;
};
