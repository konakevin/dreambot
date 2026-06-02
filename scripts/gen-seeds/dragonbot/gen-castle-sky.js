#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/castle_sky.json',
  total: 200,
  append: true,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} DRAMATIC SKY-OVERHEAD entries for DragonBot's castle path. Each entry is a DENSE phrase (20-40 words) describing a SPECIFIC dramatic sky / atmosphere overhead the castle. The sky is HALF the image.

⚠️ THE BAR: every sky must be CINEMATIC — painted concept-art quality, breath-taking palette, dramatic mood. NEVER flat blue daytime. Always at a magical hour (dawn / dusk / golden hour / blue hour / night / storm).

🚫 NO PROPER NOUNS — no specific franchises or weather-systems by name.

━━━ SKY CATEGORIES (distribute ${n} across):

GOLDEN HOUR / SUNSET / SUNRISE (~5):
- breath-taking painted-gold sunset sky with magenta-and-amber clouds layered horizon-to-zenith, single ribbon of sun-rays piercing through
- dawn sky transitioning from deep cobalt at zenith to pink-coral on the horizon, single bright morning-star, mist-streamers in the lower atmosphere
- low-hanging blood-orange sun on the horizon casting long shadows across the scene, sky painted in deep-amber and crimson layers
- early-dawn pearl-grey sky with rose-petal pink edges along the eastern horizon, single golden ray cutting through low cloud
- magic-hour sky with painted-gold lower-clouds and lavender-violet upper-clouds, the last sun-ray cutting horizontal across the scene

NIGHT / STARRY / AURORA (~5):
- vast starfield night sky with milky-way galactic-band cutting diagonally across the zenith, occasional shooting stars, deep cobalt void
- rippling aurora-borealis curtain in green-magenta-violet weaving across the night sky, single bright moon, snow-frosted clouds
- blood-moon hanging low over distant horizon, crimson light bathing everything, dark cobalt void overhead with scattered stars
- crescent moon over a deep cobalt night sky with magical light-particles drifting, glowing constellations clearly visible
- full silver moon haloed by a soft rainbow lunar-corona, scattered stars, single thin cirrus cloud silhouetted

STORM / DRAMATIC WEATHER (~4):
- towering cumulonimbus storm-tower in the distance, dramatic lightning illuminating its interior, dark wall of rain on the horizon
- low-hanging brooding storm-clouds overhead with single sun-shaft piercing through onto the scene, dramatic chiaroscuro
- distant thunderstorm at sunset with red-and-purple lightning fork-arcing between clouds, sun bleeding orange through the storm-curtain
- whirling cyclonic clouds spiraling overhead with sun-shafts radiating outward through their gaps, painted-gold and storm-grey

MIST / FOG / VOLUMETRIC (~3):
- low atmospheric mist-banks drifting horizontally across the lower-third of the sky, painted-gold sunset light bleeding through, beams of god-rays visible
- thick fog-shrouded sky with sun barely-visible as a glowing disc through the haze, monochromatic painted-gold mood
- volumetric haze sky with dramatic god-rays radiating from a single bright point, light-shafts visible in the misty air

MAGICAL / ARCANE SKIES (~4):
- impossible double-sun sky with two golden orbs at different heights, sky painted in lavender-and-coral, fantasy-painted aesthetic
- floating arcane runes glowing in the sky, drifting between scattered cumulus clouds, lavender-and-cobalt magical aurora
- twin moons low on the horizon, one silver and one crimson, sky painted in deep cobalt with magical light-particles drifting
- ringed planet visible huge in the sky, atmospheric rings stretching horizon-to-horizon, painted-gold-and-violet sky

EPIC PAINTED DAWN / DUSK (~4):
- jaw-dropping painted-gold sunrise with sun cresting a distant mountain range, light-rays radiating outward, lavender-and-coral cloud layers
- vast dusk sky with last light dying behind distant mountains, deep cobalt zenith transitioning through magenta to ember-red on the horizon
- early dawn alpine sky with mountaintops catching first-light gold while the valley below is still in deep blue-shadow, dramatic chiaroscuro
- dramatic painted sky with single brilliant sun-shaft piercing through low cloud-bank onto the scene, theatrical Caravaggio chiaroscuro

EACH entry MUST be:
- 20-40 words
- PURE sky / atmosphere only
- Specific palette (named colors / temperature / chromatic mood)
- One dramatic element (sun-shaft, cloud-formation, moon, storm, aurora, etc.)
- Cinematic painted concept-art language

Output as a NUMBERED list (1. ... 2. ... 3. ...), one entry per line. NO internal newlines within an entry.`,
});
