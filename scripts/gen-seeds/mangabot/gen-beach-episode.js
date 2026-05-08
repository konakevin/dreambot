#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_scenes.json',
  total: 25,
  batch: 25,
  append: false,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} BEACH-EPISODE scene descriptions for MangaBot's beach-episode path. Each entry is 30-50 words. Setting-only — describe the tropical / coastal / summer setting, not characters.

CONTEXT: Anime "beach episode" trope — bright tropical paradise, peak summer-vacation energy. Wholesome, vibrant, vacation-coded. Free!  / K-On! / Free!-Iwatobi / Nichijou / Lucky-Star summer-arc visual vocabulary. Ocean-blue + sand-cream + sky-cyan palette.

Categories — rotate widely:
- White-sand beach with rolling waves (foreground footprints, lifeguard stand, distant figures)
- Rocky cove with tide-pools (clear water, anemones visible, kelp drifting)
- Wooden beach pier at sunset (planks weathered, fishing rods leaning, sun on the horizon)
- Beach-side ramen / shaved-ice yatai stall (umbrella-covered food cart, sand drifted at the base)
- Tropical reef shore (coral visible through shallow water, palm trees overhanging)
- Cliff-top ocean overlook (grass cliff, ocean stretching to horizon, distant sailboats)
- Beach-house deck (wooden deck with hammock, ocean view, drying towels on rope)
- Sunset shore with paper lanterns strung overhead (between palms, pre-dusk warm light)
- Tide-pool at low tide (golden-hour, exposed kelp, hermit crabs, glassy puddles)
- Small fishing village beach (wooden boats pulled up on sand, fishing nets drying)
- Inflatable beach scene (inflatable rings and floats scattered on sand, beach umbrella)
- Boardwalk arcade (vintage arcade machines, cotton-candy stand, sun-bleached signs)
- Lighthouse on a small island offshore (rocky coast, white-and-red lighthouse, gulls)
- Coral-island lagoon (turquoise water, white sand, palm-shadow on the water)
- Beach festival lanterns (paper lanterns strung between palm trees, sand-and-sea backdrop)

EVERY entry must include:
- Specific beach setting type
- 4-6 environmental details (palm trees / beach umbrellas / sand-castles / surfboards / inflatable floats / paper-lanterns / wooden boardwalks / coral / shells / sea-glass / fishing nets / tide-pools / bamboo torch-stakes / vending machine glowing in shade / shaved-ice cart / colorful beach-towels)
- 1-2 atmospheric effects (sea-spray, drifting sand, heat-haze on horizon, distant gulls, drifting palm-leaves, salt-mist, sun-glare across water, drifting clouds)
- Lighting tone (high-noon-bright / golden-hour-amber / sunset-pink-and-orange / soft-morning-pastel / blue-hour-cool)
- Tropical color palette (cyan / turquoise / sand-cream / sunny-yellow / coral-pink / palm-green)

ABSOLUTELY BANNED:
- NO sexualized swimwear framing (anime-stylized, never pin-up)
- NO photoreal beach photography (cel-shaded anime only)
- NO crowded beach (one or two distant figures OK, not packed)
- NO Western coastal photography style

Examples (write fresh):
- "White-sand beach at golden hour with rolling turquoise waves, two beach umbrellas striped red-and-white planted at the high-tide line, scattered seashells and a forgotten beach-ball at the foreground, distant lifeguard stand, palm trees overhead, sea-spray catching the sunset light, drifting sand in the warm breeze"
- "Wooden fishing pier extending out over a calm bay at sunset, weathered grey planks underfoot, fishing rods leaning against the railing, paper lanterns strung overhead between posts, sun on the horizon casting orange path across the water, distant sailboat silhouettes, salt-mist drifting"
- "Tropical reef shore at low tide with crystal-clear shallow water revealing colorful coral, exposed kelp draped over rocks, scattered seashells and starfish, palm trees overhanging the sand, distant turquoise horizon, soft heat-haze on the water, golden-yellow afternoon light"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
