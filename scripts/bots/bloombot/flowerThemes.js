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

const THEMES = {
  // ── monochrome ──
  pink: { label: 'pink', colors: ['pink', 'magenta', 'coral', 'peach'], weight: 6 },
  purple: { label: 'purple', colors: ['purple', 'violet', 'lavender'], weight: 6 },
  blue: { label: 'blue', colors: ['blue', 'indigo'], weight: 6 },
  yellow: { label: 'yellow', colors: ['yellow', 'cream'], weight: 5 },
  orange: { label: 'orange', colors: ['orange', 'peach', 'bronze'], weight: 4 },
  red: { label: 'red', colors: ['red', 'burgundy'], weight: 5 },
  white: { label: 'white', colors: ['white', 'cream'], weight: 5 },
  // ── hybrid ──
  pinkWhite: { label: 'pink & white', colors: ['pink', 'white', 'cream', 'coral'], weight: 6 },
  purpleWhiteBlue: {
    label: 'purple, white & blue',
    colors: ['purple', 'violet', 'lavender', 'white', 'blue'],
    weight: 6,
  },
  sunset: {
    label: 'sunset shades (red, orange, yellow)',
    colors: ['red', 'orange', 'yellow', 'coral'],
    weight: 5,
  },
  bluePurple: {
    label: 'blue & purple',
    colors: ['blue', 'indigo', 'purple', 'violet', 'lavender'],
    weight: 6,
  },
  coralCreamPeach: {
    label: 'coral, cream & peach',
    colors: ['coral', 'cream', 'peach', 'pink'],
    weight: 4,
  },
  magentaGold: { label: 'magenta & gold', colors: ['magenta', 'yellow', 'pink'], weight: 3 },
  // ── spectrum ──
  rainbow: {
    label: 'full rainbow spectrum (every color, equal weight)',
    colors: ALL,
    weight: 5,
    spectrum: true,
  },
  mixedLush: {
    label: 'mixed lush (rich balanced multi-color)',
    colors: ALL,
    weight: 10,
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
