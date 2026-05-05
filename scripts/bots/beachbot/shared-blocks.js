/**
 * BeachBot — shared prose blocks.
 *
 * Stunning beach settings. Tropical paradise, dramatic rocky coasts, beach-
 * life atmosphere, sunset beaches. BLOWN UP to 10×. Every render makes
 * viewer want to book a flight.
 */

const PROMPT_PREFIX =
  'stunning beach beauty, crystal-turquoise water, dramatic saturated sky, impossibly gorgeous coastal scene, wallpaper-worthy tropical paradise';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const BEACH_PARADISE_BLOCK = `━━━ BEACH PARADISE ENERGY (NON-NEGOTIABLE) ━━━

The JOY of being at the beach captured. Crystal water + warm light + dramatic scale + "I want to be there RIGHT NOW" feeling. Every render is an invitation to fly to this place. Beach-joy is the emotional target.`;

const WALLPAPER_WORTHY_BLOCK = `━━━ WALLPAPER WORTHY ━━━

Every render is phone-wallpaper / wall-poster quality. The kind of image that becomes someone's desktop background. Never generic. Always composition-perfect, light-perfect, saturation-maxed.`;

const NO_PEOPLE_BLOCK = `━━━ NO PEOPLE ━━━

No humans in frame. Scale-objects OK (boats, huts, umbrellas, hammocks, surfboards, lighthouses). Let the beach itself + objects speak.`;

const IMPOSSIBLE_BEAUTY_BLOCK = `━━━ IMPOSSIBLE BEAUTY — BEACH EDITION ━━━

Wall-poster travel-magazine-cover quality. Crystal water beyond real-world clarity. Sand more pristine than real. Sky more saturated than film captures. Nat-Geo-Travel × 10.`;

