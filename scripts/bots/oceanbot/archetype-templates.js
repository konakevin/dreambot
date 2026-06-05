/**
 * OceanBot archetype templates — Sonnet brief builders.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * Live templates:
 *   • OCEANBOT_SHIPWRECK_KINGDOM (pre-1850 wooden wrecks)
 *   • OCEANBOT_LOST_CITIES (sister naval-lore — sunken civilizations)
 *
 * Other 8 path templates ship after these are validated in production.
 *
 * Style discipline (per 2026-06-01/02 fleet cruft sweep + 2026-06-04 axis cut):
 *   • Zero negation chains — every constraint phrased positively
 *   • Era / hero-class guardrail blocks injected per path family
 *   • NO photographer name-drops in briefs (per [[feedback_llm_brief_echo_leak]])
 *     — Sonnet echoes proper-noun names verbatim into Flux prompts.
 *     Cut from both shipwreck-kingdom and lost-cities templates 2026-06-04.
 *   • LEAN 5-axis output (hero + coral_growth + marine_life + caustic_light +
 *     camera_framing) — the 11-axis original produced over-stuffed briefs
 *     and busy/anachronistic renders. See archetypes.js header for the
 *     full diagnosis + the dropped axes (decay/crumble_state, water_clarity,
 *     foreground_element, scale_provers, surprise_element, drama).
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
    const { lighting, atmosphere, wreck_class, coral_growth, marine_life, caustic_light, camera_framing } = slots;

    const scenePalette = sharedDNA?.scenePalette || '';
    const colorPalette = sharedDNA?.colorPalette || '';

    return `You are an underwater-cinematography keyframe writer for OceanBot's SHIPWRECK-KINGDOM path. Quiet wreck-discovery register. The wreck IS the reef: a pre-1850 wooden vessel sunken to the seafloor, decades-to-centuries-old, draped in living coral, schools of fish swimming through the rigging, caustic sun-shafts piercing turquoise water. The hero is the wreck; the marine life is the living frame; the caustic light is the mood.

${blocks.PRE_1850_VESSEL_BLOCK}
${block('WRECK CLASS (hero — give it the most word budget)', wreck_class)}${block('CORAL GROWTH', coral_growth)}${block('MARINE LIFE', marine_life)}${block('CAUSTIC LIGHT', caustic_light)}${block('CAMERA FRAMING (LAW)', camera_framing)}${block('LIGHTING', lighting)}${block('ATMOSPHERE', atmosphere)}${block('SCENE PALETTE', scenePalette)}${block('COLOR PALETTE (vibe-rolled)', colorPalette)}${block('VIBE DIRECTIVE', vibeDirective)}

━━━ COMPOSITION MANDATE ━━━
The wreck fills 40-60% of the frame as the dramatic focal anchor. Multi-tier depth: foreground texture (kelp / scattered objects / coral) → wreck mid-frame → marine life threading through → atmospheric blue depth fading into distance. The camera framing above is the LAW. People appear only as tiny silhouettes in the deep distance, never as foreground or midground figures.

━━━ OUTPUT FORMAT ━━━
Return ONE compact comma-separated Flux prompt, 60-90 words. Weave every axis into a single coherent underwater moment. No axis headers in output. No meta language ("a scene of..."). Speak the scene directly, vivid and specific. NEVER invent objects, treasures, instruments, or artifacts beyond what the rolled axes describe — added details inject anachronism. NEVER name a real photographer, painter, director, or studio in the output — describe the look, do not credit it.`;
  },

  OCEANBOT_LOST_CITIES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, ruin_class, coral_growth, marine_life, caustic_light, camera_framing } = slots;

    const scenePalette = sharedDNA?.scenePalette || '';
    const colorPalette = sharedDNA?.colorPalette || '';

    return `You are an underwater-cinematography keyframe writer for OceanBot's LOST-CITIES path. Drowned-archaeology documentary register — the ocean has swallowed a civilization. The specific monument is given in the RUIN CLASS axis below; render THAT monument, draped in living coral, schools of fish weaving around it, caustic sun-shafts piercing turquoise water. Haunting beauty, not horror. The hero is the rolled ruin; the marine life is the living frame; the caustic light is the mood.

${blocks.SUBMERGED_CIVILIZATION_BLOCK}
${block('RUIN CLASS (hero — give it the most word budget)', ruin_class)}${block('CORAL GROWTH', coral_growth)}${block('MARINE LIFE', marine_life)}${block('CAUSTIC LIGHT', caustic_light)}${block('CAMERA FRAMING (LAW)', camera_framing)}${block('LIGHTING', lighting)}${block('ATMOSPHERE', atmosphere)}${block('SCENE PALETTE', scenePalette)}${block('COLOR PALETTE (vibe-rolled)', colorPalette)}${block('VIBE DIRECTIVE', vibeDirective)}

━━━ COMPOSITION MANDATE ━━━
The ruin fills 40-60% of the frame as the dramatic focal anchor. Multi-tier depth: foreground texture (kelp / fallen carving / coral) → ruin mid-frame → marine life threading through → atmospheric blue depth fading into distance. The camera framing above is the LAW. People appear only as tiny silhouettes in the deep distance, never as foreground or midground figures.

━━━ OUTPUT FORMAT ━━━
Return ONE compact comma-separated Flux prompt, 60-90 words. Weave every axis into a single coherent underwater moment. No axis headers in output. No meta language ("a scene of..."). Speak the scene directly, vivid and specific. NEVER invent objects, treasures, instruments, or artifacts beyond what the rolled axes describe — added details inject anachronism. NEVER name a real photographer, painter, director, or studio in the output — describe the look, do not credit it.`;
  },

  OCEANBOT_PIRATES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, pirate_scene, camera_framing } = slots;

    const scenePalette = sharedDNA?.scenePalette || '';
    const colorPalette = sharedDNA?.colorPalette || '';

    return `You are a maritime-cinema keyframe writer for OceanBot's PIRATES path. Pirates-of-the-Caribbean register — Golden Age of Piracy (1650-1730), Black Pearl / Tortuga / Port Royal / Nassau era. Pirate galleons under full sail, lantern-lit harbors, hidden tropical coves, boarding actions, gun-deck shadow. UNLIKE other OceanBot paths, pirates ARE visible subjects in this path. But the SETTING (ocean / harbor / island / deck / cove) still does as much visual work as the figures. The world is "blown out" cinematic — golden-hour seas, storm-lit decks, lantern-lit harbors, tropical sunsets carrying mood as much as the pirates themselves.

${blocks.PIRATE_ERA_BLOCK}
${block('PIRATE SCENE (hero — setting + characters + action all in one; give it the most word budget)', pirate_scene)}${block('CAMERA FRAMING (LAW)', camera_framing)}${block('LIGHTING', lighting)}${block('ATMOSPHERE', atmosphere)}${block('SCENE PALETTE', scenePalette)}${block('COLOR PALETTE (vibe-rolled)', colorPalette)}${block('VIBE DIRECTIVE', vibeDirective)}

━━━ COMPOSITION MANDATE ━━━
The pirate scene fills 50-75% of the frame as the dramatic focal anchor — show CONFLICT, ATMOSPHERE, BEAUTY, not "a pirate ship sails." Multi-tier depth: foreground action / figures / ship rigging → mid-frame setting (ship / harbor / cove) → background sea / sky / horizon. The camera framing above is the LAW. Specific dramatic moments, period-accurate to 1650-1730. Wallpaper-worthy / movie-poster cinematic.

━━━ OUTPUT FORMAT ━━━
Return ONE compact comma-separated Flux prompt, 60-90 words. Weave every axis into a single coherent maritime cinema moment. No axis headers in output. No meta language ("a scene of..."). Speak the scene directly, vivid and specific. NEVER invent gear, treasure, or characters beyond what the rolled axes describe. NEVER name a real photographer, painter, director, or studio in the output — describe the look, do not credit it.`;
  },
};
