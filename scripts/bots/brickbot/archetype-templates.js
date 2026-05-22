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
