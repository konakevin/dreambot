/**
 * chibibot archetype templates — Sonnet brief composer functions.
 *
 * Each function takes the rolled slots + sharedDNA + vibeDirective and
 * returns the final brief string sent to Sonnet for polish.
 *
 * Auto-discovered by scripts/lib/archetypeRegistry.js.
 *
 * To add a new template: add an entry here + the matching archetype
 * definition in ./archetypes.js.
 */

// ── "Looks" axis (2026-06-07) ──────────────────────────────────────────────
// Returns a SHORT look-override header that leads the brief on look-enabled
// paths, telling Sonnet to open its Flux prompt with the rolled cute film/
// storybook style. Deliberately terse — ChibiBot's documented failure mode is
// that verbose prompt-top blocks push Flux to its generic "chibi-toy" centroid
// and flatten species/look. Reinforces the creatures-only guard (the film looks
// carry human-child priors). Returns '' when no look rolled (safe no-op).
// Prepend to a template's `return` string:
//   return `${lookOverride(sharedDNA)}You are writing …`
function lookOverride(sharedDNA) {
  if (!sharedDNA || !sharedDNA.lookRegister) return '';
  return `━━━ LOOK — open your Flux prompt with THIS rendering style (overrides any other style wording below) ━━━
${sharedDNA.lookRegister}
Lead your Flux prompt with these style tokens FIRST, then describe the scene below rendered in THIS style — it sets the medium/finish only. Keep the scene's composition exactly as written (whether a hero creature OR a village/landscape with creatures in it), the chibi proportions, and all rules. NO humans.

`;
}

module.exports = {
  CHIBIBOT_HEARTWARMING_SCENE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_1,
      creature_2,
      activity,
      setting,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const isGroup = !!creature_2;
    // phenomenon is template-gated at 60% — pool always picks (cheap), template
    // decides to render the section. Composer's conditionalLayer is already
    // used by creature_2 (70% group gate).
    const phenomenonFires = Math.random() < 0.6;

    const creatureBlock = isGroup
      ? `A SMALL GROUP (3-5) of adorable creatures together — led by: ${creature_1}, joined by: ${creature_2} and a few others. Different species, different sizes, all equally cute, doing the activity together.`
      : `${creature_1} — solo, doing something heart-melting.`;

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a HEARTWARMING CREATURE SCENE for ChibiBot — ${isGroup ? 'a little group of adorable creatures' : 'one adorable creature'} doing something heart-melting in a deliberately-chosen storybook setting at a deliberate time of day and weather${phenomenonFires ? ' with a magical phenomenon transforming the frame' : ''}. Viewer reaction: "OMG IT'S TOO CUTE." Output wraps with style prefix + suffix.

CORE RULES: Wholesome AWWW cuteness — big eyes, soft shapes, nothing dark or creepy. Render as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register (glossy subsurface-scattering, crisp form, dewy highlights); never photoreal or flat illustration; creatures at chibi proportions (oversized head, massive glassy eyes, tiny stubby body); settings + props in the same glossy register; let the MEDIUM tag set the style. Light honest to the time-of-day axis (NOT forced warm-golden). NO humans, faces, or hands — every subject is a creature; reimagine any human concept with the creature instead. CUTE-beautiful wall-poster charm.

━━━ THE CUTE CREATURE(S) ━━━
${creatureBlock}

━━━ THE HEART-MELTING ACTIVITY ━━━
${activity}

━━━ THE STORYBOOK SETTING (the stage) ━━━
${setting}

━━━ TIME OF DAY (drives light + color cast — render honestly) ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (drifting particles, ambient charm) ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail the eye finds AFTER the hero) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CUTENESS AMPLIFICATION ━━━
Stack cuteness: glossy dewy surfaces, volumetric glow tinted to match the time-of-day axis (NOT forced warm-golden), sparkles, a few storybook micro-details (tiny mushrooms, floating hearts, fairy-lights). For creatures add massive multi-catchlight eyes + fluffy textures + blush cheeks; for settings add dense magical detail, glowing windows at night/dusk, and blooming flora.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
${isGroup ? 'Mid-wide frame, 3-5 creatures doing the activity together — one leading, others reacting, varied heights and species.' : 'Mid-close frame with the creature as hero doing the activity inside the setting.'} The setting is unmistakable (name WHERE this happens). Time-of-day cast honest. Surprise element tucked where the eye finds it second.

Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_BATH_TIME: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_1,
      creature_2,
      creature_3,
      setting,
      lighting,
      set_decorations,
      signature_detail,
    } = slots;

    // Cast — composer's conditional layer rolls creature_2 + creature_3
    // together at 60%. We then drop creature_3 75% of the time it was rolled,
    // yielding ~40% solo / 45% pair / 15% trio.
    const includeCreature3 = !!creature_3 && Math.random() < 0.25;
    const cast = [creature_1, creature_2, includeCreature3 ? creature_3 : null].filter(Boolean);
    const castLine =
      cast.length === 1
        ? `Solo: ${cast[0]}`
        : cast.length === 2
          ? `Pair: ${cast[0]} and ${cast[1]}, sharing the bath together.`
          : `Trio: ${cast[0]}, ${cast[1]}, and ${cast[2]}, all in the bath together.`;

    const decorList = Array.isArray(set_decorations) ? set_decorations : [set_decorations];
    const decorLine = decorList.filter(Boolean).join('; ');

    return `${lookOverride(sharedDNA)}Write a 55-80 word Flux prompt for a ChibiBot bath-time render. Lead with the bath vessel and the cast IN it, then layer in the cozy detail and the signature flavor. Comma-separated phrases, no headers, no labels, no preamble — just the prompt text.

The bath:
${setting}

The cast (in the bath):
${castLine}

The lighting:
${lighting}

Two cozy decorations around the bath:
${decorLine}

The signature flavor — weave this specific micro-detail naturally into the scene:
${signature_detail}

Tone:
Warm wholesome bath-bliss — creatures soaking in foam and bubbles, soft cozy mood, AWWW + I want to hug them. ${vibeDirective.slice(0, 150)}

Output the 55-80 word prompt only.`;
  },

  CHIBIBOT_CUDDLY_AQUATIC: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_1,
      creature_2,
      interaction,
      setting,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    // phenomenon template-gated at 60%
    const phenomenonFires = Math.random() < 0.6;

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a CUDDLY AQUATIC scene for ChibiBot — a PAIR of impossibly cute baby aquatic creatures cuddling together in their underwater / surface-water habitat (sea otter pups holding paws, baby seals on ice, axolotl tea rooms). Pixar / Sanrio / Ghibli / Finding Nemo cuteness${phenomenonFires ? ', with a magical aquatic phenomenon transforming the frame' : ''}. Viewer reaction: "OMG THEY ARE TOO CUTE TOGETHER." Output wraps with style prefix + suffix.

CORE RULES: Wholesome pair-bliss — AWWW, nothing dark, no predator-prey, no sharks-with-teeth, no documentary deep-sea. Render as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register (glossy subsurface-scattering, dewy highlights); never photoreal or documentary; creatures at chibi proportions (oversized head, massive glassy eyes, stubby flippers/paws, blush cheeks, jelly-soft textures); coral/kelp/ice glossy-crisp + bright, never murky. Light honest to the time-of-day axis through the water (NOT forced warm-sunlit). NO humans, divers, or swimmers — the creatures own the underwater world.

