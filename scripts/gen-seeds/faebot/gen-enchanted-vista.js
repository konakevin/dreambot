#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/faebot/seeds/enchanted_vista.json',
  total: 25,
  batch: 25,
  maxTokens: 4000,
  metaPrompt: (n) => `Write ${n} unified scene descriptions of LUSH ENCHANTED FOREST VISTAS for FaeBot's enchanted-vista path — NO figures, NO creatures in the foreground, JUST the forest itself rendered LUSH and BEAUTIFUL with subtle hints of fairy magic woven everywhere. The "you walked into a glade and stopped breathing" energy. Painterly-realistic rendering matching FaeBot's same-world aesthetic (dryad-portrait + tiny-fae + fairy-court). Each entry feeds a Flux concept-art prompt-writer.

Each entry: 35-55 words, woven as ONE paragraph (not a field list).

━━━ THE WORLD (must match other FaeBot paths) ━━━
Same painterly enchanted-forest world as dryad-portrait. Brian Froud + Charles Vess + fantasy-novel-cover lineage. The other paths show the INHABITANTS of this forest. THIS path shows the FOREST ITSELF — empty of figures but UNMISTAKABLY ENCHANTED. Magic everywhere in subtle atmospheric details. The fae are nearby but unseen.

━━━ NO FIGURES — PURE FOREST ━━━
This path renders SCENE-ONLY. NO fae, NO dryads, NO nymphs, NO humans, NO creatures as focal subjects. The FOREST is the only subject. Distant ambient creatures (a fawn glimpsed through far trees, a robin on a distant branch) are FINE but never focal. The point of every render is to be a stop-and-stare forest painting where the LANDSCAPE itself is the masterpiece.

━━━ NON-NEGOTIABLE — OVER THE TOP. HEAVEN-TIER. NO RESTRAINT ━━━
This is AI art. THE POINT IS OVER THE TOP. The user should feel like they DIED AND ENTERED HEAVEN looking at the painting — Elysium, the afterlife garden, the most divine impossible forest paradise ever painted. Eden if Eden was a fae forest. NEVER restrained, NEVER subtle, NEVER tasteful-quiet. CRANK EVERYTHING TO 11.

Greg Rutkowski / Edmund Dulac / Arthur Rackham / Frazetta-fantasy-cover at its absolute most cinematic, most impossible, most BREATHTAKING. Multiple light sources, bioluminescent EVERYTHING, magical particles thick in the air, surreal saturated color, layered effects — ALL stacked into every frame.

Layer the description with ALL of these:

A) MULTIPLE LIGHT SOURCES STACKED (mandatory — TWO OR MORE per render):
Combine: "massive god-rays piercing through canopy" + "bioluminescent moss glowing from below" / "golden hour saturating the trees" + "moonlight already breaking through clouds in the same scene" / "phosphorescent mushrooms casting upward light" + "fireflies thick as a blizzard" + "glowing pollen everywhere" / "sun-shaft from above" + "foxfire glowing along every fallen log" + "luminous wildflowers casting their own light upward". Layer 2-4 light sources per frame. Heaven-tier means MULTIPLE GLOWING THINGS not one nice light.

B) FOREGROUND TACTILE LUSH-DENSITY (mandatory): the foreground is ALIVE with specific micro-detail — dewdrops glistening on every fern-frond / luminous mushrooms breaking through emerald moss / individual leaves sharp and translucent in light / bracken curling against moss-boulders / dense bluebell-carpet to the lens / wildflowers in detail / flickering catkin-wisps

C) AT LEAST 5 PLANT SPECIES VISIBLE (mandatory): ferns, mosses, bluebells, foxgloves, ivy, wisteria, heather, thyme, lily-of-the-valley, clover, bracken, rowan-berries, woodruff, violets, jasmine, woodland-anemones, primrose, columbine — pick five at minimum, name them specifically

D) WATER ELEMENT (mandatory): mossy stream / cascading waterfall / hidden grove-pool / dewdrops everywhere / mist coiling on water / glistening rivulets carving through moss / a still moonlit tarn

E) AWE-COMPOSITIONAL ELEMENT (mandatory) — what makes THIS painting breathtaking:
"a massive thousand-year oak with a hollow throne in its trunk dwarfing the scene", "a deep moss-walled canyon-grove with a single shaft of light reaching the bottom", "an impossibly-tall cathedral of redwoods with the canopy hundreds of feet up", "a hidden valley revealed through parted bracken showing a glowing meadow beyond", "a bioluminescent night-grove with phosphorescent moss carpeting everything", "a frosted dawn forest where every twig is rimed in glittering ice catching first sun", "a tiered waterfall cascade with seven levels of moss-pools", "a sunken grove sunken below ground level with vines spilling over the rim"

F) SENSORY TEXTURE (mandatory 5+): mossy boulders, twisted ancient roots like sleeping dragons, hanging vines and curtain-moss, lichen-crusted fallen logs, mushroom-rings of red toadstools, flowering brambles, peeling silver birch-bark, fern-grottoes, dripping ferns, knotted oak-burls

G) FAIRY-MAGIC PARTICLES THICK IN THE FRAME (mandatory 6+ ALL VISIBLE AT ONCE — not subtle, dense):
- SPARKLES IN THE AIR (mandatory) — thick visible sparkles / glitter / shimmer-particles drifting through every shaft of light, catching every color
- WILDFLOWER ACCENTS (mandatory) — clusters of vivid wildflowers (foxgloves, bluebells, lily-of-the-valley, primrose, woodland-anemones, columbine, wild violets, jasmine, woodruff, queen-anne's-lace, columbine, snowdrops) bursting in foreground AND midground AND background — every layer of the painting accented with flowers
- Swarms of drifting fireflies thick as a blizzard
- Glowing pollen-motes filling every sun-shaft like floating gold
- Phosphorescent mushrooms in clusters casting strong colored light
- Bioluminescent moss carpeting roots and stones casting upward glow
- Will-o-wisps drifting in scattered constellations through the grove
- Golden sparkle-trails and shimmer-dust everywhere
- Foxfire glowing strong cyan/teal along every fallen log
- Luminous wildflowers casting their own internal glow
- Floating wisp-orbs of multiple colors throughout the depth
- Rainbow-flecks of pollen-dust thick in the air
- Magical mist coiling unnaturally with internal luminescence
- Tiny luminous butterflies / dragonflies / flying motes
- Light-cascading water that glows as it falls

H) IMPOSSIBLE-PARADISE CHEAT-CODES (use 1-2 per render — the heaven-tier flourishes that push it OVER THE TOP):
"a single shaft of light pouring through canopy is so thick it looks like falling gold dust", "the entire grove is bathed in a soft golden glow that has no source", "the air itself shimmers with magic-haze that catches every color", "the canopy filters light into seven distinct colored beams hitting the moss-floor", "every leaf has its own faint internal luminescence", "the forest is glowing from below as much as from above", "petals of impossible flowers fall in slow-motion through the entire frame", "the mist is alive with floating motes of magic"

━━━ NON-NEGOTIABLE — SUBTLE FAIRY-MAGIC HINTS WOVEN IN ━━━
Each entry MUST include 3-4 of these magical-atmosphere elements (subtle, not overwhelming):
- "drifting fireflies in slow constellation"
- "glowing pollen-motes catching sun-shafts"
- "phosphorescent mushrooms pulsing softly green"
- "bioluminescent moss casting pale light on the bark"
- "tiny will-o-wisps hovering between trees"
- "golden sparkle-trails in the air where unseen fae passed"
- "foxfire glowing pale cyan on a fallen log"
- "dewdrops on every fern-frond catching impossible light"
- "a glowing mushroom-circle with soft amber halo"
- "translucent shimmer in the air like aurora"
- "a single floating wisp-orb drifting in the distance"
- "rainbow-flecks of pollen-dust hanging in still air"
- "magical mist coiling unnaturally around a sacred stone"
- "tiny luminous flowers blooming where no flower should grow"

━━━ COMPOSITION TYPES (rotate) ━━━
- Misty grove with massive ancient oaks and twisted roots
- Sun-shafted clearing carpeted in bluebells
- Mossy stream winding through fern-grotto
- Waterfall over moss-covered cliff with sun-rays through spray
- Twilight wood with floating glowing pollen
- Hidden hollow under wisteria archway
- Birch-grove with dappled gold light and silvery bark
- Massive fallen-log bridge over moonlit pond
- Mushroom-fairy-circle in moss clearing at dusk
- Cathedral of tall pines with shafts of god-rays
- Bramble-tunnel of blackberry vines opening to sunlit meadow
- Frosted winter forest with low warm light
- Apple-blossom orchard at dawn with petals on the air
- Hidden pool ringed by ferns and willows at golden hour
- Ancient redwood grove with shafts of light pouring through canopy
- Mossy boulder-strewn glen with little hidden waterfalls
- Fern-grotto cave-mouth opening to a sunlit meadow beyond

━━━ EXAMPLE OUTPUTS (PURE FOREST — no figures, MAX LUSH) ━━━
"A sun-cathedral of towering thousand-year oaks at golden hour, massive shafts of god-rays piercing through ancient canopy onto a forest-floor thick with emerald moss, dense foxgloves, bluebells, and bracken — twisted gnarled roots like sleeping dragons dwarfing the foreground, atmospheric haze fading into deep grove — golden pollen-motes thick in the beams, drifting fireflies in slow constellation, phosphorescent mushrooms pulsing pale green between roots, foxfire glowing cyan along bark, a glowing mushroom-circle visible deep in the grove."

"A breathtaking tiered waterfall over moss-covered boulders into a hidden grove-pool at twilight, dewdrops glistening on every fern-frond, mossy stones with luminous mushrooms breaking through, lily-of-the-valley and woodland-anemones carpeting foreground, lichen-crusted fallen log bridges the pool, atmospheric blue haze rising into the deep grove — drifting will-o-wisps between tree-shadows, foxfire glowing cyan along bark, glowing pollen catching last light, magical mist coiling on the water."

"A wisteria-cathedral archway at blue hour with cascading violet clusters above a moss-grown path, blanket of woodruff, lily-of-the-valley, and bluebells in foreground sharpness, ancient peeling-bark trunks dwarfing the scene fading into luminous fog beyond, drooping fern-fronds curtain the path — drifting luminous pollen, tiny will-o-wisps in slow constellation, foxfire pulsing along the wisteria-vines, rainbow-flecks of dewdrop-shimmer on every petal."

"A breathtaking redwood cathedral at dawn with massive shafts of golden first-light cutting through impossibly-tall canopy, ground thick with rust-red needle carpet, emerald moss, foxgloves, and bracken in foreground, individual leaves catching light, ancient peeling redwood trunks dwarfing the entire frame fading into mist — rainbow-flecks of pollen in the beams, drifting fireflies even at this hour, glowing pollen catching first sun, luminous wildflowers blooming where no flower should grow."

"A hidden grove-pool ringed by weeping willows at golden hour, dewdrops glistening on every drooping leaf, lily-pads with tiny luminous flowers floating on dark water, mossy boulders rising from the surface with ferns and woodland-violets clinging to their faces, atmospheric haze beyond the willow-fringe — drifting fireflies above water, foxfire glowing along willow-bark, golden pollen catching low gold light, magical mist coiling unnaturally above the surface."

"A bioluminescent night-grove of ancient hazel trees at moonrise, ground carpeted with phosphorescent moss casting pale green light upward onto twisted trunks, foxgloves and woodruff blooming in clusters, fallen lichen-crusted logs glowing along their length, dripping ferns silhouetted against the luminous moss — drifting will-o-wisps in slow constellation, foxfire pulsing cyan, floating wisp-orbs in the deep grove, magical mist coiling between trunks."

"A frosted dawn forest where every twig is rimed in glittering ice catching first golden sun, ancient birches with peeling silver bark, ground thick with frosted ferns, primrose breaking through snow-dusted moss, dewdrops crystallized on every surface, atmospheric blue-pink haze — rainbow-flecks of pollen catching first light, drifting fireflies even in cold air, glowing pollen catching sunbeams, a small distant fawn glimpsed through trees adding scale."

━━━ AVOID ━━━
- ANY humanoid figure (no fae / no dryad / no nymph / no human at all). Distant ambient animals only.
- "Standing stones" / "stone circles" / "weathered stones" / "sacred stones" / "tomb" / "gravestone" — grave triggers, banned vocabulary
- Built architecture (no fences / no signs / no lamps / no buildings / no cemeteries)
- Cartoon / chibi / Disney rendering
- Photographic / digital / 3D / CGI descriptors
- Modern objects
- Violent / scared / edgy moods / spooky-haunted-graveyard mood
- Generic vague descriptions
- Sparse / minimal / spare / restrained descriptions — the painting must FEEL OVER-THE-TOP, IMPOSSIBLE-BEAUTIFUL, OVERFLOWING with magic and detail
- "Subtle" / "soft" / "gentle" / "quiet" / "peaceful" — language that downscales the magic. We want OPULENT / THICK / DENSE / SATURATED / OTHERWORLDLY / IMPOSSIBLE / TRANSCENDENT

━━━ OUTPUT ━━━
Output ONLY a valid JSON array of ${n} strings. Each string is one complete vista description (35-55 words). No preamble, no commentary, no markdown code fences.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
