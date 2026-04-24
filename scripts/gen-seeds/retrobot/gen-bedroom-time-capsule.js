#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/retrobot/seeds/bedroom_time_capsule.json',
  total: 200,
  batch: 50, append: true,
  metaPrompt: (n) => `You are writing ${n} BEDROOM TIME CAPSULE scene descriptions for RetroBot — a kid's bedroom frozen in time, 1975-1995. No people visible. Pure scene/environment.

Each entry: 10-20 words. One specific bedroom scene or detail.

━━━ CATEGORIES ━━━
- Wall posters (movie posters, band posters, sports heroes, magazine cutouts taped up)
- Boombox / stereo (tape deck open, cassette rewinding, radio dial glowing)
- Walkman on the nightstand (foam headphones, tangled cord, mixtape labeled in pen)
- Action figures on shelves (G.I. Joe, Transformers, He-Man, Star Wars, TMNT)
- Desk with homework (Trapper Keeper, Lisa Frank folders, pencil case, eraser crumbs)
- Lava lamp glow (orange and purple, casting shadows on the ceiling)
- TV/gaming setup (small TV on dresser, NES/SNES/Genesis, tangled controllers)
- Bed with themed sheets (Star Wars, Ninja Turtles, Strawberry Shortcake, sports team)
- Friendship bracelets / sticker collections / trading cards scattered
- Magazines on the floor (Nintendo Power, Tiger Beat, Sports Illustrated for Kids)
- Glow-in-the-dark stars on the ceiling
- Closet door ajar (skateboard leaning, baseball glove, roller skates)
- Bookshelf (Choose Your Own Adventure, Goosebumps, Sweet Valley, Hardy Boys)
- Bulletin board (photos, ticket stubs, notes from friends, school schedule)
- Window with afternoon sun cutting across the carpet

━━━ RULES ━━━
- PURE SCENE — no people, no hands, no silhouettes
- 1975-1995 era — no modern tech, no LEDs, no smartphones
- Include BOTH traditionally boy and girl bedrooms across entries
- The bedroom tells you exactly who lives here without showing them

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