━━━ STORY BEAT — render a MOMENT, not a pose ━━━
The interaction axis named a story beat — render it as a narrative event the viewer reads in 2 seconds (active verbs, a reaction, an object/event they're responding to). NOT two figurines posed nose-to-nose.

━━━ THE CUDDLY PAIR (both creatures ALWAYS present, equal prominence + sharpness) ━━━
${creature_1}
${creature_2}

━━━ THE CUDDLE INTERACTION (what they're doing TOGETHER right now) ━━━
${interaction}

━━━ THE AQUATIC HABITAT (the stage) ━━━
${setting}

━━━ TIME OF DAY (drives light + color cast — render honestly through the water) ━━━
${time_of_day}

━━━ WEATHER (affects surface scenes and water-clarity) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (drifting bubbles, plankton sparkles, caustics, ambient charm) ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail the eye finds AFTER the pair) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ CUTENESS AMPLIFICATION ━━━
Stack aquatic cuteness: jewel-iridescent rising bubble-trails, caustic light-play across creatures and habitat, plankton sparkles, glow tinted to match the time-of-day axis (NOT forced warm-golden). For the creatures: massive multi-catchlight eyes, jelly-soft/soaked-soft textures, blush cheeks, paws/flippers visibly INTERLOCKED. For the habitat: dense coral/kelp/anemone detail, glowing sea-features, dappled water-light.

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION (HABITAT IS A CO-HERO + PAIR IS THE HEART) ━━━
Pull the camera back so the viewer SEES the habitat (reef with coral towers, kelp cathedral, arctic ice-edge, lily-pad koi pond). Wider establishing frame: pair as focal point (40-50%), aquatic-habitat vista filling the rest. The two creatures clearly TOGETHER with visible contact, not separated. Viewer names BOTH what they're doing AND what habitat they're in at a glance. Surprise element tucked where the eye finds it second.

Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_NIGHT_MEADOW: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_1,
      creature_2,
      interaction,
      setting,
      time_of_night,
      prop,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;

    const propList = Array.isArray(prop) ? prop : [prop];
    const propBlock = propList
      .filter(Boolean)
      .map((p, i) => `${i + 1}. ${p}`)
      .join('\n');

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a NIGHT-MEADOW scene for ChibiBot — a PAIR of impossibly cute critters at twilight/night in a deliberate outdoor setting, under a specific time-of-night, with stacked cozy props${phenomenonFires ? ', and a magical celestial phenomenon transforming the frame' : ''}. Stargazing fox kits, fireflies in mason jars, comet-watching bunnies, moonlit picnics. Pixar/Sanrio/Ghibli/Beatrix-Potter-twilight aesthetic. Viewer reaction: "OMG IT'S TOO CUTE." Output wraps with style prefix + suffix.

CORE RULES: Wholesome cozy night — AWWW, never dark, scary, or haunted; moonlit darkness reads silver-magical. Render as polished 3D CGI in the designer-collectible / Pop-Mart-vinyl register (glossy subsurface-scattering, dewy highlights); never photoreal or flat illustration; creatures at chibi proportions (oversized head, massive star-catching eyes, stubby paws, blush cheeks lit by lantern/firefly); setting + props + sky in the same register; crisp pinpoint stars, jewel-bright fireflies. CREATURES ONLY — never a human of any kind (no children, babies, adults, faces, hands); a fae creature (fairy/sprite) is a cute big-eyed CREATURE with insect/leaf wings, never a human child with wings; reimagine any human concept with the creature instead.

━━━ HARD RULE: BOTH CREATURES VISIBLE — NEVER SOLO ━━━
The frame MUST show TWO distinct creatures, both readable, both engaged in the story-beat together — equal visual weight, never one reduced to a silhouette.

━━━ STORY BEAT — render a MOMENT, not a pose ━━━
The interaction axis named a story beat — render it as a narrative event the viewer reads in 2 seconds (active verbs, a reaction, an object/event they're responding to). NOT two figurines posed nose-to-nose.

━━━ THE CUDDLY PAIR (both creatures ALWAYS present, equal prominence + sharpness) ━━━
${creature_1}
${creature_2}

━━━ THE TWILIGHT INTERACTION (what they're doing TOGETHER right now) ━━━
${interaction}

━━━ THE OUTDOOR NIGHT SETTING (the stage) ━━━
${setting}

━━━ TIME OF NIGHT (drives sky color, moon phase, ambient luminance — render honestly) ━━━
${time_of_night}

━━━ STACKED COZY PROPS (TWO specific objects in the scene) ━━━
${propBlock}

━━━ WEATHER (clear night unless otherwise specified) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL (drifting fireflies, dewdrops, pollen-particles, ambient charm) ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail the eye finds AFTER the pair) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION (SKY + SETTING ARE CO-HEROES WITH THE PAIR) ━━━
Pull the camera back to show three layers: foreground creatures with their cozy props, midground setting (meadow/glade/cliff), background sky filling the upper half with full star-density + moon + phenomenon if firing. Mid-wide or wide establishing frame, both creatures clearly in contact, two props visible without crowding. The SKY-as-co-hero is what makes this a night-meadow, not a meadow.

Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_COZY_LANDSCAPE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      world,
      world_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;

    const detailList = Array.isArray(world_detail) ? world_detail : [world_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack this on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a COZY-LANDSCAPE scene for ChibiBot — a foreground CREATURE doing a story-driven activity with a cozy storybook world spanning behind them. Pixar / Studio Ghibli / Beatrix Potter painterly storybook aesthetic — a clear hero creature in the foreground, the rich world behind. Viewer reaction: "look at this little creature in this beautiful world — I want to live here." Output wraps with style prefix + suffix.

CORE RULES: "I want to live here" wholesome longing — inviting and adorable, never dark, abandoned, or haunted. Polished 3D CGI in the modern Pixar/Disney/DreamWorks register: soft subsurface-scattering, painterly bokeh, warm god-rays, jewel-bright saturation; creatures at chibi proportions (oversized head, big dewy eyes, stubby body); architecture stylized cute; flora glossy-crisp. NO humans of any kind — creatures only.

━━━ MANDATORY: OPEN WITH THE CREATURE ━━━
The output MUST open with the creature + activity (the foreground hero), THEN the world spanning behind — never world-first. e.g. "A yellow chibi chick walking a sunflower-bordered path with a tiny parcel, behind them a windmill village..." This ordering is non-negotiable.

━━━ STORY BEAT ━━━
The creature is mid-action doing something specific (carrying a parcel, watering flowers, kneading dough, mid-skip) — never posing nose-to-camera or staring blankly.

━━━ THE CREATURE (open the output describing THIS — foreground anchor, the hero) ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY (in the foreground) ━━━
${resident_activity}

━━━ THE COZY STORYBOOK WORLD (spans BEHIND the creature) ━━━
${world}

━━━ THREE WORLD DETAILS (populate the world behind with lived-in richness) ━━━
${detailBlock}

━━━ CUTENESS AMPLIFICATION ━━━
Stack cozy ambient effects: golden god-rays, warm window-glow, drifting motes tinted to time-of-day, sparkle/dewdrop highlights, chimney smoke, floating petals, reflections on wet stone, tiny glowing lanterns/fairy-lights.

━━━ TIME OF DAY (drives sky color + ambient light) ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail in the wider world) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION (creature foreground anchor + world behind) ━━━
WIDE or MID-WIDE establishing frame. The creature is the foreground anchor (the eye lands there first, 15-30% of frame — big enough to read, not so big the world disappears), midground holds the cozy world, background is atmospheric depth. The world spans behind, populated by the three details + light + weather + surprise element.

Open the output with: "[creature] [activity verb-phrase], [world spanning behind]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_RAINY_INTERIOR: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_group,
      group_activity,
      setting,
      setting_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(setting_detail) ? setting_detail : [setting_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const creatureList = Array.isArray(creature_group) ? creature_group : [creature_group];
    const creatureBlock = creatureList
      .filter(Boolean)
      .map((c, i) => `Friend ${i + 1}: ${c}`)
      .join('\n\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a GROUP-OF-FRIENDS rainy-day scene for ChibiBot — 2-4 adorable chibi friends playing TOGETHER outside in the rain (splashing, sharing umbrellas, sliding through mud in a chain). Calvin-and-Hobbes / Studio-Ghibli-kids-in-the-rain / Beatrix-Potter-group-romp aesthetic. Viewer reaction: "I want to be playing in the rain with my friends!" Output wraps with style prefix + suffix.

CORE RULES: Wholesome rainy-friendship joy — all friends happy, never shivering, scared, or sad; no storm-damage or distress. Polished 3D CGI in the modern Pixar/Disney/DreamWorks register: painterly subsurface-scattering, soft god-rays through rain, jewel-bright saturation; chibi proportions, big dewy eyes, blush cheeks; friends visibly different species/sizes. NO humans of any kind — creatures only.

━━━ HARD RULE: MULTIPLE FRIENDS PLAYING TOGETHER, OUTSIDE IN HEAVY RAIN — NEVER SOLO ━━━
The frame holds 2-4 chibi friends MID-INTERACTION (splashing, holding hands, sharing umbrella, pile-on, chain) — never a solo creature, never lined up posing. They are OUTDOORS in the rain (no indoor/sheltered scenes). The RAIN is a co-hero, visibly HEAVY across the whole frame: thick silver streaks, sheeting downpour, splash-pops on wet surfaces, rippling puddles, soaked dripping fur, atmospheric rain-haze. Pixar "Up" / Totoro bus-stop density — clearly heavy rain, not a drizzle.

━━━ CAPTURED MID-MOMENT — NEVER HEAD-ON PORTRAIT ━━━
Candid camera caught a fraction into the action: three-quarter, over-the-shoulder, low-angle, dutch-tilt, or action-side-profile. The friends interact with EACH OTHER and the rain, not the viewer.

━━━ STORY BEAT ━━━
Friends are mid-action (mid-splash, mid-mud-throw, mid-chain-slide, mid-pile-on, mid-laugh) — never posing or static.

━━━ THE GROUP OF FRIENDS (THREE chibi friends, all present) ━━━
${creatureBlock}

━━━ THE GROUP ACTIVITY (what they're doing TOGETHER right now) ━━━
${group_activity}

━━━ THE OUTDOOR RAINY SETTING (the wet stage) ━━━
${setting}

━━━ THREE RAINY-SETTING DETAILS (wet lived-in richness) ━━━
${detailBlock}

━━━ CUTENESS AMPLIFICATION ━━━
Stack wet-cozy effects: visible falling rain (silver streaks, slow-mo fat drops), gleaming wet surfaces, splash-crowns between friends, rippling puddles, drips from umbrellas/eaves, low drifting mist, wet bokeh, cool blue-grey overcast ambient with warm rim-light pops from raincoats/boots.

━━━ TIME OF DAY (drives ambient light through rain) ━━━
${time_of_day}

━━━ WEATHER (rain is the baseline — this axis adds nuance) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION (group mid-fun in rain) ━━━
THREE-QUARTER or OVER-SHOULDER, never head-on. Friends visibly INTERACTING with each other, not lined up facing the viewer. Three-act depth: foreground friends mid-action, midground wet setting, background rain/mist. Rain falling everywhere.

Open with: "[Three chibi friends / A pair and a third] [shared activity verb-phrase IN the rain], at/on/in [outdoor setting], rain visibly streaking..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_RAINY_DAY_COZY: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature_group,
      huddle_activity,
      shelter,
      detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(detail) ? detail : [detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const creatureList = Array.isArray(creature_group) ? creature_group : [creature_group];
    const creatureBlock = creatureList
      .filter(Boolean)
      .map((c, i) => `Friend ${i + 1}: ${c}`)
      .join('\n\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a GROUP-COZY-SHELTER scene for ChibiBot rainy-day-cozy — 2-4 adorable chibi friends huddled TOGETHER in a cozy outdoor shelter (mushroom cap / porch / under umbrella / hollow log) while RAIN visibly falls around them (sharing cocoa, wrapped in blankets, piled together). Totoro bus-stop / Charlie-Brown-Snoopy-huddle aesthetic. Viewer reaction: "I want to be huddled in that shelter with my friends!" Output wraps with style prefix + suffix.

CORE RULES: Wholesome rainy-day-friendship — friends happy, warm, content, never shivering or sad. Modern Pixar/Disney/DreamWorks CGI: painterly subsurface-scattering, warm god-rays from shelter lights, painterly bokeh; chibi proportions; friends visibly different species/sizes. NO humans of any kind — creatures only.

━━━ HARD RULE: MULTIPLE FRIENDS HUDDLED TOGETHER, SHELTERED, RAIN VISIBLE AROUND — NEVER SOLO ━━━
2-4 chibi friends visibly together IN the cozy shelter, INTERACTING (sharing cocoa, shared blanket, pile-on, heads stacked sleeping) — never solo, never lined up posing. They stay dry inside the outdoor shelter; the RAIN visibly falls AROUND it (silver streaks beyond the edge, water dripping from roof/eaves/umbrella-tip, wet world beyond). The contrast is the magic: warm-amber inside vs cool-blue-grey wet beyond.

━━━ CAPTURED COZY-INTIMATE MOMENT — NEVER HEAD-ON PORTRAIT ━━━
Three-quarter, over-shoulder, side-profile, or dutch-tilt — friends interacting with EACH OTHER, not the camera. Mid-cozy-moment (sipping cocoa, mid-laugh, mid-yawn, mid-blanket-wrap), never posing or static.

━━━ THE GROUP OF FRIENDS (THREE chibi friends, all present) ━━━
${creatureBlock}

━━━ THE COZY-HUDDLE ACTIVITY (what they're doing TOGETHER in the shelter) ━━━
${huddle_activity}

━━━ THE COZY SHELTER (the warm pocket in the rainy world) ━━━
${shelter}

━━━ THREE COZY-SHELTER DETAILS (props that make it feel lived-in) ━━━
${detailBlock}

━━━ CUTENESS AMPLIFICATION ━━━
Stack the warm-inside/cool-outside contrast: warm amber/honey glow inside (lantern, candles, mug-steam catching light), cool blue-grey rain falling AROUND the shelter, drips streaming from eaves/umbrella into rippling puddles, soft warm bokeh inside, wet gleaming surfaces just beyond, shelter-glow reflected in puddles.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION (friends inside shelter + rain visible around) ━━━
THREE-QUARTER or OVER-SHOULDER. Friends in foreground/midground INSIDE the shelter (warm amber light pooling on them, cozy intimacy). Shelter edge visible (umbrella rim / porch eaves / mushroom cap). Rainy world visible beyond (streaks, wet ground, puddles, dim blue-grey). Warm inside vs cool outside.

Open with: "[Three chibi friends / A pair and a third] [cozy-huddle verb-phrase IN the shelter], inside [shelter], rain visibly falling around them..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_SLEEPY_NAPTIME: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      sleep_pose,
      nap_spot,
      detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(detail) ? detail : [detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (gentle event drifting around the sleeper) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a SLEEPY-NAPTIME scene for ChibiBot — ONE adorable chibi creature dozing in an impossibly cozy nap-spot. Peak-cute peaceful sleeping moment. Viewer reaction: "shhh don't wake it." Pixar / Ghibli / Beatrix-Potter / sleeping-puppy-cute aesthetic. Output wraps with style prefix + suffix.

CORE RULES: Maximum cute = peaceful sleeping animal, the viewer melts; never scary, sad, or nightmare. Modern Pixar CGI: painterly subsurface-scattering, warm drowsy god-rays, painterly bokeh; chibi proportions; closed/half-lidded eyes (NEVER big bright open eyes — this is SLEEPING). NO humans of any kind — creatures only.

━━━ HARD RULES — SOLO + ASLEEP + INTIMATE ANGLE ━━━
ONE creature only — never a pair or group sharing the nap-spot (tiny background creatures in their OWN separate spot are fine). The creature is ACTIVELY ASLEEP — eyes closed/half-lidded, body relaxed in the specified pose, not awake or looking at camera (Zzz / dream-bubbles optional). NEVER head-on portrait — side-profile, over-the-shoulder peek, top-down, or three-quarter-from-above; the viewer gently observes, not stared at.

━━━ THE SLEEPING CREATURE ━━━
${creature}

━━━ THE SLEEPING POSE (captured mid-nap) ━━━
${sleep_pose}

━━━ THE IMPOSSIBLY COZY NAP-SPOT ━━━
${nap_spot}

━━━ THREE COZY-PERSONAL-ACCENTS — the sleeper's favorite things, ALL THREE visibly rendered (favorite stuffed animal, patterned blanket, candle-jar, open storybook) — make the scene feel full and personal ━━━
${detailBlock}

━━━ CUTENESS AMPLIFICATION ━━━
Stack drowsy effects: warm amber light pooling on the sleeper, soft dust-motes in light beams, a dream-bubble/Zzz, soft fluff and cozy blanket-detail, pillow indentation, soft heavy-DOF bokeh, tiny glowing candle/lantern accents, one signature dream-detail (paw-twitch, ear-flick, smile-in-sleep).

━━━ TIME OF DAY (drowsy / golden / candlelit) ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (gentle detail that doesn't wake the sleeper) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION (mid-close on sleeping creature in cozy nap-spot) ━━━
MID-CLOSE with the SLEEPING CREATURE filling 40-60% of the frame, the cozy nap-spot wrapping around them. Side-profile / over-shoulder peek / top-down / three-quarter-from-above — NEVER head-on. Warm drowsy light pools on the sleeper, soft-blur background, three nap-details visible, surprise element tucked elsewhere.

Open with: "[creature] [sleep-pose verb-phrase], curled inside/on [nap-spot], [drowsy lighting]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_COZY_INTERIOR: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      room,
      room_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(room_detail) ? room_detail : [room_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a COZY-INTERIOR scene for ChibiBot — an UNEXPECTED chibi-scale cozy interior (often INSIDE a real object — teacup, music-box, piano) with a tiny creature doing a story-driven cozy activity. Pixar / Ghibli / Howl-Moving-Castle / Beatrix-Potter painterly storybook aesthetic. Viewer reaction: "WAIT — they live INSIDE a teacup?? And look how cozy this room is!" Output wraps with style prefix + suffix.

CORE RULES: "I want to live in this room" wholesome cottagecore longing. Modern Pixar CGI: painterly subsurface-scattering, warm god-rays, painterly bokeh; chibi proportions. NO humans of any kind — creatures only. The creature is mid-action (stirring, pouring, reading, knitting), never posing.

━━━ ⚠ HARD RULE #1: WIDE-SHOT ROOM IS THE HERO + CREATURE MUST BE VISIBLE (NEVER EMPTY) ━━━
Camera pulled back, wide-shot establishing the whole cozy room — architecture/furniture/details fill 75-85% of the frame; the creature is a small 10-20% anchor tucked in a SPECIFIC spot (corner armchair, window-seat, bed-nook) but unambiguously present ("OH THERE'S THE LITTLE GUY"). NOT a centered portrait, close-up, or chest-up crop — and NOT an empty room. The creature MUST appear in the brief, named + placed + doing their activity within the FIRST 30 WORDS (never "the resident" abstractly). Failed if the room is described without the creature visibly present.

━━━ ⚠ HARD RULE #2: REAL-OBJECT-AS-HOME — THE OBJECT *IS* THE ARCHITECTURE ━━━
This is the path's signature. When the room is a real object, you write the INTERIOR of the object viewed from INSIDE it — the object's curved walls ARE the room's walls, there is no separate room around it. Describe the object-as-architecture EXPLICITLY so the viewer instantly recognizes it. e.g. a TEACUP (curved porcelain wall arcs around, saucer is the floor, the giant handle arches overhead like an archway), a MUSIC-BOX (velvet-lined curved walls, brass winding-gears in the ceiling, lid is the sky), or a PUMPKIN (ribbed translucent walls glow, seeds dangle like chandeliers, the carved face is the window). When the room is instead a purpose-built chibi-dwelling (mushroom-house, treehouse, hobbit-hole), the same wide-shot rule applies — architecture is the hero, chibi-scale sold by tiny-furniture proportions.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S COZY ACTIVITY ━━━
${resident_activity}

━━━ THE COZY ROOM ━━━
${room}

━━━ THREE ROOM DETAILS (populate the room with lived-in richness) ━━━
${detailBlock}

━━━ COZY DENSITY ━━━
The room is densely lived-in, never sparse — every surface has cozy-domestic stuff on it (stacked books, trailing plants, knit textiles, a steaming teapot, warm lamps, framed mementos), so the viewer keeps finding new details.

━━━ CUTENESS AMPLIFICATION ━━━
Stack cozy-interior effects: warm-amber lamp/fireplace/candle glow pooling across surfaces, steam wisps from teapots, dust motes in light beams, reflections in polished surfaces, knit/quilt texture, windowsill-plant shadows, tiny fairy-light accents, a warm golden-center-to-blue-edge gradient.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER (affects what's visible through windows) ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION (WIDE INTERIOR ESTABLISHING — ENFORCE) ━━━
WIDE INTERIOR ESTABLISHING SHOT, camera pulled WAY back to capture the entire room — room/architecture/furniture fills 80-90% of the frame, the creature a TINY 5-15% anchor tucked somewhere (not centered, not a portrait, not a close-up). The eye reads ROOM FIRST then discovers the creature. Three room-details across the space, surprise element tucked elsewhere. HARD BAN: portrait/chest-up crops, creature over 20% of frame, centered close-ups.

If a REAL-OBJECT-AS-HOME, open with: "Wide-shot from INSIDE a giant [object] — curved [material] walls arc around, [object-bottom] is the floor, [object-feature] overhead — and tucked [specific spot] is [tiny creature] [cozy activity]..." If a purpose-built chibi-dwelling, open with: "Wide-shot interior of a chibi-scale [dwelling], and tucked [specific spot] is [tiny creature] [cozy activity]..." The CREATURE must appear by word 30 — never an empty room.

Then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_OUTDOOR_ADVENTURE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      adventure_activity,
      wilderness_setting,
      wilderness_detail,
      adventure_prop,
      time_of_day,
      surprise_element,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const detailList = Array.isArray(wilderness_detail) ? wilderness_detail : [wilderness_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${lookOverride(sharedDNA)}You are writing an OUTDOOR-ADVENTURE scene for ChibiBot — a SOLO chibi creature out in the WILD/OPEN WORLD doing an adventurous activity. Pure wilderness — NO villages, architecture, or cottages. Studio Ghibli wilderness / Pokemon-overworld / Pixar-adventure painterly storybook aesthetic. Viewer reaction: "look at that little adventurer!" Output wraps with style prefix + suffix.

CORE RULES: Wholesome adventure wonder, nothing dark. Modern Pixar CGI: painterly subsurface-scattering, warm volumetric light, painterly bokeh; chibi proportions. NO humans of any kind — creatures only, in adventure gear.

━━━ ⚠ HARD RULES — WILDERNESS-ONLY + ADVENTURE-POSE + CREATURE-FIRST ━━━
The setting is PURE WILDERNESS (forest, mountain, cave, canyon, river, cliff, lake, desert, glacier, waterfall) — just nature, NO cottages/buildings/huts/village (those are other paths). The creature is MID-ACTION in an adventure pose (climbing, wading, mid-leap, cresting a ridge, peeking over a cliff-edge), never posing-still or just-sitting. The output OPENS with the creature + adventure-activity IN the setting (creature-first, wilderness the second hero), e.g. "A chibi fox-creature mid-leap across mossy stepping-stones over a forest stream, behind them a fern-glade with sunbeams piercing the canopy..."

━━━ THE CHIBI CREATURE ━━━
${creature}

━━━ THE ADVENTURE ACTIVITY ━━━
${adventure_activity}

━━━ THE WILDERNESS SETTING ━━━
${wilderness_setting}

━━━ THREE WILDERNESS DETAILS (lived-in nature richness) ━━━
${detailBlock}

━━━ ADVENTURE PROP (worn or held — small charm) ━━━
${adventure_prop}

━━━ SURPRISE ELEMENT (tucked-away detail) ━━━
${surprise_element}

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ CUTENESS AMPLIFICATION ━━━
Stack wilderness effects: volumetric god-rays through trees/mist, dewdrops on leaves and mossy stone, drifting petals/pollen, reflections on water/wet-stone, layered atmospheric depth (sharp foreground to hazy distance), tiny glowing details (mushroom-glow, sparkle-on-water), wind-tousled vegetation, catchlight in the creature's eyes.

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION (MID-WIDE adventure shot — wilderness + small creature) ━━━
MID-WIDE. Wilderness landscape fills 50-70% of the frame; the creature is small-to-medium (15-30%) mid-adventure-pose somewhere in it. The scale-contrast of vast nature vs tiny adventurer is the emotional hook. NOT close-up, portrait, or full establishing-shot — a balanced mid-wide adventure-shot, three depth-layers visible.

Open with: "[creature] [adventure-activity verb-phrase] in/across/through [wilderness], [time-of-day lighting]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_CREATURE_PORTRAIT: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      pose,
      expression,
      portrait_feature,
      outfit,
      accessory,
      set_decoration,
      background_mood,
      time_of_day,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const featureList = Array.isArray(portrait_feature) ? portrait_feature : [portrait_feature];
    const featureBlock = featureList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const decorList = Array.isArray(set_decoration) ? set_decoration : [set_decoration];
    const decorBlock = decorList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');

    return `${lookOverride(sharedDNA)}You are writing a CHIBI CREATURE PORTRAIT for ChibiBot — a tight close-up of ONE impossibly cute creature filling the frame, MAXED with a cute outfit, accessory, and scattered set-decorations. The viewer cannot look away. Pixar / Sanrio / Pop-Mart designer-vinyl meets storybook-illustration. Output wraps with style prefix + suffix.

CORE RULES: Wallpaper-worthy CUTE-beautiful. NO humans of any kind — creatures only.

━━━ ⚠ HARD RULE #1: SOLO CREATURE FILLS THE FRAME ━━━
ONE creature only — never a pair, duo, or group. The creature is the SOLO hero filling 60-80% of the frame: tight head-and-shoulders, paws-up-to-cheeks close-up, or mid-close 3/4-body crop. NOT a wide-shot, establishing-shot, or tiny anchor with a village behind. Background is a soft dreamy bokeh-blur (~20-30%), never competing. The viewer's eye is LOCKED on the cuteness.

━━━ ⚠ HARD RULE #2: HYPER-CUTE PROPORTIONS ━━━
Impossibly round and soft: oversized glistening multi-catchlight eyes (half the face), tiny stubby paws, marshmallow/mochi body, exaggerated head-to-body ratio (head 50-60% of volume), mandatory rosy blush cheeks, tiny pink nose, cute round ears.

━━━ ⚠ HARD RULE #3: MAX THE SPICE — VISIBLE OUTFIT + ACCESSORY + 3 SET DECORATIONS ━━━
Not minimalist. Every render shows a visible cute OUTFIT on the creature, a visible held/worn ACCESSORY, and three scattered SET-DECORATIONS in the soft-bokeh foreground around it (see slots below). Abundant and layered — the creature is the hero but the frame is FULL of cute supporting elements.

━━━ THE CHIBI CREATURE ━━━
${creature}

━━━ POSE — what the creature is doing ━━━
${pose}

━━━ EXPRESSION — emotional state ━━━
${expression}

━━━ TWO PORTRAIT FEATURES (amplify the cuteness on the creature's body) ━━━
${featureBlock}

━━━ ⚠ CUTE OUTFIT (creature is WEARING this — make it visible) ━━━
${outfit}

━━━ ⚠ ACCESSORY (visible held or worn on the creature) ━━━
${accessory}

━━━ ⚠ THREE SCATTERED SET-DECORATIONS (foreground or floating around the creature, in the soft-bokeh-blur) ━━━
${decorBlock}

━━━ BACKGROUND MOOD (soft dreamy bokeh, NOT a setting) ━━━
${background_mood}

━━━ TIME OF DAY (sets the lighting register) ━━━
${time_of_day}

━━━ CUTENESS AMPLIFICATION ━━━
Stack portrait effects: soft subsurface-scattering on fur/plush, backlit rim-light catching the silhouette, warm multi-catchlight in both glassy eyes, floating sparkle-particles (petals/pollen/pastel-confetti), pearlescent micro-highlights, rosy mochi-blush, pretty pastel bokeh-orbs in the deep background, soft-focus pull (creature SHARP, background MELTED).

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ WEATHER (subtle hint via bokeh — not a setting) ━━━
${weather}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
TIGHT CLOSE-UP or MID-CLOSE PORTRAIT, creature fills 60-80%, centered or rule-of-thirds. Background a soft dreamy bokeh-melt (pretty colors, not a recognizable setting). The creature is WEARING the outfit and HOLDING/WEARING the accessory; set-decorations scattered in the soft-bokeh foreground or floating around it. NOT a tiny creature with village behind, NOT an establishing shot. SOLO only.

Open with: "[solo creature, impossibly-cute proportions] [pose + expression], wearing [outfit], with [accessory], [portrait features], surrounded by [scattered set-decorations in soft bokeh], dreamy [background-mood] background, [time-of-day lighting]..." The outfit + accessory + 3 decorations MUST appear. Then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_AQUATIC_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a COZY AQUATIC-VILLAGE scene for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy underwater/coastal village spanning behind them. Studio Ghibli / Ponyo / Atlantis / Finding-Nemo painterly storybook aesthetic. Viewer reaction: "I want to live in that village." Output wraps with style prefix + suffix.

CORE RULES: "I want to live in that village" wholesome longing. Modern Pixar CGI: painterly subsurface-scattering, painterly bokeh; chibi proportions. The creature is mid-action, never posing. NO humans of any kind — creatures only.

━━━ ⚠ HARD RULE #1: VILLAGE FILLS THE FRAME, CREATURE IS A SMALL SCALE-PROVER, OPEN WITH THE CREATURE ━━━
WIDE ESTABLISHING SHOT — the aquatic-village architecture (coral-towers, kelp-cottages, pearl-shell buildings, submarine-port, lily-pad platforms) fills 70-85% of the frame across foreground/midground/background. The SOLO creature is a SMALL anchor (8-15%) — the eye reads the WHOLE VILLAGE first, then discovers the tiny creature. HARD BAN: creature over 20% of frame, portrait/chest-up crops, centered close-ups. The output OPENS with the creature + activity, THEN the village behind, e.g. "A chibi seahorse mid-drift past a pearl-bead lantern-post, behind them a coral-tower village glowing pink-and-violet through teal water..."

━━━ ⚠ HARD RULE #2: WATER MUST READ INSTANTLY ━━━
Underwater or coastal, the OCEAN-BIOME must read at a 1-second glance — not "a village with coral accents." Water fills the lower half or background (or the whole frame is submerged); a cool teal/cyan/aqua palette dominates (warm-amber only as tiny cottage-window accent points); visible ocean-signatures — bubble-streams, fish-schools, water-caustic dapple on every surface, swaying kelp, bioluminescent coral-glow. Failed if a viewer can't immediately tell it's aquatic.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE AQUATIC-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE AQUATIC-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ VILLAGE DENSITY ━━━
Densely lived-in, never a sparse postcard — many buildings at varying depths with evidence of routine (lantern-posts, market crates, laundry-lines, propped boats), so the viewer keeps finding new details.

━━━ CUTENESS AMPLIFICATION ━━━
Stack cozy-aquatic effects: drifting fish-schools in the deep background, rising bubble-streams, sun-shafts dappling through water onto the village, bioluminescent coral/kelp/lantern glow, pearl-shimmer, drifting kelp-fronds, water-caustic light on every surface, distant jellyfish silhouettes, tiny starfish tucked into architecture.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
WIDE ESTABLISHING SHOT, camera pulled WAY back — aquatic-village fills 70-85% across foreground/midground/background, the creature a SMALL 8-15% scale-prover (not close-up, not centered portrait). Eye reads VILLAGE FIRST, then the tiny creature. Three village-details across the architecture, surprise element tucked in the deep midground.

Open with: "[creature] [activity verb-phrase], [aquatic-village] spanning behind, [biome lighting]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_COTTAGECORE_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a COZY COTTAGECORE-VILLAGE scene for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy English-countryside cottagecore village spanning behind them. Studio Ghibli / Howl-Moving-Castle / Beatrix-Potter / Whisper-of-the-Heart painterly storybook aesthetic. Viewer reaction: "I want to live in that village." Output wraps with style prefix + suffix.

CORE RULES: "I want to live in that village" wholesome longing. Modern Pixar CGI: painterly subsurface-scattering, painterly bokeh; chibi proportions. The creature is mid-action, never posing. NO humans of any kind — creatures only.

━━━ ⚠ HARD RULE #1: VILLAGE FILLS THE FRAME, CREATURE IS A SMALL SCALE-PROVER, OPEN WITH THE CREATURE ━━━
WIDE ESTABLISHING SHOT — the cottagecore-village architecture (thatched-roof cottages, windmills, lavender-field cottages, wisteria-tunnels, cobblestone lanes, stone-bridges) fills 70-85% of the frame across foreground/midground/background. The SOLO creature is a SMALL anchor (8-15%) — the eye reads the WHOLE VILLAGE first, then discovers the tiny creature. HARD BAN: creature over 20% of frame, portrait/chest-up crops, centered close-ups. The output OPENS with the creature + activity, THEN the village behind, e.g. "A chibi rabbit-child mid-skip down a cobblestone lane carrying a basket of wildflowers, behind them a thatched-roof cottage cluster in a lavender field..."

━━━ ⚠ HARD RULE #2: LUSH-GREEN COTTAGECORE COUNTRYSIDE ━━━
Lush-green Beatrix-Potter cottagecore — thatched roofs, half-timbered walls, stone-bridges, climbing roses, lavender-fields, apple-orchards, wisteria-tunnels. Always lush green / flower-laden / warm summer-into-early-autumn. NEVER snow, underwater, or tropical.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE COTTAGECORE-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE COTTAGECORE-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ VILLAGE DENSITY ━━━
Densely lived-in, never a sparse postcard — many cottages at varying depths with evidence of routine (window-box blooms, laundry-lines, market crates, propped bicycle), so the viewer keeps finding new details.

━━━ CUTENESS AMPLIFICATION ━━━
Stack cozy-cottagecore effects: golden-hour glow across the village, climbing garden-roses, wisteria/cherry-blossom petal-drift, honeybees and butterflies, wildflower-meadow carpet, window-box blooms, warm cottage-smoke from stone chimneys, moss-weathered pavement, lace-curtains with warm interior glow, hanging laundry in soft pastels.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
WIDE ESTABLISHING SHOT, camera pulled WAY back — cottagecore-village fills 70-85% across foreground/midground/background, the creature a SMALL 8-15% scale-prover (not close-up, not centered portrait). Eye reads VILLAGE FIRST, then the tiny creature. Three village-details across the architecture, surprise element tucked in the deep midground.

Open with: "[creature] [activity verb-phrase], [cottagecore-village] spanning behind, [biome lighting]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_SUNNY_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a COZY SUNNY-VILLAGE scene for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy Mediterranean / sun-drenched village spanning behind them. Studio Ghibli / Kiki-Delivery-Service / Porco-Rosso / Luca painterly storybook aesthetic. Viewer reaction: "I want to live in that village." Output wraps with style prefix + suffix.

CORE RULES: "I want to live in that village" wholesome longing. Modern Pixar CGI: painterly subsurface-scattering, painterly bokeh; chibi proportions. The creature is mid-action, never posing. NO humans of any kind — creatures only.

━━━ ⚠ HARD RULE #1: VILLAGE FILLS THE FRAME, CREATURE IS A SMALL SCALE-PROVER, OPEN WITH THE CREATURE ━━━
WIDE ESTABLISHING SHOT — the sunny-village architecture (bougainvillea-clad cottages, white-cottages on cliffs, terracotta-roof clusters, Santorini cliff-villages, olive-grove villages) fills 70-85% of the frame across foreground/midground/background. The SOLO creature is a SMALL anchor (8-15%) — the eye reads the WHOLE VILLAGE first, then discovers the tiny creature. HARD BAN: creature over 20% of frame, portrait/chest-up crops, centered close-ups. The output OPENS with the creature + activity, THEN the village behind, e.g. "A chibi cat-creature mid-step down a Santorini cliff-village stair with a basket of lemons, behind them white-cottages cascading toward a blue Aegean sea..."

━━━ ⚠ HARD RULE #2: BRIGHT MEDITERRANEAN SUN-DRENCHED ━━━
White-washed walls, terracotta-roofs, bougainvillea-cascade, cliff-side perches over blue sea, palm-trees, olive-groves, sun-bleached pastels — Studio Ghibli Luca / Porco-Rosso. Always warm summer-light, NEVER overcast or snow.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE SUNNY-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE SUNNY-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ VILLAGE DENSITY ━━━
Densely lived-in, never a sparse postcard — many cottages at varying depths with evidence of routine (potted geraniums on steps, laundry between balconies, market crates, vines on walls), so the viewer keeps finding new details.

━━━ CUTENESS AMPLIFICATION ━━━
Stack cozy-sunny effects: golden-hour warmth on white-washed walls, bougainvillea petal-drift, palm-shadows dappling stone-pavement, sun-bleached painterly weathering, washing on clotheslines in soft pastels, sunflower/geranium pots on terracotta steps, distant blue sea behind cliff villages, grape/ivy vines on walls, olive-tree silhouettes in soft haze.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
WIDE ESTABLISHING SHOT, camera pulled WAY back — sunny-village fills 70-85% across foreground/midground/background, the creature a SMALL 8-15% scale-prover (not close-up, not centered portrait). Eye reads VILLAGE FIRST, then the tiny creature. Three village-details across the architecture, surprise element tucked in the deep midground.

Open with: "[creature] [activity verb-phrase], [sunny-village] spanning behind, [biome lighting]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_TWILIGHT_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a COZY TWILIGHT-VILLAGE scene for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy twilight / lantern-lit / firefly-magic village spanning behind them. Studio Ghibli / Spirited-Away / Tangled-lanterns painterly storybook aesthetic. Viewer reaction: "I want to live in that village." Output wraps with style prefix + suffix.

CORE RULES: "I want to live in that village" wholesome longing. Modern Pixar CGI: painterly subsurface-scattering, painterly bokeh; chibi proportions. The creature is mid-action, never posing. NO humans of any kind — creatures only.

━━━ ⚠ HARD RULE #1: VILLAGE FILLS THE FRAME, CREATURE IS A SMALL SCALE-PROVER, OPEN WITH THE CREATURE ━━━
WIDE ESTABLISHING SHOT — the twilight-village architecture (lantern-lane cottages, firefly-meadow cottages, moonlit-bridge towns, paper-lantern-festival villages, moonflower-meadow villages) fills 70-85% of the frame across foreground/midground/background. The SOLO creature is a SMALL anchor (8-15%) — the eye reads the WHOLE VILLAGE first, then discovers the tiny creature. HARD BAN: creature over 20% of frame, portrait/chest-up crops, centered close-ups. The output OPENS with the creature + activity, THEN the village behind, e.g. "A chibi raccoon mid-walk down a lantern-lit lane with a paper-lantern on a stick, behind them a paper-lantern village spilling warm-amber against deep-violet dusk sky..."

━━━ ⚠ HARD RULE #2: TWILIGHT / DUSK / LANTERN-LIT MAGIC-HOUR ━━━
Dusk / blue-hour / lantern-lit-night — warm-amber lantern-glow, paper-lantern-strings, firefly-trails, moonlit rim-light dominate; sky deep-violet-blue or magenta-dusk. NEVER bright noon or overcast-gray; first stars/fireflies/lanterns lit.

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE TWILIGHT-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE TWILIGHT-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ VILLAGE DENSITY ━━━
Densely lived-in, never a sparse postcard — many cottages at varying depths with evidence of routine (lit candle-windows, strung lanterns, market stalls, garlands), so the viewer keeps finding new details.

━━━ CUTENESS AMPLIFICATION ━━━
Stack cozy-twilight effects: warm-amber lantern-glow from paper-lanterns/candle-windows, drifting firefly-trails, moonlit rim-light on architecture, deep-violet-blue/magenta dusk sky, strung paper-lanterns, starlit haze, soft purple-blue shadows against warm light, low twilight-mist, distant glowworms, lantern-light reflected on canals/wet-stone.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
WIDE ESTABLISHING SHOT, camera pulled WAY back — twilight-village fills 70-85% across foreground/midground/background, the creature a SMALL 8-15% scale-prover (not close-up, not centered portrait). Eye reads VILLAGE FIRST, then the tiny creature. Three village-details across the architecture, surprise element tucked in the deep midground.

Open with: "[creature] [activity verb-phrase], [twilight-village] spanning behind, [biome lighting]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_ARCTIC_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a COZY ARCTIC-VILLAGE scene for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy snow/ice/arctic village (snow-cottage rows, igloo clusters, log-cabins under aurora, mountain-chalets, fishing-villages on frozen lakes) spanning behind them. Studio Ghibli / Frozen / Polar-Express painterly storybook aesthetic. Viewer reaction: "I want to live in that snow-village." Output wraps with style prefix + suffix.

CORE RULES: Always WARM-cozy despite the cold biome — warm amber window-glow beats the cold exterior; never grim or bleak. Modern Pixar CGI: painterly subsurface-scattering on snow, warm window-light + aurora shimmer, painterly bokeh; chibi proportions. The creature is mid-action, never posing. NO humans of any kind — creatures only, bundled in wool/knit winter-wear.

━━━ HARD RULE #1: VILLAGE FILLS THE FRAME, CREATURE IS A SMALL SCALE-PROVER, OPEN WITH THE CREATURE ━━━
WIDE ESTABLISHING SHOT — the arctic-village architecture (cottages, igloos, log-cabins, snow-fortresses, lantern-posts) fills 70-85% of the frame across foreground/midground/background, pine-trees or snowy-mountains framing. The SOLO creature is a SMALL anchor (8-15%) on a snow-path, crossing a frozen-bridge, or on a porch — the eye reads the WHOLE VILLAGE first, then discovers the tiny creature. HARD BAN: creature over 20% of frame, portrait/chest-up crops, centered close-ups. The output OPENS with the creature + activity, THEN the village behind, e.g. "A chibi snow-fox kit mid-trot across a frozen-bridge with a knit-scarf trailing, behind them a snow-cottage village with warm-amber window-glow nestled in pine-trees..."

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE ARCTIC-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE ARCTIC-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ VILLAGE DENSITY ━━━
Densely lived-in, never a sparse postcard — many cabins at varying depths with evidence of routine (lit candle-windows, wood-stacks, sleds, garlands, paw-print trails), so the viewer keeps finding new details.

━━━ STORY BEAT ━━━
The creature is mid-action — pulling a sled, shoveling snow, carrying firewood, lighting a lantern — never posing.

━━━ CUTENESS AMPLIFICATION ━━━
Stack cozy-arctic effects: warm-amber window-glow pouring into the snow from every cabin, optional aurora-violet/teal shimmer (~50% of renders), sparkly fresh-snow texture, chimney-smoke, frost-crystals, fairy-light strands between cottages, drifting snowflakes in warm window-rays, paw-print trails, pine-bough wreaths, village-lights reflected on a frozen pond.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
WIDE ESTABLISHING SHOT, camera pulled WAY back — arctic-village fills 70-85% across foreground/midground/background (pine-trees or snowy-mountains framing), the creature a SMALL 8-15% scale-prover on a snow-path/frozen-bridge/porch (not close-up, not centered portrait). Eye reads VILLAGE FIRST, then the tiny creature. Three village-details across the architecture, surprise element tucked in the deep midground.

Open with: "[creature] [arctic-activity verb-phrase], [arctic-village] spanning behind, [snow/aurora/window-glow lighting]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },

  CHIBIBOT_JUNGLE_VILLAGE: ({ slots, sharedDNA, vibeDirective }) => {
    const {
      creature,
      resident_activity,
      village,
      village_detail,
      time_of_day,
      surprise_element,
      phenomenon,
      lighting,
      atmosphere,
      weather,
    } = slots;
    const phenomenonFires = Math.random() < 0.6;
    const detailList = Array.isArray(village_detail) ? village_detail : [village_detail];
    const detailBlock = detailList
      .filter(Boolean)
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const phenomenonBlock = phenomenonFires
      ? `\n\n━━━ ENVIRONMENTAL PHENOMENON (stack on top of everything else) ━━━\n${phenomenon}`
      : '';

    return `${lookOverride(sharedDNA)}You are writing a COZY JUNGLE-VILLAGE scene for ChibiBot — a SOLO foreground creature doing a story-driven activity with a cozy rainforest village (treehouses, mushroom-houses, vine-bridges, canopy platforms, market plazas) spanning behind them. Studio Ghibli / Encanto / Pandora-village painterly storybook aesthetic. Viewer reaction: "I want to live in that village." Output wraps with style prefix + suffix.

CORE RULES: "I want to live in that village" wholesome longing. Modern Pixar CGI: painterly subsurface-scattering, warm god-rays through canopy, painterly bokeh; chibi proportions. The creature is mid-action, never posing. NO humans of any kind — creatures only.

━━━ HARD RULE #1: VILLAGE FILLS THE FRAME, CREATURE IS A SMALL SCALE-PROVER, OPEN WITH THE CREATURE ━━━
WIDE ESTABLISHING SHOT — the jungle-village architecture (treehouses, huts, vine-bridges, canopy-platforms, lantern-flowers) fills 70-85% of the frame across foreground/midground/background, the canopy arching above. The SOLO creature is a SMALL anchor (8-15%) on a path, crossing a bridge, or on a balcony — the eye reads the WHOLE VILLAGE first, then discovers the tiny creature. HARD BAN: creature over 20% of frame, portrait/chest-up crops, centered close-ups. The output OPENS with the creature + activity, THEN the village behind, e.g. "A chibi toucan mid-skip across a rope-bridge with a basket of star-fruit, behind them a treehouse village in a giant ceiba tree..."

━━━ THE FOREGROUND CREATURE ━━━
${creature}

━━━ THE CREATURE'S STORY ACTIVITY ━━━
${resident_activity}

━━━ THE JUNGLE-VILLAGE (spans behind the creature) ━━━
${village}

━━━ THREE JUNGLE-VILLAGE DETAILS (populate the village with lived-in richness) ━━━
${detailBlock}

━━━ VILLAGE DENSITY ━━━
Densely lived-in, never a sparse postcard — many buildings/bridges/platforms at varying depths with evidence of routine (lit lantern-flowers, market crates, hanging baskets, drying herbs), so the viewer keeps finding new details.

━━━ STORY BEAT ━━━
The creature is mid-action — carrying, pushing, climbing, sweeping, watering, delivering — never posing.

━━━ CUTENESS AMPLIFICATION ━━━
Stack cozy-jungle effects: golden god-rays through the canopy, warm lantern-flower/firefly glow from windows, drifting motes/pollen in warm light, dewdrop highlights on leaves/vines/roofs, smoke/steam wisps, floating petals, reflections on wet stone, layered canopy-haze depth, tiny glowing lantern-flowers/glow-mushrooms, light-leaks through canopy gaps.

━━━ TIME OF DAY ━━━
${time_of_day}

━━━ WEATHER ━━━
${weather}

━━━ LIGHTING ━━━
${lighting}

━━━ ATMOSPHERIC DETAIL ━━━
${atmosphere}

━━━ SURPRISE ELEMENT (second-tier detail) ━━━
${surprise_element}${phenomenonBlock}

━━━ SCENE-WIDE COLOR PALETTE ━━━
${sharedDNA.scenePalette}

━━━ SECONDARY LIGHTING VIBE ━━━
${sharedDNA.colorPalette}

━━━ MOOD CONTEXT ━━━
${vibeDirective.slice(0, 150)}

━━━ COMPOSITION ━━━
WIDE ESTABLISHING SHOT, camera pulled WAY back — jungle-village fills 70-85% across foreground/midground/background (canopy arching above), the creature a SMALL 8-15% scale-prover crossing a bridge/climbing a vine-ladder/on a balcony (not close-up, not centered portrait). Eye reads VILLAGE FIRST, then the tiny creature. Three village-details across the architecture, surprise element tucked in the deep midground.

Open with: "[creature] [jungle-activity verb-phrase], [village] spanning behind, [canopy/lighting]..." then unfold. Output ONLY the raw Flux prompt, one flowing paragraph of comma-separated phrases, 90-120 words MAX — count them; a tight readable scene beats a crammed one. No labels, headers, or ━━━ markers.`;
  },
};
