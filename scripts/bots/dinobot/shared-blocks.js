/**
 * DinoBot — shared prose blocks.
 *
 * Prehistoric Planet × Avatar-Pandora × Jurassic World wet-and-lush.
 * IMAX cinematic paleoart with primordial scale, volumetric god-rays,
 * wet reflective surfaces, exaggerated mega-foliage. Not just "BBC
 * Planet Earth" — that's documentary-restrained. We want EPIC.
 */

// 2026-06-02 NEGATION STRIP: removed "NO HUMANS" cascades. The CLIP/T5
// tokenizer ignores "NO" / "NOT" and attends to the negated noun, so
// "NO HUMANS" actually pulled human figures into renders. Replaced with
// positive-only framing ("66 million years before humans evolved" carries
// the prehistoric meaning; "primordial wilderness only" carries the
// dinosaurs-only meaning). Human-exclusion guidance lives in NO_HUMANS_
// BLOCK below as Sonnet system text (Sonnet's output is then constrained
// by the POSITIVE_OUTPUT_MANDATE at the end of each template). See
// [[feedback_negative_prompt_leak]].
// 2026-06-02 cruft-audit micro-strip — dropped `8K detail` tech-spec tail.
const PROMPT_PREFIX =
  '66 million years before humans evolved, cinematic primordial Mesozoic wilderness, ray-traced reflections, hyperreal textures, IMAX cinematic precision';

// 2026-06-02 NEGATION STRIP: 16 "NO X" entries removed (humans, people,
// figures, silhouettes, hands, man-made, buildings, cartoon, kids
// illustration, toy-like, stylized cute, theme park, fantasy dragon,
// neon colors, plastic CGI, text, watermark). All were leaking the
// banned nouns INTO renders. Replaced with positive-only quality terms
// ("primordial wilderness, photoreal organic wildlife, ultra detailed,
// film grain, masterpiece").
// 2026-06-02 cruft-audit micro-strip — dropped `ultra detailed` tech-spec.
const PROMPT_SUFFIX = 'primordial wilderness, photoreal organic wildlife, film grain, masterpiece';

const DINOSAUR_IS_HERO_BLOCK = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE MANDATE — these MUST be the FIRST words of your output, BEFORE setting/lighting/anything else.

1. THE DINOSAUR IS THE SUBJECT — and it is CLEARLY VISIBLE AT FULL BODY in the frame. The dinosaur is the eye's first landing place. Render it ALIVE and BREATHING at mid/large scale in frame (not a tiny silhouette, not a skull or fossil).

2. SHOW THE SCALE. The dinosaur is impressive because of its SIZE relative to its world. Render it at a distance where the whole body reads, while the lush mega-foliage, vast terrain, and atmospheric depth are ALL visible around it. Aim for the dinosaur occupying 20-45% of the frame. This is a wildlife-cinema establishing shot where the dinosaur is the obvious star and the world wraps around it.

3. ONE DINOSAUR PER PROMPT (or one cohesive same-species group if the path calls for one). Keep species consistent within the frame.

4. OPEN YOUR OUTPUT WITH THE DINOSAUR. Format:
"[dinosaur species + signature anatomy + action at full body], [environment wrapping around it — foliage, terrain, atmosphere], [lighting]."
The dinosaur opens. Everything else is its richly-shown WORLD.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dinosaurs are the wildlife. This is a nature documentary frozen in time — but cinematic, hyperreal, jaw-dropping. They eat, sleep, hunt, nest, migrate, fight, drink, rest. Candid wildlife moments, captured naturally (not posed for camera). The camera caught them existing in their VAST WORLD — and the world is shown alongside them.

WIDE framing is the default — mid to wide so the mega-foliage, vast terrain, biblical weather, and primordial scale can show through. Reserve tight crops for sacred-light path only. Show the WORLD with the dinosaur in it.`;

const SPECIES_ACCURATE_BLOCK = `━━━ SPECIES-ACCURATE ANATOMY — REAL LIVING ANIMAL ━━━

The dinosaur is a REAL LIVING ANIMAL captured by a wildlife cinematographer. Photoreal, biological, breathing.

CRITICAL — the dinosaur is NOT:
- A 3D-rendered character model from a video game (no rigid plastic-y polished surfaces)
- A toy or sculpture (no smooth uniform color, no perfect symmetry)
- A monster-movie exaggeration (no over-stylized horror anatomy)
- A CGI-perfect cartoon dinosaur (no flat saturated colors, no rubber-y feel)

