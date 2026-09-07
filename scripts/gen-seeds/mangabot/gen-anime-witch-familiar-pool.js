#!/usr/bin/env node
// AlphaBot candidate — anime-witch-familiar (destination: MangaBot).
// An anime witch-and-familiar duo mid-flight on a broomstick over a moonlit
// Halloween town, magical-girl-adjacent register, wind-swept cape/hair.
// Six MVP-25 pools (the 7th axis, camera_framing, is a short inline fixed
// list in the path file — no generated pool needed):
//   - witch:       the witch herself (role/archetype + ethnicity + hair/eyes
//                   + magical-girl-adjacent witch fashion)
//   - familiar:    the non-human animal familiar riding along
//                   (banHumanLanguage:true — must never read as a person)
//   - broom_trail: MONEY SHOT — the magical effect trailing off the broom
//   - town:        the Halloween-lit town glimpsed below/around them
//   - sky:         the night-sky backdrop
//   - whimsy:      one small optional (~40% at runtime) extra playful beat
//
// Modeled on scripts/gen-seeds/alphabot/gen-anime-halloween-festival.js (the
// sibling MangaBot-destined candidate).
// Run: node scripts/gen-seeds/alphabot/gen-anime-witch-familiar-pool.js
const { generatePool } = require('../../lib/seedGenHelper');

const DIR = 'scripts/bots/mangabot/seeds/';

