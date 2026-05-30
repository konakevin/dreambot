#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_character_female_setting.json',
  total: 200,
  batch: 15,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ANIME SETTING entries for a MangaBot anime-character-female keyframe. Each entry is the immediate stage where the character is naturally ENGAGED with something IN-FRAME — NOT a distant vista she's looking out at.

⚠️ CRITICAL ANTI-BACK-TO-CAMERA RULE — every setting must afford the character a forward-facing engagement. Settings where the character "looks out over a vista" / "stands at a window/balcony/bridge" / "walks toward a distant temple" produce back-to-camera renders. Settings where the character is INSIDE an active environment (cooking / casting / fighting / training / serving / drawing / petting) afford forward-facing compositions.

Each entry: 14-22 words. Names the setting + tactile foreground detail + midground depth + the active engagement-context.

VARIETY MANDATE — distribute across:
- 16% SCHOOL / CAMPUS (rooftop with mahjong tiles / classroom desk with chalk-dust / clubroom / library / lockers / school festival booth)
- 12% SHRINE / TEMPLE (altar with offering bowls / shrine courtyard at festival / ema-board / fortune-paper stand / behind temple sliding doors with floor work)
- 12% URBAN ANIME (cyber-Tokyo alley with vending-machine glow / shibuya crossing café window / streetside ramen-counter / arcade interior with neon UFO catchers / izakaya counter mid-pour)
- 11% MAGICAL-GIRL ARENA (transformation circle on glittering ground / crystal-spell-circle interior / pastel cloud-realm with floating ribbons / floating spell-tower with active glyphs)
- 10% MECHA / SCI-FI (hangar deck with mecha cockpit canopy open / loading-bay catwalk with mecha shoulder behind / cockpit interior with HUD-lit glow / launch-tube with steam venting)
- 10% DOJO / DOMESTIC (dojo training-mat with bokken / kitchen island with onigiri-prep / engawa porch with tea-set / bathhouse onsen with steaming basin / kotatsu room with manga spilled)
- 8% FANTASY / ISEKAI (forest-spirit grove with floating orbs / guild-hall counter with maps / alchemy lab with bubbling cauldron / dungeon-spell-circle interior)
- 8% NATURE / OUTDOOR (cherry-blossom court with petals already piled / mountain stream with kicked-up spray / firefly meadow with wading deep in fronds / koi pond stepping-stone path)
- 7% FOOD / CAFE (maid-cafe counter with parfait stacked / patisserie with macaron tower / yakisoba street-cart with mid-flip pan / coffee siphon glowing at the bar)
- 6% YOKAI / OCCULT (talisman shop interior with bells / midnight crossroads with talisman fluttering / haunted forest with floating lanterns close / spirit-realm island with active rune circle)

DO write:
- Shrine altar interior, offering-bowls of rice in foreground, paper-talisman strings hanging close, deep cedar-pillar darkness beyond — she stands AT the altar mid-blessing
- Cyber-Tokyo alley with vending-machine cyan glow on wet pavement foreground, kanji signage receding into rain-haze — she stands UNDER the awning facing the camera
- Magical-girl transformation circle, glittering glyphs ground-up close, pastel ribbons spiraling at midground, cloud-realm receding — she stands INSIDE the circle mid-cast
- Mecha hangar deck, cockpit canopy hinged open close-up, mecha shoulder filling midground behind her, deck floor with cables snaking — she stands ON the deck checking gauntlet
- Onsen bathhouse with steam veil drifting close, wooden water-bucket on stone ledge, lantern-lit bath beyond — she sits ON the stone ledge wringing towel toward viewer
- Maid-cafe counter, parfait-stack and pink phone-charm in close foreground, pastel banners receding, kawaii display behind — she leans OVER the counter offering parfait toward viewer

DO NOT write:
- "Standing at the window / balcony / bridge looking out over X" — back-to-camera trap
- "Walking toward the [temple / gate / shrine] in the distance" — back-to-camera trap
- "Looking out over the city / valley / vista" — back-to-camera trap
- "Standing on the cliff / hilltop / rooftop watching X" — back-to-camera trap
- "Approaching the [thing] beyond" — back-to-camera trap
- Vague "Tokyo at night" — be specific: which alley / which storefront / which counter
- Photoreal cinematography terms

Every entry should imply a setting where the character is ENGAGED WITH something tangible AT HAND — the camera can naturally see her face because she's interacting with the setting, not staring off at it.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