The dinosaur IS:
- A photographed living animal — leathery organic hide with pores, wrinkles, and asymmetry
- Skin textured with scars, mud, parasites, healing wounds, weather wear
- Naturalistic muscle visible beneath skin, asymmetric in motion
- Earthy biological coloring (browns, ochres, dusty greens, weathered greys, with display patches)
- Wet, dry, dusty, or muddy depending on context — NEVER pristine
- Feathered where paleontology confirms (raptors, smaller theropods, coelurosaurs)
- Correct proportions: T-Rex arms small, Brachiosaurus neck long + upright, Triceratops frill + horns accurate

Like a still from Prehistoric Planet (BBC) shot on 35mm film. Museum-grade paleoart accuracy with photoreal wildlife-photography polish.`;

const NO_GORE_BLOCK = `━━━ NO GORE ━━━

Predator/prey moments allowed — hunting, chasing, territorial displays. BUT never explicit gore: no bloody wounds, no dismemberment, no blood-spatter, no visible viscera. Tension + dread + power, never slasher. PG-13 nature documentary, not horror.`;

// 2026-06-02 NEGATION STRIP: the previous block listed 30+ banned nouns
// (humans / people / hunters / rangers / explorers / scientists / camps /
// tents / vehicles / etc) which Sonnet then echoed into the OUTPUT prompt
// with "NO X" language, leaking every banned noun into the Flux render.
// Restated as positive-only: describe what the world IS (pure ecosystem,
// untouched wilderness, prehistoric-only) rather than what's banned.
// Sonnet must NEVER write any banned-noun list in the output (enforced by
// POSITIVE_OUTPUT_MANDATE at the bottom of each template).
const NO_HUMANS_BLOCK = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ABSOLUTE NON-NEGOTIABLE — PURE PREHISTORIC ECOSYSTEM ONLY

This world existed 66+ million years before any primate evolved. The biosphere is dinosaurs, pterosaurs, marine reptiles, prehistoric flora, insects, early mammals, and the geology of the Mesozoic Earth. Nothing else. Pure untouched ecosystem.

ECOSYSTEM CONTENT (this is what appears in frame):
- Dinosaurs, pterosaurs, marine reptiles — the wildlife
- Mesozoic flora — cycads, tree ferns, conifers, ginkgoes, horsetails, gnarled mega-trees
- Geological features — volcanic terrain, primordial rivers, sea coasts, mud plains, mountain ranges
- Atmospheric phenomena — mist, dust, rain, lightning, dawn light, mega-weather
- Smaller ecosystem players as accents — insects, lizards, tiny mammals, early-bird-like creatures

This is the wild Mesozoic — pure ecosystem of dinosaurs and prehistoric flora. The framing is naturalistic-wildlife-cinematography (Prehistoric Planet, BBC Walking with Dinosaurs aesthetic). The world thrives on its own, unobserved.

⚠️ POSITIVE-ONLY OUTPUT (CRITICAL): Your output prompt must contain ZERO words like "no", "not", "without", "never", "ban", "absent". Never list "no X / not Y" of any kind. The bans live in YOUR understanding only — your output describes what IS in the scene, never what isn't. CLIP/T5 attends to negated nouns and renders them anyway, so listing them in output is self-sabotage.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

const DOCUMENTARY_CAMERA_BLOCK = `━━━ DOCUMENTARY CAMERA ━━━

Shot as if by a wildlife cinematographer who traveled back in time. The camera is HIDING — observing, not directing. Candid, not posed. These are real animals caught in real moments.`;

const ENVIRONMENT_STORYTELLING_BLOCK = `━━━ ENVIRONMENT STORYTELLING ━━━

The world tells a story. Footprints in mud. Broken ferns from passage. Claw marks on trees. Shed feathers. Eggshell fragments. Water disturbed by drinking. Drool. Breath-mist in cold air. Insects buzzing around wounds. Every detail says "something LIVES here."`;

const SCALE_AND_ATMOSPHERE_BLOCK = `━━━ SCALE + ATMOSPHERE ━━━

Emphasize SCALE — tiny foreground plants dwarf by massive animals. Volumetric fog, drifting dust, pollen clouds, humid air haze. Wet reflections in rivers and swamps. Wind-blown ferns. Atmospheric perspective — distant mountains fade to blue. The prehistoric world feels VAST and ALIVE.`;

const VOLUMETRIC_LIGHT_BLOCK = `━━━ DRAMATIC LIGHTING — VOLUMETRIC OR CRISP, NOT ALWAYS FOGGY ━━━

