/**
 * FaeBot flower-fairy path — declarative axis-system form (2026-05-20).
 *
 * THE SOUL OF THE PATH:
 *   ONE flower-merged mythic fae creature is the focal subject (40-55%
 *   of frame, off-center, candid). Cloned originally from forest-fairy-
 *   scene (R11 reset) but DISTINCT DNA: creatures whose BODIES ARE
 *   FLOWERS — petal-skin / blossom-hair / petal-wings / petal-garment
 *   / pollen-glow / flower-species lineage. Smaller-than-human scale —
 *   flowers can be her HOME (peony as bedroom, tulip-bell as room,
 *   sunflower-disk as balcony, lotus-pad as raft).
 *
 * THE BAR (from BOT_SCENE_QUALITY_PLAYBOOK):
 *   Every render is a poster-worthy painted-fantasy gallery frame.
 *   Multi-tier depth, visible material truth (oil-brush register),
 *   light drama, narrative beat (specific candid moment), 5+ stacked
 *   exotic plant-merged features readable.
 *
 * 10 AXES (9 always-on + 1 gated companion):
 *   - creature: flower-merged fae (species + petal-skin + blossom-hair
 *     + petal-garment + petal-wings + magical signature + candid posture)
 *   - flower_biome: WHERE — wildflower meadow / giant peony cluster /
 *     sunflower field / wisteria-cascade arbor / lotus-pond / sakura
 *     grove / poppy field / iris-meadow / etc.
 *   - lighting: TIME + LIGHT DRAMA — same pattern as forest-fairy-scene
 *   - weather: AIR CONDITION + particle motion
 *   - foreground_anchor: closest depth element (oversized blossom /
 *     petal-curtain / dew-glint / butterfly-cluster)
 *   - botanical_accent: signature secondary-bloom cluster
 *   - candid_action: captured moment + composition baked in
 *   - magical_flavor: pollen-glow / fairy-dust / butterfly-trail /
 *     firefly-cluster / glowing wing-trail
 *   - scale_prover: giant-flower-as-home element exploiting the smaller-
 *     than-human scale (peony larger than her body / sunflower-disk
 *     balcony / etc.)
 *   - companion (50%-gated): flower-garden companion — butterfly /
 *     hummingbird / bee / dragonfly / ladybug / lily-frog
 */

module.exports = {
  archetype: 'FAEBOT_FLOWER_FAIRY',
  pools: {
    // creature rolled first — its palette tag (WARM / COOL / WHITE / MULTI)
    // becomes the SCENE COLOR THEME. biome + botanical_accent filter to
    // matching palette so every render is color-coherent (rose-crimson scene,
    // lotus-pink scene, sunflower-gold scene, etc.).
    creature: 'FAEBOT_FLOWER_FAIRY_CREATURE',
    flower_biome: { name: 'FAEBOT_FLOWER_FAIRY_BIOME', matchTagsFromSlot: 'creature' },
    lighting: 'FAEBOT_FLOWER_FAIRY_LIGHTING',
    weather: 'FAEBOT_FLOWER_FAIRY_WEATHER',
    foreground_anchor: 'FAEBOT_FLOWER_FAIRY_FOREGROUND_ANCHOR',
    botanical_accent: {
      name: 'FAEBOT_FLOWER_FAIRY_BOTANICAL_ACCENT',
      matchTagsFromSlot: 'creature',
    },
    candid_action: 'FAEBOT_FLOWER_FAIRY_CANDID_ACTION',
    magical_flavor: 'FAEBOT_FLOWER_FAIRY_MAGICAL_FLAVOR',
    scale_prover: 'FAEBOT_FLOWER_FAIRY_SCALE_PROVER',
    companion: 'FAEBOT_FLOWER_FAIRY_COMPANION',
  },
};
