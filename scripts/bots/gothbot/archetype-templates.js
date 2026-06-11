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
  GOTHBOT_GOTH_MALE_FULL_BODY_AXIS: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      character_archetype,
      body_pose,
      scene_context,
      skin,
      eyes,
      hair_color,
      hairstyle,
      face_detail,
      outfit_silhouette,
      weapon_or_signature_object,
      atmospheric_backdrop,
      composition_framing,
      foreground_anchor,
    } = slots;

    const foregroundSection = foreground_anchor
      ? `\n\n━━━ 13. FOREGROUND ANCHOR (40%-gated tactile element bringing 3-tier depth) ━━━\n${foreground_anchor}\n\nA specific tactile element close to the camera — drifting embers / fog wisps / lantern-edge / coat-folds / weapon-glint / cobblestone in foreground. Softly out-of-focus.`
      : '';

    return `You are a gothic concept-art painter writing ONE Flux prompt for an ELITE VAMPIRE-HUNTER full-body cinematic poster moment. He is the John Wick of vampire hunters — cool, mysterious, forboding, badass. Classic Castlevania / Van Helsing / Witcher / Blade / Hellsing / Underworld Death-Dealer / Castlevania Trevor-Belmont lineage. He is STRAPPED — multiple weapons visibly carried (crossbow + pistols + sword + dagger + stakes). Output ONLY the prompt — comma-separated phrases, 90-120 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE

1. ELITE VAMPIRE HUNTER — he is a HUNTER, not a vampire. Classic vampire-hunter lore. Belmont / Witcher of the School of Wolf / Van Helsing / Blade / Hellsing / Castlevania Trevor / Constantine / Tridentine inquisitor-hunter / Wallachian boyar turned vampire-killer. NEVER a vampire, NEVER a warlock, NEVER a mage, NEVER a lich, NEVER a demonologist.

2. COOL POSTER MOMENT — full-body cinematic still. STANDING tall / leaning / half-turned / mid-load / mid-draw / striding-out-of-shadow. Movie-poster gravity — not action mid-strike (that's the vampire-hunter-in-action path's job). The vibe: "this man has killed a hundred vampires and you're next."

3. STRAPPED WITH WEAPONS — at least 2-3 weapons visibly carried in the frame. Crossbow on back + twin pistols cross-belt + sword at hip + stake-bandolier / silver dagger at thigh / holy-water flask at belt. He looks LOADED, like a walking armory.

4. MEDIUM-CLOSE FULL-BODY — character fills 50-70% of vertical frame (full-body cinematic). NEVER closeup-portrait (face fills frame). NEVER tiny-distant-figure.

5. FORBODING + COOL — predator stillness, piercing focused gaze, deadly competence. NEVER emo / NEVER moping / NEVER slumped-teen / NEVER smudgy-eyeliner / NEVER Hot-Topic / NEVER bishonen / NEVER pretty-boy / NEVER androgynous. Stern adult man, weathered, scarred OK, full beard OK.

6. CHEST FULLY COVERED — leather longcoat / brigandine / chainmail / wool greatcoat / trenchcoat over weapon-harness. NEVER bare chest, NEVER shirtless, NEVER ripped-shirt, NEVER cleavage-of-pecs.

7. GOTHIC URBAN/CRYPT STAGE — cobblestone street at night / cathedral steps / crypt-gate / castle gate / cobblestone bridge / rooftop / village square at midnight / fog-bound alley / churchyard. Atmospheric, never castle-as-subject.

8. PAINTED-GOTHIC REGISTER — Ayami Kojima Castlevania concept-art / Bernie Wrightson dark-fantasy / Frank Frazetta heroic-painting darkened / Castlevania promotional-art lineage. NOT photoreal, NOT CGI, NOT cute-anime, NOT modern fashion photography.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. HUNTER ARCHETYPE (his identity — ELITE VAMPIRE HUNTER) ━━━
${character_archetype}

━━━ 2. BODY POSE (cool poster moment — forboding stillness or loaded readiness) ━━━
${body_pose}

━━━ 3. SCENE CONTEXT (gothic urban/crypt/cathedral stage around him) ━━━
${scene_context}

━━━ 4. SKIN ━━━
${skin}

━━━ 5. EYES (piercing focused gaze) ━━━
${eyes}

━━━ 6. HAIR COLOR ━━━
${hair_color}

━━━ 7. HAIRSTYLE / HEAD-STYLE (cool hunter styles — never emo bangs) ━━━
${hairstyle}

━━━ 8. FACE DETAIL (stern scar / beard / weathered — never smudgy emo) ━━━
${face_detail}

━━━ 9. OUTFIT / SILHOUETTE (hunter kit, chest fully covered, weapon harness visible) ━━━
${outfit_silhouette}

━━━ 10. WEAPONS (multiple weapons strapped — he is LOADED) ━━━
${weapon_or_signature_object}

━━━ 11. ATMOSPHERIC BACKDROP (gothic urban/crypt mood — fog/lantern-glow/moonlight) ━━━
${atmospheric_backdrop}

━━━ 12. COMPOSITION FRAMING (camera angle) ━━━
${composition_framing}
${foregroundSection}

━━━ AMBIENT MOOD (vibe-driven secondary cue) ━━━
${sharedDNA.scenePalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER ━━━
Painted gothic concept-art with heavy oil-brushwork. Ayami Kojima Castlevania painted concept-art / Bernie Wrightson dark-fantasy / Frank Frazetta heroic-painting darkened / Berserk-Miura ink lineage. Saturated gothic palette. NOT photoreal, NOT CGI, NOT cute-anime, NOT modern fashion photography.

━━━ HARD BANS ━━━
- NO vampire / NO warlock / NO mage / NO lich / NO demonologist — he is a HUNTER
- NO emo / NO bangs-over-eyes / NO smudgy-eyeliner / NO Hot-Topic / NO bishonen / NO pretty-boy
- NO just-standing-empty-handed — weapons MUST be visibly strapped
- NO bare chest / NO shirtless / NO ripped-shirt
- NO heroic-weapon-aloft / NO modeling-pose / NO hands-on-hips runway
- NO castle/cathedral as subject (atmospheric mood only)
- NO blood-spurts / NO gore / NO mid-combat-strike (this is the BEFORE / AFTER, not the strike)
- NO modern objects (no jeans / no sneakers / no cell phones)
- NO photoreal / NO CGI / NO cute-anime / NO 3D-plastic

━━━ OUTPUT ━━━
Write 90-120 words, comma-separated phrases. OPEN WITH THE BODY-POSE + HUNTER ARCHETYPE woven together — the COOL poster moment + who he is. Then scene context (gothic urban stage). Then character DNA (skin + eyes + hair + face + outfit + weapons-strapped). Then atmospheric backdrop + composition framing.${foreground_anchor ? ' Then foreground anchor.' : ''} Painted gothic register throughout. NEVER vampire/warlock/mage. NEVER emo. NEVER closeup-portrait. WEAPONS MUST BE VISIBLY STRAPPED. NO preamble, NO headers, NO ━━━ markers.`;
  },

  GOTHBOT_VAMPIRE_HUNTER_IN_ACTION: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      prowl_action,
      setting_location,
      hunter_archetype,
      weapon_signature,
      outfit_silhouette,
      environmental_detail,
      lighting,
      atmospheric_depth,
      composition_framing,
      foreground_anchor,
      spoor,
    } = slots;

    const spoorSection = spoor
      ? `\n\n━━━ 11. SPOOR / EVIDENCE (40%-gated subtle hint of past quarry presence) ━━━\n${spoor}\n\nA subtle hint in the scene that quarry has been here recently — handprint smear / scattered ash / fresh boot-print / overturned coffin half-visible. ~5% of frame at midground or foreground. NOT a focal element — just adds story-richness.`
      : '';

    return `You are a gothic concept-art painter writing ONE Flux prompt for a VAMPIRE-HUNTER ON-THE-PROWL painting. The hunter is mid-stalk through a specific gothic location with weapon at the ready, HUNTING SOMETHING WE DO NOT SEE. The quarry is OFF-CAMERA — IMPLIED by his body language and weapon direction. Like a stealth-game screenshot / film-still mid-hunt. Output ONLY the prompt — comma-separated phrases, 90-120 words, no preamble, no headers, no markers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described in your prompt.

1. SOLO HUNTER ON-THE-PROWL (LOAD-BEARING) — only ONE figure in the frame: the hunter. No vampire / wraith / target / second character visible. The quarry is OFF-CAMERA, IMPLIED by his body language (weapon aimed toward off-frame target / gaze locked off-frame / approach toward something out of view / leaning around a corner). The hunter is mid-stalk, weapon at the ready, ACTIVELY HUNTING — but the moment is PRE-ENCOUNTER. He has not yet seen his target in the frame.

2. MEDIUM-CLOSE COMPOSITION — hunter body fills 50-65% of vertical frame (waist-up to full-body, READABLE as a person). NEVER closeup-portrait (face fills frame). NEVER tiny figure in landscape (panned-out vista). Just close enough that the viewer reads the hunter's gear + body language clearly.

3. ACTIVE MOTION — every render shows specific active motion: aiming crossbow forward / drawing pistol mid-stride / sword drawn approaching off-frame target / sneaking through alley with weapon ready / leaning around a corner / vaulting a railing / mid-vault over a fence / crouched advance with weapon up / gun raised at the alley's end. NEVER standing-still-posing / NEVER hands-on-hips / NEVER weapon-aloft-heroic / NEVER meditating.

4. SPECIFIC GOTHIC LOCATION — the scene is a NAMED gothic place: cobblestone city street / cathedral nave / castle courtyard / crypt-yard / rooftop / village square / forest path / abbey ruins / plague-street / castle parapet / iron-fence cemetery. Setting must be IDENTIFIABLE.

5. STRONG MASCULINE HUNTER WITH READABLE FACE — adult masculine man (Geralt / Aragorn / Van Helsing / John Wick / Belmont). Strong jaw, scarred weathered face, heavy build, predator gaze. NEVER bishonen / NEVER femboy / NEVER pretty-boy. **FACE MUST BE READABLE** — specific hair / facial features / head-style visible. NEVER "hooded shadow figure" / NEVER "cloaked silhouette" / NEVER "shrouded stalker". Each hunter is a SPECIFIC MAN with hair + jaw + scar/feature + head-style visible — varied head-styles (hood-down / bare-head / wide-brim hat / cloth-wrap / domed helmet / silver braid / long black hair / pepper beard / kohl-rim eyes) ensure each render reads as a DIFFERENT hunter.

6. CHEST FULLY COVERED ALWAYS — heavy armor / longcoat / chainmail / robes / cassock. NEVER bare chest, NEVER shirtless, NEVER ripped-shirt, NEVER open-coat-revealing-pecs.

7. NO TARGET IN FRAME — NEVER render a visible vampire / wraith / quarry / second character. The hunt is PRE-ENCOUNTER. Off-camera implication only.

8. PAINTED-GOTHIC REGISTER — Ayami Kojima / Castlevania concept-art / Bernie Wrightson / Frank Frazetta / Berserk-Miura ink lineage. NOT photoreal, NOT CGI, NOT cute-anime. Heavy painted brushwork.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ 1. PROWL ACTION (LOAD-BEARING — render this specific active motion) ━━━
${prowl_action}

This is the hunter's specific body-action mid-stalk. Render him IN THIS MOTION — never frozen-still. The action implies he's hunting something off-camera.

━━━ 2. SETTING LOCATION (LOAD-BEARING — render this specific gothic place) ━━━
${setting_location}

The hunter is INSIDE this specific gothic location. Setting must be identifiable — gas-lamps + cobblestones = city street; vaulted columns + stained-glass = cathedral nave; iron-fence + headstones = crypt-yard. Render the location's signature details.

━━━ 3. HUNTER ARCHETYPE (his identity) ━━━
${hunter_archetype}

━━━ 4. WEAPON SIGNATURE (period-accurate, prominent in his hand) ━━━
${weapon_signature}

━━━ 5. OUTFIT / SILHOUETTE (heavy field-worn hunter gear — chest fully covered) ━━━
${outfit_silhouette}

━━━ 6. ENVIRONMENTAL DETAIL (scene-specific accents adding gothic richness) ━━━
${environmental_detail}

━━━ 7. LIGHTING (dramatic gothic light + time-of-day) ━━━
${lighting}

━━━ 8. ATMOSPHERIC DEPTH (god-rays / fog / mist / smoke / embers) ━━━
${atmospheric_depth}

━━━ 9. COMPOSITION FRAMING (medium-close solo camera angle) ━━━
${composition_framing}

━━━ 10. FOREGROUND ANCHOR (closest tactile element bringing 3-tier depth) ━━━
${foreground_anchor}
${spoorSection}

━━━ AMBIENT MOOD (vibe-driven secondary cue) ━━━
${sharedDNA.scenePalette}. ${vibeDirective.slice(0, 150)}

━━━ STYLE REGISTER ━━━
Painted gothic concept-art with heavy oil-brushwork. Ayami Kojima Castlevania painted concept-art / Bernie Wrightson dark-fantasy / Frank Frazetta heroic-painting darkened / Berserk-Miura ink lineage. Saturated gothic palette with deep-shadow contrast. NOT photoreal, NOT CGI, NOT smooth-digital, NOT cute-anime.

━━━ HARD BANS ━━━
- NO visible vampire / wraith / target / second character — SOLO HUNTER ONLY
- NO bare chest, NO nipples, NO shirtless, NO ripped-shirt
- NO bishonen / NO femboy / NO pretty-boy / NO androgynous-cute / NO K-pop-idol
- NO blood / gore / wounded-character
- NO mid-strike / NO combat / NO weapon-firing
- NO modern weapons (1500s-1800s gothic-period only)
- NO photoreal / NO CGI / NO 3D-plastic / NO cute-anime
- NO closeup-portrait (face fills frame) — keep hunter readable but not face-only
- NO panned-out wide vista (hunter is medium-close, not tiny)
- NO standing-still-posing / NO heroic-weapon-aloft / NO hands-on-hips

━━━ OUTPUT ━━━
Write 90-120 words, comma-separated phrases. OPEN WITH THE PROWL ACTION + SETTING LOCATION woven together — load-bearing first 30-40 words establishing the hunter mid-motion IN THE specific gothic location. Then hunter archetype + weapon + outfit (his identity). Then environmental detail + lighting + atmospheric depth + composition framing + foreground anchor.${spoor ? ' Then spoor / past-evidence subtly woven.' : ''} Painted gothic register throughout. NEVER visible target. NEVER bare chest. NEVER closeup-portrait. NO preamble, NO headers, NO ━━━ markers.`;
  },

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

  GOTHBOT_THE_DARK_PRINCE: ({ slots, sharedDNA, vibeDirective }) => {
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

    const ethnicityClause = ethnicity ? `${ethnicity}, ` : '';
    const unifiedPrince = `A commanding aristocratic vampire-lord — ${ethnicityClause}with ${hair}, ${menace_feature}. He wears ${wardrobe}. His eyes are visibly GLOWING with luminous unnatural inner light radiating outward — this glow is the most important visual element and must be unmistakably rendered, not a subtle tint.`;

    return `You are writing ONE Flux prompt for a hauntingly beautiful, MENACING MALE dark-prince portrait — a vampire-lord / cursed-prince / dark-sorcerer. Output ONLY the prompt — comma-separated phrases, 65-90 words, no preamble, no headers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST visual elements described, BEFORE wardrobe or setting. They are CENTER STAGE.

1. GLOWING eyes — his eyes glow with inhuman color, light radiating outward from the iris. Words "glowing" + "radiating" (or "casting light") MUST appear.
2. DEMONIC tell — visible FANGS (and/or a clawed fingertip / slit pupils), rendered theatrically, lit by the key-light. The fangs/tell MUST be unmistakably visible.

Open your prompt with the eyes + demonic-tell in this format (or equivalent):
"[color] glowing eyes radiating inhuman light, [fangs / slit pupils / clawed fingertip], pale cold aristocratic face, ..."

THEN describe the rest (face, hair, wardrobe, setting). The glowing-eyes-and-fangs are the OPENER and focal point.

HE IS A HARD, MASCULINE, HANDSOME MAN — chiselled and virile and commanding, a strong heavy brow and a square jaw, dangerous and imposing. Vampires are AGELESS — he can read from a hard man in his prime to timeless, but he must be MASCULINE and CHISELLED (light stubble or a trim beard optional). Think Gary-Oldman / Luke-Evans Dracula, a Frazetta dark-warlord. 🚫 ABSOLUTELY BANNED: NO pretty-boy / bishonen / fashion-model / smooth / slender-twink / androgynous / femboy / soft-delicate / feminine face. NO heavy makeup. NO elf ears / pointed ears. NO bare chest. NO forced-elderly grandpa either — virile and hard, not old. Masculine, terrifyingly IMPOSING — never pretty.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


━━━ 1. THE SCENE (opulent gothic backdrop behind him) ━━━
${scene}
Composition: ${composition}.
Lighting: ${lighting}.

━━━ 2. THE DARK PRINCE (one unified description — render him exactly this way) ━━━
${unifiedPrince}

He is a DEAD-PALE undead aristocrat — HARD, chiselled, MASCULINE bone structure (a heavy brow, a strong square jaw, sharp cheekbones), the skin corpse-pale / cursed (NOT alive-tan-pretty), the eyes GLOWING with inhuman color, FANGS and a DEMONIC tell marking him as not-human. Virile, imposing, masculine, regal, predatory STILLNESS. He is human-shaped — NO elf ears, NO pointed ears. He is IMPOSING and DAMNED — hard, cold, magnetic, lethal. Expression: imperious and quietly terrifying — ancient inhuman menace. NOT pretty, NOT a soft fashion-model, but NOT old either — virile and dangerous. His face is the focal point — bust framing 40-50% of frame.

━━━ 3. THE REGALIA (the unforgettable focal piece on or near him) ━━━
${hero_element}. Render this clearly and prominently.

━━━ 4. HIS ARCHETYPE (informs his ENERGY) ━━━
${archetype}

━━━ 5. MOVIE-POSTER CRANK MANDATE — APPLY TO EVERY RENDER ━━━
This is NOT a snapshot — this is a MOVIE POSTER selling the dark lord. Apply ALL of:

  1. THEATRICAL RIM-LIGHTING — a single dramatic key-light (candle / fireplace / oil-lamp / single moonbeam) cuts through deep velvet darkness, carving his face into something mythic. Rim-light on cheekbone, jaw, hair-edge. The light has DIRECTION + EMOTION. NEVER flat illumination.
  2. EVERY QUADRANT INTENTIONAL — each corner has atmospheric drama (drifting candle-smoke / a moonbeam ray / a hanging chandelier corner / an arched window / a candelabra / a goblet / a raven / a velvet drape). NEVER empty dark-void background.
  3. OBSESSIVE MATERIAL DETAIL — every velvet has nap + weave, every gold-thread catches light, every jewel refracts, every clasp shows tarnish, every hair-strand is individually visible, the brocade reads as woven. The viewer should want to STUDY every square inch.
  4. STORYTELLING BEAT — a mid-loaded moment: he just lowered a goblet (a dark droplet at his lip), just turned from the window (the curtain still settling), just looked up from a grimoire, just extended a ringed hand. NEVER static "he stands there."
  5. ATMOSPHERIC HAZE — volumetric light catches dust-motes / candle-smoke / drifting embers. The AIR has depth and weight.
  6. SATURATED JEWEL-TONE PALETTE WITH DEEP-SHADOW CONTRAST — rich oxblood / deep-violet / sapphire / amber / emerald / amethyst as accents. Deep-velvet black + corpse-pale as the canvas. ONE dominant accent per render. NEVER muted / desaturated / monochrome.
  7. PAINTED-CANVAS RICHNESS — painterly with visible brush-texture in the shadows. Ayami-Kojima Castlevania painted concept-art / gothic-painting tradition. NOT smooth-digital, NOT photo-real.
  8. HORROR-AS-BEAUTY DEMONIC RENDER — the fangs / clawed fingertip / slit-pupil rendered THEATRICALLY, lit by the rim-light, an obvious central focal accent. NOT subtle.

━━━ 6. PALETTE & MOOD ━━━
${sharedDNA.scenePalette}. ${sharedDNA.colorPalette}. ${vibeDirective.slice(0, 120)}

The painting feels DARK, OMINOUS, REGAL, GOTHIC. Heavy shadow dominates. A single dramatic key-light cuts through deep velvet darkness. Atmosphere heavy with menace and grandeur.

━━━ 7. ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ 8. HARD BANS ━━━
NO second figures, NO animals (except a single perched raven / coiled serpent IF it is the regalia), NO blood splatter, NO bodies, NO bare chest, NO androgynous femboy face, NO modern clothing, NO photoreal/film-still aesthetic, NO bright cheerful colors, NO bare black-void background (the gothic setting MUST be visible), NO elf ears / pointed ears, NO child / teen, NO multiple figures, NO weapon-brandishing action pose.

━━━ OUTPUT ━━━
Write 65-90 words, comma-separated phrases. The unified dark-prince description in section 2 is the primary face description — preserve the GLOWING EYES, FANGS / DEMONIC tell, DEAD-PALE skin, and masculine-aristocratic language unmistakably. The opulent gothic setting fills the rest of the frame. NO preamble, NO headers.`;
  },

  GOTHBOT_THE_HAUNTING: ({ slots, sharedDNA, vibeDirective }) => {
    const { spectre, visage, translucency, setting, light, composition, manifestation } = slots;

    const visageSection = visage
      ? `
━━━ HER FACE + HAIR — make her a DISTINCT WOMAN (varies every render) ━━━
${visage}

Render her EXACT hair colour, hairstyle, complexion and features from above — a specific, individual woman, NOT the same generic pale beauty every render.

`
      : '';

    const manifestSection = manifestation
      ? `
━━━ A QUIET MANIFESTATION (a subtle hint of her story — never gore) ━━━
${manifestation}

A subtle, sorrowful, uncanny detail — quiet, never a jump-scare, never gore.

`
      : '';

    return `You are a gothic concept-art painter writing GHOST-STORY scenes for GothBot. A single sorrowful, TRANSLUCENT spectre haunts an empty gothic place — hauntingly beautiful, melancholy, eerie. Crimson-Peak / The-Woman-in-Black / The-Others / gothic-ghost-story visual lineage. NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.

━━━ A TRANSLUCENT FEMALE GHOST — ABSOLUTE FIRST RULE ━━━
The spectre is a hauntingly beautiful WOMAN, rendered SEE-THROUGH — SEMI-TRANSPARENT like a DOUBLE EXPOSURE: the gothic architecture (wall / window / stairs / portraits) clearly VISIBLE THROUGH her body and gown at the same time as her own form, her edges dissolving into cold mist, her lower body / feet FADING TO NOTHING before they reach the floor, a faint cold CORPSE-BLUE luminance glowing within her. She is a GHOST — an elegant, sorrowful lady-spirit, not a solid living person.

🚫 NEVER a solid opaque figure — if you can't see THROUGH her (the room visible through her body), it has FAILED. ALWAYS a female lady-ghost (never male). NEVER a vampire / monster / zombie / gore-ghoul. NEVER a jump-scare. She is SORROWFUL, beautiful, melancholy, corpse-pale.

💀 HER FACE STAYS CLEAR — ABSOLUTE: she ALWAYS has a defined, beautiful, sorrowful FACE with clearly visible eyes, nose and mouth. The translucency / mist / veil / double-exposure / fading apply to her GOWN, her HAIR-ENDS, her lower BODY and her EDGES — NEVER to her face. NEVER a blank, smudged, blurred, shadow-hidden, veil-erased, or faceless head. Even beneath a veil her grieving features read clearly. If her face is a featureless smudge, it has FAILED.

━━━ THE SPECTRE (hero figure) ━━━
${spectre}

Render her pale, mournful, otherworldly — frozen in an old grief. Faded, drained, spectral clothing (never rich color).
${visageSection}

━━━ THE TRANSLUCENCY — the SIGNATURE money-shot (render this prominently) ━━━
${translucency}

This is the whole point. Render her as if SPUN FROM FROSTED GLASS or LAYERED GAUZE — the furniture / wall / window CLEARLY VISIBLE THROUGH HER TORSO and CHEST, her whole form a see-through wisp. She GENERATES HER OWN cold CORPSE-BLUE light from within (a faint glacial glow bleeding outward, the room's own lamps never quite reaching her). Her gown and long hair BILLOW and STREAM as though suspended in still water. Her lower body / feet TAPER TO NOTHING and dissolve to cold mist before they reach the floor. A readable translucent FIGURE — not a fog-blob, not solid.

━━━ THE HAUNTED PLACE (empty, atmospheric, behind her for depth) ━━━
${setting}

A still, empty, lonely gothic place — its emptiness makes the haunting land. NO other living people.

━━━ THE PALE LIGHT + COLD AIR ━━━
${light}

Cold, dim, blue-grey-silver, eerie — moonlight, a guttering candle, her own faint corpse-glow, cold mist. NEVER warm daylight.

━━━ THE "CAUGHT ON CAMERA" MOMENT (compose for this — it's half the impact) ━━━
${composition}

Compose her exactly as above — a STARTLING, CANDID, DYNAMIC instant, like a real ghost accidentally caught on camera: she is MID-MOTION or seen from an uncanny, off-kilter vantage. She is the focal figure (35-55% of frame), the gothic place around her for depth.

🚫 NEVER a calm, centered, posed standing portrait. NEVER "standing facing forward, head bowed, hands clasped" — that is the failure we are fixing. Give her a dynamic action + an off-kilter framing. NEVER a tight face-crop (we still need her translucent body + the place through her).
${manifestSection}
━━━ MOOD — SORROWFUL, BEAUTIFUL, EERIE ━━━
MELANCHOLY + HAUNTING + STILL + COLD + OTHERWORLDLY. A held breath, an old grief, a beautiful sadness. Crimson-Peak ghost, a Victorian ghost-story plate, The-Woman-in-Black. NOT a horror jump-scare — quiet, sublime dread.

━━━ TWILIGHT COLOR — COLD + DRAINED ━━━
Cold blue-grey-silver dominant, the spectre palest of all, a single faint accent (moon-silver / candle-amber / corpse-blue / will-o-wisp green). DRAINED, desaturated, eerie. ONE cold dominant + ONE faint accent.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO LOTR / Skyrim / Witcher / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / neon
🚫 NO solid opaque ghost (she MUST be see-through)
🚫 NO vampire / monster / zombie / gore / jump-scare
🚫 NO crowd (she is the only figure) / NO living people
🚫 NO pentagrams / cheap gore / Jack-Skellington stylization
✓ Crimson-Peak / The-Woman-in-Black / The-Others / gothic-ghost-story lineage

DRAMATIC VISUALS: the TRANSLUCENT spectre is the hero. Render the EXACT spectre + translucency + setting + light from slots. SEE-THROUGH mandatory. Sorrowful eerie beauty.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_THE_COVEN: ({ slots, sharedDNA, vibeDirective }) => {
    const { witch, spell, action, lair, composition, familiar } = slots;

    const familiarSection = familiar
      ? `
━━━ HER FAMILIAR (a small animal companion — never competes) ━━━
${familiar}

A small dark familiar near her or in the magic — never a monster, never a second person.

`
      : '';

    return `You are a folk-horror concept-art painter writing WEIRD WITCH scenes for GothBot. A single ORNATE, WARPED, wonderfully WEIRD witch is caught mid strange-occult-deed — and the scene TELLS A LITTLE STORY. Witches are into weird shit: make it weird, but readable + cool + gothic. The-VVitch / Pan's-Labyrinth / Brian-&-Wendy-Froud / Leonora-Carrington / Remedios-Varo / alchemical-engraving / dark-fairy-tale lineage. NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.

━━━ AN ORNATE, WEIRD WITCH — TELLING A STORY — ABSOLUTE FIRST RULE ━━━
She is an elaborately-adorned witch with ONE readable UNCANNY TWIST (a third eye, twig-antlers, too-long fingers, a familiar fused to her, moths pouring from a sleeve, a halo of orbiting teeth) — caught MID WEIRD-RITE, doing one specific strange occult thing you can read like a little story (coaxing up a screaming mandrake, growing a homunculus in a jar, whispering to a severed head, spinning fate-thread, weighing a soul). The DEED + her ornate weirdness are the show.

🪄 LEAN INTO THE WEIRD — strange, intricate, characterful, uncanny, a bit funny-dark. But ALWAYS READABLE + COOL/GOTHIC — the viewer instantly gets what's happening. NOT abstract, NOT a mess.
🌿 PULL BACK FROM DARK-VAMPIRE — this is FOLK-HORROR OCCULT, warm + earthy + jewel-toned + ornate, NOT a sexy goth-vampire in a black void. NOT grim — wondrous-strange.

🚫 NEVER a vampire / fangs / goth pin-up / cartoon-green hag. NEVER gore or body-horror-blood (the weird is uncanny + ornate, not bloody). NO modern objects.

━━━ THE WITCH (hero — ornate + one weird twist) ━━━
${witch}

Render her ELABORATELY adorned (layered robes, charms, headdress, rings) WITH her one readable uncanny twist. Intricate, strange, characterful.

━━━ THE WEIRD RITE — the SIGNATURE money-shot (the STORY — render it clearly) ━━━
${action}

The specific strange occult deed she is caught performing. This is the heart of the image — make it READABLE so the viewer gets the little story at a glance.

━━━ THE MAGIC GLOW (weird, organic, the main light) ━━━
${spell}

The uncanny glow accompanying her deed — old candle-and-ember weird magic, often small + strange. It lights the scene. Never sci-fi/neon, never a generic fire-column.

━━━ THE WITCH-HOUSE (cluttered + weird + story-rich, around her) ━━━
${lair}

A weird interior STUFFED with curiosities — jars, taxidermy, herbs, drawers, growing things, poppets — that you want to study. Warm + ornate + strange, NOT a bare dark crypt. NO daylight, NO modern.

━━━ COMPOSITION ━━━
${composition}

She is the focal figure (45-65% of frame) amid her weird rite + cluttered house. Full or three-quarter so we SEE her hands + what she's doing. NEVER a tight face-crop. She is solo.
${familiarSection}
━━━ MOOD — WONDROUS-STRANGE, ORNATE, UNCANNY, COOL ━━━
WEIRD + WHIMSICAL-DARK + INTRICATE + CHARMING-UNCANNY. The delight and unease of stumbling on a real witch mid-weird-work. A folk-tale plate, an alchemical engraving brought to life, a Froud faerie-grotesque. Strange but cool, never grim-edgy.

━━━ COLOR — RICH, JEWEL-TONED, EARTHY, WEIRD ━━━
Warm + strange — amber jar-glow, moss and bottle-green, candle-gold, plum, teal, ochre, with the magic-glow's hue (witch-fire green / arcane violet / starlight) as an accent. RICH + ornate + a little uncanny, NOT a flat black void. ONE warm key + jewel-tones + the magic accent.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO LOTR / Skyrim / Witcher / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / neon-tech
🚫 NO vampire / no fangs / no goth pin-up / no cartoon-green hag
🚫 NO gore / no body-horror-blood (uncanny-weird, never bloody)
🚫 NO crowd / no second human / no large monster (familiar = small uncanny companion)
🚫 NO pentagrams as satanic iconography / no Jack-Skellington stylization
✓ The-VVitch / Pan's-Labyrinth / Froud / Carrington / alchemical-engraving / dark-fairy-tale lineage

DRAMATIC VISUALS: the ORNATE WEIRD WITCH mid weird-RITE is the hero, and the scene TELLS A STORY. Render the EXACT witch + rite + magic + house from slots. Weird but readable, ornate, cool, gothic.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_MOONLIT_MAIDEN: ({ slots, sharedDNA, vibeDirective }) => {
    const { maiden, visage, scene, moonlight, composition, accent } = slots;

    const accentSection = accent
      ? `
━━━ A SOFT ATMOSPHERIC ACCENT (a quiet beautiful detail) ━━━
${accent}

A single delicate, dreamlike touch — quiet and lovely, never busy, never gore.

`
      : '';

    return `You are a gothic concept-art painter writing SUBLIME, DREAMLIKE gothic scenes for GothBot. A single ETHEREAL, BEAUTIFUL WOMAN graces a GORGEOUS, atmospheric, MOONLIT gothic place — romantic, melancholy, cinematic, achingly beautiful. The grand haunting SCENE and the graceful woman are CO-EQUAL — half the magic is the breathtaking gothic environment around her. Crimson-Peak / Pan's-Labyrinth-moonlight / dark-romantic-fantasy / painterly-anime visual lineage. NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.

━━━ THE FEELING — ABSOLUTE FIRST RULE ━━━
SUBLIME, DREAMY, ROMANTIC-MELANCHOLY beauty. A lone ethereal woman in a stunning moonlit gothic scene — like a still from a beautiful sad dream. Cold blue-silver moonlight, mist, grandeur, stillness, longing. The viewer should think "this is gorgeous and a little heartbreaking."

🌙 NOT the-haunting: this is NOT a hard see-through ghost, NOT a "caught-on-camera" startle, NOT uncanny/wrong. She is solid-but-ethereal, graceful, beautiful. Soft, painterly, romantic — not eerie-startling.
🚫 NEVER gore / horror / jump-scare. NEVER a vampire with fangs as the point. NEVER a busy or cluttered frame. NEVER warm daylight.

━━━ THE MAIDEN (hero — co-equal with the scene) ━━━
${maiden}

A lone, graceful, ETHEREALLY BEAUTIFUL woman — her flowing gown, her quiet melancholy, her otherworldly grace. Solid-but-dreamlike, luminous, lovely.

━━━ HER FACE + HAIR — a DISTINCT WOMAN (varies every render), face always CLEAR ━━━
${visage}

Render her EXACT hair colour, hairstyle, complexion and features — a specific, individual woman. Her FACE is always clear, defined and beautiful (visible eyes, nose, mouth) — NEVER blurred, smudged or erased. Not the same girl every time.

━━━ THE GRAND MOONLIT SCENE (co-equal — make it breathtaking) ━━━
${scene}

A GORGEOUS, atmospheric, grand gothic environment — render it with depth, scale and beauty. This is HALF the image; the place should be as stunning as she is.

━━━ MOONLIGHT + ATMOSPHERE ━━━
${moonlight}

Cold blue-silver moonlight, drifting mist, god-rays, a vast moon, soft cold haze — dreamy and luminous. The moon + cold light set the whole mood.
${accentSection}
━━━ COMPOSITION ━━━
${composition}

Place her gracefully within the grand scene — she can be intimate and close OR a small lone figure dwarfed by the breathtaking space. Cinematic, painterly, balanced. NEVER a tight face-crop — we need the gorgeous scene around her.

━━━ MOOD — SUBLIME, ROMANTIC, MELANCHOLY, BEAUTIFUL ━━━
ACHINGLY BEAUTIFUL + DREAMY + STILL + COLD + LONGING. A beautiful sad dream, a moonlit gothic reverie. Crimson-Peak romance, a dark-fairy-tale plate. Sublime, not scary.

━━━ COLOR — COLD-BLUE MOONLIT + SILVER ━━━
Cold blue / silver / moonlit-grey dominant, the maiden luminous and pale, a single soft accent (moon-silver / corpse-blue / pale-gold candle / will-o-wisp green / frost-cyan). Dreamy, desaturated-but-luminous. ONE cold dominant + ONE soft glow accent.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO LOTR / Skyrim / Witcher / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / neon
🚫 NO gore / horror / jump-scare / hard see-through ghost-mechanics / uncanny-wrong poses
🚫 NO crowd / no second figure / no living bystanders
🚫 NO tight face-crop / NO busy cluttered frame / NO warm daylight
🚫 NO pentagrams / cheap gore / Jack-Skellington stylization
✓ Crimson-Peak / dark-romantic-fantasy / painterly-anime / moonlit-gothic lineage

DRAMATIC VISUALS: a lone ETHEREAL BEAUTIFUL WOMAN in a BREATHTAKING moonlit gothic scene — scene + maiden CO-EQUAL. Render the EXACT maiden + visage + scene + moonlight from slots. Sublime, dreamy, romantic-melancholy beauty.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
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

  GOTHBOT_MONSTER_PROWL: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, creature, action, stage, drama } = slots;
    const dramaSection = drama
      ? `
━━━ DRAMATIC BACKGROUND EVENT (layer into the sky / deep distance behind the monster) ━━━
${drama}
Weave this dramatic event into the deep background — it transforms the sky and distance with awe and narrative, but it NEVER upstages the monster.

`
      : '';
    return `You are a master dark-anime illustrator creating an EPIC dark-anime gothic-horror HERO-SHOT of a SOLO EPIC GOTHIC MONSTER for GothBot — a clearly RECOGNIZABLE classic gothic monster (werewolf / vampire-lord / gargoyle / horned demon / hellhound / harpy / shade), alone in the gothic night doing creature-business. Castlevania + Bloodborne + Devil-May-Cry + Van-Helsing creature-feature tradition, richly-detailed dark-anime gothic-horror illustration — SOLID well-defined forms, rich NATURAL color, dramatic and cinematic. The MONSTER is unmistakably the star — and it must read instantly as a recognizable classic monster.

━━━ COMPOSITION — MOVIE-POSTER HERO SHOT OF THE MONSTER (NON-NEGOTIABLE) ━━━
This is a THEATRICAL ONE-SHEET FILM POSTER for a gothic-horror epic — the kind of awe-inspiring, dramatic, instantly-iconic frame that sells the movie. The monster DOMINATES — 50-65% of the frame — close enough that its monstrous design reads in full, terrifying, lavish, highly-detailed glory (fangs / fur / leathery wings / claws / horns / tattered shroud / glowing eyes). A HERO SHOT of the creature, NOT a wide landscape with a tiny figure in it.
Camera: bold cinematic framing — low-angle looking UP at the towering monster so it looms and feels colossal, OR a dynamic three-quarter angle. Rule-of-thirds power composition with deep layered space. The monster commands the frame while a LUSH, FULL gothic world fills the space behind it.

━━━ THE MONSTER (the hero — render in full, lavish, highly-detailed glory) ━━━
${creature}
Render this creature large, sharp, and central in crisp inked linework with rich, intricate, highly-detailed design. Every monstrous feature visible and dialed to 11. Beautiful AND terrifying.
RECOGNIZABILITY IS MANDATORY: it must be a SOLID, fully-formed, instantly-recognizable classic monster with clear, readable anatomy — a head with a face, limbs, a body, a defined silhouette. A werewolf reads unmistakably as a werewolf, a vampire as a vampire, a gargoyle as a gargoyle, a hellhound as a great burning hound, a harpy as a winged woman-raptor, a shade as a DEFINED cloaked figure of living darkness (clear humanoid silhouette + glowing eyes). NEVER a formless smoke-cloud, shapeless mist, melting mass, or ambiguous blob with no figure — a viewer must name the monster at a glance.

━━━ THE ACTION (mid-motion — captured at a loaded instant) ━━━
${action}
The monster is ALWAYS IN MOTION — stalking / mid-leap / mid-flight / mid-transformation / mid-howl / mid-summon / rising / lunging. Body weight shifted, a limb in flight. NEVER static, NEVER posing head-on at the camera, NEVER seated or standing-still-modeling.

━━━ THE GOTHIC SETTING — a LUSH, FULL, richly-detailed world behind the monster ━━━
${stage}
Render this setting LUSH and FULL behind and around the monster — PACKED with architectural detail and multi-tier depth: tactile foreground detail near the creature (cobblestones / statuary / bone / wet stone / fallen leaves), the monster as the commanding midground hero, and a DENSE, intricately-detailed gothic backdrop rising behind — towering spires, ornate stonework, sprawling structures layered into the deep distance under a dramatic sky. The world is gorgeous, dense, and inhabited; the monster still dominates, but it stands in a rich, full gothic world — never a bare or minimal space.

${dramaSection}━━━ LIGHTING — CINEMATIC, MOVIE-POSTER DRAMA ━━━
${lighting}
Light the monster like a film-villain reveal: a strong dramatic key + colored rim-light / moon-backlight carving its silhouette AND revealing surface detail, deep theatrical graphic chiaroscuro through bold solid-black shapes, VIVID SATURATED color. The monster is the brightest, sharpest, most commanding thing in the frame — poster-grade, awe-inspiring.

━━━ ATMOSPHERIC DEPTH ━━━
${atmosphere}
Layered depth — foreground particles (mist / ash / embers / drifting snow) caught in the light, midground separating the monster from the rich setting, volumetric god-rays / moonbeams cutting through. The frame feels inhabited and ALIVE — but keep the architecture crisp and detailed, never lost in haze.

━━━ COLOR — RICH, NATURAL, FULLY-REALIZED PALETTE (CRITICAL) ━━━
Render in RICH, FULL, NATURALISTIC color like a fantasy-novel-cover painting — deep full-bodied saturated hues with warm and cool tones in believable balance (earthy stone-greys, deep forest and moss greens, warm torch-amber and gold, cold moon-silver and blue, deep crimson and bruise-violet accents). Saturated and luminous but NATURAL and grounded, with real depth and atmosphere — a varied true-to-life palette, never a single-hue wash.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

🚫 NO hunter / NO human protagonist / NO second figure / NO combat partner — the monster is SOLO
🚫 NO gore / NO blood-spatter / NO open wounds / NO mid-bite-on-victim — implied menace only
🚫 NO tiny-figure-lost-in-a-vista — the monster fills the frame as the hero
🚫 NO Jack-Skellington stylization, NO cheap B-movie schlock, NO pentagram / satanic iconography
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary, NO real-world ethnic codes
✓ an EPIC dark-anime gothic-horror illustration of a recognizable classic monster in a LUSH full gothic world — Castlevania/Bloodborne creature-feature energy, richly-detailed dark-anime art + solid well-defined forms, rich natural color

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: the epic monster, large and highly-detailed, mid-action, filling 50-65% of frame — the cinematic movie-poster hero], [its dramatic theatrical lighting + carved silhouette], [the LUSH, FULL, richly-detailed gothic setting layered behind it], [the dramatic background event if any], [atmospheric depth], [rich natural full-color palette + richly-detailed dark-anime gothic-horror illustration finish]

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },
  GOTHBOT_MONSTER_PROWL_VICTORIAN: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, creature, action, stage } = slots;
    return `You are a classical oil painter creating a CLASSICAL VICTORIAN GOTHIC PAINTING of a SOLO EPIC GOTHIC MONSTER for GothBot — a clearly RECOGNIZABLE classic gothic monster (werewolf / vampire-lord / gargoyle / horned demon / hellhound / harpy / shade), alone in the gothic night doing creature-business. 19th-century dark-Romantic painted-horror tradition, dramatic and cinematic. The MONSTER is unmistakably the star — and it must read instantly as a recognizable classic monster.

━━━ COMPOSITION — MOVIE-POSTER HERO SHOT OF THE MONSTER (NON-NEGOTIABLE) ━━━
This is a THEATRICAL ONE-SHEET FILM POSTER for a gothic-horror epic — the kind of awe-inspiring, dramatic, instantly-iconic frame that sells the movie. The monster DOMINATES — 50-65% of the frame — close enough that its monstrous design reads in full, terrifying, lavish detail (fangs / fur / leathery wings / claws / horns / tattered shroud / glowing eyes). A HERO SHOT of the creature, NOT a wide landscape with a tiny figure in it.
Camera: bold cinematic framing — low-angle looking UP at the towering monster so it looms and feels colossal, OR a dynamic three-quarter angle. Rule-of-thirds power composition with depth. The gothic setting is a DRAMATIC BACKDROP behind and around it — atmospheric, deep, gorgeous — but it NEVER dwarfs or swallows the monster. The monster commands the frame.

━━━ THE MONSTER (the hero — render in full, lavish, readable detail) ━━━
${creature}
Render this creature large, sharp, and central. Its design is the whole point — every monstrous feature visible and dialed to 11. Beautiful AND terrifying.
RECOGNIZABILITY IS MANDATORY: it must be a SOLID, fully-formed, instantly-recognizable classic monster with clear, readable anatomy — a head with a face, limbs, a body, a defined silhouette. A werewolf reads unmistakably as a werewolf, a vampire as a vampire, a gargoyle as a gargoyle, a hellhound as a great burning hound, a harpy as a winged woman-raptor, a shade as a DEFINED cloaked figure of living darkness (clear humanoid silhouette + glowing eyes). NEVER a formless smoke-cloud, shapeless mist, melting mass, or ambiguous blob with no figure — a viewer must name the monster at a glance.

━━━ THE ACTION (mid-motion — captured at a loaded instant) ━━━
${action}
The monster is ALWAYS IN MOTION — stalking / mid-leap / mid-flight / mid-transformation / mid-howl / mid-summon / rising / lunging. Body weight shifted, a limb in flight. NEVER static, NEVER posing head-on at the camera, NEVER seated or standing-still-modeling.

━━━ THE GOTHIC SETTING (dramatic backdrop — supports the monster, does NOT dwarf it) ━━━
${stage}
Render the setting with depth and atmosphere behind and around the monster, but keep it a BACKDROP: foreground tactile detail near the creature (cobblestones / fog / gravestones / bone / wet stone), the monster as the midground hero, the gothic setting receding into atmospheric haze under a dramatic moonlit or stormy sky.

━━━ LIGHTING — CINEMATIC, MOVIE-POSTER DRAMA ━━━
${lighting}
Light the monster like a film-villain reveal: a strong dramatic key + colored rim-light / moon-backlight carving its silhouette AND revealing surface detail (matte fur, wet stone, pale flesh, leathery wing-membrane catching light), volumetric god-rays and atmospheric haze, deep theatrical chiaroscuro, rich saturated gothic color. The monster is the brightest, sharpest, most commanding thing in the frame — poster-grade, awe-inspiring.

━━━ ATMOSPHERIC DEPTH ━━━
${atmosphere}
Layered depth — foreground particles (fog / mist / ash / embers / drifting snow) caught in the light, midground haze separating the monster from the setting, volumetric god-rays / moonbeams cutting through. The frame feels inhabited and ALIVE.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

🚫 NO hunter / NO human protagonist / NO second figure / NO combat partner — the monster is SOLO
🚫 NO gore / NO blood-spatter / NO open wounds / NO mid-bite-on-victim — implied menace only
🚫 NO tiny-figure-lost-in-a-vista — the monster fills the frame as the hero
🚫 NO Jack-Skellington stylization, NO cheap B-movie schlock, NO pentagram / satanic iconography
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary, NO real-world ethnic codes
✓ a vivid, operatic CLASSICAL VICTORIAN GOTHIC OIL PAINTING of a recognizable classic monster — 19th-century dark-Romantic painted horror

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: the epic monster, large and detailed, mid-action, filling 50-65% of frame — the cinematic movie-poster hero], [its dramatic theatrical lighting + carved silhouette], [the gothic setting as backdrop behind it], [layered atmosphere], [operatic gothic-horror palette + classical Victorian oil-painting masterwork finish]

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_MONSTER_PROWL_INKED: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, creature, action, stage, drama } = slots;
    const dramaSection = drama
      ? `
