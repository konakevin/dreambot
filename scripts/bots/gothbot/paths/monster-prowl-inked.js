/**
 * GothBot monster-prowl-inked path — declarative form.
 * 2026-05-25: new branch built from Kevin's hearted inked renders.
 *
 * Same monster-as-hero engine as monster-prowl, but in a CLEAN DETAILED INKED
 * dark-fantasy illustration medium (NO Berserk/Miura — that token fused monsters
 * into gnarled trees) with a COLOR-MOOD SPECTRUM axis that rolls from
 * BLAZING-VIVID-SATURATED to deeply-MUTED across renders. Kevin hearted both ends
 * (vivid mp-varied + muted mp-natural) and wants the spectrum between them.
 *
 * Pools:
 *   - creature: CREATURE_ARCHETYPE (shared 7-category monster pool)
 *   - action: CREATURE_WILD_ACTION
 *   - stage: MONSTER_PROWL_STAGE (lush gothic settings)
 *   - color_mood: MONSTER_PROWL_COLOR_MOOD (vivid↔muted spectrum)
 *   - drama: MONSTER_PROWL_DRAMA (60%-gated dramatic background event)
 * Universal: LIGHTING + ATMOSPHERES.
 */

module.exports = {
  archetype: 'GOTHBOT_MONSTER_PROWL_INKED',
  pools: {
    creature: 'MONSTER_PROWL_INKED_CREATURE',
    action: 'CREATURE_WILD_ACTION',
    stage: 'MONSTER_PROWL_STAGE',
    drama: 'MONSTER_PROWL_DRAMA',
  },
};
