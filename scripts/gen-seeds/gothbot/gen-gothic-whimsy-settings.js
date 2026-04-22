#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');

const TOTAL = process.argv.includes('--dry') ? 12 : 200;

generatePool({
  outPath: process.argv.includes('--dry')
    ? '/tmp/gothic-whimsy-settings-dryrun.json'
    : 'scripts/bots/gothbot/seeds/gothic_whimsy_settings.json',
  total: TOTAL,
  batch: 12,
  metaPrompt: (n) => `You are writing ${n} SCENE SETTINGS for GothBot's gothic-whimsy medium. Each entry is a single vivid SCENE SETTING from the hybrid dark-fairytale universe of Tim Burton / Corpse Bride / Coraline / Nightmare Before Christmas / Pan's Labyrinth / Alice in Wonderland (both Disney animated AND Tim Burton live-action). Professional animated-feature or stop-motion film-still quality — NOT hobby-craft. Entries 20-40 words. Pure SETTING description (no character specified — character/creature slots in separately).

━━━ AESTHETIC ━━━
Dark ominous gothic whimsy, shadow-dominant low-key cinematic, foreboding fairytale mood, professional feature-film-frame quality. Varied: sometimes puppet-stop-motion-set, sometimes stylized-3D-animated-feature render. Shadow-dominant, moody, minimal warm light — NOT well-lit.

━━━ VARIETY MANDATE — 200 UNIQUE SETTINGS, DEDUP HARD ━━━
You will be shown prior entries. DO NOT repeat the same setting-type + composition + palette combo. Rotate HARD across these setting categories — each entry should feel like a FRESH moment from that universe:

- Haunted dollhouse interior (miniature rooms with miniature furniture, giant doll-house-from-outside-view)
- Puppet graveyard at dusk (tiny tombstones, rag-doll mourner statues, moonlit fog)
- Twisted tea-party ballroom (Corpse-Bride-style wedding hall, tilted chandeliers, broken furniture)
- Miniature witch's apothecary-shop (bottles of strange liquids, hanging herbs, crooked shelves)
- Crooked carnival stage (striped tent, mismatched lanterns, faded posters, acrobat silhouette)
- Abandoned opera-house stage (tattered velvet curtains pulled back, dust-catching spotlight)
- Overgrown puppet-garden (vines strangling statues, twisted flowers, dead fountain)
- Toy funeral procession (tiny figures carrying tiny coffin through village street)
- Clockwork library (walls of massive gears, floating books, brass fixtures)
- Mushroom-village at dusk (toadstool cottages with warm windows, winding mud path)
- Bone-carriage stable (black-lacquered carriage, skeletal horse-figures, rusted-iron gates)
- Ragdoll parlor (tattered armchair, dusty mirror, porcelain dolls watching)
- Alice-in-Wonderland tea-table (oversized teapots, mismatched chairs, pocket watches, cookie crumbs)
- Nightmare-town square (crooked jack-o-lanterns, striped lamp-posts, bat-shaped clock)
- Coraline corridor (papered walls with shifting faces, long hallway to a door, button-eye shadows)
- Pan's-Labyrinth stone labyrinth-entrance (moss-covered steps, carved-faun face in stone, dripping ivy)
- Witch-forest clearing (gnarled black-bark trees, will-o-wisps, candle-circle on moss)
- Ghost-ship harbor at low-tide (tattered-sail ship, wet cobblestones, lantern-lit dock)
- Puppet-opera orchestra pit (empty velvet seats, dust-covered instruments, rising spotlight)
- Twisted music-box interior (oversized gears, tiny ballerina-doll on platform, mirror walls)
- Old-world circus fortune-teller tent (velvet curtain, crystal ball, tarot cards, candle-stub)
- Black-rose conservatory (iron framework, thorn-arches, moonlit glass panels)
- Miniature gothic-manor staircase (spiraling banister, portraits watching, dust-motes)
- Cursed candy-shop (dusty jars, cobwebbed counter, faded storefront at night)
- Macabre dollmaker's workshop (half-finished dolls on shelves, delicate tools, glass eyes in jars)
- Dead-tree-village forest (crooked houses built INTO massive dead trees)
- Witch's cottage-interior (cauldron bubbling, herb-strings overhead, cat-familiar silhouette)
- Underground toy-graveyard (rows of buried-toy-heads, faint gaslight, broken marionettes)
- Crooked cathedral-pew interior (tilted pews, stained-glass-fragment on floor, candle-row)
- Miniature-snowglobe frozen village (viewed from outside the glass, moonlit interior)
- Victorian-gothic nursery (crib with faded ribbons, wind-up toys on floor, rocking horse)
- Rag-doll tea-garden (mismatched tables in overgrown yard, hanging paper lanterns, faded flags)
- Puppet-ballroom mid-dance (empty couples frozen mid-step, crystal chandelier)
- Alice mushroom-forest at twilight (glowing-spore-mushrooms, crooked signpost, fox silhouette)
- Macabre music-hall backstage (rope-pulleys, dust-sheets, trap-door, prop-skulls)
- Twisted puppet-laboratory (beakers, tubes, half-assembled marionette, sparking coil)
- Gothic-miniature bedroom (crib of iron, wallpaper peeling, single teddy bear with missing eye)
- Bone-chapel interior (walls lined with skulls, candle-altar, tiny figure-of-saint)
- Cursed doll-parlor window (looking IN from outside, dolls lined up watching)
- Shadow-puppet theatre (lit screen with silhouettes behind, audience-chairs empty)

━━━ SETTING COMPOSITION RULES ━━━
- EVERY entry describes a SETTING / SCENE only (no primary character required — character slots in from another axis). Props, architecture, lighting, atmospheric detail dominate.
- Each setting has clear compositional anchor — something to center the eye on
- Dark ominous mood — shadow-dominant, foreboding, minimal warm light
- Fog / mist / dust / haze in most entries
- Varied scale — sometimes miniature-diorama, sometimes mid-shot, sometimes wide vista, sometimes claustrophobic-close

━━━ DEDUP / VARIETY ENFORCEMENT ━━━
- Every entry UNIQUE in setting-type + composition + palette cue
- NO two entries describing "moonlit cobblestone village alley with crooked cottages" (that's what we just over-rendered)
- NO two entries with identical primary prop / architecture / atmosphere combination
- When prior batches show 3+ similar settings, WRITE SOMETHING COMPLETELY DIFFERENT next

━━━ HARD BANS ━━━
- NO humans as primary subject (character slots in separately)
- NO stairways / staircases as the dominant subject (stairs can appear as incidental detail in <5% of entries)
- NO cobblestone-village-alley-with-moonlit-cottages repetition (already overused)
- NO satanic / pentagram imagery
- NO red-dominant-everything palette

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
