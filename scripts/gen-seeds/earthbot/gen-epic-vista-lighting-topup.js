#!/usr/bin/env node
/**
 * EarthBot EPIC_VISTA_LIGHTING top-up (Stage 2 backfill 2026-06-05).
 *
 * Shared across 9 EarthBot paths — wide-vista landscape lighting
 * conditions. Existing 76 entries are dense, technical, cinematographer-
 * grade — they name the precise minute-window, color-temp split, shadow
 * geometry, and the chromatic intensity of each surface plane.
 *
 * REGISTER: 40-70 words. CINEMATIC light direction. Each entry names:
 *   1. TIME WINDOW (precise — "golden hour 75-second window", "polar
 *      twilight extended 40-minute hour", "tropical midday overhead")
 *   2. LIGHT GEOMETRY (rake / overhead / underlight / backlight / etc.)
 *   3. COLOR SPLIT (warm sidelight + cool shadow / saturated cobalt
 *      zenith / cool moonlit-blue tundra)
 *   4. SURFACE EFFECT (how it interacts with cliff, water, ice, foliage)
 *
 * BIOME-NEUTRAL — can light forest, jungle, coast, sunset, vista,
 * tropical, hawaii, sacred-light, national-park scenes equivalently.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/earthbot/seeds/epic_vista_lighting.json',
  total: 200,
  batch: 15,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new LIGHTING descriptors for EarthBot's epic-vista pool (shared by 9 paths: epic-vista / sacred-light / national-parks / deep-forest / lush-jungle / coastal-vista / tropical-paradise / hawaii-flowers / epic-sunset). Each entry is a CINEMATOGRAPHER-GRADE wide-vista lighting condition.

Each entry: 40-70 words. ONE complete light-condition paragraph.

━━━ EXAMPLE PHRASINGS (mirror this dense register exactly) ━━━

"Golden hour rake from low west at the precise 75-second window before the disc clips the plateau rim — warm amber-tangerine sidelight burning horizontal across layered sandstone faces, slot-canyon floors plunging into deep burnt-sienna shadow, distant escarpments igniting copper-rose against saturated cobalt zenith"

"Storm-cell anvil underlight — setting sun striking the cloud base from below, belly of the anvil burning saturated rose-magenta and copper, terrain beneath sunk in deep charcoal-purple shadow, the blazing cloud ceiling contrasting the darkened earth at maximum chromatic split"

"Polar twilight extended hour — sky holding deep indigo at zenith bleeding unbroken to rose at the horizon for forty minutes, snow fields below catching cool blue-violet glow, no hard shadows, pure luminous diffuse from a sky still burning"

"Harsh equatorial midday overhead — sun at absolute zenith, shadows punched directly beneath every boulder and overhang in hard-edged black at minimum length, lagoon surface blazing white-turquoise at peak chromatic saturation, color temperature white-neutral, every surface stripped to its most intense chromatic value"

━━━ STRUCTURAL TEMPLATE (every entry follows this) ━━━

[TIME-WINDOW NAME with precise duration / sun-angle] — [LIGHT-GEOMETRY direction] [color of the warm side] [color of the cool side / shadow plane], [surface 1] catching [color/effect], [surface 2 / zenith / horizon] [color], [shadow geometry detail], [chromatic-split note OR atmospheric scattering note]

━━━ VARIETY MANDATE (distribute across ${n} new entries) ━━━

GOLDEN HOUR variants (~20%):
- Sunrise rake / sunset rake / first-light kiss / last-light kiss
- 75-second windows / 90-second windows / 2-minute windows / 5-minute golden-cap
- East / west / southeast / northwest rakes
- Disc-touching-ridge moments / disc-clipping-rim moments / disc-just-below

BLUE HOUR variants (~12%):
- Civil twilight / nautical twilight / astronomical twilight
- Pre-dawn deep-blue / post-sunset deep-blue
- 30-min before sunrise / 45-min after sunset
- Sky-only-source (no direct sun) / star-emerging windows

OVERHEAD MIDDAY (~10%):
- Tropical zenith / equatorial vertical / harsh-summer noon
- Sub-tropical 78-degree sun-angle / temperate-zone noon
- Color-temperature white-neutral / hard-shadow minimum-length

STORM / WEATHER LIGHT (~12%):
- Storm-cell anvil underlight / lightning underlight / brief sun-break in storm
- Sun-shaft piercing storm / shaft-of-light through gap / spot-light effect through cloud-hole
- Post-storm crystalline air / wash-cleaned-atmosphere first-light
- Single-shaft through gathered fog

ALPENGLOW / ICE-LIGHT (~10%):
- Pre-sunrise alpenglow on peaks / post-sunset alpenglow / pink-rose mountain glow
- Glacier-ice catching sun / blue-ice glow / snow-pack reflecting cobalt
- Polar twilight extended / polar dawn lasting hours / arctic noon-twilight
- Midnight sun (polar summer) silver-cyan flat-rake

DIFFUSE / OVERCAST (~10%):
- Even pearl-grey light / silver overcast soft-shadow / no-direct-sun
- Ambient sky-source only / pure dome-diffuse / wrap-around shadow-less
- Misty diffuse with mid-haze / cloudless white-sky high-altitude

BACK-LIGHT / RIM-LIGHT (~8%):
- Sun behind subject creating rim-glow / silver-edged silhouette
- Translucent foliage backlit / petal-veins glowing through / spider-web catching backlight
- Underwater backlight (caustics rippling)

UNDERLIGHT (~5%):
- Reflected light from below (water bouncing onto trees / snow reflecting onto cloud-bases)
- Bonfire / lava / hot-spring / volcanic-vent underlight on landscape
- Sea-foam reflecting sun onto a cliff face

DAWN / DUSK SPECIFIC SUB-WINDOWS (~10%):
- First-purple-light pre-civil-dawn / nautical-twilight blue dome
- Belt of Venus rose-band with shadow band / Earth-shadow horizon arc
- Cathedral last-light spot / lone spot of red on a single peak / last-finger-of-light

UNUSUAL / RARE WINDOWS (~3%):
- Eclipse silver-light / total-solar diamond-ring instant
- Aurora-underlight onto snow / volcanic-sunset Krakatoa-effect
- Smoke-darkened-sun copper noon / dust-storm orange noon

━━━ HARD MANDATES ━━━

- Cinematographer-grade specificity — name actual color words (amber-tangerine / rose-magenta / cobalt / copper-rose / blue-violet / silver-cyan / charcoal-purple).
- Each entry names a TIME WINDOW with precise sun-angle or duration where possible.
- BIOME-NEUTRAL — describe surfaces generically enough to work on cliff/forest/coast/jungle ("sandstone faces", "snow fields", "lagoon surface", "ridge silhouettes", "canopy crown", "cliff face").
- Use sentence-fragment cinematic register (em-dashes welcomed; commas for layered detail).
- 40-70 words. Dense, packed, no filler.

━━━ HARD BANS ━━━

- NO biome-locking ("above the African savanna" NO — keep BIOME-NEUTRAL — use "across the plain", "over distant ridges").
- NO photographer-name drops (NO Marc Adamus / Peter Lik / Adams / etc.).
- NO camera-jargon (NO Hasselblad / Phase One / Leica / ISO / aperture / 100MP).
- NO travel-magazine register (NO "wallpaper-worthy", NO "Pulitzer", NO "editorial gravitas").
- NO "stunning", "breathtaking", "magnificent" filler — describe specifics.
- NO repeating the same time-window name across entries (each window is unique).
- NO "8K", "tack-sharp", "razor-sharp" tech-spec language.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one paragraph per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
