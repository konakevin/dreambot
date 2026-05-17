/**
 * SteamBot steampunk-labs — declarative composer form (2026-05-16).
 *
 * Victorian-industrial mad-science laboratory INTERIORS — soaring arched-glass
 * ceilings, two-story balconies, brass-and-mahogany shelving, gas-lamps,
 * mosaic-tile floors with embedded sigil-patterns. A major glowing experiment
 * centerpiece (containment-sphere / Tesla-coil / distillation-column / etc.)
 * anchors the scene. 80%-gated electrical phenomena (Tesla arcs / plasma-glow).
 * 60%-gated tiny lab-coated scientist as scale-prover.
 *
 * Tesla's Wardenclyffe / Frankenstein's tower-lab / Nemo's Nautilus / Da Vinci's
 * workshop / Royal Society / Crystal Palace visual lineage.
 *
 * Varied palette across renders — architecture is wood-brass-glass; saturated
 * color comes from the experiment glow (green / blue / amber / violet / pink
 * / etc.). NEVER locked to one signature palette.
 *
 * 5-axis split: 4 path-bespoke (lab_space / centerpiece / apparatus pickN:3 /
 * electrical 80%-gated) + 1 conditional 60%-gated (scientist) + 2 universal
 * (lighting / atmosphere).
 */

module.exports = {
  archetype: 'STEAMBOT_STEAMPUNK_LABS',
  pools: {
    lab_space: 'STEAMPUNK_LABS_SPACE',
    centerpiece: 'STEAMPUNK_LABS_CENTERPIECE',
    apparatus: 'STEAMPUNK_LABS_APPARATUS',
    electrical: 'STEAMPUNK_LABS_ELECTRICAL',
    scientist: 'STEAMPUNK_LABS_SCIENTIST',
  },
};
