/**
 * BloomBot hanging-flowers path (2026-06-22 NEW).
 *
 * A SCENIC WALKWAY beneath an OVERHEAD CANOPY of HANGING FLOWERS — cascading
 * wisteria curtains, suspended flower-basket chandeliers, hanging bloom-orbs and
 * floral pendant lanterns strung above a path that recedes into atmospheric
 * depth, lush "alive" accents lining the way. Reference: the Kevin-hearted
 * wisteria-over-train-tracks render (a dreamy tunnel of hanging blooms overhead,
 * flowers spilling along the path, soft misty light at the end).
 *
 * The walkway SETTING is the big variety axis (parks / towns / train stations +
 * tracks / gardens / courtyards / canals / cloisters / and more); the suspended
 * hanging pieces are the signature hero. Palette + lighting + roster come from
 * the flower engine via sharedDNA.
 *
 * Axes (3 path-bespoke + 55%-gated phenomenon; palette + lighting + roster via
 * sharedDNA):
 *   - setting (25): the walkway environment the canopy hangs over
 *   - hanging_pieces (25): the suspended overhead hanging-flower canopy (HERO)
 *   - walkway_accent (25): lush living flowers lining the path
 *   - atmospheric_phenomenon (25, 55%-gated): the magic-moment element
 */

module.exports = {
  archetype: 'BLOOMBOT_HANGING_FLOWERS',
  pools: {
    setting: 'BLOOMBOT_HANGING_FLOWERS_SETTING',
    hanging_pieces: 'BLOOMBOT_HANGING_FLOWERS_HANGING_PIECES',
    walkway_accent: 'BLOOMBOT_HANGING_FLOWERS_WALKWAY_ACCENT',
    atmospheric_phenomenon: 'BLOOMBOT_HANGING_FLOWERS_ATMOSPHERIC_PHENOMENON',
  },
};
