/**
 * GothBot gargoyles path — EXCLUSIVELY gargoyles (renamed from monster-prowl-weta
 * 2026-06-22 so the name is unambiguous; was the "disappeared" gargoyle work).
 *
 * A SOLO EPIC GARGOYLE hero-shot — the most gnarly, mean, yet ornately-carved
 * animated stone gargoyle (granite / sandstone / basalt / verdigris-bronze /
 * obsidian) come to terrible life, full-body head-to-talon, spread bat-wings,
 * perched/launching/banking on cathedral architecture. Recreates the aggregate
 * of Kevin's hearted gargoyle posts. Medium: weta_render (Weta-Workshop + UE5
 * hyperreal, full-spectrum saturated color) — the look that dominated the hearts.
 *
 * Bespoke gargoyle pools:
 *   - creature: GARGOYLE_CREATURE (gnarly + ornate stone gargoyle, hero)
 *   - action: GARGOYLE_ACTION (gargoyle in motion — launch / bank / perch / lunge)
 *   - eye_glow: GARGOYLE_EYES (glowing eyes)
 *   - feature: GARGOYLE_FEATURES (signature gnarly+ornate detail)
 *   - scene_color: GARGOYLE_SCENE_COLOR (vivid dominant scene color)
 *   - stage: MONSTER_PROWL_STAGE (lush gothic settings)
 *   - drama: MONSTER_PROWL_DRAMA (60%-gated dramatic background event)
 * Universal: LIGHTING + ATMOSPHERES.  Medium: weta_render.
 */

module.exports = {
  archetype: 'GOTHBOT_GARGOYLES',
  pools: {
    creature: 'GARGOYLE_CREATURE',
    action: 'GARGOYLE_ACTION',
    eye_glow: 'GARGOYLE_EYES',
    feature: 'GARGOYLE_FEATURES',
    scene_color: 'GARGOYLE_SCENE_COLOR',
    stage: 'MONSTER_PROWL_STAGE',
    drama: 'MONSTER_PROWL_DRAMA',
  },
};