Light is a CHARACTER in every frame, but it does NOT mean every render is hazy. Pick ONE of two modes per render and commit to it:

MODE A — VOLUMETRIC (~40% of renders, when the scene calls for it):
- God-rays / sun-shafts piercing dense canopy (cathedral-of-light through tree-fern tops)
- Visible particulates in beams (dust motes, pollen, spore-cloud, insects backlit)
- Mist columns rising from water at dawn
- Rain-curtain blowing diagonally through golden backlight
- Heavy humid-jungle haze diffusing distant silhouettes
Use when: jungle understory, mist-canyon, dawn-fog, stormlight, backlit canopy.

MODE B — CRISP, CLEAR, RAY-TRACED (~60% of renders, the default):
- Razor-sharp specular highlights on wet hide and water (Unreal Engine 5 PBR)
- Crisp shadows with hard edges, full saturation, no haze diffusion
- Mirror-flat water doubling sky / clouds / dinosaur in perfect reflection
- Bright midday sun with chrome-bright wet-scale reflections
- Post-rain CRYSTALLINE air (clearer than usual, every detail razor-sharp)
- Storm-cleared aftermath with rainbow + still-wet-everything sparkle
- Cold-blue arctic clarity with sharp mountain silhouettes
- Dry-desert hard-light with stark shadows
- Golden hour with crisp edges, no haze, just rich color
Use when: open landscapes, water-reflection scenes, post-rain freshness, midday clarity, dramatic chiaroscuro contrast.

LIGHT STILL DOES THE WORK in MODE B — through specular highlights, reflections, shadow-architecture, color contrast — but the AIR IS CLEAR. Don't default to foggy. The world has bright crisp days too.`;

const WET_WORLD_BLOCK = `━━━ WET, REFLECTIVE WORLD — UNREAL ENGINE 5 KILLED-IT QUALITY ━━━

This is the MONEY-SHOT layer. Wetness and reflection are the bot's signature. Push every render toward Unreal Engine 5 cinematic raytracing — PBR materials, mirror reflections, sharp specular highlights, caustics in clear water.

Stack AT LEAST TWO of these per render (more if the setting allows):

WATER REFLECTIONS (heavy emphasis):
- Mirror-flat water doubling the dinosaur in perfect ray-traced reflection
- Calm shallow lake reflecting sky-blue and gnarled trees, dinosaur silhouette mirrored upside-down
- Rain-slick mud-flat with each footprint puddle holding a fragment of sky in clear reflection
- Glassy lagoon at dawn, reflection so still it doubles the scene, ripples only where the dinosaur wades
- Tannin-dark river surface with crisp reflection of overhead canopy
- Polished travertine pool surface holding sky like glass

WET HIDE / SPECULAR HIGHLIGHTS:
- Rain-slick scaled hide catching CHROME-BRIGHT specular highlights (Unreal Engine PBR shader quality)
- Post-bath sauropod with water sheeting off, every ridge of skin catching sunlight
- Wet-glistening feathered raptor with droplets beading on individual feathers, each catching light
- Slick mud-coated flank reflecting golden hour, mud-sheen as bright as polished bronze
- Post-rain triceratops with frill running with water, individual drops gleaming

WATER INTERACTION (active wetness):
- Splash-corona around a wading dinosaur foot, droplets frozen mid-air catching backlight
- Wake trail behind a swimming sauropod neck, each ripple catching light edge
- Tail-slap sending up a sheet of water, each droplet a tiny lens
- Drinking-dinosaur with concentric ripples expanding from its lips
- Charging through shallows, water spraying outward in arcs

CAUSTICS & SUBSURFACE:
- Sun-caustics dancing on shallow lake bed beneath a wading dinosaur
- Subsurface scattering on translucent jellyfish-flesh of water lilies
- Wet leaf surfaces with rain-droplet lens-effects refracting sun
- Rainbow-spectral light through waterfall-spray

WET SURFACE TEXTURE:
- Slick mossy rocks in rivers, water-film over emerald moss, polished-stone shine beneath
- Dew-soaked mega-ferns with droplets refracting like beaded curtains
- Wet bark on mile-high megatrees, gleaming after rain, individual rivulets visible
- Rain-glistening canopy leaves with light bouncing back to camera

This is THE LAYER that makes a render look "killed it" vs. flat. Wet, reflective, ray-traced, crisp specular — these are the words that pull Flux toward UE5 cinematic quality. Don't be subtle; demand the specular shine.`;

