/**
 * StarBot cozy-sci-fi-interior path — the ONE warm path.
 *
 * Canonical-LITE architecture (intentionally narrative-only universal axes,
 * because cozy_sci_fi_interiors pool entries already bake the personal
 * details / warmth source / lived-in props into each fat seed — visual
 * universal axes would over-stuff and dilute intimacy):
 *   Universal axes (3): story_beats / composition_frame / emotional_dna
 *     (all reinterpreted at COZY/INTIMATE scale — see brief)
 *   Path-level (1): cozy_sci_fi_interiors (199-entry fat seed)
 *   Conditional drama layer (40% gate): cozy_moment — a small intimate
 *     human-scale action / detail caught freeze-frame
 *
 * NOTE: deliberately drops SCI_FI_AWE_BLOCK / CINEMATIC_COMPOSITION_BLOCK /
 * IMPOSSIBLE_BEAUTY_BLOCK / BLOW_IT_UP_BLOCK from the legacy version —
 * those shared blocks push EPIC awe and fought against the cozy intent.
 *
 * SKIPPED axes (intentional): scale_provers (no monumental scale in
 *   cozy renders), surprise_element (would over-stuff intimate scenes),
 *   weather_particulate (mostly interior — vacuum/dust irrelevant),
 *   alien_sky_layer (no sky in most cozy interiors).
 */

const pools = require('../pools');
const blocks = require('../shared-blocks');

