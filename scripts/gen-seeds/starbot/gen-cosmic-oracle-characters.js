#!/usr/bin/env node
/**
 * 2026-06-05 rewrite (Kevin call: no IP refs in StarBot pools).
 * Dropped the franchise inspiration list ("Star Wars cantina, Dune,
 * Halo, Mass Effect, Guardians of the Galaxy, ..., Mandalorian,
 * Warhammer 40K") + the "-vibe" mapping examples (Turian-vibe /
 * Twi'lek-vibe / Mandalorian-vibe / Spartan-vibe / space marines) +
 * the example seeds that named franchises. Each one was a Sonnet
 * prior reinforcer.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/starbot/seeds/cosmic_oracle_characters.json',
  total: 200,
  batch: 50,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} COOL SCI-FI CHARACTER descriptions for StarBot's cosmic-oracle path — cinematic sci-fi oil paintings of badass, interesting characters in cosmic scenes set in OUR universe (not any existing sci-fi franchise).

CRITICAL — NEVER name any sci-fi franchise, species, trademark, or named character. Do not write "Mandalorian", "Spartan", "Space Marine", "Boba Fett", "Master Chief", "Twi'lek", "Vulcan", "Turian", "Asari", "Sangheili", "Yautja", "Wraith", "Cardassian", "HK-47", "Bishop", "Terminator", "Ripley", "Shepard", "beskar", "MJOLNIR", "ceramite", "Halo", "Mass Effect", "Star Wars", "Star Trek", "Warhammer", "Dune", "Cyberpunk", "Witcher", "Avatar" or any other franchise / trademark term. Describe FEATURES, not franchises.

Each entry: 20-35 words. ONE specific solo character. Format: "[Role] — [visual description], wearing [gear]"

━━━ CHARACTER MIX (across ${n} entries) ━━━
- ~40% HUMAN (but interesting humans — grizzled, scarred, augmented, weathered, young-and-scrappy, old-and-wise, battle-hardened, roguish)
- ~30% HUMANOID ALIEN (the cool kind — recognizably person-shaped but clearly alien: pointed-ear humanoids, blue-skinned head-crest humanoids, head-tendril humanoids, scaled crested warriors, bone-plated combat-types — describe FEATURES not franchises)
- ~20% ARMORED / HELMETED (sealed-helmet bounty hunters, full-coverage power-armored super-soldiers, war-armored knights in heavy plate)
- ~10% ROBOT / ANDROID / CYBORG (battle-droid commander, humanoid synthetic, chrome endoskeleton, cyborg veteran — not silly)

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
- NO franchise / species / trademark / character names anywhere
- NO modern Earth clothes
- NO children
- NO sexualized descriptions
- NO lame/passive characters — everyone should look like they have a STORY
- NO mushrooms, jellyfish, coral, fungi, plants as characters — keep it COOL
- NO "beautiful woman" / "handsome man" — describe the CHARACTER not their attractiveness

━━━ EXAMPLES (do NOT copy — show the ENERGY) ━━━
- "Bounty hunter — tall scaled reptilian with scarred snout and cybernetic targeting-eye, wearing battered metallic plate armor with trophy bones wired to shoulder-guards"
- "Astronaut — weathered human woman with close-cropped grey hair and radiation burns on her neck, wearing patched EVA suit with mission patches faded to ghosts"
- "Smuggler — wiry four-armed alien with blue-grey skin and sharp mandibles, wearing a leather flight-jacket over cargo vest, twin pistols in cross-draw holsters"
- "Heavy trooper — massive armored figure in scarred power-armor with glowing eye-slits, chain-saw blade mag-locked to back, kill-tallies scratched into shoulder-plate"
- "Mechanic — stocky cyborg with one mechanical arm ending in integrated tools, oil-stained coveralls, welding goggles pushed up on forehead, wrench in human hand"
- "Explorer — lanky insectoid with compound eyes and chitinous exoskeleton, wearing expedition pack bristling with survey instruments, star-charts rolled in a tube on the back"

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
