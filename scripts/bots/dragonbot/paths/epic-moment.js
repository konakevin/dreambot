/**
 * DragonBot epic-moment path = EPIC CASTLE SCENES (2026-05-31 PREMIUM-TIER
 * enrichment 2 → 8 bespoke). Vast sweeping cinematic castle scenes with
 * massive peak events. Wide-shot establishing composition.
 *
 * NEW axes added (2026-05-31):
 *   Always-on identity: epoch_signature + peak_event_choreography
 *   Gated 50%: skyline_drama + heraldic_identity + witness_chorus + architectural_signature
 *
 * Pre-enrichment file preserved at paths/legacy/epic-moment.js.
 */

module.exports = {
  archetype: 'EPIC_MOMENT',
  pools: {
    castle: 'EPIC_CASTLE',
    event: 'EPIC_CASTLE_EVENT',
    // NEW (2026-05-31 PREMIUM-TIER enrichment):
    epoch_signature: 'EPIC_MOMENT_EPOCH_SIGNATURE', // ALWAYS-ON — historical era / culture
    peak_event_choreography: 'EPIC_MOMENT_PEAK_EVENT_CHOREOGRAPHY', // ALWAYS-ON — cinematic moment-within-moment
    skyline_drama: 'EPIC_MOMENT_SKYLINE_DRAMA', // 50%-gated — sky / weather mood
    heraldic_identity: 'EPIC_MOMENT_HERALDIC_IDENTITY', // 50%-gated — banners / flags / sigils
    witness_chorus: 'EPIC_MOMENT_WITNESS_CHORUS', // 50%-gated — TINY scale-prover figures
    architectural_signature: 'EPIC_MOMENT_ARCHITECTURAL_SIGNATURE', // 50%-gated — weird memorable detail
  },
};
