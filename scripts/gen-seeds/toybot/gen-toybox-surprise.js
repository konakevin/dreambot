#!/usr/bin/env node
/**
 * TOYBOX_SURPRISE — 40%-gated surprise toy / rogue element that
 * appears in the toybox chaos vignette. A wildcard mid-action that
 * adds delight / theatricality / absurdity. Short single-sentence —
 * 15-25 words. NO title prefix.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/toybox_surprise.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SURPRISE entries for ToyBot's toybox-chaos path — a 40%-gated wildcard / rogue / surprise toy element that drops into the chaos vignette adding delight, absurdity, theatricality. Each entry is ONE rogue-toy mid-action moment — short single-sentence, 15-25 words. NO title-caps prefix.

━━━ THE BAR ━━━
Every entry is ONE rogue toy or surprise element CAUGHT IN A MID-ACTION POSE that breaks the fourth wall of the chaos vignette. Examples: a rubber duck bobbing on an invisible current, a wind-up robot trundling in, a slinky caught mid-bounce, a jack-in-the-box mid-pop. Brief, vivid, with personality — characters that act like they have their own subplot.

━━━ EXAMPLE PHRASINGS (mirror this register exactly — NO title prefix) ━━━
"A rogue rubber duck bobbing through mid-air on an invisible current, grinning serenely."
"A wind-up robot trundling in obliviously, sparking tiny blue sparks from its chest panel."
"A lone googly-eyed sock puppet peering over the edge with theatrical suspicion."
"A toy UFO hovering on a tangled thread, slowly rotating with blinking lights."
"A jack-in-the-box mid-pop, spring fully extended, clown face frozen in delighted shock."
"A slinky caught mid-bounce, suspended in its perfect metallic arc between two invisible steps."
"A glow-stick-waving tiny party figure shimmying in the far corner completely unbothered."

━━━ VARIETY MANDATE (distribute across these surprise categories) ━━━

- ~4 RUBBER / WINDUP / MECHANICAL (rubber duck / wind-up robot / clockwork hopping frog / wind-up walking teeth / clockwork tin-monkey clashing cymbals / wind-up race-car spinning / wind-up dog wagging tail / wind-up acrobat tumbling / spring-loaded jumping bean)
- ~4 BOUNCING / CAUGHT-MID-ACTION (slinky mid-bounce / superball mid-bounce / yoyo mid-trick / hacky-sack mid-air / paddle-ball mid-snap / Newton's cradle clacking / jacks scattered mid-bounce / dice tumbling)
- ~3 POP-UP / JACK-IN-THE-BOX (jack-in-the-box mid-pop / pop-up book springing open / gag-can-of-peanuts with snake erupting / surprise-party-popper streamers / party-blower mid-uncoil / spring-loaded snake-prank)
- ~3 PUPPET / PLUSH (sock puppet peering / glove puppet leaning in / finger-puppet whispering / hand-puppet judging / marionette dangling / muppet-style monster mid-yell / puppet-mouth wide-open frozen / shadow-puppet silhouette on wall)
- ~3 INTERLOPER VEHICLES (toy UFO hovering on thread / remote-control car careening / RC helicopter buzzing / toy plane on string circling / wind-up tank rolling / toy submarine periscope-up / rocket model launching)
- ~3 ABSURDIST / RANDOM (googly-eyed banana / dancing flower-pot with face / glow-stick partygoer / tiny dance-figure shimmying / disco-ball spinning / mini-stage with curtains / mini-spotlight pointed / mini-megaphone shouting)
- ~3 FOOD / DOMESTIC TOY (squeaky-pizza toy mid-squeak / plush-burger laughing / fortune-cookie cracked open / squeaky-rubber-chicken thrown / plush-banana eyes-darting / play-doh blob with face / chattering teeth chittering)
- ~3 PARTY / FESTIVE (confetti-cannon mid-blast / party-popper streamer-spray / kazoo-blower honking / noisemaker swirling / disco-ball spinning / glitter-puff cloud / piñata mid-swing / piñata releasing candy)
- ~3 CRITTERS / SMALL CREATURE TOYS (windup ladybug / mechanical spider scuttling / windup duckling waddling / motorized fish flopping / pull-string chatter-monkey / pull-string parrot squawking)
- ~3 MAGIC / WHIMSY (floating bubble with rainbow sheen / pinwheel spinning / paper airplane gliding / paper crane fluttering / origami fortune-teller mid-flip / origami fox leaping / sparkler trailing / glow-wand sweeping)
- ~3 BOOK / GAME PIECE (book pages flipping / loose deck of cards mid-flutter / domino mid-fall / chess-knight tipped at angle / die rolling / spinning-top pegging down / monopoly piece skating)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- NO title-caps prefix — open directly with "A [toy/element]..." or "[Element] mid-..." form.
- Single sentence, 15-25 words.
- ALWAYS specify the rogue ELEMENT (rubber duck / wind-up robot / etc.).
- ALWAYS specify a MID-ACTION verb (mid-bounce / mid-pop / mid-twirl / bobbing / trundling / hovering / mid-spin / mid-snap).
- ALWAYS add a personality detail (grinning / oblivious / serene / unbothered / suspicious / theatrical).
- Tone: delightful, slightly absurd, personality-driven.

━━━ BANS ━━━
- NO scary / horror / threatening toys — only delightful surprise.
- NO modern brand-named toys (no specific Mickey / Pikachu / Pokemon).
- NO over-detailed staging — short and punchy.
- NO ensemble / group descriptions — single rogue element only.
- NO surface / location mention — that's toybox_surface.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
