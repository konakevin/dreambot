#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/isekai_scene_type.json',
  total: 200,
  batch: 12,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SCENE-TYPE entries for a MangaBot ISEKAI-FANTASY anime keyframe. STRICT ANIME ISEKAI CANON — Sword Art Online / Re:Zero / Konosuba / Overlord / Frieren / Mushoku Tensei / Slime / Restaurant of Another World / Log Horizon / Tate no Yuusha. NOT Western Witcher / Skyrim / D&D / Game of Thrones.

Each entry: 14-28 words. ONE anime-isekai composition concept.

DISTRIBUTION (anime-isekai keyframe variety):
- 16% ADVENTURER PARTY MID-QUEST (3-4 anime adventurers walking through fantasy world)
- 14% MAGIC-CAST MOMENT (mage mid-spell with anime mana-glow + status-window)
- 12% MONSTER ENCOUNTER (party meeting slime / dragon / fantasy creature)
- 11% COZY ISEKAI MOMENT (tavern / shop / slow-life Restaurant-of-Another-World vibe)
- 10% MID-COMBAT ACTION (sword-slash / spell-cast with anime motion-blur)
- 9% MODERN PROTAGONIST IN FANTASY (school-uniform character in fantasy setting — SAO vibe)
- 8% FLOATING-ISLAND VISTA (anime sky-castle / floating-magic-island scene)
- 7% GUILD HALL SCENE (adventurer's guild interior with party members)
- 6% MAGIC ACADEMY (anime magic-school setting — Mushoku Tensei vibe)
- 5% DEMON-LORD / OVERLORD MOMENT (anime villain / dark-throne)
- 2% PORTAL OPENING (anime-summon-circle / dimensional gate)

DO write:
- Anime adventurer party mid-quest composition, three painterly cel-shaded characters walking through Frieren-style fantasy forest, dappled magic light, party-banter energy
- Magic-cast moment composition, anime mage mid-spell with mana-glow rune-circle floating beneath her palm, painterly fantasy backdrop
- Monster encounter composition, anime party facing a smiling blue slime in fantasy meadow, Konosuba-coded comedic energy
- Cozy isekai composition, anime characters seated at fantasy tavern table with steaming food, Restaurant-of-Another-World register
- Mid-combat anime composition, isekai hero mid-sword-slash through demon enemy with motion-blur trails, painterly anime-style impact
- Modern protagonist composition, school-uniform character standing in fantasy meadow, SAO-style isekai-newcomer keyframe
- Floating-island vista composition, anime sky-castle silhouette with floating-debris-particles, Mushoku Tensei painterly fantasy
- Guild hall composition, anime party gathered at adventurer's guild reception, kanji notice-board behind, rambunctious tavern energy
- Magic academy composition, anime students in robes practicing spell-casting in classroom, mana-glow visible
- Demon-lord composition, anime villain seated on dark throne with floating magic-circle, dramatic backlight, Overlord vibe
- Portal opening composition, anime summon-circle glowing on cobblestone with character emerging from light, dimensional-gate energy

DO NOT write:
- Western photoreal medieval (Witcher / Skyrim / D&D / GoT)
- Gritty desaturated palette
- Generic "fantasy" without anime canon reference
- Multiple compositions per entry

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
