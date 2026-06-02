#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/combat_foe.json',
  total: 200,
  batch: 50,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} GOTHIC-FANTASY COMBAT FOE descriptions for GothBot's vampire-assassin-combat path. Each entry is 25-40 words. The foe is the THING the assassin is fighting — a stylized supernatural creature.

CONTEXT: Castlevania-boss / Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster aesthetic. Each foe is BEAUTIFUL-BUT-DEADLY — operatic gothic horror, not cheap B-movie schlock. They fight back; the assassin engages mid-action.

Categories (rotate widely — use ALL types across the pool):
- Vampire (vampire lord / vampiress / blood-noble / nosferatu / strigoi)
- Werewolf (man-wolf mid-shift / massive lupine beast / fenrir-style giant wolf)
- Gargoyle (animated stone-gargoyle, wings spread / gargoyle-crouched-on-rooftop / massive cathedral gargoyle uncoiling)
- Demon (lesser demon / horned-demon-warrior / succubus / imp-swarm / shadow-demon)
- Banshee (wailing spectral figure / shrieking ghost-woman / mid-scream banshee in tattered shroud)
- Lich (skeletal robed sorcerer with glowing eye-sockets / undead-king / death-knight)
- Ghoul (twisted humanoid undead / hollowed-out-corpse-creature / starving ghoul mid-leap)
- Harpy (feathered woman-raptor / dark-harpy with talons-out / harpy mid-dive)
- Wraith / shade (translucent armored ghost / spectral knight / shadow-wraith)
- Undead-knight (animated armor / cursed paladin / black-knight mid-strike)
- Lamia / serpent-creature (humanoid-serpent hybrid / coiled lamia mid-strike)
- Hellhound (massive black hound with burning eyes / chained demon-dog uncoiling)
- Crow-shaped horror (giant crow-thing with too many eyes / man-sized raven-fiend)
- Bat-swarm coalescing (cloud of bats merging into a vampire-shape)
- Plague-victim revenant (corpse-of-the-plague risen, fungal-decay visible)

EVERY entry must include:
- Specific creature type (named — vampire-lord, werewolf, gargoyle, etc.)
- Physical description that reads as terrifying AND beautiful (sharp fangs, glowing eyes, ornate body design)
- Scale relative to the assassin (taller than her, building-scale, human-sized, smaller-darting-thing)
- Mid-action descriptor (mid-leap, mid-shift, mid-shriek, mid-uncoil, claws-extended, fangs-bared, wings-spread)

ABSOLUTELY BANNED:
- NO cheap-horror cliches (zombies-with-arms-out / drooling-monster / generic ugly-monster)
- NO gore-spatter, NO dismemberment, NO entrails, NO ripped-flesh
- NO Halloween-costume cheapness
- NO Pumpkin-King, NO Jack-Skellington, NO clown-monster
- NO satanic-imagery (no pentagrams, no inverted crosses, no baphomet)

Examples (write fresh):
- "A vampire-lord taller than her, mid-leap with cape billowing wide and fangs bared, alabaster skin gleaming under blood-moon, ornate black-velvet coat split at the back, glowing crimson eyes locked on her"
- "A massive werewolf mid-shift on its hind legs, towering eight feet tall with charcoal-grey fur, taloned hands extended, lupine snout-fangs bared in a snarl, eyes glowing fel-green"
- "An animated stone-gargoyle uncoiling from a cathedral parapet, leathery stone-wings spreading wide, blunt claws extended, glowing red eyes carved into the worn-stone face, mid-leap from above"
- "A wailing banshee mid-shriek with translucent tattered shroud streaming behind, hollow-glowing eye-sockets, skeletal hands extended toward her, hair flowing as if underwater"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
