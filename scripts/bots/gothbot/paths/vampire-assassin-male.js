/**
 * GothBot vampire-assassin-male path — gothic-wild assassin scene.
 *
 * Mirror of vampire-assassin-female with male pools. Cloned structure
 * from StarBot female-explorer (two-tier scenery, character 25-40% of
 * frame, ALWAYS in motion). HOT, ornate, agile, crafty, mean, resourceful.
 *
 * Castlevania-Belmont + Devil-May-Cry-Dante + Van-Helsing aesthetic —
 * SILHOUETTES borrowed, never named-IP characters.
 *
 * POOLS: VAMPIRE_ASSASSIN_MALE, ASSASSIN_OUTFITS_MALE, ASSASSIN_SKIN,
 *        ASSASSIN_EYES, ASSASSIN_HAIR_COLOR, ASSASSIN_HAIRSTYLES_MALE,
 *        ASSASSIN_ACCESSORIES_MALE, ASSASSIN_STAGE, ASSASSIN_EPIC_BACKDROP,
 *        ASSASSIN_ADVENTURE_ACTIONS, LIGHTING, ATMOSPHERES
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const archetype = picker.pickWithRecency(pools.VAMPIRE_ASSASSIN_MALE, 'vam_archetype');
  const outfit = picker.pickWithRecency(pools.ASSASSIN_OUTFITS_MALE, 'vam_outfit');
  const skin = picker.pickWithRecency(pools.ASSASSIN_SKIN, 'vam_skin');
  const eyes = picker.pickWithRecency(pools.ASSASSIN_EYES, 'vam_eyes');
  const hairColor = picker.pickWithRecency(pools.ASSASSIN_HAIR_COLOR, 'vam_hair_color');
  const hairstyle = picker.pickWithRecency(pools.ASSASSIN_HAIRSTYLES_MALE, 'vam_hairstyle');
  const accessory = picker.pickWithRecency(pools.ASSASSIN_ACCESSORIES_MALE, 'vam_accessory');
  const stage = picker.pickWithRecency(pools.ASSASSIN_STAGE, 'vam_stage');
  const epicBackdrop = picker.pickWithRecency(pools.ASSASSIN_EPIC_BACKDROP, 'vam_epic_backdrop');
  const action = picker.pickWithRecency(pools.ASSASSIN_ADVENTURE_ACTIONS, 'vam_action');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic concept-art painter writing a CANDID VAMPIRE-ASSASSIN scene for GothBot. The character is a HOT, ornate, agile, crafty, mean, resourceful male vampire-assassin OUT IN THE WILD on a gothic hunt. The gothic WORLD is the costar of this image — scenery shares the spotlight equally with the character. Castlevania-Belmont + Devil-May-Cry-Dante + Van-Helsing energy. Output wraps with style prefix + suffix.

━━━ COMPOSITION (NON-NEGOTIABLE) ━━━
WIDE CINEMATIC FULL-BODY SHOT. The character occupies 25-40% of the frame (NOT a portrait, NOT waist-up, NOT thigh-up). The gothic stage + epic backdrop fill 60-75% of the frame around him. Scenery and character share the costar spotlight equally.

Camera angle options: side-profile / three-quarter rear / three-quarter front. Sometimes character is walking AWAY into the world (back of character visible). Sometimes character is paused on a tomb / parapet / bridge. NEVER head-on at the camera. NEVER posing.

Strong silhouette > facial detail. Face can be partial / hooded / in profile shadow — the SILHOUETTE against the gothic world is the hero.

━━━ CORE IDENTITY (lean VERY HARD into this) ━━━
He is a VAMPIRE ASSASSIN. Every choice — outfit, posture, gear, expression — reads as ornate-deadly-predator. He is BEAUTIFUL and DANGEROUS. Sleek, agile, mean, crafty, resourceful. Castlevania-Belmont + DMC-Dante + Van-Helsing energy. NOT a generic gothic man in fashion. NOT a nobleman at court. NOT a priest. A WORKING ASSASSIN, hunting a target.

━━━ THE GOTHIC WILD — OUT IN THE FIELD ━━━
This is a vampire-hunting scene OUT IN THE WILD. NEVER inside a cathedral nave, NEVER in a sanctum, NEVER in a bar. Always OUT on a gothic stage — village square, graveyard, crossroads, plague street, gothic forest, vampire-estate gates, cursed crossroads.

━━━ ABSOLUTE BANS — NO COMBAT / NO VIOLENCE / NO BLOOD ━━━
NO mid-strike, NO weapon-firing-on-enemy, NO vampire in frame, NO fallen body, NO wounded character, NO blood-spatter, NO fighting. Weapons are HOLSTERED, sheathed, drawn-but-loose, partially-drawn — never IN COMBAT USE. The scene is the BEFORE / DURING-THE-STALK / AFTER, never the strike itself.

━━━ ABSOLUTE BANS — NO STATIC / NO POSED / NO MEDITATING (CRITICAL) ━━━
ABSOLUTELY NO seated poses. NO cross-legged sitting. NO kneeling-still. NO meditation. NO eyes-closed. NO leaning-back-thoughtfully. NO standing-still-modeling. NO hands-on-hips runway. NO "gazing wistfully into distance".

He is ALWAYS IN MOTION — STRIDING / VAULTING / CLIMBING / STALKING / CROUCHED-MID-MOTION / MID-TURN / MID-DRAW / MID-LEAP. Body weight shifted, a limb in flight, captured at a loaded instant of HUNTING. Camera caught him mid-step, mid-vault, mid-draw. AGILE PREDATOR — never standing-still-posing.

If the action below somehow reads as static, OVERRIDE with a dynamic interpretation: "examining a track" → "crouched mid-motion examining a track, body coiled to spring up".

━━━ HIS ARCHETYPE / IDENTITY ━━━
${archetype}

━━━ HIS OUTFIT (silhouette is the hero — render full-body) ━━━
${outfit}

━━━ HIS PHYSICAL DNA (visible at wide-shot — SILHOUETTE + outfit dominate, but his face still reads as HOT) ━━━
- Skin: ${skin}
- Eyes: ${eyes}
- Hair color: ${hairColor}
- Hairstyle: ${hairstyle}

━━━ HIS SIGNATURE WEAPON / ACCESSORY (visible at wide-shot — read as armed and dangerous) ━━━
${accessory}

━━━ THE GOTHIC STAGE (the GROUND / BIOME / IMMEDIATE SURROUND — costar) ━━━
${stage}

Render this stage with FULL DEPTH. Foreground: tactile detail near his feet (cobblestones / fog / gravestones / fallen leaves / spilled-blood-of-someone-else). Midground: the character striding through the stage. Background: stage receding into atmospheric haze.

━━━ THE EPIC BACKDROP (the SCALE-DEFINING ELEMENT — sky / horizon dominates) ━━━
${epicBackdrop}

This backdrop DWARFS him. It fills the upper portion of the frame OR dominates the horizon. Render with awe-inspiring scale. He is small relative to it. Atmospheric haze separates him from the backdrop's massive scale.

━━━ HIS BODY ACTION ━━━
${action}

Place his body doing this action INSIDE the gothic stage with the epic backdrop above. The stage wins for setting; the action is just his body-pose.

━━━ ATMOSPHERIC DEPTH (CRITICAL) ━━━
Render LAYERED ATMOSPHERIC DEPTH:
- Foreground particles (fog, mist, ash, embers, drifting snow) caught in light
- Midground haze separating him from the epic backdrop
- Background atmospheric thinning toward the horizon
- Light rays / god-rays / volumetric beams cutting through atmosphere

The frame must FEEL inhabited and ALIVE — never sterile flat-color staging.

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
[the scene as a whole — gothic wild wide shot], [the epic backdrop dominating], [the gothic stage surrounding], [the assassin in his ornate outfit at full-body scale, visibly armed], [his body action / pose], [atmospheric depth and lighting], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. He is HOT and DEADLY. Outfit is ORNATE-TACTICAL not fashion. Composition is WIDE — character is dwarfed by the gothic stage + epic backdrop. Scenery is the COSTAR.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
