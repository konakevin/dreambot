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

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — NAT-GEO-PHOTO-OF-THE-YEAR AMPLIFICATION ━━━

Wildlife-photography is the canvas, not the ceiling. Every frame must stack MULTIPLE simultaneous spectacle elements. Not one good thing — FOUR or FIVE at once. Demand:

- PEAK-MOMENT timing (the impossible split-second)
- DRAMATIC atmospheric response (breath-fog in freezing air / water-shake-crystal-droplets / dust-plume from gallop / snow-crown-kicked / spray-backlit / steam / leaves-torn mid-action)
- WEATHER-CONCURRENCE drama (storm-break-single-ray / aurora-overhead / fog-parting / lightning-flash freezing scene / blizzard-whiteout with subject emerging)
- HABITAT-MAXED setting (NOT generic "forest" — ancient-basalt-cliffs / primeval-redwoods / arctic-pack-ice-with-cracks / volcanic-black-beach / sandstone-canyon at golden hour / aurora-lit boreal)
- ENVIRONMENTAL RESPONSE (branches snapping, water parting, dust kicked, leaves torn, snow-plume trailing, spray backlit, flocks-startled-peripheral)
- IMPOSSIBLE CLARITY (every scale / feather / whisker razor-sharp EVEN while subject is mid-motion)
- SCALE COMMUNICATION (topography + peripheral elements make the creature's size visceral)

Viewer should GASP. "HOW did they catch this?" every render. Nat-Geo-POTY-winner tone. If the render feels merely nice, add another spectacle element and dial further. Still bound to real biology + real species + real behaviors — but never tame, never restrained. Nature at its absolute maximum.`;

const SPECTACLE_AMPLIFIER_BLOCK = `━━━ SPECTACLE AMPLIFIER (use the one provided + add more spontaneously) ━━━

The brief supplies ONE spectacle amplifier detail. WEAVE IT IN naturally. Then ADD AT LEAST TWO MORE spontaneous spectacle elements from these categories: environmental response, weather concurrence, atmospheric particulate, peripheral creature reaction, pose peak-detail, surface-texture drama, lighting accident (a specific extraordinary light moment). The amplifier is the seed; stack additional drama until the frame is impossibly rich.`;

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
  SPECTACLE_AMPLIFIER_BLOCK,
};
