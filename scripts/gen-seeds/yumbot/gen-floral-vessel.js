#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/yumbot/seeds/floral_vessel.json',
  total: 200,
  batch: 25,
  append: true,
  metaPrompt: (
    n
  ) => `You are writing \${n} KAWAII-FACED VESSELS for YumBot floral-garden-cup. Each is a cup / mug / teacup / takeout-cup / bowl with a literal smiling face printed on it and decorative painted detail. NO contents (those come from another pool). Just the vessel.

Each entry: 18-30 words. ONE specific kawaii vessel.

━━━ REFERENCE — bex.ai ━━━

The vessels are highly decorative, ornate, painterly-painted with kawaii face and intricate pattern (scallop, dots, scroll, ribbon, floral). Glossy pearlescent ceramic-finish, hand-painted feel. Pop-Mart designer-vinyl collectible-grade.

━━━ DISTRIBUTION ━━━

- 20% TEACUP / TEA-MUG (ornate scallop-edge pastel teacup with kawaii face / curvy hand-painted mug with daisy-pattern and smiling face / sky-blue ceramic mug with cherry-blossom-pattern + closed-eye-smile / pearl-pink scallop teacup with scroll-edge and kawaii face)
- 20% TAKEOUT / PAPER-CUP (white takeout-cup with ornate scroll-painted-side and smiling face / pastel-yellow paper-cup with hand-painted floral and kawaii face / pearl-cream takeout-cup with cherry-blossom-print and smiling face)
- 15% BOBA-CUP / TALL-GLASS (tall glass boba-cup with kawaii face on the front / tall pearl-pink boba-cup with painted-stripe-detail and smiling face)
- 15% MUG / COFFEE-MUG (vintage ceramic mug with hand-painted floral and smiling face / pearl-blue scallop-handle mug with kawaii face / hand-painted-rose mug with dimpled smiling face)
- 10% BOWL / EARTHENWARE (round earthenware bowl with rim-pattern and kawaii face on the curve / mortar-style bowl with floral-painted band and smiling face / pearl-cream bowl with carved-edge and kawaii face)
- 10% TEAPOT (pastel-pink teapot with ornate painted-decoration and kawaii face on the belly / hand-painted-rose teapot with floral-spout and smiling face)
- 5% MASON-JAR / CONTAINER (glass mason-jar with kawaii-face-sticker and pastel-floral-print / vintage milk-bottle with hand-painted-face and ribbon-detail)
- 5% UNUSUAL VESSEL (chipped sugar-bowl with kawaii face / pearlescent honey-pot with smiling face / hand-painted pitcher with kawaii face)

━━━ HARD MANDATES ━━━

- ORNATE / DECORATIVE painted detail visible
- Glossy pearlescent ceramic finish
- KAWAII FACE clearly on the vessel
- Hand-painted-illustration-fusion (not flat / plasticky)
- Pastel palette

━━━ HARD BANS ━━━

- NO contents inside (those come from overflowing_flora pool)
- NO surrounding decor
- NO creatures / humans / animals
- NO plain / minimal vessels — must have painted detail

━━━ OUTPUT ━━━

JSON array of \\${n} strings. No preamble, no numbering.`,
}).catch((e) => {
  console.error('Fatal:', e.message);
  process.exit(1);
});
