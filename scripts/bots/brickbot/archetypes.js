/**
 * BrickBot archetypes — path-bespoke axis-system definitions.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js. Each archetype
 * declares which axis slots its path rolls + the conditional drama
 * layer. The matching brief-builder template lives in
 * ./archetype-templates.js.
 */

module.exports = {
  BRICKBOT_PIRATES: {
    description: `PATH-BESPOKE — BrickBot pirates path (2026-05-22 migration; first BrickBot axis-system path). LEGO MOC pirate diorama photography — AFOL convention quality, NOT official set photos. Canon: Pirates of the Caribbean LEGO sets (6271 Imperial Flagship / 6285 Black Seas Barracuda / 70413 Brick Bounty) + Bricklink AFOL pirate dioramas + Treasure Island / Master & Commander narrative beats + vintage Imperial vs Pirates lineage.

9 path-bespoke slots + 1 conditional:
  • scene_type         — narrative stage (combat / treasure / harbor / kraken / cursed / chase / hideout / mutiny / shipwreck / parley / storm-survival)
  • minifig_action     — verb-led story beat (STORY BEAT MANDATE)
  • build_technique    — MOC distinguisher (SNOT-built hull / trans-blue waves / sloped-brick rocks / Technic-articulated cannons / printed-tile signature pieces)
  • camera_framing     — pirate-specific framing (cannon-broadside / crow's-nest / kraken-POV / shipwreck-tilt / chest-level discovery / over-shoulder duel)
  • ship_class         — silhouette bender (galleon / sloop / brig / frigate / junk / dhow / longship / catamaran / submarine-pirate)
  • register           — era+faction bender, weighted ~60% golden-age Caribbean / 40% non-default (Norse raid / Greek myth / Asian junk / fantasy / space-pirate / Royal-Navy-encounter / cursed-ghost-crew / steampunk / Somali-modern)
  • scene_props pickN:2 — diorama fill detail (parrot / jolly roger / rum keg / monkey / lit fuse / map fragment / peg leg / doubloon stack)
  • lighting           — axis-clean light source/dir/color
  • palette            — axis-clean color combinations
  • weather_drama (50%-gated) — environmental drama (storm+lightning / dense fog / glass-calm sea / kraken tentacles / thunderhead break / shark fin / waterspout)

Bending advantage over legacy: scene + weather are decoupled, so unique permutations like "kraken-attack + glass-calm sea + golden-hour" or "Norse longship + Viking-raid + thick-fog" become rollable. Legacy 200-entry scene pool conflated framing+setting+action+cast — split here for combinatorial diversity.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'build_technique',
        'camera_framing',
        'ship_class',
        'register',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_props: 2 },
    conditionalLayer: { slot: 'weather_drama', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },
};
