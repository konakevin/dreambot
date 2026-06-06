#!/usr/bin/env node
/**
 * SteamBot STEAMPUNK_SPECTACLE_ESCALATION top-up (Stage 2 backfill 2026-06-05).
 *
 * Used by steampunk-spectacle path — the climactic escalating moment that
 * turns a steampunk public spectacle (opera / parade / coronation / circus
 * / royal-ball / exhibition / orchestra-stage) into something cinematic.
 * Existing 50 cycle: boilers erupting, ambassadors descending from airships,
 * gasping crowds, brass automatons breaking formation, opera-singers
 * shattering chandeliers, mechanical starlings escaping.
 *
 * REGISTER: 18-30 words, ONE escalating event that turns a public spectacle
 * into the moment everyone remembers. CROWD presence is part of the event
 * (gasps, surges, applause cascades). The world ACTS upon the audience.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/steambot/seeds/steampunk_spectacle_escalation.json',
  total: 200,
  batch: 25,
  maxTokens: 16000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} new SPECTACLE-ESCALATION entries for SteamBot's steampunk-spectacle path. Each entry is the CLIMACTIC MOMENT that escalates a steampunk public spectacle (opera, parade, royal coronation, exhibition opening, circus performance, royal ball, championship match, fireworks gala, automaton-revue, balloon-launch festival) into something cinematic. The AUDIENCE reaction is part of the moment.

Each entry: 18-30 words. ONE complete escalating event sentence.

━━━ EXAMPLE PHRASINGS (mirror register exactly) ━━━

"Massive boiler stage-left erupting in a cathedral of white steam, pressure gauges spinning wildly, crowd surging backward in a single gasping wave"
"Uninvited ambassador's lacquered airship descending through low clouds, gilded anchor-chains clanging against cobblestones, uniformed attendants pouring down rope-ladders into the stunned plaza"
"Gasps cascading from the uppermost gallery downward like a breaking wave, every opera glass swinging toward the same impossible point, the hall falling churchlike silent"
"Brass-automaton honor-guard unit breaking formation suddenly, one figure pirouetting in perfect mechanical waltz-time, crowd erupting in delighted horrified laughter"
"Singer striking a note so impossibly high the crystal chandelier overhead begins visibly trembling, audience frozen mid-applause, every face tilted upward"
"Standing ovation erupting from the east balcony and cascading section by section around the rotunda like a falling row of dominoes, hats thrown skyward"

━━━ VARIETY MANDATE (distribute across ${n} new entries) ━━━

ARRIVAL / GRAND ENTRANCE (~12%):
- Royal carriages arriving / dignitaries on horseback / heads of state through arch-gates
- Ambassador airships descending / dirigible-yacht docking with red-carpet pier
- Surprise guest (assassin / rival / long-lost heir / former star) walking in dramatically
- Champion / hero / queen / regent emerging from doorway

MECHANICAL ESCALATION (~14%):
- Stage-machinery activating (orrery rising / floor-trap opening / curtain auto-lifting)
- Engine / boiler / generator failing or surging beyond expected limits
- Clockwork performance going off-script (automaton breaks pattern, machine improvises)
- Massive crane / lift / counterweight engaging at climactic moment
- Pyrotechnic stage-effect erupting larger than rehearsed

AUDIENCE WAVE / REACTION (~14%):
- Standing ovation cascading (section by section / row by row / left to right)
- Gasps rolling outward / silence falling like a struck note / collective inhale
- Crowd surging forward / surging backward / parting like a curtain
- Boos / cheers / chanting starting in one corner and spreading
- Hat-throwing / handkerchief-waving / programme-applause cascade

LIGHT / SPECTACLE PHENOMENA (~12%):
- Chandelier swinging / falling / igniting / shattering
- Spotlight cut / sweeping wildly / catching wrong subject / multiplying
- Fireworks burst earlier than scheduled / final pyrotechnic exceeding all prior
- Stage-lighting blackout / sudden re-illumination / cathedral spotlight from above

PERFORMER / CHAMPION MOMENT (~10%):
- Opera-singer hits impossible note / vaudeville performer lands impossible feat
- Acrobat / aerialist / juggler / tight-rope-walker survives near-fall
- Conductor breaks baton mid-crescendo / orchestra stops dead at one beat
- Final pose held longer than expected / champion crosses finish-line in dead heat

WEATHER / EXTERNAL FORCES (~10%):
- Storm breaks open above an outdoor spectacle / rain begins at climactic moment
- Wind catches a banner / lifts confetti / pulls flags taut
- Sun-shaft pierces dome at perfect timing / aurora visible above open-air gala
- Snow-flurry begins falling indoors through skylight at climax

ANIMAL / CLOCKWORK FAUNA (~8%):
- Trained doves / falcons / clockwork-birds released at the climax
- Brass-lion automaton roars / parade-elephants trumpet / circus-bears stand on hind legs
- Mechanical starling-flock escapes the conductor's grip and floods the hall
- A chained beast nearly slips its bindings / a horse rears at the perfect moment

UNEXPECTED EVENTS (~10%):
- Heckler stands up and shouts / banner unfurls from balcony reading something forbidden
- Sealed letter dropped onto the stage from gallery / single rose thrown at climactic note
- Glove / fan / handkerchief flung with provocative meaning
- Power failure / candle blowout / gas-jet flare-up

ROYAL / DIPLOMATIC (~10%):
- Queen / king / regent rising from her throne suddenly / removing crown
- Foreign delegation walking out / arriving late / refusing the toast
- Anthem playing as audience rises / king toasts in unexpected language
- Honor-guard saluting in unison / military band playing surprising encore

━━━ FORMAT RULES ━━━

- 18-30 words. ONE complete sentence.
- Lead with the escalating EVENT (the noun + active verb).
- Include the CROWD REACTION beat (gasping, surging, frozen, erupting, falling silent).
- Optional: close with a specific sensory detail (sound, light, motion).

━━━ HARD MANDATES ━━━

- Steampunk-Edwardian register — brass / copper / lacquer / gaslamps / opera-glasses / programs / clockwork / dirigible / corsetry.
- The AUDIENCE / CROWD is part of every escalation (it's a spectacle, not a private moment).
- Each entry's escalation type and crowd-reaction beat must vary across the pool.

━━━ HARD BANS ━━━

- NO modern tech (no microphones, no laser, no LED, no plastic).
- NO violence-as-spectacle (no shootings, no on-stage deaths, no graphic accidents).
- NO photographer / camera language.
- NO repeating the same escalation noun ("singer hits high note" max once).

━━━ OUTPUT ━━━

JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
