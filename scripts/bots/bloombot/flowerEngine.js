/**
 * BloomBot flower ORCHESTRATOR.
 *
 * Per render: roll a color THEME (+ register), filter the tagged flower pool by
 * theme-colors ∩ path-biome, and pluck a CURATED cast (hero + supporting +
 * filler, mixed forms/scales) so the scene reads as a deliberate arrangement,
 * not random flowers. Emits `palette` (color block) + `roster` (flower cast
 * block) strings that drop straight into the existing brief slots.
 *
 * COLOR-SPREAD (2026-05-27): hybrid themes were collapsing to their pool-dominant
 * hue — "blue & purple" rendered ~80% purple, "purple/white/blue" ~8% blue —
 * because the pool is purple-rich and blue-poor and the per-flower color pick
 * collapsed multi-color species to the common hue. Fix: for any multi-family
 * theme, ROTATE the hero's color family (kills the always-purple hero) and
 * round-robin the cast slots across the theme's distinct color FAMILIES so each
 * one is represented (with form→family→pool fallbacks where material is scarce).
 * Mono + spectrum themes keep the original random behavior.
 */

const flowers = require('./seeds/flowers.json');
const { rollTheme, rollRegister } = require('./flowerThemes');

// Coarse VISUAL color families — used to spread hybrid themes across distinct
// hues instead of letting near-synonyms (purple/violet/lavender) all collapse
// to one look. magenta groups with pink; coral/peach group with orange.
const FAMILY = {
  purple: 'purple',
  violet: 'purple',
  lavender: 'purple',
  lilac: 'purple',
  plum: 'purple',
  mauve: 'purple',
  blue: 'blue',
  indigo: 'blue',
  cobalt: 'blue',
  navy: 'blue',
  white: 'white',
  cream: 'white',
  ivory: 'white',
  pearl: 'white',
  pink: 'pink',
  magenta: 'pink',
  rose: 'pink',
  blush: 'pink',
  fuchsia: 'pink',
  red: 'red',
  crimson: 'red',
  scarlet: 'red',
  burgundy: 'red',
  orange: 'orange',
  coral: 'orange',
  peach: 'orange',
  bronze: 'orange',
  amber: 'orange',
  salmon: 'orange',
  tangerine: 'orange',
  yellow: 'yellow',
  gold: 'yellow',
  golden: 'yellow',
  lemon: 'yellow',
};
const familyOf = (c) => FAMILY[c] || c;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickDistinct(arr, n, used) {
  const out = [];
  for (const f of shuffle(arr)) {
    if (out.length >= n) break;
    if (used.has(f.name)) continue;
    out.push(f);
    used.add(f.name);
  }
  return out;
}
function colorFor(f, theme) {
  const opts = f.colors.filter((c) => theme.colors.includes(c));
  const src = opts.length ? opts : f.colors;
  return src[Math.floor(Math.random() * src.length)];
}
// "violet allium" — but avoid "blue blue delphinium" when the name already names the color
const tagWith = (f, color) => (f.name.toLowerCase().includes(color) ? f.name : `${color} ${f.name}`);

/**
 * @param {object} opts
 * @param {string} [opts.biome] path biome ('any' = no biome filter)
 * @param {object} [opts.themeBias] per-theme weight multipliers
 * @param {object} [opts.picker]
 * @returns {{ theme, register, palette, roster }}
 */
