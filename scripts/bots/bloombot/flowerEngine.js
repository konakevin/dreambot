/**
 * BloomBot flower ORCHESTRATOR.
 *
 * Per render: roll a color THEME (+ register), filter the tagged flower pool by
 * theme-colors ∩ path-biome, and pluck a CURATED cast (hero + supporting +
 * filler, mixed forms/scales) so the scene reads as a deliberate arrangement,
 * not random flowers. Emits `palette` (color block) + `roster` (flower cast
 * block) strings that drop straight into the existing brief slots.
 *
 * Phase 2: single-scheme only. (Two-clump + spectrum modes land in Phase 3.)
 */

const flowers = require('./seeds/flowers.json');
const { rollTheme, rollRegister } = require('./flowerThemes');

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
const tag = (f, theme) => {
  const c = colorFor(f, theme);
  // avoid "blue blue delphinium" when the species name already names a color
  return f.name.toLowerCase().includes(c) ? f.name : `${c} ${f.name}`;
};

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

  const used = new Set();
  const heroPool = pool.filter((f) => f.form === 'statement');
  const hero = pickDistinct(heroPool.length ? heroPool : pool, 1, used)[0] || pool[0];
  const supportPool = pool.filter((f) => ['statement', 'spire', 'cascading'].includes(f.form));
  const support = pickDistinct(supportPool.length ? supportPool : pool, 3, used);
  const fillerPool = pool.filter((f) => ['filler', 'groundcover'].includes(f.form));
  const filler = pickDistinct(fillerPool.length ? fillerPool : pool, 2, used);

  const palette = `${theme.label} theme — ${register.phrase}. Allowed colors ONLY: ${theme.colors.join(', ')}. Every bloom in one of these colors; no other hue anywhere except supporting green foliage.`;

  const roster = `Render THESE exact flowers (already chosen to fit the theme), massed LUSH and abundant with the HERO dominant in the foreground:
  • HERO bloom (large, fills the foreground): ${tag(hero, theme)}
  • SUPPORTING blooms: ${support.map((f) => tag(f, theme)).join(', ')}
  • ACCENT / FILLER: ${filler.map((f) => tag(f, theme)).join(', ')}
Use these exact species in these colors, massed in lush clumps with mixed shapes + scales for a deliberate florist's arrangement. Do NOT add other species or other colors.`;

  return { theme: theme.label, register: register.name, palette, roster };
}

module.exports = { roll };
