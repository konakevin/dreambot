#!/usr/bin/env node
/**
 * DINO_DIORAMA_SCENARIO — the prehistoric drama + what the dinos
 * are DOING. The story beat the viewer reads in 2 seconds. Not a
 * static lineup — caught mid-action: chase, face-off, hunt, escape,
 * herd-migration, family-care, fight, drink, nest-defense, etc.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/toybot/seeds/dino_diorama_scenario.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SCENARIO entries for ToyBot dino-diorama — the prehistoric DRAMA + what the toy dinosaurs are DOING in the diorama. Each entry is one sentence, 25-40 words, present-tense, captured mid-action with multiple dinosaurs reacting.

━━━ THE BAR ━━━
Every entry shows a story beat the viewer can read in 2 seconds. The dinos are NEVER static — they're mid-stride, mid-leap, mid-roar, mid-chase, mid-escape, mid-fight, mid-feed, mid-call. The scenario typically involves 2-5 named dinosaurs reacting to each other or to an environmental event. The story is FUN, story-driven, and prehistoric.

━━━ EXAMPLE PHRASINGS (mirror this register) ━━━
"A volcano is mid-eruption and three dinosaurs are sprinting away from a rolling lava-bomb, tails tucked, legs blurred in full panic gallop while a fourth trips and scrambles back upright."
"One hapless ankylosaur is half-swallowed by the tar pit, rear legs kicking air, while two sauropods stretch their necks toward it forming an improvised rescue chain."
"A triceratops and a T-rex are locked in a face-off across a clay watering hole, both leaning forward, frozen mid-charge, neither willing to blink first."
"A sneaky raptor is belly-crawling through tall fern clumps toward an unsuspecting hadrosaur drinking at the watering hole, one claw lifted mid-creep."
"A parent T-rex is hunched low over a clay nest of spotted eggs, wings spread wide, snarling at an approaching oviraptor that is retreating one cautious step at a time."

━━━ VARIETY MANDATE (distribute across these scenario categories) ━━━
- ~3 PREDATOR-PREY CHASE (raptor stalking / T-rex hunting / pack hunt closing in / pursuit through ferns)
- ~3 FACE-OFF / STANDOFF (rival dinos circling / territorial face-off / dominance display / locked-horn battle)
- ~3 ENVIRONMENTAL ESCAPE (volcano eruption flight / flood escape / wildfire panic / meteor-strike scatter / earthquake response)
- ~3 HERD ACTIVITY (migration line / grazing herd / mass-stampede / drinking at watering hole / wallowing in mud)
- ~3 FAMILY / NESTING (parent protecting eggs / hatchlings tumbling / juveniles playing / mother feeding young / nest-defense)
- ~3 HUMOROUS / WHIMSICAL (tar-pit rescue chain / dino stuck somewhere / failed escape / silly accident / playful tumble / wading-in-too-deep mishap)
- ~2 MIGRATION / TRAVEL (sauropods following a clay ridge / pterosaurs riding thermals / hadrosaur procession through fern flat)
- ~2 SKY-EVENT WATCHING (every dino frozen craning up at a meteor / aurora / strange phenomenon / pterosaur fleet overhead)
- ~2 FIGHT / CLASH (pack fight / horn-locked grapple / claw-and-jaw brawl / spike-tail swipe / bite-and-pin)
- ~2 RESTING / DOMESTIC (sleeping pod of sauropods / sun-bathing crocodilians / mud-bathers / drinking herd)

━━━ BANS ━━━
- NO static "a dinosaur stands in a field" — every entry is MID-ACTION.
- NO modern human elements (cars, helicopters, people).
- NO living-photoreal nature documentary register — these are TOY dinosaurs doing the action.
- NO lone-dinosaur scenarios — at minimum 2 dinos, ideally 3-5.
- NO repeating the same exact predator/prey pairing across entries.
- NO bare "a chase" — name the species + the specific beat.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
