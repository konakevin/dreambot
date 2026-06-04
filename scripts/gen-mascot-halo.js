#!/usr/bin/env node
/**
 * Generate a SOFT-BLURRED brand-gradient halo PNG for the auth-welcome
 * mascot. Replaces the rounded-View + LinearGradient approach which had
 * a visible hard circular edge (RN's `overflow: hidden` clips hard, has
 * no CSS-blur equivalent).
 *
 * Approach: render an SVG with a sharp brand-gradient circle, apply
 * SVG's native Gaussian blur filter (feGaussianBlur), then rasterize
 * with sharp. The Gaussian blur creates smooth alpha falloff in every
 * direction — true soft diffused edges, no banding, no hard boundary.
 *
 * Output: assets/images/mascot-halo.png (1024×1024 transparent PNG).
 * Consumer: app/(auth)/index.tsx Logo() — overlay as <Image> behind the
 * mascot.
 */
const sharp = require('sharp');
const path = require('path');

const SIZE = 1024;
const OUT = path.resolve(
  '/Users/kevinmchenry/Development/apps/dreambot/assets/images/mascot-halo.png'
);

// Brand gradient: moon → cloud → star (purple → pink → teal). Same stops
// as the DreamBot wordmark / brochure CTA, applied to a circle blurred
// soft so the whole thing reads as ambient atmosphere.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <defs>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#A78BFA" />
      <stop offset="50%"  stop-color="#F9A8D4" />
      <stop offset="100%" stop-color="#5EEAD4" />
    </linearGradient>
    <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="80" />
    </filter>
  </defs>
  <circle
    cx="${SIZE / 2}"
    cy="${SIZE / 2}"
    r="${SIZE * 0.3}"
    fill="url(#brand)"
    filter="url(#softBlur)"
  />
</svg>`;

(async () => {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUT);
  console.log('✓ mascot-halo.png written →', OUT);
})();
