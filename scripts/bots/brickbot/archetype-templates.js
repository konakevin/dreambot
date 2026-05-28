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
  BRICKBOT_LEGO_MASTERS: ({ slots, vibeDirective }) => {
    const {
      narrative_concept,
      dramatic_beat,
      build_technique,
      camera_framing,
      centerpiece_subject,
      story_figures,
      lighting,
      palette,
      dramatic_effect,
    } = slots;

    const effectSection = dramatic_effect
      ? `
━━━ DRAMATIC EFFECT (the climax amplifier) ━━━
${dramatic_effect}

Render this integrated INTO the build IN BRICK (trans-bolt lightning / trans-flame fire + cotton-smoke / trans-blue water-surge + white-foam / explosion-debris on rods / trans-purple magic-vortex / trans-orange lava). It supercharges the dramatic beat.

`
      : '';

    return `You are a LEGO MOC photographer + LEGO Masters finale judge writing a DRAMATIC SHOWCASE STORY-BUILD description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — LEGO MASTERS FINALE WINNER ━━━
This is a single dramatic NARRATIVE hero build of the kind that WINS a LEGO Masters TV finale — a jaw-dropping story-build frozen at its climactic moment, presented with theatrical finale-reveal lighting on a turntable. The judges gasp. NOT a stock photo from Lego.com. NOT a kid's playset. NOT a photoreal CGI render. ONE showcase build, high drama, masterful technique, a story told in brick at its peak moment.

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand, fingers, skin, photoreal faces, or claymation-blend. Every character is a LEGO minifigure mid-action telling the story. NEVER a real human face.

━━━ EVERYTHING IS BRICK — THE WHOLE DRAMATIC BUILD IS LEGO ━━━
EVERY element is built from real LEGO bricks — including the dramatic effects. NO photoreal anything. Studs CLEARLY VISIBLE. Authentic plastic texture, molded seams. It's a competition showcase build on a turntable display-base.
  • Structures / terrain / creatures = brick + slope + Technic + trans-element (per concept) — NEVER photoreal
  • Fire / water / lightning / smoke / magic = trans-flame / trans-blue+foam / trans-bolt / cotton / trans-vortex elements — NEVER photoreal effects
  • Cross-sections = honestly cut-open brick interiors with visible floors/levels
  • Sky / backdrop = brick or studio-black for the theatrical reveal — NEVER photoreal sky

━━━ BANNED VOCABULARY: "photoreal", "CGI", "real [material]", "lifelike", "rendered". A masterful BRICK build, theatrically lit — never a CGI movie still.

━━━ THE NARRATIVE CONCEPT — the story-build premise ━━━
${narrative_concept}

This is the dramatic story the build tells. Build it as a single ambitious showcase centerpiece that reads the whole narrative at a glance.

━━━ THE DRAMATIC BEAT — the exact climactic instant frozen ━━━
${dramatic_beat}

Freeze the build at THIS precise peak moment — the instant of maximum tension/drama. Everything in the composition serves this beat.

━━━ THE MOC BUILD TECHNIQUE — FINALE-WINNING DISTINGUISHER (render visibly) ━━━
${build_technique}

The masterful technique that wins the finale — render it visibly (cross-section cutaway / dynamic-motion-frozen / trans-effect-integration / gravity-defying armature / vertical storytelling / forced-perspective). The judges should clock the skill instantly.

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — finale-reveal framing. Apply the exact angle.
  • TURNTABLE HERO THREE-QUARTER — the classic showcase reveal angle, the build proud on its turntable
  • DRAMATIC LOW LOOKING-UP — low angle making the build tower theatrically
  • CROSS-SECTION STRAIGHT-ON / DOWN-INTO-THE-CUTAWAY — square to the cut face showing all the interior story-levels
  • SPOTLIT ISOLATED-ON-BLACK — the build floating in theatrical darkness, spotlit
  • SLOW-ORBIT / DUTCH-ANGLE — dynamic reveal energy

━━━ THE CENTERPIECE SUBJECT — the dramatic focal element ━━━
${centerpiece_subject}

The build is built AROUND this brick focal element — the dragon / kraken / volcano / collapsing-tower / emerging-genie. It commands the composition.

━━━ THE STORY FIGURES — minifigs telling the story at the climax ━━━
${story_figures}

Place these minifigs mid-action so the human stakes of the dramatic beat read instantly — fleeing, battling, in peril, rescuing. They make the drama land.

${effectSection}━━━ LIGHTING — THE FINALE-REVEAL SIGNATURE ━━━
${lighting}

This theatrical lighting IS a core part of the path's identity — render it boldly (spotlight + atmospheric haze + base-glow / dramatic single-key + deep shadow / underlit base / storm-lightning / fire-glow + smoke). It sells the finale-reveal drama.

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY ━━━
• ALL elements + effects are brick — never let the drama pull an effect photoreal; fire is trans-flame, water is trans-blue plate, lightning is a trans-bolt element.
• The theatrical finale-reveal lighting + turntable/spotlit presentation are ALWAYS present — that's the path identity (vs the documentary lighting of the themed paths).
• This path may re-use motifs from other paths (dragons, krakens, volcanoes) — the identity is the THEATRICAL FINALE PRESENTATION, not the theme.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the narrative concept + dramatic beat + centerpiece subject + camera framing, weave in the build technique + story figures + finale-reveal lighting + palette + dramatic effect (if fired). End with one phrase reinforcing a LEGO-Masters-finale-winning theatrically-lit showcase brick build. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_GIRLY: ({ slots, vibeDirective }) => {
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
      girly_phenomenon,
    } = slots;

    const props = Array.isArray(scene_props) ? scene_props : [scene_props];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = girly_phenomenon
      ? `
━━━ SPARKLE PHENOMENON (this render's sweet beat) ━━━
${girly_phenomenon}

Weave this in as a SECONDARY focal point, rendered IN BRICK (trans-clear sparkle round-plates on rods / a trans-arc rainbow / 1×1 round-plate heart-confetti / trans-pink fairy-dust trail). It AMPLIFIES the whimsy — never eclipses the subject + minifig action.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a PASTEL / ULTRA-CUTE / WHIMSICAL diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER SWEET-AND-SPARKLY IN LEGO BRICKS ━━━
This is a Bricklink AFOL champion's pastel-whimsy diorama, photographed at a LEGO World convention — a candy-bright, obsessively-cute brick build. Could win a Best-of-Show in the whimsy/Friends category. NOT a stock photo from Lego.com. NOT a kid's playset arrangement. NOT a photoreal CGI pink scene. The mood is JOYFUL, SWEET, SPARKLY, ultra-cute. Visual canon: LEGO Friends (Heartlake mini-doll cast) + LEGO DOTS (heart/star craft-tiles) + LEGO Elves (Elvendale fairy-pastel) + DUPLO Princess + generic LEGO fairytale-castle. Mini-doll-style figures welcome alongside minifigs. NEVER licensed Disney princesses/characters — generic fairytale only.

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand, fingers, skin, photoreal faces, or claymation-blend. Every character is a LEGO minifigure or a LEGO Friends mini-doll (C-shaped/curved hands + printed plastic face). NEVER a real human face. NEVER a licensed named character.

━━━ EVERYTHING IS BRICK — SWEET BUT STILL ALL LEGO ━━━
EVERY element is built from real LEGO bricks. NO photoreal frosting, NO photoreal fabric, NO photoreal fur, NO photoreal flowers, NO photoreal sky. Studs CLEARLY VISIBLE. Authentic plastic texture, molded seams. The diorama sits on a tabletop convention display.
  • Castle / boutique / structures = pastel brick + SNOT-curved turrets + scalloped slope-edges — NEVER photoreal
  • Sweets / cupcakes = brick dome + cone + round-tile builds — NEVER photoreal frosting
  • Flowers / petals = plant-element + round-plate blooms — NEVER photoreal flowers
  • Unicorn / pony / mermaid = brick-built or LEGO animal-element with a brick-horn / brick-tail — NEVER photoreal fur or a real animal
  • Sparkle / fairy-dust = trans-clear + trans-pink round-plates — NEVER photoreal glitter
  • Sky = brick sky-baseplate (often pastel) — NEVER photoreal sky

━━━ BANNED VOCABULARY: "photoreal", "real fabric/fur/frosting/flowers", "glittery-real", "lifelike". Sweet + pastel, but unmistakably LEGO brick.

━━━ THE SCENE STAGE ━━━
${scene_type}

━━━ THE MINIFIG / MINI-DOLL ACTION — STORY BEAT MANDATE (no posing) ━━━
${minifig_action}

A freeze-frame of a SWEET STORY HAPPENING — mid-twirl-dance, mid-cupcake-frost, mid-unicorn-feed, mid-ribbon-dance. Show cause + reaction. NEVER figures standing in a row — show the JOY of the moment.

━━━ THE MOC BUILD TECHNIQUE — AFOL DISTINGUISHER (render visibly) ━━━
${build_technique}

Makes the build read as AFOL champion + unmistakably all-brick. Render it visibly — name the brick parts (heart/flower/star printed-tiles / SNOT-curved turret / trans-pink sparkle-accents / scallop slope-frills / cupcake-dome / bow-element / DOTS-mosaic).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — the rolled framing DRIVES the composition. Apply the exact angle, even if Flux wants a centered front-facing figure. Override hard.
  • CASTLE-TOWER-UP / SPARKLE-TOWER — vertical, the sweet structure towering
  • BOUTIQUE-WINDOW-DISPLAY / PARLOR-COUNTER-OVER — framed through a display or over a counter
  • GARDEN-ARCHWAY-THROUGH / DOLLHOUSE-CUTAWAY — framed by an arch / cutaway showing furnished rooms
  • RUNWAY-DOWN-THE-AISLE / SPIRAL-STAIRCASE-DOWN — receding perspective with figures along it
  • Avoid centered eye-level front-facing as default — that's the Flux-bias trap.

━━━ THE SUBJECT-FOCUS (silhouette anchor OR no-vehicle scene-focus) ━━━
${subject_focus}

⚠️ HARD BIFURCATION:
• STRUCTURE (candy-castle / boutique / parlor / sparkle-tower / dollhouse / gazebo) — render the pastel brick structure as DOMINANT, 50%+ of frame; figure action AT it.
• MOUNT/CREATURE (unicorn / winged-pony / mermaid / fluffy-cat / butterfly-steed / swan) — render the brick-built creature as DOMINANT; horn/wings/tail are brick elements, fur is brick, NEVER photoreal.
• NO-VEHICLE INTERIOR (boutique / parlor / pastel-bedroom / dance-studio / spa / tea-room) — the cute brick interior is the SETTING, the figure action the SUBJECT; pack it with sweet brick detail.
• NO-VEHICLE LANDSCAPE (heart-garden / rainbow-meadow / candy-land / blossom-field / cloud-kingdom) — the pastel brick landscape is the SETTING with figure action as the focal beat; LUSH + densely cute, never sparse.

━━━ THE REGISTER (girly heritage lock) ━━━
${register}

The aesthetic lock — figure style, build motifs, palette, props align with this heritage (Friends-Heartlake mini-doll pastel / DOTS heart-star-mosaic / Elves-Elvendale fairy / generic-fairytale gold-rose). Never mix anachronistically. NEVER a licensed Disney character.

━━━ DIORAMA STORYTELLING DETAILS — fill the negative space ━━━
${propLines}

These brick-built details sweeten the scene — never decorative-only. Each implies a cute little story.
${phenomenonSection}━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY ━━━
• If register is FRIENDS-HEARTLAKE — mini-doll cast, pastel pink+lavender+mint, modern-cute boutiques + cafes + flower-shops.
• If register is ELVES-ELVENDALE — fairy/elf mini-dolls with translucent-wing pieces, teal+lavender+gold, ornate treetop/crystal builds.
• If register is DOTS-CRAFT — heavy heart/star/flower DOTS-tile mosaic detailing on every surface, bright craft-multi palette.
• If register is GENERIC-FAIRYTALE-CASTLE — gold+rose+white, a princess-castle + a generic crown (no named character).
• Unicorns/ponies/mermaids are ALWAYS brick-built (brick horn/tail/wings), never photoreal animals.
• Whatever palette rolls, the register's signature WINS if they conflict.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the subject_focus + scene + minifig/mini-doll action + camera framing, weave in the build technique + register + props + lighting + palette + sparkle phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier LEGO MOC pastel-whimsy diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  // BRICKBOT_CRAZY_ISLANDS — the fun/crazy tropical-island SCENE path (2026-05-27).
  // Forked from favorite-towns (→ macro-display's hearted deep-focus state). A wide
  // variety of fun/funny/surreal/crazy island happenings (giant creatures are just
  // ONE idea) + ~35% serene tropical views. READABILITY-FIRST: ONE clear hero idea
  // per scene, clean composition. Keeps the deep-focus diorama look + 100%-LEGO rule.
  BRICKBOT_CRAZY_ISLANDS: ({ slots, vibeDirective }) => {
    const { island_scene, camera_framing, time_of_day, life_density, shoreline_edge, palette } = slots;

    return `You are a LEGO MOC photographer + AFOL convention judge + a playful island storyteller, writing ONE fun, crazy tropical-ISLAND scene for BrickBot's most playful path. Output is a 110-160 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — A FUN / CRAZY TROPICAL-ISLAND SCENE, BUILT IN LEGO ━━━
This is BrickBot's most PLAYFUL path — a Bricklink AFOL champion's tropical-ISLAND diorama with a fun, funny, surreal, or downright CRAZY thing going on (and sometimes just a gorgeous serene island view). The energy: a wild island HAPPENING that makes you grin — volcano hijinks, castaway contraptions, pirate & kraken mishaps, monkey heists, runaway sandcastles, seaplane splashdowns, luau chaos, surf spectacle, tiki magic, a giant brick creature (ONE idea among many) — OR a breathtaking calm lagoon/dock view. It is a LEGO brick model on a tabletop, full of charm. NOT a stock catalog shot, NOT a kid's playset.

━━━ #1 RULE — IT IS 100% LEGO BRICK. THIS OVERRIDES EVERYTHING ELSE ━━━
This MUST read INSTANTLY as a LEGO build — a model made of plastic LEGO bricks, every surface clearly assembled from pieces. EVERY element (the island AND the hero idea) is built from LEGO bricks, plates, slopes, and tiles with STUDS CLEARLY VISIBLE, glossy injection-molded plastic, brick seams everywhere. If ANYTHING looks smooth, organic, or computer-rendered, the image has FAILED. When in doubt, make it MORE obviously plastic-brick — blockier, more stud-covered.
The hard cases — these MUST be brick too, never photoreal:
  • Giant creatures / animals / sea-monsters = blocky LEGO BRICK SCULPTURES, stepped + studded + clearly assembled — NEVER smooth organic CGI creatures
  • Water / sea / lagoon / waves / splashes = trans-blue + trans-cyan round-plates + tiles in stepped brick layers — NEVER photoreal water
  • Volcano lava / fire = stacked trans-orange + trans-red + trans-yellow LEGO flame pieces — NEVER photoreal fire
  • Smoke / steam / ash / clouds = grey + white bricks, round plates, or cotton-ball puffs — NEVER photoreal vapor
  • Palms / foliage / sand = LEGO plant-elements + tan plates + slopes — NEVER photoreal foliage
  • Crowds = many tiny LEGO minifigures, studded torsos + cylinder heads — NEVER photoreal people, NEVER real hands or faces
  • Sky = brick sky-baseplate or plain studio backdrop

━━━ THE ISLAND SCENE — the hero idea (the heart of this path) ━━━
${island_scene}

⚠️ ONE CLEAR READABLE HERO IDEA. Stage this scene's single fun/crazy idea (or serene view) as the obvious focal point — the eye lands on it instantly. Keep the composition CLEAN and READABLE: a clear hero in a legible tropical-island setting, NOT a cluttered, busy mess of competing elements. Commit HARD to the tone — if it's funny make it genuinely funny, if crazy make it gleefully crazy, if surreal make it strange, if serene make it breathtaking. Render every specific element the scene names in brick, in its tropical-island setting (sea, palms, sand, lagoon, reef, volcanic peaks, dock).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ A WIDE island framing in DEEP FOCUS — the whole scene tack-sharp, the hero idea clearly readable. Apply the exact angle. Show the island scene, NOT an extreme close-up portrait, and NOT pulled so far back the brick detail dissolves — the hero idea fills a comfortable, readable portion of the frame.

━━━ TIME OF DAY + SKY (secret sauce — render in brick) ━━━
${time_of_day}

Light the whole island to match — but keep DEEP FOCUS, the whole scene tack-sharp.

━━━ LIFE DENSITY — how the island is populated (secret sauce) ━━━
${life_density}

Populate with this level of minifig + brick-critter life, reacting to the hero idea, so it reads as a living island.

━━━ THE SHORELINE EDGE — the tabletop-island-diorama signal ━━━
${shoreline_edge}

Render this display-base / water edge at the island's margin — the charming "finished LEGO island on a table" signal.

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY ━━━
• ALL elements (island, sea, creatures, sky, crowds) are LEGO brick — never let a zone go photoreal.
• ONE readable hero idea; clean composition; the framing serves it.
• DEEP FOCUS always — the whole scene tack-sharp; NEVER tilt-shift or miniature-blur (a crisp convention-display photograph).
• Commit to the scene's TONE — mostly fun/crazy/funny, sometimes gorgeously serene. This is BrickBot's playful island path.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 110-160 words. Single paragraph. Comma-separated phrase string. LEAD with the island scene's single hero idea + its tropical-island setting + the camera framing, THEN weave in the time-of-day/sky + life-density + shoreline-edge + palette. End with one phrase reinforcing a complete brick tropical-island diorama, ONE clear readable hero, DEEP-FOCUS edge-to-edge sharp (NOT tilt-shift). NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_MACRO_DISPLAY: ({ slots, vibeDirective }) => {
    const {
      diorama_theme,
      build_scope,
      signature_centerpiece,
      camera_framing,
      life_density,
      baseplate_edge,
      lighting,
      palette,
      surprise_easter_egg,
    } = slots;

    const eggSection = surprise_easter_egg
      ? `
━━━ HIDDEN EASTER-EGG (the second-look delight) ━━━
${surprise_easter_egg}

Tuck this in as a SMALL hidden detail the eye finds on a second look — never let it dominate the wide complete-diorama composition.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a COMPLETE-DIORAMA "behold the whole build" description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION BEST-OF-SHOW COMPLETE DIORAMA ━━━
This is a Bricklink AFOL champion's COMPLETE display diorama, photographed at a LEGO World convention — the whole build in frame as a finished miniature world that wins Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset. NOT a real-world photo. The defining trait: WIDE, PULLED-BACK, the ENTIRE build visible as a complete tabletop masterpiece, obsessively detailed corner to corner.

━━━ THIS IS THE WHOLE-BUILD VIEW — completeness is the point ━━━
Frame the ENTIRE diorama in one shot — foreground to background, edge to edge. The viewer should read it as a complete WORLD on a tabletop, not a close-up of one subject. ⚠️ DEEP FOCUS — the WHOLE build is tack-sharp edge-to-edge, front-to-back; NOT tilt-shift, NOT a shallow miniature-blur (Kevin's call for this path). Every zone crisp + detailed; no empty baseplate, no blurred foreground/background.

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand, fingers, skin, photoreal faces, or claymation-blend. Every figure is a tiny LEGO minifigure populating the build. NEVER a real human face.

━━━ EVERYTHING IS BRICK — THE WHOLE WORLD IS LEGO ━━━
EVERY element across the whole diorama is built from real LEGO bricks. NO photoreal anything. Studs CLEARLY VISIBLE. Authentic plastic texture, molded seams. It sits on a tabletop convention display — and that's a FEATURE, not a flaw.
  • Terrain / rock / water / snow / foliage = brick + slope + trans-plate + plant-element (per theme) — NEVER photoreal
  • Buildings / structures = brick-built with visible studs + technique — NEVER photoreal
  • Crowds / vehicles = many tiny minifigs + brick vehicles — NEVER photoreal
  • Sky = brick sky-baseplate or studio backdrop — NEVER photoreal

━━━ BANNED VOCABULARY: "photoreal", "real [material]", "lifelike", "realistic miniature" (it's a LEGO build, say "brick-built"). ALSO BANNED for this path: "tilt-shift", "miniature blur", "shallow depth of field", "bokeh", "selective focus" — render DEEP-FOCUS, the whole build sharp.

━━━ THE DIORAMA THEME — the complete world depicted ━━━
${diorama_theme}

This is what the whole build depicts. Render it as a COMPLETE, fully-realized brick world filling the frame.

━━━ THE BUILD SCOPE — the scale + complexity signature ━━━
${build_scope}

This is how the build is organized + how ambitious it reads. Make the scope legible (the modular zones / the vertical tiers / the cutaway / the micro-scale density).

━━━ THE SIGNATURE CENTERPIECE — the focal wow that anchors the eye ━━━
${signature_centerpiece}

A dramatic focal feature that the whole composition builds around — the thing that makes a convention-goer stop walking. Place it as the visual anchor; the rest of the world radiates from it.

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — this is a WIDE complete-build framing. Apply the exact angle. Always show the whole diorama; NEVER zoom into a single subject.
  • HIGH-THREE-QUARTER AERIAL — looking down + across the whole build, all zones visible
  • EYE-LEVEL ALONG THE BASEPLATE-EDGE — low, raking across the build, depth front-to-back
  • CORNER-ESTABLISHING — from a corner showing two baseplate edges + the build's full extent
  • TOP-DOWN PLAN — straight down, the build read as a complete map
  • HERO THREE-QUARTER WITH EDGE-BASEPLATE VISIBLE — the classic convention-display hero angle

━━━ THE LIFE DENSITY — how the world is populated ━━━
${life_density}

Fill the world with this level of minifig + vehicle + creature life so it reads as a LIVING complete diorama, not an empty model.

━━━ THE BASEPLATE EDGE — the "tabletop build" signal ━━━
${baseplate_edge}

Render the display-base treatment at the build's edge — this is what tells the viewer it's a finished LEGO diorama on a table (a deliberate, charming feature of this path).

${eggSection}━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY ━━━
• Whatever the diorama_theme, ALL its elements (terrain, water, buildings, crowds) are brick — never let a theme pull a zone photoreal.
• The framing ALWAYS shows the complete build; the signature_centerpiece anchors but never crops out the rest of the world.
• DEEP FOCUS always — the whole build tack-sharp edge-to-edge; NEVER tilt-shift or miniature-blur (the build should look like a crisp convention-display photograph, not a toy-photography miniature effect).

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the diorama-theme + build-scope + signature centerpiece + camera framing, weave in the life-density + baseplate-edge + lighting + palette + easter-egg (if fired). End with one phrase reinforcing AFOL convention-Best-of-Show complete-diorama LEGO MOC photography, DEEP-FOCUS edge-to-edge sharp (NOT tilt-shift). NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

  BRICKBOT_MECH: ({ slots, vibeDirective }) => {
    const {
      mech_class,
      mech_action,
      build_technique,
      camera_framing,
      setting,
      register,
      scene_props,
      lighting,
      palette,
      mech_phenomenon,
    } = slots;

    const props = Array.isArray(scene_props) ? scene_props : [scene_props];
    const propLines = props.map((p, i) => `  ${i + 1}. ${p}`).join('\n');

    const phenomenonSection = mech_phenomenon
      ? `
━━━ MECH PHENOMENON (this render's combat beat) ━━━
${mech_phenomenon}

Weave this in as a SECONDARY focal point, rendered IN BRICK (trans-orange + trans-yellow muzzle-flash elements / trans-cyan energy-shield dome / trans-flame rocket-boost / scattered tile + trans-flame explosion-debris). It AMPLIFIES the action — never eclipses the mech as hero.

`
      : '';

    return `You are a LEGO MOC photographer + AFOL convention judge writing a GIANT-ROBOT / MECH diorama description for BrickBot. Output is a 130-180 word comma-separated phrase string for Flux. NO preamble, NO labels, NO bullets, NO ━━━ markers, NO **bold**, NO numbered output. Single paragraph.

━━━ THE BAR — AFOL CONVENTION TIER MECH IN LEGO BRICKS ━━━
This is a Bricklink AFOL champion's mech diorama, photographed at a LEGO World convention — a posed, articulated, greebled brick titan that wins hard-suit category. Could win a Brickworld Best-of-Show. NOT a stock photo from Lego.com. NOT a kid's playset. NOT a photoreal CGI war-machine still. The mech is OBSESSIVELY detailed — ball-jointed in a dynamic pose, panel-lined, power-core lit. Visual canon: LEGO Bionicle (bio-mechanical CCBS) + Hero Factory (hero-bots) + Exo-Force (anime-mech blue/gold vs robots) + Ninjago mechs + Technic mech-suits + AFOL hard-suit MOCs. INSPIRED BY mecha-anime + Pacific-Rim-scale, but NEVER named franchises (no Gundam model-numbers / Transformers names / named Jaegers).

━━━ ZERO REAL HUMANS, ZERO REAL HANDS — HOISTED ABSOLUTE ━━━
NEVER a real human hand, fingers, skin, photoreal faces, or claymation-blend. Flux's "LEGO photo" data is contaminated with hand-placing-brick + claymation hero shots. OVERRIDE HARD. Any pilot/crew is a LEGO minifigure with C-shaped hands + printed plastic face (in a cockpit, or tiny at the mech's foot for scale). The MECH itself is a brick-built robot — never a real-metal CGI mech.

━━━ EVERYTHING IS BRICK — THE MECH AND ITS WORLD ARE ALL LEGO ━━━
EVERY element is built from real LEGO bricks. NO photoreal metal, NO photoreal CGI mech, NO photoreal explosions, NO photoreal sky. Studs + Technic-holes + ball-joints CLEARLY VISIBLE. Authentic plastic texture, molded seams. The diorama sits on a tabletop convention display.
  • Mech body = brick + Technic-beam frame with ball-joint + ratchet articulation, SNOT armor-plating, panel-line greebles — NEVER photoreal metal
  • Power-core / energy = trans-cyan + trans-blue + trans-orange elements + light-piping — NEVER photoreal glow
  • Weapons-fire / explosions = trans-orange + trans-yellow flame elements + scattered tiles — NEVER photoreal pyro
  • Terrain (battlefield / hangar floor) = brick plates + slope-bricks + Technic-panel flooring — NEVER photoreal ground
  • Smoke = cotton-elements + grey 1×1 round-plates — NEVER photoreal smoke
  • Sky = brick sky-baseplate — NEVER photoreal sky

━━━ BANNED VOCABULARY (pull Flux to photoreal CGI — NEVER use): "photoreal", "real metal/steel", "CGI", "rendered metal", "glistening chrome", "motion-blur", "blurred". Render the mech as a posed brick MOC, never a cinematic CGI render.

━━━ THE MECH — the hero subject ━━━
${mech_class}

Build the mech large and dominant — a posed, ball-jointed brick titan filling the frame, with visible Technic-frame + armor-plating + power-core detail. It is THE subject.

━━━ THE MECH ACTION — STORY BEAT MANDATE (no static A-pose) ━━━
${mech_action}

A freeze-frame of the mech IN DYNAMIC ACTION — mid-stride, mid-cannon-fire, mid-transform, mid-melee-clash. Lock the ball-joints into a powerful action-pose with weight + intent. NEVER a stiff arms-out T-pose facing camera (the Flux mech-default — override it).

━━━ THE MOC BUILD TECHNIQUE — AFOL DISTINGUISHER (render visibly) ━━━
${build_technique}

Makes the build read as AFOL champion + unmistakably all-brick. Render it visibly — name the brick parts (exposed Technic-beam endoskeleton / ball-joint + ratchet articulation / CCBS shell-armor / SNOT plating / trans-cyan power-core + light-piping / hydraulic-piston greebles).

━━━ THE CAMERA FRAMING — MANDATORY DRIVING AXIS ━━━
${camera_framing}

⚠️ NON-NEGOTIABLE — the rolled framing DRIVES the composition. Apply the exact angle, even if Flux wants a centered front-facing T-pose. Override hard.
  • WORM'S-EYE-UP-THE-TITAN — low looking steeply up to emphasize the mech towering, tiny pilots below for scale
  • MECH-VS-MECH-CLASH-BETWEEN — camera between two clashing mechs, dynamic diagonal of the fight
  • COCKPIT-CANOPY-REVEAL — close on the open cockpit with the pilot minifig inside, the mech-body around it
  • HANGAR-GANTRY-SIDE — side-elevation with maintenance gantries + crew, the mech in profile being serviced
  • OVER-THE-SHOULDER-FROM-BEHIND — behind the mech looking past its shoulder at the battlefield/foe ahead
  • Avoid centered front-facing T-pose framing — that's the Flux-bias trap.

━━━ THE SETTING ━━━
${setting}

Render the brick setting around the mech — the hangar / battlefield / junkyard / cityscape that grounds the scene and proves the mech's scale.

━━━ THE REGISTER (mech heritage lock) ━━━
${register}

The aesthetic lock — the mech's silhouette, armor style, palette, and detailing align with this heritage (Bionicle bio-mechanical / Hero-Factory hero-bot / Exo-Force anime blue-gold / Ninjago elemental / Technic raw-mechanical). Never mix anachronistically.

━━━ DIORAMA STORYTELLING DETAILS — fill the negative space ━━━
${propLines}

These brick-built details ground the mech in a working world — never decorative-only. A pilot minifig at the foot or crates at the base sells the scale + story.
${phenomenonSection}━━━ LIGHTING ━━━
${lighting}

━━━ PALETTE ━━━
${palette}

━━━ CROSS-AXIS COMPATIBILITY ━━━
• If register is BIONICLE — bio-mechanical organic curves + CCBS shell-armor + a Kanohi-mask-style head + silver/gold/elemental-color palette.
• If register is HERO-FACTORY — sleeker hero-bot armor + a bright single-hero color-scheme + a hero-core chest.
• If register is EXO-FORCE — anime-mech blue + gold + white with an angular cockpit + a hair-piece pilot, vs robot-red drones.
• If register is NINJAGO-ELEMENTAL — an elemental-themed mech (fire/ice/earth) with a ninja-minifig pilot.
• The mech is ALWAYS a posed brick MOC with visible joints, never a photoreal CGI render, regardless of how cinematic the lighting feels.
• Whatever palette rolls, the register's signature WINS if they conflict.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ OUTPUT SPEC ━━━
Write 130-180 words. Single paragraph. Comma-separated phrase string. Lead with the mech-class + action + camera framing, weave in the build technique + setting + register + props + lighting + palette + mech phenomenon (if fired). End with one phrase reinforcing AFOL convention-tier LEGO MOC mech diorama photography. NO preamble, NO ━━━ markers, NO **bold**, NO numbered output, NO "render as" trailer. Pure Flux-feed phrase string.`;
  },

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
