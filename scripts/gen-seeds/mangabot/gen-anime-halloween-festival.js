#!/usr/bin/env node
// AlphaBot candidate — anime-halloween-festival (destination: MangaBot).
// An anime school-or-shrine Halloween-festival night: costumed students,
// paper-lantern-lit stalls, a huge harvest moon presiding over everything.
// Leans into anime's own beloved "Halloween episode" trope (Ghibli / Shinkai
// / Kyoto Animation register), never real horror. Three MVP-25 pools:
//   - cast:  costumed anime students/festival-goers, role + costume + action
//   - stall: the matsuri yatai/stall midground reimagined for Halloween
//   - moon:  the MONEY-SHOT harvest-moon signature composition
// Modeled on scripts/gen-seeds/alphabot/gen-jack-o-lantern-toy-parade.js
// (the sibling MangaBot-genre candidate).
const { generatePool } = require('../../lib/seedGenHelper');

(async () => {
  await generatePool({
    outPath: 'scripts/bots/mangabot/seeds/anime_halloween_festival_cast.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} CAST entries for an anime Halloween-festival-night candidate path (destination: MangaBot, a hand-drawn Japanese anime bot). Each entry describes ONE costumed anime student or festival-goer at a matsuri-style Halloween night — a Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe register. Each entry 20-32 words, ONE flowing description combining: a role/archetype (never a name), a specific Halloween costume, one anime appearance micro-detail (hair or eyes), and a playful mid-action verb at the festival.

━━━ SPAN ACROSS ALL ${n} (mix freely — don't repeat combinations) ━━━
Roles/archetypes: shrine-maiden apprentice, kendo-club student, art-club student, transfer student, festival greeter, little sibling, class representative, baseball-team student, library-club student, festival-committee upperclassman, twin siblings, calligraphy-club student, soccer-team student, shy new student, stall vendor's apprentice, student-council president, drama-club student, track-team student, shrine-mascot student, homeroom teacher chaperone.

Halloween costumes (generic anime-trope only, NEVER a specific franchise character): black-cat ears and tail, wrapped-mummy bandage sash, hand-painted ghost-sheet with a cutout face, vampire cape with plastic fangs, paper kitsune (fox) mask pushed up on the head, pumpkin-head hood with a stitched jack-o-lantern face, tiny devil horns and a heart-tipped tail, witch's pointed hat with a broom prop, owl-costume hood with round paper-lens glasses, foam scythe and a hooded cloak (shinigami), candy-corn-striped happi coat, spider-web face paint, paper oni mask pushed up with tiny plush horns, raccoon-dog (tanuki) costume with a round paper belly, straw-tufted scarecrow sleeves, bat wings clipped to a school blazer, ghost-cat sheet with pointed ear cutouts, high-collared vampire-count cape, shrine-dog (komainu) mascot costume.

Playful mid-actions (vary): hanging a paper charm from a stall eave, reaching for a candy apple, mid-laugh pointing at a friend's costume, lighting a paper lantern, tossing a ring at a jack-o-lantern-ring-toss post, holding up a carved lantern, racing a friend down the stall aisle, painting a face on a small pumpkin, comparing candy hauls with a friend, waving a sparkler, adjusting a friend's mask, catching a drifting leaf, tying an omikuji fortune slip to a branch, sharing a taiyaki, peering into a goldfish-scoop tub.

Anime appearance micro-detail (hair or eyes, vary the color/style — dark braided hair, silver twin-tails, amber eyes, teal bob cut, windswept auburn hair, warm brown eyes, etc.).

━━━ EXAMPLES (format/length target) ━━━
- "a shrine-maiden apprentice in a black-cat-eared headband over her scarlet hakama, dark braided hair swinging as she hangs a grinning paper-pumpkin charm from a stall eave, amber eyes bright with laughter"
- "a kendo-club student with a wrapped-mummy bandage sash over his uniform, windswept auburn hair catching the lantern light, mid-laugh pointing at a friend's costume across the stall aisle"
- "a shy new student in a raccoon-dog costume with a round paper belly, teal-bob hair tucked under the hood, peering wide-eyed into a mini-pumpkin goldfish-scoop tub"

━━━ RULES ━━━
Characters by ROLE ONLY — never a named anime character, never a real franchise or copyrighted costume reference (no Pokemon, no Naruto, no Sailor Moon, etc.) — generic Halloween archetypes only. PLAYFUL, warm, and friendly tone — never scary, never gory, never a genuine threat. No specific real-world ethnic or national labels beyond "Japanese school/shrine setting" (the setting itself, not a checkbox on the person). Every entry ends mid-action, never a static standing pose.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/mangabot/seeds/anime_halloween_festival_stall.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} STALL/MIDGROUND scenes for an anime Halloween-festival-night candidate path (destination: MangaBot). Each describes the matsuri (Japanese festival) yatai/stall midground of a school-or-shrine Halloween night, reimagining traditional festival games and food stalls with a Halloween twist. Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe register, paper-lantern-lit, painterly. Each entry 22-34 words. The CAST is supplied separately — here build only the STALL-WORLD itself (the row of stalls, their specific Halloween-festival details, the lantern light, the crowd murmur).

━━━ SPAN ACROSS ALL ${n} (vary these, don't repeat the same stall twice) ━━━
- Candy-apple stand with a red-lacquer counter and paper-pumpkin string lights
- Kingyo-sukui (goldfish-scooping) stall reimagined with bobbing mini pumpkins in a tin tub
- Taiyaki stand shaped like little bats, sizzling on a griddle
- Omikuji fortune-slip stall tied to a bare tree strung with paper bats
- Ring-toss game stall, rings tossed at rows of grinning jack-o-lantern posts
- Takoyaki stall lit by a string of orange paper lanterns
- Cotton-candy vendor with a witch's-cauldron-shaped spinning machine
- Mask stall hung with rows of paper fox, oni, and ghost masks
- Shaved-ice (kakigori) stand marked with a black-cat-shaped flag
- Bobbing-for-apples barrel set beside a stone shrine lantern
- Corn-on-the-cob grill stall wrapped in cobweb bunting
- Fortune-teller's tent draped in purple cloth with a crystal-ball lantern
- Pumpkin-carving contest table lined with half-carved jack-o-lanterns
- Wind-up-toy stall selling tiny paper-lantern trinkets
- Dango-on-a-stick stand beside a row of hanging paper ghosts
- A row of stone shrine lanterns lit for the festival night
- School hallway turned haunted-house entrance strung with orange lights
- Drum-tower (taiko yagura) platform wrapped in autumn-leaf garlands
- Festival archway strung with glowing paper-pumpkin lanterns
- Riverside stall row reflected in dark water, lanterns bobbing

━━━ MATERIAL / REGISTER ━━━
Hand-drawn anime illustration, cel-shaded linework, painterly atmospheric backgrounds, warm paper-lantern amber against cool autumn-night blue, drifting autumn leaves, festival paper streamers, a crowd murmur implied at the edges (not the focus — no named crowd figures here, that's the cast's job).

━━━ RULES ━━━
PLAYFUL and FRIENDLY tone — never genuine horror, gore, or real scares; family-friendly Halloween matsuri. No readable text/signage spelled out. No named anime characters or franchises. Keep each entry a distinct stall/setting + specific Halloween-festival detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  await generatePool({
    outPath: 'scripts/bots/mangabot/seeds/anime_halloween_festival_moon.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} MONEY-SHOT "harvest moon" entries for an anime Halloween-festival-night candidate path (destination: MangaBot). Each entry describes the single signature hero image this entire path is built around: an ENORMOUS, glowing harvest moon dominating the night sky, paired with exactly ONE striking silhouette or atmospheric element crossing or framing it. Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe register — the kind of iconic moon shot anime Halloween episodes are famous for. Each entry 16-26 words. The moon itself is ALWAYS present and ALWAYS huge — vary only the ONE pairing element and the light quality.

━━━ SPAN ACROSS ALL ${n} (vary the pairing element — don't repeat the same one twice) ━━━
- A torii gate perfectly framing the glowing harvest moon behind it
- A line of witches on broomsticks silhouetted crossing the moon's face
- A murmuration of bats forming a fleeting shape across the moon
- Paper sky-lanterns rising in a slow drift toward the huge moon
- The moon doubled in reflection on a still shrine pond
- Bare gingko-tree branches cutting jagged silhouettes across the moon
- A pagoda roofline silhouetted sharp against the enormous rising moon
- Drifting cloud wisps veiling and revealing the moon in turns
- A shrine roof's curved eave pointing up toward the moon
- The moon rising huge and orange behind a bell-tower silhouette
- A trail of floating jack-o-lantern paper lanterns strung up toward the moon
- The moon framed between two towering stone lantern pillars
- A single owl in flight crossing dark against the moon's glow
- A gust of autumn leaves swirling upward, briefly veiling the moon
- Moonlight catching a curl of incense smoke rising from below
- A shrine's sacred rope (shimenawa) hanging in silhouette before the huge moon
- The moon reflected in a puddle at the base of stone festival steps
- A kite shaped like a bat gliding across the lower edge of the moon
- The moon rising directly behind a giant paper-lantern festival arch
- Wisps of ground mist glowing silver-blue under the moon's huge light

━━━ EXAMPLES (format/length target) ━━━
- "an enormous amber harvest moon rising directly behind a vermillion torii gate, perfectly framed inside its crossbeam, paper lanterns glowing warm below"
- "a colossal glowing harvest moon veiled and revealed by slow-drifting cloud wisps, a single owl crossing dark against its huge orange face"
- "the towering harvest moon doubled in mirror-still reflection on a shrine pond, bare gingko branches cutting jagged silhouettes across its glow"

━━━ RULES ━━━
The moon is ALWAYS the hero — oversized, warm amber-orange, dominating the composition. PLAYFUL and wondrous tone, never ominous or threatening. No readable text. No named anime characters or franchises. Keep each entry a distinct pairing element + light quality.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
