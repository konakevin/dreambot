#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SHONEN-COMBAT SURPRISE entries — small combat-coded secondary subjects at midground/background.

Each entry: 10-18 words. Element + placement + implies battle-world.

VARIETY:
- 20% ENEMY-SHADOW/SILHOUETTE (cursed-creature silhouette in deep distance / shadow-foe stalking midground / dark-army silhouette beyond / boss-shadow rising at horizon)
- 14% DEBRIS/SHOCKWAVE (concrete chunks suspended mid-air / shockwave-ring radiating at midground / dust-cloud spiraling behind / glass-shards floating in mid-shatter)
- 12% KANJI/POWER-TEXT (giant kanji-glyph "破" or "斬" floating mid-air / floating power-text in deep background / energy-name kanji manifesting / cursed-rune-text spinning)
- 10% SPIRIT-CREATURE (shikigami crow gliding past / spirit-fox tail-trail at midground / familiar-wolf shadow / divine-creature wisp)
- 8% SPELL-RING/RUNE (rotating rune-circle at midground / projection of spell-array / chakra-spiral floating / mana-circle materializing)
- 8% WEAPON-AFTERIMAGE (weapon afterimages trailing past / clone-shadows flickering / multi-strike-trails / shadow-clone wisp at edge)
- 6% ATMOSPHERIC PARTICLES (cherry-petals storming through / falling snow with combat-energy / ash-rain descending / leaf-storm whipping)
- 6% TECHNOLOGY (mecha-shoulder visible behind / hovering drone at midground / HUD-elements at frame edge / hologram-projection)
- 6% ENERGY-TRAILS (lightning-arc trailing past / fire-tendril coiling / wind-cyclone behind / shadow-tendril whipping)
- 5% TEAM-SILHOUETTE (allied team-silhouette charging in deep distance / partner mid-leap at deep midground / rival appearing silhouetted)
- 5% BUILDING-CRUMBLING (tower collapsing in deep distance / wall cracking at midground / pillar shattering / castle-spire falling at horizon)

DO write:
- Cursed-creature silhouette stalking in deep distance, eyes glowing crimson through smoke-haze
- Concrete debris-chunks suspended mid-air around him, shockwave-ring radiating outward at midground
- Giant kanji-glyph "破" floating in deep midground above, cyan glow pulsing with each strike
- Shikigami crow gliding past at midground level, dark feathers catching power-aura glow

DO NOT: foreground competing with hero / "distant vista" / multiple surprises per entry.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
