#!/usr/bin/env node
/**
 * GOTHBOT_VHIA_HUNTER_ARCHETYPE — character archetype for the
 * vampire-hunter-in-action solo-on-the-prowl path. CLASSIC-LORE hunters
 * only (Belmont / Witcher of the School of Wolf / Van Helsing / Blade /
 * Hellsing / Underworld Death-Dealer / Castlevania Trevor / Constantine /
 * Tridentine inquisitor-hunter / Wallachian boyar). NEVER vampires /
 * warlocks / mages / liches / demonologists. John-Wick-of-vampire-hunters
 * register.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/gothbot_vhia_hunter_archetype.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} HUNTER-ARCHETYPE entries for GothBot's vampire-hunter-in-action path — character spec for the SOLO ELITE VAMPIRE HUNTER mid-prowl through a specific gothic scene. Each entry is one rich descriptive sentence (15-30 words) naming the hunter type + a defining physical / equipment / lineage detail.

━━━ THE BAR ━━━
Every entry: (1) names ONE specific HUNTER LINEAGE / ORDER (Belmont / Witcher School / Van Helsing / Blade / Hellsing / Underworld Death-Dealer / Tridentine inquisitor / Wallachian boyar / Hetman cossack / Carpathian Roma exorcist / Knight Templar of the Black Order / Slavic dhampir-hunter / Spanish-Inquisition friar / Hashashin-vampire-killer / Eastern Orthodox monk-hunter / Norse rune-hunter); (2) names a defining PHYSICAL detail (scar / hair / posture / eye color); (3) names ONE signature weapon/equipment trait visible on body. CLASSIC-LORE only — NEVER vampires/mages/warlocks.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"Cursed Belmont bloodline carrier, broad-shouldered and battle-scarred, long copper hair tied back, cheek-scar permanent, whip coiled at hip."
"Wolf School mutant, heavy-framed silver-haired killer with cat-slit amber eyes, blade-nicked brow, trades monster contracts for vampire heads."
"Dutch occult-academic turned field-hunter, weathered and methodical, iron-grey hair, silver-streaked beard, kit-pouches buckled across chest under wide-brim hat."
"Gaunt Tridentine padre, weary veteran of thirty exorcisms, close-cropped steel-grey hair, hollow-eyed, stake-rosary wrapped around knuckled fists."
"Saber-and-pistol hetman, heavy-framed and haunted, shaved skull with long oseledets topknot, iron-grey drooping mustache, ridden a thousand dark steppe roads."

━━━ VARIETY MANDATE (distribute across these hunter families) ━━━
- ~3 BELMONT / CASTLEVANIA LINEAGE (whip-bearers, vampire-killer Trevor / Simon / Richter / Juste / Soma)
- ~3 WITCHER-CODED MONSTER HUNTERS (Wolf / Cat / Manticore / Viper / Griffin schools)
- ~3 VAN HELSING / ACADEMIC / OCCULTIST (Dutch academics, gentleman hunters, kit-equipped)
- ~3 TRIDENTINE / CATHOLIC / EXORCIST (padres, Jesuit hunters, inquisitor friars)
- ~2 BLADE / DHAMPIR / HALF-VAMPIRE (half-blood hunters — NOT full vampires)
- ~2 HELLSING / ROYAL ORDER (British vampire-hunting royal commission, Crusader knight-orders)
- ~2 SLAVIC / CARPATHIAN / EASTERN-EUROPEAN (Wallachian boyars turned hunters, Hetman cossacks)
- ~2 NORDIC / GERMANIC / RUNE-HUNTERS (Norse rune-hunters, Teutonic knights, Lapp-shamans)
- ~2 EASTERN ORTHODOX / MONK-HUNTERS (Russian Old Believer hunters, Greek monk-killers)
- ~2 HASHASHIN / MIDDLE-EASTERN / DESERT-HUNTERS (Saracen vampire-killer, Hashashin night-stalker)
- ~1 CONSTANTINE / OCCULT-DETECTIVE (modern coat + hat hunter with talisman-belt)
- ~1 UNDERWORLD-CODED DEATH-DEALER (leather-coat operative-style)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- 15-30 words per entry.
- ONE archetype per entry.
- Lineage + physical + signature trait all present.
- Painted register — never modern-action-movie-poster cliche.

━━━ BANS ━━━
- NO vampires / warlocks / mages / liches / demonologists (this is HUNTERS only).
- NO FEMALE hunters in this pool (separate gender-locked pool).
- NO modern characters (no Buffy-coded, no leather-jacket-anime-edgy).
- NO superhero / cape register.
- NO vampires-as-good-guys / dhampirs hunting humans.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
