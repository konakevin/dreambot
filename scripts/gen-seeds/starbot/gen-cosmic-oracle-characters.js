#!/usr/bin/env node
const fs = require('fs');
try { fs.unlinkSync('scripts/bots/starbot/seeds/cosmic_oracle_characters.json'); } catch (_) {}
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_characters.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} COOL SCI-FI CHARACTER descriptions for StarBot's cosmic-oracle path — cinematic sci-fi oil paintings of badass, interesting characters in cosmic scenes.

Think of the characters you'd see in the coolest scenes from: Star Wars cantina, Dune, Halo, Mass Effect, Guardians of the Galaxy, Alien/Prometheus, The Expanse, Cowboy Bebop, Firefly, Mandalorian, Blade Runner, Fifth Element, Farscape, Warhammer 40K, Stargate. The VIBE of those characters — NOT the specific named characters.

Each entry: 20-35 words. ONE specific solo character. Format: "[Role] — [visual description], wearing [gear]"

━━━ CHARACTER MIX (across ${n} entries) ━━━
- ~40% HUMAN (but interesting humans — grizzled, scarred, augmented, weathered, young-and-scrappy, old-and-wise, battle-hardened, roguish)
- ~30% HUMANOID ALIEN (the cool kind — think Turian, Yautja, Twi'lek, Asari, Sangheili, Wraith, Cardassian-vibe — recognizably person-shaped but clearly alien)
- ~20% ARMORED / HELMETED (Mandalorian-vibe bounty hunters, Spartan-vibe super-soldiers, space marines, knight-like warriors in powered armor)
- ~10% ROBOT / ANDROID / CYBORG (not silly — think HK-47, Bishop from Aliens, Terminator endoskeleton, battle-droid commander)

━━━ ROLE MIX (rotate — don't cluster) ━━━
Bounty hunter / Smuggler / Astronaut / Explorer / Pilot / Mercenary / Scientist / Soldier / Scavenger / Engineer / Medic / Captain / Navigator / Spy / Diplomat / Mystic / Warlord / Sniper / Mechanic / Archaeologist / Trader / Refugee / Drifter / Commander

━━━ WHAT MAKES A CHARACTER COOL ━━━
- Specific weathering: scars, cybernetic replacements, burn marks, tattoos, battle damage
- Interesting gear: not generic — specific weapons, tools, gadgets, trophies
- Attitude in the description: "grizzled", "sharp-eyed", "battle-scarred", "war-weary", "cocky"
- Period/culture flavor: samurai-influenced, Wild-West-in-space, military-spec, nomadic-tribal, corporate-sleek

━━━ MUST-HAVE ━━━
- 20-35 words strict
- Role FIRST, visual description SECOND, gear/wardrobe THIRD
- SOLO character, no companions
- Gender-neutral or mix freely — don't default to male or female
- Species-neutral language for aliens ("scaled warrior" not "male Turian")

━━━ BANNED ━━━
- NO real IP character names (Boba Fett, Master Chief, Shepard, Ripley, etc.)
- NO specific IP species names (Turian, Sangheili, Twi'lek, etc.) — describe the look instead
- NO modern Earth clothes
- NO children
- NO sexualized descriptions
- NO lame/passive characters — everyone should look like they have a STORY
- NO mushrooms, jellyfish, coral, fungi, plants as characters — keep it COOL
- NO "beautiful woman" / "handsome man" — describe the CHARACTER not their attractiveness

━━━ EXAMPLES (do NOT copy — show the ENERGY) ━━━
- "Bounty hunter — tall scaled reptilian with scarred snout and cybernetic targeting-eye, wearing battered Beskar-style plate armor with trophy bones wired to shoulder-guards"
- "Astronaut — weathered human woman with close-cropped grey hair and radiation burns on her neck, wearing patched EVA suit with mission patches faded to ghosts"
- "Smuggler — wiry four-armed alien with blue-grey skin and sharp mandibles, wearing a leather flight-jacket over cargo vest, twin pistols in cross-draw holsters"
- "Space marine — massive armored figure in scarred power-armor with glowing eye-slits, chainsword mag-locked to back, kill-tallies scratched into shoulder-plate"
- "Mechanic — stocky cyborg with one mechanical arm ending in integrated tools, oil-stained coveralls, welding goggles pushed up on forehead, wrench in human hand"
- "Explorer — lanky insectoid with compound eyes and chitinous exoskeleton, wearing expedition pack bristling with survey instruments, star-charts rolled in a tube on the back"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
