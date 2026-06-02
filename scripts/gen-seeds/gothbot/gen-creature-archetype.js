#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/creature_archetype.json',
  total: 200,
  batch: 25,
  append: true,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} GOTHIC CREATURE ARCHETYPE descriptions for GothBot's monster-prowl path. Each entry is 40-60 words. The "creature" is a stylized supernatural being out solo in the wild — operatic gothic horror, terrifying and beautiful.

CONTEXT: These are the BAD GUYS in the gothic world — what vampire-assassins hunt. Castlevania-boss / Bloodborne-beast / Devil-May-Cry-demon / Van-Helsing-monster aesthetic. Each entry describes ONE creature solo (no hunter present) — the WHO, the design, and signature features.

Distribution mandate — spread across these creature types in the ${n} entries:
- 4-5 vampires (vampire lord / vampiress / blood-noble / nosferatu / strigoi)
- 3-4 werewolves (man-wolf mid-shift / massive lupine beast / fenrir-style giant / lycan-warrior)
- 2-3 gargoyles (animated stone-gargoyle, wings spread / cathedral gargoyle uncoiling)
- 2-3 succubi / demons (succubus with horns and wings / horned-demon-warrior / lesser demon)
- 1-2 banshees (wailing spectral figure / shrieking ghost-woman in tattered shroud)
- 1-2 liches (skeletal robed sorcerer with glowing eye-sockets / undead-king / death-knight)
- 1-2 ghouls (twisted humanoid undead / hollowed-out-corpse-creature)
- 1-2 harpies (feathered woman-raptor with talons / dark-harpy)
- 1-2 wraiths (translucent armored ghost / spectral knight / shadow-wraith)
- 1-2 hellhounds (massive black hound with burning eyes)
- 1 lamia or serpent-creature (humanoid-serpent hybrid)
- 1 plague-revenant or undead-knight

EVERY entry must include:
- Specific creature type (named)
- Physical description: scale (taller than human / human-sized / massive), distinguishing anatomy (fangs, claws, wings, fur, stone-body, talons, horns), eye-color (glowing crimson / fel-green / void-violet / ember / etc.)
- Wardrobe / surface design (ornate black-velvet coat for a vampire / tattered shroud for a wraith / leathery wings for a demon / blackened-stone surface with carved details for a gargoyle / rich-silk robes for a lich)
- ONE signature ornament / detail (ornate ring / crucifix-burn-on-the-flesh / carved-rune-on-the-stone / silver-chain-collar / dragon-tooth-pendant / etc.)
- Personality / energy (predatory, calculating, hungry, regal, ancient, ferocious, ravenous, sardonic, malicious)

ABSOLUTELY BANNED:
- NO blood-spatter, NO gore, NO entrails, NO ripped-flesh
- NO Halloween-cheap, NO clown-monster, NO goofy-pumpkin-king
- NO Jack-Skellington, NO Nightmare-Before-Christmas
- NO satanic iconography (pentagrams, inverted crosses, baphomet)
- NO sexualized exposed bodies — terrifying-and-beautiful is operatic, not pin-up
- NO mid-bite-on-victim — these are SOLO creatures in the wild

Examples (write fresh):
- "A vampire lord taller than human with alabaster pallor and glowing crimson eyes, ornate black-velvet greatcoat with high collar and silver-thread sigil-embroidery, fangs visible, raven-black hair pulled back, predatory and regal, a single ruby ring catching moonlight"
- "A massive werewolf shifted to bipedal form, eight feet tall with dense charcoal-grey fur, glowing fel-green eyes, lupine snout-fangs bared, taloned hands hanging long, leather harness across chest with silver-claw clasp, ferocious and primal"
- "An animated stone-gargoyle uncoiling from a cathedral parapet, leathery stone-wings spreading wide, blunt claws extended, glowing red eyes carved into the worn-stone face, ancient lichen growing across the back, malicious and patient"
- "A succubus with high cheekbones and ember-orange eyes, two curved black horns, leathery folded wings, blackened-leather corseted gown with silver chain-belt, alabaster skin, calculating and predatory, a small skull pendant at her throat"

Output ONLY a valid JSON array of ${n} strings (40-60 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
