/**
 * OceanBot archetype templates — Sonnet brief composer functions.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │ PHASE 1 STATUS (2026-06-01)                                            │
 * │                                                                        │
 * │ These are PHASE-1 PLACEHOLDER TEMPLATES — render-functional but not    │
 * │ yet TLC-tuned. Each consumes every slot the archetype declares so the  │
 * │ bot module loads cleanly and a smoke-render is possible.               │
 * │                                                                        │
 * │ PHASE 2 OWNERSHIP: each path gets a parallel agent that REPLACES its   │
 * │ template here with a fully-tuned Sonnet brief (hard rules, scene-      │
 * │ coherence guardrails, full lore-aware prose). Don't sand the corners   │
 * │ off these stubs — REPLACE them outright in Phase 2.                    │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * Every section uses the `block(label, val)` helper so model-aware entity-
 * cap trimming (scripts/lib/modelDetailTiers.js) can NULL dropped slots
 * and those sections simply disappear from the brief. Hero / protected
 * entities never get nulled; optional entities sample down based on which
 * model is rendering (Flux 2 / Banana / GPT-2 → fewer entities, Flux 1.1
 * → all entities). Atmosphere + composition slots are never capped.
 */

const blocks = require('./shared-blocks');

/**
 * Emit a labeled section ONLY when the slot value is non-empty. Used so
 * model-aware entity-cap trimming (scripts/lib/modelDetailTiers.js) can
 * NULL dropped slots and the section just disappears from the brief.
 */
const block = (label, val) => (val ? `\n━━━ ${label} ━━━\n${val}\n` : '');

// ─── Shared composable bits for the Phase-1 stubs ────────────────────────

const sceneHeroFooter = ({ vibeDirective, scenePalette, colorPalette }) => `
${blocks.SCENE_AS_HERO_BLOCK}

${blocks.CAMERA_FRAMING_MANDATORY_BLOCK}

${blocks.NO_TEXT_BLOCK}
${block('SCENE PALETTE', scenePalette)}
${block('COLOR PALETTE (vibe-rolled)', colorPalette)}
${block('VIBE DIRECTIVE', vibeDirective)}

━━━ OUTPUT FORMAT ━━━
Return ONE compact comma-separated Flux prompt, 60-90 words, all axes woven into a single coherent ocean moment. NO axis headers in output, NO meta language ("a scene with..." / "this image shows..."), NO negation phrasing ("no X / not Y"). Just the scene, vivid and specific.`;

const anchorHeroFooter = ({ vibeDirective, scenePalette, colorPalette }) => `
${blocks.ANCHOR_AS_HERO_BLOCK}

${blocks.CAMERA_FRAMING_MANDATORY_BLOCK}

${blocks.NO_TEXT_BLOCK}
${block('SCENE PALETTE', scenePalette)}
${block('COLOR PALETTE (vibe-rolled)', colorPalette)}
${block('VIBE DIRECTIVE', vibeDirective)}

━━━ OUTPUT FORMAT ━━━
Return ONE compact comma-separated Flux prompt, 60-90 words, anchor + ocean + atmosphere woven into a single dramatic moment. NO axis headers in output, NO meta language, NO negation phrasing.`;

const universalLines = ({ lighting, atmosphere }) =>
  `${block('LIGHTING', lighting)}${block('ATMOSPHERE', atmosphere)}`;

const dramaLine = (drama) => block('DRAMA LAYER (conditional — woven in subtly)', drama);

