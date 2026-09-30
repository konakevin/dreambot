#!/usr/bin/env -S deno run -A
/**
 * Head-turn measure for a set of renders (Kevin 2026-09-30: "5.5 keeps posing people looking off ... weird side
 * angle renders"). The production face detector (YuNet, services/face-swap-dual) gives 5 landmarks per face; yaw =
 * how far the nose sits from the midpoint between the eyes, in eye-distances. ~0 = facing the camera; |yaw| > 0.25
 * reads as turned, > 0.4 as a clear side angle. Head turn only (not eyes-only glances).
 *
 *   deno run -A scripts/qa-face-yaw.ts <label>=<dir>[:<filename-substring>] [...]
 */
import { decodeImage } from '../services/face-swap-dual/src/imageCodec.ts';
import { detectFaces } from '../services/face-swap-dual/src/faceDetect.ts';

const MODEL = new URL('../services/face-swap-dual/src/yunet.onnx', import.meta.url);

async function yaws(path: string): Promise<number[]> {
  const img = await decodeImage(await Deno.readFile(path));
  const faces = await detectFaces(img.data, img.width, img.height, {
    modelUrl: MODEL,
    scoreThreshold: 0.6,
  });
  const out: number[] = [];
  for (const f of faces) {
    if (!f.kps || f.kps.length < 6 || f.h < img.height * 0.04) continue;
    const [rx, , lx, , nx] = f.kps;
    const eyeDist = Math.abs(lx - rx);
    if (eyeDist < 2) continue;
    out.push(Math.abs(nx - (rx + lx) / 2) / eyeDist);
  }
  return out;
}

for (const spec of Deno.args) {
  const [label, rest] = spec.split('=');
  const [dir, filter] = rest.split(':');
  const all: number[] = [];
  let images = 0;
  for (const e of Deno.readDirSync(dir)) {
    if (!/\.(jpe?g|png)$/i.test(e.name) || (filter && !e.name.includes(filter))) continue;
    try {
      all.push(...(await yaws(`${dir}/${e.name}`)));
      images++;
    } catch (_e) {
      // unreadable image: skip
    }
  }
  const s = [...all].sort((a, b) => a - b);
  const med = s.length ? s[Math.floor(s.length / 2)] : NaN;
  const share = (t: number) =>
    all.length ? Math.round((100 * all.filter((y) => y > t).length) / all.length) : 0;
  console.log(
    `${label.padEnd(26)} images ${String(images).padStart(3)}  faces ${String(all.length).padStart(3)}  median |yaw| ${med.toFixed(3)}  turned (>0.25) ${share(0.25)}%  side-on (>0.4) ${share(0.4)}%`
  );
}
