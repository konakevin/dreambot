#!/usr/bin/env node
/**
 * MALE_EXPLORER_ACTION — production scale-up toward 200.
 *
 * Candid adventuring action beats for the male-explorer path. Each
 * entry is an ACTION NAME tag + a 30-50 word loaded-moment sentence
 * showing body weight, gear interaction, terrain, and the breath of
 * the moment. NEVER combat — drawn-blade-stealth is allowed; mid-strike
 * is not.
 *
 * Mirrors the existing 96 entries' register:
 *   "ACTION-NAME — long descriptive moment sentence with body + terrain
 *   + senses."
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/male_explorer_action.json',
  total: 200,
  batch: 25,
  maxTokens: 12000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} ACTION-BEAT entries for DragonBot's male-explorer path. Each entry describes a single CANDID adventuring moment — the kind of beat a documentary camera would catch on a long traveling expedition. The subject is a single fantasy MAN explorer in cool fitted gritty armor. Combat is BANNED (drawn-blade STEALTH and wary-advance are allowed — strike-beats are not).

━━━ THE FORMAT — mirror this EXACTLY ━━━

Format strictly: "<ACTION-NAME> — <loaded-moment sentence>". The action-name is 2-4 ALL-CAPS words (the "headline" of the moment). The em-dash is followed by a 30-50 word ONE-sentence description using commas (no periods) internally.

EXAMPLE REGISTER (mirror this exactly):
  "RIDGE STRIDE — long step cresting a switchback, worn leather pack settled low on his back, pine ridgeline bleeding into pale morning sky, boot dust still rising behind him, forward momentum unbroken."
  "BOULDER SCRAMBLE — both hands gripping a moss-slick granite face, knee driving up to a ledge, mossy ravine dropping away below, jaw set, weight shifting upward through controlled effort."
  "CREEK REST — crouched at a shallow stream, waterskin submerged at arm's length, other hand braced on a wet stone, cold mountain water rushing white around his boots."

━━━ THE CANDID-MOMENT BAR ━━━

Every entry must answer YES to: "Is this a loaded INSTANT the camera caught, not a posed shot, not a fight beat?"

Each beat names:
  • A SPECIFIC body position / weight / posture (crouched / striding / kneeling / leaning / wedged / bracing / hauling / reaching / pressed / coiled)
  • A SPECIFIC piece of gear or terrain his body is interacting with (mossy stone / cliff-edge / waterskin / saddle horn / fire-pit / cave mouth / map / waterlogged log / horse's flank / tree trunk)
  • An ATMOSPHERIC cue (golden light / breath in cold air / mist on his cheeks / distant rumble / silence of the trees / spray on his face / smoke trailing past)
  • An EMOTIONAL beat or breath (the long day behind him / the next mile earned / something has gone very still / his thoughts wandering / the cold finally settling in)

━━━ THE VARIETY MANDATE ━━━

Distribute the ${n} entries roughly across these moment-categories. Each entry should land on ONE of them as its primary beat:

TRAVEL / TRAIL: ridge strides / switchback scrambles / forest threading / muddy descent / scree climbing / snow-trudging / golden-hour walking / boulder-hopping / dune-walking / hilltop pause / log-bridge crossing / dawn march / footbridge crossing / mountain-pass push
REST / CAMP: creek rest / fire-warm / bread by the fire / oiling armor / sharpening blade / mending strap / asleep by embers / waking to first light / unfolding bedroll / drying his cloak / hunched against rain / map study by candle / journal entry / quiet meal
WATCH / OBSERVATION: studying valley / reading wind / watching herd / glassing distant ridge / counting smoke columns / tracking footprints / checking snare / listening to dawn / spotting far light / tracking a print in mud
STEALTH: drawn-blade stalk / crouched advance / pressed-to-trunk / shadow-step / silent climb / breath-held watch / bow-drawn at distant target / waiting in ambush stillness (target out of frame) / sliding behind a wall / dropping into long grass
INTERACTION: examining rune-stone / hand on horse's neck / palm to a temple gate / lighting a torch in a cavern / placing a coin on a cairn / kneeling at a fallen marker / sketching in a field journal / inspecting a found relic / kneeling at a buried marker / reading a wax-sealed letter
WATER: standing in shallow lake / stepping-stone ford / wading river / pulling onto wet bank / rinsing face / drinking from stream / pulling rope-bridge taut / poling a flat-boat / launching a small skiff / dunking head under
HEIGHT: bracing on cliff-edge / pulling onto ledge / mid-rope on chasm / inching across stone bridge / steadying on a wind-scoured spire / hand-jam in a crack / dangling mid-rappel / clutching mossy rope / stepping out onto a narrow plank / climbing a rotted ladder
INTERIOR (tavern / temple / inn / wayhouse): elbows on tavern table / studying a letter by leaded window / drying cloak by fire / counting coins on bar / writing a letter / paying innkeeper / waiting in lamplit corner / sitting alone at a long table / sharpening blade at the bar / passing through low door
WEATHER-ENGAGED: leaning into wind / cresting snow-drift / sheltering under overhang / cloak pulled tight against sleet / shielded eyes from sandstorm / drenched and pushing on / pulled hood low against hail / kneeling against driving rain / dripping at a doorframe
ANIMAL: hand on horse's flank / leading packhorse through scree / steadying spooked mount / offering hand to a sniffing wolf / feeding hawk on his glove / passing sleeping bear at distance / talking softly to a tired mule / harness check on a tired horse

━━━ BANS — these are the failures we are guarding against ━━━

- NO mid-strike, NO mid-swing, NO weapon-in-an-enemy, NO visible foe, NO fallen body, NO blood-spray, NO combat moment. Drawn-blade STEALTH is fine. Wary advance is fine.
- NO "posing" / "smoldering" / "looking cool for the camera". Candid only.
- NO "shirtless" / "bare-chested" / "open shirt" / "oiled" — even in rest/water beats, his chest stays armored or layered.
- NO modern / industrial / cyberpunk language.
- NO franchise proper nouns ("Azeroth" / "Mordor" / "Rohirrim" / "Witcher named character" / etc.).
- NO repeating an action-name already used. Each headline must be DISTINCT.
- NO neutral / gender-ambiguous pronouns — use he/him throughout the body sentence when pronouns are needed.

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
