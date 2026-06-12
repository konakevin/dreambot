/**
 * FaeBot forest-elder path — declarative axis-system form (2026-06-11).
 *
 * THE SOUL OF THE PATH:
 *   The MASCULINE counterpart to dryad-portrait. An ANCIENT MALE woodland
 *   spirit — Leshy / Green-Man / horned forest-god (Cernunnos) / woodwose /
 *   bark-druid elder / antlered forest-king / mossy treant-elder / root-warden.
 *   Weathered bark skin, glowing amber/green heartwood-veins, a beard & hair of
 *   moss / lichen / pine-needles / hanging roots, branching antlers or a foliate
 *   crown, a mantle of birch-bark / fern / shelf-fungus. Ancient, sacred, wise,
 *   a powerful guardian. Torso ALWAYS covered (anti-shirtless).
 *
 * WHY IT EXISTS:
 *   Built to house the male forest-spirit DNA that was producing "girl with a
 *   beard" androgyny inside the feminine, "she"-locked dryad-portrait path.
 *   Hard GENDER-LOCK to male (he/his, a moss-beard) — see archetype template.
 *   The male seeds were extracted out of dryad-portrait + forest-fairy-scene
 *   into faebot_forest_elder_creature; those feminine pools are now male-free.
 *
 * MIX FRAMING (Kevin: "Both"):
 *   The framing axis rolls ~half intimate BUST-PORTRAITS and ~half fuller
 *   FOREST-SCENES of the elder in his woodland domain — an old guardian in his
 *   realm. The template commits to whichever rolls.
 *
 * 10 AXES (9 always-on + 1 gated foreground_anchor) — all bespoke-MALE except
 * lighting, which reuses the genderless dryad time-of-day set:
 *   - creature:          species + bark skin + moss-beard + antlers/crown +
 *                        plant-mantle + magical signature (features only)
 *   - expression_moment: his face + eyes (engaged in the moment)
 *   - story_beat:        verb-led NARRATIVE MOMENT — the elder mid-act with
 *                        woodland-creature participants + stakes (healing a
 *                        bird, raising a fallen tree, sheltering fawns). The
 *                        storytelling engine; front-loaded in the template.
 *   - framing:           intimate bust-portrait vs fuller forest-scene
 *   - domain:            his ancient woodland (soft-focus or lush)
 *   - adornment:         antler-crown / mantle / beard detail (masculine)
 *   - lighting:          REUSES FAEBOT_DRYAD_PORTRAIT_LIGHTING (genderless TOD)
 *   - weather:           air condition around him
 *   - magical_flavor:    visible forest-magic near him
 *   - foreground_anchor (40%-gated): closest depth element
 *
 * Color-tag system: SKIP — earth-tone-dominant palette has no clash risk.
 * Two-pass polish: ON (subject-dominant portrait/scene, polish-safe).
 */

module.exports = {
  archetype: 'FAEBOT_FOREST_ELDER',
  pools: {
    creature: 'FAEBOT_FOREST_ELDER_CREATURE',
    expression_moment: 'FAEBOT_FOREST_ELDER_EXPRESSION',
    story_beat: 'FAEBOT_FOREST_ELDER_STORY_BEAT',
    framing: 'FAEBOT_FOREST_ELDER_FRAMING',
    domain: 'FAEBOT_FOREST_ELDER_DOMAIN',
    adornment: 'FAEBOT_FOREST_ELDER_ADORNMENT',
    lighting: 'FAEBOT_DRYAD_PORTRAIT_LIGHTING',
    weather: 'FAEBOT_FOREST_ELDER_WEATHER',
    magical_flavor: 'FAEBOT_FOREST_ELDER_MAGICAL',
    foreground_anchor: 'FAEBOT_FOREST_ELDER_FOREGROUND',
  },
};
