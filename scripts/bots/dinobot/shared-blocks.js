/**
 * DinoBot — shared prose blocks.
 *
 * Prehistoric Planet × Avatar-Pandora × Jurassic World wet-and-lush.
 * IMAX cinematic paleoart with primordial scale, volumetric god-rays,
 * wet reflective surfaces, exaggerated mega-foliage. Not just "BBC
 * Planet Earth" — that's documentary-restrained. We want EPIC.
 */

const PROMPT_PREFIX =
  'IMAX cinematic paleoart concept art, primordial Jurassic-Cretaceous wilderness, ultra-realistic prehistoric wildlife photography, scientifically plausible dinosaur anatomy with detailed skin texture, scars, mud caked on flanks, slick wet hide where appropriate, volumetric god-rays piercing dense canopy, sun-shafts cutting through humid haze, wet reflective surfaces (rivers, mud-pools, rain-slick scales), exaggerated primordial foliage (mega-ferns the size of trees, house-sized cycads, vine-curtain canopies, towering horsetails), rugged untamed Mesozoic earth, multi-layered atmospheric depth, Prehistoric-Planet × Avatar-Pandora × Jurassic-World cinematics, museum-grade paleoart polish, IMAX scale composition';

const PROMPT_SUFFIX = 'ABSOLUTELY NO humans, NO people, NO human figures, NO human silhouettes, NO human hands, NO man-made objects, NO buildings, no cartoon, no kids illustration, no toy-like, no stylized cute, no theme park, no fantasy dragon, no neon colors, no plastic CGI, no text, no watermark, ultra detailed, film grain, masterpiece';

const DINOSAUR_IS_HERO_BLOCK = `━━━ DINOSAUR IS HERO ━━━

Dinosaurs are the wildlife. This is a nature documentary frozen in time — 66+ million years ago. Every frame treats dinosaurs as REAL ANIMALS, not monsters. They eat, sleep, hunt, nest, migrate, fight, drink, rest. Candid wildlife moments, not posed. The camera caught them existing.`;

const SPECIES_ACCURATE_BLOCK = `━━━ SPECIES-ACCURATE ANATOMY ━━━

Scientifically informed. Feathers where paleontology confirms (raptors, smaller theropods, coelurosaurs). Correct body proportions — T-Rex arms small, Brachiosaurus neck long + upright, Triceratops frill + horns accurate. Sauropods with correct mass-distribution. Skin has texture: scars, mud, parasites, wear. NOT toy-smooth. NOT monster-movie exaggerated. Museum-grade paleoart accuracy.`;

const NO_GORE_BLOCK = `━━━ NO GORE ━━━

Predator/prey moments allowed — hunting, chasing, territorial displays. BUT never explicit gore: no bloody wounds, no dismemberment, no blood-spatter, no visible viscera. Tension + dread + power, never slasher. PG-13 nature documentary, not horror.`;

const NO_HUMANS_BLOCK = `━━━ ABSOLUTE BAN: NO HUMANS ━━━

STRICT BAN. No humans ANYWHERE in any form. No hunters, no rangers, no explorers, no scientists, no children, no silhouettes, no hands, no camps, no vehicles, no buildings, no modern structures, no roads, no fences, no clothing, no tools, no weapons. Not even implied human presence. This world has NEVER seen a human being. 66+ million years before the first human existed. ANY human element = FAILED render.`;

const DOCUMENTARY_CAMERA_BLOCK = `━━━ DOCUMENTARY CAMERA ━━━

Shot as if by a wildlife cinematographer who traveled back in time. The camera is HIDING — observing, not directing. Candid, not posed. These are real animals caught in real moments.`;

const ENVIRONMENT_STORYTELLING_BLOCK = `━━━ ENVIRONMENT STORYTELLING ━━━

The world tells a story. Footprints in mud. Broken ferns from passage. Claw marks on trees. Shed feathers. Eggshell fragments. Water disturbed by drinking. Drool. Breath-mist in cold air. Insects buzzing around wounds. Every detail says "something LIVES here."`;

const SCALE_AND_ATMOSPHERE_BLOCK = `━━━ SCALE + ATMOSPHERE ━━━

Emphasize SCALE — tiny foreground plants dwarf by massive animals. Volumetric fog, drifting dust, pollen clouds, humid air haze. Wet reflections in rivers and swamps. Wind-blown ferns. Atmospheric perspective — distant mountains fade to blue. The prehistoric world feels VAST and ALIVE.`;

const VOLUMETRIC_LIGHT_BLOCK = `━━━ VOLUMETRIC LIGHT — NON-NEGOTIABLE ━━━

EVERY render must have visible light SHAPED by atmosphere. Stack at least three of:
- God-rays / sun-shafts piercing dense canopy from above (cathedral-of-light through fern-tops)
- Volumetric haze (humid jungle air, mist over water, dust kicked from a herd's passage, pollen-clouds catching light)
- Backlit dust motes / pollen / insects / spore-clouds visible in light beams
- Storm-light contrast — dark clouds with a single break of golden raking light
- Backlit silhouette + rim-light on dinosaur silhouettes against bright sky/water
- Bioluminescent glow at dawn/dusk (firefly clouds, glowing fungi, lit moss)

Light is a CHARACTER in every frame. Not just illumination — atmospheric architecture you can see THROUGH.`;

