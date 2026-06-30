/**
 * steambot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * 2026-06-12 LEAN REWRITE — every template was 100+ lines of repeated
 * NON-NEGOTIABLE / OBSESSIVE blocks, FORBIDDEN-VOCABULARY teach-the-ban lists,
 * ALLOWED-VOCABULARY word-dumps, and cram mandates ("render ALL THREE",
 * "STACK 3+ ELEMENTS", "MINIMUM 4 GLOW COLORS", "TWO HEROES"). Sonnet read all
 * of it and crammed → 240-354 word prompts. Rewritten to ONE clear hero +
 * readable scene + the load-bearing guards only (gender/ethnicity locks,
 * automaton-not-animal, never-seductive, multi-color lab), capped ~110 words.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

const TAIL =
  'LENGTH IS THE #1 RULE — your entire output MUST be 85-110 words. Count them. A tight, readable 100-word scene with ONE clear hero beats a crammed 250-word one every time. Do NOT enumerate every object or pile on adjectives — name the hero, place it in the scene, add a few supporting details, and STOP. Output ONLY the raw Flux prompt as one flowing paragraph of comma-separated phrases. No preamble, no labels, no headers, no ━━━ markers.';

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

    return `Write ONE cinematic steampunk illustration for SteamBot: a single gorgeous WOMAN caught mid-action inside a fully-realized Victorian-industrial world. Lush painted key-art register (BioShock-Infinite / Mortal-Engines / Howl's-Moving-Castle / Treasure-Planet). Solo, candid, tasteful — beauty reads through couture craftsmanship and confident poise, never exposed skin.

OPEN by establishing she is a single gorgeous woman (the word "woman" within the first 8 tokens, before any role-noun). Build her looks ONLY from the visual traits below — NEVER a nationality, ethnicity, or region. She/her throughout. Exactly one character.

THE OUTFIT is the main show — render it ornate, layered, period Victorian-industrial (brass clasps, embroidered cuffs, jeweled brooch, velvet/brocade panels), whatever silhouette the wardrobe rolls. She fills 25-40% of frame, full-body, clearly readable.
Persona: ${persona}.
She has ${skin}; ${eyes.split(',')[0]}; ${hair_color.split(',')[0]} styled ${hairstyle.split(',')[0]}; makeup ${makeup.split(',')[0]}. She wears ${outfit}, carrying ${accessory} (rendered with rich mechanical detail).
Action right now (caught mid-task, not posing): ${action}.

HER STAGE — the steampunk setting: ${landscape}. Render it lived-in with real depth (tactile foreground near her → the room around her → the wider world receding into haze), never a flat backdrop.

Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}.
Three-quarter or side angle, full-body, she and her world balanced like BioShock key art. No text/words/watermarks.

${TAIL}`;
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

    return `Write ONE cinematic steampunk illustration for SteamBot: a single handsome MAN caught mid-action inside a fully-realized Victorian-industrial world. Lush painted key-art register (BioShock-Infinite / Mortal-Engines / Howl's-Moving-Castle / Treasure-Planet). Solo, candid. Handsome through action and craftsmanship — fully dressed at all times, never seductive, never shirtless.

OPEN by establishing he is a single handsome man (the word "man" within the first 8 tokens, before any role-noun). Build his looks ONLY from the visual traits below — NEVER a nationality, ethnicity, or region. He/his throughout. Exactly one character, no women.

THE OUTFIT is the main show — render it ornate, layered, period gentleman's attire (brass buttons, leather straps, waistcoat lapels, coat-cuffs), whatever silhouette the wardrobe rolls. He fills 25-40% of frame, full-body, clearly readable.
Persona: ${persona}.
He has ${skin}; ${eyes.split(',')[0]}; ${facial_hair.split(',')[0]}; ${hair_color.split(',')[0]} styled ${hairstyle.split(',')[0]}. He wears ${outfit}, carrying ${accessory} (rendered with rich mechanical detail).
Action right now (caught mid-task, not posing): ${action}.

HIS STAGE — the steampunk setting: ${landscape}. Render it lived-in with real depth (tactile foreground near him → the room around him → the wider world receding into haze), never a flat backdrop.

Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}.
Three-quarter or side angle, full-body, him and his world balanced like BioShock key art. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_AIRSHIP_SKIES: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, scene, sky_layer, surprise_element, phenomenon } = slots;

    const phenomenonLine = phenomenon
      ? `Sky-event in the world around it (secondary focal point, never eclipsing the ship): ${phenomenon}.\n`
      : '';

    return `Write ONE movie-poster AIRSHIP-SKIES scene for SteamBot — a Victorian-industrial dirigible / sky-galleon / sky-clipper at vertigo-inducing scale in a dramatic sky. Mortal-Engines / Treasure-Planet / Last-Exile / Skies-of-Arcadia lineage. The frame should make the viewer gasp at the scale. No primary human figure (tiny crew silhouettes OK as scale-provers only).

THE HERO VESSEL: ${scene}. Render it with rich Victorian-industrial detail — riveted brass hull, copper gondolas, ribbed envelope, exposed pipework, gaslit windows glowing amber, brass propellers. Never a modern aircraft or spaceship. It reads at clear scale (30-50% of frame) with real depth: tactile foreground rigging → the ship in full glory → sky-world receding into haze.

THE SKY (half the painting): ${sky_layer}. Multi-tier cloud layers, gradients, light-shafts, distant horizon.
${phenomenonLine}A small secondary detail at midground/distance implying the wider sky-world (never eclipsing the ship): ${surprise_element}.

Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}.
Wide cinematic establishing shot, the sky wrapping the vessel. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_STEAMPUNK_CURIO: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, curio, habitat, ornate_flourish } = slots;
    const flourishes = (
      Array.isArray(ornate_flourish) ? ornate_flourish : [ornate_flourish]
    ).filter(Boolean);

    return `Write ONE cinematic steampunk CURIO scene for SteamBot — a single clockwork AUTOMATON (a brass mechanical creature) at rest in a lived-in Victorian-industrial room. The automaton is the hero (40-60% of frame); the room wraps around it. No people, no hands, no faces.

THE AUTOMATON: ${curio}. It must read UNMISTAKABLY as built metal, not a live animal — brass/copper plating, articulated joints, exposed gears or a clockwork heart behind a panel, glass or gemstone eyes, metal-leaf fur or feathers. Posed calmly at rest (sitting, perched, settled), never mid-action. Always a mechanical creature — never jewelry, a crown, a clock, or a decorative object. Work in a few ornate flourishes on its surface: ${flourishes.join('; ')}.

THE HABITAT (a lived-in steampunk space — workshop / conservatory / library / observatory, NOT a museum display): ${habitat}. Depth on depth: a tactile prop near it → surrounding tools/books/glassware → the room receding into haze. Brass + copper + oiled-wood + glass dominant, hand-tooled, never modern.

Light (environmental — gas-lamp / candlelight / sun through glass catching its metal): ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}.
Automaton centered or slightly offset at clear scale, the steampunk world grounding it. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_STEAMPUNK_SPECTACLE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, event, crowd_detail, surprise_element, escalation } = slots;

    const escalationLine = escalation
      ? `A dramatic intensification amplifying the crowd's reaction (atmospheric/mechanical/social only — never violence or gore): ${escalation}.\n`
      : '';

    return `Write ONE cinematic STEAMPUNK SPECTACLE scene for SteamBot — a grand Victorian-industrial event / ceremony / festival / performance with crowd energy. The EVENT is the subject, never a single hero figure. Wide cinematic establishing shot or dramatic crowd-level angle, prestige feature-film polish.

THE EVENT (commands the frame): ${event}. Render it massive and alive with depth on depth — a few prominent figures in the closest tier → the event-action and its main participants → the wider crowd receding into haze.

THE CROWD (human-energy texture, not itemized): ${crowd_detail}. A textured living mass — top-hats, corsets, brass-goggles, waistcoats, parasols, uniforms; mixed Victorian society telling the story.
A small secondary detail at midground/distance amplifying the moment (never eclipsing the event): ${surprise_element}.
${escalationLine}
Warm brass + copper + bronze + oiled-wood dominant, surface density throughout, never sparse. Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}.
Epic scope, individual figures readable as story-anchors. 1890s impossible-engineering, no modern objects. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_STEAM_TRANSPORT: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, transport, terrain_drama, surprise_element, phenomenon } = slots;

    const phenomenonLine = phenomenon
      ? `A dramatic atmospheric event charging the scene (visible focal point): ${phenomenon}.\n`
      : '';

    return `Write ONE cinematic STEAM TRANSPORT scene for SteamBot — a Victorian-industrial vehicle conquering dramatic terrain. Locomotive / submarine / walking-machine / paddleboat / steam-carriage / sky-rail. The machine and the landscape make the drama together. Mortal-Engines / Snowpiercer / 20,000-Leagues / Spirited-Away-train lineage. No primary human figure (tiny crew silhouettes OK as scale-provers).

THE HERO VEHICLE: ${transport}. Render it with rich Victorian-industrial materiality — every rivet, steam-vent, brass pipe, weathered plate. It reads at clear scale (25-50% of frame). Never a modern vehicle, never on flat boring track.

THE TERRAIN that makes it epic: ${terrain_drama}. Depth on depth — tactile foreground edge → the vehicle traversing the geography → the impossible landscape stretching beyond. The terrain dwarfs and amplifies the machine.
A small secondary detail at midground/distance implying the wider world (never eclipsing the vehicle): ${surprise_element}.
${phenomenonLine}
Steam trails, smoke plumes, headlamp beams cutting the weather. Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}.
Wide cinematic establishing shot, three-quarter angle so the silhouette reads, machine-vs-landscape scale. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_COZY_STEAMPUNK: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, room, flora, window_view, intricate_detail, quiet_moment } =
      slots;
    const floraArr = (Array.isArray(flora) ? flora : [flora]).filter(Boolean);
    const detailArr = (
      Array.isArray(intricate_detail) ? intricate_detail : [intricate_detail]
    ).filter(Boolean);

    const quietLine = quiet_moment
      ? `A small comforting human-trace detail at midground (someone just was here), never eclipsing the room: ${quiet_moment}.\n`
      : '';

    return `Write ONE dreamy COZY STEAMPUNK ROOM scene for SteamBot — a comforting, surreally beautiful room that is VISIBLY built on steampunk machinery, with a glowing window view. Painted, warm, soft — a painted dream of a place, not a documentary photo. The viewer should want to step in, sit down, and look out the window. No human figure as the subject (a tiny seated silhouette from behind is OK as a scale-prover).

THE ROOM: ${room}. Cozy and warm (velvet chairs, mahogany, lamplight, oriental rug) BUT unmistakably steampunk — visible brass gears and copper steam-pipes running along the walls and ceiling, clockwork wall-mechanisms, brass pressure-gauges, a gear-driven fixture or brass-and-glass apparatus among the furniture. The mechanical steampunk elements are part of the room's character and must read clearly, not just a "Victorian" parlor. Lived-in, intricate, with depth from a tactile foreground → central furniture → the window-wall. The room fills ~60-70% of the frame.
Weave in a little flora softening the brass-and-gear edges: ${floraArr.join('; ')}.
Work these ornate steampunk-mechanical touches into the fixtures — visible gears, brass pipes, clockwork: ${detailArr.join('; ')}.

THE WINDOW VIEW (the remaining ~30-40%, a glowing portal — readable, richly colored): ${window_view}. Sunset / aqua rainstorm sky / distant airships / cloudtops.
${quietLine}
Warm light streaming through the window kisses the surfaces. Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}.
Slight three-quarter angle from inside looking toward the window. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_STEAMPUNK_LABS: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, lab_space, centerpiece, apparatus, electrical, scientist } =
      slots;
    const details = (Array.isArray(apparatus) ? apparatus : [apparatus]).filter(Boolean);

    const accent = details[0] || '';
    const extraLine = electrical
      ? `Electrical energy crackling visibly nearby (Tesla-arcs / plasma-glow): ${electrical}.\n`
      : scientist
        ? `A TINY lab-coated figure at a midground edge as a scale-prover (never the focal subject): ${scientist}.\n`
        : '';

    return `Write ONE cinematic MAD-SCIENCE LABORATORY scene for SteamBot — a Frankenstein-meets-Tesla Victorian lab alive with glowing experiments. Tesla's Wardenclyffe / Frankenstein's tower / Doc-Brown's-workshop energy. Brass-and-mahogany Victorian-industrial architecture, but the IDENTITY is glowing mad-science, not a quiet library. No primary human figure.

ONE dominant glowing CENTERPIECE (midground, the eye lands here first, 25-40% of frame): ${centerpiece}. Render it with rich material detail — brass fittings, glass curves, glowing-liquid swirl, vapor, sparks.
THE GLOW: let the centerpiece's color be joined by just one or two smaller glowing accents in DIFFERENT colors (emerald / electric-blue / hot-pink / amber / violet) so the frame is multi-color, never single-color-monochrome — e.g. ${accent}. Don't fill the room with experiments.
${extraLine}
THE LAB SPACE (the setting around it — brass-and-mahogany shelving, gas-lamps, arched-glass overhead): ${lab_space}.
Light (warm gas-lamp ambient + the saturated experiment glow): ${lighting}. Atmosphere (steam, ozone-mist catching the glow): ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 100)}.
Wide cinematic interior with depth, the experiment mid-action, saturated jewel-tones against deep shadow. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_STEAMPUNK_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const { lighting, atmosphere, character, landscape, surprise_element, event } = slots;

    const eventLine = event
      ? `A dramatic event unfolding in the world as a secondary focal point (atmospheric drama only, never combat/violence): ${event}.\n`
      : '';

    return `Write ONE cinematic STEAMPUNK SCENE for SteamBot — a single role-based steampunk character set inside a wildly imaginative Victorian-industrial landscape. The LANDSCAPE is the co-hero (50-70% of the frame); the character is a story-anchor (15-25%), the eye drinks in the world first, then finds the figure. Prestige feature-film concept-render polish.

THE LANDSCAPE (wildly imaginative, impossible, monumental — gear-waterfalls, clockwork-cathedrals, floating-metropolises, brass-canyons): ${landscape}. Render with rich Victorian-industrial detail and depth on depth — tactile foreground near the figure → the landscape body with the figure within it → the wider world receding into haze.

THE CHARACTER (solo, one figure, candid — not posing): ${character}. Period-accurate costume, role-readable silhouette, integrated into the world.
A small secondary detail at midground/distance implying the wider world (never eclipsing landscape or character): ${surprise_element}.
${eventLine}
Warm brass + copper + bronze dominant. Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}.
Wide cinematic establishing shot, character readable but clearly an anchor in a world that surrounds them. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_AIRSHIP_FEMALE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      role,
      skin,
      face,
      eyes,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      action,
      backdrop,
      drama,
    } = slots;

    // Role TITLE only (text before the em-dash) — the full role description
    // carries costume language ("impeccable coat", "gold braid epaulettes")
    // that would override the rolled outfit and homogenize every render into a
    // naval officer's coat. The outfit slot is the ONLY thing that dresses her.
    const roleTitle = String(role).split('—')[0].trim();

    const dramaLine = drama
      ? `A dramatic environmental event heightening the moment (never replacing her as focal point): ${drama}.\n`
      : '';

    return `Write ONE steampunk illustration for SteamBot — a single young woman working aboard an AETHERIC SKY-AIRSHIP high in the clouds, caught in the MIDDLE OF A REAL MOMENT, the steampunk world alive and deep around her. She is a capable, characterful member of the crew — distinctive and appealing but NOT a glamour model, NOT a posed cover-girl, NOT heavily made-up. She SHARES the frame with her world: a candid working scene with a story playing out, never a triumphant hero-pose, never a portrait against a blurred backdrop.

THE WORLD IS A STEAMPUNK AIRSHIP IN THE SKY — riveted brass-and-copper hull, gas-envelope overhead, propellers, exposed gears, pipework, gaslamps, floating among clouds and other airships. This is the open SKY: never an ocean, never water, never a wooden sailing ship on the sea. Spend most of the word budget on this world and the action — not on her face.

THE WOMAN — distinct, built from these rolled visual traits (vary her render to render; never a nationality or ethnicity — visual traits only; natural, not glamorized):
- Skin: ${skin}.
- Face: ${face}.
- Eyes: ${eyes}.
- Hair: ${hair_color}, ${hairstyle}.
She/her throughout. She wears ONLY this (never default her into a naval officer's coat or any uniform): ${outfit} — render it faithfully and in full. She carries ${accessory} (rich mechanical detail). Her role/vibe: ${roleTitle}.

THE MOMENT (candid, caught mid-task — actively DOING the labor, hands on the work; if the action reads as a heroic flourish, ground it into real crew-work instead): ${action}.

HER WORLD does as much storytelling as she does — the working airship rendered with genuine depth and life, in crisp focus front to back: a tactile foreground of brass rail / rigging / deck-gear, the busy deck around her with OTHER CREW at work, ropes, valves, cargo and instruments, and the wider sky beyond — other airships, a cloud sky-port, distant terrain. ${backdrop}.
${dramaLine}
She fills ~20-30% of the frame, full or three-quarter body, one working figure among a deep steampunk scene — NOT a telephoto close-up, NOT the only thing in focus. Candid three-quarter or dynamic angle, deep focus throughout.
Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}. No text/words/watermarks.

${TAIL}`;
  },

  STEAMBOT_AIRSHIP_MALE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      lighting,
      atmosphere,
      role,
      skin,
      face,
      eyes,
      facial_hair,
      hair_color,
      hairstyle,
      outfit,
      accessory,
      action,
      backdrop,
      drama,
    } = slots;

    // Role TITLE only — the full role description carries costume language that
    // would override the rolled outfit and homogenize every render into one
    // uniform. The outfit slot is the ONLY thing that dresses him.
    const roleTitle = String(role).split('—')[0].trim();

    const dramaLine = drama
      ? `A dramatic environmental event heightening the moment (never replacing him as focal point): ${drama}.\n`
      : '';

    return `Write ONE steampunk illustration for SteamBot — a single man working aboard an AETHERIC SKY-AIRSHIP high in the clouds, caught in the MIDDLE OF A REAL MOMENT, the steampunk world alive and deep around him. He is a capable, characterful member of the crew — handsome through competence, fully dressed at all times, never seductive, never shirtless, but NOT a posed prince, NOT a romance-cover hero. He SHARES the frame with his world: a candid working scene with a story playing out, never a triumphant hero-pose, never a portrait against a blurred backdrop.

THE WORLD IS A STEAMPUNK AIRSHIP IN THE SKY — riveted brass-and-copper hull, gas-envelope overhead, propellers, exposed gears, pipework, gaslamps, floating among clouds and other airships. This is the open SKY: never an ocean, never water, never a wooden sailing ship on the sea. Spend most of the word budget on this world and the action — not on his face.

THE MAN — distinct, built from these rolled visual traits (vary him render to render; never a nationality or ethnicity — visual traits only; natural, not idealized):
- Skin: ${skin}.
- Face: ${face}.
- Eyes: ${eyes.split(',')[0]}.
- Facial hair: ${facial_hair}.
- Hair: ${hair_color}, ${hairstyle}.
He/his throughout, no women. He wears ONLY this (never default him into a naval officer's coat or any uniform): ${outfit} — render it faithfully and in full. He carries ${accessory} (rich mechanical detail). His role/vibe: ${roleTitle}.

THE MOMENT (candid, caught mid-task — actively DOING the labor, hands on the work; if the action reads as a heroic flourish, ground it into real crew-work instead): ${action}.

HIS WORLD does as much storytelling as he does — the working airship rendered with genuine depth and life, in crisp focus front to back: a tactile foreground of brass rail / rigging / deck-gear, the busy deck around him with OTHER CREW at work, ropes, valves, cargo and instruments, and the wider sky beyond — other airships, a cloud sky-port, distant terrain. ${backdrop}.
${dramaLine}
He fills ~20-30% of the frame, full or three-quarter body, one working figure among a deep steampunk scene — NOT a telephoto close-up, NOT the only thing in focus. Candid three-quarter or dynamic angle, deep focus throughout.
Light: ${lighting}. Atmosphere: ${atmosphere}. Palette: ${sharedDNA.scenePalette}. Mood: ${vibeDirective.slice(0, 120)}. No text/words/watermarks.

${TAIL}`;
  },
};