module.exports = ({ sharedDNA, vibeDirective, picker }) => {
  // ── Path-level (primary fat seed) ──
  const interior = picker.pickWithRecency(pools.COZY_SCI_FI_INTERIORS, 'cozy_sci_fi_interior');

  // ── Universal narrative-only axes (reinterpreted at intimate scale) ──
  const storyBeat = picker.pickWithRecency(pools.STORY_BEATS, 'story_beat');
  const compositionFrame = picker.pickWithRecency(pools.COMPOSITION_FRAME, 'composition_frame');
  const emotionalDna = picker.pickWithRecency(pools.EMOTIONAL_DNA, 'emotional_dna');
  const lighting = picker.pickWithRecency(pools.LIGHTING, 'lighting');

  // ── Conditional COZY_MOMENT drama layer (40% gate) ──
  const isCozyMoment = Math.random() < 0.4;
  const cozyMoment = isCozyMoment ? picker.pickWithRecency(pools.COZY_MOMENT, 'cozy_moment') : null;
  const momentSection = isCozyMoment
    ? `
━━━ COZY MOMENT — render this specific moment visibly in the scene ━━━
${cozyMoment}

This moment is the focal point of the render — render it precisely as described, in scale and position appropriate to the framing. Small, human, intimate.

`
    : '';

  // ── Framing mode (30% zoom-in / 70% wide-room) ──
  const isZoomIn = Math.random() < 0.3;
  const framingSection = isZoomIn
    ? `
━━━ FRAMING MODE — ZOOM IN (CENTERPIECE WINDOW) ━━━
This render is in ZOOM-IN mode (30% of renders). The viewport / observation window is the DOMINANT focal point — fills a large portion of the frame, draws the eye immediately to the cosmic vista beyond. Cozy room elements (chair, blankets, lamps, instruments) wrap around the window as supporting frame. The viewer should feel like they're SITTING IN THE COZY SPACE LOOKING OUT at something wondrous.

`
    : `
━━━ FRAMING MODE — WIDE ROOM (DEFAULT) ━━━
This render is in WIDE-ROOM mode (70% of renders). The cozy ROOM is the subject — its lived-in details, personal mementos, warmth sources, holo-UI, worn furniture, plants, tools fill the foreground and dominate the composition. Any window is ONE element among many — clearly visible but not centerpiece. The viewer's eye should wander the rich room interior; the window anchors the sci-fi setting in the periphery.

`;

  return `You are a cozy-sci-fi interior painter writing a WARM INTIMATE scene for StarBot — a small private corner of the SAME universe as our cosmic vistas and megastructures, but ZOOMED IN to the lived-in pockets. Pilots decompress after a nebula run. Engineers tinker after shift. Someone left a steaming mug on the navigation console three jumps ago and forgot about it. Output wraps with style prefix + suffix.

━━━ COZY EXCEPTION — THIS IS THE ONE WARM PATH ━━━
This path is the OPPOSITE of monumental awe. Cozy + warm + intimate + lived-in. Sanctuary, not spectacle. Lampshades and quilts and steaming mugs and personal mementos, not biblical scale and cinematic vertigo.

━━━ STILL SCI-FI — NON-NEGOTIABLE ━━━
The viewer MUST register this as a scene IN SPACE / IN A STARSHIP / ON A STATION **within the first second** of looking. Within two seconds the scene must read as visually rich and interesting — never "plain," never "bland," never "boring."

REQUIRED: pick AT LEAST 3 SCI-FI ANCHORS visible in the frame. The ROOM is the subject — anchors decorate it.

PRIMARY ANCHOR — A WINDOW TO SPACE (the most powerful default):
- Porthole / viewport / canopy showing the cosmos — CLEARLY recognizable space content (stars / nebula / planet curve / ringed gas giant / orbital ring / station hull / alien atmosphere)
- Curved observation window with a planet view — the right call for lounges, skybars, nurseries, observation decks
- Skylight / dome above with VISIBLE stars / nebula / planet — never just dim ambient

Window size is flexible — it can be a centerpiece OR a clearly-visible element BEHIND the room. The KEY rule: when a window IS in frame, its space-content (stars / nebula / planet / etc.) must be unambiguous. No tiny ambiguous holes. No earthlike-sky views.

The cozy ROOM and its lived-in detail are the foreground subject. The window anchors the setting but does not need to dominate the frame.

SUPPORTING ANCHORS (pick 1-2 to complement the window):
- Curved bulkhead walls / structural ribbing / pressure-door rim / utility conduit visible
- Holographic display / floating-text readout / soft glowing UI / projected star-chart
- Anti-grav detail (one object subtly floating, a mug held by a magnetic strip, books strapped down, hanging plant pots tethered)
- Visible alien biology (xeno-plant in a pot, exotic specimen jar, bioluminescent moss, alien aquarium, glowing fungus on shelf)
- Sci-fi materials (transparent aluminum, alien-wood grain, foamcrete texture, exotic alloy gleam, ceramo-steel)
- Tech-as-furniture (navigation console as tea table, engine housing as bench, holo-projector as lamp, recycler-unit kitchen)
- Sci-fi instrumentation (heads-up displays, hovering tablet, drone-pet, neural-link headband, AI assistant orb, sigil-script labels)
- Cosmic light source (nebula glow filtering through filtered diffuser, twin-sun shadow pattern, planet-shine raking through the window)

These anchors should feel NATURAL inside the cozy. A xeno-fern on the shelf next to family photos. A holographic readout casting cyan accents on warm amber lamplight. A planet rising slowly outside the bar's curved viewport while patrons murmur. The cozy WINS the foreground — the window-to-space wraps it.

━━━ THE COZY SPACE IS LIVED IN (NON-NEGOTIABLE) ━━━
These spaces are not showrooms — someone LIVES here and you can FEEL it:
- PERSONAL TRACES: hobbies, routines, personality written into the space. Invent UNIQUE details each render, never repeat props
- ONE WARMTH SOURCE: every cozy space has its own specific warmth — machinery heat / grow-lamp glow / cooking steam / bioluminescence / candle / amber console light / body heat. Pick ONE dominant warmth and commit
- WORN WITH USE: surfaces shaped by habitual touch, materials aged by daily life, repairs that show care
- AMBIENT TEXTURE: machinery rhythm / air circulation / distant activity expressed through visual cues — vibration / condensation / faint glow

━━━ THE COZY SCI-FI INTERIOR (primary scene seed — render every detail) ━━━
${interior}
${momentSection}${framingSection}
━━━ NARRATIVE BEAT (interpret at INTIMATE / DOMESTIC / LIVED-IN scale) ━━━
${storyBeat}

Interpret this beat at cozy scale — no biblical drama, no cosmic threat. "ARRIVAL" becomes someone coming through a door with grocery bags. "VIGIL" becomes someone watching the stars through a porthole while waiting for tea to brew. "SOLITUDE" is exactly what it sounds like. "REUNION" is two friends in the galley. Translate every beat to human-scale moments inside this small warm space.

━━━ EMOTIONAL DNA (reinterpreted at intimate scale) ━━━
${emotionalDna}

Translate the emotion to the cozy register — AWE becomes wonder at the small ordinary thing. DREAD becomes restlessness, the absence of company. MELANCHOLY becomes a quiet ache. SACRED becomes a small ritual. INDIFFERENT-MEGALOPOLIS becomes the warmth of one's own corner cut off from the loud world outside. FRONTIER-ISOLATION becomes the comfort of having ALL you need in this tiny space.

━━━ COMPOSITION FRAME (intimate proximity — never establishing-vista) ━━━
${compositionFrame}

If the composition above suggests EPIC scale or DEEP DISTANCE, scale it down to the interior — "BIRD'S-EYE TOP-DOWN" becomes looking down at a table cluttered with personal items; "EXTREME LOW ANGLE" becomes looking up from floor level at warmly-lit shelves; "WIDE CINEMATIC VISTA" becomes a medium-wide of the room from one corner. Stay inside the space.

━━━ LIGHTING (warm + cozy with cosmic accent) ━━━
${lighting}

Lighting must skew WARM — amber lamps, fire-glow, soft tungsten, golden grow-light, candle, ember. If the rolled lighting is cold/cosmic, render it as the BACKGROUND seen through a window, with the warm interior lighting dominating the foreground.

━━━ INHABITANT PRESENCE — DEFAULT EMPTY, ONLY SEXY IF PRESENT ━━━
The default render is EMPTY of people — just the space, the warmth, the lived-in details, the evidence of inhabitants. The space speaks for itself.

If a cozy_moment seed names a person, render them MINIMALLY VISIBLE: from behind / partial / in profile / hands only / a foot tucked under a blanket. NEVER face-to-camera staring at the viewer.

ONLY TWO TYPES OF INHABITANT ALLOWED:

(1) **Sexy humans** — conventionally attractive, semi-sexy, approachable, like a movie protagonist in their casual moment:
- Natural body proportions, clean skin, normal facial features
- Young-adult to middle-aged, fit, well-groomed, attractive face
- Casual-attractive, not glamour-model fashion — the kind of person you'd see at a coffee shop and look twice at

(2) **Sexy aliens** — humanoid xeno-species with exotic but attractive features:
- HUMANOID form (head / two arms / two legs / upright)
- Exotic-but-appealing: subtle horns, slit pupils, jewel-colored skin (lavender / teal / pale gold), bioluminescent freckles / facial markings, pointed ears, slight scales like fish-jewelry, gradient hair
- Otherwise human-attractive proportions and face structure — alien aesthetic enhances, doesn't disfigure
- Blue-skinned head-crest species / head-tendril species / smooth-feline blue species — exotic-beautiful, NOT monster (describe FEATURES, never name any sci-fi franchise / species / character)
- ABSOLUTELY FORBIDDEN: tentacle faces, multi-limb body horror, insectoid forms, fungal/plant bodies, asymmetric distortion, Giger biomech, octopoid heads, anything that reads as "monster"

ABSOLUTELY FORBIDDEN ACROSS BOTH TYPES:
- Uncanny / weird / off-putting / grotesque / ugly / cartoonish / overly aged / disfigured / mutated / wonky features / strange proportions / "weird humans"
- No bald-creepy engineer, no shriveled pilot, no mutant inhabitant
- If face is visible, it must be HANDSOME or BEAUTIFUL

━━━ FORBIDDEN ━━━
- NO monumental scale / biblical awe / vertigo composition
- NO cathedral hangars / cargo bays the size of stadiums
- NO action set-pieces / combat / chase / explosion
- NO multi-person crowds (one person max in quarters/labs/galleys, 2-4 distant patrons OK in bars/lounges, often zero)
- NO cabin-on-Earth aesthetic — if a viewer can't tell this is in space within 2 seconds, the prompt fails
- NO weird / uncanny / ugly humans / off-putting figures (see INHABITANT PRESENCE section)
- NO first-person POV / hand-POV shots
- NO sensory-deprivation pods / cryo-pods / stasis tubes / hibernation chambers / floatation tanks
- NO naked / nude / shirtless / bare-chested / submerged / waist-deep figures
- NO Christ-pose / arms-outstretched / messianic / ritual-bath posing
- NO body horror: NO impossibly long fingers / elongated limbs / extra eyes / extra limbs / tentacled features / deformed proportions / gaunt skeletal figures / pale corpse complexion
- NO clinical / surgical / autopsy / operating-room aesthetic
- NO specimen jars / containment tanks with figures inside / clone vats / gene-vaults / preserved bodies
- NO cargo holds / storage lockers / corridors / hallways / maintenance shafts / crawlspaces / waiting rooms / airlock staging
- NO temple / shrine / cult / ritual chamber / meditation chamber / memorial / mausoleum
- NO industrial foundry / smelting bay / factory floor / forge room
- NO Earth-attic / basement / barn / shed / cellar aesthetic — never reads as terrestrial dwelling
- NO blanket forts / pillow forts / fabric tents / makeshift cardboard hideouts as the primary scene
- NO dim brown ambient rooms with nothing visually interesting — every render must have COLOR, LIGHT SOURCES, MATERIAL VARIETY, DEPTH, and at least one MOMENT-OF-WONDER detail
- NO plain / bland / sparse / minimal renders — the cozy should be RICH with personal lived-in details (mementos, plants, holo-displays, alien tech, glowing accents)

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 200)}

━━━ STRUCTURE — write 80-110 words ━━━
Open with the INTERIOR (the specific cozy space + its dominant warmth source). Layer in personal traces, lived-in details, ambient texture. If a cozy moment is active, render it as the focal point. ONE charming detail (something endearingly specific to the occupant). Painted-but-soft finish, warm color depth, intimate proximity — the viewer should want to CURL UP in this space.

Output ONLY the raw 80-110 word scene description. Comma-separated phrases. NO preamble, NO titles, NO headers, NO ━━━ or ═══ or ### markers, NO **bold labels**. Just the scene content.`;
};
