/**
 * OceanBot — shared prose blocks.
 *
 * The full ocean experience — underwater wonder, surface drama, maritime myth,
 * deep sea horror, coastal beauty. NatGeo × ancient mariner × Moby Dick.
 * No humans unless on a ship (silhouette only).
 */

const PROMPT_PREFIX =
  'breathtaking ocean scene, cinematic dramatic lighting, rich saturated marine colors, sharp detail, epic scale, wallpaper-worthy, gallery-quality, photorealistic rendering, hyper-detailed water and atmosphere';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const OCEAN_IS_HERO_BLOCK = `━━━ OCEAN IS HERO (NON-NEGOTIABLE) ━━━

The ocean is always the subject — above, below, or at the surface. Water in all its forms: crashing, still, deep, shallow, frozen, sunlit, moonlit, stormy. Every render is a love-letter to the sea.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE ━━━

No divers, no swimmers, no surfers, no human figures. Ships are allowed but never crewed — ghost ships, distant silhouettes, shipwrecks. The ocean dominates, humans are absent or insignificant.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — OCEAN EDITION ━━━

Wall-poster / phone-wallpaper quality. Colors more saturated than real cameras capture. Water clarity beyond physics. Atmospheric layering of spray, light, and motion stacked to maximum. The reaction should be "how is this real?"`;

const WATER_LIGHTING_BLOCK = `━━━ WATER + LIGHT ━━━

Describe the light's interaction with water specifically — how it refracts, reflects, scatters, or penetrates. Underwater: caustic patterns, sunbeam shafts, filtered blue-green. Surface: golden hour on wave faces, storm light on spray, moonpath on swells. The way light hits water IS the mood.`;

