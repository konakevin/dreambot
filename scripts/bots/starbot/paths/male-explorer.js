/**
 * StarBot male-explorer path — alien-planet wilderness, scenery as costar.
 *
 * Per Kevin (2026-05-01 v3): characters out on alien planets ONLY. Wide
 * cinematic shots, character ~25-40% of frame, scenery + epic backdrop
 * dominate the rest. Tactical-explorer outfit aesthetic.
 *
 * Locks: SCI-FI RACE + PLANET SETTING + EPIC BACKDROP + ACTION
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const race = picker.pickWithRecency(pools.SCI_FI_RACE, 'me_race');
  const archetype = picker.pickWithRecency(pools.MALE_EXPLORERS, 'male_explorer');
  const outfit = picker.pickWithRecency(pools.EXPLORER_OUTFITS_MALE, 'me_outfit');
  const skin = picker.pickWithRecency(pools.EXPLORER_SKIN, 'me_skin');
  const eyes = picker.pickWithRecency(pools.EXPLORER_EYES, 'me_eyes');
  const hairColor = picker.pickWithRecency(pools.EXPLORER_HAIR_COLOR, 'me_hair_color');
  const hairstyle = picker.pickWithRecency(pools.MALE_EXPLORER_HAIRSTYLES, 'me_hairstyle');
  const accessory = picker.pickWithRecency(pools.MALE_EXPLORER_ACCESSORIES, 'me_accessory');
  const planetSetting = picker.pickWithRecency(pools.PLANET_SETTING, 'me_planet_setting');
  const epicBackdrop = picker.pickWithRecency(pools.EXPLORER_EPIC_BACKDROPS, 'me_epic_backdrop');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  // 75% candid body / 25% lineage gesture — both LOCATION-AGNOSTIC
  const actionRoll = Math.random();
  let action, actionType;
  if (actionRoll < 0.75) {
    action = picker.pickWithRecency(pools.EXPLORER_ADVENTURE_ACTIONS, 'me_adventure_action');
    actionType = 'CANDID BODY POSITION (location-agnostic — fits the alien biome below)';
  } else {
    action = picker.pickWithRecency(pools.SCI_FI_LINEAGE_ACTIONS, 'me_lineage_action');
    actionType = 'LINEAGE-SIGNATURE GESTURE (race-flavored — let his ancestry SHINE)';
  }

  return `You are a sci-fi concept-art painter writing a CANDID DEEP-SPACE EXPLORER scene for StarBot. The character is a sleek tactical cosmonaut man of a SPECIFIC sci-fi lineage standing OUT IN THE WILD ON AN ALIEN PLANET. The alien WORLD is the costar of this image — scenery shares the spotlight equally with the character. Output wraps with style prefix + suffix.

━━━ COMPOSITION (NON-NEGOTIABLE) ━━━
WIDE CINEMATIC FULL-BODY SHOT. The character occupies 25-40% of the frame (NOT a portrait, NOT waist-up). The alien planet biome + epic backdrop fill 60-75% of the frame. Scenery and character share the costar spotlight equally.

Camera angle options: side-profile / three-quarter rear / three-quarter front. Sometimes character is walking AWAY into the world (back of character visible). Sometimes character is paused on a ridge or outcrop. NEVER head-on at the camera. NEVER posing.

Strong silhouette > facial detail. Face can be partial / masked / hooded / in profile shadow.

━━━ THE ALIEN PLANET — WILD AND VAST ━━━
This is an alien-planet wilderness scene. NEVER inside a ship, NEVER in a station, NEVER in a bar or interior. Always OUT on the surface of a strange world.

━━━ ABSOLUTE BANS — NO BATTLE / NO COMBAT / NO VIOLENCE ━━━
NO mid-strike, NO weapon-aimed-at-foe, NO enemy in frame, NO fallen body, NO wounded character, NO blood, NO fighting. Weapons can be HOLSTERED, sheathed, slung — never IN COMBAT USE.

━━━ ABSOLUTE BANS — NO STATIC / NO SEATED / NO MEDITATION (CRITICAL) ━━━
ABSOLUTELY NO seated poses. NO cross-legged sitting. NO kneeling-still. NO meditation poses. NO eyes-closed. NO leaning-back. NO curled-up "resting". NO "sitting on a rock looking thoughtfully into the distance". NO "standing perfectly still gazing at the horizon".

The character is ALWAYS IN MOTION — STRIDING / CLIMBING / TRAVERSING / LOOKING UP / REACHING / TURNING / VAULTING / WADING. Body weight is shifted, a limb is in motion, captured at a loaded instant of EXPLORATION. Camera caught him mid-step, mid-climb, mid-reach. They are EXPLORERS doing exploring stuff — never standing-still-posing-for-the-camera.

If the action below somehow reads as static, OVERRIDE IT with a dynamic interpretation. Never render a still seated/cross-legged figure.

━━━ HIS LINEAGE / SCI-FI RACE (LOCKED) ━━━
${race}

This race is NON-NEGOTIABLE. Render him with the EXACT anatomy, distinguishing features above.

━━━ THE LOOK — TACTICAL EXPLORER ━━━
He is a TACTICAL EXPLORER ready to step into the unknown. Tough capable practical gear: armored plate, weathered hooded cloak, mercenary-coat, scout-vest with cargo pants, heavy power-armor, deep-space EVA suit, cyber-augmented edgerunner outfit, desert-warrior moisture-suit, arctic-explorer parka — pull from any of these silhouette traditions.

ABSOLUTE FRANCHISE LOOKALIKE BAN: NO Stormtrooper white-and-black plastic armor. NO Mandalorian T-visor full-body burnished plate. NO Halo Spartan green-and-gold helmet. NO Mass Effect N7 uniform. NO Star Wars Imperial officer. NO Dune Fremen stillsuit (use neutral "moisture-recycler suit" instead). NO Jedi or Sith robes. The look should be GENERIC sci-fi tactical, not any specific film/game's signature armor.

━━━ HIS OUTFIT (render full-body — silhouette matters) ━━━
${outfit}

Helmets / face-masks / respirators OPTIONAL — sometimes covering, sometimes pulled-down-to-throat, sometimes pushed-up-on-the-brow.

━━━ HIS PHYSICAL DNA (visible at wide-shot, but lineage + outfit dominate) ━━━
- Face: ${race.split(':')[0]} race-anatomy first, then skin description below
- Skin: ${skin}
- Eyes: ${eyes}
- Hair (and beard if described): ${hairColor}, ${hairstyle}

━━━ HIS EXPLORER ARCHETYPE (his energy) ━━━
${archetype}

━━━ HIS SIGNATURE ACCESSORY (visible at wide-shot) ━━━
${accessory}

━━━ THE PLANET BIOME (the GROUND / FLORA / NEAR-ATMOSPHERE — costar) ━━━
${planetSetting}

Render this biome with FULL DEPTH. Foreground: tactile detail near the character. Midground: the character standing in the biome. Background: the biome receding into atmospheric haze.

━━━ THE EPIC BACKDROP (the SCALE-DEFINING ELEMENT — sky / horizon dominates) ━━━
${epicBackdrop}

This backdrop DWARFS the character. It fills the upper portion of the frame OR dominates the horizon. Render with awe-inspiring scale. The character is small relative to it. Atmospheric haze separates the character from the backdrop's massive scale.

━━━ HIS BODY ACTION ━━━
${actionType}: ${action}

Place his body doing this action INSIDE the alien planet biome with the epic backdrop above. The biome wins for setting.

━━━ ATMOSPHERIC DEPTH (CRITICAL) ━━━
Render LAYERED ATMOSPHERIC DEPTH:
- Foreground particles (dust, spores, mist, snow, ash) caught in light
- Midground haze separating character from epic backdrop
- Background atmospheric thinning toward the horizon
- Light rays / god-rays / volumetric beams cutting through atmosphere

The frame must FEEL inhabited and ALIVE — never sterile flat-color staging.

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
[the scene as a whole — alien planet wide shot], [the epic backdrop dominating], [the planet biome surrounding], [the character in tactical explorer outfit at full-body scale, ${race.split(':')[0].toLowerCase()} lineage], [his body action / pose], [atmospheric depth and lighting], [color palette and mood]

DRAMATIC VISUALS: race lineage unmistakable. Outfit TACTICAL not fashion. Composition WIDE — character dwarfed by scenery + backdrop. Scenery is the COSTAR.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
