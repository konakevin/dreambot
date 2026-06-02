#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/beach_episode_ethnicity.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} ETHNICITY-NOUN entries for BEACH-EPISODE MangaBot. Bright joyful K-On!/Free!/Lucky-Star summer-vacation register. Each 6-12 words.

Format: "[ethnicity] character, [vacation-coded feature anchor]"

VARIETY (mix genders): 26% Japanese (Enoshima/Okinawa coast) / 14% other E.Asian (Korean/Taiwanese/HK) / 14% SE.Asian (Filipino/Indonesian/Thai/Viet) / 12% S.Asian (Indian/Sri Lankan) / 10% Mixed-heritage hāfu / 10% Latin (Brazilian/Peruvian/Mexican) / 6% Black (Nigerian/Kenyan/Jamaican) / 4% Middle Eastern (Lebanese/Egyptian) / 4% European.

DO write:
- Japanese girl, jet-black bob with windswept ends and bright sun-kissed grin
- Japanese boy, sun-bleached black hair with goggles on forehead and tan
- Filipina girl, warm-brown waves with seashell-clip and big laughing smile
- Korean boy, soft black hair with whistle around neck and sporty grin
- Mixed Brazilian-Japanese hāfu girl, sun-streaked chestnut hair and freckle-dusted cheeks
- Indonesian boy, dark wavy hair with rashguard collar visible and grinning
- Indian girl, black braid with bright orange swim-cap pushed up and beaming
- Nigerian girl, dark coils tied back with bright headband and joyful grin
- Mexican boy, dark hair with surf-wax smear on cheek and sunny laugh

DO NOT: cheesecake / sultry / "voluptuous" / "curvy" / oiled / "bombshell" — bright wholesome vacation-coded only. Multiple per entry.

Return ONLY JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