module.exports = {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // NATURE / BIOME-LED archetypes (ocean is hero)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  OCEANBOT_DEEP_WONDER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      depth_zone,
      abyssal_anchor,
      deep_marine_life,
      bioluminescent_source,
      water_column_quality,
      caustic_or_glow,
      foreground_element,
      scale_provers,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are an abyssal-zone cinematographer writing a DEEP-WONDER keyframe for OceanBot. BBC Blue Planet / James Cameron deep-dive / mesopelagic-bathypelagic register. The ocean is hero — vast pressure, sub-illumination only, alien marine life, bioluminescent points of light against velvet black.
${block('DEPTH ZONE', depth_zone)}${block('ABYSSAL ANCHOR', abyssal_anchor)}${block('DEEP MARINE LIFE', deep_marine_life)}${block('BIOLUMINESCENT SOURCE', bioluminescent_source)}${block('WATER COLUMN QUALITY', water_column_quality)}${block('CAUSTIC OR GLOW', caustic_or_glow)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SCALE PROVERS', scale_provers)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${sceneHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_UNDERSEA_SEASCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      biome_anchor,
      marine_life,
      submerged_structure,
      foreground_element,
      caustic_light,
      water_clarity,
      weather_in_water,
      depth_setting,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are an underwater-cinematography keyframe writer for OceanBot's UNDERSEA-SEASCAPE path. BBC Blue Planet / NatGeo coral-reef / kelp-forest cathedral register. Biome dominates the frame — coral arches, kelp pillars, sand channels, sun-shaft caustics piercing turquoise water.
${block('BIOME ANCHOR', biome_anchor)}${block('MARINE LIFE', marine_life)}${block('SUBMERGED STRUCTURE', submerged_structure)}${block('FOREGROUND ELEMENT', foreground_element)}${block('CAUSTIC LIGHT', caustic_light)}${block('WATER CLARITY', water_clarity)}${block('WEATHER IN WATER', weather_in_water)}${block('DEPTH SETTING', depth_setting)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${sceneHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_SHIPWRECK_KINGDOM: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      wreck_class,
      reclamation_state,
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
    return `You are an underwater-archaeology cinematographer writing a SHIPWRECK-KINGDOM keyframe for OceanBot. NatGeo wreck-discovery register — derelict vessels reclaimed by marine ecosystems, coral growing on hulls, schools of fish swirling through rigging, kelp draping cannon-ports.
${block('WRECK CLASS', wreck_class)}${block('RECLAMATION STATE', reclamation_state)}${block('CORAL GROWTH', coral_growth)}${block('MARINE LIFE', marine_life)}${block('CAUSTIC LIGHT', caustic_light)}${block('WATER CLARITY', water_clarity)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SCALE PROVERS', scale_provers)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${sceneHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_POLAR_SEAS: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      ice_anchor,
      polar_biome,
      polar_marine_life,
      sky_phenomenon,
      water_state,
      light_signature,
      foreground_element,
      scale_provers,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are a polar-expedition cinematographer writing a POLAR-SEAS keyframe for OceanBot. BBC Frozen Planet / Shackleton-expedition register — icebergs, sea ice, cold mist over slate water, aurora overhead, narwhal / orca / beluga / polar-bear / seal scale-provers. Cold light dominates — silvers, glacial blues, low-sun ambers.
${block('ICE ANCHOR', ice_anchor)}${block('POLAR BIOME', polar_biome)}${block('POLAR MARINE LIFE', polar_marine_life)}${block('SKY PHENOMENON', sky_phenomenon)}${block('WATER STATE', water_state)}${block('LIGHT SIGNATURE', light_signature)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SCALE PROVERS', scale_provers)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${sceneHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_CALM_GLASS_SEA: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      time_of_day,
      reflection_anchor,
      sky_signature,
      water_clarity,
      atmospheric_haze,
      foreground_element,
      distant_silhouette,
      light_signature,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are a meditative-seascape cinematographer writing a CALM-GLASS-SEA keyframe for OceanBot. Hiroshi Sugimoto seascapes / Caspar David Friedrich romantic-stillness register. Mirror-flat water, perfect reflection of the sky, dawn or dusk hush, atmospheric haze softening every edge.
${block('TIME OF DAY', time_of_day)}${block('REFLECTION ANCHOR (what the glass-sea mirrors)', reflection_anchor)}${block('SKY SIGNATURE', sky_signature)}${block('WATER CLARITY', water_clarity)}${block('ATMOSPHERIC HAZE', atmospheric_haze)}${block('FOREGROUND ELEMENT', foreground_element)}${block('DISTANT SILHOUETTE', distant_silhouette)}${block('LIGHT SIGNATURE', light_signature)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${sceneHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_WHALE_ENCOUNTER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      whale_species,
      whale_action,
      depth_setting,
      light_signature,
      water_clarity,
      marine_supporting_life,
      foreground_element,
      scale_provers,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are a cetacean-cinematography keyframe writer for OceanBot's WHALE-ENCOUNTER path. BBC Blue Planet / Brian Skerry / Paul Nicklen register — humpback / blue / orca / sperm / fin whale mid-moment. Mother-calf intimacy, breach above the surface, sound-bubbles in the deep, song-singing midwater. Whale fills the frame; ocean is the cathedral.
${block('WHALE SPECIES', whale_species)}${block('WHALE ACTION', whale_action)}${block('DEPTH SETTING', depth_setting)}${block('LIGHT SIGNATURE', light_signature)}${block('WATER CLARITY', water_clarity)}${block('MARINE SUPPORTING LIFE', marine_supporting_life)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SCALE PROVERS', scale_provers)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${anchorHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_BIOLUMINESCENT_NIGHT: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      bioluminescent_anchor,
      light_pattern,
      depth_setting,
      supporting_marine_life,
      water_state,
      foreground_element,
      atmospheric_haze,
      color_signature,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are a bioluminescence cinematographer writing a BIOLUMINESCENT-NIGHT keyframe for OceanBot. NatGeo dinoflagellate-bloom / fluorescent-reef / glowing-jelly register. Cool-blue plankton, neon-green dinoflagellates, electric-cyan ctenophores against deep black water. Light comes from LIFE, not the sun.
${block('BIOLUMINESCENT ANCHOR', bioluminescent_anchor)}${block('LIGHT PATTERN (how the glow distributes)', light_pattern)}${block('DEPTH SETTING', depth_setting)}${block('SUPPORTING MARINE LIFE', supporting_marine_life)}${block('WATER STATE', water_state)}${block('FOREGROUND ELEMENT', foreground_element)}${block('ATMOSPHERIC HAZE', atmospheric_haze)}${block('COLOR SIGNATURE', color_signature)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${sceneHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_STORM_SURFACE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      storm_type,
      sea_state,
      sky_signature,
      light_phenomenon,
      vessel_optional,
      foreground_element,
      scale_provers,
      weather_air,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are a storm-sea cinematographer writing a STORM-SURFACE keyframe for OceanBot. Aivazovsky shipwreck-storm / The Perfect Storm / Master and Commander register. Mountain-sized swells, lightning crawling across black cloud, salt-spray turning the air to mist, optional vessel as scale anchor.
${block('STORM TYPE', storm_type)}${block('SEA STATE', sea_state)}${block('SKY SIGNATURE', sky_signature)}${block('LIGHT PHENOMENON', light_phenomenon)}${block('VESSEL (optional anchor)', vessel_optional)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SCALE PROVERS', scale_provers)}${block('WEATHER AIR', weather_air)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${sceneHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ANCHOR-LED archetypes (vessel / figure / creature is hero)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  OCEANBOT_GHOST_SHIP: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      ship_class,
      decay_state,
      fog_layer,
      sea_state,
      light_signature,
      ghostly_phenomenon,
      foreground_element,
      scale_provers,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are a maritime-myth painter writing a GHOST-SHIP keyframe for OceanBot. Aivazovsky / Turner / Caspar David Friedrich romantic-shipwreck register. Derelict age-of-sail vessel emerging from fog, decay on every plank, tattered sails, lantern-glow through mist. Ship is hero; ocean is the haunted theater.
${block('SHIP CLASS', ship_class)}${block('DECAY STATE', decay_state)}${block('FOG LAYER', fog_layer)}${block('SEA STATE', sea_state)}${block('LIGHT SIGNATURE', light_signature)}${block('GHOSTLY PHENOMENON', ghostly_phenomenon)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SCALE PROVERS', scale_provers)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${anchorHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_KRAKEN_LEVIATHAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      leviathan_type,
      action_moment,
      ocean_setting,
      scale_provers,
      threat_signal,
      atmospheric_drama,
      water_state,
      light_signature,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are a maritime-myth painter writing a KRAKEN-LEVIATHAN keyframe for OceanBot. Frank Frazetta / Brom / Pre-Raphaelite sea-monster register. Kraken / megalodon / leviathan / sea-serpent / sea-dragon mid-encounter. Mythic scale — the creature is colossal, the human-scale anchors (ship / boat / diver) prove it. Painted oil register.
${block('LEVIATHAN TYPE', leviathan_type)}${block('ACTION MOMENT', action_moment)}${block('OCEAN SETTING', ocean_setting)}${block("SCALE PROVERS (proves the creature's size)", scale_provers)}${block('THREAT SIGNAL', threat_signal)}${block('ATMOSPHERIC DRAMA', atmospheric_drama)}${block('WATER STATE', water_state)}${block('LIGHT SIGNATURE', light_signature)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${anchorHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_LOST_CITIES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      architectural_anchor,
      civilization_motif,
      reclamation_state,
      marine_life,
      caustic_light,
      water_clarity,
      foreground_element,
      scale_provers,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are an underwater-archaeology cinematographer writing a LOST-CITIES keyframe for OceanBot. Atlantis / sunken civilization register — submerged columned ruins, statue-fragments, mosaic floors, reclaimed by coral / kelp / fish-schools. Architecture is hero; the ocean is the cathedral around it.
${block('ARCHITECTURAL ANCHOR', architectural_anchor)}${block('CIVILIZATION MOTIF (Greek / Atlantean / Roman / Khmer / Maya / etc.)', civilization_motif)}${block('RECLAMATION STATE', reclamation_state)}${block('MARINE LIFE', marine_life)}${block('CAUSTIC LIGHT', caustic_light)}${block('WATER CLARITY', water_clarity)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SCALE PROVERS', scale_provers)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${anchorHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_PIRATES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      vessel_class,
      action_moment,
      weather_state,
      sea_state,
      era_detail,
      scale_provers,
      light_signature,
      foreground_element,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are an age-of-sail cinematographer writing a PIRATES keyframe for OceanBot. Master and Commander / Black Sails / Pirates of the Caribbean register. Galleons, broadsides, treasure hauls, crew on deck. Period-accurate rigging, cannon-fire, sail-canvas, brass-and-rope detail. Vessel is hero; ocean is the cinematic stage.
${block('VESSEL CLASS', vessel_class)}${block('ACTION MOMENT', action_moment)}${block('WEATHER STATE', weather_state)}${block('SEA STATE', sea_state)}${block('ERA DETAIL (period-accurate touchpoints)', era_detail)}${block('SCALE PROVERS', scale_provers)}${block('LIGHT SIGNATURE', light_signature)}${block('FOREGROUND ELEMENT', foreground_element)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${anchorHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },

  OCEANBOT_MERMAID_MYTH: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      mermaid_archetype,
      tail_detail,
      ocean_setting,
      painterly_tradition,
      lighting_pattern,
      foreground_element,
      sea_phenomenon,
      scale_provers,
      camera_framing,
      surprise_element,
      drama,
    } = slots;
    return `You are a Pre-Raphaelite oil-painter writing a MERMAID-MYTH keyframe for OceanBot. Waterhouse / Rossetti / Burne-Jones / Caspar David Friedrich tradition. Single-tail traditional mermaid mid-myth — sitting on a sea-stone, gazing across water, combing hair, singing through fog, draped over a wreck. Painted oil register, museum-grade.

${blocks.MERMAID_ANATOMY_LOCK}
${block('MERMAID ARCHETYPE', mermaid_archetype)}${block('TAIL DETAIL (single fused tail with one fluke)', tail_detail)}${block('OCEAN SETTING', ocean_setting)}${block('PAINTERLY TRADITION (Waterhouse / Rossetti / etc.)', painterly_tradition)}${block('LIGHTING PATTERN', lighting_pattern)}${block('FOREGROUND ELEMENT', foreground_element)}${block('SEA PHENOMENON', sea_phenomenon)}${block('SCALE PROVERS', scale_provers)}${block('CAMERA FRAMING', camera_framing)}${block('SURPRISE ELEMENT', surprise_element)}${universalLines({ lighting, atmosphere })}${dramaLine(drama)}
${anchorHeroFooter({ vibeDirective, ...sharedDNA })}`;
  },
};
