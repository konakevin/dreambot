#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_scenes.json',
  total: 200,
  batch: 25,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} MAGICAL-GIRL CELESTIAL scene descriptions for MangaBot's magical-girl path. Each entry is 30-50 words. Setting-only — describe the cosmic / celestial / transformation backdrop, not the magical-girl herself.

CONTEXT: Mahou shoujo aesthetic — Sailor-Moon / Madoka / Card-Captor-Sakura / Pretty-Cure / CLAMP-spiritual visual vocabulary. Cosmic backdrops, transformation halos, ribbon-streamers, celestial energy. Sparkle-and-shimmer maxed out. Pink / lavender / gold / opalescent palette.

Categories — rotate widely:
- Cosmic transformation halo (rings of stars and ribbons surrounding empty center where she will appear)
- Crescent-moon backdrop (giant crescent moon dominating the sky, stars dusting the void, ribbon-streamers floating)
- Cosmic flower-mandala (giant celestial mandala of flowers with light-streamers radiating outward)
- Star-shower descent (sparkles raining downward through soft pink-and-violet clouds)
- Floating-island court (crystal-and-gold cathedral floating in a pastel sky)
- Moonlit ocean of clouds (an endless cloudscape under a giant moon, lit ribbons drifting)
- Constellation dance (a constellation outline glowing among soft cosmic clouds)
- Ribbon-twirl scene (ribbon-streamers spiraling in mid-air, sparkle-particles, soft cosmic background)
- Celestial garden (giant flowers floating in space, crystal pathways, soft glow)
- Transformation mid-frame (geometric magic-circle on the floor with light-rays rising, partial cosmic backdrop above)

EVERY entry must include:
- Specific celestial setting (cosmic-clouds / crescent-moon / mandala / constellation / etc.)
- 4-6 environmental details (ribbon-streamers / sparkle-particles / floating crystals / glowing flower-petals / star-clusters / cosmic dust / floating glyphs / crystal pillars / opalescent prisms)
- 1-2 atmospheric effects (sparkle-mist, descending star-shower, drifting petals, cosmic-haze, ribbon-wind)
- Lighting tone (soft pink-and-lavender bloom / cosmic backlight / crescent-moon-rim / celestial god-rays / opalescent shimmer)
- Pastel palette anchor (pink / lavender / gold / opalescent / mint / soft-violet / cream)

ABSOLUTELY BANNED:
- NO photoreal space (this is anime celestial, not NASA)
- NO dark-cosmic-horror (mahou shoujo is BRIGHT and beautiful, not Lovecraftian)
- NO sexualized framing (mahou shoujo is wholesome / aspirational)
- NO franchise names (no Sailor Moon / Madoka by name)

Examples (write fresh):
- "Cosmic transformation halo of pink-and-gold ribbons spiraling inward toward a glowing central point, hundreds of star-sparkles raining downward, opalescent cloud-cover behind, floating crystal-petals drifting, soft pastel-violet bloom-haze, celestial backlight glow"
- "Giant crescent moon dominating a soft-violet sky, scattered stars dusting the cosmic background, ribbon-streamers of pink-and-gold drifting horizontally across the frame, floating crystal-shards, sparkle-particles drifting, soft pink rim-light from below the horizon"
- "Floating crystal cathedral on a pastel cloudscape, ornate gold-and-pink architecture with stained-glass roses and trailing crystal-vines, ribbons floating between spires, sparkle-mist below, celestial god-rays piercing the soft clouds"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
