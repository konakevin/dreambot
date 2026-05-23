/**
 * dragonbot archetype templates — Sonnet brief composer functions.
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
  FEMALE_ADVENTURER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      class: charClass,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

An atmospheric event happening in the world around her — render as a visible secondary focal point (NOT eclipsing her). Adds awe / story to the frame. NEVER combat or enemies.

`
      : '';

    return `You are a fantasy concept-art painter writing a CANDID ADVENTURING scene for DragonBot — a single WOMAN of a SPECIFIC D&D × LOTR fantasy race, of a specific class, doing her adventurer thing out in the wild. LOTR / GoT / Elden Ring / Skyrim / Witcher tradition. She is ALIVE, CAPABLE, road-tested, in a story-rich candid moment.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "adventurer", "rogue", "ranger", "mage", "paladin", "warrior" or any other gender-ambiguous noun for "woman" in the opening. Opening MUST read: "a [race-coded] WOMAN [doing action] in [landscape]..." — "woman" comes BEFORE any class noun. Use she/her/hers throughout. The class slot describes her ROLE, not her gendered noun — append role AFTER "woman" appears.

━━━ ABSOLUTE BANS — COMBAT-CLEAN ━━━
• NO active combat, NO mid-strike, NO weapon-aimed-at-a-foe, NO enemy in frame, NO fallen body, NO wounded character, NO blood-fight
• A DRAWN weapon held ready in stealth or wary advance IS allowed (creeping low with sword/dagger drawn, stalking something just out of frame) — but NEVER mid-swing, NEVER a visible enemy, NEVER an actual strike. Otherwise weapons stay holstered / sheathed / slung / carried.
• NO posing for the camera. NEVER staged. Candid moment, body in motion or charged stillness
• Coverage RANGES — from fully-covered ornate gear to FITTED + tastefully skin-showing (bare arms, bare shoulders, a toned midriff, a shorter combat skirt with bare legs). Render the OUTFIT SLOT's coverage EXACTLY as written. STILL banned: chainmail bikini / battle-bra / string-strap-as-outfit / exposed-cleavage-as-the-focus / bondage-harness. Athletic and capable, NEVER cheesecake or sexualized posing.

━━━ HER OUTFIT — RENDER THE SLOT EXACTLY (coverage varies) ━━━
Her outfit reads ORNATE + FITTED + functional — LOTR / Witcher / GoT / Elden Ring / Dragon Age caliber adventuring gear, tailored to allow movement, with a waist-defining belt and lovingly-crafted detail (hand-engraved bracers, tooled buckles, runic embroidery).
COVERAGE IS DICTATED BY THE OUTFIT SLOT — it varies deliberately. SOME outfits are fully-covered ornate layers (robes, plate, hooded coats); OTHERS are fitted and tastefully skin-showing (sleeveless with bare arms / bare shoulders / a toned midriff / a shorter combat skirt with bare legs and high boots). Render whatever the slot specifies — do NOT add coverage the slot doesn't call for (do NOT bundle a sleeveless top in a cloak, do NOT lengthen a short skirt). She always looks athletic, capable, and put-together — NEVER lingerie-armor, NEVER cheesecake.
Reference range: Éowyn shieldmaiden plate / Tauriel bare-armed scout leathers / Yennefer fitted witch-court bodice / Red Sonja-but-tasteful warrior gear / Xena fitted leather-and-skirt / Aloy tribal armor with bare arms. Fitted to flatter the form, NOT loose drapes that erase her silhouette.

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. She is ALONE in her moment.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The adventurer is the MAIN SUBJECT. Her face, gear, race, action, and pose are the DRAW. She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / accessory / face / race-anatomy all CLEARLY READABLE.

⚠️ FRAMING BANS — NEVER:
• "back to viewer" / "from behind" / "rear view" — her FACE must be visible (three-quarter or side profile)
• "tiny silhouette in distance" / "small in distant landscape" / "dwarfed by"
• "hooded figure" with face not visible — even with hood, face must show
• "lone figure on horizon" / "distant figure approaching"

⚠️ FEMININE ANATOMY LOCK — render her UNMISTAKABLY as a woman regardless of class. Classes like BARBARIAN / WARRIOR / MONK / RANGER / PALADIN have a strong Flux bias toward male defaults. Counter that with explicit feminine cues: visible breast contour beneath functional armor / tunic / robes, narrower waist than shoulders, feminine jawline, female facial structure. Render the outfit slot's coverage exactly (covered OR tastefully skin-showing per the slot) — ALWAYS unmistakably female anatomy, NEVER cheesecake or sexualized posing. No bare-chested, no battle-bikini. No moustache or beard EVEN on dwarven women (dwarven-women in this lineage are beardless).

━━━ HER RACE (LOCKED — render her unmistakably as THIS lineage) ━━━
${race}

Race is NON-NEGOTIABLE. Render the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features. Drow = obsidian-grey skin and white-silver hair, NOT default-blonde human. Tiefling = horns and slit-pupil eyes. Dragonborn = scaled face and draconic snout. Half-orc = green-grey skin and tusks. Wood elf = pointed ears and forest features. Race is the HERO of identity.

━━━ HER CLASS (her role / energy — informs how she carries herself) ━━━
${charClass}

━━━ HER COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} woman with ${eyes.split(',')[0]} eyes and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All seven DNA elements (race / class / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Skin / scale / hide tone is encoded in the RACE entry itself — no separate skin axis. Face fully visible (this is fantasy, not sci-fi — no sealed helmet).

━━━ THE ACTION — what she is doing RIGHT NOW (CANDID, NEVER COMBAT) ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. The action defines body position. Render it EXACTLY — body weight visible, captured at a loaded instant. Purposeful, capable, mid-motion — never staged.

━━━ THE LANDSCAPE (the stage) ━━━
${landscape}

USUALLY a wild fantasy biome. BUT if THE ACTION above places her in a specific VENUE — a tavern interior, a road-side campfire, a creek-bank rest — then HONOR THAT VENUE as the stage and let this landscape inform what's visible beyond it (peaks framed in the tavern window, the forest ringing the camp, the valley past the creek). The action's venue always wins over a conflicting wild-biome.

Depth on depth — FOREGROUND tactile detail (rocks / vegetation / camp gear / tavern table / cliff-edge) → MIDGROUND stage body + her → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop. The stage never competes with her for focus.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying the wider world. NEVER foreground or competing with her for attention.

━━━ LIGHTING ━━━
${lighting}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see her face and race clearly. NEVER walking head-on toward camera. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near her feet (gear, rocks, vegetation, trail-edge). MIDGROUND: HER, full body, mid-action, 25-40% of frame. BACKGROUND: the landscape receding into atmospheric haze.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] WOMAN [doing exact action] in [landscape]" — race-noun "woman" leads], [she wears [outfit] with full material detail], [her skin + eyes + hair locked from DNA slots], [signature accessory visible], [the fantasy landscape wrapping around her — depth + atmospheric layers], [lighting + atmosphere particles], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded woman] [DOING ACTION]" — woman comes BEFORE rogue / ranger / mage / paladin / etc. She fills 25-40% of frame, FULL-BODY, captured at the loaded candid instant.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  FEMALE_ACTION_SCENES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      class: charClass,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

A magical / atmospheric event amplifying the action — render as a visible secondary focal point. Adds awe / chaos / story.

`
      : '';

    return `You are a fantasy concept-art painter writing a PEAK-ACTION CINEMATIC MOMENT for DragonBot — a WOMAN of a SPECIFIC D&D × LOTR fantasy race, of a specific class, captured at the apex of dynamic action. LOTR / GoT / Elden Ring / Skyrim / Witcher / Warcraft visual lineage. She is ALIVE, mid-motion, RIPPING with cinematic energy.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "mage", "rogue", "ranger", "paladin", "warrior" or any other gender-ambiguous noun for "woman" in the opening. Opening MUST read: "a [race-coded] WOMAN [doing action] in [landscape]..." — "woman" comes BEFORE any class noun. Use she/her/hers throughout. The class slot describes her ROLE, not her gendered noun — append role AFTER "woman" appears.

━━━ ABSOLUTE BANS — NSFW-CLEAN ━━━
• NO cheesecake: NO "minimal coverage" / "bare midriff" / "exposed cleavage" / "form-fitting" / "skin-tight" / "harness across torso" / "sultry" / "sensual" / "alluring" / "low-cut" / "curves emphasized"
• Her outfit reads FUNCTIONAL + COVERED — sleek action gear, not sexualized
• NO posing for the camera. NEVER staged. Captured at a cinematic loaded INSTANT
• NO real-world ethnic / historical costume codes (no Bedouin / Persian / samurai / Aztec / Polynesian / etc.) — STRICT WESTERN HIGH FANTASY ONLY

━━━ THIS IS PEAK ACTION — NOT A CANDID MOMENT ━━━
The action axis describes a CINEMATIC MID-ACTION BEAT — mid-spell at the apex of a fireball, mid-loose with arrow streaking from her bow, mid-leap from a rooftop in a chase, the moment of summoning, the second a paladin's hammer crashes down, the instant a rogue's blade reverses for a kill.

━━━ MULTI-EFFECT STACK — MANDATORY ━━━
Every render MUST show AT LEAST 2-3 LAYERED VISIBLE EFFECTS / DYNAMIC ELEMENTS happening SIMULTANEOUSLY. ONE effect = boring. STACK them:
• PRIMARY: her direct action (spell-released / arrow-loosed / blade-arc / leap-mid-air / portal-cracking)
• SECONDARY: environmental reaction (debris kicked up / glass shattering / dust cloud / sparks raining / spell-light blooming outward / shockwave radiating / hair-and-cloak whipped by magical wind / motion-blur on her swung arm)
• TERTIARY (scene context): active background — fleeing crowd / collapsing tower / distant explosion / arrow-volley overhead / dragon shadow / allied caster also mid-spell / battle silhouettes / cracking flagstones / smoke billowing / burning building / charging cavalry / scattered enemies retreating

The frame should be ALIVE with chaos / motion / magic — not just her with one effect on a quiet background. THINK MOVIE-POSTER PROMOTIONAL STILL — every quadrant of the frame has something happening.

━━━ SCALE THE MAGIC UP ━━━
If the action involves magic, don't render a wisp — render a MAELSTROM. Not just a fireball — a fireball amid arcing tendrils of secondary flame and glowing-rune wake. Not just lightning — lightning forking down WITH an arcane storm circle radiating from her feet. Not just a portal — a portal CRACKING REALITY with creatures emerging and the air rippling. The magic should DOMINATE its quadrant of the frame.

━━━ SOLO PROTAGONIST ━━━
ONE character — she is the focus. Enemies / targets / mooks may exist in the scene but as scale-provers / context, NEVER eclipsing her. No fallen-body gore. No fights between two equally-prominent figures. SHE is the show.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
Her face, gear, race, action, and pose are the DRAW. She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / accessory / face / race-anatomy all CLEARLY READABLE.

━━━ HER RACE (LOCKED — render her unmistakably as THIS lineage) ━━━
${race}

Race is NON-NEGOTIABLE. Render the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features. Drow = obsidian-grey skin and white-silver hair. Tiefling = horns and slit-pupil eyes. Dragonborn = scaled face and draconic snout. Half-orc = green-grey skin and tusks. Wood elf = pointed ears and forest features. Race is the HERO of identity.

━━━ HER CLASS (her role / energy — informs HOW the action reads) ━━━
${charClass}

━━━ HER COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements (race / class / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible. NO sealed helmet (this is fantasy).

━━━ THE PEAK-ACTION BEAT — what she is doing AT THIS EXACT INSTANT ━━━
${action}

Render at the LOADED INSTANT — body in motion, motion-blur where appropriate, effects in full bloom, the moment the camera caught her in. NOT before, NOT after — AT IT. Effects-rich, lit by the magic / fire / energy she is wielding.

━━━ THE LANDSCAPE (the stage — action-scene context) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rubble / sparks / spell-residue / debris) → MIDGROUND her + the action → DEEP DISTANCE atmospheric layers / cityscape / battle-context. The landscape SETS the scene's stakes — burning towers, lantern-lit night market, magic-storm horizon, dragon attack on castle, collapsing dungeon, neon arcane spires.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary detail amplifying the action ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying wider stakes (fleeing enemies / falling banners / arcane sparks / scattered coins / hovering scrolls / fleeing crowd / smoldering ruin). NEVER eclipses her.

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

━━━ COMPOSITION — DYNAMIC ANGLES ━━━
Action shots benefit from DYNAMIC camera angles. Mix across renders: three-quarter / dutch-tilt / low-angle hero / over-shoulder / sweeping pursuit / dramatic upshot. NEVER head-on at the camera. NEVER posing. FOREGROUND: tactile action detail (rubble / sparks / motion-blur / spell-residue). MIDGROUND: HER, full body, AT THE PEAK INSTANT, 25-40% of frame. BACKGROUND: the action-scene landscape with stakes visible.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] WOMAN [PEAK-ACTION verb] in [action landscape]" — race-noun "woman" leads, then immediately the peak-action beat], [she wears [outfit]], [her skin + eyes + hair from DNA], [signature accessory IN MOTION], [the landscape with action-stakes], [lighting + effects + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded woman] [PEAK-ACTION-VERB]" — woman comes BEFORE class. The action verb IS the composition driver. She fills 25-40% of frame, FULL-BODY, captured at the loaded action instant with MOTION + EFFECTS visible.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked. EFFECTS, MAGIC, MOTION — let them BLOOM.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MALE_ADVENTURER: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      class: charClass,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

An atmospheric event happening in the world around him — render as a visible secondary focal point (NOT eclipsing him). Adds awe / story to the frame. NEVER combat or enemies.

`
      : '';

    return `You are a fantasy concept-art painter writing a CANDID ADVENTURING scene for DragonBot — a single MAN of a SPECIFIC D&D × LOTR fantasy race, of a specific class, doing his adventurer thing out in the wild. LOTR / GoT / Elden Ring / Skyrim / Witcher tradition. He is ALIVE, CAPABLE, road-tested, in a story-rich candid moment.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a MAN. The word "man" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "adventurer", "rogue", "ranger", "mage", "paladin", "warrior" or any other gender-ambiguous noun for "man" in the opening. Opening MUST read: "a [race-coded] MAN [doing action] in [landscape]..." — "man" comes BEFORE any class noun. Use he/him/his throughout. The class slot describes his ROLE, not his gendered noun — append role AFTER "man" appears.

━━━ ABSOLUTE BANS — NSFW-CLEAN, COMBAT-CLEAN ━━━
• NO combat, NO mid-strike, NO weapon-aimed-at-foe, NO enemy in frame, NO fallen body, NO wounded character, NO blood-fight
• Weapons stay holstered / sheathed / slung / carried — NEVER in active combat use
• NO male-cheesecake: NO "shirtless" / "bare-chested" / "oiled pecs" / "strategically torn" / "rugged hero pose" / "smoldering" / "form-fitting" / "skin-tight"
• His outfit reads FUNCTIONAL + COVERED — sleek adventuring gear, not sexualized
• NO posing for the camera. NEVER staged. Candid moment, body in motion or charged stillness

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. He is ALONE in his moment.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
The adventurer is the MAIN SUBJECT. His face, gear, race, action, and pose are the DRAW. He occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / accessory / face / race-anatomy all CLEARLY READABLE.

━━━ HIS RACE (LOCKED — render him unmistakably as THIS lineage) ━━━
${race}

Race is NON-NEGOTIABLE. Render the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features, and beard (where the race entry specifies one). Drow = obsidian-grey skin and white-silver hair, beardless. Tiefling = horns and slit-pupil eyes. Dragonborn = scaled face and draconic snout, beardless. Half-orc = green-grey skin and tusks. Mountain dwarf = heavily-braided beard with iron clan-rings. Rohirrim = golden-blond braided beard. Nord = blond braided beard. Beards are male-coded for many races — RENDER THEM if the race entry calls for them. Race is the HERO of identity.

━━━ HIS CLASS (his role / energy — informs how he carries himself) ━━━
${charClass}

━━━ HIS COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} man with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements (race / class / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible (this is fantasy, not sci-fi — no sealed helmet).

━━━ THE ACTION — what he is doing RIGHT NOW (CANDID, NEVER COMBAT) ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. The action defines body position. Render it EXACTLY — body weight visible, captured at a loaded instant. Purposeful, capable, mid-motion — never staged.

━━━ THE LANDSCAPE (the wild stage — fantasy biome) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rocks / vegetation / camp gear / cliff-edge) → MIDGROUND landscape body + him → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop. The landscape sets the stage but never competes with him for focus.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying the wider world. NEVER foreground or competing with him for attention.

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

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see his face and race clearly. NEVER walking head-on toward camera. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near his feet (gear, rocks, vegetation, trail-edge). MIDGROUND: HIM, full body, mid-action, 25-40% of frame. BACKGROUND: the landscape receding into atmospheric haze.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] MAN [doing exact action] in [landscape]" — race-noun "man" leads], [he wears [outfit] with full material detail], [his skin + eyes + hair + beard locked from DNA slots], [signature accessory visible], [the fantasy landscape wrapping around him — depth + atmospheric layers], [lighting + atmosphere particles], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded man] [DOING ACTION]" — man comes BEFORE rogue / ranger / mage / paladin / etc. He fills 25-40% of frame, FULL-BODY, captured at the loaded candid instant.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  MALE_ACTION_SCENES: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      class: charClass,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

A magical / atmospheric event amplifying the action — render as a visible secondary focal point. Adds awe / chaos / story.

`
      : '';

    return `You are a fantasy concept-art painter writing a PEAK-ACTION CINEMATIC MOMENT for DragonBot — a MAN of a SPECIFIC D&D × LOTR fantasy race, of a specific class, captured at the apex of dynamic action. LOTR / GoT / Elden Ring / Skyrim / Witcher / Warcraft visual lineage. He is ALIVE, mid-motion, RIPPING with cinematic energy.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a MAN. The word "man" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "mage", "rogue", "ranger", "paladin", "warrior" or any other gender-ambiguous noun for "man" in the opening. Opening MUST read: "a [race-coded] MAN [doing action] in [landscape]..." — "man" comes BEFORE any class noun. Use he/him/his throughout. The class slot describes his ROLE, not his gendered noun — append role AFTER "man" appears.

━━━ ABSOLUTE BANS — NSFW-CLEAN ━━━
• NO male-cheesecake: NO "shirtless" / "bare-chested" / "oiled" / "strategically torn" / "rugged hero pose" / "smoldering" / "form-fitting" / "skin-tight"
• His outfit reads FUNCTIONAL + COVERED — sleek action gear, not sexualized
• NO posing for the camera. NEVER staged. Captured at a cinematic loaded INSTANT
• NO real-world ethnic / historical costume codes — STRICT WESTERN HIGH FANTASY ONLY

━━━ THIS IS PEAK ACTION — NOT A CANDID MOMENT ━━━
The action axis describes a CINEMATIC MID-ACTION BEAT — mid-spell at the apex of a fireball, mid-loose with arrow streaking from his bow, mid-leap from a rooftop in a chase, the moment of summoning, the second a paladin's hammer crashes down, the instant a rogue's blade reverses for a kill.

━━━ MULTI-EFFECT STACK — MANDATORY ━━━
Every render MUST show AT LEAST 2-3 LAYERED VISIBLE EFFECTS / DYNAMIC ELEMENTS happening SIMULTANEOUSLY. ONE effect = boring. STACK them:
• PRIMARY: his direct action (spell-released / arrow-loosed / blade-arc / leap-mid-air / portal-cracking)
• SECONDARY: environmental reaction (debris kicked up / glass shattering / dust cloud / sparks raining / spell-light blooming outward / shockwave radiating / hair-and-cloak whipped by magical wind / motion-blur on his swung arm)
• TERTIARY (scene context): active background — fleeing crowd / collapsing tower / distant explosion / arrow-volley overhead / dragon shadow / allied caster also mid-spell / battle silhouettes / cracking flagstones / smoke billowing / burning building / charging cavalry / scattered enemies retreating

The frame should be ALIVE with chaos / motion / magic — not just him with one effect on a quiet background. THINK MOVIE-POSTER PROMOTIONAL STILL — every quadrant of the frame has something happening.

━━━ SCALE THE MAGIC UP ━━━
If the action involves magic, don't render a wisp — render a MAELSTROM. Not just a fireball — a fireball amid arcing tendrils of secondary flame and glowing-rune wake. Not just lightning — lightning forking down WITH an arcane storm circle radiating from his feet. Not just a portal — a portal CRACKING REALITY with creatures emerging and the air rippling. The magic should DOMINATE its quadrant of the frame.

━━━ SOLO PROTAGONIST ━━━
ONE character — he is the focus. Enemies / targets / mooks may exist in the scene but as scale-provers / context, NEVER eclipsing him. No fallen-body gore. No fights between two equally-prominent figures. HE is the show.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
His face, gear, race, action, and pose are the DRAW. He occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / accessory / face / race-anatomy all CLEARLY READABLE.

━━━ HIS RACE (LOCKED — render him unmistakably as THIS lineage) ━━━
${race}

Race is NON-NEGOTIABLE. Render the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features, and beard (where the race entry specifies one). Beards are male-coded for many races — RENDER THEM if the race entry calls for them. Race is the HERO of identity.

━━━ HIS CLASS (his role / energy — informs HOW the action reads) ━━━
${charClass}

━━━ HIS COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} man with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split('—')[0].trim()}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All eight DNA elements (race / class / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible. NO sealed helmet (this is fantasy).

━━━ THE PEAK-ACTION BEAT — what he is doing AT THIS EXACT INSTANT ━━━
${action}

Render at the LOADED INSTANT — body in motion, motion-blur where appropriate, effects in full bloom, the moment the camera caught him in. NOT before, NOT after — AT IT. Effects-rich, lit by the magic / fire / energy he is wielding.

━━━ THE LANDSCAPE (the stage — action-scene context) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rubble / sparks / spell-residue / debris) → MIDGROUND him + the action → DEEP DISTANCE atmospheric layers / cityscape / battle-context. The landscape SETS the scene's stakes — burning towers, lantern-lit night market, magic-storm horizon, dragon attack on castle, collapsing dungeon.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary detail amplifying the action ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying wider stakes (fleeing enemies / falling banners / arcane sparks / scattered coins / hovering scrolls / fleeing crowd / smoldering ruin). NEVER eclipses him.

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

━━━ COMPOSITION — DYNAMIC ANGLES ━━━
Action shots benefit from DYNAMIC camera angles. Mix across renders: three-quarter / dutch-tilt / low-angle hero / over-shoulder / sweeping pursuit / dramatic upshot. NEVER head-on at the camera. NEVER posing. FOREGROUND: tactile action detail (rubble / sparks / motion-blur / spell-residue). MIDGROUND: HIM, full body, AT THE PEAK INSTANT, 25-40% of frame. BACKGROUND: the action-scene landscape with stakes visible.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] MAN [PEAK-ACTION verb] in [action landscape]" — race-noun "man" leads, then immediately the peak-action beat], [he wears [outfit]], [his skin + eyes + hair + beard from DNA], [signature accessory IN MOTION], [the landscape with action-stakes], [lighting + effects + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded man] [PEAK-ACTION-VERB]" — man comes BEFORE class. The action verb IS the composition driver. He fills 25-40% of frame, FULL-BODY, captured at the loaded action instant with MOTION + EFFECTS visible.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked. EFFECTS, MAGIC, MOTION — let them BLOOM.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGONBOT_DARK_REALM: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, scene, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ CURSED ATMOSPHERIC PHENOMENON — render this visibly ━━━
${phenomenon}

A dark / corrupted / supernatural event woven into the realm — render as a visible focal point. Amplifies the menacing mood.

`
      : '';

    return `You are a dark-fantasy concept-art painter writing DARK REALM scenes for DragonBot — corrupted wastelands, necromancer kingdoms, fallen empires, cursed lands. STRICT WESTERN HIGH FANTASY — Mordor / Shadowfell / Dark Souls / Bloodborne / Diablo / Sword of Truth / Witcher's-Wild-Hunt visual lineage. Beautiful but MENACING. The land itself feels hostile, wrong, corrupted.

━━━ THE MOOD — NON-NEGOTIABLE ━━━
MENACING + BEAUTIFUL + HOSTILE + CORRUPTED + OPPRESSIVE. The viewer should feel UNEASE. Not horror-gore, not slasher — DARK FANTASY DREAD. The world is wrong here.

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ visually-arresting elements simultaneously:

  1. **PRIMARY DARK SCENE** — the corrupted landscape at maximum scale (blighted forest / poisoned wetland / ash plain / cursed necropolis / demon-touched volcanic / sundered abyss-edge)
  2. **ARCHITECTURE ANCHOR** — dark citadel / necromancer tower / bone-throne / cursed shrine / Gothic cathedral / demon-summoning circle, positioned at midground or deep distance
  3. **CURSED PHENOMENON** — blood rain / ash storm / spectral mist / sickly aurora / blackened sun / eldritch storm / void-tear / nightmare-bird flock, dominating its quadrant
  4. **SCALE PROVER** — tiny hooded wanderer / cursed knight / lone pilgrim (5-15% of frame max) OR dark wildlife (raven flock / shadow-wolves / corpse-eating crows) OR cursed object (fallen banner / abandoned helm / chained body in the mist)

THINK Diablo-cinematic / Sword-of-Truth-cover / Mordor-establishing-shot — every frame should make the viewer GASP at the DARK BEAUTY.

━━━ TILT DARK + MENACING EVERYWHERE ━━━
Every quadrant signals "wrong": twisted trees, blackened stone, sickly glow, blood-stained ground, ash-fall, dead silence implied, vines like black veins, rivers running dark. The world IS the threat.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cosmic / nebulas / sky-whales / floating islands / orbital structures
🚫 NO modern / industrial architecture (no lighthouses / clocktowers / factories)
🚫 NO real-world ethnic codes
🚫 NO gratuitous gore / slasher / explicit horror — DARK FANTASY DREAD only (some bone / fallen helm / blood-tinted river is fine; visceral organ-stew is NOT)
🚫 NO living dragons in the scene (those are dragon-scene / dragon-lore paths)
✓ Mordor / Shadowfell / Dark Souls / Bloodborne / Diablo / Witcher's Wild Hunt / Skyrim-Soul-Cairn / Elden Ring's-Caelid / D&D-Avernus / Demon's-Souls visual lineage

━━━ THE DARK REALM SCENE ━━━
${scene}

━━━ ARCHITECTURE ANCHOR ━━━
${architecture}

The architecture is fantasy-canon dark: necromancer tower / blood-cathedral / bone-throne hall / cursed obelisk / haunted keep / black-iron fortress / Gothic spire / demon-altar / void-shrine / fallen-empire ruin. Positioned at midground or deep distance.

━━━ SKY OVERHEAD ━━━
${sky_layer}

The sky is OPPRESSIVE — never blue, never clean. Storm-bruised / ash-fall / blood-red / sickly-green / blackened-sun / void-purple. The sky weighs on the land.
${phenomenonSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground. Optional tiny figure (hooded wanderer / cursed knight / pilgrim) at 5-15% of frame max — they are UNNERVED, REVERENT, INVESTIGATING, NEVER combat / NEVER action. OR dark wildlife / cursed object.

━━━ LIGHTING (ominous / sickly / volcanic / moonlit / Bloodborne-coded) ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile wrong detail — blackened stones / fallen banner / dead branches / blood-streaked moss / withered roots
• MIDGROUND: the dark scene's body — necropolis / ruined fortress / blighted forest / poisoned river — where the architecture anchors
• DEEP DISTANCE: atmospheric layer — distant ash-clouds / corrupted peaks / horizon of storm / pale-glowing portal
• SKY: oppressive overhead — storm-bruised / blood-red / ash-fall / blackened-sun / void-purple

Multi-element stacking: scene + architecture + cursed phenomenon (80% gated) + tiny figure scale-prover all in frame. Movie-poster intensity.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[scene description]" — scene leads], [architecture anchoring at midground / deep distance], [the oppressive sky], [phenomenon if rolled], [surprise element at midground / edge], [lighting and atmospheric detail], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. Beautiful but MENACING — every frame is a Diablo-cinematic establishing shot.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGONBOT_DRAGON_LORE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, scene, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render this visibly in the scene ━━━
${phenomenon}

A magical / atmospheric event woven into the lore-scene — render as a visible focal point. Amplifies the "ancient mystery" mood.

`
      : '';

    return `You are an archaeological-fantasy concept-art painter writing DRAGON LORE scenes for DragonBot — ancient evidence of dragons. Massive skeletal remains, weathered murals depicting dragon wars, abandoned lairs with scattered treasure, fossilized eggs, ruined temples built to worship dragons, crumbling dragon-rider outposts. The dragons are GONE but their presence echoes everywhere. STRICT WESTERN HIGH FANTASY — LOTR / GoT / Skyrim / Witcher / Warcraft / D&D / Elden Ring visual lineage.

━━━ THE MOOD — NON-NEGOTIABLE ━━━
WONDER + MELANCHOLY + REVERENCE + LOST GRANDEUR. The viewer should feel: "something immense lived here once". Not a battle. Not living dragons. ABSENCE made visible. Mystery. The weight of forgotten civilizations.

━━━ THE SCALE OF ABSENCE — NON-NEGOTIABLE ━━━
Massive dragon bones dwarf any human element. Ancient murals stretch across cathedral walls. Abandoned hoards gather dust in cavernous lairs. Skeletons the size of mountains. Eggs the size of carriages. Everything whispers: something immense lived here once.

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ visually-arresting elements simultaneously:

  1. **PRIMARY LORE-SCENE** — the dragon-evidence at MAXIMUM scale (skeleton stretching the entire frame / mural the size of a cathedral wall / hoard knee-deep across a vast vault / egg the size of a carriage)
  2. **ARCHITECTURE ANCHOR** — dragon-temple / aerie / bone-cathedral positioned to dwarf any human, scale-proven against the dragon-evidence
  3. **DRAGON-HABITAT PHENOMENON** — the never-before-seen habitat feature dominating its quadrant (petrified-fire glass forest / crystallized-tear salt-flat / glass-tree grove / ash-snow / blood-geyser field / prism-canyon / bone-coral reef / time-paused rainstorm / phosphorescent blood-veins / etc.). THE HABITAT IS THE DRAMA — unique evidence of dragon-presence transforming the world.
  4. **SCALE PROVER** — tiny scholar/explorer figure (5-15% of frame) OR wildlife OR abandoned artifact making the impossible scale feel earned

The frame should be a movie-poster establishing shot — Peter-Jackson-LOTR-extended-cut, but tilted toward DRAGON-TOUCHED-WORLD impossibility. The world bears the dragon's mark in ways no other world could.

━━━ TILT TOWARD DRAGON-CODED EVERYWHERE ━━━
Every quadrant should signal "dragon was here": claw-marks in stone / scale-fossils underfoot / bone-coral structures / petrified-flame-residue / glass-fused trees / dragon-rune carvings / dragon-silhouette echoes in the cliff-shapes. The world IS dragon-history made visible.

━━━ TINY FIGURES PERMITTED (and encouraged as scale provers) ━━━
UNLIKE the pure-landscape path, dragon-lore PERMITS tiny human figures — scholars, explorers, archaeologists, awe-struck pilgrims, lone-wanderer-finding-a-relic. They are AWED, REVERENT, INVESTIGATING — never combat, never action. Their purpose is SCALE-PROVING and MOOD-SETTING. Render them as TINY silhouettes at midground or deep midground — 5-15% of frame height max, never the focus. The eye lands on the LORE, not on them.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cosmic / nebulas / floating islands / sky-tears / orbital structures / sky-whales / Hubble-deep-field skies
🚫 NO real-world ethnic codes (no pagoda-coded temples / no Egyptian-coded pyramids — use fantasy-canon analogues like dwarven holds / Mordor-coded ruins / Carian academies)
🚫 NO modern / industrial architecture (no lighthouses / windmills / clocktowers / steel structures)
🚫 NO living dragons in the frame — that's dragon-scene. THIS is the AFTERMATH, the RUIN, the ECHO.
✓ Ancient dragon-skeletons / weathered murals / abandoned hoards / fossilized eggs / ruined dragon-temples / crumbling dragon-rider outposts / cracked dragon-eggshells / mummified dragon-wings / petrified-dragon-stone / runic dragon-tomb-markers

━━━ THE DRAGON LORE SCENE ━━━
${scene}

━━━ ARCHITECTURAL CONTEXT ━━━
${architecture}

The architecture is fantasy-canon: cathedral-dragon-temple / cliff-cut-roost / underground-vault / mural-hall / colonnade-of-bones / standing-stones-shrine / sky-spire-aerie / mountain-tomb. Built TO or FOR dragons — scale shows it.

━━━ SKY OVERHEAD ━━━
${sky_layer}
${phenomenonSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying the wider mystery. Tiny scholar figure / wildlife / abandoned artifact / scattered relic / weathered banner. NEVER eclipses the lore-scene.

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

━━━ COMPOSITION ━━━
MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile evidence — fragments of bone / fallen rune-stones / cracked egg-shell / scattered gold-coins-in-dust / vine-claimed claw-marks-in-stone
• MIDGROUND: the main lore-element — the dragon-skeleton / the mural-wall / the abandoned-hoard / the temple-interior / the dragon-rider-monument
• DEEP DISTANCE: atmospheric layer or supporting context — distant peaks / vault-ceiling fading into darkness / mountain-valley containing the ruin
• SKY: dramatic overhead element — god-rays through broken roof / aurora through ruined dome / storm-light through colonnade

Multi-element stacking: scene + architecture + atmospheric phenomenon (80% gated) + tiny figure scale-prover all in frame. Movie-poster intensity.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[lore-scene description]" — scene leads], [the architectural context anchoring it], [the sky overhead], [phenomenon if rolled], [surprise element / tiny figure at midground], [lighting and atmospheric detail], [color palette and mood]

DRAMATIC VISUALS: render the EXACT slot-pool details above. The dragons are GONE — show their absence at impossible scale.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  ARCANE_SPACES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, hall, magic_phenomena } = slots;
    const phenomena = Array.isArray(magic_phenomena) ? magic_phenomena : [magic_phenomena];

    return `You are a fantasy concept-art painter writing GRAND ARCANE INTERIOR SPACES for DragonBot — vast magical architectural marvels saturated with active magic. NO CHARACTERS. The architecture is the hero, the magic phenomena are the show. Strict Western high fantasy.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Pure environment. ABSOLUTELY NO people, no robed-figures-at-base, no tiny-silhouettes-on-the-stair, no monks, no wizards, no humanoid figures of any kind anywhere in the frame. NEVER mention "figure" / "silhouette" / "hooded one" / "robed mage" / "figures arrayed" — the SPACE itself tells the story. If the urge arises to add a "lone figure for scale" — DO NOT. The architectural scale and magical phenomena provide their own scale.

━━━ GRAND INTERIOR SCALE + VARIETY — NON-NEGOTIABLE ━━━
The space is SUBSTANTIAL (not intimate cottage) but the EXACT shape varies per render — sometimes cathedral-vaulted, sometimes a soaring stairwell, sometimes a multi-tier circular library viewed up/down, sometimes a long banquet hall, sometimes a wide throne-room, sometimes a floating-platform library, sometimes a gateway-arch chamber. Render the SPECIFIC interior type from the slot — honor the architectural shape described. Variety across batches is mandatory.

Lean toward architectural richness when in doubt: multi-tier galleries, layered lanterns at every level, vertical depth, iron-railed mezzanines — these compositions consistently produce stronger renders than flat horizontal-gallery shots.

━━━ MAGIC SATURATION MANDATE — EVERY SURFACE ALIVE ━━━
The space is BUZZING with active magic, not "magical-themed decor." NOT a clean hall with 3 magical accents — the ENTIRE SPACE is alive with magic at every level. The eye should land on something magical EVERYWHERE it looks.

Render ALL THREE of these primary phenomena VISIBLY in the frame, stacked at different points in the space:

  • PHENOMENON 1: ${phenomena[0] || ''}
  • PHENOMENON 2: ${phenomena[1] || ''}
  • PHENOMENON 3: ${phenomena[2] || ''}

PLUS layer ALL of these throughout the space (obsessive density):
• EVERY COLUMN has glowing runic carvings pulsing in slow rhythm
• EVERY FLOOR TILE has faint inlaid runes catching light
• EVERY WALL has carved magical-script glowing softly
• THE AIR is THICK with glowing motes / sparkles / magical-pollen / floating particles
• THE CEILING has floating spell-orbs / suspended glowing crystals / hanging magical-lanterns
• SHELVES + ALCOVES + PEDESTALS each hold their own glowing magical artifact — glowing potion-bottles, jarred magical specimens, polished crystals, ancient relics
• DRIFTING MAGICAL MIST coils across the floor between columns
• MULTIPLE smaller spell-circles glow at various points beside the main one
• SCATTERED FLOATING OBJECTS — books / scrolls / orbs / crystals — hovering at varying heights
• ARC-LIGHTNING flickering between columns / between crystals / through suspended energy-globes
• MULTI-COLORED FLAME-BRAZIERS at column-bases (emerald / violet / silver / amber)

The cumulative effect: the viewer cannot find a quiet corner. Every quadrant has 2-3 active magical effects happening. The space is ALIVE.

━━━ MOVIE POSTER MANDATE — STACK EVERY QUADRANT ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Multi-tier depth:
• FOREGROUND TIER (front 20%): tactile detail — column-base with runic-carvings / runic-floor section / suspended floating orb close to viewer / brass railing with runic-inlay / shelf-edge with glowing potion-vials / a stone balustrade
• MIDGROUND TIER (middle 50%): the primary architecture + the featured magical phenomena
• DEEP-DISTANCE TIER (back 30%): more architecture receding / atmospheric magical-haze / additional phenomena at distance

🚫 BANNED CENTRAL COMPOSITION: NEVER put a single open book / grimoire / tome on a central altar / pedestal / plinth as the main focal element. The "open glowing tome on altar" composition is cheesy fantasy-cliche. Books and grimoires are PERMITTED as SIDE clutter (on shelves, scattered on tables, floating in the air alongside other magic) but NEVER as the centered focal subject on a raised plinth. If a pedestal is central, put something else on it — a hovering crystal cluster, a brass orrery, a scrying-bowl, a glowing artifact, a sigil-stone, etc. — NOT an open tome.

The eye should land on 4+ different magical details in different quadrants.

━━━ MULTIPLE STACKED LIGHT SOURCES (MANDATORY ≥3) ━━━
The space glows from MULTIPLE COMPETING SOURCES at once:
• God-rays through stained-glass windows
• Glowing floor-runes lighting from below
• Floating spell-orbs casting colored halos
• Ambient magic-haze
• Crackling arc-lightning highlights
• Glowing crystal clusters
At least 3 visibly active.

━━━ SATURATED IMPOSSIBLE COLOR ━━━
Violet / azure / emerald / amber / rose-magenta / shimmer-gold all coexisting. Heaven-tier saturation. CRANK EVERYTHING TO 11.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon-modern / orbital / cosmic
🚫 NO modern (no industrial / electric bulbs / plastic / chrome)
🚫 NO real-world ethnic-coded interiors (no Forbidden-City / Persian / Aztec / etc.)
🚫 NO characters / figures
✓ LOTR / GoT / Hogwarts / D&D / Witcher / Elden Ring / Warcraft lineage

━━━ THE ARCANE SPACE ━━━
${hall}

The space is rendered at GRAND SCALE — architectural features readable, depth extending into atmospheric haze, columns and ornament clearly visible.

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

━━━ STRUCTURE — write the prompt in this order ━━━
CRITICAL: lead with the architecture + the first magical phenomenon for early-token weighting. Open with the space, immediately fuse with active magic.

[OPENING: "[space description] at grand scale, [phenomenon 1] dominating central space"], [phenomenon 2 at midground], [phenomenon 3 at deep distance or ceiling], [foreground tactile anchor — glowing grimoire / runic-floor / floating-orb / brass-railing], [obsessive magic-density layers — glowing-rune-carvings on every column / floating-motes throughout / scattered active spell-circles / drifting magical-mist / floating spell-orbs / arc-lightning between conduits / multi-colored brazier-flames], [stacked light sources], [color palette + mood]

DRAMATIC VISUALS: render the EXACT space + ALL THREE phenomena from slots. OBSESSIVE-DENSITY magic-overload — every column glows, every surface has runic carvings, the air is thick with motes, drifting magical mist coils across the floor. NO characters. NO figures.

Output ONLY the raw 160-220 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  ARCANE_HALLS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, hall, caster, spell_moment, magic_phenomena } = slots;
    const phenomena = Array.isArray(magic_phenomena) ? magic_phenomena : [magic_phenomena];

    return `You are a fantasy concept-art painter writing GRAND ARCANE MAGIC MOMENTS for DragonBot — a single spellcaster caught at the apex of their magical moment inside a grand magical interior. The character is the FOCAL POINT and MAGIC IS PARAMOUNT, visibly pouring from them and saturating the space. LOTR / GoT / Hogwarts / D&D / Witcher / Elden Ring visual lineage. Strict Western high fantasy.

━━━ THE MAGIC MOMENT — ROOM-FILLING SATURATION ━━━
ONE spellcaster (mage / cleric / sorceress / druid / warlock / archmage / necromancer / etc.) at the LOADED INSTANT of a MAJOR spell — and the magic is NOT a small effect at their hands. The magic SATURATES THE FRAME. The caster is INSIDE / WRAPPED BY / ENVELOPED IN the spell, not just adjacent to it.

Think Doctor Strange opening a portal that fills the cathedral / Wanda erupting chaos-magic that consumes the room / Saruman summoning a storm that fills the tower / Gandalf at Khazad-dûm becoming the white-fire — the spell IS the room.

━━━ MAGIC FILLS 60%+ OF THE FRAME — NON-NEGOTIABLE ━━━
The spell-effect must DOMINATE the frame's visual surface area. Examples of correct intensity:
• A vortex of swirling fire filling the entire upper half of the frame, embers raining throughout the room, the caster at the center
• A storm-cell of lightning with dozens of forks cracking floor-to-ceiling through the whole room, the caster wreathed in arc-glow
• A massive portal blooming so large it fills 70% of the frame, the caster a silhouette before its swirling depths
• Fel-energy tendrils wrapping the entire room in violet light, the caster at the heart with energy flowing through them
• A vast spell-circle ten meters across blazing on the floor with magical-light pillars rising from every rune
• Cascading holy-light pouring from above and below at once, the caster floating at the center of overlapping light-columns

NOT a wisp of smoke. NOT a bolt of lightning. NOT a small flame-orb. FULL ROOM-FILLING SATURATION.

The character occupies 20-30% of frame, OFF-CENTER, with the magic CONSUMING the rest of the frame and visibly INTERACTING with their body — hair lifted by the magical wind, robes whipping in the energy, body silhouetted by the light from within the spell. NOT posing. NOT looking at viewer. INSIDE the magic.

━━━ MAGIC IS THE SHOW — STACK THE EFFECTS ━━━
Every render MUST stack 3+ visible magical effects simultaneously:
  1. **THE CASTER\'S OWN MAGIC** — pouring from their hands / face / staff / circle / cauldron — the visible spell-effect from the spell_moment slot
  2. **AMBIENT ROOM MAGIC** — phenomena listed below + glowing-rune-carvings on columns + floating-motes thick in the air + drifting magical-mist + scattered active spell-circles + floating spell-orbs / hovering grimoires / arc-lightning between conduits
  3. **GLOWING ARTIFACTS** — potion-vials on a table glowing different colors / crystal-orb on pedestal pulsing / dragon-skull with glowing eyes on a shelf / mounted magical-relics catching light

THE TWO ADDITIONAL MAGIC PHENOMENA (render BOTH visibly in the space):
  • PHENOMENON A: ${phenomena[0] || ''}
  • PHENOMENON B: ${phenomena[1] || ''}

━━━ THE GRAND INTERIOR (the stage) ━━━
${hall}

Honor the SPECIFIC interior type from the slot — throne room / courtyard / stairwell / cathedral / vault / banquet hall / etc. Do NOT default to "vast cathedral hall with light shaft" if the slot describes something else. The interior is grand-scale (substantial, not intimate cottage) but the architectural shape varies.

━━━ THE CASTER (render exactly — RACE IS THE HERO) ━━━
${caster}

🚫 NEVER DEFAULT TO "OLD WHITE-BEARDED HUMAN WIZARD." This is Flux's strongest fantasy-caster prior and must be actively rejected. If the slot says "Drow sorceress in her thirties" — render obsidian-grey-skinned drow woman, NOT bearded-old-white-man. If the slot says "Half-orc cleric" — render green-grey-skinned half-orc with tusks, NOT bearded-old-white-man. The race + gender + age in the slot is NON-NEGOTIABLE.

Race anatomy UNMISTAKABLE:
• Drow = obsidian-grey skin + white-silver hair + violet eyes
• Tiefling = horns curling from forehead + slit-pupil eyes + red-or-violet skin
• Half-orc = green-grey skin + tusks visible
• Dragonborn = scaled face + reptilian snout
• Aasimar = alabaster skin + inner-glow + halo
• Genasi = elemental-tinted skin (sky-blue / ember-red / earth-bronze / etc.)
• Gnome = small stature + wild colorful hair
• Tabaxi = furred face + slit-pupil eyes
• Wood Elf = pointed ears + leaf-green eyes
• Firbolg = blue-grey skin + pointed ears
• Goliath = ash-grey skin + clan-markings
• Shadar-kai = bone-pale ashen skin + silver eyes
• Halfling = small stature + youthful round face

The character is the visual hook at 25-35% of frame, off-center.

━━━ THE SPELL MOMENT — what magic is happening RIGHT NOW ━━━
${spell_moment}

The magic is at PEAK INTENSITY — frozen at the most jaw-dropping moment. Visible, saturated, multi-colored. Effects bloom outward from the caster into the space.

━━━ ROOM-WIDE MAGIC OVERLOAD ━━━
The interior is BUZZING with magic, not just the caster\'s spell:
• EVERY COLUMN has glowing runic carvings pulsing softly
• THE AIR is thick with glowing motes / sparkles / magical-pollen / drifting particles
• SCATTERED active spell-circles glow at various points on the floor / walls
• FLOATING spell-orbs / hovering grimoires / suspended crystals dot the space
• ARC-LIGHTNING flickering between columns or crystals
• MULTI-COLORED FLAMES burning in braziers (emerald / violet / amber / silver)
• GLOWING POTION-VIALS / artifacts on tables and shelves around the caster
• DRIFTING MAGICAL MIST coiling between columns

━━━ MULTIPLE STACKED LIGHT SOURCES (≥3) ━━━
God-rays through stained-glass + glowing floor-runes from below + the caster\'s own spell-glow + floating spell-orb halos + crackling arc-lightning + glowing crystal clusters. The space glows from MULTIPLE COMPETING SOURCES.

━━━ SATURATED IMPOSSIBLE COLOR ━━━
Violet / azure / emerald / amber / rose-magenta / shimmer-gold all coexisting in the frame. Heaven-tier saturation. CRANK EVERYTHING TO 11.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon-modern / orbital / cosmic
🚫 NO modern (no industrial / electric bulbs / plastic / chrome)
🚫 NO real-world ethnic-coded interiors (no Forbidden-City / Persian / Aztec / etc.)
🚫 NO additional figures — solo caster only
✓ LOTR / GoT / Hogwarts / D&D / Witcher / Elden Ring / Warcraft / fantasy-novel-cover lineage

━━━ SOLO CASTER ONLY ━━━
ONE character. No second figure, no enemies, no apprentices, no crowds. The caster is alone in their magical moment. A small familiar (raven / cat / wisp) is permitted.

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

━━━ MOVIE POSTER MANDATE — STACK EVERY QUADRANT ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 4+ visually arresting elements:

  1. **THE CASTER + ROOM-FILLING SPELL** in midground left-or-right (25-35% of frame, off-center, wrapped in the saturated magic)
  2. **ARCHITECTURAL ORNAMENT** clearly readable — columns / stained-glass / arches / chandeliers / vaulted ceiling / mosaic floor / suspended banners — the room is VISIBLE and detailed alongside the magic, NOT consumed by it
  3. **FOREGROUND TACTILE ANCHOR** at the front of the frame — a cluster of glowing potion-vials on a table / a floating crystal-orb / a brass orrery / a runic-floor section / a column-base with runic-carvings / a stone balustrade / shelf-edge with magical clutter — the eye lands here first. 🚫 NEVER an open tome / grimoire / book on a central pedestal — that composition is cheesy fantasy-cliche; books are permitted as SIDE clutter, NEVER as the centered focal anchor
  4. **AMBIENT MAGIC PHENOMENA** beyond the caster's central spell — floating sigils orbiting columns / drifting magical-motes throughout the air / suspended spell-orbs at the ceiling / scattered active spell-circles on the floor / glowing-rune-carvings on every wall

THE EYE SHOULD LAND ON 4 DIFFERENT DETAILS in the frame. Not just "caster + spell" symmetric and centered. Off-center the caster, fill foreground with magical-clutter, show the architecture, layer ambient magic everywhere.

━━━ MULTI-TIER DEPTH — NON-NEGOTIABLE ━━━
• FOREGROUND TIER (front 20% of frame): tactile magical detail anchoring the viewer — glowing pedestal / floating orb / runic-floor / open grimoire / spell-orb cluster
• MIDGROUND TIER (middle 50%): the caster off-center wrapped in their room-filling spell, the ambient magic phenomena, the architectural feature
• DEEP-DISTANCE TIER (back 30%): the grand interior receding into magical haze — more columns / more stained-glass / more architectural depth / more ambient magic at distance

Flat compositions are FAILED. Multi-tier depth is mandatory.

━━━ STRUCTURE — write the prompt in this order ━━━
CRITICAL: the OPENING TOKENS must lead with RACE + CLASS — Flux early-token weighting collapses any "elderly / middle-aged male / young female" lead into "old white-bearded wizard." Always open with "A [RACE] [CLASS]" (e.g., "A Drow sorceress" / "A Tiefling warlock" / "An Aasimar cleric").

CRITICAL: the SECOND structural beat must be the FOREGROUND ANCHOR (a glowing tactile detail at the front of frame) — Flux uses early prompt context to set composition, so introducing the foreground tier early forces the multi-tier composition. NOT the architecture, NOT the spell, the FOREGROUND ANCHOR first after the caster.

[OPENING: "A [RACE] [CLASS], [age + gender + outfit specifics], wrapped in [spell_moment room-filling effect]"], [FOREGROUND ANCHOR: open glowing-grimoire on pedestal / cluster of glowing potion-vials / floating crystal-orb / runic-floor section catching the eye at the front of frame], [the GRAND INTERIOR architecture clearly visible — columns / stained-glass / arches / vaulted ceiling — alongside the magic], [the two ambient phenomena visible at midground and deep distance], [room-wide magic overload — runic columns / motes / floating spell-orbs / glowing artifacts in alcoves], [stacked light sources], [color palette + mood]

DRAMATIC VISUALS: render the EXACT caster + spell moment + hall + ALL TWO ambient phenomena from slots. The caster is mid-action with their magic POURING out. The interior is BUZZING with ambient magic. Magic is PARAMOUNT — every quadrant has magical effects happening.

Output ONLY the raw 140-200 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  ICONIC_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, sky_layer, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ MAGICAL / ATMOSPHERIC PHENOMENON — render this visibly in the scene ━━━
${phenomenon}

A magical or atmospheric event woven into the landscape — render as a visible focal point that AMPLIFIES the iconic aesthetic.

`
      : '';

    return `You are a fantasy concept-art painter writing ICONIC STYLIZED FANTASY LANDSCAPES for DragonBot. Vast cinematic vistas in the BLENDED TRADITION of Tolkien-mythic-grandeur AND Blizzard-hand-painted-stylized concept art. Recognizable archetypal biomes — the kind of vista where the viewer instantly thinks "Shire-coded" or "Mordor-coded" or "Moonglade-coded" or "Fel-Corrupted." Strict Western high fantasy.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Pure landscape. NO foreground figures. NO heroes. NO orcs / elves / humans / dwarves / hobbits in frame. Distant beast / dragon / griffin silhouettes against horizon at SCALE-PROVER size OK only. The landscape is the hero.

━━━ ICONIC STYLIZED AESTHETIC — NON-NEGOTIABLE ━━━
This is NOT the realistic-coded main-landscape path. This is the HAND-PAINTED-STYLIZED-CONCEPT-ART tradition — Samwise Didier / Glenn Rane / John Howe / Alan Lee / Wei Wang / Peter Lee / Ted Nasmith visual lineage. The aesthetic must be:
• **SATURATED COLOR** — bold, theatrical, oversaturated palette. Not muddy realism.
• **HAND-PAINTED STYLIZATION** — visible painted-brushwork feel. Not photoreal CGI.
• **ICONIC ARCHETYPAL** — instantly recognizable: this is THE Shire-coded vista / THE Mordor-coded plain / THE Moonglade-coded grove / etc.
• **THEATRICAL LIGHTING** — heightened god-rays / dramatic sunset / impossible aurora / luminous fey-glow — NOT subtle natural light
• **VIBRANT MYTHIC SCALE** — vertigo-inducing scale with painted clouds, impossible peaks, oversized features

━━━ MOVIE POSTER MANDATE ━━━
Every render MUST stack 3+ visually arresting elements:
  1. **THE ICONIC BIOME** at maximum painted-scale (the recognizable archetypal vista)
  2. **A SATURATED THEATRICAL SKY** (sunset / aurora / blood-red / fel-green / moonglow / cathedral-cloud) dominating its quadrant
  3. **ATMOSPHERIC PHENOMENON** (if rolled — magical glow / dragon-shadow / portal-flicker / leyline-scar / fey-light cluster)
  4. **SCALE PROVERS** — distant flying-mount silhouettes / banner-strung distant tower / scattered standing-stones / a herd of fantasy beasts at midground edge

━━━ STRICT WESTERN HIGH FANTASY — NO FRANCHISE PROPER NOUNS ━━━
🚫 NEVER write franchise-specific names: NO "Azeroth" / "Stormwind" / "Mordor" / "Rivendell" / "Pandaria" / "Northrend" / "Lothlorien" / "Sylvanas" / "Thrall" / "Aragorn" / "Frodo" / "Outland" / "Argus" / etc. Describe the AESTHETIC generically.
🚫 NO sci-fi / cyberpunk / neon / orbital
🚫 NO modern (no industrial / electric / plastic / chrome)
🚫 NO real-world ethnic-coded settings (no Bedouin / Persian / samurai / etc.)
🚫 NO characters / foreground figures
✓ Tolkien + Blizzard + D&D + Witcher + Elden Ring visual lineage (BLENDED, not franchise-specific naming)

━━━ THE ICONIC BIOME ━━━
${biome}

The biome fills the frame. Multi-tier depth: foreground tactile detail (rocks / flora / specific terrain feature) → midground biome body → deep distance atmospheric layer + iconic feature.

━━━ THE SATURATED SKY ━━━
${sky_layer}

The sky is THEATRICAL and SATURATED — never washed-out natural-blue. Heightened color, dramatic cloud-architecture, mythic palette.
${phenomenonSection}━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
WIDE CINEMATIC PAINTED FANTASY LANDSCAPE. HAND-PAINTED-STYLIZED color and lighting — bold, oversaturated, theatrical. Foreground textural detail anchors the shot, midground biome body forms the heart, background atmospheric scale and saturated sky frame the composition. Distant scale-prover features (a single distant tower / a flying-creature silhouette / a herd of beasts / a monolith-cluster) make the painted scale impossibly large.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[biome with painted-scale features]"], [the saturated sky], [phenomenon if rolled], [tiny scale-prover at deep distance], [lighting + atmospheric detail], [color palette + mood]

DRAMATIC VISUALS: render the EXACT biome + sky + phenomenon from slots. Bold saturated painted aesthetic. NO foreground figures. NO franchise proper-nouns.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  EPIC_MOMENT: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, castle, event } = slots;

    return `You are a fantasy concept-art painter writing EPIC CASTLE SCENES for DragonBot — vast sweeping cinematic views of jaw-dropping fantasy castles with massive events unfolding at them. LOTR / GoT / Warcraft / Elden Ring / Witcher 3 / Skyrim / D&D Forgotten Realms visual lineage. Strict Western high fantasy.

━━━ THE CASTLE IS THE HERO — CLOSE-MID FRAMING, ORNATE DETAIL READABLE ━━━
The castle is the SUBJECT — vast, detailed, awe-inducing. CLOSE-MID framing: the castle fills roughly 60-70% of the frame, NOT a distant wide silhouette. Ornate architectural detail must be CLEARLY READABLE — individual windows, balconies, statuary, gargoyles, gilt-work, carved-stone friezes, banner-fabric texture, masonry-joints, ornamental crenellations, decorative tracery on tower-tops. The viewer can SEE the craft in the stone.

The castle must be:
• **MASSIVE** — dwarfing everything around it. Cliff-perched / mountain-cut / island-fortress / sky-citadel scale.
• **ORNATELY DETAILED** — individual windows, statues, gargoyles, banners, gilt-work, carved-stone tracery all readable in the frame. The architectural CRAFT is the visual hook.
• **INSPIRING** — distinctive silhouette and signature features. Distinct from generic-fantasy-castle.
• **CLOSE-MID FRAMED** — castle fills 60-70% of frame, NOT a tiny distant silhouette. The viewer is CLOSE — they can count tower-windows and see banner-embroidery. Show 2-4 major castle sections in detail rather than the full silhouette from miles away.

━━━ THE PEAK EVENT ━━━
A massive cinematic event is happening AT / IN / ABOVE / AROUND the castle. The event is the SECOND focal element, filling roughly 30-40% of the frame's visual attention. Render the event at peak intensity — frozen at the most jaw-dropping moment. The event integrates WITH the castle's detail — dragons on/near the ornate spires, portals among the carved-stone arches, siege-ladders against gargoyle-lined walls.

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ visually arresting elements:

  1. **THE CASTLE** filling 60-70% of frame with ORNATE DETAILS readable — gargoyles / statuary / window-rows / banners / gilt-work / carved-stone tracery all visible
  2. **THE PEAK EVENT** at full intensity (dragon mid-attack / portal mid-bloom / siege mid-clash / coronation mid-procession / etc.) integrated with the castle's architecture
  3. **SCALE-PROVER CROWD / ARMY / FIGURES** — soldiers on the walls / pilgrims in the courtyard / knights at the gates / city populace below / cavalry on the road — small relative to the castle but CLEARLY visible because we're closer in
  4. **ATMOSPHERIC LAYER** — banners snapping in storm-wind / smoke rising from siege-fires / magical wind / aurora behind / cathedral-cloud light-shafts / falling embers / glowing particles

THINK CLOSE-MID Minas-Tirith-gate / Hogwarts-tower-detail / Caer-Morhen-courtyard-view / King's-Landing-Red-Keep-balcony / Helm's-Deep-wall-from-attacker's-eye — close enough that the architectural ornament dominates, NOT a distant silhouette.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon / orbital / cosmic
🚫 NO modern (no electric / no industrial / no plastic / no chrome)
🚫 NO real-world ethnic / historical-period codes (no Bedouin / Persian / samurai / Aztec / Polynesian / Forbidden-City — use fantasy-canon analogues only)
🚫 NO portrait framing — this is ALWAYS wide-shot establishing
✓ LOTR / GoT / Warcraft / Elden Ring / Witcher / D&D / Skyrim castle lineage

━━━ THE CASTLE ━━━
${castle}

The castle is rendered at WIDE-SHOT scale with full silhouette readable. Multi-tier depth: foreground (approach road / outer wall / cliff-edge), midground (castle body / gates / courtyard), background (towers / spires / keep rising into sky).

━━━ THE PEAK EVENT ━━━
${event}

Render the event at PEAK INTENSITY — frozen at its most jaw-dropping moment. The event interacts with the castle: a dragon strafing the walls / a portal blooming above the courtyard / an army crashing against the gates / a coronation procession on the long stair. Integrated into the scene, not isolated.

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

━━━ COMPOSITION — CLOSE-MID, ORNATE DETAIL DOMINANT ━━━
CLOSE-MID FRAMING. The castle's architectural ornament fills the frame. Multi-tier depth mandatory:
• FOREGROUND: closest castle architecture — carved-stone tracery / a single ornate balcony / a banner-strung battlement / a gargoyle in profile / a buttress with statuary / a section of crenellated wall — RENDERED IN DETAIL
• MIDGROUND: the castle body and the event taking place AT or AROUND it — towers / spire-tops / event in motion
• DEEP DISTANCE: more of the castle's structure or one peripheral atmospheric layer
• SKY: dramatic — storm-bruised / aurora / sunset / dragon-shadow / cathedral-cloud, but tighter — only the slice of sky around the castle\'s top is visible

The castle is CLOSE — the viewer can count windows in the tower-row, see embroidery on the banners, recognize individual statues on the parapet. NOT a wide distant silhouette. NOT a panoramic establishing shot. CLOSE-MID like an architectural-detail-rich movie poster.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[castle name/type with signature feature]" leading the frame], [the peak event happening at/above/around it], [scale-prover figures/army/crowd at tiny scale], [foreground tactile detail], [lighting + atmospheric layer], [color palette + mood]

DRAMATIC VISUALS: render the EXACT castle + event from the slots above. The castle must be VAST + DETAILED. The event must be at PEAK INTENSITY. Movie-poster establishing-shot composition.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  FANTASY_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, character, landscape, action, drama } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

An atmospheric / magical event happening in the scene around them — render as a visible secondary focal point. Adds awe / story / stakes to the frame.

`
      : '';

    return `You are a fantasy concept-art painter writing MOVIE-POSTER-INTENSITY FANTASY CHARACTER SCENE compositions for DragonBot — a single character integrated into a rich magical landscape, engaged with the magic / setting, not posed. LOTR / GoT / Skyrim / Witcher / Warcraft / Elden Ring / D&D visual lineage. Strict Western high fantasy.

━━━ MOVIE POSTER MANDATE — STACK 3+ STRIKING ELEMENTS ━━━
Every render MUST be a MOVIE-POSTER PROMOTIONAL FRAME — every quadrant has something visually arresting. Stack 3+ simultaneously-visible elements:

  1. **THE CHARACTER** integrated into the scene at 20-30% of frame OFF-CENTER, mid-action with their magic / craft / movement
  2. **EPIC LANDSCAPE BODY** — multi-tier depth with foreground tactile detail + midground landscape body + deep-distance atmospheric layer (NOT a flat backdrop)
  3. **ATMOSPHERIC DRAMA** — aurora / god-rays / floating fey-lights / dragon-shadow at deep distance / glowing leyline / cathedral-cloud light-shafts / falling meteors / sky-phenomenon dominating its quadrant
  4. **MAGIC-EFFECTS BLOOM** — visible spell-light / glowing-rune-tattoos / etheric mist / floating sigils / spell-residue / charged-particle drift around the character or in the scene

THINK LOTR-poster / Elden-Ring-key-art / Witcher-3-promotional-still / Warcraft-cinematic — every quadrant should make the viewer GASP. The character is one of MANY striking elements, not the only one.

━━━ THE CHARACTER IS PART OF THE SCENE — NOT A PORTRAIT ━━━
The character is INTEGRATED into the landscape — mid-gesture / mid-movement / mid-contemplation / mid-spell / mid-step. They occupy 20-30% of the frame, OFF-CENTER, with the EPIC LANDSCAPE wrapping around them. NEVER posing for the camera. NEVER head-on. NEVER staged. They are caught at a candid moment INSIDE the magical world.

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. They are ALONE in the moment.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon / cosmic / orbital
🚫 NO modern (no electric / no industrial / no plastic / no chrome)
🚫 NO real-world ethnic / historical-period codes (no Bedouin / Persian / samurai / Aztec / Polynesian — use fantasy-canon analogues: Dornish / Hammerfell / Chultan / etc.)
🚫 NO living dragons in the scene (those are dragon-scene / dragon-lore paths)
✓ LOTR / GoT / Skyrim / Witcher / Elden Ring / Warcraft / D&D Forgotten Realms / Hogwarts wizarding-world lineage

━━━ THE CHARACTER (render exactly) ━━━
${character}

Render the character with the EXACT garments / weapons / accessories / hair / face described. Don't substitute generic-fantasy-figure for a specific class/archetype. The character's identity (class / outfit / signature gear) is the visual hook.

━━━ THE LANDSCAPE (the epic stage) ━━━
${landscape}

The landscape is THE STAGE — epic, multi-tier, alive. FOREGROUND tactile detail (rocks / vegetation / mist / debris) → MIDGROUND where the character stands integrated with the landscape body → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop.

━━━ THE ACTION — what they are doing RIGHT NOW (engaged with magic / scene) ━━━
${action}

Captured at the loaded mid-moment. Body weight visible in the action. The action connects them to the magic / landscape / world — they're using it, exploring it, listening to it, casting into it. NEVER posing.
${dramaSection}━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Mid framing or wide mid-shot. Three-quarter angle or side profile so we see the character clearly. NEVER head-on at camera. FOREGROUND: tactile detail near them (gear / rocks / vegetation / spell-residue). MIDGROUND: the character at 20-30% of frame mid-action, integrated with the landscape. BACKGROUND: epic landscape body with atmospheric layers receding into haze. The character belongs to the moment, not staged for it.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[character description] [doing action] in [landscape]"], [the landscape wrapping with depth + atmospheric layers], [drama if rolled], [lighting + atmosphere], [color palette + mood]

DRAMATIC VISUALS: render the EXACT character + landscape + action from the slots above. The character is integrated INTO the magic, not posed in front of it.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGONBOT_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, biome, architecture, surprise_element, sky_layer, phenomenon } =
      slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render this visibly in the scene ━━━
${phenomenon}

A magical / atmospheric event woven into the landscape — render as a visible focal point. Adds awe / wonder / drama. NEVER combat or enemies.

`
      : '';

    return `You are a fantasy concept-art painter writing AWE-INDUCING FANTASY LANDSCAPE scenes for DragonBot. The FLAGSHIP path. These landscapes must make the viewer GASP — the kind of vista that stops you mid-scroll. LOTR / GoT / Elden Ring / Skyrim / Witcher / Warcraft visual lineage. Strict Western high fantasy.

━━━ NO CHARACTERS — ABSOLUTE FIRST RULE ━━━
Landscape is the hero. Pure fantasy world. NO hero figures. NO soldiers. NO warriors. NO travelers. NO people. NO humanoid figures of any kind. NO animals as protagonist scale. The eye lands on the LAND ITSELF, not on a figure within it. (Optional tiny scale-prover wildlife — distant birds wheeling, a single deer at midground — is FINE, but never a character.)

━━━ THE LAND IS ALIVE — NON-NEGOTIABLE ━━━
The landscape is not a backdrop — it is a LIVING BREATHING WORLD:
• LUSH: every surface teems with life — moss, vines, wildflowers, bioluminescent fungi, ancient trees with canopies that stretch forever, meadows of impossible colors
• DYNAMICALLY LIT: light is theatrical and dramatic — god-rays piercing through cloud breaks, golden hour painting everything amber, shafts of light through forest canopy, aurora rippling across sky, light refracting through mist and waterfalls
• FULL OF LIFE: birds wheeling in distant skies, fireflies in glens, butterflies in meadows, fish jumping in crystal rivers, magical creatures glimpsed in periphery — the world MOVES
• AWE-STRUCK SCALE: vertigo-inducing cliffs, waterfalls that fall for miles, valleys so deep they vanish into mist, mountains that pierce clouds, forests that stretch to every horizon
• RICH DETAIL: every inch is painted with care — individual leaves catch light, water reflects sky, stone is weathered and textured, moss creeps into every crevice

━━━ MOVIE POSTER MANDATE — STACK THE ELEMENTS ━━━
Every render MUST be a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack AT LEAST 3 visually-arresting elements simultaneously:

  1. **PRIMARY DRAMA** — the biome itself, rendered at MAXIMUM scale-vertigo (waterfall falling miles into mist / cliff dropping a thousand feet / mountain piercing cloud / canyon walls meeting overhead / forest stretching past the horizon). NOT a quiet meadow — a JAW-DROPPING land.
  2. **ARCHITECTURE ANCHOR** — castle / tower / bridge / monastery / arch positioned at the dramatic focal point of the composition, scale-proven against the biome (a tower dwarfed by the mountain it perches on; a bridge spanning a chasm whose depth vanishes in mist).
  3. **ATMOSPHERIC PHENOMENON** — aurora / god-rays / lightning / blood moon / twin moons / passing dragon / sky-tear / leyline-flare / comet / falling stars / mist-rolling-in. THE SKY AND LIGHT MUST BE ACTIVELY DRAMATIC, not just blue.
  4. **SCALE PROVER** — wildlife / abandoned object / distant ship / distant cookfire smoke / distant glow / cathedral-of-trees — something small in the frame that makes the big things feel impossibly big.

The frame should make the viewer GASP and stop scrolling. It is NOT a postcard. It IS a Peter-Jackson-LOTR-extended-cut establishing shot.

━━━ COMPOSITION DRAMA ━━━
- LEADING LINES — winding rivers / valley paths / cloud-streams / mist-trails — pulling the eye INTO the deep distance
- VERTICAL SCALE BREAKS — towers next to mountains, waterfalls next to cliffs, lone trees next to peaks
- DRAMATIC UPSHOTS / DUTCH TILTS / LOW-ANGLE HERO compositions encouraged — never head-on, never neutral
- VANISHING POINTS into impossible distance — give the eye a place to fall into

━━━ THE FANTASY BIOME (the hero) ━━━
${biome}

━━━ ARCHITECTURAL ELEMENT (anchors composition) ━━━
${architecture}

The architecture is positioned to ANCHOR the eye — at the midground or deep-distance focal point. NEVER the foreground (foreground belongs to tactile landscape detail). Architecture is fantasy-canon: castle ruin / tower / monastery / bridge / colonnade / temple / arch / standing-stone circle / sky-spire.
${phenomenonSection}
━━━ SKY OVERHEAD ━━━
${sky_layer}

The sky is the second-largest element of the frame after the biome. Dramatic — never flat.

━━━ SURPRISE ELEMENT — secondary subject adding story (NOT a character) ━━━
${surprise_element}

Place at midground or deep midground. Small element implying the wider world — wildlife / abandoned object / weather phenomenon / glowing detail. NEVER a humanoid figure.

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

━━━ COMPOSITION ━━━
MULTI-TIER DEPTH MANDATORY:
• FOREGROUND: tactile landscape detail — rocks / vines / wildflowers / moss / fern-fronds / pebbles in water / bark texture / fallen leaves
• MIDGROUND: the biome's body — trees / cliffs / river / meadow / ruins / waterfall — where the architectural element anchors
• DEEP DISTANCE: atmospheric layers — distant peaks / horizon haze / fog / cloud layers / sun behind clouds / distant aurora
• SKY: the overhead element — clouds / aurora / sunbeams / storm / stars / moons

Never flat backdrop. Never one-layer postcard. Every render must read DEPTH.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "[biome description]" — biome leads the frame], [the architectural element anchoring at midground / deep distance], [the sky overhead], [phenomenon if rolled], [surprise element at midground / edge], [lighting and atmospheric detail], [color palette and mood]

CRITICAL — the OPENING tokens describe the BIOME itself. Architecture, surprise element, and phenomenon come AFTER, anchoring the composition without competing with the land for focus.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. The land is alive — render it that way.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the biome description.`;
  },

  ARTSY_GIRL: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      race,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
      warrior_archetype: archetype,
      surprise_element,
      drama,
    } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

An atmospheric event happening in the world around her — render as a visible secondary focal point (NOT eclipsing her). Adds awe / story to the frame. NEVER combat or enemies.

`
      : '';

    return `You are a fantasy concept-art painter writing a CANDID PEACEFUL ADVENTURING scene for DragonBot — a single heroic WOMAN of a SPECIFIC fantasy lineage caught between battles, never IN one. Frank Frazetta / Brom / Boris Vallejo / Greg Hildebrandt / Michael Whelan painted-fantasy-novel-cover tradition. LOTR / GoT / Elden Ring / Skyrim / Witcher energy. She is ALIVE, CAPABLE, weathered by adventure, in a quiet candid moment.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "warrior", "fighter", "hero", "adventurer", "scout", "paladin", "ranger", or any other gender-ambiguous noun for "woman" in the opening. Opening MUST read: "a [race-coded] WOMAN [doing action] in [landscape]..." — "woman" comes BEFORE any other noun. Use she/her/hers throughout. The warrior archetype slot (paladin / ranger / barbarian / etc.) describes her ROLE, not her gendered noun — append role descriptor AFTER "woman" appears.

━━━ ABSOLUTE BANS — NO BATTLE / NO COMBAT / NO VIOLENCE ━━━
NO mid-strike, NO weapon-aimed-at-foe, NO enemy in frame, NO fallen body, NO wounded character, NO blood, NO fighting another being. NO "battle peak," NO charging-forward-with-weapon, NO standing-over-defeated-foe. Weapons can be HOLSTERED / sheathed / slung / being maintained (sharpened, polished, restrung). Weapons NEVER in active combat use. Mood is CANDID / QUIET / CONTEMPLATIVE / ADVENTUROUS.

━━━ SOLO CHARACTER ONLY ━━━
ONE character. No companions, no enemies, no crowds. This warrior ALONE in her moment.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The female warrior is the MAIN SUBJECT. Her face, gear, lineage, action, and pose are the DRAW. She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette in distant landscape. NOT a centered portrait. MEDIUM scale where outfit / weapon / face / lineage all CLEARLY READABLE.

━━━ HER LINEAGE / RACE (LOCKED — render her unmistakably as THIS lineage) — ABSOLUTE FIRST VISUAL PROPERTY ━━━
${race}

This race is NON-NEGOTIABLE AND OVERRIDES THE SKIN POOL. Render her with the EXACT anatomy, skin/scale tone, ears, eyes, distinguishing features above. When the race specifies a skin tone or anatomy that contradicts the WARRIOR_SKIN pool roll, the RACE WINS — render the race's tone, ignore the skin pool's tone. Examples of mandatory race-anatomy:

- **Drow / dark elf / Dunmer:** OBSIDIAN-grey or ASH-grey skin (NEVER pale), white-silver / platinum / black hair, sharp angular features, pointed ears
- **High elf / Altmer / Aen Seidhe:** GOLDEN or alabaster skin, sharply pointed long ears, regal aristocratic features
- **Night elf / Kaldorei:** PURPLE-TINTED moon-pale skin, GLOWING SILVER eyes, exceptionally long ears, druidic facial tattoos
- **Blood elf / Sin'dorei:** pale-ivory skin with GLOWING FEL-GREEN eyes, magic-fed gaunt features
- **Tiefling:** RED / PURPLE / VIOLET / OBSIDIAN-grey skin, HORNS (curling / spiked / antlered), SLIT-PUPIL eyes, sometimes tail visible
- **Dragonborn:** SCALED face and draconic snout, lizard-eyes, scales over body, NOT a human face
- **Orc / Half-orc / Uruk-hai:** GREEN or grey-green or olive skin, prominent jaw tusks, broad nose, heavy brow
- **Goliath / Firbolg:** mountain-grey or ash skin, ritual scarring, larger-than-human frame
- **Aasimar:** alabaster or gold-touched skin with FAINT INNER GLOW, sometimes wings or halo, gold-flecked eyes
- **Genasi:** SKIN HAS ELEMENTAL TINT (air = pale-blue-and-white / fire = red-orange / earth = stone-grey / water = deep-blue)
- **Tabaxi:** CAT-LIKE features, fur-patterned skin, slit eyes, tail
- **Warforged:** CONSTRUCTED body — metal/wood/stone plates, glowing core, mechanical joints, NOT flesh
- **Triton / Sea elf:** AQUATIC features — blue-green / teal skin, faint gill marks, webbing between fingers
- **Mountain dwarf / Hill dwarf / Mahakaman dwarf / Duergar:** SHORTER STOCKY frame, broad shoulders, braided beard (yes, on women), dwarven-stout proportions
- **Halfling / Forest gnome / Rock gnome:** SMALLER STATURE (3-4 feet tall), proportionally rendered, NEVER a full-size human-frame

Render the race tone FIRST, then layer the skin pool's TEXTURE detail (freckles, scars, weathering) on top. NEVER let the skin pool overwrite the race's base tone.

━━━ HER WARRIOR ARCHETYPE (her role / energy — informs how she carries herself) ━━━
${archetype}

━━━ HER COMPACT BIO (one-line block — DO NOT expand) ━━━
A ${race.split(':')[0]} woman with ${skin.split(',')[0]} skin, ${eyes.split(',')[0]} eyes, and ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit.split('—')[1] ? outfit.split('—')[1].trim() : outfit}, carrying ${accessory}.

All seven DNA elements (race / skin / eyes / hair color / hairstyle / outfit / accessory) should be discernible in the render. Face fully visible (she's not in a sealed helmet — this is fantasy, not sci-fi).

━━━ THE ACTION — what she is doing RIGHT NOW (CANDID PEACEFUL MOMENT) ━━━
${action}

GROUNDED — feet on the ground or interacting with terrain. The action defines body position. Render it EXACTLY — body weight visible, captured at a loaded instant. The mood is purposeful, capable, candid — never staged.

━━━ THE LANDSCAPE (the stage — fantasy biome) ━━━
${landscape}

Depth on depth — FOREGROUND tactile detail (rocks / vegetation / camp gear / tavern table) → MIDGROUND landscape body + her → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop. The landscape matches her archetype's grandeur but doesn't compete with her for focus.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep midground — a small detail implying the wider world. NEVER foreground or competing with her for attention.

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

━━━ COMPOSITION ━━━
Three-quarter angle or side profile so we see her FACE and LINEAGE clearly. Face must be VISIBLE in the frame — NEVER back-to-camera, NEVER fully turned away, NEVER facing AWAY from the viewer. NEVER walking head-on toward camera either. NEVER posing for the camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near her feet (gear, rocks, vegetation, table edge). MIDGROUND: HER, full body, mid-action, 25-40% of frame. BACKGROUND: the landscape receding into atmospheric haze.

━━━ STRUCTURE — write the prompt in this order ━━━
[OPENING: "a [race-coded] WOMAN [doing exact action] in [landscape]" — race-noun "woman" leads], [she wears [outfit] with full material detail], [her skin + eyes + hair locked from DNA slots], [signature accessory visible], [the fantasy landscape wrapping around her — depth + atmospheric layers], [lighting + atmosphere particles], [color palette + mood]

CRITICAL — the OPENING tokens are "[race-coded woman] [DOING ACTION]" — woman comes BEFORE warrior / paladin / etc. She fills 25-40% of frame, FULL-BODY, captured at the loaded candid instant.

DRAMATIC VISUALS: render the EXACT slot-pool details above. Do NOT substitute generic descriptions. Race comes FIRST visually. Every other slot is locked.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGONBOT_CASTLE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, castle, biome, sky_layer, scale_prover, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC FLOURISH (40%-gated — render subtly) ━━━
${phenomenon}

A subtle atmospheric flourish enhancing the castle's majesty WITHOUT competing with it as focal subject.

`
      : '';

    return `You are a fantasy concept-art painter writing MAJESTIC CASTLE SCENES for DragonBot — vast jaw-dropping movie-poster establishing shots of breathtaking fantasy castles. The castle is 100% the focal subject — NOT 50/50 with any event, NOT a battle scene, NOT a character moment. PURE CASTLE-AS-HERO, gilded by gorgeous fantasy backdrop + dramatic sky + atmospheric flourish. LOTR / GoT / Warcraft / Elden Ring / Witcher / Skyrim / D&D / Hyrule castle establishing-shot lineage.

━━━ THE CASTLE IS 100% THE SUBJECT — NO EVENTS / NO CHARACTERS / NO ACTION ━━━
This path is PURE castle aesthetic and setting — the castle dominates the frame as the sole focal subject. NO peak events at the castle (no battles / no sieges / no coronations / no dragons-mid-attack / no portals-mid-bloom). NO characters in the foreground. NO armies on the approach road. NO action moments.

The only acceptable secondary elements are:
  • The BIOME / landscape backdrop surrounding the castle (mountains / coast / forest / steppe / tundra)
  • The SKY overhead (dramatic atmospheric — dawn / dusk / aurora / storm)
  • A TINY SCALE-PROVER element (5-15% of frame max — a lone rider on a distant ridge, a single ship in the bay, a tiny village clustered at the base) that exists ONLY to make the castle look impossibly massive by comparison
  • An optional ATMOSPHERIC FLOURISH (40%-gated — mist drifting / god-rays / lightning / petals / etc.) that enhances mood, doesn't compete with the castle

If your prompt would include an army marching, a dragon mid-attack, a battle in progress, a coronation, a character on the parapet — REWRITE IT. This path is BEAUTIFUL MAJESTIC STATIC SCALE, not action.

━━━ STOP-YOU-IN-YOUR-TRACKS MANDATE — read this FIRST ━━━

Every render MUST hit ALL FIVE of these in combination — missing any one fails the bar:

  1. **PULLED INTO THE SCENE** — camera placed INSIDE the landscape, not floating above it at a distance. The viewer feels like they're standing in the foreground meadow / on the lake-shore / at the gate / inside the blossom-grove looking up. Dramatic perspective with a strong leading-line (winding road / cascading stream / blossom-strewn path / colonnade / waterfall) guiding the eye toward the castle. NEVER a flat detached "establishing shot from miles away" composition.

  2. **MULTI-LAYER DEPTH (3-4 distinct depth layers visible)** — every render layers foreground / midground / background / sky like a painted theatrical stage:
     • FOREGROUND (closest, tactile): blossom-cluster / wildflower-clump / mossy stones / cascading vine / lake-edge reeds / ancient oak branch / waterfall-spray / fallen petals on grass — rendered in fine detail close to the viewer
     • MIDGROUND (the castle approach + biome features): winding road / cascading meadows / lake / village / orchard / stream — rolling toward the castle
     • BACKGROUND (the castle itself): towering, ornate, multi-tier, sun-lit — the focal subject
     • SKY (dramatic atmospheric ceiling): god-rays / sunset clouds / aurora / moon-corona / storm-front — never bare blue

  3. **SENSE OF MASSIVE SCALE** — the castle DWARFS everything. The viewer should viscerally feel the castle is colossal because of relative scale: a tiny rider on the road, a single bird in the air, a single tree dwarfed by a tower-base, a tiny boat on the lake at the cliff-foot. The scale-prover is OPTIONAL but the SCALE FEELING is mandatory — even without a tiny figure, the castle should feel impossibly huge through architectural detail-density (hundreds of windows, dozens of spires, multi-tier vertical depth).

  4. **WEATHER + ATMOSPHERIC DECORATION** — every render includes weather / atmospheric motion: drifting blossom-petals / falling snow / swirling leaves / drifting embers / rising mist / sun-rays through clouds / aurora-shimmer / rain-streaks / lightning-flash / spray from a waterfall / smoke from chimneys / drifting fog-tendrils / floating magical particles. The air is ALIVE with motion.

  5. **PERFECT LIGHTING** — golden-hour rim-light, dramatic chiaroscuro, theatrical sun-shafts piercing clouds, atmospheric god-rays, painterly chromatic harmony. NEVER flat noon. The light is ALWAYS dramatic and ALWAYS sculpting the castle / biome with painterly volume.

THINK: Hogwarts-as-you-row-into-the-boat-approach / Minas-Tirith-as-the-Rohirrim-charge / Erebor-front-gate-from-the-river-valley / Edoras-from-the-blossom-meadow-approach / Studio-Ghibli-Howl's-Moving-Castle / Zelda-BotW-Hyrule-Castle-from-the-cherry-blossom-field. Every frame is a MOVIE STILL someone would screenshot.

🚫 NO flat distant-vista shots. NO empty bare foreground. NO monochrome biomes. NO flat noon sky. NO "plain castle on a hill" compositions.

━━━ ABSOLUTE BAR — CLOSE-MID MAJESTIC CASTLE FRAME (every render) ━━━
Every render is a POSTER-GRADE PAINTED CASTLE FRAME shot from CLOSE-MID DISTANCE — the viewer is close enough to count tower-windows, see banner-embroidery, recognize statuary on the parapet. NOT a distant tiny establishing silhouette. NOT a wide-vista where the castle is incidental. This is movie-still composition, not establishing-shot composition.

Style targets (NON-NEGOTIABLE — every quadrant must HIT):
  • CASTLE FILLS 70-90% OF THE FRAME — close-mid, dominant, towering. The viewer is at the foot of the castle or on the approach.
  • ORNATELY DETAILED CASTLE — readable individual windows, balconies, statuary, gargoyles, banners snapping in wind, gilt-work catching light, carved-stone tracery, ornamental crenellations, masonry-joints, decorative friezes. The architectural CRAFT is the visual hook.
  • LUSH RICH FOREGROUND — every render has TACTILE foreground beauty (flower-meadow / blossom-grove / cascading-vines / waterfall / mirror-lake / wildflower-field / fruit-orchard / ancient oaks / hanging gardens). NEVER a plain bare foreground. NEVER an empty approach.
  • GORGEOUS RICH BIOME — the fantasy landscape surrounding the castle is RICH and SATURATED (verdant mountains with cascading meadows / coastal cliffs with crashing turquoise surf / blossom-forest with ancient oaks / hanging-gardens valley / wildflower-prairie). NOT bare tundra. NOT plain desert flats. LUSH and COLORFUL.
  • DRAMATIC SKY — golden hour / dusk / dawn / aurora / sunset / magic-hour are STRONGLY preferred. Sun-shafts piercing clouds. Painted gold-and-violet. Never flat blue noon. The sky is HALF the emotional weight.
  • PERFECT LIGHTING — golden-hour rim-light catching every tower edge, sun-shafts radiating onto the castle, atmospheric god-rays. Cinematic chiaroscuro.
  • DENSE WITH DETAIL — every quadrant carries weight. NO empty quadrants. Foreground tactile element + midground castle ornament + background castle silhouette + dramatic sky overhead. Movie-poster density.
  • PAINTED CONCEPT-ART RENDERING — painterly brushwork, dramatic chiaroscuro, atmospheric depth-haze. NOT photorealistic CGI. NOT plain establishing.
  • SCALE-PROVER (5-15% max, OPTIONAL) — tiny element (lone rider / single boat / blossom-petal-fall / distant deer / waterfall mist plume) somewhere in the frame to anchor the castle's scale.

Mood target — MAJESTIC, BREATHTAKING, AWE-INSPIRING, EPIC. The viewer should feel they're looking at the establishing shot of a fantasy film: "This is the place. Look at it."

━━━ MOVIE POSTER MANDATE — EVERY QUADRANT MUST HAVE SOMETHING STRIKING ━━━
Every render is an EPIC CINEMATIC MOVIE STILL / MOVIE-POSTER PROMOTIONAL FRAME with VERTIGO-INDUCING SCALE. The kind of vista that stops the viewer mid-scroll. The kind of frame that opens a fantasy film, the establishing shot of a Peter-Jackson trilogy, the cover of a Tolkien-illustrated edition. EVERY QUADRANT of the frame has something striking — no quiet corners, no negative space.

OBSESSIVE-DENSITY MANDATE — stack ALL of these elements simultaneously in EVERY render:

  1. **THE CASTLE** (70-90% of frame, CLOSE-MID FRAMING) — ornately detailed, towering above the viewer, signature features readable in cinematic detail. The viewer can SEE individual windows glowing, statues on the parapets, gargoyles, banners snapping in wind, gilt-work catching light, carved-stone tracery, cathedral-glass refractions. NOT a distant silhouette.
  2. **LUSH TACTILE FOREGROUND** — every render has a RICH FOREGROUND element painted up close (blossom-grove with petals drifting / wildflower-meadow in full bloom / cascading hanging-gardens / mirror-lake at the foot / ancient moss-draped oaks framing the view / waterfall-mist plume / lavender-field path / rose-garden / fruit-orchard / cascading vines / sun-dappled lily-pond). NEVER empty.
  3. **GORGEOUS LUSH BIOME** — fantasy landscape rich, saturated, alive (verdant valleys / blossom-forests / coastal-cliffs-with-turquoise-surf / wildflower-prairie / hanging-garden-mesa / fjord-with-pine-forest). RICH and COLORFUL.
  4. **DRAMATIC PAINTED SKY** — atmospheric ceiling of theatrical power (golden hour / dusk / dawn / sunset / aurora / blood-moon / sun-shafts piercing clouds). Painted-concept-art chromatic palette. The sky is HALF the emotional weight.
  5. **WEATHER / ATMOSPHERIC MOTION** — drifting blossom-petals / falling snow / swirling leaves / rising mist / spray from a waterfall / smoke from chimneys / drifting fog-tendrils / aurora-shimmer / drifting magical particles / sun-rays cutting through cloud. The air is ALIVE with motion.
  6. **SCALE PROVER** (5-15% max) — one tiny anchor element somewhere in the frame (lone rider on the road / blossom-petal cloud / distant village in the valley / single ship in the bay / tiny figures on the long stair / deer at the meadow edge / single bird wheeling). Gives the castle's scale viscerally.

VERTIGO-INDUCING SCALE — every render must convey awe-inducing scope:
• Cliffs that drop a thousand feet into mist below the castle gate
• Cathedral spires piercing sunset clouds
• Valleys so deep they vanish into golden haze
• Mountain-passes leading toward citadels half a mile distant
• Aerial-perspective views looking down OR worm's-eye views looking up
• Multi-tier vertical composition where the castle towers over the viewer

THE EYE SHOULD LAND ON 5+ STRIKING DETAILS in different quadrants. NOT just a centered beauty shot. NOT a single focal element. EVERY corner of the frame has detail, glow, scale, motion, or atmospheric presence.

THINK CASTLE-OF-CAGLIOSTRO-ESTABLISHING-FRAME / HOWL'S-MOVING-CASTLE-VISTA / SPIRITED-AWAY-BATHHOUSE-APPROACH / LAPUTA-CASTLE-IN-THE-SKY-REVEAL / MINAS-TIRITH-FROM-PELENNOR-FIELDS / HOGWARTS-FROM-BOAT-APPROACH / EDORAS-GATE-UP / EREBOR-FRONT-DOOR / ANOR-LONDO-COURTYARD-VIEW / HYRULE-CASTLE-FROM-BLOOMING-FIELD / DARK-SOULS-AREA-INTRO-VISTA / WITCHER-3-KAER-MORHEN-COURTYARD — every frame is an EPIC CINEMATIC MOVIE STILL someone would screenshot to keep forever.

🚫 NO "plain" castle shots — empty bare foreground, distant silhouettes, monochrome biomes, flat noon sky, single-focal-element framing all FAIL the bar.

━━━ ONLY BIG EPIC CASTLES — NO SMALL FORTIFIED KEEPS ━━━

Every castle in every render MUST be MASSIVE + SPRAWLING + MULTI-TIER. NEVER render small castles.

🚫 ABSOLUTELY BANNED — small castles FAIL the bar:
• NO small square fortified keeps (2-3 stories tall)
• NO simple motte-and-bailey castles
• NO small stone watchtowers as the primary castle
• NO modest curtain-wall manor-house castles
• NO single-tower keeps without sprawling complex
• NO castles that fit in a single quadrant of the frame
• NO compact compact castles you could walk around in 5 minutes

✓ MANDATORY BIG-EPIC SCALE:
• Hundreds-of-meters tall (towers piercing clouds / spires touching sky)
• Multi-tier vertical complex (many levels stacked / built up over centuries)
• DOZENS of distinct spires, towers, battlements, gatehouses visible
• Sprawling horizontal footprint (kilometers across when fully visible)
• Castle is an entire CITY or COMPLEX, not a single building
• References: Minas-Tirith (city-mountain) / Erebor (whole-mountain-fortress) / Hogwarts (sprawling-multi-wing complex) / Anor-Londo (vast-cathedral-city) / Stormveil-Castle (multi-tier mountain complex) / Cair-Paravel (sprawling-coast-citadel) / Howl's-Moving-Castle (multi-element-architecture)

━━━ PLACEMENT VARIETY MANDATE — every castle has a DRAMATIC PLACEMENT ━━━

Every render's castle uses ONE of these epic placements (rotate across batches):

  • STANDALONE EPIC — castle as solo focal hero on a hilltop / plain / promontory / island, sprawling multi-tier complex visible head-to-toe
  • BUILT-INTO-MOUNTAIN-WALL — castle carved into / fused with a sheer mountain face, tiers cascading down the cliff, towers jutting from the rock itself
  • CLIFF-TOP — castle perched on the very edge of a sheer cliff, dramatic vertical drop into ocean / canyon / mist below
  • VALLEY-BASIN — castle nestled in a vast lush valley with mountains rising on all sides, river or lake at the base
  • SUNSET-BACKLIT — castle silhouetted against a dramatic painted sunset / dawn, sun-corona behind, sky as half the composition
  • BROAD-DAYLIGHT SUNNY — castle in clear bright daylight (sunny is VALID — not every render needs golden-hour), painted-blue sky with sun-shafts, pennants snapping in clear bright light
  • BRIDGES-TO-OTHER-MASSES — castle connected by dramatic stone or rope bridges to other land-masses / spires / floating-islands / sister-castles. Multiple architectural masses in the frame, linked by epic bridge-spans
  • TWIN/SISTER-CASTLE — two related castles in the frame separated by a chasm / river / lake / bridge, mirror-imaged or contrasting

━━━ THEATRICAL SIGNATURE MOMENT — every render delivers ONE ━━━

Every render must include AT LEAST ONE signature theatrical-moment element that elevates it from "nice castle" to "POSTER SHOT":

  • SUN-BURST BEHIND THE CASTLE — sun corona radiating from behind the highest spire
  • SUNSET / DAWN GOLDEN-HOUR rim-light catching every tower edge in painted gold
  • LIGHTNING ILLUMINATING the spires — single brilliant fork freezing the silhouette
  • MOONRISE BEHIND CASTLE — vast moon halo silhouetting towers, blood-moon or silver-moon
  • AURORA OVER CASTLE — green/violet/magenta aurora rippling above the spires
  • SUN-SHAFTS THROUGH CLOUDS — theatrical god-rays radiating onto the castle
  • CLEAR BRIGHT DAYLIGHT — pennants snapping in clean sunny light, painted-blue sky, sun glinting on gilt-work (sunny day IS valid — not every render needs sunset)
  • SNOWSTORM FRAMING — castle emerging from a sweeping snow-storm, snow-curtains parting
  • MIST RECEDING — castle revealing through parting morning mist, foreground mist still drifting

If the rolled sky/phenomenon doesn't suggest one of these, INVENT one that fits — every render needs a theatrical signature moment.

━━━ STRICT WESTERN HIGH FANTASY ━━━
🚫 NO sci-fi / cyberpunk / neon / orbital / cosmic / chrome / industrial
🚫 NO modern (no electric / no plastic / no glass-and-steel skyscrapers)
🚫 NO real-world ethnic / historical-period codes (no Bedouin / Persian / samurai / Aztec / Polynesian / Forbidden-City — use fantasy-canon analogues only — Dornish / Hammerfell / Haradrim / Chultan / Stranglethorn / Cormyrean)
🚫 NO PORTRAIT FRAMING — this is ALWAYS wide-shot establishing
🚫 NO CHARACTERS in foreground / midground (tiny scale-prover figures at 5-15% max are OK)
🚫 NO ACTIVE BATTLES / SIEGES / EVENTS (those are epic-moment path)
✓ LOTR / GoT / Warcraft / Elden Ring / Witcher / D&D / Skyrim castle establishing-shot lineage

━━━ THE CASTLE ━━━
${castle}

The castle is the FOCAL SUBJECT, rendered with full silhouette readable + ornate architectural detail visible. Multi-tier depth from foundation to highest spire. 60-80% of frame.

━━━ THE BIOME / LANDSCAPE BACKDROP ━━━
${biome}

The biome surrounds the castle and provides the gorgeous fantasy backdrop. Render with painterly depth — foreground biome detail near the castle, midground landscape features, deep distance receding into atmospheric haze. The biome is GORGEOUS in its own right but the castle dominates.

━━━ THE SKY OVERHEAD ━━━
${sky_layer}

The sky is HALF the emotional weight. Dramatic painted-concept-art atmospheric ceiling — never flat noon. Use the rolled sky to set the mood (golden hour / aurora / storm / dawn / dusk / night).

━━━ THE SCALE-PROVER (tiny, 5-15% of frame MAX) ━━━
${scale_prover}

Place this scale-prover element in the FOREGROUND or DISTANT MIDGROUND. It should be TINY — its sole purpose is to make the castle's vast scale viscerally legible. The viewer's eye should go: castle (huge!) → scale-prover (tiny) → realize the castle is COLOSSAL. Do NOT let the scale-prover compete with the castle for attention.
${phenomenonSection}
━━━ LIGHTING ━━━
${lighting}

Cinematic painted-concept-art lighting — dramatic chiaroscuro, atmospheric depth, painterly brushwork. The light source matches the sky's hour (golden / dusk / dawn / moon / aurora).

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ DO NOT DEFAULT ━━━
Do NOT default to:
- Distant tiny castle silhouette in a wide vista — castle MUST fill 60-80% of frame
- Generic blocky stone castle — render the SPECIFIC castle architecture from the slot above (architectural style + material + signature feature must be visible)
- Flat noon blue sky — always dramatic atmospheric (golden / dusk / dawn / aurora / storm / night)
- Empty foreground — always a tactile foreground element (cliff-edge / forest-clearing / ridge-line / shore-rocks / approach-road)
- Characters / armies / events filling the frame (this is castle 100%, not 50/50)

━━━ BANNED IMAGERY ━━━
NO active battles / sieges / coronations / portals-mid-bloom / dragons-mid-attack (epic-moment territory). NO characters in foreground or midground (scale-prover figures at 5-15% only). NO armies marching. NO portrait framing. NO sci-fi / modern intrusions. NO real-world ethnic codes.

━━━ DO NOT USE "DRAGONBOT" OR ANY BOT NAME ━━━
The castle is UNNAMED. Describe it only by appearance + architectural style.

━━━ STRUCTURE — write 100-140 words (TIGHT) ━━━
DO NOT open with framing words ("Wide shot of..." / "Establishing shot of..." / "Landscape shot of..."). Open with the CASTLE itself OR the BIOME (e.g., "Vast white-stone clifftop castle..." or "Frozen tundra with..."). The framing is implied through the elements described.

GOOD OPENING EXAMPLES:
• "Vast multi-tiered white-stone castle carved into a sheer mountain face, hundreds of windows glowing gold at dusk, ribbon-banners cascading down the cliff-face from every tier..."
• "Crashing surf against a windswept sea-cliff crowned by a colossal grey-stone fortress, hundreds of gulls wheeling around the highest tower, lighthouse beam cutting through fog at dawn..."
• "Floating crystalline castle suspended above a vast valley of glowing aurora, arcane-blue runes pulsing across every facade, beams of light projecting downward through swirling clouds..."

Then weave: castle architectural detail, biome surrounding it, sky overhead, tiny scale-prover (placed relative to castle), atmospheric flourish (if rolled), lighting + atmosphere + palette + mood. Foreground CASTLE DOMINANCE + GORGEOUS BIOME + DRAMATIC SKY + TINY SCALE-PROVER.

Output ONLY the raw 100-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },

  DRAGON_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, dragon, action, landscape, surprise_element, drama } = slots;

    const dramaSection = drama
      ? `
━━━ ENVIRONMENTAL DRAMA — render this visibly in the scene ━━━
${drama}

This is an atmospheric event happening in the world around the dragon — render it as a visible secondary focal point (NOT eclipsing the dragon, but adding awe to the frame).

`
      : '';

    return `You are a fantasy concept-art painter writing an AWE-INDUCING DRAGON scene for DragonBot — a traditional Western high-fantasy dragon as the hero in a jaw-dropping fantasy landscape. Frank Frazetta + Brian Froud + Brom + Hildebrandt + Michael Whelan painted-fantasy-novel tradition. LOTR / GoT / Elden Ring / Skyrim / Warcraft / D&D energy. The scene should make the viewer GASP.

━━━ TRADITIONAL WESTERN DRAGON ANATOMY — NON-NEGOTIABLE ━━━
This is a TRADITIONAL high-fantasy WESTERN dragon — Smaug / LOTR / GoT / Elden Ring / Skyrim / Warcraft / D&D archetype. Anatomy MUST include:
- FOUR muscular legs (NOT a wingless wyrm, NOT a snake, NOT a serpent)
- TWO MASSIVE membrane wings (bat-like, scaled, ribbed) — wings ALWAYS visible (folded against the back, half-furled, or fully extended)
- HORNED head with reptilian skull — sharp horns, swept-back crests, jaw with rows of fangs
- THICK SCALED body with armored plating, muscular shoulders, broad chest
- LONG THICK TAIL (not a snake-tail — a powerful muscular tail, sometimes spike-tipped or fan-tipped)
- CLAWED forefeet and hindfeet
- Reptilian-mammalian hybrid silhouette — like a giant winged bull-lizard, NEVER like a python with arms

ABSOLUTELY NOT:
- Eastern Chinese-style wingless serpentine dragon
- Snake / serpent / wyrm / lindworm body shape
- Wingless or two-legged wyvern (this path requires 4 legs + 2 wings = TRUE DRAGON)
- Sky-snake / spirit-serpent / cloud-snake

━━━ NO CHARACTERS — ABSOLUTE ━━━
No humans, no riders, no people. Dragon ONLY. (Tiny secondary subjects like a distant knight silhouette via the surprise_element axis are OK at scale-prover scale only — never foreground figures.)

━━━ THE DRAGON ━━━
${dragon}

Render the EXACT anatomy + color + horn / wing / body distinguishing features described. Wings ALWAYS visible.

━━━ THE ACTION — what the dragon is doing RIGHT NOW (mid-action cinematic moment) ━━━
${action}

The dragon is captured at a LOADED INSTANT — mid-roar, mid-flight, mid-breath, mid-strike, perched-watching, sleeping-on-hoard. NEVER static "standing in front of camera." The action defines body position + visible motion (jaw / wings / claws / tail / fire / smoke / debris).

━━━ THE LANDSCAPE (the stage — epic high-fantasy biome) ━━━
${landscape}

Render every detail. Depth on depth — FOREGROUND tangible detail (rocks / vegetation / ruins) → MIDGROUND landscape body + the dragon → DEEP DISTANCE atmospheric layers stacked. Never flat backdrop.
${dramaSection}
━━━ SURPRISE ELEMENT — secondary subject for added story ━━━
${surprise_element}

Place at midground or deep midground — a small detail that implies the wider world. NEVER foreground or competing with the dragon for attention.

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

━━━ COMPOSITION ━━━
Dragon dominates a vast, lush, dynamically-lit landscape. Setting matches the dragon's grandeur — not a flat backdrop. Depth-on-depth: foreground tactile detail → midground dragon body + setting → background terrain stacked in atmospheric layers. Scale proven through peripheral elements (tiny trees / distant castles / storm clouds / surprise element silhouette).

VARY POSES BROADLY — perched / mid-breath / sleeping on hoard / emerging from cave / silhouetted against sky / mid-roar / resting head on forepaws / banking in flight / clutching prey / clawing the sky / taking off / landing. Never the same composition twice.

NEVER "tail wrapped around tower" cliché. NEVER tiny dragon in vast empty sky.

━━━ STRUCTURE — write 100-130 words ━━━
Open with the dragon + its action ("Crimson dragon mid-roar with bone-spike crest, jaw extended over volcanic peaks..."). Then weave in: landscape backdrop with depth layers, lighting/atmosphere, surprise element at midground, any drama event, color palette and mood. Painted-fantasy-novel finish.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ markers. Just the scene content.`;
  },
};