const LUSH_PRIMORDIAL_BLOCK = `━━━ ABSOLUTELY UNHINGED PRIMORDIAL FOLIAGE — JUNGLE-DENSE ━━━

The plants are MASSIVE, OVERGROWN, IMPOSSIBLE. This is a lost world overflowing with primordial vegetation, 66 million years before humans existed — pure Mesozoic ecosystem. You have FULL CREATIVE LICENSE to invent flora that doesn't exist. Make plants that make the viewer say "what IS that?"

ABSOLUTE BAN: NO HUMANS, NO documentary-savanna, NO open ground, NO sparse cover, NO clean negative space. The dinosaur thrives in DENSE Mesozoic jungle.

Push WAY past documentary restraint. Examples (use these as inspiration, invent your own):
- Mile-high gnarled trees with twisting trunks the diameter of buildings, branches arching into living cathedrals
- Megaferns spanning entire clearings, fronds the size of small islands
- Cycads and tree-ferns the size of houses, with showy fluorescent cone-flowers
- Towering horsetail-spires hundreds of meters tall, glowing at the joints
- Vine-curtains hanging like waterfalls of green from impossible heights
- Hanging mosses dripping water-films like luminous beaded curtains
- Fungi the size of vehicles — bracket-fungi staircases climbing tree-trunks, mushroom canopies forming their own undergrowth
- Bioluminescent plants pulsing slow at dawn and dusk, lighting up the understory
- Trees with bark that ripples, weeps sap, glistens like obsidian
- Strangler-vine networks knotting whole groves into single super-organisms
- Rainbow flowering plants the size of cars erupting from canopy
- Spiral-growing trees that twist like corkscrews, branches forking impossibly
- Carnivorous mega-pitcher plants tall as elephants
- Gnarled twisted ancient survivors, hollows large enough to walk through
- Floating-spore plants releasing huge translucent seed-balloons

DISTRIBUTION through the frame — non-negotiable, every render:
- WIDE FRAMING is the default. The dinosaur is full-body visible at distance, in dense jungle context, NOT a close-up framed by leaves at the camera lens.
- AROUND THE DINOSAUR: bigger-than-the-dinosaur trees, mega-fern groves, vine networks, hanging mosses — surrounding the dinosaur on all sides at midground distance
- LEFT/RIGHT EDGES: mile-high tree silhouettes, cycad clusters, hanging vine-walls — framing the shot from the EDGES at midground/background distance (NOT inches from camera)
- MIDGROUND: living-cathedral canopy structures, weird and wonderful plant-forms at dinosaur scale
- BACKGROUND: layers of canopy and distant primordial terrain receding into atmospheric haze
- OPTIONAL FOREGROUND: occasional fern frond or vine wisp at frame edge is OK for depth — but NEVER a massive close-up leaf dominating the foreground that pulls the framing tight. The lens stays WIDE; the jungle wraps around the dinosaur from every distance.

The dinosaurs are smaller than the trees. The plants WIN this world — through density at every distance, NOT through close-up framing. The viewer sees a dinosaur THRIVING in dense Mesozoic jungle from a wide cinematic vantage. Give the viewer something they have never seen.`;

const EPIC_SCALE_BLOCK = `━━━ EPIC SCALE — IMAX CINEMATIC ━━━

Compose every frame for IMAX-screen impact:
- Foreground depth (giant fern fronds, mossy boulder, vine, dripping water — close to camera)
- Midground subject (the dinosaur — sized to dwarf foreground or be dwarfed by background)
- Background atmospheric vista (distant mountains, mist, sky, more terrain receding to blue infinity)
- Multi-layer parallax — at least 4 distinct depth planes
- Scale anchors — small details (insects, lizards, birds, smaller dinosaurs) for size reference

Avoid flat documentary framing. Avoid empty negative space. Every pixel earns its place. The viewer should feel TRANSPORTED.`;

