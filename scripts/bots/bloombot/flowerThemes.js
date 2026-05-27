/**
 * BloomBot flower THEMES — the color-scheme library the orchestrator rolls.
 * Colors use the flower-pool color vocabulary (see flowers.json).
 *
 * Mono + hybrid + spectrum themes (the set Kevin specified), plus an orthogonal
 * saturation REGISTER (vivid / pastel / dark-jewel). The 75 legacy palettes were
 * mined to seed these. Weights keep "mixed lush" common so themed scenes are a
 * deliberate minority spice, not the whole feed.
 */

const ALL =
  'pink red orange yellow white cream purple violet lavender blue indigo magenta coral peach burgundy bronze'.split(
    ' '
  );

// Weights re-tuned 2026-05-27 to SPREAD color families. The pink hybrids were
// crowding out yellow/orange/white/sunset (warm output was ~all pink); trimmed
// them, lifted sunset, added a golden-meadow hybrid, and nudged the scarce
// monos. Net ~20% mono / ~44% hybrid / ~36% spectrum (mixed-lush still dominant).
const THEMES = {
  // ── monochrome ──
  pink: { label: 'pink', colors: ['pink', 'magenta', 'coral', 'peach'], weight: 2 },
  purple: { label: 'purple', colors: ['purple', 'violet', 'lavender'], weight: 3 },
  blue: { label: 'blue', colors: ['blue', 'indigo'], weight: 3 },
  yellow: { label: 'yellow', colors: ['yellow', 'cream'], weight: 2 },
  orange: { label: 'orange', colors: ['orange', 'peach', 'bronze'], weight: 2 },
  red: { label: 'red', colors: ['red', 'burgundy'], weight: 2 },
  white: { label: 'white', colors: ['white', 'cream'], weight: 2 },
  // ── hybrid ──
  pinkWhite: { label: 'pink & white', colors: ['pink', 'white', 'cream', 'coral'], weight: 4 },
  purpleWhiteBlue: {
    label: 'purple, white & blue',
    colors: ['purple', 'violet', 'lavender', 'white', 'blue'],
    weight: 5,
  },
  sunset: {
    label: 'sunset shades (red, orange, yellow)',
    colors: ['red', 'orange', 'yellow', 'coral'],
    weight: 8,
  },
  goldenMeadow: {
    label: 'golden meadow (yellow, cream, peach & white)',
    colors: ['yellow', 'cream', 'peach', 'white', 'orange'],
    weight: 6,
  },
  bluePurple: {
    label: 'blue & purple',
    colors: ['blue', 'indigo', 'purple', 'violet', 'lavender'],
    weight: 5,
  },
  coralCreamPeach: {
    label: 'coral, cream & peach',
    colors: ['coral', 'cream', 'peach', 'pink'],
    weight: 3,
  },
  magentaGold: { label: 'magenta & gold', colors: ['magenta', 'yellow', 'pink'], weight: 3 },
  // ── spectrum (mixed-lush is the backbone) ──
  rainbow: {
    label: 'full rainbow spectrum (every color, equal weight)',
    colors: ALL,
    weight: 8,
    spectrum: true,
  },
  mixedLush: {
    label: 'mixed lush (rich balanced multi-color)',
    colors: ALL,
    weight: 20,
    spectrum: true,
  },
};

const REGISTERS = [
  { name: 'vivid', weight: 6, phrase: 'jewel-tone hyper-saturated vivid color' },
  {
    name: 'pastel',
    weight: 3,
    phrase: 'soft pastel rendering of these colors, gentle and luminous',
  },
  {
    name: 'darkjewel',
    weight: 1,
    phrase: 'deep dark-jewel saturation, rich and moody against shadow',
  },
];

function weightedPick(items, picker, key, biasMap) {
  const weights = items.map((it) => {
    const w = it.weight || 1;
    const b = biasMap && biasMap[it.key] != null ? biasMap[it.key] : 1;
    return w * b;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  // use picker's RNG if available, else Math.random
  let r = (picker && typeof picker.random === 'function' ? picker.random() : Math.random()) * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function rollTheme(picker, themeBias) {
  const items = Object.entries(THEMES).map(([key, t]) => ({ key, ...t }));
  return weightedPick(items, picker, 'theme', themeBias);
}

function rollRegister(picker, bias) {
  const items = REGISTERS.map((r) => ({ key: r.name, ...r }));
  return weightedPick(items, picker, 'register', bias);
}

module.exports = { THEMES, REGISTERS, ALL, rollTheme, rollRegister };