const WET_WORLD_BLOCK = `━━━ WET, REFLECTIVE WORLD ━━━

The Mesozoic was HUMID. Water and wetness EVERYWHERE — incorporate at least one:
- Rivers, swamps, ponds, tidal flats reflecting the dinosaurs and the sky above
- Rain-slick mud-flats with footprint puddles holding the sky
- Wet-glistening dinosaur scales / hide / feathers (post-bath, sweating, post-rain, after a kill)
- Slick mossy rocks with hanging water-films
- Dew-soaked mega-ferns dripping water
- Mist-condensation beading on hide and on broad leaves
- Splash-rings, ripples, wake-trails through water from a tail or footstep
- Light reflecting off wet things — doubled, glittering, alive

Reflective surfaces double the visual richness — ground reflects sky, water reflects animals, wet hide catches the sun.`;

const LUSH_PRIMORDIAL_BLOCK = `━━━ LUSH PRIMORDIAL FOLIAGE — EXAGGERATED SCALE & DISTRIBUTED ━━━

The plants are MASSIVE and EVERYWHERE in the frame. Mesozoic flora was bigger, denser, weirder than anything alive today. Foliage must appear at MULTIPLE depths, not just as a backdrop wall.

Plant variety (Jurassic AND Cretaceous-era flora welcome):
- Mega-ferns the size of trees, frond-spans 6-10 meters across (tree-ferns, Cyathea, Dicksonia)
- House-sized cycads with crown of palm-like fronds (Cycas, Bennettitales)
- Towering horsetails (Equisetum) growing 15 meters tall like green spears
- Conifers — Araucaria (monkey puzzle), Wollemia, Sequoia ancestors, ginkgo trees with fan-leaves
- Tree-fern canopies forming cathedrals of green overhead
- Vine-curtains and lianas draping from titanic conifers
- Carpet-thick moss, liverwort, and ground-ferns across every surface — rocks, fallen logs, even branches
- Cycad-and-fern thickets at understory dense as walls
- Bennettitales (extinct cycadeoids) with showy cone-flowers
- Cretaceous-era flowering plants where appropriate (early magnolias, water lilies, ginger-relatives)
- Fallen-log microhabitats coated in fungi and moss
- Forests stretching to vanishing point in atmospheric haze

DISTRIBUTION through the frame — non-negotiable:
- FOREGROUND: at least one giant fern frond, draping vine, or moss-clad branch close to camera
- LEFT/RIGHT EDGES: plants framing the shot (cycad silhouette, hanging vines, fern wall)
- AROUND THE DINOSAUR: scattered ground ferns, fallen fronds disturbed by passage, broken horsetail stalks
- MIDGROUND: tree-ferns and cycads at dinosaur scale
- BACKGROUND: receding canopy + distant horsetail-spires fading into atmospheric haze

The dinosaurs are wading or stomping through OVERWHELMING vegetation that surrounds them on all sides. The world feels OLDER, WILDER, MORE FERTILE than anything modern.`;

const EPIC_SCALE_BLOCK = `━━━ EPIC SCALE — IMAX CINEMATIC ━━━

Compose every frame for IMAX-screen impact:
- Foreground depth (giant fern fronds, mossy boulder, vine, dripping water — close to camera)
- Midground subject (the dinosaur — sized to dwarf foreground or be dwarfed by background)
- Background atmospheric vista (distant mountains, mist, sky, more terrain receding to blue infinity)
- Multi-layer parallax — at least 4 distinct depth planes
- Scale anchors — small details (insects, lizards, birds, smaller dinosaurs) for size reference

Avoid flat documentary framing. Avoid empty negative space. Every pixel earns its place. The viewer should feel TRANSPORTED.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — PALEO EDITION ━━━

Prehistoric Planet × Avatar-Pandora × Jurassic World cinematics. Every frame belongs on the cover of a paleoart art book or as an IMAX still. Breathtaking composition, cinematic god-ray lighting, rich natural color grading saturated to wallpaper-worthy intensity. Earthy greens, deep mud-browns, jewel-tone water, golden hour amber, stormlight contrast.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — PREHISTORIC AMPLIFICATION ━━━

Prehistoric Planet × Avatar-Pandora × Jurassic World wet-lush × National Geographic wildlife. Stack: atmospheric density + volumetric god-rays + wet reflective surfaces + exaggerated mega-foliage + species-accurate detail + primordial scale + environment storytelling. If it doesn't make someone's jaw drop and say "dinosaurs were REAL and the world was WILDER," dial it up. Every frame is the greatest paleoart ever painted.`;

module.exports = {
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
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
};
