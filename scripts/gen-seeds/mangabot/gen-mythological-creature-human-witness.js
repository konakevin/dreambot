#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_human_witness.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} HUMAN-WITNESS entries for a MangaBot mythological-creature keyframe. SCENE-LED — the YOKAI is the hero. The human-witness (when present) is TINY (5-15% of frame), serves as SCALE-PROVER only. Often absent — many entries should be "no human witness" so the creature stands alone.

⚠️ CRITICAL ANTI-HERO-HUMAN GUARDRAIL: NEVER write a human-character that is hero-sized / centered / face-visible / portrait / close-up / chest-up. The yokai is the hero. Every human-figure must be EXPLICITLY scale-anchored — "tiny", "small", "distant", "background", "barely-visible", "silhouetted at distance". And ~30% of entries must be "no human witness — creature alone."

⚠️ CRITICAL: Japanese cultural-witness only. NEVER western priest / cowboy / knight / Greek warrior. NEVER WESTERN.

Each entry: 12-22 words. Either ONE specific tiny Japanese-cultural witness OR an explicit "no human witness — creature alone" statement.

HUMAN-WITNESS VARIETY (all TINY, all Japanese-coded, ~30% must be absent):
- A small monk holding an ofuda paper-charm at the edge of frame, dwarfed by the creature
- A tiny child silhouette behind a torii arch, peeking out at the yokai
- A pilgrim tiny on the cypress bridge, robes catching the wind, half-bowing
- A shrine-maiden lighting a stone-lantern at distance, miko-robes catching firelight
- A tiny artist on a rock at the lane's edge, sketchbook open, dwarfed by the dragon
- A fox-cult member kneeling at the inari shrine, distant pilgrim-figure at the gate
- A yamabushi monk tiny on the mountain path, conch-horn raised, distant silhouette
- A tea-vendor at his yatai cart, tiny background figure, kettle steaming
- An onmyoji caster tiny at the lane's edge, ofuda paper-charm raised toward the yokai
- A village elder kneeling at distance with a bowl of rice offered toward the creature
- A small group of villagers cowering at the lane's edge, tiny silhouettes
- A child's silhouette holding a paper kite, dwarfed by the towering nine-tailed kitsune
- No human witness — the creature stands alone in the empty shrine courtyard
- No human witness — only the kitsune and its own fox-fire in the bamboo grove
- No human witness — the dragon-god coils through the mist with no observer
- No human witness — the yokai bridge holds only the creature and the lanterns
- No human witness — the snow-field stretches empty save for the yuki-onna
- A tiny pilgrim figure crossing the bridge, dwarfed by the ryujin coiled around the pillar
- A geta-clogged tengu-cultist tiny at the shrine steps, ofuda raised in awe
- An old shrine-keeper tiny at distance, lantern in hand, watching from a distance
- A tiny ronin samurai silhouette at the lane's edge, hand on katana hilt, dwarfed
- No human witness — the yokai stands alone, the moonlit snow uninterrupted
- A small village child tiny at the lane's far end, watching slack-jawed
- A monk's three-quarter-back-view silhouette tiny at the temple gate, robes still
- No human witness — the foxfire-lit cemetery holds only the creature and the headstones

DO write:
- A tiny monk holding an ofuda paper-charm at the edge of frame, dwarfed by the towering oni
- A small child silhouette behind the vermilion torii, peeking out at the nine-tailed kitsune
- No human witness — the creature stands alone in the bamboo grove, fox-fire its only light
- A distant pilgrim figure crossing the cypress bridge, tiny against the dragon coiled around the pillar

DO NOT write:
- ANY hero-human / close-up / portrait / face-detail / chest-up / waist-up
- ANY centered or large human figure (must be tiny + scale word OR absent)
- Western witness (priest / knight / cowboy / Greek warrior)
- Outfit catalog beyond a single tag
- Combat-poses (the witness is observer not combatant)
- Multiple-witness crowds (max trio, all tiny)
- Modern witness (salaryman / schoolgirl with phone — different paths)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
