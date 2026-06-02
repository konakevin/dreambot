#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/festival_market_backdrop.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} JAPANESE MATSURI / MARKET BACKDROP descriptions for a kawaii festival scene. Each entry is the SURROUNDING SETTING that frames the foreground — the matsuri/market backdrop, not the foreground characters or action.

Each entry: 18-30 words. ONE specific traditional Japanese festival/market setting. Atmospheric and evocative. NO foreground characters mentioned (those are in a separate axis).

Mix backdrop types broadly. Include both daytime and evening:
- Yatai food-stall lane lined with red-and-white striped awnings + chochin lanterns
- Shrine courtyard with stone-toro lanterns + temple-gate + worn stone steps
- Festival plaza with paper-streamer banners crisscrossed overhead + wooden yagura drum tower in center
- Outdoor market square with rows of fish-market stalls + tarp roofs + crates of produce
- Hanami picnic grove with cherry-blossom canopy + paper-lanterns strung between branches
- Temple grounds with stone path + curved-roof shrine in distance + maple-leaf canopy
- Floating-lantern river with paper-boats drifting + bridge railings + fireflies
- Festival market alley with hand-painted noren curtains + wooden shop-fronts
- Ramen-yokocho narrow lane with steaming yatai + bamboo-screens
- Hot-spring onsen-festival courtyard with stone bath + wooden bath-house + bamboo grove
- Edo-period market street with wooden buildings + tile rooftops + clay-pot stalls
- Kyoto-style geisha-district festival lane with traditional architecture + lantern-glow
- Summer-matsuri shrine forecourt with hanging windbells (furin) + bamboo wishing-tree
- Autumn momiji-matsuri grove with bright red-orange maple canopy + stone lanterns
- Bon-festival dance-circle plaza with yagura tower + drum + lantern-ring overhead
- Winter setsubun temple courtyard with dusting of snow + paper-mache demon masks for sale + lantern-pool warmth

Examples:
"A bustling yatai food-stall lane at dusk with red-and-white striped awnings lining both sides, chochin paper-lanterns strung overhead in glowing warm-orange rows, sakura petals drifting through the warm evening air."
"A peaceful shrine courtyard at twilight with stone-toro lanterns flanking the path, weathered curved-roof temple in the soft-focus background, maple leaves drifting across stone-tile ground."
"A festival plaza buzzing with celebration under a canopy of crisscrossed paper-streamer banners, wooden yagura drum-tower rising in the center, glowing chochin lanterns ringing the perimeter."
"An Edo-period market street with wooden two-story buildings, tile rooftops, clay-pot displays at every stall, paper-lantern light pooling warm against the wood, bamboo-screens softly diffusing the evening."

DO NOT write:
- Modern urban / mall / shopping-center / supermarket scenes — traditional Japanese ONLY
- Western festival / carnival / fairground — Japanese ONLY
- Foreground characters / foods / people doing things (those go in scene_type)
- Pathway / lane / alley RECEDING into vanishing point (composition stays clustered)
- Dark / scary / moody atmosphere

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