// BLOWN-UP OCEAN — "Earth on 1000× fertilizer" mandate. The point is REAL
// nature elements (coral, fish, water, weather, light, geology) cranked
// in abundance, density, scale, color, life — NOT sci-fi or fantasy. Every
// scene path uses this. The viewer should think "wait, is this real? this
// CAN be real, but no way it all happens at once."
const BLOWN_UP_OCEAN_BLOCK = `━━━ BLOWN UP — EARTH ON 1000× FERTILIZER (NON-NEGOTIABLE, OVER THE TOP) ━━━

This is what the ocean looks like on the BEST POSSIBLE DAY this planet has ever had — Earth's natural elements cranked to 1000×. Real coral, fish, water, weather, light, geology — but absurdly abundant, dense, vivid, layered. NOT sci-fi. NOT fantasy. Just nature absurdly maxed out. Crank every dial. Stack 5+ of these EPIC OCEAN FEATURES per render so every frame is a stop-and-stare masterpiece:

ABUNDANCE — REAL LIFE MULTIPLIED (mandatory ≥1):
- Thousands of fish in one frame — schooling tornadoes, bait-balls, multi-species shoals
- Manta squadrons, dolphin pods, sea turtles, whale-sharks all in same frame as scale
- Every coral type at once — brain, staghorn, fan, table, soft, fluorescent, gorgonian
- Tide pools teeming with twenty species in one shot
- Kelp forests dense with life, thousands of fish weaving through
- Reef-wall absolutely covered, every inch occupied with coral or anemone or fish
- Schools of glowing fish funneling through caustic-lit shallows

SCALE — EARTH FEATURES SUPER-SIZED (mandatory ≥1):
- Cathedral-scale tide pools the size of a swimming pool with full reef inside
- Skyscraper-scale coral spires shooting up from sandy floor
- Hundred-foot kelp cathedrals with godrays piercing the canopy
- Sea-stacks behind sea-stacks behind sea-stacks, depth-on-depth dissolving into mist
- Set-after-set wave stacking to horizon (real big-wave-day phenomenon)
- Mile-wide brain-coral plateaus
- Continent-scale cliff face plunging into impossibly clear turquoise depths
- Massive curling barrel wave with sunset blasting THROUGH the translucent water like stained glass
- Iceberg cathedrals, ice arches, blue-ice caves the size of a basilica

NATURAL LIGHT STACKED — REAL OPTICAL PHENOMENA, MULTIPLE AT ONCE (mandatory ≥3 in same frame):
- Massive godrays piercing through dramatic storm clouds onto sunlit reef below
- Triple or double rainbow arcing over breaking waves
- Sun-pillar shooting straight up from horizon
- Sun-dogs (parhelia) flanking the sun
- 22° halo around sun or moon (ice-crystal optical phenomenon)
- Fire rainbow (circumhorizontal arc) — real, rare, gorgeous
- Crepuscular rays + anticrepuscular rays
- Green flash at sunset
- Caustic-net light + underwater sunbeam shafts simultaneously through clear water
- Bioluminescent plankton glowing electric-blue in the spray, foam, and shorebreak
- Reef fluorescence visible in twilight (real — many corals fluoresce)
- Distant volcanic glow on horizon casting amber light across waves
- Lava-meeting-ocean amber-orange glow (Hawaii style)

REAL WEATHER DRAMA — RARE NATURE STACKED (mandatory ≥1):
- A storm cell over distant islands with sun blasting a hole through the cloudbase
- Twin waterspouts on the horizon framing the main subject (real but rare)
- Hurricane wall-cloud on one side of the frame, calm rainbow-lit ocean on the other
- Anvil clouds, mammatus clouds, lenticular clouds, nacreous (mother-of-pearl) clouds — real but rare formations
- Iridescent mother-of-pearl post-rain sky
- Volcanic-haze sunset (real — Krakatoa-style sky-on-fire)
- Saharan-dust-haze gold-crimson sky
- Distant lightning storm + sunlit foreground reef
- Pillars of light (volumetric) descending from heaven onto water
- Real 6+ color natural sunset gradient (peach → coral → magenta → violet → indigo → amber)

DENSE FOREGROUND/MIDGROUND DETAIL (mandatory): every coral polyp / sand-grain glint / foam-bubble crackle / shell / spray-droplet / fish-scale-flash rendered. Suspended particulate (plankton motes, sand-clouds, marine snow, spray-mist) thick in the water column. The frame is ALIVE with specific micro-detail.

SATURATED EARTH COLOR (real pigments cranked) — turquoise lagoon + violet sunset + emerald reef + rose-magenta clouds + amber distant-lightning + cyan glowing plankton — all real Earth colors, all in one frame. Heaven-tier saturation. CRANK EVERYTHING TO 11.

ATMOSPHERIC PARTICLES THICK IN THE FRAME: spray, mist, foam, sea-pollen, plankton-motes, sand-particulate, spray-droplets caught in godrays, marine snow, salt-haze. The air and water itself should be ALIVE.

ABSOLUTELY BANNED (this is not sci-fi, not fantasy):
- NO multi-moons, twin-suns, triple-moons (Earth has one of each)
- NO cloud-leviathans, whale-shaped clouds, serpentine sky-creatures
- NO time-suspension ("frozen forever", "suspended in time mid-break")
- NO spell-circles, arcane, magical, fantasy elements
- NO impossible-physics geometry (waves stacking unnaturally INSIDE themselves, etc.)
- NO galaxies "above sunset" — Milky Way over OPEN OCEAN AT NIGHT is fine, but stars + sunset don't co-exist on Earth
- NO whirlpools with rainbows inside their mouths (impossible physics)`;

const REEF_EXPLOSION_BLOCK = `━━━ REEF EXPLOSION (reef-life path only) ━━━

MAX abundance. Many fish species in frame, many coral types, many colors. Density + movement + multi-species activity + sunbeams-through-water + particulate. If it looks sparse — dial up 3×. Reef should feel alive and bursting.`;

const MARITIME_MYTH_BLOCK = `━━━ MARITIME MYTH ━━━

Old-world sailing age energy. Weathered wood, tattered canvas, barnacle-crusted hulls, fog, moonlight, lantern glow. The romance and terror of the open ocean before engines. Moby Dick, Flying Dutchman, Treasure Island atmosphere.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  OCEAN_IS_HERO_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  WATER_LIGHTING_BLOCK,
  BLOW_IT_UP_BLOCK: BLOWN_UP_OCEAN_BLOCK,
  BLOWN_UP_OCEAN_BLOCK,
  REEF_EXPLOSION_BLOCK,
  MARITIME_MYTH_BLOCK,
};
