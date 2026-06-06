#!/usr/bin/env node
/**
 * FEMALE_EXPLORER_OUTFIT — production scale-up toward 200.
 *
 * Cool fitted ornate armor for the female-explorer path. Each entry is
 * a CLASS-tagged outfit: 30-50 words describing fitted ornate fantasy
 * armor (plate / cuirass / scale / chitin / battle-leather) — Witcher /
 * Elden Ring / Dragon Age / GoT-cover caliber. Banned: frumpy drapes,
 * glamour/cheesecake.
 *
 * Mirrors the existing 45 entries' register exactly:
 *   "<Class>: <fitted-ornate-armor description with material + features>."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/female_explorer_outfit.json',
  total: 200,
  batch: 25,
  maxTokens: 12000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} OUTFIT entries for DragonBot's female-explorer path. Each entry is a fitted ornate fantasy-armor look on a SPECIFIC named class — Witcher / Elden Ring / Dragon Age / GoT-cover caliber. The renders these feed are CANDID TRAVELING-ADVENTURER scenes (climbing / bridges / paths / drawn-blade stealth / creek-rest / campfire / map). The OUTFIT must read COOL + FITTED + FUNCTIONAL + BATTLE-WORN — never frumpy, never cheesecake.

━━━ THE FORMAT — mirror this EXACTLY ━━━

Format strictly: "<Class>: <outfit description>" — class name + colon + outfit. 30-50 words per entry, ONE sentence (use commas, not periods, internally). The outfit description names material + cut + signature features + travel-worn condition.

EXAMPLE REGISTER (mirror this exactly):
  "Knight-Errant: Articulated silver-blue plate, every panel engraved with frost-rune knotwork — fitted cuirass, flared pauldrons, and tapered greaves over a charcoal gambeson, a half-cape of storm-grey wool clipped at one shoulder."
  "Ranger: Oxblood fitted leather cuirass, brass-riveted across the sternum, over a cream linen underlayer, tooled bracers wrap both forearms, a crossed sword-and-dagger harness rides her back, no cloak, no coat."
  "Tribal Warrior: Dark chitin-and-hide breastplate lacquered deep teal, articulated at the waist like beetle-shell segments, shoulder-guards of layered chitin over bare arms tattooed and battle-worn, a single short dagger at the hip."

━━━ THE COOL FITTED ORNATE ARMOR BAR ━━━

Every outfit must read:
  • FITTED to her form — articulated, tailored, engineered for movement
  • ORNATE — engraved / etched / brass-riveted / runic-marked / chased / tooled / inlaid — SHOW the craftsmanship
  • COVERED chest — cuirass / breastplate / scale / chitin / battle-leather jerkin — never bare-midriff, never battle-bra
  • TRAVEL-WORN — road-grimed / scarred / weathered / battle-worn / patinated — NEVER pristine ceremonial
  • DISTINCT silhouette per entry — recognizable as a SPECIFIC armor look, not generic "fantasy armor"

━━━ THE CLASS POOL — anchor each entry to ONE class ━━━

Distribute the ${n} entries across these named classes. EACH entry leads with the class name:

WARRIOR-CORE: Knight-Errant / Paladin / Crusader / Warden / Cavalier / Champion / Shieldmaiden / Vanguard / Templar / Sentinel / Bannerknight / Marshal / Marauder / Berserker / Warrior / Battlemaster
ROGUE-CORE: Rogue / Thief / Shadow-Dancer / Cutpurse / Assassin / Spy / Scout / Outrider / Pathfinder / Trapper / Saboteur / Burglar
RANGER-CORE: Ranger / Wildwalker / Tracker / Hunter / Wood-Warden / Stormwarden / Borderwarden / Beastmaster
ROGUE-BARD: Bard-Spy / Wandering-Skald / Court-Singer / Lockpick-Performer / Mercenary-Diplomat
MAGE-CORE (armored variants only): Battlemage / Spellsword / Eldritch-Knight / Arcane-Trickster / Hexblade / War-Mage / Stormcaller
PALADIN-VARIANTS: Oathbreaker / Vengeance-Paladin / Hospitaler / Inquisitor / Witch-Hunter
RACIAL-CODED: Dragon-Slayer / Beast-Hunter / Demon-Hunter / Undead-Hunter / Fey-Knight
EXOTIC: Tribal Warrior / Shaman-Warrior / Plains-Rider / Tundra-Warden / Frost-Maiden / Sun-Champion / Sand-Lancer / Bog-Witch (armored)
SPECIALIST: Beastmaster / Falconer / Crossbow-Marksman / Glaive-Master / Halberdier / Hammerist / Axe-Twin / Sword-Saint
RETIRED-MASTER: Veteran Knight / Old Wolf / Wandering Captain / Disgraced Templar / Exiled Marshal

(Use class names approximately like this — don't repeat the same class twice.)

━━━ THE MATERIAL + DETAIL VOCABULARY ━━━

Per entry name at least 2 specific materials + 2 specific features + 1 color anchor:

MATERIALS: articulated plate / scale-armor / chainmail / hauberk / brigandine / gambeson / chitin-and-hide / boiled leather / tooled leather / hardened leather / lacquered scale / dragonbone / mithril / blackened steel / silvered steel / brass-riveted bronze / lamellar / cuirass / fitted battle-leather / ranger's leather coat

FEATURES: pauldrons / vambraces / greaves / shoulder-harness / chest-plate / spaulders / gauntlets / sabatons / belt-pouches / scabbard / shoulder-cape / half-cape / hood / cowl / tabard / sash / quiver / bandolier / runic-etching / hand-engraving / brass rivets / leather thongs / clan sigil / sworn-order crest

COLORS (one anchor): silver-blue / storm-grey / oxblood / deep teal / blackened-steel / antique brass / forest green / midnight-blue / bone-white / wine-red / ember-orange / frost-pale / bog-green / desert-tan / iron-grey

━━━ BANS ━━━

- NO "loose flowing robes" / "billowing gown" / "hooded cloak" / "shapeless coat" / "draped fabric" as the OUTFIT — those belong to the wow-style mage paths, NOT this one. Even mage classes here wear FITTED battle-mage gear with armor over robes, NEVER a frumpy drape.
- NO "chainmail bikini" / "battle-bra" / "bare midriff" / "cleavage emphasis" / "slit skirt" / "off-shoulder" / "low-cut" / "form-fitting" / "skin-tight" / "thigh-high" / "deep v-neck" — these are cheesecake bans.
- NO "modern" / "industrial" / "neon" / "techwear" / "cyberpunk" — strict Western high fantasy.
- NO real-world ethnic-coded costume (no Bedouin / Persian / samurai / kimono / sari / poncho / Aztec / Polynesian / kente).
- NO franchise proper nouns (no "Azeroth" / "Mordor" / "Stormwind" / "Witcher named character" / etc.) — describe the AESTHETIC generically.
- NO pristine ceremonial gear — every outfit reads battle-WORN, road-grimed, lived-in.
- NO color-coded gendered phrasing like "feminine" or "delicate jewelry" — the armor itself is fitted-to-form; femininity is encoded by the body, not the gear.
- NO repeating a class already in the existing batches.

━━━ STRICT FORMAT ━━━

- ONE entry per line. Each entry = "<Class>: <outfit description>".
- 30-50 words per entry.
- ONE sentence, internal commas only.
- Each entry must be DISTINCT in class AND in silhouette.
- Strip apostrophes from possessives.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