(async () => {
  // ── witch ────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'anime_witch_familiar_witch.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} WITCH entries for an anime witch-and-familiar Halloween candidate path (destination: MangaBot, a hand-drawn Japanese anime bot). Each entry describes ONE anime witch character in a Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe register, magical-girl-adjacent (Sailor-Moon / Precure / Kiki's-Delivery-Service silhouette energy) — NOT a scary or evil witch, a wondrous storybook one. Each entry combines: a role/archetype (never a named character), an ethnicity, one hair/eye anime detail, and a flowing magical-girl-adjacent witch outfit (cloak/dress, ribbon or brooch trims, stockings). Each entry 22-34 words, ONE flowing description. This is an ordinary human anime cast (like mangabot's own magical-girl path) so ethnicity + age/gender words are CORRECT and expected here.

━━━ SPAN ACROSS ALL ${n} (mix freely — don't repeat combinations) ━━━
Roles/archetypes: hedge-witch apprentice, coven heir, star-gazing witch, potion-shop witch, traveling witch, witch-in-training, village witch, forest witch, star-charm witch, weather witch, garden witch, candle witch, moonlight witch, dream witch, harvest witch, storm-chasing witch, library witch, orchard witch, lantern witch, chimney-sweep witch.

Ethnicities (broad global range): Japanese, Korean, Chinese, Filipino, Vietnamese, Thai, Indian, mixed-heritage, Mexican, Brazilian, Nigerian, Ethiopian, American, British, French, Italian, Scandinavian, Irish, Polish, Native American.

Magical-girl-adjacent witch fashion: a flowing plum or midnight-purple cloak, a pleated Halloween-orange or black skirt, ribbon trims at the collar or sleeves, a jeweled brooch or star-shaped pendant, thigh-high striped stockings, a corseted bodice with puffed sleeves, a lace-trimmed cape, a cinched sash with dangling charms. Roughly HALF the entries include a small pointed witch hat (clipped at a jaunty angle, tilted, or tucked under an arm) — the OTHER half have NO hat at all (bare-headed, hair as the focal point instead) — do not make the hat universal.

━━━ EXAMPLES (format/length target) ━━━
- "a hedge-witch apprentice of Japanese descent, long raven-black hair loose from a half-braid, warm amber eyes narrowed in concentration, a flowing plum cloak over a pleated orange skirt, a small pointed hat clipped at a jaunty angle"
- "a star-gazing witch of Scandinavian descent, silver-blonde hair in a high ponytail, pale blue eyes, a corseted midnight-purple bodice with puffed sleeves and a star-charm pendant, no hat, hair the focal point"
- "a traveling witch of Nigerian descent, tight coils pulled into twin buns, deep brown eyes bright with mischief, a lace-trimmed black cape over striped thigh-high stockings, a tiny star-shaped hat tilted back"

━━━ RULES ━━━
Described by ROLE ONLY — never a named anime character, never a real franchise reference (no Sailor Moon, no Kiki, no Harry Potter). WONDROUS and PLAYFUL, never sinister, never an "evil witch" trope — warm expression, never a scowl or menace. No genuinely scary imagery (no warts, no green skin, no cackling). Keep hat presence to roughly half the entries as instructed above.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── familiar (banHumanLanguage — must always read as a real animal) ────
  await generatePool({
    outPath: DIR + 'anime_witch_familiar_familiar.json',
    total: 120,
    batch: 25,
    append: true,
    banHumanLanguage: true,
    metaPrompt: (
      n
    ) => `Write ${n} FAMILIAR entries for an anime witch-and-familiar Halloween candidate path (destination: MangaBot). Each entry describes ONE small animal familiar riding along on its witch's broomstick as they fly. This is ALWAYS a real, affirmatively non-human ANIMAL — never a person, never a costumed human, never a toy. Each entry combines: the specific animal species, one distinguishing magical or anime-cute visual trait, and HOW it rides along (perched on the handle, curled in the crook of an arm, gripping the tail bristles, hovering just alongside on its own tiny broom), plus how the wind of flight catches its fur/feathers/tail. Each entry 20-32 words.

━━━ SPAN ACROSS ALL ${n} (vary the species — don't repeat the same one twice) ━━━
Species: black cat, orange tabby cat, snowy owl, screech owl, raven, crow, red fox, silver fox, fruit bat, toad, tree frog, ferret, hedgehog, field mouse, salamander, moth, barn owl, jackdaw, weasel, flying squirrel.

Magical/anime-cute traits (vary): luminous glowing eyes, a tiny star-shaped marking, a small witch-collar with a bell, a faint magical shimmer along the fur, a wisp of sparkle trailing from the tail, a jeweled tiny collar charm, softly glowing whiskers, feathers tipped with faint violet light.

Riding poses (vary): perched confidently on the broom handle just ahead of the hands, curled snugly in the crook of an arm, gripping the tail bristles with both front paws, tucked inside an open cloak pocket with just its head poking out, hovering just alongside on a matching miniature broom of its own, riding on a shoulder with tail or wings wrapped for balance.

━━━ EXAMPLES (format/length target) ━━━
- "a sleek black cat with luminous golden eyes and a small silver bell on a witch's-collar, perched confidently on the broom handle just ahead of the hands, tail streaming out flat in the wind"
- "a round snowy owl with faintly glowing violet-tipped feathers, gripping the tail bristles with both talons, wings half-spread for balance as the wind ruffles every feather"
- "a plump orange fox familiar with a tiny star-shaped marking on its forehead, curled snugly in the crook of an arm, bushy tail whipping out behind like a second cape"

━━━ RULES ━━━
The familiar must ALWAYS read unmistakably as a real animal creature — never a person, never a human in a costume, never a plush toy. No age words, no man/woman/boy/girl language (this pool is filtered to reject those). PLAYFUL and endearing, never sinister (no genuinely creepy spiders or rats). Every entry names the wind's effect on its fur/feathers/tail.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── broom_trail (MONEY SHOT) ────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'anime_witch_familiar_broom_trail.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} MONEY-SHOT "broom trail" entries for an anime witch-and-familiar Halloween candidate path (destination: MangaBot). Each entry describes the single signature hero detail this entire path is built around: the specific magical effect trailing off the broomstick's bristles as the witch and her familiar fly. Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe register — the kind of iconic magic-trail shot anime flight scenes are famous for. Each entry 16-28 words. Vary ONLY the trail's material/effect and its color — the trail is ALWAYS present and ALWAYS clearly visible streaming behind the broom.

━━━ SPAN ACROSS ALL ${n} (vary the trail effect — don't repeat the same one twice) ━━━
- A ribbon of glowing violet sparks spiraling off the bristles, dissolving into drifting star-motes
- A swirl of caught autumn leaves spinning gold and orange in the broom's magic wake
- A cascade of tiny pumpkin-orange embers peeling off the broomstick like a comet's tail
- A stream of pale moonlit runes unspooling behind the bristles, fading letter by letter
- A trail of candy-corn-colored confetti sparkle spiraling off the broom's tip
- A drift of glowing fireflies pulled into the broom's wake, pulsing gently as they trail
- A ribbon of shimmering silver stardust unfurling in a slow spiral behind the bristles
- A comet-tail of soft amber light streaming straight back from the broom's end
- A swirl of tiny glowing jack-o-lantern sparks scattering off the bristles like fireflies
- A trail of luminous purple mist curling and dissipating slowly in the wake
- A spiral of small paper-lantern-orange light motes trailing off like a kite's ribbon
- A stream of pale green witch-fire licking gently along the broom's tail bristles
- A cascade of tiny glowing bats made of pure light, peeling off and fading
- A ribbon of frost-white sparkle that leaves faint glowing footprints of light in the air
- A trail of softly glowing autumn-gold pollen shaken loose with every gust
- A spiral of tiny star-shaped light fragments spinning off the bristles like glitter
- A stream of warm candlelight-colored motes drifting upward off the broom's tail
- A ribbon of pale lavender aurora-light rippling and trailing behind the bristles
- A cascade of glowing maple-leaf shapes made of light, tumbling off the broom's wake
- A trail of tiny spinning pinwheel sparks in orange and violet, scattering as they fade

━━━ EXAMPLES (format/length target) ━━━
- "a ribbon of glowing violet sparks spiraling off the broom's bristles, dissolving slowly into a trail of drifting star-motes behind them"
- "a cascade of tiny pumpkin-orange embers peeling off the broomstick's tail like a comet, fading to soft glowing ash in the dark"
- "a spiral of frost-white sparkle unfurling behind the bristles, each glimmer briefly hanging in the air like a tiny star"

━━━ RULES ━━━
The trail is ALWAYS the most eye-catching element streaming visibly off the broom — never faint, never absent. PLAYFUL and wondrous, never ominous. No readable text. No named anime characters or franchises.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── town ────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'anime_witch_familiar_town.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} TOWN entries for an anime witch-and-familiar Halloween candidate path (destination: MangaBot). Each entry describes the Halloween-lit town glimpsed below/around a witch and her familiar as they fly overhead on a broomstick at night. Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe register — cozy, festive, storybook Halloween, the kind of town Kiki's Delivery Service would fly over. Each entry 22-36 words. IMPORTANT: no graveyard, tombstone, or cemetery imagery anywhere — keep this warm and festive, not eerie.

━━━ SPAN ACROSS ALL ${n} (vary the town type — don't repeat the same one twice) ━━━
- A cobblestone town square strung with paper-lantern garlands around a glowing harvest-decorated fountain
- Tiled rooftops crowded with glowing jack-o-lanterns on every windowsill, chimneys trailing thin smoke curls
- A candlelit high street lined with gabled shopfronts, pumpkin displays stacked in every window
- A hillside village terraced with stone cottages, warm golden windows against dark slate roofs
- An orchard-ringed town edge, rows of bare apple trees strung with tiny lantern lights
- A canal town with lantern-lit bridges rippling in reflection on black water below
- A lighthouse village clustered along a curving harbor, small boats lit with orange lanterns
- A market square mid-harvest-fair, striped stall awnings ringed around a giant pumpkin centerpiece
- A cluster of gabled rooftops around a clocktower strung with string-lights for the season
- A riverside town with lantern-strung footbridges and warm windows doubled in the water
- A hilltop windmill town, its blades silhouetted and ringed with small hanging lanterns
- A cozy harbor town with fishing boats strung end to end with pumpkin-lights
- A patchwork of terraced rooftop gardens glowing with small jack-o-lantern lights
- A town bell-tower plaza strung with garlands of orange and black bunting
- A quiet residential street where every porch has a carved pumpkin glowing on the step
- A hillside terrace of vineyard cottages strung with lantern lights for the harvest
- A stone-bridge crossing over a mill-town river, waterwheel turning slow below
- A cluster of candy-shop-lit rooftops on a town's main square, warm light spilling out
- A cobbled plaza with a central well decorated in autumn garlands and pumpkin lanterns
- A seaside boardwalk town strung end to end with small glowing paper lanterns

━━━ EXAMPLES (format/length target) ━━━
- "a cobblestone town square strung with paper-lantern garlands, a glowing harvest-decorated fountain at its center, warm light spilling from every shop window ringing the square"
- "tiled rooftops crowded edge to edge with glowing jack-o-lanterns on every windowsill, thin curls of chimney smoke drifting up into the night air"
- "a hillside village terraced with stone cottages, warm golden window-light against dark slate roofs, a single lantern-strung path winding up between them"

━━━ RULES ━━━
Cozy, warm, unmistakably Halloween (jack-o-lanterns, lanterns, autumn harvest decor) but NEVER a graveyard, tombstone, or cemetery — this town is festive, not eerie. No readable text/signage spelled out. No named places or franchises.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── sky ─────────────────────────────────────────────────────────────
  await generatePool({
    outPath: DIR + 'anime_witch_familiar_sky.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} SKY entries for an anime witch-and-familiar Halloween candidate path (destination: MangaBot). Each entry describes the night-sky backdrop behind/around a witch and her familiar as they fly on a broomstick over a Halloween town. Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe register. Each entry 16-28 words.

━━━ SPAN ACROSS ALL ${n} (vary the sky element — don't repeat the same one twice) ━━━
- An enormous full harvest moon rising huge and amber directly ahead of them
- A loose river of stars smeared across a deep indigo sky, wisps of cloud drifting past
- A scatter of bats wheeling in a distant loose formation against the darkening sky
- Thin veils of cloud glowing silver-white at the edges where the moon backlights them
- A single shooting star streaking low across the horizon just behind them
- A faint aurora-like ribbon of violet and green shimmering low along the horizon
- A scatter of paper sky-lanterns drifting slowly up from the town far below
- A swirl of high thin clouds catching the last deep blue of dusk
- A dense field of stars sharpening as the last color drains from the horizon
- A crescent moon low and bright, a single star burning close beside it
- A blanket of soft cloud far below, moonlight silvering its rolling top
- A wide bank of stormcloud on the far horizon lit faintly by heat-lightning
- A scatter of migrating geese silhouetted in a distant V against the moon
- A hazy ring of light circling the moon through thin high cloud
- A trail of high, wispy mare's-tail clouds combed out by the wind
- A deep gradient of dusk-purple fading into full star-scattered black overhead
- A single owl crossing far off, tiny and dark against the huge moon
- A soft veil of ground-mist glowing faintly silver-blue far beneath the clouds
- A scatter of distant fireflies rising off the treetops far below into the dark
- The last warm band of sunset clinging to the horizon under a rising moon

━━━ EXAMPLES (format/length target) ━━━
- "an enormous full harvest moon rising huge and amber directly ahead of them, its light spilling in a long path across scattered clouds"
- "a loose river of stars smeared across the deep indigo sky, thin wisps of cloud drifting slowly past the crescent moon"
- "a scatter of bats wheeling in a distant loose formation, small and dark against the huge glowing moon behind them"

━━━ RULES ━━━
Wondrous and atmospheric, never ominous or threatening. No readable text. No named characters or franchises. Keep each entry a distinct sky element + light quality.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });

  // ── whimsy (optional ~40% at runtime) ──────────────────────────────
  await generatePool({
    outPath: DIR + 'anime_witch_familiar_whimsy.json',
    total: 120,
    batch: 25,
    append: true,
    metaPrompt: (
      n
    ) => `Write ${n} WHIMSY entries for an anime witch-and-familiar Halloween candidate path (destination: MangaBot). Each entry describes ONE small, extra playful Halloween beat glimpsed below or around a witch and her familiar as they fly over a town on a broomstick — a tiny bonus detail that adds charm without becoming the focus. Studio Ghibli / Makoto Shinkai / Kyoto Animation keyframe register. Each entry 16-28 words.

━━━ SPAN ACROSS ALL ${n} (vary the beat — don't repeat the same one twice) ━━━
- A cluster of trick-or-treaters below, lantern-pails swinging, waving up at the passing witch
- A friendly ghost peeking out from a chimney top, waving a translucent hand
- A black cat silhouette watching intently from a rooftop peak as they pass overhead
- A scarecrow in a town garden tipping its hat as if greeting them
- A second, distant witch silhouette crossing far below near the rooftops
- A string of paper bats strung between two lampposts fluttering in their wind-wake
- Carved pumpkins lined up glowing along a windowsill row, faces grinning up at the sky
- An owl perched on a weathervane turning its head to watch them fly past
- A dog in the street below barking happily up at the passing shadow
- Children pressed to a window, pointing excitedly up at the silhouette crossing the moon
- A vendor's cart of candied apples glowing warm under a single string-light below
- A cat weaving between pumpkins on a porch, pausing to look up as they pass
- A weathervane shaped like a bat spinning slowly in the wind of their passing
- A row of paper ghosts on a porch line swaying gently as the wind reaches them
- A lone lantern left burning on a garden gatepost, its flame flickering in their wake
- A rooftop cat perched beside a chimney, tail flicking as it tracks them overhead
- A child's kite shaped like a bat caught in a tree, still fluttering below
- A pair of owls calling to each other from opposite rooftops as the duo passes
- A porch swing rocking gently on its own in the gust left behind them
- A stray puff of chimney smoke curling into a brief ghost-like shape as they pass

━━━ EXAMPLES (format/length target) ━━━
- "a cluster of trick-or-treaters far below, lantern-pails swinging as they walk, one small figure pausing to wave up at the passing witch"
- "a friendly ghost peeking out from a chimney top, waving a translucent hand as the duo sweeps past overhead"
- "a black cat silhouette perched at a rooftop peak, watching intently as the broom and its riders pass low overhead"

━━━ RULES ━━━
Small and PLAYFUL — a background charm detail, never the main subject, never crowding out the witch/familiar/broom-trail. Warm and friendly, never eerie. No readable text. No named characters or franchises.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
  });
})().catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
