/**
 * FaeBot goblin-market — the iconic fae NIGHT MARKET (Stage F1).
 * A lantern-lit bazaar of impossible wares (bottled starlight, caged wisps),
 * palm-sized fae merchants + shoppers, critter customers, market lanes under
 * great roots. Clone of fairy-swarm's crowd machinery: the shared market EVENT
 * is the hero (≥6 figures, no single centered merchant); market_wares is the
 * money-shot. Reuses no shared pools — fully bespoke per path.
 */

module.exports = {
  archetype: 'FAEBOT_GOBLIN_MARKET',
  pools: {
    market_event: 'FAEBOT_GOBLIN_MARKET_EVENT',
    merchant_troupe: 'FAEBOT_GOBLIN_MARKET_TROUPE',
    market_setting: 'FAEBOT_GOBLIN_MARKET_SETTING',
    market_wares: 'FAEBOT_GOBLIN_MARKET_WARES',
    critter_guests: 'FAEBOT_GOBLIN_MARKET_CRITTER_GUESTS',
    lighting: 'FAEBOT_GOBLIN_MARKET_LIGHTING',
    magical_flavor: 'FAEBOT_GOBLIN_MARKET_MAGICAL_FLAVOR',
  },
};
