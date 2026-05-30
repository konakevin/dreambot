#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_male_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SURPRISE ELEMENT entries for a MangaBot anime-character-MALE keyframe. Each entry is a small ANIME secondary subject placed at midground or background — adds story without competing with hero character.

Each entry: 10-18 words. Names element + placement + scale + how it implies the wider anime world.

MALE-CODED ANIME SECONDARY SUBJECTS (distribute):
- 16% YOKAI / SPIRIT FAMILIAR (raven-yokai perched on shoulder / weathered fox-spirit at his feet / tiny tanuki peeking from sleeve / floating yureghost mist hovering / wolf-yokai silhouette in deep background)
- 14% WEAPON / TOOL (sheathed katana on wall behind / hammered armor displayed on rack / brush-pen + ink-stone on counter / wrench-set glinting on workbench / fishing-rod resting in corner)
- 12% MAGICAL EFFECTS (rune-glyph rotating mid-air at frame edge / mana-orb floating past / power-aura rim at his shoulder / floating status-window flickering)
- 10% URBAN MALE DETAIL (vending-machine glow at frame edge / motorcycle-tail-light reflection / izakaya banner with kanji catching light / pachinko-machine soft-glow in background)
- 8% NATURE / SEASONAL (autumn-leaf catching slow-mid-arc / falling cherry-petal cluster in distance / snowfall drifting through frame / drifting bamboo-leaf at edge)
- 8% FOOD / DRINK (steaming ramen-bowl on counter / sake-flask + clay-tokkuri in midground / yakitori grill smoking behind / coffee siphon glowing soft amber in deep)
- 8% MECHA / SCI-FI (mecha-shoulder catching cyan halo behind / drone hovering past at midground / HUD-glow at frame edge / chrome cable arcing across midground)
- 6% SHRINE / SACRED (paper-talisman drifting at frame edge / shimenawa rope catching breeze / ema-board hanging behind / temple bell catching distant light)
- 6% MUSICAL / FESTIVAL (taiko drum at midground / festival lantern row in background / hanabi firework bursting in deep sky / paper-fan dancer crossing background)
- 4% CREATURE / ANIMAL (street cat watching from rooftop / wolf-shadow in deep forest / koi fish jumping in foreground pond / shoulder-perched bird)
- 4% SMOKE / STEAM (tobacco-smoke curling past at counter / forge-steam venting in deep midground / kettle-steam rising at edge / battlefield smoke drifting at horizon)
- 4% ATMOSPHERIC DETAIL (rain-streaks on the window beyond / paper-lantern reflections on wet pavement / wind-chime swinging in background / banner whipping in deep background)

DO write:
- Tiny raven-yokai perched on his shoulder, head tilted with knowing glint, feathers ruffled by wind
- Sheathed katana resting against wall behind him, lacquer catching dim lamplight, tassel hanging
- Floating rune-glyph rotating in cyan light at midground, casting halo across his sleeve
- Vending-machine glowing pink-cyan at frame edge, drinks visible close midground reflecting in puddle
- Autumn-leaf catching mid-arc through frame, three more drifting at deep midground in golden hour
- Steaming ramen-bowl on counter behind him, chopsticks resting across rim, broth curl rising
- Mecha-shoulder visible behind him in deep midground, cockpit-light spilling cyan halo
- Paper-talisman drifting up past his shoulder, kanji catching candle-warmth at edge
- Tobacco-smoke curling past from his sake-cup at counter, three rings rising in soft focus

DO NOT write:
- Anything FOREGROUND that competes with hero character (surprise stays mid-or-deep)
- "Distant vista" / "horizon beyond" — re-invites back-to-camera
- "Tiny figure of [companion / NPC] in distance" — adds second character (solo path)
- Multiple surprise elements per entry — ONE per entry
- Photoreal cinematography terms

Every entry implies wider anime world without stealing focus from hero character.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
