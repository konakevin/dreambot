#!/usr/bin/env node
/**
 * YumBot KAWAII_NIGHT_AUGMENT top-up (Stage 2 backfill 2026-06-05).
 *
 * Shared by 7 outdoor YumBot paths (rainbow-dreamscape, candy-fantasy,
 * floral-garden-scene, floral-garden-cup, cottagecore-nature,
 * kawaii-koi-pond, kawaii-koi-pond-ultra). Activates a ~30% chance to
 * SLAM the entire render into kawaii nighttime — Flux ignores soft night
 * language when surrounded by bright kawaii pastel tokens, so each entry
 * must DOMINATE with three triple-bolted locks: sky+time, light-source,
 * palette-override.
 *
 * Mirrors the existing 50 entries' register (pre-bolted DARK / NOT
 * twilight / REPLACE pastel-X-with-Y / NO daytime-sun rhythm). Topping
 * up toward 200; accepts natural ceiling.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/kawaii_night_augment.json',
  total: 200,
  batch: 20,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} aggressive KAWAII NIGHTTIME LOCK paragraphs for outdoor YumBot scenes. These paragraphs SLAM the entire render into nighttime — Flux ignores soft night-language when surrounded by bright kawaii-pastel tokens, so each entry must DOMINATE.

Each entry: 65-95 words. A single bold paragraph carrying THREE forced locks:

LOCK #1 — SKY + TIME LOCK (open the paragraph with this).
- Open with "FULLY DARK [night-sky-spec] NOT twilight NOT dusk."
- Use words like indigo, navy, midnight, inky, ink-black, deep-cobalt, jewel-violet, plum-purple sky.
- Always include a visible moon (crescent / full / gibbous / waning / waxing / blood-moon / harvest-moon) + stars.
- Vary star-density: scattered pinpricks / dense Milky-Way arch / constellation pinpricks / shooting-star streaks.

LOCK #2 — LIGHT-SOURCE LOCK.
- Explicitly call out: "scene illuminated ONLY by [combo of: moonlight + paper-lanterns / firefly drift / creature-bioluminescence / lotus-lantern halos / fairy-light strings / koi-glow / petal-shimmer / candle-jar / star-shine] — NO daytime sun, NO bright pastel lighting."
- The moon + lanterns must be the dominant key-light.

LOCK #3 — PALETTE OVERRIDE.
- Explicitly REPLACE the bright kawaii pastels with night-coded equivalents:
- "REPLACE bright pastels with deep indigo + cobalt + jewel-violet + pearl-cream + warm-lantern-amber + cool-moonlit-blue."
- Add bans: "NO blush-pink-sky, NO sunny mint, NO peach, NO bright-rainbow."
- The cast can still have soft kawaii skin (cream-pink-blush) — but the WORLD is dark.

━━━ EXAMPLES (mirror register, don't echo) ━━━

"FULLY DARK indigo-navy night sky with a crescent moon and pinprick stars NOT twilight NOT dusk. Scene illuminated ONLY by warm paper-lanterns strung overhead, lotus-lantern halos floating at scene-level, and gentle creature-bioluminescence — NO daytime sun, NO bright pastel lighting. REPLACE bright pastels with deep indigo + cobalt + warm-lantern-amber + pearl-cream + cool-moonlit-blue palette — NO blush-pink-sky, NO sunny mint, NO peach. Firefly drift, lantern-bokeh, and soft moon-haze fill the cool night air."

"FULLY DARK midnight-violet sky transitioning to inky-navy NOT twilight NOT dusk. The kawaii cast itself bioluminesces with gentle aqua-pearl inner-glow as the dominant light source, paper-lanterns and lotus-lanterns add warm-amber accents, NO daytime sun, NO bright pastel sunny light. REPLACE bright kawaii pastels with deep jewel-tones + cobalt + violet + warm-lantern-amber + cool moonlit-pearl. Drifting glow-motes and sparkle-dust shimmer through the dark cool air."

━━━ VARIATIONS to mix across ${n} entries ━━━

- MOON STATE — crescent / full / gibbous / waxing / waning / blood-moon / harvest-moon / new-moon (with stars only) / haloed-moon
- STAR FIELD — scattered pinpricks / dense Milky-Way arch / constellation pinpricks / shooting-star streaks / meteor shower / single bright comet
- PRIMARY LIGHT SOURCE — moonlight-only / paper-lanterns / lotus-lanterns / fairy-light strings / firefly drift / creature-bioluminescence / koi-glow under water / petal-shimmer-glow / candle-jar cluster / star-shine / glowing flowers / floating sky-lanterns
- COLOR TEMPERATURE MIX — warm-lantern-amber heavy / cool-moonlit-blue heavy / balanced / violet-jewel-tone forward / silver-pearl forward
- ATMOSPHERE — fog / mist / firefly motes / sparkle-dust / lantern-bokeh / moon-haze / dew-shimmer / floating glow-petals / drifting glow-bubbles

━━━ BANS ━━━

- NO "soft twilight" / "dusk" / "magic hour" / "blue hour" — those read transitional, NOT night. The lock is FULL NIGHT.
- NO "sunny" / "warm afternoon" / "bright" — purge all daytime register.
- NO photoreal / horror / spooky / Halloween / cinematic-noir.
- NO snow / storm / rain / heavy weather (cozy night, not stormy).
- NO people / chibi-humans / faces — kawaii creatures only.
- NO real-city / streetlamp / electric-grid / neon — magical lantern / firefly / moon only.
- NO repeating a moon-state + light-source combination across entries.

━━━ REGISTER ━━━

Cozy peaceful kawaii night. Studio-Ghibli warmth × bex.ai Pop-Mart kawaii. The night is safe and dreamy but UNAMBIGUOUSLY NIGHT — no twilight ambiguity. Each entry is a hammer breaking through bright-pastel surrounding tokens.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
