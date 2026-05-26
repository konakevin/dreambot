/**
 * GothBot monster-prowl-weta path — declarative form.
 * 2026-05-25: new branch — a COMBINED "hyperreal + Weta Workshop" medium.
 *
 * Kevin's brief: super high-def, NOT photography, but a very realistic RENDER —
 * Weta Workshop practical-effects realism fused with Unreal Engine 5 hyperreal
 * CGI. Lifelike, tactile, but unmistakably a crafted render. Uses the SAME broad
 * all-sorts monster pool as monster-prowl-inked (MONSTER_PROWL_INKED_CREATURE).
 *
 * Pools:
 *   - creature: MONSTER_PROWL_INKED_CREATURE (broad all-sorts — same as inked)
 *   - action: CREATURE_WILD_ACTION
 *   - stage: MONSTER_PROWL_STAGE (lush gothic settings)
 *   - drama: MONSTER_PROWL_DRAMA (60%-gated dramatic background event)
 * Universal: LIGHTING + ATMOSPHERES.  Medium: weta_render.
 */

module.exports = {
  archetype: 'GOTHBOT_MONSTER_PROWL_WETA',
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
