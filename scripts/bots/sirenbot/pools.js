/**
 * SirenBot — axis pools.
 *
 * Regenerate any pool:
 *     node scripts/gen-seeds/sirenbot/gen-<name>.js
 */

const fs = require('fs');
const path = require('path');

function load(name) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, 'seeds', `${name}.json`), 'utf8')
  );
}

module.exports = {
  // ── Shared DNA ──
  SCENE_PALETTES: load('scene_palettes'),
  MAGICAL_ATMOSPHERES: load('magical_atmospheres'),

  // ── Mermaid paths ──
  MERMAID_FEATURES: load('mermaid_features'),
  WATER_CONDITIONS: load('water_conditions'),
  MERMAID_SIREN_SETTINGS: load('mermaid_siren_settings'),
  MERMAID_SIREN_MOMENTS: load('mermaid_siren_moments'),
  MERMAID_DEEP_SETTINGS: load('mermaid_deep_settings'),
  MERMAID_DEEP_ACTIONS: load('mermaid_deep_actions'),
  MERMAID_REEF_SETTINGS: load('mermaid_reef_settings'),
  MERMAID_REEF_ACTIONS: load('mermaid_reef_actions'),

  // ── Dark Elf path ──
  DARK_ELF_SETTINGS: load('dark_elf_settings'),
  DARK_ELF_ACTIONS: load('dark_elf_actions'),

  // ── Forest Nymph path ──
  NYMPH_SETTINGS: load('nymph_settings'),
  NYMPH_ACTIONS: load('nymph_actions'),

  // ── Vampire Queen path ──
  VAMPIRE_SETTINGS: load('vampire_settings'),
  VAMPIRE_MOMENTS: load('vampire_moments'),

  // ── Dragon Woman path ──
  DRAGON_WOMAN_SETTINGS: load('dragon_woman_settings'),
  DRAGON_WOMAN_ACTIONS: load('dragon_woman_actions'),

  // ── Sorceress path ──
  SORCERESS_SETTINGS: load('sorceress_settings'),
  SORCERESS_ACTIONS: load('sorceress_actions'),

  // ── Valkyrie path ──
  VALKYRIE_SETTINGS: load('valkyrie_settings'),
  VALKYRIE_ACTIONS: load('valkyrie_actions'),
};
