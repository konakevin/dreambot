#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/anime_village_drama.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} DRAMA entries for a MangaBot anime-village keyframe. SCENE-LED conditional layer (fired at 30%) — each entry names ONE QUIET NARRATIVE BEAT that elevates the frame from "village exists" to "something is happening". Quiet not loud. Story not spectacle.

Each entry: 12-22 words. ONE specific quiet narrative beat. NOT combat, NOT magical, NOT hero-portrait — just a story-tick.

GENRE SPLIT (this 25-entry pool):
- 60% PASTORAL-PERIOD narrative beats (Mushishi / Mononoke / Spice-and-Wolf register)
- 40% MODERN-JAPAN narrative beats (Showa / kissaten / Akihabara)

DRAMA VARIETY (quiet story beats):
- Vendor mid-pour of tea at a yatai (steam-arc caught mid-stream)
- Paper-charm fluttering loose from a shrine post (omikuji breaking free of the wooden lattice)
- Shrine bell tolling once at twilight (single-note resonance implied)
- Festival drum offstage (distant taiko pulse felt through the frame's hush)
- Monk passing through frame in three-quarter back-view (robes trailing, mid-stride at distance)
- Sudden-rain breaking (first heavy-drops striking dust, the air-change visible)
- Lantern lighter touching match to wick at twilight (small bright point in deep blue air)
- Wagon driver waving to the brewery shopkeeper (gesture mid-air)
- Old woman bowing to a jizo statue (slight forward fold at the lane's edge)
- Bicycle rider braking hard at a corner (gravel-spray, mid-arc)
- Two children pausing mid-game to look up at sky (kite snapped, mid-sky-gaze)
- Steam-vendor wiping brow with sleeve (small gesture, mid-pour pause)
- Carpenter setting down his plane to listen to wind-chimes (paused mid-task)
- Postman handing a letter through a shoji-crack (mid-exchange beat)
- Lantern-lighter on a stepladder mid-reach (frozen at upper-rung mid-flame)
- Vendor closing his cart with a tarpaulin (mid-fold beat at end of day)
- Mother calling a child back from the lane's edge (mid-shout silhouette)
- Festival prep — two villagers raising a banner across the lane (mid-lift)
- Old farmer leading a brown ox into the village at dusk (mid-walk silhouette)
- Two old men pausing a shogi game to watch rain begin (mid-game-pause)
- Showa salaryman cracking open a vending-machine can (small mid-action in alley)
- Newspaper-delivery boy tossing a paper to a doorway (mid-arc throw)
- Shopkeeper bowing customers out of a kissaten (mid-bow at threshold)
- Cat-shrine attendant placing a small offering (mid-place beat)
- A monk striking a temple bell with a wooden beam (mid-swing of the shumoku)

DO write:
- A vendor caught mid-pour at his yatai, the steam-arc held mid-stream above an outstretched cup
- A paper-charm fluttering loose from a shrine post, omikuji breaking free of the wooden lattice in wind
- A monk passing through frame in three-quarter back-view, dark robes trailing in mid-stride at distance
- A lantern-lighter touching a match to wick at twilight, the small flame-point bright in deep-blue air
- An old woman bowing to a jizo statue at the lane's edge, slight forward fold caught mid-motion
- Two old men pausing their shogi game to watch the first rain-drops strike the bench beside them
- A monk striking a temple bell with a wooden beam, mid-swing of the shumoku frozen in motion

DO NOT write:
- Combat / heroic / magical / explosive drama
- Hero-portrait moments centered on a face
- Generic "drama" without a specific narrative beat
- Modern megacity action
- Multi-beat sequences (pick ONE moment)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
