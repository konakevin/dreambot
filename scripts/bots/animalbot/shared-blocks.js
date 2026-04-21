/**
 * AnimalBot — shared prose blocks.
 *
 * Wildlife at Nat Geo × 10. LAND ANIMALS ONLY (marine is OceanBot). Subject-
 * centric — the animal is the emotional hero of every render. Razor-sharp
 * detail, dramatic lighting, peak-moment timing.
 */

const PROMPT_PREFIX =
  'National Geographic wildlife photograph dialed to 10×, razor-sharp detail, dramatic natural lighting, peak-moment wildlife photography, impossibly clear fur/feather/scale detail, cinematic wildlife portrait';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const ANIMAL_IS_HERO_BLOCK = `━━━ THE ANIMAL IS THE HERO ━━━

The animal is ALWAYS the emotional center of the frame — even in the landscape path where it sits small in a vast vista. The viewer's eye goes to the creature first, the setting second. Every render is a tribute to the animal: its texture, its dignity, its movement, its presence. The land / sky / atmosphere serves the animal.`;

const IMPOSSIBLE_CLARITY_BLOCK = `━━━ IMPOSSIBLE CLARITY ━━━

Every fiber, every feather-barb, every scale edge, every whisker — razor-sharp. Resolution beyond what normal telephoto lenses capture. Eyes specifically must be luminous, wet, soulful, reflecting the environment. Fur catches light in impossible micro-detail. The viewer should feel they could reach out and touch the animal's coat.`;

const SOLO_ANIMAL_BLOCK = `━━━ ONE ANIMAL PER FRAME (tender path exception) ━━━

Default: ONE animal subject per frame. The tender path allows a bonded pair or parent-child. The action path may show a prey fragment (e.g., fish in talons, mouse in jaws) only if the peak moment requires it. Otherwise: solo. No herds, no packs-as-subject, no crowded frames.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE ━━━

No human figures, no hands, no silhouettes. Pure wildlife — untouched wilderness, no human presence of any kind.`;

const NO_MARINE_BLOCK = `━━━ NO MARINE LIFE (OceanBot's territory) ━━━

No fish, whales, dolphins, sharks, rays, octopuses, sea turtles, seals, sea lions, or underwater-dwelling marine creatures. Shorebirds that hunt at tide-edge are OK (heron, pelican, oystercatcher) — but the frame must be ABOVE water, not below. Amphibians (frogs, salamanders) that live in freshwater are OK.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Every render is wall-poster / phone-wallpaper quality. Colors more saturated than film captures. Backlight more perfect than nature normally offers. Peak-moment timing the photographer would sell a kidney for. Not documentary-restrained — peak-impact dialed.`;

const DRAMATIC_LIGHTING_BLOCK = `━━━ DRAMATIC LIGHTING ━━━

Name specific treatments per render. Rim-light backlighting fur against dark forest. Golden-hour raked across coat. Frost-crystal breath lit against low sun. Rain-soaked fur catching stormlight. Shaft-of-sun through canopy spotlighting the animal. Never generic "nice light" — always specific, namable, photographable.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — AMPLIFICATION (within wildlife-photography truth) ━━━

Wildlife-photography is the canvas, not the ceiling. Stack: peak-moment timing + dramatic backdrop + atmospheric element + perfect light + razor clarity. The viewer should react "HOW did they capture this?" every single frame. But bound by real biology — real species, real behaviors, real habitats, correctly depicted. No fantasy creatures. Amplify reality, don't fake it.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  ANIMAL_IS_HERO_BLOCK,
  IMPOSSIBLE_CLARITY_BLOCK,
  SOLO_ANIMAL_BLOCK,
  NO_PEOPLE_BLOCK,
  NO_MARINE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  DRAMATIC_LIGHTING_BLOCK,
  BLOW_IT_UP_BLOCK,
};