━━━ DRAMATIC BACKGROUND EVENT (layer into the sky / deep distance behind the monster) ━━━
${drama}
Weave this dramatic event into the deep background — it transforms the sky and distance with awe and narrative, but it NEVER upstages the monster.

`
      : '';
    return `You are a master dark-fantasy INK ILLUSTRATOR creating an EPIC, HIGHLY-DETAILED INKED ILLUSTRATION of a SOLO EPIC GOTHIC MONSTER for GothBot — ANY classic gothic monster, all sorts welcome (werewolf / vampire-lord / vampiress / gargoyle / horned demon / succubus / hellhound / harpy / shade / lich / banshee / wraith / ghoul / dragon / reanimated horror), alone in the gothic night doing creature-business. Castlevania + Bloodborne + Devil-May-Cry + Van-Helsing creature-feature tradition, bold inked dark-anime COMIC illustration — richly detailed and ornate, bold black outlines, high-contrast — dramatic and cinematic. The MONSTER is unmistakably the star — and it must read instantly as a recognizable classic monster.

━━━ COMPOSITION — MOVIE-POSTER HERO SHOT OF THE MONSTER (NON-NEGOTIABLE) ━━━
This is a THEATRICAL ONE-SHEET FILM POSTER for a gothic-horror epic — awe-inspiring, dramatic, instantly-iconic. The monster DOMINATES — 50-65% of the frame — close enough that its monstrous design reads in full, terrifying, highly-detailed glory (fangs / fur / leathery wings / claws / horns / tattered shroud / glowing eyes). A HERO SHOT of the creature, NOT a wide landscape with a tiny figure in it.
Camera: bold cinematic framing — low-angle looking UP at the towering monster so it looms colossal, OR a dynamic three-quarter angle. Rule-of-thirds power composition with deep layered space. The monster commands the frame while a LUSH, FULL gothic world fills the space behind it.

