#!/usr/bin/env node
/**
 * MALE_EXPLORER_OUTFIT — production scale-up toward 200.
 *
 * Cool gritty masculine armor for the male-explorer path. Each entry is
 * a CLASS-tagged outfit: 30-50 words describing fitted gritty
 * fantasy armor (plate / cuirass / scale / chitin / battle-leather) —
 * Witcher / Elden Ring / Dragon Age / GoT-cover caliber, slanted
 * MASCULINE + GRITTY. CHEST IS ALWAYS COVERED.
 *
 * Mirrors the existing 47 entries' register:
 *   "<Class>: <gritty-armor description with material + features>."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/male_explorer_outfit.json',
  total: 200,
  batch: 25,
  maxTokens: 12000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} OUTFIT entries for DragonBot's male-explorer path. Each entry is a fitted gritty fantasy-armor look on a SPECIFIC named class — Witcher / Elden Ring / Dragon Age / GoT-cover caliber. The renders these feed are CANDID TRAVELING-ADVENTURER scenes (climbing / bridges / paths / drawn-blade stealth / creek-rest / campfire / map). The OUTFIT must read COOL + FITTED + FUNCTIONAL + BATTLE-WORN — chest ALWAYS covered, never shirtless, never cheesecake.

━━━ THE FORMAT — mirror this EXACTLY ━━━

Format strictly: "<Class>: <outfit description>" — class name + colon + outfit. 30-50 words per entry, ONE sentence (use commas, not periods, internally). Names material + cut + signature features + travel-worn condition.

EXAMPLE REGISTER (mirror this exactly):
  "Ranger: Worn dark-green hooded leather coat over a linen undershirt, studded pauldron on one shoulder, quiver strapped across the back, mud-caked boots, a bone-handled hunting knife at the hip, road-worn."
  "Wizard: Layered slate-grey traveling robes with rune-stitched hems, a heavy mage-coat belted at the waist with a brass focus-clasp, ink-stained cuffs, a battered satchel, hood down, storm-weathered."
  "Rogue: Fitted black boiled-leather coat over a dark wool tunic, shoulder-harness holding three sheathed blades, reinforced knee-high boots, fingerless gloves, deep hood pushed back, every buckle dulled."

━━━ THE COOL GRITTY MASCULINE ARMOR BAR ━━━

Every outfit must read:
  • FITTED to his form — articulated, tailored, engineered for movement
  • GRITTY — weathered / battle-worn / road-grimed / patinated / scarred / dented — SHOW the wear
  • COVERED chest — ALWAYS. Cuirass / breastplate / hauberk / gambeson / brigandine / scale / coat / robe — chest IS NEVER bare
  • DISTINCT silhouette per entry — recognizable as a SPECIFIC armor look, not generic "fantasy armor"
  • MASCULINE — broad shoulders, weight in the gear, body-language of capability

━━━ THE CLASS POOL — anchor each entry to ONE class ━━━

Distribute the ${n} entries across these named classes. EACH entry leads with the class name:

WARRIOR-CORE: Knight / Knight-Errant / Paladin / Crusader / Warden / Champion / Vanguard / Marshal / Battlemaster / Veteran / Warlord / Berserker / Warrior / Sword-Brother / Iron-Marshal / Battle-Captain / Lord-Commander
ROGUE-CORE: Rogue / Thief / Cutpurse / Assassin / Spy / Scout / Outrider / Pathfinder / Trapper / Saboteur / Burglar / Knife-Hand / Shadow-Hand
RANGER-CORE: Ranger / Wildwalker / Tracker / Hunter / Beast-Hunter / Wood-Warden / Border-Warden / Storm-Warden / Skirmisher
MAGE-CORE (armored variants — battlemage / spellsword / war-mage, OR mage-coated-and-belted not robe-shapeless): Wizard / Sorcerer / Spellsword / Hexblade / Eldritch-Knight / Arcanist / Stormcaller / War-Mage / Battlemage / Lich-Slayer
PALADIN-VARIANTS: Holy-Order Knight / Inquisitor / Witch-Hunter / Templar / Hospitaler / Oathkeeper
RACIAL-CODED: Dragon-Slayer / Demon-Hunter / Undead-Hunter / Beast-Slayer / Fey-Knight / Old Wolf / Iron Reaver
EXOTIC: Plains-Rider / Tundra-Warden / Frost-Reaver / Sun-Champion / Sand-Lancer / Bog-Knight (covered) / Skullhunter / Storm-Rider
SPECIALIST: Crossbow-Marksman / Glaive-Master / Halberdier / Hammerist / Axe-Twin / Sword-Saint / Longbowman / Pikeman / Shield-Brother / Falconer
RETIRED-MASTER: Veteran Knight / Old Wolf / Wandering Captain / Disgraced Templar / Exiled Marshal / Grey Captain / Black Sword

(Use class names approximately like this — don't repeat the same class twice.)

━━━ THE MATERIAL + DETAIL VOCABULARY ━━━

Per entry name at least 2 specific materials + 2 specific features + 1 color anchor:

MATERIALS: articulated plate / scale-armor / chainmail / hauberk / brigandine / gambeson / chitin-and-hide / boiled leather / tooled leather / hardened leather / lacquered scale / dragonbone / mithril / blackened steel / silvered steel / brass-riveted bronze / lamellar / cuirass / fitted battle-leather / ranger's leather coat / mage-coat / studded jerkin

FEATURES: pauldrons / vambraces / greaves / shoulder-harness / chest-plate / spaulders / gauntlets / sabatons / belt-pouches / scabbard / shoulder-cape / half-cape / hood / cowl / tabard / sash / quiver / bandolier / runic-etching / hand-engraving / brass rivets / leather thongs / clan sigil / sworn-order crest / battle-banner sash / focus-clasp

COLORS (one anchor): silver-blue / storm-grey / oxblood / deep teal / blackened-steel / antique brass / forest green / midnight-blue / bone-white / wine-red / ember-orange / frost-pale / bog-green / desert-tan / iron-grey / wolf-grey / smoke-black

━━━ BANS ━━━

- NO "shirtless" / "bare-chested" / "oiled pecs" / "open shirt" / "strategically torn" / "exposed torso" / "loincloth as the look" — chest is ALWAYS covered.
- NO "loose flowing robes that hide the form" / "shapeless coat" / "billowing gown" / "draped fabric" as the SOLE outfit — even mage classes wear FITTED layered mage-gear, NEVER frumpy.
- NO "rugged hero pose" coding in the outfit itself.
- NO "modern" / "industrial" / "neon" / "techwear" / "cyberpunk" — strict Western high fantasy.
- NO real-world ethnic-coded costume (no Bedouin / Persian / samurai / kimono / sari / poncho / Aztec / Polynesian / kente).
- NO franchise proper nouns ("Azeroth" / "Mordor" / "Stormwind" / "Witcher named character" / etc.).
- NO pristine ceremonial gear — every outfit reads battle-WORN, road-grimed, lived-in.
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
