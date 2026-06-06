#!/usr/bin/env node
/**
 * FEMALE_EXPLORER_ACTION — production scale-up toward 200.
 *
 * Candid adventuring action beats for the female-explorer path. Each
 * entry is an ACTION NAME tag + a 30-50 word loaded-moment sentence
 * showing body weight, gear interaction, terrain, and the breath of
 * the moment. NEVER combat — drawn-blade-stealth is allowed; mid-strike
 * is not.
 *
 * Mirrors the existing 45 entries' register:
 *   "ACTION-NAME — long descriptive moment sentence with body + terrain
 *   + senses."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/female_explorer_action.json',
  total: 200,
  batch: 25,
  maxTokens: 12000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACTION-BEAT entries for DragonBot's female-explorer path. Each entry describes a single CANDID adventuring moment — the kind of beat a documentary camera would catch on a long traveling expedition. The subject is a single fantasy WOMAN explorer in cool fitted ornate armor. Combat is BANNED (drawn-blade STEALTH and wary-advance are allowed — strike-beats are not).

━━━ THE FORMAT — mirror this EXACTLY ━━━

Format strictly: "<ACTION-NAME> — <loaded-moment sentence>". The action-name is 2-4 ALL-CAPS words (the "headline" of the moment). The em-dash is followed by a 30-50 word ONE-sentence description using commas (no periods) internally.

EXAMPLE REGISTER (mirror this exactly):
  "CRESTING THE RIDGE — striding upright onto a wind-scoured ridgeline, pack settled across her shoulders, one hand shielding her eyes as she reads the valley below, the trail still humming in her legs."
  "CREEK REFILL — crouched low at a rushing stream bank, waterskin submerged and bubbling, free hand steadying herself on a mossy stone, late-afternoon gold cutting through the canopy."
  "STEALTH ADVANCE — moving forward in a low deliberate crouch along a shadowed forest floor, short sword drawn and angled low, eyes locked on a dark gap between the tree-trunks ahead."

━━━ THE CANDID-MOMENT BAR ━━━

Every entry must answer YES to: "Is this a loaded INSTANT the camera caught, not a posed shot, not a fight beat?"

Each beat names:
  • A SPECIFIC body position / weight / posture (crouched / striding / kneeling / leaning / wedged / bracing / hauling / reaching / pressed / coiled)
  • A SPECIFIC piece of gear or terrain her body is interacting with (mossy stone / cliff-edge / waterskin / saddle horn / fire-pit / cave mouth / map / waterlogged log / horse's flank / tree trunk)
  • An ATMOSPHERIC cue (golden light / breath in cold air / mist on her cheeks / distant rumble / silence of the trees / spray on her face / smoke trailing past)
  • An EMOTIONAL beat or breath (the long day behind her / the next mile earned / something has gone very still / her thoughts wandering / the cold finally settling in)

━━━ THE VARIETY MANDATE ━━━

Distribute the ${n} entries roughly across these moment-categories. Each entry should land on ONE of them as its primary beat:

TRAVEL / TRAIL: cresting ridges / scrambling slopes / fording streams / threading switchbacks / pushing through dense undergrowth / rock-step scrambling / golden-hour walking / boulder-hopping / scree-scrambling / dune-walking / snow-trudging / muddy descent
REST / CAMP: creek refill / fire-warm / tea by the kettle / sharpening blade by firelight / oiling armor / mending a strap / restitching a torn cuff / asleep by the embers / waking to first light / unfolding bedroll / bow-stringing / arrow-fletching / map-folding
WATCH / OBSERVATION: studying a valley / reading the wind / watching a herd cross / glassing a distant ridge / counting smoke columns / tracking footprints / checking a snare / listening to the dawn / spotting a far light
STEALTH: drawn-blade stalk / crouched advance / pressed-to-trunk / shadow-stepping / silent climb / breath-held watch / bow-drawn aim at distant target / waiting in ambush-stillness (target out of frame)
INTERACTION: examining a rune-stone / hand on a horse's neck / pressing palm to a temple gate / lighting a torch in a cavern / placing a coin on a cairn / kneeling at a fallen marker / sketching in a field journal
WATER: standing in a shallow lake / crossing stepping stones / wading a river / pulling herself onto a wet bank / rinsing her face / drinking from a stream / pulling a rope-bridge taut
HEIGHT: bracing on a cliff-edge / pulling herself onto a ledge / mid-rope on a chasm / inching across a stone bridge / steadying on a wind-scoured spire / hand-jam in a crack / dangling mid-rappel
INTERIOR (tavern / temple / inn / wayhouse): elbows on a tavern table / cleaning a mug / studying a map by candlelight / drying her cloak by a fire / counting coins / writing a letter / paying an innkeeper / reading a contract
WEATHER-ENGAGED: leaning into wind / cresting a snow-drift / sheltering under an overhang / cloak pulled tight against sleet / running for thin shelter / shielding eyes from sandstorm / drenched and pushing on
ANIMAL: hand on her horse's flank / leading a packhorse through scree / steadying a spooked mount / offering hand to a sniffing wolf / feeding a hawk on her glove / passing a sleeping bear at a distance

━━━ BANS — these are the failures we are guarding against ━━━

- NO mid-strike, NO mid-swing, NO weapon-in-an-enemy, NO visible foe, NO fallen body, NO blood-spray, NO combat moment. Drawn-blade STEALTH is fine. Wary advance is fine.
- NO "posing" / "smoldering" / "looking cool for the camera". Candid only.
- NO "shirtless" / "bare midriff" / "low-cut" / "skin-tight" / "sultry" — even when describing rest/water beats, she stays armored or in functional travel layers.
- NO modern / industrial / cyberpunk language.
- NO franchise proper nouns ("Azeroth" / "Mordor" / "Rohirrim" / "Witcher named character" / etc.).
- NO repeating an action-name already used. Each headline must be DISTINCT.
- NO neutral / gender-ambiguous pronouns — use she/her throughout the body sentence when pronouns are needed.

━━━ STRICT FORMAT ━━━

- ONE entry per line. Each line: "<ACTION-NAME 2-4 CAPS WORDS> — <30-50 word sentence>".
- One em-dash separator.
- Internal punctuation: commas only, no internal periods.
- Distinct action-name per entry. Distinct body / gear / terrain combination per entry.

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
