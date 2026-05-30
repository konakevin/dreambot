#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/mangabot/seeds/shonen_action_power_signature.json',
  total: 25,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `Write ${n} POWER-SIGNATURE entries — the visible combat-energy / magical-effect signature of a shonen hero's power. SCALE-IT-UP rule: not a wisp, a MAELSTROM.

Each entry: 14-22 words. Power-type + visual signature + scale + cinematic intensity.

VARIETY:
- 18% CHAKRA/CHI (cyan chakra-aura blazing around body / wind-chakra spinning at fingertips / gold-chi corona radiating outward / flame-chakra erupting from palms)
- 14% CURSED-ENERGY (purple cursed-aura tendrils whipping around / black-shikigami crow swarming overhead / domain-expansion barrier rippling / cursed-rune-pattern flickering on skin)
- 12% BREATHING-TECHNIQUE (water-breathing serpent coiling around blade / flame-breathing dragon manifesting / thunder-breathing crackle / mist-breathing veil pulsing)
- 10% EXPLOSION/PYRO (explosion-bloom radiating from hands / nitroglycerin-spark detonation / fire-aura blazing / volcanic-eruption tendrils)
- 10% LIGHTNING/ELECTRIC (lightning-fork-pillar striking down / electric arc-corona between hands / plasma-bolt mid-discharge / chidori-style hand-lightning)
- 8% SHADOW/VOID (shadow-tendrils erupting from feet / void-portal cracking behind / dark-aura corona / silhouette-clone afterimages)
- 8% ICE/CRYSTAL (ice-crystal-storm radiating outward / crystalline-barrier shattering / frost-aura blooming / ice-spike-array forming)
- 6% LIGHT/HOLY (radiant golden-light corona / heavenly-beam descending / divine-aura halo / banishment-light pulse)
- 6% MECH/MAGITECH (plasma-charge between gauntlets / cyber-beam mid-discharge / rune-circuit cascading / arcane-tech-explosion)
- 4% PSYCHIC/MIND (telekinetic ripple-wave / mind-bend distortion / dream-fog spiraling / illusion-shatter mid-burst)
- 4% NATURE (vines erupting from earth / petal-storm cyclone / root-spike-array / leaf-blade-storm)

DO write:
- Cyan chakra-aura blazing in spiral around body, gold-dust trailing from fingertips, energy-spike-array radiating
- Purple cursed-aura tendrils whipping around body, black-shikigami crows swarming overhead, rune-glyphs cascading
- Water-breathing serpent of cyan energy coiling around blade as he strikes, droplet-spray suspended mid-arc
- Explosion-bloom radiating from his palms, nitroglycerin sparks detonating in concentric rings, smoke-vortex spiraling

DO NOT: subtle/small effects (the rule is MAELSTROM, not wisp) / multiple powers per entry / photoreal CGI descriptors.

Return ONLY a JSON array of ${n} strings. No preamble.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
