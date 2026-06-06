#!/usr/bin/env node
/**
 * EPIC_MOMENT_WITNESS_CHORUS — production scale-up 2026-06-05.
 *
 * Gated 50% accent axis for DragonBot's epic-moment path. Renders TINY
 * scale-prover figures — ant-sized / matchstick-sized / pencil-tall /
 * pixel-tall crowds, columns, ranks, processions — that PROVE the
 * castle's massive scale AND prove the event's civilizational impact.
 *
 * NEVER hero-scale, NEVER focal. The figures are SCALE PROVERS — small
 * but visible because we're close to the castle.
 *
 * Append mode preserves the initial 25 hand-curated entries.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/epic_moment_witness_chorus.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} WITNESS-CHORUS descriptions for DragonBot's epic-moment path. Each entry describes a MULTITUDE of TINY scale-prover figures occupying a specific location on or around a fantasy castle — figures so small they read as ants / matchsticks / pencils / pixels but numerous enough to PROVE the castle's massive scale and PROVE the event's impact.

Each entry: 20-32 words.

━━━ THE BAR — TINY SCALE IS THE ENTIRE POINT ━━━
The figures are NEVER hero-scale. NEVER focal. The viewer reads them as small dots / specks / flecks / matchsticks / pixels — present-but-tiny. They function as SCALE PROVERS — they tell the viewer how vast the castle is and how impactful the event is, by being dwarfed by both. If the figures are large enough to see faces / detail, this entry FAILS.

━━━ MANDATORY LANGUAGE — use these scale markers ━━━
Every entry MUST include one of: "ant-sized", "matchstick-sized", "pencil-tall", "pixel-tall", "thread-thin", "speck", "fleck", "pinprick", "tiny", "compressed to a dot", "reduced to specks". Multiple is fine.

━━━ EVERY ENTRY INCLUDES ━━━
1. A NUMBER OR DENSITY (forty / two hundred / a thousand / countless / sixty / three hundred / pair / column of / throng of / company of / regiment of / pilgrimage of). Vary the number.
2. A KIND OF MULTITUDE (cavalry / pikemen / townsfolk / refugees / pilgrims / archers / clergy / sentries / scribes / besiegers / wounded / nobles / sappers / heralds / officers / wedding-guests / coronation-procession / market-throng / funeral-cortege / siege-crew / wall-walkers / banner-bearers / mourners / messengers / tribute-bearers / serfs / monks / drovers / mercenaries / penitents).
3. A SPECIFIC LOCATION on or around the castle (approach road / outer ward / wall-walk / battlements / courtyard / gate-tower platform / parapet / east field / valley floor / barbican / inner courtyard / keep stairs / drawbridge / lower bailey / market square / siege-camp).
4. A FINE-GRAINED DETAIL that reinforces tininess — "their tents a pale stipple covering every acre" / "their banners reduced to tiny ribbons of color" / "their lances a bristling matchstick forest" / "their candles to pinprick glimmers" / "their formation a thread of color".

━━━ VARIETY MANDATE — distribute across these multitude types ━━━

MILITARY (~12 entries):
- Cavalry company on approach road / circling field / cresting ridge
- Pikemen squares in inner courtyard
- Archer ranks along battlements
- Siege-crews working trebuchets in the field
- Besieging infantry filling the plain
- Defenders raining arrows from the full battlement circuit
- Sentry-patrols moving in pairs along wall-walks
- Officers clustered on gate-tower platforms
- Sappers crawling along the wall base
- Mercenary column entering the barbican
- Royal-guard ranks along the keep stair
- Wall-walkers cheering above the gate

CIVILIAN / CEREMONIAL (~7 entries):
- Townsfolk crowd at the main gates
- Market-day throng filling lower bailey
- Wedding procession descending keep stairs
- Coronation guest column ascending high stairs
- Pilgrim procession on approach road
- Nobles on highest balcony of the keep
- Market stalls reduced to bright-colored flecks

DISASTER / AFTERMATH (~5 entries):
- Refugees crowding the outer ward
- Wounded laid in long rows across the courtyard
- Scribes moving among the dead recording names
- Funeral-cortege descending in slow procession
- Survivors clustered at the well in the lower bailey
- Penitents kneeling along the approach road
- Mourners filling the great hall steps

CLERGY / RELIGIOUS (~3 entries):
- Clergy moving among the fallen, white vestments tiny points
- Monastic procession along the wall-walk with candles
- Tribute-bearers ascending the high stairs single-file

EXOTIC (~3 entries):
- Heralds galloping along the parade route
- Crowned-tribute kings bowing at the inner-ward arch
- Diplomatic-summit delegations crossing the drawbridge in opposing columns

━━━ EXAMPLES — match this register ━━━

- "Four hundred ant-sized cavalry company streaming along the approach road below, their matchstick lances tilting forward in bristling unison."
- "A thousand ant-sized refugees crowding the outer ward in ragged clusters, their bundled possessions reduced to specks against the cobblestones."
- "Sixty pencil-tall archer rows ranked along the northern battlements, each figure a sliver of shadow against the pale stone crenellations."
- "Countless ant-sized besieging army filling the field beyond the moat, their tents a pale stipple covering every acre of ground."
- "A wedding procession of eighty matchstick-sized figures descending the keep stair, their candles reduced to pinprick glimmers in the dusk."

━━━ STRICT RULES ━━━
- TINY SCALE LANGUAGE in every entry. If you can read a figure's face from the described distance, the entry FAILS.
- NUMBER + KIND + LOCATION + TINY-DETAIL in every entry.
- NO close-up. NO portrait. NO hero. Figures are NEVER focal.
- Western high-fantasy register only. NO modern. NO sci-fi. NO real-world period codes — use medieval-fantasy archetypes.
- Vary the NUMBER across entries (don't keep returning to "a thousand"). Vary the KIND. Vary the LOCATION.
- Each entry is ONE sentence.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
