#!/usr/bin/env node
/**
 * PIXELBOT_JRPG_COMBAT_SPELL_EFFECT — 40%-gated visible spell/weapon
 * effect accent for the jrpg-combat path. Final Fantasy IV-VI / Chrono
 * Trigger / Secret of Mana / Tales of Phantasia spell-VFX register.
 * Title-caps prefix THEN " — " separator THEN 30-45 word description.
 */
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixelbot_jrpg_combat_spell_effect.json',
  total: 200,
  batch: 25,
  maxTokens: 8000,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing ${n} SPELL-EFFECT entries for PixelBot's jrpg-combat path — visible spell or weapon-effect VFX layered into the SNES JRPG combat scene (FF IV-VI / Chrono Trigger / Secret of Mana / Tales of Phantasia / Lufia II spell register). Title-caps prefix THEN " — " separator THEN 30-45 word description.

━━━ THE BAR ━━━
Every entry is ONE visible spell / weapon / status / summon effect mid-action on the combat scene. Named in TITLE-CAPS. The effect SOURCES from a caster or weapon and TARGETS the enemy with visible particle / arc / column / wave / aura. The accent layers onto the existing party + enemy + setting — it does NOT describe a full scene.

━━━ EXAMPLE PHRASINGS (mirror this register exactly) ━━━
"FIREBALL-ARC TRAILING FLAME — blazing fireball-arc streaking diagonally across the combat-floor, dense ember-trail of red-orange particles behind, fire-red ambient glow bleeding into the battlefield scene at mid-flight"
"CHAIN-LIGHTNING ARCING — jagged chain-lightning arcing across three monster silhouettes in rapid sequence, electric-blue arcs crackling between each impact-point, sparks erupting outward with each connection"
"FROST-NOVA SHOCKWAVE — frost-nova ring of ice expanding outward from the mage mid-cast stance, ice-spikes crystallizing where the wave contacts the play-floor, cool-blue ambient washing the scene"
"HOLY-LIGHT PILLAR — brilliant holy-light pillar descending from above onto the monster position, warm-white-gold radiance column, sparkle-particles drifting upward through the beam in spiraling paths"

━━━ VARIETY MANDATE (distribute across these spell-VFX categories) ━━━

- ~5 FIRE / FLAME (fireball-arc / firewall / flame-pillar / meteor-fall / firestorm-swirl / dragon-flame-breath / phoenix-blaze / volcanic eruption / inferno-vortex / scorching solar-flare)
- ~5 ICE / FROST (frost-nova / icicle-volley / blizzard-storm / frozen-pillar / hail-shower / icy-wave / glacial-spike / freezing-mist / ice-shard arc / cryo-burst dome)
- ~4 LIGHTNING / ELECTRIC (chain-lightning / thunderbolt strike / static-arc burst / electric-cage trap / plasma-orb / lightning-spear arc / surge-wave / forked-bolt cascade)
- ~4 HOLY / LIGHT (holy-light pillar / radiant aura / divine-judgment beam / cross-shaped light flash / golden-shield bubble / star-of-healing burst / sun-strike beam / heaven-thunder pillar)
- ~4 DARK / SHADOW (shadow-tendrils reaching / dark-vortex pull / cursed-mist swarm / void-rift opening / death-bell pulse / unholy-aura wave / dark-pillar erupting / shadow-flame burst)
- ~3 NATURE / EARTH (vine-tendril erupt / stone-spike spear / quake-shockwave ring / petal-tornado swirl / root-snare grasp / earth-pillar uplift / leaf-storm arc / pollen-cloud burst)
- ~3 WATER / WIND (water-spout column / tidal-wave wall / typhoon-spiral / wind-blade arc / waterball arc / mist-veil shroud / cyclone-pull vortex / wave-crest impact)
- ~3 WEAPON-EFFECT (sword-aura slash / arrow-trail glow / hammer-impact shockwave / spear-thrust light / shuriken-spread fan / chakram-arc / whip-crack lash / dagger-flurry trails)
- ~3 SUMMON / EXOTIC (summon-circle glow / phoenix descent / dragon-shadow strike / golem-fist crash / spirit-wisp swarm / time-stop ripple / gravity-crush void / planet-collision blast)

━━━ FORMAT RULES (NON-NEGOTIABLE) ━━━
- TITLE PREFIX is 2-4 WORDS IN ALL-CAPS-HYPHENATED, then " — " separator (em-dash), then description.
- Body is 30-45 words.
- ALWAYS specify the SOURCE-OR-TARGET ("from the mage mid-cast", "onto the monster", "across the battlefield").
- ALWAYS specify a particle / arc / pillar / wave / aura VISUAL.
- ALWAYS specify an AMBIENT GLOW signal (color washing the scene).

━━━ BANS ━━━
- NO modern firearm / blaster / laser / sci-fi-beam terms — fantasy magic only.
- NO full-scene descriptions — accent ONLY (layers onto other axes).
- NO casters or monsters named in detail — those are party_engagement + monster_enemy axes.
- NO photoreal — 16-bit JRPG sprite-VFX register.

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering, one entry per string.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
