#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/occult_tokyo_scenes.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} OCCULT-TOKYO scene descriptions for MangaBot's occult-tokyo path. Each entry is 30-50 words. Setting-only.

CONTEXT: Urban Japan + spiritual / supernatural energy. Tokyo Ghoul / Bleach / Mob Psycho / Jujutsu Kaisen / Ghost Hound aesthetic. Cursed alleys, talismans, glowing sigils, spirit-energy bleeding through urban Japan. NIGHT-coded. Distinct from gothbot (Western gothic) and from samurai-era (historical). This is MODERN urban Japanese spiritual.

Categories — rotate widely:
- Cursed urban alley (narrow Tokyo alley with paper talismans plastered on the walls, glowing sigil on the pavement)
- Urban shrine at midnight (small neighborhood shrine wedged between modern apartments, lanterns lit, paper-charms tied to a tree)
- Subway station with spirit-residue (empty subway platform at 3 AM, faint glowing footprints, single flickering light)
- Apartment-corridor with ofuda paper-talismans (long modern apartment hallway lined with paper talismans on every door)
- Rooftop sigil-circle (rooftop with chalk-drawn glowing magic-circle, Tokyo skyline below at night)
- Convenience store under spirit-light (24-hour combini at midnight with a faint spirit-glow at the doorway, lonely cashier)
- Underpass with spirit-eyes (concrete underpass with multiple pairs of glowing eyes in the deep shadow)
- Cemetery in the heart of the city (urban graveyard with stone lanterns, surrounded by skyscrapers)
- Old wooden temple half-swallowed by modern Tokyo (ancient temple between glass-and-steel high-rises)
- Vending-machine alley with paper charms (Tokyo backstreet with vending machines glowing pale, paper talismans hung overhead)
- Pachinko-parlor exterior with ofuda warding (neon parlor sign with subtle paper-talismans hung in the doorway frame)
- Karaoke-tower at night with a spectral figure on the roof (silhouette of a long-haired figure on a tower-top)
- Shibuya-crossing at 3 AM (empty famous crossing, paper-charm fluttering past, subtle spirit-mist)
- Old neighborhood hot-spring inn at night with paper lantern + ofuda warding

EVERY entry must include:
- Specific urban-spiritual setting (alley / shrine / subway / rooftop / cemetery / etc.)
- 4-6 environmental details (paper talismans / glowing sigils / ofuda / chalk-circles / spirit-mist / hanging charms / shrine-rope / candle-flames / vending machines / convenience-store-glow / wet pavement / power-lines / ramen-shop steam / hand-painted-signs)
- 1-2 atmospheric effects (spirit-mist, glowing-sigil-light, drifting paper-charms, faint smoke, ember-trail, faint spirit-haze)
- Lighting tone (neon-and-spirit-glow / lantern-amber-and-fel-blue / streetlight-yellow-with-glowing-sigil / 3-AM-flickering-fluorescent / moonlit-with-supernatural-rim)
- Implied supernatural presence (NEVER explicit gore — just hint: glowing eyes in shadow, footprint that wasn't there, a charm fluttering in still air)

ABSOLUTELY BANNED:
- NO Western gothic (no gargoyles, no cathedrals, no vampires — those are gothbot)
- NO satanic iconography (no pentagrams)
- NO gore / dismemberment
- NO crowded scenes (urban-empty-at-night is the mood)

Examples (write fresh):
- "Narrow Tokyo backstreet alley at midnight, walls plastered with paper ofuda talismans in vertical columns, a glowing red-ink sigil drawn on the wet pavement, single flickering streetlamp casting harsh shadow, vending machine glowing pale-blue at the alley mouth, faint spirit-mist drifting near the ground, hanging power-cables crossing overhead"
- "Empty subway platform at 3 AM, half the fluorescent strip-lights flickering, faint glowing-blue footprints leading from the stairs to the platform-edge, paper talismans tied to the railing, spirit-mist hanging at knee-height, distant subway tunnel mouth a deep black, signage in Japanese kanji on the walls"
- "Small neighborhood shrine wedged between modern concrete apartment buildings, stone torii gate at the entrance, paper-charm-strings tied across the path, single stone lantern lit, hundreds of folded omikuji fortune-papers tied to a tree, glowing-blue ofuda-talisman pulsing softly on the shrine door, spirit-mist gathering"

Output ONLY a valid JSON array of ${n} strings (30-50 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
