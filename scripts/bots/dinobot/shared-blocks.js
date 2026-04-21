/**
 * DinoBot — shared prose blocks.
 *
 * Dinosaurs at Jurassic-concept-art quality. Photoreal + cinematic.
 * Majesty + scale + primal beauty. Species-accurate anatomy rendered
 * dramatically.
 */

const PROMPT_PREFIX =
  'Jurassic concept-art cinematography, photoreal dinosaur rendering, species-accurate anatomy, dramatic primordial atmosphere, majestic prehistoric beauty, cinematic scale';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const DINOSAUR_IS_HERO_BLOCK = `━━━ DINOSAUR IS HERO ━━━

Dinosaurs are subject / world / soul of every render. Even paleo-landscape renders carry primal prehistoric energy via distant silhouette or atmospheric-context. Every frame radiates ancient-world majesty.`;

const SPECIES_ACCURATE_BLOCK = `━━━ SPECIES-ACCURATE ANATOMY ━━━

Scientifically-informed rendering. Feathers where modern paleontology confirms (raptors, smaller theropods, some coelurosaurs). Correct body proportions — T-Rex arms small, Brachiosaurus neck long + upright, Triceratops frill + horns. Sauropods with correct mass-distribution. Not toy-like cartoon. Jurassic-Park-concept-art dramatic polish.`;

const NO_GORE_BLOCK = `━━━ NO GORE ━━━

Predator / prey moments are allowed — a T-Rex chasing, a raptor mid-leap. BUT never explicit gore: no bloody wounds, no dismemberment, no blood-spatter, no visible viscera. Dread + tension only. PG-13 drama, not horror.`;

const NO_HUMANS_BLOCK = `━━━ NO HUMANS ━━━

Prehistoric era. No humans anywhere. No hunters, no rangers, no silhouettes, no camp. Pure dinosaur world.`;

const NO_JURASSIC_PARK_NAMES_BLOCK = `━━━ NO JURASSIC PARK REFERENCES ━━━

Evoke Spielberg / Jurassic-concept-art aesthetic WITHOUT naming the franchise. No "Jurassic Park", no "Isla Nublar", no "Ian Malcolm", no "T-Rex paddock". Our own prehistoric world.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — DINO EDITION ━━━

Jurassic-cinematic concept-art quality. The kind of frame that belongs in a production-art book. Compositional excellence + atmospheric density + species-accurate rendering + dramatic lighting.`;

const DRAMATIC_LIGHTING_BLOCK = `━━━ DRAMATIC LIGHTING ━━━

Named specific treatments. Golden-hour raking through fern-canopy. Blue-hour silhouetted sauropod. Storm-light breaking on T-Rex. Dawn-mist silhouetting Triceratops. Lightning-flash freezing raptor mid-leap. Never generic.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — PREHISTORIC AMPLIFICATION ━━━

Jurassic-Park concept-art × 10. Stack: atmospheric density + dramatic light + species accurate detail + primordial scale + ancient-world context. Every frame should feel like a rediscovered film-still from a great dinosaur movie. If it doesn't make a 10-year-old gasp, dial up.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  DINOSAUR_IS_HERO_BLOCK,
  SPECIES_ACCURATE_BLOCK,
  NO_GORE_BLOCK,
  NO_HUMANS_BLOCK,
  NO_JURASSIC_PARK_NAMES_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  DRAMATIC_LIGHTING_BLOCK,
  BLOW_IT_UP_BLOCK,
};
