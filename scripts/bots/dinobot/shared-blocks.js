/**
 * DinoBot — shared prose blocks.
 *
 * BBC Planet Earth meets paleoart. Cinematic nature documentary stills of
 * scientifically plausible dinosaurs. Ultra-realistic, not toy-like.
 * Species-accurate anatomy, natural behavior, dramatic cinematography.
 */

const PROMPT_PREFIX =
  'cinematic paleoart nature documentary still frame, ultra-realistic prehistoric wildlife photography, scientifically plausible dinosaur anatomy, accurate musculature and proportions, detailed skin texture with scars and mud, natural animal behavior mid-motion, wildlife documentary composition, telephoto framing, dramatic depth of field, volumetric fog, atmospheric perspective, epic ancient landscape, BBC Planet Earth vibe, museum-grade paleoart quality, IMAX realism';

const PROMPT_SUFFIX = 'no humans, no people, no human figures, no cartoon, no kids illustration, no toy-like, no stylized cute, no theme park, no fantasy dragon, no neon colors, no plastic CGI, no text, no watermark, ultra detailed, film grain, masterpiece';

const DINOSAUR_IS_HERO_BLOCK = `━━━ DINOSAUR IS HERO ━━━

Dinosaurs are the wildlife. This is a nature documentary frozen in time — 66+ million years ago. Every frame treats dinosaurs as REAL ANIMALS, not monsters. They eat, sleep, hunt, nest, migrate, fight, drink, rest. Candid wildlife moments, not posed. The camera caught them existing.`;

const SPECIES_ACCURATE_BLOCK = `━━━ SPECIES-ACCURATE ANATOMY ━━━

Scientifically informed. Feathers where paleontology confirms (raptors, smaller theropods, coelurosaurs). Correct body proportions — T-Rex arms small, Brachiosaurus neck long + upright, Triceratops frill + horns accurate. Sauropods with correct mass-distribution. Skin has texture: scars, mud, parasites, wear. NOT toy-smooth. NOT monster-movie exaggerated. Museum-grade paleoart accuracy.`;

const NO_GORE_BLOCK = `━━━ NO GORE ━━━

Predator/prey moments allowed — hunting, chasing, territorial displays. BUT never explicit gore: no bloody wounds, no dismemberment, no blood-spatter, no visible viscera. Tension + dread + power, never slasher. PG-13 nature documentary, not horror.`;

const NO_HUMANS_BLOCK = `━━━ NO HUMANS ━━━

Pure prehistoric era. No humans anywhere. No hunters, no rangers, no camps, no vehicles, no buildings. This world has never seen a human being.`;

const DOCUMENTARY_CAMERA_BLOCK = `━━━ DOCUMENTARY CAMERA ━━━

Shot as if by a wildlife cinematographer who traveled back in time. The camera is HIDING — observing, not directing. Candid, not posed. These are real animals caught in real moments.`;

const ENVIRONMENT_STORYTELLING_BLOCK = `━━━ ENVIRONMENT STORYTELLING ━━━

The world tells a story. Footprints in mud. Broken ferns from passage. Claw marks on trees. Shed feathers. Eggshell fragments. Water disturbed by drinking. Drool. Breath-mist in cold air. Insects buzzing around wounds. Every detail says "something LIVES here."`;

const SCALE_AND_ATMOSPHERE_BLOCK = `━━━ SCALE + ATMOSPHERE ━━━

Emphasize SCALE — tiny foreground plants dwarf by massive animals. Volumetric fog, drifting dust, pollen clouds, humid air haze. Wet reflections in rivers and swamps. Wind-blown ferns. Atmospheric perspective — distant mountains fade to blue. The prehistoric world feels VAST and ALIVE.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — PALEO EDITION ━━━

IMAX nature documentary × museum-grade paleoart. Every frame belongs in a National Geographic spread or a production-art book. Breathtaking composition, cinematic lighting, rich natural color grading. Earthy greens and browns with cinematic contrast. Golden hour, stormlight, moonlight, overcast jungle shade.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — PREHISTORIC AMPLIFICATION ━━━

BBC Planet Earth × Jurassic concept art × National Geographic wildlife photography. Stack: atmospheric density + dramatic natural light + species-accurate detail + primordial scale + environment storytelling. If it doesn't make someone's jaw drop and say "dinosaurs were REAL," dial it up. Every frame is the greatest paleoart ever painted.`;

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
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK,
};
