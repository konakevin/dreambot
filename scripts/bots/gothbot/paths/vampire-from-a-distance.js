/**
 * GothBot vampire-from-a-distance path — distant-figure cinematic scenery.
 *
 * Literal clone of vampire-assassin-female as it stood on 2026-05-15
 * (legacy function-form + movie-poster crank + character-first guard).
 * At that snapshot the path was producing gorgeous distant-tiny-figure-
 * with-epic-Castlevania-castle renders ~50% of the time — Kevin wanted
 * to preserve that exact state as its own path while the original
 * vampire-assassin-female continues to iterate toward character-first.
 *
 * Reuses the same assassin pools as vampire-assassin-female.
 *
 * POOLS: VAMPIRE_ASSASSIN_FEMALE, ASSASSIN_OUTFITS_FEMALE, ASSASSIN_SKIN,
 *        ASSASSIN_EYES, ASSASSIN_HAIR_COLOR, ASSASSIN_HAIRSTYLES_FEMALE,
 *        ASSASSIN_ACCESSORIES_FEMALE, ASSASSIN_STAGE, ASSASSIN_EPIC_BACKDROP,
 *        ASSASSIN_ADVENTURE_ACTIONS, LIGHTING, ATMOSPHERES
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const archetype = picker.pickWithRecency(pools.VAMPIRE_ASSASSIN_FEMALE, 'vfd_archetype');
  const outfit = picker.pickWithRecency(pools.ASSASSIN_OUTFITS_FEMALE, 'vfd_outfit');
  const skin = picker.pickWithRecency(pools.ASSASSIN_SKIN, 'vfd_skin');
  const eyes = picker.pickWithRecency(pools.ASSASSIN_EYES, 'vfd_eyes');
  const hairColor = picker.pickWithRecency(pools.ASSASSIN_HAIR_COLOR, 'vfd_hair_color');
  const hairstyle = picker.pickWithRecency(pools.ASSASSIN_HAIRSTYLES_FEMALE, 'vfd_hairstyle');
  const accessory = picker.pickWithRecency(pools.ASSASSIN_ACCESSORIES_FEMALE, 'vfd_accessory');
  const stage = picker.pickWithRecency(pools.ASSASSIN_STAGE, 'vfd_stage');
  const epicBackdrop = picker.pickWithRecency(pools.ASSASSIN_EPIC_BACKDROP, 'vfd_epic_backdrop');
  const action = picker.pickWithRecency(pools.ASSASSIN_ADVENTURE_ACTIONS, 'vfd_action');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic concept-art painter writing a CANDID VAMPIRE-ASSASSIN scene for GothBot. The character is a HOT, ornate, agile, crafty, mean, resourceful female vampire-assassin OUT IN THE WILD on a gothic hunt. Castlevania-Belmont + Devil-May-Cry-Lady + Van-Helsing energy. Output wraps with style prefix + suffix.

━━━ CHARACTER IS THE PRIMARY FOCUS — ABSOLUTE FIRST RULE ━━━
THE FEMALE VAMPIRE-ASSASSIN IS THE SUBJECT OF THIS IMAGE. Without her clearly visible and readable in the foreground, the render is WRONG. This is NOT a castle picture. This is NOT a scenic landscape with a tiny figure. This is a CHARACTER SCENE where the gothic environment SUPPORTS her, never overwhelms her.

• She MUST be 25-40% of the frame — clearly readable, face/silhouette/outfit visible at a glance
• She MUST be in the foreground or midground — NEVER tiny-in-scenery, NEVER 5%-10% lost in the backdrop
• Her gothic-tactical outfit + weapon must be readable — visible from across the room
• Her face / pose / posture must communicate her energy (HOT + ornate + agile + deadly)
• The viewer's eye lands on HER first, then notices the gothic stage + epic backdrop around her

The gothic stage + epic backdrop are ATMOSPHERIC SUPPORT — they exist to make her look more dangerous, never to replace her as the subject. Castle/cathedral/cliff in the background = scale-prover BEHIND her. NEVER castle-as-subject-with-tiny-figure.

━━━ COMPOSITION (NON-NEGOTIABLE) ━━━
WIDE CINEMATIC FULL-BODY SHOT. The character occupies 25-40% of the frame (NOT a portrait, NOT waist-up, NOT thigh-up, NOT TINY-IN-SCENERY at 5-10%). The gothic stage + epic backdrop fill 60-75% of the frame AROUND her — supporting her, never replacing her.

Camera angle options: side-profile / three-quarter rear / three-quarter front. Sometimes character is walking AWAY into the world (back of character visible). Sometimes character is paused on a tomb / parapet / bridge. NEVER head-on at the camera. NEVER posing.

Strong silhouette > facial detail. Face can be partial / hooded / in profile shadow — the SILHOUETTE against the gothic world is the hero.

━━━ CORE IDENTITY (lean VERY HARD into this) ━━━
She is a VAMPIRE ASSASSIN. Every choice — outfit, posture, gear, expression — reads as ornate-deadly-predator. She is BEAUTIFUL and DANGEROUS. Sleek, agile, mean, crafty, resourceful. Castlevania-Belmont + DMC-Lady + Van-Helsing energy. NOT a generic gothic woman in fashion. NOT a noblewoman at court. NOT a witch. A WORKING ASSASSIN, hunting a target.

━━━ THE GOTHIC WILD — OUT IN THE FIELD ━━━
This is a vampire-hunting scene OUT IN THE WILD. NEVER inside a cathedral nave, NEVER in a sanctum, NEVER in a bar. Always OUT on a gothic stage — village square, graveyard, crossroads, plague street, gothic forest, vampire-estate gates, cursed crossroads.

━━━ ABSOLUTE BANS — NO COMBAT / NO VIOLENCE / NO BLOOD ━━━
NO mid-strike, NO weapon-firing-on-enemy, NO vampire in frame, NO fallen body, NO wounded character, NO blood-spatter, NO fighting. Weapons are HOLSTERED, sheathed, drawn-but-loose, partially-drawn — never IN COMBAT USE. The scene is the BEFORE / DURING-THE-STALK / AFTER, never the strike itself.

━━━ ABSOLUTE BANS — NO STATIC / NO POSED / NO MEDITATING (CRITICAL) ━━━
ABSOLUTELY NO seated poses. NO cross-legged sitting. NO kneeling-still. NO meditation. NO eyes-closed. NO leaning-back-thoughtfully. NO standing-still-modeling. NO hands-on-hips runway. NO "gazing wistfully into distance".

She is ALWAYS IN MOTION — STRIDING / VAULTING / CLIMBING / STALKING / CROUCHED-MID-MOTION / MID-TURN / MID-DRAW / MID-LEAP. Body weight shifted, a limb in flight, captured at a loaded instant of HUNTING. Camera caught her mid-step, mid-vault, mid-draw. AGILE PREDATOR — never standing-still-posing.

If the action below somehow reads as static, OVERRIDE with a dynamic interpretation: "examining a track" → "crouched mid-motion examining a track, body coiled to spring up".

━━━ HER ARCHETYPE / IDENTITY ━━━
${archetype}

━━━ HER OUTFIT (silhouette is the hero — render full-body) ━━━
${outfit}

━━━ HER PHYSICAL DNA (visible at wide-shot — SILHOUETTE + outfit dominate, but her face still reads as HOT) ━━━
- Skin: ${skin}
- Eyes: ${eyes}
- Hair color: ${hairColor}
- Hairstyle: ${hairstyle}

━━━ HER SIGNATURE WEAPON / ACCESSORY (visible at wide-shot — read as armed and dangerous) ━━━
${accessory}

━━━ THE GOTHIC STAGE (the GROUND / BIOME / IMMEDIATE SURROUND — costar) ━━━
${stage}

Render this stage with FULL DEPTH. Foreground: tactile detail near her feet (cobblestones / fog / gravestones / fallen leaves / spilled-blood-of-someone-else). Midground: the character striding through the stage. Background: stage receding into atmospheric haze.

━━━ THE EPIC BACKDROP (the SCALE-DEFINING ELEMENT — sky / horizon dominates) ━━━
${epicBackdrop}

This backdrop DWARFS her. It fills the upper portion of the frame OR dominates the horizon. Render with awe-inspiring scale. She is small relative to it. Atmospheric haze separates her from the backdrop's massive scale.

━━━ HER BODY ACTION ━━━
${action}

Place her body doing this action INSIDE the gothic stage with the epic backdrop above. The stage wins for setting; the action is just her body-pose.

━━━ ATMOSPHERIC DEPTH (CRITICAL) ━━━
Render LAYERED ATMOSPHERIC DEPTH:
- Foreground particles (fog, mist, ash, embers, drifting snow) caught in light
- Midground haze separating her from the epic backdrop
- Background atmospheric thinning toward the horizon
- Light rays / god-rays / volumetric beams cutting through atmosphere

The frame must FEEL inhabited and ALIVE — never sterile flat-color staging.

${blocks.NO_JACK_SKELLINGTON_BLOCK}

${blocks.NO_CHEAP_GORE_BLOCK}

${blocks.NO_SATANIC_BLOCK}

${blocks.NO_FLOATING_BLOCK}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

${blocks.BLOW_IT_UP_BLOCK}

━━━ MOVIE-POSTER CRANK MANDATE — APPLY TO EVERY RENDER ━━━
This is NOT a still image — this is a MOVIE POSTER establishing-shot. Render her as if this image will sell the film. Apply ALL of:

  1. THEATRICAL RIM-LIGHTING — a single dramatic key-light (moonbeam / lantern / fire / god-ray) cuts through deep velvet darkness, carving her silhouette into something mythic. Rim-light on her shoulder, hair-edge, weapon-edge, cloak-edge. The light has DIRECTION + EMOTION.
  2. EVERY QUADRANT INTENTIONAL — top-left has atmospheric drama (drifting embers / silver moonbeam ray / sweeping fog-tendril / wheeling bats / falling petals). Top-right has another (twin moons / distant cathedral spire / lightning fork / hanging gibbet). Bottom-left has rich foreground (cobblestones / gravestones / fallen leaves / spilled wine / iron-gate). Bottom-right ditto. NEVER empty background or bare dark-void.
  3. OBSESSIVE MATERIAL DETAIL — every leather has visible wear and tarnish. Every metal buckle has scratch + patina. Every fabric has visible weave. Every weapon-edge has heft + nick + blood-history. Every wisp of hair has individual strand visibility. Every cloak-pleat catches light differently.
  4. STORYTELLING BEAT — the scene tells a story mid-action. She just leapt from a parapet (her cloak still mid-billow). She is reading tracks in the fog (her hand still hovers near her blade-hilt). She is pausing mid-vault on a tomb-edge. NEVER "she stands there" — always mid-loaded-hunt-moment.
  5. ATMOSPHERIC HAZE WITH VOLUMETRIC LIGHT — fog / mist / drifting embers caught in god-rays. The AIR has depth and weight.
  6. SATURATED GOTHIC PALETTE WITH DEEP-SHADOW CONTRAST — rich oxblood / deep-violet / sapphire / amber / emerald jewel-tones as accents. Deep-velvet black + pale moonlit silver as the canvas. ONE dominant accent color per render.
  7. PAINTED-CANVAS RICHNESS — painterly oil-on-canvas with visible brush-stroke texture in the deeper shadows. NOT photo-real, NOT smooth-digital. Ayami Kojima Castlevania painted concept-art / Bernie Wrightson dark-fantasy / Frank Frazetta heroic-painting darkened.
  8. HOT + DEADLY SILHOUETTE — her silhouette is the hero. The gothic-tactical outfit reads as ornate-deadly-predator from the silhouette alone. Sleek + agile + threatening posture frozen mid-action.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ STRUCTURE (write the prompt in this order for best results) ━━━
[the scene as a whole — gothic wild wide shot], [the epic backdrop dominating], [the gothic stage surrounding], [the assassin in her ornate outfit at full-body scale, visibly armed], [her body action / pose], [atmospheric depth and lighting], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. She is HOT and DEADLY. Outfit is ORNATE-TACTICAL not fashion. Composition is WIDE — character is dwarfed by the gothic stage + epic backdrop. Scenery is the COSTAR.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
