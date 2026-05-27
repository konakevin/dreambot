/**
 * BrickBot archetype templates — Sonnet brief-builder functions.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * Each function receives { slots, sharedDNA, vibeDirective } and returns
 * the brief sent to Sonnet for the Flux-prompt write-up. BrickBot's
 * promptPrefix/Suffix wrap the final Flux prompt — these templates
 * focus on the bespoke pirate axes + hoisted hard rules.
 */

module.exports = {
  BRICKBOT_WESTERN: ({ slots, vibeDirective }) => {
    const {
      scene_type,
      minifig_action,
      build_technique,
      camera_framing,
      subject_focus,
      register,
      scene_props,
      lighting,
      palette,
      western_phenomenon,
    } = slots;

    const props = Array.isArray(scene_props) ? scene_props : [scene_props];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = western_phenomenon
      ? `
━━━ WESTERN PHENOMENON (this render's environmental beat) ━━━
${western_phenomenon}

Weave this in as a SECONDARY focal point, rendered IN BRICK (cotton-element + tan round-plate dust-storm / trans-white gunsmoke-puffs on rods / white round-plate train-steam plume / trans-clear heat-shimmer tiles). It AMPLIFIES the frontier drama — never eclipses the subject + minifig action.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a WILD-WEST FRONTIER diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER WILD-WEST IN LEGO BRICKS ━━━
This is a Bricklink AFOL champion's wild-west frontier diorama, photographed at a LEGO World convention. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset. NOT a real western-movie still. The mood is dusty, sun-baked, high-noon-tense or campfire-warm. Visual canon: classic LEGO Western (Cowboys sheriff-vs-outlaw / Fort Legoredo cavalry / Gold City Junction prospectors / Bandit's Hideout) + spaghetti-western + gold-rush boom-town + transcontinental-railroad. RESPECTFUL frontier framing — cowboys, outlaws, sheriffs, prospectors, railroad crews, cavalry; NEVER a dated "cowboys-vs-Indians" caricature or stereotyped Native characters.

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand, fingers, skin, photoreal faces, or claymation-blend. Flux's "LEGO photo" data is contaminated with hand-placing-brick + claymation hero shots. OVERRIDE HARD. Every character is a LEGO minifigure with C-shaped hands + printed plastic face. Cowboy / sheriff / outlaw / prospector / cavalry / railroad-worker minifig variants (cowboy-hat + bandana + revolver / sheriff-star-torso / poncho / suspenders-and-pickaxe / blue-cavalry-kepi / engineer-cap) are LEGO minifigure variants. NEVER a real human face.

━━━ EVERYTHING IS BRICK — INCLUDING DESERT, ROCK, WOOD, WATER, AND DUST ━━━
EVERY element is built from real LEGO bricks. NO photoreal desert, NO photoreal rock/sandstone, NO photoreal wood, NO photoreal sky, NO real western-set photo. Studs CLEARLY VISIBLE. Authentic plastic texture, molded seams. The diorama sits on a tabletop convention display.

⚠️ EXTRA-STRONG LEGO MANDATE FOR DESERT TERRAIN (shared with the landscape path's photoreal pull) — translate EVERY natural element into NAMED BRICK PARTS:
  • Mesa / butte / canyon = stacked tan + orange + red plates + slope-bricks showing sedimentary courses with visible brick-edges — NEVER photoreal sandstone
  • Desert ground = tan + dark-tan plates + slopes with offset-tile ripple — NEVER photoreal sand
  • Buildings = clapboard timber facades built from brown + tan tiles + plates with false-front profiles — NEVER photoreal weathered wood
  • Cactus = brick-built green saguaro arms + barrel-cactus domes — NEVER photoreal cactus
  • River-ford = trans-blue + trans-light-blue plates — NEVER photoreal water
  • Sky = brick sky-baseplate with 1×1 white round-plate clouds — NEVER photoreal sky
  • Dust / gunsmoke = cotton-elements + white/tan 1×1 round-plates — NEVER photoreal dust

━━━ BANNED VOCABULARY (pull Flux to real photography — NEVER use): "photoreal", "real wood/sand/rock/sandstone", "weathered-real", "rugged texture", "dusty haze" as real air, "rushing water". ALSO BANNED — non-rigid motion verbs (render as static built moment): "billowing dust", "swirling", "galloping-blur". Terrain + dust are STATIC brick builds.

━━━ THE SCENE STAGE ━━━
${scene_type}

━━━ THE MINIFIG ACTION — STORY BEAT MANDATE (no posing) ━━━
${minifig_action}

A freeze-frame of a STORY HAPPENING — mid-quickdraw, mid-lasso-throw, mid-train-leap, mid-gold-pan. Show cause + reaction in-frame. NEVER minifigs standing in a row at high noon — show the DRAW, the recoil, the dive for cover.

━━━ THE MOC BUILD TECHNIQUE — AFOL DISTINGUISHER (render visibly) ━━━
${build_technique}

Makes the build read as AFOL champion + unmistakably all-brick. Render it visibly — name the brick parts (clapboard false-front / SNOT sandstone strata / Technic stagecoach-wheels / batwing saloon-doors / brick saguaro).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — the rolled framing DRIVES the composition. Apply the exact angle, even if Flux wants a centered front-facing minifig. Override hard.
  • MAIN-STREET-HIGH-NOON-STANDOFF — two figures at opposite ends of a receding brick street, profile/distance, the dusty face-off
  • SALOON-INTERIOR-OVER-THE-BAR — framed past the brick bar-top into the room, brawl/standoff beyond
  • STAGECOACH-CHASE-TRACKING / TRAIN-TOP-RUNNING — dynamic side/tracking angle, figures in motion-profile
  • CANYON-RIM-AMBUSH-DOWN / MESA-SILHOUETTE-WIDE — high or wide vista angle with tiny figures for scale
  • Avoid centered eye-level front-facing as default — that's the Flux-bias trap.

━━━ THE SUBJECT-FOCUS (silhouette anchor OR no-vehicle scene-focus) ━━━
${subject_focus}

⚠️ HARD BIFURCATION:
• STRUCTURE (saloon / fort / sheriff-office / mine-headframe / depot / bank / trading-post) — render the brick structure as DOMINANT, 50%+ of frame; minifig action AT it.
• MOUNT/VEHICLE (saddled horse / stagecoach-and-team / steam-locomotive / mine-cart / covered-wagon) — render the brick-built mount/vehicle as DOMINANT; horses + teams are chunky brick-built or LEGO animal-elements, NEVER photoreal.
• NO-VEHICLE INTERIOR (saloon / sheriff-office / bank-vault / mine-shaft / general-store) — the brick interior is the SETTING, the minifig action the SUBJECT; pack it with frontier brick detail.
• NO-VEHICLE LANDSCAPE (mesa-badlands / slot-canyon / desert-flat / river-ford) — the brick frontier landscape is the SETTING with minifig action as the focal beat; multi-tier depth, tiny-figures-prove-scale.

━━━ THE REGISTER (frontier heritage lock) ━━━
${register}

The aesthetic lock — costume, build motifs, palette, props align with this heritage (classic-LEGO-Cowboys / Fort-cavalry-blue / Gold-City-prospector / spaghetti-western / railroad-frontier). Never mix anachronistically.

━━━ DIORAMA STORYTELLING DETAILS — fill the negative space ━━━
${propLines}

These small builds populate the diorama as deliberate brick-built details — never decorative-only. Each prop implies a frontier backstory.
${phenomenonSection}━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY ━━━
• If register is CLASSIC-LEGO-COWBOYS — sheriff-star + cowboy-hat minifigs, false-front timber main-street, rust + tan + barn-red palette.
• If register is FORT-CAVALRY — blue-kepi cavalry minifigs, log-stockade fort + flag, blue + tan + timber palette.
• If register is GOLD-CITY-PROSPECTOR — suspenders + pickaxe + gold-pan minifigs, mine-headframe + sluice + assay-office, amber + brown + grey palette.
• If register is RAILROAD-FRONTIER — engineer + rail-crew minifigs, steam-locomotive + trestle + water-tower, black + brass + timber palette.
• Desert terrain is ALWAYS slope-brick + plate strata, never photoreal, regardless of how cinematic the lighting feels.
• Whatever palette rolls, the register's signature WINS if they conflict.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the subject_focus + scene + minifig action + camera framing, weave in the build technique + register + props + lighting + palette + western phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier LEGO MOC western diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_THEME_PARK: ({ slots, vibeDirective }) => {
    const {
      attraction,
      crowd_action,
      build_technique,
      camera_framing,
      register,
      scene_life,
      lighting,
      palette,
      spectacle,
    } = slots;

    const life = Array.isArray(scene_life) ? scene_life : [scene_life];
    const lifeLines = life.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const spectacleSection = spectacle
      ? `
━━━ SPECTACLE (this render's environmental beat) ━━━
${spectacle}

Weave this in as a SECONDARY focal point, rendered IN BRICK (trans-element firework-stars on clear rods / trans-blue plate fountain-jet / 1×1 round-plate confetti / trans-bar laser-show). It AMPLIFIES the fun — never eclipses the ride + crowd action.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing an AMUSEMENT-PARK / CARNIVAL diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER FAIRGROUND IN LEGO BRICKS ━━━
This is a Bricklink AFOL champion's working-fairground diorama, photographed at a LEGO World convention — the kind with motorized rides and thousands of parts. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset. NOT a real theme-park photo. The mood is KINETIC, BRIGHT, JOYFUL — big brick rides in motion, crowds of tiny minifigs, neon ablaze. Visual canon: LEGO Creator Expert Fairground Collection (the ornate motorized Ferris Wheel / Carousel / Roller Coaster / Loop Coaster / Haunted House / Pirate-ship Mixer) + LEGO City amusement + Friends amusement-park + AFOL Great-Ball-Contraption fairground MOCs. NEVER licensed-park IP (no Disney / Universal named lands, castles-as-trademarks, or franchise characters).

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand, fingers, skin, photoreal faces, or claymation-blend. Flux's "LEGO photo" data is contaminated with hand-placing-brick + claymation hero shots. OVERRIDE HARD. Every person is a LEGO minifigure with C-shaped hands + printed plastic face — and there are CROWDS of them (riders, families, vendors), tiny and many. NEVER a real human face.

━━━ EVERYTHING IS BRICK — INCLUDING RIDES, LIGHTS, WATER, AND FIREWORKS ━━━
EVERY element is built from real LEGO bricks. NO photoreal rides, NO photoreal lights, NO photoreal water, NO photoreal sky, NO real fairground photo. Studs CLEARLY VISIBLE. Authentic plastic texture, molded seams. The diorama sits on a tabletop convention display.
  • Ride structures = brick-built with visible Technic-beam framework, SNOT curves, and connection points — NEVER photoreal steel
  • Neon / ride-lights = trans-red + trans-blue + trans-yellow + trans-orange elements + 1×1 round-plate bulb-strings — NEVER photoreal neon-glow
  • Coaster track = Technic / brick-built rail with cars of slope-bricks + minifig riders — NEVER photoreal track
  • Water (flume / fountain / water-slide) = trans-blue + trans-light-blue layered plates with white round-plate foam — NEVER photoreal water
  • Crowds = many small standard minifigs massed at varied positions — NEVER photoreal people
  • Sky = brick sky-baseplate (or studio backdrop) — NEVER photoreal sky
  • Fireworks = trans-element star-bursts on clear rods — NEVER photoreal fireworks

━━━ BANNED VOCABULARY (pull Flux to real photography — NEVER use): "photoreal", "real steel/metal", "real neon", "glistening", "rushing water", "blurred motion / motion-blur". Render motion as a FROZEN brick moment (a coaster mid-drop is a static built car on a built track), never blurred.

━━━ THE ATTRACTION — the hero ride/structure ━━━
${attraction}

Build the hero ride large and dominant, brick-built with visible framework + ride-mechanism detail. It is the centerpiece.

━━━ THE CROWD ACTION — STORY BEAT MANDATE (no posing) ━━━
${crowd_action}

A freeze-frame of FUN HAPPENING — riders mid-scream, a midway game mid-toss, a flume mid-splashdown. Show the cause + the reaction. Crowds react (arms up, pointing, laughing-print faces). NEVER minifigs standing in a row.

━━━ THE MOC BUILD TECHNIQUE — AFOL DISTINGUISHER (render visibly) ━━━
${build_technique}

This makes the build read as AFOL champion + unmistakably all-brick — the working-ride mechanism is the wow. Render it visibly: name the brick parts (Technic-beam framework / trans-element neon / GBC-motion / SNOT loop / slope-brick coaster-cars).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — the rolled framing DRIVES the composition. Apply the exact angle, even if Flux wants a centered front-facing minifig. Override hard.
  • COASTER-POV-DOWN-THE-DROP / FERRIS-WHEEL-LOOKING-UP / WATER-SLIDE-TOWER — vertical drama, the ride towering
  • AERIAL-PARK-OVERVIEW / DUSK-SKYLINE-OF-RIDES — wide establishing, the whole park + crowds
  • MIDWAY-DOWN-THE-ROW / PARADE-ROUTE-LOW — receding perspective down a lane of stalls/floats + crowd
  • UNDER-THE-COASTER-STRUCTURE / CAROUSEL-FROM-INSIDE — framed by the brick ride-structure

━━━ THE REGISTER (fairground heritage lock) ━━━
${register}

The aesthetic lock — ride ornamentation, palette, signage, and crowd styling align with this heritage (ornate-vintage Creator-Expert / sleek modern City / cute pastel Friends / retro Coney-Island). Never mix anachronistically.

━━━ THE PARK'S LIFE — fill the midway (render both, brick-built) ━━━
${lifeLines}

These brick-built stalls/carts/vendors populate the scene with deliberate detail + tiny story (a vendor minifig handing over a brick treat, a prize-wall of plush-builds). Never decorative-only.
${spectacleSection}━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY ━━━
• If register is CREATOR-EXPERT-FAIRGROUND — ornate vintage detailing, cream + teal + red + gold, scalloped canopies + filigree.
• If register is FRIENDS-AMUSEMENT — bright pastel, mini-doll crowds, heart + star signage.
• If register is CITY-MODERN-AMUSEMENT — sleeker rides, primary colors, modern signage.
• Neon + ride-lights are ALWAYS trans-element brick, regardless of how photoreal the lighting feels.
• Motion (spin / drop / splash) is ALWAYS a frozen brick moment — never blurred.
• Whatever palette rolls, the register's signature WINS if they conflict.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the attraction + crowd action + camera framing, weave in the build technique + register + scene-life + lighting + palette + spectacle (if fired). End with one phrase reinforcing AFOL convention-tier LEGO MOC fairground photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_LANDSCAPE: ({ slots, vibeDirective }) => {
    const {
      biome_vista,
      terrain_build_technique,
      scale_prover,
      flora_detail,
      camera_framing,
      atmosphere,
      lighting,
      palette,
      natural_phenomenon,
    } = slots;

    const provers = Array.isArray(scale_prover) ? scale_prover : [scale_prover];
    const proverLines = provers.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = natural_phenomenon
      ? `
━━━ NATURAL PHENOMENON (this render's dramatic beat) ━━━
${natural_phenomenon}

Weave this in as a SECONDARY focal point, rendered IN BRICK (trans-arc rainbow plates / white round-plate waterfall-mist + rapids-foam / trans-orange lava-glow / trans-bolt lightning / a built avalanche-cloud of white slopes + round-plates / an aurora arc of trans-green + trans-cyan plates). It AMPLIFIES the vista — never overwhelms the terrain as hero.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing an EPIC NATURAL-VISTA diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER ALL-BRICK GALLERY-VISTA ━━━
This is a Bricklink AFOL champion's all-brick NATURAL-LANDSCAPE diorama, photographed at a LEGO World convention — the kind that wins Best-of-Show for sheer scale and terrain craft. NOT a stock photo from Lego.com. NOT a kid's playset. NOT a real nature photograph. It evokes a Marc-Adamus / Peter-Lik gallery vista — monumental, atmospheric, awe-inducing — but EVERY ELEMENT IS LEGO BRICK on a tabletop convention display.

━━━ THE LANDSCAPE IS THE HERO — minifigs are TINY SCALE-PROVERS ONLY ━━━
The natural vista is the SUBJECT and fills the frame. Minifigs, if present, are DWARFED scale-references at a distance (a lone hiker on a ridge, two climbers on a cliff, a photographer at an overlook) — NEVER the focus, NEVER close-up, NEVER centered-and-large. The whole point is the monumental scale of the brick terrain against a tiny human figure.

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand, real fingers, real skin, photoreal faces, or claymation-blend. Flux's "LEGO photo" training data is contaminated with hand-placing-brick + claymation hero shots. OVERRIDE HARD. Any figure is a standard LEGO minifigure (hiker / climber / photographer with C-shaped hands + printed plastic face), rendered TINY for scale. NEVER a real human face.

━━━ EVERYTHING IS BRICK — INCLUDING ROCK, WATER, SNOW, CLOUDS, TREES, AND SKY ━━━
EVERY element is built from real LEGO bricks. NO photoreal rock, NO photoreal water, NO photoreal snow, NO photoreal clouds, NO photoreal foliage, NO photoreal sky, NO real terrain texture. Studs CLEARLY VISIBLE where not snow/grass-covered. Authentic plastic texture, molded seams, visible brick-edges and panel-lines in the terrain. The diorama sits on a tabletop convention display.

⚠️ EXTRA-STRONG LEGO MANDATE FOR NATURAL VISTAS — Flux's "epic landscape" + "mountain vista" + "canyon" + "redwood forest" + "glacier" training priors are its SINGLE STRONGEST photoreal pull. OVERRIDE THAT BIAS HARD — translate EVERY natural element into NAMED BRICK PARTS:
  • Mountains / cliffs / rock = light-bley + dark-bley + tan slope-bricks + BURP/LURP rock-pieces in stepped strata with VISIBLE brick-edges — NEVER photoreal rock-face, NEVER real stone texture
  • Rock striations / canyon layers = stacked plates in graduated tan/orange/red showing each sedimentary band as a distinct plate-course — NEVER photoreal strata
  • Water (river / lake / waterfall / surf) = trans-blue + trans-light-blue layered plates with white 1×1 round-plate foam — NEVER photoreal water
  • Snow-caps = white slope-bricks + white plates + white-stud caps on the peaks — NEVER photoreal snow
  • Clouds / cloud-sea = banks of white 1×1 round-plates + cotton-elements massed at a level — NEVER photoreal clouds
  • Forest canopy (from above/distance) = a textured carpet of green + olive plant-elements + green slope-bricks — NEVER photoreal treetops
  • Trees (near) = brown round-brick trunks + green plant-element + slope-brick boughs — NEVER photoreal trees
  • Meadow / grass = green + sand-green plates with plant-element + round-plate wildflowers — NEVER photoreal grass
  • Sky = brick sky-baseplate (or seamless studio backdrop) with brick cloud-elements — NEVER photoreal sky-gradient with real clouds
  • Desert sand / dunes = tan + dark-tan slope-bricks + plates with offset-tile ripple — NEVER photoreal sand

━━━ BANNED VOCABULARY (pull Flux to real photography — NEVER use): "photoreal", "real rock/stone/water/snow", "rugged texture", "rocky texture", "craggy" (use "stepped slope-brick"), "rushing water", "misty" applied to real air. ALSO BANNED — non-rigid material-motion verbs: "rushing", "cascading" as fluid (render as built stepped trans-plates), "rolling fog" (render as static cotton-elements), "billowing". Terrain + water are STATIC brick builds.

━━━ THE BIOME VISTA — the hero subject (fills the frame) ━━━
${biome_vista}

This monumental brick landscape IS the subject. Build it tall, deep, and dominant — multi-tier depth from a detailed foreground through a mid-ground to a deep-distance ridge-line, all in brick.

━━━ THE TERRAIN BUILD TECHNIQUE — AFOL DISTINGUISHER (render visibly) ━━━
${terrain_build_technique}

This is the technique that makes the terrain read as AFOL champion AND unmistakably all-brick (the single most important guard against photoreal-landscape drift). Render it visibly — name the brick parts (slope-brick strata / BURP rock-piece / trans-blue plate water / stacked-plate striations / white round-plate cloud).

━━━ SCALE PROVERS — tiny figures/elements that prove the monumental scale (at DIFFERENT depths) ━━━
${proverLines}

Place these TINY against the vista at different depths so the eye reads the terrain as enormous. They are dwarfed — a few studs tall against a vista that fills the frame. NEVER large, NEVER centered, NEVER the focus.

━━━ FLORA DETAIL — the brick vegetation dressing the biome ━━━
${flora_detail}

Render as deliberate brick vegetation appropriate to the biome — never photoreal plants.

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — the rolled framing DRIVES the composition. Apply the exact vista angle. This is a LANDSCAPE — favor wide, deep, vertical-scale-emphasizing compositions; never a centered minifig portrait.
  • SWEEPING HIGH-AERIAL / RIDGE-PANORAMA / SUMMIT-OVERLOOK — wide, deep, the vista receding to a far horizon
  • VALLEY-FLOOR-LOOKING-UP / WORM'S-EYE-UP-A-REDWOOD — tilt up to emphasize towering vertical scale
  • THROUGH-A-SLOT-CANYON / CLIFF-EDGE-VERTIGO — framed by foreground terrain, dramatic depth
  • REFLECTION-IN-A-STILL-LAKE — symmetry across a trans-blue plate water-mirror

━━━ ATMOSPHERE (brick-rendered) ━━━
${atmosphere}

━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}
${phenomenonSection}
━━━ CROSS-AXIS COMPATIBILITY ━━━
• Whatever the biome, the terrain_build_technique brick parts WIN — the terrain must always read as constructed brick, never photoreal, even if atmosphere/lighting pull cinematic.
• If atmosphere is "low cloud-sea" — build it as a level bank of white round-plates + cotton-elements BELOW the peaks, peaks emerging above.
• If natural_phenomenon is "waterfall-mist" or "rapids-foam" — render as white 1×1 round-plate clusters, never photoreal spray.
• Snow-caps + water + clouds are ALWAYS trans/white brick elements, regardless of how photoreal the lighting feels.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the biome vista + terrain build technique + camera framing, weave in the scale provers (tiny) + flora + atmosphere + lighting + palette + natural phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier all-brick landscape MOC photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_WINTER: ({ slots, vibeDirective }) => {
    const {
      scene_type,
      minifig_action,
      snow_ice_build_technique,
      camera_framing,
      subject_focus,
      register,
      scene_props,
      lighting,
      palette,
      winter_phenomenon,
    } = slots;

    const props = Array.isArray(scene_props) ? scene_props : [scene_props];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = winter_phenomenon
      ? `
━━━ WINTER PHENOMENON (this render's environmental beat) ━━━
${winter_phenomenon}

Weave this in as a SECONDARY focal point, rendered IN BRICK (white 1×1 round-plate snow-flurry on clear rods / a built aurora arc of trans-cyan + trans-green + trans-purple plates / cotton-element blizzard veil / trans-clear icicle-glints). It AMPLIFIES the cozy scene — never eclipses the subject + minifig action.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a SNOW & ICE WINTER diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER COZY-WINTER STORYTELLING IN LEGO BRICKS ━━━
This is a Bricklink AFOL champion's WINTER diorama, photographed at a LEGO World convention. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset arrangement. NOT a real ski-resort or snow photo. The mood ranges cozy-festive (Winter Village warmth) to crisp-adventurous (Arctic expedition) — always charming. The build is OBSESSIVELY detailed — every brick intentional, every minifig mid-action, every snowdrift deliberately built. Visual canon: LEGO Winter Village (Ideas Toy Shop / Bakery / Market / Holiday Train / Gingerbread House) + LEGO City Arctic Explorers (orange-white icebreakers + snowcats) + Friends winter resort + Creator winter cabin + classic alpine. NOT Ice Planet / sci-fi ice (that's the space path).

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand placing a brick. NEVER real human fingers, skin, photoreal faces, or claymation-blend faces. Flux's "LEGO photo" training data is contaminated with hand-placing-brick + Lego.com claymation hero shots. OVERRIDE HARD. Every character is a LEGO minifigure with C-shaped hands + printed plastic face. Skier / villager / Arctic-explorer / ice-fisher / sledder minifig variants (knit-cap + scarf print / parka-hood / goggles + ski-poles / fur-lined Arctic hood) are LEGO minifigure variants. NEVER a real human face.

━━━ EVERYTHING IS BRICK — INCLUDING SNOW, ICE, FROZEN WATER, ICICLES, AND BLIZZARD ━━━
EVERY element is built from real LEGO bricks. NO photoreal snow, NO photoreal ice, NO photoreal frost, NO photoreal frozen water, NO photoreal sky. Studs CLEARLY VISIBLE where not snow-covered. Authentic plastic texture, molded seams. The diorama sits on a tabletop convention display.

⚠️ EXTRA-STRONG LEGO MANDATE FOR SNOW + ICE SCENES — Flux's "ski resort" + "winter wonderland" + "frozen lake" + "snowy village" training priors are HEAVILY photoreal-contaminated. OVERRIDE THAT BIAS HARD — translate EVERY wintry element into NAMED BRICK PARTS:
  • Snow cover / drifts = white slope-bricks + white plates + white-stud rounded mounds capping every roof, branch, and ledge — NEVER photoreal snow, NEVER soft real powder
  • Ice castle / ice structures = SNOT-curved trans-light-blue + trans-clear slope-bricks with crisp brick-edges — NEVER photoreal ice
  • Frozen lake / ice sheet = a smooth surface of trans-light-blue + white tiles (tiled = smooth ice) — NEVER photoreal frozen water
  • Icicles = trans-clear + trans-light-blue bar-elements / cone-elements hanging in rows — NEVER photoreal icicles
  • Snow flurry / falling snow = scattered white 1×1 round-plates on clear bar-rods + cotton-elements — NEVER photoreal snowfall
  • Pine trees = brown round-brick trunks + dark-green plant-element + slope-brick boughs with white-plate snow-load — NEVER photoreal pines
  • Rock / mountain = light-bley + dark-bley slope-bricks with white-plate snow-caps — NEVER photoreal rock
  • Sky = brick sky-baseplate with scattered 1×1 white round-plate clouds — NEVER photoreal sky
  • Window-glow / fire = trans-orange + trans-yellow elements behind brick window-frames — warm brick light

━━━ BANNED VOCABULARY (pull Flux to real photography — NEVER use): "photoreal", "real snow/ice", "soft powder", "glistening snow", "sparkling frost", "drifting snow". ALSO BANNED — non-rigid-material motion verbs: "drifting", "swirling snow" (render as static white-round-plates on rods), "billowing", "flowing". Snow + ice are STATIC brick builds.

━━━ THE SCENE STAGE ━━━
${scene_type}

━━━ THE MINIFIG ACTION — STORY BEAT MANDATE (no posing) ━━━
${minifig_action}

This is a freeze-frame of a STORY HAPPENING — verbs, consequences, reactions. Minifigs mid-ski-carve, mid-snowball-throw, mid-cocoa-pour, mid-sled-mush, mid-rescue-dig. NEVER minifigs standing around. Render WHAT IS HAPPENING — the cause, the action, the reaction in the same frame.

━━━ THE SNOW/ICE BUILD TECHNIQUE — AFOL DISTINGUISHER (render the technique visibly) ━━━
${snow_ice_build_technique}

This is the technique that makes the build read as AFOL champion AND unmistakably all-brick (the single most important guard against photoreal-snow drift). Render it visibly — name the brick parts (white slope-brick drift / trans-light-blue SNOT ice / smooth-tile frozen-lake / trans-clear icicle bar / cotton-element flurry).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — the rolled camera angle DRIVES the composition. Apply the exact position + orientation, even if Flux's "LEGO MOC photography" prior wants to center the minifig front-facing. Override hard.
  • SKI-SLOPE-DOWNHILL / SUMMIT-AERIAL / VILLAGE-SQUARE-OVERHEAD — high/down angle, minifigs from above, ensemble
  • CABIN-WINDOW-WARM-OUT-TO-COLD — interior warm foreground framing a cold exterior through a brick window
  • FROZEN-LAKE-LOW-ACROSS-THE-ICE / SLED-TRAIL-TRACKING — low tracking angle, figures in profile/receding
  • ICICLE-CAVE-THROUGH / GONDOLA-POV — framed-through foreground elements, layered depth
  • Avoid centered eye-level minifig front-facing as default — that's the Flux-bias trap.

━━━ THE SUBJECT-FOCUS (silhouette anchor OR no-vehicle scene-focus) ━━━
${subject_focus}

⚠️ HARD BIFURCATION:
• STRUCTURE (chalet / ice-castle / igloo / gondola-tower / research-station / covered-bridge / village-shop) — render the brick structure as the DOMINANT subject, 50%+ of frame; minifig action AT it.
• CREATURE-MOUNT (husky-sled-team / reindeer / polar-bear / snowy-owl) — render the brick-built creature(s) + rider/driver minifig as DOMINANT; creatures chunky brick-built or LEGO animal-elements, NEVER photoreal.
• NO-VEHICLE INTERIOR (hot-cocoa-cabin / ski-lodge-fireside / research-hut / toy-shop) — the cozy brick interior is the SETTING, the minifig action the SUBJECT; pack it with warm brick detail (hearth, mugs, gear).
• NO-VEHICLE LANDSCAPE (powder-slope / frozen-lake / snow-pine-forest / glacier) — the brick winter landscape is the SETTING with minifig action as the focal beat; multi-tier depth (foreground snow-drift → midground figures → deep-distance snow-peaks). LUSH + densely detailed, never bare-white-sparse.

━━━ THE REGISTER (winter heritage lock for this render) ━━━
${register}

The aesthetic lock — minifig gear, build motifs, palette, props ALL align with this heritage signature; never mix anachronistically (no neon Arctic-tech on a cozy Winter-Village build, no Victorian holiday-charm on a modern research station).

━━━ DIORAMA STORYTELLING DETAILS — fill the negative space ━━━
${propLines}

These small builds populate the diorama corners as deliberate brick-built details — never decorative-only. Each prop should imply a cozy backstory.
${phenomenonSection}━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY (drop the lesser axis when register-incompatible) ━━━
• If register names WINTER-VILLAGE — palette becomes cozy red + green + white + gold; builds lean festive timber shops + string-lights + holiday-train; mood warm-nostalgic.
• If register names CITY-ARCTIC-EXPLORERS — palette becomes orange + white + black + tech-grey; subject leans icebreaker + snowcat + research-station; mood crisp-adventurous.
• If register names FRIENDS-WINTER-RESORT — palette becomes pastel-blue + pink + white; minifigs become mini-doll skiers; builds lean cute ski-chalet + ice-rink + hot-cocoa-stand.
• If register names CREATOR-NATURAL-CABIN — palette becomes natural log-brown + pine-green + snow-white; builds lean realistic timber cabin + woodpile.
• If winter_phenomenon is AURORA AND lighting is a warm setup — keep the aurora cool trans-green/cyan in the SKY while the warm light stays on the ground builds.
• Whatever palette rolls, the register's signature colors WIN if they conflict.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the subject_focus + scene + minifig action + camera framing, weave in the snow/ice build technique + register + props + lighting + palette + winter phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier LEGO MOC diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_AQUATIC: ({ slots, vibeDirective }) => {
    const {
      scene_type,
      minifig_action,
      water_build_technique,
      camera_framing,
      subject_focus,
      register,
      marine_life,
      scene_props,
      lighting,
      palette,
      aquatic_phenomenon,
    } = slots;

    const creatures = Array.isArray(marine_life) ? marine_life : [marine_life];
    const creatureLines = creatures.map((c, i) => `  ${i + 1}. ${c}`).join('\n');
    const prop = Array.isArray(scene_props) ? scene_props[0] : scene_props;

    const phenomenonSection = aquatic_phenomenon
      ? `
━━━ AQUATIC PHENOMENON (this render's environmental beat) ━━━
${aquatic_phenomenon}

Weave this in as a SECONDARY focal point, rendered IN BRICK (trans-clear bubble-strings on bar-rods / trans-blue wave-curl with white-stud foam / trans-cyan bioluminescent-bloom plates / a built whale-shadow silhouette overhead / a trans-blue caustic light-pillar). It AMPLIFIES the scene — never eclipses the subject + minifig action.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing an AQUATIC diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER BEACH-AND-UNDERWATER STORYTELLING IN LEGO BRICKS ━━━
This is a Bricklink AFOL champion's AQUATIC diorama, photographed at a LEGO World convention. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset arrangement. NOT a real underwater or beach photo. The build is OBSESSIVELY detailed — every brick intentional, every minifig mid-action, every marine creature brick-built, every prop telling a story. Visual canon: LEGO Atlantis (gold-treasure deep-sea quest) + Aquazone (Aquanauts yellow-black / Aquasharks / Hydronauts) + LEGO City Deep Sea Explorers (white-azure-lime subs) + Friends Heartlake beach + Creator beach-house + lighthouse + Ideas Ship-in-a-Bottle + retro Jules-Verne Nautilus + Cousteau Calypso. NOT pirate ships (that's the pirates path).

━━━ THE SCENE IS EITHER SURFACE OR SUBMERGED — commit fully to whichever the scene stage names ━━━
• SURFACE (beach / coast / boardwalk / tide-pool / surf / bonfire): air above, tan-plate sand + slope-brick dunes, trans-blue plate shallows lapping the shore, palm-tree builds (brown round-brick trunks + green plant-element fronds), bright tropical sky-baseplate.
• SUBMERGED (reef / kelp / trench / shipwreck / grotto): the WHOLE frame is underwater — a trans-blue + trans-light-blue plate water-column tints everything, brick coral + kelp, drifting trans-clear bubble-strings, caustic light dapple, marine life suspended on clear rods, NO open sky.

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand placing a brick. NEVER real human fingers, skin, photoreal faces, or claymation-blend faces. Flux's "LEGO photo" training data is contaminated with hand-placing-brick + Lego.com claymation hero shots. OVERRIDE HARD. Every character is a LEGO minifigure with C-shaped hands + printed plastic face. Diver / snorkeler / surfer / lifeguard / beachgoer / Aquanaut / mermaid minifig variants (scuba-helmet + flippers / wetsuit-print / swim-print + flower-lei / yellow-black Aquanaut airtank-element / mermaid-tail brick-build) are LEGO minifigure variants. NEVER a real human face.

━━━ EVERYTHING IS BRICK — INCLUDING WATER, WAVES, CORAL, KELP, SAND, BUBBLES, AND MARINE LIFE ━━━
EVERY element is built from real LEGO bricks. NO photoreal water, NO photoreal ocean, NO photoreal sand, NO photoreal coral, NO photoreal fish, NO photoreal sky. Studs CLEARLY VISIBLE on flat surfaces. Authentic plastic texture, molded seams. The diorama sits on a tabletop convention display.

⚠️ EXTRA-STRONG LEGO MANDATE FOR WATER + MARINE SCENES — Flux's "underwater reef" + "tropical beach" + "ocean wave" training priors are HEAVILY photoreal-contaminated. OVERRIDE THAT BIAS HARD — translate EVERY fluid/organic element into NAMED BRICK PARTS:
  • Open water / underwater column = trans-blue + trans-light-blue + trans-clear layered plates tinting the whole frame — NEVER photoreal water
  • Waves / surf = SNOT-curled trans-light-blue slope-pieces with white 1×1 round-plate + white-stud foam crests — NEVER photoreal wave
  • Coral = brick-built from modified-plant elements, horn/tooth pieces, 1×4 fence elements, and bright slope-bricks in pink/orange/purple — NEVER photoreal coral
  • Kelp / seagrass = stacked green + olive plant-stem elements rising on bar armatures — NEVER photoreal kelp
  • Sand / seafloor = tan + dark-tan plates and slope-bricks, ripple-texture from offset tiles — NEVER photoreal sand
  • Bubbles = trans-clear + white 1×1 round-plates threaded on clear bar-rods in rising strings — NEVER photoreal bubbles
  • Sky (surface scenes) = brick sky-baseplate with scattered 1×1 white round-plate clouds — NEVER photoreal sky
  • Caustic light = scattered trans-clear + trans-light-blue tiles catching the light — NEVER a photoreal caustic overlay

⚠️ BANNED VOCABULARY (pull Flux to real photography — NEVER use, even descriptively): "photoreal", "real water/ocean/sand/coral", "rippling water", "crystal-clear water", "sun-dappled" applied to real water. ALSO BANNED — fluid-MOTION verbs implying non-rigid material: "rippling", "flowing", "swaying" (kelp is rigid brick), "lapping" (render as static trans-plate edge), "crashing" (render as a built frozen wave-curl). Water + creatures are STATIC brick builds frozen mid-moment.

━━━ THE SCENE STAGE (surface or submerged) ━━━
${scene_type}

━━━ THE MINIFIG ACTION — STORY BEAT MANDATE (no posing) ━━━
${minifig_action}

This is a freeze-frame of a STORY HAPPENING — verbs, consequences, reactions. Minifigs mid-dive-descent, mid-net-haul, mid-surf-carve, mid-treasure-pry, mid-creature-release. NEVER minifigs standing around. Render WHAT IS HAPPENING — the cause, the action, the reaction in the same frame.

━━━ THE WATER / BUILD TECHNIQUE — AFOL DISTINGUISHER (render the technique visibly) ━━━
${water_build_technique}

This is the technique that makes the build read as AFOL champion AND unmistakably all-brick (the single most important guard against photoreal-water drift). Render it visibly — name the brick parts (trans-blue plates / SNOT slope-curl / clear bar-rod bubble-string / modified-plant coral / plant-stem kelp).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — the rolled camera angle DRIVES the composition. Apply the exact position + orientation, even if Flux's "LEGO MOC photography" prior wants to center the minifig front-facing. Override hard.
  • WATERLINE-SPLIT — render half above the surface (sky/beach) and half below (reef/divers), the trans-blue waterline bisecting the frame
  • UNDERWATER-LOOKING-UP — camera on the seafloor looking up toward the bright surface, marine life + divers silhouetted against the trans-blue light above
  • REEF-WALL-TRACKING / THROUGH-THE-KELP — camera framed by foreground coral/kelp, the scene revealed beyond, layered depth
  • BEACH-LOW-TIDE-WIDE / LIGHTHOUSE-CLIFF-AERIAL — wide establishing ensemble, multiple minifigs at varied positions, NOT one centered figure
  • TIDE-POOL-MACRO / SUBMARINE-PORTHOLE — extreme close or framed-circular, subject partial in frame
  • Avoid centered eye-level minifig front-facing as default — that's the Flux-bias trap.

━━━ THE SUBJECT-FOCUS (silhouette anchor OR no-vehicle scene-focus) ━━━
${subject_focus}

⚠️ HARD BIFURCATION:
• STRUCTURE (lighthouse / surf-shack / brick submarine / Atlantis-gate / sunken-temple / reef-arch / pier) — render the brick structure as the DOMINANT subject, filling 50%+ of frame; minifig action happens AT it.
• CREATURE-MOUNT (riding sea-turtle / manta-ray / dolphin / giant-seahorse / orca) — render the brick-built creature + rider minifig as the DOMINANT subject; creature is chunky brick-built or LEGO animal-element, NEVER photoreal.
• NO-VEHICLE INTERIOR (submarine-cabin / beach-hut / lighthouse-lamp-room / research-dome) — the brick interior is the SETTING, the minifig action the SUBJECT; pack it with brick cozy/technical detail.
• NO-VEHICLE LANDSCAPE (open coral-reef / kelp-forest / tide-pool-shelf / beach-cove) — the brick seascape is the SETTING with minifig + marine-life action as the focal beat; multi-tier depth (foreground coral → midground figures/creatures → deep-distance reef-wall or horizon). LUSH + densely populated, never sparse.

━━━ THE REGISTER (marine heritage lock for this render) ━━━
${register}

The aesthetic lock — minifig gear, build motifs, palette, props ALL align with this heritage signature; never mix anachronistically (no Aquazone neon-green on a natural Creator-beach build, no Atlantis-gold treasure on a modern Deep-Sea sub).

━━━ MARINE LIFE — the reef/beach is ALIVE (render both, brick-built) ━━━
${creatureLines}

These brick-built creatures populate the scene at varied depths/positions — suspended on clear rods underwater, or at the waterline for surface scenes. EACH is unmistakably brick-built (slope-brick bodies, printed-eye tiles, plate fins, modified-element tails), NEVER photoreal. They add life + scale + story.

━━━ DIORAMA STORYTELLING DETAIL ━━━
${prop}

Render this as a deliberate brick-built detail that implies a backstory — never decorative-only.
${phenomenonSection}━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY (drop the lesser axis when register-incompatible) ━━━
• If register names ATLANTIS — palette becomes gold + teal + treasure-amber; props lean sunken-treasure + ancient-gate; mood quest-adventure.
• If register names AQUAZONE-AQUANAUTS — palette becomes yellow + black + trans-neon-green; minifigs become yellow-black Aquanaut divers with airtank-elements; builds lean retro-sub + sea-lab.
• If register names DEEP-SEA-EXPLORERS — palette becomes white + azure + lime; subject_focus leans modern research-sub + ROV + dome.
• If register names FRIENDS-HEARTLAKE-BEACH — palette becomes pastel turquoise + coral + sand; minifigs become friendly beachgoer mini-dolls; mood sunny-wholesome.
• If register names CREATOR-NATURAL-BEACH — palette becomes natural turquoise + ivory-sand + jade-palm; builds lean realistic lighthouse + beach-house.
• If scene is SUBMERGED — there is NO open sky; the whole frame is trans-blue water-tinted. If SURFACE — render the bright sky-baseplate + air.
• Whatever palette rolls, the register's signature colors WIN if they conflict.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the subject_focus + scene + minifig action + camera framing, weave in the water-build technique + register + marine life + prop + lighting + palette + aquatic phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier LEGO MOC diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_FANTASY: ({ slots, vibeDirective }) => {
    const {
      scene_type,
      minifig_action,
      build_technique,
      camera_framing,
      subject_focus,
      register,
      scene_props,
      lighting,
      palette,
      magical_phenomenon,
    } = slots;

    const props = Array.isArray(scene_props) ? scene_props : [scene_props];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = magical_phenomenon
      ? `
━━━ MAGICAL PHENOMENON (this render's environmental beat) ━━━
${magical_phenomenon}

Weave this into the diorama as a SECONDARY focal point — render it visibly (brick-built trans-orange dragon-fire flame elements / trans-purple spell-vortex layered plates / trans-cyan magical-portal disc / trans-white blizzard-particles / trans-green unholy-glow). Do NOT let it eclipse the scene + minifig action — it AMPLIFIES the moment.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a FANTASY diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER HIGH-FANTASY STORYTELLING IN LEGO BRICKS ━━━
This is a Bricklink AFOL champion's HIGH-FANTASY diorama, photographed at a LEGO World convention. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset arrangement. NOT a movie still. The build is OBSESSIVELY detailed — every brick is intentional, every minifig is mid-action, every prop tells a story. The fantasy story is the SUBJECT — the LEGO is the medium.

The fantasy archetypes the build celebrates:
  • Armored knights in heraldic-tabard surcoats (red-cross / black-and-falcon / blue-and-lion / red-and-dragon / gold-and-purple / green-and-oak — describe by COLOR + EMBLEM)
  • Dragons (horned reptilian winged beasts on hoards / dragon-riders aloft / dragon-fire raining on villages)
  • Wizards (robed staff-bearing spellcasters / mage-duels with spell-vortexes / wizard-tower libraries)
  • Elves (long-hair archers in green-or-silver attire / elven treetop cities / faerie-courts in pastels)
  • Dwarves (bearded plate-armored smiths / mountain-holds / forge-halls with trans-orange fire)
  • Skeletons & undead (skeleton-warrior columns / necromancer summoners / cursed-tomb risings)
  • Trolls / orcs / monsters (cave-troll uppercut / orc-horde charge / goblin-ambush in pass)
  • Witches & dark magic (witch-hut in poisoned marsh / coven around bonfire / cursed-amulet ritual)
  • Adventurer parties (fighter+rogue+wizard+cleric ensemble at campsite / dungeon-delve / quest-hire tavern)
  • Tournament & ceremony (jousting lists / coronation / royal wedding / knighting / sword-in-stone)

NEVER name specific movies, books, TV shows, video games, or specific LEGO set numbers. NEVER LotR / Hobbit / Tolkien / Smaug / Mordor / Helm's Deep / Rivendell / Witcher / Skyrim / Elder Scrolls / Game of Thrones / Harry Potter / Hogwarts / Warhammer / Frazetta / Vallejo / Brom / specific D&D campaign names. NEVER specific LEGO faction names (Crusaders / Forestmen / Black Knights / Royal Knights / Dragon Knights / Lion Kingdom / Dragon Kingdom / Skeleton King / LEGO Elves) — describe by VISUAL SIGNATURE (knight-color-and-emblem-and-attire) instead. Goal: high-fantasy storytelling that reads as a Bricklink AFOL custom MOC, not a movie still or a Lego.com hero shot.

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand placing a brick. NEVER real human fingers in frame. NEVER real human skin, photoreal faces, or hybrid claymation-faces. Flux's "LEGO photo" training data is HEAVILY contaminated with hand-placing-brick stock shots and Lego.com hero shots with claymation-blend. OVERRIDE THAT BIAS HARD. Every character is a LEGO minifigure with C-shaped hands, printed plastic face, standard minifig torso/legs articulation. Knight / wizard / elf / dwarf / skeleton / faerie / orc minifig variants — described by VISUAL SIGNATURE (heraldic-tabard-color + emblem / robe-color + staff / long-hair-piece + bow / bearded-head + plate-armor / skeleton-torso + tattered-cape) — are LEGO minifigure variants with C-shaped hands, printed plastic faces, helmet molded plastic visors. NEVER a real human face inside. NEVER name specific characters from movies / books / video games.

━━━ EVERYTHING IS BRICK — INCLUDING DRAGON-FIRE, MAGIC, FOLIAGE, STONE, WATER, TERRAIN, SKY ━━━
EVERY element is built from real LEGO bricks. NO photoreal rock, NO photoreal water, NO photoreal sky, NO photoreal foliage. Studs CLEARLY VISIBLE on flat surfaces. Authentic plastic texture. Molded seams. The diorama sits on a tabletop convention display.

⚠️ EXTRA-STRONG LEGO MANDATE FOR OUTDOOR / NATURE-HEAVY SCENES — Flux's "fantasy castle on cliff" + "battlefield landscape" + "ruined castle in jungle" + "forest scene" training priors are HEAVILY Hollywood-photoreal contaminated. OVERRIDE THAT BIAS HARD:
  • Cliffs / mountains = light-bley + dark-bley slope-bricks with visible brick-edges, NEVER photoreal rock-strata
  • Water = trans-blue + trans-light-blue layered plates with white-stud foam crests, NEVER photoreal ocean waves
  • Sky = brick-built sky-baseplate behind with scattered 1×1 white round-plates as cloud-elements, NEVER photoreal cloudscape
  • Grass / ground = green plates or olive-green textured plates for grass, dark-tan plates for dirt — NEVER photoreal grass texture
  • Forest foliage = brick-built tree-trunks (brown round-bricks) + leaf-elements in olive/dark-green/autumn-orange, NEVER photoreal leaves
  • Battlefield terrain = mix of grass-green + dark-tan + light-bley slope-bricks, NEVER photoreal mud or grass
  • Castle stone walls = light-bley + dark-bley slope-bricks with brick-edge cracks, NEVER photoreal masonry
  • Banner cloth = printed flag-element tiles, NEVER photoreal fabric

Build materials cheat-sheet:
  • Castle towers = SNOT-bracket-curved cylindrical sections with crenellated battlement plates
  • Dragon-fire = trans-orange + trans-red + trans-yellow flame elements clustered at draconic muzzle
  • Magical effects = trans-purple + trans-cyan + trans-magenta + trans-clear bar/rod/plate elements stacked in vortex patterns
  • Fire-pit = trans-orange flame cluster on light-bley hearth-stones

━━━ THE SCENE STAGE ━━━
${scene_type}

━━━ THE MINIFIG ACTION — STORY BEAT MANDATE (no posing) ━━━
${minifig_action}

This is a freeze-frame of a STORY HAPPENING — verbs, consequences, reactions. Minifigs mid-charge, mid-lance-impact, mid-spell-cast, mid-rescue, mid-skeleton-rise, mid-coronation-bow, mid-archery-loose. NEVER minifigs standing around in a setting. Render WHAT IS HAPPENING — the cause, the action, the reaction in the same frame.

━━━ THE MOC BUILD TECHNIQUE — AFOL DISTINGUISHER (render the technique visibly) ━━━
${build_technique}

This is the technique that makes the build read as AFOL champion, NOT official-set. Render it visibly: viewers should clock the SNOT-construction / illegal-technique / parts-usage cleverness from across the room. Specify brick types used (slopes / tiles / plates / Technic beams / trans-pieces / minifig accessories repurposed as micro-details).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ THIS IS NON-NEGOTIABLE — the rolled camera angle DRIVES the composition. Apply the exact camera position + orientation described, even if Flux's "LEGO MOC photography" training prior wants to center the minifig front-facing. Override that bias hard.

⚠️ MINIFIG POSE & ORIENTATION VARIETY MANDATE — fight Flux's "minifig facing camera at center frame" default:
  • If camera_framing is OVER-SHOULDER — render the focal minifig from BEHIND, looking past them
  • If WORM'S-EYE / UPSHOT / FROM-BELOW — minifigs viewed from below, foreshortened
  • If OVERHEAD / DOWNSHOT / AERIAL / BATTLEMENT-DOWN — top-down or steep-down, minifigs from above
  • If SIDE-ON / BROADSIDE / PROFILE — figure in side-profile silhouette, NOT front-facing
  • If POV / FIRST-PERSON / DRAGON-POV — over-the-shoulder or hand-in-foreground, NOT a figure facing you
  • If WIDE / VAULT / ESTABLISHING / AERIAL — ensemble of multiple minifigs at varied positions, NOT one centered figure
  • If RECEDING / DEEP-PERSPECTIVE / THROUGH-ARCHWAY — figure(s) at midground or deep, NOT close-up dominant
  • Avoid centered eye-level minifig front-facing framing as the default — that's the Flux-bias trap.

Minifig orientation rotation: vary across side-profile / three-quarter-back / from-behind / multi-figure ensemble / partial-frame crop / silhouette-at-distance. NOT every render is "knight face visible center frame."

━━━ THE SUBJECT-FOCUS (silhouette anchor OR no-mount/structure scene-focus) ━━━
${subject_focus}

⚠️ HARD BIFURCATION — read this carefully:
• If the entry above is a MOUNT (warhorse / dragon-mount / griffin / wolf-rider / unicorn / war-elephant / direwolf) — render the mount + rider as the DOMINANT subject. Render the mount accurately (4-legged warhorse with caparison / brick-built dragon with articulated wings / griffin with fused eagle-front + lion-back / etc.). Rider minifig in saddle/howdah/back-position.
• If the entry above is a STRUCTURE (castle / wizard-tower / dragon-lair / coastal-fortress / dwarven-hold) — render the structure as the DOMINANT subject. Architecture fills 60%+ of frame. Minifig action happens AT the structure (on battlements / at the gate / in the courtyard).
• If the entry above is NO-VEHICLE INTERIOR (throne-room / tavern / dungeon / wizard-library / chapel / treasury) — render the interior as the SETTING. The brick-built environment is the STAGE — but the MINIFIG ACTION is the SUBJECT. Camera framing dictates figure position (NOT default centered-front-facing). Story-beat must be 2-second readable through ensemble action / side-profile / from-behind / partial-figure.
• If the entry above is NO-VEHICLE LANDSCAPE (forest-glade / mountain-pass / cursed-marsh / snowy-realm) — render the landscape as the SETTING with minifig action as the focal beat. Multi-tier depth: foreground figures + midground terrain + deep-distance landmark.

━━━ THE REGISTER (era + faction lock for this render) ━━━
${register}

This is the historical/canon lock. Costume colors, build motifs, weapon types, and props ALL align with this register — never mix anachronistically (no Crusader knight in LEGO Elves elven dress, no Forestmen Robin-Hood-coded green-hood on a Black Knights heavy-armor build).

━━━ DIORAMA STORYTELLING DETAILS — fill the negative space ━━━
${propLines}

These small builds populate the diorama corners. Render them as deliberate brick-built details — never decorative-only. Each prop should imply a backstory.
${phenomenonSection}
━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY (drop the lesser axis when archetype-incompatible) ━━━
• If register names BRIGHT-FAERIE / PASTEL-ELVEN aesthetic — palette becomes bright fantasy pastels + jewel-tones; subject_focus mounts become unicorns / pegasus / dragon-friends; mood whimsical not grim.
• If register names UNDEAD / SKELETON aesthetic — palette becomes red+black+bone-white; subject_focus mounts become skeleton-warhorses; minifigs become skeleton-torso variants; mood grim/macabre.
• If register names DARK-VOLCANIC / SHADOW-REALM aesthetic — palette becomes black+red+ember-orange; subject_focus mounts become wargs/fell-beasts; minifigs become orc/goblin variants.
• If register names SILVER-ELVEN / FOREST-REALM aesthetic — palette leans silver+leaf+pearl; minifigs become long-hair elven variants with bow/curved-sword accessories.
• If register mentions DRAGON-AFFILIATED knights or houses — heraldic dragon-banner motifs; dragon-themed shield prints; mounts may include dragon variants.
• If register names ADVENTURER PARTY archetype — four-figure ensemble of fighter (plate-armor) + rogue (hooded cloak) + wizard (robed staff) + cleric (mace + holy-symbol) with diverse weapons + spell-effect props.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the subject_focus + scene + minifig action + camera framing, weave in the build technique + register + props + lighting + palette + magical phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_FOREST: ({ slots, vibeDirective }) => {
    const {
      scene_type,
      minifig_action,
      build_technique,
      camera_framing,
      subject_focus,
      register,
      scene_props,
      lighting,
      palette,
      woodland_phenomenon,
    } = slots;

    const props = Array.isArray(scene_props) ? scene_props : [scene_props];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = woodland_phenomenon
      ? `
━━━ WOODLAND PHENOMENON (this render's environmental beat) ━━━
${woodland_phenomenon}

Weave this into the diorama as a SECONDARY focal point — render it visibly AND IN BRICK (trans-yellow round-plate firefly-clusters / trans-clear pollen-specks / drifting brick leaf-elements / cotton-element ground-mist / trans-colored arc-rainbow / trans-cyan will-o-wisp orbs). Do NOT let it eclipse the scene + minifig action — it AMPLIFIES the cozy moment.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a PEACEFUL MAGICAL WOODLAND diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER COZY-WOODLAND STORYTELLING IN LEGO BRICKS ━━━
This is a Bricklink AFOL champion's WHIMSICAL FAIRY-FOREST diorama, photographed at a LEGO World convention. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset arrangement. NOT a real-forest macro photo. The mood is COZY, MAGICAL, GENTLE — fairy villages, treehouse hamlets, mushroom cottages, woodland creatures — NOT a grim battle (that's the fantasy path). The build is OBSESSIVELY detailed — every brick is intentional, every minifig is mid-cozy-action, every prop tells a story. The woodland story is the SUBJECT — the LEGO is the medium.

The woodland archetypes the build celebrates:
  • Fairy minifigs (translucent brick wing-elements, flower-crown hair-pieces, lantern accessories) tending hollows + flitting between blooms
  • Woodland-creature minifigs + brick-built creatures (deer / owl / fox / hedgehog / rabbit / squirrel — chunky brick-built or animal-figure form)
  • Treehouse + mushroom-cottage villages (brick-built trunks with door-and-window builds, toadstool-cap roofs)
  • Forest campers + foragers (minifigs at brick-built campfires, mushroom + berry harvest, lantern-lighting)
  • Grotto pools + stream-bridges (trans-blue layered-plate water, brick-arch bridges)

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand placing a brick. NEVER real human fingers in frame. NEVER real human skin, photoreal faces, or hybrid claymation-faces. Flux's "LEGO photo" training data is HEAVILY contaminated with hand-placing-brick stock shots and Lego.com hero shots with claymation-blend. OVERRIDE THAT BIAS HARD. Every character is a LEGO minifigure with C-shaped hands, printed plastic face, standard minifig torso/legs articulation. Fairy / forager / camper / woodland-ranger minifig variants (translucent-wing-element + flower-crown-hair / green-hood + brown-tunic / lantern-and-satchel) are LEGO minifigure variants with C-shaped hands and printed plastic faces. NEVER a real human face. Woodland creatures are brick-built or LEGO animal-figure elements — NEVER photoreal animals.

━━━ EVERYTHING IS BRICK — INCLUDING TREES, FOLIAGE, MUSHROOMS, MOSS, WATER, TERRAIN, SKY ━━━
EVERY element is built from real LEGO bricks. NO photoreal bark, NO photoreal leaves, NO photoreal moss, NO photoreal water, NO photoreal sky, NO photoreal mushrooms, NO photoreal fungus. Studs CLEARLY VISIBLE on flat surfaces. Authentic plastic texture. Molded seams. The diorama sits on a tabletop convention display.

⚠️ EXTRA-STRONG LEGO MANDATE FOR FOREST / NATURE SCENES — Flux's "magical forest" + "fairy woodland" + "autumn forest floor" + "enchanted glade" training priors are the MOST photoreal-contaminated of any subject. This path FAILED before by rendering real birch trunks + real leaf-litter. OVERRIDE THAT BIAS HARD — translate EVERY organic element into a NAMED BRICK PART:
  • Tree trunks = stacked brown round-bricks / cylinder-bricks / 2×2 round-bricks with bark-texture from 1×1 cheese-slopes — NEVER photoreal bark, NEVER birch/aspen bark, NEVER a real tree
  • Foliage / canopy = green + olive-green + autumn-orange plant-elements + leaf-element pieces + plate-stacked clusters — NEVER photoreal leaves, NEVER real foliage
  • Mushrooms = SNOT inverted-dish + dome caps on round-brick stems (red-cap-white-spot from printed/placed round-tiles) — NEVER photoreal fungus
  • Moss = textured green / olive plates + 1×1 round-plate clusters — NEVER photoreal moss texture
  • Water (stream / grotto pool) = trans-blue + trans-light-blue layered plates with white-stud foam — NEVER photoreal water
  • Ground / forest floor = green + dark-tan + olive plates, leaf-element + 1×1 round-plate scatter — NEVER photoreal leaf-litter or dirt
  • Rocks / boulders = light-bley + dark-bley slope-bricks + BURP/LURP rock-pieces — NEVER photoreal stone
  • Sky = brick-built sky-baseplate behind with scattered 1×1 white round-plate clouds — NEVER photoreal sky
  • Fairy-glow / fireflies = trans-cyan + trans-yellow round-plates + trans-clear rods — NEVER photoreal glow-bokeh

⚠️ BANNED VOCABULARY (these tokens pull Flux to real-forest photography — NEVER use, even descriptively): "birch", "aspen", "bark", "leaf litter", "foxfire", "real moss", "canopy" (use "brick-built tree-tops"), "rotting", "photoreal", "dappled" applied to real leaves. ALSO BANNED — organic-MOTION verbs (LEGO is rigid plastic): "bending", "swaying", "in dynamic motion", "rustling", "fluttering leaves", "growing", "blowing". Trees + plants are STATIC brick builds.

━━━ THE SCENE STAGE ━━━
${scene_type}

━━━ THE MINIFIG ACTION — STORY BEAT MANDATE (no posing) ━━━
${minifig_action}

This is a freeze-frame of a COZY STORY HAPPENING — verbs, consequences, reactions. Minifigs mid-lantern-light, mid-mushroom-harvest, mid-stream-crossing, mid-creature-feeding, mid-berry-pick, mid-treehouse-climb. NEVER minifigs standing around in a setting. Render WHAT IS HAPPENING — the cause, the action, the reaction in the same frame.

━━━ THE MOC BUILD TECHNIQUE — AFOL DISTINGUISHER (render the technique visibly) ━━━
${build_technique}

This is the technique that makes the build read as AFOL champion, NOT official-set. Render it visibly: viewers should clock the SNOT-construction / illegal-technique / parts-usage cleverness from across the room. Specify brick types used (slopes / tiles / plates / round-bricks / dishes / plant-elements / Technic pins / trans-pieces / minifig accessories repurposed).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ THIS IS NON-NEGOTIABLE — the rolled camera angle DRIVES the composition. Apply the exact camera position + orientation described, even if Flux's "LEGO MOC photography" training prior wants to center the minifig front-facing. Override that bias hard.

⚠️ MINIFIG POSE & ORIENTATION VARIETY MANDATE — fight Flux's "minifig facing camera at center frame" default:
  • If camera_framing is OVER-SHOULDER — render the focal minifig from BEHIND, looking past them
  • If WORM'S-EYE / UPSHOT / FROM-BELOW / BURROW-DOORWAY-LOW — minifigs viewed from below, foreshortened
  • If OVERHEAD / DOWNSHOT / CANOPY-DOWN / TREEHOUSE-AERIAL — top-down or steep-down, minifigs from above
  • If SIDE-ON / STREAM-BRIDGE-SIDE-ON / PROFILE — figure in side-profile silhouette, NOT front-facing
  • If MACRO / FOREST-FLOOR-MACRO — extreme close detail, figure partial-frame
  • If WIDE / FIREFLY-CLEARING-WIDE / ESTABLISHING — ensemble of multiple minifigs + creatures at varied positions, NOT one centered figure
  • If THROUGH-THE-TRUNKS / RECEDING — figure(s) at midground or deep, framed by foreground brick-trunks
  • Avoid centered eye-level minifig front-facing framing as the default — that's the Flux-bias trap.

━━━ THE SUBJECT-FOCUS (silhouette anchor OR no-mount/structure scene-focus) ━━━
${subject_focus}

⚠️ HARD BIFURCATION — read this carefully:
• If the entry above is a STRUCTURE (mushroom-house / treehouse-village / hobbit-burrow / fairy-tower / stream-bridge / grotto / forest-cabin) — render the brick-built structure as the DOMINANT subject, filling 50%+ of frame. Minifig action happens AT the structure (in the doorway / on the platform / at the bridge-rail).
• If the entry above is a woodland-CREATURE-MOUNT (riding stag / giant owl / saddled fox / giant snail / giant frog / boar) — render the brick-built creature + rider minifig as the DOMINANT subject. Creature is chunky brick-built or LEGO animal-figure, NEVER photoreal.
• If the entry above is NO-VEHICLE INTERIOR (treehouse-room / burrow-home / fairy-workshop / mushroom-cottage-interior) — render the cozy brick interior as the SETTING; the MINIFIG ACTION is the SUBJECT. Camera framing dictates figure position. Pack the interior with brick-built cozy details.
• If the entry above is NO-VEHICLE LANDSCAPE (glade / fern-clearing / streambank / mossy-hollow) — render the brick-built woodland landscape as the SETTING with minifig action as the focal beat. Multi-tier depth: foreground brick-foliage + midground figures/creatures + deep-distance brick-tree-line. LUSH + densely detailed (this is cozy-woodland, never sparse).

━━━ THE REGISTER (woodland heritage lock for this render) ━━━
${register}

This is the aesthetic lock. Minifig costume colors, build motifs, palette, and props ALL align with this register's signature look — never mix anachronistically. The register names a LEGO woodland heritage by its VISUAL SIGNATURE (e.g. Elvendale teal-lavender-gold treetop / Forestmen green-hood woodland-ranger / Fabuland bright-primary anthropomorphic-animal village) — lock the whole frame to that signature.

━━━ DIORAMA STORYTELLING DETAILS — fill the negative space ━━━
${propLines}

These small builds populate the diorama corners as deliberate brick-built details — never decorative-only. Each prop should imply a cozy backstory.
${phenomenonSection}━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY (drop the lesser axis when register-incompatible) ━━━
• If register names ELVENDALE / FAIRY aesthetic — palette becomes teal + lavender + gold + pastel; minifigs become fairy/elf variants with translucent-wing + flower-crown pieces; mood ethereal-whimsical.
• If register names FORESTMEN / WOODLAND-RANGER aesthetic — palette becomes forest-green + brown + tan; minifigs become green-hood ranger variants; builds lean rustic timber + rope-bridge.
• If register names FABULAND aesthetic — palette becomes bright primary; characters become chunky rounded anthropomorphic-animal figures; mood playful-storybook.
• If register names FRIENDS-HEARTLAKE aesthetic — palette becomes pastel + sand + bright accents; builds lean cozy-cabin + flower-garden.
• If register names IDEAS-TREEHOUSE aesthetic — palette becomes natural-wood-brown + leaf-green; builds lean realistic-treehouse-architecture with changeable leaf-elements.
• Whatever palette rolls, the register's signature colors WIN if they conflict.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the subject_focus + scene + minifig action + camera framing, weave in the build technique + register + props + lighting + palette + woodland phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier LEGO MOC diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_SPACE: ({ slots, vibeDirective }) => {
    const {
      scene_type,
      minifig_action,
      build_technique,
      camera_framing,
      vehicle_class,
      register,
      scene_props,
      lighting,
      palette,
      cosmic_phenomenon,
    } = slots;

    const props = Array.isArray(scene_props) ? scene_props : [scene_props];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = cosmic_phenomenon
      ? `
━━━ COSMIC PHENOMENON (this render's environmental beat) ━━━
${cosmic_phenomenon}

Weave this into the diorama as a SECONDARY focal point — render it visibly (brick-built nebula clouds in stacked trans-magenta + trans-cyan plates / trans-clear ice-fragments / cratered-rock asteroid silhouettes / trans-red meteor streak elements). Do NOT let it eclipse the scene + minifig action — it AMPLIFIES the moment.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a SPACE diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER, NOT OFFICIAL SET PHOTO ━━━
This is a Bricklink AFOL champion's space diorama, photographed at a LEGO World convention. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset arrangement. The build is OBSESSIVELY detailed — every brick is intentional, every minifig is mid-action, every prop tells a story. Visual canon: Classic LEGO Space (1978-87 — 6970 Beta-1 Command Base, 6985 Cosmic Fleet Voyager) + Blacktron I+II (6986 Mission Commander, 6981 Aerial Intruder) + M-Tron (6989 Mega Core Magnetizer) + Space Police + Ice Planet + Galaxy Squad + Insectoids + Mars Mission + Bricklink AFOL space community. Hard-SF + retro-future canon: Mass Effect Normandy, Expanse Rocinante, 2001 ASO Discovery, Interstellar Endurance, Foundation, Tintin Destination Moon, Star Citizen. NEVER LEGO Star Wars (no X-wings / TIEs / Falcon / Star Destroyer / stormtroopers / Mandalorian / Imperial / Jedi / Rebels).

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand placing a brick. NEVER real human fingers in frame. NEVER real human skin, photoreal faces, or hybrid claymation-faces. Flux's "LEGO photo" training data is HEAVILY contaminated with hand-placing-brick stock shots and Lego.com hero shots with claymation-blend. OVERRIDE THAT BIAS HARD. Every character in the frame is a LEGO minifigure with C-shaped hands, printed plastic face, standard minifig torso/legs articulation. Spacesuit-helmet minifig variants (Classic Space yellow / Blacktron black / M-Tron red / Space Police white-blue / Ice Planet white-orange / Mars Mission white-orange / Mass Effect hardsuit / Apollo retro-white) are LEGO minifigure variants — visor down, helmet molded plastic, never a real human face inside.

━━━ EVERYTHING IS BRICK — INCLUDING STARS, NEBULAE, ENGINE FLARE, ALIEN FLORA ━━━
Every element is built from real LEGO bricks. Studs CLEARLY VISIBLE on flat surfaces. Authentic plastic texture. Molded seams. Starfields = scattered 1×1 white round-plates on a dark-bley baseplate. Nebulae = layered trans-magenta + trans-cyan + trans-purple plates with cotton-batting white round-plate haze. Engine flare = trans-orange + trans-yellow flame elements + trans-clear thruster cone. Planet surfaces = dark-bley / dark-red / tan slope-bricks. Alien flora = trans-green + trans-purple modified-plant pieces. Lunar terrain = light-bley slope bricks with crater-tile insets. Asteroid fields = scattered dark-bley round-bricks.

━━━ THE SCENE STAGE ━━━
${scene_type}

━━━ THE MINIFIG ACTION — STORY BEAT MANDATE (no posing) ━━━
${minifig_action}

This is a freeze-frame of a STORY HAPPENING — verbs, consequences, reactions. Minifigs mid-tether-pull, mid-airlock-cycle, mid-blast-deflect, mid-discovery, mid-system-failure. NEVER minifigs standing around in a setting. Render WHAT IS HAPPENING — the cause, the action, the reaction in the same frame.

━━━ THE MOC BUILD TECHNIQUE — AFOL DISTINGUISHER (render the technique visibly) ━━━
${build_technique}

This is the technique that makes the build read as AFOL champion, NOT official-set. Render it visibly: viewers should clock the SNOT-construction / illegal-technique / parts-usage cleverness from across the room. Specify brick types used (slopes / tiles / plates / Technic beams / trans-pieces / minifig accessories repurposed as micro-details).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ THIS IS NON-NEGOTIABLE — the rolled camera angle DRIVES the composition. Apply the exact camera position + orientation described, even if Flux's "LEGO MOC photography" training prior wants to center the minifig front-facing. Override that bias hard.

⚠️ MINIFIG POSE & ORIENTATION VARIETY MANDATE — fight Flux's "minifig facing camera at center frame" default:
  • If the camera_framing is OVER-SHOULDER — render the focal minifig from BEHIND, looking past them
  • If the camera_framing is WORM'S-EYE / UPSHOT — minifigs viewed from below, foreshortened
  • If the camera_framing is OVERHEAD / DOWNSHOT / CRANE-RAIL — top-down or steep-down angle, minifigs from above
  • If the camera_framing is SIDE-ON / BROADSIDE / PROFILE — figure in side-profile silhouette, NOT front-facing
  • If the camera_framing is POV / FIRST-PERSON — over-the-shoulder or hand-in-foreground, NOT a figure facing you
  • If the camera_framing is WIDE / VAULT / ESTABLISHING — ensemble of multiple minifigs at varied positions, NOT one centered figure
  • If the camera_framing is RECEDING / DEEP-PERSPECTIVE — figure(s) at midground or deep, NOT close-up dominant
  • Avoid centered eye-level minifig front-facing framing as the default — that's the Flux-bias trap.

Minifig orientation rotation: vary across side-profile / three-quarter-back / from-behind / multi-figure ensemble / partial-frame crop / silhouette-at-distance. NOT every render is "minifig face visible center frame."

━━━ THE SUBJECT-CLASS (silhouette anchor OR no-vehicle scene-focus) ━━━
${vehicle_class}

⚠️ HARD BIFURCATION — read this carefully:
• If the entry above STARTS WITH "no-vehicle (...)" — render the bracketed subject (interior / landscape / space-city) as the SETTING. ZERO ships anywhere in frame. NO ship-silhouette visible. NO ship visible through windows or in deep distance. The brick-built environment is the STAGE — but the MINIFIG ACTION (the axis below) is the SUBJECT. The CAMERA FRAMING axis dictates where + how the figures sit in the composition (NOT default centered-front-facing). The story-beat must be readable in 2 seconds, but it can read through ensemble action, side-profile silhouette, from-behind POV, or partial-figure foreground — varied per camera roll.
• If the entry above names a specific SHIP / VEHICLE class — render its hull-profile, thruster-array, and proportions ACCURATELY for the class. Ship is the dominant subject.

Never mix: a "no-vehicle (bridge interior)" entry is a BRIDGE INTERIOR — not "a fighter parked outside the bridge window." A "no-vehicle (Coruscant-coded planet-city)" entry is the CITY — not "a ship over the city."

⚠️ NO-VEHICLE STORY-READABILITY MANDATE — when no-vehicle rolls, the render MUST tell a 2-second story:
  • The CAMERA FRAMING axis below DRIVES composition — apply that angle precisely, NOT a default "minifig facing camera at center"
  • A focal subject must be readable, but its POSITION + ORIENTATION come from the rolled camera angle
  • Avoid "scattered minifigs everywhere with no focal point" — that produces hard-to-read renders
  • Avoid "establishing vista with no action" — the minifig_action axis is the SUBJECT, not optional decoration
  • Multiple supporting minifigs contribute to the beat where the action implies a team / crowd

━━━ THE REGISTER (era + faction lock for this render) ━━━
${register}

This is the historical/canon lock. Spacesuit colors, build motifs, weapon types, and props ALL align with this register — never mix anachronistically (no Classic-LEGO-Space yellow on a Mass Effect Normandy, no Apollo-era retro-rocket aesthetics on a cyberpunk-space build).

━━━ DIORAMA STORYTELLING DETAILS — fill the negative space ━━━
${propLines}

These small builds populate the diorama corners. Render them as deliberate brick-built details — never decorative-only. Each prop should imply a backstory.
${phenomenonSection}
━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY (drop the lesser axis when physically impossible) ━━━
• If register names "Classic LEGO Space" / "Blacktron" / "M-Tron" / "Space Police" / "Ice Planet" / "Galaxy Squad" — palette must align with that register's signature colors regardless of palette roll. Override palette to match if conflict.
• If register names "Mass Effect" / "Expanse" / "Star Citizen" — vehicle has weathered hard-SF realism, EVA suits are realistic-tactical, palette leans gunmetal + chrome + warning-stripe.
• If register names "Tintin retro" / "2001 ASO" / "Foundation" — palette becomes muted-1960s-NASA (white + blue + chrome), vehicles have retro-spacecraft silhouettes (Soyuz / Apollo / Discovery One).
• If vehicle_class is "no-vehicle (interior scene)" — render the INTERIOR or surface as the dominant subject; do not invent a vehicle.
• If cosmic_phenomenon is "supernova flash" AND lighting is "cool nebula-tint deep-blue" — escalate lighting to "white-hot blast cast across the lit side, deep-violet cool shadow opposite" to honor the supernova.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the vehicle-class + scene + minifig action + camera framing, weave in the build technique + register + props + lighting + palette + cosmic phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_PIRATES: ({ slots, vibeDirective }) => {
    const {
      scene_type,
      minifig_action,
      build_technique,
      camera_framing,
      ship_class,
      register,
      scene_props,
      lighting,
      palette,
      weather_drama,
    } = slots;

    const props = Array.isArray(scene_props) ? scene_props : [scene_props];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const weatherSection = weather_drama
      ? `
━━━ WEATHER DRAMA (this render's environmental beat) ━━━
${weather_drama}

Weave this into the diorama as a SECONDARY focal point — render it visibly (brick-built storm clouds + transparent-blue rain rods / cotton-batting fog layers / trans-clear ice slicks / brick-built tentacles in trans-green emerging from waves). Do NOT let it eclipse the scene + minifig action — it AMPLIFIES the moment.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a PIRATES diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER, NOT OFFICIAL SET PHOTO ━━━
This is a Bricklink AFOL champion's pirate diorama, photographed at a LEGO World convention. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset arrangement. The build is OBSESSIVELY detailed — every brick is intentional, every minifig is mid-action, every prop tells a story. Visual canon: Pirates of the Caribbean LEGO sets (6271 Imperial Flagship / 6285 Black Seas Barracuda / 70413 Brick Bounty) + the high-tier Bricklink AFOL pirate community + vintage LEGO Pirates (6285 Black Seas Barracuda / 6286 Skull's Eye Schooner / 6243 Brickbeard's Bounty).

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand placing a brick. NEVER real human fingers in frame. NEVER real human skin, photoreal faces, or hybrid claymation-faces. Flux's "LEGO photo" training data is HEAVILY contaminated with hand-placing-brick stock shots and Lego.com hero shots with claymation-blend. OVERRIDE THAT BIAS HARD. Every character in the frame is a LEGO minifigure with C-shaped hands, printed plastic face, yellow / dark-tan / bricklink-flesh head, and standard minifig torso/legs articulation. No painted skin. No melted plastic. No smooth-sculpt faces.

━━━ EVERYTHING IS BRICK — INCLUDING WATER, FIRE, SAILS, ROCKS, SKY ELEMENTS ━━━
Every element is built from real LEGO bricks. Studs CLEARLY VISIBLE on flat surfaces. Authentic plastic texture. Molded seams. Water = transparent-blue + trans-light-blue plates layered with white-stud foam crests. Fire = trans-orange + trans-red + trans-yellow flame elements. Sails = printed/curved white + tan cloth-or-brick-built panels with rigging from black antennas. Rocks = light-bley + dark-bley slope bricks. Sky elements (clouds / smoke / rain / lightning) = white plates + trans-clear bricks + lightsaber-blade lightning bolts.

━━━ THE SCENE STAGE ━━━
${scene_type}

━━━ THE MINIFIG ACTION — STORY BEAT MANDATE (no posing) ━━━
${minifig_action}

This is a freeze-frame of a STORY HAPPENING — verbs, consequences, reactions. Minifigs mid-leap, mid-swing, mid-shout, mid-discovery. NEVER minifigs standing around in a setting. Render WHAT IS HAPPENING — the cause, the action, the reaction in the same frame.

━━━ THE MOC BUILD TECHNIQUE — AFOL DISTINGUISHER (render the technique visibly) ━━━
${build_technique}

This is the technique that makes the build read as AFOL champion, NOT official-set. Render it visibly: viewers should clock the SNOT-construction / illegal-technique / parts-usage cleverness from across the room. Specify brick types used (slopes / tiles / plates / Technic beams / transparent pieces / minifig accessories repurposed as micro-details).

━━━ THE CAMERA FRAMING ━━━
${camera_framing}

Apply this framing precisely — it's the variety knob. Don't default to centered eye-level minifig framing.

━━━ THE SHIP / VEHICLE CLASS (silhouette anchor) ━━━
${ship_class}

The ship/vessel silhouette is part of the diorama identity — render its rigging, hull-curvature, and proportions ACCURATELY for the class.

━━━ THE REGISTER (era + faction lock for this render) ━━━
${register}

This is the historical/genre lock. Crew attire, build motifs, weapons, and props ALL align with this register — never mix anachronistically (no Caribbean tricorn hats on a Norse longship, no plasma-cutlass on a 17th-century galleon).

━━━ DIORAMA STORYTELLING DETAILS — fill the negative space ━━━
${propLines}

These small builds populate the diorama corners. Render them as deliberate brick-built details — never decorative-only. Each prop should imply a backstory.
${weatherSection}
━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY (drop the lesser axis when physically impossible) ━━━
• If register names "space-pirate" / "Treasure-Planet" — replace any sea/water/wave language with nebula / asteroid-drift / void; weather_drama (if storm/fog/calm-sea) becomes solar-flare / ion-storm / asteroid-debris.
• If register names "Norse-raid" — ship_class becomes longship-variant regardless (Norse don't sail galleons); attire becomes Viking, not tricorn.
• If register names "Asian-junk" — ship_class becomes Chinese-junk or Vietnamese-thuyền; props swap to lanterns + bamboo + jade.
• If weather_drama names "dense-fog" AND lighting names "harsh-midday-sun-raking" — soften lighting to "diffuse fog-bounced grey-blue" or drop the fog.
• If register names "cursed-ghost-crew" — minifigs become skeleton-torso variants with tattered-cape elements; ship is half-translucent (trans-clear brick highlights).

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the ship-class + scene + minifig action + camera framing, weave in the build technique + register + props + lighting + palette + weather (if fired). End with one phrase reinforcing AFOL convention-tier diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },
};