const VAST_TERRAIN_BLOCK = `━━━ VAST TERRAIN — THE LANDSCAPE IS BIGGER THAN LIFE ━━━

The terrain itself is mythic. Nobody has ever seen this world. CREATIVE LICENSE encouraged — invent landforms that surprise. Stack at least one major terrain feature per render:

- Vast canyons plunging into mist — bottomless, miles wide, dwarfing the dinosaurs walking the rim
- Thousand-meter waterfalls thundering off cliff-edges, mist-curtains rising hundreds of meters
- Sky-piercing mountain ranges in the background — jagged peaks higher than the Himalayas
- Mesa-and-spire towers like Monument Valley × 10, eroded into impossible shapes
- Ravines carved by primordial rivers, walls layered in rust-orange + ochre + chalk-white strata
- Glacial valleys with sheer ice-walls, crevasses glowing turquoise from within
- Volcanic chains with smoking cones marching to the horizon, lava-rivers visible in the dark
- Coastal sea-cliffs hundreds of meters tall, waves shattering at the base far below
- Inland sea bays with limestone arches and stacks rising from blue water
- Salt-flat plains stretching to vanishing point with mineral-blue sky and distant rain-curtains
- Karst-tower forests (limestone megaspires) covered in jungle, rising out of mist
- Lava-tube cave networks with bioluminescent ceilings, scale visible only by glow

The TERRAIN is a co-star. It dwarfs everything in it. Skull Island × Pandora × Land of the Lost × Avatar-floating-mountains energy. Make the viewer's jaw drop at the WORLD, not just the animals.`;

const SURPRISING_WEATHER_BLOCK = `━━━ SURPRISING WEATHER — BIBLICAL SCALE ━━━

Weather is dramatic and bigger-than-life. Stack atmospheric drama at world-scale, not local:

- Mile-wide rain-walls visibly approaching across a plain, sun on one side, dark on the other
- Supercell thunderheads with their own internal weather (cloud-stair structure, anvil-spread, sub-storm rotation)
- Lightning striking miles away, illuminating an entire valley for one frame
- Aurora-bands rippling across a daytime sky (impossible but THIS world allows it)
- Double rainbows arching over a herd, prismatic
- Sun-pillars / parhelion / sun-dogs visible in cold air
- Pyrocumulus cloud rising from a distant volcano, lit from below by lava
- Mist-rivers flowing through a canyon system, dinosaurs wading through them
- Hail-storm at edge of frame, ice-stones bouncing off broad megaleaves
- Snow-squall slicing across a valley, half-visible dinosaur silhouettes
- Tornado on the horizon, dust-funnel kissing a primordial plain
- Sand-storm wall sweeping across desert, herd silhouetted in front
- Comet visible in the daytime sky (Cretaceous-extinction omen energy)
- Rare cloud formations — lenticular clouds capping mountains, undulatus asperitas wave-clouds
- Sheet-lightning lighting up the whole sky cyclically (impossible storm)

The weather is a CHARACTER. Don't settle for "cloudy" — give us weather we've never seen happen on Earth.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — PALEO EDITION ━━━

Prehistoric Planet × Avatar-Pandora × Jurassic World cinematics. Every frame belongs on the cover of a paleoart art book or as an IMAX still. Breathtaking composition, cinematic god-ray lighting, rich natural color grading saturated to wallpaper-worthy intensity. Earthy greens, deep mud-browns, jewel-tone water, golden hour amber, stormlight contrast.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — PREHISTORIC AMPLIFICATION ━━━

Prehistoric Planet × Avatar-Pandora × Jurassic World wet-lush × National Geographic wildlife. Stack: atmospheric density + volumetric god-rays + wet reflective surfaces + exaggerated mega-foliage + species-accurate detail + primordial scale + environment storytelling. If it doesn't make someone's jaw drop and say "dinosaurs were REAL and the world was WILDER," dial it up. Every frame is the greatest paleoart ever painted.`;

// Clean-render medium for gpt-image-2 + nano-banana (routed via
// cleanMediumByModel in index.js) — keeps these models from reading the bot's
// IMAX-paleoart polish anchors as "go abstract". Light genre tag, positive-only.
const GPT_CLEAN =
  'Clean cinematic dinosaur illustration, crisp render with clearly readable species-accurate dinosaurs and lush prehistoric environments, rich naturalistic palette, atmospheric depth, documentary register';

module.exports = {
  GPT_CLEAN,
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  DINOSAUR_IS_HERO_BLOCK,
  SPECIES_ACCURATE_BLOCK,
  NO_GORE_BLOCK,
  NO_HUMANS_BLOCK,
  DOCUMENTARY_CAMERA_BLOCK,
  ENVIRONMENT_STORYTELLING_BLOCK,
  SCALE_AND_ATMOSPHERE_BLOCK,
  VOLUMETRIC_LIGHT_BLOCK,
  WET_WORLD_BLOCK,
  LUSH_PRIMORDIAL_BLOCK,
  EPIC_SCALE_BLOCK,
  VAST_TERRAIN_BLOCK,
  SURPRISING_WEATHER_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
};
