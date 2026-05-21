/**
 * gothbot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

module.exports = {
  GOTHBOT_GOTH_MALE_CLOSEUP: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      face_detail,
      wardrobe,
      accessory,
      candid_moment,
      camera_perspective,
    } = slots;

    return `You are a gothic dark-manga concept-art painter writing MYSTERIOUS, OMINOUS, DEADLY dark-aristocrat male closeups for GothBot. Vampire lords, dark princes, shadow assassins, dark warlocks, death gods, dark hunters — predatory aristocrats of the gothic night. Castlevania / Bloodborne / Crimson-Peak / Witcher / Devil-May-Cry dark-male-aristocrat lineage. Camera catches him candidly close-up in a loaded moment.

━━━ ONE MAN ALONE — ABSOLUTE FIRST RULE ━━━
ONE man. SOLO. No companions, no enemies, no second figure, no hands belonging to anyone but him. He is ALONE and DEADLY. He is a man (he/his), adult, never child. NEVER feminine — gender-locked male throughout. Strong jawline, masculine bone structure, broad shoulders, masculine hands.

━━━ TIGHT CLOSEUP FRAMING — FACE FILLS UPPER HALF ━━━
Tight frame — face + throat + one shoulder at most. Face fills the upper half of the frame. Camera is TOO CLOSE for comfort. He is NOT posing — he was caught in the middle of the candid moment described below.

━━━ CAMERA PERSPECTIVE (use this EXACT angle) ━━━
${camera_perspective}

━━━ HE MUST LOOK LIKE HE EXISTS — OBSESSIVE DETAIL ━━━
Render him with obsessive detail. He must feel REAL and LETHAL:
• FACE: every pore visible, sharp masculine cheekbones cutting shadow, sleepless dark-circles, scar-traces — power and centuries in his gaze
• SKIN: render the EXACT skin description from his pool — how candlelight catches the high planes of his face, how shadow pools in his hollows
• EYES: the HERO of the frame — glowing, supernatural, predatory. They radiate light onto the skin around them. The iris is a universe. The gaze cuts.
• FACE DETAIL: weathered + masculine + deadly. Stubble, scars, sleepless dark-circles, kohl-rim if any, faint dirt-streaks. NEVER makeup-clean. NEVER feminine.
• HAIR: short-cropped / pulled-back / wild-undone / wind-blown — masculine, never salon-perfect
• BODY LANGUAGE: predatory stillness. He is the calm before the kill. He watches without blinking. Power held in restraint.

━━━ HIS CORE IDENTITY (informs his ENERGY — MYSTERIOUS / OMINOUS / DEADLY) ━━━
${archetype}

━━━ HIS SKIN ━━━
${skin}

━━━ HIS EYES ━━━
${eyes}

━━━ HIS FACE DETAIL ━━━
${face_detail}

━━━ HIS HAIR ━━━
${hair_color}, ${hairstyle}

━━━ WARDROBE (visible at frame edge — neckline / shoulder / collar) ━━━
${wardrobe}

━━━ HIS SIGNATURE ACCESSORY (close-frame detail — collarbone / neckline / hand) ━━━
${accessory}

━━━ CANDID MOMENT (he was caught doing THIS) ━━━
${candid_moment}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ VAMPIRE-LORD / MAN-OF-THE-NIGHT MANDATE — APPLY TO EVERY RENDER ━━━
Every render leans VAMPIRE-LORD / DARK-PRINCE / DEADLY-ARISTOCRAT — mysterious-corrupted aristocrat of the gothic night. Even if his archetype reads as warlock or assassin, the AESTHETIC is vampire-lord:
• DEEP SHADOWED UNDER-EYES MANDATORY — sleepless predator-look, dark-circles or kohl-rim pulled into half-circles beneath the eyes — the look of a being who has not slept in centuries. NEVER clean / well-rested face.
• VAMPIRE PALLOR or VAMPIRE-WARM — skin reads CORRUPTED, paler than human-natural or warmly-unnatural. A faint dark-violet undertone beneath his eyes. The skin of someone who has not seen morning in a long time.
• MASCULINE STRONG-JAWED FEATURES — strong jawline, sharp cheekbones, hollow-cheeked, masculine bone structure. NEVER soft / feminine / androgynous-feminine.
• DEADLY BODY LANGUAGE — weighing a dagger, sipping wine slowly, gazing out a velvet-curtained window, hand at his own throat, fingertip lit by spell-flame, tilting his head with predator patience. Languid not energetic. He has all the time in the world.
• CANDLE / FIREPLACE / OIL-LAMP warm-amber light mixing with cool moonlight on his face — atmospheric, intimate.
• OPULENT VAMPIRE-LORD wardrobe — velvet, silk, leather, brocade, gothic-armor, high-collared coats — NEVER modern, NEVER plain.

━━━ DRAMATIC VISUALS — CRANK IT ━━━
Go MAXIMUM. Eyes BLAZE predator-still. Lighting carves his face into something MYTHIC. Every element cranked to jaw-dropping visual impact. Painterly oil-on-canvas. Castlevania-Symphony-of-the-Night vampire-lord-portrait energy.

━━━ HARD BANS ━━━
🚫 NO multiple figures / NO second person / NO additional hands — he is ALONE
🚫 NO feminine features / NO androgynous-feminine / NO traditional makeup (kohl-rim and sleepless-dark-circles OK)
🚫 NO devil horns / NO pentagrams / NO satanic symbols
🚫 NO anime-smooth / NO Halloween costume / NO cosplay
🚫 NO magazine editorial / NO fashion photography / NO glamour-shot energy
🚫 NO nipples / NO bare-chest emphasis — NSFW-clean (clothed neckline only)
🚫 NO posing / "editorial" / "fashion shoot" / "glamour shot" language
🚫 NO modern / cyberpunk / sci-fi
🚫 NO real-world ethnic codes (gothic-fantasy archetypes only)
🚫 NO child / teen / pubescent figures
🚫 NO cheap gore / NO blood-on-his-mouth as default (only if rolled in candid_moment)

━━━ STRUCTURE (write in this order) ━━━
[camera perspective], [his face — skin + eyes + face_detail], [his hair color + hairstyle], [the candid moment — what he's doing], [wardrobe visible at frame edge], [accessory close-frame detail], [lighting carving his features], [atmosphere at edges], [color palette]

Output ONLY the 60-80 word scene description, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bold labels, NO "render as" suffix. Just the phrases, starting immediately with the scene content.`;
  },

  GOTHBOT_VAMPIRE_GIRLS_2: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      atmosphere,
      archetype,
      ethnicity,
      hair,
      wardrobe,
      menace_feature,
      composition,
      scene,
      hero_element,
      lighting,
    } = slots;

    const ethnicityClause = ethnicity ? `${ethnicity} ` : '';
    const unifiedVampire = `A confident ${ethnicityClause}vampire woman with ${hair}, ${menace_feature}. She wears ${wardrobe}. Her eyes are visibly GLOWING with luminous unnatural inner light radiating outward — this glow is the most important visual element and must be unmistakably rendered, not a subtle tint.`;

    return `You are writing ONE Flux prompt for a horrifyingly beautiful vampire portrait. Output ONLY the prompt — comma-separated phrases, 65-90 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt, BEFORE anything else about her face or wardrobe or setting. They are CENTER STAGE.

1. GLOWING eyes — her eyes glow with inhuman color, light radiating outward from the iris. Words "glowing" + "radiating" (or "casting light") MUST appear.
2. DARK DRASTIC eye shadow AND liner — heavy, blown out, dramatic gothic vampire makeup CAKED ON THE EYES. Words "heavy" + "dark" + "smoky-eye" + "sharp dark eyeliner" (or equivalent: "blown-out black eyeshadow" + "thick kohl eyeliner") MUST appear.

Open your prompt with the eye + makeup description in this format (or equivalent):
"[color] glowing eyes radiating inhuman light, heavy blown-out black smoky-eye with sharp dark kohl eyeliner, ..."

THEN describe the rest (skin, lips, hair, wardrobe, setting). The eyes-and-makeup are the OPENER and the focal point.

ALSO BANNED: NO elf ears. NO pointed ears. NO fantasy-creature ear shapes. She is human-shaped.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


━━━ 1. THE SCENE (gothic backdrop behind her) ━━━
${scene}
Composition: ${composition}.
Lighting: ${lighting}.

━━━ 2. THE VAMPIRE (one unified description — render her exactly this way) ━━━
${unifiedVampire}

She is a DEAD-PALE corpse-vampire with HEAVY DARK GOTH MAKEUP — beautiful bone structure preserved BENEATH the deadness, but the skin reads as undead-corpse-pale (NOT alive-pretty), the makeup is HEAVY caked-on gothic (NOT subtle), the eyes are GLOWING with inhuman color, and a DEMONIC tell (visible fang, clawed fingertip, slit pupil) marks her as not-human. She is human-shaped — NO elf ears, NO pointed ears, NO fantasy-creature features beyond the vampire markers. She is BEAUTIFUL but DEAD — almost a demon. Expression both seductive and terrifying — ancient and inhuman presence. Her face is the focal point — bust framing 40-50% of frame.

━━━ 3. THE HERO ELEMENT (the unforgettable focal piece on her) ━━━
${hero_element}. Render this clearly and prominently.

━━━ 4. HER ARCHETYPE (informs her ENERGY) ━━━
${archetype}

━━━ 5. MOVIE-POSTER CRANK MANDATE — APPLY TO EVERY RENDER ━━━
This is NOT a portrait — this is a MOVIE POSTER. Render her as if this image will sell the film. Apply ALL of:

  1. THEATRICAL RIM-LIGHTING — a single dramatic key-light (candle / fireplace / oil-lamp / single moonbeam) cuts through deep velvet darkness, carving her face into something mythic. Rim-light on her cheekbones, jaw, hair-edge. The light has DIRECTION + EMOTION. NEVER flat illumination.
  2. EVERY QUADRANT INTENTIONAL — top-left has atmospheric drama (drifting candle-smoke / silver moonbeam ray / shower of dark petals / sweeping cobweb / floating embers). Top-right has another (twin moon / arched window / stained-glass shard / hanging chandelier corner). Bottom-left has rich foreground (candelabra / chalice / black-rose cluster / velvet drape / wreath). Bottom-right ditto. NEVER empty background or bare dark-void.
  3. OBSESSIVE MATERIAL DETAIL — every velvet has visible nap and weave. Every gold-thread has texture catching light. Every jewel has visible refraction. Every clasp has tarnish + wear. Every wisp of hair has individual strand visibility. Every dark-lipstick has matte-vs-gloss differentiation. The viewer should want to STUDY every square inch.
  4. STORYTELLING BEAT — the scene tells a story. She just fed (single dark crimson droplet at corner of mouth). She just lit a candle (the flame is still leaning where her finger sparked it). She just removed a veil (the lace falls draped across her shoulder). She just turned (the velvet curtain still falls back into place behind her). NEVER static "she stands there" — always mid-loaded-moment.
  5. ATMOSPHERIC HAZE — volumetric light rays catch dust-motes / candle-smoke / breath-mist / drifting embers / falling petals. The AIR has depth and weight. NEVER thin-flat air.
  6. SATURATED JEWEL-TONE PALETTE WITH DEEP-SHADOW CONTRAST — rich oxblood / deep-violet / sapphire / amber / emerald / amethyst as accent jewel-tones. Deep-velvet black + corpse-pale as the canvas. ONE dominant accent color per render. NEVER muted / desaturated / monochrome.
  7. PAINTED-CANVAS RICHNESS — painterly oil-on-canvas with visible brush-stroke texture in the deeper shadows. NOT photo-real, NOT smooth-digital, NOT anime-clean. Ayami Kojima Castlevania painted concept-art / Karol Bak gothic-painting / John William Waterhouse darkened.
  8. HORROR-AS-BEAUTY DEMONIC RENDER — the fang / clawed fingertip / slit-pupil is rendered THEATRICALLY DRAMATIC, lit by the rim-light, central focal accent. The demonic tell is OBVIOUSLY VISIBLE, not subtle.

━━━ 6. PALETTE & MOOD ━━━
${sharedDNA.scenePalette}. ${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 120)}

The painting feels DARK, OMINOUS, GOTHIC. Heavy shadow dominates. Single dramatic candlelit key-light cuts through deep velvet darkness. Atmosphere heavy with dread.

━━━ 7. ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 8. HARD BANS ━━━
NO second figures, NO animals, NO blood splatter, NO bodies, NO clown-stripe painted color streaks beneath the eye, NO ritual face-paint stripes, NO photoreal/cinematic/film-still aesthetic, NO modern fashion photography, NO bare black-void background — the gothic setting MUST be visible behind her, NO bright cheerful colors, NO elf ears / pointed ears, NO child / teen, NO multiple figures.

━━━ OUTPUT ━━━
Write 65-90 words, comma-separated phrases. The unified vampire description in section 2 is the primary face description — preserve the HEAVY MAKEUP, GLOWING EYE, DEAD-PALE skin, and DEMONIC tell language unmistakably. The gothic setting fills the rest of the frame as the dramatic painted backdrop. NO preamble, NO headers.`;
  },

  GOTHBOT_GOTH_CLOSEUP: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      archetype,
      skin,
      eyes,
      hair_color,
      hairstyle,
      makeup,
      wardrobe,
      accessory,
      candid_moment,
      camera_perspective,
    } = slots;

    return `You are a gothic dark-manga concept-art painter writing HAUNTINGLY BEAUTIFUL gothic woman closeups for GothBot. SEXY, SULTRY, EVIL, FEISTY dark seductresses with corrupted beauty and dangerous power. Camera catches her candidly close-up in a loaded moment. Castlevania / Crimson-Peak / Bloodborne / Devil-May-Cry dark-beauty lineage.

━━━ ONE WOMAN ALONE — ABSOLUTE FIRST RULE ━━━
ONE woman. SOLO. No companions, no lovers, no second figure, no hands belonging to anyone but her. She is ALONE and DANGEROUS. She is a woman (she/her), adult, never child.

━━━ TIGHT CLOSEUP FRAMING — FACE FILLS UPPER HALF ━━━
Tight frame — face + throat + one shoulder at most. Face fills the upper half of the frame. Camera is TOO CLOSE for comfort. She is NOT posing — she was caught in the middle of the candid moment described below.

━━━ CAMERA PERSPECTIVE (use this EXACT angle) ━━━
${camera_perspective}

━━━ SHE MUST LOOK LIKE SHE EXISTS — OBSESSIVE DETAIL ━━━
Render her with obsessive detail. She must feel REAL and DEVASTATING:
• FACE: every pore visible, cheekbones catching light like carved marble, dark circles that look intentional — power and centuries in her gaze
• SKIN: render the EXACT skin description from her pool — how light hits it, how shadow pools in her collarbones, how it catches candlelight or moonlight
• EYES: the HERO of the frame — glowing, supernatural, impossibly vivid. They radiate light onto the skin around them. The iris is a universe
• MAKEUP: BOLD and DRAMATIC — dark glamour she CHOSE. Sharp where it's sharp, smudged where it's smudged. Devastating intentional dark beauty
• HAIR: wild, wind-caught, rain-damp, tangled with pins or chains or dead flowers — never salon-perfect, always gorgeous in its chaos
• BODY LANGUAGE: predatory confidence. She knows she's watched and doesn't care. Or she does care, and that's worse

━━━ HER CORE IDENTITY (informs her ENERGY) ━━━
${archetype}

━━━ HER SKIN ━━━
${skin}

━━━ HER EYES ━━━
${eyes}

━━━ HER MAKEUP ━━━
${makeup}

━━━ HER HAIR ━━━
${hair_color}, ${hairstyle}

━━━ WARDROBE (visible at frame edge — neckline / shoulder / collar) ━━━
${wardrobe}

━━━ HER SIGNATURE ACCESSORY (close-frame detail — collarbone / neckline / hand) ━━━
${accessory}

━━━ CANDID MOMENT (she was caught doing THIS) ━━━
${candid_moment}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ VAMPIRESS / WOMAN-OF-THE-NIGHT MANDATE — APPLY TO EVERY RENDER ━━━
Every render leans VAMPIRESS / DARK-SEDUCTRESS / WOMAN-OF-THE-NIGHT — corrupted-beauty aristocrat of the gothic night. Even if her archetype reads as witch or sorceress, the AESTHETIC is vampiress:
• DEEP SMOKEY EYE SHADOW MANDATORY — heavy smudgy dark-charcoal / dark-plum / dark-burgundy / kohl-and-coal pulled down from the lid into half-circles beneath the eyes — a "sleepless aristocrat" look. NEVER clean / minimal eye makeup. Eye shadow EXTENDS dramatically below and beside the eye, smudged not graphic.
• VAMPIRE PALLOR or VAMPIRE FLUSH — skin reads CORRUPTED, paler than human-natural or warmly-unnatural. A faint dark-violet undertone beneath her eyes. The skin of someone who has not seen morning in a long time.
• DARK STAINED LIPS — every render has dark-burgundy / oxblood / deep-plum / matte-black / wine-stained lips. NEVER nude / pink / natural-tone lips.
• WOMAN-OF-THE-NIGHT BODY LANGUAGE — gazing out a velvet-curtained window, sipping from a crystal goblet, kissing a pendant, hands at her own throat, dragging her fingers through her hair, half-lidded knowing eyes. Languid not energetic. She has all the time in the world.
• CANDLE / FIREPLACE / OIL-LAMP warm-amber light mixing with cool moonlight on her face — atmospheric, intimate.
• OPULENT VAMPIRE-GOTH wardrobe — velvet, silk, black-lace, brocade — NEVER modern, NEVER plain.

━━━ DRAMATIC VISUALS — CRANK IT ━━━
Go MAXIMUM. Eyes BLAZE. Makeup is DEVASTATING smokey-deep eye shadow. Lighting carves her face into something MYTHIC. Every element cranked to jaw-dropping visual impact. Painterly oil-on-canvas. Castlevania-Symphony-of-the-Night vampire-portrait energy.

━━━ HARD BANS ━━━
🚫 NO multiple figures / NO second person / NO additional hands — she is ALONE
🚫 NO devil horns / NO pentagrams / NO satanic symbols
🚫 NO anime-smooth / NO Halloween costume / NO cosplay
🚫 NO magazine editorial / NO fashion photography / NO glamour-shot energy
🚫 NO nipples / NO bare-cleavage emphasis / NO lingerie — NSFW-clean
🚫 NO posing / "editorial" / "fashion shoot" / "glamour shot" language
🚫 NO modern / cyberpunk / sci-fi
🚫 NO real-world ethnic codes (gothic-fantasy archetypes only)
🚫 NO child / teen / pubescent figures
🚫 NO cheap gore / NO blood-on-her-mouth as default (only if rolled in candid_moment)

━━━ STRUCTURE (write in this order) ━━━
[camera perspective], [her face — skin + eyes + makeup], [her hair color + hairstyle], [the candid moment — what she's doing], [wardrobe visible at frame edge], [accessory close-frame detail], [lighting carving her features], [atmosphere at edges], [color palette]

Output ONLY the 60-80 word scene description, comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bold labels, NO "render as" suffix. Just the phrases, starting immediately with the scene content.`;
  },

  GOTHBOT_COZY_GOTH: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      interior_space,
      magical_glow_item,
      occult_artifact,
      figure_accent,
      ambient_atmosphere,
    } = slots;

    const magicList = Array.isArray(magical_glow_item) ? magical_glow_item : [magical_glow_item];
    const occultList = Array.isArray(occult_artifact) ? occult_artifact : [occult_artifact];

    return `You are a gothic-interior painter writing LAYERED WITCH'S-LAIR / WIZARD'S-WORKROOM scenes for GothBot. Warm-dark gothic interiors with a TWIST OF MAGIC — densely packed with GLOWING potions, RUNED artifacts, MYSTICAL crystal orbs, grimoires with luminous text, and occult curios — inhabited by a SMALL mysterious-goth-feminine figure at deep midground as ATMOSPHERIC SCALE-PROVER ONLY. GOTH + MAGIC, never grim-death-cabinet. Painterly oil-on-canvas aesthetic — Practical Magic apothecary, Hocus Pocus witch-house, Studio Ghibli Howl's-Moving-Castle workroom, Pan's Labyrinth magical study, Harry Potter Hogwarts-divination-tower.

━━━ INTERIOR IS THE HERO — ABSOLUTE FIRST RULE ━━━
The room and its layered curio-cabinet contents fill 80%+ of visual weight. The single mysterious-goth-feminine figure is SCALE-PROVER ONLY at 8-15% of frame, positioned at DEEP MIDGROUND or MIDGROUND CORNER (never foreground, never centered, never the subject). The viewer's eye lands on the room first, the magical trinkets second, and only then notices the figure as a small atmospheric witness. SOLO — only ONE figure ever. NO faces in close-up — figure is small, often partially turned away, partly silhouetted by candlelight.

━━━ NO BODIES / ORGANS / CADAVERS — ABSOLUTE BAN ━━━
NO anatomical models, NO skeleton displays, NO cadaver-art, NO organ-in-jar specimens, NO body-part imagery, NO mortuary-coded oddities. The aesthetic is MAGICAL not MORBID. Skulls allowed only as small accent (one skull-on-shelf max, not center-frame). Bones allowed only as occult-ritual tools (rune-carved bone-dice / bone-handle athame), not as anatomy displays.

━━━ THE ROOM IS THE HERO — INTIMATE MID-CLOSE FRAME ━━━
Mid or mid-close intimate frame, looking INTO a corner / alcove / shelf-cluster of the interior. The space FILLS 80%+ of the frame. Camera at eye-level or slightly elevated, looking at a richly-furnished section of the room — never a wide empty hall, always a CORNER PACKED WITH STUFF. The viewer should want to study every square inch.

━━━ DENSELY LAYERED — THIS IS THE SIGNATURE ━━━
EVERY SURFACE IS LAYERED. Books piled on books, glowing potion-jars stacked on shelves, hanging dried herbs in bundles overlapping, candles in melted clusters, magical artifacts crammed into every nook. 5+ depth layers from foreground to back-shelf, with stuff at every layer. Wonder-cabinet density of MAGICAL curios.

━━━ THREE MAGICAL GLOWING ITEMS — render visibly in the frame ━━━
  • MAGIC 1: ${magicList[0] || ''}
  • MAGIC 2: ${magicList[1] || ''}
  • MAGIC 3: ${magicList[2] || ''}

━━━ THREE OCCULT ARTIFACTS — render visibly in the frame ━━━
  • OCCULT 1: ${occultList[0] || ''}
  • OCCULT 2: ${occultList[1] || ''}
  • OCCULT 3: ${occultList[2] || ''}

PLUS layer additional cozy-gothic items throughout to achieve curio-cabinet density:
• ANTIQUE BOOKS piled high, leather-bound spines, gilt titles
• APOTHECARY JARS with hand-written labels, mysterious contents
• MELTED CANDLES in brass candelabras and wrought-iron stands, wax pools
• DRIED HERBS hanging in bundles from rafters
• PRESSED-FLOWER frames and botanical illustrations on walls
• BRASS INSTRUMENTS — astrolabes, sextants, pendulums, magnifying lenses
• VELVET cloth draped over surfaces, gold-tassel trim
• PARCHMENT scrolls partially unfurled
• ANTIQUE MAPS pinned to walls
• CRYSTAL clusters and geodes on shelves, faint glow
• ANTIQUE GLASS BOTTLES with colored contents
• WROUGHT-IRON sconces, lanterns
• COBWEBS at cornices, dust on top shelves

━━━ WARM-DARK COZY PALETTE ━━━
WARM AMBER PRIMARY — candle-amber, hearth-glow, oil-lamp gold. Deep mahogany and burgundy wood-tones. Rich-velvet plum, burgundy, forest-green secondary surfaces. Brass-and-bronze accents. Aged-parchment yellow. Deep-violet and indigo in shadows. ACCENT jewel-tones in stained-glass, crystal, potion-bottles (sapphire / emerald / amethyst / ruby / amber-honey). NEVER cold-blue dominant, NEVER stark-white, NEVER neon. Picture an oil painting of an 1860s alchemist's study at midnight.

━━━ LIGHTING — WARM POOLS, DEEP SHADOWS ━━━
Multiple WARM LIGHT SOURCES create pools of amber illumination — candles, oil lamps, fireplace embers, stained-glass with warm light behind. Light is SOFT and INTIMATE. Deep shadows in corners and under shelves. Volumetric warm-light rays catching dust-motes.

━━━ MOOD — HAUNTINGLY COZY ━━━
WARM + INTIMATE + OBSESSIVELY LAYERED + PEACEFUL + slightly EERIE without scary. A witch-scholar-collector's space inhabited for centuries with a story behind every object.

━━━ STRICT GOTHBOT COZY-GOTH ━━━
🚫 NO multiple figures — SOLO only (one feminine figure max)
🚫 NO foreground figure / NO centered figure / NO portrait framing — figure is SCALE-PROVER at 8-15% frame, deep midground
🚫 NO bodies / organs / cadavers / anatomical-models / skeleton-displays / mortuary oddities — MAGICAL not MORBID
🚫 NO sexualized / cheesecake / lingerie — sleek-gothic-mysterious, not pin-up
🚫 NO sci-fi / modern / cyberpunk / neon
🚫 NO real-world ethnic codes (gothic-romanticized only — no actual folk costumes)
🚫 NO bright daylight — always candle-and-firelight + magical-glow
🚫 NO cold-blue dominant — warm-amber primary
🚫 NO sterile / sparse — DENSELY LAYERED mandatory
🚫 NO outdoor scenes — pure interior
🚫 NO grim death-cabinet — peaceful magical warmth
✓ Practical Magic / Hocus Pocus / Howl's Moving Castle / Pan's Labyrinth / Harry Potter / 19th-c alchemist's study engravings visual lineage

━━━ THE INTERIOR SPACE ━━━
${interior_space}

━━━ THE MYSTERIOUS-GOTH-FEMININE FIGURE — DEEP MIDGROUND SCALE-PROVER ━━━
${figure_accent}

She is SMALL in the frame (8-15% of visual weight), positioned at deep midground or midground corner, partly absorbed into the warm-shadow of the room. SOLO — only one figure. Often partially turned away, partly silhouetted by candlelight. She belongs in the space — she is part of the atmospheric inventory, not its subject.

━━━ AMBIENT ATMOSPHERE ━━━
${ambient_atmosphere}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION — INTIMATE MID-CLOSE, DENSELY LAYERED ━━━
MID or MID-CLOSE intimate frame. Looking INTO a corner/alcove/shelf-cluster — never wide empty hall. 5+ depth layers from foreground tabletop / shelf-edge through midground shelves of stuff / deeper shelves and walls / back wall with hanging items / ambient air with dust-motes and candle-smoke. Curio-cabinet density throughout.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: the interior space described], [three magical glowing items visible at varied depth], [three occult artifacts visible at varied depth], [layered cozy-gothic items filling surrounding surfaces — books, candles, jars, herbs, instruments], [the small mysterious-goth-feminine figure at deep midground as scale-prover], [ambient atmosphere — dust-motes / candle-smoke / etc.], [warm-amber lighting with deep-shadow contrast], [warm-dark palette with jewel-tone accents], [hauntingly cozy mood]

DRAMATIC VISUALS: DENSELY LAYERED. CURIO-CABINET DENSITY. WARM-AMBER. Interior is hero, figure is small scale-prover. Painterly oil-on-canvas.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_CASTLEVANIA_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      structure,
      architectural_detail,
      inner_light,
      accent_creature,
      spice_decoration,
      sky_layer,
    } = slots;
    const details = Array.isArray(architectural_detail)
      ? architectural_detail
      : [architectural_detail];

    const accentSection = accent_creature
      ? `
━━━ CASTLEVANIA ACCENT CREATURE (bat / gargoyle / shadow — atmospheric only) ━━━
${accent_creature}

`
      : '';

    return `You are an Ayami Kojima concept-art painter illustrating KONAMI CASTLEVANIA architecture. STRICT visual lineage: Symphony of the Night / Castlevania Bloodlines / Lament of Innocence / Curse of Darkness / Order of Ecclesia / Lords of Shadow / Aria of Sorrow promotional art. The architecture is the hero. Painted, ornate, art-nouveau gothic. Wallachian / Vlad-Tepes / Bram-Stoker-Dracula coded.

━━━ STRICT KONAMI CASTLEVANIA ONLY — ABSOLUTE FIRST RULE ━━━
This is NOT generic gothic. This is NOT Bloodborne. This is NOT Hammer-horror. This is NOT Crimson-Peak. This is KONAMI'S CASTLEVANIA aesthetic specifically — Dracula's castle, the Inverted Castle, the Clock Tower, Olrox's Quarters, the Royal Chapel, the Marble Gallery, Brauner's Gardens, the Alchemy Laboratory, the Underground Caverns, the Library. Art-nouveau ornate gothic with Konami's specific palette: violet / blood-crimson / amber-candle / gold-leaf / sapphire-stained-glass / wrought-iron-black. Painted by Ayami Kojima.

━━━ STRUCTURE IS THE HERO — 80% VISUAL WEIGHT ━━━
The Castlevania building DOMINATES the frame. NO humans as primary subject (Belmont silhouette OK as scale-prover only). NO interior chamber-shots in this MVP — EXTERIOR or grand-portal/atrium-from-outside only.

━━━ ARCHITECTURAL DETAIL PORN — KONAMI ORNATE ━━━
Every surface is obsessively detailed in Castlevania-art-nouveau style. Render ALL THREE of these specific architectural flourishes VISIBLY:

  • DETAIL 1: ${details[0] || ''}
  • DETAIL 2: ${details[1] || ''}
  • DETAIL 3: ${details[2] || ''}

PLUS layer additional Castlevania-canon ornamentation:
• ART-NOUVEAU GOTHIC tracery with vine-and-skull motifs
• BAT-WING and GARGOYLE finials on every spire
• WROUGHT-IRON gates with bat / wyvern / dragon-head heraldic devices
• STAINED-GLASS rose-windows (sapphire / violet / crimson) lit from within
• MARBLE COLUMNS with carved-relief friezes of saints and demons
• CHANDELIERS of bronze and gold visible through arched windows
• DRACUL HERALDRY — dragon-and-cross emblem of the House of Drăculești
• ORNATE BALUSTRADES with gargoyle-headed posts
• CARVED-MARBLE statuary of fallen-angels and stone-saints
• VELVET BANNERS in crimson and gold hanging from the structure

━━━ MOOD — CASTLEVANIA OPERATIC GRANDEUR — BOLD & LUSH ━━━
HAUNTING + REGAL + ORNATE + WALLACHIAN + GOTHIC-OPERA — but BOLD, LUSH, and FULL-COLOR-SATURATED. The structure is grand, beautiful, forbidding, OPULENT, MAGNIFICENT. Centuries-old royal ancestral seat of Dracula at the HEIGHT of its glory. The kind of building that opens a Castlevania stage with theatrical fanfare and rich painted-canvas color.

━━━ CASTLEVANIA-CANON PALETTE — BOLD, LUSH, FULL-COLOR-SATURATED ━━━
This path is BOLD AND LUSH — Konami's full-saturation Symphony-of-the-Night box-art palette. Embrace the RICHEST possible Castlevania colors:
  • DEEP RICH VIOLET twilight skies, royal-violet curtains of cloud
  • DEEP BLOOD-CRIMSON velvet banners, scarlet rose-windows, ruby-stained-glass
  • LUSH SAPPHIRE-and-COBALT stained-glass at saturated full-color
  • OPULENT GOLD-LEAF on every spire-tip, every chandelier, every cornice
  • EMERALD-and-JADE forest-canopy at the castle base, jade-trim on chandeliers
  • AMBER-and-WARM-CANDLE GOLD glowing from every window
  • OCCASIONAL VIVID-ROSE-PINK or VIOLET-MAGENTA accents in stained-glass
  • PEARL-WHITE and BONE-WHITE marble columns with shimmer
  • Stained-glass GLOWS richly — sapphire / violet / scarlet / amber / emerald / rose-pink
  • The full-moon backdrop is BIG and richly-colored — amber-gold, ivory, or pale-blood-amber
  • This is the OPPOSITE of muted / desaturated / monochrome — every quadrant SATURATED with color
✓ FULL COLOR SATURATION mandate — boldly painted, lushly hued, OPULENT

🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / cyberpunk
🚫 NO real-world ethnic codes
🚫 NO Bloodborne / NO Hammer-horror / NO Crimson-Peak — this is KONAMI'S CASTLEVANIA only
🚫 NO humans as primary subject (single small Belmont/Alucard silhouette OK as scale-prover)
🚫 NO interior chamber-shots — exterior or grand-portal only
🚫 NO pentagram / satanic iconography
🚫 NO cheap gore / NO Jack-Skellington stylization
✓ Symphony-of-the-Night / Bloodlines / Lament-of-Innocence / Curse-of-Darkness / Order-of-Ecclesia / Lords-of-Shadow / Aria-of-Sorrow visual lineage

━━━ THE CASTLEVANIA STRUCTURE (hero, 80%+ visual weight) ━━━
${structure}

━━━ INNER CASTLE LIGHT (Castlevania glow) ━━━
${inner_light}

Light leaks through stained-glass / rose-windows / chandelier-windows / doorways. The castle feels ALIVE.

━━━ NIGHT SKY ━━━
${sky_layer}
${accentSection}━━━ SPICE — small Castlevania flourish (mandatory) ━━━
${spice_decoration}

━━━ LIGHTING (ambient weather, NOT the castle's internal glow) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION — CASTLEVANIA ESTABLISHING SHOT ━━━
The Castlevania structure FILLS THE FRAME at 80% visual weight. Multi-tier depth:
• FOREGROUND: closest ornate detail — a gargoyle / wrought-iron gate / carved-marble balustrade / stained-glass / vine-motif tracery
• MIDGROUND: the castle body with inner-glow leaking through stained-glass
• DEEP DISTANCE: more castle receding (towers, wings) / mountain-crag / Wallachian landscape
• SKY: violet twilight or moonlit, dramatic

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[Castlevania structure description]" 80% weight], [three architectural details], [stained-glass / rose-window inner-glow], [accent creature if rolled], [night sky], [spice flourish], [Castlevania-canon palette + ornate art-nouveau gothic + Ayami Kojima painted style]

DRAMATIC VISUALS: STRICT KONAMI CASTLEVANIA. ORNATE ART-NOUVEAU GOTHIC. AYAMI KOJIMA painted. Render the EXACT architectural detail from slots.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_GOTHIC_ARCHITECTURE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      structure,
      architectural_detail,
      inner_light,
      accent_creature,
      spice_decoration,
      sky_layer,
    } = slots;
    const details = Array.isArray(architectural_detail)
      ? architectural_detail
      : [architectural_detail];

    const accentSection = accent_creature
      ? `
━━━ ACCENT CREATURE (dark-wildlife, atmospheric scale-prover) ━━━
${accent_creature}

A small dark-wildlife accent that adds life without competing with the structure. Renders at midground edge or perched on the architecture itself.

`
      : '';

    return `You are a gothic-architecture concept-art painter writing STRUCTURE-AS-HERO scenes for GothBot. The gothic building IS the show — fills the frame, ornate detail everywhere, lit from within by dark magic. Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Van-Helsing visual lineage. NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.

━━━ STRUCTURE IS THE HERO — ABSOLUTE FIRST RULE ━━━
The gothic building DOMINATES the frame (80%+ visual weight). The landscape around it SUPPORTS, never competes. NO humans as primary subject. NO interior shots — EXTERIOR ARCHITECTURE only. The viewer's eye lands on the BUILDING first, the architectural details second, the inner-glow third, the surrounding context fourth.

━━━ GRAND MASSIVE SCALE — NON-NEGOTIABLE ━━━
The structure is VAST and COMPLEX — a full-blown castle / cathedral / fortress with ALL the bells and whistles. Multiple wings, multi-tier curtain walls, central keep, dozens of towers and spires, ornate facades, deep courtyards, sprawling battlements. Like Hogwarts / Minas Tirith / Stormwind / Castlevania-2-Dracula's-castle / Helm's-Deep / Notre-Dame — not a single tall spire-tower, but a SPRAWLING ARCHITECTURAL COMPLEX with massive scope.

Compositional language for massive scale:
• The structure is COMPLEX — multiple visible wings, sections, towers, courtyards, walls all working together
• Foreground at the BASE of the structure — cliff-edge / approach-road / lower courtyard / valley-floor / moat
• Camera angle EYE-LEVEL or LOW-ANGLE looking up/across (never high-angle aerial)
• Structure fills most of the frame — base near bottom, complex roofline reaching upper third
• Surrounding context (mountains / forest / cliffs / sea) is BELOW or AROUND the structure
• Use scale-prover language: "vast multi-wing fortress sprawling across the cliff-top," "the central keep flanked by twin lesser wings spreading wide," "stacked tier-on-tier curtain walls," "the cathedral-complex spreading across the entire ridge"

🚫 NEVER a single needle-thin spire-tower as the whole structure
🚫 NEVER a slim vertical-only silhouette — combine vertical AND horizontal mass together
🚫 NEVER a tall narrow lighthouse-style isolation

THINK HOGWARTS-CASTLE establishing-shot / MINAS-TIRITH-from-Pelennor / STORMWIND-cathedral-quarter / CASTLEVANIA-2-DRACULA'S-CASTLE / HELM'S-DEEP-establishing / NOTRE-DAME-with-flying-buttresses-and-towers / CRIMSON-PEAK-MANSION-from-the-approach — the SPRAWLING COMPLEX of architecture with massive scope is the signature.

━━━ INNER DARK-MAGIC LIGHT — MANDATORY ━━━
The structure is LIT FROM WITHIN — light leaks through windows / rose-windows / cracks / doorways. Source is dark magic / candles / witch-fire / fel-green / sapphire-necromantic / violet-spell / alchemist-gold / amber / blacklight — NEVER sunlight, NEVER exterior illumination as primary. The building feels ALIVE from inside.

━━━ ARCHITECTURAL DETAIL PORN — NON-NEGOTIABLE ━━━
EVERY SURFACE OF THE STRUCTURE IS OBSESSIVELY ORNATE. Hyper-detailed gothic-horror architecture porn — every wall has carved relief, every window has stone tracery, every cornice has gargoyles, every spire has crockets, every buttress has scrollwork. The building is a fractal of intricate detail at every readable scale. The viewer should want to STUDY every quadrant of the structure for ornament.

Render ALL THREE of these specific architectural flourishes VISIBLY in the frame:

  • DETAIL 1: ${details[0] || ''}
  • DETAIL 2: ${details[1] || ''}
  • DETAIL 3: ${details[2] || ''}

PLUS layer additional ornate detail throughout — every surface reads as carved, weathered, intricate:
• FLYING BUTTRESSES with carved-stone scrollwork
• ROSE-WINDOWS with intricate tracery
• POINTED SPIRES with crockets and pinnacles
• GARGOYLES and GROTESQUES at every corner
• WROUGHT-IRON gates and weathervanes
• STONE-ANGEL statuary lining buttresses
• DRAGON-HEAD water-spouts and bat-motif finials
• VAULTED ARCHES with carved keystones
• WEATHERED relief carvings of saints / demons / wyrms
• IVY and bioluminescent moss creeping along walls

━━━ MOOD — ELEGANT GOTHIC DARKNESS ━━━
HAUNTING + ALLURING + ORNATE + WEATHERED + ALIVE-FROM-WITHIN. The structure is gorgeous and unsettling. Centuries-old, ruined-but-not-fallen, something inside still breathes. Operatic dark romance. The kind of building that belongs on a Castlevania-game cover, a Crimson-Peak movie poster, a Bloodborne-area-establishing-shot.

━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━
NOT gray-monochrome. NOT red-monochrome. The Nightshade spectrum: violet-twilight skies, emerald-occult witch-fire, sapphire-nocturne deep-blues, rose-dusk horizons, fel-green warlock glow, necro-pale-blue, plus warm accents — candle-amber, torch-orange, forge-ember, alchemist-gold. ONE dominant atmosphere hue + ONE warm accent + ONE cool accent per render.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / cyberpunk / neon
🚫 NO real-world ethnic codes
🚫 NO humans as primary subject (accent-only for atmospheric scale)
🚫 NO red-fog / red-mist / blood-red-stained-glass dominant (palette is purple/violet/blue/green/silver/black with red as ACCENT only)
🚫 NO blood-moon dominating the sky (~10% max)
🚫 NO interior shots — EXTERIOR architecture only
🚫 NO generic "castle silhouette on cliff" — SHOW the architectural detail
🚫 NO pentagrams / satanic iconography
🚫 NO cheap gore / NO Jack-Skellington stylization
✓ Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Van-Helsing visual lineage

━━━ THE GOTHIC STRUCTURE (hero of the frame, 80%+ visual weight) ━━━
${structure}

The structure fills the frame at multi-tier depth. Camera angles vary — low-angle looking up at towering spires / high-angle looking down on courtyards / eye-level frontal establishing / over-the-hill approach / across-the-moat / through-gate perspective.

━━━ INNER DARK-MAGIC LIGHT ━━━
${inner_light}

The glow leaks from windows / rose-windows / cracks / doorways. The structure feels ALIVE from inside.

━━━ TWILIGHT SKY OVERHEAD ━━━
${sky_layer}

The sky is SATURATED and THEATRICAL. Gothic twilight palette dominant. CRITICAL — the sky must FRAME the structure, never compete with it. Aurora / phenomena should be confined to upper-frame edges, not consume the upper third. Lean toward CLEAN sky backdrops (deep violet, single vivid moon, distant clouds) that let the structure's vertical silhouette dominate.
${accentSection}━━━ SPICE DECORATION — small atmospheric flourish (mandatory) ━━━
${spice_decoration}

A SMALL atmospheric flourish — never frame-filling. If the spice is a vivid moon, render it as a focal element behind the structure (one quadrant) but NOT consuming the whole sky. If the spice is an aurora, keep it to a stripe at the upper edge. If the spice is lanterns, place them at the structure's base or along an approach. The spice ADDS character, never competes with the structure's vertical scale.

━━━ LIGHTING (ambient weather lighting outside the structure) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — STRUCTURE-DOMINATES, MULTI-TIER DEPTH ━━━
The structure FILLS THE FRAME (80%+ visual weight). Multi-tier depth mandatory:
• FOREGROUND: closest architectural detail — a carved buttress / gargoyle in profile / wrought-iron gate / weathered statuary / ornamental crenellation
• MIDGROUND: the structure body with inner-glow visible through windows / rose-windows / doorways
• DEEP DISTANCE: more of the structure receding / outer towers / supporting wings / one slice of surrounding landscape
• SKY: dramatic twilight overhead

Camera angle varies but the building DOMINATES. Inner-glow leaks through openings. Ornate gothic detail at every readable scale.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[gothic structure description]" leading the frame at 80%+ weight], [the three architectural details visible in the frame], [inner-glow leaking through windows / rose-windows / cracks], [accent creature if rolled], [sky overhead], [supporting landscape context briefly], [lighting + atmospheric layer], [color palette + mood]

DRAMATIC VISUALS: the STRUCTURE is the hero. Render the EXACT architectural detail from slots. Inner-glow mandatory. Ornate detail porn. NO humans primary. NO interior shots. STRICT gothic dark-fantasy.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_GOTHIC_VISTA: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ SUPERNATURAL PRESENCE — render visibly in the scene ━━━
${phenomenon}

A supernatural phenomenon woven into the landscape — render as a visible focal point that AMPLIFIES the haunting alive-watching mood.

`
      : '';

    return `You are a gothic dark-fantasy landscape painter writing AWE-INDUCING GOTHIC VISTAS for GothBot. Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton / Van-Helsing / Dark-Souls / Elden-Ring visual lineage. NEVER LOTR / Skyrim / Witcher / Warcraft high-fantasy vocabulary — strict gothic dark-fantasy ONLY.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Pure gothic world. NO hero figures, NO silhouettes, NO soldiers, NO vampires, NO humans of any kind. The LAND is the subject. Dark wildlife (crow / bat / wolf / owl / fireflies / spectral wisps) at scale-prover size is REQUIRED, but NEVER a humanoid figure.

━━━ THE LAND IS ALIVE AND HAUNTED — NON-NEGOTIABLE ━━━
The landscape is NOT a dead backdrop — it is a LIVING BREATHING GOTHIC WORLD that is GORGEOUS and UNSETTLING simultaneously. Beauty and dread inseparable.

EVERY render MUST stack ALL of these dark-life elements:

  1. **DARK-WILDLIFE PRESENCE** (mandatory) — crows wheeling in ominous formations / bats streaming from a belfry in black ribbons / wolves watching from a treeline / owls perched on gargoyles / fireflies drifting through graveyards like wandering spirits / moths circling unlit lanterns / spectral wisps between headstones. AT LEAST ONE form of dark-wildlife clearly visible in every render.
  2. **BIOLUMINESCENT DARK-FLORA** — black moss reclaiming crumbling stone / creeping ivy strangling iron gates / nightshade and belladonna blooming where graves were dug / moonflowers opening in silver light / ghostly pale wildflowers in cursed soil / bioluminescent fungi pulsing in crypt-corners
  3. **STRUCTURES GLOWING FROM WITHIN** — cathedral windows bleeding witch-fire green / candle-light through shattered stained-glass in violet-amber / forge-glow from a distant ruin suggesting something still burns / lit-windows in a distant tower despite no one being there
  4. **SUPERNATURAL-PRESENCE SIGNALS** — fog that moves against the wind / shadows pooling where no object casts them / lights flickering in impossible patterns / fireflies converging into formations / a single bell-tolling-ripple in the mist

━━━ MOOD — AWE WITH DREAD ━━━
HAUNTING + ALLURING + ALIVE + WATCHING. The most beautiful place you've ever seen, and something is deeply WRONG with it. The land REMEMBERS what happened here and hasn't forgiven it. Something ancient watches from every ruin. The beauty is a lure. Operatic dark romance with a hint of danger.

━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━
NOT gray-monochrome. NOT red-monochrome. Every scene weaves MULTIPLE accent hues. Pull from the full Nightshade spectrum: violet-twilight, emerald-occult witch-fire, sapphire-nocturne deep-blues, rose-dusk horizons, fel-green warlock glow, necro-pale-blue, plus warm accents — candle-amber, torch-orange, forge-ember, alchemist-gold. ONE dominant atmosphere hue + ONE warm accent + ONE cool accent per render.

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
This is the FLAGSHIP gothic-vista path. Every render is a MOVIE POSTER PROMOTIONAL FRAME with VERTIGO-INDUCING SCALE. The kind of vista that stops the viewer mid-scroll. The kind of frame that opens a Castlevania stage, opens a Bloodborne area, opens a Crimson Peak act. EVERY QUADRANT of the frame has something striking — no quiet corners.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:

  1. **THE ALIVE-AND-HAUNTED BIOME** at vertigo-inducing scale — multi-tier depth with foreground tactile detail + midground body + deep-distance atmospheric layer. NEVER a flat single-tier composition.
  2. **ARCHITECTURE ANCHOR GLOWING FROM WITHIN** — cathedral / castle / abbey / mausoleum / monastery / lighthouse-tower with visible INNER-GLOW (witch-fire green window / candle-amber tower / forge-ember basement / multiple impossibly-lit windows). Something is alive inside, even when nothing should be.
  3. **SUPERNATURAL ATMOSPHERIC PHENOMENON** (if rolled — fog-moving-wrong / spectral mist / will-o-wisp marching / shadow-pools / witch-fire aurora / phantom-carriage / fireflies-in-watching-eye-formation) DOMINATING its quadrant.
  4. **DARK-WILDLIFE SCALE PROVER** — visible crow-flock wheeling / bat-ribbon streaming from belfry / wolf-pack silhouette on ridge / owl on gargoyle / firefly swarm / spectral wisps. Dark-wildlife is MANDATORY in every frame — the LAND-IS-ALIVE signature.
  5. **TWILIGHT SKY** — violet-twilight / moonlit-violet / sickly-aurora / storm-bruised-purple / fel-violet-storm — SATURATED + THEATRICAL, never washed-out daylight.
  6. **BIOLUMINESCENT DARK-FLORA** — black-moss / nightshade-blooms / moonflowers / glowing-fungi / luminous-vines — at foreground or midground edge, providing the alive-watching pulse.

VERTIGO-INDUCING SCALE — every render must convey awe-inducing scope:
• Cliffs that drop a thousand feet into mist
• Cathedral spires piercing storm-clouds like fingers reaching for something
• Valleys so deep they vanish into violet mist
• Forests that stretch to every haunted horizon
• Mountain-passes leading to citadels half a mile distant
• Aerial views over haunted villages
• Canyon-gorges with stone aqueducts bridging the chasm

THE EYE SHOULD LAND ON 4+ STRIKING DETAILS in different quadrants. NOT just a centered beauty shot. NOT a single focal element. EVERY corner of the frame has dark-life, glow, scale, or supernatural presence.

THINK CASTLEVANIA-STAGE establishing-shot / BLOODBORNE-AREA intro-card / CRIMSON-PEAK-MANSION establishing-frame / TIM-BURTON-SLEEPY-HOLLOW-VISTA / VAN-HELSING-TRANSYLVANIA-ARRIVAL / BERSERK-ECLIPSE-VISTA — every frame should make the viewer GASP at the haunting alive-watching beauty.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO sci-fi / cyberpunk / nebulas / sky-whales / floating islands / orbital structures
🚫 NO modern / industrial architecture (no electric lighthouses / no factories — pre-industrial-Gothic only)
🚫 NO real-world ethnic codes
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO blood-red-stained-glass dominant (windows DARK / MOONLIT VIOLET / CANDLE-AMBER / FEL-GREEN / WITCH-FIRE GREEN only)
🚫 NO red-fog / red-mist / red-everything (palette is purple/violet/blue/green/silver/black with red as ACCENT only)
🚫 NO blood-moon dominating the sky (red moon in at most 10% of renders)
🚫 NO interior chamber compositions (this is OUTDOOR LANDSCAPE)
🚫 NO cheap gore / NO satanic-tropes / NO Jack-Skellington stylization
✓ Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Tim-Burton / Hellboy / Van-Helsing / Bram-Stoker-Dracula visual lineage

━━━ THE ALIVE-AND-HAUNTED BIOME ━━━
${biome}

The biome fills the frame at multi-tier depth. Foreground tactile detail (dark-flora / dark-wildlife at edge) → midground biome body (architecture glowing from within) → deep distance atmospheric layer.

━━━ ARCHITECTURE ANCHOR (glowing from within) ━━━
${architecture}

The architecture is the distant focal landmark — positioned at midground or deep distance with visible inner-glow (witch-fire windows / candle-tower / forge-ember / lit-windows-impossibly). Something is alive inside, even if nothing should be.

━━━ TWILIGHT SKY OVERHEAD ━━━
${sky_layer}

The sky is SATURATED and THEATRICAL — never washed-out natural blue, never daylight-bright. Gothic twilight palette dominant.
${phenomenonSection}━━━ DARK-WILDLIFE / SCALE PROVER — mandatory ━━━
${surprise_element}

Place at midground or foreground edge. The dark-wildlife (crow / bat / wolf / owl / fireflies / spectral wisps) gives the LANDSCAPE-IS-ALIVE signal — never a human figure, always atmospheric dark-life.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — EPIC WIDE-VISTA THAT WATCHES YOU ━━━
WIDE LANDSCAPE VISTA — the camera is PULLED BACK. Show the FULL biome with architectural anchor at midground or deep distance, the surrounding terrain stretching to atmospheric horizon. Think Castlevania-stage establishing-shot / Bloodborne-area-intro-card. The ARCHITECTURE is a distant focal landmark with visible inner-glow, the LANDSCAPE is the hero, the DARK-WILDLIFE makes it alive.

MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile dark-flora / standing-stone / overgrown tomb / scale-prover crow on a fence / nightshade-bloom / bioluminescent fungi cluster
• MIDGROUND: biome body with architecture glowing from within — the castle / cathedral / abbey with visible inner-light
• DEEP DISTANCE: atmospheric layer — fog / cloud-bank / horizon-line with supernatural phenomenon
• SKY: saturated twilight overhead — violet / moonlit-silver / sickly-aurora / storm-bruised

Dramatic single-source lighting: MOONLIGHT (silver-violet) / TWILIGHT (lavender-indigo) / WITCH-FIRE (green glow from distant window) / CANDLE-CLUSTER (amber at distance) / FEL-GREEN RUNE-GLOW / BLACKLIGHT AURORA. The land is alive AND watching.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[gothic biome description] alive with [dark-wildlife]"], [architectural anchor glowing from within at midground / deep distance], [the saturated twilight sky], [supernatural phenomenon if rolled], [dark-wildlife scale-prover at midground / edge], [bioluminescent dark-flora detail], [lighting and atmospheric detail], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. The land is ALIVE with dark-wildlife and bioluminescent flora. Architecture GLOWS FROM WITHIN. Something WATCHES. NO characters. NO LOTR vocabulary. NO interior. STRICT gothic dark-fantasy.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_DARK_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render visibly in the scene ━━━
${phenomenon}

A supernatural / atmospheric event woven into the landscape — render as a visible focal point that AMPLIFIES the haunting mood.

`
      : '';

    return `You are a gothic dark-fantasy landscape painter writing DARK LANDSCAPE scenes for GothBot. Castlevania / Bloodborne / Crimson-Peak / Berserk / Tim-Burton / Van-Helsing / Dark-Souls / Elden-Ring visual lineage. Twilight color, baroque ruin, moonlit melancholy, vibrant haunting. NEVER LOTR / Skyrim / Witcher / Warcraft / high-fantasy DragonBot vocabulary — strict gothic dark-fantasy ONLY.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Pure gothic landscape. NO human figures, NO humanoid silhouettes, NO shadow-mages, NO hooded wanderers. The land is the hero. (A distant crow / bat / wolf-silhouette / single carrion-bird as atmospheric scale-prover OK — never a humanoid figure.)

━━━ MOOD — ELEGANT DARKNESS, NON-NEGOTIABLE ━━━
HAUNTING + ALLURING + VIBRANT + BAROQUE-RUINOUS + TWILIGHT-COLOR. Gorgeous and terrifying inseparable. The viewer feels UNSETTLED first, magnetized second. Operatic dark romance with a hint of danger. The kind of art that belongs on a Castlevania-game cover, a Hellboy-Mignola comic panel, or a Van-Helsing movie poster.

━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━
NOT gray-monochrome. NOT red-monochrome. Every scene weaves MULTIPLE accent hues. Pull from the full Nightshade spectrum: violet-twilight skies, emerald-occult witch-fire, sapphire-nocturne deep-blues, rose-dusk horizons, fel-green warlock glow, necro-pale-blue, nightshade-indigo, witch-green, plus warm accents — candle-amber, torch-orange, forge-ember, alchemist-gold. ONE dominant atmosphere hue + ONE warm accent + ONE cool accent per render. Darkness with VARIED COLOR.

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME with VERTIGO-INDUCING SCALE. The kind of vista that stops the viewer mid-scroll. The kind of frame that opens a Castlevania stage, opens a Bloodborne area, opens a Crimson Peak act. EVERY QUADRANT of the frame has something striking — no quiet corners.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:

  1. **THE GOTHIC BIOME** at vertigo-inducing scale — multi-tier depth with foreground tactile detail + midground body + deep-distance atmospheric layer. NEVER a flat single-tier composition.
  2. **ARCHITECTURE ANCHOR** — castle / cathedral / abbey / mausoleum / monastery / fortress / lighthouse-tower at midground or deep distance, weathered and ruined.
  3. **ATMOSPHERIC PHENOMENON** (if rolled — spectral mist / witch-fire aurora / phantom-army / ash-fall / will-o-wisps / blood-moon / corpse-light) DOMINATING its quadrant.
  4. **SCALE PROVER** — tiny crow flock / bat silhouettes / wolf at edge / single distant lit-window — gives scale to the verticality. NO humanoid figures, only dark-wildlife / atmospheric details.
  5. **TWILIGHT SKY** — violet-twilight / moonlit-violet / sickly-aurora / storm-bruised purple — SATURATED + THEATRICAL, never washed-out daylight.
  6. **FOREGROUND TACTILE DETAIL** — weathered standing-stone / fallen banner / cracked tombstone / dead-bramble / scale-prover crow on stone — anchors the multi-tier depth.

VERTIGO-INDUCING SCALE — every render must convey awe-inducing scope:
• Cliffs that drop a thousand feet into mist
• Cathedral spires piercing storm-clouds
• Valleys so deep they vanish into violet mist
• Forests that stretch to every haunted horizon
• Mountain-passes leading to citadels half a mile distant
• Aerial views over haunted villages
• Canyon-gorges with stone aqueducts bridging the chasm

THE EYE SHOULD LAND ON 4+ STRIKING DETAILS in different quadrants. NOT just a centered beauty shot. NOT a single focal element. EVERY corner of the frame has detail, glow, scale, or atmospheric presence.

THINK CASTLEVANIA-STAGE establishing-shot / BLOODBORNE-AREA intro-card / CRIMSON-PEAK-MANSION establishing-frame / TIM-BURTON-SLEEPY-HOLLOW-VISTA / VAN-HELSING-TRANSYLVANIA-ARRIVAL / BERSERK-ECLIPSE-VISTA — every frame should make the viewer GASP at the haunting beauty.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO sci-fi / cyberpunk / nebulas / sky-whales / floating islands / orbital structures
🚫 NO modern / industrial architecture (no electric lighthouses, no factories — pre-industrial-Gothic only)
🚫 NO real-world ethnic codes
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary — NEVER write "Mordor / Rivendell / Skyrim hold / Witcher path / etc."
🚫 NO blood-red-stained-glass dominant (windows DARK / MOONLIT VIOLET / CANDLE-AMBER / FEL-GREEN only)
🚫 NO red-fog / red-mist / red-everything (palette is purple/violet/blue/green/silver/black with red as ACCENT only)
🚫 NO blood-moon dominating the sky (red moon in at most 10% of renders)
🚫 NO interior chamber compositions (this is OUTDOOR LANDSCAPE)
🚫 NO "looking through stone archway at gothic building in middle distance" cliché
🚫 NO cheap gore / NO satanic-tropes / NO Jack-Skellington stylization
✓ Castlevania / Bloodborne / Crimson-Peak / Berserk / Dark-Souls / Elden-Ring / Tim-Burton / Hellboy / Van-Helsing / Bram-Stoker-Dracula visual lineage

━━━ THE GOTHIC BIOME ━━━
${biome}

The biome fills the frame at multi-tier depth. Foreground tactile detail → midground biome body → deep distance atmospheric layer + architectural feature.

━━━ ARCHITECTURE ANCHOR ━━━
${architecture}

The architecture is the distant focal landmark — positioned at midground or deep distance, the landscape itself is the hero, but the architecture is what makes the frame UNMISTAKABLY GOTHIC.

━━━ TWILIGHT SKY OVERHEAD ━━━
${sky_layer}

The sky is SATURATED and THEATRICAL — never washed-out natural blue, never daylight-bright. Gothic twilight palette dominant.
${phenomenonSection}━━━ SURPRISE ELEMENT — secondary detail adding mood ━━━
${surprise_element}

Place at midground or deep midground. NO human/humanoid figures (path is pure landscape). Scale-prover animals / objects / supernatural-detail only.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION — EPIC WIDE-VISTA ━━━
WIDE LANDSCAPE VISTA — the camera is PULLED BACK. Show the FULL biome with architectural anchor at midground or deep distance, the surrounding terrain stretching to atmospheric horizon. Think John-Howe / Alan-Lee / Ted-Nasmith epic-fantasy concept-landscape painting (but rendered as Castlevania-stage / Bloodborne-area). The ARCHITECTURE is a distant focal landmark, the LANDSCAPE is the hero.

MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile detail — weathered standing-stone / fallen banner / cracked tombstone / dead-bramble / scale-prover crow on stone
• MIDGROUND: the biome body with architectural anchor — the castle / cathedral / abbey / village at distance
• DEEP DISTANCE: atmospheric layer — fog / cloud-bank / horizon-line / mountain-shadow
• SKY: saturated twilight overhead — violet / moonlit-silver / sickly-aurora / storm-bruised

Dramatic single-source lighting: MOONLIGHT (silver-violet) / TWILIGHT (lavender-indigo) / WITCH-FIRE (green glow from distant window) / CANDLE-CLUSTER (amber at distance) / FEL-GREEN RUNE-GLOW / BLACKLIGHT AURORA. NEVER blood-red-stained-glass dominant.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[gothic biome description]"], [architectural anchor at midground / deep distance], [the saturated twilight sky], [phenomenon if rolled], [surprise element at midground / edge], [lighting and atmospheric detail], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. Twilight color, baroque ruin, vibrant haunting. NO characters. NO LOTR vocabulary. NO interior. STRICT gothic dark-fantasy.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },
};
