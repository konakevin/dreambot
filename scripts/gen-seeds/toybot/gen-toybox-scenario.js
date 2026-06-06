#!/usr/bin/env node
/**
 * TOYBOX_SCENARIO — the dramatic situation / event-narrative driving
 * the toybox chaos vignette. One-sentence punchy scenarios where the
 * toys are mid-event. 10-18 words each. NO title prefix.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/toybox_scenario.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SCENARIO entries for ToyBot's toybox-chaos path — a dramatic event-narrative that drives the 4-toy chaos vignette. Each entry is ONE punchy sentence describing a high-energy MID-EVENT moment (countdown launching / heist going sideways / kaiju attack / pillow-fort siege / dance-off erupting). 10-18 words. NO title-caps prefix.

━━━ THE BAR ━━━
Every entry is ONE dramatic situation in mid-eruption / mid-collapse / mid-chaos. Present-tense action verb. Implies ENSEMBLE — multiple actors caught up in the moment. Generic enough that any 4 toys could be the cast. Punchy single sentence.

━━━ EXAMPLE PHRASINGS (mirror this register exactly — NO title prefix) ━━━
"Everyone scrambles as the countdown to launch reaches zero."
"The heist goes sideways when the alarm starts blaring."
"A rampaging giant sends the whole crowd fleeing in terror."
"Two rival teams collide in an all-out downhill crash."
"The birthday cake explodes and the ambush erupts into chaos."
"The dance-off erupts into shoving when the beat drops hard."
"A fire drill sends the whole crowd stampeding toward the exit."
"The hot-air balloon lurches and passengers grab desperately at each other."
"First one down the hill and the rest launch into pursuit."

━━━ VARIETY MANDATE (distribute across these scenario categories) ━━━

- ~5 HEIST / CRIME (heist goes sideways / bank-robbery unravels / jewel-theft botched / getaway driver spins out / safe-cracking ambush / casino-floor brawl / vault-blowing explosion / stakeout interrupted)
- ~5 BATTLE / SIEGE (pillow-fort siege intensifies / two armies collide / fortress invasion underway / catapult lobs the surprise attack / kaiju roar scatters defenders / dragon attack collapses ranks / charge-of-the-light-brigade chaos / cavalry-versus-infantry mid-clash)
- ~5 PARTY / CELEBRATION (birthday cake explodes / wedding reception detonates / tea party erupts / parade float tips over / dance floor implodes / costume party gone wrong / surprise-party collapses / fireworks-go-wrong panic)
- ~4 ACCIDENT / DISASTER (hot-air balloon lurches / parade float tips / science experiment bubbles over / roller coaster derails / lab-experiment explosion / blimp deflates mid-air / wagon-wheel snaps mid-race)
- ~4 RACE / SPORT (downhill race collision / soapbox-derby crash / pinewood-derby finale / first-down-the-hill pursuit / chariot race finale / steeplechase ambush / cycling-pack pileup / rocketsled crash)
- ~4 RESCUE / ESCAPE (treasure map tears apart / prison break frantic / rope-ladder swings loose / lifeboat overcrowded / mine-cart escape / cliff-edge rescue / hostage rescue mid-extraction / submarine breach)
- ~4 DRAMA / SOCIAL (courtroom verdict triggers brawl / talent-show collapses / dance-off goes ugly / town-hall meeting devolves / paparazzi mob the celebrity / band-on-stage fight)
- ~4 MONSTER / SUPERNATURAL (kaiju roar scatters squads / dragon swoops down / sea-monster surfaces / werewolf transformation interrupts / ghost mid-haunt / vampire ambush at dusk / zombie horde breaks ranks / alien invasion lands)
- ~4 CHASE / PURSUIT (high-speed chase swerves / horseback pursuit closes in / detective chase splits up / parkour rooftop pursuit / motorcycle pursuit weaves / boat-pursuit goes wide / bike-chase through alley)
- ~3 LAUNCH / COUNTDOWN (countdown reaches zero / rocket launch shakes everything / space-shuttle takeoff disrupts / catapult fires the surprise / cannon-fire scatters formation / fireworks finale chaos)
- ~3 STAMPEDE / EVAC (fire drill stampede / sudden alarm sends everyone fleeing / earthquake aftermath / mall-doors-open frenzy / concert exit-rush)
- ~3 SURPRISE REVEAL (someone just pulled the ripcord / treasure-chest opens and chaos erupts / piñata bursts everyone dives / cake reveals jump-scare / magic-trick goes wrong)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- NO title-caps prefix — open with "Everyone..." or "The..." or "Two..." or "A...".
- Single sentence, 10-18 words.
- ALWAYS present-tense action verb (scrambles / collides / erupts / tips / launches / etc.).
- ALWAYS implies ENSEMBLE (everyone / the whole crowd / both teams / all the squad / the entire party).
- Punchy and high-energy.

━━━ BANS ━━━
- NO specific characters / IPs named (no Marvel / Star Wars / Pokemon).
- NO toy-specific naming — generic scenario only (toys are toy_cast axis).
- NO surface / location — that's toybox_surface axis.
- NO calm / quiet scenarios — mid-chaos energy only.
- NO over-elaborate descriptions — short and punchy.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
