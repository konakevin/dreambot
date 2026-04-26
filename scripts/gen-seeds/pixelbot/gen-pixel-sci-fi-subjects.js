#!/usr/bin/env node
const { generatePool } = require('../../lib/seedGenHelper');
generatePool({
  outPath: 'scripts/bots/pixelbot/seeds/pixel_sci_fi_subjects.json',
  total: 200,
  batch: 50,
  metaPrompt: (n) => `You are writing ${n} PIXEL SCI-FI SUBJECT descriptions for PixelBot's pixel-sci-fi path — pixel cyberpunk / spaceships / alien planets / vaporwave-adjacent.

Each entry: 15-30 words. One specific pixel sci-fi subject.

━━━ CATEGORIES ━━━
- Cyberpunk neon-alley with rain
- Spaceship cockpit interior
- Alien planet surface with twin suns
- Robot lone explorer on ice-planet
- Vaporwave-palm-tree sunset
- Space station exterior
- Mech in abandoned factory
- Cyberpunk-ramen-shop neon-lit
- Asteroid field with distant nebula
- Neo-Tokyo rain-soaked street
- Spacecraft escaping black hole
- Alien cave with luminous crystals
- Cyberpunk rooftop at night with holograms
- Spacewalk with planet backdrop
- Moon-base interior dome
- Galactic-saloon at bar
- Mars-rover in red desert
- Space-port with ships docking
- Alien market bazaar
- Cyberpunk arcade interior
- Android repair workshop
- Space-elevator base
- Orbital-station at Earth-rise
- Derelict spaceship drifting
- Cyberpunk cargo-hauler cockpit
- Pilot standing beside starfighter
- Retro-futurist diner with UFO
- Neo-noir detective office with holograms
- Alien flora close-up (bioluminescent)
- Space-lab with glowing specimens
- Cyberpunk clinic with chrome
- Spaceship bridge with viewscreen
- Sci-fi cathedral with floating cross
- Robot-graveyard wasteland
- Neon-hologram advertisement street
- Zero-g gymnastics chamber
- Vaporwave pool with sculpted statue
- Retro-arcade interior (no specific IP)
- Space-pirate-ship at port
- Alien princess chamber throne-room
- Robotic-bar with drinks floating
- Interstellar freighter docking
- Abandoned cyberpunk city with moss-overgrowth
- Space-whale (fictional creature)
- Dyson-sphere interior
- Cyberspace grid-world visualization

━━━ RULES ━━━
- Sci-fi / cyberpunk / space / vaporwave aesthetic
- Pixel-art render-ready
- No IP references

━━━ OUTPUT ━━━
JSON array of ${n} strings. No preamble, no numbering.`,
}).catch((e) => { console.error('Fatal:', e.message); process.exit(1); });
