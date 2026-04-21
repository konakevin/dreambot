/**
 * EarthBot — shared prose blocks.
 *
 * EARTH ONLY. Every render is theoretically plausible earthly location dialed
 * to 10× — National-Geographic-cover × 10. Zero fantasy, zero cosmic, zero
 * physics-defying. Scene-centric: no humans, no animal subjects.
 */

const PROMPT_PREFIX =
  'National Geographic cover photograph dialed to 10×, dramatic earthly landscape, impossibly beautiful real-world vista, epic natural scene, documentary cinematography, Earth at its most breathtaking';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const EARTH_ONLY_BLOCK = `━━━ EARTH ONLY — NON-NEGOTIABLE ━━━

Every render is a theoretically plausible EARTHLY location. Bound by Earth's actual geographic / geologic / biologic / meteorologic rules. Invented-specific OK (an unnamed glacier valley, a fictitious basalt cliff) — but always bound by Earth physics.

ABSOLUTELY NEVER:
- Fantasy architecture (no castles, no floating islands, no elvish bridges)
- Cosmic / alien / otherworldly elements
- Physics-defying phenomena (no glowing trees, no bioluminescent lakes, no crystalline forests)
- Built human structures as subject (maybe peripheral, never the focus)
- Mythical creatures
- Sci-fi or futuristic elements

ALWAYS:
- Plausible Earth geography (real-type mountains, lakes, forests, coasts, dunes, reefs)
- Earth-plausible weather and atmosphere
- Real-world biomes`;

const NATURE_IS_HERO_BLOCK = `━━━ NATURE IS THE HERO ━━━

The LAND / SKY / WEATHER / WATER itself is the subject. No narrative focus — the planet is protagonist. The viewer should feel: "Earth is staggering. I want to BE there." Pure geography, amplified. Compose like a National Geographic cover that made it to print because the photographer was in the right place at the right time with the light of a lifetime.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE ━━━

No human figures in frame. No hikers, no climbers, no faces, no silhouettes — not even at distance. Pure land + sky + water + weather.`;

const NO_WILDLIFE_BLOCK = `━━━ NO WILDLIFE (animal subjects belong to AnimalBot) ━━━

No animal subjects. No deer, no birds as focal points, no bears, no whales breaching, no creatures in frame. If an animal appears, it's AnimalBot's job. EarthBot is pure landscape / sky / weather / geology / botany. The land is the star.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Every render is wall-poster / phone-wallpaper quality. Not documentary-restrained — cranked to the absolute apex of natural beauty. Colors more saturated than real film captures. Atmospheric layering more dense than most photographers catch. Lighting more perfect than nature usually offers. "I can't believe this is Earth" — that's the reaction.`;

const DRAMATIC_LIGHTING_BLOCK = `━━━ DRAMATIC LIGHTING ━━━

Name specific light treatments per render. Golden-hour rake across ridgelines. Blue-hour afterglow on still water. God-rays piercing stormclouds. Aurora green across ice. Moonlight silvering dunes. Lightning mid-strike. Backlit mist through old-growth. Never generic "soft light" — always a specific, photographable, nameable moment.`;

const BLOW_IT_UP_BLOCK = `━━━ BLOW IT UP — AMPLIFICATION ━━━

Earth is the canvas, not the ceiling. Stack weather + atmospheric phenomena. Invent absurd-but-plausible geological features within Earth's rules. Saturate colors beyond realistic. Dial EVERY element to max. Sonnet is encouraged to embellish aggressively — pile on layered clouds, add a second atmospheric element, add drifting particulate, stack multiple light sources, compose the most insane version of this Earth moment that could theoretically exist. Garden-of-Eden energy — the canvas is constrained to Earth, but within Earth there is NO ceiling.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  EARTH_ONLY_BLOCK,
  NATURE_IS_HERO_BLOCK,
  NO_PEOPLE_BLOCK,
  NO_WILDLIFE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  DRAMATIC_LIGHTING_BLOCK,
  BLOW_IT_UP_BLOCK,
};
