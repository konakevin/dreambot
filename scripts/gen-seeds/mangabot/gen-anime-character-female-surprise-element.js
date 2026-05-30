#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_female_surprise_element.json',
  total: 150,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SURPRISE ELEMENT entries for a MangaBot anime-character-female keyframe. Each entry is a small ANIME secondary subject placed at midground or background — a detail that adds story to the scene WITHOUT competing with the hero character for attention.

Each entry: 10-18 words. Names the element + its placement + scale + how it implies the wider anime world.

VARIETY MANDATE — distribute across these anime-canon secondary subjects:
- 18% YOKAI / SPIRIT FAMILIAR (small fox-spirit perched on shoulder / floating kodama in the canopy behind / tiny kitsune kit pawing at her hem / drifting ghostly cat watching from rooftop)
- 14% MAGICAL EFFECTS (status-window flickering at frame edge / floating mana-orb drifting past / spell-glyph rotating in deep distance / sparkling power-aura rim at shoulder)
- 12% NATURE / PETAL (cherry-petal cluster drifting through frame / falling maple leaf caught mid-arc / firefly cluster at deep midground / dragonfly hovering near her shoulder)
- 10% DAILY-LIFE OBJECTS (school-bell ringing in background / koi fish jumping in pond beyond / steam from her teacup rising in foreground / chime tinkling at the eave)
- 10% URBAN-ANIME DETAIL (vending machine glowing at frame edge / scrolling LED billboard in background / cat-bus shadow at horizon / hovercar light-trail sweeping past)
- 8% SHRINE / CULTURAL (paper-talisman drifting at frame edge / ema-board hanging behind / shimenawa rope catching breeze / temple bell catching light in background)
- 8% FOOD / KAWAII (parfait stack catching glitter-light at table edge / taiyaki cart steam rising at midground / pastel macarons spilled across the counter / pink phone-charm dangling near hand)
- 7% MECHA / SCI-FI (mecha shoulder visible behind her / floating drone tracking past / cockpit HUD glow at frame edge / chrome cable arcing across midground)
- 5% MUSICAL / FESTIVAL (taiko drum in deep background / festival lantern row at midground / hanabi firework bursting in deep sky / paper-fan dancer crossing background)
- 4% CREATURE ANIMAL (street cat watching from shop counter / black-cat familiar weaving past ankles / tanuki peeking from bushes / chibi-bird sitting on shoulder)
- 4% ATMOSPHERIC DETAIL (paper-lantern lights bobbing at the eaves / wind-chime swinging in background / hanging laundry catching breeze / pinwheel spinning at festival stall)

DO write:
- Tiny fox-spirit familiar perched on her shoulder, head tilted with curious smile, fluffy tail trailing
- Floating mana-orb drifting past at midground, casting soft cyan halo across her sleeve
- Cherry-petal cluster drifting through frame, three petals catching golden hour light against her hair
- School-bell ringing in background between buildings, blurred warm gold light pulsing at edge
- Vending machine glowing pink-cyan at frame edge, drinks visible in close midground
- Paper-talisman drifting up past her shoulder, kanji catching candle-warmth at edge
- Parfait stack catching glitter-light at counter edge, sparkly garnishes spilling forward
- Mecha shoulder visible behind her in deep midground, cockpit-light spilling cyan halo
- Black-cat familiar weaving past her ankles, green-glow eyes catching lantern light

DO NOT write:
- Anything FOREGROUND that would compete with the hero character (surprise stays mid-or-deep)
- "Distant vista" / "horizon beyond" / "vista in background" — those re-invite back-to-camera
- "Tiny figure of [companion / NPC] in distance" — that adds a second character (this path is solo)
- Multiple surprise elements per entry — ONE per entry
- Photoreal cinematography terms

Every entry implies the wider anime world without stealing focus from the hero character.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