━━━ THE MONSTER (the hero — render in full, lavish, highly-detailed glory) ━━━
${creature}
Render this creature large, sharp, and central in BOLD richly-detailed inked comic linework — ornate, dense, and intricate. Every monstrous feature visible and dialed to 11. Beautiful AND terrifying.
RECOGNIZABILITY IS MANDATORY: a SOLID, fully-formed, instantly-recognizable classic monster with clear readable anatomy — a head with a face, limbs, a body, a defined silhouette. A werewolf reads as a werewolf, a vampire as a vampire, a gargoyle as a gargoyle, a hellhound as a great burning hound, a harpy as a winged woman-raptor, a shade as a DEFINED cloaked figure of living darkness.
🚫 CRITICAL — the monster is a SOLID, DISTINCT CREATURE standing IN the scene; its body is flesh / fur / scale / stone, clearly SEPARATE from the environment. NEVER fuse, merge, or build the monster OUT OF the trees, branches, roots, rocks, or background. NEVER a formless smoke-cloud, melting mass, or ambiguous blob — a viewer must name the monster at a glance.

━━━ THE ACTION (mid-motion — captured at a loaded instant) ━━━
${action}
The monster is ALWAYS IN MOTION — stalking / mid-leap / mid-flight / mid-transformation / mid-howl / mid-summon / rising / lunging. Body weight shifted, a limb in flight. NEVER static, NEVER posing head-on, NEVER seated or standing-still-modeling.

