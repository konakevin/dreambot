#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/magical_girl_surprise_element.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} SURPRISE-ELEMENT entries for a MangaBot magical-girl keyframe. Small magical-coded secondary subjects at midground or background.

Each entry: 10-18 words. Element + placement + scale + how it implies the magical world.

VARIETY:
- 20% MASCOT-FAMILIAR (talking-cat with moon-jewel forehead nearby / fairy-pixie hovering at shoulder / dove-spirit perched on wand-tip / tiny-dragon mascot wrapped around arm)
- 16% SPARKLE-STACK (floating heart-shaped bubbles drifting / star-burst sparkles cascading / rainbow-ribbons spiraling at midground / pollen-light motes drifting)
- 14% MAGICAL EFFECTS (status-window flickering at edge / rune-glyph rotating in deep distance / floating-card mid-flip / projected-spell-circle hovering)
- 10% CARD/TAROT (clow-card floating mid-air / tarot-deck spinning behind her / spell-card mid-cast / contract-card on display)
- 10% PASTEL-CREATURE (pink-flying-fish swimming through air / bunny-spirit hopping past / butterfly-fairy at midground / unicorn-foal in deep meadow)
- 8% FLORAL-MAGIC (cherry-petal cluster blowing through / lotus-bloom floating beside / sakura-tree branch with magical-glow / rose-petal spiral)
- 8% CELESTIAL (crescent-moon catching sparkle / star-burst in deep sky / constellation-line forming behind / meteor-streak at horizon)
- 6% MAGICAL-INSTRUMENT (harp-strings vibrating in light / bell-chiming with sparkle / chime-stick floating / song-note materializing)
- 4% CRYSTAL/JEWEL (floating crystal-shard rotating / gem-pendant hovering / prism-jewel catching rainbow / orb-of-power drifting)
- 4% TINY-COSMIC (planet-mini in deep background / orbital-ring fragment / nebula-burst in upper-left / aurora-arc at edge)

DO write:
- Talking-cat mascot with crescent-moon forehead-jewel perched on shoulder, watching with knowing eyes
- Floating heart-shaped bubbles drifting at midground, three of them catching golden-pink sparkle
- Cosmic rune-glyph rotating in deep distance behind her, cyan circuit-lines pulsing softly
- Clow-card floating mid-air at midground edge, card-face glowing rose-gold
- Pink-flying-fish swimming through air in midground, school of three trailing sparkle-tails

DO NOT write:
- Anything FOREGROUND that competes with magical-girl
- "Distant vista" / "horizon beyond" — re-invites back-to-camera
- "Tiny figure of [companion / NPC]" — solo path
- Multiple surprises per entry

Magical world implied without stealing focus from hero magical-girl.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
