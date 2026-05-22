/**
 * EarthBot geological-wonder path — declarative axis-system (2026-05-21).
 *
 * Earth's raw geological architecture as art. Covers BOTH scales —
 * intimate cave interiors (crystal caves, amethyst geodes, lava tubes,
 * ice caves, slot canyons) AND epic outdoor vistas (hoodoos, salt flats,
 * basalt cliffs, sandstone waves, travertine terraces, fresh lava flows).
 *
 * 6 axes — 5 always-on + 1 conditional 30%-gated phenomenon:
 * - subject (scale-tagged intimate/epic — bespoke pool handles both)
 * - lighting (bespoke — covers both interior modes (godrays/mineral-glow/
 *   bioluminescent) and exterior modes (golden-hour/alpenglow/storm-break))
 * - atmosphere (bespoke — mist/steam/dust beams/crystal air/haze)
 * - mineral_color (bespoke — real mineral palette: amethyst-violet,
 *   malachite-green, iron-oxide-red, sulfur-yellow, obsidian-rainbow-sheen,
 *   pure-quartz-white, calcite-pink, hematite-grey)
 * - focal_anchor (bespoke — playbook-mandated scale-prover element: tree
 *   on a hoodoo, ice crystals from cave roof, single waterfall thread,
 *   sun-disc through slot opening, sole geyser plume)
 * - phenomenon (30%-gated, bespoke — aurora through skylight, rainbow
 *   over salt flat, snow dust on hoodoos, eruption plume backlight)
 *
 * All pools bespoke because EPIC_VISTA pools are outdoor-vista-only and
 * cannot handle cave-interior lighting/atmosphere/composition.
 *
 * Legacy implementation preserved at paths/legacy/geological-wonder.js.
 */

module.exports = {
  archetype: 'EARTHBOT_GEOLOGICAL_WONDER',
  pools: {
    subject: 'GEOLOGICAL_WONDER_SUBJECT',
    lighting: 'GEOLOGICAL_WONDER_LIGHTING',
    atmosphere: 'GEOLOGICAL_WONDER_ATMOSPHERE',
    mineral_color: 'GEOLOGICAL_WONDER_MINERAL_COLOR',
    focal_anchor: 'GEOLOGICAL_WONDER_FOCAL_ANCHOR',
    phenomenon: 'GEOLOGICAL_WONDER_PHENOMENON',
  },
};
