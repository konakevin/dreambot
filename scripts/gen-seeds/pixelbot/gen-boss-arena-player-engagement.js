#!/usr/bin/env node
/**
 * PIXELBOT_BOSS_ARENA_PLAYER_ENGAGEMENT — player sprite + optional
 * companion mid-combat-action against the PixelBot boss. Solo or duo
 * hero pose driving the assault. Chrono Trigger / FFVI / Hyper Light
 * Drifter / Hades / Diablo II SNES-era register. 50-70 words.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_boss_arena_player_engagement.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} PLAYER-ENGAGEMENT entries for PixelBot's boss-arena path — a small player sprite (sometimes a duo) mid-combat against the PixelBot boss on the arena floor. Title-caps prefix THEN " — " separator THEN 50-70 word description.

━━━ THE BAR ━━━
Every entry is ONE solo hero OR hero-duo small on the arena floor mid-combat-action against the PixelBot boss. The hero is named (class + outfit), mid-named-action (mid-charge / mid-cast / mid-leap / mid-swing / mid-block), with an explicit weapon or spell EFFECT visible (arc / trail / sparks / glow / impact). The boss is referenced ("toward the PixelBot boss"). The arena floor anchors it.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"KNIGHT MID-CHARGE — armored knight pixel-sprite small on the arena floor mid-charge toward the PixelBot boss, sword raised overhead, cape streaming behind, boots sparking against the metal floor tiles, mid-stride attack pose driving directly into the boss front panel, single-hero combat engagement."
"MAGE FIREBALL-CAST — robed mage small on the arena floor mid-cast with staff thrust forward, blazing orange-fireball streaking in a glowing arc across the arena toward the PixelBot boss, magic-circle burning bright under mage feet, spell-trail lighting the arena floor."
"PALADIN SHIELD-BLOCK — plate-paladin small on the arena floor with tower-shield raised blocking an incoming boss energy-beam, deflection-sparks spraying outward in a burst, warhammer in opposite hand mid-swing toward the boss leg joint, mid-defense-offense split-pose on the arena floor."

━━━ VARIETY MANDATE (distribute across these archetypes) ━━━

Solo hero engagements (~70% of entries):
- ~8 MELEE CLASSES (knight charge / paladin shield-block / warrior axe-swing / samurai katana-slash / barbarian hammer / berserker dual-axes / monk flying-kick / brawler punch / dragoon spear-thrust / dancer mid-spin)
- ~5 RANGED (ranger mid-arrow / archer rain-of-arrows / crossbowman braced / sniper steadied / hunter wolf-released)
- ~6 CASTERS (mage fireball / sorcerer lightning / wizard ice-shard / black-mage meteor-cast / red-mage dual-spell / summoner summon-circle / time-mage clock-glyph / blood-mage palm-burst)
- ~4 STEALTH (rogue mid-leap / ninja shuriken-throw / assassin mid-stab / thief grappling-hook)
- ~3 SUPPORT MID-ACTION (cleric mid-revive / bard sonic-strum / druid wolf-summon)
- ~2 SPECIAL (princess sword-raised / mecha-pilot grenade-throw)

Duo / companion engagements (~30%):
- ~4 CLASSIC DUO (knight + cleric / mage + warrior / ranger + rogue / samurai + monk / princess + bodyguard / paladin + sorcerer)
- ~3 DUO COMBO ATTACK (knight mid-slash + mage mid-cast fireball / paladin shield-block + ranger arrow / warrior charge + cleric heal-aura / monk mid-kick + sorcerer lightning / ninja mid-throw + samurai katana)
- ~2 PET COMPANION (warrior + wolf mid-leap / druid + bear mid-roar / summoner + golem)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- ALWAYS open with the hero(es) "small on the arena floor mid-..." or equivalent.
- ALWAYS reference the PixelBot boss as target ("toward the PixelBot boss", "into the boss leg", "deflecting the boss beam").
- ALWAYS include a visible weapon/spell EFFECT (sparks / arc / trail / glow / impact / motion-blur).
- Body is 50-70 words, single sentence.

━━━ BANS ━━━
- NO solo full party — duo at most. Three-or-more-hero parties belong in jrpg-combat path.
- NO direct contact / mounted on boss — hero stays on the arena floor at a distance.
- NO photoreal language — 16-bit pixel sprite register only.
- NO modern firearm / sci-fi laser — fantasy classes only.
- NO boss-description detail — that's boss_creature axis.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
