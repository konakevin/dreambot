/**
 * NebulaBackdrop — fluid lavender nebula for the dream-generation loading
 * stage. PS-aesthetic: two layers of fractal noise drifting in opposite
 * directions through a lavender palette, with a soft radial vignette.
 *
 * Renders as a Skia Canvas (GPU shader), so the entire animation runs off
 * the JS thread and costs ~negligible CPU even on older devices. The
 * `useClock` hook drives a `time` uniform straight into the shader on the
 * UI thread — no bridge crossings per frame.
 *
 * Drop in behind whatever foreground (mascot, sparkles, text) you want
 * to overlay — it occupies the full bounding box and is intentionally
 * unaware of its parent.
 *
 * Tuning knobs live at the top of the file: palette stops, noise scales,
 * scroll speeds, vignette strength. The shader source itself is at the
 * bottom — 5-octave fBm noise → cloud density → palette interpolation →
 * vignette → output.
 */

import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

// ── Tuning knobs ───────────────────────────────────────────────────────────
// Golden hour through lavender clouds — dusky periwinkle base where the
// clouds are "in shadow", warm dusty mauve in the mid-densities (like the
// underside of a cloud catching low light), and warm peach/gold at the
// brightest peaks (the sun bleeding through). The eye reads this as
// "sunset behind clouds" rather than "noon haze." Sparkles + dark text
// stay readable because the brightest cloud band caps at ~peach, not
// near-white.
const BASE_COLOR = [0.55, 0.48, 0.7]; // dusky lavender shadow (~#8C7AB3)
const MID_COLOR = [0.82, 0.65, 0.75]; // warm dusty mauve (~#D1A6BF)
const HIGHLIGHT_COLOR = [0.98, 0.85, 0.65]; // golden hour peach (~#FAD9A6)

// Smaller numbers = bigger, slower-moving cloud blobs. The two layers
// scrolling at different rates is what gives the parallax depth feel.
const NOISE_SCALE_1 = 2.4;
const NOISE_SCALE_2 = 5.0;
const SCROLL_SPEED_1 = 0.018; // seconds → noise-space units
const SCROLL_SPEED_2 = 0.026;

// How dark the corners go vs the center. 0.0 = no vignette, 0.9 = heavy.
// Slightly bumped from 0.12 → 0.20 — golden hour scenes naturally have
// cooler/darker edges (sky away from the sun) and warmer interiors. A
// touch of edge falloff sells the "sun behind the clouds" read.
const VIGNETTE_STRENGTH = 0.2;

// Warm bias toward the center — pushes additional gold/peach into the
// middle of the frame and pulls a touch of cool toward the edges. This
// mimics directional sunset lighting on top of the cloud field. Set to
// 0 to disable.
const CENTER_WARMTH = 0.08;

// ── Shader source ──────────────────────────────────────────────────────────
const source = Skia.RuntimeEffect.Make(`
uniform float time;
uniform vec2  resolution;

// Hash → smooth value noise → fBm. Standard pattern.
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

half4 main(vec2 fragCoord) {
  vec2 uv = fragCoord / resolution;

  // Two fBm layers at different scales drifting in opposite directions —
  // gives the PS-style "two cloud planes parallaxing" feel.
  float n1 = fbm(uv * ${NOISE_SCALE_1.toFixed(2)} + vec2( time * ${SCROLL_SPEED_1.toFixed(4)},  time * ${(SCROLL_SPEED_1 * 0.5).toFixed(4)}));
  float n2 = fbm(uv * ${NOISE_SCALE_2.toFixed(2)} + vec2(-time * ${SCROLL_SPEED_2.toFixed(4)},  time * ${(SCROLL_SPEED_2 * 0.7).toFixed(4)}));
  float cloud = n1 * 0.6 + n2 * 0.4;

  vec3 base      = vec3(${BASE_COLOR[0]},      ${BASE_COLOR[1]},      ${BASE_COLOR[2]});
  vec3 mid       = vec3(${MID_COLOR[0]},       ${MID_COLOR[1]},       ${MID_COLOR[2]});
  vec3 highlight = vec3(${HIGHLIGHT_COLOR[0]}, ${HIGHLIGHT_COLOR[1]}, ${HIGHLIGHT_COLOR[2]});

  vec3 color = mix(base, mid, smoothstep(0.30, 0.65, cloud));
  color = mix(color, highlight, smoothstep(0.72, 0.95, cloud));

  // Distance from frame center (0.0 dead-center, ~0.7 at corners).
  float dist = length(uv - vec2(0.5));

  // Directional sunset bias — push warmth (gold/peach) into the interior
  // and pull cool (deep lavender) toward the edges. Read as "the sun is
  // behind the clouds in the middle of the sky."
  float warmth = 1.0 - smoothstep(0.0, 0.7, dist);
  color += vec3(0.10, 0.05, -0.04) * warmth * ${CENTER_WARMTH.toFixed(2)} * 10.0;

  // Soft radial vignette on top.
  color *= 1.0 - dist * ${VIGNETTE_STRENGTH.toFixed(2)};

  return half4(color, 1.0);
}
`)!; // `!` because Skia.RuntimeEffect.Make returns null only on a GLSL
// syntax error in the source above; we treat that as a dev-time bug
// rather than a runtime branch — TS narrowing across module scope
// doesn't reach into the Shader component below otherwise.

// ── Component ──────────────────────────────────────────────────────────────
export function NebulaBackdrop() {
  const { width, height } = useWindowDimensions();
  const clock = useClock();

  // Pack the time + resolution uniforms into a single derived value.
  // useDerivedValue runs on the UI thread, so the shader picks up new
  // uniforms every frame without a JS bridge crossing.
  const uniforms = useDerivedValue(() => ({
    time: clock.value / 1000,
    resolution: [width, height],
  }));

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Fill>
        <Shader source={source} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
