/**
 * MechBot post-apoc-rust-tech path — declarative form (2026-05-16).
 *
 * Sixth MechBot path on the declarative composer. Mad Max BUSH-FIX scavenger
 * rigs + crews running across post-apoc wasteland. Mad Max: Fury Road / The
 * Doof Wagon / Gigahorse / Borderlands / Tank Girl / Death Stranding (wasteland
 * subset) / Twisted Metal / Carmageddon / Fallout-raider tech lineage. The rig
 * is RUNNING (or being bush-fixed mid-action) and the crew is VISIBLE.
 *
 * Heavy "BUSH-FIX" DNA mandate — jury-rigged scrap-welded chimera held
 * together with wire / chains / prayer / spite. Mismatched salvaged parts,
 * antenna forests, war-trophies, ram prows, exhaust stacks, license-plate
 * armor, rope-bound fuel cans.
 *
 * Pools (5 path-bespoke + 2 universal):
 *   - subject: reuses production-grade 200-entry RUST_APOC_SUBJECTS (scavenger
 *     rigs / walkers / hover-skiffs / wheeled / tracked — already strong bush-fix DNA)
 *   - action: reuses 200-entry RUST_APOC_ACTIONS (rigs roaring through scrap,
 *     pit-stops, chase action)
 *   - landscape: reuses 151-entry RUST_APOC_SETTINGS (cracked hardpan, salvage
 *     yards, post-collapse ruins)
 *   - composition: NEW Mad Max chase angles (low-pursuit, drone-aerial, over-
 *     bonnet, parallel-run, gunner-roof-POV, dust-trail-behind, etc.)
 *   - lighting: NEW wasteland (Fury Road golden-hour, sandstorm-orange, fire-
 *     glow, dawn blood-red — overrides cosmic bot default)
 *   - drama: NEW 40%-gated wasteland phenomena (dust-devil, sandstorm wall,
 *     wreck-fireball, molotov, vultures, fuel-spill, ram-impact)
 *
 * Identity preserved from legacy:
 *   - RIG IS ALIVE & MOVING (or actively bush-fixed mid-action)
 *   - CREW VISIBLE (1-5 figures on/around the rig)
 *   - FUNCTION-OVER-FORM bush-fix scavenger ingenuity
 *   - Sun-bleached paint over rust
 *   - NOT clean industrial / NOT pristine military / NOT ceremonial
 *
 * Pre-migration function-form brief preserved at paths/legacy/post-apoc-rust-tech.js.
 *
 * See:
 *   - scripts/lib/archetypes.js          (MECHBOT_POST_APOC_RUST_TECH slots)
 *   - scripts/lib/archetype-templates.js (MECHBOT_POST_APOC_RUST_TECH brief)
 *   - BOT_SCENE_QUALITY_PLAYBOOK.md      (vertigo-composition + bush-fix DNA reference)
 */

module.exports = {
  archetype: 'MECHBOT_POST_APOC_RUST_TECH',
  pools: {
    subject: 'RUST_APOC_SUBJECTS',
    action: 'RUST_APOC_ACTIONS',
    landscape: 'RUST_APOC_SETTINGS',
    lighting: 'RUST_APOC_LIGHTING',
    composition: 'RUST_APOC_COMPOSITION',
    drama: 'RUST_APOC_DRAMA', // 40% gated conditional
  },
};
