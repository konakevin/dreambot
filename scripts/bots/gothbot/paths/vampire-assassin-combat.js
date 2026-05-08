/**
 * GothBot vampire-assassin-combat path — assassin mid-fight with a
 * gothic-fantasy creature (vampire / werewolf / gargoyle / demon /
 * banshee / lich / ghoul / etc.). 50/50 gender roll inside the path.
 *
 * Lifts the no-combat ban from vampire-assassin-female/male — this IS
 * combat. Frozen-instant of action: blade clash / crossbow-bolt mid-
 * flight / stake mid-thrust / leap-strike / etc. Still NO blood-spatter,
 * NO gore, NO dismemberment — implied combat in motion only.
 *
 * Reuses the same gendered character pools (archetype + outfit +
 * hairstyle + accessory) plus shared skin/eyes/hair-color and the
 * stage/epic-backdrop/lighting/atmosphere infrastructure.
 *
 * POOLS: VAMPIRE_ASSASSIN_FEMALE/MALE, ASSASSIN_OUTFITS_FEMALE/MALE,
 *        ASSASSIN_HAIRSTYLES_FEMALE/MALE, ASSASSIN_ACCESSORIES_FEMALE/MALE,
 *        ASSASSIN_SKIN, ASSASSIN_EYES, ASSASSIN_HAIR_COLOR,
 *        ASSASSIN_STAGE, ASSASSIN_EPIC_BACKDROP,
 *        COMBAT_FOE, COMBAT_MOMENT,
 *        LIGHTING, ATMOSPHERES
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const isFemale = Math.random() < 0.5;
  const gender = isFemale ? 'female' : 'male';
  const pronoun = isFemale ? 'she' : 'he';
  const possessive = isFemale ? 'her' : 'his';

  const archetype = isFemale
    ? picker.pickWithRecency(pools.VAMPIRE_ASSASSIN_FEMALE, 'vac_archetype_f')
    : picker.pickWithRecency(pools.VAMPIRE_ASSASSIN_MALE, 'vac_archetype_m');
  const outfit = isFemale
    ? picker.pickWithRecency(pools.ASSASSIN_OUTFITS_FEMALE, 'vac_outfit_f')
    : picker.pickWithRecency(pools.ASSASSIN_OUTFITS_MALE, 'vac_outfit_m');
  const hairstyle = isFemale
    ? picker.pickWithRecency(pools.ASSASSIN_HAIRSTYLES_FEMALE, 'vac_hairstyle_f')
    : picker.pickWithRecency(pools.ASSASSIN_HAIRSTYLES_MALE, 'vac_hairstyle_m');
  const accessory = isFemale
    ? picker.pickWithRecency(pools.ASSASSIN_ACCESSORIES_FEMALE, 'vac_accessory_f')
    : picker.pickWithRecency(pools.ASSASSIN_ACCESSORIES_MALE, 'vac_accessory_m');

  const skin = picker.pickWithRecency(pools.ASSASSIN_SKIN, 'vac_skin');
  const eyes = picker.pickWithRecency(pools.ASSASSIN_EYES, 'vac_eyes');
  const hairColor = picker.pickWithRecency(pools.ASSASSIN_HAIR_COLOR, 'vac_hair_color');
  const stage = picker.pickWithRecency(pools.ASSASSIN_STAGE, 'vac_stage');
  const epicBackdrop = picker.pickWithRecency(pools.ASSASSIN_EPIC_BACKDROP, 'vac_epic_backdrop');
  const foe = picker.pickWithRecency(pools.COMBAT_FOE, 'vac_foe');
  const moment = picker.pickWithRecency(pools.COMBAT_MOMENT, 'vac_moment');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic concept-art painter writing a CINEMATIC COMBAT scene for GothBot — a vampire-assassin in the FROZEN INSTANT of a fight with a gothic-fantasy creature. Castlevania-boss / Bloodborne-beast / Devil-May-Cry-combat / Van-Helsing-confrontation energy. Output wraps with style prefix + suffix.

━━━ COMPOSITION (NON-NEGOTIABLE) ━━━
WIDE-TO-MEDIUM CINEMATIC FRAME. The assassin and the foe BOTH appear in the frame, their action connecting them. Together they occupy ~50-65% of the frame; the gothic stage + epic backdrop fill the rest. Camera angle: dramatic three-quarter / low-angle / over-the-shoulder of either combatant. NEVER head-on at the camera. NEVER both posing.

Strong silhouettes against the gothic backdrop. The assassin and foe are LOCKED IN A FROZEN INSTANT of action.

━━━ CORE IDENTITY (lean VERY HARD into this) ━━━
The assassin is HOT, ornate, agile, mean, crafty — a vampire-killer. The foe is BEAUTIFUL-BUT-DEADLY — operatic gothic horror. Neither is generic. Castlevania-boss-fight aesthetic — both characters are stylized, dramatic, fully designed.

━━━ THE COMBAT — FROZEN INSTANT (this path LIFTS the no-combat rule) ━━━
This IS combat. The frame captures a SINGLE BEAT of action — blade meeting claw, crossbow-bolt mid-flight, stake mid-thrust, leap-strike mid-air, parry mid-arc. Both bodies in motion. Weapons in active use. The assassin is the active aggressor — never a victim, never being bitten.

ABSOLUTELY BANNED EVEN IN COMBAT:
- NO blood-spatter, NO blood-mist, NO open-wound visible
- NO dismemberment, NO entrails, NO gore
- NO already-dead-foe (both characters mid-action and alive)
- NO mid-bite where the foe is biting the assassin
- NO assassin-as-victim — she/he is always on offense or agile-counter
- NO satanic imagery (pentagrams, inverted crosses)
- NO Jack-Skellington / Halloween-Town cheapness

━━━ THE ASSASSIN — ${gender.toUpperCase()} ━━━

Archetype / identity:
${archetype}

Outfit (silhouette is the hero):
${outfit}

Physical DNA (visible mid-action):
- Skin: ${skin}
- Eyes: ${eyes}
- Hair color: ${hairColor}
- Hairstyle: ${hairstyle}

Signature weapon / accessory (in use or visible):
${accessory}

━━━ THE FOE — gothic-fantasy creature ━━━
${foe}

Render the foe with full design detail — terrifying-but-beautiful, never schlocky-horror. Ornate creature design.

━━━ THE COMBAT MOMENT — what's happening ━━━
${moment}

Render this AS THE FROZEN INSTANT OF THE FIGHT. Both bodies caught mid-motion. The connecting action between them is visible (bolt mid-flight / blade-meeting-claw / etc.).

━━━ THE GOTHIC STAGE ━━━
${stage}

The combat happens INSIDE this stage. Foreground tactile detail near the combatants' feet (cobblestones / fog / gravestones / spilled-something). Midground the two combatants locked in motion. Background the stage receding into atmospheric haze.

━━━ THE EPIC BACKDROP ━━━
${epicBackdrop}

This backdrop DWARFS the combat. It fills the upper portion of the frame OR dominates the horizon, framing the fight with awe-inspiring gothic scale.

━━━ ATMOSPHERIC DEPTH (CRITICAL) ━━━
Render LAYERED ATMOSPHERIC DEPTH:
- Foreground particles caught in motion (fog, mist, ash, embers, drifting snow, sparks from blade-clash)
- Midground haze separating the combatants from the epic backdrop
- Background atmospheric thinning toward the horizon
- Light rays / god-rays / volumetric beams cutting through atmosphere
- DRAMATIC chiaroscuro — single dramatic light source picking out both combatants

━━━ NO STATIC ━━━
NEITHER character is standing still. Both are MID-MOTION at the instant captured — body weights shifted, limbs in flight, hair / cape / fur / wings / cloak caught in mid-action. The image is a FROZEN beat of cinematic action.

${blocks.NO_JACK_SKELLINGTON_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ STRUCTURE (write the prompt in this order for best results) ━━━
[the scene as a whole — gothic combat wide shot], [the epic backdrop dominating], [the gothic stage surrounding], [the assassin in ornate outfit mid-action], [the foe creature mid-action], [the combat moment connecting them — frozen instant], [atmospheric depth and lighting], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. ${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} is HOT and DEADLY. The foe is OPERATIC and TERRIFYING. Both LOCKED in the frozen instant. Composition is WIDE-CINEMATIC — boss-fight intensity.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
