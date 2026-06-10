/**
 * MechBot chrome-shogun path — NEW path (2026-06-09).
 *
 * Feudal-future SAMURAI WAR-MECHS — machine-samurai built in ornate samurai armor
 * (horned kabuto, do chest-armor, menpo war-mask, sashimono banner) reimagined in
 * chrome + lacquered alloy, bearing a plasma-katana or energy-naginata. Honor +
 * ceremony + lethal menace. Fills MechBot's eastern-mecha/honor register. Ghost of
 * Tsushima / Gundam samurai / Sekiro / Nioh / Afro Samurai. Distinct from
 * killer-cyborgs-male (street cyber-ninja) — this is samurai, feudal, dueling.
 *
 * Axis design per playbook "Inventing new paths" Step 3 (archetype MECHBOT_CHROME_SHOGUN):
 *   FIGURE:
 *   - shogun       HERO — a DIFFERENT samurai-mech archetype per render
 *   - blade        the SIGNATURE money-shot (the glowing plasma-katana, drawn/mid-strike)
 *   ENVIRONMENT:
 *   - domain       the feudal-future landscape WITH its own lighting/mood baked in
 *   - look         rendering register (leads CLIP — anti-homogenize)
 *   - composition  framing (full-body, dramatic + honorable)
 *   - drama        40%-gated honor/clash beat (duel / petals / standoff / vow)
 *
 * universal: [] — the bot's LIGHTING/ATMOSPHERES pools are space-coded (StarBot
 * heritage) and would fight a cherry-blossom-courtyard / bamboo-forest scene; the
 * domain + look carry the light instead. NO archetype enumeration in any prefix
 * (first-named-noun lock) — the HERO pool carries the archetype. promptPrefixByPath
 * is EMPTY (wrapper-strip). Pools at MVP-25 — NOT scaled until Kevin signs off. Flux-locked.
 */

module.exports = {
  archetype: 'MECHBOT_CHROME_SHOGUN',
  pools: {
    shogun: 'SHOGUN_BEING',
    blade: 'SHOGUN_BLADE',
    domain: 'SHOGUN_DOMAIN',
    look: 'SHOGUN_LOOK',
    composition: 'SHOGUN_COMPOSITION',
    drama: 'SHOGUN_DRAMA', // 40%-gated conditional layer (honor/clash)
  },
};