━━━ THE GOTHIC SETTING — a LUSH, FULL, richly-detailed world behind the monster ━━━
${stage}
Render this setting LUSH and FULL behind and around the monster — PACKED with architectural detail and multi-tier depth: tactile foreground detail near the creature, the monster as the commanding midground hero, and a DENSE, intricately-detailed gothic backdrop rising behind — towering spires, ornate stonework, sprawling structures layered into the deep distance under a dramatic sky. The world is gorgeous, dense, and inhabited; the monster still dominates, but stands in a rich, full gothic world.

${dramaSection}━━━ LIGHTING — CINEMATIC, MOVIE-POSTER DRAMA ━━━
${lighting}
Light the monster like a film-villain reveal: a strong dramatic key + colored rim-light / moon-backlight carving its silhouette AND revealing surface detail, deep theatrical chiaroscuro, dramatic contrast. The monster is the brightest, sharpest, most commanding thing in the frame — poster-grade, awe-inspiring.

━━━ ATMOSPHERIC DEPTH ━━━
${atmosphere}
Layered depth — foreground particles (mist / ash / embers / drifting snow) caught in the light, midground separating the monster from the rich setting, volumetric god-rays / moonbeams cutting through. The frame feels inhabited and ALIVE.

━━━ COLOR — VIVID, FULLY-SATURATED COMIC PALETTE (CRITICAL) ━━━
Render in BOLD, FULLY-SATURATED, HIGH-CHROMA comic color — rich varied luminous hues across the spectrum (emerald and witch-green, blood-crimson, electric teal and cyan, gold and candle-amber, royal violet, hot magenta, bone-ivory) set against deep inky blacks. Bright, punchy, and richly colorful like a Castlevania promotional poster — vivid and saturated throughout.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

