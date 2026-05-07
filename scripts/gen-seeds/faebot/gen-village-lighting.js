#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/village_lighting.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} LIGHTING + WEATHER + ATMOSPHERE descriptions for FaeBot's fae-village path. Each entry is 20-40 words describing a coupled lighting/weather/atmospheric treatment that gets layered into a fae-village painted-fantasy scene.

Lighting and weather are inseparable — weather conditions DEFINE the lighting (rainy = soft-diffuse cool, sunny = sharp golden, foggy = volumetric milky). Each entry must establish BOTH.

━━━ EVERY ENTRY MUST INCLUDE ━━━
- Time of day (dawn / golden hour / midday / dusk / twilight / night / pre-dawn / blue hour)
- Weather condition (sunny / rainy / foggy / misty / overcast / clear / post-rain / drizzling / snowing / stormy break)
- VOLUMETRIC GOD-RAYS / SUN-SHAFTS / LIGHT-BEAMS PIERCING THE CANOPY (NON-NEGOTIABLE — every entry. Even rainy/foggy/night entries must include visible light shafts of some kind: moonbeams piercing fog, lantern god-rays through mist, dawn light cutting through canopy, etc. The light is ALWAYS shaped, ALWAYS visible as beams.)
- Atmospheric particulate visible IN the light beams (mist / fog / rain / pollen / spore-glow / drifting petals / sparkling motes / dust)
- Painted-style language (painted brushwork, cinematic fantasy, dreamy soft, multi-layer atmospheric depth)

━━━ TIME × WEATHER VARIETY ━━━
Spread across all combinations:
- DAWN clear / golden / sunny / pink-pearl / fog rolling off ground
- EARLY MORNING light / drifting mist / dappled sunny / post-rain crystalline
- GOLDEN HOUR sunny / rainy / hazy / pollen-shafts / late-amber dusty
- MIDDAY dappled / overcast / sun-shower / clear cool / hot-haze
- DUSK twilight blue / fog rising / amber-pink / drizzle ending
- TWILIGHT misty / starlight emerging / overcast cool
- BLUE HOUR atmospheric / fog-drifted / cool-blue with warm window glows
- NIGHT moonlit / firefly-only / overcast-dark with lantern glow / post-rain wet
- RAINY day in soft cool diffuse, raindrops visible
- FOGGY morning with milky volumetric softness, light shafts struggling through
- STORMY with single break of golden light through dark clouds
- SNOWY with soft drifting flakes (rare — fae-friendly winter)

━━━ EXAMPLES (write fresh, do not copy) ━━━
- "Golden-hour clear afternoon, volumetric god-rays piercing through dense canopy from above, sparkling pollen-motes drifting through the warm beams, lush atmospheric haze receding to deeper green forest, warm-amber lit-window accents, painted soft brushwork."
- "Rainy day in soft cool diffuse light, raindrops painted as silver streaks, drifting mist between trees, warm amber lantern-glow from cottages cutting through the blue-grey atmosphere, multi-layer painted depth, dreamy soft cinematic."
- "Twilight blue hour with fog rolling through the lower forest, single shafts of magenta-violet evening light breaking through canopy gaps, sparkling magical dust drifting, warm-amber window-glow against the cool blue ambient, painted atmospheric depth."
- "Pre-dawn pearl-grey light just beginning to bloom, drifting mist around the dwellings, faint golden god-rays starting to break through canopy, warm interior lantern-glow strongest against the cool ambient, painted soft luminous haze."
- "Stormy mid-afternoon with a single break of golden sunlight piercing dark clouds, raking light hitting the village dramatically, atmospheric rain-haze in the middle distance, warm-amber windows glowing as beacons, painted cinematic chiaroscuro."
- "Foggy early morning with milky volumetric softness diffusing all light into pearl-white haze, faint golden sun-shafts struggling through the canopy, drifting mist obscuring the deeper forest, warm-amber lit-window accents, painted dreamy atmosphere."
- "Moonlit night with cool silver-blue light raking across the village, fireflies and glowbug clouds providing sparkling magical accents, warm-amber lantern-glow and lit-window glow as primary focal lighting, dark atmospheric haze receding, painted enchanted nightscape."
- "Sun-shower midday with golden raking light cutting through scattered raindrops, rainbow shimmer in the air, post-rain wet surfaces glistening, drifting sparkling motes, painted warm and luminous."

━━━ AVOID ━━━
- Generic "lit by golden light" without specifying weather/atmosphere
- Modern lighting language (LED, neon, electric) — keep painted-fantasy
- Dark/horror lighting moods — fae world is enchanted, never sinister

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete lighting+weather+atmosphere description (20-40 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