function roll({ biome = 'any', themeBias, picker } = {}) {
  const theme = rollTheme(picker, themeBias);
  const register = rollRegister(picker);

  // candidates: flowers whose natural colors intersect the theme
  let pool = flowers.filter((f) => f.colors.some((c) => theme.colors.includes(c)));
  // bias to biome when it yields enough; always allow cottage/meadow as general
  if (biome && biome !== 'any') {
    const biomed = pool.filter(
      (f) => f.biomes.includes(biome) || f.biomes.includes('cottage') || f.biomes.includes('meadow')
    );
    if (biomed.length >= 8) pool = biomed;
  }
  if (pool.length < 5) pool = flowers.filter((f) => f.colors.some((c) => theme.colors.includes(c)));

  // distinct color FAMILIES this theme wants (order preserved from theme.colors)
  const fams = [];
  for (const c of theme.colors) {
    const fm = familyOf(c);
    if (!fams.includes(fm)) fams.push(fm);
  }
  // spectrum (rainbow/mixed-lush) is meant to be everything — leave it random;
  // single-family (e.g. mono purple) has nothing to spread.
  const spread = !theme.spectrum && fams.length > 1;

  const used = new Set();
  let heroStr, supportStrs, fillerStrs;

  if (spread) {
    const order = shuffle(fams); // rotate which family LEADS — kills the always-purple hero
    const slotFam = (i) => order[i % order.length];
    // assign a color to a flower constrained to a target family (fallback: any theme color)
    const colorForFamily = (f, fam) => {
      const opts = f.colors.filter((c) => familyOf(c) === fam && theme.colors.includes(c));
      return opts.length ? opts[Math.floor(Math.random() * opts.length)] : colorFor(f, theme);
    };
    // pick a distinct flower that can render `fam` in the desired form; relax form, then family, then pool
    const pickFam = (fam, forms) => {
      const canFam = (f) => f.colors.some((c) => familyOf(c) === fam && theme.colors.includes(c));
      let cand = pool.filter((f) => forms.includes(f.form) && canFam(f));
      if (!cand.length) cand = pool.filter(canFam);
      if (!cand.length) cand = pool.filter((f) => forms.includes(f.form));
      if (!cand.length) cand = pool;
      return pickDistinct(cand, 1, used)[0] || pool[0];
    };

    const heroFam = slotFam(0);
    const heroF = pickFam(heroFam, ['statement']);
    heroStr = tagWith(heroF, colorForFamily(heroF, heroFam));

    supportStrs = [];
    for (let i = 1; i <= 3; i++) {
      const fm = slotFam(i);
      const f = pickFam(fm, ['statement', 'spire', 'cascading']);
      if (f) supportStrs.push(tagWith(f, colorForFamily(f, fm)));
    }
    fillerStrs = [];
    for (let i = 4; i <= 5; i++) {
      const fm = slotFam(i);
      const f = pickFam(fm, ['filler', 'groundcover']);
      if (f) fillerStrs.push(tagWith(f, colorForFamily(f, fm)));
    }
  } else {
    // mono + spectrum: original random behavior
    const heroPool = pool.filter((f) => f.form === 'statement');
    const hero = pickDistinct(heroPool.length ? heroPool : pool, 1, used)[0] || pool[0];
    const supportPool = pool.filter((f) => ['statement', 'spire', 'cascading'].includes(f.form));
    const support = pickDistinct(supportPool.length ? supportPool : pool, 3, used);
    const fillerPool = pool.filter((f) => ['filler', 'groundcover'].includes(f.form));
    const filler = pickDistinct(fillerPool.length ? fillerPool : pool, 2, used);
    heroStr = tagWith(hero, colorFor(hero, theme));
    supportStrs = support.map((f) => tagWith(f, colorFor(f, theme)));
    fillerStrs = filler.map((f) => tagWith(f, colorFor(f, theme)));
  }

  const palette = `${theme.label} theme — ${register.phrase}. Allowed colors ONLY: ${theme.colors.join(', ')}. Every bloom in one of these colors; no other hue anywhere except supporting green foliage.`;

  // for multi-color themes, push Flux to actually SHOW the blend, not collapse it
  const spreadLine = spread
    ? `\nSpread these colors across the scene in distinct visible clumps so EACH theme color reads clearly — do NOT let a single color flood the whole frame.`
    : '';

  const roster = `Render THESE exact flowers (already chosen to fit the theme), massed LUSH and abundant with the HERO dominant in the foreground:
  • HERO bloom (large, fills the foreground): ${heroStr}
  • SUPPORTING blooms: ${supportStrs.join(', ')}
  • ACCENT / FILLER: ${fillerStrs.join(', ')}
Use these exact species in these colors, massed in lush clumps with mixed shapes + scales for a deliberate florist's arrangement.${spreadLine} Do NOT add other species or other colors.`;

  return { theme: theme.label, register: register.name, palette, roster };
}

module.exports = { roll };
