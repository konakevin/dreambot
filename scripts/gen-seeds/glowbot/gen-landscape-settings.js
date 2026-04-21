#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/glowbot/seeds/landscape_settings.json',
  total: 50,
  batch: 10,
  metaPrompt: (n) => `You are writing ${n} LUMINOUS LANDSCAPE settings for GlowBot — earthly landscapes where LIGHT is the soul of the scene. Every entry names a specific landscape + how LIGHT is the emotional center.

Each entry: 18-32 words. Specific landscape + specific light phenomenon making it luminous.

━━━ CATEGORIES ━━━
- Sun-through-mist forests (pine / redwood / bamboo / cypress / birch / eucalyptus / sequoia groves with god-rays)
- Aurora over lakes (Arctic / Finnish / Icelandic / Alaskan / Norwegian / Tasmanian) with mirror reflection
- Golden-hour mountains (Patagonian / Swiss / Himalayan / Rockies / Japanese / Scottish / New-Zealand) with backlit peaks
- Dawn meadows (alpine / English-countryside / wildflower / heath) with dew-catching-first-light
- Moonlit shores (Mediterranean / Pacific / Hawaiian / Nordic / Caribbean) with silver-path-on-water
- Cedar / bamboo / redwood forest clearings with shafts of sun piercing through
- Lavender fields at golden hour with warm diffuse light
- Misty valleys with sunrise breaking through clouds
- Snowy forests with blue-hour cold luminance + silver tree-trunks
- Canyon/vista at dawn with light filling the depths
- Rice paddy / terraced field at sunset-warm-reflection
- Prairie / grassland with sweeping god-ray through thunderstorm
- Bioluminescent-shore landscapes (beach with glowing-plankton wash)

━━━ RULES ━━━
- Earthly landscapes (real-plausible)
- LIGHT is the emotional center, not just pretty geography
- Always specific light-phenomenon named
- No people, wildlife OK peripheral

━━━ BANNED ━━━
- Menacing / dark / stormy-threatening language
- Harsh/gritty lighting
- Named IP/franchise references

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering. Escape any quotes.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
