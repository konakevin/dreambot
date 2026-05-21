/**
 * FaeBot forest-fairy-scene path — declarative axis-system form (2026-05-20).
 *
 * THE SOUL OF THE PATH:
 *   ONE mythic forest creature is the focal subject (40-55% of frame, off-
 *   center, candid). Hidden-camera glimpse of an exotic plant-merged fae
 *   spirit. NEVER posing, NEVER eye-contact. The forest WRAPS AROUND her
 *   like a frame. Painted-fantasy concept art (Manchess + Giancola + Bonner
 *   + Froud lineage). Otherworldly mythic-creature beauty, NOT human-model
 *   beauty.
 *
 * THE BAR (from BOT_SCENE_QUALITY_PLAYBOOK):
 *   Every render is a poster-worthy painted-fantasy gallery frame. Multi-
 *   tier depth (foreground vines + midground her + background mist).
 *   Visible material truth (oil-brush register). Light drama (god-rays /
 *   moonlit / blue-hour). Narrative beat (specific candid moment). Stacked
 *   exotic features readable on the creature (5+ plant-merged details).
 *
 * 10 AXES (9 always-on + 1 gated companion):
 *   - creature: stacked-exotic mythic being (species + skin + hair +
 *     garment + anatomical extras + magical signature)
 *   - forest_biome: WHERE — pure forest type + signature features
 *     (sun-cathedral oak / fern-grotto / willow-thicket / blue-grotto /
 *     redwood-cathedral / autumn-blaze / moss-canyon / snowy-pine / etc.)
 *   - lighting: TIME + LIGHT DRAMA — golden afternoon god-rays / moonlit
 *     silver shafts / blue-hour low under-light / pearl-mist dawn beams /
 *     bioluminescent ambient / etc.
 *   - weather: AIR CONDITION + particle motion — gentle rain / dawn mist
 *     / snow flurries / clear / autumn-leaves drift / pollen-haze /
 *     post-storm dew-glints / etc.
 *   - foreground_anchor: closest depth element bringing 3-tier depth
 *     (hanging vines / mossy boulder / fern-cluster / mushroom-cluster /
 *     wildflower carpet / drifting petal-cluster / etc.)
 *   - botanical_accent: signature bloom cluster (foxgloves / bluebells /
 *     wisteria-cascade / wild-rose / lily-of-the-valley / dogwood / etc.)
 *   - candid_action: captured moment + composition baked in (cupping
 *     water close-medium / pressing palm to roots low-angle / blessing
 *     seedling high-angle / sleeping in moss-hollow / etc.)
 *   - magical_flavor: supernatural accent — always-on, pool ranges from
 *     subtle to dramatic (subtle pollen-haze → will-o-wisps / fairy-dust
 *     spiral / bioluminescent fungus-circle / firefly swarm)
 *   - scale_prover: environmental scale element (massive ancient roots
 *     dwarfing her / cathedral canopy soaring above / mushroom-cap
 *     larger than her head / etc.)
 *   - companion: small woodland animal (50%-gated for solo intimacy
 *     half the time) — fox-cub at her feet / robin on her shoulder /
 *     glow-moth circling / spotted-fawn beside her / hare watching
 */

module.exports = {
  archetype: 'FAEBOT_FOREST_FAIRY_SCENE',
  pools: {
    creature: 'FAEBOT_FOREST_FAIRY_SCENE_CREATURE',
    forest_biome: 'FAEBOT_FOREST_FAIRY_SCENE_BIOME',
    lighting: 'FAEBOT_FOREST_FAIRY_SCENE_LIGHTING',
    weather: 'FAEBOT_FOREST_FAIRY_SCENE_WEATHER',
    foreground_anchor: 'FAEBOT_FOREST_FAIRY_SCENE_FOREGROUND_ANCHOR',
    botanical_accent: 'FAEBOT_FOREST_FAIRY_SCENE_BOTANICAL_ACCENT',
    candid_action: 'FAEBOT_FOREST_FAIRY_SCENE_CANDID_ACTION',
    magical_flavor: 'FAEBOT_FOREST_FAIRY_SCENE_MAGICAL_FLAVOR',
    scale_prover: 'FAEBOT_FOREST_FAIRY_SCENE_SCALE_PROVER',
    companion: 'FAEBOT_FOREST_FAIRY_SCENE_COMPANION',
  },
};
