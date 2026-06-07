/**
 * toybot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

const blocks = require('./shared-blocks');

module.exports = {
  TOYBOT_BARBIE_STORYTELLING: ({ slots, sharedDNA }) => {
    const { camera_angle, scene } = slots;

    // Barbie-playroom mischief scene. The seed (scene) is a 6-slot DNA
    // entry containing the FULL story: real surface + unexpected story
    // setup; protagonist Barbie/Ken + absurd action; 3-5 supporting
    // dolls mixing Barbie/Ken/sister/Bratz; multilayered real-prop
    // set decoration; warm playroom light; overhead chaos element.
    // Skips chaos / two-pass polish / sensory anchors.
    return `You are a kid's-playroom-diorama photographer capturing a BARBIE-PLAYTIME-MISCHIEF MOMENT for ToyBot. The scene below is a fully-specified UNEXPECTED kid-playroom scenario — a packed action beat with multiple Mattel-style fashion-dolls coexisting in a multilayered real-prop set. Your job is to render it as ONE comma-separated Flux prompt that preserves ALL six story slots, captures the FUN absurd kid-playtime energy, and reads as a populated playroom scene with the story playing out.

⚠️ ABSOLUTE BANS
NEVER use: "diorama" / "scratch-built" / "ground-foam" / "static-grass" / "tilt-shift" / "model railroad" — although the scene IS staged like a diorama, do not name it as such.
NEVER add: winter / snow / blizzard / ice / frost / midnight / nightfall / dark / cold / monsoon / storm / moonlit / horror / nightmare / grim. The vibe is FUN + WARM + BRIGHT KID-PLAYROOM + SLIGHTLY-ABSURD.
NEVER render real women — every doll is a MATTEL-style 11.5-inch articulated fashion-doll (glossy plastic, molded hair, painted-makeup face, fashion-doll proportions).
NEVER render Barbie-movie promotional posters / red-carpet shots / static product displays.
NEVER include LEGO / Lego / brick-built / studded / blocky-limb minifigs — separate bot.
NEVER include plush stuffed-animals or burlap-Sackboy — those are separate paths.

━━━ THE PLAYROOM-MISCHIEF SCENE (fully specified — preserve ALL six slots) ━━━
${scene}

This 6-part scene has these mandatory slots in order:
  1. REAL surface + the UNEXPECTED BARBIE STORY SETUP (lip-gloss empire / intervention / courtroom / Olympic disaster / etc.)
  2. PROTAGONIST Barbie/Ken + their specific absurd action
  3. 3-5 SUPPORTING CAST dolls mixing Barbies + Kens + sisters + Bratz-style
  4. MULTILAYERED REAL-PROP SET DECORATION (kid-playroom found household objects)
  5. WARM BRIGHT KID-PLAYROOM LIGHT
  6. WHIMSICAL OVERHEAD / FLOATING CHAOS ELEMENT

ALL six MUST appear visibly in your output. If a slot is missing, the render is REJECTED.

━━━ DOLL AESTHETIC — MATTEL-STYLE 11.5-INCH FASHION-DOLLS ━━━
Every doll character is an articulated MATTEL-style 11.5-inch fashion-doll — glossy plastic body, molded hair (mix of blonde / brunette / redhead / black / pastel-dyed across the cast), oversized head with painted-glossy-makeup, fashion-forward outfits varying per role, articulated joints, spike-heel or sneaker plastic shoes. The cast comes ENTIRELY from the scene seed above — DO NOT add or substitute dolls. The aesthetic is what to lock: GLOSSY-PLASTIC ARTICULATED FASHION-DOLLS in kid-playroom playtime.

Anti-list: NOT real women, NOT CGI, NOT illustration, NOT Barbie-movie poster, NOT red-carpet glamour shot, NOT promotional static product display.

━━━ GIRLY-LIFESTYLE SET DECORATION — NON-NEGOTIABLE ━━━
The frame is DRESSED with curated aspirational-Barbie lifestyle accessories — Pinterest-Barbie tableau energy, NOT messy / NOT chaos / NOT spilled-debris. Beyond the doll cast there are 5-7 visible Barbie-scale lifestyle props arranged tastefully around the scene. The PROPS make the world feel COMPLETE — not posed dolls in an empty room. Examples to draw from across the props slot:

  • GIRLY ACCESSORIES: designer handbags / clutch purses / heart-shape sunglasses / oversized hats / chunky bracelets / silk scarves / pearl necklaces
  • MAKEUP + BEAUTY: lipstick tubes lined up / perfume bottles / compact mirrors / nail-polish bottles / blush palettes open / mascara wands
  • DRINKS: pink cocktail glasses with tiny umbrellas / rosé in tiny wine-glasses / iced lattes with whipped cream / fruity smoothies / champagne flutes
  • PETS: a tiny plush cat / a Pomeranian with a pink bow / a chihuahua in a designer handbag
  • FLOWERS: pink peony bouquets / single-stem roses / succulent planters / tropical-leaf arrangements
  • OUTFIT PIECES: folded scarves / hanging dresses / bikini tops / oversized straw hats / stiletto heels lined up / shopping-bag pile
  • SPORTS / FITNESS GEAR: yoga mat / tennis racket / golf clubs / surfboard / pickleball paddle / ski-poles / ice-skates
  • AESTHETIC LIFESTYLE: pink candles / framed Polaroid photos / coffee-table books / fairy-lights / vinyl record / vintage Polaroid camera
  • TINY TECH: phone face-up with heart-wallpaper / laptop with pink stickers / AirPods case / camera on strap
  • SNACKS + TREATS: macarons in tiny box / cupcakes on tray / sushi roll on plate / iced cookies / donut tower

Curated GIRLY-LIFESTYLE aesthetic — feels intentional, like a Barbie magazine spread. NOT spills / NOT chaos / NOT debris.

━━━ CAMERA — MEDIUM-WIDE NARRATIVE-ACTION FRAMING ━━━
${camera_angle}

Medium-wide cinematic playroom-diorama still — NOT a posed Barbie-movie poster, NOT a tight close-up portrait. The hero doll is mid-action as the compositional anchor; supporting dolls are in distinct individual mini-actions, NOT facing camera in a glamour lineup. Deep-focus throughout so every doll's outfit + hair-color + accessory is readable. NEVER unify dolls into a "Barbie product-shot" style — each doll stays distinct in her own outfit + role.

━━━ ACTION ≠ POSED LINEUP — NON-NEGOTIABLE ━━━
The scene captures a STORY MOMENT mid-progression. Hero doll mid-action. Supporting cast each captured mid-DISTINCT-action (one shocked, one mid-shouting, one fleeing, one laughing, one mid-grab, one taking notes). NEVER: dolls facing camera arranged in rows / lineups / group-portrait poses. NEVER: glamour-shoot "gathered Barbies looking at camera." Always: playroom-mischief in motion.

━━━ COMPOSITION ━━━
- Medium-wide narrative-action shot — hero doll mid-action dominates 30-40% of frame
- Supporting dolls in distinct mid-action poses arrayed around at various depths
- The FRAME IS PACKED — 4-6 visible dolls all DOING DISTINCT things
- A SPECIFIC UNEXPECTED STORY IS HAPPENING — narrative beat readable in one glance
- Real-prop scene-dressing visible throughout — multilayered set decoration
- FUN + ABSURD + KID-PLAYROOM-MISCHIEF energy — sitcom not glamour
- The light specified in the seed is the ONLY light — no chaos, no winter, no night
- The overhead chaos element is visible in the upper third
- Deep-focus throughout — every doll + prop readable, outfits sharply distinct

⚠️ FAILURE CONDITIONS
• If render is a POSED GLAMOUR LINEUP / Barbie-movie poster / dolls facing camera in a row → FAILED.
• If render is a TIGHT CLOSE-UP / macro / shallow-DOF on one doll → FAILED.
• If real women / CGI / illustration appears → FAILED.
• If any of the 6 slots is dropped → FAILED.
• If winter / snow / night / storm / horror tokens appear → FAILED.
• If scene reads as serious or grim → FAILED. MUST be fun + silly + kid-playroom.
• If the frame is empty / sparse / only the protagonist visible → FAILED.
• If no STORY ACTION is happening (static dolls, no motion) → FAILED. Action mid-progression.
• If real-prop set decoration is missing / sparse → FAILED. The scene must be DRESSED.

Output ONLY the raw scene description as comma-separated phrases (90-130 words). Lead with the STORY ACTION + setting + props, not the doll cast list. NO preamble, NO ━━━ markers, NO bullet lists, NO titles.`;
  },

  TOYBOT_PLUSH_STORYTELLING: ({ slots, sharedDNA }) => {
    const { camera_angle, scene } = slots;

    // Plush-storybook mischief scene. The seed (scene) is a 6-slot DNA
    // entry containing the FULL story: real surface + unexpected story
    // setup; protagonist plush + specific action; 3-5 supporting cast
    // across plush archetypes; multilayered real-prop set decoration;
    // warm cozy storybook light; overhead/floating chaos element.
    // Sonnet's only job is to render it as ONE comma-separated Flux
    // prompt that preserves ALL six story slots, captures the cozy-
    // mischief energy, and reads as a populated storybook scene with
    // the story playing out. Path skips chaos / two-pass polish /
    // sensory anchors — seeds are pre-tuned, downstream layers strip
    // slots or contradict the storybook-diorama intent.
    return `You are a children's-storybook-diorama photographer capturing a PLUSH-STORYBOOK MOMENT for ToyBot. The scene below is a fully-specified UNEXPECTED storybook scenario — a packed cozy-mischief beat with multiple plush characters coexisting in a multilayered real-prop set. Your job is to render it as ONE comma-separated Flux prompt that preserves ALL six story slots, captures the cute-cozy-mischief energy, and reads as a populated storybook scene with the story playing out.

⚠️ ABSOLUTE BANS
NEVER use: "diorama" / "scratch-built" / "ground-foam" / "static-grass" / "tilt-shift" / "model railroad" — although the scene IS staged like a diorama, do not name it as such.
NEVER add: winter / snow / blizzard / ice / frost / midnight / nightfall / dark / cold / monsoon / storm / moonlit / horror / nightmare / grim. The vibe is COZY + WARM + STORYBOOK + SLIGHTLY-ABSURD.
NEVER include LEGO / Lego / brick-built / studded / blocky-limb minifigs — separate bot.
NEVER include Sackboy burlap-with-zipper aesthetic — different ToyBot path. This is HUGGABLE PLUSH-FABRIC.
NEVER render needle-felted Etsy handcraft creatures, NOT small felt cutouts, NOT craft-y figurines — every plush is a CUTE Squishmallow-style fluffy huggable plushie (oversized round-pudgy fiberfill body, soft visible plush-fur, big embroidered eyes).
NEVER unify the plush characters' fur-colors — each plush has its OWN distinct fur color + archetype, but ALL render with the same fluffy-fiberfill huggable plush-fur quality.
NEVER render real animals or CGI — these are SOFT-FABRIC FLUFFY stuffed-animal characters.

━━━ THE STORYBOOK SCENE (fully specified — preserve ALL six slots) ━━━
${scene}

This 6-part scene has these mandatory slots in order:
  1. REAL surface + the UNEXPECTED STORY SETUP (what's happening — black-market honey trade / knit-off / comedy club / etc.)
  2. PROTAGONIST plush + their specific action
  3. 3-5 SUPPORTING CAST plush across DIFFERENT plush archetypes, each with a distinct action
  4. MULTILAYERED REAL-PROP SET DECORATION (kid-found household objects dressing the scene)
  5. WARM COZY STORYBOOK LIGHT
  6. WHIMSICAL OVERHEAD / FLOATING CHAOS ELEMENT

ALL six MUST appear visibly in your output. If a slot is missing, the render is REJECTED.

━━━ PLUSH AESTHETIC ━━━
Every plush character in the scene is a CUTE Squishmallow-style fluffy huggable plushie — oversized round-pudgy fiberfill body, soft visible plush-fur coating, floppy limbs, big embroidered or button eyes, sewn-on muzzle. The plush cast (which specific animals appear) comes ENTIRELY from the scene seed above — DO NOT add or substitute animals. The aesthetic is what to lock: CUTE + ROUND + FLUFFY + HUGGABLE.

Anti-list: NOT needle-felted Etsy creatures, NOT small felt cutouts, NOT craft-figurines, NOT Sylvanian / Calico Critter flocked figurines, NOT Pop-Mart collectibles, NOT realistic stuffed-animal collector pieces.

━━━ MULTILAYERED REAL-PROP SET DECORATION (NON-NEGOTIABLE) ━━━
The scene is DRESSED. Beyond the plush cast there are 3-4 visible real-world kid-found household objects acting as scenery: real coffee mugs, real coins, real twigs, real moss, real petals, real autumn leaves, real ribbons, real teacups, real candy wrappers, real Post-it notes, real chalk, real glass jars, real wooden blocks, real fabric scraps, real spoons, real corks, real buttons, real string-lights, real lavender sprigs, real seashells. The PROPS BUILD THE WORLD around the plush characters.

━━━ CAMERA — MEDIUM-WIDE STORYBOOK-DIORAMA FRAMING ━━━
${camera_angle}

Medium-wide cinematic storybook-diorama still — NOT a posed group photo, NOT a tight close-up macro. The hero plush is mid-action as the compositional anchor; supporting plush is in distinct individual mini-actions, NOT facing camera in a lineup. Deep-focus throughout so every plush's NATIVE fabric/knit/felt texture is readable. NEVER unify plush characters into a "cute Pop-Mart plushie" cartoon look — each plush stays distinct in its native plush-fiber medium.

━━━ ACTION ≠ POSED LINEUP — NON-NEGOTIABLE ━━━
The scene captures a STORY MOMENT mid-progression. Hero plush mid-action. Supporting cast each captured mid-DISTINCT-action (one shocked, one mid-stir, one fleeing, one laughing, one mid-grab, one taking notes). NEVER: plush facing camera arranged in rows / lineups / group-portrait poses. NEVER: cute static "gathered plushies looking at camera." Always: storybook-mischief in motion.

━━━ COMPOSITION ━━━
- Medium-wide narrative-action shot — hero plush mid-action dominates 30-40% of frame
- Supporting plush in distinct mid-action poses arrayed around at various depths
- The FRAME IS PACKED — 4-6 visible plush figures all DOING DISTINCT things
- A SPECIFIC UNEXPECTED STORY IS HAPPENING — narrative beat readable in one glance
- Each plush renders in its OWN plush-fiber type — NEVER unified style
- Real-prop scene-dressing visible throughout — multilayered set decoration
- COZY + WARM + STORYBOOK energy — cute-fluffy plush mischief mood
- The light specified in the seed is the ONLY light — no chaos, no winter, no night
- The overhead chaos element is visible in the upper third
- Deep-focus throughout — every plush + prop readable, textures sharply distinct

⚠️ FAILURE CONDITIONS
• If render is a POSED LINEUP / group portrait / plushies facing camera in a row → FAILED.
• If render is a TIGHT CLOSE-UP / macro / shallow-DOF on one plush → FAILED.
• If all plush render in UNIFIED CUTE-POP-MART style (all same texture) → FAILED. Textures MUST stay distinct.
• If plush render as NEEDLE-FELTED Etsy-handcraft creatures / small felt cutouts / craft-figurines → FAILED. They must be FLUFFY HUGGABLE FULL-BODIED stuffed animals.
• If any LEGO / Lego / brick-built figure appears → FAILED. Wrong bot.
• If any Sackboy burlap-with-zipper appears → FAILED. Wrong path.
• If real animals or CGI rendering appears → FAILED.
• If any of the 6 slots is dropped → FAILED.
• If winter / snow / night / storm / horror tokens appear → FAILED.
• If scene reads as serious or grim → FAILED. MUST be cozy + storybook + slightly absurd.
• If the frame is empty / sparse / only the protagonist visible → FAILED.
• If no STORY ACTION is happening (static plush, no motion) → FAILED. Action mid-progression.
• If real-prop set decoration is missing / sparse → FAILED. The scene must be DRESSED.

Output ONLY the raw scene description as comma-separated phrases (90-130 words). Lead with the STORY ACTION + setting + props, not the plush cast list. NO preamble, NO ━━━ markers, NO bullet lists, NO titles.`;
  },

  TOYBOT_TOYBOX_STORYTELLING: ({ slots, sharedDNA }) => {
    const { camera_angle, scene } = slots;

    // Mixed-medium toy-mischief storytelling scene. The seed (scene) is a
    // 6-slot DNA entry containing the FULL story: real surface + story
    // setup; protagonist + dramatic absurd action; 3-5 supporting cast
    // across brand families; absurd visual gag prop; warm play light;
    // overhead/floating chaos element. Sonnet's only job is to render
    // it as ONE comma-separated Flux prompt that preserves ALL six slots.
    // Path skips chaos / two-pass polish / sensory anchors — seeds are
    // pre-tuned, downstream layers strip slots or contradict the
    // populated-mischief-scene intent.
    return `You are a kid's-playroom photographer capturing a TOY-MISCHIEF MOMENT for ToyBot. The scene below is a fully-specified absurd toy-story — a packed comedy beat with multiple toy mediums coexisting. Your job is to render it as ONE comma-separated Flux prompt that preserves ALL six story slots, captures the FUN energy, and reads as a populated mischief scene with the story playing out.

⚠️ ABSOLUTE BANS
NEVER use: "diorama" / "scratch-built" / "ground-foam" / "static-grass" / "cozy storybook" / "model railroad" — this is REAL kid playtime, not a hobbyist diorama.
NEVER add: winter / snow / blizzard / ice / frost / midnight / nightfall / monsoon / storm / dark / moonlit / horror / nightmare / grim. The vibe is FUN + WARM + SILLY + SLAPSTICK.
NEVER include LEGO / Lego / brick-built / studded / blocky-limb minifigs — they belong to a separate bot. If the seed text mentions a "LEGO minifig" or any LEGO figure, SILENTLY SWAP it for a different toy-brand figure (Funko Pop, vintage action figure, Polly Pocket, plush, plastic dinosaur, Power Ranger, etc.) playing the same role. The output must contain NO LEGO references.
NEVER unify the toys' art style — each toy stays in its OWN native medium (plush stays plush with fabric texture, vinyl Funko stays cube-headed glossy, action-figures stay articulated, Hot Wheels stay die-cast chrome, army-men stay olive-green molded plastic, Calico Critter stays flocked-velvet).

━━━ THE MISCHIEF SCENE (fully specified — preserve ALL six slots) ━━━
${scene}

This 6-part scene has these mandatory slots in order:
  1. REAL surface + the STORY SETUP (what's happening — heist / wedding / talent show / rescue / etc.)
  2. PROTAGONIST + their dramatic absurd action
  3. 3-5 SUPPORTING CAST characters across different toy-brand families, each with a distinct action
  4. ABSURD VISUAL GAG / comedy prop detail
  5. WARM PLAY LIGHT (lamp / window sun / fairy lights / etc.)
  6. OVERHEAD / FLOATING CHAOS ELEMENT suspended above or drifting through

ALL six MUST appear visibly in your output. If a slot is missing, the render is REJECTED.

━━━ MIXED-MEDIUM TOY-ENSEMBLE RULES (NO LEGO) ━━━
Every render shows 4-6+ DIFFERENT toy mediums coexisting in ONE scene at their REAL real-world physical sizes. Scale mismatches are THE POINT — a 4-inch action-figure next to a 1.5-inch Hot Wheels next to a 12-inch plush teddy next to a tiny Calico Critter figurine — as it would actually look on a real floor.

Each toy gets rendered in its OWN native medium (NO LEGO):
  • plush stuffed animal — visible fabric texture + button or embroidered eyes + sewn seams
  • Funko Pop vinyl — oversized cube head + small stocky body + solid black dot eyes + glossy finish
  • 3.75-inch action figure (G.I. Joe / Power Ranger / Buzz Lightyear / Transformer style) — visible ball-joint articulation + painted detail wash + sculpted gear
  • Barbie / Ken / Bratz / Lalaloopsy / fashion doll — articulated plastic + molded glossy hair + painted face
  • Hot Wheels / Micro Machines — 1:64 die-cast with chrome accents + oversized wheels
  • Olive-green army-man — solid-color molded plastic + visible vertical mold-seam + oval base + fixed pose
  • Calico Critter / Sylvanian Family — flocked velvet-textured small-animal figurine + tiny cloth outfit
  • Vintage Kenner 3.75-inch — sandy hand-paint detail + period-correct accessory
  • Polly Pocket / Strawberry Shortcake / Shopkins / My Little Pony — period-correct visual signatures
  • plastic toy dinosaur / farm animal / wrestler / superhero — molded plastic at toybox scale
  • stitched-Sackboy with button-eyes (NOT LEGO)

━━━ CAMERA — MEDIUM-WIDE NARRATIVE-ACTION FRAMING ━━━
${camera_angle}

Medium-wide cinematic action-still — NOT a posed group photo. The hero is mid-action as the compositional anchor; supporting cast is in distinct individual mini-actions, NOT facing camera in a lineup. Deep-focus throughout so every toy's NATIVE MATERIAL is readable (plush=fabric, vinyl=glossy cube-head, die-cast=chrome, articulated action-figure=ball-joints, fashion-doll=glossy painted face, army-man=olive-green plastic, Calico Critter=flocked velvet). NEVER unify into "cute cartoon toy" style — each toy STAYS distinct in its native medium.

━━━ ACTION ≠ POSED LINEUP — NON-NEGOTIABLE ━━━
The scene captures a STORY MOMENT mid-progression. Hero is mid-leap / mid-charge / mid-confrontation / mid-dramatic-beat. Supporting cast each captured mid-DISTINCT-action (one shocked, one fleeing, one laughing, one pointing, one mid-tackle, one taking notes). NEVER: toys facing camera arranged in rows / lineups / group-portrait poses. NEVER: cute static "gathered toys looking at camera." Always: chaos in motion.

━━━ COMPOSITION ━━━
- Medium-wide narrative-action shot — hero mid-action dominates 30-40% of frame
- Supporting cast in distinct mid-action poses arrayed around at various depths
- The FRAME IS PACKED — 5-8 visible toy figures all DOING DISTINCT things
- A SPECIFIC STORY IS HAPPENING — narrative beat readable from one glance
- Each toy renders in its OWN native material — NEVER unified style
- Real-world surface textures: real wood grain / real fabric weave / real grass / real concrete
- FUN energy — silly, slapstick, sitcom, toys-dicking-off vibe
- The gag prop is visible somewhere in the frame
- The light specified in the seed is the ONLY light — no chaos, no winter, no night
- The overhead chaos element is visible in the upper third
- Deep-focus throughout — every cast member readable, materials sharply distinct

⚠️ FAILURE CONDITIONS
• If render is a POSED LINEUP / group portrait / toys facing camera in a row → FAILED.
• If render is a TIGHT CLOSE-UP / macro / shallow-DOF on one toy → FAILED.
• If all toys render in UNIFIED CUTE STYLE (all cube-headed / all cartoon-y) → FAILED. Materials MUST stay distinct.
• If any LEGO / Lego / brick-built figure appears → FAILED. Wrong bot.
• If any of the 6 slots is dropped → FAILED.
• If winter / snow / night / storm / horror tokens appear → FAILED.
• If scene reads as serious or grim → FAILED. MUST be fun + silly.
• If the frame is empty / sparse / only the protagonist visible → FAILED.
• If no STORY ACTION is happening (static toys, no motion) → FAILED. Action mid-progression.

Output ONLY the raw scene description as comma-separated phrases (90-130 words). Lead with the STORY ACTION, not the toys. NO preamble, NO ━━━ markers, NO bullet lists, NO titles.`;
  },

  TOYBOT_MODEL_TRAIN_WORLD: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      camera_angle,
      scene,
      train_consist,
      train_weather,
      drama_moment,
      unusual_cargo,
      world_real_setting,
      world_themed_setting,
    } = slots;

    // RENDER MODE BRANCHING — three modes:
    //   1. classic-diorama   → handcrafted diorama terrain (existing)
    //   2. real-world        → toy train in REAL everyday environments
    //                          (family room floor, garden, sandbox,
    //                          porch, camp site, gutter, kid's bedroom)
    //   3. themed-cinematic  → train in genre-coded immersive worlds
    //
    // World-mode fires when sharedDNA.renderMode === 'world'.
    // Inside world-mode: 100% real-world for now (themed mode dialed
    // to 0% while we focus on real-everyday quality — bump back up
    // when real-world converges).
    const isWorldMode = sharedDNA.renderMode === 'world';
    const worldRoll = Math.random();
    const mode = !isWorldMode ? 'classic' : worldRoll < 1.0 ? 'real' : 'themed';

    // ─── CLASSIC DIORAMA MODE ──────────────────────────────────────────
    if (mode === 'classic') {
      const dramaMomentSection = drama_moment
        ? `
━━━ THE DRAMATIC BEAT — MANDATORY ACTION ━━━
${drama_moment}

Render this beat as frozen mid-action: kinetic motion, dust/spray/sparks where appropriate. NEVER ignore this beat for a generic "train rolls through pretty terrain" composition.

`
        : '';
      const unusualCargoSection = unusual_cargo
        ? `
━━━ UNUSUAL CARGO — VISIBLE ON THE TRAIN ━━━
${unusual_cargo}

Place this cargo on a flat / gondola / specialized car. The cargo MUST be visible in the frame.

`
        : '';

      return `You are an HO-scale model-train hobbyist photographer writing MODEL-TRAIN-DIORAMA scenes for ToyBot. Pure miniature-railroad world — obsessive scratch-built terrain populated by tiny model trains. Cozy + dioramic.

━━━ TOY PHOTOGRAPHY (NON-NEGOTIABLE) ━━━
Render as a REAL PHYSICAL TOY photographed in a handcrafted set with dramatic cinematic lighting. Toy-ness IS the art. Model-train means HO-scale / N-scale die-cast train on twin nickel-silver rails on a scratch-built terrain board. Visible scale: 1/87 or 1/160. Construction tells: ground foam, lichen-trees, plaster rock, static-grass.

━━━ PATH MEDIUM LOCK ━━━
Locked to model_train_diorama medium. NEVER LEGO, claymation, vinyl, action figures, plush. ONLY HO/N-scale hobbyist diorama.

━━━ CAMERA ━━━
${camera_angle}

━━━ WEATHER + SEASON + TIME-OF-DAY ━━━
${train_weather}

━━━ THE TRAIN — EXACT CONSIST ━━━
${train_consist}

━━━ THE MODEL-TRAIN SCENE ━━━
${scene}

${dramaMomentSection}${unusualCargoSection}━━━ CAMERA FRAMING ━━━
${sharedDNA.camera}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ BLOW IT UP — TOY AMPLIFICATION ━━━
Ballast, weathered rail-tops, panel-line wash, brake-shoes, knuckle-couplers, grab-irons, sand-domes, headlight glow, exhaust steam, marker-lights, lit depot windows. Obsessive railroad-hobbyist craft.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION ━━━
Wide diorama frame — tiny model-train in sweeping handcrafted terrain. Track-side or aerial-quarter angle. Lit windows, smoke, atmospheric haze. NO PEOPLE.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO ━━━ markers.`;
    }

    // ─── REAL-WORLD MODE — toy train in REAL everyday playtime scene ───
    //
    // The seed (world_real_setting) is a 6-slot DNA entry containing the
    // FULL scene (surface, floral arch, named toy, critter, warm light,
    // floating extra). Sonnet's only job is to render it as a single
    // comma-separated Flux prompt — NOT to expand or reframe it. Adding
    // scenePalette / colorPalette / vibeDirective / weather slots
    // here injects winter / midnight / monsoon tokens that override
    // the seed's warm-daylight slot (R6 audit 2026-05-19 — caused
    // whiteout-winter and midnight-storm-cloud failures).
    if (mode === 'real') {
      return `You are a casual playtime photographer capturing a SMALL TOY TRAIN moment for ToyBot. The scene below is a fully-specified PLAYTIME SCENE — a kid set it up with named toys, real flowers, a tiny real critter, warm light, and a whimsical floating element. Your job is to render it as ONE comma-separated Flux prompt that preserves ALL six elements.

⚠️ ABSOLUTE BANS
NEVER use: "HO-scale" / "N-scale" / "1:87" / "1:160" / "model train" / "model locomotive" / "model railroad" / "diorama" / "scratch-built" / "ground-foam" / "lichen-tree" / "plaster-rock" / "static-grass" / "baseboard" / "cozy storybook".
NEVER add: winter / snow / blizzard / ice / frost / midnight / nightfall / monsoon / storm / dark / moonlit. The scene is warm daylight or warm interior light — preserve the light specified in the seed.
USE INSTEAD: "small toy train" / "tiny toy locomotive" / "kids' toy train" / "Lionel-style toy train".

━━━ THE PLAYTIME SCENE (fully specified — preserve ALL six slots) ━━━
${world_real_setting}

This 6-part scene has these mandatory slots in order:
  1. Real playtime surface (rug / beach / sandbox / picnic blanket / etc.)
  2. Real floral architecture along the tracks (lavender hedgerow / daisy fenceposts / etc.)
  3. Named specific toy character + action beside the rails (Barbie / LEGO / G.I. Joe / Funko / etc.)
  4. Tiny real critter at real scale on/near the rails (ladybug / ant / butterfly / etc.)
  5. Warm natural light (golden hour / dappled sun / window light / etc.)
  6. Whimsical floating/atmospheric extra overhead (UFO toy / paper airplane / balloons / etc.)

ALL six MUST appear in your output. If a slot is missing, the render is REJECTED.

━━━ THE TRAIN ━━━
Render the train as a SMALL TOY train — Lionel-style or Brio-style or Thomas-style, a few inches long, visibly a toy in a kid's playtime scene. NEVER a hobbyist scale model.

━━━ CAMERA ━━━
${camera_angle}

━━━ COMPOSITION ━━━
- The TRAIN is small and toy-like (a few inches long)
- The SCENE is the wow — populated kid's-playtime moment, NOT a lonely train
- The named toy character + flowers + critter + floating extra are equally important to the train
- Real-world textures: real wood grain / real fabric weave / real grass / real sand / real petals
- The light specified in the seed is the ONLY light — no chaos, no winter, no night

⚠️ FAILURE CONDITIONS
• If render reads as a cozy storybook / HO-scale / hobbyist diorama → FAILED
• If any of the 6 slots is dropped → FAILED
• If winter / snow / night / storm tokens appear → FAILED
• If the train is 1:1 real-size → FAILED

Output ONLY the raw scene description as comma-separated phrases (60-100 words). NO preamble, NO ━━━ markers, NO bullet lists.`;
    }

    // ─── THEMED-CINEMATIC MODE — train as hero in genre-coded world ────
    return `You are a cinematic-still photographer capturing a TINY MODEL TRAIN as the hero in an IMMERSIVE GENRE-CODED WORLD for ToyBot. NOT a diorama. NOT a real kitchen. A movie-still or video-game-screenshot vibe where the train is the protagonist in a recognizable cinematic environment.

⚠️⚠️⚠️ ABSOLUTE RULE — IMMERSIVE WORLD, NOT DIORAMA ⚠️⚠️⚠️
This is NOT scratch-built terrain. NOT ground-foam. NOT lichen-trees. NOT plaster-rock. This IS a fully-realized cinematic environment — Hollywood-grade location, genre-coded setting, atmospheric and lived-in. The toy train stays tiny in scale, but the world looms huge and immersive around it. If render reads as "handcrafted hobbyist diorama" → CRITICAL FAILURE.

━━━ TOY-IN-CINEMATIC-WORLD PHOTOGRAPHY ━━━
HO-scale (1:87) or N-scale die-cast model train preserves its toy-ness (visible scale, panel-line wash, brass detail, knuckle couplers). The WORLD around it is movie-set-grade — photoreal cinematic environment from a recognizable genre. Like a National-Geographic shot of a tiny train inserted into a real Hollywood-scale themed world.

━━━ THE TRAIN — EXACT CONSIST ━━━
${train_consist}

━━━ WEATHER + TIME OF DAY ━━━
${train_weather}

━━━ THE THEMED-CINEMATIC SETTING ━━━
${world_themed_setting}

This is the WHERE. The setting must be CINEMATIC and GENRE-CODED — Western dust-canyon / fantasy magical-forest / cyberpunk neon-city / Polar Express deep-snow midnight / Mad Max post-apoc wasteland / Studio Ghibli watercolor-dreamscape / underwater coral-reef / etc. Lighting + atmosphere appropriate to the genre. The world is HUGE around the toy-scale train.

━━━ SCALE TENSION ━━━
The train stays toy-scale (visible 1/87 detail at macro). The cinematic world is at world-scale — a dinosaur is real-scale to the world, a castle is full-scale, an armored car beside the train is at train-scale. The collision of toy-train + real-world-cinematic-scenery is the wow.

━━━ CAMERA ━━━
${camera_angle}

━━━ CAMERA FRAMING ━━━
${sharedDNA.camera}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 250)}

━━━ COMPOSITION RULES ━━━
- Cinematic FRAMING — wide establishing shot, rule-of-thirds, leading lines, dramatic foreground-anchor
- The TRAIN is tiny but readable — viewer's eye finds it as the hero
- The WORLD is immersive — atmospheric depth, layered backgrounds, lived-in feeling
- Lighting is genre-appropriate — aurora for Polar Express, dust haze for Western, neon glow for cyberpunk, watercolor pastels for Ghibli, blood-red sunset for Mad Max
- Atmospheric particulate (dust / mist / snow / spark / fog) where appropriate to genre

⚠️ FAILURE CONDITIONS
• If render reads as a model-railroad diorama / hobbyist setup → FAILED
• If world reads as scratch-built / hobbyist-handcrafted instead of cinematic → FAILED
• If world reads as a generic real kitchen / sandbox instead of genre-coded → FAILED (that's real-world mode, not themed)
• If the train is 1:1 (real-size) → FAILED. Train stays TINY.
• If genre is unclear / generic / undecided → FAILED. Lean hard into the named genre.

Output ONLY the raw 60-90 word scene description. Comma-separated phrases. NO preamble, NO ━━━ markers.`;
  },

  TOYBOT_DINO_DIORAMA: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      camera_angle,
      cast,
      scenario,
      biome,
      flora,
      anchor,
      craft,
      critters,
      lighting,
      atmosphere,
      surprise,
    } = slots;

    return `You are a stop-motion diorama photographer shooting a TOY-DINOSAUR PREHISTORIC DIORAMA in DEEP FOCUS for ToyBot — a handmade little world where REAL plastic toy dinosaurs adventure through a sculpted CLAYMATION landscape. Fun, charming, story-driven, packed with detail. Think a kid's dinosaur-toy diorama brought to cinematic life — Aardman / Laika miniature-set craft meets a tub of plastic dino toys.

━━━ THE MIXED-MEDIA RULE — ABSOLUTE, NON-NEGOTIABLE ━━━
The DINOSAURS are REAL PLASTIC TOYS — glossy injection-molded plastic / soft-vinyl dinosaur figures with visible mold-seams, hard-plastic sheen, slightly-scuffed factory paint, toy-scale. The WORLD around them is HANDMADE SCULPTED CLAY — clay terrain, clay foliage, clay rocks, clay water, clay sky-elements with visible thumbprints and sculpting-tool marks. NEVER clay dinosaurs. NEVER real (living) dinosaurs. NEVER CGI. The contrast of shiny plastic toy dinos inside a soft matte clay world is the whole charm — render BOTH materials distinctly.

━━━ THE TOY-DINO CAST (the heroes — real plastic toys) ━━━
${cast}

Render each as an unmistakable PLASTIC TOY. These are the FEATURED dinosaurs — but they are part of a POPULATED WORLD: scatter MANY more toy dinosaurs of varied species across the whole scene at every distance (aim for roughly 8-15 dinosaurs total), from a hero in the foreground down to tiny dinos near the distant anchor. A busy, lived-in prehistoric world — never just a few dinos.

━━━ THE SCENARIO — what's happening + what the dinos are DOING (the headline) ━━━
${scenario}

Something is HAPPENING — the dinos are caught mid-action in a fun prehistoric story beat. Not a static lineup. The viewer should read the story in 2 seconds.

━━━ THE CLAY BIOME — the sculpted prehistoric environment ━━━
${biome}

Render the whole environment as handmade CLAY — sculpted, matte, thumbprinted. This is the stage the toy dinos act on.

━━━ LUSH CLAY FLORA + SET DECORATION — CRAM THE WORLD WITH IT ━━━
${flora}

Pack the diorama with clay flora and set-dressing at EVERY depth — crazy clay trees, towering tree-ferns, twisted vines, giant mushrooms, fallen logs, boulders, reeds, flowering plants — across the foreground, midground AND distance. The world should feel LUSH, overgrown, busy and richly decorated — never sparse, never empty. Layer different plant types so no two zones look the same.

━━━ THE MONUMENTAL CLAY ANCHOR — one impossibly-big hero element ━━━
${anchor}

This dominates the background and frames everything — render it LARGE and dramatic (the toy dinos read tiny against it). It's the "wow" of the diorama.

━━━ HANDMADE CLAYMATION CRAFT DETAIL ━━━
${craft}

These handcrafted touches sell the stop-motion-diorama charm — visible fingerprints in the clay, sculpting-tool grooves, tiny imperfections, glossy-clay water, hand-rolled clay clouds.

━━━ SECONDARY CRITTERS + SCALE-PROVERS (multi-tier depth) ━━━
${critters}

Small background life and tiny details at multiple depths — they prove the scale of the anchor and fill the world with life. Keep them small and in the mid/far distance.

━━━ CAMERA / FRAMING ━━━
${camera_angle}

This is a WIDE ESTABLISHING SHOT of the ENTIRE sprawling diorama WORLD — NOT a close-up on a few dinos. Show the whole landscape in one frame: multiple zones at once — the monumental anchor, varied clay terrain (hills, ridges, valleys, plateaus, forest, dunes — whatever the BIOME calls for), and a richly-detailed foreground — populated with MANY dinosaurs at every distance. Only include water (a river, lake or pool) when the biome actually has it — do NOT add a river to every scene. Pull the camera WAY back into an EXPANSIVE wide vista — the lush world should sprawl past all four edges of the frame, with far more landscape than any single dino. The dinosaurs are SMALL inhabitants scattered like a herd across the world (tiny-to-medium), NEVER dominating or filling the frame. Depth-on-depth: foreground clay terrain + dinos, midground biome + more dinos, background the monumental clay anchor + sky. Shoot it wide-angle with a LARGE depth of field so the entire diorama is crisp and sharp from the nearest pebble to the farthest peak — everything in focus, like a real life-size set photographed straight-on. Follow the rolled camera framing's EXACT angle — every render must be a DIFFERENT composition (top-down, hilltop, ground-level, off-center, up-angle, panoramic, diagonal); NEVER default to a winding river or path running down the center of the frame.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ MOOD ━━━
${vibeDirective.slice(0, 220)}
${
  surprise
    ? `
━━━ SURPRISE ELEMENT (fires this render — a fun unexpected twist) ━━━
${surprise}

Weave this in as a delightful surprise — a stray non-dino toy or unexpected whimsy crashing the prehistoric world. It should make the viewer grin, NOT steal focus from the toy dinosaurs.
`
    : ''
}
━━━ HARD BANS ━━━
- NO clay/Plasticine dinosaurs — the dinosaurs are REAL PLASTIC TOYS (the WORLD is clay)
- NO real living dinosaurs, NO photoreal nature documentary, NO CGI, NO 2D illustration
- NO single static toy on a plain backdrop — this is a POPULATED multi-tier diorama with a story
- NO modern human-world objects unless they are the rolled surprise element
- NO text, NO UI, NO captions

━━━ STRUCTURE (write the prompt in this order) ━━━
[OPENING: "a handmade claymation diorama of real plastic toy dinosaurs" + the hero dino + what it's DOING], [the other toy dinos at varied distances], [the clay biome around them], [the monumental clay anchor dominating the background], [handmade clay-craft texture detail], [secondary critters / scale-provers in the mid-far distance], [surprise element if rolled], [camera framing + multi-tier depth], [lighting + atmosphere], [color + mood]

Output ONLY the raw 90-130 word scene description. Comma-separated phrases. Lead with the toy-dino action + clay world, not a cast list. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bold labels.`;
  },

  TOYBOT_TOYBOX_CHAOS: ({ slots, sharedDNA, vibeDirective }) => {
    const { camera_angle, toy_cast, surface, scenario, story_beat, lighting, atmosphere, surprise } =
      slots;
    const toys = Array.isArray(toy_cast) ? toy_cast.join(', ') : toy_cast;

    return `You are a toy-photographer capturing a CHAOTIC TOYBOX SCENE for ToyBot — a handful of mismatched real toys composited into ONE interacting mini-vignette on a real surface. Fun, funny, packed with motion, everything reacting to everything.

━━━ THE SURFACE — where the chaos happens ━━━
${surface}

━━━ THE TOYS — composite THESE into ONE interacting scene ━━━
${toys}

━━━ THE STORY BEAT — the EVENT this render is showing ━━━
${story_beat}

Treat the story beat above as the SPECIFIC NARRATIVE EVENT this render captures — the unfolding situation, the characters mid-verb, the props they're reacting to, the implied before/after. Reuse the EVENT, the action verbs, and the kind of chaos described; recast the named toys to match THE TOYS picked above (don't render the literal characters in the seed, recast the same EVENT with the actual rolled toy cast).

${blocks.STORY_BEAT_MANDATE_BLOCK}

━━━ INTERACTION MANDATE — THE WHOLE GAME, NON-NEGOTIABLE ━━━
Weave these toys into ONE chaotic mini-vignette where they are REACTING TO EACH OTHER — chasing, rescuing, battling, fleeing, teaming up, colliding — mid-action. This is NOT a static lineup, NOT toys sitting near each other, NOT a collection/shelf photo. Give it a CLEAR FOCAL BEAT: the ONE toy the eye lands on first (caught mid-action), with the others in motion around it, reacting. Something is HAPPENING — the viewer reads the little story in 2 seconds.

━━━ THE CHAOS SCENARIO (what's going down) ━━━
${scenario}

━━━ TOY-MATERIAL REALISM — each toy in its OWN material ━━━
Render every toy as a REAL PHYSICAL TOY at believable toy scale, each in its OWN distinct native material — hard plastic / soft vinyl / fuzzy plush / die-cast metal / tin wind-up / flocked / wood — NOT a unified art style. Real toys on a real surface: toy photography / practical-diorama realism, visible toy materials (mold-seams, plush-fur, chrome, scuffed factory paint). NOT digital characters, NOT CGI, NOT illustration.
${
  surprise
    ? `
━━━ SURPRISE TOY (fires this render) ━━━
${surprise}

Drop this one extra unexpected toy / whimsy into the chaos as a background gag — it should make the viewer grin, never steal the focal beat.
`
    : ''
}
━━━ CAMERA / FRAMING ━━━
${camera_angle}

Frame WIDE enough that all the toys and their interactions read in one shot — never crop the ensemble. A populated multi-toy scene with the surface and a hint of the surrounding room visible.

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERE ━━━
${atmosphere}

━━━ MOOD ━━━
${vibeDirective.slice(0, 200)}

━━━ HARD BANS ━━━
- NO static lineup / collection-shelf / toys-posed-in-a-row — they MUST interact
- NO licensed / branded / IP characters, names or logos — generic toy archetypes only
- NO unified art style — each toy keeps its own toy material
- NO digital characters, NO CGI, NO 2D illustration — real physical toys
- NO text, NO UI, NO captions

Output ONLY the raw 80-120 word scene description. Comma-separated phrases. Lead with the surface + the focal toy's action, then the reacting toys. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bold labels.`;
  },

  TOYBOT_TOY_BLOCKBUSTER: ({ slots, sharedDNA, vibeDirective }) => {
    const { camera_angle, scenario, centerpiece, setting, story_beat, lighting, atmosphere } =
      slots;

    return `You are a Hollywood movie-poster director shooting an EPIC TOY-MOVIE action scene for ToyBot. Every render is a poster-worthy, blockbuster-cinematic frame — dramatic, packed, beautifully staged and lit — but it is unmistakably made of REAL PHYSICAL TOYS at toy scale (toy photography / practical-set realism), NOT CGI, NOT digital characters.

━━━ ONE TOY UNIVERSE — TOTAL COHESION (load-bearing) ━━━
The ENTIRE scene is a SINGLE toy line — EVERY figure, the cast, AND the giant centerpiece are all the exact same toy universe established by the medium style above (all Funko-vinyl, OR all green-army-men, OR all claymation, OR all plush, OR all fashion-dolls, OR all Sackboy, etc.). It must read as one cohesive toy world — never a mix of toy types. Whatever that toy line is, render the WHOLE epic in it.

⚠️ EMBRACE THE MISMATCH — the toy line and the scene do NOT need to "match." Cute lines land in epic combat scenes on purpose (Strawberry-Shortcake-style figures holding the line in a warzone, fashion dolls storming a fortress, plushies vs a kaiju). The contrast is the FUN — commit to it fully and play it straight, epic and dramatic, never winking.

━━━ THE EPIC SCENE — what is happening (the headline) ━━━
${scenario}

Stage it as a CLIMACTIC movie moment — caught mid-action, freeze-frame energy (charging, firing, leaping, bracing, casting, fleeing, rallying). Clear cause-and-effect. The viewer reads the epic story in 2 seconds.

━━━ THE STORY BEAT — the SPECIFIC narrative event ━━━
${story_beat}

The scenario above is the GENRE; the story beat here is the SPECIFIC moment. Recast the named characters in the story beat as figures from the rolled toy universe — keep the EVENT, the action verbs, the props being reacted to, the implied before/after. The blockbuster cast performs THIS event.

${blocks.STORY_BEAT_MANDATE_BLOCK}

━━━ THE CAST — a heroic ensemble (all this one toy line) ━━━
A cast of 3-6 figures of THIS toy universe — a clear hero figure caught mid-action + supporting characters reacting around them (allies charging, a few foes, background figures). Believable toy-scale figures, real toy materials (visible plastic / vinyl / plush / clay / die-cast). NOT a static lineup — everyone is mid-motion in the scene.

━━━ THE BIG STATEMENT CENTERPIECE — the "wow" (also this toy line) ━━━
${centerpiece}

This dominates the frame — render it MASSIVE via forced perspective, the cast tiny and heroic against it. It is ALSO a toy of the same universe (a giant boss figure / colossal toy vehicle / towering toy monster of that line). This is the movie-poster centerpiece — make it jaw-dropping.

━━━ THE STAGE — real-world setting dressed as an epic location ━━━
${setting}

A real-world surface/place transformed by set-decoration + forced perspective into an epic battlefield / city / arena / wilderness at toy scale. Practical props, layered set dressing, depth-on-depth. Lived-in and real — the toys live in our world at their scale. Honor the SPECIFIC location named above — do NOT collapse it into a generic rocky canyon, ravine, or rock-walled corridor (that default is banned); render the distinct place described.

━━━ CINEMATIC CAMERA / FRAMING (movie poster) ━━━
${camera_angle}

Compose like a blockbuster movie poster: wide-to-medium epic frame, dramatic angle (low hero up-angle, sweeping aerial, dutch tilt), forced-perspective scale contrast between the cast and the giant centerpiece. The whole ensemble + centerpiece read in frame. Cinematic depth.

━━━ DRAMATIC LIGHTING (makes toys look epic) ━━━
${lighting}

Big, theatrical, motivated light — rim-light, god-rays, fire-glow, energy-blast glow, storm light. This is what sells "cheap toys" as a Hollywood frame.

━━━ ATMOSPHERE ━━━
${atmosphere}

Smoke, haze, dust, embers, sparks, debris mid-air — practical atmospheric drama.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 220)}

━━━ HARD BANS ━━━
- NO mixing toy lines — every figure + the centerpiece are the SAME toy universe
- NO CGI, NO digital characters, NO 2D illustration, NO real (non-toy) humans/creatures — real physical toys only
- NO static lineup / collection-shelf — it's a mid-action epic scene
- NO licensed brand names or logos in the output
- NO text, NO UI, NO captions

Output ONLY the raw 90-130 word scene description. Comma-separated phrases. Lead with the epic action + the cast, then the giant centerpiece + setting. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bold labels.`;
  },

  TOYBOT_GIANT_TOYS: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      camera_angle,
      giant_toy,
      cast_toys,
      engagement,
      setting,
      story_beat,
      lighting,
      atmosphere,
      surreal_twist,
    } = slots;
    const castList = Array.isArray(cast_toys) ? cast_toys.join(', ') : cast_toys;

    return `You are an action photographer who has captured a STUPID, GOOFY, epic TOY BOSS BATTLE: ONE GIANT boss/enemy toy fighting a band of SMALLER regular toys (the little heroes), staged in a real-world place. Think kaiju-movie monster-vs-heroes — but EVERY character is a TOY. This is ToyBot's ONE deliberately WEIRD path. GO CRAZY — full slapstick + epic action. Play it straight (deadpan, photoreal) so the dumb toy battle is the joke — it should make you laugh, chuckle, or go "huh, that's unexpected."

⚠️ THE CAST IS TOYS ONLY — NO humans anywhere. The only "characters" are the giant boss toy and the smaller toys. Populate the rest of the scene with the real-world environment (ground, structures, the odd parked car or animal). Simply never include or describe a person, a figure, a crowd, or an onlooker.

━━━ THE GIANT BOSS TOY — the towering enemy ━━━
${giant_toy}

This is the BOSS / monster of the scene — much bigger than the little toys, the threat they are fighting. Render it in its TRUE toy material (real plush fabric and stitched seams, glossy molded plastic with mold-seams, painted tin, lacquered wood) — unmistakably a TOY, just a giant one.

━━━ THE LITTLE TOYS — the band fighting it ━━━
${castList}

A scrappy band of SMALLER regular-sized toys — the heroes/victims swarming, charging, or fleeing the boss. Each in its OWN native toy material. They are much smaller than the boss; their size sells the scale.

━━━ THE ENGAGEMENT — the combat (the headline) ━━━
${engagement}

THIS is what the photo is ABOUT — the giant boss toy and the little toys mid-FIGHT. Caught in the action: stomping, swatting, grabbing, hurling, chasing, while the little toys charge, scatter, dogpile, or stand defiant. Roll the scale to match: a KAIJU-EPIC clash (towering boss, little toys swarming below) OR a close GROUND-BRAWL scuffle. The battle reads instantly.

━━━ THE STORY BEAT — borrow this SPECIFIC narrative shape ━━━
${story_beat}

The engagement above is the GENRE of fight; the story beat here is the SPECIFIC EVENT shape — what props are being reacted to, what implied before/after frames the moment, what micro-detail sells the story. Lift the EVENT, the action verbs, the chaos detail; recast the named characters as the GIANT BOSS and the LITTLE TOY CAST. The boss takes the story beat's protagonist role (or central antagonist), the little toys take the supporting cast.

${blocks.STORY_BEAT_MANDATE_BLOCK}

━━━ THE REAL-WORLD ARENA ━━━
${setting}

A real, ordinary, photoreal place — real grass / sand / pavement / structures / sky — as the battlefield, depicted EMPTY OF PEOPLE. The toys fight at toy scale on/among the real environment. Multi-tier depth: the brawling toys, the real midground, the deep distance.

━━━ ENVIRONMENTAL LIGHT ━━━
${lighting}

Real-world natural / architectural / street light — motivated and believable, raking across the toys, casting real shadows. This sells the photoreal illusion.

━━━ ATMOSPHERE ━━━
${atmosphere}
${surreal_twist ? `\n━━━ BONUS GAG — crank the dumb comedy ━━━\n${surreal_twist}\n` : ''}
━━━ CAMERA / FRAMING ━━━
${camera_angle}

Shoot it like an EPIC CINEMATIC blockbuster movie still — dramatic hero angle, bold dynamic composition, strong directional key light + rim light, atmospheric haze, a touch of lens flare, shallow cinematic depth of field, high production value. Photoreal lens feel (NEVER tilt-shift fake-miniature blur, NEVER a macro single-toy close-up that loses the battle). Frame the FIGHT so both the boss and the little toys + the size gap read. Vary the angle and the scale-register.

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD ━━━
${vibeDirective.slice(0, 220)}

━━━ HARD BANS ━━━
- A BATTLE is HAPPENING — the boss toy and little toys are mid-fight, never just standing or posing
- The cast is TOYS ONLY — real physical toys (plush / plastic / tin / vinyl); NO humans, NO real animals as combatants
- It is a real PHOTOGRAPH — NO CGI, NO 3D-render look, NO illustration, NO cartoon, NO tilt-shift fake-miniature
- The boss is clearly BIGGER than the little toys; keep the size gap readable
- The setting is an ORDINARY real place; keep the fight goofy + harmless + cartoonish (no gore, no real injury)
- NO brand names or logos, NO text, NO UI, NO captions
- OMIT all negation words from your output — never write "not", "no", or name anything you are avoiding; describe only what IS in the frame

Output ONLY the raw 80-120 word photo description. Comma-separated phrases. Lead with the ENGAGEMENT (the fight) + the giant boss toy + the little toys, then the real arena + light. The scene contains NO people — describe only the toys, the real environment, and any animals. NO preamble, NO titles, NO headers, NO ━━━ markers, NO bold labels.`;
  },
};
