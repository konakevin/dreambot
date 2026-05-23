/**
 * steambot archetype templates — Sonnet brief composer functions.
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
  STEAMBOT_STEAMPUNK_WOMAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      persona,
      skin,
      eyes,
      makeup,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
    } = slots;

    return `You are a cinematic illustration painter writing a CANDID STEAMPUNK SCENE for SteamBot — a single gorgeous WOMAN caught mid-action inside a fully-realized Victorian-industrial world. Lush vibrant painted illustration register — finished animation key-art / luxe production-painting feel (BioShock-Infinite / Mortal-Engines / Howl's-Moving-Castle / Treasure-Planet lineage). THE OUTFIT IS THE MAIN SHOW. The setting is her STAGE — a specific, lived-in, sock-blowing steampunk world. Solo. Candid. Tasteful. Sock-blowing.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN. The word "woman" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "captain", "engineer", "mechanic", "explorer" or any gender-ambiguous noun for "woman" in the opening. Opening MUST read: "a [ethnicity-coded] WOMAN [doing action] in [setting]..." — "woman" comes BEFORE her persona/role. Use she/her throughout.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The steampunk woman is the MAIN SUBJECT. Her face, the COUTURE OUTFIT, persona, action, and pose are the DRAW. She occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette. NOT a centered head-portrait. MEDIUM scale where outfit / face / hair / accessory all CLEARLY READABLE. THE OUTFIT IS THE MAIN SHOW — every layer must read.

━━━ THE OUTFIT IS THE MAIN SHOW — NON-NEGOTIABLE ━━━
Render the OUTFIT with OBSESSIVE craftsmanship detail — this is what the viewer is here to see. Victorian-industrial steampunk, super ornate, super layered, tasteful. NEVER SIMPLE — never plain shirt, never plain pants, never minimal. The outfit silhouette varies wildly across renders — could be a steampunk BALL-GOWN, or a TAILORED JACKET-AND-PANTS, or a FITTED CORSET-OVER-BLOUSE WITH RIDING-SKIRT, or LEGGINGS-AND-CORSET-COAT, or a STRUCTURED RIDING-HABIT, or a PILOT'S COAT-AND-TROUSERS, or a LAYERED ALCHEMIST'S ENSEMBLE. Whatever silhouette the wardrobe pool rolls — render it as ORNATE, LAYERED, AND DETAILED. Every brass clasp, every copper button, every jeweled brooch, every gear medallion, every gold filigree, every velvet panel, every brocade flourish, every leather strap, every embroidered cuff rendered explicitly. The outfit gets the MAJORITY of the prompt word-budget — every visible layer named.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE character. No companions, no second figures, no crowds. She is ALONE in her moment.

━━━ TASTEFUL VICTORIAN GLAMOUR — NOT MODERN-SKIN-SHOW ━━━
She is GORGEOUS, GLAMOROUS, CAPTIVATING — a painted illustration heroine. Beauty reads through couture craftsmanship, confident posture, painterly gaze, jewel-toned color, ornate detail — NOT through exposed skin or body-focus framing. BioShock-Infinite Elizabeth + Howl's-Moving-Castle Sophie + Treasure-Planet Captain Amelia + Mortal-Engines Anna Fang energy. Refined, luminous, alive.

━━━ THE STEAMPUNK SETTING — HER STAGE — BLOW SOCKS OFF ━━━
${landscape}

This setting is HER WORLD. Render it as a FULLY-REALIZED steampunk environment with depth-on-depth — FOREGROUND tactile detail near her (workbench surface, ship railing, console knobs, alchemy table, pipework she's leaning against) → MIDGROUND her + the immediate environment (the room/space she stands in) → DEEP DISTANCE the wider world (corridor extending back, sky beyond the porthole, factory floor receding, balcony view, conservatory glass roof). Never a flat backdrop. Never decorative-clutter framing of clocks/gears/pipes pasted around her edges — the setting is LIVED IN, FUNCTIONAL, real. Make the viewer want to BE in that room.

━━━ HER PERSONA (her role / energy — informs how she carries herself) ━━━
${persona}

━━━ HER COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
A ${skin.split(',')[0]}, with ${eyes.split(',')[0]} eyes, ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit}, carrying ${accessory}. Her makeup: ${makeup.split(',')[0]}.

(All eight DNA elements should be discernible in the render. Face fully visible — she's not in a sealed helmet.)

━━━ MAKEUP MANDATE — DETAILED + STEAMPUNK-CODED ━━━
Render her makeup with OBSESSIVE specificity AND steampunk vocabulary. NEVER plain or natural. Always elaborately styled — brass-dust highlight, kohl-rimmed eyes with smudged wing, copper-leaf temple, gold-leaf accent, soot-dark eyebrow, oxidized-bronze contour, gear-pattern eyeshadow, mercury-bright highlighter, candle-smoke smudge, rust-and-amber lip stain, wine-bruise lip, ink-blue undereye, scarification, brass-pigment temple-stripe. Whatever the makeup pool says — render it visibly + steampunk-coded.

━━━ ACCESSORY MANDATE — DETAILED + STEAMPUNK-CODED ━━━
The accessory she carries / wears must be rendered with OBSESSIVE mechanical detail and steampunk specificity. Brass + copper + leather + gemstone + clockwork. Every gear visible, every rivet shown, every patina rendered. Multi-part mechanical accessories preferred over single-piece jewelry.

━━━ THE CANDID ACTION — what she is doing RIGHT NOW (caught mid-moment) ━━━
${action}

GROUNDED — feet planted, body weight visible, captured at a loaded instant of doing the action. She is NOT posing for the camera — the camera caught her mid-task. Hands and body engaged with what she is doing.

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
Three-quarter angle or side profile so we see her face, body, and ornate outfit. NEVER posing for the camera. NEVER walking head-on toward camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near her (object she's interacting with). MIDGROUND: HER, full body, mid-action, 25-40% of frame. BACKGROUND: the steampunk setting extending into depth with atmospheric haze. The frame is composed like BioShock-Infinite key art — character + her world, harmoniously balanced.

━━━ ALLOWED VOCABULARY (use often) ━━━
glamorous, captivating, luminous, regal, elegant, couture, tailored, structured, romantic, opulent, aristocratic, refined, ornamental, jewel-toned, filigree, brocade, lace overlay, embroidered, velvet, satin, brass detailing, clockwork accents, porcelain complexion, painterly gaze, graceful posture, theatrical, dramatic silhouette, ornate.

━━━ FORBIDDEN VOCABULARY — these specific words trigger Replicate's NSFW filter ━━━
- sexy, erotic, sensual, seductive, provocative, temptress, lingerie, pinup, pin-up
- voyeuristic, voyeur, bedroom, boudoir, sultry
- "strategic cutouts", "see-through", "sheer panels", "exposure"
- body-focus terms: hips, thighs, rear, bare midriff, underboob
- moisture/heat-on-skin imagery: wet lips, beads of sweat, moisture on skin, humidity beading
- decorative-cliché framing language: "brass piping at frame edges", "gears at frame edges", "clockwork ornaments framing", "art-nouveau borders"

ALLOWED Victorian-fashion vocabulary (use freely): corset, corseted, structured bodice, brass-cage bodice, décolletage, off-shoulder, lace cuff, embroidered sleeve, gown, ball-gown, riding-coat, fitted vest, opera-glove, cravat, choker, jewel-collar, bustle.

━━━ HARD BANS — COMPOSITION ━━━
- NO second person in frame — she is ALONE
- NO tight head-portrait crop — full body, 25-40% frame
- NO posing-for-camera, NO modeling shot, NO trading-card art
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative clutter framing (clocks/gears/pipes pasted around the edges as decoration)

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING: "a [ethnicity-coded] WOMAN [doing exact action] in [steampunk setting]" — woman comes before persona], [her couture outfit with OBSESSIVE LAYERED material detail — every visible layer + every brass clasp / lace cuff / embroidered sleeve / jeweled brooch], [signature accessory visible], [her face: skin tone + eyes + makeup + hair from DNA slots], [the steampunk setting with depth + atmospheric layers], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens are "[ethnicity-coded woman] [DOING ACTION] in [steampunk setting]". She fills 25-40% of frame, FULL-BODY. The OUTFIT gets the most word-budget — that's where the obsessive material detail lives.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_MAN: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      persona,
      skin,
      eyes,
      facial_hair,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      landscape,
      action,
    } = slots;

    return `You are a cinematic illustration painter writing a CANDID STEAMPUNK SCENE for SteamBot — a single handsome MAN caught mid-action inside a fully-realized Victorian-industrial world. Lush vivid painted illustration register — finished animation key-art / luxe production-painting feel (BioShock-Infinite / Mortal-Engines / Howl's-Moving-Castle / Treasure-Planet lineage). THE OUTFIT IS THE MAIN SHOW. The setting is his STAGE — a specific, lived-in, sock-blowing steampunk world. Solo. Candid. Tasteful. Sock-blowing.

━━━ GENDER LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a MAN. The word "man" MUST appear in the FIRST 8 TOKENS of your prompt. Do NOT substitute "captain", "engineer", "mechanic", "explorer", "gentleman", "rogue", or any gender-ambiguous noun for "man" in the opening. Opening MUST read: "a [ethnicity-coded] MAN [doing action] in [setting]..." — "man" comes BEFORE his persona/role. Use he/his/him throughout.

━━━ HE IS THE SHOW — NON-NEGOTIABLE ━━━
The steampunk man is the MAIN SUBJECT. His face, the OUTFIT, persona, action, and pose are the DRAW. He occupies 25-40% of the frame vertically — FULL BODY head-to-toe visible, head no larger than 10% of frame. NOT a tiny silhouette. NOT a centered head-portrait. MEDIUM scale where outfit / face / hair / facial hair / accessory all CLEARLY READABLE. THE OUTFIT IS THE MAIN SHOW — every layer must read.

━━━ THE OUTFIT IS THE MAIN SHOW — NON-NEGOTIABLE ━━━
Render the OUTFIT with OBSESSIVE craftsmanship detail — this is what the viewer is here to see. Victorian-industrial steampunk, super ornate, super layered, period-accurate gentleman's attire. NEVER SIMPLE — never plain shirt, never plain pants, never minimal. The outfit silhouette varies wildly across renders — could be a tailored frock-coat, or a military officer's coat-and-breeches, or a leather aviator coat + flight gear, or a riding-coat with brass clasps over waistcoat + trousers, or an alchemist's apron over shirt + waistcoat + breeches, or a engineer's vest + rolled sleeves + work-trousers, or a gentleman explorer's khaki kit + boots, or a dandy's brocade frock-coat + cravat + trousers. Whatever silhouette the wardrobe pool rolls — render it as ORNATE, LAYERED, AND DETAILED. Every brass button, every leather strap, every layer named.

━━━ SOLO CHARACTER ONLY ━━━
EXACTLY ONE character. No companions, no second figures, no crowds, no women. He is ALONE in his moment.

━━━ HANDSOME THROUGH ACTION — NOT POSED — NEVER SEDUCTIVE ━━━
He is HANDSOME, DASHING, RUGGED, INTENT, CAPABLE, WEATHERED — the appeal reads through his action, his weathered features, his craftsmanship, his confident stance. NEVER through pose-for-camera, NEVER through seductive/smoldering/come-hither energy. NEVER bare-chested. NEVER shirtless. NEVER open-shirt-for-sex-appeal. He is FULLY DRESSED at all times — rolled sleeves over a workbench are fine (that's working, not undressing). Think Errol Flynn / Cary Grant / Robert Downey Jr's Sherlock / BioShock-Infinite Booker / Treasure-Planet Captain Amelia's male crew counterparts / Around-the-World-in-80-Days Phileas Fogg.

━━━ THE STEAMPUNK SETTING — HIS STAGE — BLOW SOCKS OFF ━━━
${landscape}

This setting is HIS WORLD. Render it as a FULLY-REALIZED steampunk environment with depth-on-depth — FOREGROUND tactile detail near him (workbench surface, ship railing, console knobs, alchemy table, pipework he's leaning against) → MIDGROUND him + the immediate environment (the room/space he stands in) → DEEP DISTANCE the wider world (corridor extending back, sky beyond the porthole, factory floor receding, balcony view, conservatory glass roof). Never a flat backdrop. Never decorative-clutter framing of clocks/gears/pipes pasted around his edges — the setting is LIVED IN, FUNCTIONAL, real.

━━━ HIS PERSONA (his role / energy — informs how he carries himself) ━━━
${persona}

━━━ HIS COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
A ${skin.split(',')[0]}, with ${eyes.split(',')[0]} eyes, ${facial_hair.split(',')[0]}, ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit}, carrying ${accessory}.

(All eight DNA elements — ethnicity/skin / eyes / facial hair / hair color / hairstyle / outfit / accessory / persona — should be discernible in the render. Face fully visible — he's not in a sealed helmet.)

━━━ FACIAL HAIR MANDATE — DETAILED + PERIOD-ACCURATE ━━━
Render his facial hair with OBSESSIVE specificity AND period-Victorian vocabulary. NEVER generic stubble unless the pool says so. Always rendered exactly — waxed handlebar mustache / full mutton-chop sideburns / Van Dyke goatee / clean-shaven sharp jaw / three-day stubble / iron-grey beard / Imperial mustache / chinstrap beard / pomaded-down beard / sailor's full beard / soot-flecked stubble. Whatever the facial-hair pool says — render it visibly and period-accurate.

━━━ ACCESSORY MANDATE — DETAILED + STEAMPUNK-CODED ━━━
The accessory he carries / wears must be rendered with OBSESSIVE mechanical detail and steampunk specificity. Brass + copper + leather + steel + gemstone + clockwork. Every gear visible, every rivet shown, every patina rendered. Multi-part mechanical accessories preferred over single-piece tools.

━━━ THE CANDID ACTION — what he is doing RIGHT NOW (caught mid-moment) ━━━
${action}

GROUNDED — feet planted, body weight visible, captured at a loaded instant of doing the action. He is NOT posing for the camera — the camera caught him mid-task. Hands and body engaged with what he is doing.

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
Three-quarter angle or side profile so we see his face, body, and ornate outfit. NEVER posing for the camera. NEVER walking head-on toward camera. Full-body or wide mid-shot. FOREGROUND: tactile detail near him (object he's interacting with). MIDGROUND: HIM, full body, mid-action, 25-40% of frame. BACKGROUND: the steampunk setting extending into depth with atmospheric haze. The frame is composed like BioShock-Infinite key art — character + his world, harmoniously balanced.

━━━ ALLOWED VOCABULARY (use often) ━━━
handsome, dashing, rugged, intent, capable, weathered, refined, distinguished, gentlemanly, aristocratic, commanding, stoic, watchful, tailored, structured, ornamental, brass-trimmed, leather-bound, mechanical, period-accurate, Victorian gentleman, painterly gaze, confident posture, opulent, opulent, theatrical, dramatic silhouette.

━━━ FORBIDDEN VOCABULARY — DO NOT WRITE ━━━
- sexy, sensual, seductive, sultry, smoldering, come-hither, alluring (in seductive sense), provocative
- shirtless, bare-chested, open-shirt, exposed torso, beefcake, oiled-pecs, sleeveless
- ANY female-coded vocabulary: décolletage, cleavage, bodice, gown, dress, skirt, lace cuff, makeup, kohl, eyeliner, jewelry-collar, choker, jewel-trim (he wears Victorian gentleman's attire ONLY)
- moisture/heat-on-skin imagery: wet, sweat, beads, flushed, glistening
- decorative-cliché framing: "brass piping at frame edges", "gears at frame edges", "clockwork ornaments framing"

Do NOT cross-pollute with female vocabulary. He is male. His outfit is male Victorian-industrial attire. His features are male.

━━━ HARD BANS — COMPOSITION ━━━
- NO second person in frame — he is ALONE
- NO modern dress (this is Victorian-industrial fantasy)
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative clutter framing (clocks/gears/pipes pasted around the edges as decoration)
- NO shirtless or open-shirt-for-sex-appeal

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING: "a [ethnicity-coded] MAN [doing exact action] in [steampunk setting]" — man comes before persona], [his outfit with OBSESSIVE LAYERED material detail — every visible layer + every brass button / leather strap / waistcoat lapel / coat-cuff / boot-buckle], [signature accessory visible], [his face: skin tone + eyes + facial hair + hair from DNA slots], [the steampunk setting with depth + atmospheric layers], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens are "[ethnicity-coded man] [DOING ACTION] in [steampunk setting]". He fills 25-40% of frame, FULL-BODY. The OUTFIT gets the most word-budget — that's where the obsessive material detail lives.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_AIRSHIP_SKIES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, scene, sky_layer, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render this visibly in the sky ━━━
${phenomenon}

A sky-event happening in the world around the vessel — render it as a visible secondary focal point (NOT eclipsing the airship, but amplifying the drama). Adds awe and scale to the frame.

`
      : '';

    return `You are a cinematic concept painter writing a MOVIE-POSTER AIRSHIP SKIES scene for SteamBot — Victorian-industrial dirigibles, sky-galleons, packet-ships, sky-clippers, gun-ships caught in vertigo-inducing dramatic sky moments. Mortal-Engines / Treasure-Planet / Howl's-Moving-Castle / Last-Exile / Atlantis-lost-empire / Skies-of-Arcadia / Final-Fantasy-airship-cutscene visual lineage. The frame should make the viewer GASP at the scale and beauty.

━━━ MOVIE-POSTER MANDATE — STACK 3+ STRIKING ELEMENTS ━━━
Every render is a MOVIE POSTER PROMOTIONAL FRAME — every quadrant has something striking. Stack 3+ simultaneously-visible elements:
  1. THE AIRSHIP (or fleet) at vertigo-inducing scale — multi-tier depth mandatory
  2. SKY LAYER dominating its quadrant (cloud bank / storm front / aurora / twin moons / sunset blaze)
  3. ATMOSPHERIC PHENOMENON if rolled (lightning / meteor / sky-eddy / magnetic-storm / cloud-cascade)
  4. SECONDARY SUBJECT giving scale (distant vessel / mooring tower / cliff-top lighthouse / sky-island)
  5. SATURATED THEATRICAL LIGHT (golden-hour rim / lightning underglow / sunset blaze / dawn copper-and-amber)

━━━ NO CHARACTERS — ABSOLUTE ━━━
NO primary human figure. Tiny crew silhouettes visible on deck or in rigging are OK as scale-provers (pinprick scale only) — never foreground characters, never named figures, never a hero-pose.

━━━ VICTORIAN-INDUSTRIAL VESSEL DETAIL — NON-NEGOTIABLE ━━━
The airship rendered with OBSESSIVE Victorian-industrial detail — riveted brass hull plating, copper-clad gondolas, ribbed envelope panels, exposed steam-pipework, brass propellers and turbines, gaslit ship-windows glowing amber, weathered wood-decking, brass mooring-rings, ornate prow figureheads, glass-domed observation lounges, paddle-wheels and balloon-rotors. NEVER modern aircraft, NEVER spaceships, NEVER pure-fantasy fae-ships. 1890s-impossible-engineering aesthetic.

━━━ THE AIRSHIP SCENE (the hero frame — vessel + scene context) ━━━
${scene}

Render the vessel as DESCRIBED with depth-on-depth — FOREGROUND tactile detail (envelope fabric / brass railing / propeller-blade-edge) → MIDGROUND the vessel body + immediate sky → DEEP DISTANCE the wider sky-world with atmospheric layers.

━━━ SKY LAYER (the world overhead and around) ━━━
${sky_layer}

The sky is HALF the painting. Render it with painterly atmospheric depth — multi-tier cloud layers, sunset gradients, weather fronts, light-shafts breaking through, distant horizons.
${phenomenonSection}
━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep distance — a small detail implying the wider sky-world (distant dirigible silhouette / mooring spire / sky-island / lighthouse-rock / vessel debris / migrating creatures). NEVER eclipsing the hero ship.

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
Wide cinematic sky frame — vessel occupies 30-50% of frame as the hero subject. Multi-tier depth: FOREGROUND tactile vessel detail / brass-rail / propeller / mooring line → MIDGROUND the airship body in full glory → DEEP DISTANCE the sky-world receding into atmospheric layers. NOT a tight close-up on hull rivets. NOT a tiny silhouette in distant landscape. Sweet spot: airship reads at clear scale with the sky-world wrapping around it. THINK movie-poster establishing shot — every quadrant earning its space.

━━━ HARD BANS ━━━
- NO primary human figure in frame (tiny crew silhouettes OK at scale-prover scale only)
- NO modern aircraft / NO spaceships / NO pure-fantasy fae-ships
- NO ground / city / harbor as primary subject — this is a SKY scene
- NO decorative cliché framing (clocks/gears pasted at frame edges)
- NO substituting your own descriptions for the pool entries

━━━ STRUCTURE — write the prompt in this exact order ━━━
[OPENING: "[airship scene from the scene slot — the hero vessel + its immediate context]"], [the SKY LAYER from the sky slot dominating background], [PHENOMENON if rolled, rendered as visible drama], [SURPRISE ELEMENT at midground or deep distance], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish the airship as the hero. The sky-world wraps around it. Every quadrant of the frame has something striking. THINK Mortal-Engines or Treasure-Planet establishing shot.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_CURIO: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, curio, habitat, ornate_flourish } = slots;
    const flourishes = Array.isArray(ornate_flourish) ? ornate_flourish : [ornate_flourish];

    return `You are a cinematic illustration painter writing a STEAMPUNK CURIO scene for SteamBot — a single ANIMATE little steampunk robot creature in an IMMERSIVE Victorian-industrial habitat. The creature is the HERO of the frame; the habitat is its lived-in environment, NOT a museum display.

━━━ CREATURE IS THE HERO — NON-NEGOTIABLE ━━━
The animate robot creature fills 40-60% of the frame as the primary subject. Composition is creature-in-environment — the camera caught it in its world. The viewer's eye lands on the ROBOT CREATURE first, with the steampunk habitat wrapping around it.

━━━ ALIVE IN MOTION — NON-NEGOTIABLE ━━━
The curio is a STEAMPUNK ROBOT — a little mechanical creature mimicking a real living thing (animal / insect / bird / sea-creature) OR a novel mechanical organism (chimera / impossible-anatomy / abstract-animate-form). ALWAYS rendered in a moment of motion / animation / alive-looking pose. Mid-stalking / mid-fluttering / mid-feeding / mid-step / mid-curl / wings half-spread / breathing visibly through chest-bellows / eyes tracking. The viewer feels it could move at any second. NEVER static-decorative, NEVER frozen-pose. Articulated joints visibly active. Internal mechanisms (gears / springs / pistons / clockwork-heart) visibly working.

━━━ NEVER JEWELRY / CROWN / CLOCK / DECORATIVE-OBJECT — ABSOLUTE ━━━
NO crowns, NO tiaras, NO jewelry / brooches / pendants / necklaces, NO Faberge eggs, NO clocks / pocket-watches / chronographs as subject, NO monocles, NO ceremonial cups / decorative vases, NO weapons, NO scrolls / books. The curio is ALWAYS a mechanical creature / organism — never an ornamental object.

━━━ NEVER MUSEUM-DISPLAY FRAMING — ABSOLUTE ━━━
NO museum vitrines, NO Sotheby's-catalog backdrops, NO velvet-cushion pedestals, NO glass bell-jars, NO neutral catalog paper, NO "displayed on" / "presented on" framing. The creature is in a LIVED-IN STEAMPUNK SPACE — not on display. The habitat surrounds it.

━━━ NO PRIMARY HUMAN FIGURE ━━━
NO people, NO hands, NO faces. Pure creature-in-environment portrait. The robot creature stands alone in its habitat.

━━━ THE CURIO (the hero creature) ━━━
${curio}

Render the creature with OBSESSIVE Victorian-industrial detail — every brass rivet, every gear-tooth, every articulation-joint, every glass-eye, every leather-strap, every clockwork-mechanism visible. Captured at a loaded instant of motion.

━━━ THE HABITAT (the lived-in steampunk environment) ━━━
${habitat}

Render the habitat with depth-on-depth — FOREGROUND tactile detail near the creature (workbench surface / book-spine / brass railing / instrument it's perched on) → MIDGROUND surrounding props (tools, books, plants, glassware) → DEEP DISTANCE the wider room receding into atmospheric haze. The space feels lived-in, functional, real — not a display.

━━━ ORNATE FLOURISHES — render ALL THREE on the object ━━━
- ${flourishes[0] || ''}
- ${flourishes[1] || ''}
- ${flourishes[2] || ''}

These are micro-details that obsessively saturate the object's surface. EVERY one must be visible.

━━━ LIGHTING ━━━
${lighting}

Lighting is environmental — the habitat's natural light source (gas-lamp / candlelit / sunlit through glass / forge-red glow / moonlit / amber lamp-pool) catches the creature's metallic surfaces. Cinematic but not museum-spotlit.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OBSESSIVE STEAMPUNK CRAFTSMANSHIP — NON-NEGOTIABLE ━━━
Brass + copper + bronze + oiled-wood + glass dominant. Every visible surface is hand-tooled, hand-engraved, hand-fabricated. NEVER mass-produced-looking. NEVER plastic. NEVER modern.

━━━ COMPOSITION ━━━
Creature-in-environment cinematic framing. The CREATURE centered or slightly offset, mid-motion. Habitat wraps around and behind — foreground tactile prop near the creature → midground surrounding environment → deep distance receding into atmospheric haze. NEVER a tight close-up that crops the creature. NEVER a wide-shot where the creature becomes small. Sweet spot: creature reads at clear scale with the lived-in steampunk world grounding it.

━━━ HARD BANS ━━━
- NO primary human figure (no people, no hands, no faces)
- NO modern objects (no plastic, no LEDs, no electronics — this is 1890s impossible-engineering)
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative cliché framing (gears/clocks pasted at the edges as decoration)

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING: the curio described with obsessive detail — the OBJECT first], [the three ornate flourishes worked in], [the display register / display context], [lighting], [atmospheric detail], [color palette + mood]

CRITICAL — the OPENING tokens establish the OBJECT as the hero. The display context wraps the lower frame. The atmosphere adds Wunderkammer mood without competing with the object for attention.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_SPECTACLE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, event, crowd_detail, surprise_element, escalation } = slots;

    const escalationSection = escalation
      ? `
━━━ ESCALATION — render this dramatic intensification ━━━
${escalation}

A dramatic escalation of the event — render as a visible focal point amplifying the crowd's reaction. Adds heightened drama. NEVER mass violence, NEVER gore — atmospheric/mechanical/social drama only.

`
      : '';

    return `You are a cinematic concept-painter writing a STEAMPUNK SPECTACLE scene for SteamBot — a grand Victorian-industrial event / ceremony / festival / performance / uprising with crowd energy and drama. The EVENT is the subject. Wide cinematic establishing shot or dramatic crowd-level angle. Prestige feature-film concept-render polish.

━━━ THE EVENT IS THE SUBJECT — NON-NEGOTIABLE ━━━
The event commands the frame. NEVER a single hero figure. The crowd, the spectacle, the moment — all of it together is the subject. Tiny figures against massive machinery, packed balconies, sea of top-hats and goggles, multi-tier spectators.

━━━ THE EVENT (the moment captured) ━━━
${event}

Render the event with OBSESSIVE Victorian-industrial detail and depth-on-depth — FOREGROUND figures (a few prominent characters in the closest tier) → MIDGROUND the event-action and its main participants → DEEP DISTANCE wider crowd extending into atmospheric haze. The event feels MASSIVE and ALIVE.

━━━ CROWD DETAIL — the human-energy texture ━━━
${crowd_detail}

Render the crowd as a textured living mass — specific clothing details visible (top-hats / corsets / brass-goggles / waistcoats / parasols / military uniforms / labor-aprons / urchin caps). Mixed Victorian society — the crowd composition tells the story.

━━━ SURPRISE ELEMENT — secondary detail adding story ━━━
${surprise_element}

Place at midground or deep distance — a small detail amplifying the moment (press photographer crouched, distant airship hovering to witness, signal beacon, escaped automaton, vendor cart at frame edge). NEVER eclipsing the event.
${escalationSection}
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

━━━ OBSESSIVE STEAMPUNK CRAFTSMANSHIP — NON-NEGOTIABLE ━━━
Every gear, rivet, pipe, valve, pressure-gauge, polished-brass-surface, copper-patina-detail rendered with MAXIMUM detail. Warm brass + copper + bronze + oiled-wood DOMINANT palette. Surface density everywhere. NEVER sparse, NEVER minimal.

━━━ COMPOSITION ━━━
Wide cinematic establishing shot OR dramatic crowd-level angle. Multi-tier depth: FOREGROUND tactile crowd-detail → MIDGROUND event-action with main participants → DEEP DISTANCE wider crowd + atmospheric layers receding. NEVER tight close-up on one face. NEVER pulled-back to where the crowd becomes pinpricks. Sweet spot: spectacle reads with epic scope, individual figures readable as story-anchors.

━━━ HARD BANS ━━━
- NO single hero figure dominating (event is the subject — not a person)
- NO modern objects (this is 1890s impossible-engineering)
- NO mass violence / blood / gore — drama is mechanical / social / atmospheric
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative cliché framing (gears/clocks pasted at the edges as decoration)

━━━ STRUCTURE (write in this order) ━━━
[OPENING: wide cinematic establishing-shot of THE EVENT], [the event-action with detailed unfolding], [the crowd detail texture], [surprise element at midground], [escalation if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish the EVENT as the subject. The crowd is the human texture. The atmosphere amplifies.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAM_TRANSPORT: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, transport, terrain_drama, surprise_element, phenomenon } = slots;

    const phenomenonSection = phenomenon
      ? `
━━━ ATMOSPHERIC PHENOMENON — render this visibly in the scene ━━━
${phenomenon}

A dramatic atmospheric event amplifying the journey — render as a visible focal point charging the scene. Heightens the "impossible geography" mandate.

`
      : '';

    return `You are a cinematic concept-painter writing a STEAM TRANSPORT scene for SteamBot — a Victorian-industrial vehicle conquering DRAMATIC TERRAIN. Locomotives, submarines, walking-machines, paddleboats, steam-carriages, mine-cages, clockwork-creatures-as-transport. The machine + the landscape create the drama TOGETHER. The frame should make the viewer feel the SCALE and AUDACITY of crossing impossible geography. Mortal-Engines / Snowpiercer / 20,000-Leagues / Wild-Wild-West-loco / Howl's-Moving-Castle / Ghibli-train-from-Spirited-Away visual lineage.

━━━ VEHICLE IS FOCAL — TERRAIN IS THE STAGE ━━━
The vehicle is the central subject, but the landscape is what makes it dramatic. NEVER a vehicle on flat boring track. ALWAYS the vehicle in a setting that AMPLIFIES — canyon bridge in a storm, mountain pass with avalanche, deep-sea trench with bioluminescent creatures, desert dune-field at sunset, ice-shelf with calving icebergs, jungle valley with vine-covered ruins, sky-rail across a chasm.

━━━ THE TRANSPORT SCENE (vehicle + immediate setting) ━━━
${transport}

Render the vehicle with OBSESSIVE Victorian-industrial detail — every rivet, every steam-vent, every brass pipe, every weathered plate. The vehicle's MATERIALITY is the signature.

━━━ TERRAIN DRAMA — the geography that makes the scene epic ━━━
${terrain_drama}

Render the terrain DRAMATICALLY with depth-on-depth — FOREGROUND tactile detail (rail-tie / hull-plate / vehicle-edge near camera) → MIDGROUND the vehicle traversing the dramatic geography → DEEP DISTANCE the impossible landscape stretching beyond. The terrain dwarfs and amplifies the vehicle simultaneously.

━━━ SURPRISE ELEMENT — secondary detail adding story ━━━
${surprise_element}

Place at midground or deep distance — a small detail implying the wider world (distant signal-tower, second vehicle on parallel track, scattered crew on observation deck, mechanical wildlife). NEVER eclipsing the hero vehicle.
${phenomenonSection}
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

━━━ OBSESSIVE STEAMPUNK CRAFTSMANSHIP — NON-NEGOTIABLE ━━━
Every gear, rivet, pipe, valve, pressure-gauge, polished-brass-surface, copper-patina-detail rendered with MAXIMUM detail. Warm brass + copper + bronze + oiled-wood DOMINANT palette. Steam trails, smoke plumes, headlamp beams cutting through weather. NEVER sparse, NEVER minimal.

━━━ COMPOSITION ━━━
Wide cinematic establishing-shot. Vehicle at 25-50% of frame as the focal subject. Multi-tier depth — FOREGROUND tactile (rail / hull / track-edge) → MIDGROUND the vehicle traversing the terrain → DEEP DISTANCE the impossible landscape with atmospheric layers. Show SCALE — the machine vs the landscape. Steam trails / smoke plumes / headlamp beams / wake-spray cut through the air. Three-quarter angle preferred so the vehicle's silhouette reads.

━━━ HARD BANS ━━━
- NO vehicle on flat boring track / NO vehicle in empty space — terrain MUST amplify drama
- NO primary human figure (tiny crew silhouettes OK as scale-provers)
- NO modern vehicles (this is 1890s impossible-engineering)
- NO decorative cliché framing (gears/clocks pasted at the edges)
- NO substituting your own descriptions for the pool entries — render what's locked

━━━ STRUCTURE (write in this order) ━━━
[OPENING: wide cinematic shot of the VEHICLE conquering the dramatic terrain — vehicle + terrain in one image], [the vehicle's Victorian-industrial detail], [the terrain drama amplifying the journey], [surprise element at midground], [phenomenon if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish VEHICLE + DRAMATIC TERRAIN as the subject. The machine and the landscape together make the frame epic.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_COZY_STEAMPUNK: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, room, flora, window_view, intricate_detail, quiet_moment } = slots;
    const floraArr = Array.isArray(flora) ? flora : [flora];
    const detailArr = Array.isArray(intricate_detail) ? intricate_detail : [intricate_detail];

    const quietSection = quiet_moment
      ? `
━━━ QUIET MOMENT — render this comforting detail ━━━
${quiet_moment}

A small comforting human-trace detail — a book left open on the bed, a teacup cooling on the side-table, a cat curled on a velvet chair, an unfinished letter on the writing desk. Adds the feeling that someone JUST WAS HERE. Place at midground, NEVER eclipsing the room or window.

`
      : '';

    return `You are a cinematic interior painter writing a COZY STEAMPUNK ROOM scene for SteamBot — a dreamy, ethereal, comforting Victorian-industrial interior with a beautiful window view. The room itself is BEAUTIFUL (pretty steampunk furniture, flower arrangements, plants, ornate fixtures), AND the window view is BEAUTIFUL (sunset / rainstorm aqua sky / distant airships / cloudtops). Multi-layered: the pretty room + the pretty window view TOGETHER make the frame. The viewer should feel the urge to step in, sit down, and look out the window.

━━━ THE FEELING — NON-NEGOTIABLE ━━━
DREAMY. ETHEREAL. COMFORTING. SURREALLY BEAUTIFUL. The kind of room you'd want to spend a quiet afternoon in. Soft, warm, intricate, lived-in. Not a documentary photograph — a painted dream of a place that doesn't quite exist.

━━━ MULTI-LAYERED COMPOSITION — NON-NEGOTIABLE ━━━
TWO HEROES side-by-side: (1) the cozy steampunk INTERIOR and (2) the beautiful WINDOW VIEW visible through tall windows / glass doors / a glass-and-iron conservatory wall. Both must read clearly. Compose so the room fills 60-70% of the frame and the window view occupies the remaining 30-40% as a glowing portal into the outside world. The window is a focal element of the room — large, ornate, framing a vista.

━━━ THE ROOM (the cozy steampunk interior) ━━━
${room}

Render the room with depth-on-depth — FOREGROUND tactile detail (bedpost edge, cushion corner, side-table surface) → MIDGROUND the room's central furniture and the figure-of-the-space → BACKGROUND the window-wall with its view. Period-accurate Victorian-industrial — brass beds, velvet drapes, mahogany side-tables, leather chairs, copper sconces, oriental rugs, hand-tooled fixtures. Lived-in, warm, intricate.

━━━ FLORA — render ALL THREE in the scene ━━━
- ${floraArr[0] || ''}
- ${floraArr[1] || ''}
- ${floraArr[2] || ''}

Flowers and plants fill the room with life — fresh-cut blooms in crystal vases, climbing vines around the window, potted ferns on side-tables, hanging gardens, brass-banded planters. EVERY one must be visible. They soften the steampunk industrial edges into something tender.

━━━ THE WINDOW VIEW (the beautiful outside) ━━━
${window_view}

Render the view through the tall ornate window as a CLEAR, RICHLY-COLORED scene — the viewer can see the sunset / sky / airships / cloudtops / distant city. The window is a portal into wonder. Subtle atmospheric haze where it makes sense, but never a fog-bath — the view is READABLE.

━━━ INTRICATE DETAILS — render BOTH on the room's fixtures ━━━
- ${detailArr[0] || ''}
- ${detailArr[1] || ''}

These are the ornate steampunk touches that saturate the room with craftsmanship — every brass fitting, every copper hinge, every clockwork ornament, every carved wood-panel. Render with OBSESSIVE detail.
${quietSection}
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

━━━ DREAMY ETHEREAL RENDER QUALITY ━━━
The render reads PAINTED + WARM + SOFT. NOT documentary photoreal, NOT cold-CGI, NOT gritty-realism. Painterly cinematic with rich saturated jewel-tone color. The light streaming through the window kisses the room's surfaces gently. Atmospheric depth without volumetric soup. Every layer — room foreground, room midground, window view — reads CLEARLY.

━━━ COMPOSITION ━━━
Wide interior establishing-shot — slight three-quarter angle from inside the room, looking past the furniture-and-flora foreground/midground toward the window-and-view. NO single human figure as the subject (the room and view are the subject; tiny silhouette of someone seated at a chair from behind is fine as scale-prover). The room INVITES the viewer in.

━━━ HARD BANS ━━━
- NO single human figure dominating (the room itself is the subject)
- NO modern objects (this is 1890s impossible-engineering)
- NO gritty / muddy / industrial-slum register (this is DREAMY-COZY)
- NO heavy volumetric fog smothering detail
- NO empty/austere/minimalist room — must be lived-in, intricate, filled with flora and fixtures
- NO substituting your own descriptions for the pool entries — render what's locked

━━━ STRUCTURE (write in this order) ━━━
[OPENING: a wide interior establishing-shot of a cozy dreamy steampunk room with a beautiful window view], [the room with its furniture and depth layers], [the three flora elements woven in], [the two intricate details on fixtures], [the window view as a glowing portal into wonder], [the quiet moment if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish the COZY ROOM + WINDOW VIEW together. The viewer takes a deep breath and wants to step inside.

Output ONLY the raw 120-160 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_LABS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, lab_space, centerpiece, apparatus, electrical, scientist } = slots;
    const details = Array.isArray(apparatus) ? apparatus : [apparatus];

    const electricalSection = electrical
      ? `
━━━ ELECTRICAL PHENOMENON (mandatory — Tesla-coded lab energy) ━━━
${electrical}

This electrical event adds dramatic experimental energy to the lab. It surrounds, accompanies, or originates from the centerpiece experiment. Render it visibly and prominently in the scene — branching arcs, plasma glow, static haze, or sparking discharge. The electrical glow contributes ONE of the mandatory 4+ glow colors.

`
      : '';

    const scientistSection = scientist
      ? `
━━━ TINY SCIENTIST FIGURE (scale-prover only — NEVER the focal subject) ━━━
${scientist}

A TINY lab-coated figure at midground edge, 5-10% of frame at most. The figure makes the experiment feel impossibly large by proximity. NEVER frontal-facing, NEVER posing for the camera, NEVER the focal subject.

`
      : '';

    return `You are a steampunk concept-art painter writing a MAD-SCIENCE LABORATORY scene for SteamBot. This is a FRANKENSTEIN-meets-TESLA mad-science laboratory PACKED WITH MULTI-COLORED GLOWING EXPERIMENTS — emerald potion-vessels + hot-pink sigil-circles + electric-blue Tesla-lightning + amber gas-lamp warmth + violet plasma-orbs, all visible simultaneously in the same frame. The lab BLAZES with experimental energy in a rainbow of saturated colors. Inspired by Tesla's Wardenclyffe lab / Frankenstein's reanimation tower / Nemo's Nautilus / Doc-Brown's-DeLorean-workshop / The-Time-Machine / Bioshock-Rapture-laboratory. The architecture is Victorian-industrial (brass-and-mahogany, arched-glass ceiling, gas-lamps) but the SCENE IDENTITY IS MAD-SCIENCE GLOWING CHAOS, not a quiet Victorian library.

⚠️ MANDATORY — MULTIPLE SIMULTANEOUS GLOW COLORS (NON-NEGOTIABLE) ━━━
This is THE defining feature of the path. EVERY render packs the frame with MULTIPLE GLOWING EXPERIMENTS in DIFFERENT colors visible SIMULTANEOUSLY. NEVER a single-color-dominant render. ALWAYS a rainbow of distinct glow-colors across the frame.

⚠️ MINIMUM 4 DIFFERENT GLOW COLORS visible simultaneously — use AT LEAST 4 of these in every render:
• EMERALD GREEN — bioluminescent potion-vessels, witch-fire glow
• ELECTRIC BLUE — Tesla-coil arcs, energy plasma, ice-experiments
• HOT PINK / MAGENTA — pulsing sigil-circles, ruby crystals
• AMBER / GOLDEN — alchemical fire, gas-lamp warmth, sulfur
• VIOLET / PURPLE — magical fields, levitation chambers, lightning
• CRIMSON / RUBY — blood-experiments, ruby-light apparatus
• AQUA / TEAL — frost-vessels, plasma-globes, mercury-vapor
• POISON YELLOW — toxic-experiments, alchemical sulfur
• SILVER-WHITE — moon-essence, mercury-vessels

Front and center: a glowing centerpiece + 2-3 other glowing apparatus + visible Tesla-coil-lightning OR plasma-discharge + a glowing sigil-circle on the floor or workbench — ALL DIFFERENT COLORS. The reference image has emerald-green potion-globe + hot-pink sigil-circle + electric-blue Tesla-lightning + amber gas-lamp warmth + violet smaller orbs, ALL in the same frame, ALL different colors. THAT is the target density and palette-mix.

⚠️ STRUCTURAL DENSITY MANDATE — minimum 5-8 distinct glowing things across the frame:
• 1 large CENTERPIECE experiment glowing brightly (use the centerpiece slot's color)
• 3+ smaller glowing potion-vessels around the room (each in a DIFFERENT color than the centerpiece AND each other)
• 1+ Tesla-coil lightning / plasma-glow / electrical-arc phenomenon crackling visibly
• 1+ glowing sigil-circle etched into the floor — pulsing with magical light in yet ANOTHER color
• Multiple smaller glowing accents — pulsing crystals, lit-up vials on shelving, glowing ports on apparatus, runic patterns etched into brass

The room is ALIVE with saturated glow in 4-6 DIFFERENT COLORS simultaneously. Frankenstein's-creature-reanimation-scene + Doc-Brown's-DeLorean-workshop + Tesla's-Wardenclyffe energy. Every shelf has glowing things, every workbench has glowing things, every wall has glowing things. NEVER a quiet Victorian library / brewery / observatory feel. NEVER a single-color-dominant render. ALWAYS mad-science MULTI-COLORED glowing chaos.

⚠️ ABSOLUTE BAN — NO single-color-dominant render. NO subtle-glow render. NO empty-of-experiments render. NO mostly-amber-monochromatic. NO mostly-violet-monochromatic. The frame contains at LEAST FOUR DIFFERENT GLOW COLORS visible at once.

━━━ THE COMPOSITION — RICH LAYERED LAB INTERIOR ━━━
WIDE CINEMATIC INTERIOR SHOT. Multi-tier depth mandatory:
• FOREGROUND: tactile lab details — workbench edges, peripheral apparatus, glowing sigil-circles on the floor (different color from centerpiece), glowing potion-vessels in close detail (each in a DIFFERENT color)
• MIDGROUND: THE CENTERPIECE EXPERIMENT — the major glowing apparatus that anchors the scene (the viewer's eye lands here FIRST)
• DEEP DISTANCE: the lab architecture rises around and beyond — shelving climbing the walls covered in glowing vials in MIXED colors, balconies, the arched-glass ceiling above
• SKY/CEILING: arched-glass overhead OR vaulted-brick OR timber rafters — Tesla-lightning OR plasma-glow crackling across the upper space

Camera angle options: eye-level looking into the centerpiece / low-angle looking up at the soaring ceiling / three-quarter establishing-shot showing both depth and height. NEVER head-on portrait. NEVER a tight close-up.

━━━ RICH VICTORIAN-INDUSTRIAL DETAIL — NON-NEGOTIABLE ━━━
EVERY SURFACE IS PACKED WITH DETAIL — Victorian-industrial intricate. Every shelf has GLOWING glassware (different colors), every wall has mounted glowing instruments, every workbench has glowing apparatus + scattered diagrams, every cornice has brass-clockwork ornament. The room is BUSY + LIVED-IN + INTRICATE + GLOWING — never sterile, never quiet.

Render ALL THREE of these specific apparatus details VISIBLY in the frame (each in a DIFFERENT glow color from the centerpiece):

  • APPARATUS 1: ${details[0] || ''}
  • APPARATUS 2: ${details[1] || ''}
  • APPARATUS 3: ${details[2] || ''}

PLUS layer additional Victorian-industrial detail throughout — mahogany floor-to-ceiling shelving packed with multi-colored glowing glassware, brass-railed mezzanines, gas-lamp sconces every few feet, copper-pipe rigging overhead, mosaic-tile sigil-patterns on the floor, hanging chains and pulleys, brass-rimmed leaded-glass cabinets with glowing specimens.

━━━ STRICT STEAMBOT MAD-SCIENCE ━━━
🚫 NO modern / digital / electric-bulb / LED / fluorescent / computer
🚫 NO clinical / sterile / empty / minimalist / quiet
🚫 NO horror / no skulls / no specimen-jars-of-organs / no dismemberment / no gore
🚫 NO sci-fi / cyberpunk / neon-cyberpunk
🚫 NO factory / warehouse / industrial-scaffold / no brewery
🚫 NO Victorian library / observatory / drawing-room (this is a MAD-SCIENCE LAB)
🚫 NO weaponry / no destruction
🚫 NO single-tier flat composition — always multi-level + arched + vaulted
🚫 NO single-color-dominant glow — always 4+ different glow colors
🚫 NO primary human figure (scientist is a TINY scale-prover only)
✓ Tesla's Wardenclyffe / Frankenstein's tower-lab / Nemo's Nautilus / Doc-Brown's-DeLorean-workshop / The-Time-Machine / Bioshock-Rapture-laboratory / Royal Society

━━━ THE LAB SPACE (the room — backdrop and stage) ━━━
${lab_space}

The space anchors the scene's Victorian-industrial identity. Multi-tier architecture. Brass-and-mahogany shelving (packed with multi-colored glowing glassware). Gas-lamps casting warm amber light into the room — but the SATURATED color comes from the EXPERIMENTS, not the gas-lamps.

━━━ THE CENTERPIECE EXPERIMENT (THE FOCAL POINT — render BIG and PROMINENT) ━━━
${centerpiece}

This is THE focal point of the image. Position it in the midground at the center-ish of the frame. It is the glowing thing the viewer's eye lands on first. Render it with obsessive material detail — every brass fitting, every glass curve, every glowing-liquid swirl, every wisp of vapor, every spark. The centerpiece occupies 20-35% of the frame. Its glow is the DOMINANT glow color in the render — but NEVER the only one.
${electricalSection}${scientistSection}━━━ LIGHTING ━━━
${lighting}

Combined with WARM gas-lamp ambient AND the SATURATED multi-color experiment glow. MANY light sources at once — gas-lamps soft amber, centerpiece glow as one dominant saturated accent, 3+ apparatus glows as secondary accents in different colors, electrical phenomenon arcing in another color. The room is a rainbow of saturated glow.

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

Steampunk-coded — steam-curls from open valves, copper-pipe condensation, ozone-mist around electrical apparatus, dust-of-ages in shaft-of-light, smoke from gas-lamps, vapor curling from active experiments. The vapor catches the multi-colored glow from nearby experiments.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ MOVIE-POSTER CRANK MANDATE — APPLY TO EVERY RENDER ━━━
This is NOT a still photograph — this is a MOVIE-POSTER PROMOTIONAL FRAME from a feature film about a mad-scientist's laboratory. Render as if this image will sell the film. Apply ALL of:

  1. THEATRICAL RIM-LIGHTING — single dramatic key-light source (the centerpiece's glow OR Tesla-arc OR shaft of moonlight through the arched glass ceiling) carves the lab apparatus into mythic silhouettes. Rim-light on every brass edge, on glass curves, on the scientist's coat if rolled.
  2. EVERY QUADRANT INTENTIONAL — each quadrant has its own striking glowing element. Top-left: arched-ceiling drama (Tesla-arc / vaulted-brass / leaded-glass dome with stars). Top-right: another (hanging brass-chandelier / overhead pipe-rigging / second-story balcony with glowing vials). Bottom-left: foreground apparatus (close-detail brass instrument / glowing potion-vessel close to camera). Bottom-right: ditto (sigil-circle / workbench corner / glowing crystal). NEVER an empty quadrant.
  3. OBSESSIVE MATERIAL DETAIL — every brass fitting catches a different reflection, every glass curve shows the apparatus inside, every wooden surface shows grain, every glowing-liquid has visible swirl/vapor/condensation, every spark of electricity branches with multi-arc detail, every gas-lamp shows mantle-glow + wick + reflective brass.
  4. STORYTELLING BEAT — the frame tells a story mid-action. An experiment is ACTIVELY HAPPENING: liquid bubbling, vapor rising, Tesla-arcs frozen mid-discharge, sigil-circles pulsing mid-incantation, a beaker just spilled mid-pour, a notebook open on the workbench mid-equation. NEVER a static empty lab — always a frozen instant of mad-science IN PROGRESS.
  5. ATMOSPHERIC HAZE WITH VOLUMETRIC LIGHT — gas-lamp light slices through ozone-mist / steam-curls / electrical-ionization-haze in visible god-rays. AIR has saturation and depth. Multi-colored glow bleeds INTO the surrounding atmosphere — emerald haze near the green vessel, pink haze near the sigil, electric-blue ionization near the Tesla-coil.
  6. SATURATED MULTI-COLOR JEWEL-TONE PALETTE WITH DEEP-SHADOW CONTRAST — rich emerald + hot-pink + electric-blue + amber + violet jewel-tones blazing against deep mahogany shadow and inky brass-velvet darkness. The contrast is DRAMATIC — saturated lights against absolute dark. NEVER washed-out, NEVER pastel, NEVER muted.
  7. CINEMATIC FEATURE-FILM PRODUCTION DESIGN — feels like a still from a tentpole feature film. Production design polish. Every prop placed deliberately. Every shelf curated. Every detail intentional. NOT amateur, NOT empty, NOT undesigned.
  8. ESTABLISHING-SHOT DRAMA — the kind of wide cinematic shot that opens a film and makes the audience GASP at the mad-science world they're about to enter. Frankenstein-castle-lab-reveal / Doc-Brown's-DeLorean-garage-pull-back / Bioshock-Rapture-establishing-shot / Tesla-Wardenclyffe-entrance energy.

━━━ STRUCTURE (write the prompt in this order for best results) ━━━
[OPENING: a wide cinematic interior establishing-shot of a soaring steampunk mad-science laboratory PACKED WITH MULTI-COLORED GLOWING EXPERIMENTS — name the colors: emerald + electric-blue + hot-pink + amber + violet all visible], [the centerpiece experiment glowing dramatically in the midground], [the electrical phenomenon if rolled — Tesla arcs / plasma-glow], [the three apparatus details around the room — each in a DIFFERENT glow color from the centerpiece], [the scientist figure if rolled — TINY scale-prover at midground edge], [foreground tactile detail with rim-light], [lighting fills the room — gas-lamps + multi-color experiment glow + theatrical key-light], [atmospheric vapor / steam / ozone in volumetric god-rays], [color palette and mood]

CRITICAL — every render is a MOVIE-POSTER PROMOTIONAL FRAME. MAD-SCIENCE GLOWING CHAOS in 4+ DIFFERENT COLORS. Every quadrant intentional. Story mid-action. Saturated jewel-tones against deep shadow. The kind of shot that opens a feature film.

Output ONLY the raw 120-160 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_STEAMPUNK_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, character, landscape, surprise_element, event } = slots;

    const eventSection = event
      ? `
━━━ STORY EVENT — render this happening in the scene ━━━
${event}

A specific dramatic event unfolding in the world — render it as a visible secondary focal point (NOT eclipsing the character, but charging the scene with story). NEVER combat / NEVER violence — atmospheric drama only.

`
      : '';

    return `You are a cinematic concept-painter writing a STEAMPUNK SCENE composition for SteamBot — a single role-based steampunk character integrated into a wildly imaginative Victorian-industrial landscape. Prestige feature-film concept-render polish, rich production design, photoreal physical light + materials.

━━━ THE LANDSCAPE IS A CO-HERO — NON-NEGOTIABLE ━━━
The steampunk landscape commands 50-70% of the frame visual weight. The character occupies 15-25% of frame vertically as a STORY-ANCHOR — not the dominant subject. The viewer's eye drinks in the world FIRST, then finds the figure within it. The landscape is wildly imaginative, impossible, jaw-dropping Victorian-industrial — gear-waterfalls / clockwork-cathedrals / floating-metropolises / mechanical-jungles / brass-canyons.

━━━ THE CHARACTER ━━━
${character}

Render the character with crisp identity detail — period-accurate Victorian-industrial costume, role-readable silhouette, captured in a candid moment inside the world. Solo (one figure only). NOT posing for camera. NOT a hero-stance.

━━━ THE LANDSCAPE (the wildly imaginative steampunk world) ━━━
${landscape}

Render the landscape with OBSESSIVE Victorian-industrial detail and depth-on-depth — FOREGROUND tactile detail near the character (brass railing / cobblestone / pipework she's-or-he's beside) → MIDGROUND the landscape body and the character within it → DEEP DISTANCE the wider world receding into atmospheric haze. The landscape feels lived-in, impossibly real, monumental.

━━━ SURPRISE ELEMENT — secondary subject adding story ━━━
${surprise_element}

Place at midground or deep distance — a small detail implying the wider world (distant airship / mechanical creature / signal-tower / sky-passenger). NEVER eclipsing the character or competing with the landscape.
${eventSection}
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

━━━ OBSESSIVE STEAMPUNK CRAFTSMANSHIP — NON-NEGOTIABLE ━━━
Every gear, rivet, pipe, valve, pressure-gauge, polished-brass-surface, copper-patina-detail rendered with MAXIMUM detail. Warm brass + copper + bronze + oiled-wood DOMINANT palette. Surface density everywhere. NEVER sparse, NEVER minimal.

━━━ COMPOSITION ━━━
Wide cinematic establishing-shot. Character at 15-25% of frame vertically — IN the landscape, INTERACTING with it. NEVER tight character close-up. NEVER pulled-back-to-tiny-silhouette. Sweet spot: character readable but clearly a story-anchor in a world that surrounds them. Three-quarter angle or side profile preferred.

━━━ HARD BANS ━━━
- NO tight character close-up (character is NOT the dominant subject — landscape is the co-hero)
- NO modern objects (this is 1890s impossible-engineering)
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative cliché framing (gears/clocks pasted at the edges as decoration)
- NO combat / NO violence — the event slot is atmospheric drama, not battle

━━━ STRUCTURE (write in this order) ━━━
[OPENING: a wide cinematic shot of [character] in [landscape]], [the landscape with OBSESSIVE detail + depth + atmospheric layers], [the character integrated into the world at story-anchor scale], [surprise element at midground], [event if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens establish the LANDSCAPE as the canvas with the character as the story-anchor. The world surrounds them.

Output ONLY the raw 100-130 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },

  STEAMBOT_AIRSHIP_FEMALE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      role,
      skin,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      action,
      backdrop,
      drama,
    } = slots;

    return `You are a cinematic illustration painter writing an AIRSHIP-ACTION SCENE for SteamBot — a single female air-officer / sky-corsair caught MID-ACTION on or around a steampunk airship. Lush vibrant painted illustration register — finished animation key-art / luxe production-painting feel (Treasure-Planet / Last-Exile / Howl's-Moving-Castle / Mortal-Engines Anna-Fang / Skies-of-Arcadia lineage). She is DOING SOMETHING — never posing, never stationary. Combat allowed. Solo hero with background figures permitted in mid-distance.

━━━ GENDER + ETHNICITY LOCK — ABSOLUTE FIRST RULE ━━━
The subject is a WOMAN of a SPECIFIC ETHNICITY locked by the skin pool entry below. The opening MUST literally start with the ethnicity-noun-phrase from the skin pool — e.g. "a Japanese woman", "a Nigerian woman", "a Persian woman", "a Comanche woman", "a mixed-heritage Brazilian woman" — followed immediately by her action and setting. Do NOT substitute "captain", "officer", "navigator", "pirate" for the ethnicity-noun. Do NOT generalize to "a young woman" or "a beautiful woman". The skin pool entry locks the ethnicity — render it. Use she/her throughout.

━━━ SHE IS THE SHOW — NON-NEGOTIABLE ━━━
The female air-officer is the MAIN SUBJECT. Her face, outfit, accessory, and MID-ACTION pose are the draw. She occupies 40-60% of the frame vertically — FULL BODY or three-quarter-body visible, head no larger than 12% of frame. NOT a tiny silhouette. NOT a wide vista with character as afterthought. Telephoto compression keeps her crisp; airship deck / rigging / brass hardware in MIDGROUND; sky / city / terrain in DISTANT background with atmospheric haze. The frame is composed like a movie poster — her in the strike of action, world rushing past behind.

━━━ THE ACTION — what she is DOING RIGHT NOW (the headline of the render) ━━━
${action}

She is CAUGHT MID-MOTION — body weight engaged, muscles working, hair whipping, coat swirling, brass clasps catching light. NEVER posed-for-camera. NEVER stationary-portrait. The viewer should be able to SEE the next frame of the action in their imagination. If the action involves combat (cannon-fire / pistol-duel / boarding / repelling boarders), render the kinetic specifics: muzzle-flash, cannon-smoke, sparks from a parried sword, recoil in her shoulder, the enemy mid-leap.

━━━ THE AIRSHIP DECK + SETTING — HER STAGE ━━━
She is on or around a steampunk airship. Render the deck / rigging / brass-railing / cannon-port / chart-table / speaking-tube / signal-lanterns / wheel / spotter-platform / dirigible-spine / rope-rigging — whatever IMMEDIATE airship feature anchors the action. The ship is LIVED IN, FUNCTIONAL, real — never decorative-clutter framing. Brass + leather + canvas + oiled-mahogany + glass + copper material vocabulary.

━━━ THE BACKDROP — secondary, distant, atmospheric ━━━
${backdrop}

This is BEYOND the airship — sky, clouds, distant terrain, distant city, sister-airships in formation, etc. Render with depth-on-depth haze. NEVER lets the backdrop steal focus from her — the backdrop reads as the world rushing past, not as the subject.

━━━ HER ROLE (her rank / archetype — informs how she carries herself + what she's commanding) ━━━
${role}

━━━ HER COMPACT BIO (one-line block — DO NOT expand into separate sections) ━━━
${skin.split(',')[0]}, with ${eyes.split(',')[0]} eyes, ${hair_color.split(',')[0]} hair styled ${hairstyle.split(',')[0]}, wearing ${outfit}, equipped with ${accessory}.

The ethnicity-noun-phrase at the head of the skin entry IS the opening of your prompt — copy it verbatim. (All seven DNA elements should be discernible in the render. Face fully visible.)

━━━ THE OUTFIT IS A MAJOR SHOW — NON-NEGOTIABLE ━━━
Render the OUTFIT with OBSESSIVE craftsmanship detail. Period-correct steampunk-airship-officer fashion — corseted leather flight jacket, brass-pauldron flight suit, fitted tailored greatcoat with brass epaulets, riding-skirt over knee-high boots, Persian sky-corsair silk caftan belted with brass kris-handle, Tokyo airship-academy fitted dress-uniform with gear-embroidered collar — whatever silhouette the wardrobe pool rolls, render it as TAILORED, LAYERED, FUNCTIONAL, BEAUTIFUL. Every brass clasp, every copper button, every leather strap, every embroidered cuff, every goggle-strap, every ammunition-bandolier rendered explicitly. The outfit reads as combat-capable AND beautiful at the same time.

━━━ HAIR IS A FEATURE ━━━
Render her hair as ALIVE in the moment — whipping in storm-wind, escaping its braid in mid-action, billowing under flight goggles, tendrils torn loose by cannon-recoil. NEVER flat / styled / static. The hair carries the motion of the action.

━━━ ACCESSORY MANDATE — DETAILED + STEAMPUNK-CODED ━━━
The equipment she carries / wears must be rendered with OBSESSIVE mechanical detail and steampunk specificity. Brass + copper + leather + gemstone + clockwork. Every gear visible, every rivet shown, every patina rendered. Combat-capable equipment preferred over decorative jewelry — brass-pistol, mechanical-arm prosthetic, spyglass, sky-compass, signal-flare-launcher, bandolier of brass shells, etc.

━━━ BACKGROUND FIGURES — ALLOWED, NEVER CO-PROTAGONIST ━━━
You MAY render background figures in MID-DISTANCE if the action calls for it — crew working the rigging behind her, enemy boarders mid-leap on a parallel ship, a wounded crewman being dragged to safety, a tiny silhouette of a fellow officer at the wheel. But they MUST stay small (under 15% of frame each), MUST be in midground or further, MUST NOT have detailed faces. SHE is the single focal point.

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
${
  drama
    ? `
━━━ DRAMATIC ENVIRONMENTAL EVENT (fires this render) ━━━
${drama}

Weave this event into the scene — lightning forking nearby, sparks from a damaged engine, a sister-ship's broadside blooming smoke, a vortex pulling at the sails. The event ESCALATES the action but does NOT replace her as the focal point.
`
    : ''
}
━━━ COMPOSITION ━━━
Three-quarter angle or dynamic side profile so we see her face, body, and outfit AS SHE ACTS. Telephoto compression — character crisp, background atmospherically hazed. Movie-poster cinematic framing. FOREGROUND: tactile airship hardware near her (railing, brass-cannon-breech, rope-rigging, brass-instrument she's gripping). MIDGROUND: HER, full-body or three-quarter, mid-action, 40-60% of frame. BACKGROUND: distant sky / clouds / city / terrain with haze. NEVER a wide vista where she shrinks. NEVER a tight head-portrait crop.

━━━ ALLOWED VOCABULARY (use often) ━━━
captivating, fierce, intent, capable, kinetic, mid-leap, mid-strike, mid-fire, recoil, muzzle-flash, sparks, smoke-bloom, whipping hair, wind-torn, brass-clasped, leather-bound, gear-embroidered, brass-pauldroned, ammunition-bandolier, goggles-up, goggles-down, brass-monocle, cannon-port, rigging, spotter-platform, sky-corsair, dirigible-spine, oil-soaked.

━━━ FORBIDDEN VOCABULARY — these specific words trigger Replicate's NSFW filter ━━━
- sexy, erotic, sensual, seductive, provocative, temptress, lingerie, pinup, pin-up
- voyeuristic, voyeur, bedroom, boudoir, sultry
- "strategic cutouts", "see-through", "sheer panels", "exposure"
- body-focus terms: hips, thighs, rear, bare midriff, underboob, cleavage
- moisture/heat-on-skin imagery: wet lips, beads of sweat, moisture on skin, humidity beading
- battle-bikini, chainmail-bikini, harness-across-bare-torso
- bodice-ripper, heaving, pouting, parted-lips

━━━ HARD BANS — COMPOSITION ━━━
- NO multiple primary characters — she is the SOLE focal point (background figures OK but must stay small + mid-distance + faceless)
- NO tight head-portrait crop — full body or three-quarter, 40-60% frame
- NO posing-for-camera, NO modeling shot, NO trading-card art, NO stationary-portrait
- NO wide-vista-with-tiny-character framing
- NO substituting your own descriptions for the pool entries — render what's locked
- NO decorative clutter framing (gears / clocks pasted around the edges)
- NO ground-level setting (she is on / around an AIRSHIP — never on solid ground unless the airship is visibly docked at an aerie / sky-platform)

━━━ STRUCTURE (write the prompt in this exact order) ━━━
[OPENING: the literal ethnicity-noun-phrase from the skin entry ("a Japanese woman" / "a Nigerian woman" / "a Persian woman" / etc.) followed by [doing exact action] on/aboard [airship setting]], [her tailored airship outfit with OBSESSIVE LAYERED detail — every brass clasp / leather strap / goggle-harness / embroidered cuff], [her signature equipment visible], [the rest of her face: eyes + hair from DNA slots + skin-tone detail beyond the ethnicity-noun], [her hair carrying the motion of the action], [the airship deck / rigging / brass hardware around her in midground], [the distant backdrop sky/city/terrain with atmospheric haze], [any background figures in midground (small, faceless)], [drama event if rolled], [lighting + atmosphere], [color palette + mood]

CRITICAL — the OPENING tokens MUST be the ethnicity-noun-phrase from the skin pool entry, copied verbatim. Flux locks the ethnicity from the first 5-8 tokens. If the skin entry says "Japanese woman", Flux must see "a Japanese woman" in the opening, not "a young woman" or "a captain". She fills 40-60% of frame, MID-ACTION. The ACTION gets significant word-budget alongside the outfit.

Output ONLY the raw 110-140 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**, NO "render as" suffixes. Just the phrases, starting immediately with the scene content.`;
  },
};
