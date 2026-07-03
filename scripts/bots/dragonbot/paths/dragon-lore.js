/**
 * DragonBot dragon-lore path — colossal dragon RELICS & RUINS.
 *
 * 2026-07-03 HERO-RELIC overhaul (Kevin). The 2026-05-14 form stacked a
 * movie-poster mandate + 80% phenomenon + maximal scene seeds into busy
 * kitchen-sink frames. Now: ONE colossal piece of dragon evidence is the
 * unmistakable hero of every render, beautifully reclaimed by time. The
 * dragons are GONE — their scale remains.
 *
 * 6 path-bespoke pools:
 *   - relic: DRAGON_LORE_RELIC (the money axis — the colossal relic/ruin)
 *   - setting: DRAGON_LORE_SETTING (the biome it rests in)
 *   - reclamation: DRAGON_LORE_RECLAMATION (how time claimed it —
 *     ancient + beautiful, never rundown)
 *   - human_trace: DRAGON_LORE_HUMAN_TRACE (tiny reverent scale-prover)
 *   - sky_layer: DRAGON_LORE_SKY (kept from the original form)
 *   - palette: DRAGON_LORE_PALETTE (COLOR-ONLY — replaces the bot-wide
 *     scene_palettes shared-DNA slot, whose entries carry scene nouns
 *     that injected a second scene into every roll)
 *
 * Plus universal lighting + atmosphere, and the original phenomenon pool
 * on a lowered 40% gate.
 */

module.exports = {
  archetype: 'DRAGONBOT_DRAGON_LORE',
  pools: {
    relic: 'DRAGON_LORE_RELIC',
    setting: 'DRAGON_LORE_SETTING',
    reclamation: 'DRAGON_LORE_RECLAMATION',
    human_trace: 'DRAGON_LORE_HUMAN_TRACE',
    sky_layer: 'DRAGON_LORE_SKY',
    palette: 'DRAGON_LORE_PALETTE',
    phenomenon: 'DRAGON_LORE_PHENOMENON',
  },
};
