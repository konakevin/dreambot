#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_background_detail.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (n) => `Write ${n} BACKGROUND-DETAIL entries for a MangaBot ANIME ISEKAI keyframe. Deep-distance anime-isekai-coded detail.

Each entry: 10-20 words. ONE anime-isekai deep-distance element.

ANIME ISEKAI DEEP-DISTANCE VARIETY:
- DISTANT MAGIC-TOWER (anime spiral wizard tower in deep distance)
- FLOATING ISLAND (anime sky-realm chunk of land far behind)
- DRAGON-SILHOUETTE FAR (anime dragon flying in deep distance)
- DISTANT FANTASY-CITY (anime fantasy city skyline at horizon)
- MOUNTAIN-FORTRESS (anime castle on far peak)
- MAGIC-PORTAL FAR (anime distant glowing portal-vortex)
- FAR-AWAY GUILD-BUILDING (anime adventurer's guild silhouette)
- DEMON-LORD-CASTLE (anime distant dark villain fortress)
- DISTANT-DRAGON-PERCH (anime dragon coiled on far peak)
- FOREST-OF-RUINS (anime ancient ruined fantasy temple at horizon)
- FAR-AWAY SKY-AIRSHIP (anime steampunk airship in fantasy sky)
- DISTANT SUNSET-CASTLE (anime castle silhouette at sunset)
- FLOATING-ROCK FORMATIONS (anime gravity-defying rock-clusters)
- SHRINE-PILGRIMS (anime distant fantasy pilgrims walking)
- MARKETPLACE-NPCS (anime distant NPC crowd in market)
- FAIRY-LIGHTS DRIFTING (anime fantasy festival-lights in distance)
- WATERFALL-CASCADE (anime massive fantasy waterfall far back)
- DISTANT-ELVEN-CITY (anime treetop elven city in deep distance)
- VOLCANIC-PEAK (anime fantasy volcano in distance)
- HOLY-LIGHT-PILLAR (anime divine light beam pillar in deep distance)

DO write:
- Anime spiral wizard tower in deep distance, painterly mage-tower silhouette
- Anime sky-realm floating island far behind with cascading waterfalls dripping off the edge
- Anime dragon silhouette flying in deep distance, painterly wings against the sky
- Anime fantasy city skyline at horizon, painterly spires and towers
- Anime castle on far mountain peak, fantasy fortress silhouette
- Anime distant glowing portal-vortex in deep background, dimensional gate
- Anime adventurer's guild building silhouette far behind, banner-pennants visible
- Anime distant dark demon-lord-castle, ominous silhouette in deep distance
- Anime ancient ruined fantasy temple at horizon, vine-overgrown ruins
- Anime distant steampunk airship floating in fantasy sky

DO NOT write:
- Foreground / midground elements
- Western photoreal fantasy backdrops
- Multiple details per entry

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