// BLOWN-UP BEACH — "Earth on 1000× fertilizer" mandate. Real palms, sand,
// water, sky, weather, geology, tropical flora — but absurdly lush, dense,
// vivid, layered. NOT sci-fi. NOT fantasy. The viewer should think
// "wait, is this real? this CAN be real, but no way it all happens at once."
const BLOWN_UP_BEACH_BLOCK = `━━━ BLOWN UP — EARTH ON 1000× FERTILIZER (NON-NEGOTIABLE, OVER THE TOP) ━━━

This is what a beach looks like on the BEST POSSIBLE DAY this planet has ever had — Earth's natural elements cranked to 1000×. Real palms, sand, water, sky, weather, geology, tropical flora — but absurdly lush, dense, vivid, layered. NOT sci-fi. NOT fantasy. Just nature absurdly maxed out. Crank every dial. Stack 5+ of these EPIC BEACH FEATURES per render so every frame is a stop-and-stare masterpiece:

ABUNDANCE — REAL LIFE MULTIPLIED (mandatory ≥1):
- Palm groves so dense they tunnel the path to the beach
- Tropical flowers blooming everywhere — plumeria, hibiscus, bird-of-paradise, frangipani, ginger, heliconia all at once
- Reef visible through clear water teeming with thousands of fish
- Butterflies and tropical birds in the canopy, parrots in the palms
- Tide pools with twenty species visible in one shot
- Hibiscus dropping into the surf-line, pollen drifting through golden air
- Breadfruit, coconut, mango hanging heavy on overarching branches
- Coral gardens beneath crystal shallows in fluorescent magenta-cyan-orange

SCALE — EARTH FEATURES SUPER-SIZED (mandatory ≥1):
- Sky-piercing volcanic peaks rising directly from a crystal lagoon
- Hundred-foot coconut palms arching far over the sand
- Cliff-face waterfalls pouring straight into the surf line
- Cathedral-scale tide pools the size of a swimming pool with reef gardens inside
- Sea-stacks behind sea-stacks behind sea-stacks dissolving into mist
- A massive curling barrel wave with sunset blasting THROUGH the translucent water like stained glass
- Continent-spanning crescent bay viewed from a mountaintop
- Ancient banyan with roots like cathedrals at the edge of the sand
- Sequoia-scale palms shooting impossibly tall, fronds catching light

NATURAL LIGHT STACKED — REAL OPTICAL PHENOMENA, MULTIPLE AT ONCE (mandatory ≥3 in same frame):
- Massive godrays piercing through dramatic storm clouds onto sunlit sand below
- Triple or double rainbow arcing over breaking waves and palm canopy
- Sun-pillar shooting straight up from horizon
- Sun-dogs (parhelia) flanking the sun
- 22° halo around sun or moon (ice-crystal optical phenomenon)
- Fire rainbow (circumhorizontal arc) — real, rare, gorgeous
- Crepuscular rays + anticrepuscular rays
- Green flash at sunset
- Bioluminescent plankton glowing electric-blue in the spray and shorebreak
- Reef fluorescence visible at twilight (real — many corals fluoresce)
- Distant volcano glowing amber on horizon, warm light across waves
- Lava-meeting-ocean amber-orange glow (Hawaii style)

REAL WEATHER DRAMA — RARE NATURE STACKED (mandatory ≥1):
- A storm cell over distant islands with sun blasting a hole through the cloudbase
- Twin waterspouts on the horizon framing the main subject (real but rare)
- Hurricane wall-cloud on one side of the frame, calm rainbow-lit beach on the other
- Anvil clouds, mammatus clouds, lenticular clouds, nacreous (mother-of-pearl) clouds — real but rare formations
- Iridescent mother-of-pearl post-rain sky
- Volcanic-haze sunset (real — Krakatoa-style sky-on-fire)
- Saharan-dust-haze gold-crimson sky
- Distant lightning storm + sunlit foreground beach
- Pillars of light (volumetric) descending from heaven onto the lagoon
- An anvil-cloud catching last light, blazing scarlet against deepening sky
- Real 6+ color natural sunset gradient (peach → coral → magenta → violet → indigo → amber)

DENSE FOREGROUND DETAIL (mandatory): every grain of sand, every shell, every flower-petal, every wet-sand-glint, every spray-droplet, every leaf catching light. Tide-pool detail with caustic-net light dancing on the floor. Foam-bubble crackle on shorebreak. The foreground is ALIVE with specific micro-detail.

SATURATED EARTH COLOR (real pigments cranked) — turquoise lagoon + violet sunset + emerald hills + rose-magenta clouds + amber distant-lightning all in one frame. Heaven-tier saturation. CRANK EVERYTHING TO 11.

ATMOSPHERIC PARTICLES THICK IN THE FRAME: spray, mist, foam, sea-spray drifting through godrays, sand-particulate kicked up by surf, pollen from tropical flowers thick in golden air, plankton-motes glowing at twilight, salt-haze. The air itself should be ALIVE.

ABSOLUTELY BANNED (this is not sci-fi, not fantasy):
- NO multi-moons, twin-suns, triple-moons (Earth has one of each)
- NO cloud-leviathans, whale-shaped clouds, serpentine sky-creatures
- NO time-suspension ("frozen forever", "suspended in time mid-break")
- NO spell-circles, arcane, magical, fantasy elements
- NO impossible-physics geometry (waves stacking unnaturally INSIDE themselves, etc.)
- NO galaxies "above sunset" — Milky Way over OPEN BEACH AT NIGHT is fine, but stars + sunset don't co-exist on Earth
- NO comet/meteor in the same frame as a sunset (timing-impossible)`;

const DRAMATIC_LIGHTING_BLOCK = `━━━ DRAMATIC LIGHTING ━━━

Named specific light treatments per render. Golden-hour slanted across sand. Blue-hour post-sunset. Storm-light breaking clouds. Backlit palms silhouetted. Moonlit-mirror ocean. Never generic — always specific + photographable.`;

const CLARK_LITTLE_WAVE_BLOCK = `━━━ CLARK LITTLE WAVE (wave path only) ━━━

Signature surf-photographer style. Unusual angles — inside the tube, crest close-up, through the curtain, water-level perspective. Rich backdrops (sunset / storm / rainbow). The wave IS the subject.`;

const POSTCARD_WIDE_ANGLE_BLOCK = `━━━ POSTCARD WIDE ANGLE (beach-landscape path only) ━━━

Wide postcard composition. Beach + surroundings + weather combined per frame. Overlook-from-cliff / from-out-in-water / entire-bay / through-palms / pulled-back-sand. Multiple elements woven together.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  BEACH_PARADISE_BLOCK,
  WALLPAPER_WORTHY_BLOCK,
  NO_PEOPLE_BLOCK,
  IMPOSSIBLE_BEAUTY_BLOCK,
  BLOW_IT_UP_BLOCK: BLOWN_UP_BEACH_BLOCK,
  BLOWN_UP_BEACH_BLOCK,
  DRAMATIC_LIGHTING_BLOCK,
  CLARK_LITTLE_WAVE_BLOCK,
  POSTCARD_WIDE_ANGLE_BLOCK,
};
