/**
 * GothBot vampire-assassin-female path — gothic-wild assassin scene.
 *
 * Cloned structure from StarBot female-explorer (two-tier scenery —
 * stage biome + epic backdrop, character 25-40% of frame, NEVER posing,
 * ALWAYS in motion). Race pool dropped; gothic vampire-assassin DNA
 * substituted throughout. HOT, ornate, agile, crafty, mean, resourceful.
 *
 * Castlevania-Belmont + Devil-May-Cry-Lady + Van-Helsing aesthetic —
 * SILHOUETTES borrowed, never named-IP characters.
 *
 * POOLS: VAMPIRE_ASSASSIN_FEMALE, ASSASSIN_OUTFITS_FEMALE, ASSASSIN_SKIN,
 *        ASSASSIN_EYES, ASSASSIN_HAIR_COLOR, ASSASSIN_HAIRSTYLES_FEMALE,
 *        ASSASSIN_ACCESSORIES_FEMALE, ASSASSIN_STAGE, ASSASSIN_EPIC_BACKDROP,
 *        ASSASSIN_ADVENTURE_ACTIONS, LIGHTING, ATMOSPHERES
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  const archetype = picker.pickWithRecency(pools.VAMPIRE_ASSASSIN_FEMALE, 'vaf_archetype');
  const outfit = picker.pickWithRecency(pools.ASSASSIN_OUTFITS_FEMALE, 'vaf_outfit');
  const skin = picker.pickWithRecency(pools.ASSASSIN_SKIN, 'vaf_skin');
  const eyes = picker.pickWithRecency(pools.ASSASSIN_EYES, 'vaf_eyes');
  const hairColor = picker.pickWithRecency(pools.ASSASSIN_HAIR_COLOR, 'vaf_hair_color');
  const hairstyle = picker.pickWithRecency(pools.ASSASSIN_HAIRSTYLES_FEMALE, 'vaf_hairstyle');
  const accessory = picker.pickWithRecency(pools.ASSASSIN_ACCESSORIES_FEMALE, 'vaf_accessory');
  const stage = picker.pickWithRecency(pools.ASSASSIN_STAGE, 'vaf_stage');
  const epicBackdrop = picker.pickWithRecency(pools.ASSASSIN_EPIC_BACKDROP, 'vaf_epic_backdrop');
  const action = picker.pickWithRecency(pools.ASSASSIN_ADVENTURE_ACTIONS, 'vaf_action');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  return `You are a gothic concept-art painter writing a CANDID VAMPIRE-ASSASSIN scene for GothBot. The character is a HOT, ornate, agile, crafty, mean, resourceful female vampire-assassin OUT IN THE WILD on a gothic hunt. Castlevania-Belmont + Devil-May-Cry-Lady + Van-Helsing energy. Output wraps with style prefix + suffix.

━━━ GENDER LOCK — SHE/HER/WOMAN THROUGHOUT — ABSOLUTE ━━━
The character is gender-locked FEMALE (she/her/woman) in every clause. NEVER man, NEVER male, NEVER masculine-coded jaw/build/face. She is an ADULT WOMAN — never child, never teen. The vampire-assassin is HER, never him. If the archetype/outfit/hairstyle description below could be read as masculine, OVERRIDE — render an attractive feminine vampire-huntress woman with feminine features, curves, body language.

━━━ 90% CHARACTER FOCUS — SHE IS THE WHOLE SHOW — ABSOLUTE FIRST RULE ━━━
This image is 90% ABOUT THE COOL VAMPIRE-HUNTRESS WOMAN. The gothic castle / courtyard / forest / graveyard SETTING is just where she's standing — a background atmosphere, never the subject. The viewer sees HER and is meant to feast on HER ornate stylized fun outfit, her hot deadly silhouette, her predator confidence.

• She fills 60-75% of the frame — face, body, outfit ALL clearly readable
• Mid-close to full-body framing — never tiny-in-scenery, never centered-portrait closeup
• The CASTLE / COURTYARD / FOREST setting is just BEHIND her — a hint of gothic mood, atmospheric depth at the edges, never a competing focal point
• Her ornate-stylized-fun outfit is the visual hero — every clasp, every brocade, every weapon, every flowing cloak-edge readable
• Her face / pose / posture communicates her energy (HOT + ornate + agile + deadly + cool-as-hell)
• 90% of the viewer's attention lands on HER — 10% on the gothic mood around her

The setting EXISTS to make her look cool — it's the stage she stands on, never the subject. Castle towers in the distance = atmospheric mood. Courtyard cobblestones = ground at her feet. The viewer should be looking at HER OUTFIT and HER ENERGY, not the architecture.

━━━ COMPOSITION (NON-NEGOTIABLE) ━━━
MID-CLOSE TO FULL-BODY CHARACTER SHOT — she occupies 60-75% of the vertical frame. Never wide-cinematic-with-tiny-figure. Never closeup-only-face. Show her FULL OUTFIT and BODY LANGUAGE at a scale where every detail of her stylized vampire-huntress costume is readable.

Camera angle options: three-quarter front / side-profile / dynamic-low-angle looking up at her / mid-action angle. NEVER head-on-symmetrical-modeling. NEVER posing. ALWAYS mid-action — striding toward camera, mid-turn, mid-draw, leaping past, vaulting, prowling.

The gothic setting is BACKGROUND ATMOSPHERE only — softly-blurred castle silhouette behind her, atmospheric haze, scattered foreground props (gravestones / lanterns / fog / cobblestones at her feet) — but she dominates the frame.

━━━ CORE IDENTITY (lean VERY HARD into this) ━━━
She is a VAMPIRE ASSASSIN. Every choice — outfit, posture, gear, expression — reads as ornate-deadly-predator. She is BEAUTIFUL and DANGEROUS. Sleek, agile, mean, crafty, resourceful. Castlevania-Belmont + DMC-Lady + Van-Helsing energy. NOT a generic gothic woman in fashion. NOT a noblewoman at court. NOT a witch. A WORKING ASSASSIN, hunting a target.

━━━ THE GOTHIC WILD — OUT IN THE FIELD ━━━
This is a vampire-hunting scene OUT IN THE WILD. NEVER inside a cathedral nave, NEVER in a sanctum, NEVER in a bar. Always OUT on a gothic stage — village square, graveyard, crossroads, plague street, gothic forest, vampire-estate gates, cursed crossroads.

━━━ ABSOLUTE BANS — NO COMBAT / NO VIOLENCE / NO BLOOD ━━━
NO mid-strike, NO weapon-firing-on-enemy, NO vampire in frame, NO fallen body, NO wounded character, NO blood-spatter, NO fighting. Weapons are HOLSTERED, sheathed, drawn-but-loose, partially-drawn — never IN COMBAT USE. The scene is the BEFORE / DURING-THE-STALK / AFTER, never the strike itself.

━━━ ABSOLUTE BANS — NO STATIC / NO POSED / NO MEDITATING / NO CROUCHING-STILL (CRITICAL) ━━━
ABSOLUTELY NO seated poses. NO cross-legged sitting. NO kneeling-still. NO crouched-still / crouching-as-rest-pose. NO meditation. NO eyes-closed. NO leaning-back-thoughtfully. NO standing-still-modeling. NO hands-on-hips runway. NO "gazing wistfully into distance".

She is ALWAYS IN MOTION — STRIDING / VAULTING / CLIMBING / STALKING / MID-SPRING / MID-TURN / MID-DRAW / MID-LEAP. Body weight shifted, a limb in flight, captured at a loaded instant of HUNTING. Camera caught her mid-step, mid-vault, mid-draw. AGILE PREDATOR — never standing-still-posing, never crouched-resting.

Crouched poses ALWAYS read as "body coiled to spring up" — never as resting/sitting/meditating.

If the action below somehow reads as static, OVERRIDE with a dynamic interpretation: "examining a track" → "crouched mid-motion examining a track, body coiled to spring up".

━━━ NSFW-CLEAN MANDATE ━━━
Modest gothic-tactical bodice / corset / coat — NEVER lingerie, NEVER bare-cleavage emphasis, NEVER tit-window, NEVER bare-midriff. The outfit reads as DEADLY-PRACTICAL fighting gear with ornate gothic detail — not a fashion-runway look. Sexy comes from the silhouette + the confidence, NEVER from skin reveal.

━━━ HER ARCHETYPE / IDENTITY ━━━
${archetype}

━━━ HER OUTFIT (silhouette is the hero — render full-body) ━━━
${outfit}

━━━ HER PHYSICAL DNA (visible at wide-shot — SILHOUETTE + outfit dominate, but her face still reads as HOT) ━━━
- Skin: ${skin}
- Eyes: ${eyes}
- Hair color: ${hairColor}
- Hairstyle: ${hairstyle}

━━━ HER SIGNATURE WEAPON — RENDER THIS EXACT WEAPON, NOT A DEFAULT SWORD ━━━
${accessory}

⚠️ HARD WEAPON RULE: Render the EXACT weapon described above. If the description says crossbow, render a CROSSBOW (not a sword). If it says pistol or flintlock, render a PISTOL or FLINTLOCK. If it says whip or chain or scythe or twin daggers — render THAT. NEVER substitute a generic sword. The weapon should be visible and prominent in her hand or holster, with material detail readable. Weapon variety is mandatory — this path is NOT a vampire-with-sword path; she carries a wide range of gothic-tactical weapons.

━━━ THE GOTHIC STAGE (the GROUND / BIOME / IMMEDIATE SURROUND — costar) ━━━
${stage}

Render this stage with FULL DEPTH. Foreground: tactile detail near her feet (cobblestones / fog / gravestones / fallen leaves / spilled-blood-of-someone-else). Midground: the character striding through the stage. Background: stage receding into atmospheric haze.

━━━ THE BACKDROP (ATMOSPHERIC MOOD ONLY — softly behind her) ━━━
${epicBackdrop}

The backdrop is JUST ATMOSPHERIC MOOD behind her shoulder. NOT a focal point. NOT bigger than her in the frame. Softly-blurred / atmospheric-haze / partially-obscured-by-her. Castle silhouettes are tiny / distant / blurry behind her at the upper edge. Cliffs / cathedrals / horizons are mood-setters, never the subject. 10% of the visual weight — she keeps 90%.

If the backdrop description is castle-coded or epic-coded, render it as DISTANT-BLURRY-SILHOUETTE behind her, NEVER as the visual hero.

━━━ HER BODY ACTION — RENDER THIS EXACT POSE, NOT GENERIC STRIDING ━━━
${action}

⚠️ HARD POSE RULE: Render the EXACT body pose described above. If the action says mid-leap, render her MID-AIR with body extended. If it says mid-vault, render her MID-VAULT over the obstacle. If it says crouched mid-spring, render her COILED + ABOUT TO LAUNCH (not crouched-resting). If it says swinging from a chain, render her IN THE SWING. NEVER default to "standing-still-holding-weapon" or "walking-toward-camera" if the action pool says otherwise. POSE VARIETY IS MANDATORY — this path is NOT a vampire-walking-down-street path; she does dynamic acrobatic gothic-hunter moves.

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
[the female vampire-huntress filling 60-75% of frame in her ornate stylized fun outfit, mid-action], [her body language / pose / weapon clearly visible], [her face + hair + makeup readable], [the gothic setting as softly-blurred background atmosphere behind her], [foreground props at her feet adding mood], [theatrical rim-light carving her silhouette], [saturated gothic palette + painted-canvas richness]

DRAMATIC VISUALS: render the EXACT slot-pool details above. She is HOT, DEADLY, and the WHOLE SHOW. Her outfit is ORNATE-STYLIZED-FUN with rich material detail. Composition is MID-CLOSE-TO-FULL-BODY with HER as 60-75% of frame. The gothic setting is JUST ATMOSPHERIC MOOD behind her — NEVER the subject.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
