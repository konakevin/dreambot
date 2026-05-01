#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/warrior_battle_actions.json',
  total: 25,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} BATTLE / COMBAT PEAK-MOMENT action entries for DragonBot's female-warrior and male-warrior paths. Each entry is a SHORT phrase (12-22 words) describing the EXACT body position / motion / freeze-frame of a warrior caught at the EPIC peak of combat or heroic action — NOT walking, NOT exploring, NOT atmospheric.

These are FREEZE-FRAMES of peak action — the camera snapped at the loaded instant. Suitable for both male and female warriors.

━━━ ACTION CATEGORIES (enforce variety across ${n}) ━━━

MID-STRIKE / OFFENSE (5-6) — caught mid-action with weapon committed:
- mid-swing of a greatsword at a charging foe just out of frame, weight shifted forward, blade arcing trail of motion
- spear thrust at the apex of full-extension, weight on back leg, knuckles white on the haft
- axe-strike caught at the moment of impact against a shield, sparks flying from contact, snarled face
- twin daggers flashing in a crossing-strike at chest height, body twisted in the follow-through
- pulling back a longbow at full draw, arrow nocked, eye sighting down the shaft, wind in hair

PARRY / DEFENSE / DODGE (4-5) — caught mid-defensive moment:
- catching a descending blade on a raised shield, knees buckling under impact, snarl through gritted teeth
- ducking beneath a wide axe-swing, body coiled low, sword raised in counter-poised hand
- side-stepping at the last instant, cloak whipping with the dodge, blade angling for riposte
- twin-blade cross-block catching an attacker's strike between, sparks raining from steel-on-steel
- diving roll mid-combat, weapon clutched close, dirt and gravel kicking up

MAGIC / RITUAL (4-5) — peak channeling moments:
- runed sword raised overhead crackling with arcane energy, blue-fire spilling down the blade
- fire-spell mid-cast, both hands cupped channeling flame between them, eyes glowing
- dragon-fire breath caught at the moment of release, jaw open, plume erupting from the throat
- arcane focus orb hovering at fingertips, light crawling up the arm, magic-circle glowing on the ground beneath
- summoning-stance with a glyph-circle blazing at the feet, hands raised in casting gesture

PRIMAL / RAGE / CHARGE (4-5) — full-throttle berserker peak:
- battle-cry mid-roar, head thrown back, weapon raised overhead, veins corded in the neck
- charging full-tilt down a hillside, weapon at side, mouth open in a war-cry
- berserker-leap mid-air with weapon overhead, body fully committed
- shield-bash mid-impact, opponent's weapon clattering aside, snarl of grim satisfaction
- stomp-stance at the end of a strike, weapon embedded in the ground, breath visible in cold air

DRAGON / MOUNTED COMBAT (4-5) — DragonBot signature peak moments:
- crouched on the back of a dragon mid-flight, lance leveled at the horizon, wind tearing at hair and cloak
- sword raised at a dragon's eye-level mid-confrontation, beast's snarl visible in the foreground, warrior's stance unflinching
- riding-stance leaning forward as a dragon banks hard into a dive, reins tight in one fist, weapon in the other
- dropping from a dragon's back mid-leap onto the battlefield below, weapon raised, cloak streaming behind
- dragon-bond peak — warrior touching a dragon's massive snout, both eyes locked, golden light passing between

AFTERMATH / FROZEN MOMENT (3-4) — the moment after the kill, still loaded:
- standing over a fallen foe, weapon dripping, chest heaving, eyes scanning for the next threat
- pulling a blade from an enemy's body with one boot braced for leverage, jaw set
- catching a falling banner mid-air after a battle-end, raising it into smoke
- sword tip resting on the ground, both hands on the pommel, surveying smoking ruins

━━━ RULES ━━━
- Each entry is a SHORT BODY-POSITION + MOTION freeze-frame
- 12-22 words — vivid, specific, paintable
- These are PEAK MOMENTS — NOT atmospheric, NOT traveling, NOT quiet
- Suitable for BOTH male and female warriors (gender-neutral phrasing)
- Variety across all 6 categories above mandatory
- One entry MUST involve a dragon (signature DragonBot detail)
- One entry MUST involve magic-channeling (fantasy iconic)
- The body-position must be PHYSICALLY POSSIBLE — no anime-floating, no mid-air-spin-without-context
- The "verb" of the action must be CLEAR — Sonnet should know exactly what frame to render

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
