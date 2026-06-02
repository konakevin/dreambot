#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/gothbot/seeds/vampire_foe.json',
  total: 30,
  batch: 30,
  append: false,
  maxTokens: 4000,
  metaPrompt: (
    n
  ) => `Write ${n} VAMPIRE-VILLAIN FOE descriptions for GothBot's vampire-assassin-combat path. Each entry is 25-40 words. The foe is a HUMANOID VAMPIRE — the bad-guy the vampire-assassin is fighting. Castlevania-boss / Bloodborne-aristocrat / Interview-with-the-Vampire-elder / Van-Helsing-Dracula / Underworld-vampire-noble aesthetic.

CRITICAL: the foe is a HUMANOID VAMPIRE — vampire-lord, vampiress, blood-prince/princess, ancient elder, vampire-noble, strigoi, nosferatu, dhampir-rival, vampire-priestess, vampire-warlord. NOT a beast, NOT a creature, NOT a werewolf, NOT a demon. ALWAYS a vampire in human-form (with vampire features: fangs, glowing eyes, pale-skin, supernatural beauty).

CONTEXT: The vampire-foe is BEAUTIFUL, ORNATE, DEADLY, ARISTOCRATIC. Often centuries-old. Operatic gothic horror — Castlevania boss-vampire / Hellsing Alucard-rival / Vampire-the-Masquerade clan-elder. They fight back as equals to the assassin. Both are humanoid combatants.

VARY the vampire-foe types across the pool — mix genders, archetypes, vampire-flavors:
- Aristocratic vampire-lord in royal velvet (Dracula-coded male)
- Vampire-queen in obsidian gown (Carmilla / Lestat-coded female)
- Ancient elder-vampire (centuries-old, fang-prominent, withered-elegant)
- Blood-mage vampire (cape + blood-magic glow + dark sorcerer aesthetic)
- Vampire-warrior (armored, sword-bearing, knight-vampire)
- Vampire-priestess in dark ecclesiastical robes
- Strigoi (eastern-European folk-vampire, tattered noble-finery, hollow-eyed)
- Nosferatu (gaunt, elongated-fingered, bat-eared, classically-monstrous)
- Vampire-assassin rival (mirror-image of the assassin, dark version)
- Blood-prince / blood-princess in jeweled royal-vampire finery
- Vampire-mercenary (leather-clad, daggers + pistols)
- Vampire-warlord (commander-aesthetic, ornate armor, cape)
- Dhampir-rival (half-vampire, sympathetic-but-deadly)
- Vampire-courtier (foppish-elegant, lace + powder, dueling-pistol)
- Vampire-witch / vampiric-sorceress
- Renfield-style vampire-servant elevated to full-vampire (mad-eyed, twisted-elegant)

EVERY entry must include:
- Specific HUMANOID VAMPIRE archetype (named — vampire-lord / vampiress / blood-prince / strigoi / nosferatu / etc.)
- Visible vampire features (fangs / glowing eyes / pale-skin / unnatural beauty / hollow gaze)
- Wardrobe / finery (velvet coat, obsidian gown, royal cape, armored chest, lace cravat, dueling-leather, etc.)
- Weapon or fighting-stance (raising clawed hands, drawing sword, levitating mid-attack, lunging with fangs bared, casting blood-magic, drawing flintlock-pistol)
- Mid-action descriptor (mid-lunge, mid-leap, mid-cast, mid-draw, mid-strike, mid-counter, mid-flight, mid-pivot)
- Operatic-aristocratic-gothic-horror vibe (NOT pretty-anime, NOT cheap-vampire)

ABSOLUTELY BANNED:
- NO beasts / werewolves / gargoyles / demons / non-humanoid creatures (this pool is HUMANOID VAMPIRES ONLY)
- NO sparkly Twilight-vampires
- NO cheap-Halloween-costume vampires (no plastic-fangs / cheesy-cape)
- NO gore-spatter, NO dismemberment, NO entrails
- NO already-defeated foe (they are ACTIVELY FIGHTING the assassin)
- NO satanic-imagery (no pentagrams, no inverted crosses, no baphomet)

Examples (write fresh):
- "A vampire-lord in royal-purple velvet coat with raised claws and bared fangs, mid-lunge across cathedral stone, alabaster skin gleaming under blood-moon, glowing crimson eyes locked on the assassin, dark hair flying behind him"
- "An ancient vampiress in obsidian-silk gown, mid-cast with both palms glowing crimson, platinum hair cascading, eyes burning amber-gold, fangs gleaming beneath blood-red lips, ornate ruby choker catching torchlight"
- "A nosferatu strigoi with elongated bone-pale fingers, mid-leap from the cathedral rafters, bat-like ears, hollow-glowing eyes, ragged noble-finery tattered black, mouth gaping with too-many fangs"
- "A blood-prince in jeweled scarlet doublet with rapier drawn mid-thrust, raven hair tied back with black silk, glowing violet eyes, fangs bared in a snarl, lace-cuffs flaring as he advances"

Output ONLY a valid JSON array of ${n} strings (25-40 words each). No preamble, no commentary.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
