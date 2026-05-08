#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/cherry_blossom_scenes.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} CHERRY-BLOSSOM-ROMANCE scene descriptions for MangaBot's cherry-blossom-romance path. Each entry is 30-50 words. Setting-only — describe the cherry-blossom setting, not the characters.

CONTEXT: Peak shoujo cherry-blossom anime keyframe. Hanami / school-uniform / first-love / wind-blown-petals aesthetic. Soft, romantic, gentle, pastel. The most iconic anime spring vibe. Pink-and-cream palette dominant.

Categories — rotate widely:
- Stone bridge over a stream lined with cherry trees in full bloom
- Quiet park path under cherry-blossom canopy with petals drifting
- Wooden school gate with cherry tree above, petals on the ground
- Sakura-lined river walkway at golden hour, petals on the water
- Cherry-blossom tree on a hilltop with bench, distant city
- Hanami picnic blanket under a cherry tree (no people, just blanket and laid-out food)
- Stone steps to a shrine lined with cherry trees, petals carpeting the steps
- Park bench beneath a single old cherry tree, view of the city
- Cherry-blossom tunnel-walk (path passing under a continuous canopy of pink)
- Dock or pier at a cherry-lined pond, petals on water
- Schoolyard with cherry trees in bloom (empty courtyard, drifting petals)
- Cherry-tree-lined train platform (rural station, branches overhanging)
- Cherry-blossom-lined country road with stone Jizo-statues
- Mountain hot-spring inn with cherry trees in the courtyard
- Garden teahouse with cherry tree in bloom outside the shoji screens
- Riverbank with hundreds of cherry trees on both sides reflecting in still water

EVERY entry must include:
- Specific cherry-blossom setting (bridge / path / school-gate / shrine-steps / etc.)
- 4-6 environmental details (cherry blossom branches in full bloom / petal-carpeted ground / stone-lantern / wooden bench / paper-lantern / wooden bridge railing / Jizo statues / kanji signage / bicycle leaning / picnic blanket / vending machine in distance)
- 1-2 atmospheric effects (drifting cherry petals — MANDATORY at high density, soft spring breeze, light pollen-haze, dappled spring light, soft pink mist)
- Lighting tone (golden-hour-amber-with-pink / soft-pastel-morning-light / blue-hour-pink-and-violet / dappled-shade)
- Romantic / gentle implied mood (someone could meet here / a moment of stillness / first-love-coded — but no characters in the entry)

ABSOLUTELY BANNED:
- NO photoreal photography (anime cel-shaded only)
- NO sexualized framing
- NO crowded scene (the air of stillness is the mood)
- NO out-of-season cherry blossoms with snow / autumn-leaves mixed
- NO Western parks (Japan-coded only)

Examples (write fresh):
- "Wooden arched bridge over a clear stream lined with hundreds of cherry trees in full bloom on both sides, pink petals drifting through the air and carpeting the bridge planks, stone lantern at the bridge entrance, soft golden-hour light filtering through the blossoms, drifting petals on the water below, distant temple silhouette"
- "Park path under a continuous cherry-blossom tunnel canopy at sunset, pink branches arching overhead and meeting at the center, petal-carpeted stone path, vintage iron lamp-post lit warm-amber, drifting petals catching the golden light, soft pink-and-amber haze, single park bench in the distance"
- "Old wooden school gate flanked by two ancient cherry trees in full bloom, petal-carpet across the threshold, stone path leading inward to a glimpse of the school building, hanging banner with kanji, single bicycle leaning against the wall, drifting petals catching morning light, soft pastel sky beyond"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