🚫 NO hunter / NO human protagonist / NO second figure — the monster is SOLO
🚫 NO gore / NO blood-spatter / NO mid-bite-on-victim — implied menace only
🚫 NO tiny-figure-lost-in-a-vista — the monster fills the frame as the hero
🚫 NO Jack-Skellington stylization, NO pentagram / satanic iconography
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary, NO real-world ethnic codes
✓ a richly-detailed gothic-horror DETAILED INKED ILLUSTRATION of a recognizable classic monster — a SOLID creature in a LUSH full gothic world, clean confident ink linework, palette per the color-mood above

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: the epic monster, large and highly-detailed, mid-action, filling 50-65% of frame — a SOLID distinct creature, the cinematic hero], [its dramatic theatrical lighting + carved silhouette], [the LUSH, FULL, richly-detailed gothic setting layered behind it], [the dramatic background event if any], [atmospheric depth], [the color-mood palette + detailed inked dark-fantasy illustration finish]

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_MONSTER_PROWL_WETA: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, creature, action, eye_glow, feature, scene_color, stage, drama } =
      slots;
    const dramaSection = drama
      ? `
━━━ DRAMATIC BACKGROUND EVENT (layer into the sky / deep distance behind the gargoyle) ━━━
${drama}
Weave this dramatic event into the deep background — it transforms the sky and distance with awe and narrative, but it NEVER upstages the gargoyle.

`
      : '';
    return `You are a master gothic-horror artist creating an EPIC HERO-SHOT of a SOLO EPIC GARGOYLE for GothBot — an animated carved-STONE gargoyle (granite / sandstone / blackened basalt / verdigris-bronze / obsidian) come to terrible life: the MOST gnarly, mean, ferocious gargoyle imaginable, dialed to 11, yet ORNATELY and intricately carved — terrifying AND mesmerizing to look at. The GARGOYLE is unmistakably the star — scroll-stopping. (Render it fully in the specified ART MEDIUM/STYLE — commit completely to that medium.)

━━━ COMPOSITION — FULL-BODY HERO SHOT OF THE WHOLE GARGOYLE (NON-NEGOTIABLE) ━━━
This is a THEATRICAL ONE-SHEET FILM POSTER for a gothic-horror epic. Show the ENTIRE GARGOYLE — its FULL BODY, or at minimum a clear 3/4 view — HEAD-TO-TALON, with its WINGS, BODY, LIMBS, and TALONS all clearly visible in the frame. The gargoyle fills the frame as the hero (roughly 55-70%) but is always shown WHOLE, in its full pose.
🚫 ABSOLUTELY NEVER a face-only / head-only / bust / extreme close-up — the whole creature must be in frame. 🚫 NEVER a tiny figure lost in a vista. The viewer must instantly read "a classic winged stone GARGOYLE", recognizing it at a glance from its full silhouette — horns + WIDE-SPREAD bat-wings + a LEAN, gnarled, crouching grotesque body. The gargoyle is LEAN and skinny (NEVER bulky / muscular / beefy), and its bat-WINGS are SPREAD and clearly in view — the iconic spread-winged gargoyle silhouette.
Camera: a dynamic three-quarter angle, OR a low-angle looking UP at the towering gargoyle so it looms colossal — but ALWAYS full-body. Rule-of-thirds power composition with deep layered space. The gargoyle commands the frame while a LUSH, FULL gothic world fills the space behind it.

━━━ THE GARGOYLE (the hero — gnarly, mean, AND ornately carved, in full ultra-detailed glory) ━━━
${creature}
Render the FULL gargoyle — head, body, wings, limbs, and talons ALL visible in frame — large and central, with rich detail: weathered carved stone, cracked granite / basalt / bronze, lichen and grime in the deep-cut grooves, every ornamental carving and grotesque sub-face crisp and clear. The MOST gnarly, mean, scroll-stopping gargoyle imaginable — terrifying yet mesmerizing.
SIGNATURE FEATURE — dial this detail to 11: ${feature}
GLOWING EYES — the one living spark in the rock: ${eye_glow}
RECOGNIZABILITY IS MANDATORY: a SOLID carved-STONE gargoyle with clear readable anatomy — a grotesque head, fanged maw, horns, limbs, wings, defined silhouette, unmistakably LIVING ROCK. A SOLID, DISTINCT creature standing IN the scene, clearly separate from its surroundings — NEVER fused into the background, NEVER a formless blob. A viewer must instantly see a GARGOYLE.

━━━ THE ACTION (mid-motion — captured at a loaded instant) ━━━
${action}
The monster is ALWAYS IN MOTION — stalking / mid-leap / mid-flight / mid-transformation / mid-howl / mid-summon / rising / lunging. Body weight shifted, a limb in flight. NEVER static, NEVER posing head-on, NEVER seated or standing-still-modeling.

━━━ THE GOTHIC SETTING — a LUSH, FULL, richly-detailed world behind the monster ━━━
${stage}
Render this setting LUSH and FULL behind and around the monster — PACKED with architectural detail and multi-tier depth: tactile foreground detail near the creature, the monster as the commanding midground hero, and a DENSE, intricately-detailed gothic backdrop rising behind — towering spires, ornate stonework, sprawling structures layered into the deep distance under a dramatic sky. The world is gorgeous, dense, and inhabited; the monster still dominates, but stands in a rich, full gothic world.

${dramaSection}━━━ LIGHTING — CINEMATIC, MOVIE-POSTER DRAMA ━━━
${lighting}
Light the monster like a film-villain reveal: a strong dramatic key + colored rim-light / moon-backlight carving its silhouette AND revealing surface detail, ray-traced cinematic global illumination, volumetric god-rays and atmospheric haze, deep theatrical chiaroscuro. The monster is the brightest, sharpest, most commanding thing in the frame — poster-grade, awe-inspiring.

━━━ ATMOSPHERIC DEPTH ━━━
${atmosphere}
Layered depth — foreground particles (mist / ash / embers / drifting snow) caught in the light, midground separating the monster from the rich setting, volumetric god-rays / moonbeams cutting through. The frame feels inhabited and ALIVE.

━━━ COLOR — DOMINANT SCENE COLOR (CRITICAL) ━━━
The entire scene is ${scene_color}. COMMIT FULLY to this specific vivid dominant color — flood the lighting, glow, fog, and atmosphere with it so it saturates the whole frame and lights the grey stone gargoyle from rim to shadow. Bold, vivid, and luminous, held against deep ominous inky-black shadow for a DARK, dramatic, ominous mood — a creature-feature film lit with bold colored gels.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

🚫 NO hunter / NO human protagonist / NO second figure — the monster is SOLO
🚫 NO gore / NO blood-spatter / NO mid-bite-on-victim — implied menace only
🚫 NO tiny-figure-lost-in-a-vista — the monster fills the frame as the hero
🚫 NO Jack-Skellington stylization, NO pentagram / satanic iconography
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary, NO real-world ethnic codes
✓ an ULTRA-HIGH-DEFINITION HYPERREAL WETA-WORKSHOP CREATURE RENDER of a recognizable classic monster in a LUSH full gothic world — lifelike tactile realism + Unreal Engine 5 CGI craft, rich natural cinematic color, a crafted render

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: the FULL gargoyle head-to-talon — wings, body, limbs, talons all visible — large and ultra-detailed, mid-action, the cinematic hero, shown WHOLE not cropped], [its dramatic theatrical lighting + carved silhouette], [the LUSH, FULL, richly-detailed gothic setting layered behind it], [the dramatic background event if any], [atmospheric depth], [full-spectrum saturated color held against ominous shadow, rendered fully in the specified art medium]

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
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

  GOTHBOT_THE_SANCTUM: ({ slots, sharedDNA, vibeDirective }) => {
    const { interior, detail, inner_light, focal_feature, atmosphere, accent } = slots;
    const details = Array.isArray(detail) ? detail : [detail];

    const accentSection = accent
      ? `
