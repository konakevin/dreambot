#!/usr/bin/env node
/**
 * YumBot DREAM_LIGHTING top-up (Stage 2 backfill 2026-06-05).
 *
 * Lighting descriptors for rainbow-dreamscape — sunny pastel outdoor
 * light. Existing 60 cycle sunny-pastel-daylight, golden-hour, morning-
 * dewy, late-afternoon, twilight-magic, rainbow-prism. Topping up
 * toward 200 with greater nuance in each light register.
 *
 * NOTE: nighttime variants live in KAWAII_NIGHT_AUGMENT (gated ~30%).
 * This pool is OUTDOOR-DAYLIGHT-FOREVER.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/dream_lighting.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} LIGHTING descriptors for YumBot rainbow-dreamscape. Sunny pastel outdoor daytime light — the rainbow-dreamscape is a sunny pastel meadow with rainbows.

Each entry: 10-18 words. ONE lighting descriptor.

━━━ EXAMPLE PHRASINGS (mirror register) ━━━

"warm pastel-sunny daylight pouring softly across the blooming rainbow meadow"
"bright sunny pastel-light bathing the entire dreamscape in gentle warmth"
"honey-gold low-sun raking across the pastel landscape with soft shimmer"
"early-morning pastel-light with dew-sparkle catching the meadow grass"
"magic-hour twilight-pastel with rainbow-glow hanging in the air"
"rainbow-prism-light scattering across everything in soft pastel hues"

━━━ VARIETY MANDATE (distribute across ${n} entries) ━━━

- ~30% SUNNY PASTEL DAYLIGHT — warm pastel-sunny daylight pouring across meadow / bright pastel-light bathing the scene / soft warm pastel-noon glow / clean sunny pastel-light flooding the meadow
- ~22% GOLDEN-HOUR — warm-amber golden-hour light raking across the meadow / honey-gold low-sun shimmer / late-golden side-light kissing the pastel hills / warm-orange-amber raking long shadows in pastel
- ~14% MORNING-DEWY — early-morning pastel-light with dew-sparkle / fresh-morning sunny-pastel glow / mist-soft morning-light catching dew / first-light pastel-haze
- ~10% LATE-AFTERNOON — lazy late-afternoon pastel sun / soft 4pm warm-pastel light / golden-cream afternoon glow drifting long / late-day pastel-warmth
- ~8% TWILIGHT-MAGIC — magic-hour twilight-pastel with rainbow-glow / blue-hour with rainbow-shimmer / twilight-prism light / soft violet-rose-twilight haze (still OUTDOOR DAYTIME-ADJACENT, not full-night)
- ~6% RAINBOW-PRISM — rainbow-prism light scattering across everything / multi-rainbow-shimmer-light / prismatic rainbow-spectrum bathing the meadow / dancing rainbow-refraction light
- ~4% OVERCAST-PASTEL-SOFT — soft overcast pastel-diffused light / even pearl-pastel cloud-light / muted pastel-cloud-diffuse glow (still bright, still warm, just diffused)
- ~3% SUN-SHOWER-RAINBOW — soft sun-shower light with double-rainbow / sun-piercing-through-pastel-rain light / warm sun-shower glow with rainbow-arc
- ~3% POST-RAIN-FRESH — fresh post-rain pastel-light with dew-rebound / sparkling sun-after-rain glow / clean post-shower pastel-radiance

━━━ HARD MANDATES ━━━

- Sunny / outdoor / warm / bright.
- Pastel register — soft, cheerful, dreamy.
- The light should evoke a SUNNY OUTDOOR DAY (or a magical-twilight-adjacent moment, never full night).

━━━ HARD BANS ━━━

- NO dark / moody / dramatic / harsh contrast.
- NO indoor / artificial / stage-light / studio-light.
- NO storm / thunder / heavy-rain.
- NO night / midnight / moonlight (that lives in KAWAII_NIGHT_AUGMENT).
- NO photographer-name / lens-spec / camera-jargon.
- NO repeating the same light-state across entries.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
