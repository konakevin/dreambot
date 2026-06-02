#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/neo_tokyo_signage_density.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SIGNAGE-DENSITY entries for a MangaBot neo-tokyo cyberpunk anime keyframe. Each entry describes the SIGNATURE SIGN-CLUSTER that fills the frame — kanji, holographic, projection, neon-strip. Signage is the genre-defining visual texture of neo-tokyo; this axis enforces it.

Each entry: 14-26 words. ONE specific signage cluster (multiple specific signs grouped) — describes WHAT signs and HOW they fill the frame.

SIGNAGE TYPES to vary across the 50:
- STACKED KANJI billboards (multiple vertical/horizontal kanji billboard panels, walls of text)
- HOLOGRAPHIC ADS floating in air (3D projected ads, anime-character mascots, product spheres)
- ANIMATED NEON STRIPS (running animations, character-by-character text scroll)
- PROJECTED KANJI on building face (massive face-of-building projection, pink + cyan)
- HANGING NOREN-CURTAINS with red kanji (over yatai stalls, ramen-shop entrances)
- DIGITAL TICKERS scrolling (news / stock / data tickers wrapping building corners)
- HOLOGRAPHIC ANIME MASCOTS (giant anime-girl ads floating mid-air, waving)
- PACHINKO-PARLOR signage (lurid yellow + pink stacked signs, animated reels)
- HOSTESS-CLUB facades (pink-and-magenta cursive neon, hostess-photograph plaques)
- ELECTRONIC LANTERN-SIGNS (red paper-lantern shape but LED-glowing kanji)
- BUILDING-FACE HOLO-ADS (a single megabuilding wall = single giant animated ad)

DO write (vary by type):
- Stacked vertical kanji billboards twelve stories high on both alley walls, animated pink and cyan and yellow saturation
- Holographic 3D anime-girl mascot ad floating in the alley airspace, waving and rotating with floating product spheres
- Animated character-by-character kanji ticker scrolling sideways across a megabuilding face at midheight
- Hanging red electronic lantern-signs strung overhead in tight rows, LED kanji glowing through paper-shaped LED displays
- Pachinko-parlor stacked-yellow-pink signage with animated reel symbols spilling across the storefront facade
- Hostess-club pink cursive neon with rows of hostess-photograph plaques framing the entrance
- A single megabuilding face entirely a holographic anime-cosmetics ad, model-girl smiling at thirty stories tall

DO NOT write:
- Real corporate brands (Coca-Cola / Sony / etc.) — fictional kanji-and-fake-brand only
- Single signs in isolation — must describe a CLUSTER filling the frame
- Pastel/warm-amber signs — neon palette mandatory (pink/cyan/magenta/electric)
- Daytime / dim signs — saturated and glowing
- English-text signs (some English-mixed in is OK — but kanji must dominate)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
