/**
 * MechBot power-armor-infantry path — declarative form (2026-05-16).
 *
 * Fourth MechBot path on the declarative composer (after titan-war-machines,
 * mech-skyships, mecha-pilots). Subject: MEAN KILL-TEAM squads in heavy
 * power armor. Helldivers 2 / WH40K Space Marines / Aliens Colonial Marines /
 * Doom Eternal / Starship Troopers / Halo ODST / Killzone Helghast lineage.
 *
 * Hard pivot from the legacy "professional military procedural" framing —
 * Kevin's diagnosis: "these are weak. these are soldiers who have to fight
 * against these mechs ... gritty, lived in, tough, well equipped, bad ass
 * space marines out to kill... aggressive, dynamic, macho and MEAN".
 *
 * Pools (5 path-bespoke + 2 universal):
 *   - subject: regen'd MEAN KILL-TEAM squads (40K / Helldivers / Aliens /
 *     Mandalorian / Doom / ODST / Helghast archetype distribution)
 *   - action: regen'd AGGRESSIVE combat verbs (charging / kicking /
 *     executing / mid-fire / mid-strike — NO procedural / overwatch / scan)
 *   - landscape: reuses production-grade legacy 200-entry settings (urban
 *     rubble / war-torn / bunker / city / tunnel — all good)
 *   - composition: NEW path-bespoke squad-combat vertigo angles
 *   - lighting: NEW path-bespoke battlefield combat lighting (muzzle-flash,
 *     explosion-backlit, plasma-bolt-walls — overrides cosmic-coded bot
 *     default LIGHTING)
 *   - drama: NEW 40%-gated battlefield phenomena (RPG-impact, breaching-
 *     charge, mortar-walks-ground, building-collapse, alien-swarm-closing)
 *
 * Identity preserved from legacy:
 *   - SQUAD never solo (2-5 figures)
 *   - HUMAN scale (NOT titan / NOT pilot-in-cockpit)
 *   - Fully human under armor (NOT cyborg integration)
 *
 * Pre-migration function-form brief preserved at paths/legacy/power-armor-infantry.js.
 *
 * See:
 *   - scripts/lib/archetypes.js          (MECHBOT_POWER_ARMOR_INFANTRY slots)
 *   - scripts/lib/archetype-templates.js (MECHBOT_POWER_ARMOR_INFANTRY brief)
 *   - BOT_SCENE_QUALITY_PLAYBOOK.md      (vertigo-composition / pool-DNA-dominates patterns)
 */

module.exports = {
  archetype: 'MECHBOT_POWER_ARMOR_INFANTRY',
  pools: {
    subject: 'POWER_ARMOR_SUBJECTS',
    action: 'POWER_ARMOR_ACTIONS',
    landscape: 'POWER_ARMOR_SETTINGS',
    lighting: 'POWER_ARMOR_LIGHTING',
    composition: 'POWER_ARMOR_COMPOSITION',
    engagement: 'POWER_ARMOR_ENGAGEMENT', // ALWAYS-ON multi-actor combat narrative
    allied_tech: 'POWER_ARMOR_ALLIED_TECH', // ALWAYS-ON friendly combat-bot/drone/walker
    drama: 'POWER_ARMOR_DRAMA', // 40% gated conditional
  },
};
