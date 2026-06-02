#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/rooftop_sunset_scenes.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} ROOFTOP-SUNSET scene descriptions for MangaBot's rooftop-sunsets path. Each entry is 30-50 words. Setting-only.

CONTEXT: Anime rooftop / cityscape / golden-hour aesthetic. Shinkai / Your-Lie-in-April / Beyond-the-Boundary / Kimi-no-Na-wa / 5cm-per-Second visual vocabulary. Introspective, romantic, melancholic golden-hour vibe. Wind in hair. City below. Dramatic sky.

Categories — rotate widely:
- School rooftop at sunset (chain-link fence, water-tank silhouette, skyline below)
- Apartment-balcony at golden hour (potted plants, hanging laundry, cityscape)
- Office-building rooftop with helipad (Tokyo at dusk visible across)
- Rooftop garden (planters, vines, succulents, sunset lighting)
- Rooftop with vending machines (warm fluorescent glow + golden hour mix)
- Pagoda-tower rooftop view (overlooking ancient + modern Tokyo blend)
- Rural farmhouse rooftop (looking over rice paddies at sunset)
- Subway-tower rooftop (industrial pipe + ladder + skyline)
- Train-platform rooftop overlook (overlooking train yard at dusk)
- Mountainside rooftop temple (overlooking valley at golden hour)
- Skyscraper rooftop with helipad-circle markings, sunset
- Rooftop laundry-pole scene (drying clothes lifting in golden wind)
- Ham-radio antenna rooftop (cluttered with equipment, golden light)
- Rooftop swimming pool empty at golden hour (water reflecting sunset sky)
- Cherry-blossom-rooftop at sunset (rare rooftop tree-garden in full bloom)

EVERY entry must include:
- Specific rooftop setting (school / apartment / office / pagoda / etc.)
- 4-6 environmental details (chain-link fence / water-tank / antennae / hanging laundry / vending machines / potted plants / clothes-drying-poles / rooftop ladders / skylight-domes / electrical conduits / pigeons / signage)
- 1-2 atmospheric effects (drifting clouds / haze / dust motes / lens-flare / drifting petals / smoke from a distant chimney / soft summer haze)
- Lighting tone (golden-hour-amber / blue-hour-cool / pink-and-orange-gradient / late-afternoon-warm)
- Vista anchor (city skyline / mountain silhouette / distant ocean / suburban sprawl)
- Wind / motion implied (clothes lifting / hair-coded element / drifting petals / stirring leaves)

ABSOLUTELY BANNED:
- NO photoreal cityscape photography (anime cel-shaded only)
- NO crowded rooftop (single character or empty)
- NO modern Western city skyline (Tokyo / Osaka / Kyoto / generic Japan-coded only)

Examples (write fresh):
- "School rooftop at sunset with chain-link fence wrapping the perimeter, water-tank silhouetted against an orange-and-pink sky, scattered cigarette butts on the concrete (no smoker visible), distant Tokyo skyline below, drifting cherry petals on the breeze, lens-flare from the low sun, soft haze, melancholic blue-hour creeping in"
- "Apartment-balcony at golden hour overlooking a quiet residential neighborhood, hanging laundry lifting in the warm breeze, three potted plants on the railing, a single bicycle leaning against the wall, distant skyline glowing amber, soft cumulus clouds drifting, dust motes in the slanted golden light"
- "Office-building helipad rooftop with painted circle markings at the center, painted Japanese kanji 'H' faded, distant Tokyo Tower silhouetted against violet-pink dusk sky, antennae and HVAC equipment in the foreground, drifting smoke from a distant chimney, blue-hour cool tones overtaking the warm sunset"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
