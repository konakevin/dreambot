#!/usr/bin/env node
/**
 * One-off: generate a transparent radial-bloom PNG for the auth welcome
 * screen. RN's expo-linear-gradient has no radial primitive, and stacked
 * linear passes look patchy (commit e807f860). SVG renders the radial
 * natively, sharp rasterizes to PNG, and the app overlays the PNG as a
 * single <Image> — pixel-perfect smooth, no native dep, no dev rebuild.
 *
 * Two stacked radials matching the dreambot-web brochure's gradient-hero:
 *   - Primary moon-purple bloom centered at 50% horizontal / 0% vertical
 *     (top-center), 60% radius — soft falloff in all directions
 *   - Accent cloud-pink at 80% horizontal / 30% vertical, 50% radius —
 *     warm offset so the bloom isn't pure mono-purple
 *
 * Output: assets/images/auth-bloom.png at 1080×2340 (iPhone Pro Max
 * native res). contentFit='cover' in the app crops the edges on smaller
 * screens — bloom stays centered.
 */
const sharp = require('sharp');
const path = require('path');

const W = 1080;
const H = 2340;
const OUT = path.resolve(__dirname, '..', 'Development/apps/dreambot/assets/images/auth-bloom.png');

// Single radial gradient that progresses through ALL THREE brand stops
// — moon purple → cloud pink → star teal — exactly like the DreamBot
// wordmark gradient, just faded out really light and soft so it reads
// as ambient atmosphere instead of a hard color band.
// Kevin's brochure observation: "it looks like the gradient on the
// dreambot-web is the same colors as the logo gradient, just faded out
// really light and soft."
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bloom" cx="50%" cy="20%" r="85%">
      <stop offset="0%"   stop-color="#A78BFA" stop-opacity="0.60" />
      <stop offset="35%"  stop-color="#F9A8D4" stop-opacity="0.30" />
      <stop offset="70%"  stop-color="#5EEAD4" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#5EEAD4" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bloom)" />
</svg>`;

(async () => {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(
      path.resolve('/Users/kevinmchenry/Development/apps/dreambot/assets/images/auth-bloom.png')
    );
  console.log('✓ auth-bloom.png written');
})();
