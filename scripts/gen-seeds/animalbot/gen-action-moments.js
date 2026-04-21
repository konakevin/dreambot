#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/animalbot/seeds/action_moments.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} ACTION MOMENT descriptions for AnimalBot's action path — dynamic frozen peak-moments. Described in general action-type form so any species can fill them.

Each entry: 10-20 words. One specific action type.

━━━ CATEGORIES ━━━
- Mid-pounce peak frozen (paws extended, claws deployed)
- Mid-leap over obstacle (deer clearing log, fox over stream)
- Running full-stride frozen (legs stretched, dust kicking)
- Mid-flight wing-spread (raptor hovering, owl in silent glide)
- Mid-stoop dive (peregrine falcon, kingfisher)
- Talons-extended prey-catch (eagle grabbing, osprey hooking)
- Mid-charge aggressive (bull elephant, bear on hind legs)
- Mid-shake water-spray (wet dog, bear exiting river)
- Mid-roar/howl/bugle (mouth open, throat extended, breath visible)
- Mid-climb up tree or cliff (muscles bunched, claws in bark)
- Mid-jump gap-crossing (snow leopard ravine, lynx canyon)
- Mid-pounce on prey in snow (puff of snow spraying)
- Breaking-cover chase (predator emerging from cover)
- Mid-wing-spread courtship display (bird of paradise, peacock)
- Mid-fight between rivals (elk antlers clashing, stags)
- Leaping-catch of insect or fish from waterline
- Hunting-stalk ultra-low crouch (tiger, lynx in grass)
- Airborne-pounce onto burrow (fox mousing in snow)
- Soaring-thermal wings-extended (vulture, eagle at altitude)
- Mid-gallop through water shallows
- Mid-sprint peak-cheetah dust cloud
- Prey fragment in talons or jaws (small mouse / fish-at-shoreline — OK)

━━━ RULES ━━━
- Action type only — species will be matched later
- Emphasize FROZEN PEAK MOMENT — not blurred motion
- No humans involved
- Prey fragment OK only where needed (mouse / fish-at-waterline / insect)
- No underwater action (OceanBot)

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
