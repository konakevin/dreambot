#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/mythological_creature_aura_or_magic.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (n) => `Write ${n} AURA-OR-MAGIC entries for a MangaBot mythological-creature keyframe. SCENE-LED — each entry names ONE specific YOKAI-AURA or MAGICAL EFFECT that wreathes / trails / emanates from the creature. Mononoke / Spirited-Away spiritual-glow register. The aura proves the creature is supernatural — never just "glowing".

⚠️ CRITICAL: Japanese-shinto / yokai-mythology aura vocabulary ONLY. NEVER western magic / D&D spell-effects / Harry Potter wands / Greek lightning. NEVER WESTERN. Use authentic terms: kitsune-bi (fox-fire), shimenawa-glow, onibi (demon-fire), sigil-circle, ofuda-burst, rune-glyph.

Each entry: 12-22 words. ONE specific magical / aura effect tied to a yokai species or shinto iconography. Color + motion + form.

AURA VARIETY (yokai magic + shinto iconography):
- Fox-fire (kitsune-bi) burning blue-orange around the kitsune's nine fanned tails
- Spirit-tail trail luminescent in pale-gold, streaming behind the leaping nekomata
- Sigil-circle ground-glow beneath the floating creature, glyphs rotating in pale blue
- Mist-streamers pouring from the dragon-god's breath, condensing into spiral threads
- Shimenawa rope glowing white-gold around the shrine, drawn taut by the yokai's presence
- Rune-glyph cascade falling from the karakasa-obake's umbrella-rim, paper-charm sigils
- Leaf-spiral whirling around the tanuki mid-shape-shift, autumn leaves caught in transformation
- Lightning-arc forking from the oni's iron horns, white-hot crackle against red skin
- Starlight-tear spirit, single pale tear suspended below the yuki-onna's eye, glittering
- Sakura-petal storm bursting from the kitsune's eyes, pink petals exploding outward
- Onibi demon-fire wreathing the oni's iron club, indigo flame dripping
- Spirit-mist coiling around the ryujin's serpentine body, pearl-blue threads
- Ofuda paper-charm burst, white shide-paper exploding outward around the creature
- Foxfire-lantern halo, blue flame floating in mid-air around the creature's head
- Shadow-tendrils trailing from the inugami's paws, possessing-darkness leaking
- Spirit-doubles emerging from the rokurokubi's stretched neck, transparent echo-bodies
- Sigil-mandala painted in air beneath the floating tengu, sutras rotating
- Ghost-flame trailing from the bake-neko's tail-tip, pale-green wisp
- Eyes blinking out of sequence across the hyakume's hulking body, glowing dimly
- Mist-veil pouring from the amabie's mouth, prophecy-cloud condensing
- Star-glyph trail behind the leaping nekomata, constellation-points fading
- Cherry-petal cyclone whirling around the kitsune, petals lit from within
- Snow-aura crystallizing in spirals around the yuki-onna, ice-petals suspended
- Spirit-rope of shimenawa coiling around the creature, paper-shide tassels swinging
- Indigo flame jetting from the dragon-god's nostrils, mist trail behind

DO write (yokai-magic vocabulary, specific color + motion + form):
- Fox-fire burning blue-orange around the kitsune's nine fanned tails, embers drifting upward
- Mist-streamers pouring from the dragon-god's breath, condensing into spiral threads above the bridge
- A sigil-circle ground-glow beneath the floating tengu, glyphs rotating in pale blue light
- Lightning-arc forking from the oni's iron horns, white-hot crackle against the red skin
- A sakura-petal storm bursting from the kitsune's eyes, pink petals exploding outward in a halo
- Indigo onibi demon-fire wreathing the oni's iron kanabo club, flame dripping down the haft
- Ofuda paper-charm burst around the creature, white shide-paper exploding outward in spiral

DO NOT write:
- ANY western magic vocabulary (spell / wand / hex / curse / D&D / Harry Potter / Greek lightning-bolt)
- Generic "glowing" without yokai specificity
- Photoreal lighting specs (HDR / bloom / lens-flare)
- Aura completely covering the creature (must be partial — creature visible THROUGH aura)
- Multi-aura dumps (pick ONE magical effect per entry)

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
