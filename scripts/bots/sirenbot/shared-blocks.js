/**
 * SirenBot — shared prose blocks injected into path briefs.
 *
 * Character: high-fantasy warriors, both genders, wide race variety.
 * Female paths: scantily-clad, fierce, seductive-dangerous — siren energy.
 * Male paths: battle-scarred, alpha, menacing — warlord energy.
 */

const PROMPT_PREFIX =
  'high fantasy concept art, painterly illustration, dramatic lighting, rich earth tones with magical accent colors, ornate detail, cinematic composition, epic fantasy atmosphere, masterwork fine art';

const PROMPT_SUFFIX = 'no text, no words, no watermarks, hyper detailed, masterpiece quality';

const CHARACTER_BLOCK = `━━━ CHARACTER — HIGH-FANTASY WARRIOR ━━━

She/he is a high-fantasy being from a world where magic is real and combat is a way of life. The aesthetic is D&D concept art meets Game of Thrones meets Magic: the Gathering — painterly, detailed, ornate, mythic. Not cartoon, not anime. Fine-art painterly quality.

Every render features ONE character whose identity is driven by the ROLLED RACE axis — elf, drow, tiefling, orc, half-dragon, dwarf, goliath, minotaur, nymph, fairy, merfolk, harpy, lamia, succubus, centaur, satyr, gnome, half-giant, undead knight, human, or other rolled variant. The race is UNMISTAKABLE — specific ears/horns/skin/scales/wings/tails/eyes that identify the race at first glance.

━━━ ORNATE DETAIL — NON-NEGOTIABLE ━━━

She/he carries signature flashy details: enchanted armor, magical tattoos, glowing runes, jeweled accessories, ornamental weapons, fur-and-leather pieces with metal filigree, intricate warpaint, gem-studded gauntlets, woven braids with charms, cloaks with embroidery, shimmering magical effects. ALWAYS ornate. Never plain.`;

const FEMALE_HOTNESS_BLOCK = `━━━ FEMALE SIREN ENERGY ━━━

She is EXQUISITELY beautiful and DANGEROUS. Scantily clad is fine and encouraged — enchanted armor that shows skin, diaphanous magical garments, leather-and-lace warrior gear, chainmail over silk, ornate bikini-style fantasy armor. Showing skin is part of the aesthetic. Her figure is visible and sexy. She is a siren — her beauty is a weapon.

STRICT COVERAGE: she is ALWAYS covered enough to avoid nudity. No nipples, no exposed breasts, no exposed genitals. Fantasy-art decorum — suggestive, never explicit. Think mythic fine-art oil painting, not adult content. Rated R (tasteful fantasy mature), not X.

Fierce, seductive, don't-fuck-with-me energy. The expression is COLD underneath the beauty. Bait and blade.`;

const MALE_WARLORD_BLOCK = `━━━ MALE WARLORD ENERGY ━━━

He is POWERFUL and MENACING. Alpha-male fantasy warrior: battle-scarred, muscular, intimidating. Warlords, dark knights, barbarian kings, demon hunters, dragon slayers, shadow assassins, undead lords, berserker champions. His presence reads as LETHAL THREAT first, beauty second.

Ornate flashy details match the female aesthetic — enchanted weapons, runic war paint, elaborate armor with magical etching, battle trophies, glowing eyes/runes/blades. Battle-scarred but still iconic.

His expression is HARD — focused, unsparing, cold. A man who has killed a lot of things and will kill more.`;

const SOLO_COMPOSITION_BLOCK = `━━━ SOLO COMPOSITION — NON-NEGOTIABLE ━━━

She/he is the ONLY figure in the frame. No second warrior, no companion, no enemy, no army, no fallen body, no background crowd. Solo hero shot. Environmental detail can IMPLY other beings (distant battlefield, thrones, prisoner's chains, dragon's shadow passing overhead) but no second figure is rendered. Solo compositions only.`;

const NO_POSING_BLOCK = `━━━ CANDID, NOT POSED ━━━

She/he is NOT posing for a photographer. This is a moment captured in their world — caught mid-action, mid-ritual, mid-thought. Describe WHAT they're doing, not how they look performing. Avoid "poses", "posing", "fashion shoot", "portrait framing", "camera-ready stance". Use action verbs: casting, swinging, lunging, bracing, emerging, gazing across, resting a hand on, etc.`;

const PAINTERLY_BLOCK = `━━━ PAINTERLY FINE-ART QUALITY ━━━

This is painterly concept art — oil-on-canvas or masterful digital painting quality. Visible brushwork, chiaroscuro lighting, atmospheric perspective, rich palette with mythical accent colors. Think cover art for a high-fantasy novel, trading-card-game masterwork, or classical history painting of a mythical being. Never photoreal, never cartoon, never anime — painterly mythic fine art.`;

module.exports = {
  PROMPT_PREFIX,
  PROMPT_SUFFIX,
  CHARACTER_BLOCK,
  FEMALE_HOTNESS_BLOCK,
  MALE_WARLORD_BLOCK,
  SOLO_COMPOSITION_BLOCK,
  NO_POSING_BLOCK,
  PAINTERLY_BLOCK,
};
