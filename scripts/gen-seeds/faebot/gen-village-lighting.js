#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/village_lighting.json',
  total: 200,
  batch: 40,
  append: false,
  maxTokens: 6000,
  metaPrompt: (n) => `Write ${n} LIGHTING + WEATHER + ATMOSPHERIC-MAGIC descriptions for FaeBot's fae-village path. Each entry is 25-45 words describing a coupled lighting/weather/atmospheric treatment that gets layered into a fae-village painted-fantasy scene. Lighting and weather are inseparable; magical atmospheric particles are part of the lighting layer.

━━━ EVERY ENTRY MUST INCLUDE ━━━

1. **TIME OF DAY** (dawn / golden hour / midday / dusk / twilight / blue hour / night / pre-dawn / post-rain morning / etc.)
2. **WEATHER CONDITION** (sunny / rainy / foggy / misty / overcast / sun-shower / storm-break / drizzling / snowing / clear / hot-haze)
3. **VOLUMETRIC GOD-RAYS / SUN-SHAFTS / LIGHT-BEAMS PIERCING THE CANOPY** (NON-NEGOTIABLE — every entry. Even rainy/foggy/night entries must include visible light shafts of some kind: moonbeams piercing fog, lantern god-rays through mist, dawn light cutting through canopy. Light is ALWAYS shaped, ALWAYS visible as beams.)
4. **ATMOSPHERIC MAGIC** — pick from the magical-particulate vocabulary below. Every scene gets a sprinkle of forest-magic via these particles. Without this layer the village feels too mundane.

━━━ ATMOSPHERIC MAGIC VOCABULARY (rotate broadly across the pool) ━━━

PARTICULATE MAGIC (every entry includes one):
- **Floating spores** — drifting upward from mushrooms, glowing soft pale-green or warm-amber, like fireflies but slower and bigger
- **Glowing pollen** — golden-yellow drifting motes from forest flowers, dense in light shafts
- **Tiny drifting magical lights** — like miniature stars suspended in air, gentle pulse, blue-white or pale-amber
- **Sparkling magical motes / dust** — tiny glittering specks catching light, dense around the village
- **Drifting petals** — pink cherry / white apple / yellow ash leaf petals carried on a gentle breeze
- **Wisps / spirit-vapor** — soft milky tendrils threading between trunks, faintly luminous
- **Firefly clouds** — slow constellation of warm glowing pinpricks (especially night/dusk)
- **Sparkling water droplets** — post-rain, in golden light, rainbow shimmer
- **Drifting embers / lantern sparks** — gold flecks rising from cottage chimneys / lanterns
- **Pale crystal-shimmer** — ice-blue twinkles especially in pre-dawn / dawn / blue-hour scenes

MUNDANE PARTICULATE (always include alongside magic):
- mist / fog / rain streaks / drifting dust / pollen-motes / falling leaves / water-spray / smoke-haze

━━━ TIME × WEATHER VARIETY ━━━

Spread across all combinations:
- DAWN clear / golden / pink-pearl / fog-rolling / pre-dawn pearl-grey
- EARLY MORNING dappled / drifting mist / post-rain crystalline
- GOLDEN HOUR sunny / rainy / hazy / pollen-shafts / late-amber dusty
- MIDDAY dappled / overcast / sun-shower / hot-haze
- DUSK twilight blue / fog rising / amber-pink / drizzle ending
- TWILIGHT misty / starlight emerging / overcast cool
- BLUE HOUR atmospheric / fog-drifted / cool-blue with warm window glows
- NIGHT moonlit / firefly-only / overcast-dark with lantern glow / post-rain wet
- RAINY day in soft cool diffuse, raindrops visible as silver streaks
- FOGGY morning with milky volumetric softness
- STORMY with single break of golden light through dark clouds
- SNOWY with soft drifting flakes (rare — fae-friendly winter)

━━━ EXAMPLES (write fresh — do not copy) ━━━

- "Golden-hour clear afternoon, volumetric god-rays piercing through dense canopy, glowing pollen drifting golden in the warm beams, sparkling magical motes accumulating, lush atmospheric haze, warm-amber lit-window accents."
- "Twilight blue hour with fog rolling through the lower forest, floating spores rising softly from mossy ground glowing pale-green, single shafts of magenta-violet light breaking through canopy gaps, painted atmospheric depth."
- "Foggy early morning with milky volumetric softness, faint golden sun-shafts struggling through canopy, drifting petals on a gentle breeze, tiny drifting magical lights pulsing blue-white in the haze, painted dreamy atmosphere."
- "Moonlit night with cool silver-blue raking light, firefly clouds drifting between dwellings, pale crystal-shimmer in the air, warm-amber lantern-glow as primary focal lighting, dark atmospheric haze receding."
- "Post-rain morning with golden raking light cutting through scattered raindrops, rainbow shimmer in the air, sparkling water droplets, glowing pollen drifting through the rays, painted warm and luminous."
- "Pre-dawn pearl-grey light just blooming, drifting mist around dwellings, pale crystal-shimmer twinkling, faint golden god-rays starting to break through canopy, warm interior lantern-glow strongest against cool ambient."
- "Stormy mid-afternoon with a single break of golden sunlight piercing dark clouds, raking light hitting the village, atmospheric rain-haze, drifting embers from chimneys, painted cinematic chiaroscuro."
- "Sun-shower midday with golden raking light cutting through scattered raindrops, glowing pollen suspended in the rays, drifting petals, post-rain wet surfaces glistening, painted warm and luminous."
- "Dusk amber-pink afterglow with low warm raking light, wisps of spirit-vapor threading between trunks faintly luminous, sparkling magical motes accumulating, drifting embers from a chimney."

━━━ AVOID ━━━

- Generic "lit by golden light" without specifying weather/atmosphere/magic
- Modern lighting language (LED, neon, electric) — keep painted-fantasy
- Dark/horror lighting moods — fae world is enchanted, never sinister
- Skipping the atmospheric-magic layer — every entry must have one magical-particulate element

━━━ STRUCTURAL VARIETY (NON-NEGOTIABLE — pool will be 200 entries) ━━━

When prior batches are shown as "ALREADY GENERATED" — actively diverge. Vary time × weather × magical-particulate combinations. Do NOT repeat opening words across consecutive entries. Mix all 9+ time-of-day options × 12+ weather conditions × 10+ atmospheric-magic types.

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete lighting+weather+magic description (25-45 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
