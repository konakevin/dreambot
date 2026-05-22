/**
 * BrickBot archetypes — path-bespoke axis-system definitions.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js. Each archetype
 * declares which axis slots its path rolls + the conditional drama
 * layer. The matching brief-builder template lives in
 * ./archetype-templates.js.
 */

module.exports = {
  BRICKBOT_SPACE: {
    description: `PATH-BESPOKE — BrickBot space path (2026-05-22 migration; second BrickBot axis-system path). LEGO Space MOC diorama photography across the iconic LEGO Space lineage (Classic Space 1978-87 / Blacktron / M-Tron / Space Police / Ice Planet / Insectoids / Mars Mission / Galaxy Squad / LEGO Star Wars) + hard-SF canon (Expanse / Mass Effect / Interstellar / Foundation / 2001 ASO / Star Citizen / Tintin retro / cyberpunk space).

9 path-bespoke slots + 1 conditional:
  • scene_type         — narrative stage (combat / docking / EVA / mining / first-contact / mission-control / refit / launch / crash-survival / habitat / exploration / discovery)
  • minifig_action     — verb-led story beat (mid-spacewalk-tethered / mid-drilling / mid-blast-deflect / mid-airlock-cycle)
  • build_technique    — space-MOC distinguisher (SNOT-built rounded hulls / trans-piece engine flares / Technic landing-gear / illegal alien-hive curves)
  • camera_framing     — space-specific framing (hangar-bay vault / EVA-tether POV / cockpit-canopy-out / nebula-vista-from-bridge / planetside establishing)
  • vehicle_class      — silhouette: Classic-Space lunar-rover / Blacktron stealth-fighter / M-Tron magnet-cruiser / Galaxy Squad split-ship / Star Wars X-wing / Imperial / dropship / hauler / probe / EVA suit / no-vehicle (interior)
  • register           — era+faction lock weighted ~45% Classic-LEGO-Space-era + cousins / ~55% non-default (Blacktron / M-Tron / Insectoids / Galaxy Squad / Star Wars / Mass Effect / Expanse / Tintin retro / 2001 ASO / Foundation / cyberpunk / solarpunk)
  • scene_props pickN:2 — diorama fill (astronaut helmet / ration pack / datapad / alien artifact in trans-piece / repair drone / beacon / fuel cell)
  • lighting           — axis-clean: nebula-tint / binary-star / planet-glow / engine-flare / cockpit-amber / lunar-cool. Cool/violet weighted to counter Flux's warm-default bias.
  • palette            — axis-clean: Classic-Space yellow-grey-trans-blue / Blacktron black-neon-yellow / M-Tron magenta-lime / Galaxy-Squad orange-cyan / nebula magenta-cyan
  • cosmic_phenomenon (50%-gated) — environmental drama: nebula bloom / aurora-belt / meteor shower / black-hole-event / supernova / planet-shadow / event-horizon-pull / gravity-wave-distortion

Bending advantage: register + cosmic_phenomenon decoupled from scene_type, so "asteroid mining + Classic-LEGO-Space register + cosmic-dust-cloud" and "EVA + Mass-Effect register + event-horizon-pull" are rollable.`,
    slots: {
      universal: [],
      bot: [],
      path: [
        'scene_type',
        'minifig_action',
        'build_technique',
        'camera_framing',
        'vehicle_class',
        'register',
        'scene_props',
        'lighting',
        'palette',
      ],
    },
    pickN: { scene_props: 2 },
    conditionalLayer: { slot: 'cosmic_phenomenon', gate: 0.5 },
    framingModes: null,
    anchorScaleRange: null,
  },

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