━━━ A SMALL ACCENT (life-sign / scale-prover — never competes) ━━━
${accent}

A SMALL accent, far back and tiny — a hooded figure dwarfed by the architecture (8-15% of frame, NEVER the subject) or dark interior wildlife. It proves the colossal scale and adds a breath of life. The INTERIOR remains the hero.

`
      : '';

    return `You are a gothic concept-art painter writing GRAND INTERIOR scenes for GothBot. The viewer stands INSIDE a vast, cold, sacred gothic chamber — the SPACE itself is the show. Castlevania / Bloodborne / Crimson-Peak / Dark-Souls / Elden-Ring / Berserk visual lineage. NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.

━━━ THE GRAND INTERIOR IS THE HERO — ABSOLUTE FIRST RULE ━━━
We are INSIDE a colossal gothic interior that fills 80%+ of the frame. Towering ribbed vaults soar overhead, columns march into shadowed depth, the perspective recedes to a vanishing-point swallowed in darkness. The SPACE dwarfs everything. The camera looks DOWN the length of the chamber / UP into the vault / ACROSS the great hall. The viewer's eye lands on the vast architecture first, the dramatic light second, the focal centrepiece third.

🚫 NEVER an exterior (no sky, no building-silhouette-from-outside — we are WITHIN).
🚫 NEVER the warm, cluttered, treasure-filled cozy witch's-study register — this is COLD, VAST, REVERENT, awe-and-dread. Stone, height, echo, emptiness.
🚫 NO humans as the subject (a tiny scale-prover figure is allowed, accent-only).

