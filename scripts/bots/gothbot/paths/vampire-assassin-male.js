/**
 * GothBot vampire-assassin-male path — gothic-wild assassin scene.
 *
 * Mirror of vampire-assassin-female R5 final, male-coded.
 * 90% character focus, badass male vampire-hunter / Castlevania-hero
 * energy. Belmont + Alucard + Dante + Van-Helsing + Witcher-Geralt
 * silhouette lineage. Kick-ass, mysterious, deadly.
 *
 * Iteration applied from vampire-assassin-female 2026-05-15 sweep:
 *   - Gender lock (he/him/man explicit)
 *   - 90% character focus (60-75% frame)
 *   - Movie-poster crank
 *   - NO static / NO crouching-still
 *   - Weapon-lock + pose-lock
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

  return `You are a gothic concept-art painter writing a CANDID BADASS VAMPIRE-HUNTER scene for GothBot. The character is a STRONG-JAWED, ornate, agile, deadly male vampire-hunter — Castlevania-Belmont / Alucard / Devil-May-Cry-Dante / Van-Helsing / Witcher-Geralt energy. Kick-ass, mysterious, deadly. Output wraps with style prefix + suffix.

━━━ GENDER LOCK — HE/HIM/MAN — STRONG MASCULINE MAN, NEVER FEMBOY / ANDROGYNOUS / PRETTY-BOY — ABSOLUTE ━━━
The character is gender-locked MALE (he/him/man) — and SPECIFICALLY a STRONG MASCULINE MAN, NOT an androgynous-anime-pretty-boy, NOT a femboy, NOT a smooth-faced slim-build idol-singer-type, NOT a willowy bishonen. He is an ADULT MAN with:
• HARD MASCULINE FEATURES — strong square jawline, sharp masculine cheekbones, defined brow ridge, masculine nose
• HEAVY ADULT MASCULINE BUILD — broad shoulders, thick chest, muscular arms visible through the coat, masculine hands with weight to them
• WEATHERED ADULT FACE — light beard or heavy stubble, sleepless predator-eyes, crow's-feet, scars
• MAN-CODED PROPORTIONS — wide shoulders much wider than waist, masculine chest, muscular thighs/calves
• ZERO FEMININE FEATURES — NEVER soft-cheeked, NEVER pouty lip, NEVER long-eyelash-glamour, NEVER smooth-shaved baby-face, NEVER waist-pinched fashion-doll silhouette
🚫 NEVER androgynous anime pretty-boy. NEVER femboy. NEVER bishonen. NEVER K-pop-idol-styled. NEVER smooth-androgynous-cute. Target: Geralt-of-Rivia / Aragorn / John-Wick / Mads-Mikkelsen / Hugh-Jackman-Van-Helsing / older-Belmont / Mandalorian. ADULT WEATHERED MASCULINE HARD MEN.

If the archetype/outfit/hairstyle description below could be read as feminine, androgynous, or pretty-boy, OVERRIDE — render a hard masculine vampire-hunter man with strong jawline, sharp cheekbones, masculine build, weathered features, and adult-man proportions.

━━━ THREATENING + BATTLE-HARDENED MANDATE — APPLY TO EVERY RENDER ━━━
He is a VETERAN KILLER. NOT pretty, NOT fashion-runway, NOT anime-cute, NOT boy-band. THREATENING. DANGEROUS. CAPABLE. The viewer should see him and think "this man has killed many things and would kill me without blinking."

Apply ALL of:
• COLD PREDATOR GAZE — eyes hard-set, narrowed, unblinking. Stern jaw clenched. NO smile, NO charming look, NO open-mouthed pretty-boy. The gaze CUTS. Death sits behind it.
• BATTLE-WORN FACE — weathered features. Sleepless dark-circles. Sharp masculine cheekbones cutting deep shadow. Stubble or short beard. AT LEAST ONE visible scar across face / brow / lip / cheek. Crow's-feet from decades of hunting.
• HEAVY INTIMIDATING PRESENCE — broad shoulders. Visible muscle-build through the coat. Tall stance, looming. NOT slim-anime-boy, NOT willowy, NOT pretty-feminine. Solid masculine BUILD. Looming silhouette.
• BATTLE-HARDENED WEAPON-WEAR — weapons are NICKED, scratched, blood-history-stained, leather wraps worn smooth from use. Coat-hem is dirt-streaked. Boots are scuffed. Gauntlets are dented. He's been in REAL FIGHTS — this is field-worn gear, not parade-armor.
• MENACE POSTURE — body language is COILED THREAT. He stalks, prowls, looms. NEVER fashion-runway, NEVER hands-on-hips, NEVER prince-charming-pose. Witcher-Geralt / John-Wick / Belmont / Aragorn-after-Helms-Deep menace.
• EMOTIONAL DNA — bone-cold, weary, lethal, mythic. The viewer feels DREAD looking at him.

🚫 NO pretty-boy / NO anime-cute / NO smooth-baby-face / NO fashion-shoot / NO charm. THREAT only.

✓ Witcher-Geralt-of-Rivia / John-Wick / Castlevania-Belmont / Symphony-of-the-Night Alucard (the grim version, not the pretty version) / Van-Helsing-Hugh-Jackman / Aragorn / Mads-Mikkelsen-villain / Mandalorian visual lineage.

━━━ THE WEAPON IS A CO-HERO — RENDER IT BIG, PROMINENT, READABLE ━━━
Before describing him, the WEAPON ITSELF is a focal point of this image. The exact weapon described in the WEAPON slot below MUST be:
• OCCUPYING 15-25% of the frame — visually prominent, not a tiny detail
• CLEARLY READABLE at a glance — the viewer instantly identifies it (CROSSBOW / BULLWHIP / DUAL PISTOLS / SCYTHE / TWIN DAGGERS / SPIKED FLAIL / etc.)
• POSITIONED PROMINENTLY in his hand or across his back or coiled at his belt — never tucked away, never just-implied
• OBSESSIVELY DETAILED — every silver-inlay, every engraving, every leather-wrap, every cross-pommel, every chain-link, every gear-tooth rendered with rich material specificity
• THE FIRST IMPRESSION — when the viewer's eye lands on him, they see the WEAPON before they read his face
• DEFINING the silhouette — the weapon's shape is part of his outline (crossbow held forward, whip coiled out into space, twin pistols extending the arm-line, scythe-haft crossing the body diagonally)

⚠️ THE WEAPON CANNOT BE OVERRIDDEN BY DEFAULT-SWORD. If the WEAPON slot says crossbow, the render shows a CROSSBOW prominently — NEVER substituted with a sword. Flux's vampire-hunter-default-sword bias is OVERRIDDEN by this mandate.

━━━ 90% CHARACTER FOCUS — HE IS THE WHOLE SHOW — ABSOLUTE FIRST RULE ━━━
This image is 90% ABOUT THE BADASS MALE VAMPIRE-HUNTER. The gothic castle / courtyard / forest / graveyard SETTING is just where he's standing — a background atmosphere, never the subject. The viewer sees HIM and is meant to feast on HIS ornate badass-tactical outfit, his deadly silhouette, his predator confidence.

• He fills 60-75% of the frame — face, body, outfit ALL clearly readable
• Mid-close to full-body framing — never tiny-in-scenery, never centered-portrait closeup
• The CASTLE / COURTYARD / FOREST setting is just BEHIND him — a hint of gothic mood, atmospheric depth at the edges, never a competing focal point
• His ornate badass outfit is the visual hero — every clasp, every brocade, every weapon, every flowing coat-edge readable
• His face / pose / posture communicates his energy (BADASS + ornate + agile + deadly + Castlevania-hero confident)
• 90% of the viewer's attention lands on HIM — 10% on the gothic mood around him

The setting EXISTS to make him look cool — it's the stage he stands on, never the subject. Castle towers in the distance = atmospheric mood. Courtyard cobblestones = ground at his feet. The viewer should be looking at HIS OUTFIT and HIS ENERGY, not the architecture.

━━━ COMPOSITION (NON-NEGOTIABLE) ━━━
MID-CLOSE TO FULL-BODY CHARACTER SHOT — he occupies 60-75% of the vertical frame. Never wide-cinematic-with-tiny-figure. Never closeup-only-face. Show his FULL OUTFIT and BODY LANGUAGE at a scale where every detail of his badass vampire-hunter costume is readable.

Camera angle options: three-quarter front / side-profile / dynamic-low-angle looking up at him (HEROIC angle) / mid-action angle. NEVER head-on-symmetrical-modeling. NEVER posing. ALWAYS mid-action — striding toward camera, mid-turn, mid-draw, leaping past, vaulting, prowling.

The gothic setting is BACKGROUND ATMOSPHERE only — softly-blurred castle silhouette behind him, atmospheric haze, scattered foreground props (gravestones / lanterns / fog / cobblestones at his feet) — but he dominates the frame.

━━━ CORE IDENTITY — BADASS VAMPIRE-HUNTER (lean VERY HARD into this) ━━━
He is a BADASS VAMPIRE-HUNTER. Every choice — outfit, posture, gear, expression — reads as ornate-deadly-predator-hero. He is STRONG-JAWED and DANGEROUS. Sleek, agile, mysterious, deadly, kick-ass. Castlevania-Belmont + Alucard + DMC-Dante + Van-Helsing + Witcher-Geralt energy. NOT a generic gothic man in fashion. NOT a nobleman at court. NOT a priest. A WORKING VAMPIRE-HUNTER, hunting a target.

Mysterious sleepless predator look mandatory — dark-circles or kohl-rim, strong masculine cheekbones, weathered scar-traces, predator-still gaze that cuts.

━━━ THE GOTHIC WILD — OUT IN THE FIELD ━━━
This is a vampire-hunting scene OUT IN THE WILD. NEVER inside a cathedral nave, NEVER in a sanctum, NEVER in a bar. Always OUT on a gothic stage — village square, graveyard, crossroads, plague street, gothic forest, vampire-estate gates, cursed crossroads.

━━━ ABSOLUTE BANS — NO COMBAT / NO VIOLENCE / NO BLOOD ━━━
NO mid-strike, NO weapon-firing-on-enemy, NO vampire in frame, NO fallen body, NO wounded character, NO blood-spatter, NO fighting. Weapons are HOLSTERED, sheathed, drawn-but-loose, partially-drawn — never IN COMBAT USE. The scene is the BEFORE / DURING-THE-STALK / AFTER, never the strike itself.

━━━ ABSOLUTE BANS — NO STATIC / NO POSED / NO MEDITATING / NO CROUCHING-STILL (CRITICAL) ━━━
ABSOLUTELY NO seated poses. NO cross-legged sitting. NO kneeling-still. NO crouched-still / crouching-as-rest-pose. NO meditation. NO eyes-closed. NO leaning-back-thoughtfully. NO standing-still-modeling. NO hands-on-hips runway. NO "gazing wistfully into distance".

He is ALWAYS IN MOTION — STRIDING / VAULTING / CLIMBING / STALKING / MID-SPRING / MID-TURN / MID-DRAW / MID-LEAP. Body weight shifted, a limb in flight, captured at a loaded instant of HUNTING. Camera caught him mid-step, mid-vault, mid-draw. AGILE PREDATOR — never standing-still-posing, never crouched-resting.

Crouched poses ALWAYS read as "body coiled to spring up" — never as resting/sitting/meditating.

If the action below somehow reads as static, OVERRIDE with a dynamic interpretation: "examining a track" → "crouched mid-motion examining a track, body coiled to spring up".

━━━ HIS ARCHETYPE / IDENTITY ━━━
${archetype}

━━━ HIS OUTFIT (silhouette is the hero — render full-body) ━━━
${outfit}

━━━ HIS PHYSICAL DNA (visible at wide-shot — SILHOUETTE + outfit dominate, but his face still reads as BADASS) ━━━
- Skin: ${skin}
- Eyes: ${eyes}
- Hair color: ${hairColor}
- Hairstyle: ${hairstyle}

━━━ HIS SIGNATURE WEAPON — RENDER THIS EXACT WEAPON, NOT A DEFAULT SWORD ━━━
${accessory}

⚠️ HARD WEAPON RULE: Render the EXACT weapon described above. If the description says crossbow, render a CROSSBOW (not a sword). If it says pistol or flintlock, render a PISTOL or FLINTLOCK. If it says whip or chain or scythe or twin daggers — render THAT. NEVER substitute a generic sword. The weapon should be visible and prominent in his hand or holster, with material detail readable. Weapon variety is mandatory — this path is NOT a vampire-with-sword path; he carries a wide range of gothic-tactical weapons.

⚠️ PERIOD-ACCURATE WEAPON CONSTRUCTION — STRICTLY HISTORICAL GOTHIC:
The era is 1500s–1800s gothic-fantasy. All weapons must look PERIOD-CORRECT — Van Helsing / Castlevania / Bloodborne / Vampire-Hunter-D / 19th-century-occult-hunter lineage.

CROSSBOWS: hand-carved wooden stock (oak, ebony, ornately engraved) with silver-inlay or gothic-rune-etching. Steel prod or composite-horn bow-limb at the front (NOT modern compound pulleys / NOT plastic / NOT carbon-fiber). Iron stirrup at the muzzle. Windlass or crank-mechanism for cocking. NO scope, NO laser-sight, NO red-dot, NO synthetic grip, NO modern compound-limb cams. The crossbow should look like a museum piece from 1750 — Van Helsing field-hunter crossbow.

PISTOLS / GUNS: flintlock, wheellock, or matchlock construction. Engraved walnut grip with silver or brass inlay. Long barrel with hammer-and-flint mechanism, ornate trigger-guard. NO modern semi-automatic, NO revolver-cylinder cartridge (1830s+), NO suppressor, NO tactical-rail, NO red-dot. Holy-rune-etched. Looks like an 18th-century duelling pistol or musketoon.

SWORDS / DAGGERS / SCYTHES / WHIPS / AXES: hand-forged steel with cross-pommel, basket-hilt, or rune-etched blade. Leather-wrapped grip with silver-tipped pommel. Holy iconography (cross, sanctified-iron, holy-water-blessed). NO modern alloys / NO synthetic handles / NO neon.

ALL WEAPONS: ornate gothic-craftsmanship — engraved, inlaid, sanctified, weathered. The viewer should think "this weapon was forged 200 years ago and has killed many vampires."

⚠️ ICONIC WHIP RENDER — IF THE WEAPON IS A WHIP, IT MUST BE CRACKING:
The leather bullwhip / chain-whip / Castlevania-Belmont Vampire-Killer-whip is the CLASSIC iconic vampire-hunter signature. When the weapon-pool entry references a whip, chain-whip, leather lash, Vampire-Killer, or any whip-coded weapon — render him MID-CRACK. The whip's long lash extends in a dramatic S-curve through the air, the tip snapping with motion-blur, sparks or dust kicking up from the strike-point on stone/ground/headstone, his arm cocked back from the throw. The whip is the visual hero of the frame. Belmont-coded body-language. NEVER a static whip-coiled-at-belt — always MID-CRACK with the lash captured mid-motion. If both whip AND another weapon are mentioned, the WHIP takes priority and is the one being USED.

━━━ THE GOTHIC STAGE (the GROUND / IMMEDIATE SURROUND — supports him) ━━━
${stage}

Render this stage with foreground tactile detail near his feet (cobblestones / fog / gravestones / fallen leaves / spilled-blood-of-someone-else). The stage supports the character, never replaces him.

━━━ THE BACKDROP (ATMOSPHERIC MOOD ONLY — softly behind him) ━━━
${epicBackdrop}

The backdrop is JUST ATMOSPHERIC MOOD behind his shoulder. NOT a focal point. NOT bigger than him in the frame. Softly-blurred / atmospheric-haze / partially-obscured-by-him. Castle silhouettes are tiny / distant / blurry behind him at the upper edge. Cliffs / cathedrals / horizons are mood-setters, never the subject. 10% of the visual weight — he keeps 90%.

If the backdrop description is castle-coded or epic-coded, render it as DISTANT-BLURRY-SILHOUETTE behind him, NEVER as the visual hero.

━━━ HIS BODY ACTION — RENDER THIS EXACT POSE, NOT GENERIC STRIDING ━━━
${action}

⚠️ HARD POSE RULE: Render the EXACT body pose described above. If the action says mid-leap, render him MID-AIR with body extended. If it says mid-vault, render him MID-VAULT over the obstacle. If it says crouched mid-spring, render him COILED + ABOUT TO LAUNCH (not crouched-resting). If it says swinging from a chain, render him IN THE SWING. NEVER default to "standing-still-holding-weapon" or "walking-toward-camera" if the action pool says otherwise. POSE VARIETY IS MANDATORY — this path is NOT a vampire-walking-down-street path; he does dynamic acrobatic gothic-hunter moves.

⚠️ WHIP-CRACK ACTION OVERRIDE: If the action above mentions a whip, lash, crack, snap, or any whip-coded motion, the WEAPON IN HIS HAND IS A WHIP (overrides whatever the accessory slot says). Render him MID-CRACK with the whip's long leather/chain lash extending through the air in a dramatic S-curve, motion-blur tip, sparks/dust from strike-point. Belmont vampire-killer-whip signature.

━━━ ATMOSPHERIC DEPTH (CRITICAL) ━━━
Render LAYERED ATMOSPHERIC DEPTH:
- Foreground particles (fog, mist, ash, embers, drifting snow) caught in light
- Midground haze around him
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

━━━ MOVIE-POSTER CRANK MANDATE — APPLY TO EVERY RENDER ━━━
This is NOT a still image — this is a MOVIE POSTER establishing-shot. Render him as if this image will sell the film. Apply ALL of:

  1. THEATRICAL RIM-LIGHTING — a single dramatic key-light (moonbeam / lantern / fire / god-ray) cuts through deep velvet darkness, carving his silhouette into something mythic. Rim-light on his shoulder, hair-edge, weapon-edge, coat-edge. The light has DIRECTION + EMOTION.
  2. EVERY QUADRANT INTENTIONAL — top-left has atmospheric drama (drifting embers / silver moonbeam ray / sweeping fog-tendril / wheeling bats / falling petals). Top-right has another (twin moons / distant cathedral spire / lightning fork / hanging gibbet). Bottom-left has rich foreground (cobblestones / gravestones / fallen leaves / spilled wine / iron-gate). Bottom-right ditto. NEVER empty background or bare dark-void.
  3. OBSESSIVE MATERIAL DETAIL — every leather has visible wear and tarnish. Every metal buckle has scratch + patina. Every fabric has visible weave. Every weapon-edge has heft + nick + blood-history. Every wisp of hair has individual strand visibility. Every coat-pleat catches light differently.
  4. STORYTELLING BEAT — the scene tells a story mid-action. He just leapt from a parapet (his coat still mid-billow). He is reading tracks in the fog (his hand still hovers near his weapon). He is pausing mid-vault on a tomb-edge. NEVER "he stands there" — always mid-loaded-hunt-moment.
  5. ATMOSPHERIC HAZE WITH VOLUMETRIC LIGHT — fog / mist / drifting embers caught in god-rays. The AIR has depth and weight.
  6. SATURATED GOTHIC PALETTE WITH DEEP-SHADOW CONTRAST — rich oxblood / deep-violet / sapphire / amber / emerald jewel-tones as accents. Deep-velvet black + pale moonlit silver as the canvas. ONE dominant accent color per render.
  7. PAINTED-CANVAS RICHNESS — painterly oil-on-canvas with visible brush-stroke texture in the deeper shadows. NOT photo-real, NOT smooth-digital. Ayami Kojima Castlevania painted concept-art / Bernie Wrightson dark-fantasy / Frank Frazetta heroic-painting darkened.
  8. BADASS + DEADLY SILHOUETTE — his silhouette is the hero. The gothic-tactical outfit reads as ornate-deadly-predator-hero from the silhouette alone. Strong-jawed + agile + threatening posture frozen mid-action.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ STRUCTURE (write the prompt in this order for best results) ━━━
[OPEN with the WEAPON — named explicitly, described prominently — the EXACT weapon from the WEAPON slot, occupying 15-25% of the frame, defining his silhouette, obsessively detailed], [the male vampire-hunter wielding this weapon in mid-action, filling 60-75% of frame], [his body language + pose around the weapon], [his face + hair + masculine features readable], [the gothic setting as softly-blurred background atmosphere behind him], [foreground props at his feet adding mood], [theatrical rim-light carving his silhouette], [saturated gothic palette + painted-canvas richness]

DRAMATIC VISUALS: render the EXACT slot-pool details above. He is BADASS, DEADLY, and the WHOLE SHOW. His outfit is ORNATE-BADASS-TACTICAL with rich material detail. Composition is MID-CLOSE-TO-FULL-BODY with HIM as 60-75% of frame. The gothic setting is JUST ATMOSPHERIC MOOD behind him — NEVER the subject.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
