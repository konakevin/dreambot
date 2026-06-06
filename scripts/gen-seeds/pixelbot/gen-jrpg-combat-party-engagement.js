#!/usr/bin/env node
/**
 * PIXELBOT_JRPG_COMBAT_PARTY_ENGAGEMENT — 2-4 hero party in formation
 * mid-combat-action. Final Fantasy IV/V/VI / Chrono Trigger / Secret of
 * Mana / Tales of Phantasia / Lufia II / Star Ocean register. Title-caps
 * prefix THEN " — " separator THEN multi-character action description.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_jrpg_combat_party_engagement.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PARTY-ENGAGEMENT entries for PixelBot's jrpg-combat path — 2-4 hero party members in classic SNES-JRPG combat formation mid-action. Title-caps prefix THEN " — " separator THEN multi-character combat-action description with " + " separators between each party member's contribution.

━━━ THE BAR ━━━
Every entry is ONE party formation in mid-combat — 2-4 classic JRPG class archetypes each mid-action, joined by " + " separators. The format is a class trio/duo/quartet in named mid-action poses with visible weapon-effects or spell-effects, anchored as a CLASSIC JRPG FORMATION. Multi-character + multi-action density = SNES party-battle feel.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"KNIGHT-MAGE-PRINCESS TRIO — armored knight mid-sword-swing with gleaming blade-arc toward the enemy + mage in blue robe launching glowing fireball mid-air with trailing ember-sparks + princess in white gown casting warm healing-glow onto the knight, classic JRPG front-mid-back formation"
"WARRIOR-RANGER-CLERIC PARTY — heavy-armor warrior mid-axe-swing with wide motion-blur arc + hooded ranger at back with arrow nocked mid-release with arrow-trail streaking forward + cleric mid-prayer radiating holy-light outward from upraised mace, three-class JRPG formation"
"DRAGOON-MAGE-CLERIC — armored dragoon mid-air leaping spear-thrust with downward impact-trail + robed mage mid-cast launching blue magic-bolt with trailing glow + cleric casting radiant healing-aura directly onto the airborne dragoon, classic vertical-attack JRPG combo"

━━━ VARIETY MANDATE (distribute across these party compositions) ━━━

- ~6 TRIOS — frontline + mage + healer (knight+mage+cleric, warrior+druid+priest, paladin+sorcerer+oracle, samurai+monk+druid, fighter+wizard+bard, ranger+rogue+cleric, etc.)
- ~5 QUARTETS — four-class FF-style party (knight+mage+thief+white-mage, warrior+ranger+sorcerer+cleric, samurai+ninja+sage+priestess, dragoon+summoner+monk+bard, paladin+druid+rogue+healer)
- ~4 DUOS — two-class lean combos (knight+mage, ranger+rogue, warrior+cleric, samurai+monk, paladin+sorcerer, princess+swordsman, twin-monks, dragoon+summoner)
- ~4 ACTION-COMBOS — coordinated multi-action (twin swordsmen mid-pincer-strike + mage mid-cast, rogue mid-stab + ranger mid-arrow + paladin mid-shield-bash, archer mid-rain-of-arrows + monk mid-flurry + healer mid-revive)
- ~3 SPECIAL JRPG ARCHETYPES (princess + bodyguard knight + court-mage, twin-paladins + cleric, summoner + summon-creature + frontline, blue-mage party, royal guard party, ninja-trio mid-attack)
- ~3 EXOTIC CASTS (mecha-pilot + sword-mage + healer, beast-tamer + tamed-pet + sorcerer, time-mage + warrior + green-mage, geomancer + monk + sage)

CLASS POOL (mix freely): knight / warrior / paladin / samurai / ranger / archer / rogue / thief / ninja / mage / sorcerer / wizard / red-mage / blue-mage / white-mage / black-mage / cleric / priest / monk / druid / dragoon / summoner / bard / sage / oracle / princess / queen / mecha-pilot / beast-tamer / geomancer / time-mage / dancer

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX names the classes (e.g., "KNIGHT-MAGE-PRINCESS TRIO" or "WARRIOR-RANGER-CLERIC PARTY").
- BODY uses " + " separators between each party member's mid-action description.
- EACH member: outfit detail + class + present-tense mid-action verb + weapon/spell effect visible.
- ALWAYS end with a JRPG-formation tag ("classic JRPG front-mid-back formation", "three-class JRPG assault", "four-class party formation", etc.).
- Body is 45-70 words.

━━━ BANS ━━━
- NO solo hero — this pool is MULTI-CHARACTER party formations only (2-4 members).
- NO monster/enemy in this pool — that's monster_enemy axis.
- NO setting/landscape detail — that's open_world_setting axis.
- NO photoreal language — 16-bit SNES sprite register only.
- NO repeating the exact same class trio twice.
- NO modern firearms / sci-fi blasters — fantasy classes only.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
