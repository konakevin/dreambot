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
