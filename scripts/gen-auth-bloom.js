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

// Soft lavender-haze daydream vibe — matches the dreambotapp.com Hero's
// `gradient-hero` CSS EXACTLY:
//   radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,139,250,0.18), transparent 60%),
//   radial-gradient(ellipse 60% 50% at 80% 50%, rgba(249,168,212,0.10), transparent 60%),
//   #0F0F1A
//
// Earlier attempts in this branch failed because:
//   - Including TEAL (#5EEAD4) blends with the dark bg into a sickly
//     green murk — teal lives in the wordmark only, NOT the bloom.
//   - Alphas at 0.45-0.75 read as heavy/dystopian; brochure uses
//     0.18 and 0.10 (very light/airy).
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="bloomPurple" cx="50%" cy="0%" rx="80%" ry="60%">
      <stop offset="0%"   stop-color="#A78BFA" stop-opacity="0.45" />
      <stop offset="50%"  stop-color="#A78BFA" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#A78BFA" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="bloomPink" cx="80%" cy="50%" rx="60%" ry="50%">
      <stop offset="0%"   stop-color="#F9A8D4" stop-opacity="0.25" />
      <stop offset="60%"  stop-color="#F9A8D4" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#F9A8D4" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bloomPurple)" />
  <rect width="100%" height="100%" fill="url(#bloomPink)" />
</svg>`;

(async () => {
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9 })
    .toFile(
      path.resolve('/Users/kevinmchenry/Development/apps/dreambot/assets/images/auth-bloom.png')
    );
  console.log('✓ auth-bloom.png written');
})();