━━━ THE INTERIOR (hero of the frame, 80%+ visual weight) ━━━
${interior}

The chamber is immense and architecturally complex — soaring vaults, deep colonnades, multi-tier galleries, a floor receding into gloom. Render the depth: foreground stone near the camera, the great space opening beyond, the far end lost in shadow.

━━━ THE LIGHT WITHIN — the SIGNATURE money-shot (render this prominently) ━━━
${inner_light}

This is what makes the interior breathtaking. The light carves the volume of the space, throws long shadows, and pulls the eye into depth. Make it dramatic, directional, theatrical — gothic gloom pierced by a glorious source. NEVER flat daylight, NEVER modern light.

━━━ THE FOCAL CENTREPIECE (the eye lands here at the end of the space) ━━━
${focal_feature}

A single arresting hero-object deep in the chamber or at its centre, anchoring the composition at the vanishing-point.

━━━ ORNATE INTERIOR DETAIL — render ALL THREE visibly ━━━
  • DETAIL 1: ${details[0] || ''}
  • DETAIL 2: ${details[1] || ''}
  • DETAIL 3: ${details[2] || ''}

Every surface is obsessively carved — ribbed vaults, foliate capitals, tomb effigies, tracery, choir stalls, reliefs. The interior is a fractal of intricate gothic ornament the viewer wants to study.

━━━ THE AIR WITHIN (volumetric atmosphere — makes the light visible) ━━━
${atmosphere}

Indoor volumetric atmosphere only — incense-smoke, dust-motes in the light-shafts, cold mist pooling, candle-haze. It makes the god-rays solid and the depth readable. NEVER outdoor weather.
${accentSection}
━━━ MOOD — COLD SACRED AWE ━━━
HUSHED + VAST + REVERENT + WEATHERED + HAUNTED. Centuries-old, breath-fogging cold, beautiful and unsettling. The kind of interior that belongs in a Bloodborne cathedral, a Castlevania inner-sanctum, a Crimson-Peak grand hall. Operatic dark romance turned inward.

━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━
NOT gray-monochrome. The Nightshade spectrum: violet gloom, emerald witch-fire, sapphire-nocturne blue, candle-amber warmth, alchemist-gold, corpse-pale silver, with red as ACCENT only. ONE dominant atmosphere hue + ONE warm accent + ONE cool accent.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / cyberpunk / neon / electric light
🚫 NO exterior / building-silhouette / sky-as-hero
🚫 NO warm-cozy domestic clutter (that is a different path)
🚫 NO pentagrams / satanic iconography / cheap gore / Jack-Skellington stylization
✓ Castlevania / Bloodborne / Crimson-Peak / Dark-Souls / Elden-Ring / Berserk interior lineage

