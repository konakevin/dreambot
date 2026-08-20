#!/usr/bin/env node
// AlphaBot — "Sky-World" dream candidate paths (sandbox, MVP-25 QA).
// Spun from Kevin's SAVED cloud-harbor + dream-orchard renders (2026-08-17):
// he loved the luminous painterly floating-dream-worlds with airships / balloons /
// gentle sky-magic. Four dedicated sibling paths, each a distinct HERO in that same
// beloved aesthetic. Anchored on the exact saved-render vocabulary (append, never
// paraphrase). Each = a SCENE pool (the hero dream-world) + a SKY pool (light/backdrop
// accent). No character — the WORLD is the hero. MVP-25 each; scale only after sign-off.
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/alphabot/seeds/';

(async () => {
  // ── lantern-sky ───────────────────────────────────────────────────────
  // HERO = the balloons/lanterns themselves, en masse, ascending (festival).
  await generatePool({
    outPath: DIR + 'alphabot_lantern_sky_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} LANTERN-SKY scenes for a dreamy wildcard art bot. Each is a breathtaking SKY FILLED with glowing hot-air balloons and drifting paper lanterns rising into a dream-dusk or dream-night — a great gentle ascension of light (a lucid, wondrous festival of the air). Each entry 20-32 words. The MASS of glowing balloons + lanterns IS the hero, not a harbor or docks.

━━━ ASCENSIONS (spread across all ${n}) ━━━
- hundreds of paper lanterns lifting off a mirror-calm lake at dusk, each doubled in the still water below
- a sky of jewel-toned hot-air balloons drifting over a patchwork valley at golden hour
- luminous paper-lantern balloons rising through a warm evening mist between cloud-islands
- glowing sky-lanterns streaming up a moonlit river canyon like a river of light in the air
- a festival of balloons of every color ascending over a dreaming village of warm-lit windows
- candle-lit paper moons and lanterns drifting up through a cherry-blossom night
- balloon envelopes glowing juniper, rose, and silver-green against a deep indigo twilight
- a lone great balloon among a thousand tiny lanterns rising over a snow-hushed meadow
- lanterns spiralling up a mountainside temple at night, reflected in terraced rice-water
- translucent jellyfish-lanterns bobbing up through a soft aurora over still black water
- hot-air balloons + paper lanterns rising past a giant low harvest moon
- a warm swarm of sky-lanterns lifting off a cloud-sea, cumulus glowing amber beneath

━━━ THE LOOK (anchor to the saved renders) ━━━
Luminous painterly dream-illustration, Ghibli-dreamy wonder, dreamy soft light, deep atmospheric depth. The balloons/lanterns are warm glowing lights against a deeper sky; real depth (a foreground handful large and close, receding to a haze of tiny distant glows); often a still water mirror below. Serene awe, gentle magic. NO steampunk grime, NO readable text, NO people as the subject (tiny distant figures at most).

━━━ RULES ━━━
NO brand/real names, NO readable text. Each entry a distinct ascension + a specific glowing detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_lantern_sky_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SKY-LIGHT snippets for the lantern-sky path — the sky/atmosphere the glowing balloons and lanterns rise into. Each 8-16 words. A single sky/light element.

Spread across: a molten-gold sunset deepening to rose; a deep indigo twilight with first stars; a giant low harvest moon haloed in mist; soft green-violet aurora ribbons; a milky-way band arcing overhead; a warm amber cloud-sea glowing below; drifting luminous mist; a scatter of falling stars; a violet dusk with a single bright wishing-star; pale pink dawn breaking on still water; a full moon mirrored in a black lake; slow-drifting stardust motes catching the lantern-glow.

Dreamy, luminous, soft (never harsh). NO text.

JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── sky-bazaar ────────────────────────────────────────────────────────
  // HERO = a serene floating MARKET with life/story (airships + dream-boats trading).
  await generatePool({
    outPath: DIR + 'alphabot_sky_bazaar_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SKY-BAZAAR scenes for a dreamy wildcard art bot. Each is a serene floating MARKET in the clouds — dream-airships and little sky-boats trading between cloud-islands, warm-lit stalls, gentle unhurried bustle (Laputa / Ghibli-sky register, cozy and alive, NOT steampunk-industrial). Each entry 20-32 words. The living floating market is the hero.

━━━ FLOATING MARKETS (spread across all ${n}) ━━━
- a cloud-island bazaar of striped-awning stalls, dream-airships unloading cargo at rose-quartz piers
- a floating spice-market at dusk, paper-lantern balloons strung between mast and stall
- little dream-boats with cream sails drifting stall to stall across a golden cloud-sea
- a sky-market of floating fruit-barges, teardrop lanterns glowing amber over the crowd
- a terraced cloud-village market, flower-sellers' stalls spilling blooms into open air
- an airship trading-post moored to a floating stone jetty, crates and balloon-ships tethered
- a moonlit night-market on a drifting cumulus, glowing jellyfish-lanterns above warm stalls
- a floating tea-harbor, sky-boats with billowing sails gliding between lantern-lit pontoons
- a bazaar of hot-air-balloon shops, each envelope a different jewel color above the stalls
- a cloud-island fish-market at dawn, sky-koi kites drifting over baskets of pearl-light
- a floating lantern-maker's quarter, paper moons hung to dry between the sky-cottages
- a harvest-market on a floating orchard-island, carts of glowing fruit rolling to the docks

━━━ THE LOOK (anchor to the saved renders) ━━━
Soft, luminous, Ghibli-dreamy — billowing clouds, warm lantern-light, gentle floating architecture. Wide establishing view with real depth (foreground stall/dock close, the market mid-ground, cloud-sea receding). Serene figures small and unhurried (tiny, never the subject). Wonder + cozy warmth. NO steampunk grime, NO readable text.

━━━ RULES ━━━
NO brand/real names, NO readable text. Each entry a distinct floating market + a specific dreamy detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_sky_bazaar_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SKY-LIGHT snippets for the sky-bazaar path — the light/atmosphere around a floating cloud-market. Each 8-16 words. A single light/cloud element.

Spread across: golden-hour sunbeams through towering cumulus; a soft pink dawn on the cloud-sea; a giant low sun at the horizon; drifting mist between islands; a rainbow arcing through cloud-banks; warm lantern-glow at dusk; a sea of clouds glowing amber below; fluffy cumulus towers catching light; a gentle sun-shower with a rainbow; twilight with the first stars; a full moon over a silver cloud-sea; sky-koi and birds silhouetted against the sun.

Soft, luminous, dreamy. NO text.

JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── sky-leviathans ────────────────────────────────────────────────────
  // HERO = the great gentle sky-creature (the beloved drifting-whale promoted).
  await generatePool({
    outPath: DIR + 'alphabot_sky_leviathans_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SKY-LEVIATHAN scenes for a dreamy wildcard art bot. Each has a GREAT GENTLE SKY-CREATURE drifting impossibly slow through a cloud-sea — a colossal whale, manta, koi, or jellyfish of the air, trailing luminous vapor — with tiny floating islands and little balloon-craft around it for scale. Each entry 20-32 words. The huge serene creature is the hero (awe + tenderness, never a monster).

━━━ SKY-BEASTS (spread across all ${n}) ━━━
- a great blue whale drifting through a golden cloud-sea, tiny balloon-ships circling like birds
- a colossal luminous manta gliding beneath a floating island, its shadow sweeping the clouds
- a constellation-whale of stars and soft glow swimming across a deep twilight sky
- an enormous koi of the air winding between cloud-banks at dawn, scales catching pink light
- a herd of small sky-whales drifting past a floating lighthouse, spouting luminous mist
- a giant translucent jellyfish-leviathan pulsing softly over a moonlit cloud-ocean
- a moss-and-flower-backed island-turtle swimming through the sky, a village on its shell
- a great whale breaching up through a sea of clouds into golden sunlight, vapor streaming
- a bioluminescent night-whale gliding over a sleeping cloud-village, windows glowing below
- a colossal serene sky-serpent coiling gently among floating garden-islands
- a mother whale and calf drifting past a warm-lit balloon at sunset
- a vast winged ray sailing under an aurora, tiny sky-boats trailing in its wake

━━━ THE LOOK (anchor to the saved renders) ━━━
Luminous painterly dream-illustration, Ghibli-dreamy wonder, dreamy soft light, deep atmospheric depth. The creature is COLOSSAL and gentle, drifting slow, trailing soft luminous vapor; real depth with cloud-sea receding; tiny balloon-craft / floating islands give scale. Serene awe. NO readable text, NO people as the subject (tiny distant figures at most).

━━━ RULES ━━━
NO brand/real names, NO readable text. Each entry a distinct sky-creature + a specific tender detail. The creature is calm and benevolent, NEVER threatening.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_sky_leviathans_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} SKY-LIGHT snippets for the sky-leviathans path — the sky/cloud-sea the great creature drifts through. Each 8-16 words. A single light/cloud element.

Spread across: a molten-gold sunset over a cloud-sea; a soft pink dawn between cumulus; a giant low moon behind the clouds; drifting luminous mist; soft green-violet aurora overhead; a milky-way band arcing behind; a warm amber cloud-ocean glowing below; towering cumulus catching light; a deep indigo starfield; twilight with the first stars; a sun-shower rainbow through the cloud-banks; slow-drifting stardust motes.

Dreamy, soft, luminous. NO text.

JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── dream-orchard ─────────────────────────────────────────────────────
  // HERO = the saved nocturne-orchard: glowing paper-moon / lantern-fruit gardens.
  await generatePool({
    outPath: DIR + 'alphabot_dream_orchard_scene.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} DREAM-ORCHARD scenes for a dreamy wildcard art bot. Each is a luminous night-garden or orchard where the fruit, blossoms, and hanging moons GLOW from within like lanterns — a lucid, tender dream-garden under a vast starry sky. Each entry 20-32 words. The glowing orchard/garden is the hero (serene awe, never scary).

━━━ GLOWING GARDENS (spread across all ${n}) ━━━
- an orchard of ancient gnarled trees where every apple glows warmly from within like a lantern
- a grove hung with glowing paper moons drifting on their strings over silver grass
- a night-garden where the flowers are softly glowing lanterns and the paths are scattered stars
- a wisteria arbor dripping luminous violet blossoms over a still mirror-pool of dew
- rows of pear-trees strung with teardrop fruit-lanterns in gradient amber-to-crimson
- a bioluminescent mushroom-ring circling a path of glowing pebbles under the milky-way
- a cherry orchard raining faintly glowing petals over a sleeping moonlit meadow
- a greenhouse of glass jars each holding a captured firefly-galaxy among the vines
- a terraced tea-garden where every lantern-blossom opens toward a giant low moon
- a pumpkin-patch of softly glowing gourds under an aurora, mist pooling between the vines
- a citrus grove where the fruit floats gently off the branches like little warm moons
- a moon-orchard mirrored perfectly in a black reflecting pond, doubled glow above and below

━━━ THE LOOK (anchor to the saved render) ━━━
Luminous jewel-toned nocturnal surrealism, painterly dream-illustration, deep atmospheric haze, dreamy catchlight glow throughout. Deep violet-cream sky deepening to blue-black velvet, rich impasto texture, soft vignette. The glow comes FROM the fruit/blossoms/moons. Serene awe, never horror. NO readable text, NO people as the subject.

━━━ RULES ━━━
NO brand/real names, NO readable text. Each entry a distinct glowing garden + a specific luminous detail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
  await generatePool({
    outPath: DIR + 'alphabot_dream_orchard_sky.json',
    total: 25,
    batch: 25,
    metaPrompt: (
      n
    ) => `Write ${n} NIGHT-SKY snippets for the dream-orchard path — the night sky/glow over a luminous dream-garden. Each 8-16 words. A single night-sky element.

Spread across: a vast milky-way band; shimmering green-and-violet aurora; a huge low full moon; a sky of falling stars; twin crescent moons; a nebula of soft rose-and-teal cloud; a single enormous bright star; drifting luminous mist; a ring of glowing planets low on the horizon; a starfield mirrored as if the sky were water; a moon-halo through thin cloud; slow-drifting fireflies rising into the stars.

Deep violet-cream, luminous, dreamy — never harsh. NO text.

JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
