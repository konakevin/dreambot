#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/goth_woman_accessories.json',
  total: 200,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} ICONIC STYLING/ACCESSORY descriptions for GothBot's goth-woman path — the signature detail that makes a dark-fantasy woman instantly iconic. Entries 10-18 words. Each entry is one specific iconic detail (or tight combination) that gives a character her VISUAL HOOK.

━━━ AESTHETIC NORTH STAR ━━━
Castlevania / Bloodborne / Van-Helsing / Crimson-Peak / Berserk / WoW-undead-warlock-art (aesthetic DNA only, never the IP). Vampire queens, corrupted priestesses, succubi, blood-huntresses, witch-queens, occult-seductresses, death-knight-archetype women, banshee-brides, demon-courtesans, fallen-paladins. Haunting + ALLURING + dangerous.

━━━ ALLURING, NOT HORNY ━━━
Sex appeal through ALLURE + DANGER + STYLING — corsets, leather pauldrons, thigh-holsters, bustiers-under-velvet-cloak, fishnet-under-lace, sheer-sleeves-with-ritual-sigils, black-silk-and-smoke, pearl-collar-on-black. Tasteful — no explicit nudity-language, no crude fanservice. Elegant dangerous women who would rule a castle or hunt a werewolf.

━━━ ANTI-MALEFICENT RULE (HARD CAP) ━━━
The old pool was dominated by horns-horns-horns. MAX 15 horn-based entries out of 200. Vary the iconic feature widely — the horn should be the EXCEPTION not the default. If the entry mentions horns, treat it as a rare exotic choice, not a standard accessory.

━━━ WIDE CATEGORY SPREAD (200 pool — enforce distribution) ━━━

WEAPON-CENTRIC STYLING (min 30) — the weapon IS the accessory:
- silver crossbow slung over corset-cinched hip
- dual-wielded thin swords caught mid-draw
- blessed-silver whip coiled at thigh
- stake-and-vial holster across chest
- scythe held across shoulders with gossamer cloak flowing
- runic longsword catching moonlight
- dagger-pair strapped to forearms
- war-fan spread open with ritual runes
- wand-and-grimoire at hip in leather pouch

OCCULT STYLING (min 30) — spell-sigils, ritual markings:
- glowing fel-green sigil igniting in palm mid-cast
- violet rune-tattoos spiraling up exposed arms
- crimson blood-sigil drawn fresh on forehead
- soul-shard pendant pulsing at throat
- shadow-wreath curling around shoulders like living smoke
- demon-sigil ring catching candle-glow
- spell-tome floating open beside her
- ritual-chalice raised mid-incantation
- summoning-circle faint at her feet

CORSET / BODICE / FASHION (min 30) — the wardrobe IS the signature:
- black silk corset laced with crimson ribbon
- leather pauldron-and-bustier combination
- violet velvet cloak over ribboned bustier
- sheer black lace sleeves over weapon-harness
- thigh-high leather boots with silver buckles
- ragged dress-of-feathers-and-bone
- sweeping gown of ink-black satin with trailing hem
- cloak-of-tattered-silk catching wind
- blood-red lipstick + smokey-eye + porcelain skin

JEWELRY (min 20) — cap at 20, not dominant:
- pearl-and-obsidian collar biting her throat
- crescent-moon tiara with single ruby
- wrought-iron choker with dangling key
- veil-and-diadem of silver thorns
- ear-cuff of skeletal rose
- pendant of captured moonlight

TATTOOS / PIERCINGS / BODY-MARKING (min 15):
- elaborate back-tattoo of spell-sigils
- facial-mark of covenant sigil
- ritual-piercings along brow
- ink-black veins tracing magic use
- snake-coil tattoo along arm

ACTIVE SPELLCRAFT DETAIL (min 30) — she is MID-CAST or MID-MOTION:
- fingers igniting with fel-green flame mid-gesture
- violet spell-circle orbiting her raised palm
- black tears of witchcraft streaking down cheek
- moth-swarm pouring from outstretched hand
- raven perching on outstretched arm as familiar
- shadow-tendrils lifting from her cloak
- dusk-colored mist curling at her feet
- crimson-fire rising from her eyes

VAMPIRE-SPECIFIC (min 20):
- fangs bared over crimson-lipped smile
- translucent skin with faint blue veins
- pearl-white fangs with single crimson drop
- pupils slit vertical like a cat
- golden-eye irises catching blood-moon
- single blood drop at corner of mouth on pale chin

WINGS / FLIGHT (min 10) — but NOT the same as horns — occasional not dominant:
- single torn-angel wing folded behind
- bat-membrane wings half-unfurled
- shadow-wings rising from bare shoulders

HEADPIECES (min 15) — NOT horns:
- crown of black thorns pressing into brow
- circlet of dried black roses
- spiked diadem of tarnished silver
- veil-and-bone headdress
- raven-feather crown cascading behind
- crystal-circlet carrying trapped starlight
- lace half-mask + tilted tricorn hat (van-helsing huntress)

HORNS — MAX 15 (enforce cap strictly):
- small subtle ram-horns only — the rare accent
- single broken stag-antler shard in hair
- tiny obsidian horn-shards peeking from under hair
Etc. Treat horns as a minor exotic flourish, never default.

━━━ RULES ━━━
- Single iconic detail per entry (or tight 2-item combo)
- Stackable onto a goth-woman render (she could wear/carry/cast this)
- Dark, alluring, dangerous, painterly
- Every entry visibly distinct
- No named IP references

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
