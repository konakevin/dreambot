/**
 * GothBot vampire-assassin-combat path — VAMPIRE-VS-VAMPIRE DUEL.
 * Assassin mid-duel with a humanoid vampire-foe (vampire-lord / vampiress /
 * blood-prince / ancient-elder / nosferatu / strigoi / vampire-noble / etc.).
 * 50/50 gender roll on the assassin. Pivoted 2026-05-16 from creature-foe
 * to humanoid-vampire-foe — R1-R3 showed Flux can't reliably render
 * human-vs-monster combat; humanoid-vs-humanoid is much better Flux territory.
 *
 * Guards (same as solo paths):
 *   - Gender lock on assassin (whichever rolls)
 *   - NO femboy / NO androgynous (male)
 *   - Threatening + battle-hardened
 *   - Weapon-as-co-hero + period-accurate weapons
 *   - Movie-poster crank
 *   - NO STATIC / NO POSING
 *   - FIGHT-FIRST composition (assassin + vampire-foe BOTH in frame, physically engaged)
 *
 * POOLS: VAMPIRE_ASSASSIN_FEMALE/MALE, ASSASSIN_OUTFITS_FEMALE/MALE,
 *        ASSASSIN_HAIRSTYLES_FEMALE/MALE, ASSASSIN_ACCESSORIES_FEMALE/MALE,
 *        ASSASSIN_SKIN, ASSASSIN_EYES, ASSASSIN_HAIR_COLOR,
 *        ASSASSIN_STAGE, ASSASSIN_EPIC_BACKDROP,
 *        VAMPIRE_FOE (humanoid vampire-villain),
 *        VAMPIRE_DUEL_MOMENT (humanoid-vs-humanoid duel beat),
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
  const foe = picker.pickWithRecency(pools.VAMPIRE_FOE, 'vac_foe');
  const moment = picker.pickWithRecency(pools.VAMPIRE_DUEL_MOMENT, 'vac_moment');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');
  const atmosphere = picker.pickWithRecency(pools.ATMOSPHERES, 'atmosphere');

  const genderLock = isFemale
    ? `━━━ GENDER LOCK — SHE/HER/WOMAN, ATTRACTIVE FEMININE VAMPIRE-ASSASSIN ━━━
The assassin is gender-locked FEMALE (she/her/woman) — HOT, sleek, ornate, dangerous. Adult woman with feminine features, curves, body language. The vampiress-assassin. NEVER masculine, NEVER child, NEVER teen. Sleek vampire-huntress in gothic-tactical gear. NSFW-clean — sleek-deadly-tactical, NEVER lingerie / bare-cleavage emphasis / nipple-window.`
    : `━━━ GENDER LOCK — HE/HIM/MAN, STRONG MASCULINE HARD-MAN, NEVER FEMBOY / ANDROGYNOUS / PRETTY-BOY ━━━
The assassin is gender-locked MALE (he/him/man) — SPECIFICALLY a STRONG MASCULINE MAN, NOT an androgynous-anime-pretty-boy, NOT a femboy, NOT a smooth-faced slim-build idol-singer-type, NOT a willowy bishonen. He is an ADULT MAN with hard masculine features (strong square jawline, sharp masculine cheekbones, defined brow ridge, masculine nose), heavy adult masculine build (broad shoulders, thick chest, muscular arms, masculine hands), weathered adult face (light beard or heavy stubble, sleepless predator-eyes, scars), and zero feminine features (NEVER soft-cheeked, NEVER pouty lip, NEVER long-eyelash-glamour, NEVER smooth-shaved baby-face). Target: Geralt-of-Rivia / Aragorn / John-Wick / Mads-Mikkelsen / Hugh-Jackman-Van-Helsing / older-Belmont / Mandalorian. ADULT WEATHERED MASCULINE HARD MEN.`;

  return `You are a gothic concept-art painter writing a CINEMATIC VAMPIRE-VS-VAMPIRE DUEL for GothBot — a vampire-assassin in the FROZEN INSTANT of a duel with a HUMANOID VAMPIRE-FOE. Castlevania-boss-vampire / Hellsing Alucard-vs-vampire-lord / Underworld vampire-duel / Van-Helsing-vs-Dracula / Interview-with-the-Vampire elder-duel energy. Painted-canvas movie-poster finish.

⚠️⚠️⚠️ HARD MANDATORY — TWO HUMANOID VAMPIRE-COMBATANTS, FIGHT-FIRST ⚠️⚠️⚠️
This is a TWO-CHARACTER VAMPIRE DUEL image. Two HUMANOID vampire-figures locked in a frozen instant of fight engagement. Genre: boss-vampire splash-page / vampire-duel cinema-still. Both combatants are upright human-shaped figures with vampire features (fangs, glowing eyes, pale-skin). THIS IS NOT NEGOTIABLE.

EXACT FRAME-SHARE TARGETS (write the description so Flux renders this composition):
• ASSASSIN — 35-45% of the frame, body fully visible, mid-strike pose, prominent
• VAMPIRE FOE — 30-40% of the frame, body fully visible, mid-counter-action, prominent (HUMANOID, two-legged, upright — NOT a beast)
• WEAPON physically CONNECTING the two — 5-10% of the frame, mid-flight or mid-clash
• GOTHIC STAGE + EPIC BACKDROP — only 20-35% of the frame, atmospheric support ONLY, NEVER the visual hero

THE WEAPON IS PHYSICALLY CONTACTING (OR ABOUT TO CONTACT) THE VAMPIRE FOE. Be SPECIFIC about the connection: blade-tip meets vampire's parrying-blade / crossbow-bolt embedded in vampire's shoulder or mid-flight inches from chest / whip-coil wrapping vampire's throat or wrist / pistol-muzzle flashing point-blank at vampire's face / dagger embedded in vampire's shoulder, his hand gripping the wrist / stake mid-thrust toward vampire's heart, his hand catching the wrist mid-flight. THE FIGHT IS HAPPENING — not "near each other," not "facing off," but PHYSICALLY ENGAGED weapon-on-vampire.

THE FOE IS A HUMANOID VAMPIRE. Specifically: ${foe.split(/[.,]/)[0].trim().toLowerCase()}. They are mid-counter-attack — drawing their own sword, parrying with bare clawed hands, raising a flintlock, casting blood-magic from a raised palm, lunging with fangs bared, gripping the assassin's wrist, throwing a punch, leaping at the assassin with cape flaring. Both bodies are in motion AT EACH OTHER.

ABSOLUTE FAILURE CONDITIONS — if ANY are true, the render failed:
• Only one figure in the frame — FAIL
• Foe is a beast / werewolf / gargoyle / demon / non-humanoid creature — FAIL (must be a HUMANOID VAMPIRE)
• Both figures present but standing apart with no fight engagement — FAIL
• Tiny silhouette figures dwarfed by epic gothic-castle backdrop — FAIL (this is NOT vampire-from-a-distance)
• Solo hero-pose splash — FAIL
• Weapon nowhere near the foe — FAIL
• Atmospheric gothic-vista with figures incidental — FAIL

This is BOSS-VAMPIRE-DUEL FRAME-FILLING combat. Castlevania final-boss-vampire key-art / Hellsing vampire-vs-vampire two-page-spread / Underworld vampire-duel scene / Bloodborne hunter-vs-vampire-lord cover. The two vampires are the WHOLE image, the gothic world is just the stage.

${genderLock}

━━━ THE VAMPIRE-FOE — RENDER THIS HUMANOID VAMPIRE IN MID-COUNTER-ATTACK ━━━
${foe}

The vampire-foe is fully visible, body mid-motion AT THE ASSASSIN — humanoid-shaped, upright, in vampire-finery (velvet coat / obsidian gown / royal cape / armored chest / lace cravat). Render with full vampire-noble detail (sharp fangs / glowing crimson-or-amber-or-violet eyes / alabaster skin / aristocratic features / supernatural beauty) — operatic vampire-aristocrat, never schlocky B-movie, never a beast.

━━━ THE DUEL MOMENT — exactly how the weapon hits/connects ━━━
${moment}

This is the FROZEN INSTANT of physical contact between two humanoid combatants. Be VISUALLY SPECIFIC about the weapon-to-vampire connection: where the blade meets the parrying-blade, where the bolt enters the body, where the whip wraps the throat, where the bullet flashes inches from the face, where the stake meets the chest, where the hand grabs the wrist. The viewer should see EXACTLY where the assassin's weapon is touching (or about to touch) the vampire-foe's body.

━━━ THE WEAPON IS A CO-HERO — RENDER IT BIG, PROMINENT, READABLE, PERIOD-ACCURATE ━━━
Before describing the assassin, the WEAPON ITSELF is a focal point of this image. The exact weapon described in the WEAPON slot below MUST be:
• OCCUPYING 15-25% of the frame — visually prominent, not a tiny detail
• CLEARLY READABLE at a glance — the viewer instantly identifies it (CROSSBOW / BULLWHIP / DUAL PISTOLS / SCYTHE / TWIN DAGGERS / SPIKED FLAIL / etc.)
• POSITIONED PROMINENTLY in active use — mid-strike, mid-firing, mid-crack
• OBSESSIVELY DETAILED — every silver-inlay, every engraving, every leather-wrap, every cross-pommel, every chain-link rendered with rich material specificity
• PERIOD-ACCURATE 1500s-1800s GOTHIC: crossbows have wooden stock + steel prod + iron stirrup + windlass (NO modern compound limbs / NO scopes / NO carbon-fiber); pistols are flintlock / wheellock / matchlock with engraved walnut grip (NO modern semi-auto / NO suppressor / NO red-dot). Hand-forged steel with cross-pommel / basket-hilt / rune-etched. The viewer should think "this weapon was forged 200 years ago and has killed many vampires."

⚠️ THE WEAPON CANNOT BE OVERRIDDEN BY DEFAULT-SWORD. If the WEAPON slot says crossbow, render a CROSSBOW. NEVER substitute.

━━━ COMPOSITION (NON-NEGOTIABLE) ━━━
WIDE-TO-MEDIUM CINEMATIC FRAME. The assassin and the foe BOTH appear in the frame, their action connecting them. Together they occupy ~50-65% of the frame; the gothic stage + epic backdrop fill the rest. Camera angle: dramatic three-quarter / low-angle / over-the-shoulder of either combatant. NEVER head-on at the camera. NEVER both posing.

Strong silhouettes against the gothic backdrop. The assassin and foe are LOCKED IN A FROZEN INSTANT of action.

━━━ THREATENING + BATTLE-HARDENED MANDATE ━━━
The assassin is a VETERAN KILLER. THREATENING. DANGEROUS. CAPABLE. Cold predator gaze, battle-worn face (weathered, scars, stubble-or-light-beard for males), heavy intimidating presence, battle-hardened weapon-wear (nicked, scratched, blood-history-stained). NOT pretty, NOT fashion-runway. Witcher / John-Wick / Belmont / Aragorn lineage.

━━━ CORE IDENTITY (lean VERY HARD into this) ━━━
The assassin is HOT, ornate, agile, mean, crafty — a vampire-killer. The vampire-foe is BEAUTIFUL-BUT-DEADLY — aristocratic vampire-aristocrat, operatic gothic horror, supernatural beauty fused with menace. Neither is generic. Castlevania-boss-vampire aesthetic — both characters are stylized, dramatic, fully designed humanoids.

━━━ THE COMBAT — FROZEN INSTANT (this path LIFTS the no-combat rule) ━━━
This IS combat. The frame captures a SINGLE BEAT of action between TWO HUMANOID VAMPIRE-COMBATANTS — blade meeting parrying-blade, crossbow-bolt mid-flight at vampire-foe, stake mid-thrust toward vampire's heart, leap-strike toward vampire-aristocrat, parry mid-arc. Both bodies in motion. Weapons in active use. The assassin is the active aggressor — never a victim, never being bitten.

ABSOLUTELY BANNED EVEN IN COMBAT:
- NO blood-spatter, NO blood-mist, NO open-wound visible
- NO dismemberment, NO entrails, NO gore
- NO already-dead-foe (both characters mid-action and alive)
- NO mid-bite where the vampire-foe is biting the assassin
- NO assassin-as-victim — ${pronoun} is always on offense or agile-counter
- NO beasts / werewolves / gargoyles / demons / non-humanoid creatures as foe — the foe is a HUMANOID VAMPIRE only
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

━━━ ${possessive.toUpperCase()} SIGNATURE WEAPON — RENDER THIS EXACT WEAPON IN ACTIVE USE ━━━
${accessory}

⚠️ HARD WEAPON RULE: Render the EXACT weapon described above. If it says crossbow, render a CROSSBOW. If pistol/flintlock, render a PISTOL. If whip — render a WHIP MID-CRACK. NEVER substitute a default sword. The weapon is IN ACTIVE DUEL USE against the vampire-foe — mid-strike, mid-firing, mid-thrust, mid-crack — physically connecting to (or aimed at) the humanoid vampire-foe's body.

━━━ THE GOTHIC STAGE ━━━
${stage}

The combat happens INSIDE this stage. Foreground tactile detail near the combatants' feet (cobblestones / fog / gravestones / spilled-something). Midground the two combatants locked in motion. Background the stage receding into atmospheric haze.

━━━ THE EPIC BACKDROP (DISTANT, BLURRED, MINIMAL) ━━━
${epicBackdrop}

⚠️ This backdrop is FAR DISTANT, atmospheric-blurred, occupying NO MORE THAN 20% of the frame at the upper-edge or upper-corner. It is NOT the visual hero — the COMBAT is. If the backdrop dominates the frame and the combatants become tiny silhouettes, YOU HAVE FAILED. Backdrop is a tiny atmospheric whisper, not the subject. Think "boss-fight stage with hint of castle far behind" — NOT "epic gothic vista with tiny figures."

━━━ ATMOSPHERIC DEPTH (CRITICAL) ━━━
Render LAYERED ATMOSPHERIC DEPTH:
- Foreground particles caught in motion (fog, mist, ash, embers, drifting snow, sparks from blade-clash)
- Midground haze separating the combatants from the epic backdrop
- Background atmospheric thinning toward the horizon
- Light rays / god-rays / volumetric beams cutting through atmosphere
- DRAMATIC chiaroscuro — single dramatic light source picking out both combatants

━━━ NO STATIC ━━━
NEITHER character is standing still. Both are MID-MOTION at the instant captured — body weights shifted, limbs in flight, hair / cape / coat-tail / cloak / lace / gown caught in mid-action. The image is a FROZEN beat of cinematic action.

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
This is NOT a still image — this is a MOVIE POSTER establishing-shot. Render as if this image will sell the film. Apply ALL of:

  1. THEATRICAL RIM-LIGHTING — single dramatic key-light cuts through deep velvet darkness, carving both combatants into mythic silhouettes. Rim-light on shoulders, weapon-edge, fur, hair.
  2. EVERY QUADRANT INTENTIONAL — top-left atmospheric drama (drifting embers / lightning fork / fog-tendril). Top-right another (twin moons / cathedral spire / wheeling bats). Bottom-left rich foreground (gravestones / cobblestones / spilled-something). Bottom-right ditto. NEVER empty background.
  3. OBSESSIVE MATERIAL DETAIL — every leather, every metal, every fabric, every weapon-edge, every wisp of hair / fur / feather rendered with rich material specificity.
  4. STORYTELLING BEAT — frozen instant tells the story. The viewer should understand "this is what's happening RIGHT NOW" — bolt mid-flight, blade mid-arc, parry mid-clash, leap mid-air.
  5. ATMOSPHERIC HAZE WITH VOLUMETRIC LIGHT — fog / mist / embers / sparks caught in god-rays. AIR has depth.
  6. SATURATED GOTHIC PALETTE WITH DEEP-SHADOW CONTRAST — rich oxblood / deep-violet / sapphire / amber / emerald jewel-tones. Deep-velvet black + pale moonlit silver. ONE dominant accent color per render.
  7. PAINTED-CANVAS RICHNESS — painterly oil-on-canvas. Ayami Kojima Castlevania painted concept-art / Bernie Wrightson dark-fantasy / Frank Frazetta heroic-painting darkened.
  8. CINEMATIC BOSS-FIGHT FEEL — like the freeze-frame of a Castlevania boss-fight or Bloodborne hunter-vs-beast climax.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ STRUCTURE (write the prompt in this order — fight-first, world-last) ━━━
[OPEN with the DUEL ENGAGEMENT — name the exact weapon-to-vampire contact (blade-tip clashing with vampire's parrying-blade / bolt mid-flight inches from vampire's chest / whip wrapping vampire's neck / pistol-muzzle flashing at vampire's face / stake mid-thrust toward vampire's heart)], [the HUMANOID VAMPIRE-FOE mid-counter-attack — specific vampire-archetype with full aristocratic-vampire detail (fangs, glowing eyes, velvet coat or obsidian gown, ornate finery)], [the assassin (gender-locked ${gender}) mid-strike, body in motion against the vampire-foe], [the period-accurate weapon described in full material detail], [gothic stage at the combatants' feet — minimal, the floor/ground only], [tiny distant backdrop and atmospheric depth — last and smallest]

DRAMATIC VISUALS: This is a TWO-VAMPIRE BOSS-DUEL SPLASH. Assassin (35-45% of frame) and HUMANOID vampire-foe (30-40% of frame) are co-equal upright combatants PHYSICALLY ENGAGED. The weapon CONNECTS them — be specific about where it touches the vampire-foe's body. Backdrop is a tiny whisper, NOT a vista. Castlevania boss-vampire-duel key-art energy, not "epic gothic landscape with figures."

⚠️ TRIPLE FAILURE CONDITIONS — if ANY are true, you wrote the wrong prompt:
• No humanoid vampire-foe physically in frame → FAIL
• Foe is a beast / werewolf / gargoyle / demon / non-humanoid creature → FAIL (HUMANOID VAMPIRE ONLY)
• Foe and assassin not physically engaged (just standing near each other) → FAIL
• Tiny figures dwarfed by massive gothic-castle backdrop → FAIL (that's vampire-from-a-distance, NOT this path)

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
};