DRAMATIC VISUALS: the SPACE is the hero. Render the EXACT interior + light + centrepiece + the THREE details from slots. Deep receding perspective mandatory. Cold sacred awe. INTERIOR only.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_THE_FROST_GARDEN: ({ slots, sharedDNA, vibeDirective }) => {
    const { garden, flora, frost_feature, statuary, light_sky, accent } = slots;
    const flowers = Array.isArray(flora) ? flora : [flora];

    const accentSection = accent
      ? `
━━━ A SMALL ACCENT (life-sign / scale-prover — never competes) ━━━
${accent}

A SMALL accent — dark garden wildlife or a tiny distant figure dwarfed by the garden (8-15% of frame, NEVER the subject). Adds a breath of life. The GARDEN remains the hero.

`
      : '';

    return `You are a gothic concept-art painter writing CURSED FROZEN GARDEN scenes for GothBot. A haunting, frost-bitten gothic garden or derelict conservatory is the show — mournful, beautiful, utterly still. Crimson-Peak / Sleepy-Hollow / Pan's-Labyrinth / gothic-fairy-tale visual lineage. NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.

━━━ THE FROZEN GARDEN IS THE HERO — ABSOLUTE FIRST RULE ━━━
A cursed, frost-touched gothic garden fills the frame — bare black trees, thorned rose-arbors, cracked stone paths, statuary furred with hoarfrost, everything silvered and silent. The GARDEN/CONSERVATORY is the hero. The mood is MOURNFUL BEAUTY + winter stillness + gentle decay.

🚫 NEVER a cheerful bright spring garden — this is a CURSED WINTER garden (frost, thorns, decay, dead blooms).
🚫 NO characters as the subject (a tiny scale-prover figure is allowed, accent-only).
🚫 NO interior cathedral / no castle-architecture-as-hero — this is an outdoor garden / glass conservatory.

━━━ THE GARDEN (hero of the frame) ━━━
${garden}

The garden fills the frame at layered depth — frozen foreground beds, the middle garden with its paths and arbors, the misty far end. Render the layout (paths, walls, arbors) and the frost-decay.

━━━ THE FROST SIGNATURE — the money-shot (render this prominently) ━━━
${frost_feature}

This is what makes the garden magical and cold. The ice/frost effect should be gorgeous and central — caught water, glazed stone, feathered crystal, a frozen mirror. Cold, glittering, dreamlike — never a whiteout.

━━━ THE CENTREPIECE (the eye lands here) ━━━
${statuary}

A single arresting stone feature anchoring the garden — statuary or stonework, still and frost-touched.

━━━ DARK FROST-FLORA — weave BOTH visibly ━━━
  • FLORA 1: ${flowers[0] || ''}
  • FLORA 2: ${flowers[1] || ''}

Dark gothic plants touched by frost — black roses, thornbriars, frozen lilies, ice-glazed ivy, pale moonflowers, withered wisteria. Beautiful and mournful, never cheerful.

━━━ LIGHT, SKY + COLD AIR ━━━
${light_sky}

Cold gothic light — moonlight, frost-blue dawn, lavender twilight, witch-fire wisps, pale fog. Frost-mist and breath-cold fill the air. NEVER warm golden daylight. Lean toward CLEAN skies that let the garden read.
${accentSection}
━━━ MOOD — MOURNFUL FROZEN BEAUTY ━━━
HUSHED + MELANCHOLY + GORGEOUS + WEATHERED + STILL. A garden caught in an enchanted winter, beautiful and sorrowful, time stopped. Crimson-Peak grounds, a fairy-tale garden under a curse, a conservatory gone to frost.

━━━ TWILIGHT COLOR — WEAVE MULTIPLE HUES ━━━
NOT gray-monochrome. The Nightshade winter spectrum: frost-silver, violet gloom, frost-blue, lavender twilight, sapphire shadow, pale moon-white, with a single warm accent (a far lantern, a blood-orange dusk, one red robin) and emerald witch-fire as an option. ONE dominant cold hue + ONE warm accent.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / neon
🚫 NO cheerful spring / tropical / summer garden
🚫 NO characters as primary subject (accent-only)
🚫 NO pentagrams / satanic iconography / cheap gore / Jack-Skellington stylization
✓ Crimson-Peak / Sleepy-Hollow / Pan's-Labyrinth / gothic-fairy-tale lineage

DRAMATIC VISUALS: the GARDEN is the hero. Render the EXACT garden + frost-signature + centrepiece + the TWO flora from slots. Mournful frozen beauty. Outdoor garden / conservatory only.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  GOTHBOT_TWILIGHT_GOTHIC: ({ slots, sharedDNA, vibeDirective }) => {
    const { scene, twilight_light, sky, atmosphere, foreground, accent } = slots;

    const accentSection = accent
      ? `
━━━ A SMALL ACCENT (life-sign / scale-prover — never competes) ━━━
${accent}

A SMALL accent — wildlife or a tiny distant figure dwarfed by the scene (5-12% of frame, NEVER the subject). The SCENE + LIGHT remain the hero.

`
      : '';

    return `You are a romantic gothic-landscape painter writing MAGIC-HOUR scenes for GothBot. A gothic landscape caught in the soft transitional light of dawn / dusk / twilight / foggy-morning is the show — melancholy, beautiful, still. Caspar-David-Friedrich / Sleepy-Hollow / Crimson-Peak / gothic-fairy-tale visual lineage. NEVER LOTR / Skyrim / Witcher high-fantasy vocabulary.

━━━ THE MAGIC HOUR IS THE HERO — ABSOLUTE FIRST RULE ━━━
This is the GOLDEN/ROSE/LAVENDER magic hour — dawn, dusk, golden-hour, blue-hour, or foggy-morning. The SOFT TRANSITIONAL LIGHT is the hero quality: low sun, long shadows, warm-and-cool colour, mist in the hollows. A gothic subject (castle / cemetery / abbey / church / village / bridge) sits within it.

🚫 NEVER deep night, NEVER a full-dark moonlit scene (those are other paths). The light is SOFT and LOW and WARM-COOL — never black.
🚫 NEVER a high bright noon sun. NO characters as the subject (a tiny accent figure is allowed).
🚫 NO modern / industrial / sci-fi.

━━━ THE GOTHIC SCENE (hero subject, set within the light) ━━━
${scene}

The gothic subject sits in a wide romantic landscape composition — foreground, the subject in the middle distance, the sky and horizon beyond. Atmospheric depth, layered planes fading into mist.

━━━ THE MAGIC-HOUR LIGHT — the SIGNATURE money-shot (render this prominently) ━━━
${twilight_light}

This is the soul of the path. The exact quality of the low transitional light — its colour, its long shadows, how it gilds the stone and pools cool in the hollows. Make it gorgeous and unmistakable.

━━━ THE TWILIGHT SKY ━━━
${sky}

A magic-hour sky — streaked sunset, pastel dawn, layered violet cloud, a low burning sun. The sky is a major part of the frame and the mood. Dawn/dusk/twilight only.

━━━ THE ATMOSPHERE (makes the low light visible) ━━━
${atmosphere}

Ground-fog, valley mist, woodsmoke, drifting leaves, golden haze, long dewy shadows. It catches the low light and gives the scene its romantic depth. Never night-dark, never whiteout.

━━━ FOREGROUND ANCHOR (frames the scene + gives depth) ━━━
${foreground}

A near foreground element the composition opens from — a bare tree, a gate, a headstone, a winding road — silhouetted or rim-lit by the low sun.
${accentSection}
━━━ MOOD — MELANCHOLY ROMANTIC BEAUTY ━━━
WISTFUL + GORGEOUS + STILL + ATMOSPHERIC. The quiet beauty of a gothic world at the edge of day — sublime, lonely, golden. A Friedrich painting, a Sleepy-Hollow dawn, a Crimson-Peak gloaming.

━━━ TWILIGHT COLOR — WEAVE WARM + COOL ━━━
The magic-hour spectrum: warm gold / rose / amber / blood-orange in the light, cool violet / blue / lavender / indigo in the shadow and distance. The warm-cool contrast IS the magic hour. ONE warm light-hue + ONE cool shadow-hue dominant.

━━━ STRICT GOTHBOT DARK-FANTASY ━━━
🚫 NO LOTR / Skyrim / Witcher / Warcraft / Tolkien vocabulary
🚫 NO modern / industrial / sci-fi / neon
🚫 NO deep night / no full-dark moonlit scene / no noon sun
🚫 NO characters as primary subject (accent-only)
🚫 NO pentagrams / cheap gore / Jack-Skellington stylization
✓ Caspar-David-Friedrich / Sleepy-Hollow / Crimson-Peak / gothic-fairy-tale lineage

DRAMATIC VISUALS: the magic-hour LIGHT + the gothic SCENE are the hero. Render the EXACT scene + light + sky + atmosphere + foreground from slots. Soft transitional light, never deep night.

Output ONLY the raw 90-120 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
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
