#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/ghibli_countryside_scenes.json',
  total: 200,
  batch: 25,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} GHIBLI-COUNTRYSIDE scene descriptions for MangaBot's ghibli-countryside path. Each entry is 30-50 words. Setting-only.

CONTEXT: Studio Ghibli pastoral wonder — Totoro / Kiki / Mononoke / Spirited-Away / Howl's / Whisper-of-the-Heart aesthetic. Rolling hills, windmills, farmhouses, magical realism, warm hand-painted backgrounds, cumulus clouds. The world is a CHARACTER. Sense of wonder and quiet magic.

Categories — rotate widely:
- Rolling green hills with single tree on horizon (Totoro-coded — emerald grass, blue sky, white cumulus)
- Wooden countryside farmhouse with vegetable garden, laundry on a line, late afternoon glow
- Stone bridge over a clear stream in a mountain valley
- Windmill on a hilltop with wildflowers in the foreground
- Old wooden train station in countryside, single platform, hill view
- Forest path with dappled light, mossy stones, ferns lining the trail
- Rice paddy at sunset (golden water reflecting amber sky, distant farmhouses)
- Lakeside boathouse with rowboat tied to dock, mountain reflection
- Stone shrine in a wooded clearing, mossy fox-statues, dappled light
- Mountain-village at dawn with mist between roofs
- Country road winding through wheat fields, telephone poles receding
- Hilltop view of a small valley with a river snaking through
- Rural train crossing with old striped barriers, spring blossoms above
- Yamadera-style mountain temple half-hidden in pine forest

EVERY entry must include:
- Specific countryside setting type (rolling hills / farmhouse / shrine / lake / etc.)
- 4-6 environmental details (wildflowers / wooden fence / stone wall / mossy steps / clothesline / clay-tile rooftops / rusted bicycle leaning / wooden buckets / oil-paper umbrella / farmer's straw hat hanging / vegetable garden / persimmon tree / chimney smoke)
- 1-2 atmospheric effects (drifting clouds, dappled light, dust motes in afternoon shafts, light wind through grass, butterflies, dragonflies, wisps of morning mist)
- Lighting tone (golden-hour / late-afternoon-amber / dappled-shade / blue-hour-pre-dusk / dawn-pastel-pink)
- Sense of quiet magic (a fox-spirit's tail just glimpsed past a tree / a small kodama in a stump / nothing magical but the air FEELS alive)

ABSOLUTELY BANNED:
- NO modern Western countryside (this is Japan-coded countryside)
- NO photoreal landscape photography
- NO power-plants / industrial intrusion (intentional pastoral purity)
- NO crowds (one or two distant figures OK)

Examples (write fresh):
- "Rolling emerald-green hills under a brilliant blue sky with massive cumulus clouds, a single ancient camphor tree silhouetted on the horizon, a winding dirt path leading toward it, scattered wildflowers in the foreground, dragonflies hovering, dappled afternoon light, a faint sense that the tree is watching"
- "Wooden two-story farmhouse with clay-tile roof and vegetable garden, laundry hanging on a line in the late-afternoon breeze, a rusted bicycle leaning against the wall, persimmon tree heavy with fruit, distant mountains receding into mist, golden-hour amber light, chickens pecking in the yard"
- "Stone bridge arching over a clear mountain stream, mossy boulders in the riverbed, ferns and wild grasses on the banks, a wooden lantern-post at the bridge entrance, dappled forest light filtering through cedar trees overhead, drifting cherry petals, soft sense of stillness"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
