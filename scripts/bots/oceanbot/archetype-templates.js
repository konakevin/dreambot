/**
 * OceanBot archetype templates — Sonnet brief builders.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * Pilot path only — shipwreck-kingdom. Other 9 path templates ship
 * after the pilot's render quality is approved.
 *
 * Style discipline (per 2026-06-01/02 fleet cruft sweep):
 *   • Zero negation chains — every constraint phrased positively
 *   • No biome/material/style enumeration (single-anchor per slot)
 *   • Pre-1850 vessel guardrail injected for naval-lore paths
 *   • Empty-section helper so future capping can null slots cleanly
 */

const blocks = require('./shared-blocks');

/**
 * Emit a labeled section ONLY when the slot value is non-empty.
 * Lets templates handle empty/dropped slots without leaving orphan
 * "━━━ FOREGROUND ━━━\nundefined" artifacts in the brief.
 */
const block = (label, val) => (val ? `\n━━━ ${label} ━━━\n${val}\n` : '');

module.exports = {
  OCEANBOT_SHIPWRECK_KINGDOM: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      wreck_class,
      decay_state,
      coral_growth,
      marine_life,
      caustic_light,
      water_clarity,
      foreground_element,
      scale_provers,
      camera_framing,
      surprise_element,
      drama,
    } = slots;

    const scenePalette = sharedDNA?.scenePalette || '';
    const colorPalette = sharedDNA?.colorPalette || '';

    return `You are an underwater-cinematography keyframe writer for OceanBot's SHIPWRECK-KINGDOM path. NatGeo wreck-discovery register — Brian Skerry / David Doubilet / Paul Nicklen. The wreck IS the reef: a pre-1850 wooden vessel sunken to the seafloor, decades-to-centuries-old, draped in living coral, schools of fish swimming through the rigging, caustic sun-shafts piercing turquoise water. The hero is the wreck; the marine life is the living frame; the caustic light is the mood.

${blocks.PRE_1850_VESSEL_BLOCK}
${block('WRECK CLASS', wreck_class)}${block('DECAY STATE', decay_state)}${block('CORAL GROWTH', coral_growth)}${block('MARINE LIFE', marine_life)}${block('CAUSTIC LIGHT', caustic_light)}${block('WATER CLARITY', water_clarity)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SCALE PROVERS', scale_provers)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${block('LIGHTING', lighting)}${block('ATMOSPHERE', atmosphere)}${block('DRAMA LAYER (woven in subtly)', drama)}${block('SCENE PALETTE', scenePalette)}${block('COLOR PALETTE (vibe-rolled)', colorPalette)}${block('VIBE DIRECTIVE', vibeDirective)}

━━━ COMPOSITION MANDATE ━━━
The wreck fills 40-60% of the frame as the dramatic focal anchor. Multi-tier depth: foreground texture (kelp / scattered objects / coral) → wreck mid-frame → marine life threading through → atmospheric blue depth fading into distance. The camera framing above is the LAW.

━━━ OUTPUT FORMAT ━━━
Return ONE compact comma-separated Flux prompt, 60-90 words. Weave every axis into a single coherent underwater moment. No axis headers in output. No meta language ("a scene of..."). Speak the scene directly, vivid and specific.`;
  },
};
