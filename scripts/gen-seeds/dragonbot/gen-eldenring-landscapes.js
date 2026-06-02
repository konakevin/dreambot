#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/dragonbot/seeds/eldenring_landscapes.json',
  total: 25,
  batch: 12,
  metaPrompt: (
    n
  ) => `You are writing ${n} ELDEN-RING / DARK-SOULS-CODED LANDSCAPE entries for DragonBot's eldenring-landscape path. Each entry is a DENSE phrase (25-50 words) describing a SPECIFIC ICONIC FANTASY VISTA in the Hidetaka-Miyazaki / FromSoftware aesthetic tradition — Erdtree-glowing-tree-of-life dominating skyline, decaying-kingdom landscapes, Limgrave shadow-of-the-Erdtree pastoral plains, rotting Caelid red-wasteland, Mountaintops-of-the-Giants frozen peaks, Lake-of-Rot poisonous waters, ancient ruins under impossible skies, Anor-Londo gold-cathedral plateau, dragon-graveyard valleys.

CRITICAL — NO CHARACTERS, NO PEOPLE, NO TARNISHED, NO HEROES, NO ELDEN-LORDS-IN-FRAME. Pure landscape only (distant dragon silhouettes at scale OK).

CRITICAL — NO PROPER NOUNS. Never write "Elden Ring", "Dark Souls", "Tarnished", "Elden Lord", "Erdtree", "Limgrave", "Caelid", "Leyndell", "Stormveil", "Anor Londo", "Lordran", "Lothric", "Drangleic", "Yharnam", "Miyazaki", "FromSoftware", "Bloodborne" — describe the AESTHETIC generically. Use phrases like "vast glowing golden tree-of-life dominating the sky", "decaying ancient kingdom landscape", "rotting red-wasteland with crystallized blood-coral", "ancient gold-cathedral plateau".

━━━ AESTHETIC DNA ━━━

Capture the visual mood of Hidetaka-Miyazaki / FromSoftware concept-art tradition. EVERY entry feels MELANCHOLIC, ANCIENT, BEAUTIFUL-and-DOOMED. Dramatic painted-gold or dim-grey-and-decay color palettes. Ruins everywhere — broken pillars half-buried, ancient roads leading nowhere, fallen kingdoms swallowed by nature. Skies are GIANT and CINEMATIC — single golden tree dominating skyline, blood-red moon, impossible auroras, endless overcast melancholy. Mood is gothic-fantasy-dread-and-awe.

━━━ LANDSCAPE CATEGORIES (variety across ${n}) ━━━

ERDTREE / GOLDEN-TREE-OF-LIFE VISTAS (~4):
- distant golden-glowing tree-of-life kilometer-tall dominating the skyline, golden leaves drifting, ancient pastoral landscape below
- vast field with single colossal golden tree pulsing with internal light at the horizon, dramatic painted-gold sunset
- ruined plain with massive glowing-gold tree visible through atmospheric haze, broken pillars in foreground, melancholic mood
- twilight grass-plain stretching to a glowing golden-tree on the horizon, ruins of an ancient kingdom scattered below

PASTORAL DECAYING-KINGDOM LANDSCAPES (~3):
- rolling green hills with ruined castle-fortress in the distance, ancient road winding through, atmospheric haze
- pastoral plain with broken-pillar ruins half-buried in the grass, distant fortress silhouette, melancholic painted-gold light
- decaying countryside with ancient stone bridges over abandoned roads, mist drifting, distant ruined keep

ROTTING-CAELID RED-WASTELANDS (~3):
- vast crimson-rotting wasteland with crystallized blood-coral formations, dead-trees twisted, distant rotting fortress
- ruined red-wasteland with scarlet earth, twisted blood-trees, atmospheric blood-mist, doomed mood
- rotting red-flesh terrain with massive scarlet-pustule formations, dead birds frozen in the air, oppressive crimson sky

MOUNTAINTOPS / FROZEN-PEAK VISTAS (~3):
- mountaintop plateau under perpetual snow with massive ancient runed-stone monoliths jutting through, frozen mood
- frozen mountain pass with ancient stone-pillars half-buried in snow, blood-moon overhead, painted-gold gloom
- frozen peak with ruined ancient throne carved into the mountain, snow drifting, distant aurora

LAKE-OF-ROT / POISONOUS-WATERS (~2):
- vast poisoned lake with bubbling crystalline-rot waters, distant ruined tower rising from the lake, sickly-green ambient
- poisonous swamp-lake with rot-coated trees, atmospheric vapor, ruined statues half-submerged

ANOR-LONDO-CODED CITY-CATHEDRAL ON CLIFFS (~3):
- distant gold-cathedral city perched on a clifftop, twin moons rising behind, atmospheric scale, melancholic dread
- ancient gold-spire city carved into mountain cliffs, distant view through atmospheric haze, broken-bridge approach
- decaying gold-and-white cathedral-fortress city silhouette against painted-gold sky, ruined approach in foreground

DRAGON-GRAVEYARD VALLEYS (~2):
- vast valley scattered with colossal ancient dragon skeletons half-buried in earth, twilight ambient, doomed mood
- dragon-bone-cliff with massive skull peeking from rock, atmospheric haze, distant ruined arch-bridge

ANCIENT RUINS UNDER IMPOSSIBLE SKIES (~3):
- ancient ruined plaza with broken-pillar architecture, sky filled with twin moons and impossible aurora, melancholic mood
- decaying ruined temple-court with broken statues, sky bursting with golden meteor-rain, doomed-and-beautiful
- ancient stepped-pyramid ruin in a misty valley, sky filled with shifting golden-and-violet aurora, atmospheric depth

NIGHTMARE / VOID PLATEAUS (~2):
- ancient void-plateau where reality thins, broken architecture floating in impossible orientations, dimensional dread
- nightmare-realm where the ground spirals impossibly, ruined cathedrals jutting at wrong angles, sickly cosmic-glow

━━━ RULES ━━━
- 25-50 words each — dense, paintable
- NO characters / NO Tarnished / NO heroes / NO foreground figures
- NO franchise proper nouns
- HIDETAKA-MIYAZAKI / FROMSOFTWARE painted concept-art mood — MELANCHOLIC, ANCIENT, BEAUTIFUL-and-DOOMED
- Variety across the 9 categories above mandatory
- Color palette: painted-gold + dim-grey + crimson-rot + atmospheric overcast
- Cinematic mythological scale, dramatic skies, ruins everywhere

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
