/**
 * EarthBot — shared prose blocks.
 *
 * The most breathtaking landscapes ever painted — real or imagined.
 * Earth on 1000× fertilizer — abundance + scale + light/weather stacking.
 * NatGeo drama meets Pandora beauty. Scene-centric: no humans.
 */

// PROMPT_PREFIX: pure aesthetic modifiers only — NO subject claims.
// "Landscape" / "natural vista" / "hyper-detailed environment" got pulled
// out because they made Flux lock onto a generic landscape composition
// before reading Sonnet's blown-up scene. Subject always comes from
// the path's seeds (the middle of the prompt). DragonBot/FaeBot pattern.
const PROMPT_PREFIX =
  'cinematic photography, sharp detail, rich saturated color, hyperreal rendering, gallery-quality, masterpiece';

const PROMPT_SUFFIX =
  'no humans, no people, no text, no words, no watermarks, hyper detailed, masterpiece quality';

const NATURE_IS_HERO_BLOCK = `━━━ NATURE IS THE HERO ━━━

The landscape itself is the subject. No narrative focus — the world is protagonist. The viewer should feel awe, wonder, and the urge to step into the frame. Pure geography and atmosphere, amplified beyond what any camera could capture.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE ━━━

No human figures anywhere. No hikers, no climbers, no silhouettes, no structures as subject. Pure landscape, pure nature, pure atmosphere.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY ━━━

Every render is wall-poster / phone-wallpaper quality. Colors more saturated than film captures. Atmospheric layering more dense than photographers catch. Lighting more perfect than nature usually offers. AI-generated beauty that feels impossible to see in person.`;

const LIGHTING_IS_EVERYTHING_BLOCK = `━━━ LIGHTING QUALITY ━━━

Light is a character in the frame. Stack visible volumetric phenomena when the scene calls for them — godrays through forest canopy, sunbeams through storm clouds, crepuscular rays at sunset, dappled shafts through arches. Always describe TIME OF DAY and WEATHER CONDITIONS specifically:

- Golden hour warm side-light with long shadows + atmospheric godrays
- Overcast soft diffuse light with rich saturated colors + iridescent post-rain sky
- Blue hour twilight with deep cool tones + sun-pillar fading
- Dawn pink light on snow or mist + rosy-fingered alpine glow
- Stormy dramatic skies + sun blasting through cloudbase + double rainbow
- Aurora borealis over ice + reflection on dark water

Describe the light's direction, warmth, and shadow quality. Volumetric atmosphere makes the scene feel BIG.`;

