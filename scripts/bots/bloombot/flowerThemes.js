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

// THE DESIGN MENU (2026-06-17). Every theme is ONE intentional florist palette;
// the feed rotates through them ~⅓ pure-mono / ⅓ curated-harmony / ⅓ spectrum
// (Kevin's call — "each scene feels designed by a professional florist", not a
// color salad). Coherence is enforced downstream by the flower×color render
// matrix in flowerEngine (species cast by their RENDER-prior color + a versatile
// flag, NOT botanical range) — so a "yellow" scene actually renders yellow
// instead of drifting pink/purple, and the pink-magnet species (wisteria,
// bougainvillea, jacaranda…) only appear on genuinely pink/purple themes.
// Colors use the base vocab the matrix + FAMILY map understand.
const THEMES = {
  // ── PURE MONOCHROME (~⅓ of the feed) — a single-hue florist study ──
  pink: { label: 'pure pink', colors: ['pink', 'magenta'], weight: 4 },
  red: { label: 'pure red', colors: ['red', 'burgundy'], weight: 4 },
  orange: { label: 'pure orange', colors: ['orange', 'coral', 'peach'], weight: 4 },
  yellow: { label: 'pure golden yellow', colors: ['yellow'], weight: 5 },
  white: { label: 'pure white & cream', colors: ['white', 'cream'], weight: 5 },
  purple: { label: 'pure purple', colors: ['purple', 'violet', 'lavender'], weight: 4 },
  blue: { label: 'pure blue', colors: ['blue', 'indigo'], weight: 4 },
  // ── CURATED HARMONY (~⅓) — 2-3 complementary hues, a designed arrangement ──
  sunset: {
    label: 'sunset (red, orange, yellow & coral)',
    colors: ['red', 'orange', 'yellow', 'coral'],
    weight: 6,
  },
  nightshade: {
    label: 'nightshade (deep purple, violet, indigo & burgundy)',
    colors: ['purple', 'violet', 'indigo', 'burgundy'],
    weight: 5,
  },
  whiteBlue: { label: 'white & blue (crisp and cool)', colors: ['white', 'blue', 'cream'], weight: 4 },
  purpleGold: {
    label: 'purple & gold (regal complementary)',
    colors: ['purple', 'violet', 'yellow'],
    weight: 4,
  },
  coralCreamPeach: {
    label: 'coral, peach & cream (soft warm)',
    colors: ['coral', 'peach', 'cream'],
    weight: 4,
  },
  bluePurple: { label: 'blue & purple', colors: ['blue', 'indigo', 'purple', 'violet'], weight: 4 },
  blushWhite: { label: 'blush & white (soft romantic)', colors: ['pink', 'white', 'cream'], weight: 3 },
  // ── SPECTRUM (~⅓) — many colors, deliberately massed (cottage + showpiece) ──
  rainbow: {
    label: 'full rainbow spectrum (every color, evenly massed in distinct clumps)',
    colors: ALL,
    weight: 12,
    spectrum: true,
  },
  mixedLush: {
    label: 'mixed cottage-lush (rich balanced multi-color)',
    colors: ALL,
    weight: 18,
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