// BLOWN-UP EARTH — "Earth on 1000× fertilizer" mandate. Real geology,
// weather, flora, light — abundance + scale + density + stacked phenomena.
// NOT sci-fi. NOT fantasy. The viewer should think "wait, is this real?"
const BLOWN_UP_EARTH_BLOCK = `━━━ BLOWN UP — EARTH ON 1000× FERTILIZER (NON-NEGOTIABLE, OVER THE TOP) ━━━

This is what the landscape looks like on the BEST POSSIBLE DAY this planet has ever had — Earth's natural elements cranked to 1000×. Real geology, real weather, real flora, real light — but absurdly abundant, dense, vivid, layered. NOT sci-fi. NOT fantasy. Just nature absurdly maxed out. Crank every dial. Stack 5+ of these EPIC LANDSCAPE FEATURES per render so every frame is a stop-and-stare masterpiece:

SCALE — REAL EARTH FEATURES SUPER-SIZED (mandatory ≥1):
- Vertigo-inducing cliffs plunging into emerald canyons
- Mile-deep gorges with rivers visible as silver threads below
- Cathedral-scale ice arches in glacial fjords
- Sequoia-sized ancient trees with cathedral canopies
- Hundred-mile waterfalls thundering from mountain plateaus
- Sky-piercing peaks rising sheer from cloud floor
- Salt flats stretching to perfect mirror horizon
- Infinite mirror-lake reflecting entire mountain range
- Continent-spanning crescent bay viewed from mountaintop
- Sea of clouds covering valley below alpine summit
- Ancient banyan with roots like cathedrals
- Hundred-foot moss-covered boulders in old-growth forest

ABUNDANCE — REAL LIFE MULTIPLIED (mandatory ≥1):
- Wildflower meadows of impossible saturated color stretching to horizon
- Butterflies and dragonflies thick in golden air
- Dense moss and lichen on every rock and tree
- Tundra exploding with arctic blooms
- Mossy old-growth forests with ferns + glowing fungi
- Sequoia groves with ferns at every level
- Reef visible through crystal water teeming with fish
- Migrating wildlife (caribou herd, bison plains, flamingo lake) as scale
- Dense bamboo forest canopy filtering jade light

NATURAL LIGHT STACKED — REAL OPTICAL PHENOMENA, MULTIPLE AT ONCE (mandatory ≥3 in same frame):
- Massive godrays piercing through dramatic storm clouds onto sunlit valley below
- Triple or double rainbow arcing over canyon
- Sun-pillar shooting straight up from horizon
- Sun-dogs (parhelia) flanking the sun
- 22° halo around sun or moon (ice-crystal optical phenomenon)
- Fire rainbow (circumhorizontal arc) — real, rare, gorgeous
- Crepuscular rays + anticrepuscular rays
- Green flash at sunset
- Aurora borealis / aurora australis rippling overhead
- Bioluminescent glow on snow
- Lava-meeting-ocean amber-orange glow

REAL WEATHER DRAMA — RARE NATURE STACKED (mandatory ≥1):
- A storm cell over one side + sun blasting hole through cloudbase on other side
- Twin waterspouts on the horizon (real but rare)
- Anvil clouds, mammatus clouds, lenticular clouds, nacreous (mother-of-pearl) clouds
- Iridescent mother-of-pearl post-rain sky
- Volcanic-haze sunset (Krakatoa-style sky-on-fire)
- Saharan-dust-haze gold-crimson sky
- Distant lightning storm + sunlit foreground meadow
- Pillars of light (volumetric) descending through clouds onto valley
- Real 6+ color natural sunset gradient
- Sea of fog covering valley with mountaintops poking through

DENSE FOREGROUND DETAIL (mandatory): every leaf catching light, every dewdrop, every petal, every mossy stone, every fallen log, every fern frond, every wildflower rendered. The frame is ALIVE with specific micro-detail.

SATURATED EARTH COLOR (real pigments cranked) — autumn forest blazing red-orange-gold-magenta + violet alpine glow + cerulean glacier ice + emerald moss + cobalt sky + amber distant-lightning all in one frame. Six-color natural sunset gradient. Polar aurora + crimson volcanic glow + cold blue ice. Heaven-tier saturation. CRANK EVERYTHING TO 11.

ATMOSPHERIC PARTICLES (only when the specific scene calls for them — NOT a default): waterfall spray-mist at the base of a falls, snowflakes catching low sun in winter scenes, pollen drifting in a forest godray, dust-haze in a desert sunset. Default to CRISP CLEAR AIR with sharp distance visibility — fog/mist/haze should be the exception driven by the scene, never blanketed across every render.

ABSOLUTELY BANNED (this is not sci-fi, not fantasy):
- NO multi-moons, twin-suns, triple-moons (Earth has one of each)
- NO cloud-leviathans, whale-shaped clouds, serpentine sky-creatures
- NO time-suspension ("frozen forever", "suspended in time")
- NO spell-circles, arcane, magical, fantasy elements
- NO floating islands or impossible-physics geometry
- NO galaxies "above sunset" — Milky Way over OPEN LANDSCAPE AT NIGHT is fine, but stars + sunset don't co-exist on Earth`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  NATURE_IS_HERO_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  LIGHTING_IS_EVERYTHING_BLOCK,
  BLOW_IT_UP_BLOCK: BLOWN_UP_EARTH_BLOCK,
  BLOWN_UP_EARTH_BLOCK,
};
